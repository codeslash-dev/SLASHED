/**
 * i18n helper bound to window.slashedReBEMer.i18n.
 *
 * The dictionary is a flat key → string map populated server-side via
 * wp_localize_script; missing keys fall through to the key itself so
 * a new untranslated string still renders something the developer
 * can recognize and grep for.
 *
 * Supports two placeholder grammars used by WP/PHP and JS together:
 *   - Positional: %s, %d   — consumed in argument order.
 *   - Indexed:   %1$s, %2$d — consumed by 1-based index.
 * Indexed substitution is performed first so a template can mix both
 * without the positional pass eating the indexed markers.
 *
 * @module i18n
 */

/**
 * @param {string} key
 * @param {...(string|number)} args
 * @returns {string}
 */
export function __(key, ...args) {
  if (typeof key !== 'string') return '';
  const dict = globalThis.window?.slashedReBEMer?.i18n;
  const template =
    dict && typeof dict[key] === 'string' && dict[key].length > 0 ? dict[key] : key;
  return interpolate(template, args);
}

function interpolate(template, args) {
  let i = 0;
  let out = template.replace(/%(\d+)\$([sd])/g, (_, idxStr, type) => {
    const idx = Number(idxStr) - 1;
    return format(args[idx], type);
  });
  out = out.replace(/%([sd])/g, (_, type) => format(args[i++], type));
  return out;
}

function format(value, type) {
  if (value === undefined) return '';
  if (type === 'd') {
    const n = Number(value);
    return Number.isFinite(n) ? String(Math.trunc(n)) : '0';
  }
  return String(value);
}
