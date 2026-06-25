/**
 * Accessibility + layout integrity: horizontal-overflow audit across
 * widths, accessible names on every button, segmented-control aria state,
 * search affordances.
 */
import { test, expect } from '@playwright/test';
import { watchErrors, gotoClean, sideItem } from './helpers.js';

const WIDTHS = [1600, 1000, 768, 480, 360];
const NAV_LABELS = [
  'Overview', 'Colors', 'Gradients', 'Typography', 'Spacing', 'Layout',
  'Borders', 'Shadows', 'Motion', 'Effects', 'WCAG', 'Themes', 'Install',
  'Misc', 'Cheatsheet',
];

test('no horizontal overflow on any panel at any width', async ({ page }) => {
  for (const width of WIDTHS) {
    await page.setViewportSize({ width, height: 900 });
    await gotoClean(page);
    for (const label of NAV_LABELS) {
      await sideItem(page, label).click();
      const overflow = await page.evaluate(
        () => document.scrollingElement.scrollWidth - window.innerWidth
      );
      expect(overflow, `${label} @ ${width}px`).toBeLessThanOrEqual(1);
    }
  }
});

test('no horizontal overflow with the full catalogue expanded', async ({ page }) => {
  for (const width of WIDTHS) {
    await page.setViewportSize({ width, height: 900 });
    await gotoClean(page);
    await sideItem(page, 'Colors').click();
    await page.locator('details.allvars summary').click();
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
  for (const label of ['Overview', 'Colors', 'Borders']) {
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
  // Output drawer segments: exactly one pressed each.
  await expect(page.locator('.out [aria-label="Output view"] [aria-pressed="true"]')).toHaveCount(1);
  await expect(page.locator('.out [aria-label="Output format"] [aria-pressed="true"]')).toHaveCount(1);
  // ⓘ popover toggles aria-expanded and reveals the raw token.
  // Gradients domain has SmartSettings with gradient kind, which renders TokenRow with showRawInfo.
  await sideItem(page, 'Gradients').click();
  const row = page.locator('.row', { hasText: 'Raw gradient' }).first();
  const info = row.locator('.row__info-btn');
  await expect(info).toHaveAttribute('aria-expanded', 'false');
  await info.click();
  await expect(info).toHaveAttribute('aria-expanded', 'true');
  await expect(row.locator('.row__raw')).toContainText('--sf-gradient-');
});

test('search filters the catalogue and shows an empty state for no match', async ({ page }) => {
  const errors = watchErrors(page);
  await gotoClean(page);
  await sideItem(page, 'Spacing').click();
  // A query collapses the panel to the filtered catalogue; the usage filter
  // bar and at least one matching row are visible.
  await page.fill('#cfg-search', 'gap');
  await expect(page.locator('.allvars__filters')).toBeVisible();
  // Scope to catalogue rows (TokenGroup .group) — not any row on the page.
  // During search the catalogue renders directly in the body, not inside the
  // collapsed details, so .group .row is the correct cross-context selector.
  await expect(page.locator('.group .row').first()).toBeVisible();
  // A query with no matches shows the empty state, not a dead panel.
  await page.fill('#cfg-search', 'zzz-nothing-matches');
  await expect(page.locator('.panel__empty')).toBeVisible();
  expect(errors).toEqual([]);
});
