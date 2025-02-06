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
		description: 'Use Literal AI API',
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
				description: 'Enter the prompt name',
				required: true,
			},
			{
				displayName: 'Variables',
				name: 'variables',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				options: [
					{
						name: 'variables',
						displayName: 'Variable',
						values: [
							{
								displayName: 'Variable Name',
								name: 'key',
								type: 'string',
								default: '',
								required: true,
								description: 'Enter the variable name',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								required: true,
								description: 'Enter the variable value',
							},
						],
					},
				],
				description: 'Enter variables to be used in the prompt',
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

		console.log(credentials);

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
					const variablesInput = this.getNodeParameter('variables', i) as {
						variables: Array<{ key: string; value: string }>;
					};

					// Convert variables to object
					const variablesParameter = variablesInput.variables.reduce(
						(acc, { key, value }) => ({ ...acc, [key]: value }),
						{},
					);

					const promptName = this.getNodeParameter('prompt', i) as string;

					//! Validation Phase
					const prompt = (await client.api.getPrompt(promptName)) as Prompt | undefined;
					if (!prompt) {
						throw new NodeOperationError(this.getNode(), 'Prompt not found');
					}

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

					console.log(prompt.settings);

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
						// Add other necessary settings in the same way
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
