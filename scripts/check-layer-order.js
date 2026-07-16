#!/usr/bin/env node
/**
 * CI gate: the layer order documented in docs/architecture.md must match the
 * real @layer declaration in core/layers.css.
 *
 * The cascade-layer order IS the framework's specificity contract. When
 * cad296b reordered the source so `slashed.layout` wins over
 * `slashed.components`, architecture.md kept the old order in BOTH its `@layer`
 * code block and its "Specificity" ladder — a silent, material drift that no
 * gate caught (check-doc-refs validates token/class NAMES, not ordering prose).
 *
 * This gate parses the authoritative order from core/layers.css and asserts:
 *   1. the ```css @layer block in architecture.md lists the same order, and
 *   2. the Specificity ladder lists the exact reverse (it is printed
 *      highest-priority-first).
 *
 * Run:
 *   node scripts/check-layer-order.js      # check only
 *   npm run check:layer-order              # same via npm
 */
import fs from 'node:fs';
import path from 'node:path';
import { stripComments } from './lib/parse.js';

const slashedRoot = process.env.SLASHED_ROOT?.trim();
const ROOT = slashedRoot
  ? path.resolve(slashedRoot)
  : path.resolve(import.meta.dirname, '..');

function fail(msg) {
  console.error(`check:layer-order FAILED — ${msg}`);
  process.exit(1);
}

const read = (rel) => {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) fail(`${rel} not found.`);
  return fs.readFileSync(abs, 'utf8');
};

/** Ordered `slashed.*` layer names found in a chunk of text. */
const layersIn = (text) => [...text.matchAll(/slashed\.([a-z]+)/g)].map((m) => m[1]);

// ── Source of truth: the @layer declaration in core/layers.css ───────────────
// Strip CSS comments first so an `@layer` that appears inside a file-header
// comment (e.g. "/* keep @layer in sync with architecture.md */") can't be
// mistaken for the real declaration.
const layersCss = stripComments(read('core/layers.css'));
const declStart = layersCss.indexOf('@layer');
if (declStart === -1) fail('no @layer declaration found in core/layers.css.');
const declEnd = layersCss.indexOf(';', declStart);
if (declEnd === -1) fail('unterminated @layer declaration in core/layers.css.');
const srcOrder = layersIn(layersCss.slice(declStart, declEnd));
if (srcOrder.length === 0) fail('core/layers.css @layer declaration lists no layers.');

// ── Fenced code blocks in architecture.md ────────────────────────────────────
const arch = read('docs/architecture.md');
const blocks = [...arch.matchAll(/```[a-z]*\n([\s\S]*?)```/g)].map((m) => m[1]);

// Block 1: the one that re-declares `@layer`.
const declBlock = blocks.find((b) => b.includes('@layer'));
if (!declBlock) fail('docs/architecture.md has no ```@layer code block.');
const docOrder = layersIn(declBlock.slice(declBlock.indexOf('@layer')));

// Block 2: the Specificity ladder (printed highest-first, so labelled).
const specBlock = blocks.find((b) => /highest/.test(b) && /lowest/.test(b));
if (!specBlock) fail('docs/architecture.md has no Specificity ladder block (highest…lowest).');
const specOrder = layersIn(specBlock);

const eq = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);
const fmt = (a) => a.map((l) => `slashed.${l}`).join(', ');

if (!eq(docOrder, srcOrder)) {
  fail(
    'the @layer block in docs/architecture.md does not match core/layers.css:\n' +
    `  source: ${fmt(srcOrder)}\n  doc:    ${fmt(docOrder)}`,
  );
}

const reversed = [...srcOrder].reverse();
if (!eq(specOrder, reversed)) {
  fail(
    'the Specificity ladder in docs/architecture.md is not the reverse of core/layers.css:\n' +
    `  expected (highest→lowest): ${fmt(reversed)}\n  doc:                       ${fmt(specOrder)}`,
  );
}

console.log(
  `check:layer-order OK — architecture.md matches core/layers.css (${srcOrder.length} layers).`,
);
