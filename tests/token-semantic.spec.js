// SLASHED — scoped semantic token value snapshot.
//
// Resolves ~20 key semantic tokens in both light and dark mode and locks
// their values in tests/token-semantic.snapshot.json. Purpose: catch
// accidental value regressions (palette shifts, formula changes, token
// rewirings) during releases — even when the token *name* stays unchanged.
//
// Token categories:
//   colors — resolved via canvas to sRGB {r,g,b} integers; tested per mode.
//   raw    — stored as the trimmed CSS custom-property string; mode-insensitive.
//
// To update the snapshot after an intentional value change:
//   1. Run the tests — the failure message shows what changed.
//   2. Delete tests/token-semantic.snapshot.json and re-run to regenerate.
//   3. Commit the new snapshot with a CHANGELOG entry explaining the change.

import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const FIXTURE = pathToFileURL(path.join(import.meta.dirname, 'fixture.html')).href;
const SNAP    = path.join(import.meta.dirname, 'token-semantic.snapshot.json');

// ---- Tokens to snapshot ------------------------------------------------------

// Semantic color tokens — resolved to sRGB via canvas, compared per mode.
const COLOR_TOKENS = [
  '--sf-color-text',
  '--sf-color-heading',
  '--sf-color-link',
  '--sf-color-bg',
  '--sf-color-primary',
  '--sf-color-secondary',
  '--sf-color-action',
  '--sf-color-border',
  '--sf-color-text--muted',
  '--sf-color-text--on-primary',
];

// Scale/geometry tokens — stored as raw CSS value strings, mode-insensitive.
// Note: tokens registered via @property <length> resolve to computed pixel
// values (not expression strings). Viewport-dependent clamp() tokens
// (--sf-space-*, --sf-gap) are excluded — they resolve to a viewport-specific
// px value that would make the snapshot fragile across environments.
const RAW_TOKENS = [
  '--sf-text-m',
  '--sf-text-s',
  '--sf-text-l',
  '--sf-h1-size',
  '--sf-radius-m',
  '--sf-border-width-1',
  '--sf-font-weight-normal',
  '--sf-font-weight-bold',
];

// ---- In-browser measurement --------------------------------------------------
// Serialised and sent to page.evaluate — must be self-contained.

function measure({ theme, colorTokens, rawTokens }) {
  document.documentElement.setAttribute('data-theme', theme);

  const host = document.getElementById('probe-host');
  const cv   = document.createElement('canvas');
  cv.width = cv.height = 1;
  const ctx = cv.getContext('2d', { willReadFrequently: true });

  const toRGB = (cssColor) => {
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = '#000';   // reset blending baseline
    ctx.fillStyle = cssColor;
    ctx.fillRect(0, 0, 1, 1);
    const d = ctx.getImageData(0, 0, 1, 1).data;
    return { r: d[0], g: d[1], b: d[2] };
  };

  const colors = {};
  for (const token of colorTokens) {
    const el = document.createElement('div');
    host.appendChild(el);
    el.style.backgroundColor = `var(${token})`;
    colors[token] = toRGB(getComputedStyle(el).backgroundColor);
    el.remove();
  }

  const rootStyle = getComputedStyle(document.documentElement);
  const raw = {};
  for (const token of rawTokens) {
    raw[token] = rootStyle.getPropertyValue(token).trim();
  }

  return { colors, raw };
}

// ---- Tests -------------------------------------------------------------------

test.describe('Token semantic values', () => {
  let page;
  let current;
  let snapshot;
  let snapCreated = false;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto(FIXTURE);

    const light = await page.evaluate(measure, {
      theme:       'light',
      colorTokens: COLOR_TOKENS,
      rawTokens:   RAW_TOKENS,
    });
    const dark = await page.evaluate(measure, {
      theme:       'dark',
      colorTokens: COLOR_TOKENS,
      rawTokens:   RAW_TOKENS,
    });

    current = {
      'colors.light': light.colors,
      'colors.dark':  dark.colors,
      raw:            light.raw,   // raw values are mode-insensitive; light is canonical
      'raw.dark':     dark.raw,    // kept for the mode-invariance assertion only
    };

    if (!fs.existsSync(SNAP)) {
      fs.writeFileSync(SNAP, JSON.stringify(current, null, 2) + '\n');
      snapCreated = true;
      snapshot = current;
    } else {
      snapshot = JSON.parse(fs.readFileSync(SNAP, 'utf8'));
    }
  });

  test.afterAll(async () => { await page.close(); });

  // Canvas OKLCH→sRGB conversion differs by ±1 across browser engines.
  // Snapshot values are Chromium-baseline; run color assertions there only.
  test('light-mode color values match snapshot', ({ browserName }) => {
    test.skip(browserName !== 'chromium', 'Canvas OKLCH rounding is Chromium-baseline');
    if (snapCreated) {
      throw new Error(
        'Snapshot was just created at tests/token-semantic.snapshot.json — ' +
        're-run the tests to verify.'
      );
    }
    const got  = current['colors.light'];
    const want = snapshot['colors.light'];
    const diffs = diffColors(got, want);
    if (diffs.length) console.log('Light-mode color regressions:\n' + diffs.join('\n'));
    expect(got).toEqual(want);
  });

  test('dark-mode color values match snapshot', ({ browserName }) => {
    test.skip(browserName !== 'chromium', 'Canvas OKLCH rounding is Chromium-baseline');
    if (snapCreated) {
      throw new Error(
        'Snapshot was just created at tests/token-semantic.snapshot.json — ' +
        're-run the tests to verify.'
      );
    }
    const got  = current['colors.dark'];
    const want = snapshot['colors.dark'];
    const diffs = diffColors(got, want);
    if (diffs.length) console.log('Dark-mode color regressions:\n' + diffs.join('\n'));
    expect(got).toEqual(want);
  });

  test('raw token values match snapshot (mode-insensitive)', () => {
    if (snapCreated) {
      throw new Error(
        'Snapshot was just created at tests/token-semantic.snapshot.json — ' +
        're-run the tests to verify.'
      );
    }
    const got  = current.raw;
    const want = snapshot.raw;
    const diffs = diffRaw(got, want);
    if (diffs.length) console.log('Raw token regressions:\n' + diffs.join('\n'));
    expect(got).toEqual(want);

    // Raw values must be identical in both modes — they are theme-insensitive.
    expect(current['raw.dark']).toEqual(got);
  });
});

// ---- Diff helpers ------------------------------------------------------------

function diffColors(got, want) {
  const lines = [];
  for (const [token, g] of Object.entries(got)) {
    const w = want?.[token];
    if (!w || w.r !== g.r || w.g !== g.g || w.b !== g.b) {
      lines.push(
        `  ${token}:\n` +
        `    expected rgb(${w?.r ?? '?'},${w?.g ?? '?'},${w?.b ?? '?'})\n` +
        `    got      rgb(${g.r},${g.g},${g.b})`
      );
    }
  }
  return lines;
}

function diffRaw(got, want) {
  const lines = [];
  for (const [token, g] of Object.entries(got)) {
    const w = want?.[token];
    if (w !== g) {
      lines.push(`  ${token}:\n    expected: ${w ?? '(missing)'}\n    got:      ${g}`);
    }
  }
  return lines;
}
