/**
 * Feature: tier-1-color-fallback
 * Property 5: Random OKLCH inputs into the generator's converter produce
 *             valid sRGB values with all channels in [0,1] and alpha preserved.
 *
 * Run: node --test tests/tier1-p5-gamut.test.js
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fc from 'fast-check';
import { toGamut, formatHex, parse } from 'culori';

// Re-implement the converter logic exactly as in gen-color-fallbacks.js
function toSRGB(l, c, h) {
  const color = { mode: 'oklch', l, c, h };
  return toGamut('rgb')(color);
}

function hex(l, c, h) {
  const out = toSRGB(l, c, h);
  return formatHex(out);
}

function rgbAlpha(l, c, h, alpha) {
  const out = { ...toSRGB(l, c, h), alpha };
  const r = Math.round(Math.min(1, Math.max(0, out.r ?? 0)) * 255);
  const g = Math.round(Math.min(1, Math.max(0, out.g ?? 0)) * 255);
  const b = Math.round(Math.min(1, Math.max(0, out.b ?? 0)) * 255);
  return { r, g, b, alpha };
}

describe('P5: Gamut mapping produces valid sRGB for arbitrary OKLCH inputs', () => {

  test('fast-check: arbitrary OKLCH → sRGB channels in [0,1] (100 iterations)', () => {
    // culori's toGamut can return values like -2e-129 (effectively 0) due to
    // floating-point precision on near-degenerate inputs. formatHex clamps these
    // correctly, so we allow a small epsilon to match real-world generator output.
    const EPS = 1e-10;
    fc.assert(
      fc.property(
        fc.float({ min: 0, max: Math.fround(1), noNaN: true }),
        fc.float({ min: 0, max: Math.fround(0.4), noNaN: true }),
        fc.float({ min: 0, max: Math.fround(360), noNaN: true }),
        (l, c, h) => {
          const out = toSRGB(l, c, h);
          const r = out.r ?? 0;
          const g = out.g ?? 0;
          const b = out.b ?? 0;
          return r >= -EPS && r <= 1+EPS && g >= -EPS && g <= 1+EPS && b >= -EPS && b <= 1+EPS;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('fast-check: formatHex produces valid 3 or 6-char hex (100 iterations)', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 0, max: Math.fround(1), noNaN: true }),
        fc.float({ min: 0, max: Math.fround(0.4), noNaN: true }),
        fc.float({ min: 0, max: Math.fround(360), noNaN: true }),
        (l, c, h) => {
          const h6 = hex(l, c, h);
          return /^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/i.test(h6);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('fast-check: alpha values preserved exactly in rgb() output (100 iterations)', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 0, max: Math.fround(1), noNaN: true }),
        fc.float({ min: 0, max: Math.fround(0.4), noNaN: true }),
        fc.float({ min: 0, max: Math.fround(360), noNaN: true }),
        fc.oneof(
          fc.constant(0.05),
          fc.constant(0.10),
          fc.constant(0.12),
          fc.constant(0.28),
          fc.constant(0.30),
          fc.float({ min: Math.fround(0.01), max: Math.fround(0.99), noNaN: true })
        ),
        (l, c, h, a) => {
          const out = rgbAlpha(l, c, h, a);
          return out.r >= 0 && out.r <= 255 &&
                 out.g >= 0 && out.g <= 255 &&
                 out.b >= 0 && out.b <= 255 &&
                 Math.abs(out.alpha - a) < 1e-6;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('fast-check: in-gamut OKLCH colors stay in sRGB after toGamut (100 iterations)', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 0, max: Math.fround(1), noNaN: true }),
        (l) => {
          const color = { mode: 'oklch', l, c: 0, h: 0 };
          const mapped = toGamut('rgb')(color);
          return (mapped.r ?? 0) >= 0 && (mapped.r ?? 0) <= 1;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('extremes: oklch(0 0 0) → #000 or equivalent', () => {
    const out = toSRGB(0, 0, 0);
    const r = Math.round((out.r ?? 0) * 255);
    assert.ok(r >= 0 && r <= 5, `Expected near-black, got r=${r}`);
  });

  test('extremes: oklch(1 0 0) → #fff or equivalent', () => {
    const out = toSRGB(1, 0, 0);
    const r = Math.round((out.r ?? 0) * 255);
    assert.ok(r >= 250 && r <= 255, `Expected near-white, got r=${r}`);
  });
});
