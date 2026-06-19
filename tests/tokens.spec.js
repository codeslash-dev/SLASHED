// SLASHED — token regression suite.
// Codifies the manual Playwright audit: resolves tokens in both light and
// dark and asserts the invariants behind the fixed bugs, plus a coverage
// check that every declared --sf-* token resolves in both themes.

import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = path.resolve(import.meta.dirname, '..');
const FIXTURE = pathToFileURL(path.join(import.meta.dirname, 'fixture.html')).href;

// ---- Parse the declared token names from the source ----------------------
import { TOKEN_FILES } from '../scripts/registry-sources.js';

// Tokens whose value is the `inherit` keyword resolve to empty at :root
// (no parent to inherit from) — by design, so they're excluded from coverage.
const EXPECTED_EMPTY = new Set([
  '--sf-color-mark-text',
  '--sf-color-selection-text',
  '--sf-color-code-text',
]);

function declaredTokens() {
  const names = new Set();
  for (const rel of TOKEN_FILES) {
    let css = fs.readFileSync(path.join(ROOT, rel), 'utf8');
    css = css.replace(/\/\*[\s\S]*?\*\//g, ''); // strip comments (avoid example decls)
    // custom-property declarations: --sf-foo:
    for (const m of css.matchAll(/(--sf-[\w-]+)\s*:/g)) names.add(m[1]);
    // @property registrations: @property --sf-foo {
    for (const m of css.matchAll(/@property\s+(--sf-[\w-]+)/g)) names.add(m[1]);
  }
  return [...names].filter((n) => !EXPECTED_EMPTY.has(n)).sort();
}

const TOKENS = declaredTokens();

// ---- In-page measurement (runs in the browser) ---------------------------
// Returns every value we assert on, for one theme, in a single round-trip.
function measure({ theme, tokenNames }) {
  document.documentElement.setAttribute('data-theme', theme);

  const host = document.getElementById('probe-host');
  const _cv = document.createElement('canvas');
  _cv.width = _cv.height = 1;
  const _ctx = _cv.getContext('2d', { willReadFrequently: true });

  const toRGB = (color) => {
    _ctx.clearRect(0, 0, 1, 1);
    _ctx.fillStyle = '#000';
    _ctx.fillStyle = color;
    _ctx.fillRect(0, 0, 1, 1);
    const d = _ctx.getImageData(0, 0, 1, 1).data;
    return { r: d[0], g: d[1], b: d[2], a: d[3] / 255 };
  };
  const lum = ({ r, g, b }) => {
    const f = (v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const contrast = (c1, c2) => {
    const a = Math.max(lum(c1), lum(c2));
    const b = Math.min(lum(c1), lum(c2));
    return (a + 0.05) / (b + 0.05);
  };
  const parseAlpha = (fn) => {
    const inside = fn.slice(fn.indexOf('(') + 1, fn.lastIndexOf(')'));
    if (inside.includes('/')) {
      const a = inside.split('/')[1].trim();
      return a.endsWith('%') ? parseFloat(a) / 100 : parseFloat(a);
    }
    const parts = inside.split(',').map((s) => s.trim());
    return parts.length === 4 ? parseFloat(parts[3]) : 1;
  };

  const resolveColor = (token) => {
    const el = document.createElement('div');
    host.appendChild(el);
    el.style.backgroundColor = `var(${token})`;
    const c = getComputedStyle(el).backgroundColor;
    el.remove();
    return toRGB(c);
  };

  // Shadow alphas: render each box-shadow token, extract every color alpha.
  const shadowTokens = [
    '--sf-shadow-xs', '--sf-shadow-s', '--sf-shadow-m', '--sf-shadow-l',
    '--sf-shadow-xl', '--sf-shadow-2xl', '--sf-shadow-inner', '--sf-shadow-glow',
  ];
  const shadowAlphas = [];
  {
    const el = document.createElement('div');
    host.appendChild(el);
    for (const t of shadowTokens) {
      el.style.boxShadow = `var(${t})`;
      const cs = getComputedStyle(el).boxShadow;
      const fns = cs.match(/(?:rgba?|hsla?|oklch|oklab|color)\([^)]*\)/g) || [];
      for (const fn of fns) shadowAlphas.push(parseAlpha(fn));
    }
    el.remove();
  }

  // Links: luminance of resting vs hover vs active.
  const link = {
    base: lum(resolveColor('--sf-color-link')),
    hover: lum(resolveColor('--sf-color-link--hover')),
    active: lum(resolveColor('--sf-color-link--active')),
  };

  // text--inverse luminance (should be light on light page, dark on dark).
  const inverseLum = lum(resolveColor('--sf-color-text--inverse'));

  // On-color contrast for every color family.
  const families = [
    'primary', 'secondary', 'tertiary', 'action', 'neutral', 'base',
    'success', 'warning', 'error', 'info', 'danger',
  ];
  const onColor = {};
  for (const name of families) {
    const bg = resolveColor(`--sf-color-${name}`);
    const fg = resolveColor(`--sf-color-text--on-${name}`);
    onColor[name] = contrast(bg, fg);
  }

  // Font-weight scale.
  const weight = (token) => {
    const el = document.createElement('div');
    host.appendChild(el);
    el.style.fontWeight = `var(${token})`;
    const w = getComputedStyle(el).fontWeight;
    el.remove();
    return Number(w);
  };
  const weights = {
    light: weight('--sf-font-weight-light'),
    normal: weight('--sf-font-weight-normal'),
    medium: weight('--sf-font-weight-medium'),
    semibold: weight('--sf-font-weight-semibold'),
    bold: weight('--sf-font-weight-bold'),
  };

  // Animation preset tokens.
  const rootStyle = getComputedStyle(document.documentElement);
  const animations = {
    fadeIn: rootStyle.getPropertyValue('--sf-animation-fade-in').trim(),
    slideInUp: rootStyle.getPropertyValue('--sf-animation-slide-in-up').trim(),
    scaleUp: rootStyle.getPropertyValue('--sf-animation-scale-up').trim(),
  };

  // Coverage: every declared token must resolve to a non-empty value.
  const missing = [];
  for (const name of tokenNames) {
    if (rootStyle.getPropertyValue(name).trim() === '') missing.push(name);
  }

  return { shadowAlphas, link, inverseLum, onColor, weights, animations, missing };
}

// ---- Tests ----------------------------------------------------------------
for (const theme of ['light', 'dark']) {
  test.describe(`theme: ${theme}`, () => {
    let data;
    test.beforeAll(async ({ browser }) => {
      const page = await browser.newPage();
      await page.goto(FIXTURE);
      data = await page.evaluate(measure, { theme, tokenNames: TOKENS });
      await page.close();
    });

    test('BUG-1: shadow alpha never exceeds the 0.7 cap', () => {
      for (const a of data.shadowAlphas) {
        expect(a).toBeLessThanOrEqual(0.705);
      }
    });

    test('BUG-2: link hover/active move away from the page background', () => {
      if (theme === 'light') {
        expect(data.link.hover).toBeLessThan(data.link.base);   // darker
        expect(data.link.active).toBeLessThan(data.link.base);
      } else {
        expect(data.link.hover).toBeGreaterThan(data.link.base); // lighter
        expect(data.link.active).toBeGreaterThan(data.link.base);
      }
    });

    test('BUG-3: text--inverse stays readable (correct direction, in-gamut)', () => {
      if (theme === 'light') {
        expect(data.inverseLum).toBeGreaterThan(0.5); // light ink for dark surface
      } else {
        expect(data.inverseLum).toBeLessThan(0.5);    // dark ink for light surface
      }
    });

    test('on-color text meets WCAG AA Normal (4.5:1)', () => {
      // After Phase 2's default-tightening (tertiary L 0.55→0.48,
      // neutral L 0.55→0.45) every brand and status colour ships with
      // an on-* foreground that clears 4.5:1. The binary `sign(0.6-l)`
      // threshold flips text from white-on-dark to black-on-light at
      // L=0.6, so any user-supplied colour landing near that threshold
      // (e.g. L=0.55..0.65) may need an explicit override of its
      // matching --sf-color-text--on-* token. See architecture.md.
      const FAMILIES = [
        'primary', 'secondary', 'tertiary', 'action', 'neutral', 'base',
        'success', 'warning', 'error', 'info', 'danger',
      ];
      for (const name of FAMILIES) {
        expect(data.onColor[name], `on-${name}`).toBeGreaterThanOrEqual(4.5);
      }
    });

    test('font-weight scale resolves 300…700', () => {
      expect(data.weights).toEqual({
        light: 300, normal: 400, medium: 500, semibold: 600, bold: 700,
      });
    });

    test('animation presets resolve and reference their keyframes', () => {
      expect(data.animations.fadeIn).toContain('sf-fade-in');
      expect(data.animations.slideInUp).toContain('sf-slide-in-up');
      expect(data.animations.scaleUp).toContain('sf-scale-up');
    });

    test('coverage: every declared --sf-* token resolves', () => {
      expect(data.missing).toEqual([]);
    });
  });
}
