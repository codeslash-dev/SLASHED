# SLASHED — Roadmap

Current version: **0.5.32**

## Before v1.0

- **Logical property audit** — replace remaining physical properties
  (`margin-left`, `padding-right`) with logical equivalents
  (`margin-inline-start`, `padding-inline-end`) for RTL support.
- **Scoped token snapshot tests** — Playwright snapshot assertions for ~20 key
  semantic tokens (`--sf-color-text`, `--sf-color-primary`, …) in both modes, to
  catch value regressions during releases.

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
  granular `core/`/`optional/` files (`core/layers.css` first); needs docs, not
  code.
- **Native CSS custom functions (`@function`)** — an `optional/functions.css`
  module exposing a true `--fluid(min, max)` (and friends) as a progressive
  enhancement over the custom fluid slots, once cross-engine support for
  `@function` exists. Until then the slot tokens + the documented `clamp()`
  recipe cover the use case without a build step.

## Out of scope

- **Utility classes** — SLASHED is BEM-first; the utilities stub stays empty
  through v1.0.
