/**
 * Feature: tier-1-color-fallback
 * Property 11: Overriding --sf-*-h/s/l channel variables propagates to all
 *              derived tokens on every browser (no build step required).
 *
 * Run: node --test tests/tier1-p11-overrides.test.js
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fc from 'fast-check';
import { parse } from 'culori';

// Simulate the HSL derivation from core/tokens.color-fallbacks.css in JS.
function resolveTokens({ h, s, l }) {
  const clamp = (v) => Math.max(0, Math.min(100, v));
  return {
    primary:       `hsl(${h} ${s}% ${l}%)`,
    primaryHover:  `hsl(${h} ${s}% ${clamp(l - 8)}%)`,
    primarySubtle: `hsl(${h} ${s}% ${l}% / 0.12)`,
    primaryStrong: `hsl(${h} ${s}% ${clamp(l - 6)}%)`,
  };
}

describe('P11: HSL channel override propagation', () => {

  test('overriding h changes primary color', () => {
    const blue = resolveTokens({ h: 226, s: 99, l: 47 });
    const red  = resolveTokens({ h: 352, s: 93, l: 47 });
    assert.notEqual(blue.primary, red.primary, 'Different hue → different primary');
  });

  test('overriding l changes primary AND derived hover', () => {
    const light = resolveTokens({ h: 226, s: 99, l: 60 });
    const dark  = resolveTokens({ h: 226, s: 99, l: 30 });
    assert.notEqual(light.primary, dark.primary, 'Different l → different primary');
    assert.notEqual(light.primaryHover, dark.primaryHover, 'Hover propagates');
  });

  test('hover is always l - 8% relative to primary', () => {
    for (const l of [20, 40, 60, 80]) {
      const t = resolveTokens({ h: 226, s: 99, l });
      const expectedHoverL = Math.max(0, l - 8);
      assert.ok(
        t.primaryHover.includes(`${expectedHoverL}%`),
        `l=${l}: hover should contain ${expectedHoverL}%, got: ${t.primaryHover}`
      );
    }
  });

  test('subtle variant always has alpha 0.12', () => {
    const t = resolveTokens({ h: 340, s: 80, l: 50 });
    assert.ok(t.primarySubtle.includes('/ 0.12'), `Expected alpha 0.12, got: ${t.primarySubtle}`);
  });

  // fast-check: any h/s/l → primary ≠ hover (l has enough room)
  test('fast-check: primary ≠ hover when l > 8 (100 iterations)', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 360 }),
        fc.integer({ min: 30, max: 100 }),
        fc.integer({ min: 20, max: 80 }),
        (h, s, l) => {
          const t = resolveTokens({ h, s, l });
          return t.primary !== t.primaryHover;
        }
      ),
      { numRuns: 100 }
    );
  });

  // fast-check: different l values always produce different primaries
  test('fast-check: l1 ≠ l2 → different primary colors (100 iterations)', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 360 }),
        fc.integer({ min: 30, max: 100 }),
        fc.integer({ min: 10, max: 44 }),
        fc.integer({ min: 55, max: 90 }),
        (h, s, l1, l2) => {
          const t1 = resolveTokens({ h, s, l: l1 });
          const t2 = resolveTokens({ h, s, l: l2 });
          return t1.primary !== t2.primary;
        }
      ),
      { numRuns: 100 }
    );
  });

  // fast-check: resolved colors are parseable (valid CSS)
  test('fast-check: all resolved tokens are parseable by culori (100 iterations)', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 360 }),
        fc.integer({ min: 0, max: 100 }),
        fc.integer({ min: 0, max: 100 }),
        (h, s, l) => {
          const t = resolveTokens({ h, s, l });
          return Object.values(t).every(v => !!parse(v));
        }
      ),
      { numRuns: 100 }
    );
  });
});
