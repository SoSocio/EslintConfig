import pluginVue from 'eslint-plugin-vue';
import globals from 'globals';
import pluginVuePug from 'eslint-plugin-vue-pug';
import typescriptEslint from 'typescript-eslint';
import vueEslint from 'vue-eslint-parser';
import { defineConfig } from 'eslint/config';
export default defineConfig({
    extends: [
        '@sosocio/eslint-config',
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
        'vue/multi-word-component-names': 'off',
    },
});
