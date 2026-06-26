#!/usr/bin/env node
// Propagates the version from package.json to every other artifact that must
// stay in sync: docs/roadmap.md, configurator/package.json, and both lock files
// under configurator/.
//
// Does NOT touch the root package-lock.json — that is updated by npm itself
// when `npm version` runs (called by the release-it after:bump hook before this
// script). Running `npm run version-sync` standalone therefore requires that
// `npm version <v> --no-git-tag-version` has already been run first.
//
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

// ── configurator/package.json + package-lock.json ───────────────────────────
function syncJsonVersion(rel, label) {
  const filePath = path.join(ROOT, rel);
  const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let dirty = false;
  if (parsed.version !== version) {
    parsed.version = version;
    dirty = true;
  }
  if (parsed.packages?.['']?.version !== undefined && parsed.packages[''].version !== version) {
    parsed.packages[''].version = version;
    dirty = true;
  }
  if (!dirty) {
    console.log(`  ok   ${rel}  (${label} already up to date)`);
    return false;
  }
  fs.writeFileSync(filePath, JSON.stringify(parsed, null, 2) + '\n', 'utf8');
  console.log(`  bump ${rel}  → ${label}`);
  return true;
}

changed += syncJsonVersion('configurator/package.json', `configurator version = ${version}`) ? 1 : 0;
changed += syncJsonVersion('configurator/package-lock.json', `configurator lock version = ${version}`) ? 1 : 0;

// ── Summary ─────────────────────────────────────────────────────────────────
if (changed === 0) {
  console.log('\nAll version references are already up to date.\n');
} else {
  console.log(`\n${changed} file(s) updated.\n`);
}
