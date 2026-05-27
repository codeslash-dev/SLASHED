import { describe, it, expect, beforeEach } from 'vitest';
import { defaultPrefs, getPrefs, setPrefs } from '../storage.js';

// In Node test env there's no localStorage; install a minimal in-memory
// shim before each test so the storage module exercises its real path.
beforeEach(() => {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => { store.set(k, String(v)); },
    removeItem: (k) => { store.delete(k); },
    clear: () => { store.clear(); },
    key: (i) => Array.from(store.keys())[i] ?? null,
    get length() { return store.size; },
  };
});

describe('defaultPrefs', () => {
  it('returns the documented defaults', () => {
    expect(defaultPrefs()).toEqual({
      syncLabels: true,
      showModifiers: false,
      lastMode: 'add',
    });
  });
});

describe('getPrefs / setPrefs', () => {
  it('returns defaults when nothing is stored', () => {
    expect(getPrefs()).toEqual(defaultPrefs());
  });

  it('round-trips a valid prefs object', () => {
    setPrefs({ syncLabels: false, showModifiers: true, lastMode: 'rename' });
    expect(getPrefs()).toEqual({ syncLabels: false, showModifiers: true, lastMode: 'rename' });
  });

  it('coerces malformed JSON back to defaults on read', () => {
    globalThis.localStorage.setItem('slashed.rebemer.prefs', '{not valid json');
    expect(getPrefs()).toEqual(defaultPrefs());
  });

  it('coerces unknown lastMode back to default', () => {
    setPrefs({ syncLabels: true, showModifiers: false, lastMode: 'bogus' });
    expect(getPrefs().lastMode).toBe('add');
  });

  it('coerces non-boolean fields back to defaults', () => {
    setPrefs({ syncLabels: 'yes', showModifiers: 1, lastMode: 'add' });
    const got = getPrefs();
    expect(got.syncLabels).toBe(true);
    expect(got.showModifiers).toBe(false);
  });

  it('does not throw when localStorage is missing', () => {
    delete globalThis.localStorage;
    expect(() => setPrefs({ lastMode: 'add' })).not.toThrow();
    expect(getPrefs()).toEqual(defaultPrefs());
  });
});
