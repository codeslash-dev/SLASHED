/**
 * Dogfood + isolation contract (Workstream 1).
 *
 * The chrome is built from SLASHED's own --sf-* tokens, and user overrides must
 * scope to the preview stage only — never the chrome. These run in a real
 * browser because the contract is about the live cascade, not static CSS.
 */
import { test, expect } from '@playwright/test';
import { watchErrors, gotoClean } from './helpers.js';

const cssVar = (page, selector, prop) =>
  page.evaluate(
    ([s, p]) => {
      const el = s === 'root' ? document.documentElement : document.querySelector(s);
      return el ? getComputedStyle(el).getPropertyValue(p).trim() : null;
    },
    [selector, prop]
  );

async function importOverride(page, css) {
  await page.locator('.out__actions .cfg-btn', { hasText: 'Import…' }).click();
  await page.locator('.out__import .cfg-textarea').fill(css);
  await page.locator('.out__import .cfg-btn', { hasText: 'Apply import' }).click();
}

test('chrome aliases are sourced from framework tokens', async ({ page }) => {
  await gotoClean(page);
  // The --cfg-* layer points at --sf-* tokens (the dogfood contract).
  // Modern browsers resolve var() in getPropertyValue, so we compare resolved
  // values: if --cfg-bg: var(--sf-color-bg) both must resolve identically.
  const sfBg = await cssVar(page, 'root', '--sf-color-bg');
  const sfText = await cssVar(page, 'root', '--sf-color-text');
  const sfAccent = await cssVar(page, 'root', '--sf-color-primary');
  expect(await cssVar(page, 'root', '--cfg-bg')).toBe(sfBg);
  expect(await cssVar(page, 'root', '--cfg-text')).toBe(sfText);
  expect(await cssVar(page, 'root', '--cfg-accent')).toBe(sfAccent);
});

test('overrides restyle the preview stage but never the chrome', async ({ page }) => {
  const errors = watchErrors(page);
  await gotoClean(page); // 1600px default → preview pane is docked

  const rootBefore = await cssVar(page, 'root', '--sf-color-primary');
  const stageBefore = await cssVar(page, '.preview__stage', '--sf-color-primary');

  await importOverride(page, ':root{--sf-color-primary:oklch(0.6 0.2 30);}');

  const rootAfter = await cssVar(page, 'root', '--sf-color-primary');
  const stageAfter = await cssVar(page, '.preview__stage', '--sf-color-primary');

  // Chrome unaffected; preview reflects the override.
  expect(rootAfter).toBe(rootBefore);
  expect(stageAfter).not.toBe(stageBefore);
  expect(errors).toEqual([]);
});

test('chrome theme toggle flips the framework [data-theme] and repaints', async ({ page }) => {
  await gotoClean(page);
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  const darkBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);

  await page.locator('[aria-label="Toggle configurator theme"]').click();

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  const lightBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(lightBg).not.toBe(darkBg);
});
