import { describe, test, expect, beforeAll } from 'bun:test';
import { ENDPOINTS } from '../../nodes/DoclingServe/constants';

const BASE_URL = 'http://127.0.0.1:5001';

describe('File Conversion Integration Tests', () => {
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

	describe('Convert from File (Sync)', () => {
		test('converts a markdown file', async () => {
			if (!serverAvailable) {
				console.log('Skipping test: docling-serve not available');
				return;
			}

			const testContent = '# Hello World\n\nThis is a test document.\n\n## Section\n\nSome content.\n';
			const blob = new Blob([testContent], { type: 'text/markdown' });
			const formData = new FormData();
			formData.append('files', blob, 'test.md');

			const response = await fetch(`${BASE_URL}${ENDPOINTS.CONVERT_FILE}`, {
				method: 'POST',
				body: formData,
			});

			expect(response.ok).toBe(true);
			const data = await response.json();
			expect(data.document).toBeDefined();
			expect(data.status).toBe('success');
		});

		test('returns processing time', async () => {
			if (!serverAvailable) {
				console.log('Skipping test: docling-serve not available');
				return;
			}

			const testContent = '# Test\n\nContent here.\n';
			const blob = new Blob([testContent], { type: 'text/markdown' });
			const formData = new FormData();
			formData.append('files', blob, 'test.md');

			const response = await fetch(`${BASE_URL}${ENDPOINTS.CONVERT_FILE}`, {
				method: 'POST',
				body: formData,
			});

			const data = await response.json();
			expect(data.processing_time).toBeDefined();
			expect(typeof data.processing_time).toBe('number');
		});
	});

	describe('Convert from File (Async)', () => {
		test('returns task id for async file conversion', async () => {
			if (!serverAvailable) {
				console.log('Skipping test: docling-serve not available');
				return;
			}

			const testContent = '# Async Test\n\nThis is a test.\n';
			const blob = new Blob([testContent], { type: 'text/markdown' });
			const formData = new FormData();
			formData.append('files', blob, 'test.md');

			const response = await fetch(`${BASE_URL}${ENDPOINTS.CONVERT_FILE_ASYNC}`, {
				method: 'POST',
				body: formData,
			});

			expect(response.ok).toBe(true);
			const data = await response.json();
			expect(data.task_id).toBeDefined();
			expect(typeof data.task_id).toBe('string');
			expect(data.task_status).toBeDefined();
		});

		test('async file conversion completes with polling', async () => {
			if (!serverAvailable) {
				console.log('Skipping test: docling-serve not available');
				return;
			}

			const testContent = '# Polling Test\n\nDocument for async polling test.\n';
			const blob = new Blob([testContent], { type: 'text/markdown' });
			const formData = new FormData();
			formData.append('files', blob, 'test.md');

			const createResponse = await fetch(`${BASE_URL}${ENDPOINTS.CONVERT_FILE_ASYNC}`, {
				method: 'POST',
				body: formData,
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

			if (status === 'success') {
				const resultResponse = await fetch(`${BASE_URL}${ENDPOINTS.RESULT}/${taskId}`);
				expect(resultResponse.ok).toBe(true);
				const resultData = await resultResponse.json();
				expect(resultData.document).toBeDefined();
			}
		}, 120000);
	});

	describe('Convert with Options', () => {
		test('accepts ocr_engine option via form data', async () => {
			if (!serverAvailable) {
				console.log('Skipping test: docling-serve not available');
				return;
			}

			const testContent = '# OCR Test\n\nTest document.\n';
			const blob = new Blob([testContent], { type: 'text/markdown' });
			const formData = new FormData();
			formData.append('files', blob, 'test.md');
			formData.append('ocr_engine', 'easyocr');

			const response = await fetch(`${BASE_URL}${ENDPOINTS.CONVERT_FILE}`, {
				method: 'POST',
				body: formData,
			});

			expect(response.ok).toBe(true);
			const data = await response.json();
			expect(data.status).toBe('success');
		});

		test('accepts document_timeout option via form data', async () => {
			if (!serverAvailable) {
				console.log('Skipping test: docling-serve not available');
				return;
			}

			const testContent = '# Timeout Test\n\nTest document.\n';
			const blob = new Blob([testContent], { type: 'text/markdown' });
			const formData = new FormData();
			formData.append('files', blob, 'test.md');
			formData.append('document_timeout', '300');

			const response = await fetch(`${BASE_URL}${ENDPOINTS.CONVERT_FILE}`, {
				method: 'POST',
				body: formData,
			});

			expect(response.ok).toBe(true);
			const data = await response.json();
			expect(data.status).toBe('success');
		});

		test('accepts options in JSON body for URL conversion', async () => {
			if (!serverAvailable) {
				console.log('Skipping test: docling-serve not available');
				return;
			}

			const TEST_URL = 'https://raw.githubusercontent.com/docling-project/docling/main/README.md';

			const response = await fetch(`${BASE_URL}${ENDPOINTS.CONVERT_SOURCE}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					sources: [{ kind: 'http', url: TEST_URL }],
					options: {
						ocr_engine: 'easyocr',
						document_timeout: 300,
					},
				}),
			});

			expect(response.ok).toBe(true);
			const data = await response.json();
			expect(data.status).toBe('success');
		});
	});
});
