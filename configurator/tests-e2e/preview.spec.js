/**
 * Live preview: desktop pane toggle, narrow-viewport slide-over overlay
 * (scrim, in-bar theme/motion/close controls) and the matchMedia resize
 * round-trip — regressions for the "preview unreachable on narrow
 * viewports" and "preview lost after resize" bugs.
 */
import { test, expect } from '@playwright/test';
import { watchErrors, gotoClean } from './helpers.js';

const TOGGLE = 'button[aria-label="Toggle preview"]';

test('desktop: pane visible by default, header toggle hides/shows it', async ({ page }) => {
  await gotoClean(page);
  await expect(page.locator('.preview')).toBeVisible();
  await expect(page.locator('.scrim')).toBeHidden(); // in DOM, display:none on desktop
  await expect(page.locator('.preview__close')).toBeHidden();
  await page.locator(TOGGLE).click();
  await expect(page.locator('.preview')).toHaveCount(0);
  await page.locator(TOGGLE).click();
  await expect(page.locator('.preview')).toBeVisible();
});

for (const width of [1000, 480]) {
  test(`${width}px: overlay starts closed, opens fixed, scrim dismisses`, async ({ page }) => {
    const errors = watchErrors(page);
    await page.setViewportSize({ width, height: 860 });
    await gotoClean(page);
    await expect(page.locator('.preview')).toHaveCount(0);
    await page.locator(TOGGLE).click();
    const preview = page.locator('.preview');
    await expect(preview).toBeVisible();
    expect(await preview.evaluate((el) => getComputedStyle(el).position)).toBe('fixed');
    await page.locator('.scrim').click({ position: { x: 10, y: 400 } });
    await expect(page.locator('.preview')).toHaveCount(0);
    expect(errors).toEqual([]);
  });
}

test('overlay bar carries working theme / motion / close controls', async ({ page }) => {
  await page.setViewportSize({ width: 480, height: 860 });
  await gotoClean(page);
  await page.locator(TOGGLE).click();
  const bar = page.locator('.preview__bar');
  const stage = page.locator('.preview__stage');
  const before = await stage.evaluate((el) => getComputedStyle(el).backgroundColor);
  await bar.locator('button[title="Dark preview theme"]').click();
  await expect
    .poll(() => stage.evaluate((el) => getComputedStyle(el).backgroundColor))
    .not.toBe(before);
  await bar.locator('button[title="Reduced motion in preview only"]').click();
  await expect(page.locator('.preview__stage--rm')).toHaveCount(1);
  await page.locator('.preview__close').click();
  await expect(page.locator('.preview')).toHaveCount(0);
});

test('Escape dismisses the overlay and focus returns to the toggle', async ({ page }) => {
  await page.setViewportSize({ width: 480, height: 860 });
  await gotoClean(page);
  await page.locator(TOGGLE).click();
  // Focus lands on the overlay's close button (dialog-like behavior).
  await expect(page.locator('.preview__close')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('.preview')).toHaveCount(0);
  await expect(page.locator(TOGGLE)).toBeFocused();
});

test('Escape does NOT close the persistent desktop pane', async ({ page }) => {
  await gotoClean(page);
  await expect(page.locator('.preview')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.preview')).toBeVisible();
});

test('resize round-trip: wide -> narrow -> wide restores the pane', async ({ page }) => {
  await page.setViewportSize({ width: 1400, height: 900 });
  await gotoClean(page);
  await expect(page.locator('.preview')).toBeVisible();
  await page.setViewportSize({ width: 900, height: 900 });
  await expect(page.locator('.preview')).toHaveCount(0); // dismissed, no stray scrim
  await page.setViewportSize({ width: 1400, height: 900 });
  await expect(page.locator('.preview')).toBeVisible();
});

test('preview is live: editing a brand color repaints the sample button', async ({ page }) => {
  await gotoClean(page);
  await page.locator('.side__item', { hasText: 'Colors' }).first().click();
  const btn = page.locator('.pv__btn--primary').first();
  const before = await btn.evaluate((el) => getComputedStyle(el).backgroundColor);
  const input = page.locator('input.bcr__input[aria-label="--sf-color-primary-source-light value"]');
  await input.fill('oklch(0.5 0.2 140)');
  await input.press('Enter');
  await expect
    .poll(() => btn.evaluate((el) => getComputedStyle(el).backgroundColor))
    .not.toBe(before);
});
