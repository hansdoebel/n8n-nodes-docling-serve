import type { SourceItem } from './common';

export interface ConvertOptions {
	ocr_engine?: string;
	document_timeout?: number;
	image_export_mode?: string;
	do_ocr?: boolean;
	force_ocr?: boolean;
	table_mode?: string;
	pipeline?: string;
	do_table_structure?: boolean;
	include_images?: boolean;
	images_scale?: number;
	ocr_lang?: string[];
	pdf_backend?: string;
	table_cell_matching?: boolean;
	page_range?: number[];
	abort_on_error?: boolean;
	md_page_break_placeholder?: string;
	from_formats?: string[];
	to_formats?: string[];
	do_code_enrichment?: boolean;
	do_formula_enrichment?: boolean;
	do_picture_classification?: boolean;
	do_chart_extraction?: boolean;
	do_picture_description?: boolean;
	picture_description_area_threshold?: number;
	vlm_pipeline_preset?: string;
	picture_description_preset?: string;
	code_formula_preset?: string;
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
	include_raw_text?: boolean;
	tokenizer?: string;
	use_markdown_tables?: boolean;
}

export interface ChunkRequest {
	sources: SourceItem[];
	convert_options?: ConvertOptions;
	chunking_options?: ChunkingOptions;
	include_converted_doc?: boolean;
	target?: TargetRequest;
}
