/**
 * BEM grammar validator and name builder.
 *
 * Validates block / element / modifier tokens against a Policy and
 * composes them into fully-qualified class names. Returns structured
 * results so the UI can render inline error messages by code.
 *
 * Validation pipeline (per token):
 *   1. Empty input            → { ok:false, code:'empty' }
 *   2. Regex per role         → { ok:false, code:'invalid_chars' }
 *   3. Reserved-name guard    → { ok:false, code:'reserved' }
 * Step 3 is applied in full to block tokens; for element/modifier
 * tokens only the cssKeyword branch is enforced here, because their
 * final-class reservation status depends on the composed name and is
 * checked again in plan.js after composition.
 *
 * Compiled regex objects are cached by source string so we never pay
 * the compile cost twice for the same policy.
 *
 * @module bem
 */

import { defaultPolicy } from './policy.js';
import { isReserved } from './reserved-names.js';
import { slugify } from './slugify.js';

const RE_CACHE = new Map();

function compileRe(source) {
  let re = RE_CACHE.get(source);
  if (!re) {
    re = new RegExp(source, 'u');
    RE_CACHE.set(source, re);
  }
  return re;
}

/**
 * @typedef {Object} ValidateResult
 * @property {boolean} ok
 * @property {'empty'|'invalid_chars'|'invalid_role'|'reserved'} [code]
 * @property {string} [message]
 */

/**
 * @param {string} name
 * @param {'block'|'element'|'modifier'} role
 * @param {import('./policy.js').Policy} [policy]
 * @returns {ValidateResult}
 */
export function validateName(name, role, policy = defaultPolicy()) {
  if (typeof name !== 'string' || name.length === 0) {
    return { ok: false, code: 'empty', message: 'rebemer.validate.empty' };
  }


  let pattern;
  switch (role) {
    case 'block':
      pattern = policy.blockNameRe;
      break;
    case 'element':
      pattern = policy.elementNameRe;
      break;
    case 'modifier':
      pattern = policy.modifierNameRe;
      break;
    default:
      return {
        ok: false,
        code: 'invalid_role',
        message: 'rebemer.validate.invalid_role',
      };
  }

  const re = compileRe(pattern);
  if (!re.test(name)) {
    return { ok: false, code: 'invalid_chars', message: 'rebemer.validate.invalid_chars' };
  }

  const reserved = isReserved(name, policy);
  if (reserved.reserved) {
    if (role === 'block' || reserved.reason === 'cssKeyword') {
      return { ok: false, code: 'reserved', message: 'rebemer.validate.reserved' };
    }
  }

  return { ok: true };
}

/**
 * Build a block class name. Returns '' when the slugified input does
 * not pass validation — callers are expected to surface this via the
 * row's error UI rather than blindly applying an empty name.
 *
 * @param {string} input
 * @param {import('./policy.js').Policy} [policy]
 * @returns {string}
 */
export function buildBlockName(input, policy = defaultPolicy()) {
  const slug = slugify(input, policy);
  return validateName(slug, 'block', policy).ok ? slug : '';
}

/**
 * Build a `block__element` class name. Both parts must validate.
 *
 * @param {string} block   already-slugified block name
 * @param {string} input   raw element label
 * @param {import('./policy.js').Policy} [policy]
 * @returns {string}
 */
export function buildElementName(block, input, policy = defaultPolicy()) {
  if (!validateName(block, 'block', policy).ok) return '';
  const slug = slugify(input, policy);
  if (!validateName(slug, 'element', policy).ok) return '';
  return `${block}__${slug}`;
}

/**
 * Build a `base--modifier` (or `base-modifier` with single-dash flavor)
 * class name. The `base` is whatever class the modifier attaches to —
 * a block name, an element class, or anything caller-validated.
 *
 * @param {string} base
 * @param {string} modifier  raw modifier label (will be slugified)
 * @param {import('./policy.js').Policy} [policy]
 * @returns {string}
 */
export function buildModifierName(base, modifier, policy = defaultPolicy()) {
  if (typeof base !== 'string' || base.length === 0) return '';
  const slug = slugify(modifier, policy);
  if (!validateName(slug, 'modifier', policy).ok) return '';
  const sep = policy.flavor === 'single-dash' ? '-' : '--';
  return `${base}${sep}${slug}`;
}
