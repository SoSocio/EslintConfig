import baseConfig, {
	jsAndTsFilePatterns,
	tsOnlyFilePatterns,
} from '@sosocio/eslint-config';
import { defineConfig } from 'eslint/config';
import { parser as typescriptEslintParser } from 'typescript-eslint';

export default defineConfig(
	// Shared base config
	baseConfig,
	{
		files: jsAndTsFilePatterns,
		languageOptions: {
			parser: typescriptEslintParser,
			ecmaVersion: 2018,
			sourceType: 'module',
			parserOptions: {
				sourceType: 'module',
				project: ['./tsconfig.json'],
			},
		},

		settings: {
			'import/parsers': {
				'@typescript-eslint/parser': [
					'.ts',
					'.tsx',
				],
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
			indent: [
				'error',
				'tab',
				{
					SwitchCase: 1,
				},
			],

			// Console
			'no-console': 'off',

			// Naming
			camelcase: 'off',
		},
	},

	/**
	 * TypeScript overrides
	 */
	{
		files: tsOnlyFilePatterns,
		rules: {
			// Indentation
			indent: [
				'error',
				'tab',
				{
					SwitchCase: 1,
				},
			],

			// Floating promises is still safe to keep globally
			'@typescript-eslint/no-floating-promises': ['error'],

			// Redeclaration (TS only)
			'@typescript-eslint/no-redeclare': ['error'],

			// TS-specific rules (moved from base to remove duplication)
			'@typescript-eslint/no-explicit-any': 'error',
			'@typescript-eslint/ban-ts-comment': 'off',
			'@typescript-eslint/explicit-module-boundary-types': 'off',

			// Imports
			'import/no-import-module-exports': 'off',
			'import/named': 'off',
		},
	},
);
