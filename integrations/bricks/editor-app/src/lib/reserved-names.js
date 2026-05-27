/**
 * Reserved-name guard.
 *
 * Backed by policy.reservedExact and policy.reservedPrefixes (which
 * the server hydrates from data/inventory.json). The same list is
 * consulted by the preflight endpoint so a tampered client cannot
 * bypass the guard.
 *
 * In addition, a small built-in set of CSS keywords is always treated
 * as reserved regardless of policy: using them as class names tends
 * to produce confusing CSS that authors regret.
 *
 * @module reserved-names
 */

import { defaultPolicy } from './policy.js';

const CSS_KEYWORDS = new Set([
  'auto',
  'inherit',
  'initial',
  'unset',
  'revert',
  'revert-layer',
  'none',
  'currentcolor',
]);

/**
 * @param {string} name
 * @param {import('./policy.js').Policy} [policy]
 * @returns {{reserved: boolean, reason?: 'reservedExact'|'reservedPrefix'|'cssKeyword'}}
 */
export function isReserved(name, policy = defaultPolicy()) {
  if (typeof name !== 'string' || name.length === 0) {
    return { reserved: false };
  }

  if (CSS_KEYWORDS.has(name)) {
    return { reserved: true, reason: 'cssKeyword' };
  }

  const exact = policy.reservedExact || [];
  for (let i = 0; i < exact.length; i++) {
    if (exact[i] === name) return { reserved: true, reason: 'reservedExact' };
  }

  const prefixes = policy.reservedPrefixes || [];
  for (let i = 0; i < prefixes.length; i++) {
    const p = prefixes[i];
    if (typeof p === 'string' && p.length > 0 && name.startsWith(p)) {
      return { reserved: true, reason: 'reservedPrefix' };
    }
  }

  return { reserved: false };
}
