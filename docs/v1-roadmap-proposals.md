# SLASHED Framework — v1.0.0 Roadmap Proposals

> **Status:** brainstorm / proposal doc. The curated, committed roadmap lives in
> [`docs/roadmap.md`](roadmap.md). This file is the wider candidate pool for the
> push to 1.0, tiered by priority. Nothing here is committed scope until it moves
> into `roadmap.md`.

## Framing

The token API is **frozen and feature-complete pre-1.0** (all pre-v1.0 roadmap
items shipped in v0.6.0). So "path to 1.0" is **not** more token features — it is:

1. Ship and stabilize the **components layer** (8 reserved `.sf-*` names).
2. Harden accessibility, RTL, and browser-edge behavior.
3. Author-time **DX/tooling** (no runtime cost, no build step for consumers).

Hard constraints every item respects: **no utility classes, no build step, no
Node, no runtime JS shipped to sites, BEM-first, additive-only.**

Legend: **★** net-new idea · **◆** already referenced in a roadmap · **△** beyond
what Automatic.css / Core Framework offer.

---

## Tier 1 — v1.0.0 core (the components layer)

1. ◆ **`.sf-button`** — first batch (tokens already stable); full modifier set + tests.
2. ◆ **`.sf-card`** — first batch; `__header / __body / __footer` slots.
3. ◆ **`.sf-badge` + `.sf-tag`** — small, token-stable, low risk.
4. ◆ **`.sf-alert`** — `__icon / __close` slots; CSS-only dismiss (`:has()` / checkbox), JS left to consumer.
5. ◆ **`.sf-avatar` + `.sf-skeleton`** — skeleton is pure CSS animation, ideal no-JS fit.
6. ◆ **`.sf-modal`** — native `<dialog>` + `@starting-style` (both in the browser floor); CSS-only entry/exit.

## Tier 2 — additive CSS capabilities

7. ◆△ **`optional/functions.css`** — native CSS `@function` for a real `--fluid(min,max)` / `--shade(color,amt)` once cross-engine support lands. No build.
8. ★△ **Container-query layout variants** — `.sf-sidebar` / `.sf-grid` responding to container width, not viewport.
9. ◆ **`@property` for spacing / shadow / radius tokens** — typed, animatable, better DevTools inspection.
10. ◆ **Collapse `.sf-surface--*` onto `--sf-surface-color` presets** — one primitive + a token instead of 11 variant classes.
11. ★ **Refined print + `optional/email.css`** — page-break control, table handling, email-safe subset.

## Tier 3 — accessibility depth (a real differentiator)

12. ★△ **`forced-colors` / Windows High-Contrast mappings** — components survive WHCM.
13. ◆★ **Contrast *guarantee*** — formalize + test that derived text-on-color tokens always clear AA, via `--sf-contrast-target`.
14. ★ **WCAG 2.2 component conformance** — 24px min target size + visible focus baked into every `.sf-*` component, with tests.
15. ★ **RTL / logical-properties audit + tests** — guarantee every primitive is logical-property based so RTL "just works."

## Tier 4 — author-time tooling, ecosystem & docs (zero runtime)

16. ★△ **Published, versioned token manifest + JSON Schema** — promote internal `api-index.json` to a public, schema'd artifact any tool can consume.
17. ★△ **VS Code custom-data (`css-custom-data.json`)** — `--sf-*` autocompletes *with docs* in any editor.
18. ★△ **Stylelint plugin / config** — lint for correct `@layer` usage, reserved-name collisions, raw values that should be tokens.
19. ★△ **DTCG / W3C design-tokens export** — standards-format token file so Figma and code share one source of truth.
20. ★ **Interactive docs with live, editable per-class examples** + a one-page printable cheatsheet.

### Ecosystem follow-ons (depend on the above)

- ★△ **Figma plugin / variables sync** — consumes the DTCG export (#19); round-trips tokens designer ↔ dev.
- ★△ **Framework-agnostic token package** — publish tokens as plain CSS + JSON on CDN/npm for non-WP projects. Mostly packaging; SLASHED is already buildless CSS.
- ★ **Storybook / component-explorer preset** — once the components land.
- ★△ **Consumer-facing visual-regression harness** — expose a CI-runnable version of the existing Playwright suite so adopters catch "a token change shifted 12 components."

---

## Explicitly rejected (out of scope through 1.0)

- Utility-class generator — SLASHED is BEM-first; the utilities stub stays empty.
- Sass / PostCSS build pipeline — breaks the no-build promise.
- Runtime JS for components — breaks the no-JS guarantee.
- HSL `--sf-*-h/s/l` fallback tuner — the triplet is being phased out.
