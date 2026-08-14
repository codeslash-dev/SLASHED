#!/usr/bin/env node
/**
 * Migrate a SLASHED theme file onto the current token API.
 *
 * A theme file (see scripts/lib/theme-file.js) is keyed by token NAME, which is
 * what makes it reviewable in a diff — and also what makes it vulnerable to a
 * rename. This is the tool that repairs one: it rewrites renamed tokens, drops
 * removed ones with the reason, and reports anything it does not recognise.
 *
 * Usage:
 *   node scripts/migrate-theme.js <file.slashed-theme.json>            # report only
 *   node scripts/migrate-theme.js <file.slashed-theme.json> --write    # rewrite in place
 *   npm run migrate:theme -- <file> [--write]
 *
 * Exit codes:
 *   0  nothing to do (or --write succeeded)
 *   1  the file is invalid, or migration is needed and --write was not passed
 *
 * The report-only default is deliberate: exit 1 on "migration needed" makes
 * this usable as a CI check over a repository's committed theme files, while
 * --write is the explicit opt-in to mutate someone's file.
 */

import fs from 'node:fs';
import path from 'node:path';
import { buildLiveTokens } from './lib/live-api.js';
import { parseThemeFile, migrateOverrides, serializeThemeFile } from './lib/theme-file.js';

const slashedRoot = process.env.SLASHED_ROOT?.trim();
const ROOT = slashedRoot
  ? path.resolve(slashedRoot)
  : path.resolve(import.meta.dirname, '..');

const args = process.argv.slice(2);
const write = args.includes('--write');
const files = args.filter((a) => !a.startsWith('--'));

if (files.length === 0) {
  console.error('Usage: node scripts/migrate-theme.js <file.slashed-theme.json> [--write]');
  process.exit(1);
}

/** Read docs/token-renames.json. */
function readRenameMap() {
  const file = path.join(ROOT, 'docs', 'token-renames.json');
  try {
    const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
    // Mirror check-token-renames.js: an array here would yield no entries and
    // silently migrate nothing, which is worse than refusing to run.
    const section = (name) => {
      const value = parsed?.[name];
      if (value === undefined) return {};
      if (!value || typeof value !== 'object' || Array.isArray(value)) {
        console.error(`migrate-theme: docs/token-renames.json \`${name}\` must be an object.`);
        process.exit(1);
      }
      return value;
    };
    return { renames: section('renames'), removals: section('removals') };
  } catch (err) {
    console.error(`migrate-theme: cannot read docs/token-renames.json (${err.message}).`);
    process.exit(1);
  }
}

/** Current framework version, stamped into a migrated file. */
function frameworkVersion() {
  try {
    return JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')).version ?? null;
  } catch {
    return null;
  }
}

/**
 * Escape anything non-printable before echoing a file-supplied value to the
 * terminal. validateThemeFile() already rejects control characters, so nothing
 * should reach here — this is the second layer, because migrateOverrides() is
 * exported and a future caller could feed it unvalidated input, and a terminal
 * is a control-sequence interpreter, not a text sink.
 * @param {string} value
 */
function forTerminal(value) {
  return String(value).replace(
    /[\u0000-\u001f\u007f]/g,
    (ch) => `\\x${ch.charCodeAt(0).toString(16).padStart(2, '0')}`,
  );
}

const { renames, removals } = readRenameMap();
const live = buildLiveTokens(ROOT);
const version = frameworkVersion();

let needsWork = false;
let hadError = false;

for (const rel of files) {
  const abs = path.resolve(rel);
  // Echo the path the user typed — a computed relative path turns an absolute
  // argument into an unrecognisable ../../.. chain.
  const label = rel;

  if (!fs.existsSync(abs)) {
    console.error(`${label}: file not found.`);
    hadError = true;
    continue;
  }

  const { theme, errors } = parseThemeFile(fs.readFileSync(abs, 'utf8'));
  if (!theme) {
    console.error(`${label}: invalid theme file.`);
    for (const e of errors) console.error(`  - ${e}`);
    hadError = true;
    continue;
  }

  const result = migrateOverrides(theme.overrides, { renames, removals, live });
  const changed = result.renamed.length + result.removed.length + result.collisions.length;

  console.log(`${label}${theme.name ? ` (“${forTerminal(theme.name)}”)` : ''}`);
  console.log(
    `  ${Object.keys(theme.overrides).length} override(s)` +
      `${theme.slashedVersion ? `, authored against SLASHED ${theme.slashedVersion}` : ''}.`,
  );

  for (const { from, to } of result.renamed) console.log(`  renamed  ${from} → ${to}`);
  for (const { from, to, kept } of result.collisions) {
    console.log(`  dropped  ${from} (already set as ${to}; kept the current name's value "${forTerminal(kept)}")`);
  }
  for (const { name, reason } of result.removed) console.log(`  removed  ${name}\n             ${reason}`);
  for (const name of result.unknown) {
    console.log(`  unknown  ${name} (not a live token and not in the rename map — left untouched)`);
  }

  if (changed === 0) {
    console.log('  nothing to migrate.\n');
    continue;
  }
  needsWork = true;

  if (write) {
    fs.writeFileSync(
      abs,
      serializeThemeFile({
        overrides: result.overrides,
        name: theme.name ?? undefined,
        slashedVersion: version ?? theme.slashedVersion ?? undefined,
      }),
      'utf8',
    );
    console.log(`  written — ${changed} change(s) applied${version ? `, stamped SLASHED ${version}` : ''}.\n`);
  } else {
    console.log(`  ${changed} change(s) needed. Re-run with --write to apply.\n`);
  }
}

if (hadError) process.exit(1);
if (needsWork && !write) process.exit(1);
