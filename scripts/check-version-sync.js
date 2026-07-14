#!/usr/bin/env node
// Fails if version references have drifted apart. Guards the class of bug where
// package.json, package-lock.json and docs/roadmap.md fall out of sync (e.g. a
// tag cut without `npm run release`, leaving build-time headers mis-stamped).
//
// Checks:
//   1. package-lock.json version (root and packages[""]) === package.json
//   2. docs/roadmap.md "Current version" === package.json
//   3. docs/llm-guide.md "Version" header === package.json
//
// Note: configurator/src/data/api-index.generated.json no longer stores a
// frameworkVersion field — the version is injected at Vite build time from the
// root package.json (vite.config.js define.__SLASHED_VERSION__), so it is
// always exactly the version that was built and never needs a sync step.
// Run locally with: node scripts/check-version-sync.js
// Wired into CI (.github/workflows/ci.yml).

import fs from 'node:fs';
import path from 'node:path';

// Empty/whitespace SLASHED_ROOT counts as unset; a relative override is
// resolved to absolute (the reads below require an absolute repo root).
const slashedRoot = process.env.SLASHED_ROOT?.trim();
const ROOT = slashedRoot
  ? path.resolve(slashedRoot)
  : path.resolve(import.meta.dirname, '..');
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');

const errors = [];

const pkg = JSON.parse(read('package.json'));
const version = pkg.version;

// 1. package-lock.json must match package.json.
const lock = JSON.parse(read('package-lock.json'));
if (lock.version !== version) {
  errors.push(
    `package-lock.json version "${lock.version}" != package.json "${version}"`,
  );
}
const lockSelf = lock.packages?.['']?.version;
if (lockSelf !== undefined && lockSelf !== version) {
  errors.push(
    `package-lock.json packages[""].version "${lockSelf}" != package.json "${version}"`,
  );
}

// 2. docs/roadmap.md "Current version" must match package.json.
const roadmap = read('docs/roadmap.md');
const m = roadmap.match(/Current version:\s*\*\*([^*]+)\*\*/);
if (!m) {
  errors.push('docs/roadmap.md: "Current version" line not found');
} else if (m[1].trim() !== version) {
  errors.push(
    `docs/roadmap.md version "${m[1].trim()}" != package.json "${version}"`,
  );
}

// 3. docs/llm-guide.md "Version" header must match package.json.
const llmGuide = read('docs/llm-guide.md');
const guideMatch = llmGuide.match(/Version:\s*\*\*([^*]+)\*\*/);
if (!guideMatch) {
  errors.push('docs/llm-guide.md: "Version" header not found');
} else if (guideMatch[1].trim() !== version) {
  errors.push(
    `docs/llm-guide.md version "${guideMatch[1].trim()}" != package.json "${version}"`,
  );
}

// 4. configurator/package.json must match package.json.
const configPkg = JSON.parse(read('configurator/package.json'));
if (configPkg.version !== version) {
  errors.push(
    `configurator/package.json version "${configPkg.version}" != package.json "${version}"`,
  );
}

// 5. configurator/package-lock.json must match package.json.
const configLock = JSON.parse(read('configurator/package-lock.json'));
if (configLock.version !== version) {
  errors.push(
    `configurator/package-lock.json version "${configLock.version}" != package.json "${version}"`,
  );
}
const configLockSelf = configLock.packages?.['']?.version;
if (configLockSelf !== undefined && configLockSelf !== version) {
  errors.push(
    `configurator/package-lock.json packages[""].version "${configLockSelf}" != package.json "${version}"`,
  );
}

if (errors.length) {
  console.error('version-sync check FAILED:');
  for (const e of errors) console.error(`  - ${e}`);
  console.error('\nRun `npm version <v> --no-git-tag-version` + `npm run version-sync` to realign.');
  process.exit(1);
}

console.log(`version-sync check OK — all references at ${version}.`);
