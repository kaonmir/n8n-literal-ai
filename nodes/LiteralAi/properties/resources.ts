import { INodeProperties } from 'n8n-workflow';

export const resourceProperties: INodeProperties[] = [
	{
		displayName: 'Resource',
		name: 'resource',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Dataset',
				value: 'dataset',
			},
			{
				name: 'Experiment',
				value: 'experiment',
			},
			{
				name: 'File',
				value: 'file',
			},
			{
				name: 'Project',
				value: 'project',
			},
			{
				name: 'Prompt',
				value: 'prompt',
			},
			{
				name: 'Score',
				value: 'score',
			},
			{
				name: 'Step/Generation',
				value: 'step',
			},
			{
				name: 'Thread',
				value: 'thread',
			},
			{
				name: 'User',
				value: 'user',
			},
		],
		default: 'user',
	},
];
