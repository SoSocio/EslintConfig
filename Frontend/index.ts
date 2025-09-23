import fasteditor from '@sosocio/eslint-config';
import pluginVue from 'eslint-plugin-vue';
import pluginVuePug from 'eslint-plugin-vue-pug';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import typescriptEslint from 'typescript-eslint';
import vueEslint from 'vue-eslint-parser';

export default defineConfig(
    fasteditor,
    {
		files: [
			'**/*.vue',
		],
        extends: [
            pluginVue.configs['flat/recommended'],
            pluginVuePug.configs['flat/recommended'],
        ],
        languageOptions: {
            globals: globals.browser,
            parser: vueEslint,
            parserOptions: {
                ecmaVersion: 2021,
                parser: typescriptEslint.parser,
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
    }
);
