import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSystem = {
	resource: ['system'],
};

export const systemDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForSystem,
		},
		options: [
			{
				name: 'Health Check',
				value: 'healthCheck',
				action: 'Check server health',
				description: 'Check if the Docling Serve instance is healthy',
			},
		],
		default: 'healthCheck',
	},
];

export * from './system.operations';
