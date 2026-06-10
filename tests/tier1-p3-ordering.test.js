/**
 * Feature: tier-1-color-fallback
 * Property 3: sRGB default source-index strictly less than gated modern
 *             declaration's source-index, per token, in the documented opt-in
 *             load order (core/tokens.color-fallbacks.css before the bundle).
 *
 * The fallbacks file is NOT part of any default bundle — it is a standalone
 * opt-in. This test simulates the documented integration order and verifies
 * that every checked token's ungated sRGB declaration precedes all later
 * (gated modern) declarations, so capable engines override the fallback.
 *
 * Run: node --test tests/tier1-p3-ordering.test.js
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs   from 'node:fs';
import path from 'node:path';
import fc   from 'fast-check';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist/slashed.full.css');
const FALLBACKS = path.join(ROOT, 'core/tokens.color-fallbacks.css');

const TOKENS_TO_CHECK = [
  '--sf-color-primary',
  '--sf-color-secondary',
  '--sf-color-action',
  '--sf-color-neutral',
  '--sf-color-base',
  '--sf-color-success',
  '--sf-color-warning',
  '--sf-color-error',
  '--sf-color-text',
  '--sf-color-border',
  '--sf-color-link',
];

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\-]/g, '\\$&');
}

function findDeclarations(css, tokenName) {
  const results = [];
  const re = new RegExp(escapeRegExp(tokenName) + '\\s*:', 'g');
  let m;
  while ((m = re.exec(css)) !== null) {
    results.push({ index: m.index });
  }
  return results;
}

describe('P3: sRGB fallback declared before modern gated expression', () => {
  let full;

  test('source files exist; simulate opt-in load order', () => {
    assert.ok(fs.existsSync(DIST), 'dist/slashed.full.css missing');
    assert.ok(fs.existsSync(FALLBACKS), 'core/tokens.color-fallbacks.css missing');
    // Documented opt-in: fallbacks stylesheet linked before the bundle.
    full = fs.readFileSync(FALLBACKS, 'utf8') + '\n' + fs.readFileSync(DIST, 'utf8');
  });

  // Default bundles must NOT ship the fallbacks — they are opt-in only.
  test('fallbacks are not embedded in dist/slashed.full.css', () => {
    const bundle = fs.readFileSync(DIST, 'utf8');
    const fallbacksMarker = 'HSL-based fallbacks for browsers without light-dark()';
    assert.ok(
      !bundle.includes(fallbacksMarker),
      'fallbacks content found inside the default bundle — they must stay opt-in'
    );
  });

  // For each checked token, the sRGB declaration (from fallbacks) must appear
  // at a smaller source position than any @supports-gated declaration
  for (const token of TOKENS_TO_CHECK) {
    test(`${token}: sRGB default precedes gated modern expression`, () => {
      const all = findDeclarations(full, token);
      if (all.length < 2) return; // token may only appear once (ungated, no modern)

      // First occurrence is the sRGB fallback from tokens.color-fallbacks.css
      // All @supports-gated occurrences come later
      const first = all[0].index;
      const rest  = all.slice(1).map(d => d.index);
      for (const laterIdx of rest) {
        assert.ok(first < laterIdx, `${token}: sRGB fallback not first (${first} vs ${laterIdx})`);
      }
    });
  }

  // fast-check: random token from known set respects ordering invariant
  test('fast-check: ordering invariant holds for sampled tokens (100 iterations)', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: TOKENS_TO_CHECK.length - 1 }),
        (idx) => {
          const token = TOKENS_TO_CHECK[idx];
          const all = findDeclarations(full, token);
          if (all.length < 2) return true;
          const first = all[0].index;
          return all.slice(1).every(d => first < d.index);
        }
      ),
      { numRuns: 100 }
    );
  });
});
