/**
 * Unit tests for the light-dark() resolver used by the live preview and the
 * WCAG probes. Pure functions, no DOM — run: node --test tests/lightdark.test.js
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { resolveLightDark, splitTopLevelArgs } from '../src/lib/lightdark.js';

describe('splitTopLevelArgs', () => {
  test('splits only top-level commas', () => {
    assert.deepEqual(splitTopLevelArgs('a, b, c'), ['a', 'b', 'c']);
  });
  test('ignores commas nested in parentheses', () => {
    assert.deepEqual(
      splitTopLevelArgs('var(--a, b), oklch(1 2 3), c'),
      ['var(--a, b)', 'oklch(1 2 3)', 'c']
    );
  });
  test('ignores commas inside quotes', () => {
    assert.deepEqual(splitTopLevelArgs(`'a, b', c`), [`'a, b'`, 'c']);
  });
});

describe('resolveLightDark', () => {
  test('picks the light branch', () => {
    assert.equal(resolveLightDark('light-dark(white, black)', 'light'), 'white');
  });
  test('picks the dark branch', () => {
    assert.equal(resolveLightDark('light-dark(white, black)', 'dark'), 'black');
  });
  test('keeps commas inside a branch intact', () => {
    const v =
      'light-dark(var(--a-light), var(--a-dark, oklch(from var(--a-light) calc(l*0.5) c h)))';
    assert.equal(
      resolveLightDark(v, 'dark'),
      'var(--a-dark, oklch(from var(--a-light) calc(l*0.5) c h))'
    );
  });
  test('resolves light-dark() embedded in a larger expression', () => {
    assert.equal(
      resolveLightDark('oklch(from light-dark(red, blue) l c h)', 'dark'),
      'oklch(from blue l c h)'
    );
  });
  test('resolves nested light-dark() in the chosen branch', () => {
    assert.equal(
      resolveLightDark('light-dark(a, light-dark(b, c))', 'dark'),
      'c'
    );
  });
  test('passes through values without light-dark()', () => {
    assert.equal(resolveLightDark('clamp(1rem, 2vw, 3rem)', 'dark'), 'clamp(1rem, 2vw, 3rem)');
  });
  test('is safe on unbalanced input', () => {
    assert.equal(resolveLightDark('light-dark(a, b', 'dark'), 'light-dark(a, b');
  });
});
