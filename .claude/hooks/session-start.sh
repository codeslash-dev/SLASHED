#!/bin/bash
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel)}"

# Install root dependencies (includes commitlint, stylelint, etc.)
npm install

# Wire up .githooks so the commit-msg hook runs commitlint pre-commit
npm run prepare
