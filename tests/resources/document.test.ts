import { describe, test, expect, beforeAll } from 'bun:test';
import { ENDPOINTS } from '../../nodes/DoclingServe/constants';

const BASE_URL = 'http://127.0.0.1:5001';
const TEST_URL = 'https://raw.githubusercontent.com/docling-project/docling/main/README.md';

describe('Document Resource Tests', () => {
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

	describe('Convert from URL', () => {
		test('converts document successfully', async () => {
			if (!serverAvailable) {
				console.log('Skipping test: docling-serve not available');
				return;
			}

			const response = await fetch(`${BASE_URL}${ENDPOINTS.CONVERT_SOURCE}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					sources: [{ kind: 'http', url: TEST_URL }],
				}),
			});

			expect(response.ok).toBe(true);
			const data = await response.json();
			expect(data.status).toBe('success');
		});

		test('returns document content', async () => {
			if (!serverAvailable) {
				console.log('Skipping test: docling-serve not available');
				return;
			}

			const response = await fetch(`${BASE_URL}${ENDPOINTS.CONVERT_SOURCE}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					sources: [{ kind: 'http', url: TEST_URL }],
				}),
			});

			const data = await response.json();
			expect(data.document).toBeDefined();
		});
	});

	describe('Async Conversion', () => {
		test('returns task id for async request', async () => {
			if (!serverAvailable) {
				console.log('Skipping test: docling-serve not available');
				return;
			}

			const response = await fetch(`${BASE_URL}${ENDPOINTS.CONVERT_SOURCE_ASYNC}`, {
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

		test('can poll task status', async () => {
			if (!serverAvailable) {
				console.log('Skipping test: docling-serve not available');
				return;
			}

			const createResponse = await fetch(`${BASE_URL}${ENDPOINTS.CONVERT_SOURCE_ASYNC}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					sources: [{ kind: 'http', url: TEST_URL }],
				}),
			});

			const createData = await createResponse.json();
			const taskId = createData.task_id;

			const statusResponse = await fetch(`${BASE_URL}${ENDPOINTS.STATUS_POLL}/${taskId}`);
			expect(statusResponse.ok).toBe(true);

			const statusData = await statusResponse.json();
			expect(statusData.task_id).toBe(taskId);
			expect(statusData.task_status).toBeDefined();
		});
	});
});
