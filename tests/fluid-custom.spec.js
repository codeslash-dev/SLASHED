// @ts-check
// Custom fluid slots — --sf-fluid-custom-{1..3} resolve a fluid length
// between their two endpoint inputs across the engine's viewport range
// (--sf-fluid-min-vw: 22.5rem = 360px, --sf-fluid-max-vw: 90rem = 1440px
// at the default 16px root).
import { test, expect } from '@playwright/test';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const FIXTURE = pathToFileURL(path.join(import.meta.dirname, 'fixture.html')).href;

// Resolve a custom property as a width on a probe div (px number).
// Self-contained for page.evaluate.
function resolveTokenPx(tok) {
  const el = document.createElement('div');
  el.style.width = `var(${tok})`;
  document.body.appendChild(el);
  const val = parseFloat(getComputedStyle(el).width);
  el.remove();
  return val;
}

test.describe('Custom fluid slots', () => {
  test('default slot sits at min endpoint at the min viewport', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto(FIXTURE);
    // defaults: min=1, max=2 → 16px at 360px viewport
    const px = await page.evaluate(resolveTokenPx, '--sf-fluid-custom-1');
    expect(px).toBeCloseTo(16, 1);
  });

  test('default slot sits at max endpoint at the max viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 800 });
    await page.goto(FIXTURE);
    const px = await page.evaluate(resolveTokenPx, '--sf-fluid-custom-1');
    expect(px).toBeCloseTo(32, 1);
  });

  test('default slot interpolates strictly between endpoints mid-range', async ({ page }) => {
    await page.setViewportSize({ width: 900, height: 800 });
    await page.goto(FIXTURE);
    const px = await page.evaluate(resolveTokenPx, '--sf-fluid-custom-1');
    expect(px).toBeGreaterThan(16);
    expect(px).toBeLessThan(32);
  });

  test('overriding the endpoint inputs recalibrates the slot', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 800 });
    await page.goto(FIXTURE);
    const px = await page.evaluate(() => {
      document.documentElement.style.setProperty('--sf-fluid-custom-2-min', '0.875');
      document.documentElement.style.setProperty('--sf-fluid-custom-2-max', '1.375');
      const el = document.createElement('div');
      el.style.width = 'var(--sf-fluid-custom-2)';
      document.body.appendChild(el);
      const val = parseFloat(getComputedStyle(el).width);
      el.remove();
      return val;
    });
    // 1.375rem = 22px at the max viewport
    expect(px).toBeCloseTo(22, 1);
  });

  test('all three slots resolve', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto(FIXTURE);
    for (const tok of ['--sf-fluid-custom-1', '--sf-fluid-custom-2', '--sf-fluid-custom-3']) {
      const px = await page.evaluate(resolveTokenPx, tok);
      expect(px, `${tok} should resolve to a positive length`).toBeGreaterThan(0);
    }
  });

  test('slots recalibrate when the engine viewport range is retuned', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 800 });
    await page.goto(FIXTURE);
    const px = await page.evaluate(() => {
      // push the fluid ceiling beyond the current viewport — the slot
      // should no longer have reached its max value at 1440px
      document.documentElement.style.setProperty('--sf-fluid-max-vw', '120');
      const el = document.createElement('div');
      el.style.width = 'var(--sf-fluid-custom-1)';
      document.body.appendChild(el);
      const val = parseFloat(getComputedStyle(el).width);
      el.remove();
      return val;
    });
    expect(px).toBeGreaterThan(16);
    expect(px).toBeLessThan(32);
  });
});
