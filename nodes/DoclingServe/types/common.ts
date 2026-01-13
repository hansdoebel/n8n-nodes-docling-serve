export type SourceKind = 'http' | 'file' | 's3';
export type ConversionStatus = 'success' | 'partial_success' | 'failure';
export type TaskStatus = 'pending' | 'started' | 'running' | 'success' | 'failure';

export interface SourceItem {
	kind: SourceKind;
	url?: string;
	base64?: string;
	filename?: string;
}

export interface ErrorItem {
	code: string;
	message: string;
}

export interface ProfilingItem {
	name: string;
	duration: number;
}
