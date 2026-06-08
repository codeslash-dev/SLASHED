#!/usr/bin/env node
// Updates non-JS version references to match the version in package.json.
// Currently: docs/roadmap.md ("Current version" line).
// Run after every version bump: npm run version-sync
// Wired into .release-it.json hooks so it executes automatically during releases.

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');

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

// ── docs/roadmap.md ─────────────────────────────────────────────────────────
changed += sync(
  'docs/roadmap.md',
  new RegExp(`(Current version: \\*\\*)${SEMVER_RE.source}(\\*\\*)`),
  `$1${version}$2`,
  `roadmap version = ${version}`
) ? 1 : 0;

// ── Summary ─────────────────────────────────────────────────────────────────
if (changed === 0) {
  console.log('\nAll version references are already up to date.\n');
} else {
  console.log(`\n${changed} file(s) updated.\n`);
}
