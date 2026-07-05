// @ts-check
// Behavioural tests for the .sf-card component (shipped in 0.7.0). Loads the
// components bundle and asserts the base surface, concentric radius, header/
// footer dividers, the --bordered/--elevated/--interactive modifiers, the
// nested-button font-size override, and the __media aspect ratio. Runs in both
// light and dark themes.
import { test, expect } from '@playwright/test';
import path from 'node:path';
import { renderWithBundle, NO_TRANSITIONS_STYLE } from './render-helpers.js';

const COMPONENTS_BUNDLE = path.join(process.cwd(), 'badges', 'slashed.optimal-components.css');

for (const theme of ['light', 'dark']) {
  test.describe(`.sf-card — ${theme} theme`, () => {
    async function mount(page, html) {
      await renderWithBundle(page, html, {
        bundle: COMPONENTS_BUNDLE,
        extraStyle: NO_TRANSITIONS_STYLE,
      });
      await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
    }

    test('base card has padding, a border, a shadow, and a rounded outer radius', async ({ page }) => {
      await mount(page, `<article class="sf-card" id="t">Body</article>`);
      const cs = await page.evaluate(() => {
        const c = getComputedStyle(document.getElementById('t'));
        return {
          pad: parseFloat(c.paddingTop),
          border: parseFloat(c.borderTopWidth),
          shadow: c.boxShadow,
          radius: parseFloat(c.borderTopLeftRadius),
        };
      });
      expect(cs.pad).toBeGreaterThan(0);
      expect(cs.border).toBeGreaterThan(0);
      expect(cs.shadow).not.toBe('none');
      // Concentric: outer radius = inner radius (~8px) + padding, so clearly > 8.
      expect(cs.radius).toBeGreaterThan(12);
    });

    test('__header and __footer carry divider borders', async ({ page }) => {
      await mount(
        page,
        `<article class="sf-card">
           <header class="sf-card__header" id="h">H</header>
           <div class="sf-card__body">B</div>
           <footer class="sf-card__footer" id="f">F</footer>
         </article>`,
      );
      const [hb, fb] = await page.evaluate(() => [
        parseFloat(getComputedStyle(document.getElementById('h')).borderBottomWidth),
        parseFloat(getComputedStyle(document.getElementById('f')).borderTopWidth),
      ]);
      expect(hb).toBeGreaterThan(0);
      expect(fb).toBeGreaterThan(0);
    });

    test('--bordered keeps the border but drops the shadow', async ({ page }) => {
      await mount(page, `<article class="sf-card sf-card--bordered" id="t">Flat</article>`);
      const cs = await page.evaluate(() => {
        const c = getComputedStyle(document.getElementById('t'));
        return { border: parseFloat(c.borderTopWidth), shadow: c.boxShadow };
      });
      expect(cs.border).toBeGreaterThan(0);
      expect(cs.shadow).toBe('none');
    });

    test('--elevated keeps a shadow but hides the border', async ({ page }) => {
      await mount(page, `<article class="sf-card sf-card--elevated" id="t">Float</article>`);
      const cs = await page.evaluate(() => {
        const c = getComputedStyle(document.getElementById('t'));
        return { borderColor: c.borderTopColor, shadow: c.boxShadow };
      });
      expect(cs.shadow).not.toBe('none');
      expect(['rgba(0, 0, 0, 0)', 'transparent']).toContain(cs.borderColor);
    });

    test('--interactive is a pointer affordance', async ({ page }) => {
      await mount(page, `<article class="sf-card sf-card--interactive" id="t">Click</article>`);
      const cursor = await page.evaluate(
        () => getComputedStyle(document.getElementById('t')).cursor,
      );
      expect(cursor).toBe('pointer');
    });

    test('a nested .sf-btn shrinks relative to a standalone one', async ({ page }) => {
      await mount(
        page,
        `<button class="sf-btn" id="loose">Loose</button>
         <article class="sf-card">
           <button class="sf-btn" id="nested">Nested</button>
         </article>`,
      );
      const [loose, nested] = await page.evaluate(() =>
        ['loose', 'nested'].map((id) => parseFloat(getComputedStyle(document.getElementById(id)).fontSize)),
      );
      expect(nested).toBeLessThan(loose);
    });

    test('__media crops to a 16/9 aspect ratio', async ({ page }) => {
      await mount(
        page,
        `<article class="sf-card"><div class="sf-card__media" id="t"></div></article>`,
      );
      const ratio = await page.evaluate(() => {
        const el = document.getElementById('t');
        const r = el.getBoundingClientRect();
        return r.width / r.height;
      });
      expect(ratio).toBeCloseTo(16 / 9, 1);
    });
  });
}
