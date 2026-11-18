import { describe, test, expect } from 'bun:test';
import type { IExecuteFunctions } from 'n8n-workflow';
import { getAuthHeaders } from '../../nodes/DoclingServe/helpers/api';
import {
	convertFromFile,
	convertFromFileAsync,
} from '../../nodes/DoclingServe/resources/document/document.operations';
import {
	chunkFromFile,
	chunkFromFileAsync,
} from '../../nodes/DoclingServe/resources/chunk/chunk.operations';

const API_KEY = 'test-key';

type RecordedRequest = { url: string; headers: Record<string, string> };

function createContext(apiKey: string) {
	const requests: RecordedRequest[] = [];
	const context = {
		getCredentials: async () => ({ baseUrl: 'http://docling.test', apiKey }),
		getNodeParameter: (name: string, _index: number, fallback?: unknown) => {
			if (name === 'binaryPropertyName') return 'data';
			if (name === 'chunkerType') return 'hybrid';
			return fallback ?? {};
		},
		helpers: {
			assertBinaryData: () => ({ fileName: 'a.pdf', mimeType: 'application/pdf' }),
			getBinaryDataBuffer: async () => Buffer.from('pdf'),
			httpRequest: async (options: { url: string; headers: Record<string, string> }) => {
				requests.push({ url: options.url, headers: options.headers });
				return { task_id: 't1', task_status: 'success' };
			},
		},
	};
	return { context: context as unknown as IExecuteFunctions, requests };
}

describe('API key header', () => {
	test('getAuthHeaders uses X-Api-Key and is empty without a key', () => {
		expect(getAuthHeaders(API_KEY)).toEqual({ 'X-Api-Key': API_KEY });
		expect(getAuthHeaders('')).toEqual({});
		expect(getAuthHeaders(undefined)).toEqual({});
	});

	const operations = {
		convertFromFile,
		convertFromFileAsync,
		chunkFromFile,
		chunkFromFileAsync,
	};

	for (const [name, operation] of Object.entries(operations)) {
		test(`${name} sends X-Api-Key on every request`, async () => {
			const { context, requests } = createContext(API_KEY);
			await operation.call(context, 0);

			expect(requests.length).toBeGreaterThan(0);
			for (const request of requests) {
				expect(request.headers['X-Api-Key']).toBe(API_KEY);
				expect(request.headers.Authorization).toBeUndefined();
			}
		});

		test(`${name} sends no auth header without a key`, async () => {
			const { context, requests } = createContext('');
			await operation.call(context, 0);

			for (const request of requests) {
				expect(request.headers['X-Api-Key']).toBeUndefined();
				expect(request.headers.Authorization).toBeUndefined();
			}
		});
	}
});
