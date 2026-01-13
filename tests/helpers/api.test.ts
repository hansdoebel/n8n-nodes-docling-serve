import { describe, test, expect } from 'bun:test';
import { ENDPOINTS } from '../../nodes/DoclingServe/constants/endpoints';

const BASE_URL = 'http://127.0.0.1:5001';

describe('API Helper Tests', () => {
	test('health endpoint is accessible', async () => {
		const response = await fetch(`${BASE_URL}${ENDPOINTS.HEALTH}`);
		expect(response.ok).toBe(true);

		const data = await response.json();
		expect(data.status).toBe('ok');
	});

	test('convert endpoint accepts POST requests', async () => {
		const response = await fetch(`${BASE_URL}${ENDPOINTS.CONVERT_SOURCE}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				sources: [
					{
						kind: 'http',
						url: 'https://raw.githubusercontent.com/docling-project/docling/main/README.md',
					},
				],
			}),
		});

		expect(response.status).not.toBe(405);
	});
});
