import { describe, test, expect, beforeAll } from 'bun:test';
import { ENDPOINTS } from '../../nodes/DoclingServe/constants';

const BASE_URL = 'http://127.0.0.1:5001';
const TEST_URL = 'https://raw.githubusercontent.com/docling-project/docling/main/README.md';

describe('Chunk Integration Tests', () => {
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

	describe('Hybrid Chunker from URL', () => {
		test('returns chunks with text content', async () => {
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
			expect(data.chunks.length).toBeGreaterThan(0);
			expect(data.processing_time).toBeDefined();
		});

		test('accepts chunking options', async () => {
			if (!serverAvailable) {
				console.log('Skipping test: docling-serve not available');
				return;
			}

			const response = await fetch(`${BASE_URL}${ENDPOINTS.CHUNK_HYBRID_SOURCE}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					sources: [{ kind: 'http', url: TEST_URL }],
					chunking_options: {
						max_tokens: 256,
						merge_peers: true,
					},
				}),
			});

			expect(response.ok).toBe(true);
			const data = await response.json();
			expect(data.chunks).toBeDefined();
			expect(Array.isArray(data.chunks)).toBe(true);
		});
	});

	describe('Hierarchical Chunker from URL', () => {
		test('returns chunks with text content', async () => {
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
			expect(data.chunks.length).toBeGreaterThan(0);
		});
	});

	describe('Async Chunk from URL', () => {
		test('hybrid async returns task id', async () => {
			if (!serverAvailable) {
				console.log('Skipping test: docling-serve not available');
				return;
			}

			const response = await fetch(`${BASE_URL}${ENDPOINTS.CHUNK_HYBRID_SOURCE_ASYNC}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					sources: [{ kind: 'http', url: TEST_URL }],
				}),
			});

			expect(response.ok).toBe(true);
			const data = await response.json();
			expect(data.task_id).toBeDefined();
			expect(typeof data.task_id).toBe('string');
			expect(data.task_status).toBeDefined();
		});

		test('hierarchical async returns task id', async () => {
			if (!serverAvailable) {
				console.log('Skipping test: docling-serve not available');
				return;
			}

			const response = await fetch(`${BASE_URL}${ENDPOINTS.CHUNK_HIERARCHICAL_SOURCE_ASYNC}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					sources: [{ kind: 'http', url: TEST_URL }],
				}),
			});

			expect(response.ok).toBe(true);
			const data = await response.json();
			expect(data.task_id).toBeDefined();
			expect(typeof data.task_id).toBe('string');
		});

		test('async chunk completes with polling', async () => {
			if (!serverAvailable) {
				console.log('Skipping test: docling-serve not available');
				return;
			}

			// Create async chunk task
			const createResponse = await fetch(`${BASE_URL}${ENDPOINTS.CHUNK_HYBRID_SOURCE_ASYNC}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					sources: [{ kind: 'http', url: TEST_URL }],
				}),
			});

			const createData = await createResponse.json();
			const taskId = createData.task_id;

			// Poll until complete
			const maxAttempts = 30;
			const intervalMs = 2000;
			let attempts = 0;
			let status = createData.task_status;

			while (!['success', 'failure'].includes(status) && attempts < maxAttempts) {
				await new Promise((resolve) => setTimeout(resolve, intervalMs));
				const statusResponse = await fetch(`${BASE_URL}${ENDPOINTS.STATUS_POLL}/${taskId}`);
				const statusData = await statusResponse.json();
				status = statusData.task_status;
				attempts++;
			}

			expect(['success', 'failure']).toContain(status);

			if (status === 'success') {
				const resultResponse = await fetch(`${BASE_URL}${ENDPOINTS.RESULT}/${taskId}`);
				expect(resultResponse.ok).toBe(true);
				const resultData = await resultResponse.json();
				expect(resultData.chunks).toBeDefined();
			}
		}, 120000);
	});

	describe('Chunk from File', () => {
		test('hybrid chunker accepts file upload', async () => {
			if (!serverAvailable) {
				console.log('Skipping test: docling-serve not available');
				return;
			}

			const testContent = '# Test Document\n\nThis is a test document for chunking.\n\n## Section 1\n\nSome content here.\n';
			const blob = new Blob([testContent], { type: 'text/markdown' });
			const formData = new FormData();
			formData.append('files', blob, 'test.md');

			const response = await fetch(`${BASE_URL}${ENDPOINTS.CHUNK_HYBRID_FILE}`, {
				method: 'POST',
				body: formData,
			});

			expect(response.ok).toBe(true);
			const data = await response.json();
			expect(data.chunks).toBeDefined();
			expect(Array.isArray(data.chunks)).toBe(true);
		});

		test('hierarchical chunker accepts file upload', async () => {
			if (!serverAvailable) {
				console.log('Skipping test: docling-serve not available');
				return;
			}

			const testContent = '# Test Document\n\nThis is a test document for chunking.\n\n## Section 1\n\nSome content here.\n';
			const blob = new Blob([testContent], { type: 'text/markdown' });
			const formData = new FormData();
			formData.append('files', blob, 'test.md');

			const response = await fetch(`${BASE_URL}${ENDPOINTS.CHUNK_HIERARCHICAL_FILE}`, {
				method: 'POST',
				body: formData,
			});

			expect(response.ok).toBe(true);
			const data = await response.json();
			expect(data.chunks).toBeDefined();
			expect(Array.isArray(data.chunks)).toBe(true);
		});

		test('async file chunk returns task id', async () => {
			if (!serverAvailable) {
				console.log('Skipping test: docling-serve not available');
				return;
			}

			const testContent = '# Test Document\n\nThis is a test document.\n';
			const blob = new Blob([testContent], { type: 'text/markdown' });
			const formData = new FormData();
			formData.append('files', blob, 'test.md');

			const response = await fetch(`${BASE_URL}${ENDPOINTS.CHUNK_HYBRID_FILE_ASYNC}`, {
				method: 'POST',
				body: formData,
			});

			expect(response.ok).toBe(true);
			const data = await response.json();
			expect(data.task_id).toBeDefined();
			expect(typeof data.task_id).toBe('string');
		});
	});
});
