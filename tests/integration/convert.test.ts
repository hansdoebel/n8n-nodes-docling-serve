import { describe, test, expect, beforeAll } from 'bun:test';
import { ENDPOINTS } from '../../nodes/DoclingServe/constants';

const BASE_URL = 'http://127.0.0.1:5001';
const TEST_URL = 'https://raw.githubusercontent.com/docling-project/docling/main/README.md';

describe('Document Conversion Integration Tests', () => {
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

	test('server is available', () => {
		expect(serverAvailable).toBe(true);
	});

	test('converts markdown from URL', async () => {
		if (!serverAvailable) {
			console.log('Skipping test: docling-serve not available');
			return;
		}

		const response = await fetch(`${BASE_URL}${ENDPOINTS.CONVERT_SOURCE}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				sources: [{ kind: 'http', url: TEST_URL }],
			}),
		});

		expect(response.ok).toBe(true);

		const data = await response.json();
		expect(data).toHaveProperty('document');
		expect(data).toHaveProperty('status');
	});

	test('async conversion returns task id', async () => {
		if (!serverAvailable) {
			console.log('Skipping test: docling-serve not available');
			return;
		}

		const response = await fetch(`${BASE_URL}${ENDPOINTS.CONVERT_SOURCE_ASYNC}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				sources: [{ kind: 'http', url: TEST_URL }],
			}),
		});

		expect(response.ok).toBe(true);

		const data = await response.json();
		expect(data).toHaveProperty('task_id');
		expect(data).toHaveProperty('task_status');
	});
});
