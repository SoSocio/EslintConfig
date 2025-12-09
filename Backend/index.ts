import typescriptEslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import promisePlugin from 'eslint-plugin-promise';
import { defineConfig } from 'eslint/config';
import baseConfig from '@sosocio/eslint-config';

const config = defineConfig(
	// Reuse the shared base config exported at EslintConfig/index.ts
	baseConfig,

	// TypeScript + Node environment using recommended flat configs
	typescriptEslint.configs.recommended,
	{
		languageOptions: {
			parser: typescriptEslint.parser,
			ecmaVersion: 2018,
			sourceType: 'module',
			parserOptions: {
				ecmaVersion: 2018,
				sourceType: 'module',
				project: ['./tsconfig.json'],
			},
		},
		plugins: {
			import: importPlugin,
			promise: promisePlugin,
		},
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
			// Imports
			'import/extensions': [
				'error',
				'ignorePackages',
				{ js: 'never', jsx: 'never', ts: 'never', tsx: 'never' },
			],
			'import/no-import-module-exports': 'off',
			// TS specifics
			'@typescript-eslint/ban-ts-comment': 'off',
			'@typescript-eslint/no-unused-vars': ['warn'],
			'@typescript-eslint/explicit-module-boundary-types': 'off',
			'@typescript-eslint/no-floating-promises': ['error'],
			// Disable base rule here; enable for JS in per-file override
			'no-unused-vars': 'off',
		},
	},

	// File-specific overrides
	{
		files: ['**/*.ts'],
		rules: {
			indent: 'off',
			'@typescript-eslint/indent': ['error', 'tab', { SwitchCase: 1 }],
			'@typescript-eslint/no-explicit-any': 'error',
			// Enforce no unused variables for TS
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '[iI]gnored',
				},
			],
		},
	},
	{
		files: ['**/*.js'],
		rules: {
			'@typescript-eslint/no-var-requires': 'off',
			'@typescript-eslint/explicit-function-return-type': 'off',
			// Enable base rule for JS files only
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
	},
);

export default config;
