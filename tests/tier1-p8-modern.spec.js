// @ts-check
/**
 * Feature: tier-1-color-fallback
 * Property 8: On a Modern_Engine (Chromium) the computed values of all Tier-1
 *             tokens match the committed baseline captured from the same engine.
 *             This proves that adding core/tokens.color-fallbacks.css before
 *             core/tokens.css did NOT change any resolved value on modern browsers.
 *
 * The P2/P7/P8/P10 numbering gaps (no P1, P3-P6, P9 test files) are
 * explained in tests/README.md — not dead history, don't renumber.
 *
 * Regenerate baseline: BASELINE_CAPTURE=1 npx playwright test tests/tier1-p8-modern.spec.js --project=chromium
 * Run: npx playwright test tests/tier1-p8-modern.spec.js --project=chromium
 */
import { test, expect } from '@playwright/test';
import path from 'node:path';
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

const FIXTURE  = pathToFileURL(path.join(import.meta.dirname, 'fixture.html')).href;
const BASELINE = path.join(import.meta.dirname, 'baseline-modern.json');

const TIER1_TOKENS = [
  '--sf-color-primary', '--sf-color-secondary', '--sf-color-tertiary',
  '--sf-color-action', '--sf-color-neutral', '--sf-color-base',
  '--sf-color-success', '--sf-color-warning',
  '--sf-color-info', '--sf-color-danger',
  '--sf-color-bg', '--sf-color-inset', '--sf-color-raised',
  '--sf-color-text', '--sf-color-text--subtle', '--sf-color-heading',
  '--sf-color-border', '--sf-color-border--subtle', '--sf-color-border--strong',
  '--sf-color-link', '--sf-color-selection-bg',
  '--sf-color-success-strong', '--sf-color-warning-strong',
  '--sf-color-info-strong', '--sf-color-danger-strong',
  '--sf-shadow-xs', '--sf-shadow-s', '--sf-shadow-m', '--sf-shadow-l',
];

// Only run on Chromium (the reference Modern_Engine).
// Firefox/WebKit may resolve oklch differently and are excluded here.
test.skip(({ browserName }) => browserName !== 'chromium', 'P8 is Chromium-only');

async function captureValues(page, theme) {
  await page.goto(FIXTURE);
  if (theme === 'dark') {
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
  } else {
    await page.evaluate(() => document.documentElement.removeAttribute('data-theme'));
  }
  await page.evaluate(() => document.fonts.ready);

  return page.evaluate((tokens) => {
    const style = getComputedStyle(document.documentElement);
    const result = {};
    for (const t of tokens) {
      result[t] = style.getPropertyValue(t).trim();
    }
    return result;
  }, TIER1_TOKENS);
}

test.describe('P8: Modern-engine computed values match baseline', () => {
  test('light mode — Tier-1 tokens match baseline', async ({ page }) => {
    const captureMode = process.env.BASELINE_CAPTURE === '1';
    const values = await captureValues(page, 'light');

    if (captureMode) {
      const existing = fs.existsSync(BASELINE)
        ? JSON.parse(fs.readFileSync(BASELINE, 'utf8'))
        : {};
      existing.light = values;
      fs.writeFileSync(BASELINE, JSON.stringify(existing, null, 2) + '\n', 'utf8');
      console.log('Baseline (light) written to', BASELINE);
      return;
    }

    if (!fs.existsSync(BASELINE)) {
      throw new Error(
        'tests/baseline-modern.json not found. ' +
        'Generate it with: BASELINE_CAPTURE=1 npx playwright test tests/tier1-p8-modern.spec.js --project=chromium'
      );
    }

    const baseline = JSON.parse(fs.readFileSync(BASELINE, 'utf8'));
    expect(baseline.light, 'Baseline missing light section').toBeTruthy();

    for (const token of TIER1_TOKENS) {
      const actual   = values[token];
      const expected = baseline.light[token];
      expect(expected, `Baseline missing token ${token} (light) — regenerate with BASELINE_CAPTURE=1`).toBeTruthy();
      expect(actual, `${token} (light)`).toBe(expected);
    }
  });

  test('dark mode — Tier-1 tokens match baseline', async ({ page }) => {
    const captureMode = process.env.BASELINE_CAPTURE === '1';
    const values = await captureValues(page, 'dark');

    if (captureMode) {
      const existing = fs.existsSync(BASELINE)
        ? JSON.parse(fs.readFileSync(BASELINE, 'utf8'))
        : {};
      existing.dark = values;
      fs.writeFileSync(BASELINE, JSON.stringify(existing, null, 2) + '\n', 'utf8');
      console.log('Baseline (dark) written to', BASELINE);
      return;
    }

    if (!fs.existsSync(BASELINE)) {
      throw new Error(
        'tests/baseline-modern.json not found. ' +
        'Generate it with: BASELINE_CAPTURE=1 npx playwright test tests/tier1-p8-modern.spec.js --project=chromium'
      );
    }

    const baseline = JSON.parse(fs.readFileSync(BASELINE, 'utf8'));
    expect(baseline.dark, 'Baseline missing dark section').toBeTruthy();

    for (const token of TIER1_TOKENS) {
      const actual   = values[token];
      const expected = baseline.dark[token];
      expect(expected, `Baseline missing token ${token} (dark) — regenerate with BASELINE_CAPTURE=1`).toBeTruthy();
      expect(actual, `${token} (dark)`).toBe(expected);
    }
  });
});
