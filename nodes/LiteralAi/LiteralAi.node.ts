import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
} from 'n8n-workflow';
import { LiteralClient } from '@literalai/client';
import { ScoreType, DatasetType } from '@literalai/client';
import { DatasetExperimentItem } from '@literalai/client';

import { resourceProperties } from './properties/resources';
import { projectOperations, projectFields } from './properties/project';
import { stepOperations, stepFields } from './properties/step';
import { fileOperations, fileFields } from './properties/file';
import { threadOperations, threadFields } from './properties/thread';
import { userOperations, userFields } from './properties/user';
import { scoreOperations, scoreFields } from './properties/score';
import { datasetOperations, datasetFields } from './properties/dataset';
import { experimentOperations, experimentFields } from './properties/experiment';
import { promptOperations, promptFields } from './properties/prompt';

export class LiteralAi implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Literal AI',
		name: 'literalAi',
		icon: 'file:literalai.svg',
		group: ['transform'],
		version: 1,
		description: 'Use the Literal AI API',
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
			...resourceProperties,
			...projectOperations,
			...projectFields,
			...stepOperations,
			...stepFields,
			...fileOperations,
			...fileFields,
			...threadOperations,
			...threadFields,
			...userOperations,
			...userFields,
			...scoreOperations,
			...scoreFields,
			...datasetOperations,
			...datasetFields,
			...experimentOperations,
			...experimentFields,
			...promptOperations,
			...promptFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const credentials = await this.getCredentials('literalAiCredentialsApi');
		const client = new LiteralClient({ apiKey: credentials.literalAiApiKey as string });

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		let responseData;

		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'user') {
					// 사용자 관련 작업 처리
					if (operation === 'create') {
						const identifier = this.getNodeParameter('identifier', 0) as string;
						const metadata = JSON.parse(this.getNodeParameter('metadata', 0) as string);

						responseData = await client.api.createUser(identifier, metadata);
					} else if (operation === 'get') {
						const userId = this.getNodeParameter('userId', 0) as string;
						responseData = await client.api.getUser(userId);
					} else if (operation === 'getMany') {
						const limit = this.getNodeParameter('limit', 0) as number;
						responseData = await client.api.getUsers({ first: limit });
					} else if (operation === 'update') {
						const userId = this.getNodeParameter('userId', 0) as string;
						const metadata = JSON.parse(this.getNodeParameter('metadata', 0) as string);
						responseData = await client.api.updateUser(userId, undefined, metadata);
					} else if (operation === 'delete') {
						const userId = this.getNodeParameter('userId', 0) as string;
						responseData = await client.api.deleteUser(userId);
					} else if (operation === 'getOrCreate') {
						const identifier = this.getNodeParameter('identifier', 0) as string;
						const metadata = JSON.parse(this.getNodeParameter('metadata', 0) as string);
						responseData = await client.api.getOrCreateUser(identifier, metadata);
					}
				} else if (resource === 'score') {
					if (operation === 'create') {
						const scoreData = {
							name: this.getNodeParameter('name', 0) as string,
							type: this.getNodeParameter('type', 0) as ScoreType,
							value: this.getNodeParameter('value', 0) as number,
							stepId: this.getNodeParameter('stepId', 0) as string,
							comment: this.getNodeParameter('comment', 0) as string,
						};
						responseData = await client.api.createScore(scoreData);
					} else if (operation === 'createMany') {
						const scores = JSON.parse(this.getNodeParameter('scores', 0) as string);
						responseData = await client.api.createScores(scores);
					} else if (operation === 'delete') {
						const scoreId = this.getNodeParameter('scoreId', 0) as string;
						responseData = await client.api.deleteScore(scoreId);
					} else if (operation === 'getMany') {
						const limit = this.getNodeParameter('limit', 0) as number;
						responseData = await client.api.getScores({ first: limit });
					} else if (operation === 'update') {
						const scoreId = this.getNodeParameter('scoreId', 0) as string;
						const updateData = {
							value: this.getNodeParameter('value', 0) as number,
							comment: this.getNodeParameter('comment', 0) as string,
						};
						responseData = await client.api.updateScore(scoreId, updateData);
					}
				} else if (resource === 'project') {
					if (operation === 'getId') {
						responseData = await client.api.getProjectId();
					}
				} else if (resource === 'step') {
					if (operation === 'createGeneration') {
						const generation = JSON.parse(this.getNodeParameter('generation', 0) as string);
						responseData = await client.api.createGeneration(generation);
					} else if (operation === 'delete') {
						const stepId = this.getNodeParameter('stepId', 0) as string;
						responseData = await client.api.deleteStep(stepId);
					} else if (operation === 'get') {
						const stepId = this.getNodeParameter('stepId', 0) as string;
						responseData = await client.api.getStep(stepId);
					} else if (operation === 'getMany') {
						const limit = this.getNodeParameter('limit', 0) as number;
						const filters = JSON.parse(this.getNodeParameter('filters', 0) as unknown as string);
						responseData = await client.api.getSteps({ first: limit, filters });
					} else if (operation === 'getGenerations') {
						const limit = this.getNodeParameter('limit', 0) as number;
						const filters = JSON.parse(this.getNodeParameter('filters', 0) as unknown as string);
						responseData = await client.api.getGenerations({ first: limit, filters });
					} else if (operation === 'send') {
						const steps = JSON.parse(this.getNodeParameter('steps', 0) as string);
						responseData = await client.api.sendSteps(steps);
					}
				} else if (resource === 'file') {
					if (operation === 'upload') {
						const binaryPropertyName = this.getNodeParameter('binaryPropertyName', 0) as string;
						const threadId = this.getNodeParameter('threadId', 0) as string;
						const additionalFields = this.getNodeParameter('additionalFields', 0) as {
							id?: string;
							mime?: string;
							name?: string;
							metadata?: string;
						};

						const buffer = await this.helpers.getBinaryDataBuffer(0, binaryPropertyName);

						const uploadParams = {
							content: buffer,
							threadId,
							...additionalFields,
							metadata: additionalFields.metadata
								? JSON.parse(additionalFields.metadata)
								: undefined,
						};

						responseData = await client.api.uploadFile(uploadParams);
					} else if (operation === 'createAttachment') {
						const binaryPropertyName = this.getNodeParameter('binaryPropertyName', 0) as string;
						const threadId = this.getNodeParameter('threadId', 0) as string;
						const additionalFields = this.getNodeParameter('additionalFields', 0) as {
							id?: string;
							mime?: string;
							name?: string;
							metadata?: string;
						};

						const buffer = await this.helpers.getBinaryDataBuffer(0, binaryPropertyName);

						const attachmentParams = {
							content: buffer,
							threadId,
							...additionalFields,
							metadata: additionalFields.metadata
								? JSON.parse(additionalFields.metadata)
								: undefined,
						};

						responseData = await client.api.createAttachment(attachmentParams);
					}
				} else if (resource === 'thread') {
					if (operation === 'delete') {
						const threadId = this.getNodeParameter('threadId', 0) as string;
						responseData = await client.api.deleteThread(threadId);
					} else if (operation === 'get') {
						const threadId = this.getNodeParameter('threadId', 0) as string;
						responseData = await client.api.getThread(threadId);
					} else if (operation === 'getMany') {
						const limit = this.getNodeParameter('limit', 0) as number;
						responseData = await client.api.getThreads({ first: limit });
					} else if (operation === 'upsert') {
						const threadId = this.getNodeParameter('threadId', 0) as string;
						const additionalFields = this.getNodeParameter('additionalFields', 0) as {
							name?: string;
							metadata?: string;
							participantId?: string;
							tags?: string;
						};

						const upsertParams = {
							id: threadId,
							name: additionalFields.name,
							metadata: additionalFields.metadata
								? JSON.parse(additionalFields.metadata)
								: undefined,
							participantId: additionalFields.participantId,
							tags: additionalFields.tags ? additionalFields.tags.split(',') : undefined,
						};

						responseData = await client.api.upsertThread(threadId, JSON.stringify(upsertParams));
					}
				} else if (resource === 'dataset') {
					if (operation === 'addGeneration') {
						const datasetId = this.getNodeParameter('datasetId', 0) as string;
						const generationId = this.getNodeParameter('generationId', 0) as string;
						responseData = await client.api.addGenerationToDataset(datasetId, generationId);
					} else if (operation === 'addGenerations') {
						const datasetId = this.getNodeParameter('datasetId', 0) as string;
						const generationIds = (this.getNodeParameter('generationIds', 0) as string).split(',');
						responseData = await client.api.addGenerationsToDataset(datasetId, generationIds);
					} else if (operation === 'addStep') {
						const datasetId = this.getNodeParameter('datasetId', 0) as string;
						const stepId = this.getNodeParameter('stepId', 0) as string;
						responseData = await client.api.addStepToDataset(datasetId, stepId);
					} else if (operation === 'create') {
						const name = this.getNodeParameter('name', 0) as string;
						const additionalFields = this.getNodeParameter('additionalFields', 0) as {
							description?: string;
							metadata?: string;
							type?: string;
						};

						const createParams = {
							name,
							description: additionalFields.description,
							metadata: additionalFields.metadata
								? JSON.parse(additionalFields.metadata)
								: undefined,
							type: additionalFields.type as DatasetType,
						};

						responseData = await client.api.createDataset(createParams);
					} else if (operation === 'createItem') {
						const datasetId = this.getNodeParameter('datasetId', 0) as string;
						const input = JSON.parse(this.getNodeParameter('input', 0) as string);
						responseData = await client.api.createDatasetItem(datasetId, { input });
					} else if (operation === 'delete') {
						const datasetId = this.getNodeParameter('datasetId', 0) as string;
						responseData = await client.api.deleteDataset(datasetId);
					} else if (operation === 'deleteItem') {
						const datasetItemId = this.getNodeParameter('datasetItemId', 0) as string;
						responseData = await client.api.deleteDatasetItem(datasetItemId);
					} else if (operation === 'get') {
						const datasetId = this.getNodeParameter('datasetId', 0) as string;
						responseData = await client.api.getDataset({ id: datasetId });
					} else if (operation === 'getItem') {
						const datasetItemId = this.getNodeParameter('datasetItemId', 0) as string;
						responseData = await client.api.getDatasetItem(datasetItemId);
					} else if (operation === 'getMany') {
						responseData = await client.api.getDatasets();
					} else if (operation === 'update') {
						const datasetId = this.getNodeParameter('datasetId', 0) as string;
						const additionalFields = this.getNodeParameter('additionalFields', 0) as {
							name?: string;
							description?: string;
							metadata?: string;
						};

						const updateParams = {
							name: additionalFields.name,
							description: additionalFields.description,
							metadata: additionalFields.metadata
								? JSON.parse(additionalFields.metadata)
								: undefined,
						};

						responseData = await client.api.updateDataset(datasetId, updateParams);
					}
				} else if (resource === 'experiment') {
					if (operation === 'create') {
						const name = this.getNodeParameter('name', 0) as string;
						const additionalFields = this.getNodeParameter('additionalFields', 0) as {
							datasetId?: string;
							promptVariantId?: string;
							params?: string;
						};

						const createParams = {
							name,
							datasetId: additionalFields.datasetId,
							promptVariantId: additionalFields.promptVariantId,
							params: additionalFields.params ? JSON.parse(additionalFields.params) : undefined,
						};

						responseData = await client.api.createExperiment(createParams);
					} else if (operation === 'createItem') {
						const experimentItemFields = this.getNodeParameter('experimentItemFields', 0) as {
							datasetExperimentId?: string;
							datasetItemId?: string;
							experimentRunId?: string;
							input?: string;
							output?: string;
							scores?: string;
						};

						const createParams = {
							datasetExperimentId: experimentItemFields.datasetExperimentId!,
							datasetItemId: experimentItemFields.datasetItemId,
							experimentRunId: experimentItemFields.experimentRunId,
							input: experimentItemFields.input
								? JSON.parse(experimentItemFields.input)
								: undefined,
							output: experimentItemFields.output
								? JSON.parse(experimentItemFields.output)
								: undefined,
							scores: experimentItemFields.scores ? JSON.parse(experimentItemFields.scores) : [],
						} as DatasetExperimentItem;

						responseData = await client.api.createExperimentItem(createParams);
					}
				} else if (resource === 'prompt') {
					if (operation === 'create') {
						const name = this.getNodeParameter('name', 0) as string;
						const templateMessages = JSON.parse(
							this.getNodeParameter('templateMessages', 0) as string,
						);
						const additionalFields = this.getNodeParameter('additionalFields', 0) as {
							settings?: string;
							tools?: string;
						};

						const createParams = {
							settings: additionalFields.settings
								? JSON.parse(additionalFields.settings)
								: undefined,
							tools: additionalFields.tools ? JSON.parse(additionalFields.tools) : undefined,
						};

						responseData = await client.api.getOrCreatePrompt(
							name,
							templateMessages,
							createParams.settings,
							createParams.tools,
						);
					} else if (operation === 'createLineage') {
						const name = this.getNodeParameter('name', 0) as string;
						const additionalFields = this.getNodeParameter('additionalFields', 0) as {
							description?: string;
						};

						responseData = await client.api.createPromptLineage(name, additionalFields.description);
					} else if (operation === 'get') {
						const name = this.getNodeParameter('name', 0) as string;
						const version = this.getNodeParameter('version', 0) as number | undefined;
						responseData = await client.api.getPrompt(name, version);
					} else if (operation === 'getById') {
						const promptId = this.getNodeParameter('promptId', 0) as string;
						responseData = await client.api.getPromptById(promptId);
					} else if (operation === 'getOrCreate') {
						const name = this.getNodeParameter('name', 0) as string;
						const templateMessages = JSON.parse(
							this.getNodeParameter('templateMessages', 0) as string,
						);
						const additionalFields = this.getNodeParameter('additionalFields', 0) as {
							settings?: string;
							tools?: string;
						};

						const createParams = {
							settings: additionalFields.settings
								? JSON.parse(additionalFields.settings)
								: undefined,
							tools: additionalFields.tools ? JSON.parse(additionalFields.tools) : undefined,
						};

						responseData = await client.api.getOrCreatePrompt(
							name,
							templateMessages,
							createParams.settings,
							createParams.tools,
						);
					} else if (operation === 'getAbTesting') {
						const name = this.getNodeParameter('name', 0) as string;
						responseData = await client.api.getPromptAbTesting(name);
					} else if (operation === 'updateAbTesting') {
						const name = this.getNodeParameter('name', 0) as string;
						const rollouts = JSON.parse(this.getNodeParameter('rollouts', 0) as string);
						responseData = await client.api.updatePromptAbTesting(name, rollouts);
					}
				}

				this.logger.info(JSON.stringify(responseData));
				returnData.push({
					json: {
						content: responseData,
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
