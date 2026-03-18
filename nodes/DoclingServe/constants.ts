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
	CHUNK_HYBRID_SOURCE_ASYNC: '/v1/chunk/hybrid/source/async',
	CHUNK_HYBRID_FILE_ASYNC: '/v1/chunk/hybrid/file/async',
	CHUNK_HIERARCHICAL_SOURCE_ASYNC: '/v1/chunk/hierarchical/source/async',
	CHUNK_HIERARCHICAL_FILE_ASYNC: '/v1/chunk/hierarchical/file/async',
	HEALTH: '/health',
	READY: '/ready',
	VERSION: '/version',
	CLEAR_CONVERTERS: '/v1/clear/converters',
	CLEAR_RESULTS: '/v1/clear/results',
	MEMORY_STATS: '/v1/memory/stats',
	MEMORY_COUNTS: '/v1/memory/counts',
} as const;

export type EndpointKey = keyof typeof ENDPOINTS;
export type EndpointValue = (typeof ENDPOINTS)[EndpointKey];

export const OUTPUT_FORMATS = {
	MARKDOWN: 'markdown',
	HTML: 'html',
	JSON: 'json',
	DOCTAGS: 'doctags',
} as const;

export type OutputFormat = (typeof OUTPUT_FORMATS)[keyof typeof OUTPUT_FORMATS];

export const CHUNKER_TYPES = {
	HYBRID: 'hybrid',
	HIERARCHICAL: 'hierarchical',
} as const;

export type ChunkerType = (typeof CHUNKER_TYPES)[keyof typeof CHUNKER_TYPES];

export const POLLING = {
	DEFAULT_MAX_ATTEMPTS: 60,
	DEFAULT_INTERVAL_MS: 2000,
	COMPLETED_STATUSES: ['success', 'failure'],
} as const;

export const OPERATIONS = {
	DOCUMENT: {
		CONVERT_FROM_URL: 'convertFromUrl',
		CONVERT_FROM_FILE: 'convertFromFile',
		CONVERT_FROM_URL_ASYNC: 'convertFromUrlAsync',
		CONVERT_FROM_FILE_ASYNC: 'convertFromFileAsync',
	},
	TASK: {
		GET_STATUS: 'getStatus',
		GET_RESULT: 'getResult',
	},
	CHUNK: {
		CHUNK_FROM_URL: 'chunkFromUrl',
		CHUNK_FROM_FILE: 'chunkFromFile',
		CHUNK_FROM_URL_ASYNC: 'chunkFromUrlAsync',
		CHUNK_FROM_FILE_ASYNC: 'chunkFromFileAsync',
	},
	SYSTEM: {
		HEALTH_CHECK: 'healthCheck',
		READINESS_CHECK: 'readinessCheck',
		GET_VERSION: 'getVersion',
		CLEAR_CONVERTERS: 'clearConverters',
		CLEAR_RESULTS: 'clearResults',
		MEMORY_STATS: 'memoryStats',
		MEMORY_COUNTS: 'memoryCounts',
	},
} as const;

export const RESOURCES = {
	DOCUMENT: 'document',
	CHUNK: 'chunk',
	TASK: 'task',
	SYSTEM: 'system',
} as const;

export const OCR_ENGINES = {
	AUTO: 'auto',
	EASYOCR: 'easyocr',
	OCRMAC: 'ocrmac',
	RAPIDOCR: 'rapidocr',
	TESSEROCR: 'tesserocr',
	TESSERACT: 'tesseract',
} as const;

export const PIPELINES = {
	STANDARD: 'standard',
	VLM: 'vlm',
	ASR: 'asr',
	LEGACY: 'legacy',
} as const;

export const PDF_BACKENDS = {
	PYPDFIUM2: 'pypdfium2',
	DOCLING_PARSE: 'docling_parse',
	DLPARSE_V1: 'dlparse_v1',
	DLPARSE_V2: 'dlparse_v2',
	DLPARSE_V4: 'dlparse_v4',
} as const;

export const IMAGE_EXPORT_MODES = {
	PLACEHOLDER: 'placeholder',
	EMBEDDED: 'embedded',
	REFERENCED: 'referenced',
} as const;

export const TABLE_MODES = {
	FAST: 'fast',
	ACCURATE: 'accurate',
} as const;

export const INPUT_FORMATS = {
	DOCX: 'docx',
	PPTX: 'pptx',
	HTML: 'html',
	IMAGE: 'image',
	PDF: 'pdf',
	ASCIIDOC: 'asciidoc',
	MD: 'md',
	CSV: 'csv',
	XLSX: 'xlsx',
	XML_USPTO: 'xml_uspto',
	XML_JATS: 'xml_jats',
	XML_XBRL: 'xml_xbrl',
	METS_GBS: 'mets_gbs',
	JSON_DOCLING: 'json_docling',
	AUDIO: 'audio',
	VTT: 'vtt',
	LATEX: 'latex',
} as const;

export const API_OUTPUT_FORMATS = {
	MD: 'md',
	JSON: 'json',
	YAML: 'yaml',
	HTML: 'html',
	HTML_SPLIT_PAGE: 'html_split_page',
	TEXT: 'text',
	DOCTAGS: 'doctags',
	VTT: 'vtt',
} as const;
