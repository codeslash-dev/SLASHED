// @ts-check
// Section-level theming — :root-declared alias tokens must re-resolve
// inside a nested [data-theme] scope (#496). Before the fix, a
// <section data-theme="dark"> inside a light page kept the :root-resolved
// light values for --sf-color-code-bg (and friends), producing near-white
// code text on a near-white code background.
import { test, expect } from '@playwright/test';
import { renderWithBundle } from './render-helpers.js';

// Canvas-luminance technique shared with color-semantic.spec.js /
// surface-generic.spec.js. Runs inside page.evaluate — self-contained.
const PROBE_LIB = `
  const cv = document.createElement('canvas'); cv.width = cv.height = 1;
  const ctx = cv.getContext('2d', { willReadFrequently: true });
  const toLum = (color) => {
    ctx.clearRect(0, 0, 1, 1); ctx.fillStyle = color; ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    const lin = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  };
  const contrast = (a, b) => {
    const la = toLum(a), lb = toLum(b);
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
  };
  // Resolve a token by painting it on a probe appended INSIDE the given
  // scope element (color-helpers.js appends to body, which resolves at
  // root scope — wrong for nested-section assertions).
  const resolveIn = (scope, token) => {
    const el = document.createElement('div');
    el.style.backgroundColor = 'var(' + token + ')';
    scope.appendChild(el);
    const c = getComputedStyle(el).backgroundColor;
    el.remove();
    return c;
  };
`;

const FIXTURE = `
  <p>light page context</p>
  <section id="dark" data-theme="dark">
    <pre id="block"><code>@import "slashed.optimal.min.css";</code></pre>
    <p><code id="inline">inline code</code></p>
    <input id="off" type="text" disabled>
  </section>
`;

// Inverse fixture: dark root, nested light section.
const FIXTURE_INVERSE = `
  <section id="light" data-theme="light">
    <pre id="block"><code>const x = 1;</code></pre>
    <input id="off" type="text" disabled>
  </section>
`;

test.describe('section-theme aliases (#496)', () => {
  test('pre/code background flips dark inside a nested dark section', async ({ page }) => {
    await renderWithBundle(page, FIXTURE);
    const res = await page.evaluate(`(() => {
      ${PROBE_LIB}
      const section = document.getElementById('dark');
      const pre = document.getElementById('block');
      const preStyle = getComputedStyle(pre);
      return {
        codeBgLum: toLum(resolveIn(section, '--sf-color-code-bg')),
        rootCodeBgLum: toLum(resolveIn(document.body, '--sf-color-code-bg')),
        preContrast: contrast(preStyle.backgroundColor, preStyle.color),
      };
    })()`);
    // Nested section resolves its own (dark) code-bg, distinct from root's light one.
    expect(res.codeBgLum).toBeLessThan(0.2);
    expect(res.rootCodeBgLum).toBeGreaterThan(0.5);
    // The reported symptom: near-white on near-white. Must be readable now.
    expect(res.preContrast).toBeGreaterThanOrEqual(4.5);
  });

  test('inline code auto-contrast text tracks the in-scope code background', async ({ page }) => {
    await renderWithBundle(page, FIXTURE);
    const res = await page.evaluate(`(() => {
      ${PROBE_LIB}
      const inline = document.getElementById('inline');
      const s = getComputedStyle(inline);
      return { codeContrast: contrast(s.backgroundColor, s.color) };
    })()`);
    expect(res.codeContrast).toBeGreaterThanOrEqual(4.5);
  });

  test('disabled-field background re-resolves inside a nested dark section', async ({ page }) => {
    await renderWithBundle(page, FIXTURE);
    const res = await page.evaluate(`(() => {
      ${PROBE_LIB}
      const section = document.getElementById('dark');
      return {
        sectionLum: toLum(resolveIn(section, '--sf-color-bg--disabled')),
        rootLum:    toLum(resolveIn(document.body, '--sf-color-bg--disabled')),
      };
    })()`);
    expect(res.sectionLum).toBeLessThan(0.2);
    expect(res.rootLum).toBeGreaterThan(0.5);
  });

  test('scrollbar-thumb and link--disabled re-resolve per scope', async ({ page }) => {
    await renderWithBundle(page, FIXTURE);
    const res = await page.evaluate(`(() => {
      ${PROBE_LIB}
      const section = document.getElementById('dark');
      return {
        thumbIn:  resolveIn(section, '--sf-scrollbar-thumb'),
        thumbOut: resolveIn(document.body, '--sf-scrollbar-thumb'),
        linkIn:   resolveIn(section, '--sf-color-link--disabled'),
        linkOut:  resolveIn(document.body, '--sf-color-link--disabled'),
      };
    })()`);
    expect(res.thumbIn).not.toBe(res.thumbOut);
    expect(res.linkIn).not.toBe(res.linkOut);
  });

  test('inverse: light section nested in a dark root gets light code-bg', async ({ page }) => {
    await renderWithBundle(page, FIXTURE_INVERSE);
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
    const res = await page.evaluate(`(() => {
      ${PROBE_LIB}
      const section = document.getElementById('light');
      const pre = document.getElementById('block');
      const preStyle = getComputedStyle(pre);
      return {
        codeBgLum: toLum(resolveIn(section, '--sf-color-code-bg')),
        rootCodeBgLum: toLum(resolveIn(document.body, '--sf-color-code-bg')),
        preContrast: contrast(preStyle.backgroundColor, preStyle.color),
      };
    })()`);
    expect(res.codeBgLum).toBeGreaterThan(0.5);
    expect(res.rootCodeBgLum).toBeLessThan(0.2);
    expect(res.preContrast).toBeGreaterThanOrEqual(4.5);
  });
});
