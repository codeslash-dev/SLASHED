/**
 * Shared builders for the "live" API surface — the set of token and class names
 * that currently exist in the framework. Used by the documentation-freshness
 * gates (check-llm-guide.js, check-doc-refs.js) so they agree on one definition
 * of "live" instead of each re-deriving it (a second copy is exactly how the
 * `Tokens: **686**` header silently drifted).
 *
 * A name is LIVE if a doc may legitimately reference it as current API. A name
 * that is NOT live (renamed away, deleted) must either disappear from the docs
 * or be recorded in docs/ref-allowlist.json with a reason (removed-by-design,
 * historical migration record, illustrative instance token, …).
 */
import fs from 'node:fs';
import path from 'node:path';
import { stripComments } from './parse.js';
import { HOOK_TOKEN_NAMES } from '../hook-tokens.js';

/**
 * Read + parse a JSON file, failing with a human-readable message instead of a
 * raw ENOENT/SyntaxError stack trace. Mirrors the readJson wrappers the gate
 * scripts use so a missing token-registry.json / api-index.json (e.g. a fresh
 * clone before the first `npm run docs`) produces consistent CI output.
 * @param {string} file absolute path
 */
function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    console.error(
      `live-api: cannot read ${file} (${err.message}). ` +
      'Run `npm run build` (or `npm run docs`) first — the live API set is derived from generated artifacts.',
    );
    process.exit(1);
  }
}

/**
 * Build the set of live `--sf-*` TOKEN names. Union of:
 *   a) token-registry.json non-removed entries (the catalogued public API),
 *   b) `--sf-*` custom properties DECLARED in core/ + optional/ CSS
 *      (`@property --sf-x` and `--sf-x:` — never `var(--sf-x)` consumption), and
 *   c) the fallback-only hook tokens (scripts/hook-tokens.js), which are
 *      undeclared by design but documentable.
 * Mirrors the logic that previously lived only inside check-llm-guide.js.
 * @param {string} root absolute repo root
 * @returns {Set<string>} live token names, each including the `--sf-` prefix
 */
export function buildLiveTokens(root) {
  const registry = readJson(path.join(root, 'token-registry.json'));
  const live = new Set(
    registry.tokens.filter((t) => !t.removed).map((t) => t.name),
  );

  const PROPERTY_RE = /@property\s+(--sf-[a-z0-9_-]+)/g;
  const DECL_RE = /(--sf-[a-z0-9_-]+)\s*:/g;
  for (const dir of ['core', 'optional']) {
    const abs = path.join(root, dir);
    if (!fs.existsSync(abs)) continue;
    for (const file of fs.readdirSync(abs).filter((f) => f.endsWith('.css'))) {
      const text = stripComments(fs.readFileSync(path.join(abs, file), 'utf8'));
      for (const m of text.matchAll(PROPERTY_RE)) live.add(m[1]);
      for (const m of text.matchAll(DECL_RE)) live.add(m[1]);
    }
  }

  for (const name of HOOK_TOKEN_NAMES) live.add(name);
  return live;
}

/**
 * Build the set of live CLASS names (WITHOUT the leading dot) from the generated
 * API index. Every selector — base, `--modifier`, and `__element` — is
 * individually catalogued in docs/api-index.json, so an exact match is the
 * primary test; buildLiveClasses returns the raw name set and callers apply the
 * BEM base-strip fallback via {@link isLiveClass}.
 * @param {string} root absolute repo root
 * @returns {Set<string>} live class names, e.g. "sf-btn", "sf-btn--soft"
 */
export function buildLiveClasses(root) {
  const api = readJson(path.join(root, 'docs', 'api-index.json'));
  const entries = Array.isArray(api.entries) ? api.entries : [];
  const live = new Set();
  for (const e of entries) {
    if (e.type !== 'class') continue;
    // Prefer the selector (authoritative, dotted) but fall back to name.
    const raw = (e.selector || (e.name ? `.${e.name}` : '')).replace(/^\./, '');
    if (raw) live.add(raw);
  }
  return live;
}

/**
 * True if a referenced class name is live. Exact match first; if a BEM
 * suffix (`--modifier` / `__element`) is present, the reference also counts as
 * live when its BASE class is live — this tolerates prose that composes a
 * documented-but-not-individually-catalogued modifier on a real base class,
 * without letting a reference to an entirely removed base slip through.
 * @param {string} name class name without leading dot
 * @param {Set<string>} liveClasses from {@link buildLiveClasses}
 * @returns {boolean}
 */
export function isLiveClass(name, liveClasses) {
  if (liveClasses.has(name)) return true;
  const base = name.split(/--|__/)[0];
  return base !== name && liveClasses.has(base);
}

/** Regex matching a `--sf-*` token reference. */
export const TOKEN_REF_RE = /--sf-[a-z0-9_-]+/g;
/** Regex matching a `.sf-*` class reference (leading dot required). */
export const CLASS_REF_RE = /\.sf-[a-z0-9_-]+/g;
