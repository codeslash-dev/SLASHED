/**
 * Output drawer: layer/root round-trip, the garbage-import guard
 * (regression for the import-wipes-overrides bug) and corrupt-storage
 * recovery.
 */
import { test, expect } from '@playwright/test';
import { watchErrors, gotoClean, sideItem, STORAGE_KEY } from './helpers.js';

async function rawOverrides(page) {
  return page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY);
}

test('generated css round-trips through import (layer mode)', async ({ page }) => {
  await gotoClean(page);
  await sideItem(page, 'Borders').click();
  await page.locator('.presets__btn', { hasText: 'Pill' }).click();
  const css = await page.locator('.out pre, .out code').first().textContent();
  await page.locator('.out button', { hasText: 'Clear all' }).click();
  await page.locator('.out button', { hasText: 'Import…' }).click();
  await page.locator('.out textarea').fill(css);
  await page.locator('.out button', { hasText: /Apply|Import/ }).last().click();
  await expect(page.locator('.presets__btn', { hasText: 'Pill' })).toHaveAttribute('aria-pressed', 'true');
});

test('garbage import is a byte-exact no-op on existing overrides', async ({ page }) => {
  await gotoClean(page);
  await sideItem(page, 'Borders').click();
  await page.locator('.presets__btn', { hasText: 'Pill' }).click();
  const before = await rawOverrides(page);
  await page.locator('.out button', { hasText: 'Import…' }).click();
  await page.locator('.out textarea').fill('not css at all{{{');
  await page.locator('.out button', { hasText: /Apply|Import/ }).last().click();
  await expect(page.locator('.out')).toContainText('nothing imported');
  expect(await rawOverrides(page)).toBe(before);
  // Unknown-tokens-only paste is equally a no-op.
  await page.locator('.out textarea').fill(':root { --sf-totally-unknown: 1px; }');
  await page.locator('.out button', { hasText: /Apply|Import/ }).last().click();
  expect(await rawOverrides(page)).toBe(before);
});

test('layer / :root format toggle reshapes the export', async ({ page }) => {
  await gotoClean(page);
  await sideItem(page, 'Borders').click();
  await page.locator('.presets__btn', { hasText: 'Sharp' }).click();
  const out = page.locator('.out');
  await expect(out).toContainText('@layer slashed.overrides');
  await out.locator('[aria-label="Output format"] button', { hasText: ':root' }).click();
  await expect(out).not.toContainText('@layer slashed.overrides');
  await expect(out).toContainText(':root {');
});

test('hostile input value is sanitised before it reaches storage', async ({ page }) => {
  await gotoClean(page);
  await sideItem(page, 'Colors').click();
  const input = page.locator('input.bcr__input[aria-label="--sf-color-primary-light value"]');
  await input.fill(';} body{background:red} :root{');
  await input.press('Enter');
  const value = (await page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key) ?? '{}'),
    STORAGE_KEY
  ))['--sf-color-primary-light'] ?? '';
  expect(value, 'structural characters must be stripped').not.toMatch(/[{};]/);
});

test('corrupt localStorage never crashes the app', async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto('/');
  await page.evaluate((key) => localStorage.setItem(key, '{not json'), STORAGE_KEY);
  await page.reload();
  await expect(page.locator('.home__title')).toBeVisible();
  await page.evaluate(
    (key) => localStorage.setItem(key, JSON.stringify({ '--sf-unknown': 'x', '--sf-radius-m': '10px;} hack{' })),
    STORAGE_KEY
  );
  await page.reload();
  await expect(page.locator('.home__title')).toBeVisible();
  expect(errors).toEqual([]);
});
