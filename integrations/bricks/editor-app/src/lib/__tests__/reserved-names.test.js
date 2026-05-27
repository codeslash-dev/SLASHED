import { describe, it, expect } from 'vitest';
import { isReserved } from '../reserved-names.js';
import { defaultPolicy, readPolicy } from '../policy.js';

const p = defaultPolicy();

describe('isReserved', () => {
  it('returns reserved:false for safe names', () => {
    expect(isReserved('card', p).reserved).toBe(false);
    expect(isReserved('site-header', p).reserved).toBe(false);
  });

  it('flags CSS keywords with reason cssKeyword', () => {
    for (const k of ['auto', 'inherit', 'initial', 'unset', 'revert', 'none', 'currentcolor']) {
      expect(isReserved(k, p)).toEqual({ reserved: true, reason: 'cssKeyword' });
    }
  });

  it('flags entries in policy.reservedExact', () => {
    const policy = readPolicy({ reservedExact: ['brand', 'logo'] });
    expect(isReserved('brand', policy)).toEqual({ reserved: true, reason: 'reservedExact' });
    expect(isReserved('logo', policy)).toEqual({ reserved: true, reason: 'reservedExact' });
    expect(isReserved('card', policy).reserved).toBe(false);
  });

  it('flags names starting with policy.reservedPrefixes', () => {
    expect(isReserved('sf-grid', p)).toEqual({ reserved: true, reason: 'reservedPrefix' });
    expect(isReserved('is-active', p)).toEqual({ reserved: true, reason: 'reservedPrefix' });
  });

  it('returns false for empty / null / non-string input', () => {
    expect(isReserved('', p).reserved).toBe(false);
    expect(isReserved(null, p).reserved).toBe(false);
    expect(isReserved(123, p).reserved).toBe(false);
  });

  it('checks cssKeyword before policy lists', () => {
    const policy = readPolicy({ reservedExact: ['auto'] });
    // both checks would flag; cssKeyword wins by check order.
    expect(isReserved('auto', policy).reason).toBe('cssKeyword');
  });
});
