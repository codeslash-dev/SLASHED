/**
 * Property 10: WCAG 2.1 AA contrast (4.5:1 body, 3:1 large/UI).
 *
 * Verifies the mathematical invariant: dark text on a light background
 * always meets 4.5:1 across the ranges used by the framework's defaults.
 *
 * The P2/P7/P8/P10 numbering gaps (no P1, P3-P6, P9 test files) are
 * explained in tests/README.md — not dead history, don't renumber.
 *
 * Run: node --test tests/tier1-p10-contrast.test.js
 */
import { test, describe } from 'node:test';
import fc   from 'fast-check';
import { parse, wcagContrast } from 'culori';

describe('P10: WCAG 2.1 AA contrast invariant (pure math)', () => {
  test('fast-check: dark text on light bg always meets 4.5:1 (100 iterations)', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 2, max: 25 }),   // text lightness 2–25%
        fc.integer({ min: 80, max: 99 }),  // bg lightness 80–99%
        (tl, bgl) => {
          const fg = parse(`hsl(217 15% ${tl}%)`);
          const bg = parse(`hsl(211 10% ${bgl}%)`);
          if (!fg || !bg) return true;
          return wcagContrast(fg, bg) >= 4.5;
        }
      ),
      { numRuns: 100 }
    );
  });
});
