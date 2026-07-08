/**
 * Shared CSS/file-reading helpers for the scripts/*.js generators and checks.
 *
 * Before this module, `stripComments`/`maskComments`, `readValue`, and
 * `readFile` were each reimplemented independently across 4+ scripts — see
 * docs/technical-debt-audit.md SL-007. `stripComments` and `maskComments`
 * are NOT interchangeable and must stay separate exports:
 *   - stripComments REMOVES comment bodies, shortening the string. Fine for
 *     scripts that only count/extract values and don't need offsets to line
 *     up with the original source.
 *   - maskComments REPLACES comment bodies with same-length whitespace,
 *     preserving every character's offset. Required by gen-api-index.js,
 *     which looks up section banners by offset in the original text after
 *     matching against the masked text.
 * The same distinction applies to stripStrings vs maskStrings.
 */
import fs from 'node:fs';
import path from 'node:path';

/** Remove block comments, shortening the string. Not offset-safe. */
export function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

/** Remove quoted string literals, shortening the string. Not offset-safe. */
export function stripStrings(css) {
  return css.replace(/"[^"]*"|'[^']*'/g, '""');
}

/**
 * Mask block-comment bodies with spaces (length-preserving) so character
 * offsets stay stable for later banner/section lookups.
 * @param {string} css source CSS
 * @returns {string} CSS with comment bodies blanked
 */
export function maskComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
}

/**
 * Mask string-literal bodies with spaces (length-preserving) so quoted class
 * names inside `content:"…"` aren't mistaken for selectors.
 * @param {string} css source CSS
 * @returns {string} CSS with string bodies blanked
 */
export function maskStrings(css) {
  return css.replace(/"[^"]*"|'[^']*'/g, (m) => m.replace(/[^\n]/g, ' '));
}

/**
 * Read a custom-property value starting at its `:` offset, honouring nested
 * parentheses so light-dark()/oklch()/clamp() values stay intact.
 * @param {string} css source (comment-stripped or -masked)
 * @param {number} colonIdx offset of the `:` after the property name
 * @returns {string} the normalised value text
 */
export function readValue(css, colonIdx) {
  let depth = 0;
  let out = '';
  for (let i = colonIdx + 1; i < css.length; i++) {
    const ch = css[i];
    if (ch === '(') depth++;
    else if (ch === ')') depth--;
    else if (ch === ';' && depth === 0) break;
    out += ch;
  }
  return out.replace(/\s+/g, ' ').trim();
}

/**
 * Read a workspace-relative file. No existence check — mirrors
 * version-sync.js's original bare `fs.readFileSync`, which lets a missing
 * file surface Node's own ENOENT rather than a custom message.
 * @param {string} rel path relative to `root`
 * @param {string} root absolute repo root
 * @returns {string} file contents
 */
export function readFile(rel, root) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

/**
 * Read a workspace-relative file, throwing `message` if it doesn't exist.
 * @param {string} rel path relative to `root`
 * @param {string} root absolute repo root
 * @param {string} message error message to throw when the file is missing
 * @returns {string} file contents
 */
export function requireFile(rel, root, message) {
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs)) {
    throw new Error(message);
  }
  return fs.readFileSync(abs, 'utf8');
}
