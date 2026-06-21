/**
 * Shareable configuration links.
 *
 * Encodes the override map (token name -> value) into the URL *fragment* so a
 * whole configuration is shareable / bookmarkable with no backend and no
 * deploy step. The fragment never reaches the server, which keeps the payload
 * private to the link and avoids request-size limits.
 *
 * The wire format is the Guild-Wars-2-style binary config code from codec.js:
 * each token is referenced by a permanent 16-bit id (token-registry.json), and
 * the config is a base64url-packed list of (id, value) pairs. This is inherently
 * future-proof — unknown ids are skipped on decode and missing ids fall back to
 * defaults — so a link minted today keeps working in every later build (exactly
 * like a stale localStorage payload, see store.svelte.js:loadOverrides).
 *
 * The same codec.js + token-registry.json pair is vendored by the SLASHED
 * WordPress plugin so its "Open in Configurator" button mints identical codes.
 *
 * Wire format:  #c=<base64url-config-code>
 */
import { sanitizeValue } from './css.js';
import { tokenByName } from './model.js';
import { encode, decode } from './codec.js';
import registry from '../data/token-registry.generated.json' with { type: 'json' };

/** Fragment key under which the config lives, e.g. `#c=AAE...`. */
export const SHARE_PARAM = 'c';

/**
 * Encode an override map into a URL-fragment-safe config code.
 * Empty / invalid maps encode to '' so callers can treat "nothing to share"
 * uniformly.
 *
 * @param {Record<string, string>} map token name -> value
 * @returns {string} base64url config code, or '' when there is nothing to share
 */
export function encodeOverrides(map) {
  return encode(map, registry);
}

/**
 * Decode a share string back into a validated override map. Unknown tokens are
 * dropped and every value is run through the same sanitizer as a CSS import, so
 * a hand-edited or stale link can never poison the catalogue or inject CSS.
 *
 * Tolerant by design: any malformed input returns an empty map rather than
 * throwing, so a broken `#c=` fragment degrades to "open with defaults".
 *
 * @param {string} encoded the config code (with or without a leading '#c=')
 * @param {{ isKnown?: (name: string) => boolean }} [opts] validator override (tests)
 * @returns {Record<string, string>}
 */
export function decodeOverrides(encoded, opts = {}) {
  const isKnown = opts.isKnown ?? ((name) => tokenByName.has(name));
  let raw = String(encoded ?? '').trim();
  if (raw === '') return {};
  // Accept a full fragment ("#c=...") or a bare payload.
  const fromFragment = raw.match(/[#&]?c=([^&]+)/);
  if (fromFragment) raw = fromFragment[1];
  return decode(raw, registry, { sanitize: sanitizeValue, isKnown });
}

/**
 * Build a shareable absolute URL for the given override map, preserving the
 * page's path + query and replacing only the fragment.
 *
 * @param {Record<string, string>} map
 * @param {string} [base] base URL (defaults to the current location)
 * @returns {string}
 */
export function buildShareUrl(map, base) {
  const href = base ?? (typeof location !== 'undefined' ? location.href : 'https://example.com/');
  const url = new URL(href);
  const encoded = encodeOverrides(map);
  url.hash = encoded ? `${SHARE_PARAM}=${encoded}` : '';
  return url.toString();
}

/**
 * Read and decode a config from a location-like hash string (e.g.
 * `window.location.hash`). Returns an empty map when no config is present.
 *
 * @param {string} hash the raw `location.hash` value
 * @param {{ isKnown?: (name: string) => boolean }} [opts]
 * @returns {Record<string, string>}
 */
export function readShareFromHash(hash, opts = {}) {
  const h = String(hash ?? '');
  if (!h.includes(`${SHARE_PARAM}=`)) return {};
  return decodeOverrides(h, opts);
}
