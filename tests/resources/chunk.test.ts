import { describe, test, expect, beforeAll } from 'bun:test';
import { ENDPOINTS, CHUNKER_TYPES } from '../../nodes/DoclingServe/constants';

const BASE_URL = 'http://127.0.0.1:5001';
const TEST_URL = 'https://raw.githubusercontent.com/docling-project/docling/main/README.md';

describe('Chunk Resource Tests', () => {
	let serverAvailable = false;

	beforeAll(async () => {
		try {
			const response = await fetch(`${BASE_URL}${ENDPOINTS.HEALTH}`, {
				signal: AbortSignal.timeout(5000),
			});
			serverAvailable = response.ok;
		} catch {
			serverAvailable = false;
		}
	});

	describe('Hybrid Chunker', () => {
		test('chunks document from URL', async () => {
			if (!serverAvailable) {
				console.log('Skipping test: docling-serve not available');
				return;
			}

			const response = await fetch(`${BASE_URL}${ENDPOINTS.CHUNK_HYBRID_SOURCE}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					sources: [{ kind: 'http', url: TEST_URL }],
				}),
			});

			expect(response.ok).toBe(true);
			const data = await response.json();
			expect(data.chunks).toBeDefined();
			expect(Array.isArray(data.chunks)).toBe(true);
		});
	});

	describe('Hierarchical Chunker', () => {
		test('chunks document from URL', async () => {
			if (!serverAvailable) {
				console.log('Skipping test: docling-serve not available');
				return;
			}

			const response = await fetch(`${BASE_URL}${ENDPOINTS.CHUNK_HIERARCHICAL_SOURCE}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					sources: [{ kind: 'http', url: TEST_URL }],
				}),
			});

			expect(response.ok).toBe(true);
			const data = await response.json();
			expect(data.chunks).toBeDefined();
			expect(Array.isArray(data.chunks)).toBe(true);
		});
	});

	describe('Chunker Types Constant', () => {
		test('has correct values', () => {
			expect(CHUNKER_TYPES.HYBRID).toBe('hybrid');
			expect(CHUNKER_TYPES.HIERARCHICAL).toBe('hierarchical');
		});
	});
});
