#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BUILD_DIR="${BUILD_DIR:-${ROOT_DIR}/.build}"

cmake -S "${ROOT_DIR}/sources" -B "${BUILD_DIR}" \
    -DCMAKE_BUILD_TYPE="${CMAKE_BUILD_TYPE:-Release}"
cmake --build "${BUILD_DIR}" --parallel "${JOBS:-2}"

cp "${BUILD_DIR}/uefitool-oe-cli" "${ROOT_DIR}/uefitool-oe-cli"
printf 'binary: %s\n' "${ROOT_DIR}/uefitool-oe-cli"
