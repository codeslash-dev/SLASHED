#!/usr/bin/env node
// Updates all non-JS version references to match the version in package.json.
// Covers: PHP plugin entry files, docs/roadmap.md, Bricks README CDN example.
// Run after every version bump: npm run version-sync
// Wired into .release-it.json hooks so it executes automatically during releases.

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function readFile(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

function writeFile(rel, content) {
  fs.writeFileSync(path.join(ROOT, rel), content, 'utf8');
}

function sync(rel, pattern, replacement, label) {
  const original = readFile(rel);
  // Reset BEFORE test() — a global/sticky regex retains lastIndex across calls.
  if (pattern.lastIndex !== undefined) pattern.lastIndex = 0;
  if (!pattern.test(original)) {
    throw new Error(`version-sync: pattern not found in ${rel} for "${label}"`);
  }
  if (pattern.lastIndex !== undefined) pattern.lastIndex = 0;
  const updated = original.replace(pattern, replacement);
  if (updated === original) {
    console.log(`  ok   ${rel}  (${label} already up to date)`);
    return false;
  }
  writeFile(rel, updated);
  console.log(`  bump ${rel}  → ${label}`);
  return true;
}

// ── Read source of truth ────────────────────────────────────────────────────
const pkg = JSON.parse(readFile('package.json'));
const version = pkg.version;         // e.g. "0.5.0-beta5"
const versionTag = `v${version}`;    // e.g. "v0.5.0-beta5"

// Matches any semver string including pre-release suffixes (e.g. 0.5.0-beta5, 1.0.0-rc.1).
const SEMVER_RE = /\d+\.\d+\.\d+(?:[-.][a-zA-Z0-9.]+)*/;

console.log(`\nversion-sync: syncing to ${versionTag}\n`);

let changed = 0;

// ── slashed.php (unified plugin) ────────────────────────────────────────────
changed += sync(
  'plugins/SLASHED-for-WP/slashed.php',
  new RegExp(` \\* Version: ${SEMVER_RE.source}`),
  ` * Version: ${version}`,
  `Version: ${version}`
) ? 1 : 0;

changed += sync(
  'plugins/SLASHED-for-WP/slashed.php',
  /define\(\s*'SLASHED_VERSION',\s*'[^']+'\s*\)/,
  `define( 'SLASHED_VERSION',  '${version}' )`,
  `SLASHED_VERSION = '${version}'`
) ? 1 : 0;

changed += sync(
  'plugins/SLASHED-for-WP/slashed.php',
  /define\(\s*'SLASHED_CSS_REF',\s*'[^']+'\s*\)/,
  `define( 'SLASHED_CSS_REF',  '${versionTag}' )`,
  `SLASHED_CSS_REF = '${versionTag}'`
) ? 1 : 0;

// ── integrations/bricks/slashed-bricks.php ─────────────────────────────────
changed += sync(
  'plugins/SLASHED-for-WP/integrations/bricks/slashed-bricks.php',
  new RegExp(` \\* Version: ${SEMVER_RE.source}`),
  ` * Version: ${version}`,
  `Version: ${version}`
) ? 1 : 0;

changed += sync(
  'plugins/SLASHED-for-WP/integrations/bricks/slashed-bricks.php',
  /define\(\s*'SLASHED_BRICKS_VERSION',\s*'[^']+'\s*\)/,
  `define( 'SLASHED_BRICKS_VERSION', '${version}' )`,
  `SLASHED_BRICKS_VERSION = '${version}'`
) ? 1 : 0;

// SLASHED_BRICKS_CSS_REF — semver tag used for version comparison / update detection.
changed += sync(
  'plugins/SLASHED-for-WP/integrations/bricks/slashed-bricks.php',
  /define\(\s*'SLASHED_BRICKS_CSS_REF',\s*'[^']+'\s*\)/,
  `define( 'SLASHED_BRICKS_CSS_REF', '${versionTag}' )`,
  `SLASHED_BRICKS_CSS_REF = '${versionTag}'`
) ? 1 : 0;

// SLASHED_BRICKS_DIST_SHA — dist branch commit SHA used for the CDN URL.
// NOT updated here; managed by the version-sync GitHub Actions workflow which
// pushes CSS to the dist branch and captures the resulting commit SHA.

// ── integrations/gutenberg/slashed-gutenberg.php ───────────────────────────
changed += sync(
  'plugins/SLASHED-for-WP/integrations/gutenberg/slashed-gutenberg.php',
  new RegExp(` \\* Version: ${SEMVER_RE.source}`),
  ` * Version: ${version}`,
  `Version: ${version}`
) ? 1 : 0;

changed += sync(
  'plugins/SLASHED-for-WP/integrations/gutenberg/slashed-gutenberg.php',
  /define\(\s*'SLASHED_GUTENBERG_VERSION',\s*'[^']+'\s*\)/,
  `define( 'SLASHED_GUTENBERG_VERSION',  '${version}' )`,
  `SLASHED_GUTENBERG_VERSION = '${version}'`
) ? 1 : 0;

changed += sync(
  'plugins/SLASHED-for-WP/integrations/gutenberg/slashed-gutenberg.php',
  /define\(\s*'SLASHED_GUTENBERG_CSS_REF',\s*'[^']+'\s*\)/,
  `define( 'SLASHED_GUTENBERG_CSS_REF',  '${versionTag}' )`,
  `SLASHED_GUTENBERG_CSS_REF = '${versionTag}'`
) ? 1 : 0;

// SLASHED_DIST_SHA and SLASHED_GUTENBERG_DIST_SHA are NOT updated here;
// managed by the version-sync GitHub Actions workflow.

// ── docs/roadmap.md ─────────────────────────────────────────────────────────
changed += sync(
  'docs/roadmap.md',
  new RegExp(`(Current version: \\*\\*)${SEMVER_RE.source}(\\*\\*)`),
  `$1${version}$2`,
  `roadmap version = ${version}`
) ? 1 : 0;

// ── plugins/SLASHED-for-WP/integrations/bricks/README.md ────────────────────
// CDN URL example — keeps the documented URL in sync with the current release tag.
changed += sync(
  'plugins/SLASHED-for-WP/integrations/bricks/README.md',
  new RegExp(`(cdn\\.jsdelivr\\.net/gh/codeslash-dev/SLASHED@)v${SEMVER_RE.source}(/dist/)`),
  `$1${versionTag}$2`,
  `Bricks README CDN example = ${versionTag}`
) ? 1 : 0;

// ── Summary ─────────────────────────────────────────────────────────────────
if (changed === 0) {
  console.log('\nAll version references are already up to date.\n');
} else {
  console.log(`\n${changed} file(s) updated.\n`);
}
