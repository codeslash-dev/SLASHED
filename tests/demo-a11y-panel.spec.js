// @ts-check
// Verifies the demo's live accessibility-report panel renders contrast grades
// for every key colour pair in both modes, and recomputes when the brand
// colours change.
import { test, expect } from '@playwright/test';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const DEMO_URL = pathToFileURL(path.resolve(import.meta.dirname, '..', 'docs', 'demo.html')).href;

test.describe('Live accessibility report', () => {
  test('renders a grade for every pair in light and dark', async ({ page }) => {
    await page.goto(DEMO_URL);
    // Each pair row has 3 direct spans: label + light wrapper + dark wrapper
    // (the header uses <strong>). 13 pairs → 39 spans.
    const spans = await page.$$eval('[data-a11y-body] > span', (els) => els.length);
    expect(spans).toBe(12 * 3);
    // The grade cells are nested spans stating a ratio + verdict (24 = 12 × 2).
    const grades = await page.$$eval('[data-a11y-body] > span > span', (els) =>
      els.map((e) => (e.textContent || '').trim())
    );
    expect(grades.length).toBe(12 * 2);
    expect(grades.every((c) => /\d\.\d{2}:1\s+(✓ AA( Large)?|✗ Fail)/.test(c))).toBe(true);
  });

  test('default palette: on-colours and body text pass AA', async ({ page }) => {
    await page.goto(DEMO_URL);
    const verdicts = await page.evaluate(() => {
      const rows = [...document.querySelectorAll('[data-a11y-body] > span')];
      // Map label → its two grade cells (light, dark) by walking the grid.
      const out = {};
      for (let i = 0; i < rows.length; i += 3) {
        out[rows[i].textContent.trim()] = [rows[i + 1].textContent, rows[i + 2].textContent];
      }
      return out;
    });
    // Body text and the auto-derived on-colours must pass AA in both modes.
    for (const key of ['Body text / bg', 'Text on primary', 'Text on action', 'Text on danger']) {
      expect(verdicts[key][0]).toContain('✓ AA');
      expect(verdicts[key][1]).toContain('✓ AA');
    }
  });

  test('recomputes live when brand colours change', async ({ page }) => {
    await page.goto(DEMO_URL);
    const read = () => page.$$eval('[data-a11y-body] > span', (els) =>
      els.map((e) => (e.textContent || '').trim()).filter(Boolean).join('|')
    );
    const before = await read();
    await page.click('#cz-randomize');
    await page.waitForTimeout(120);
    const after = await read();
    expect(after).not.toBe(before);
    expect(after.length).toBeGreaterThan(0);
  });
});
