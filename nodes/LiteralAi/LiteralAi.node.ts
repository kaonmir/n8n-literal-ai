import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
  NodeOperationError,
} from 'n8n-workflow';
import { LiteralClient, Prompt } from "@literalai/client";
import { promptOperations, promptFields } from './PromptDescription';

export class LiteralAi implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Literal AI',
		name: 'literalAi',
		// icon: 'file:literalai.svg',
		group: ['transform'],
		version: 1,
		description: 'Literal AI API를 사용합니다',
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
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
						name: 'Prompt',
						value: 'prompt',
					},
				],
				default: 'prompt',
			},
			...promptOperations,
			...promptFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const credentials = await this.getCredentials('literalAiCredentialsApi');
		if (!credentials?.apiKey) {
			throw new NodeOperationError(this.getNode(), 'No valid API key provided');
		}
    
		const client = new LiteralClient({
			apiKey: credentials.apiKey as string,
			apiUrl: credentials.apiUrl as string,
		});

    const prompt = await client.api.getPrompt('extract_article_wisdom') as Prompt | null
    if (prompt) {
      this.logger.info("--------------------------------")
      this.logger.info(JSON.stringify(prompt.templateMessages))
      this.logger.info(credentials.apiKey.toString())
      this.logger.info("--------------------------------")
    } else {
      this.logger.info("--------------------------------")
      this.logger.info("No prompt found")
      this.logger.info("--------------------------------")
    }

		for (let i = 0; i < items.length; i++) {
			try {

				// const operation = this.getNodeParameter('operation', i) as string;
				// const model = this.getNodeParameter('model', i) as string;
				// const systemPrompt = this.getNodeParameter('system_prompt', i, '') as string;
				// const message = this.getNodeParameter('message', i) as string;
				// const temperature = this.getNodeParameter('temperature', i) as number;
				// const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

				// ... 여기에 새로운 로직을 구현할 예정입니다 ...
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