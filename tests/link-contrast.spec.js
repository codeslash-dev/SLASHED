// @ts-check
// Proves the link-colour lightness clamp keeps link text ≥ WCAG AA (4.5:1)
// on the page background — not just for the default palette, but across a
// range of brand `--sf-color-action` overrides (moderate-chroma hues).
// Very high-chroma hues (saturated yellow/green) are a documented exception
// and intentionally not asserted here.
import { test, expect } from '@playwright/test';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const DEMO_URL = pathToFileURL(path.resolve(import.meta.dirname, 'a11y-fixture.html')).href;

// Moderate brand colours someone might plausibly set as their action colour.
const OVERRIDES = [
  'oklch(0.85 0.14 250)', // light blue
  'oklch(0.72 0.18 25)',  // coral/red
  'oklch(0.68 0.16 300)', // purple
  'oklch(0.60 0.16 210)', // default-ish cyan
  '#3b82f6',              // a hex brand blue
];

test.describe('Link contrast under brand overrides', () => {
  for (const action of OVERRIDES) {
    test(`link text ≥ 4.5:1 in light mode when action = ${action}`, async ({ page }) => {
      await page.goto(DEMO_URL);
      const ratio = await page.evaluate((actionColor) => {
        const root = document.documentElement;
        root.setAttribute('data-theme', 'light');
        root.style.setProperty('--sf-color-action-source-light', actionColor);

        const link = document.querySelector('main a');
        const cs = getComputedStyle(link);

        // Resolve any colour to sRGB via canvas, then WCAG relative luminance.
        const cv = document.createElement('canvas');
        cv.width = cv.height = 1;
        const ctx = cv.getContext('2d', { willReadFrequently: true });
        const toLum = (color) => {
          ctx.clearRect(0, 0, 1, 1);
          ctx.fillStyle = '#000';
          ctx.fillStyle = color;
          ctx.fillRect(0, 0, 1, 1);
          const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
          const lin = (v) => {
            v /= 255;
            return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
          };
          return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
        };

        const fg = toLum(cs.color);
        const bg = toLum(getComputedStyle(document.body).backgroundColor);
        const [hi, lo] = fg > bg ? [fg, bg] : [bg, fg];
        return (hi + 0.05) / (lo + 0.05);
      }, action);

      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });
  }
});
