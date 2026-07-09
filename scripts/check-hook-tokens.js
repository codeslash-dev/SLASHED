#!/usr/bin/env node
/**
 * CI gate (#582 D5): keep the fallback-only hook-token policy honest.
 *
 * A "hook token" is a --sf-* name that is NEVER declared in source (no
 * `--sf-x:` line, no `@property` registration) and is consumed only as the
 * first argument of a `var(--sf-hook, <default>)` call. Because it has no
 * default value it is deliberately left out of the generated catalogues; it is
 * documented in docs/llm-guide.md as an override hook. scripts/hook-tokens.js
 * is the single source of truth for that list.
 *
 * This gate verifies two directions so the policy can't silently rot:
 *   1. Every token in HOOK_TOKENS really is (a) undeclared in source,
 *      (b) consumed with a fallback, and (c) mentioned in docs/llm-guide.md.
 *   2. Every undeclared-but-consumed --sf-* found in source is EITHER covered
 *      by the registry / a declaration elsewhere, OR listed in HOOK_TOKENS —
 *      so a newly-introduced fallback-only hook forces a conscious entry here.
 *
 * Run:
 *   node scripts/check-hook-tokens.js
 *   npm run check:hook-tokens
 */

import fs from 'node:fs';
import path from 'node:path';
import { stripComments } from './lib/parse.js';
import { HOOK_TOKENS, HOOK_TOKEN_NAMES } from './hook-tokens.js';

const _root = process.env.SLASHED_ROOT?.trim();
const ROOT = _root ? path.resolve(_root) : path.resolve(import.meta.dirname, '..');
const GUIDE = path.join(ROOT, 'docs', 'llm-guide.md');
const REGISTRY = path.join(ROOT, 'token-registry.json');

const cssFiles = [];
for (const dir of ['core', 'optional']) {
  const abs = path.join(ROOT, dir);
  if (!fs.existsSync(abs)) continue;
  for (const f of fs.readdirSync(abs).filter((f) => f.endsWith('.css'))) {
    cssFiles.push(path.join(dir, f));
  }
}

// Comment-stripped corpus, and the set of names that are actually DECLARED
// (via `@property` or `--sf-x:`) anywhere in source.
let corpus = '';
const declared = new Set();
for (const rel of cssFiles) {
  const css = stripComments(fs.readFileSync(path.join(ROOT, rel), 'utf8'));
  corpus += '\n' + css;
  for (const m of css.matchAll(/@property\s+(--sf-[a-z0-9_-]+)/g)) declared.add(m[1]);
  for (const m of css.matchAll(/(--sf-[a-z0-9_-]+)\s*:/g)) declared.add(m[1]);
}

const registryNames = new Set(
  JSON.parse(fs.readFileSync(REGISTRY, 'utf8')).tokens
    .filter((t) => !t.removed)
    .map((t) => t.name),
);

const guideText = fs.readFileSync(GUIDE, 'utf8');

const errors = [];

// ── Direction 1: every listed hook token behaves like a hook ─────────────────
for (const { name } of HOOK_TOKENS) {
  const esc = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  if (declared.has(name)) {
    errors.push(`${name}: listed as a hook token but IS declared in source — remove it from hook-tokens.js or stop declaring it.`);
  }
  // Consumed with a fallback: var(--sf-hook, …). A bare var(--sf-hook) with no
  // fallback would mean the hook has no safety net and shouldn't be a hook.
  const withFallback = new RegExp(`var\\(\\s*${esc}\\s*,`);
  if (!withFallback.test(corpus)) {
    errors.push(`${name}: listed as a hook token but never consumed as var(${name}, <fallback>) in source.`);
  }
  if (!guideText.includes(name)) {
    errors.push(`${name}: hook tokens must be documented in docs/llm-guide.md, but it is not mentioned there.`);
  }
}

// ── Direction 2: no undeclared fallback-hook escapes the allowlist ───────────
// Any --sf-x consumed as var(--sf-x, …) that is neither declared nor catalogued
// is a de-facto hook token and must be registered in hook-tokens.js.
const consumedWithFallback = new Set();
for (const m of corpus.matchAll(/var\(\s*(--sf-[a-z0-9_-]+)\s*,/g)) {
  consumedWithFallback.add(m[1]);
}
for (const name of consumedWithFallback) {
  if (declared.has(name) || registryNames.has(name) || HOOK_TOKEN_NAMES.has(name)) continue;
  errors.push(`${name}: consumed only as a var() fallback and neither declared, catalogued, nor listed in scripts/hook-tokens.js. Add it there (see #582 D5).`);
}

if (errors.length) {
  console.error('check:hook-tokens FAILED:');
  for (const e of errors) console.error(`  ${e}`);
  process.exit(1);
}

console.log(`check:hook-tokens OK — ${HOOK_TOKENS.length} fallback-only hook token(s) verified.`);
