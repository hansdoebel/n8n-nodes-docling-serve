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
				name: 'Clear Converter Cache',
				value: 'clearConverters',
				action: 'Clear the converter cache',
				description: 'Clear cached converters from the Docling Serve instance',
			},
			{
				name: 'Clear Results Cache',
				value: 'clearResults',
				action: 'Clear the results cache',
				description: 'Clear cached results from the Docling Serve instance',
			},
			{
				name: 'Health Check',
				value: 'healthCheck',
				action: 'Check server health',
				description: 'Check if the Docling Serve instance is healthy',
			},
			{
				name: 'Memory Counts',
				value: 'memoryCounts',
				action: 'Get memory object counts',
				description: 'Get memory object counts for the Docling Serve instance',
			},
			{
				name: 'Memory Stats',
				value: 'memoryStats',
				action: 'Get memory statistics',
				description: 'Get memory usage statistics for the Docling Serve instance',
			},
			{
				name: 'Readiness Check',
				value: 'readinessCheck',
				action: 'Check server readiness',
				description: 'Check if the Docling Serve instance is ready to accept requests',
			},
			{
				name: 'Version',
				value: 'getVersion',
				action: 'Get version info',
				description: 'Get version information for the Docling Serve instance',
			},
		],
		default: 'healthCheck',
	},
	{
		displayName: 'This operation will permanently clear cached data from the server',
		name: 'clearWarning',
		type: 'notice',
		default: '',
		displayOptions: {
			show: {
				resource: ['system'],
				operation: ['clearConverters', 'clearResults'],
			},
		},
	},
	{
		displayName: 'Older Than (Seconds)',
		name: 'olderThan',
		type: 'number',
		default: 3600,
		description: 'Clear results older than this many seconds',
		displayOptions: {
			show: {
				resource: ['system'],
				operation: ['clearResults'],
			},
		},
	},
];

export * from './system.operations';
