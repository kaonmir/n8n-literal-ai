import {
	IExecuteFunctions,
	ILoadOptionsFunctions,
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
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		defaults: {
			name: 'Literal AI',
		},
		// eslint-disable-next-line n8n-nodes-base/node-class-description-inputs-wrong-regular-node
		inputs: [NodeConnectionType.Main],
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
			{
				displayName: 'Variables',
				name: 'variables',
				type: 'json',
				default: '{}',
				required: true,
			},
		],
	};

	methods = {
		loadOptions: {
			async getVariables(this: ILoadOptionsFunctions) {
				const credentials = await this.getCredentials('literalAiCredentialsApi');
				if (!credentials?.literalAiApiKey) {
					throw new NodeOperationError(this.getNode(), 'No valid API key provided');
				}

				const client = new LiteralClient({
					apiUrl: credentials.literalAiBaseUrl as string,
					apiKey: credentials.literalAiApiKey as string,
				});

				const prompts = await client.api.getPrompt(this.getNodeParameter('prompt') as string);

				this.logger.info(JSON.stringify(prompts.variables));
				return prompts.variables;
			},
		},
	};

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
				const variablesParameter = JSON.parse(
					this.getNodeParameter('variables', i, '{}') as string,
				);

				const result = await client.thread({ name: this.getWorkflow().name }).wrap(async () => {
					// const thread = client.getCurrentStep();

					const promptName = this.getNodeParameter('prompt', i) as string;
					const prompt = (await client.api.getPrompt(promptName)) as Prompt | undefined;
					if (!prompt) {
						throw new NodeOperationError(this.getNode(), 'Prompt not found');
					}

					this.logger.info(
						JSON.stringify({
							id: prompt.id,
							name: prompt.name,
							provider: prompt.provider,
							settings: prompt.settings,
							variables: prompt.variables,
							variablesDefaultValues: prompt.variablesDefaultValues,
							type: prompt.type,
						}),
					);

					// prompt.variables = "variables":[{"name":"input","language":"plaintext"}]
					for (const variable of prompt.variables) {
						if (!(variable.name in variablesParameter)) {
							throw new NodeOperationError(
								this.getNode(),
								`Required variable "${variable.name}" is missing. Required variables: ${prompt.variables.map((v) => v.name).join(', ')}`,
							);
						}
					}

					if (!prompt.settings.model) {
						throw new NodeOperationError(this.getNode(), 'Model is not specified in prompt');
					}

					const messages = prompt.formatMessages(variablesParameter);
					const completion = await openai.chat.completions.create({
						messages: messages,
						...prompt.settings,
					});

					return completion.choices[0].message;
				});

				returnData.push({
					json: {
						content: result.content,
					},
				});
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
