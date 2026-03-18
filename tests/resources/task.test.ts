import { describe, test, expect, beforeAll } from 'bun:test';
import { ENDPOINTS } from '../../nodes/DoclingServe/constants';

const BASE_URL = 'http://127.0.0.1:5001';
const TEST_URL = 'https://raw.githubusercontent.com/docling-project/docling/main/README.md';

describe('Task Resource Tests', () => {
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

	describe('Get Status', () => {
		test('returns task status for a valid task', async () => {
			if (!serverAvailable) {
				console.log('Skipping test: docling-serve not available');
				return;
			}

			// Create an async task first
			const createResponse = await fetch(`${BASE_URL}${ENDPOINTS.CONVERT_SOURCE_ASYNC}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					sources: [{ kind: 'http', url: TEST_URL }],
				}),
			});

			expect(createResponse.ok).toBe(true);
			const createData = await createResponse.json();
			const taskId = createData.task_id;

			// Get status
			const statusResponse = await fetch(`${BASE_URL}${ENDPOINTS.STATUS_POLL}/${taskId}`);
			expect(statusResponse.ok).toBe(true);

			const statusData = await statusResponse.json();
			expect(statusData.task_id).toBe(taskId);
			expect(statusData.task_status).toBeDefined();
			expect(statusData.task_type).toBeDefined();
		});

		test('returns 404 for non-existent task', async () => {
			if (!serverAvailable) {
				console.log('Skipping test: docling-serve not available');
				return;
			}

			const response = await fetch(`${BASE_URL}${ENDPOINTS.STATUS_POLL}/non-existent-task-id`);
			expect(response.ok).toBe(false);
		});
	});

	describe('Get Result', () => {
		test('returns result for a completed task', async () => {
			if (!serverAvailable) {
				console.log('Skipping test: docling-serve not available');
				return;
			}

			// Create an async task
			const createResponse = await fetch(`${BASE_URL}${ENDPOINTS.CONVERT_SOURCE_ASYNC}`, {
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

			expect(status).toBe('success');

			// Get result
			const resultResponse = await fetch(`${BASE_URL}${ENDPOINTS.RESULT}/${taskId}`);
			expect(resultResponse.ok).toBe(true);

			const resultData = await resultResponse.json();
			expect(resultData.document).toBeDefined();
			expect(resultData.status).toBeDefined();
		}, 120000);

		test('returns 404 for non-existent task result', async () => {
			if (!serverAvailable) {
				console.log('Skipping test: docling-serve not available');
				return;
			}

			const response = await fetch(`${BASE_URL}${ENDPOINTS.RESULT}/non-existent-task-id`);
			expect(response.ok).toBe(false);
		});
	});
});
