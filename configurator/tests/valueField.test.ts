/**
 * Unit tests for src/lib/valueField.ts — the Inherit/Value/Expression mode
 * detection behind the unified value editor. Pins that an expression override
 * is always classified as an expression (never a fixed value), so the editor
 * shows it verbatim instead of a fallback number.
 */
import { describe, test, expect } from 'vitest';
import { isExpression, detectMode, splitValueUnit } from '../src/lib/valueField';

describe('isExpression', () => {
  test('detects var/calc/clamp/min/max/env', () => {
    expect(isExpression('var(--sf-space-m)')).toBe(true);
    expect(isExpression('calc(1rem + 2px)')).toBe(true);
    expect(isExpression('clamp(1rem, 2vw, 3rem)')).toBe(true);
    expect(isExpression('min(1rem, 2vw)')).toBe(true);
    expect(isExpression('env(safe-area-inset-top)')).toBe(true);
  });
  test('plain literals are not expressions', () => {
    expect(isExpression('1.5rem')).toBe(false);
    expect(isExpression('#ff0000')).toBe(false);
    expect(isExpression('')).toBe(false);
    expect(isExpression(undefined)).toBe(false);
  });
});

describe('detectMode', () => {
  test('undefined → inherit', () => {
    expect(detectMode(undefined)).toBe('inherit');
  });
  test('expression → expression', () => {
    expect(detectMode('var(--sf-space-m)')).toBe('expression');
    expect(detectMode('calc(1rem * 2)')).toBe('expression');
  });
  test('literal → value', () => {
    expect(detectMode('1.5rem')).toBe('value');
    expect(detectMode('Georgia, serif')).toBe('value');
  });
});

describe('splitValueUnit', () => {
  test('splits number and unit', () => {
    expect(splitValueUnit('1.5rem')).toEqual({ num: 1.5, unit: 'rem' });
    expect(splitValueUnit('12px')).toEqual({ num: 12, unit: 'px' });
    expect(splitValueUnit('50%')).toEqual({ num: 50, unit: '%' });
    expect(splitValueUnit('1.25')).toEqual({ num: 1.25, unit: '' });
    expect(splitValueUnit('-3px')).toEqual({ num: -3, unit: 'px' });
  });
  test('non-numeric values yield null', () => {
    expect(splitValueUnit('Georgia').num).toBeNull();
    expect(splitValueUnit('var(--sf-x)').num).toBeNull();
  });
});
