// @ts-check
// Auto-colour system regression suite (issues #204 / #205).
//
// Complements the existing colour specs without duplicating them:
//   · color-semantic.spec.js — semantic token *pairs* (text/bg, surfaces)
//   · link-contrast.spec.js  — link colour >= AA under brand overrides
//
// This file proves the *mechanism* the framework relies on:
//   #204 — the auto-colour system reacts to class / element private
//          custom-property overrides, and the black/white auto-pick
//          (--sf-color-text--on-*) flips at the threshold across a
//          lightness sweep.
//   #205 — links, underlines, and per-element colour overwrites resolve
//          as documented (on the page, on surfaces, and when overridden).
//
// fixture.html loads dist/slashed.full.css, so both the `a:link` rules
// (base) and the .sf-surface--* / .sf-link--* macros are present.
import { test, expect } from '@playwright/test';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const FIXTURE = pathToFileURL(path.join(import.meta.dirname, 'fixture.html')).href;

const SURFACES = [
  'primary', 'secondary', 'tertiary', 'action', 'neutral',
  'inverse', 'success', 'warning', 'error', 'info', 'danger',
];


// ── Surfaces: auto-contrast text on every variant (#204/#205) ────
// Reads the *computed* color + backgroundColor of an element carrying
// the macro class (what it actually paints), not the raw token.
for (const theme of ['light', 'dark']) {
  test.describe(`Auto-colour — surfaces (${theme} theme)`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(FIXTURE);
      await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
      await page.evaluate(() => document.fonts.ready);
    });

    // Every .sf-surface--* paints auto-contrast text that clears the
    // framework's documented on-colour guarantee (>= 3:1, AA Large/UI).
    // 4.5:1 is intentionally NOT asserted: a binary black/white auto-pick
    // cannot reach it on mid-luminance backgrounds — a documented maths
    // limit, not a regression (see core/tokens.css on-colour note).
    for (const variant of SURFACES) {
      test(`.sf-surface--${variant} text meets on-colour contract (>= 3:1)`, async ({ page }) => {
        const ratio = await page.evaluate((cls) => {
          const cv = document.createElement('canvas'); cv.width = cv.height = 1;
          const ctx = cv.getContext('2d', { willReadFrequently: true });
          const toLum = (color) => {
            ctx.clearRect(0, 0, 1, 1); ctx.fillStyle = color; ctx.fillRect(0, 0, 1, 1);
            const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
            const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
            return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
          };
          const el = document.createElement('div');
          el.className = cls;
          el.textContent = 'Sample text';
          document.body.appendChild(el);
          const cs = getComputedStyle(el);
          const fg = toLum(cs.color);
          const bg = toLum(cs.backgroundColor);
          el.remove();
          return (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05);
        }, `sf-surface--${variant}`);
        expect(ratio).toBeGreaterThanOrEqual(3.0);
      });
    }
  });
}


// ── #204: on-colour auto-pick flips at the threshold (lightness sweep) ──
// --sf-color-text--on-neutral is computed from --sf-color-neutral via
// sign(threshold - l) * 999 → near-black on light backgrounds, near-white
// on dark ones. Drive --sf-color-neutral-light across a lightness sweep
// and assert the picked text colour always clears 3:1 on its own surface,
// and that it actually flips polarity from dark→light as L drops.
test.describe('Auto-colour — on-colour auto-pick (lightness sweep)', () => {
  test('text--on-neutral stays legible and flips polarity across L', async ({ page }) => {
    await page.goto(FIXTURE);
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));

    const results = await page.evaluate(() => {
      const cv = document.createElement('canvas'); cv.width = cv.height = 1;
      const ctx = cv.getContext('2d', { willReadFrequently: true });
      const toLum = (color) => {
        ctx.clearRect(0, 0, 1, 1); ctx.fillStyle = color; ctx.fillRect(0, 0, 1, 1);
        const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
        const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
        return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
      };
      const root = document.documentElement;
      const out = [];
      for (const L of [0.10, 0.30, 0.45, 0.60, 0.75, 0.95]) {
        root.style.setProperty('--sf-color-neutral-light', `oklch(${L} 0.02 250)`);
        const el = document.createElement('div');
        el.className = 'sf-surface--neutral';
        el.textContent = 'x';
        document.body.appendChild(el);
        const cs = getComputedStyle(el);
        const fg = toLum(cs.color);
        const bg = toLum(cs.backgroundColor);
        el.remove();
        out.push({ L, fg, contrast: (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05) });
      }
      root.style.removeProperty('--sf-color-neutral-light');
      return out;
    });

    // Legible across the whole sweep.
    for (const r of results) {
      expect(r.contrast, `contrast at L=${r.L}`).toBeGreaterThanOrEqual(3.0);
    }
    // Polarity flip: dark surface picks light text, light surface picks dark text.
    const darkest = results[0];   // L = 0.10
    const lightest = results[results.length - 1]; // L = 0.95
    expect(darkest.fg, 'text on a dark surface should be light').toBeGreaterThan(0.5);
    expect(lightest.fg, 'text on a light surface should be dark').toBeLessThan(0.5);
  });
});


