/**
 * Property 7: After stripping @supports blocks from the built bundle,
 * no ungated declarations contain light-dark(), oklch(from…), or color-mix().
 *
 * This is the build-time complement to tier1-p2-coverage.test.js (which
 * checks the same invariant at source level). P7 verifies the invariant
 * holds in the final built artifact after bundling and minification.
 *
 * The P2/P7/P8/P10 numbering gaps (no P1, P3-P6, P9 test files) are
 * explained in tests/README.md — not dead history, don't renumber.
 *
 * Run: node --test tests/tier1-p7-oldengine.test.js
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs   from 'node:fs';
import path from 'node:path';
import fc   from 'fast-check';
import { stripSupports, findUngatedModernExpressions } from './supports-helpers.js';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist/slashed.full.css');

function extractCustomDecls(css) {
  const stripped = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const decls = new Map();
  for (const m of stripped.matchAll(/(--sf-[\w-]+)\s*:\s*([^;]+);/g)) {
    decls.set(m[1], m[2].replace(/\s+/g, ' ').trim());
  }
  return decls;
}

const CHECKED_TOKENS = [
  '--sf-color-primary', '--sf-color-secondary', '--sf-color-action',
  '--sf-color-neutral', '--sf-color-base', '--sf-color-text',
  '--sf-color-border', '--sf-color-success', '--sf-color-warning',
  '--sf-color-danger',
];

describe('P7: @supports gating — no modern expressions in ungated bundle declarations', () => {
  let oldEngineDecls;

  test('setup: build artifact exists and @supports stripping yields declarations', () => {
    assert.ok(fs.existsSync(DIST), 'dist/slashed.full.css missing — run npm run build first');
    const css = fs.readFileSync(DIST, 'utf8');
    const stripped = stripSupports(css);
    oldEngineDecls = extractCustomDecls(stripped);
    assert.ok(oldEngineDecls.size > 0, 'No declarations survived @supports stripping');
  });

  test('no light-dark() survives @supports stripping', () => {
    const violations = [...oldEngineDecls.entries()]
      .filter(([, v]) => v.includes('light-dark'));
    if (violations.length > 0) {
      assert.fail('Ungated light-dark() in bundle: ' + violations.map(([k]) => k).join(', '));
    }
  });

  test('no oklch(from…) survives @supports stripping', () => {
    const violations = [...oldEngineDecls.entries()]
      .filter(([, v]) => v.includes('oklch(from'));
    if (violations.length > 0) {
      assert.fail('Ungated oklch(from…) in bundle: ' + violations.map(([k]) => k).join(', '));
    }
  });

  test('no color-mix() in core semantic tokens survives @supports stripping', () => {
    const CORE = /^--sf-color-(?!.+-\d{2,3}$|.+-a\d+$)/;
    const violations = [...oldEngineDecls.entries()]
      .filter(([k, v]) => CORE.test(k) && v.includes('color-mix('));
    if (violations.length > 0) {
      assert.fail('Ungated color-mix() in core tokens: ' + violations.map(([k]) => k).join(', '));
    }
  });

  // Whole-bundle guard: the checks above only inspect `--sf-*` custom-property
  // declarations, so a modern expression used directly in an ordinary rule
  // (e.g. `background: color-mix(...)` on a component class) slipped through.
  // This scans every declaration — custom props and plain properties alike.
  test('no ungated modern colour expression anywhere in the bundle (all declarations)', () => {
    const css = fs.readFileSync(DIST, 'utf8');
    const hits = findUngatedModernExpressions(css);
    assert.deepEqual(
      hits,
      [],
      `Ungated modern colour expression(s) found in dist/slashed.full.css — ` +
        `wrap them in @supports:\n  ${hits.join('\n  ')}`,
    );
  });

  // fast-check: random sample from the checked set — none contain modern expressions
  test('fast-check: sampled core tokens have no modern expressions when ungated (100 iterations)', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: CHECKED_TOKENS.length - 1 }),
        (idx) => {
          const val = oldEngineDecls.get(CHECKED_TOKENS[idx]) ?? '';
          return !val.includes('light-dark') &&
                 !val.includes('oklch(from') &&
                 !val.includes('color-mix(');
        }
      ),
      { numRuns: 100 }
    );
  });
});
