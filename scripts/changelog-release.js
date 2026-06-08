#!/usr/bin/env node
// Promote the ## Unreleased section to a versioned heading on release.
// Usage: node scripts/changelog-release.js v0.6.0
//
// Replaces the first "## Unreleased" line with "## [X.Y.Z] - YYYY-MM-DD".
// If no Unreleased section exists the script exits cleanly (nothing to do).

'use strict';

const fs = require('fs');
const path = require('path');

const tag = process.argv[2];
if (!tag) {
  console.error('Usage: changelog-release.js <version-tag>  (e.g. v0.6.0)');
  process.exit(1);
}

const version = tag.replace(/^v/, '');
const date = new Date().toISOString().slice(0, 10);
const changelogPath = path.resolve(__dirname, '..', 'CHANGELOG.md');

let content = fs.readFileSync(changelogPath, 'utf8');

if (!/^## Unreleased\s*$/m.test(content)) {
  console.log('No ## Unreleased section found — nothing to promote.');
  process.exit(0);
}

content = content.replace(
  /^## Unreleased\s*$/m,
  `## [${version}] - ${date}`
);

fs.writeFileSync(changelogPath, content, 'utf8');
console.log(`CHANGELOG.md: promoted ## Unreleased → ## [${version}] - ${date}`);
