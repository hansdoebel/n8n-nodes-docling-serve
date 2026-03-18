import type { INodeProperties } from 'n8n-workflow';
import {
	chunkerTypeProperty,
	chunkSourceUrlProperty,
	chunkBinaryPropertyNameProperty,
	chunkAdditionalOptionsProperty,
} from './chunk.properties';

const showOnlyForChunk = {
	resource: ['chunk'],
};

const showForChunkUrl = {
	resource: ['chunk'],
	operation: ['chunkFromUrl', 'chunkFromUrlAsync'],
};

const showForChunkFile = {
	resource: ['chunk'],
	operation: ['chunkFromFile', 'chunkFromFileAsync'],
};

export const chunkDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForChunk,
		},
		options: [
			{
				name: 'Chunk From URL',
				value: 'chunkFromUrl',
				action: 'Chunk a document from URL',
				description: 'Chunk a document from an HTTP URL',
			},
			{
				name: 'Chunk From File',
				value: 'chunkFromFile',
				action: 'Chunk a document from file',
				description: 'Chunk a document from binary data',
			},
			{
				name: 'Chunk From URL (Async)',
				value: 'chunkFromUrlAsync',
				action: 'Chunk a document from URL asynchronously',
				description: 'Chunk a document from an HTTP URL as an async task with polling',
			},
			{
				name: 'Chunk From File (Async)',
				value: 'chunkFromFileAsync',
				action: 'Chunk a document from file asynchronously',
				description: 'Chunk a document from binary data as an async task with polling',
			},
		],
		default: 'chunkFromUrl',
	},
	{
		...chunkerTypeProperty,
		displayOptions: {
			show: showOnlyForChunk,
		},
	},
	{
		...chunkSourceUrlProperty,
		displayOptions: {
			show: showForChunkUrl,
		},
	},
	{
		...chunkBinaryPropertyNameProperty,
		displayOptions: {
			show: showForChunkFile,
		},
	},
	{
		...chunkAdditionalOptionsProperty,
		displayOptions: {
			show: showOnlyForChunk,
		},
	},
];

export * from './chunk.operations';
