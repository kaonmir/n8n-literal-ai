import {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeOperationError,
} from 'n8n-workflow';
import {
	AIMessagePromptTemplate,
	SystemMessagePromptTemplate,
	HumanMessagePromptTemplate,
} from '@langchain/core/prompts';
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
			{
				displayName: 'Chat Messages (if Using a Chat Model)',
				name: 'messages',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				placeholder: 'Add prompt',
				options: [
					{
						name: 'messageValues',
						displayName: 'Prompt',
						values: [
							{
								displayName: 'Type Name or ID',
								name: 'type',
								type: 'options',
								options: [
									{
										name: 'AI',
										value: AIMessagePromptTemplate.lc_name(),
									},
									{
										name: 'System',
										value: SystemMessagePromptTemplate.lc_name(),
									},
									{
										name: 'User',
										value: HumanMessagePromptTemplate.lc_name(),
									},
								],
								// eslint-disable-next-line n8n-nodes-base/node-param-default-wrong-for-options
								default: SystemMessagePromptTemplate.lc_name(),
							},
							{
								displayName: 'Message Type',
								name: 'messageType',
								type: 'options',
								displayOptions: {
									show: {
										type: [HumanMessagePromptTemplate.lc_name()],
									},
								},
								options: [
									{
										name: 'Text',
										value: 'text',
										description: 'Simple text message',
									},
									{
										name: 'Image (Binary)',
										value: 'imageBinary',
										description: 'Process the binary input from the previous node',
									},
									{
										name: 'Image (URL)',
										value: 'imageUrl',
										description: 'Process the image from the specified URL',
									},
								],
								default: 'text',
							},
							{
								displayName: 'Image Data Field Name',
								name: 'binaryImageDataKey',
								type: 'string',
								default: 'data',
								required: true,
								description:
									"The name of the field in the chain's input that contains the binary image file to be processed",
								displayOptions: {
									show: {
										messageType: ['imageBinary'],
									},
								},
							},
							{
								displayName: 'Image URL',
								name: 'imageUrl',
								type: 'string',
								default: '',
								required: true,
								description: 'URL to the image to be processed',
								displayOptions: {
									show: {
										messageType: ['imageUrl'],
									},
								},
							},
							{
								displayName: 'Image Details',
								description:
									'Control how the model processes the image and generates its textual understanding',
								name: 'imageDetail',
								type: 'options',
								displayOptions: {
									show: {
										type: [HumanMessagePromptTemplate.lc_name()],
										messageType: ['imageBinary', 'imageUrl'],
									},
								},
								options: [
									{
										name: 'Auto',
										value: 'auto',
										description:
											'Model will use the auto setting which will look at the image input size and decide if it should use the low or high setting',
									},
									{
										name: 'Low',
										value: 'low',
										description:
											'The model will receive a low-res 512px x 512px version of the image, and represent the image with a budget of 65 tokens. This allows the API to return faster responses and consume fewer input tokens for use cases that do not require high detail.',
									},
									{
										name: 'High',
										value: 'high',
										description:
											'Allows the model to see the low res image and then creates detailed crops of input images as 512px squares based on the input image size. Each of the detailed crops uses twice the token budget (65 tokens) for a total of 129 tokens.',
									},
								],
								default: 'auto',
							},

							{
								displayName: 'Message',
								name: 'message',
								type: 'string',
								required: true,
								displayOptions: {
									hide: {
										messageType: ['imageBinary', 'imageUrl'],
									},
								},
								default: '',
							},
						],
					},
				],
			},

			// TODO
			{
				displayName: 'Require Specific Output Format',
				name: 'hasOutputParser',
				type: 'boolean',
				default: false,
				noDataExpression: true,
			},
			{
				displayName: `Connect an <a data-action='openSelectiveNodeCreator' data-action-parameter-connectiontype='${NodeConnectionType.AiOutputParser}'>output parser</a> on the canvas to specify the output format you require`,
				name: 'notice',
				type: 'notice',
				default: '',
				displayOptions: {
					show: {
						hasOutputParser: [true],
					},
				},
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
				const result = await client.thread({ name: this.getWorkflow().name }).wrap(async () => {
					const variablesParameter = JSON.parse(this.getNodeParameter('variables', i) as string);
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
								`Required variable "${variable.name}" is missing. Required variables: ${prompt.variables.map((v) => v.name).join(', ')}`,
							);
						}
					}

					if (!prompt.settings.model) {
						throw new NodeOperationError(this.getNode(), 'Model is not specified in prompt');
					}

					//! Run Phase
					// Get chat messages if they exist
					const chatMessages = this.getNodeParameter('messages.messageValues', i, []) as Array<{
						type: string;
						message: string;
						messageType: 'text' | 'imageBinary' | 'imageUrl';
						binaryImageDataKey?: string;
						imageUrl?: string;
						imageDetail?: 'auto' | 'low' | 'high';
					}>;

					// Format messages for OpenAI chat completion
					const formattedChatMessages = chatMessages.map((msg) => {
						let role: 'system' | 'assistant' | 'user';
						switch (msg.type) {
							case SystemMessagePromptTemplate.lc_name():
								role = 'system';
								break;
							case AIMessagePromptTemplate.lc_name():
								role = 'assistant';
								break;
							case HumanMessagePromptTemplate.lc_name():
								role = 'user';
								break;
							default:
								throw new NodeOperationError(this.getNode(), `Invalid message type: ${msg.type}`);
						}

						// Handle different message types
						if (msg.messageType === 'text' || role !== 'user') {
							return {
								role,
								content: msg.message,
							};
						} else {
							// Handle image messages (only for user role)
							const content: Array<
								| {
										type: 'text';
										text: string;
								  }
								| {
										type: 'image_url';
										image_url: {
											url: string;
											detail?: 'low' | 'high';
										};
								  }
							> = [];

							if (msg.message) {
								content.push({ type: 'text', text: msg.message });
							}

							if (msg.messageType === 'imageUrl' && msg.imageUrl) {
								content.push({
									type: 'image_url',
									image_url: {
										url: msg.imageUrl,
										detail: msg.imageDetail === 'auto' ? undefined : msg.imageDetail,
									},
								});
							} else if (msg.messageType === 'imageBinary' && msg.binaryImageDataKey) {
								const binaryData = items[i].binary?.[msg.binaryImageDataKey];
								if (!binaryData) {
									throw new NodeOperationError(this.getNode(), 'No binary data found');
								}
								const dataUrl = `data:${binaryData.mimeType};base64,${binaryData.data}`;
								content.push({
									type: 'image_url',
									image_url: {
										url: dataUrl,
										detail: msg.imageDetail === 'auto' ? undefined : msg.imageDetail,
									},
								});
							}

							return {
								role,
								content,
							};
						}
					});

					// Combine prompt messages with chat messages
					const promptMessages = prompt.formatMessages(variablesParameter);
					const completion = await openai.chat.completions.create({
						messages: [...promptMessages, ...formattedChatMessages],
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
