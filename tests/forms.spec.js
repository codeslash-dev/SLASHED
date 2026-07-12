// @ts-check
// Behavioural tests for optional/forms.css — the classless form-control layer,
// previously with no dedicated spec (only touched incidentally by a11y.spec).
// Asserts the computed styling contract for text inputs, textarea, select, the
// disabled state, and the --sf-field-border-color token indirection that the
// explicit .sf-is-invalid / .sf-is-valid state classes (core/states.css) set.
// Loads the optimal bundle (which includes optional/forms.css) in both themes.
import { test, expect } from '@playwright/test';
import { renderWithBundle, NO_TRANSITIONS_STYLE } from './render-helpers.js';

const TRANSPARENT = new Set(['rgba(0, 0, 0, 0)', 'transparent']);

/** Read a set of computed properties for #t. */
function computed(page, props) {
  return page.evaluate((p) => {
    const cs = getComputedStyle(document.getElementById('t'));
    return Object.fromEntries(p.map((k) => [k, cs.getPropertyValue(k)]));
  }, props);
}

for (const theme of ['light', 'dark']) {
  test.describe(`forms — ${theme} theme`, () => {
    async function mount(page, html) {
      await renderWithBundle(page, html, { extraStyle: NO_TRANSITIONS_STYLE });
      await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
    }

    test('a bare text input is a full-width block with padding and a visible border', async ({ page }) => {
      await mount(page, `<input type="text" id="t">`);
      const cs = await computed(page, [
        'display', 'appearance', 'border-top-width', 'border-top-style',
        'padding-block-start', 'padding-inline-start',
      ]);
      expect(cs.display).toBe('block');
      expect(cs.appearance).toBe('none');
      expect(parseFloat(cs['border-top-width'])).toBeGreaterThan(0);
      expect(cs['border-top-style']).toBe('solid');
      expect(parseFloat(cs['padding-block-start'])).toBeGreaterThan(0);
      expect(parseFloat(cs['padding-inline-start'])).toBeGreaterThan(0);
    });

    test('input stretches to its container width', async ({ page }) => {
      await mount(page, `<div style="inline-size:400px"><input type="text" id="t"></div>`);
      const w = await page.evaluate(() => document.getElementById('t').getBoundingClientRect().width);
      expect(Math.round(w)).toBe(400);
    });

    test('an untyped input ( :not([type]) ) is styled like a text input', async ({ page }) => {
      await mount(page, `<input id="t">`);
      const cs = await computed(page, ['appearance', 'display']);
      expect(cs.appearance).toBe('none');
      expect(cs.display).toBe('block');
    });

    test(':disabled dims the control and shows a not-allowed cursor', async ({ page }) => {
      await mount(page, `<input type="text" id="t" disabled>`);
      const cs = await computed(page, ['opacity', 'cursor']);
      expect(parseFloat(cs.opacity)).toBeLessThan(1);
      expect(cs.cursor).toBe('not-allowed');
    });

    test('--sf-field-border-color overrides the resting border colour', async ({ page }) => {
      await mount(page, `<input type="text" id="t" style="--sf-field-border-color: rgb(1, 2, 3)">`);
      const cs = await computed(page, ['border-top-color']);
      // The border resolves through --sf-field-border-color (the same hook
      // .sf-is-invalid/.sf-is-valid flip to danger/success — core/states.css).
      expect(cs['border-top-color']).toBe('rgb(1, 2, 3)');
    });

    test('textarea is vertically resizable with a minimum height', async ({ page }) => {
      await mount(page, `<textarea id="t"></textarea>`);
      const cs = await computed(page, ['resize', 'min-block-size']);
      expect(cs.resize).toBe('vertical');
      expect(parseFloat(cs['min-block-size'])).toBeGreaterThan(0);
    });

    test('select reserves inline-end space for its chevron', async ({ page }) => {
      await mount(page, `<input type="text" id="ref"><select id="t"><option>a</option></select>`);
      const [selPad, inputPad] = await page.evaluate(() => [
        getComputedStyle(document.getElementById('t')).paddingInlineEnd,
        getComputedStyle(document.getElementById('ref')).paddingInlineEnd,
      ]);
      expect(parseFloat(selPad)).toBeGreaterThan(parseFloat(inputPad));
    });

    test('placeholder colour is a real, non-transparent value', async ({ page }) => {
      await mount(page, `<input type="text" id="t" placeholder="hi">`);
      const c = await page.evaluate(() => {
        const cs = getComputedStyle(document.getElementById('t'), '::placeholder');
        return cs.color;
      });
      expect(TRANSPARENT.has(c)).toBe(false);
    });
  });
}
