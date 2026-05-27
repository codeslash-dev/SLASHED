import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { __ } from '../i18n.js';

const installDict = (dict) => {
  globalThis.window = globalThis.window || {};
  globalThis.window.slashedReBEMer = { i18n: dict };
};

afterEach(() => {
  if (globalThis.window) delete globalThis.window.slashedReBEMer;
});

describe('__: positional grammar', () => {
  beforeEach(() => installDict({}));

  it('returns the key itself when no translation is registered', () => {
    expect(__('hello')).toBe('hello');
  });

  it('substitutes %s in argument order', () => {
    expect(__('Hello %s, you have %d items', 'Sam', 3)).toBe('Hello Sam, you have 3 items');
  });

  it('truncates floats for %d', () => {
    expect(__('n=%d', 3.7)).toBe('n=3');
  });

  it('emits 0 for non-finite %d arg', () => {
    expect(__('n=%d', 'NaN')).toBe('n=0');
  });

  it('emits empty string for missing positional arg', () => {
    expect(__('Hi %s')).toBe('Hi ');
  });
});

describe('__: indexed grammar', () => {
  beforeEach(() => installDict({}));

  it('substitutes %1$s / %2$s by 1-based index', () => {
    expect(__('%2$s before %1$s', 'A', 'B')).toBe('B before A');
  });

  it('substitutes %1$d', () => {
    expect(__('Got %1$d hits', 7)).toBe('Got 7 hits');
  });
});

describe('__: dictionary lookup', () => {
  it('uses the registered translation', () => {
    installDict({ 'rebemer.apply': 'Aplicar' });
    expect(__('rebemer.apply')).toBe('Aplicar');
  });

  it('falls through to key when translation is empty', () => {
    installDict({ 'rebemer.apply': '' });
    expect(__('rebemer.apply')).toBe('rebemer.apply');
  });

  it('returns "" for non-string key', () => {
    expect(__(null)).toBe('');
    expect(__(undefined)).toBe('');
    expect(__(42)).toBe('');
  });
});
