import type {
	IExecuteFunctions,
	IHttpRequestMethods,
	IDataObject,
} from 'n8n-workflow';

export async function doclingApiRequest(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body?: IDataObject,
	qs?: IDataObject,
): Promise<unknown> {
	const credentials = await this.getCredentials('doclingServeApi');
	const baseUrl = credentials.baseUrl as string;
	const apiKey = credentials.apiKey as string;

	const options = {
		method,
		url: `${baseUrl}${endpoint}`,
		headers: {
			'Content-Type': 'application/json',
			...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
		},
		body,
		qs,
		json: true,
	};

	return this.helpers.httpRequest(options);
}
