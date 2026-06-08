/**
 * Token stability-tier contract — the single source of truth.
 *
 * Tokens are classified into three stability tiers:
 *   PUBLIC          — everyday knobs, prominently documented. SemVer-stable.
 *   PUBLIC-ADVANCED — same SemVer guarantee, but niche/powerful.
 *   INTERNAL        — implementation detail; may change without a major bump.
 *
 * INTERNAL and PUBLIC-ADVANCED are finite, enumerated sets; every other
 * `--sf-*` token defaults to PUBLIC. If a token ever needs a tier other than
 * PUBLIC it must be added to one of the sets below — nothing is guessed.
 *
 * This mirrors the PUBLIC API vs INTERNAL contract declared in the
 * core/tokens.css header and docs/architecture.md.
 *
 * Imported by:
 *   scripts/gen-token-index.js
 *   scripts/gen-api-index.js
 */

const INTERNAL = new Set([
  '--sf-is-dark',
]);

const ADVANCED = new Set([
  '--sf-lumlocker',
  '--sf-contrast-bias', '--sf-contrast-threshold',
  '--sf-shadow-strength', '--sf-shadow-color', '--sf-shadow-glow-color',
  '--sf-font-features', '--sf-font-variation', '--sf-optical-sizing',
  '--sf-space-scale', '--sf-text-scale', '--sf-text-display-scale',
  '--sf-radius-scale', '--sf-motion-scale',
  '--sf-scroll-timeline-range-start', '--sf-scroll-timeline-range-end',
  '--sf-mask-scrim-start', '--sf-mask-scrim-end',
  '--sf-safe-top', '--sf-safe-bottom', '--sf-safe-left', '--sf-safe-right',
  '--sf-perspective-near', '--sf-perspective-normal', '--sf-perspective-far',
  '--sf-truncate-suffix',
  '--sf-radius-outer',
  '--sf-is-active', '--sf-is-current', '--sf-is-pressed', '--sf-is-open',
  '--sf-focus-ring-shadow',
  '--sf-print-page-margin', '--sf-print-page-size', '--sf-print-base-size',
]);

function tierOf(name) {
  if (INTERNAL.has(name)) return 'INTERNAL';
  if (ADVANCED.has(name)) return 'PUBLIC-ADVANCED';
  return 'PUBLIC';
}

export { INTERNAL, ADVANCED, tierOf };
