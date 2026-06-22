/**
 * Inline domain previews: every token domain (Borders, Shadows, Motion, …)
 * LEADS its panel with a live "Preview" card that renders its tokens against
 * the current overrides — the generalisation of the Colors "Semantic roles"
 * card. The preview is the first thing in the panel and open by default.
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

test('every token domain leads with an open Preview card', async ({ page }) => {
  const errors = watchErrors(page);
  await gotoClean(page);
  for (const label of PREVIEW_DOMAINS) {
    await sideItem(page, label).click();
    const card = previewCard(page);
    await expect(card, `${label} has a Preview card`).toHaveCount(1);
    // Open by default — the scoped stage is visible immediately.
    expect(await card.evaluate((el) => el.open), `${label} Preview is open by default`).toBe(true);
    await expect(card.locator('.dp__stage'), `${label} stage is visible`).toBeVisible();
    // It is the FIRST card in the panel body.
    const isFirst = await card.evaluate((el) => {
      const body = el.closest('.panel__body');
      return body?.querySelector('.cfg-card, .panel__card, .panel__intro') === el;
    });
    expect(isFirst, `${label} Preview is the first thing in the panel`).toBe(true);
  }
  expect(errors).toEqual([]);
});

test('the Layout preview renders distinct, proportional container widths', async ({ page }) => {
  await gotoClean(page);
  await sideItem(page, 'Layout').click();
  const stage = previewCard(page).locator('.dp__stage');
  await expect(stage).toBeVisible();
  // The fix: container bars are measured to true relative scale, so their
  // widths differ (the old clamp-to-100% rendered all four identical).
  const widths = await stage.locator('.dp__track-fill').evaluateAll((els) =>
    els.map((el) => el.getBoundingClientRect().width)
  );
  expect(widths.length).toBe(4);
  expect(new Set(widths.map((w) => Math.round(w))).size, 'widths are not all identical').toBeGreaterThan(1);
});

test('the preview reflects a live override', async ({ page }) => {
  await gotoClean(page);
  await sideItem(page, 'Borders').click();
  const card = previewCard(page);
  const stage = card.locator('.dp__stage');
  await expect(stage).toBeVisible();

  // Baseline: the scoped stage carries the full framework cascade, so the
  // radius knob is present at its default.
  const before = await stage.getAttribute('style');
  expect(before).toContain('--sf-radius-scale');

  // radius-m is a read-only consumption token (calc of the scale), so drive
  // its upstream knob — --sf-radius-scale — via the Scaling panel and assert
  // the new value flows live into the stage's inline custom properties.
  const knob = page.getByLabel('--sf-radius-scale numeric value');
  await knob.fill('1.75');
  await knob.blur();

  await expect(stage).toHaveAttribute('style', /--sf-radius-scale:\s*1\.75/);
  expect(await stage.getAttribute('style')).not.toBe(before);
});

test('the Colors panel keeps its bespoke Semantic roles card (no generic Preview)', async ({ page }) => {
  await gotoClean(page);
  await sideItem(page, 'Colors').click();
  // Colors is curated by ColorAssignments, not the generic DomainPreview.
  await expect(previewCard(page)).toHaveCount(0);
  await expect(page.locator('.panel__card-title', { hasText: 'Semantic roles' })).toHaveCount(1);
});
