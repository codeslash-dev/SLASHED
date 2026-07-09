#!/usr/bin/env node
/**
 * CI gate (#582 D1): a DEAD KNOB is a token whose annotation claims it is wired
 * to a property/behaviour while no rule actually reads it.
 *
 * `scripts/audit.js --unused` already lists every token the framework never
 * consumes (via var(--sf-name)), but that list is ~160 entries and is
 * WARNING-only: most of those are legitimate "offer tokens" — public knobs a
 * consumer sets on their own BEM classes, which the framework itself needn't
 * read. That gate can't tell an offer token apart from a genuinely dead one.
 *
 * The discriminator is the annotation. If docs/token-annotations.json says a
 * token "Maps to @page margin" / "Applied to the X property" — an active
 * wiring claim — then a rule MUST consume it. A wiring claim with zero
 * consumers is a false promise (the A1/A2 findings in #582): it fails here.
 * Offer tokens, whose annotations only describe intent ("Backdrop blur amount
 * for your frosted surfaces"), are left to the warning-level --unused report.
 *
 * Run:
 *   node scripts/check-dead-knobs.js
 *   npm run check:dead-knobs
 */

import fs from 'node:fs';
import path from 'node:path';
import { stripComments } from './lib/parse.js';

const _root = process.env.SLASHED_ROOT?.trim();
const ROOT = _root ? path.resolve(_root) : path.resolve(import.meta.dirname, '..');
const ANNOTATIONS = path.join(ROOT, 'docs', 'token-annotations.json');

// Active-wiring phrases: an annotation using one of these promises the token is
// read by a shipped rule. Purely descriptive annotations don't match. Phrases
// that commonly appear NEGATED in disclaimers ("not consumed by any rule") are
// intentionally excluded so a truthful "this isn't wired" note can't trip the
// gate.
const WIRING_CLAIM = /\bmaps to\b|\bapplied (?:to|in|on)\b|\bwired to\b|\bhooks? into\b/i;
// Negated forms of the wiring phrases above. A truthful disclaimer such as
// "not wired to any rule" must never be read as a wiring promise.
const NEGATED_CLAIM = /\bnot\s+(?:maps to|applied (?:to|in|on)|wired to|hooks? into)\b/i;

const cssFiles = [];
for (const dir of ['core', 'optional']) {
  const abs = path.join(ROOT, dir);
  if (!fs.existsSync(abs)) continue;
  for (const f of fs.readdirSync(abs).filter((f) => f.endsWith('.css'))) {
    cssFiles.push(path.join(dir, f));
  }
}

let corpus = '';
const declared = new Set();
const propertyRegistered = new Set();
for (const rel of cssFiles) {
  const css = stripComments(fs.readFileSync(path.join(ROOT, rel), 'utf8'));
  corpus += '\n' + css;
  for (const m of css.matchAll(/@property\s+(--sf-[a-z0-9_-]+)/g)) propertyRegistered.add(m[1]);
  for (const m of css.matchAll(/(--sf-[a-z0-9_-]+)\s*:/g)) declared.add(m[1]);
}

function isConsumed(name) {
  const esc = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`var\\(\\s*${esc}[\\s,)]`).test(corpus);
}

const annotations = JSON.parse(fs.readFileSync(ANNOTATIONS, 'utf8'));
// The annotations file is a flat { tokens: {...} } / or top-level map; support both.
const tokenNotes = annotations.tokens ?? annotations;

const dead = [];
for (const [name, note] of Object.entries(tokenNotes)) {
  if (typeof note !== 'string') continue;
  if (!name.startsWith('--sf-')) continue;
  if (!WIRING_CLAIM.test(note)) continue;         // only annotations that PROMISE wiring
  if (NEGATED_CLAIM.test(note)) continue;         // …but not a negated "not wired to" disclaimer
  if (!declared.has(name)) continue;              // undeclared hooks are handled elsewhere
  // @property-registered tokens are "used" by their registration; but a wiring
  // claim still requires a real consumer, so don't exempt them here.
  if (isConsumed(name)) continue;                 // claim honoured — fine
  dead.push({ name, note });
}

if (dead.length) {
  console.error('check:dead-knobs FAILED — annotation promises wiring but no rule consumes the token:');
  for (const { name, note } of dead) {
    console.error(`  ${name}: "${note}"`);
  }
  console.error(
    '\nFix: either wire the token in a rule (var(' +
    dead[0].name + ', <today\'s literal>)), or rewrite the annotation to drop the ' +
    'wiring claim (see #582 A1/A2).',
  );
  process.exit(1);
}

console.log('check:dead-knobs OK — every wiring-claim annotation is backed by a real consumer.');