// ── #204: class / element private-variable overrides drive colour ──
test.describe('Auto-colour — private-variable overrides', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(FIXTURE);
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
  });

  // A root-level --sf-color-action override re-derives --sf-color-link.
  // NOTE: --sf-color-link is declared at :root, so its var(--sf-color-action)
  // is substituted in root scope — an *element-scoped* action override does
  // NOT retro-actively re-derive link colour for descendants. Overriding the
  // brand at :root (the documented theming entry point) does. This test pins
  // that contract so the derivation chain can't silently break.
  test('root --sf-color-action override re-derives --sf-color-link', async ({ page }) => {
    const changed = await page.evaluate(() => {
      const probe = document.createElement('span');
      probe.style.color = 'var(--sf-color-link)';
      document.body.appendChild(probe);
      const before = getComputedStyle(probe).color;
      document.documentElement.style.setProperty('--sf-color-action', 'oklch(0.55 0.2 25)'); // red-ish
      const after = getComputedStyle(probe).color;
      probe.remove();
      document.documentElement.style.removeProperty('--sf-color-action');
      return { before, after };
    });
    expect(changed.after).not.toBe(changed.before);
  });

  // After surface consolidation, named variants are thin aliases that set
  // --sf-surface-color dynamically, so the auto-contrast formula tracks ANY
  // brand override — both :root and element-scoped. Both paths re-derive.
  test('brand override recomputes on-colour at both :root and element scope', async ({ page }) => {
    const res = await page.evaluate(() => {
      const cv = document.createElement('canvas'); cv.width = cv.height = 1;
      const ctx = cv.getContext('2d', { willReadFrequently: true });
      const toLum = (color) => {
        ctx.clearRect(0, 0, 1, 1); ctx.fillStyle = color; ctx.fillRect(0, 0, 1, 1);
        const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
        const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
        return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
      };
      const contrast = (el) => {
        const cs = getComputedStyle(el);
        const fg = toLum(cs.color), bg = toLum(cs.backgroundColor);
        return (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05);
      };
      const root = document.documentElement;

      // :root override → on-colour re-derives, staying legible on near-white.
      const elRoot = document.createElement('div');
      elRoot.className = 'sf-surface--primary'; elRoot.textContent = 'x';
      document.body.appendChild(elRoot);
      root.style.setProperty('--sf-color-primary', 'oklch(0.95 0.03 250)'); // near-white
      const rootContrast = contrast(elRoot);
      root.style.removeProperty('--sf-color-primary');
      elRoot.remove();

      // Element-scoped override: --sf-surface-color re-evaluates inline,
      // so the formula flips text colour to stay legible.
      const elScoped = document.createElement('div');
      elScoped.className = 'sf-surface--primary'; elScoped.textContent = 'x';
      document.body.appendChild(elScoped);
      const defaultText = getComputedStyle(elScoped).color;
      elScoped.style.setProperty('--sf-color-primary', 'oklch(0.95 0.03 250)');
      const scopedText = getComputedStyle(elScoped).color;
      const scopedContrast = contrast(elScoped);
      elScoped.remove();

      return { rootContrast, defaultText, scopedText, scopedContrast };
    });

    // Root override re-derives → legible.
    expect(res.rootContrast).toBeGreaterThanOrEqual(3.0);
    // Element-scoped override also re-derives → text flips from default.
    expect(res.scopedText).not.toBe(res.defaultText);
    expect(res.scopedContrast).toBeGreaterThanOrEqual(3.0);
  });
});


