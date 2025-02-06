import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeOperationError,
} from 'n8n-workflow';
import { LiteralClient, Prompt } from '@literalai/client';
import OpenAI from 'openai';

export class LiteralAiChat implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Literal AI Chat',
		name: 'literalAiChat',
		icon: 'file:literalai.svg',
		group: ['transform'],
		version: 1,
		description: 'Literal AI API를 사용합니다',
		subtitle: '={{$parameter["prompt"]}}',
		defaults: {
			name: 'Literal AI Chat',
		},
		// eslint-disable-next-line n8n-nodes-base/node-class-description-inputs-wrong-regular-node
		inputs: [
			{ displayName: '', type: NodeConnectionType.Main },
			{
				displayName: 'Tool',
				type: NodeConnectionType.AiTool,
			},
		],
		// eslint-disable-next-line n8n-nodes-base/node-class-description-outputs-wrong
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'literalAiCredentialsApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Prompt',
				name: 'prompt',
				type: 'string',
				default: '',
				description: '프롬프트 이름을 입력하세요',
				required: true,
			},

			// TODO Json 형식 말고 Key value 형식으로 변경
			{
				displayName: 'Variables',
				name: 'variables',
				type: 'json',
				default: '{}',
				required: true,
			},
			{
				displayName:
					'Notice: Tools defined in Literal AI will be ignored. Please connect tools directly.',
				name: 'notice',
				type: 'notice',
				default: '',
			},
		],
	};

	methods = {};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const credentials = await this.getCredentials('literalAiCredentialsApi');
		if (!credentials?.literalAiApiKey) {
			throw new NodeOperationError(this.getNode(), 'No valid API key provided');
		}

		const client = new LiteralClient({
			apiKey: credentials.literalAiApiKey as string,
			apiUrl: credentials.literalAiBaseUrl as string,
		});

		const openai = new OpenAI({
			baseURL: credentials.openaiBaseUrl as string,
			apiKey: credentials.openaiApiKey as string,
		});
		client.instrumentation.openai();

		for (let i = 0; i < items.length; i++) {
			try {
				const result = await client.thread({ name: this.getWorkflow().name }).wrap(async () => {
					const variablesParameter = JSON.parse(this.getNodeParameter('variables', i) as string);
					const promptName = this.getNodeParameter('prompt', i) as string;

					//! Validation Phase
					const prompt = (await client.api.getPrompt(promptName)) as Prompt | undefined;
					if (!prompt) {
						throw new NodeOperationError(this.getNode(), 'Prompt not found');
					}

					// ?
					// console.log({
					// 	id: prompt.id,
					// 	type: prompt.type,
					// 	createdAt: prompt.createdAt,
					// 	name: prompt.name,
					// 	version: prompt.version,
					// 	url: prompt.url,
					// 	versionDesc: prompt.versionDesc,
					// 	metadata: prompt.metadata,
					// 	items: prompt.items,
					// 	variablesDefaultValues: prompt.variablesDefaultValues,
					// 	templateMessages: prompt.templateMessages,
					// 	tools: prompt.tools,
					// 	provider: prompt.provider,
					// 	settings: {
					// 		...prompt.settings,
					// 		response_format: prompt.settings?.response_format ? {
					// 			type: prompt.settings.response_format.type,
					// 			json_schema: prompt.settings.response_format.json_schema ?
					// 				JSON.stringify(prompt.settings.response_format.json_schema) : undefined,
					// 		} : undefined,
					// 	},
					// 	variables: prompt.variables,
					// });

					for (const variable of prompt.variables) {
						if (!(variable.name in variablesParameter)) {
							throw new NodeOperationError(
								this.getNode(),
								`Required variables are missing: ${prompt.variables.map((v) => v.name).join(', ')}`,
							);
						}
					}

					if (!prompt.settings?.model) {
						throw new NodeOperationError(this.getNode(), 'Model is not specified in prompt');
					}

					//! Run Phase
					const promptMessages = prompt.formatMessages(variablesParameter);
					const completion = await openai.chat.completions.create({
						messages: [...promptMessages],
						model: prompt.settings.model,
						...(prompt.settings?.temperature !== undefined && {
							temperature: prompt.settings.temperature,
						}),
						...(prompt.settings?.max_tokens !== undefined && {
							max_tokens: prompt.settings.max_tokens,
						}),
						// 필요한 다른 설정들도 같은 방식으로 추가
					});

					return completion.choices[0].message;
				});

				returnData.push({
					json: {
						content: result.content,
					},
				});
			} catch (error: any) {
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
