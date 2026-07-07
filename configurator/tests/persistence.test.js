/**
 * Tests for the persistence seam (src/lib/persistence.ts).
 *
 * Contract: standalone mode reads/writes localStorage + URL hash; WP-embedded
 * mode (window.slashedApp present) reads PHP-hydrated overrides and writes via
 * REST. Covers both branches of loadInitialOverrides/saveOverrides, including
 * the malformed-localStorage edge cases fixed by SL-019 (shape-guarded via
 * savedThemes.ts's isStringRecord()).
 */
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import registry from '../src/data/token-registry.generated.json';
import { encodeOverrides } from '../src/lib/codec';
import { loadInitialOverrides, saveOverrides, isEmbedded, hasWpBoot, getShareBaseUrl } from '../src/lib/persistence';

const LS_KEY = 'slashed-studio/overrides/v2';
const active = registry.tokens.filter((t) => !t.removed);
const t0 = active[0].name;
const t1 = active[1].name;

function resetEnv() {
  localStorage.clear();
  window.location.hash = '';
  delete window.slashedApp;
  vi.unstubAllGlobals();
}

beforeEach(resetEnv);
afterEach(resetEnv);

describe('loadInitialOverrides — WP-embedded mode', () => {
  test('returns a copy of window.slashedApp.overrides when present', () => {
    const boot = { overrides: { [t0]: '1rem' } };
    window.slashedApp = boot;
    const result = loadInitialOverrides();
    expect(result).toEqual({ [t0]: '1rem' });
    expect(result).not.toBe(boot.overrides); // copy, not the same reference
  });

  test('returns {} when slashedApp is present but overrides is missing', () => {
    window.slashedApp = { rest: { url: '/wp-json/slashed/v1' } };
    expect(loadInitialOverrides()).toEqual({});
  });

  test('returns {} (not the stale array) when overrides is an array, ignoring any hash/localStorage', () => {
    localStorage.setItem(LS_KEY, JSON.stringify({ [t0]: 'should-not-be-used' }));
    window.slashedApp = { overrides: [] };
    expect(loadInitialOverrides()).toEqual({});
  });

  test('does not fall through to localStorage when embedded, even with no overrides', () => {
    localStorage.setItem(LS_KEY, JSON.stringify({ [t0]: 'should-not-be-used' }));
    window.slashedApp = {};
    expect(loadInitialOverrides()).toEqual({});
  });
});

describe('loadInitialOverrides — standalone mode', () => {
  test('reads a shareable config from the URL hash, taking priority over localStorage', () => {
    localStorage.setItem(LS_KEY, JSON.stringify({ [t1]: 'from-local-storage' }));
    const code = encodeOverrides({ [t0]: '2rem' });
    window.location.hash = `c=${code}`;
    expect(loadInitialOverrides()).toEqual({ [t0]: '2rem' });
  });

  test('falls back to localStorage when the hash has no c= param', () => {
    localStorage.setItem(LS_KEY, JSON.stringify({ [t1]: '3rem' }));
    window.location.hash = '';
    expect(loadInitialOverrides()).toEqual({ [t1]: '3rem' });
  });

  test('an undecodable hash wins over localStorage and resolves to {} (codec never throws)', () => {
    // readShareFromHashIfPresent/decode swallow malformed input internally and
    // return {} rather than throwing (see share.test.js), so the try/catch in
    // loadInitialOverrides never actually triggers its localStorage fallback
    // for a garbage — as opposed to absent — c= param.
    localStorage.setItem(LS_KEY, JSON.stringify({ [t1]: '4rem' }));
    window.location.hash = 'c=!!!not-valid-base64!!!';
    expect(loadInitialOverrides()).toEqual({});
  });

  test('returns {} when there is neither a hash nor localStorage data', () => {
    expect(loadInitialOverrides()).toEqual({});
  });

  test('returns {} when localStorage holds malformed JSON', () => {
    localStorage.setItem(LS_KEY, '{not json');
    expect(loadInitialOverrides()).toEqual({});
  });

  // SL-019: loadInitialOverrides' standalone/localStorage path now reuses
  // savedThemes.ts's isStringRecord() shape guard, matching that module's
  // equivalent read path, instead of trusting JSON.parse's result outright.
  test('SL-019: returns {} for non-object JSON instead of passing it through', () => {
    localStorage.setItem(LS_KEY, JSON.stringify(['not', 'an', 'object']));
    expect(loadInitialOverrides()).toEqual({});
  });

  test('SL-019: returns {} when a value in the stored record is not a string', () => {
    localStorage.setItem(LS_KEY, JSON.stringify({ [t0]: '5rem', [t1]: 42 }));
    expect(loadInitialOverrides()).toEqual({});
  });
});

