/**
 * Tests for the override-CSS generator + parser (node --test, no DOM).
 *
 * The generator is the user-visible "Copy CSS" payload: it must round-trip
 * through `parseCSS` losslessly so a user can paste a previously-generated
 * stylesheet and recover the same overrides. It must also resist injection
 * via `sanitizeValue` (no `;`, `{`, `}` or comment delimiters can break out
 * of a declaration).
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { generateCSS, parseCSS, sanitizeValue } from '../src/lib/css.js';

describe('sanitizeValue', () => {
  test('strips structural characters', () => {
    // ; { } are removed; whitespace then collapses.
    assert.equal(sanitizeValue('1rem; } body { color: red'), '1rem body color: red');
  });
  test('drops comment blocks', () => {
    assert.equal(sanitizeValue('1rem /* sneaky */ 2rem'), '1rem 2rem');
  });
  test('collapses whitespace', () => {
    assert.equal(sanitizeValue('  1rem   2rem\t3rem  '), '1rem 2rem 3rem');
  });
  test('returns empty for null / undefined / blank', () => {
    assert.equal(sanitizeValue(null), '');
    assert.equal(sanitizeValue(undefined), '');
    assert.equal(sanitizeValue('   '), '');
  });
  test('keeps oklch() and clamp() intact', () => {
    assert.equal(sanitizeValue('oklch(0.5 0.2 220)'), 'oklch(0.5 0.2 220)');
    assert.equal(sanitizeValue('clamp(1rem, 2vw + 1rem, 3rem)'), 'clamp(1rem, 2vw + 1rem, 3rem)');
  });
});

describe('generateCSS', () => {
  test('empty overrides → empty output', () => {
    assert.equal(generateCSS({}), '');
  });

  test('layer mode wraps in @layer slashed.overrides { :root {…} }', () => {
    const css = generateCSS({ '--sf-color-primary': 'red' }, { mode: 'layer', banner: false });
    assert.match(css, /@layer slashed\.overrides \{/);
    assert.match(css, /:root \{/);
    assert.match(css, /--sf-color-primary: red;/);
    assert.match(css, /\}\n\}/); // closing braces present
  });

  test('root mode emits a bare :root block (no @layer)', () => {
    const css = generateCSS({ '--sf-color-primary': 'red' }, { mode: 'root', banner: false });
    assert.doesNotMatch(css, /@layer/);
    assert.match(css, /^:root \{/);
  });

  test('declarations are sorted alphabetically for stable diffs', () => {
    const css = generateCSS(
      { '--sf-z-modal': '1000', '--sf-color-primary': 'blue', '--sf-radius-m': '8px' },
      { banner: false }
    );
    const order = ['--sf-color-primary', '--sf-radius-m', '--sf-z-modal'];
    let last = -1;
    for (const name of order) {
      const idx = css.indexOf(name);
      assert.ok(idx > last, `${name} should appear after the previous declaration`);
      last = idx;
    }
  });

  test('banner is included by default and hidden with banner:false', () => {
    const withBanner = generateCSS({ '--sf-color-primary': 'red' });
    const without = generateCSS({ '--sf-color-primary': 'red' }, { banner: false });
    assert.match(withBanner, /SLASHED override tokens/);
    assert.doesNotMatch(without, /SLASHED override tokens/);
  });

  test('banner pluralises correctly', () => {
    const one = generateCSS({ '--sf-color-primary': 'red' });
    const many = generateCSS({ '--sf-color-primary': 'red', '--sf-radius-m': '8px' });
    assert.match(one, /1 token customised/);
    assert.match(many, /2 tokens customised/);
  });

  test('values are sanitised — injection cannot escape the declaration', () => {
    const css = generateCSS({ '--sf-x': '0; } body { display: none } /*' }, { banner: false });
    // The CSS must remain a single, well-formed declaration block. After
    // sanitisation, the entire payload becomes part of the value (text only)
    // and the surrounding `:root { … }` braces stay intact.
    const blocks = css.match(/\}/g) || [];
    const opens = css.match(/\{/g) || [];
    assert.equal(opens.length, blocks.length, 'balanced braces');
    // Exactly one `--sf-x:` declaration emitted.
    assert.equal(css.match(/--sf-x:/g).length, 1);
    // No structural escape characters survive within the value.
    const valueLine = css.split('\n').find((l) => l.includes('--sf-x:'));
    assert.doesNotMatch(valueLine, /\{|\}|;\s*[a-zA-Z]/);
  });
});

describe('parseCSS', () => {
  test('parses bare :root block', () => {
    const out = parseCSS(':root { --sf-color-primary: red; --sf-radius-m: 8px; }');
    assert.equal(out['--sf-color-primary'], 'red');
    assert.equal(out['--sf-radius-m'], '8px');
  });

  test('parses @layer-wrapped block', () => {
    const out = parseCSS('@layer slashed.overrides { :root { --sf-color-primary: red; } }');
    assert.equal(out['--sf-color-primary'], 'red');
  });

  test('strips comment blocks before parsing (does not import commented-out tokens)', () => {
    const out = parseCSS(':root { /* --sf-color-primary: red; */ --sf-radius-m: 8px; }');
    assert.equal(out['--sf-color-primary'], undefined);
    assert.equal(out['--sf-radius-m'], '8px');
  });

  test('keeps clamp() / oklch() / light-dark() values intact (nested parens)', () => {
    const out = parseCSS(':root { --sf-text-l: clamp(1rem, 2vw + 1rem, 3rem); --sf-color: oklch(from var(--x) calc(l * 0.5) c h); }');
    assert.equal(out['--sf-text-l'], 'clamp(1rem, 2vw + 1rem, 3rem)');
    assert.equal(out['--sf-color'], 'oklch(from var(--x) calc(l * 0.5) c h)');
  });

  test('non-sf-* tokens are ignored', () => {
    const out = parseCSS(':root { --my-token: red; --sf-color-primary: blue; }');
    assert.equal(out['--my-token'], undefined);
    assert.equal(out['--sf-color-primary'], 'blue');
  });

  test('empty input → empty result', () => {
    assert.deepEqual(parseCSS(''), {});
    assert.deepEqual(parseCSS(null), {});
  });
});

describe('round-trip generate → parse', () => {
  test('every override survives a generate/parse round trip', () => {
    const overrides = {
      '--sf-color-primary': 'oklch(0.5 0.2 220)',
      '--sf-text-l': 'clamp(1rem, 2vw + 1rem, 3rem)',
      '--sf-radius-m': '8px',
      '--sf-shadow-m': '0 2px 8px rgba(0, 0, 0, 0.12)',
      '--sf-font-body': "system-ui, sans-serif",
    };
    for (const mode of ['layer', 'root']) {
      const css = generateCSS(overrides, { mode });
      const parsed = parseCSS(css);
      assert.deepEqual(parsed, overrides, `round-trip in ${mode} mode`);
    }
  });
});
