import { INodeProperties } from 'n8n-workflow';

export const scoreOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['score'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new score',
				action: 'Create a score',
			},
			{
				name: 'Create Many',
				value: 'createMany',
				description: 'Create multiple scores',
				action: 'Create multiple scores',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a score',
				action: 'Delete a score',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get list of scores',
				action: 'Get list of scores',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a score',
				action: 'Update a score',
			},
		],
		default: 'create',
	},
];

export const scoreFields: INodeProperties[] = [
	{
		displayName: 'Score ID',
		name: 'scoreId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['score'],
				operation: ['delete', 'update'],
			},
		},
		description: 'ID of the score',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['score'],
				operation: ['create'],
			},
		},
		description: 'Name of the score',
	},
	{
		displayName: 'Type',
		name: 'type',
		type: 'options',
		options: [
			{
				name: 'Accuracy',
				value: 'accuracy',
			},
			{
				name: 'Latency',
				value: 'latency',
			},
			{
				name: 'Quality',
				value: 'quality',
			},
		],
		required: true,
		default: 'quality',
		displayOptions: {
			show: {
				resource: ['score'],
				operation: ['create'],
			},
		},
		description: 'Type of the score',
	},
	{
		displayName: 'Value',
		name: 'value',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: {
				resource: ['score'],
				operation: ['create', 'update'],
			},
		},
		description: 'Value of the score',
	},
	{
		displayName: 'Step ID',
		name: 'stepId',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['score'],
				operation: ['create'],
			},
		},
		description: 'ID of the associated step',
	},
	{
		displayName: 'Comment',
		name: 'comment',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['score'],
				operation: ['create', 'update'],
			},
		},
		description: 'Comment about the score',
	},
	{
		displayName: 'Scores',
		name: 'scores',
		type: 'json',
		required: true,
		default: '[]',
		displayOptions: {
			show: {
				resource: ['score'],
				operation: ['createMany'],
			},
		},
		description: 'Array of scores to create',
	},
];
