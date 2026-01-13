export const OUTPUT_FORMATS = {
	MARKDOWN: 'markdown',
	HTML: 'html',
	JSON: 'json',
	DOCTAGS: 'doctags',
} as const;

export type OutputFormat = (typeof OUTPUT_FORMATS)[keyof typeof OUTPUT_FORMATS];
