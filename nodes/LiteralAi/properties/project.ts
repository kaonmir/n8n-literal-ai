import { INodeProperties } from 'n8n-workflow';

export const projectOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['project'],
			},
		},
		options: [
			{
				name: 'Get ID',
				value: 'getId',
				description: 'Get project ID associated with API key',
				action: 'Get project ID',
			},
		],
		default: 'getId',
	},
];

export const projectFields: INodeProperties[] = [];
