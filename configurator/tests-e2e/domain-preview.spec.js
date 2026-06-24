/**
 * Preview Hub routing and the replacement visual helpers.
 *
 * The old inline DomainPreview cards were intentionally removed from the left
 * panel. These checks cover the new contract: the right Preview Hub follows
 * the active domain, while focused helper components live in the domain panel.
 */
import { test, expect } from '@playwright/test';
import { watchErrors, gotoClean, sideItem } from './helpers.js';

const SECTION_BY_DOMAIN = [
  ['Overview', 'Overview'],
  ['Colors', 'Colors'],
  ['Gradients', 'Gradients'],
  ['Typography', 'Type'],
  ['Spacing', 'Spacing'],
  ['Layout', 'Layout'],
  ['Borders', 'Borders'],
  ['Shadows', 'Shadows'],
  ['Motion', 'Motion'],
  ['Effects', 'Effects'],
  ['WCAG', 'Colors'],
  ['Themes', 'Palette'],
  ['Install', 'Overview'],
  ['Misc', 'Tokens'],
  ['Cheatsheet', 'Tokens'],
];

const activePreviewSection = (page) =>
  page.locator('.preview__sections .preview__sec-btn[aria-pressed="true"]');

test('preview hub follows every sidebar domain, including tool domains', async ({ page }) => {
  const errors = watchErrors(page);
  await gotoClean(page);

  for (const [domainLabel, sectionLabel] of SECTION_BY_DOMAIN) {
    await sideItem(page, domainLabel).click();
    await expect(activePreviewSection(page), `${domainLabel} routes to ${sectionLabel}`).toHaveText(sectionLabel);
  }

  expect(errors).toEqual([]);
});

test('Layout panel renders proportional ContainerBars instead of the old inline preview card', async ({ page }) => {
  await gotoClean(page);
  await sideItem(page, 'Layout').click();

  await expect(page.locator('details.panel__card', { hasText: /^Preview$/ })).toHaveCount(0);
  const bars = page.locator('.cbars__bar');
  await expect(bars).toHaveCount(5);

  const widths = await bars.evaluateAll((els) =>
    els.map((el) => el.getBoundingClientRect().width)
  );
  expect(new Set(widths.map((w) => Math.round(w))).size, 'container bars use distinct proportional widths').toBeGreaterThanOrEqual(3);
});

test('the preview hub reflects a live override', async ({ page }) => {
  await gotoClean(page);
  await sideItem(page, 'Borders').click();

  const stage = page.locator('.preview__stage');
  await expect(stage).toHaveAttribute('style', /--sf-radius-scale:/);
  const before = await stage.getAttribute('style');

  const knob = page.getByLabel('--sf-radius-scale numeric value');
  await knob.fill('1.75');
  await knob.blur();

  await expect(stage).toHaveAttribute('style', /--sf-radius-scale:\s*1\.75/);
  expect(await stage.getAttribute('style')).not.toBe(before);
});
