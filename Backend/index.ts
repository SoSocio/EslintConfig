import typescriptEslint from 'typescript-eslint';
// Rely on plugins via baseConfig extends to avoid duplicate registration
import { defineConfig } from 'eslint/config';
import baseConfig from '@sosocio/eslint-config';
const config = defineConfig(
	// Reuse the shared base config exported at EslintConfig/index.ts
	baseConfig,
	// TypeScript + Node environment using recommended flat configs
	typescriptEslint.configs.recommended, {
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
	* Do not redeclare plugins here; `baseConfig` already extends
	* import/promise recommended configs which register plugins.
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
		/**
		* Import rules are provided by `pluginImport.flatConfigs.recommended`
		* via `baseConfig`. Avoid redefining here to prevent plugin key
		* collisions under ESLint v9 flat config.
		*/
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
			// Use core indent rule; the TS-specific indent rule is deprecated
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
	}, {
	files: ['**/*.js'],
	rules: {
		'@typescript-eslint/no-var-requires': 'off',
		'@typescript-eslint/no-require-imports': 'off',
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
});
export default config;
