import typescriptEslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import baseConfig from '@sosocio/eslint-config';

// Reuse baseConfig + TypeScript recommended configs
const config = defineConfig(
	baseConfig,
	typescriptEslint.configs.recommended,

	{
		languageOptions: {
			parser: typescriptEslint.parser,
			ecmaVersion: 2018,
			sourceType: 'module',
			parserOptions: {
				sourceType: 'module',
				project: ['./tsconfig.json'],
			},
		},

		/**
		 * Avoid redeclaring plugins — baseConfig already loads import/promise
		 */
		settings: {
			'import/parsers': {
				'@typescript-eslint/parser': ['.ts', '.tsx'],
			},
			'import/resolver': {
				typescript: {
					project: ['./tsconfig.json'],
					alwaysTryTypes: true,
				},
			},
		},

		rules: {
			// Formatting
			'no-tabs': 'off',
			indent: ['error', 'tab', { SwitchCase: 1 }],

			// Console
			'no-console': 'off',

			// Naming
			camelcase: 'off',

			// Shadowing
			'no-shadow': ['error'],
			'@typescript-eslint/no-shadow': ['error'],

			// TS specifics
			'@typescript-eslint/ban-ts-comment': 'off',
			'@typescript-eslint/no-unused-vars': ['warn'],
			'@typescript-eslint/explicit-module-boundary-types': 'off',
			'@typescript-eslint/no-floating-promises': ['error'],

			// Disable base rule; enabled per-file for JS
			'no-unused-vars': 'off',
		},
	},

	// TypeScript overrides
	{
		files: ['**/*.ts'],
		rules: {
			indent: ['error', 'tab', { SwitchCase: 1 }],
			'@typescript-eslint/no-explicit-any': 'error',

			'no-undef': 'off',
			'no-shadow': 'off',
			'no-unused-vars': 'off',

			'@typescript-eslint/no-shadow': ['error'],
			'no-redeclare': 'off',
			'@typescript-eslint/no-redeclare': ['error'],

			'@typescript-eslint/ban-ts-comment': 'off',
			'@typescript-eslint/no-unused-vars': ['warn'],
			'@typescript-eslint/explicit-module-boundary-types': 'off',

			'import/no-import-module-exports': 'off',
			'import/named': 'off',
		},
	},

	// JavaScript overrides
	{
		files: ['**/*.js'],
		rules: {
			'@typescript-eslint/no-var-requires': 'off',
			'@typescript-eslint/no-require-imports': 'off',
			'@typescript-eslint/explicit-function-return-type': 'off',

			// JS-only unused vars rules
			'no-unused-vars': [
				'error',
				{
					vars: 'all',
					args: 'all',
					argsIgnorePattern: '^_',
					varsIgnorePattern: '[iI]gnored',
				},
			],
		},
	}
);

export default config;
