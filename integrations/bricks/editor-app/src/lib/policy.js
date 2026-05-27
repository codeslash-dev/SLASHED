/**
 * Naming policy reader and validator.
 *
 * Reads the policy from window.slashedReBEMer.policy (server-hydrated),
 * validates the shape, fills missing keys with defaults. The result is
 * a frozen object consumed by every other module.
 *
 * Regex fields are stored as STRINGS so the policy can be round-tripped
 * via JSON (window hydration <-> REST payload). Consumers compile them
 * via `new RegExp(source, 'u')` once on first use.
 *
 * @module policy
 */

const FLAVORS = new Set(['two-dash', 'single-dash']);

const ASCII_NAME_RE = '^[a-z][a-z0-9]*(-[a-z0-9]+)*$';
const UNICODE_NAME_RE =
  '^[\\p{Ll}\\p{Lo}][\\p{Ll}\\p{Lo}\\p{N}]*(-[\\p{Ll}\\p{Lo}\\p{N}]+)*$';

/**
 * @typedef {Object} Policy
 * @property {'two-dash'|'single-dash'} flavor
 * @property {boolean}              allowUnicode
 * @property {number}               maxDepth
 * @property {readonly string[]}    reservedPrefixes
 * @property {readonly string[]}    reservedExact
 * @property {string}               blockNameRe    serialized regex source
 * @property {string}               elementNameRe  serialized regex source
 * @property {string}               modifierNameRe serialized regex source
 */

/** @returns {Readonly<Policy>} */
export function defaultPolicy() {
  return Object.freeze({
    flavor: 'two-dash',
    allowUnicode: false,
    maxDepth: 6,
    reservedPrefixes: Object.freeze(['sf-', 'is-']),
    reservedExact: Object.freeze([]),
    blockNameRe: ASCII_NAME_RE,
    elementNameRe: ASCII_NAME_RE,
    modifierNameRe: ASCII_NAME_RE,
  });
}

/**
 * Read and normalize the policy. With no argument, sources from
 * window.slashedReBEMer.policy.
 *
 * @param {Partial<Policy>} [source]
 * @returns {Readonly<Policy>}
 */
export function readPolicy(source) {
  const raw = source ?? globalThis.window?.slashedReBEMer?.policy ?? null;
  return mergePolicy(defaultPolicy(), raw);
}


function mergePolicy(base, raw) {
  if (!raw || typeof raw !== 'object') return base;

  const flavor = FLAVORS.has(raw.flavor) ? raw.flavor : base.flavor;
  const allowUnicode =
    typeof raw.allowUnicode === 'boolean' ? raw.allowUnicode : base.allowUnicode;
  const maxDepth =
    Number.isInteger(raw.maxDepth) && raw.maxDepth >= 0 ? raw.maxDepth : base.maxDepth;

  const reservedPrefixes = Array.isArray(raw.reservedPrefixes)
    ? raw.reservedPrefixes.filter((s) => typeof s === 'string' && s.length > 0)
    : [...base.reservedPrefixes];

  const reservedExact = Array.isArray(raw.reservedExact)
    ? raw.reservedExact.filter((s) => typeof s === 'string' && s.length > 0)
    : [...base.reservedExact];

  // If allowUnicode flips on without an explicit regex override, switch
  // the default regex source to the Unicode-aware variant. Custom regex
  // strings (when valid) always win regardless of allowUnicode.
  const reFallback = allowUnicode ? UNICODE_NAME_RE : ASCII_NAME_RE;
  const blockNameRe = pickRe(raw.blockNameRe, reFallback);
  const elementNameRe = pickRe(raw.elementNameRe, reFallback);
  const modifierNameRe = pickRe(raw.modifierNameRe, reFallback);

  return Object.freeze({
    flavor,
    allowUnicode,
    maxDepth,
    reservedPrefixes: Object.freeze(reservedPrefixes),
    reservedExact: Object.freeze(reservedExact),
    blockNameRe,
    elementNameRe,
    modifierNameRe,
  });
}

function pickRe(value, fallback) {
  if (typeof value !== 'string' || value.length === 0) return fallback;
  try {
    new RegExp(value, 'u');
    return value;
  } catch {
    return fallback;
  }
}
