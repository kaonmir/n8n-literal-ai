import { INodeProperties } from 'n8n-workflow';

export const userOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['user'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new user',
				action: 'Create a user',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a user',
				action: 'Delete a user',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get list of all users',
				action: 'Get list of users',
			},
			{
				name: 'Get One',
				value: 'get',
				description: 'Get user information',
				action: 'Get a user',
			},
			{
				name: 'Get or Create',
				value: 'getOrCreate',
				description: 'Get existing user or create new one',
				action: 'Get or create a user',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update user information',
				action: 'Update a user',
			},
		],
		default: 'create',
	},
];

export const userFields: INodeProperties[] = [
	{
		displayName: 'Identifier',
		name: 'identifier',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['create', 'getOrCreate'],
			},
		},
		description: 'User identifier',
	},
	{
		displayName: 'Metadata',
		name: 'metadata',
		type: 'json',
		default: '{}',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['create', 'update', 'getOrCreate'],
			},
		},
		description: 'Additional metadata related to the user',
	},
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['get', 'update', 'delete'],
			},
		},
		description: 'Target user ID',
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
				resource: ['user'],
				operation: ['getMany'],
			},
		},
		description: 'Max number of results to return',
	},
];
