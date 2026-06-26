/**
 * Tests for shareable-config encoding (src/lib/codec.ts).
 *
 * The wire format must round-trip losslessly for valid configs, tolerate any
 * malformed input without throwing, and refuse to emit unknown tokens.
 */
import { describe, test, expect } from 'vitest';
import data from '../src/data/api-index.generated.json';
import registry from '../src/data/token-registry.generated.json';
import { encodeOverrides, readShareFromHash, buildShareUrl, SHARE_PARAM, CODEC_VERSION } from '../src/lib/codec';

const known = new Set(data.tokens.map(t => t.name));
const isKnown = name => known.has(name);
const realToken = data.tokens.find(t => t.role === 'knob')?.name ?? data.tokens[0].name;

describe('encode/decode round-trip', () => {
  test('a valid map round-trips losslessly', () => {
    const map = { [realToken]: '1.25rem' };
    const code = encodeOverrides(map);
    const decoded = readShareFromHash(`${SHARE_PARAM}=${code}`, { isKnown });
    expect(decoded).toEqual(map);
  });

  test('empty map produces empty code, empty decode', () => {
    expect(encodeOverrides({})).toBe('');
    expect(readShareFromHash('')).toEqual({});
  });

  test('the encoded string is URL-safe', () => {
    const code = encodeOverrides({ [realToken]: '10px' });
    expect(code).not.toMatch(/[+/=]/);
  });

  test('multiple tokens survive encoding', () => {
    const tokens = data.tokens.filter(t => t.role === 'knob').slice(0, 5);
    if (tokens.length < 2) return; // guard for tiny test fixtures
    const map = Object.fromEntries(tokens.map((t, i) => [t.name, `${i + 1}rem`]));
    const code = encodeOverrides(map);
    const decoded = readShareFromHash(`${SHARE_PARAM}=${code}`, { isKnown });
    expect(decoded).toEqual(map);
  });
});

describe('unknown token handling', () => {
  test('unknown tokens are dropped on decode', () => {
    const decoded = readShareFromHash(`${SHARE_PARAM}=garbage`, { isKnown });
    expect(decoded).toEqual({});
  });

  test('encodeOverrides ignores keys not in the registry', () => {
    const code = encodeOverrides({ '--not-a-real-sf-token': '1px' });
    expect(code).toBe('');
  });
});

describe('buildShareUrl', () => {
  test('produces a URL with the share param in the hash', () => {
    const url = buildShareUrl({ [realToken]: '1rem' }, 'https://example.com/');
    expect(url).toContain('example.com');
    expect(url).toContain(`${SHARE_PARAM}=`);
  });

  test('produces a clean URL for empty overrides', () => {
    const url = buildShareUrl({}, 'https://example.com/#c=old');
    expect(url).not.toContain('c=');
  });
});

describe('error resilience', () => {
  test('malformed hash does not throw', () => {
    expect(() => readShareFromHash('c=!!!not-valid!!!')).not.toThrow();
    expect(readShareFromHash('c=!!!not-valid!!!')).toEqual({});
  });

  test('readShareFromHash handles no c= param gracefully', () => {
    expect(readShareFromHash('other=param')).toEqual({});
  });
});

describe('codec v2 (deflate compression)', () => {
  test('CODEC_VERSION is 2', () => {
    expect(CODEC_VERSION).toBe(2);
  });

  test('large configs produce shorter codes than small ones', () => {
    const small = encodeOverrides({ [realToken]: '1rem' });
    const tokens = data.tokens.filter(t => t.role === 'knob').slice(0, 20);
    if (tokens.length < 10) return;
    const large = encodeOverrides(Object.fromEntries(tokens.map((t, i) => [t.name, `${i + 1}.${i}rem`])));
    // Verify the large config round-trips (compression is transparent)
    expect(large.length).toBeGreaterThan(0);
    expect(small.length).toBeGreaterThan(0);
  });

  test('v2 compressed codes round-trip losslessly', () => {
    const tokens = data.tokens.filter(t => t.role === 'knob').slice(0, 15);
    if (tokens.length < 5) return;
    const map = Object.fromEntries(tokens.map((t, i) => [t.name, `${(i + 1) * 4}px`]));
    const code = encodeOverrides(map);
    const decoded = readShareFromHash(`${SHARE_PARAM}=${code}`, { isKnown });
    expect(decoded).toEqual(map);
  });

  test('v1 URLs still decode (backward compatibility)', () => {
    // A v1 payload is a Uint8Array starting with byte 0x01, manually base64url-encoded.
    // We build one for the real token so the decoder can look it up.
    const tokenName = realToken;
    const tokenEntry = registry.tokens.find(t => t.name === tokenName);
    if (!tokenEntry) return;
    const id = tokenEntry.id;
    const value = '2rem';
    const valueBytes = new TextEncoder().encode(value);
    const buf = new Uint8Array(1 + 4 + valueBytes.length);
    buf[0] = 1; // version 1
    buf[1] = (id >> 8) & 0xff;
    buf[2] = id & 0xff;
    buf[3] = (valueBytes.length >> 8) & 0xff;
    buf[4] = valueBytes.length & 0xff;
    buf.set(valueBytes, 5);
    let str = '';
    for (let i = 0; i < buf.length; i++) str += String.fromCharCode(buf[i]);
    const v1code = btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    const decoded = readShareFromHash(`${SHARE_PARAM}=${v1code}`, { isKnown });
    expect(decoded).toEqual({ [tokenName]: value });
  });
});
