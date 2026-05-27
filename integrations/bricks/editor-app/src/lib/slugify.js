/**
 * Slugify input strings according to the reBEMer naming policy.
 *
 * Default behavior (policy.allowUnicode=false): NFKD-normalize, strip
 * combining marks, drop any remaining non-ASCII, lowercase, replace
 * runs of non-[a-z0-9] with a single '-', trim leading/trailing '-'.
 *
 * Unicode behavior (policy.allowUnicode=true): lowercase, replace runs
 * of non-letter / non-digit (Unicode-aware) with '-', trim. Diacritics
 * survive intact.
 *
 * Limitation note: characters that NFKD does not decompose AND have no
 * single-letter ASCII equivalent (e.g. 'ß', 'ł') are dropped under the
 * ASCII path. Users who need them should set allowUnicode=true. We do
 * not maintain a transliteration table — that is well outside reBEMer's
 * scope and quickly becomes locale-political.
 *
 * @module slugify
 */

import { defaultPolicy } from './policy.js';

/**
 * @param {string} input
 * @param {import('./policy.js').Policy} [policy]
 * @returns {string}
 */
export function slugify(input, policy = defaultPolicy()) {
  if (input === null || input === undefined) return '';
  let s = String(input);

  if (!policy.allowUnicode) {
    // NFKD splits accented letters into base + combining mark; the
    // regex then strips the combining marks. Anything remaining outside
    // ASCII gets dropped in the next step.
    s = s.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
    s = s.replace(/[^\x00-\x7f]/g, '');
  }

  s = s.toLowerCase();

  if (policy.allowUnicode) {
    s = s.replace(/[^\p{L}\p{N}]+/gu, '-');
  } else {
    s = s.replace(/[^a-z0-9]+/g, '-');
  }

  return s.replace(/-+/g, '-').replace(/^-+|-+$/g, '');
}

/**
 * Like slugify, but throws when the result would be empty. Used at
 * apply time so an accidentally-empty slug cannot reach state.
 *
 * @param {string} input
 * @param {import('./policy.js').Policy} [policy]
 * @returns {string}
 */
export function slugifyOrThrow(input, policy) {
  const out = slugify(input, policy);
  if (!out) throw new Error('rebemer:slugify_empty');
  return out;
}
