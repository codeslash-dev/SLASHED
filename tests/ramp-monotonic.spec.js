// @ts-check
// Proves the numeric brand ramp (--sf-color-{family}-50…950) never FOLDS —
// its luminance is monotonically non-increasing from step 50 to 950 for ANY
// source colour the user picks, at any lightness of that colour.
//
// This is the guarantee the absolute-anchor ramp model buys us: each step
// pulls the family colour's own OKLCH lightness a fixed fraction toward an
// ABSOLUTE target (--sf-palette-tint-l / --sf-palette-shade-l), clamped so a
// tint can never end darker than the base nor a shade lighter. The ladder
// therefore stays light→dark regardless of where the source sits relative to
// the theme's text/surface tokens. The previous color-mix()-toward-text/surface
// model folded into a "U" when the source fell outside the anchor band.
//
// fixture.html loads the full bundle (palette tokens are core, gated behind the
// relative-colour @supports block Chromium/Firefox/WebKit satisfy).
import { test, expect } from '@playwright/test';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const FIXTURE = pathToFileURL(path.join(import.meta.dirname, 'fixture.html')).href;

const FAMILIES = ['primary', 'secondary', 'tertiary', 'action', 'neutral'];
const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

// Source lightnesses spanning the whole axis, including values OUTSIDE the
// default anchor band (0.06 is darker than the text anchor; 0.98 is lighter
// than the surface anchor) — exactly where the old model folded.
const SOURCE_LS = [0.06, 0.22, 0.5, 0.78, 0.98];

// Self-contained for page.evaluate: for one family, sweep several source
// lightnesses and return, per sweep, the {step, lum, alpha} of every step.
function sweepFamily([family, steps, sourceLs, theme]) {
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
  // Sweep the theme's own source token: source-light under light, source-dark
  // under dark — dark exercises the same clamp path with different source
  // colours, so the guarantee is symmetric across both modes.
  const prop = `--sf-color-${family}-source-${theme}`;
  const cv = document.createElement('canvas'); cv.width = cv.height = 1;
  const ctx = cv.getContext('2d', { willReadFrequently: true });
  const lin = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  const el = document.createElement('div'); document.body.appendChild(el);

  const sweeps = sourceLs.map(L => {
    root.style.setProperty(prop, `oklch(${L} 0.16 264)`);
    const rows = steps.map(step => {
      el.style.backgroundColor = `var(--sf-color-${family}-${step})`;
      const c = getComputedStyle(el).backgroundColor;
      ctx.clearRect(0, 0, 1, 1); ctx.fillStyle = c; ctx.fillRect(0, 0, 1, 1);
      const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
      return { step, lum: 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b), alpha: a };
    });
    return { L, rows };
  });

  el.remove();
  root.style.removeProperty(prop);
  return sweeps;
}

test.describe('Brand ramp is monotonic for any source colour', () => {
  for (const family of FAMILIES) {
    for (const theme of ['light', 'dark']) {
      test(`${family} ramp never folds across the lightness axis (${theme})`, async ({ page }) => {
        await page.goto(FIXTURE);
        const sweeps = await page.evaluate(sweepFamily, [family, STEPS, SOURCE_LS, theme]);

        const EPS = 0.006; // absorbs 8-bit rounding; clamped extremes go flat (equal), a fold increases
        for (const { L, rows } of sweeps) {
          for (const { step, alpha } of rows) {
            expect(alpha, `${family}-${step} (${theme}, source L=${L}) should be opaque`).toBe(255);
          }
          for (let i = 0; i < rows.length - 1; i++) {
            expect(
              rows[i + 1].lum,
              `${family} (${theme}, source L=${L}): step ${rows[i + 1].step} must not be lighter than ${rows[i].step}`
            ).toBeLessThanOrEqual(rows[i].lum + EPS);
          }
        }
      });
    }
  }

  test('default palette keeps light-to-dark endpoints (50 light, 950 dark)', async ({ page }) => {
    await page.goto(FIXTURE);
    for (const family of FAMILIES) {
      const ends = await page.evaluate(([fam, steps]) => {
        document.documentElement.setAttribute('data-theme', 'light');
        const cv = document.createElement('canvas'); cv.width = cv.height = 1;
        const ctx = cv.getContext('2d', { willReadFrequently: true });
        const lin = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
        const el = document.createElement('div'); document.body.appendChild(el);
        const read = step => {
          el.style.backgroundColor = `var(--sf-color-${fam}-${step})`;
          ctx.clearRect(0, 0, 1, 1); ctx.fillStyle = getComputedStyle(el).backgroundColor; ctx.fillRect(0, 0, 1, 1);
          const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
          return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
        };
        const res = { light: read(steps[0]), dark: read(steps[steps.length - 1]) };
        el.remove();
        return res;
      }, [family, STEPS]);
      expect(ends.light, `${family}-50 should be light`).toBeGreaterThan(0.6);
      expect(ends.dark, `${family}-950 should be dark`).toBeLessThan(0.15);
    }
  });
});
