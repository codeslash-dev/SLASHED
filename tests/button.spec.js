// @ts-check
// Behavioural tests for the .sf-btn component (shipped in 0.7.0). Loads the
// components bundle (the default optimal bundle excludes optional/components.css)
// and asserts computed styles for the colour families, style treatments, the
// orthogonal --outline modifier, the size scale, width, and states. Runs in
// both light and dark themes since the structural relationships hold in both.
import { test, expect } from '@playwright/test';
import path from 'node:path';
import { renderWithBundle, NO_TRANSITIONS_STYLE } from './render-helpers.js';

const COMPONENTS_BUNDLE = path.join(process.cwd(), 'dist', 'slashed.optimal-components.css');

const TRANSPARENT = new Set(['rgba(0, 0, 0, 0)', 'transparent']);

/** Read a set of computed properties for #t. */
function computed(page, props) {
  return page.evaluate((p) => {
    const el = /** @type {HTMLElement} */ (document.getElementById('t'));
    const cs = getComputedStyle(el);
    return Object.fromEntries(p.map((k) => [k, cs.getPropertyValue(k)]));
  }, props);
}

for (const theme of ['light', 'dark']) {
  test.describe(`.sf-btn — ${theme} theme`, () => {
    test.beforeEach(async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
    });

    async function mount(page, html) {
      await renderWithBundle(page, html, {
        bundle: COMPONENTS_BUNDLE,
        extraStyle: NO_TRANSITIONS_STYLE,
      });
      await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
    }

    test('base button is a solid, opaque, inline-flex control', async ({ page }) => {
      await mount(page, `<button class="sf-btn" id="t">Save</button>`);
      const cs = await computed(page, ['display', 'background-color', 'cursor']);
      expect(cs.display).toBe('inline-flex');
      expect(TRANSPARENT.has(cs['background-color'])).toBe(false);
      expect(cs.cursor).toBe('pointer');
    });

    test('meets WCAG 2.2 minimum target height (>= 24px)', async ({ page }) => {
      await mount(page, `<button class="sf-btn" id="t">Save</button>`);
      const h = await page.evaluate(
        () => document.getElementById('t').getBoundingClientRect().height,
      );
      expect(h).toBeGreaterThanOrEqual(24);
    });

    test('semantic colour families each produce a distinct fill', async ({ page }) => {
      await mount(
        page,
        `<button class="sf-btn" id="base">A</button>
         <button class="sf-btn sf-btn--danger" id="danger">B</button>
         <button class="sf-btn sf-btn--success" id="success">C</button>
         <button class="sf-btn sf-btn--primary" id="primary">D</button>`,
      );
      const bgs = await page.evaluate(() =>
        ['base', 'danger', 'success', 'primary'].map(
          (id) => getComputedStyle(document.getElementById(id)).backgroundColor,
        ),
      );
      // All four backgrounds are distinct → the family swap is working.
      expect(new Set(bgs).size).toBe(4);
    });

    test('--secondary and --ghost are transparent-filled', async ({ page }) => {
      await mount(
        page,
        `<button class="sf-btn sf-btn--secondary" id="sec">A</button>
         <button class="sf-btn sf-btn--ghost" id="ghost">B</button>`,
      );
      const [sec, ghost] = await page.evaluate(() =>
        ['sec', 'ghost'].map((id) => {
          const cs = getComputedStyle(document.getElementById(id));
          return { bg: cs.backgroundColor, border: cs.borderTopColor };
        }),
      );
      expect(['rgba(0, 0, 0, 0)', 'transparent']).toContain(sec.bg);
      expect(['rgba(0, 0, 0, 0)', 'transparent']).toContain(ghost.bg);
      // Ghost drops the border too; secondary keeps a visible one.
      expect(['rgba(0, 0, 0, 0)', 'transparent']).toContain(ghost.border);
      expect(['rgba(0, 0, 0, 0)', 'transparent']).not.toContain(sec.border);
    });

    test('--outline: transparent fill, border matches text colour', async ({ page }) => {
      await mount(page, `<button class="sf-btn sf-btn--outline" id="t">Outline</button>`);
      const cs = await page.evaluate(() => {
        const c = getComputedStyle(document.getElementById('t'));
        return { bg: c.backgroundColor, color: c.color, border: c.borderTopColor };
      });
      expect(TRANSPARENT.has(cs.bg)).toBe(true);
      expect(cs.border).toBe(cs.color);
    });

    test('--outline fills with the family colour on hover', async ({ page }) => {
      await mount(page, `<button class="sf-btn sf-btn--outline" id="t">Outline</button>`);
      const before = await page.evaluate(
        () => getComputedStyle(document.getElementById('t')).backgroundColor,
      );
      await page.hover('#t');
      const after = await page.evaluate(
        () => getComputedStyle(document.getElementById('t')).backgroundColor,
      );
      expect(TRANSPARENT.has(before)).toBe(true);
      expect(TRANSPARENT.has(after)).toBe(false);
    });

    test('--outline composes with a colour family (danger outline)', async ({ page }) => {
      await mount(
        page,
        `<button class="sf-btn sf-btn--danger" id="fill">A</button>
         <button class="sf-btn sf-btn--danger sf-btn--outline" id="out">B</button>`,
      );
      const { fillBg, outColor } = await page.evaluate(() => ({
        fillBg: getComputedStyle(document.getElementById('fill')).backgroundColor,
        outColor: getComputedStyle(document.getElementById('out')).color,
      }));
      // The outline's text colour equals the danger fill colour.
      expect(outColor).toBe(fillBg);
    });

    test('size scale orders xs < m < l < xl by height', async ({ page }) => {
      await mount(
        page,
        `<button class="sf-btn sf-btn--xs" id="xs">A</button>
         <button class="sf-btn" id="m">B</button>
         <button class="sf-btn sf-btn--l" id="l">C</button>
         <button class="sf-btn sf-btn--xl" id="xl">D</button>`,
      );
      const [xs, m, l, xl] = await page.evaluate(() =>
        ['xs', 'm', 'l', 'xl'].map((id) => document.getElementById(id).getBoundingClientRect().height),
      );
      expect(xs).toBeLessThan(m);
      expect(m).toBeLessThan(l);
      expect(l).toBeLessThan(xl);
    });

    test('--block stretches to the container width', async ({ page }) => {
      await mount(
        page,
        `<div style="inline-size:400px"><button class="sf-btn sf-btn--block" id="t">Block</button></div>`,
      );
      const w = await page.evaluate(
        () => document.getElementById('t').getBoundingClientRect().width,
      );
      expect(Math.round(w)).toBe(400);
    });

    test(':disabled removes pointer events and dims', async ({ page }) => {
      await mount(page, `<button class="sf-btn" id="t" disabled>Nope</button>`);
      const cs = await computed(page, ['pointer-events', 'opacity', 'cursor']);
      expect(cs['pointer-events']).toBe('none');
      expect(parseFloat(cs.opacity)).toBeLessThan(1);
      expect(cs.cursor).toBe('not-allowed');
    });

    test('.sf-is-loading hides content and sets a wait cursor', async ({ page }) => {
      await mount(page, `<button class="sf-btn sf-is-loading" id="t"><span id="lbl">Saving…</span></button>`);
      const cursor = await computed(page, ['cursor']);
      const labelVis = await page.evaluate(
        () => getComputedStyle(document.getElementById('lbl')).visibility,
      );
      expect(cursor.cursor).toBe('wait');
      expect(labelVis).toBe('hidden');
    });

    test('keyboard focus shows a visible outline ring', async ({ page }) => {
      await mount(page, `<button class="sf-btn" id="t">Focus me</button>`);
      await page.keyboard.press('Tab');
      const outlineWidth = await page.evaluate(() => {
        const el = document.getElementById('t');
        return el === document.activeElement
          ? parseFloat(getComputedStyle(el).outlineWidth)
          : -1;
      });
      expect(outlineWidth).toBeGreaterThan(0);
    });
  });
}
