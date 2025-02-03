import { INodeProperties } from 'n8n-workflow';

export const experimentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['experiment'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new experiment',
				action: 'Create an experiment',
			},
			{
				name: 'Create Item',
				value: 'createItem',
				description: 'Create an experiment item',
				action: 'Create an experiment item',
			},
		],
		default: 'create',
	},
];

export const experimentFields: INodeProperties[] = [
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['experiment'],
				operation: ['create'],
			},
		},
		description: 'Name of the experiment',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['experiment'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Dataset ID',
				name: 'datasetId',
				type: 'string',
				default: '',
				description: 'ID of the dataset to associate with the experiment',
			},
			{
				displayName: 'Prompt Variant ID',
				name: 'promptVariantId',
				type: 'string',
				default: '',
				description: 'ID of the prompt variant to associate with the experiment',
			},
			{
				displayName: 'Parameters',
				name: 'params',
				type: 'json',
				default: '{}',
				description: 'Parameters for the experiment',
			},
		],
	},
	{
		displayName: 'Experiment Item Fields',
		name: 'experimentItemFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['experiment'],
				operation: ['createItem'],
			},
		},
		options: [
			{
				displayName: 'Dataset Experiment ID',
				name: 'datasetExperimentId',
				type: 'string',
				default: '',
				description: 'ID of the dataset experiment',
			},
			{
				displayName: 'Dataset Item ID',
				name: 'datasetItemId',
				type: 'string',
				default: '',
				description: 'ID of the dataset item',
			},
			{
				displayName: 'Experiment Run ID',
				name: 'experimentRunId',
				type: 'string',
				default: '',
				description: 'ID of the experiment run',
			},
			{
				displayName: 'Input',
				name: 'input',
				type: 'json',
				default: '{}',
				description: 'Input data for the experiment item',
			},
			{
				displayName: 'Output',
				name: 'output',
				type: 'json',
				default: '{}',
				description: 'Output data for the experiment item',
			},
			{
				displayName: 'Scores',
				name: 'scores',
				type: 'json',
				default: '[]',
				description: 'Array of scores for the experiment item',
			},
		],
	},
];
