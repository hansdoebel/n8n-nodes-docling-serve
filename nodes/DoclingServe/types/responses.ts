import type { ConversionStatus, ErrorItem, ProfilingItem, TaskStatus } from './common';

export interface ExportDocumentResponse {
	markdown?: string;
	html?: string;
	json?: object;
	doctags?: string;
}

export interface ConvertResponse {
	document: ExportDocumentResponse;
	status: ConversionStatus;
	errors: ErrorItem[];
	processing_time: number;
	timings?: Record<string, ProfilingItem>;
}

export interface TaskProcessingMeta {
	progress?: number;
	message?: string;
}

export interface TaskStatusResponse {
	task_id: string;
	task_type: string;
	task_status: TaskStatus;
	task_position?: number;
	task_meta?: TaskProcessingMeta;
}

export interface HealthResponse {
	status: string;
}

export interface ChunkItem {
	text: string;
	meta?: Record<string, unknown>;
}

export interface ChunkedDocumentResultItem {
	chunks: ChunkItem[];
	source_filename?: string;
}

export interface ChunkResponse {
	chunks: ChunkedDocumentResultItem[];
	documents?: ExportDocumentResponse[];
	processing_time: number;
}
