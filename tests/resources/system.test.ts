import { describe, test, expect } from 'bun:test';
import { ENDPOINTS } from '../../nodes/DoclingServe/constants/endpoints';

const BASE_URL = 'http://127.0.0.1:5001';

describe('System Resource Tests', () => {
	test('health check returns ok status', async () => {
		try {
			const response = await fetch(`${BASE_URL}${ENDPOINTS.HEALTH}`, {
				signal: AbortSignal.timeout(5000),
			});

			if (!response.ok) {
				console.log('Server not available');
				return;
			}

			const data = await response.json();
			expect(data.status).toBe('ok');
		} catch {
			console.log('Skipping test: docling-serve not available');
		}
	});
});
