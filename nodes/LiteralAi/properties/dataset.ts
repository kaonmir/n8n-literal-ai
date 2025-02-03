import { INodeProperties } from 'n8n-workflow';

export const datasetOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['dataset'],
			},
		},
		options: [
			{
				name: 'Add Generation',
				value: 'addGeneration',
				description: 'Add a generation to dataset',
				action: 'Add a generation to dataset',
			},
			{
				name: 'Add Generations',
				value: 'addGenerations',
				description: 'Add multiple generations to dataset',
				action: 'Add generations to dataset',
			},
			{
				name: 'Add Step',
				value: 'addStep',
				description: 'Add a step to dataset',
				action: 'Add a step to dataset',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new dataset',
				action: 'Create a dataset',
			},
			{
				name: 'Create Item',
				value: 'createItem',
				description: 'Create a dataset item',
				action: 'Create a dataset item',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a dataset',
				action: 'Delete a dataset',
			},
			{
				name: 'Delete Item',
				value: 'deleteItem',
				description: 'Delete a dataset item',
				action: 'Delete a dataset item',
			},
			{
				name: 'Get Item',
				value: 'getItem',
				description: 'Get a dataset item',
				action: 'Get a dataset item',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get list of datasets',
				action: 'Get list of datasets',
			},
			{
				name: 'Get One',
				value: 'get',
				description: 'Get a dataset',
				action: 'Get a dataset',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a dataset',
				action: 'Update a dataset',
			},
		],
		default: 'getMany',
	},
];

export const datasetFields: INodeProperties[] = [
	{
		displayName: 'Dataset ID',
		name: 'datasetId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['dataset'],
				operation: [
					'get',
					'delete',
					'update',
					'addStep',
					'addGeneration',
					'addGenerations',
					'createItem',
				],
			},
		},
		description: 'ID of the dataset',
	},
	{
		displayName: 'Dataset Item ID',
		name: 'datasetItemId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['dataset'],
				operation: ['getItem', 'deleteItem'],
			},
		},
		description: 'ID of the dataset item',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['dataset'],
				operation: ['create'],
			},
		},
		description: 'Name of the dataset',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['dataset'],
				operation: ['create', 'update'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description of the dataset',
			},
			{
				displayName: 'Metadata',
				name: 'metadata',
				type: 'json',
				default: '{}',
				description: 'Additional metadata for the dataset',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				options: [
					{
						name: 'Evaluation',
						value: 'evaluation',
					},
					{
						name: 'Training',
						value: 'training',
					},
				],
				default: 'evaluation',
				description: 'Type of the dataset',
			},
		],
	},
	{
		displayName: 'Input Data',
		name: 'input',
		type: 'json',
		required: true,
		default: '{}',
		displayOptions: {
			show: {
				resource: ['dataset'],
				operation: ['createItem'],
			},
		},
		description: 'Input data for the dataset item',
	},
	{
		displayName: 'Step ID',
		name: 'stepId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['dataset'],
				operation: ['addStep'],
			},
		},
		description: 'ID of the step to add',
	},
	{
		displayName: 'Generation ID',
		name: 'generationId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['dataset'],
				operation: ['addGeneration'],
			},
		},
		description: 'ID of the generation to add',
	},
	{
		displayName: 'Generation IDs',
		name: 'generationIds',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['dataset'],
				operation: ['addGenerations'],
			},
		},
		description: 'Comma-separated list of generation IDs to add',
	},
];
