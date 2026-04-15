import fasteditor, { jsAndTsFilePatterns } from '@sosocio/eslint-config';
import { defineConfig } from 'eslint/config';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import pluginVue from 'eslint-plugin-vue';
import pluginVuePug from 'eslint-plugin-vue-pug';
import globals from 'globals';
import { parser as typescriptEslintParser } from 'typescript-eslint';
import vueEslint from 'vue-eslint-parser';

export default defineConfig(
	fasteditor,
	{
		files: ['**/*.vue'],
		extends: [
			pluginVue.configs['flat/recommended'],
			pluginVuePug.configs['flat/recommended'],
		],
		languageOptions: {
			parser: vueEslint,
			parserOptions: {
				ecmaVersion: 2021,
				parser: typescriptEslintParser,
				sourceType: 'module',
			},
		},
		rules: {
			'vue/html-indent': [
				'error',
				'tab',
			],
			'vue/multi-word-component-names': 'off',
			'vue/no-v-html': 'off',
		},
	},
	{
		files: jsAndTsFilePatterns,
		languageOptions: {
			globals: globals.browser,
		},
		plugins: {
			'simple-import-sort': simpleImportSort,
		},
		rules: {
			'simple-import-sort/imports': [
				'error',
				{
					groups: [
						[
							// 1) side-effect imports (no 'from'), except css
							'^\\u0000(?!.+\\.(css|less)$)',
							// 2) non-dot paths (packages + aliases)
							'^[^.]',
							// 3) dot-starting relatives
							'^\\.',
							// 4) side-effect css/less
							'^\\u0000.+\\.(css|less)$',
						],
					],
				},
			],
		},
	},
	{
		files: jsAndTsFilePatterns,
		languageOptions: {
			globals: {
				window: 'readonly',
			},
		},
	},
);
