# SLASHED — Roadmap

Current version: **0.5.23**

---

## Before v1.0

### Framework

- **Logical property audit** — replace remaining physical properties
  (`margin-left`, `padding-right`, etc.) with logical equivalents
  (`margin-inline-start`, `padding-inline-end`) for RTL support.

- **Scoped token snapshot tests** — add Playwright snapshot assertions for ~20
  key semantic tokens (e.g. `--sf-color-text`, `--sf-color-primary`,
  `--sf-color-background`) in both light and dark modes to catch accidental
  value regressions during releases.

---

## Post-1.0 Enhancements

### Framework

- **Components layer** — the `slashed.components` layer and its stubs
  (`optional/components.css`, `optional/tokens.components.css`) are already
  declared and in place. Components will land incrementally after v1.0 under the
  `.sf-` prefix without any breaking changes to existing layers or tokens.

- **`@property` registration for spacing and shadow tokens** — extend typed
  registration beyond brand colors to spacing, sizing, and shadow tokens. Enables
  CSS transitions on layout values and better DevTools inspection.

---

## Under Consideration

- **Per-layer opt-in bundle via `@import`** — technically already possible
  today using the granular `core/` and `optional/` source files (with
  `core/layers.css` loaded first). Needs documentation rather than new code.

---

## Out of Scope

- **Utility classes** — SLASHED is BEM-first by design. The utilities layer
  stub will remain empty through v1.0.
