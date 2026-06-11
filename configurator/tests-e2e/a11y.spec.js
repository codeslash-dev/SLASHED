/**
 * Accessibility + layout integrity: horizontal-overflow audit across
 * widths, accessible names on every button, segmented-control aria state,
 * search affordances.
 */
import { test, expect } from '@playwright/test';
import { watchErrors, gotoClean, sideItem } from './helpers.js';

const WIDTHS = [1600, 1000, 768, 480, 360];
const BASIC_LABELS = ['Home', 'Colors', 'Typography', 'Spacing', 'Layout', 'Borders', 'Shadows', 'Themes'];

test('no horizontal overflow on any basic panel at any width', async ({ page }) => {
  for (const width of WIDTHS) {
    await page.setViewportSize({ width, height: 900 });
    await gotoClean(page);
    for (const label of BASIC_LABELS) {
      await sideItem(page, label).click();
      const overflow = await page.evaluate(
        () => document.scrollingElement.scrollWidth - window.innerWidth
      );
      expect(overflow, `${label} @ ${width}px`).toBeLessThanOrEqual(1);
    }
  }
});

test('no horizontal overflow on advanced colors + cheatsheet at any width', async ({ page }) => {
  for (const width of WIDTHS) {
    await page.setViewportSize({ width, height: 900 });
    await gotoClean(page);
    await page.keyboard.press('a');
    for (const label of ['Colors', 'Cheatsheet']) {
      await sideItem(page, label).click();
      const overflow = await page.evaluate(
        () => document.scrollingElement.scrollWidth - window.innerWidth
      );
      expect(overflow, `${label} @ ${width}px`).toBeLessThanOrEqual(1);
    }
  }
});

test('every button exposes an accessible name', async ({ page }) => {
  await gotoClean(page);
  for (const label of ['Home', 'Colors', 'Borders']) {
    await sideItem(page, label).click();
    const nameless = await page.evaluate(() =>
      [...document.querySelectorAll('button')]
        .filter((b) => !(b.getAttribute('aria-label') || b.title || b.textContent.trim()))
        .map((b) => b.outerHTML.slice(0, 80))
    );
    expect(nameless, `nameless buttons on ${label}`).toEqual([]);
  }
});

test('segmented controls expose aria-pressed; info buttons aria-expanded', async ({ page }) => {
  await gotoClean(page);
  // Header mode segment + output drawer segments: exactly one pressed each.
  await expect(page.locator('[aria-label="Complexity mode"] [aria-pressed="true"]')).toHaveCount(1);
  await expect(page.locator('.out [aria-label="Output view"] [aria-pressed="true"]')).toHaveCount(1);
  await expect(page.locator('.out [aria-label="Output format"] [aria-pressed="true"]')).toHaveCount(1);
  // ⓘ popover toggles aria-expanded and reveals the raw token.
  await sideItem(page, 'Layout').click();
  const row = page.locator('.row', { hasText: 'Reading width' }).first();
  const info = row.locator('.row__info-btn');
  await expect(info).toHaveAttribute('aria-expanded', 'false');
  await info.click();
  await expect(info).toHaveAttribute('aria-expanded', 'true');
  await expect(row.locator('.row__raw')).toContainText('--sf-container-prose');
});

test('basic search scopes to the curated surface with an advanced jump', async ({ page }) => {
  const errors = watchErrors(page);
  await gotoClean(page);
  await sideItem(page, 'Spacing').click();
  await page.fill('#cfg-search', 'gap');
  const more = page.locator('.panel__more');
  await expect(more).toBeVisible();
  await more.click();
  await expect(page.locator('#cfg-search')).toHaveValue('gap'); // query survives the mode switch
  await page.keyboard.press('b');
  await sideItem(page, 'Spacing').click();
  await page.fill('#cfg-search', 'zzz-nothing-matches');
  await expect(page.locator('.panel__empty')).toBeVisible();
  expect(errors).toEqual([]);
});
