/**
 * Tests for the WCAG contrast helpers.
 *
 * Pure math; no DOM. The reference values match the worked examples on
 * https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  parseRgb, relativeLuminance, contrastRatio, bestContrastVsBW, wcagLevel, contrastInfo,
} from '../src/lib/contrast.js';

describe('parseRgb', () => {
  test('parses comma-separated rgb()', () => {
    assert.deepEqual(parseRgb('rgb(255, 255, 255)'), { r: 1, g: 1, b: 1, a: 1 });
    assert.deepEqual(parseRgb('rgb(0, 0, 0)'),       { r: 0, g: 0, b: 0, a: 1 });
  });

  test('parses space-separated rgb() (modern getComputedStyle output)', () => {
    const out = parseRgb('rgb(102 51 153)');
    assert.equal(out.r, 102 / 255);
    assert.equal(out.g, 51  / 255);
    assert.equal(out.b, 153 / 255);
    assert.equal(out.a, 1);
  });

  test('parses rgba() with alpha', () => {
    const out = parseRgb('rgba(255, 0, 0, 0.5)');
    assert.equal(out.r, 1);
    assert.equal(out.a, 0.5);
  });

  test('parses space-separated rgb() with slash-alpha', () => {
    const out = parseRgb('rgb(255 0 0 / 0.4)');
    assert.equal(out.r, 1);
    assert.equal(out.a, 0.4);
  });

  test('returns null for non-rgb input', () => {
    assert.equal(parseRgb(''), null);
    assert.equal(parseRgb(null), null);
    assert.equal(parseRgb('oklch(0.5 0.2 220)'), null);
    assert.equal(parseRgb('#fff'), null);
  });
});

describe('relativeLuminance', () => {
  test('white = 1, black = 0 (with float tolerance)', () => {
    assert.ok(Math.abs(relativeLuminance({ r: 1, g: 1, b: 1 }) - 1) < 1e-9);
    assert.ok(Math.abs(relativeLuminance({ r: 0, g: 0, b: 0 })) < 1e-9);
  });

  test('green is brighter than red than blue (per ITU-R BT.709 weights)', () => {
    const lr = relativeLuminance({ r: 1, g: 0, b: 0 });
    const lg = relativeLuminance({ r: 0, g: 1, b: 0 });
    const lb = relativeLuminance({ r: 0, g: 0, b: 1 });
    assert.ok(lg > lr && lr > lb);
  });
});

describe('contrastRatio', () => {
  test('white on black is the maximum 21:1', () => {
    const ratio = contrastRatio(1, 0);
    assert.ok(Math.abs(ratio - 21) < 1e-9);
  });

  test('identical colours have a ratio of 1:1', () => {
    assert.equal(contrastRatio(0.5, 0.5), 1);
  });
});

describe('bestContrastVsBW', () => {
  test('a near-white surface pairs with black text', () => {
    const out = bestContrastVsBW({ r: 0.95, g: 0.95, b: 0.95 });
    assert.equal(out.against, 'black');
    assert.ok(out.ratio > 15);
  });

  test('a near-black surface pairs with white text', () => {
    const out = bestContrastVsBW({ r: 0.05, g: 0.05, b: 0.05 });
    assert.equal(out.against, 'white');
    assert.ok(out.ratio > 15);
  });

  test('mid-grey is roughly equal — picks one but the ratio is small', () => {
    const out = bestContrastVsBW({ r: 0.5, g: 0.5, b: 0.5 });
    assert.ok(out.ratio < 6);
  });
});

describe('wcagLevel', () => {
  test('classifies known thresholds', () => {
    assert.equal(wcagLevel(21).level, 'AAA');
    assert.equal(wcagLevel(7).level, 'AAA');
    assert.equal(wcagLevel(4.5).level, 'AA');
    assert.equal(wcagLevel(3).level, 'AA-L');
    assert.equal(wcagLevel(2.5).level, 'fail');
  });

  test('non-finite ratios fail', () => {
    assert.equal(wcagLevel(NaN).level, 'fail');
    assert.equal(wcagLevel(0).level, 'fail');
  });
});

describe('contrastInfo (one-shot)', () => {
  test('round-trips an rgb() string into a labelled badge', () => {
    const info = contrastInfo('rgb(255 255 255)');
    assert.ok(info);
    assert.equal(info.against, 'black');
    assert.equal(info.level, 'AAA');
    assert.equal(info.ratio, 21);
  });

  test('rejects nearly-transparent colors (ratio is misleading)', () => {
    assert.equal(contrastInfo('rgba(255, 255, 255, 0.1)'), null);
  });

  test('rejects unparseable input', () => {
    assert.equal(contrastInfo(null), null);
    assert.equal(contrastInfo('oklch(0.5 0.2 220)'), null);
  });
});
