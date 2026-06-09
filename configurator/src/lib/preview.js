/**
 * Live-preview variable injection.
 *
 * Builds a single block of custom-property declarations that seeds the scoped
 * preview root with EVERY framework default (from the synced catalogue) and
 * then layers the user's overrides on top. Because every `--sf-*` token is set
 * on the same element, inter-token `var()` references, `oklch(from …)` relative
 * colors and `light-dark()` all resolve exactly as they would under the real
 * framework — and it stays auto-synced, since the defaults come from the same
 * generated data the editor uses.
 */
import { allTokens } from './model.js';

/**
 * @param {Record<string,string>} overrides token name -> value
 * @param {'light'|'dark'} theme preview color scheme
 * @returns {string} CSS declarations (no selector), newline-joined
 */
export function buildPreviewDeclarations(overrides, theme) {
  const lines = [];
  // color-scheme drives light-dark(); --sf-is-dark is the framework's internal
  // dark flag that themes.css flips. Setting both reproduces a theme switch.
  lines.push(`color-scheme: ${theme};`);
  lines.push(`--sf-is-dark: ${theme === 'dark' ? 1 : 0};`);

  for (const t of allTokens) {
    if (t.value == null || t.value === '') continue;
    // Skip the internal dark flag — handled explicitly above.
    if (t.name === '--sf-is-dark') continue;
    lines.push(`${t.name}: ${t.value};`);
  }
  for (const [name, value] of Object.entries(overrides)) {
    if (value == null || value === '') continue;
    lines.push(`${name}: ${value};`);
  }
  return lines.join('\n');
}
