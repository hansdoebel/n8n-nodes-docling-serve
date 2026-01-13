import type { IExecuteFunctions, IBinaryData } from 'n8n-workflow';

export async function prepareBinaryData(
	this: IExecuteFunctions,
	itemIndex: number,
	binaryPropertyName: string,
): Promise<{ base64: string; filename: string; mimeType: string }> {
	const binaryData = this.helpers.assertBinaryData(itemIndex, binaryPropertyName);
	const buffer = await this.helpers.getBinaryDataBuffer(itemIndex, binaryPropertyName);

	return {
		base64: buffer.toString('base64'),
		filename: binaryData.fileName ?? 'document',
		mimeType: binaryData.mimeType ?? 'application/octet-stream',
	};
}

export function isBinaryDataAvailable(binaryData: IBinaryData | undefined): boolean {
	return binaryData !== undefined && binaryData.data !== undefined;
}
