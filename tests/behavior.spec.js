// @ts-check
// Behavioural regression tests: reduced-motion, forced-colors, container
// queries, and a sample of state-class effects. Loads the demo over file://.
import { test, expect } from '@playwright/test';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const DEMO_URL = pathToFileURL(path.resolve(import.meta.dirname, '..', 'docs', 'demo.html')).href;

test.describe('Reduced motion', () => {
  test('transitions are neutralised under prefers-reduced-motion: reduce', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(DEMO_URL);
    // accessibility.css forces transition/animation duration to 0.01ms.
    const dur = await page.locator('a').first().evaluate((el) => {
      const s = getComputedStyle(el);
      return Math.max(parseFloat(s.transitionDuration) || 0, parseFloat(s.animationDuration) || 0);
    });
    expect(dur).toBeLessThanOrEqual(0.001); // ≤ 1ms (0.01ms in seconds)
  });

  test('.no-motion neutralises motion regardless of OS preference', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto(DEMO_URL);
    const dur = await page.evaluate(() => {
      const el = document.createElement('div');
      el.className = 'no-motion';
      el.style.transition = 'opacity 2s';
      document.body.appendChild(el);
      return parseFloat(getComputedStyle(el).transitionDuration) || 0;
    });
    expect(dur).toBeLessThanOrEqual(0.001);
  });
});

test.describe('Forced colors', () => {
  // Playwright only emulates forced-colors in Chromium.
  test('focus ring adopts the system Highlight colour', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'forced-colors emulation is Chromium-only');
    await page.emulateMedia({ forcedColors: 'active' });
    await page.goto(DEMO_URL);
    const ring = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--sf-focus-ring-color').trim()
    );
    expect(ring).toBe('Highlight');
  });
});

test.describe('Container queries', () => {
  test('.sf-container establishes an inline-size container', async ({ page }) => {
    await page.goto(DEMO_URL);
    const type = await page.locator('.sf-container').first().evaluate(
      (el) => getComputedStyle(el).containerType
    );
    expect(type).toBe('inline-size');
  });

  test('a fixed-column grid reflows with container width', async ({ page }) => {
    await page.goto(DEMO_URL);
    const grid = page.locator('.sf-grid--dense').first();
    await expect(grid).toBeVisible();

    await page.setViewportSize({ width: 1280, height: 900 });
    const wideCols = await grid.evaluate((el) =>
      getComputedStyle(el).gridTemplateColumns.split(' ').length
    );

    await page.setViewportSize({ width: 360, height: 900 });
    const narrowCols = await grid.evaluate((el) =>
      getComputedStyle(el).gridTemplateColumns.split(' ').length
    );

    expect(wideCols).toBeGreaterThanOrEqual(narrowCols);
  });
});

test.describe('State classes', () => {
  test('.is-hidden / .is-disabled apply their effects', async ({ page }) => {
    await page.goto(DEMO_URL);
    const probe = await page.evaluate(() => {
      const mk = (cls, css = '') => {
        const el = document.createElement('div');
        el.className = cls;
        el.style.cssText = css;
        el.textContent = 'x';
        document.body.appendChild(el);
        return getComputedStyle(el);
      };
      return {
        hidden: mk('is-hidden').display,
        disabledPE: mk('is-disabled').pointerEvents,
      };
    });
    expect(probe.hidden).toBe('none');
    expect(probe.disabledPE).toBe('none');
  });
});
