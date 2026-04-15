import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
	type Config,
	defineConfig,
} from 'eslint/config';

import backendConfig from './Backend/index.ts';

const configDir = dirname(fileURLToPath(import.meta.url));
const tsconfigProject = ['./tsconfig.json'];

type ImportResolverSettings = Record<string, unknown> & {
	typescript?: Record<string, unknown>;
};

const repoConfig = backendConfig.map((config) => ({
	...config,
	...getLanguageOptionsConfig(config),
	...getSettingsConfig(config),
}));

export default defineConfig(
	{
		ignores: [
			'**/dist/**',
			'**/node_modules/**',
			'*.tgz',
			'pnpm-lock.yaml',
		],
	},
	...repoConfig,
);

function getLanguageOptionsConfig(config: Config) {
	if (!config.languageOptions?.parserOptions) {
		return {};
	}

	return {
		languageOptions: {
			...config.languageOptions,
			parserOptions: {
				...config.languageOptions.parserOptions,
				project: tsconfigProject,
				tsconfigRootDir: configDir,
			},
		},
	};
}

function getSettingsConfig(config: Config) {
	const importResolverSettings = config.settings?.['import/resolver'] as ImportResolverSettings | undefined;
	const typescriptResolver = importResolverSettings?.typescript;

	if (!typescriptResolver) {
		return {};
	}

	return {
		settings: {
			...config.settings,
			'import/resolver': {
				...importResolverSettings,
				typescript: {
					...typescriptResolver,
					project: tsconfigProject,
				},
			},
		},
	};
}
