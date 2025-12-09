import typescriptEslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import baseConfig from '@sosocio/eslint-config';

const config = defineConfig(
	// Shared base config
	baseConfig,

	// TS recommended configs
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


			// Floating promises is still safe to keep globally
			'@typescript-eslint/no-floating-promises': ['error'],

			/**
			 * Disable the base unused-vars entirely globally; JS will override it.
			 */
			'no-unused-vars': 'off',
		},
	},

	/**
	 * TypeScript overrides
	 */
	{
		files: ['**/*.ts'],
		rules: {
			// Indentation
			indent: ['error', 'tab', { SwitchCase: 1 }],

			// Shadowing (TS only)
			'no-shadow': 'off',
			'@typescript-eslint/no-shadow': ['error'],

			// Redeclaration (TS only)
			'no-redeclare': 'off',
			'@typescript-eslint/no-redeclare': ['error'],

			// TS-specific rules (moved from base to remove duplication)
			'@typescript-eslint/no-explicit-any': 'error',
			'@typescript-eslint/ban-ts-comment': 'off',
			'@typescript-eslint/no-unused-vars': ['warn'],
			'@typescript-eslint/explicit-module-boundary-types': 'off',

			// Imports
			'import/no-import-module-exports': 'off',
			'import/named': 'off',

			// JS-only rules disabled in TS
			'no-undef': 'off',
			'no-unused-vars': 'off',
		},
	},

	/**
	 * JavaScript overrides
	 */
	{
		files: ['**/*.js'],
		rules: {
			'@typescript-eslint/no-var-requires': 'off',
			'@typescript-eslint/no-require-imports': 'off',
			'@typescript-eslint/explicit-function-return-type': 'off',

			// JS-only unused-vars rules
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
