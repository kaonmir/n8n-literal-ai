import { INodeProperties } from 'n8n-workflow';

export const fileOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['file'],
			},
		},
		options: [
			{
				name: 'Create Attachment',
				value: 'createAttachment',
				description: 'Create a new attachment',
				action: 'Create an attachment',
			},
			{
				name: 'Upload',
				value: 'upload',
				description: 'Upload a file',
				action: 'Upload a file',
			},
		],
		default: 'upload',
	},
];

export const fileFields: INodeProperties[] = [
	{
		displayName: 'Binary Property',
		name: 'binaryPropertyName',
		type: 'string',
		default: 'data',
		required: true,
		displayOptions: {
			show: {
				resource: ['file'],
				operation: ['upload', 'createAttachment'],
			},
		},
		description: 'Name of the binary property containing the file data',
	},
	{
		displayName: 'Thread ID',
		name: 'threadId',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['file'],
				operation: ['upload', 'createAttachment'],
			},
		},
		description: 'ID of the thread to attach the file to',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['file'],
				operation: ['upload', 'createAttachment'],
			},
		},
		options: [
			{
				displayName: 'File ID',
				name: 'id',
				type: 'string',
				default: '',
				description: 'Custom identifier for the file',
			},
			{
				displayName: 'MIME Type',
				name: 'mime',
				type: 'string',
				default: '',
				description: 'MIME type of the file',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Name of the file',
			},
			{
				displayName: 'Metadata',
				name: 'metadata',
				type: 'json',
				default: '{}',
				description: 'Additional metadata for the file',
			},
		],
	},
];
