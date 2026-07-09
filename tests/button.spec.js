// @ts-check
// Behavioural tests for the .sf-btn component (shipped in 0.7.0). Loads the
// components bundle (the default optimal bundle excludes optional/components.css)
// and asserts computed styles for the colour families, style treatments, the
// orthogonal --outline modifier, the size scale, width, and states. Runs in
// both light and dark themes since the structural relationships hold in both.
import { test, expect } from '@playwright/test';
import path from 'node:path';
import { renderWithBundle, NO_TRANSITIONS_STYLE } from './render-helpers.js';

// Components ship only in the full bundle (the optimal-components tier was
// retired when the bundle set was reduced to optimal + full).
const COMPONENTS_BUNDLE = path.join(process.cwd(), 'dist', 'slashed.full.css');

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

    test('all 10 colour families each produce a distinct fill', async ({ page }) => {
      const families = [
        'primary', 'secondary', 'tertiary', 'action', 'base',
        'neutral', 'success', 'warning', 'info', 'danger',
      ];
      await mount(
        page,
        families
          .map((f) => `<button class="sf-btn sf-btn--${f}" id="${f}">B</button>`)
          .join('\n'),
      );
      const bgs = await page.evaluate(
        (fams) =>
          fams.map((id) => getComputedStyle(document.getElementById(id)).backgroundColor),
        families,
      );
      // No family may be transparent, and (except action, which is the
      // default family with an explicit name) they must all be distinct.
      for (const bg of bgs) expect(TRANSPARENT.has(bg)).toBe(false);
      expect(new Set(bgs).size).toBe(10);
    });

    test('--action names the default family explicitly (same fill as bare .sf-btn)', async ({ page }) => {
      await mount(
        page,
        `<button class="sf-btn" id="plain">A</button>
         <button class="sf-btn sf-btn--action" id="action">B</button>`,
      );
      const [plain, action] = await page.evaluate(() =>
        ['plain', 'action'].map(
          (id) => getComputedStyle(document.getElementById(id)).backgroundColor,
        ),
      );
      expect(action).toBe(plain);
    });

    test('--secondary is now a colour family (solid secondary fill, not a style)', async ({ page }) => {
      // Breaking rename guard (0.7.7): .sf-btn--secondary used to be the soft
      // tonal STYLE; it now selects the secondary brand COLOUR. The fill must
      // equal the full-strength family colour — a tonal/semi-transparent wash
      // (the old 14% color-mix) would not match the probe.
      await mount(
        page,
        `<button class="sf-btn sf-btn--secondary" id="t">B</button>
         <div id="probe" style="background: var(--sf-color-secondary)"></div>`,
      );
      const { btn, probe } = await page.evaluate(() => ({
        btn: getComputedStyle(document.getElementById('t')).backgroundColor,
        probe: getComputedStyle(document.getElementById('probe')).backgroundColor,
      }));
      expect(TRANSPARENT.has(btn)).toBe(false);
      expect(btn).toBe(probe);
    });

    test('--ghost no longer exists (renders as the plain default button)', async ({ page }) => {
      await mount(
        page,
        `<button class="sf-btn" id="plain">A</button>
         <button class="sf-btn sf-btn--ghost" id="ghost">B</button>`,
      );
      const [plain, ghost] = await page.evaluate(() =>
        ['plain', 'ghost'].map((id) => {
          const c = getComputedStyle(document.getElementById(id));
          return `${c.backgroundColor}|${c.borderTopColor}`;
        }),
      );
      expect(ghost).toBe(plain);
    });

    test('--soft is a tonal fill, distinct from --outline', async ({ page }) => {
      // Regression guard: the tonal style and outline were once
      // pixel-identical at rest (both transparent + bordered). Soft is a
      // tonal fill (--sf-color-{family}-subtle) with no border, so the two
      // treatments must read differently. Modern engines (all Playwright
      // targets) support the relative-color wash; the @supports fallback
      // degrades soft to a border, still != outline.
      await mount(
        page,
        `<button class="sf-btn sf-btn--soft" id="soft">A</button>
         <button class="sf-btn sf-btn--outline" id="out">B</button>`,
      );
      const { soft, out } = await page.evaluate(() => {
        const read = (id) => {
          const c = getComputedStyle(document.getElementById(id));
          return { bg: c.backgroundColor, border: c.borderTopColor };
        };
        return { soft: read('soft'), out: read('out') };
      });
      // Soft: soft tonal fill (not fully transparent), no border.
      expect(['rgba(0, 0, 0, 0)', 'transparent']).not.toContain(soft.bg);
      expect(['rgba(0, 0, 0, 0)', 'transparent']).toContain(soft.border);
      // Outline: transparent fill with a visible border.
      expect(['rgba(0, 0, 0, 0)', 'transparent']).toContain(out.bg);
      expect(['rgba(0, 0, 0, 0)', 'transparent']).not.toContain(out.border);
      // The whole point: the two styles are no longer indistinguishable.
      expect(soft.bg).not.toBe(out.bg);
    });

    for (const family of ['primary', 'secondary', 'tertiary', 'action']) {
      test(`--gradient fill paints a gradient background (${family})`, async ({ page }) => {
        await mount(
          page,
          `<button class="sf-btn sf-btn--${family} sf-btn--gradient" id="t">B</button>`,
        );
        const cs = await computed(page, ['background-image', 'border-top-color']);
        expect(cs['background-image']).toContain('linear-gradient');
        expect(TRANSPARENT.has(cs['border-top-color'])).toBe(true);
      });

      test(`--gradient --outline paints the border ring via ::before (${family})`, async ({ page }) => {
        await mount(
          page,
          `<button class="sf-btn sf-btn--${family} sf-btn--gradient sf-btn--outline" id="t">B</button>`,
        );
        const res = await page.evaluate(() => {
          const el = document.getElementById('t');
          const cs = getComputedStyle(el);
          const before = getComputedStyle(el, '::before');
          return {
            bg: cs.backgroundColor,
            border: cs.borderTopColor,
            beforeBg: before.backgroundImage,
            beforeContent: before.content,
          };
        });
          // Button itself: transparent fill, transparent solid border (the
          // visible ring is the masked gradient ::before).
        expect(['rgba(0, 0, 0, 0)', 'transparent']).toContain(res.bg);
        expect(['rgba(0, 0, 0, 0)', 'transparent']).toContain(res.border);
        expect(res.beforeContent).toBe('""');
        expect(res.beforeBg).toContain('linear-gradient');
      });
    }

    test('--gradient is a solid no-op for families without a gradient token', async ({ page }) => {
      await mount(
        page,
        `<button class="sf-btn sf-btn--danger" id="plain">A</button>
         <button class="sf-btn sf-btn--danger sf-btn--gradient" id="grad">B</button>`,
      );
      const [plain, grad] = await page.evaluate(() =>
        ['plain', 'grad'].map(
          (id) => getComputedStyle(document.getElementById(id)).backgroundColor,
        ),
      );
      // Same solid danger fill — composing --gradient is always safe.
      expect(grad).toBe(plain);
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
