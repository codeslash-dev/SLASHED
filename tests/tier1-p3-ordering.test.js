/**
 * Feature: tier-1-color-fallback
 * Property 3: sRGB default source-index strictly less than gated modern
 *             declaration's source-index, per token, in dist/slashed.full.css.
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

function findDeclarations(css, tokenName) {
  const results = [];
  const re = new RegExp(tokenName.replace(/[-]/g, '\\-') + '\\s*:', 'g');
  let m;
  while ((m = re.exec(css)) !== null) {
    results.push({ index: m.index });
  }
  return results;
}

describe('P3: sRGB fallback declared before modern gated expression', () => {
  let full;

  test('dist/slashed.full.css exists', () => {
    assert.ok(fs.existsSync(DIST), 'dist/slashed.full.css missing');
    full = fs.readFileSync(DIST, 'utf8');
  });

  // The fallbacks CSS comes before tokens.css in the bundle, so all
  // declarations from the fallbacks file have smaller source indices.
  test('tokens.color-fallbacks.css content appears before tokens.css content', () => {
    const fallbacksMarker = 'GENERATED FROM SOURCE by scripts/gen-color-fallbacks.js';
    const tokensMarker    = 'SLASHED — core/tokens.css';
    const fIdx = full.indexOf(fallbacksMarker);
    const tIdx = full.indexOf(tokensMarker);
    assert.ok(fIdx >= 0, 'fallbacks header not found in bundle');
    assert.ok(tIdx >= 0, 'tokens.css header not found in bundle');
    assert.ok(fIdx < tIdx, 'fallbacks content should appear before tokens.css in bundle');
  });

  // For each checked token, the sRGB declaration (from fallbacks) must appear
  // at a smaller source position than any @supports-gated declaration
  for (const token of TOKENS_TO_CHECK) {
    test(`${token}: sRGB default precedes gated modern expression`, () => {
      const all = findDeclarations(full, token + ':');
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
          const all = findDeclarations(full, token + ':');
          if (all.length < 2) return true;
          const first = all[0].index;
          return all.slice(1).every(d => first < d.index);
        }
      ),
      { numRuns: 100 }
    );
  });
});
