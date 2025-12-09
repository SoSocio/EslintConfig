import eslint from '@eslint/js';
import stylisticJs from '@stylistic/eslint-plugin';
import pluginImport from 'eslint-plugin-import';
import pluginJsonc from 'eslint-plugin-jsonc';
import pluginPromise from 'eslint-plugin-promise';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import jsoncParser from 'jsonc-eslint-parser';
import typescriptEslint from 'typescript-eslint';

export const jsAndTsFilePatterns = [
	'**/*.cjs',
	'**/*.cts',
	'**/*.js',
	'**/*.jsx',
	'**/*.mjs',
	'**/*.mts',
	'**/*.ts',
	'**/*.tsx',
	'**/*.vue',
];
export const tsOnlyFilePatterns = [
	'**/*.cts',
	'**/*.mts',
	'**/*.ts',
	'**/*.tsx',
	'**/*.vue',
];
export const jsonFilePatterns = [
	'**/*.json',
	'**/*.json5',
	'**/*.jsonc',
];

export default defineConfig(
	{
		files: jsAndTsFilePatterns,
		extends: [
			eslint.configs.recommended,
			pluginImport.flatConfigs.recommended,
			pluginPromise.configs['flat/recommended'],
		],
		languageOptions: {
			globals: globals.node,
			parserOptions: {
				ecmaVersion: 2021,
				sourceType: 'module',
			},
		},
		plugins: {
			'@stylistic/js': stylisticJs,
		},
		rules: {
			'@stylistic/js/comma-dangle': [
				'error',
				'always-multiline',
			],
			'@stylistic/js/function-call-argument-newline': [
				'error',
				'always',
			],
			'@stylistic/js/function-paren-newline': [
				'error',
				'multiline-arguments',
			],
			'@stylistic/js/indent': [
				'error',
				'tab',
				{
					'SwitchCase': 1,
				},
			],
			'@stylistic/js/padded-blocks': [
				'error',
				'never',
			],
			'@stylistic/js/semi': 'error',
			// Reason: Class methods that don't use this can be turned to static methods, but it required code refactoring, so we won't enforce this right now
			'class-methods-use-this': 'warn',
			// Reason: Console log messages can be very helpful in debugging and monitoring
			'no-console': 'off',
			'no-multiple-empty-lines': [
				'error',
				{
					max: 1,
					maxBOF: 0,
					maxEOF: 0,
				},
			],
			'quotes': [
				'error',
				'single',
				{
					'avoidEscape': true,
				},
			],
		},
	},
	{
		files: tsOnlyFilePatterns,
		extends: [
			...typescriptEslint.configs.recommended,
		],
		languageOptions: {
			parser: typescriptEslint.parser,
			parserOptions: {
				ecmaVersion: 2021,
				sourceType: 'module',
			},
		},
		rules: {
			// Reason: we DON'T allow @ts-ignore to be used, only @ts-expect-error with a description of at least 3 characters
			'@typescript-eslint/ban-ts-comment': 'error',
			'@typescript-eslint/no-shadow': 'error',
			'@typescript-eslint/no-unused-vars': 'error',
			'@typescript-eslint/no-use-before-define': 'off',
			// Reason: no-shadow must be disabled because we're using @typescript-eslint/no-shadow
			'no-shadow': 'off',
			'no-undef': 'off',
			// Reason: no-unused-vars must be disabled because we're using @typescript-eslint/no-unused-vars
			'no-unused-vars': 'off',
			// Reason: no-use-before-define must be disabled because we're using @typescript-eslint/no-use-before-define
			'no-use-before-define': 'off',
		},
	},
	{
		files: jsonFilePatterns,
		languageOptions: {
			parser: jsoncParser,
		},
		extends: [
			pluginJsonc.configs['flat/recommended-with-jsonc'],
		],
		rules: {
			'jsonc/no-useless-escape': 'off',
		},
	},
	{
		files: jsAndTsFilePatterns,
		settings: {
			'import/resolver': {
				typescript: {
					alwaysTryTypes: true,
					project: [
						'./tsconfig.json',
					],
				},
			},
		},
	}
);
