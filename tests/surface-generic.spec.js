// @ts-check
// Generic surface — .sf-surface derives background, auto-contrast
// foreground, and the contextual token cascade from --sf-surface-color.
import { test, expect } from '@playwright/test';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

// fixture.html loads slashed.full.css (includes tokens.palette.css)
const FIXTURE = pathToFileURL(path.join(import.meta.dirname, 'fixture.html')).href;

// Builds a .sf-surface probe with the given --sf-surface-color value and
// returns { contrast, fgColor, pColor, borderOnSurface, borderOnRoot }.
// Self-contained for page.evaluate (canvas-luminance technique shared with
// color-semantic.spec.js).
function probeSurface(surfaceColor) {
  const cv = document.createElement('canvas'); cv.width = cv.height = 1;
  const ctx = cv.getContext('2d', { willReadFrequently: true });
  const toLum = (color) => {
    ctx.clearRect(0, 0, 1, 1); ctx.fillStyle = '#000'; ctx.fillStyle = color; ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    const lin = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  };

  const host = document.createElement('section');
  host.className = 'sf-surface';
  host.style.setProperty('--sf-surface-color', surfaceColor);
  const p = document.createElement('p');
  p.textContent = 'descendant';
  host.appendChild(p);
  document.body.appendChild(host);

  const hostStyle = getComputedStyle(host);
  const bg = hostStyle.backgroundColor;
  const fg = hostStyle.color;
  const pColor = getComputedStyle(p).color;

  // resolve --sf-color-border inside and outside the surface
  const probeBorder = (parent) => {
    const el = document.createElement('div');
    el.style.backgroundColor = 'var(--sf-color-border)';
    parent.appendChild(el);
    const c = getComputedStyle(el).backgroundColor;
    el.remove();
    return c;
  };
  const borderOnSurface = probeBorder(host);
  const borderOnRoot = probeBorder(document.body);

  const a = toLum(bg);
  const b = toLum(fg);
  const contrast = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

  host.remove();
  return { contrast, fg, pColor, borderOnSurface, borderOnRoot };
}

const SAMPLES = [
  'oklch(0.2 0.1 260)',                 // dark arbitrary color → light text
  'oklch(0.9 0.05 100)',                // light arbitrary color → dark text
  'var(--sf-color-primary-300)',        // palette shade (optional/tokens.palette.css)
];

test.describe('Generic surface (.sf-surface)', () => {
  for (const sample of SAMPLES) {
    test(`auto-contrast foreground ≥ 3:1 for ${sample}`, async ({ page }) => {
      await page.goto(FIXTURE);
      const { contrast } = await page.evaluate(probeSurface, sample);
      expect(contrast).toBeGreaterThanOrEqual(3);
    });
  }

  test('descendant text inherits the surface foreground', async ({ page }) => {
    await page.goto(FIXTURE);
    const { fg, pColor } = await page.evaluate(probeSurface, 'oklch(0.2 0.1 260)');
    expect(pColor).toBe(fg);
  });

  test('contextual cascade rebinds --sf-color-border inside the surface', async ({ page }) => {
    await page.goto(FIXTURE);
    const { borderOnSurface, borderOnRoot } = await page.evaluate(probeSurface, 'oklch(0.2 0.1 260)');
    expect(borderOnSurface).not.toBe(borderOnRoot);
  });

  test('default surface color is the base surface', async ({ page }) => {
    await page.goto(FIXTURE);
    const { bg, baseBg } = await page.evaluate(() => {
      const host = document.createElement('section');
      host.className = 'sf-surface';
      document.body.appendChild(host);
      const bg = getComputedStyle(host).backgroundColor;
      const el = document.createElement('div');
      el.style.backgroundColor = 'var(--sf-color-base)';
      document.body.appendChild(el);
      const baseBg = getComputedStyle(el).backgroundColor;
      el.remove(); host.remove();
      return { bg, baseBg };
    });
    expect(bg).toBe(baseBg);
  });
});
