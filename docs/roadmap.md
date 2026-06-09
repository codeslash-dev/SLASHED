# SLASHED — Roadmap

Current version: **0.5.28**

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

## Under consideration

- **Per-layer opt-in bundle via `@import`** — already possible today via the
  granular `core/`/`optional/` files (`core/layers.css` first); needs docs, not
  code.

## Out of scope

- **Utility classes** — SLASHED is BEM-first; the utilities stub stays empty
  through v1.0.
