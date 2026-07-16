// @ts-check
// Behavioural tests for core/motion.css — previously the only core module with
// no dedicated spec. Covers the two contracts that matter for accessibility and
// the motion knob:
//   1. prefers-reduced-motion: reduce gates OUT transitions and entrance
//      animations (they live inside @media (prefers-reduced-motion: no-preference)).
//   2. --sf-motion-scale linearly scales every duration token (calc(Nms * scale)),
//      so it can slow motion down or disable it entirely (scale 0 → 0s).
// Loads the optimal bundle (which includes core/motion.css) WITHOUT the usual
// transition-killing helper, since the whole point here is to observe motion.
import { test, expect } from '@playwright/test';
import { renderWithBundle } from './render-helpers.js';

/** Read one computed property of #t. */
function prop(page, name) {
  return page.evaluate((n) => getComputedStyle(document.getElementById('t')).getPropertyValue(n), name);
}

const seconds = (v) => parseFloat(v); // "0.15s" → 0.15

test.describe('motion — prefers-reduced-motion: no-preference', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
  });

  test('interactive elements get a non-zero transition (duration = --sf-duration-fast)', async ({ page }) => {
    await renderWithBundle(page, `<button id="t">Hi</button>`);
    const dur = seconds(await prop(page, 'transition-duration'));
    expect(dur).toBeCloseTo(0.15, 2); // 150ms * default scale 1
  });

  test('--sf-motion-scale scales the duration linearly', async ({ page }) => {
    await renderWithBundle(page, `<button id="t">Hi</button>`);
    // --sf-duration-* = calc(Nms * --sf-motion-scale); the scale token is
    // consumed where --sf-duration-fast is declared (:root), so set it there.
    await page.evaluate(() => document.documentElement.style.setProperty('--sf-motion-scale', '2'));
    expect(seconds(await prop(page, 'transition-duration'))).toBeCloseTo(0.3, 2);
  });

  test('--sf-motion-scale: 0 disables motion (0s duration)', async ({ page }) => {
    await renderWithBundle(page, `<button id="t">Hi</button>`);
    await page.evaluate(() => document.documentElement.style.setProperty('--sf-motion-scale', '0'));
    expect(seconds(await prop(page, 'transition-duration'))).toBeLessThan(0.001);
  });

  test('.sf-fade-in binds the sf-fade-in keyframes', async ({ page }) => {
    await renderWithBundle(page, `<div class="sf-fade-in" id="t">x</div>`);
    expect(await prop(page, 'animation-name')).toBe('sf-fade-in');
  });

  test('.sf-entrance--fade maps to the fade keyframes', async ({ page }) => {
    await renderWithBundle(page, `<div class="sf-entrance--fade" id="t">x</div>`);
    expect(await prop(page, 'animation-name')).toBe('sf-fade-in');
  });

  test('.sf-stagger gives successive children an incrementing animation-delay', async ({ page }) => {
    await renderWithBundle(
      page,
      `<ul class="sf-stagger">
         <li class="sf-fade-in">1</li>
         <li class="sf-fade-in" id="t">2</li>
         <li class="sf-fade-in" id="t3">3</li>
       </ul>`,
    );
    // 1st child → index 0 → 0s; 2nd child → index 1 → 1 × 75ms.
    const second = seconds(await prop(page, 'animation-delay'));
    expect(second).toBeCloseTo(0.075, 3);
    const third = await page.evaluate(
      () => parseFloat(getComputedStyle(document.getElementById('t3')).animationDelay),
    );
    expect(third).toBeCloseTo(0.15, 3); // index 2 → 2 × 75ms
  });

  test('.sf-stagger delay follows --sf-stagger-step and --sf-motion-scale', async ({ page }) => {
    await renderWithBundle(
      page,
      `<ul class="sf-stagger" id="s">
         <li>1</li><li id="t">2</li>
       </ul>`,
    );
    await page.evaluate(() => {
      document.documentElement.style.setProperty('--sf-stagger-step', '100ms');
      document.documentElement.style.setProperty('--sf-motion-scale', '2');
    });
    // 2nd child index 1 → 1 × 100ms × 2 = 200ms.
    expect(seconds(await prop(page, 'animation-delay'))).toBeCloseTo(0.2, 3);
  });

  test('.sf-color-pulse binds the sf-color-pulse keyframes', async ({ page }) => {
    // Regression: the previous implementation was gated behind a
    // @supports (@property …) at-rule query that many engines don't satisfy,
    // so animation-name silently resolved to 'none' (a no-op). It now gates on
    // relative-colour support and must actually bind the keyframes.
    await renderWithBundle(page, `<div class="sf-color-pulse" id="t">x</div>`);
    expect(await prop(page, 'animation-name')).toBe('sf-color-pulse');
  });

  test('.sf-color-pulse defaults --sf-color-pulse to the primary colour', async ({ page }) => {
    await renderWithBundle(page, `<div class="sf-color-pulse" id="t">x</div>`);
    const [pulse, primary] = await page.evaluate(() => {
      const cs = getComputedStyle(document.getElementById('t'));
      return [cs.getPropertyValue('--sf-color-pulse').trim(),
              cs.getPropertyValue('--sf-color-primary').trim()];
    });
    expect(pulse).toBe(primary);
  });
});

test.describe('motion — prefers-reduced-motion: reduce', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('interactive transitions are gated out (0s)', async ({ page }) => {
    await renderWithBundle(page, `<button id="t">Hi</button>`);
    // The 150ms interactive transition lives inside @media no-preference, so
    // under reduce it never applies (any residual is engine noise, not motion).
    expect(seconds(await prop(page, 'transition-duration'))).toBeLessThan(0.01);
  });

  test('.sf-fade-in animation does not apply under reduce', async ({ page }) => {
    await renderWithBundle(page, `<div class="sf-fade-in" id="t">x</div>`);
    expect(await prop(page, 'animation-name')).toBe('none');
  });

  test('.sf-color-pulse animation does not apply under reduce', async ({ page }) => {
    await renderWithBundle(page, `<div class="sf-color-pulse" id="t">x</div>`);
    expect(await prop(page, 'animation-name')).toBe('none');
  });
});
