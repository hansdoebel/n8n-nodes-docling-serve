import { config } from '@n8n/node-cli/eslint';

export default [
	...config,
	{
		ignores: ['tests/**/*'],
	},
	{
		rules: {
			'n8n-nodes-base/node-param-default-missing': 'off',
			'n8n-nodes-base/node-param-type-options-password-missing': 'off',
		},
	},
];
