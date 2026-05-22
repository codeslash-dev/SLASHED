# Browser support

**Support floor: Chrome 123+, Safari 17.5+, Firefox 128+** (≈ April–July 2024).

SLASHED leans on modern CSS deliberately and has **no build step** to polyfill
it. The floor is set by three colour-system features that arrived together in
2024 and have no graceful fallback — below these versions, derived colours
collapse to `initial`.

## Floor-setting features

| Feature | Used for | Chrome | Safari | Firefox |
|---|---|---|---|---|
| `light-dark()` | every resolved colour token | 123 | 17.5 | 120 |
| `@property` with `inherits: true` | animatable brand/status colours, `initial` reset | 85 | 16.4 | 128 |
| `oklch()` relative colour (`oklch(from …)`) | hover/tint/shade/dark derivation | 119 | 16.4 | 113 |

The effective floor is the **maximum** of these per engine: Firefox 128
(`@property inherits`), Safari 17.5 (`light-dark()`), Chrome 123
(`light-dark()`).

## Other modern features (within the floor)

| Feature | Notes |
|---|---|
| Cascade layers (`@layer`) | foundational — the whole architecture; no fallback possible |
| Container queries (`@container`) | all responsive primitives; baseline 2023 |
| `:has()` | required-field marker, `.focus-parent` |
| `text-wrap: balance/pretty` | headings / paragraphs (degrades to normal) |
| `interpolate-size` | wrapped in `@supports`; progressive enhancement only |
| `@starting-style`, view transitions | opt-in, `@supports`-gated where used |

## `optional/legacy.css`

`legacy.css` smooths a few property-level gaps **within** the cascade-layer
window (Safari 15.0–15.3 `dvh` / `:focus-visible`, Safari `scrollbar-gutter`).
It is gated by `@supports not (...)` and is inert on modern engines. It does
**not** lower the colour floor above.

## What breaks below the floor

- Below the colour floor: `light-dark()` / relative-colour tokens resolve to
  `initial`, so text/background colours are lost. There is no partial mode —
  treat the floor as a hard requirement.
- Below cascade-layer support (~2022): the entire layered architecture
  collapses; not supported.

If you must support older engines, SLASHED is not the right tool — its value
*is* the modern-CSS, build-free colour system.