// ── #205: links, underlines, and overwrites ─────────────────────
test.describe('Auto-colour — links and underlines', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(FIXTURE);
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
  });

  // Base anchors carry an underline whose colour is the dedicated
  // --sf-color-link--underline token (not the text colour) by default.
  test('a:link is underlined with the link-underline token colour', async ({ page }) => {
    const info = await page.evaluate(() => {
      const a = document.createElement('a');
      a.href = 'https://example.com';
      a.textContent = 'link';
      document.body.appendChild(a);
      const cs = getComputedStyle(a);
      const tokenColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--sf-color-link--underline').trim();
      const out = { line: cs.textDecorationLine, decoColor: cs.textDecorationColor, hasToken: tokenColor.length > 0 };
      a.remove();
      return out;
    });
    expect(info.line).toContain('underline');
    expect(info.hasToken).toBe(true);
    expect(info.decoColor).not.toBe('rgba(0, 0, 0, 0)');
  });

  // The underline geometry tokens added for #185 are wired into a:link.
  test('underline offset + thickness read the link tokens', async ({ page }) => {
    const vals = await page.evaluate(() => {
      const root = document.documentElement;
      root.style.setProperty('--sf-link-underline-thickness', '3px');
      root.style.setProperty('--sf-link-underline-offset', '4px');
      const a = document.createElement('a');
      a.href = '#'; a.textContent = 'link';
      document.body.appendChild(a);
      const cs = getComputedStyle(a);
      const out = { thickness: cs.textDecorationThickness, offset: cs.textUnderlineOffset };
      a.remove();
      root.style.removeProperty('--sf-link-underline-thickness');
      root.style.removeProperty('--sf-link-underline-offset');
      return out;
    });
    expect(vals.thickness).toBe('3px');
    expect(vals.offset).toBe('4px');
  });

  // .sf-link--subtle hides the underline at rest (revealed on hover).
  test('.sf-link--subtle removes the resting underline', async ({ page }) => {
    const line = await page.evaluate(() => {
      const a = document.createElement('a');
      a.href = '#'; a.className = 'sf-link--subtle'; a.textContent = 'link';
      document.body.appendChild(a);
      const l = getComputedStyle(a).textDecorationLine;
      a.remove();
      return l;
    });
    expect(line).toBe('none');
  });

  // .sf-link--subtle hover reveals the underline.
  test('.sf-link--subtle hover reveals underline', async ({ page }) => {
    await page.evaluate(() => {
      const a = document.createElement('a');
      a.id = 'hover-link'; a.href = '#'; a.className = 'sf-link--subtle'; a.textContent = 'link';
      document.body.appendChild(a);
    });
    await page.hover('#hover-link');
    const hoverLine = await page.evaluate(() =>
      getComputedStyle(document.querySelector('#hover-link')).textDecorationLine
    );
    expect(hoverLine).toBe('underline');
  });

  // .sf-link--reverse carries an underline at rest (inverse of .sf-link--subtle).
  test('.sf-link--reverse has underline at rest', async ({ page }) => {
    const line = await page.evaluate(() => {
      const a = document.createElement('a');
      a.href = '#'; a.className = 'sf-link--reverse'; a.textContent = 'link';
      document.body.appendChild(a);
      const l = getComputedStyle(a).textDecorationLine;
      a.remove();
      return l;
    });
    expect(line).toBe('underline');
  });

  // Dark theme — link underline token is defined and resolves to a non-transparent colour.
  // Uses .sf-link--reverse which renders an underline at rest, so the colour assertion
  // only fires when an underline is actually present.
  test('dark theme: link underline token is non-transparent', async ({ page }) => {
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
    const info = await page.evaluate(() => {
      const a = document.createElement('a');
      a.href = '#'; a.className = 'sf-link--reverse'; a.textContent = 'link';
      document.body.appendChild(a);
      const cs = getComputedStyle(a);
      const tokenRaw = getComputedStyle(document.documentElement)
        .getPropertyValue('--sf-color-link--underline').trim();
      const out = { line: cs.textDecorationLine, decoColor: cs.textDecorationColor, hasToken: tokenRaw.length > 0 };
      a.remove();
      return out;
    });
    expect(info.hasToken).toBe(true);
    expect(info.line).toBe('underline');
    expect(info.decoColor).not.toBe('rgba(0, 0, 0, 0)');
  });

  // --sf-color-link--visited is declared and differs from --sf-color-link so
  // visited anchors can adopt a distinct visual treatment without extra classes.
  test('--sf-color-link--visited token differs from --sf-color-link', async ({ page }) => {
    const tokens = await page.evaluate(() => {
      const cs = getComputedStyle(document.documentElement);
      return {
        link:    cs.getPropertyValue('--sf-color-link').trim(),
        visited: cs.getPropertyValue('--sf-color-link--visited').trim(),
      };
    });
    expect(tokens.link.length).toBeGreaterThan(0);
    expect(tokens.visited.length).toBeGreaterThan(0);
    expect(tokens.visited).not.toBe(tokens.link);
  });
});


