/**
 * Persisted UI preferences (mode / domain / output format).
 *
 * Pure, runes-free validation so it is unit-testable under node:test —
 * the same pattern as loadOverrides(): localStorage content is untrusted
 * (older app versions, hand edits, corruption), so everything is checked
 * against the live taxonomy before it reaches the ui store.
 */
import { DOMAIN_BY_ID } from './domains.js';
import { BUNDLE_ORDER } from './bundles.js';

export const UI_STORAGE_KEY = 'slashed-configurator/ui/v1';

/**
 * Validate a raw localStorage payload into a partial ui-state patch.
 * Unknown / invalid fields are dropped; an unknown domain id is dropped too
 * (the App-level fallback would bounce it anyway, but a clean restore avoids
 * a visible redirect flash). A legacy `mode` field from older app versions is
 * simply ignored — the flat IA has no complexity mode.
 *
 * @param {string|null} raw JSON string from localStorage (or null)
 * @returns {{ domain?: string, outputMode?: 'layer'|'root' }}
 */
export function sanitiseUiState(raw) {
  const out = {};
  if (typeof raw !== 'string' || raw === '') return out;
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return out;
  }
  if (!parsed || typeof parsed !== 'object') return out;

  const domain = parsed.domain;
  if (typeof domain === 'string' && (domain === 'home' || DOMAIN_BY_ID.has(domain))) {
    out.domain = domain;
  }

  if (parsed.outputMode === 'layer' || parsed.outputMode === 'root') {
    out.outputMode = parsed.outputMode;
  }

  if (parsed.uiTheme === 'light' || parsed.uiTheme === 'dark') {
    out.uiTheme = parsed.uiTheme;
  }

  if (typeof parsed.bundle === 'string' && BUNDLE_ORDER.includes(parsed.bundle)) {
    out.bundle = parsed.bundle;
  }

  return out;
}
