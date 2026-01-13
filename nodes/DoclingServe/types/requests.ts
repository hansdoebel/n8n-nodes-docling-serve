import type { SourceItem } from './common';

export interface ConvertOptions {
	ocr_engine?: string;
	document_timeout?: number;
}

export interface TargetRequest {
	kind?: string;
}

export interface InBodyTarget extends TargetRequest {
	kind: 'in_body';
}

export interface ConvertSourceRequest {
	sources: SourceItem[];
	options?: ConvertOptions;
	target?: TargetRequest;
}

export interface ChunkingOptions {
	max_tokens?: number;
	merge_peers?: boolean;
}

export interface ChunkRequest {
	sources: SourceItem[];
	convert_options?: ConvertOptions;
	chunking_options?: ChunkingOptions;
	include_converted_doc?: boolean;
	target?: TargetRequest;
}
