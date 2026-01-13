export const CHUNKER_TYPES = {
	HYBRID: 'hybrid',
	HIERARCHICAL: 'hierarchical',
} as const;

export type ChunkerType = (typeof CHUNKER_TYPES)[keyof typeof CHUNKER_TYPES];
