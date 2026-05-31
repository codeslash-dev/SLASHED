#!/usr/bin/env node
// Updates all non-JS version references to match the version in package.json.
// Covers: slashed.php, slashed-bricks.php, slashed-gutenberg.php.
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
const version = pkg.version;         // e.g. "0.4.0"
const versionTag = `v${version}`;    // e.g. "v0.4.0"

console.log(`\nversion-sync: syncing to ${versionTag}\n`);

let changed = 0;

// ── slashed.php (unified plugin) ────────────────────────────────────────────
changed += sync(
  'plugins/SLASHED-for-WP/slashed.php',
  / \* Version: \d+\.\d+\.\d+/,
  ` * Version: ${version}`,
  `Version: ${version}`
) ? 1 : 0;

changed += sync(
  'plugins/SLASHED-for-WP/slashed.php',
  /define\(\s*'SLASHED_VERSION',\s*'[^']+'\s*\)/,
  `define( 'SLASHED_VERSION', '${version}' )`,
  `SLASHED_VERSION = '${version}'`
) ? 1 : 0;

changed += sync(
  'plugins/SLASHED-for-WP/slashed.php',
  /define\(\s*'SLASHED_CSS_REF',\s*'[^']+'\s*\)/,
  `define( 'SLASHED_CSS_REF', '${versionTag}' )`,
  `SLASHED_CSS_REF = '${versionTag}'`
) ? 1 : 0;

// ── integrations/bricks/slashed-bricks.php ─────────────────────────────────
// SLASHED_BRICKS_CSS_REF — semver tag used for version comparison only.
// Still kept in sync so the dashboard "update available" widget shows the right version.
changed += sync(
  'plugins/SLASHED-for-WP/integrations/bricks/slashed-bricks.php',
  /define\(\s*'SLASHED_BRICKS_CSS_REF',\s*'[^']+'\s*\)/,
  `define( 'SLASHED_BRICKS_CSS_REF', '${versionTag}' )`,
  `SLASHED_BRICKS_CSS_REF = '${versionTag}'`
) ? 1 : 0;

// SLASHED_BRICKS_DIST_SHA — dist branch commit SHA used for the CDN URL.
// NOT updated here; managed by the version-sync GitHub Actions workflow which
// pushes CSS to the dist branch and captures the resulting commit SHA.

// Plugin header comment: "Version: X.X.X"
changed += sync(
  'plugins/SLASHED-for-WP/integrations/bricks/slashed-bricks.php',
  / \* Version: \d+\.\d+\.\d+/,
  ` * Version: ${version}`,
  `Version: ${version}`
) ? 1 : 0;

// Plugin version constant: define( 'SLASHED_BRICKS_VERSION', 'X.X.X' )
changed += sync(
  'plugins/SLASHED-for-WP/integrations/bricks/slashed-bricks.php',
  /define\(\s*'SLASHED_BRICKS_VERSION',\s*'[^']+'\s*\)/,
  `define( 'SLASHED_BRICKS_VERSION', '${version}' )`,
  `SLASHED_BRICKS_VERSION = '${version}'`
) ? 1 : 0;

// ── integrations/gutenberg/slashed-gutenberg.php ───────────────────────────
changed += sync(
  'plugins/SLASHED-for-WP/integrations/gutenberg/slashed-gutenberg.php',
  / \* Version: \d+\.\d+\.\d+/,
  ` * Version: ${version}`,
  `Version: ${version}`
) ? 1 : 0;

changed += sync(
  'plugins/SLASHED-for-WP/integrations/gutenberg/slashed-gutenberg.php',
  /define\(\s*'SLASHED_GUTENBERG_VERSION',\s*'[^']+'\s*\)/,
  `define( 'SLASHED_GUTENBERG_VERSION', '${version}' )`,
  `SLASHED_GUTENBERG_VERSION = '${version}'`
) ? 1 : 0;

changed += sync(
  'plugins/SLASHED-for-WP/integrations/gutenberg/slashed-gutenberg.php',
  /define\(\s*'SLASHED_GUTENBERG_CSS_REF',\s*'[^']+'\s*\)/,
  `define( 'SLASHED_GUTENBERG_CSS_REF', '${versionTag}' )`,
  `SLASHED_GUTENBERG_CSS_REF = '${versionTag}'`
) ? 1 : 0;

// SLASHED_DIST_SHA and SLASHED_GUTENBERG_DIST_SHA are NOT updated here;
// managed by the version-sync GitHub Actions workflow.

// ── Summary ─────────────────────────────────────────────────────────────────
if (changed === 0) {
  console.log('\nAll version references are already up to date.\n');
} else {
  console.log(`\n${changed} file(s) updated.\n`);
}
