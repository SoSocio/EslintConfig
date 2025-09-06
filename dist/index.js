import eslint from '@eslint/js';
import globals from 'globals';
import typescriptEslint from 'typescript-eslint';
import stylisticJs from '@stylistic/eslint-plugin';
import { defineConfig } from 'eslint/config';
export default defineConfig({
    extends: [
        eslint.configs.recommended,
        ...typescriptEslint.configs.recommended,
    ],
    languageOptions: {
        globals: globals.node,
        parser: typescriptEslint.parser,
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
            {
                'minItems': 2,
            },
        ],
        '@stylistic/js/indent': [
            'error',
            'tab',
            {
                'SwitchCase': 1,
            },
        ],
        '@stylistic/js/semi': 'error',
        // Reason: we DON'T allow @ts-ignore to be used, only @ts-expect-error
        '@typescript-eslint/ban-ts-comment': 'error',
        '@typescript-eslint/no-shadow': 'error',
        '@typescript-eslint/no-unused-vars': 'error',
        '@typescript-eslint/no-use-before-define': 'off',
        // Reason: Class methods that don't use this can be turned to static methods, but it required code refactoring, so we won't enforce this right now
        'class-methods-use-this': 'warn',
        // Reason: Console log messages can be very helpful in debugging and monitoring
        'no-console': 0,
        // Reason: no-shadow must be disabled because we're using @typescript-eslint/no-shadow
        'no-shadow': 'off',
        // Reason: no-unused-vars must be disabled because we're using @typescript-eslint/no-unused-vars
        'no-unused-vars': 'off',
        // Reason: no-use-before-define must be disabled because we're using @typescript-eslint/no-use-before-define
        'no-use-before-define': 'off',
        'quotes': [
            'error',
            'single',
            {
                'avoidEscape': true,
            },
        ],
    },
});
