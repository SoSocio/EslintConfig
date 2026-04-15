# Agent Guidelines

This file provides guidance to different agents (codex, claude, grok) when working with code in this repository.

## Essential Commands

### Development
```bash
# Build the project and create a local package
npm run build
npm run pack
```

### Building
```bash
npm run build
```

### Code Quality
```bash
npm run typecheck		# TypeScript
npm run lint			# ESLint
npm run lint:fix		# ESLint with Auto-fix
```

## Development Workflow

### Git Hooks
- **Pre-push**: Automatically runs type checking and linting

## Commit Messages

When asked to generate a commit message (especially for staged changes):
- Use the current branch name to derive the ticket scope and include the task ID in the title line (e.g., `FE-1863`).
- Make the first line a concise summary tied to the ticket's purpose.
- Add bullet lines that describe each concrete change and why it was needed (fix/add/change/remove/move/etc).
- Use backticks for package names, files, and code identifiers.
- If ClickUp is available, fetch the task details using the ID for better context.
- Return the message inside a fenced code block so the user can copy/paste it with literal `-` bullets.

Example:
Branch: `FE-1863_Repository-refactor-packages-versions-bump-new-rules-improvements_Julian-Olmos-Tomeich`
```text
Refactor eslint config workspace tooling and publishing
- Move the repository to a pnpm workspace with a root `pnpm-lock.yaml`, workspace package links, and pnpm-based package scripts
- Remove npm-era lockfiles and tracked npm auth files so dependency state and registry credentials are managed consistently
- Refactor CircleCI to use `sosocio/circleci-pipeline-orbs` and route dry-run validation through `pnpm run pack` and tag releases through `pnpm run pub`
- Move `build_publish.sh` under `scripts/ci` and consolidate build, pack, and publish behavior in `scripts/ci/build-publish.mjs`
- Add dry-run pack mode that installs dependencies, builds all packages, and creates `.tgz` artifacts without publishing
- Keep release publish mode tag-driven with per-package publishing, version updates, prerelease dist-tags, and `pnpm publish --no-git-checks`
- Add root ESLint/typecheck support using the backend config, including JSON linting, tab indentation, mixed whitespace detection, and repository self-linting
- Split TypeScript config into shared, IDE/typecheck, and build configs so Code Insiders and CLI typechecking use the same project while package output stays scoped
- Add Husky and lint-staged hooks so pre-commit checks staged files and pre-push runs lint, typecheck, and pack
- Update Docker/devcontainer setup and post-attach install flow for pnpm-based local development
- Add `AGENTS.md` with repository-specific guidance for commands, commit messages, and PR summaries
```

## Pull Request Summaries

When asked to generate a PR summary/description:
- Follow the formatting style used in the example below (sections with short headings and bullet points).
- Start with a concise Summary paragraph describing the overall goal and impact.
- Add clearly labeled sections for data/schema changes, store/runtime changes, code refactors, docs, etc.
- Call out notable typings, API changes, and code behavior updates.
- Return the content in a fenced Markdown code block for easy copy/paste.

Example:
```markdown
## Summary
This PR refactors the `@sosocio/eslint-config` repository around pnpm workspaces, aligns local scripts with the CircleCI publishing flow, and adds first-class lint/typecheck coverage for the config packages themselves.

**Workspace + package management**
- Move the root, backend, and frontend packages to a pnpm workspace with `pnpm-workspace.yaml` and a single root `pnpm-lock.yaml`.
- Replace npm scripts with pnpm equivalents across the root, backend, and frontend packages.
- Use workspace dependencies for internal package references.
- Remove npm-era lockfiles and tracked npm auth files.

**CI + package publishing**
- Refactor `.circleci/config.yml` to use `sosocio/circleci-pipeline-orbs`.
- Move `build_publish.sh` to `scripts/ci/build_publish.sh`.
- Add `scripts/ci/build-publish.mjs` as the shared build, pack, and publish driver.
- Route CircleCI dry-run validation through `pnpm run pack`.
- Route CircleCI tag publishing through `pnpm run pub`.
- Add dry-run pack mode that installs dependencies, builds all packages, and creates `.tgz` artifacts without publishing.
- Keep release publish mode tag-driven with per-package publishing, version updates, prerelease dist-tags, and `pnpm publish --no-git-checks`.

**ESLint + TypeScript tooling**
- Add a root `eslint.config.mts` that uses the backend config to lint this repository.
- Add root `lint`, `lint:fix`, and `typecheck` scripts.
- Update the shared ESLint config to lint JSON files through `jsonc-eslint-parser`.
- Enforce tab indentation and reject mixed spaces/tabs in JSON files.
- Scope TypeScript parser rules to JS/TS files so JSON files are parsed with the JSON parser.
- Split TypeScript config into `tsconfig.base.json`, `tsconfig.json`, and `tsconfig.build.json` so IDE diagnostics and CLI typechecking use the same project while package builds emit only package files.
- Add local typing for `eslint-plugin-vue-pug`.

**Local development**
- Update the Docker/devcontainer setup for the pnpm workflow.
- Add `.postbuild.sh` to install dependencies after attaching to the dev container.
- Add Husky hooks so pre-commit runs lint-staged and typecheck, while pre-push runs lint, typecheck, and pack.
- Add `scripts/eslint.ts` for cached ESLint execution with default workspace targets.

**Docs + contributor guidance**
- <!-- add docs manually if needed, e.g.: Add `AGENTS.md` with repository commands and guidance for commit message and PR summary generation. -->

**Validation**
- <!-- add any validation if needed, e.g.: - `PACK_DESTINATION=$(mktemp -d) pnpm run pack` -->
```