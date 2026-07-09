/**
 * Canonical list of FALLBACK-ONLY HOOK TOKENS.
 *
 * These `--sf-*` names are never *declared* in source (no `--sf-x:` line, no
 * `@property` registration). They exist only as the first argument of a
 * `var(--sf-hook, <default>)` call, so an author can set them inline/scoped to
 * override a single declaration without the framework shipping a `:root`
 * default. Because they are undeclared they are deliberately absent from the
 * generated catalogues (token-registry.json, api-index, token-index) — the
 * configurator can't surface a token that has no default value.
 *
 * They ARE, however, documented in docs/llm-guide.md as override hooks, which
 * would otherwise trip check:llm-guide Check 1 ("every name the guide mentions
 * must be a live token"). This module is the single source of truth that:
 *   - check-llm-guide.js adds to its live-token set (so the guide may name them)
 *   - check-hook-tokens.js verifies against source (each is consumed ONLY via
 *     fallback, is never declared, and is mentioned in the guide)
 *
 * Policy unification (#582 D5): this is the same "prose-only, not registered"
 * treatment already documented for --sf-overlap-host-pad in docs/macros.md;
 * the code-block hooks now carry it explicitly too. Adding a new hook token
 * anywhere in source means adding it here (and the check will confirm it).
 */

/** @typedef {{ name: string, file: string, note: string }} HookToken */

/** @type {HookToken[]} */
export const HOOK_TOKENS = [
  {
    name: '--sf-color-code-block-bg',
    file: 'core/base.css',
    note: 'Per-instance code-block background; falls back to --sf-color-code-bg.',
  },
  {
    name: '--sf-color-code-block-text',
    file: 'core/base.css',
    note: 'Per-instance code-block text colour; falls back to inherit.',
  },
  {
    name: '--sf-overlap-host-pad',
    file: 'core/macros.css',
    note: 'Per-instance .sf-overlap-host block-start padding; falls back to --sf-overlap-pull.',
  },
];

/** Just the names, as a Set — convenient for allowlist membership tests. */
export const HOOK_TOKEN_NAMES = new Set(HOOK_TOKENS.map((h) => h.name));
