#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import {
	existsSync,
	readFileSync,
	writeFileSync,
} from 'node:fs';
import {
	join,
	resolve,
} from 'node:path';

const rootDir = resolve(process.env.ROOT_DIR ?? process.cwd());
const circleTag = process.env.CIRCLE_TAG ?? '';
const publishTarget = process.env.PUBLISH_TARGET ?? '';
const dryRunArgs = parseShellWords(process.env.ISDRYRUN ?? '');
const cliArgs = process.argv.slice(2);
const shouldPack = cliArgs.includes('--dry-run');
const shouldPublish = cliArgs.includes('--publish');
const packDestination = resolve(process.env.PACK_DESTINATION ?? rootDir);

const targets = {
	base: {
		dir: rootDir,
		name: '@sosocio/eslint-config',
	},
	frontend: {
		dir: join(
			rootDir,
			'Frontend',
		),
		name: '@sosocio/eslint-config-frontend',
	},
	backend: {
		dir: join(
			rootDir,
			'Backend',
		),
		name: '@sosocio/eslint-config-backend',
	},
};

const buildOrder = [
	'base',
	'frontend',
	'backend',
];

main();

function main() {
	validateCliArgs();

	if (
		shouldPack
		|| (
			!shouldPublish
			&& !circleTag
		)
	) {
		runPack();
		return;
	}

	if (
		shouldPublish
		|| circleTag
	) {
		runRelease();
		return;
	}
}

function runPack() {
	console.log('Running in PACK mode (dry run, no publish).');
	installWorkspace();

	for (const targetKey of buildOrder) {
		buildTarget(targetKey);
	}

	for (const targetKey of buildOrder) {
		packTarget(targetKey);
	}

	console.log('Done');
}

function runRelease() {
	if (!circleTag) {
		fail('CIRCLE_TAG must be set for publish mode.');
	}

	console.log(`Running in RELEASE mode for tag: ${circleTag}`);

	if (!Object.hasOwn(
		targets,
		publishTarget,
	)) {
		fail('PUBLISH_TARGET must be set to one of: base, frontend, backend.');
	}

	const packageVersion = circleTag.replace(
		/^v/,
		'',
	);
	const target = targets[publishTarget];
	const publishTag = getPublishTag(packageVersion);

	installWorkspace();
	setPackageVersion(
		targets.base.dir,
		packageVersion,
	);

	if (publishTarget !== 'base') {
		setPackageVersion(
			target.dir,
			packageVersion,
		);
	}

	buildTarget('base');

	if (publishTarget !== 'base') {
		buildTarget(publishTarget);
	}

	publishPackage(
		target,
		publishTag,
	);
	console.log(`${target.name} published.`);
	console.log('Done');
}

function installWorkspace() {
	console.log('Installing workspace dependencies...');
	run(
		'pnpm',
		[
			'install',
			'--frozen-lockfile',
		],
		{
			cwd: rootDir,
		},
	);
}

function buildTarget(targetKey) {
	const target = targets[targetKey];

	console.log(`Building ${target.name}...`);
	run(
		'pnpm',
		[
			'--filter',
			target.name,
			'run',
			'build',
		],
		{
			cwd: rootDir,
		},
	);
}

function packTarget(targetKey) {
	const target = targets[targetKey];
	console.log(`Packing ${target.name}...`);
	run(
		'pnpm',
		[
			'pack',
			'--pack-destination',
			packDestination,
		],
		{
			cwd: target.dir,
		},
	);
}

function publishPackage(
	target,
	publishTag,
) {
	const publishArgs = [
		'publish',
		'--no-git-checks',
		...getPublishTagArgs(publishTag),
		...dryRunArgs,
	];

	console.log(`Publishing ${target.name}...`);
	run(
		'pnpm',
		publishArgs,
		{
			cwd: target.dir,
		},
	);
}

function getPublishTag(packageVersion) {
	if (process.env.PUBLISH_TAG?.trim()) {
		return process.env.PUBLISH_TAG.trim();
	}

	const prereleaseSeparatorIndex = packageVersion.indexOf('-');

	if (prereleaseSeparatorIndex === -1) {
		return '';
	}

	const prereleaseVersion = packageVersion.slice(prereleaseSeparatorIndex + 1);

	return prereleaseVersion.split('.')[0];
}

function getPublishTagArgs(publishTag) {
	if (!publishTag) {
		return [];
	}

	console.log(`Publishing with dist-tag '${publishTag}'.`);

	return [
		'--tag',
		publishTag,
	];
}

function setPackageVersion(packageDir, packageVersion) {
	const packageJsonPath = join(
		packageDir,
		'package.json',
	);

	if (!existsSync(packageJsonPath)) {
		fail(`Expected package.json at ${packageJsonPath}`);
	}

	const packageJson = JSON.parse(readFileSync(
		packageJsonPath,
		'utf8',
	));

	if (packageJson.version === packageVersion) {
		console.log(`${packageJson.name} already has version ${packageVersion}.`);
		return;
	}

	packageJson.version = packageVersion;
	writeFileSync(
		packageJsonPath,
		`${JSON.stringify(
			packageJson,
			null,
			'\t',
		)}\n`,
	);
	console.log(`Set ${packageJson.name} version to ${packageVersion}.`);
}

function parseShellWords(value) {
	const trimmedValue = value.trim();

	if (!trimmedValue) {
		return [];
	}

	return trimmedValue.split(/\s+/u);
}

function validateCliArgs() {
	const allowedArgs = new Set([
		'--dry-run',
		'--publish',
	]);
	const unknownArgs = cliArgs.filter((arg) => !allowedArgs.has(arg));

	if (unknownArgs.length > 0) {
		fail(`Unknown argument(s): ${unknownArgs.join(', ')}`);
	}

	if (shouldPack && shouldPublish) {
		fail('Use either --dry-run or --publish, not both.');
	}
}

function run(
	command,
	args,
	options,
) {
	const result = spawnSync(
		command,
		args,
		{
			...options,
			stdio: 'inherit',
			env: process.env,
		},
	);

	if (result.error) {
		throw result.error;
	}

	if (result.status !== 0) {
		process.exit(result.status ?? 1);
	}
}

function fail(message) {
	console.error(`ERROR: ${message}`);
	process.exit(1);
}
