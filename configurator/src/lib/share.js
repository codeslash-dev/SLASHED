/**
 * Shareable configuration links.
 *
 * Encodes the override map (token name -> value) into the URL *fragment* so a
 * whole configuration is shareable / bookmarkable with no backend and no
 * deploy step. The fragment never reaches the server, which keeps the payload
 * private to the link and avoids request-size limits.
 *
 * The payload is the same name->value map the rest of the app uses, so it is
 * inherently future-proof: when the framework adds, renames, or removes tokens
 * the link format does not change — unknown keys are simply dropped on decode
 * (exactly like a stale localStorage payload, see store.svelte.js:loadOverrides).
 *
 * Wire format:  #c=<schemaVersion>.<lz-string-compressed-json>
 *   - schemaVersion lets us evolve the container later without silently
 *     misreading old links.
 *   - compression is lz-string's URL-safe variant, so the value is already a
 *     valid URI component (no extra encodeURIComponent needed).
 */
// lz-string ships as CommonJS; import the default and destructure so this works
// under both Vite (interop) and Node's native ESM (used by `node --test`).
import lzString from 'lz-string';
import { sanitizeValue } from './css.js';
import { tokenByName } from './model.js';

const { compressToEncodedURIComponent, decompressFromEncodedURIComponent } = lzString;

/** Fragment key under which the config lives, e.g. `#c=1.NoE...`. */
export const SHARE_PARAM = 'c';
/** Bumped only if the container format (not the token set) changes. */
export const SHARE_SCHEMA = '1';

/**
 * Compress an override map into a URL-fragment-safe string.
 * Empty / invalid maps encode to '' so callers can treat "nothing to share"
 * uniformly.
 *
 * @param {Record<string, string>} map token name -> value
 * @returns {string} `<schema>.<compressed>` or '' when there is nothing to share
 */
export function encodeOverrides(map) {
  if (!map || typeof map !== 'object') return '';
  const clean = {};
  for (const [k, v] of Object.entries(map)) {
    if (typeof k === 'string' && typeof v === 'string' && v !== '') clean[k] = v;
  }
  if (Object.keys(clean).length === 0) return '';
  const json = JSON.stringify(clean);
  return `${SHARE_SCHEMA}.${compressToEncodedURIComponent(json)}`;
}

/**
 * Decode a share string back into a validated override map. Unknown tokens are
 * dropped and every value is run through the same sanitizer as a CSS import, so
 * a hand-edited or stale link can never poison the catalogue or inject CSS.
 *
 * Tolerant by design: any malformed input returns an empty map rather than
 * throwing, so a broken `#c=` fragment degrades to "open with defaults".
 *
 * @param {string} encoded `<schema>.<compressed>` (with or without a leading '#c=')
 * @param {{ isKnown?: (name: string) => boolean }} [opts] validator override (tests)
 * @returns {Record<string, string>}
 */
export function decodeOverrides(encoded, opts = {}) {
  const isKnown = opts.isKnown ?? ((name) => tokenByName.has(name));
  try {
    let raw = String(encoded ?? '').trim();
    if (raw === '') return {};
    // Accept a full fragment ("#c=...") or a bare payload.
    const fromFragment = raw.match(/[#&]?c=([^&]+)/);
    if (fromFragment) raw = fromFragment[1];
    // Strip the schema prefix; reject unknown schema versions.
    const dot = raw.indexOf('.');
    if (dot === -1) return {};
    const schema = raw.slice(0, dot);
    if (schema !== SHARE_SCHEMA) return {};
    const payload = raw.slice(dot + 1);
    const json = decompressFromEncodedURIComponent(payload);
    if (!json) return {};
    const parsed = JSON.parse(json);
    if (!parsed || typeof parsed !== 'object') return {};
    const clean = {};
    for (const [k, v] of Object.entries(parsed)) {
      if (typeof k !== 'string' || typeof v !== 'string') continue;
      if (!isKnown(k)) continue;
      const safe = sanitizeValue(v);
      if (safe !== '') clean[k] = safe;
    }
    return clean;
  } catch {
    return {};
  }
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