describe('saveOverrides — standalone mode', () => {
  test('writes overrides to localStorage and encodes them into the URL hash', () => {
    const ov = { [t0]: '5rem' };
    return saveOverrides(ov).then(() => {
      expect(JSON.parse(localStorage.getItem(LS_KEY))).toEqual(ov);
      expect(window.location.hash).toBe(`#c=${encodeOverrides(ov)}`);
    });
  });

  test('clears the hash when saving an empty overrides map', async () => {
    window.location.hash = `c=${encodeOverrides({ [t0]: '1rem' })}`;
    await saveOverrides({});
    expect(window.location.hash).toBe('');
  });
});

describe('saveOverrides — WP-embedded (REST) mode', () => {
  test('POSTs to <rest.url>/tokens/overrides with the nonce header and overrides body', async () => {
    window.slashedApp = { rest: { url: `${window.location.origin}/wp-json/slashed/v1`, nonce: 'abc123' } };
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200, statusText: 'OK' });
    vi.stubGlobal('fetch', fetchMock);

    const ov = { [t0]: '6rem' };
    await saveOverrides(ov);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(`${window.location.origin}/wp-json/slashed/v1/tokens/overrides`);
    expect(init.method).toBe('POST');
    expect(init.headers['X-WP-Nonce']).toBe('abc123');
    expect(JSON.parse(init.body)).toEqual({ overrides: ov });
    // REST save must never touch localStorage/hash — that's the standalone path only.
    expect(localStorage.getItem(LS_KEY)).toBeNull();
  });

  test('rejects when the REST response is not ok', async () => {
    window.slashedApp = { rest: { url: `${window.location.origin}/wp-json/slashed/v1`, nonce: 'abc123' } };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500, statusText: 'Internal Server Error' }));

    await expect(saveOverrides({ [t0]: '7rem' })).rejects.toThrow(/save failed 500/);
  });

  test('rejects before fetching when the REST URL is cross-origin', async () => {
    window.slashedApp = { rest: { url: 'https://evil.example.com/wp-json/slashed/v1', nonce: 'abc123' } };
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await expect(saveOverrides({ [t0]: '8rem' })).rejects.toThrow(/same-origin/);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('isEmbedded / hasWpBoot', () => {
  test('both false in standalone mode', () => {
    expect(isEmbedded()).toBe(false);
    expect(hasWpBoot()).toBe(false);
  });

  test('hasWpBoot is true but isEmbedded is false when slashedApp has no rest.url', () => {
    window.slashedApp = { overrides: {} };
    expect(hasWpBoot()).toBe(true);
    expect(isEmbedded()).toBe(false);
  });

  test('both true when slashedApp has a rest.url', () => {
    window.slashedApp = { rest: { url: '/wp-json/slashed/v1' } };
    expect(hasWpBoot()).toBe(true);
    expect(isEmbedded()).toBe(true);
  });
});

describe('getShareBaseUrl', () => {
  test('returns undefined in standalone mode (no host boot)', () => {
    expect(getShareBaseUrl()).toBeUndefined();
  });

  test('returns undefined when configurator_url is absent or blank', () => {
    window.slashedApp = { pluginSettings: {} };
    expect(getShareBaseUrl()).toBeUndefined();
    window.slashedApp = { pluginSettings: { configurator_url: '   ' } };
    expect(getShareBaseUrl()).toBeUndefined();
  });

  test('returns a valid absolute http(s) configurator_url', () => {
    window.slashedApp = { pluginSettings: { configurator_url: 'https://slashed.codeslash.dev/configurator/' } };
    expect(getShareBaseUrl()).toBe('https://slashed.codeslash.dev/configurator/');
  });

  test('rejects a relative/malformed configurator_url so buildShareUrl can fall back', () => {
    window.slashedApp = { pluginSettings: { configurator_url: '/configurator' } };
    expect(getShareBaseUrl()).toBeUndefined();
  });

  test('rejects a non-http(s) scheme (e.g. javascript:) that must never be copied as a link', () => {
    window.slashedApp = { pluginSettings: { configurator_url: 'javascript:alert(1)' } };
    expect(getShareBaseUrl()).toBeUndefined();
  });
});