// ── #205: per-element colour overwrite wins ─────────────────────
// Computed colours come back as oklab()/oklch() in modern engines, and the
// a:link `color` transition means an immediate read can catch a mid-tween
// value — so these resolve to sRGB bytes via canvas and disable the
// transition before reading, rather than string-matching the input.
test.describe('Auto-colour — overwrites', () => {
  test('an inline color overwrites the auto link colour', async ({ page }) => {
    await page.goto(FIXTURE);
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));

    const result = await page.evaluate(() => {
      const toRGB = (color) => {
        const cv = document.createElement('canvas'); cv.width = cv.height = 1;
        const ctx = cv.getContext('2d', { willReadFrequently: true });
        ctx.clearRect(0, 0, 1, 1); ctx.fillStyle = color; ctx.fillRect(0, 0, 1, 1);
        return Array.from(ctx.getImageData(0, 0, 1, 1).data.slice(0, 3)).join(',');
      };
      const a = document.createElement('a');
      a.href = '#'; a.textContent = 'link';
      a.style.transition = 'none'; // read the settled value, not a tween frame
      document.body.appendChild(a);
      const auto = toRGB(getComputedStyle(a).color);
      a.style.color = 'rgb(255, 0, 0)';
      const forced = toRGB(getComputedStyle(a).color);
      a.remove();
      return { auto, forced };
    });
    expect(result.forced).toBe('255,0,0');
    expect(result.forced).not.toBe(result.auto);
  });

  // On a surface, overriding --sf-color-link in element scope produces a
  // branded link hue (the documented escape hatch from the macro comment).
  test('--sf-color-link override applies on a surface', async ({ page }) => {
    await page.goto(FIXTURE);
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));

    const result = await page.evaluate(() => {
      const toRGB = (color) => {
        const cv = document.createElement('canvas'); cv.width = cv.height = 1;
        const ctx = cv.getContext('2d', { willReadFrequently: true });
        ctx.clearRect(0, 0, 1, 1); ctx.fillStyle = color; ctx.fillRect(0, 0, 1, 1);
        return Array.from(ctx.getImageData(0, 0, 1, 1).data.slice(0, 3)).join(',');
      };
      const surface = document.createElement('div');
      surface.className = 'sf-surface--primary';
      const a = document.createElement('a');
      a.href = '#'; a.textContent = 'link';
      a.style.transition = 'none';
      surface.appendChild(a);
      document.body.appendChild(surface);
      const inherited = toRGB(getComputedStyle(a).color);
      surface.style.setProperty('--sf-color-link', 'rgb(0, 200, 0)');
      const overridden = toRGB(getComputedStyle(a).color);
      surface.remove();
      return { inherited, overridden };
    });
    expect(result.overridden).toBe('0,200,0');
    expect(result.overridden).not.toBe(result.inherited);
  });
});
