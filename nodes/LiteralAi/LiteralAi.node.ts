import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

export class LiteralAi implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Literal AI',
		name: 'literalAi',
		// icon: 'file:literalai.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Literal AI API를 사용합니다',
		defaults: {
			name: 'Literal AI',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'literalAiCredentialsApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Chat',
						value: 'chat',
					},
					{
						name: 'Document',
						value: 'document',
					},
				],
				default: 'chat',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['chat'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: '새로운 채팅 세션을 생성합니다',
						action: 'Create a new chat session',
					},
					{
						name: 'Send Message',
						value: 'sendMessage',
						description: '메시지를 전송합니다',
						action: 'Send a message',
					},
				],
				default: 'create',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['document'],
					},
				},
				options: [
					{
						name: 'Upload',
						value: 'upload',
						description: '문서를 업로드합니다',
						action: 'Upload a document',
					},
					{
						name: 'List',
						value: 'list',
						description: '문서 목록을 조회합니다',
						action: 'List documents',
					},
				],
				default: 'upload',
			},
			{
				displayName: 'Message',
				name: 'message',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['sendMessage'],
						resource: ['chat'],
					},
				},
				default: '',
				description: '전송할 메시지',
			},
			{
				displayName: 'Binary Property',
				name: 'binaryPropertyName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['upload'],
						resource: ['document'],
					},
				},
				default: 'data',
				description: '업로드할 파일이 포함된 바이너리 속성',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;
		const credentials = await this.getCredentials('literalAiCredentialsApi');

    const baseUrl = credentials.baseUrl as string;  
    const apiKey = credentials.apiKey as string;
		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'chat') {
					if (operation === 'create') {
						this.logger.info('채팅 세션 생성 요청:', {
							method: 'POST',
							url: '/chat/sessions',
							baseURL: baseUrl
						});

						returnData.push({
							json: { success: true }
						});
					}

					if (operation === 'sendMessage') {
						const message = this.getNodeParameter('message', i) as string;
						
						this.logger.info('메시지 전송 요청:', {
							method: 'POST', 
							url: '/chat/messages',
							baseURL: baseUrl,
							message
						});

						returnData.push({
							json: { success: true }
						});
					}
				}

				if (resource === 'document') {
					if (operation === 'upload') {
						const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
						const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);

						this.logger.info('문서 업로드 요청:', {
							method: 'POST',
							url: '/documents',
							fileName: binaryData.fileName
						});

						returnData.push({
							json: { success: true }
						});
					}

					if (operation === 'list') {
						this.logger.info('문서 목록 조회 요청:', {
							method: 'GET',
							url: '/documents'
						});

						returnData.push({
							json: { success: true }
						});
					}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: error.message } });
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}