import { describe, test, expect } from 'bun:test';
import { isBinaryDataAvailable } from '../../nodes/DoclingServe/helpers/binary';
import type { IBinaryData } from 'n8n-workflow';

describe('Binary Helper Tests', () => {
	describe('isBinaryDataAvailable', () => {
		test('returns true when binary data has data property', () => {
			const binaryData = {
				data: 'base64encodeddata',
				mimeType: 'application/pdf',
				fileName: 'test.pdf',
			} as IBinaryData;

			expect(isBinaryDataAvailable(binaryData)).toBe(true);
		});

		test('returns false when binary data is undefined', () => {
			expect(isBinaryDataAvailable(undefined)).toBe(false);
		});

		test('returns false when data property is undefined', () => {
			const binaryData = {
				mimeType: 'application/pdf',
			} as IBinaryData;

			expect(isBinaryDataAvailable(binaryData)).toBe(false);
		});
	});
});
