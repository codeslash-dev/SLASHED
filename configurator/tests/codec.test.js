/**
 * Tests for the binary config codec (src/lib/codec.ts).
 *
 * Contract: round-trip losslessly for known tokens, stay URL-safe (base64url,
 * no padding), skip ids the registry doesn't know (forward-compat) and ids
 * flagged removed, and never throw on malformed / truncated input.
 */
import { describe, test, expect } from 'vitest';
import registry from '../src/data/token-registry.generated.json';
import { encode, decode, CODEC_VERSION } from '../src/lib/codec';

const active = registry.tokens.filter(t => !t.removed);
const t0 = active[0].name;
const t1 = active[1].name;
const t2 = active[2].name;

describe('encode/decode round-trip', () => {
  test('a single token round-trips', () => {
    const map = { [t0]: '1.25rem' };
    expect(decode(encode(map, registry), registry)).toEqual(map);
  });

  test('multi-token maps survive (incl. unicode values)', () => {
    const map = { [t0]: '10px', [t1]: 'oklch(0.7 0.1 200)', [t2]: 'café—wide' };
    expect(decode(encode(map, registry), registry)).toEqual(map);
  });

  test('encoding is deterministic regardless of key order', () => {
    const a = encode({ [t0]: '1px', [t1]: '2px' }, registry);
    const b = encode({ [t1]: '2px', [t0]: '1px' }, registry);
    expect(a).toBe(b);
  });

  test('empty map encodes to empty string, decodes back empty', () => {
    expect(encode({}, registry)).toBe('');
    expect(decode('', registry)).toEqual({});
  });

  test('encoded string is URL-safe (no +, /, =)', () => {
    const code = encode({ [t0]: '1rem', [t1]: '2rem' }, registry);
    expect(code).not.toMatch(/[+/=]/);
  });
});

describe('forward compatibility', () => {
  test('tokens absent from the registry are silently dropped on decode', () => {
    const ghostRegistry = {
      tokens: [{ id: 99999, name: '--sf-ghost', removed: false }],
    };
    const code = encode({ '--sf-ghost': '1rem' }, ghostRegistry);
    // Decode with the real registry — token unknown, should be empty
    expect(decode(code, registry)).toEqual({});
  });

  test('removed tokens are skipped during encode', () => {
    const removedRegistry = {
      tokens: [{ id: active[0].id, name: t0, removed: true }],
    };
    expect(encode({ [t0]: '1rem' }, removedRegistry)).toBe('');
  });

  test('removed-token ids are dropped during decode (legacy share codes)', () => {
    // A legacy share code minted while the token was still live…
    const liveRegistry = {
      tokens: [{ id: active[0].id, name: t0, removed: false }],
    };
    const code = encode({ [t0]: '1rem' }, liveRegistry);
    // …must not rehydrate a no-op override once the registry flags it removed.
    const removedRegistry = {
      tokens: [{ id: active[0].id, name: t0, removed: true }],
    };
    expect(decode(code, removedRegistry)).toEqual({});
  });

  test('a renamed token keeps its id, so legacy codes rehydrate the new name', () => {
    // A token rename must reuse the SAME registry id (an in-place name update),
    // not tombstone the old id + mint a new one — otherwise every share code
    // minted before the rename silently loses that override on decode. Simulate
    // a legacy code that encoded the override under the old name at some id…
    const OLD_ID = 53;
    const oldRegistry = { tokens: [{ id: OLD_ID, name: '--sf-caret-color', removed: false }] };
    const legacyCode = encode({ '--sf-caret-color': 'red' }, oldRegistry);
    // …then decode it against the renamed registry (same id, new name): the
    // saved value must reappear under the new token name, not vanish.
    const renamedRegistry = { tokens: [{ id: OLD_ID, name: '--sf-color-caret', removed: false }] };
    expect(decode(legacyCode, renamedRegistry)).toEqual({ '--sf-color-caret': 'red' });

    // And the shipped registry must actually preserve that id for the real
    // rename this guards (#677): id 53 is live as --sf-color-caret, never
    // tombstoned + re-minted.
    const caret = registry.tokens.find((t) => t.name === '--sf-color-caret');
    expect(caret).toBeDefined();
    expect(caret.id).toBe(53);
    expect(caret.removed).toBeFalsy();
    expect(registry.tokens.some((t) => t.name === '--sf-caret-color')).toBe(false);
  });
});

describe('error resilience', () => {
  test('malformed base64 decodes to empty map without throwing', () => {
    expect(decode('!!!not-base64!!!', registry)).toEqual({});
  });

  test('truncated payload decodes to empty map without throwing', () => {
    // 1-byte payload (version byte only, no entries)
    const truncated = btoa(String.fromCharCode(1)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    expect(decode(truncated, registry)).toEqual({});
  });

  test('unknown version byte decodes to empty map', () => {
    const badVersion = btoa(String.fromCharCode(99)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    expect(decode(badVersion, registry)).toEqual({});
  });
});

describe('CODEC_VERSION', () => {
  test('is 2', () => {
    expect(CODEC_VERSION).toBe(2);
  });
});
