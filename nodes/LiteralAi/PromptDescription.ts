import { INodeProperties } from 'n8n-workflow';

export const promptOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['prompt'],
			},
		},
		options: [
			// {
			// 	name: 'Create Prompt Lineage',
			// 	value: 'createPromptLineage',
			// 	description: '프롬프트 계보를 생성합니다',
			// },
			{

				// name: 'Create',
				// value: 'create',
				// action: 'Create an Image',
				// description: 'Create an image for a given text',

				name: 'Create',
				value: 'create',
				action: 'Create a new prompt',
				description: 'Create a new prompt',
			},
			// {
			// 	name: 'Get Or Create Prompt',
			// 	value: 'getOrCreatePrompt',
			// 	description: '프롬프트를 가져오거나 생성합니다',
			// },
			// {
			// 	name: 'Get Prompt By ID',
			// 	value: 'getPromptById',
			// 	description: 'ID로 프롬프트를 조회합니다',
			// },
			// {
			// 	name: 'Get Prompt',
			// 	value: 'getPrompt',
			// 	description: '프롬프트를 조회합니다',
			// },
			// {
			// 	name: 'Get Prompt AB Testing',
			// 	value: 'getPromptAbTesting',
			// 	description: '프롬프트 AB 테스트 정보를 조회합니다',
			// },
			// {
			// 	name: 'Update Prompt AB Testing',
			// 	value: 'updatePromptAbTesting',
			// 	description: '프롬프트 AB 테스트 정보를 업데이트합니다',
			// },
		],
		default: 'create',
	},
];

export const promptFields: INodeProperties[] = [
	{
		displayName: 'Prompt Text',
		name: 'promptText',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['prompt'],
				operation: ['createPrompt', 'getOrCreatePrompt'],
			},
		},
		default: '',
		description: '프롬프트 텍스트',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['prompt'],
				operation: ['createPrompt', 'getOrCreatePrompt'],
			},
		},
		default: '',
		description: '프롬프트 이름',
	},
	{
		displayName: 'Prompt ID',
		name: 'promptId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['prompt'],
				operation: ['getPromptById'],
			},
		},
		default: '',
		description: '프롬프트 ID',
	},
	{
		displayName: 'AB Testing Configuration',
		name: 'abTestingConfig',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: false,
		},
		displayOptions: {
			show: {
				resource: ['prompt'],
				operation: ['updatePromptAbTesting'],
			},
		},
		default: {},
		options: [
			{
				name: 'config',
				displayName: 'Configuration',
				values: [
					{
						displayName: 'Enabled',
						name: 'enabled',
						type: 'boolean',
						default: true,
						description: 'Whether to enable AB testing',
					},
					{
						displayName: 'Distribution',
						name: 'distribution',
						type: 'number',
						typeOptions: {
							minValue: 0,
							maxValue: 100,
						},
						default: 50,
						description: 'AB testing distribution (0-100)',
					},
				],
			},
		],
	},
];
