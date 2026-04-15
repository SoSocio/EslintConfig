import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import { defineConfig } from 'eslint/config';
import pluginImport from 'eslint-plugin-import';
import pluginJsonc from 'eslint-plugin-jsonc';
import pluginPromise from 'eslint-plugin-promise';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import * as jsoncParser from 'jsonc-eslint-parser';
import {
	configs as typescriptEslintConfigs,
	parser as typescriptEslintParser,
} from 'typescript-eslint';

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
			'@stylistic': stylistic,
			'simple-import-sort': simpleImportSort,
		},
		rules: {
			'@stylistic/array-bracket-newline': [
				'error',
				{
					multiline: true,
				},
			],
			'@stylistic/comma-dangle': [
				'error',
				'always-multiline',
			],
			'@stylistic/function-call-argument-newline': [
				'error',
				'always',
			],
			'@stylistic/function-paren-newline': [
				'error',
				'multiline-arguments',
			],
			'@stylistic/indent': [
				'error',
				'tab',
				{
					'SwitchCase': 1,
					'ignoreComments': false,
				},
			],
			'@stylistic/multiline-comment-style': [
				'warn',
				'starred-block',
			],
			'@stylistic/object-curly-newline': [
				'error',
				{
					ObjectExpression: {
						multiline: true,
						minProperties: 1,
					},
					ObjectPattern: {
						multiline: true,
					},
					ImportDeclaration: {
						multiline: true,
						minProperties: 2,
					},
				},
			],
			'@stylistic/object-curly-spacing': [
				'error',
				'always',
			],
			'@stylistic/object-property-newline': [
				'error',
				{
					allowAllPropertiesOnSameLine: false,
				},
			],
			'@stylistic/padded-blocks': [
				'error',
				'never',
			],
			'@stylistic/semi': 'error',
			'simple-import-sort/imports': 'error',
			/**
			 * Reason: Class methods that don't use this can be turned to static methods, but it required code refactoring, so we won't enforce this right now
			 */
			'class-methods-use-this': 'warn',
			'func-style': [
				'warn',
				'declaration',
				{
					allowArrowFunctions: true,
				},
			],
			/**
			 * Reason: Console log messages can be very helpful in debugging and monitoring
			 */
			'no-console': [
				'warn',
				{
					allow: [
						'error',
						'warn',
					],
				},
			],
			'no-multiple-empty-lines': [
				'error',
				{
					max: 1,
					maxBOF: 0,
					maxEOF: 0,
				},
			],
			'no-trailing-spaces': [
				'error',
				{
					skipBlankLines: false,
				},
			],
			'padding-line-between-statements': [
				'error',
				{
					blankLine: 'always',
					prev: [
						'const',
						'let',
						'var',
					],
					next: 'if',
				},
				{
					blankLine: 'always',
					prev: 'if',
					next: [
						'const',
						'let',
						'var',
						'expression',
					],
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
		settings: {
			'import/resolver': {
				typescript: {
					project: './tsconfig.json',
				},
			},
			http: {
				requestOptions: {
					agent: false,
				},
			},
		},
	},
	{
		files: tsOnlyFilePatterns,
		extends: [...typescriptEslintConfigs.recommended],
		languageOptions: {
			parser: typescriptEslintParser,
			parserOptions: {
				ecmaVersion: 2021,
				sourceType: 'module',
			},
		},
		rules: {
			/**
			 * Reason: we DON'T allow @ts-ignore to be used, only @ts-expect-error with a description of at least 3 characters
			 */
			'@typescript-eslint/ban-ts-comment': 'error',
			'@typescript-eslint/no-shadow': 'error',
			'@typescript-eslint/no-unused-vars': 'error',
			'@typescript-eslint/no-use-before-define': 'off',
			/**
			 * Reason: no-shadow must be disabled because we're using @typescript-eslint/no-shadow
			 */
			'no-shadow': 'off',
			'no-undef': 'off',
			/**
			 * Reason: no-unused-vars must be disabled because we're using @typescript-eslint/no-unused-vars
			 */
			'no-unused-vars': 'off',
			/**
			 * Reason: no-use-before-define must be disabled because we're using @typescript-eslint/no-use-before-define
			 */
			'no-use-before-define': 'off',
		},
	},
	{
		files: jsonFilePatterns,
		languageOptions: {
			parser: jsoncParser,
		},
		extends: [pluginJsonc.configs['flat/recommended-with-jsonc']],
		rules: {
			'jsonc/indent': [
				'error',
				'tab',
			],
			'jsonc/no-useless-escape': 'off',
			'no-mixed-spaces-and-tabs': 'error',
		},
	},
	{
		files: jsAndTsFilePatterns,
		settings: {
			'import/resolver': {
				typescript: {
					alwaysTryTypes: true,
					project: ['./tsconfig.json'],
				},
			},
		},
	},
);
