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
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new prompt',
				action: 'Create a prompt',
			},
			{
				name: 'Create Lineage',
				value: 'createLineage',
				description: 'Create a new prompt lineage',
				action: 'Create a prompt lineage',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a prompt',
				action: 'Get a prompt',
			},
			{
				name: 'Get A/B Testing',
				value: 'getAbTesting',
				description: 'Get prompt A/B testing rollout',
				action: 'Get prompt A/B testing',
			},
			{
				name: 'Get By ID',
				value: 'getById',
				description: 'Get a prompt by ID',
				action: 'Get a prompt by ID',
			},
			{
				name: 'Get or Create',
				value: 'getOrCreate',
				description: 'Get existing prompt or create new one',
				action: 'Get or create a prompt',
			},
			{
				name: 'Update A/B Testing',
				value: 'updateAbTesting',
				description: 'Update prompt A/B testing rollout',
				action: 'Update prompt A/B testing',
			},
		],
		default: 'get',
	},
];

export const promptFields: INodeProperties[] = [
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['prompt'],
				operation: [
					'create',
					'createLineage',
					'get',
					'getOrCreate',
					'getAbTesting',
					'updateAbTesting',
				],
			},
		},
		description: 'Name of the prompt',
	},
	{
		displayName: 'Prompt ID',
		name: 'promptId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['prompt'],
				operation: ['getById'],
			},
		},
		description: 'ID of the prompt',
	},
	{
		displayName: 'Template Messages',
		name: 'templateMessages',
		type: 'json',
		default: '[]',
		displayOptions: {
			show: {
				resource: ['prompt'],
				operation: ['create', 'getOrCreate'],
			},
		},
		description: 'Template messages for the prompt',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['prompt'],
				operation: ['create', 'createLineage', 'getOrCreate'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description of the prompt',
			},
			{
				displayName: 'Settings',
				name: 'settings',
				type: 'json',
				default: '{}',
				description: 'Settings for the prompt',
			},
			{
				displayName: 'Tools',
				name: 'tools',
				type: 'json',
				default: '{}',
				description: 'Tools for the prompt',
			},
		],
	},
	{
		displayName: 'Version',
		name: 'version',
		type: 'number',
		default: 1,
		displayOptions: {
			show: {
				resource: ['prompt'],
				operation: ['get'],
			},
		},
		description: 'Version of the prompt',
	},
	{
		displayName: 'Rollouts',
		name: 'rollouts',
		type: 'json',
		default: '[]',
		displayOptions: {
			show: {
				resource: ['prompt'],
				operation: ['updateAbTesting'],
			},
		},
		description: 'Array of prompt rollout versions',
	},
];
