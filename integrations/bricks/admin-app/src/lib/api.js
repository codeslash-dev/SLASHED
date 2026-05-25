/**
 * Thin REST client for the admin SPA.
 *
 * The PHP side exposes:
 *   POST  /wp-json/slashed-bricks/v1/tokens   - save a section
 *   POST  /wp-json/slashed-bricks/v1/tokens/reset - reset a section or all
 *
 * Auth uses the WP REST nonce (X-WP-Nonce header). The nonce is generated
 * server-side and passed through window.slashedBricksApp.rest.nonce, so
 * every request is automatically scoped to the logged-in admin.
 *
 * In the Vite dev harness rest.url is empty; we just log the payload and
 * resolve so component code can be exercised without a backend.
 */
import { meta } from './stores.svelte.js';

/**
 * Internal POST helper used by `saveSection` / `resetSection`.
 *
 * Stamps the WP REST nonce on every request so WordPress' standard
 * cookie+nonce auth applies — no plugin-specific token plumbing.
 *
 * In the Vite dev harness `meta.rest.url` is empty; we log the payload
 * and resolve a stub result so component code (dirty flag, "Saved" pill)
 * can be exercised end-to-end without a real backend.
 *
 * @param {string} path - REST route relative to `meta.rest.url`.
 * @param {Object} body - JSON payload sent as the request body.
 * @returns {Promise<Object>} Parsed JSON response from the REST controller.
 * @throws {Error} On non-2xx responses; the response body is used as the message.
 */
async function call(path, body) {
  const { url, nonce } = meta.rest;
  if (!url) {
    console.info('[slashed-admin] (dev) would POST', path, body);
    return { ok: true, dev: true };
  }
  const res = await fetch(url + path, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      'X-WP-Nonce': nonce,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}

/**
 * Persist a single section's token map. PHP runs the same sanitizer the
 * legacy form uses, so whatever keys we send here are normalized server
 * side - no need to mirror the sanitization in JS.
 */
export function saveSection(section, values) {
  return call('/tokens', { section, values });
}

/**
 * Reset a single section ('' for all sections). PHP deletes the slice
 * from the wp_option and returns the new effective state.
 */
export function resetSection(section) {
  return call('/tokens/reset', { section });
}
