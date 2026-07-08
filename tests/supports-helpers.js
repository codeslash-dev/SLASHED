/**
 * Shared helpers for the @supports-gating property tests (P2 source-level and
 * P7 build-level). Keeping one implementation here stops the two tests from
 * drifting apart — historically P7 used a line-based scanner that miscounted
 * braces inside an @supports *prelude* (the `@property` feature-query form) and
 * only passed by accident.
 */

/**
 * Remove every @supports block (prelude + body) so only ungated declarations
 * remain. Character-based and parenthesis-aware: the block body is opened by
 * the first `{` seen at parenthesis depth 0, so prelude braces — as in
 * `@supports (@property --x { syntax: "<color>"; }) { … }` — never fool it.
 * Comments are stripped up front so commented-out braces or `@supports` text
 * cannot steer the scan.
 * @param {string} css
 * @returns {string} CSS with all @supports blocks removed
 */
export function stripSupports(css) {
  const src = css.replace(/\/\*[\s\S]*?\*\//g, '');
  let out = '';
  let i = 0;
  const n = src.length;
  while (i < n) {
    // Match `@supports` only at a token boundary so it is never matched inside
    // a selector or value.
    if (src.startsWith('@supports', i) && (i === 0 || /[\s{}();,]/.test(src[i - 1]))) {
      // Skip the prelude to the body-opening `{` at parenthesis depth 0.
      let j = i + '@supports'.length;
      let paren = 0;
      while (j < n) {
        const ch = src[j];
        if (ch === '(') paren++;
        else if (ch === ')') paren--;
        else if (ch === '{' && paren === 0) break;
        j++;
      }
      if (j >= n) break; // malformed tail — nothing sensible left to keep
      // Walk the body to its matching close brace (nested at-rules included)
      // and drop the whole block.
      let depth = 1;
      j++;
      while (j < n && depth > 0) {
        const ch = src[j];
        if (ch === '{') depth++;
        else if (ch === '}') depth--;
        j++;
      }
      i = j; // resume after the dropped block
      continue;
    }
    out += src[i];
    i++;
  }
  return out;
}

// Modern colour expressions that MUST live behind an @supports gate: an engine
// without them drops the declaration, so an ungated one is a real regression.
export const MODERN_EXPRESSIONS = [
  { name: 'light-dark()', re: /light-dark\(/ },
  { name: 'oklch(from …)', re: /oklch\(from\b/ },
  { name: 'color-mix()', re: /color-mix\(/ },
];

/**
 * Every ungated occurrence of a modern colour expression in `css` — custom
 * properties AND ordinary declarations (e.g. `background: color-mix(...)` on a
 * component class). Strips @supports blocks, then string literals, so a match
 * can only be a live, ungated declaration.
 * @param {string} css
 * @returns {string[]} human-readable "expr → line" descriptions (empty = clean)
 */
export function findUngatedModernExpressions(css) {
  const text = stripSupports(css)
    .replace(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g, '""'); // neutralise strings
  const hits = [];
  for (const rawLine of text.split('\n')) {
    const line = rawLine.trim();
    for (const { name, re } of MODERN_EXPRESSIONS) {
      if (re.test(line)) hits.push(`${name} → ${line.slice(0, 100)}`);
    }
  }
  return hits;
}
