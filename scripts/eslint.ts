import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);
const eslintPackagePath = require.resolve('eslint/package.json');
const eslintBinPath = path.join(
	path.dirname(eslintPackagePath),
	'bin',
	'eslint.js',
);
const eslintCacheLocation = path.join(
	'node_modules',
	'.cache',
	'eslint',
	`.eslintcache-${getCacheKey([
		'eslint.config.mts',
		'tsconfig.json',
	])}`,
);
const defaultTargets = [
	'.',
	'Backend',
	'Frontend',
	'types',
	'scripts',
];
const baseArgs = [
	'--cache',
	'--cache-location',
	eslintCacheLocation,
	'--config',
	'eslint.config.mts',
];
const optionArgsWithValue = new Set([
	'--cache-location',
	'--config',
	'-c',
	'--env',
	'--ext',
	'--format',
	'-f',
	'--global',
	'--ignore-pattern',
	'--max-warnings',
	'--output-file',
	'-o',
	'--parser',
	'--parser-options',
	'--plugin',
	'--report-unused-disable-directives',
	'--resolve-plugins-relative-to',
	'--rule',
	'--stdin-filename',
]);

/**
 * Determines whether the CLI arguments include explicit target paths or globs.
 *
 * @param args CLI arguments to inspect.
 * @returns True when at least one target path or glob is provided.
 */
function hasTargetArgs(args: string[]): boolean {
	let shouldSkipNext = false;

	for (let index = 0; index < args.length; index += 1) {
		const arg = args[index];

		if (shouldSkipNext) {
			shouldSkipNext = false;
		} else if (arg === '--') {
			return index < args.length - 1;
		} else if (arg.startsWith('-')) {
			if (!arg.includes('=') && optionArgsWithValue.has(arg)) {
				shouldSkipNext = true;
			}
		} else {
			return true;
		}
	}

	return false;
}

/**
 * Generates a cache key based on the modification times of config files.
 *
 * @param filePaths Config file paths to inspect.
 * @returns Hash suitable for cache file naming.
 */
function getCacheKey(filePaths: string[]): string {
	const fileStats = filePaths.map((filePath) => {
		try {
			return fs
				.statSync(
					path.resolve(filePath),
				)
				.mtimeMs
				.toString();
		} catch {
			return 'missing';
		}
	});

	return crypto
		.createHash('sha1')
		.update(fileStats.join('|'))
		.digest('hex');
}

const providedArgs = process.argv.slice(2);
const hasExplicitTargets = hasTargetArgs(providedArgs);

const eslintArgs = [
	...baseArgs,
	...providedArgs,
];

if (!hasExplicitTargets) {
	eslintArgs.push(...defaultTargets);
}

const result = spawnSync(
	process.execPath,
	[
		eslintBinPath,
		...eslintArgs,
	],
	{
		stdio: 'inherit',
	},
);
const exitCode = (
	typeof result.status === 'number'
		? result.status
		: 1
);

process.exit(exitCode);
