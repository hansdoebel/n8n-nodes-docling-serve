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
	operation: ['chunkFromUrl'],
};

const showForChunkFile = {
	resource: ['chunk'],
	operation: ['chunkFromFile'],
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
