import { INodeProperties } from 'n8n-workflow';

export const threadOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['thread'],
			},
		},
		options: [
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a thread',
				action: 'Delete a thread',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get list of threads',
				action: 'Get list of threads',
			},
			{
				name: 'Get One',
				value: 'get',
				description: 'Get a thread',
				action: 'Get a thread',
			},
			{
				name: 'Create or Update',
				value: 'upsert',
				description: 'Create a new record, or update the current one if it already exists (upsert)',
				action: 'Create or update a thread',
			},
		],
		default: 'getMany',
	},
];

export const threadFields: INodeProperties[] = [
	{
		displayName: 'Thread ID',
		name: 'threadId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['thread'],
				operation: ['get', 'delete', 'upsert'],
			},
		},
		description: 'ID of the thread',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['thread'],
				operation: ['upsert'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Name of the thread',
			},
			{
				displayName: 'Metadata',
				name: 'metadata',
				type: 'json',
				default: '{}',
				description: 'Additional metadata for the thread',
			},
			{
				displayName: 'Participant ID',
				name: 'participantId',
				type: 'string',
				default: '',
				description: 'ID of the participant',
			},
			{
				displayName: 'Tags',
				name: 'tags',
				type: 'string',
				default: '',
				description: 'Comma-separated list of tags',
			},
		],
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
				resource: ['thread'],
				operation: ['getMany'],
			},
		},
		description: 'Max number of results to return',
	},
];
