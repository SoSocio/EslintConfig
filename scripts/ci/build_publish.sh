#! /bin/sh

set -eu

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_dir=$(CDPATH= cd -- "${script_dir}/../.." && pwd)

ROOT_DIR="${ROOT_DIR:-${repo_dir}}" exec node "${repo_dir}/scripts/ci/build-publish.mjs" "$@"
