/**
 * Contract test for configurator/src/lib/scaleShadow.ts.
 *
 * The scale panels warn when a concrete per-step value in the override map
 * shadows the generated scale, and offer to clear those entries. That guard is
 * only as good as its list of step tokens: a step the list misses keeps
 * silently overriding the knobs with no warning — the exact failure the guard
 * exists to surface — and a step that no longer exists would offer to "clear" a
 * token nothing reads.
 *
 * The lists are therefore pinned to the source of truth: every token in
 * core/tokens.css whose value is built from the corresponding generator inputs
 * IS a generated step, by definition. Add a rung to the framework (a 5xl, say)
 * and this test fails until the guard learns about it.
 *
 * Runs in the root unit suite (node --test → CI), like
 * tests/configurator-data-contract.test.js, so a TypeScript source in the
 * configurator package is checked without pulling in a TS toolchain: the lists
 * are plain string-literal arrays and are read as text.
 *
 * Run: node --test tests/scale-shadow-steps.test.js
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { stripComments } from '../scripts/lib/parse.js';

const ROOT = path.resolve(import.meta.dirname, '..');
const TOKENS_CSS = path.join(ROOT, 'core', 'tokens.css');
const SCALE_SHADOW = path.join(ROOT, 'configurator', 'src', 'lib', 'scaleShadow.ts');

/** Every `--sf-*: value;` declaration in core/tokens.css, as [name, value]. */
function declarations() {
  const css = stripComments(fs.readFileSync(TOKENS_CSS, 'utf8'));
  const out = [];
  for (const line of css.split('\n')) {
    const m = line.match(/^\s*(--sf-[a-z0-9-]+)\s*:\s*(.+);\s*$/);
    if (m) out.push([m[1], m[2]]);
  }
  // Guard the parse itself: if the file's formatting ever changes so that
  // declarations stop being one-per-line, every set below would come back empty
  // and each assertion would vacuously pass.
  assert.ok(out.length > 100, `parsed only ${out.length} declarations from core/tokens.css — parser is stale`);
  return out;
}

/** Tokens whose value is generated from `input` (e.g. --sf-space-base-min). */
function generatedFrom(decls, input) {
  return decls.filter(([, value]) => value.includes(`var(${input})`)).map(([name]) => name).sort();
}

/** Read an exported string-literal array out of the TypeScript source. */
function listFromSource(source, exportName) {
  const m = source.match(new RegExp(`export const ${exportName} = \\[([\\s\\S]*?)\\]`));
  assert.ok(m, `${exportName} not found in scaleShadow.ts`);
  return [...m[1].matchAll(/'(--sf-[a-z0-9-]+)'/g)].map((x) => x[1]).sort();
}

describe('scaleShadow step lists match the generated scales', () => {
  const decls = declarations();
  const source = fs.readFileSync(SCALE_SHADOW, 'utf8');

  // The display steps are generated from --sf-text-display-base-min AND read the
  // shared --sf-text-ratio-*; the plain text steps use --sf-text-base-min. Both
  // sets are disjoint because the base inputs differ.
  const cases = [
    ['SPACE_STEP_TOKENS', '--sf-space-base-min'],
    ['TEXT_STEP_TOKENS', '--sf-text-base-min'],
    ['DISPLAY_STEP_TOKENS', '--sf-text-display-base-min'],
  ];

  for (const [exportName, input] of cases) {
    test(`${exportName} covers exactly the tokens generated from ${input}`, () => {
      const generated = generatedFrom(decls, input);
      assert.ok(generated.length > 0, `no tokens in core/tokens.css are generated from ${input}`);
      assert.deepEqual(
        listFromSource(source, exportName),
        generated,
        `${exportName} is out of sync with core/tokens.css — the shadow guard would ` +
          'either miss a step (no warning, knobs silently inert) or offer to clear a dead token',
      );
    });
  }

  test('the non-generative spacing tokens are excluded', () => {
    // --sf-space-none / --sf-space-px are fixed values, not rungs of the scale:
    // overriding them cannot shadow the knobs, so offering to "restore the
    // scale" for them would be wrong.
    const list = listFromSource(source, 'SPACE_STEP_TOKENS');
    assert.ok(!list.includes('--sf-space-none'));
    assert.ok(!list.includes('--sf-space-px'));
  });
});
