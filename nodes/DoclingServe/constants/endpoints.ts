export const ENDPOINTS = {
	CONVERT_SOURCE: '/v1/convert/source',
	CONVERT_FILE: '/v1/convert/file',
	CONVERT_SOURCE_ASYNC: '/v1/convert/source/async',
	CONVERT_FILE_ASYNC: '/v1/convert/file/async',
	STATUS_POLL: '/v1/status/poll',
	RESULT: '/v1/result',
	CHUNK_HYBRID_SOURCE: '/v1/chunk/hybrid/source',
	CHUNK_HYBRID_FILE: '/v1/chunk/hybrid/file',
	CHUNK_HIERARCHICAL_SOURCE: '/v1/chunk/hierarchical/source',
	CHUNK_HIERARCHICAL_FILE: '/v1/chunk/hierarchical/file',
	HEALTH: '/health',
} as const;

export type EndpointKey = keyof typeof ENDPOINTS;
export type EndpointValue = (typeof ENDPOINTS)[EndpointKey];
