# SLASHED — Roadmap

Current version: **0.6.11**

## Before v1.0

*All pre-v1.0 items are complete as of v0.6.0. The API is frozen for
non-additive changes; the v0.6.x series focuses on the components layer.*

## Post-1.0

- **Components layer** — the `slashed.components` layer and its stubs are already
  declared; the eight `.sf-*` components land incrementally after v1.0, additive
  only.
- **`@property` for spacing/shadow tokens** — extend typed registration beyond
  colours to enable transitions on layout values and better DevTools inspection.
- **Consolidate named surfaces onto `.sf-surface`** — the 11 `.sf-surface--*`
  variants could become one-line `--sf-surface-color` presets of the generic
  primitive, once a fallback story for the precomputed
  `tokens.color-fallbacks.css` path is settled.

## Under consideration

- **Per-layer opt-in bundle via `@import`** — already possible today via the
  granular `core`/`optional` files (`core/layers.css` first); needs docs, not
  code.
- **Native CSS custom functions (`@function`)** — an `optional/functions.css`
  module exposing a true `--fluid(min, max)` (and friends), once cross-engine
  support for `@function` exists. Until then the documented `clamp()` recipe
  covers ad-hoc fluid values without a build step.
- **Heading helper utilities** — activate `.sf-h1`–`.sf-h6` in
  `optional/utilities.css` so elements can take heading typography without
  changing document semantics.
- **Skeleton shape component** — ship `.sf-skeleton` plus shape modifiers such as
  `.sf-skeleton--text`, `.sf-skeleton--line`, `.sf-skeleton--avatar`, and
  `.sf-skeleton--card` in the optional components layer.
- **Z-index utilities** — expose the named z-index scale as `.sf-z-*` classes
  (for example `.sf-z-modal` and `.sf-z-tooltip`) in `optional/utilities.css`.
- **First component tranche** — implement `.sf-button`, `.sf-card`, `.sf-badge`,
  and `.sf-tag` first, using `optional/tokens.components.css` and existing
  `.is-*` states where appropriate.
- **Standalone table pattern** — add `.sf-table`, `.sf-table-scroll`, and compact
  variants such as striped, bordered, and compact tables without changing global
  `table` styles or `.sf-prose table` behaviour.
- **Form layout helpers** — complement `optional/forms.css` with opt-in structure
  classes such as `.sf-field`, `.sf-field__label`, `.sf-field__hint`,
  `.sf-field__error`, `.sf-form-row`, `.sf-form-col`, and `.sf-form-inline`.
- **Remaining optional components** — after the first component tranche, complete
  `.sf-alert`, `.sf-avatar`, and `.sf-modal` with token-driven variants and
  native `<dialog>` compatibility where applicable.
- **Interactive `drives N` exploration** — turn the configurator's passive
  dependency-count badge into a keyboard-accessible popover/list that navigates
  to dependent tokens.
- **Motion configurator UX expansion** — extend the existing motion domain with
  richer previews, motion presets, `--sf-motion-scale` affordances, animation
  tokens, and transition-token editing.
- **Design-token export formats** — CSS and SLASHED theme JSON already exist;
  consider Figma Tokens, W3C Design Tokens, and Style Dictionary export/import if
  design-tool workflows become a priority.
- **Hero recipe / alias** — document or optionally add a `.sf-hero` convenience
  pattern that composes existing `.sf-cover` and `.sf-scrim` behaviour.
- **Scroll progress bar recipe** — consider an optional JS-assisted or
  scroll-timeline-enhanced reading progress pattern once fallback expectations
  are clear.
- **Auto-grid ratio helper** — evaluate whether a ratio-driven auto-grid adds
  enough value beyond the existing `--sf-grid-min` / `.sf-grid--fit` API.
- **Animated link effects** — extend existing link variants with opt-in effects
  such as underline growth or fade behaviours while preserving accessible
  reduced-motion fallbacks.
- **Decorative animation utilities** — decide whether to expose token-backed
  animation helpers for ping, blink, float, spin, and shimmer as optional utility
  classes.

## Out of scope

- **A full utility-first API** — SLASHED remains BEM-first and token-first. Small,
  token-backed, single-purpose helpers may be considered in `optional/utilities.css`,
  but a broad Tailwind-style utility surface is out of scope.
