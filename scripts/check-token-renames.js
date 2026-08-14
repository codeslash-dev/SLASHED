#!/usr/bin/env node
/**
 * CI gate for docs/token-renames.json — the map that lets an old theme file be
 * migrated onto the current token set.
 *
 * A rename map is only useful if it is TRUE, and it decays silently: a target
 * token that is later renamed again turns the map into a machine that migrates
 * users onto a dead name. This gate holds three invariants:
 *
 *   1. Every rename TARGET is live. This is what makes the map trustworthy —
 *      and it forbids chains by construction: if `a → b` and `b → c` were both
 *      recorded, `b` would be a rename key and therefore not live, so the gate
 *      fires. Always record the fully resolved destination.
 *   2. No rename KEY is live. A live old name means the rename never happened,
 *      was reverted, or the name was recycled for something new — in every case
 *      migrating away from it would corrupt a working theme.
 *   3. No removal KEY is live, and removals and renames are disjoint. A token
 *      cannot be both "gone, here's advice" and "silently rewritten".
 *
 * "Live" comes from scripts/lib/live-api.js — the same definition
 * check-doc-refs.js and check-llm-guide.js use, so all three gates agree on
 * what the current API is.
 *
 * Run:
 *   node scripts/check-token-renames.js
 *   npm run check:token-renames
 */

import fs from 'node:fs';
import path from 'node:path';
import { buildLiveTokens } from './lib/live-api.js';

const slashedRoot = process.env.SLASHED_ROOT?.trim();
const ROOT = slashedRoot
  ? path.resolve(slashedRoot)
  : path.resolve(import.meta.dirname, '..');

const MAP_FILE = path.join(ROOT, 'docs', 'token-renames.json');

if (!fs.existsSync(MAP_FILE)) {
  console.error(`check:token-renames FAILED: ${MAP_FILE} not found.`);
  process.exit(1);
}

let map;
try {
  map = JSON.parse(fs.readFileSync(MAP_FILE, 'utf8'));
} catch (err) {
  console.error(`check:token-renames FAILED: docs/token-renames.json is not valid JSON (${err.message}).`);
  process.exit(1);
}

const errors = [];

/**
 * A section must be a plain object. An array passes `typeof x === 'object'`
 * and yields no entries, so `{"renames": []}` would sail through every
 * downstream check and leave the CLI silently migrating nothing.
 */
function readSection(name) {
  const value = map[name];
  if (value === undefined) return {};
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    errors.push(`\`${name}\` must be an object (got ${Array.isArray(value) ? 'an array' : typeof value}).`);
    return {};
  }
  return value;
}

if (!map || typeof map !== 'object' || Array.isArray(map)) {
  console.error('check:token-renames FAILED: docs/token-renames.json must be a JSON object.');
  process.exit(1);
}

const renames = readSection('renames');
const removals = readSection('removals');

const TOKEN_NAME_RE = /^--sf-[a-z0-9-]+$/;

// Shape checks first — a malformed entry would otherwise produce a confusing
// "not live" error for a name that was never well-formed.
for (const [from, to] of Object.entries(renames)) {
  if (!TOKEN_NAME_RE.test(from)) errors.push(`rename key "${from}" is not a well-formed --sf-* token name.`);
  if (typeof to !== 'string' || !TOKEN_NAME_RE.test(to)) {
    errors.push(`rename target for "${from}" ("${to}") is not a well-formed --sf-* token name.`);
  }
  if (from === to) errors.push(`rename "${from}" maps to itself.`);
}
for (const [name, reason] of Object.entries(removals)) {
  if (!TOKEN_NAME_RE.test(name)) errors.push(`removal key "${name}" is not a well-formed --sf-* token name.`);
  if (typeof reason !== 'string' || reason.trim() === '') {
    errors.push(`removal "${name}" has no reason — every removal must say what to use instead.`);
  }
}

// ── 3 (part): renames and removals must be disjoint ──────────────────────────
for (const name of Object.keys(removals)) {
  if (Object.prototype.hasOwnProperty.call(renames, name)) {
    errors.push(
      `"${name}" appears in BOTH renames and removals — it cannot be silently rewritten and manually resolved at the same time.`,
    );
  }
}

const live = buildLiveTokens(ROOT);

// ── 1: every rename target is live (and, by consequence, no chains) ──────────
for (const [from, to] of Object.entries(renames)) {
  if (typeof to !== 'string' || !live.has(to)) {
    const chained = Object.prototype.hasOwnProperty.call(renames, to);
    errors.push(
      chained
        ? `rename "${from}" → "${to}" points at another rename key — record the fully resolved destination (${renames[to]}) instead of a chain.`
        : `rename "${from}" → "${to}" points at a token that is not live. If "${to}" was itself renamed, re-point this entry at its current name.`,
    );
  }
}

// ── 2: no rename key is live ─────────────────────────────────────────────────
for (const from of Object.keys(renames)) {
  if (live.has(from)) {
    errors.push(
      `rename key "${from}" is still LIVE — migrating away from a token that exists would break a working theme. Drop the entry, or finish the rename in the CSS.`,
    );
  }
}

// ── 3: no removal key is live ────────────────────────────────────────────────
for (const name of Object.keys(removals)) {
  if (live.has(name)) {
    errors.push(
      `removal "${name}" is still LIVE — a token that exists must not be reported to users as removed.`,
    );
  }
}

if (errors.length) {
  console.error('check:token-renames FAILED:');
  for (const e of errors) console.error(`  - ${e}`);
  console.error('\ndocs/token-renames.json is the machine-readable mirror of docs/migration.md.');
  console.error('Every rename target must be a live token; no old name may still be live.');
  process.exit(1);
}

console.log(
  `check:token-renames OK — ${Object.keys(renames).length} rename(s), ` +
    `${Object.keys(removals).length} removal(s), all resolved against the live token set.`,
);
