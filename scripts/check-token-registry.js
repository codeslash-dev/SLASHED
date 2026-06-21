#!/usr/bin/env node
/**
 * CI gate for token-registry.json — guards the "ids are permanent" contract the
 * shareable config code relies on. Fails (exit 1) if a commit would break any
 * of these invariants:
 *
 *   1. No existing id changed its name      (no reassignment / no reuse).
 *   2. No id was dropped                     (a vanished token must be flagged
 *                                             `removed`, not deleted).
 *   3. _meta.nextId never decreases, and is  (id space only grows forward).
 *      strictly greater than every id.
 *   4. Every live catalogue token has a       (the generator was actually run
 *      non-removed registry entry.            and its output committed).
 *
 * Invariants 1–3 are checked against the committed registry (git HEAD); 4 is
 * checked against docs/api-index.json. Run locally:
 *   node scripts/check-token-registry.js
 */

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = path.resolve(import.meta.dirname, '..');
const REGISTRY = path.join(ROOT, 'token-registry.json');
const API_INDEX = path.join(ROOT, 'docs', 'api-index.json');

const errors = [];

/** Read + parse a JSON file, exiting with a clear message on failure. */
function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    console.error(`check:registry FAILED: cannot read ${file} (${err.message})`);
    process.exit(1);
  }
}

/**
 * Resolve the git ref to diff against — the integration baseline this branch
 * must not violate. Comparing against HEAD would be a no-op in CI (the registry
 * is already committed, so HEAD == working tree); the meaningful baseline is
 * what's already on the target/default branch. Tries, in order: the PR base
 * branch (GITHUB_BASE_REF in CI), origin/main, main, then HEAD~1 as a local
 * fallback. Returns null when none resolve (e.g. first introduction).
 * @returns {string|null}
 */
function baselineRef() {
  const candidates = [];
  if (process.env.GITHUB_BASE_REF) candidates.push(`origin/${process.env.GITHUB_BASE_REF}`, process.env.GITHUB_BASE_REF);
  candidates.push('origin/main', 'main', 'HEAD~1');
  for (const ref of candidates) {
    try {
      execFileSync('git', ['rev-parse', '--verify', '--quiet', `${ref}^{commit}`], {
        cwd: ROOT,
        stdio: ['ignore', 'ignore', 'ignore'],
      });
      return ref;
    } catch {
      /* ref not present in this checkout — try the next */
    }
  }
  return null;
}

/**
 * The registry as committed on the baseline ref (the version we must not
 * violate). Returns null when there is no baseline (first introduction, or the
 * file doesn't exist there yet) — nothing to diff, so invariants 1–3 are
 * vacuously satisfied.
 * @returns {object|null}
 */
function readBaselineRegistry() {
  const ref = baselineRef();
  if (!ref) return null;
  try {
    const text = execFileSync('git', ['show', `${ref}:token-registry.json`], {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    return JSON.parse(text);
  } catch {
    return null; // file absent on the baseline, or not a git checkout
  }
}

const current = readJson(REGISTRY);
const currentTokens = Array.isArray(current.tokens) ? current.tokens : [];
const head = readBaselineRegistry();

// ── 1–2: diff against the baseline branch (id permanence) ────────────────────
if (head) {
  const currentById = new Map(currentTokens.map((t) => [t.id, t]));
  for (const prev of head.tokens ?? []) {
    const now = currentById.get(prev.id);
    if (!now) {
      errors.push(`id ${prev.id} ("${prev.name}") was deleted — ids must persist (flag \`removed\` instead).`);
      continue;
    }
    if (now.name !== prev.name) {
      errors.push(`id ${prev.id} changed name "${prev.name}" → "${now.name}" — ids must never be reassigned.`);
    }
  }
  // ── 3: nextId monotonicity ────────────────────────────────────────────────
  const headNext = head._meta?.nextId ?? 0;
  const curNext = current._meta?.nextId ?? 0;
  if (curNext < headNext) {
    errors.push(`_meta.nextId decreased ${headNext} → ${curNext} — it must only grow.`);
  }
}

// ── 3 (cont.): nextId is past every id, and every id fits the uint16 wire ─────
// field the codec serialises ids into (configurator/src/lib/codec.js).
const MAX_ID = 0xffff;
const maxId = currentTokens.reduce((m, t) => Math.max(m, t.id ?? -1), -1);
if (maxId > MAX_ID) {
  errors.push(`id ${maxId} exceeds the uint16 wire limit (${MAX_ID}); the codec cannot encode it without truncation.`);
}
if ((current._meta?.nextId ?? 0) <= maxId) {
  errors.push(`_meta.nextId (${current._meta?.nextId}) must be greater than the max id (${maxId}).`);
}

// Duplicate-id guard (would corrupt decoding regardless of HEAD).
const seen = new Set();
for (const t of currentTokens) {
  if (seen.has(t.id)) errors.push(`duplicate id ${t.id} ("${t.name}").`);
  seen.add(t.id);
}

// ── 4: every live catalogue token is registered (generator was run) ──────────
if (fs.existsSync(API_INDEX)) {
  const api = readJson(API_INDEX);
  const live = (Array.isArray(api.entries) ? api.entries : []).filter((e) => e && e.type === 'token');
  const active = new Map(currentTokens.filter((t) => !t.removed).map((t) => [t.name, t]));
  for (const e of live) {
    if (!active.has(e.name)) {
      errors.push(`catalogue token "${e.name}" has no active registry entry — run \`npm run gen:registry\`.`);
    }
  }
}

if (errors.length) {
  console.error('check:registry FAILED:');
  for (const e of errors) console.error(`  - ${e}`);
  console.error('\nThe token registry is append-only. Re-run `npm run gen:registry`;');
  console.error('never hand-edit ids or delete entries.');
  process.exit(1);
}

console.log(`check:registry OK — ${currentTokens.length} ids, nextId=${current._meta?.nextId}.`);
