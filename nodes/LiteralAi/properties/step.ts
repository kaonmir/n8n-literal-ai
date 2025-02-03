import { INodeProperties } from 'n8n-workflow';

export const stepOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['step'],
			},
		},
		options: [
			{
				name: 'Create Generation',
				value: 'createGeneration',
				description: 'Create a new generation',
				action: 'Create a generation',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a step',
				action: 'Delete a step',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get list of steps',
				action: 'Get list of steps',
			},
			{
				name: 'Get Many Generations',
				value: 'getGenerations',
				description: 'Get list of generations',
				action: 'Get list of generations',
			},
			{
				name: 'Get One',
				value: 'get',
				description: 'Get a step',
				action: 'Get a step',
			},
			{
				name: 'Send Steps',
				value: 'send',
				description: 'Send multiple steps',
				action: 'Send steps',
			},
		],
		default: 'getMany',
	},
];

export const stepFields: INodeProperties[] = [
	{
		displayName: 'Step ID',
		name: 'stepId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['step'],
				operation: ['get', 'delete'],
			},
		},
		description: 'ID of the step',
	},
	{
		displayName: 'Steps',
		name: 'steps',
		type: 'json',
		required: true,
		default: '[]',
		displayOptions: {
			show: {
				resource: ['step'],
				operation: ['send'],
			},
		},
		description: 'Array of steps to send',
	},
	{
		displayName: 'Generation',
		name: 'generation',
		type: 'json',
		required: true,
		default: '{}',
		displayOptions: {
			show: {
				resource: ['step'],
				operation: ['createGeneration'],
			},
		},
		description: 'Generation data to create',
	},
	{
		displayName: 'Return Item Count',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
		},
		default: 50,
		displayOptions: {
			show: {
				resource: ['step'],
				operation: ['getMany', 'getGenerations'],
			},
		},
		description: 'Max number of results to return',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'json',
		default: '[]',
		displayOptions: {
			show: {
				resource: ['step'],
				operation: ['getMany', 'getGenerations'],
			},
		},
		description: 'Array of filters to apply',
	},
];
