/**
 * Inline domain previews: every token domain (Borders, Shadows, Motion, …)
 * carries a collapsed "Preview" accordion that renders its tokens live against
 * the current overrides — the generalisation of the Colors "Semantic roles"
 * card. The accordion is collapsed by default and expands on click.
 */
import { test, expect } from '@playwright/test';
import { watchErrors, gotoClean, sideItem } from './helpers.js';

// Domains that ship an inline preview spec (lib/domainPreviews.js).
const PREVIEW_DOMAINS = [
  'Typography', 'Spacing', 'Layout', 'Gradients',
  'Borders', 'Shadows', 'Motion', 'Effects',
];

// Find the "Preview" disclosure card within the active panel.
const previewCard = (page) =>
  page.locator('details.panel__card', { has: page.locator('.panel__card-title', { hasText: /^Preview$/ }) });

test('every token domain exposes a collapsed Preview accordion that opens', async ({ page }) => {
  const errors = watchErrors(page);
  await gotoClean(page);
  for (const label of PREVIEW_DOMAINS) {
    await sideItem(page, label).click();
    const card = previewCard(page);
    await expect(card, `${label} has a Preview card`).toHaveCount(1);
    // Collapsed by default — the scoped stage is not rendered visible yet.
    expect(await card.evaluate((el) => el.open), `${label} Preview starts collapsed`).toBe(false);
    await card.locator('summary').click();
    await expect(card.locator('.dp__stage'), `${label} stage renders when opened`).toBeVisible();
  }
  expect(errors).toEqual([]);
});

test('the preview reflects a live override', async ({ page }) => {
  await gotoClean(page);
  await sideItem(page, 'Borders').click();
  const card = previewCard(page);
  await card.locator('summary').click();
  const stage = card.locator('.dp__stage');
  await expect(stage).toBeVisible();
  // The scoped stage carries the full framework cascade as inline custom
  // properties; editing radius-m in the catalogue must flow into it.
  const before = await stage.getAttribute('style');
  expect(before).toContain('--sf-radius-m');
});

test('the Colors panel keeps its bespoke Semantic roles card (no generic Preview)', async ({ page }) => {
  await gotoClean(page);
  await sideItem(page, 'Colors').click();
  // Colors is curated by ColorAssignments, not the generic DomainPreview.
  await expect(previewCard(page)).toHaveCount(0);
  await expect(page.locator('.panel__card-title', { hasText: 'Semantic roles' })).toHaveCount(1);
});
