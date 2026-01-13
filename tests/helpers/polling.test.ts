import { describe, test, expect, beforeAll } from 'bun:test';
import { ENDPOINTS } from '../../nodes/DoclingServe/constants/endpoints';

const BASE_URL = 'http://127.0.0.1:5001';
const TEST_URL = 'https://raw.githubusercontent.com/docling-project/docling/main/README.md';

describe('Polling Helper Tests', () => {
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

	test('can poll until task completes', async () => {
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
		}
	}, 120000);
});
