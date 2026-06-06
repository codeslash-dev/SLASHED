/**
 * Unit tests for scripts/verify-color-tokens.js
 * Run: node --test tests/verify-color-tokens.test.js
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs   from 'node:fs';
import path from 'node:path';
import { verify, SOURCE_TOKENS, readValue } from '../scripts/verify-color-tokens.js';

const ROOT = path.resolve(import.meta.dirname, '..');

// ── readValue helper ──────────────────────────────────────────────────────────

describe('readValue', () => {
  test('reads a simple value', () => {
    const css = '--foo: oklch(0.5 0.2 264);';
    const colon = css.indexOf(':');
    assert.equal(readValue(css, colon), 'oklch(0.5 0.2 264)');
  });

  test('handles nested parentheses in oklch(from…)', () => {
    const css = '--foo: oklch(from red clamp(0.1, calc(l - 0.4), 0.9) c h);';
    const colon = css.indexOf(':');
    const val = readValue(css, colon);
    assert.ok(val.startsWith('oklch(from red'));
    assert.ok(val.includes('clamp'));
  });

  test('handles light-dark() spanning multiple levels', () => {
    const css = '--foo: light-dark(oklch(0.47 0.27 264), oklch(0.75 0.18 264));';
    const colon = css.indexOf(':');
    const val = readValue(css, colon);
    assert.ok(val.startsWith('light-dark('));
    assert.ok(val.endsWith(')'));
  });
});

// ── SOURCE_TOKENS list ────────────────────────────────────────────────────────

describe('SOURCE_TOKENS', () => {
  test('has 11 entries', () => {
    assert.equal(SOURCE_TOKENS.length, 11);
  });

  test('contains all brand tokens', () => {
    const brands = ['primary', 'secondary', 'tertiary', 'action', 'neutral', 'base'];
    for (const b of brands) {
      assert.ok(SOURCE_TOKENS.includes(`--sf-color-${b}-light`), `missing ${b}-light`);
    }
  });

  test('contains all status tokens', () => {
    const statuses = ['success', 'warning', 'error', 'info', 'danger'];
    for (const s of statuses) {
      assert.ok(SOURCE_TOKENS.includes(`--sf-color-${s}-light`), `missing ${s}-light`);
    }
  });
});

// ── verify() against the real tokens.css ──────────────────────────────────────

describe('verify() against core/tokens.css', () => {
  let result;

  test('runs without throwing', () => {
    result = verify();
  });

  test('returns all 11 tokens', () => {
    assert.equal(result.tokens.length, 11);
  });

  test('all 11 tokens have a value', () => {
    for (const r of result.tokens) {
      assert.ok(r.value, `${r.name} has no value`);
    }
  });

  test('all 11 tokens classified (not MISSING)', () => {
    for (const r of result.tokens) {
      assert.notEqual(r.classification, 'MISSING', `${r.name} is MISSING`);
    }
  });

  test('returns both dark-derivation formulas', () => {
    assert.ok(result.darkFormulas.brandStatus, 'brandStatus formula missing');
    assert.ok(result.darkFormulas.surface, 'surface formula missing');
  });

  test('records color-mix() ratios including 4, 20, 65, 82', () => {
    for (const r of [4, 20, 65, 82]) {
      assert.ok(result.colorMixRatios.includes(r), `ratio ${r}% missing`);
    }
  });

  test('records alpha values including 0.10, 0.12, 0.28, 0.30', () => {
    for (const a of [0.10, 0.12, 0.28, 0.30]) {
      assert.ok(
        result.alphaValues.some(v => Math.abs(v - a) < 0.001),
        `alpha ${a} missing`
      );
    }
  });

  test('all tokens with both @property and :root have matching values (replayOk)', () => {
    for (const r of result.tokens) {
      if (r.classification === 'both @property and :root') {
        assert.ok(r.replayOk, `${r.name} has mismatched @property vs :root values`);
      }
    }
  });
});

// ── verify() with a fixture CSS that has a missing token ──────────────────────

describe('verify() halts on missing token', () => {
  test('exits 1 if source token is absent', () => {
    // Temporarily patch process.exit to capture it
    let exitCode = null;
    const origExit = process.exit;
    process.exit = (code) => { exitCode = code; throw new Error(`EXIT:${code}`); };
    try {
      // Write a minimal CSS fixture with only 10 tokens
      const tmpFile = path.join(ROOT, 'tests/fixtures/tokens-missing.css');
      fs.mkdirSync(path.dirname(tmpFile), { recursive: true });
      const css = SOURCE_TOKENS.slice(0, 10).map(t =>
        `@property ${t} { syntax: "<color>"; inherits: true; initial-value: oklch(0.5 0.1 264); }`
      ).join('\n');
      fs.writeFileSync(tmpFile, css, 'utf8');
      verify('tests/fixtures/tokens-missing.css');
    } catch (e) {
      assert.equal(exitCode, 1);
    } finally {
      process.exit = origExit;
    }
  });
});
