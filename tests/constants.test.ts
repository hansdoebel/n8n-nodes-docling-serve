import { describe, test, expect } from 'bun:test';
import {
	ENDPOINTS,
	OUTPUT_FORMATS,
	CHUNKER_TYPES,
	POLLING,
	OPERATIONS,
	RESOURCES,
} from '../nodes/DoclingServe/constants';

describe('Constants', () => {
	describe('ENDPOINTS', () => {
		test('has all document conversion endpoints', () => {
			expect(ENDPOINTS.CONVERT_SOURCE).toBe('/v1/convert/source');
			expect(ENDPOINTS.CONVERT_FILE).toBe('/v1/convert/file');
			expect(ENDPOINTS.CONVERT_SOURCE_ASYNC).toBe('/v1/convert/source/async');
			expect(ENDPOINTS.CONVERT_FILE_ASYNC).toBe('/v1/convert/file/async');
		});

		test('has all task endpoints', () => {
			expect(ENDPOINTS.STATUS_POLL).toBe('/v1/status/poll');
			expect(ENDPOINTS.RESULT).toBe('/v1/result');
		});

		test('has all chunk endpoints', () => {
			expect(ENDPOINTS.CHUNK_HYBRID_SOURCE).toBe('/v1/chunk/hybrid/source');
			expect(ENDPOINTS.CHUNK_HYBRID_FILE).toBe('/v1/chunk/hybrid/file');
			expect(ENDPOINTS.CHUNK_HIERARCHICAL_SOURCE).toBe('/v1/chunk/hierarchical/source');
			expect(ENDPOINTS.CHUNK_HIERARCHICAL_FILE).toBe('/v1/chunk/hierarchical/file');
			expect(ENDPOINTS.CHUNK_HYBRID_SOURCE_ASYNC).toBe('/v1/chunk/hybrid/source/async');
			expect(ENDPOINTS.CHUNK_HYBRID_FILE_ASYNC).toBe('/v1/chunk/hybrid/file/async');
			expect(ENDPOINTS.CHUNK_HIERARCHICAL_SOURCE_ASYNC).toBe('/v1/chunk/hierarchical/source/async');
			expect(ENDPOINTS.CHUNK_HIERARCHICAL_FILE_ASYNC).toBe('/v1/chunk/hierarchical/file/async');
		});

		test('has health endpoint', () => {
			expect(ENDPOINTS.HEALTH).toBe('/health');
		});

		test('has exactly 21 endpoints', () => {
			expect(Object.keys(ENDPOINTS)).toHaveLength(21);
		});
	});

	describe('OUTPUT_FORMATS', () => {
		test('has all output formats', () => {
			expect(OUTPUT_FORMATS.MARKDOWN).toBe('markdown');
			expect(OUTPUT_FORMATS.HTML).toBe('html');
			expect(OUTPUT_FORMATS.JSON).toBe('json');
			expect(OUTPUT_FORMATS.DOCTAGS).toBe('doctags');
		});

		test('has exactly 4 formats', () => {
			expect(Object.keys(OUTPUT_FORMATS)).toHaveLength(4);
		});
	});

	describe('CHUNKER_TYPES', () => {
		test('has all chunker types', () => {
			expect(CHUNKER_TYPES.HYBRID).toBe('hybrid');
			expect(CHUNKER_TYPES.HIERARCHICAL).toBe('hierarchical');
		});

		test('has exactly 2 types', () => {
			expect(Object.keys(CHUNKER_TYPES)).toHaveLength(2);
		});
	});

	describe('POLLING', () => {
		test('has correct default values', () => {
			expect(POLLING.DEFAULT_MAX_ATTEMPTS).toBe(60);
			expect(POLLING.DEFAULT_INTERVAL_MS).toBe(2000);
		});

		test('has correct completed statuses', () => {
			expect(POLLING.COMPLETED_STATUSES).toContain('success');
			expect(POLLING.COMPLETED_STATUSES).toContain('failure');
			expect(POLLING.COMPLETED_STATUSES).toHaveLength(2);
		});
	});

	describe('OPERATIONS', () => {
		test('has all document operations', () => {
			expect(OPERATIONS.DOCUMENT.CONVERT_FROM_URL).toBe('convertFromUrl');
			expect(OPERATIONS.DOCUMENT.CONVERT_FROM_FILE).toBe('convertFromFile');
			expect(OPERATIONS.DOCUMENT.CONVERT_FROM_URL_ASYNC).toBe('convertFromUrlAsync');
			expect(OPERATIONS.DOCUMENT.CONVERT_FROM_FILE_ASYNC).toBe('convertFromFileAsync');
		});

		test('has all task operations', () => {
			expect(OPERATIONS.TASK.GET_STATUS).toBe('getStatus');
			expect(OPERATIONS.TASK.GET_RESULT).toBe('getResult');
		});

		test('has all chunk operations', () => {
			expect(OPERATIONS.CHUNK.CHUNK_FROM_URL).toBe('chunkFromUrl');
			expect(OPERATIONS.CHUNK.CHUNK_FROM_FILE).toBe('chunkFromFile');
			expect(OPERATIONS.CHUNK.CHUNK_FROM_URL_ASYNC).toBe('chunkFromUrlAsync');
			expect(OPERATIONS.CHUNK.CHUNK_FROM_FILE_ASYNC).toBe('chunkFromFileAsync');
		});

		test('has system health check operation', () => {
			expect(OPERATIONS.SYSTEM.HEALTH_CHECK).toBe('healthCheck');
		});
	});

	describe('RESOURCES', () => {
		test('has all resources', () => {
			expect(RESOURCES.DOCUMENT).toBe('document');
			expect(RESOURCES.CHUNK).toBe('chunk');
			expect(RESOURCES.TASK).toBe('task');
			expect(RESOURCES.SYSTEM).toBe('system');
		});

		test('has exactly 4 resources', () => {
			expect(Object.keys(RESOURCES)).toHaveLength(4);
		});
	});
});
