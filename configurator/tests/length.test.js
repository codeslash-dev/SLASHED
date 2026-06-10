/**
 * Tests for the length parser/formatter that drives the slider editor.
 *
 * Pure JS; runs under `node --test` with no DOM.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { parseLength, boundsFor, formatLength, clamp, decimalsFor } from '../src/lib/length.js';

describe('parseLength', () => {
  test('handles common unit + magnitude pairs', () => {
    assert.deepEqual(parseLength('8px'),    { number: 8,    unit: 'px'   });
    assert.deepEqual(parseLength('1.25rem'),{ number: 1.25, unit: 'rem'  });
    assert.deepEqual(parseLength('200ms'),  { number: 200,  unit: 'ms'   });
    assert.deepEqual(parseLength('100%'),   { number: 100,  unit: '%'    });
    assert.deepEqual(parseLength('-0.5em'), { number: -0.5, unit: 'em'   });
  });

  test('accepts a unitless number', () => {
    assert.deepEqual(parseLength('1.4'), { number: 1.4, unit: '' });
    assert.deepEqual(parseLength(0.5),   { number: 0.5, unit: '' });
  });

  test('lower-cases the unit so callers can compare it directly', () => {
    assert.deepEqual(parseLength('16PX'), { number: 16, unit: 'px' });
  });

  test('tolerates surrounding whitespace', () => {
    assert.deepEqual(parseLength('  8px  '), { number: 8, unit: 'px' });
  });

  test('rejects calc() / clamp() / var() / multi-token expressions', () => {
    assert.equal(parseLength('calc(8px * var(--x))'), null);
    assert.equal(parseLength('clamp(1rem, 2vw + 1rem, 3rem)'), null);
    assert.equal(parseLength('var(--sf-radius-m)'), null);
    assert.equal(parseLength('1px solid red'), null);
    assert.equal(parseLength('1px 2px 3px'), null);
  });

  test('null-safe', () => {
    assert.equal(parseLength(null), null);
    assert.equal(parseLength(undefined), null);
    assert.equal(parseLength(''), null);
  });
});

describe('boundsFor', () => {
  test('returns sensible bounds for known units', () => {
    assert.deepEqual(boundsFor('px'),  { min: 0, max: 64,    step: 1     });
    assert.deepEqual(boundsFor('rem'), { min: 0, max: 8,     step: 0.05  });
    assert.deepEqual(boundsFor('ms'),  { min: 0, max: 2000,  step: 25    });
    assert.deepEqual(boundsFor('s'),   { min: 0, max: 10,    step: 0.05  });
  });

  test('case-insensitive', () => {
    assert.deepEqual(boundsFor('PX'), boundsFor('px'));
  });

  test('falls back to a permissive numeric range for unknown units', () => {
    const fallback = boundsFor('blorp');
    assert.equal(fallback.min, 0);
    assert.ok(fallback.max > 0);
    assert.ok(fallback.step > 0);
  });

  test('returns a fresh object so callers can mutate without trashing the table', () => {
    const a = boundsFor('px');
    const b = boundsFor('px');
    assert.notEqual(a, b);
    a.max = 999;
    assert.equal(b.max, 64);
  });
});

describe('formatLength', () => {
  test('rounds away floating-point fluff', () => {
    assert.equal(formatLength(1.2000000001, 'rem'), '1.2rem');
    assert.equal(formatLength(8, 'px'), '8px');
  });

  test('omits the unit for unitless numbers', () => {
    assert.equal(formatLength(1.4, ''), '1.4');
    assert.equal(formatLength(2), '2');
  });

  test('returns empty for non-finite input', () => {
    assert.equal(formatLength(NaN, 'px'), '');
    assert.equal(formatLength(Infinity, 'px'), '');
  });
});

describe('clamp', () => {
  test('clamps within bounds', () => {
    const b = { min: 0, max: 10 };
    assert.equal(clamp(-1, b), 0);
    assert.equal(clamp(5, b), 5);
    assert.equal(clamp(11, b), 10);
  });
});

describe('decimalsFor', () => {
  test('counts decimals on the slider step', () => {
    assert.equal(decimalsFor(1), 0);
    assert.equal(decimalsFor(0.5), 1);
    assert.equal(decimalsFor(0.05), 2);
    assert.equal(decimalsFor(0.001), 3);
  });
});
