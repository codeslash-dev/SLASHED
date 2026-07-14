# Token index

> **Generated** from source by `scripts/gen-token-index.js` —
> run `npm run docs:index` to refresh. Do not edit by hand.

A cross-reference of every `--sf-*` custom property by **source file** and
**stability tier**. For just the default values see [tokens.md](tokens.md);
for the flat name list see [registry.json](registry.json); for the tier
contract and naming rules see [architecture.md](architecture.md).

**756 tokens** (deduplicated by name across the 4 token source files).

| Tier | Count | Meaning |
|---|---|---|
| PUBLIC | 695 | Everyday knobs. SemVer-stable. |
| PUBLIC-ADVANCED | 60 | Same SemVer guarantee; niche/powerful. |
| INTERNAL | 1 | Implementation detail; may change without a major bump. |

Every token also carries a **role** — an orthogonal, SemVer-neutral hint about
whether you are expected to **set** it or **read** it. It is derived from the
declared value (a value that references `var(--sf-…)` is a derived output):

| Role | Count | Meaning |
|---|---|---|
| knob | 266 | Input you **set** to configure the system (a literal primitive: length, number, colour literal, keyword, font stack, easing curve …). |
| consumption | 490 | Ready-to-use output you **read**; derived from other tokens via `var(--sf-…)` (incl. `light-dark()`/`oklch(from …)`/`color-mix()`). |

## INTERNAL tokens

- `--sf-is-dark`

## PUBLIC-ADVANCED tokens

- `--sf-btn-font-size`
- `--sf-btn-min-height`
- `--sf-btn-padding-block`
- `--sf-btn-padding-inline`
- `--sf-contrast-bias`
- `--sf-contrast-threshold`
- `--sf-density`
- `--sf-fluid-max-vw`
- `--sf-fluid-min-vw`
- `--sf-focus-ring-shadow`
- `--sf-font-features`
- `--sf-font-variation`
- `--sf-is-active`
- `--sf-is-current`
- `--sf-is-open`
- `--sf-is-pressed`
- `--sf-leading-taper`
- `--sf-lumlocker`
- `--sf-mask-scrim-end`
- `--sf-mask-scrim-start`
- `--sf-motion-scale`
- `--sf-optical-sizing`
- `--sf-palette-mix-100`
- `--sf-palette-mix-200`
- `--sf-palette-mix-300`
- `--sf-palette-mix-400`
- `--sf-palette-mix-50`
- `--sf-palette-mix-600`
- `--sf-palette-mix-700`
- `--sf-palette-mix-800`
- `--sf-palette-mix-900`
- `--sf-palette-mix-950`
- `--sf-print-base-size`
- `--sf-print-page-margin`
- `--sf-print-page-size`
- `--sf-radius-outer`
- `--sf-radius-scale`
- `--sf-safe-bottom`
- `--sf-safe-left`
- `--sf-safe-right`
- `--sf-safe-top`
- `--sf-scroll-timeline-range-end`
- `--sf-scroll-timeline-range-start`
- `--sf-section-scale`
- `--sf-shadow-color`
- `--sf-shadow-glow-color`
- `--sf-shadow-strength`
- `--sf-space-base-max`
- `--sf-space-base-min`
- `--sf-space-ratio-max`
- `--sf-space-ratio-min`
- `--sf-space-scale`
- `--sf-text-base-max`
- `--sf-text-base-min`
- `--sf-text-display-base-max`
- `--sf-text-display-base-min`
- `--sf-text-display-scale`
- `--sf-text-ratio-max`
- `--sf-text-ratio-min`
- `--sf-text-scale`

## Full index

| Token | Tier | Role | File(s) | Default |
|---|---|---|---|---|
| `--sf-alternate-gap` | PUBLIC | consumption | Layout | `var(--sf-content-gap)` |
| `--sf-alternate-inner-gap` | PUBLIC | consumption | Layout | `var(--sf-gap)` |
| `--sf-animation-blink` | PUBLIC | consumption | Core | `sf-blink calc(1s * var(--sf-motion-scale)) steps(1, end) infinite` |
| `--sf-animation-color-pulse` | PUBLIC | consumption | Core | `sf-color-pulse var(--sf-duration-slow) var(--sf-ease-in-out) infinite` |
| `--sf-animation-fade-in` | PUBLIC | consumption | Core | `sf-fade-in var(--sf-duration-normal) var(--sf-ease-out) both` |
| `--sf-animation-fade-out` | PUBLIC | consumption | Core | `sf-fade-out var(--sf-duration-normal) var(--sf-ease-in) both` |
| `--sf-animation-float` | PUBLIC | consumption | Core | `sf-float calc(3s * var(--sf-motion-scale)) var(--sf-ease-in-out) infinite` |
| `--sf-animation-ping` | PUBLIC | consumption | Core | `sf-ping var(--sf-duration-slow) var(--sf-ease-out) infinite` |
| `--sf-animation-scale-down` | PUBLIC | consumption | Core | `sf-scale-down var(--sf-duration-normal) var(--sf-ease-in) both` |
| `--sf-animation-scale-up` | PUBLIC | consumption | Core | `sf-scale-up var(--sf-duration-normal) var(--sf-ease-overshoot) both` |
| `--sf-animation-shimmer` | PUBLIC | consumption | Core | `sf-shimmer calc(1.5s * var(--sf-motion-scale)) var(--sf-ease-in-out) infinite` |
| `--sf-animation-slide-in-down` | PUBLIC | consumption | Core | `sf-slide-in-down var(--sf-duration-normal) var(--sf-ease-out) both` |
| `--sf-animation-slide-in-left` | PUBLIC | consumption | Core | `sf-slide-in-left var(--sf-duration-normal) var(--sf-ease-out) both` |
| `--sf-animation-slide-in-right` | PUBLIC | consumption | Core | `sf-slide-in-right var(--sf-duration-normal) var(--sf-ease-out) both` |
| `--sf-animation-slide-in-up` | PUBLIC | consumption | Core | `sf-slide-in-up var(--sf-duration-normal) var(--sf-ease-out) both` |
| `--sf-animation-slide-out-down` | PUBLIC | consumption | Core | `sf-slide-out-down var(--sf-duration-normal) var(--sf-ease-in) both` |
| `--sf-animation-slide-out-left` | PUBLIC | consumption | Core | `sf-slide-out-left var(--sf-duration-normal) var(--sf-ease-in) both` |
| `--sf-animation-slide-out-right` | PUBLIC | consumption | Core | `sf-slide-out-right var(--sf-duration-normal) var(--sf-ease-in) both` |
| `--sf-animation-slide-out-up` | PUBLIC | consumption | Core | `sf-slide-out-up var(--sf-duration-normal) var(--sf-ease-in) both` |
| `--sf-animation-spin` | PUBLIC | consumption | Core | `sf-spin var(--sf-duration-slower) linear infinite` |
| `--sf-aspect` | PUBLIC | knob | Macros | `16 / 9` |
| `--sf-bento-cols-default` | PUBLIC | knob | Layout | `4` |
| `--sf-bento-gap` | PUBLIC | consumption | Layout | `var(--sf-gap)` |
| `--sf-bento-row-compact` | PUBLIC | knob | Layout | `6rem` |
| `--sf-bento-row-default` | PUBLIC | knob | Layout | `10rem` |
| `--sf-bento-row-tall` | PUBLIC | knob | Layout | `16rem` |
| `--sf-bg-layer-fit` | PUBLIC | knob | Layout | `cover` |
| `--sf-bg-layer-inset` | PUBLIC | knob | Layout | `0px` |
| `--sf-bg-layer-position` | PUBLIC | knob | Layout | `50% 50%` |
| `--sf-bg-layer-radius` | PUBLIC | knob | Layout | `0` |
| `--sf-bg-layer-z` | PUBLIC | knob | Layout | `-2` |
| `--sf-blur` | PUBLIC | knob | Core | `12px` |
| `--sf-body-color` | PUBLIC | consumption | Core | `var(--sf-color-text)` |
| `--sf-body-em-style` | PUBLIC | knob | Core | `italic` |
| `--sf-body-font-family` | PUBLIC | consumption | Core | `var(--sf-font-body)` |
| `--sf-body-font-size` | PUBLIC | consumption | Core | `var(--sf-text-m)` |
| `--sf-body-font-weight` | PUBLIC | consumption | Core | `var(--sf-font-weight-body)` |
| `--sf-body-line-height` | PUBLIC | consumption | Core | `var(--sf-leading-normal)` |
| `--sf-body-strong-weight` | PUBLIC | consumption | Core | `var(--sf-font-weight-strong)` |
| `--sf-body-text-wrap` | PUBLIC | knob | Core | `pretty` |
| `--sf-border` | PUBLIC | consumption | Core | `var(--sf-border-width-1) var(--sf-border-style) var(--sf-color-border)` |
| `--sf-border-scale` | PUBLIC | knob | Core | `1` |
| `--sf-border-strong` | PUBLIC | consumption | Core | `var(--sf-border-width-1) var(--sf-border-style) var(--sf-color-border--strong)` |
| `--sf-border-style` | PUBLIC | knob | Core | `solid` |
| `--sf-border-subtle` | PUBLIC | consumption | Core | `var(--sf-border-width-1) var(--sf-border-style) var(--sf-color-border--subtle)` |
| `--sf-border-width-1` | PUBLIC | consumption | Core | `calc(1px * var(--sf-border-scale, 1))` |
| `--sf-border-width-2` | PUBLIC | consumption | Core | `calc(2px * var(--sf-border-scale, 1))` |
| `--sf-border-width-3` | PUBLIC | consumption | Core | `calc(3px * var(--sf-border-scale, 1))` |
| `--sf-border-width-4` | PUBLIC | consumption | Core | `calc(4px * var(--sf-border-scale, 1))` |
| `--sf-border-width-hairline` | PUBLIC | knob | Core | `0.5px` |
| `--sf-box-border-color` | PUBLIC | consumption | Layout | `var(--sf-color-border)` |
| `--sf-box-border-width` | PUBLIC | knob | Layout | `0` |
| `--sf-box-padding` | PUBLIC | consumption | Layout | `var(--sf-space-m)` |
| `--sf-breakout-width` | PUBLIC | consumption | Layout | `var(--sf-container-wide)` |
| `--sf-btn-border-width` | PUBLIC | consumption | Components (optional, incomplete) | `var(--sf-border-width-1)` |
| `--sf-btn-font-scale` | PUBLIC | knob | Components (optional, incomplete) | `1` |
| `--sf-btn-font-size` | PUBLIC-ADVANCED | knob | Components (optional, incomplete) | `initial` |
| `--sf-btn-font-weight` | PUBLIC | consumption | Components (optional, incomplete) | `var(--sf-font-weight-interactive)` |
| `--sf-btn-gap` | PUBLIC | consumption | Components (optional, incomplete) | `var(--sf-space-2xs)` |
| `--sf-btn-l-font-size` | PUBLIC | knob | Components (optional, incomplete) | `initial` |
| `--sf-btn-l-min-height` | PUBLIC | knob | Components (optional, incomplete) | `initial` |
| `--sf-btn-l-padding-block` | PUBLIC | knob | Components (optional, incomplete) | `initial` |
| `--sf-btn-l-padding-inline` | PUBLIC | knob | Components (optional, incomplete) | `initial` |
| `--sf-btn-m-font-size` | PUBLIC | knob | Components (optional, incomplete) | `initial` |
| `--sf-btn-m-min-height` | PUBLIC | knob | Components (optional, incomplete) | `initial` |
| `--sf-btn-m-padding-block` | PUBLIC | knob | Components (optional, incomplete) | `initial` |
| `--sf-btn-m-padding-inline` | PUBLIC | knob | Components (optional, incomplete) | `initial` |
| `--sf-btn-min-height` | PUBLIC-ADVANCED | knob | Components (optional, incomplete) | `initial` |
| `--sf-btn-padding-block` | PUBLIC-ADVANCED | knob | Components (optional, incomplete) | `initial` |
| `--sf-btn-padding-inline` | PUBLIC-ADVANCED | knob | Components (optional, incomplete) | `initial` |
| `--sf-btn-radius` | PUBLIC | consumption | Components (optional, incomplete) | `var(--sf-radius-m)` |
| `--sf-btn-s-font-size` | PUBLIC | knob | Components (optional, incomplete) | `initial` |
| `--sf-btn-s-min-height` | PUBLIC | knob | Components (optional, incomplete) | `initial` |
| `--sf-btn-s-padding-block` | PUBLIC | knob | Components (optional, incomplete) | `initial` |
| `--sf-btn-s-padding-inline` | PUBLIC | knob | Components (optional, incomplete) | `initial` |
| `--sf-btn-xl-font-size` | PUBLIC | knob | Components (optional, incomplete) | `initial` |
| `--sf-btn-xl-min-height` | PUBLIC | knob | Components (optional, incomplete) | `initial` |
| `--sf-btn-xl-padding-block` | PUBLIC | knob | Components (optional, incomplete) | `initial` |
| `--sf-btn-xl-padding-inline` | PUBLIC | knob | Components (optional, incomplete) | `initial` |
| `--sf-btn-xs-font-size` | PUBLIC | knob | Components (optional, incomplete) | `initial` |
| `--sf-btn-xs-min-height` | PUBLIC | knob | Components (optional, incomplete) | `initial` |
| `--sf-btn-xs-padding-block` | PUBLIC | knob | Components (optional, incomplete) | `initial` |
| `--sf-btn-xs-padding-inline` | PUBLIC | knob | Components (optional, incomplete) | `initial` |
| `--sf-card-avatar-size` | PUBLIC | knob | Components (optional, incomplete) | `2.5rem` |
| `--sf-card-bg` | PUBLIC | consumption | Components (optional, incomplete) | `var(--sf-color-surface)` |
| `--sf-card-border-color` | PUBLIC | consumption | Components (optional, incomplete) | `var(--sf-color-border)` |
| `--sf-card-border-width` | PUBLIC | consumption | Components (optional, incomplete) | `var(--sf-border-width-1)` |
| `--sf-card-gap` | PUBLIC | consumption | Components (optional, incomplete) | `var(--sf-space-m)` |
| `--sf-card-heading-size` | PUBLIC | consumption | Components (optional, incomplete) | `var(--sf-text-xl)` |
| `--sf-card-media-radius` | PUBLIC | consumption | Components (optional, incomplete) | `var(--sf-card-radius, var(--sf-radius-m))` |
| `--sf-card-media-ratio` | PUBLIC | consumption | Components (optional, incomplete) | `var(--sf-ratio-video)` |
| `--sf-card-padding` | PUBLIC | consumption | Components (optional, incomplete) | `var(--sf-space-l)` |
| `--sf-card-radius` | PUBLIC | consumption | Components (optional, incomplete) | `var(--sf-radius-m)` |
| `--sf-card-radius-outer` | PUBLIC | consumption | Components (optional, incomplete) | `calc(var(--sf-card-radius) + var(--sf-card-padding))` |
| `--sf-card-shadow` | PUBLIC | consumption | Components (optional, incomplete) | `var(--sf-shadow-s)` |
| `--sf-card-shadow--elevated` | PUBLIC | consumption | Components (optional, incomplete) | `var(--sf-shadow-l)` |
| `--sf-card-shadow--hover` | PUBLIC | consumption | Components (optional, incomplete) | `var(--sf-shadow-l)` |
| `--sf-caret-color` | PUBLIC | consumption | Core | `var(--sf-color-action)` |
| `--sf-center-gutter` | PUBLIC | consumption | Layout | `var(--sf-gutter)` |
| `--sf-center-max` | PUBLIC | consumption | Layout | `var(--sf-container-default)` |
| `--sf-cluster-align` | PUBLIC | knob | Layout | `center` |
| `--sf-cluster-gap` | PUBLIC | consumption | Layout | `var(--sf-gap)` |
| `--sf-cluster-justify` | PUBLIC | knob | Layout | `flex-start` |
| `--sf-code-font-size` | PUBLIC | knob | Core | `0.875em` |
| `--sf-color-action` | PUBLIC | consumption | Core | `light-dark(var(--sf-color-action-source-light), var(--sf-color-action-source-dark, oklch(from var(--sf-color-action-source-light) clamp(0.65, calc(0.95 - l * 0.5), 0.88) calc(c * 0.9) h)))` |
| `--sf-color-action--active` | PUBLIC | consumption | Core | `var(--sf-color-action-xdark)` |
| `--sf-color-action--hover` | PUBLIC | consumption | Core | `var(--sf-color-action-darker)` |
| `--sf-color-action-100` | PUBLIC | consumption | Core | `color-mix(in oklab, var(--sf-color-action) var(--sf-palette-mix-100), var(--sf-color-surface))` |
| `--sf-color-action-200` | PUBLIC | consumption | Core | `color-mix(in oklab, var(--sf-color-action) var(--sf-palette-mix-200), var(--sf-color-surface))` |
| `--sf-color-action-300` | PUBLIC | consumption | Core | `color-mix(in oklab, var(--sf-color-action) var(--sf-palette-mix-300), var(--sf-color-surface))` |
| `--sf-color-action-400` | PUBLIC | consumption | Core | `color-mix(in oklab, var(--sf-color-action) var(--sf-palette-mix-400), var(--sf-color-surface))` |
| `--sf-color-action-50` | PUBLIC | consumption | Core | `color-mix(in oklab, var(--sf-color-action) var(--sf-palette-mix-50), var(--sf-color-surface))` |
| `--sf-color-action-500` | PUBLIC | consumption | Core | `var(--sf-color-action)` |
| `--sf-color-action-600` | PUBLIC | consumption | Core | `color-mix(in oklab, var(--sf-color-action) var(--sf-palette-mix-600), var(--sf-color-text))` |
| `--sf-color-action-700` | PUBLIC | consumption | Core | `color-mix(in oklab, var(--sf-color-action) var(--sf-palette-mix-700), var(--sf-color-text))` |
| `--sf-color-action-800` | PUBLIC | consumption | Core | `color-mix(in oklab, var(--sf-color-action) var(--sf-palette-mix-800), var(--sf-color-text))` |
| `--sf-color-action-900` | PUBLIC | consumption | Core | `color-mix(in oklab, var(--sf-color-action) var(--sf-palette-mix-900), var(--sf-color-text))` |
| `--sf-color-action-950` | PUBLIC | consumption | Core | `color-mix(in oklab, var(--sf-color-action) var(--sf-palette-mix-950), var(--sf-color-text))` |
| `--sf-color-action-a10` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-action) l c h / 0.10)` |
| `--sf-color-action-a30` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-action) l c h / 0.30)` |
| `--sf-color-action-a5` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-action) l c h / 0.05)` |
| `--sf-color-action-a50` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-action) l c h / 0.50)` |
| `--sf-color-action-a80` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-action) l c h / 0.80)` |
| `--sf-color-action-darker` | PUBLIC | consumption | Core | `var(--sf-color-action-600)` |
| `--sf-color-action-lighter` | PUBLIC | consumption | Core | `var(--sf-color-action-400)` |
| `--sf-color-action-muted` | PUBLIC | consumption | Core | `var(--sf-color-action-a30)` |
| `--sf-color-action-source-dark` | PUBLIC | knob | Core | `oklch(0.70 0.198 235) (registered)` |
| `--sf-color-action-source-light` | PUBLIC | knob | Core | `oklch(0.50 0.22 235)` |
| `--sf-color-action-subtle` | PUBLIC | consumption | Core | `var(--sf-color-action-a10)` |
| `--sf-color-action-superdark` | PUBLIC | consumption | Core | `var(--sf-color-action-950)` |
| `--sf-color-action-superlight` | PUBLIC | consumption | Core | `var(--sf-color-action-50)` |
| `--sf-color-action-tint` | PUBLIC | consumption | Core | `var(--sf-color-action-a5)` |
| `--sf-color-action-xdark` | PUBLIC | consumption | Core | `var(--sf-color-action-800)` |
| `--sf-color-action-xlight` | PUBLIC | consumption | Core | `var(--sf-color-action-200)` |
| `--sf-color-base` | PUBLIC | consumption | Core | `light-dark(var(--sf-color-base-source-light), var(--sf-color-base-source-dark, oklch(from var(--sf-color-base-source-light) clamp(0.16, calc(1.18 - l), 0.24) calc(c * 0.5) h)))` |
| `--sf-color-base--active` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-base) clamp(0.01, calc(l - 0.08 + var(--sf-is-dark) * 0.16), 0.99) c h)` |
| `--sf-color-base--hover` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-base) clamp(0.01, calc(l - 0.04 + var(--sf-is-dark) * 0.08), 0.99) c h)` |
| `--sf-color-base-100` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-base) 0.94 c h)` |
| `--sf-color-base-200` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-base) 0.88 c h)` |
| `--sf-color-base-300` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-base) 0.78 c h)` |
| `--sf-color-base-400` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-base) 0.65 c h)` |
| `--sf-color-base-50` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-base) 0.97 c h)` |
| `--sf-color-base-500` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-base) 0.50 c h)` |
| `--sf-color-base-600` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-base) 0.37 c h)` |
| `--sf-color-base-700` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-base) 0.27 c h)` |
| `--sf-color-base-800` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-base) 0.17 c h)` |
| `--sf-color-base-900` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-base) 0.11 c h)` |
| `--sf-color-base-950` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-base) 0.06 c h)` |
| `--sf-color-base-a10` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-base) l c h / 0.10)` |
| `--sf-color-base-a30` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-base) l c h / 0.30)` |
| `--sf-color-base-a5` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-base) l c h / 0.05)` |
| `--sf-color-base-a50` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-base) l c h / 0.50)` |
| `--sf-color-base-a80` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-base) l c h / 0.80)` |
| `--sf-color-base-muted` | PUBLIC | consumption | Core | `var(--sf-color-base-a30)` |
| `--sf-color-base-source-dark` | PUBLIC | knob | Core | `oklch(0.22 0.003 250) (registered)` |
| `--sf-color-base-source-light` | PUBLIC | knob | Core | `oklch(0.96 0.006 250)` |
| `--sf-color-base-subtle` | PUBLIC | consumption | Core | `var(--sf-color-base-a10)` |
| `--sf-color-base-tint` | PUBLIC | consumption | Core | `var(--sf-color-base-a5)` |
| `--sf-color-bg` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-base) calc(l + 0.02) c h)` |
| `--sf-color-bg--active` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-neutral) l c h / 0.12)` |
| `--sf-color-bg--disabled` | PUBLIC | consumption | Core | `var(--sf-color-inset)` |
| `--sf-color-bg--focus` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-action) l c h / 0.06)` |
| `--sf-color-bg--hover` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-neutral) l c h / 0.08)` |
| `--sf-color-bg--selected` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-action) l c h / 0.1)` |
| `--sf-color-black` | PUBLIC | knob | Core | `oklch(0% 0 0)` |
| `--sf-color-border` | PUBLIC | consumption | Core | `light-dark( oklch(from var(--sf-color-neutral-source-light) clamp(0.70, calc(l + 0.35), 0.95) 0.005 h), oklch(from var(--sf-color-neutral) clamp(0.25, calc(l - 0.3), 0.55) 0.005 h) )` |
| `--sf-color-border--disabled` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-border--subtle) l 0 h / 0.5)` |
| `--sf-color-border--focus` | PUBLIC | consumption | Core | `var(--sf-color-action)` |
| `--sf-color-border--strong` | PUBLIC | consumption | Core | `light-dark( oklch(from var(--sf-color-neutral-source-light) clamp(0.55, calc(l + 0.1), 0.85) 0.02 h), oklch(from var(--sf-color-neutral) clamp(0.38, calc(l - 0.1), 0.65) 0.02 h) )` |
| `--sf-color-border--subtle` | PUBLIC | consumption | Core | `light-dark( oklch(from var(--sf-color-neutral-source-light) clamp(0.75, calc(l + 0.4), 0.97) 0.005 h), oklch(from var(--sf-color-neutral) clamp(0.20, calc(l - 0.38), 0.45) 0.005 h) )` |
| `--sf-color-border--translucent` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-neutral) l c h / 0.15)` |
| `--sf-color-code-bg` | PUBLIC | consumption | Core | `var(--sf-color-inset)` |
| `--sf-color-code-text` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-code-bg) clamp(0.1, sign(var(--sf-contrast-threshold) - l) * 999, 0.95) 0 0)` |
| `--sf-color-danger` | PUBLIC | consumption | Core | `light-dark(var(--sf-color-danger-source-light), var(--sf-color-danger-source-dark, oklch(from var(--sf-color-danger-source-light) clamp(0.65, calc(0.95 - l * 0.5), 0.88) calc(c * 0.9) h)))` |
| `--sf-color-danger-muted` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-danger) l c h / 0.3)` |
| `--sf-color-danger-source-dark` | PUBLIC | knob | Core | `oklch(0.71 0.198 12) (registered)` |
| `--sf-color-danger-source-light` | PUBLIC | knob | Core | `oklch(0.48 0.22 12)` |
| `--sf-color-danger-strong` | PUBLIC | consumption | Core | `light-dark( oklch(from var(--sf-color-danger-source-light) calc(l - 0.1) c h), oklch(from var(--sf-color-danger) clamp(0.70, calc(l + 0.15), 1) c h) )` |
| `--sf-color-danger-subtle` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-danger) l c h / 0.1)` |
| `--sf-color-danger-tint` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-danger) l c h / 0.05)` |
| `--sf-color-dim` | PUBLIC | knob | Core | `oklch(0 0 0 / 0.5)` |
| `--sf-color-heading` | PUBLIC | consumption | Core | `light-dark( oklch(from var(--sf-color-neutral-source-light) clamp(0.05, calc(l - 0.4 - var(--sf-contrast-bias)), 0.35) c h), oklch(from var(--sf-color-neutral) clamp(0.70, calc(l + 0.25 + var(--sf-contrast-bias)), 1) c h) )` |
| `--sf-color-info` | PUBLIC | consumption | Core | `light-dark(var(--sf-color-info-source-light), var(--sf-color-info-source-dark, oklch(from var(--sf-color-info-source-light) clamp(0.65, calc(0.95 - l * 0.5), 0.88) calc(c * 0.9) h)))` |
| `--sf-color-info-muted` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-info) l c h / 0.3)` |
| `--sf-color-info-source-dark` | PUBLIC | knob | Core | `oklch(0.71 0.162 235) (registered)` |
| `--sf-color-info-source-light` | PUBLIC | knob | Core | `oklch(0.48 0.18 235)` |
| `--sf-color-info-strong` | PUBLIC | consumption | Core | `light-dark( oklch(from var(--sf-color-info-source-light) calc(l - 0.1) c h), oklch(from var(--sf-color-info) clamp(0.70, calc(l + 0.15), 1) c h) )` |
| `--sf-color-info-subtle` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-info) l c h / 0.1)` |
| `--sf-color-info-tint` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-info) l c h / 0.05)` |
| `--sf-color-inset` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-base) calc(l - 0.02) c h)` |
| `--sf-color-inverse` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-base) calc(1 - l) c h)` |
| `--sf-color-link` | PUBLIC | consumption | Core | `light-dark( oklch(from var(--sf-color-action) clamp(0, min(l - 0.07, 0.48), 1) c h), oklch(from var(--sf-color-action) clamp(0.68, l, 1) c h) )` |
| `--sf-color-link--active` | PUBLIC | consumption | Core | `light-dark( oklch(from var(--sf-color-action) clamp(0, min(l - 0.21, 0.34), 1) c h), oklch(from var(--sf-color-action) clamp(0, max(l + 0.15, 0.74), 1) c h) )` |
| `--sf-color-link--disabled` | PUBLIC | consumption | Core | `var(--sf-color-text--disabled)` |
| `--sf-color-link--hover` | PUBLIC | consumption | Core | `light-dark( oklch(from var(--sf-color-action) clamp(0, min(l - 0.15, 0.40), 1) c h), oklch(from var(--sf-color-action) clamp(0, max(l + 0.10, 0.68), 1) c h) )` |
| `--sf-color-link--underline` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-action) l c h / 0.3)` |
| `--sf-color-link--visited` | PUBLIC | consumption | Core | `light-dark( oklch(from var(--sf-color-action) clamp(0, min(l - 0.07, 0.48), 1) c calc(h + 60)), oklch(from var(--sf-color-action) clamp(0.68, l, 1) c calc(h + 60)) )` |
| `--sf-color-mark-bg` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-warning) l c h / 0.25)` |
| `--sf-color-mark-text` | PUBLIC | knob | Core | `inherit` |
| `--sf-color-neutral` | PUBLIC | consumption | Core | `light-dark(var(--sf-color-neutral-source-light), var(--sf-color-neutral-source-dark, oklch(from var(--sf-color-neutral-source-light) clamp(0.65, calc(0.95 - l * 0.5), 0.88) calc(c * 0.9) h)))` |
| `--sf-color-neutral--active` | PUBLIC | consumption | Core | `var(--sf-color-neutral-xdark)` |
| `--sf-color-neutral--hover` | PUBLIC | consumption | Core | `var(--sf-color-neutral-darker)` |
| `--sf-color-neutral-100` | PUBLIC | consumption | Core | `color-mix(in oklab, var(--sf-color-neutral) var(--sf-palette-mix-100), var(--sf-color-surface))` |
| `--sf-color-neutral-200` | PUBLIC | consumption | Core | `color-mix(in oklab, var(--sf-color-neutral) var(--sf-palette-mix-200), var(--sf-color-surface))` |
| `--sf-color-neutral-300` | PUBLIC | consumption | Core | `color-mix(in oklab, var(--sf-color-neutral) var(--sf-palette-mix-300), var(--sf-color-surface))` |
| `--sf-color-neutral-400` | PUBLIC | consumption | Core | `color-mix(in oklab, var(--sf-color-neutral) var(--sf-palette-mix-400), var(--sf-color-surface))` |
| `--sf-color-neutral-50` | PUBLIC | consumption | Core | `color-mix(in oklab, var(--sf-color-neutral) var(--sf-palette-mix-50), var(--sf-color-surface))` |
| `--sf-color-neutral-500` | PUBLIC | consumption | Core | `var(--sf-color-neutral)` |
| `--sf-color-neutral-600` | PUBLIC | consumption | Core | `color-mix(in oklab, var(--sf-color-neutral) var(--sf-palette-mix-600), var(--sf-color-text))` |
| `--sf-color-neutral-700` | PUBLIC | consumption | Core | `color-mix(in oklab, var(--sf-color-neutral) var(--sf-palette-mix-700), var(--sf-color-text))` |
| `--sf-color-neutral-800` | PUBLIC | consumption | Core | `color-mix(in oklab, var(--sf-color-neutral) var(--sf-palette-mix-800), var(--sf-color-text))` |
| `--sf-color-neutral-900` | PUBLIC | consumption | Core | `color-mix(in oklab, var(--sf-color-neutral) var(--sf-palette-mix-900), var(--sf-color-text))` |
| `--sf-color-neutral-950` | PUBLIC | consumption | Core | `color-mix(in oklab, var(--sf-color-neutral) var(--sf-palette-mix-950), var(--sf-color-text))` |
| `--sf-color-neutral-a10` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-neutral) l c h / 0.10)` |
| `--sf-color-neutral-a30` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-neutral) l c h / 0.30)` |
| `--sf-color-neutral-a5` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-neutral) l c h / 0.05)` |
| `--sf-color-neutral-a50` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-neutral) l c h / 0.50)` |
| `--sf-color-neutral-a80` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-neutral) l c h / 0.80)` |
| `--sf-color-neutral-darker` | PUBLIC | consumption | Core | `var(--sf-color-neutral-600)` |
| `--sf-color-neutral-lighter` | PUBLIC | consumption | Core | `var(--sf-color-neutral-400)` |
| `--sf-color-neutral-muted` | PUBLIC | consumption | Core | `var(--sf-color-neutral-a30)` |
| `--sf-color-neutral-source-dark` | PUBLIC | knob | Core | `oklch(0.69 0.0225 260) (registered)` |
| `--sf-color-neutral-source-light` | PUBLIC | knob | Core | `oklch(0.52 0.025 260)` |
| `--sf-color-neutral-subtle` | PUBLIC | consumption | Core | `var(--sf-color-neutral-a10)` |
| `--sf-color-neutral-superdark` | PUBLIC | consumption | Core | `var(--sf-color-neutral-950)` |
| `--sf-color-neutral-superlight` | PUBLIC | consumption | Core | `var(--sf-color-neutral-50)` |
| `--sf-color-neutral-tint` | PUBLIC | consumption | Core | `var(--sf-color-neutral-a5)` |
| `--sf-color-neutral-xdark` | PUBLIC | consumption | Core | `var(--sf-color-neutral-800)` |
| `--sf-color-neutral-xlight` | PUBLIC | consumption | Core | `var(--sf-color-neutral-200)` |
| `--sf-color-overlay` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-base) l c h / 0.9)` |
| `--sf-color-primary` | PUBLIC | consumption | Core | `light-dark(var(--sf-color-primary-source-light), var(--sf-color-primary-source-dark, oklch(from var(--sf-color-primary-source-light) clamp(0.65, calc(0.95 - l * 0.5), 0.88) calc(c * 0.9) h)))` |
| `--sf-color-primary--active` | PUBLIC | consumption | Core | `var(--sf-color-primary-xdark)` |
| `--sf-color-primary--hover` | PUBLIC | consumption | Core | `var(--sf-color-primary-darker)` |
| `--sf-color-primary-100` | PUBLIC | consumption | Core | `color-mix(in oklab, var(--sf-color-primary) var(--sf-palette-mix-100), var(--sf-color-surface))` |
| `--sf-color-primary-200` | PUBLIC | consumption | Core | `color-mix(in oklab, var(--sf-color-primary) var(--sf-palette-mix-200), var(--sf-color-surface))` |
| `--sf-color-primary-300` | PUBLIC | consumption | Core | `color-mix(in oklab, var(--sf-color-primary) var(--sf-palette-mix-300), var(--sf-color-surface))` |
| `--sf-color-primary-400` | PUBLIC | consumption | Core | `color-mix(in oklab, var(--sf-color-primary) var(--sf-palette-mix-400), var(--sf-color-surface))` |
| `--sf-color-primary-50` | PUBLIC | consumption | Core | `color-mix(in oklab, var(--sf-color-primary) var(--sf-palette-mix-50), var(--sf-color-surface))` |
| `--sf-color-primary-500` | PUBLIC | consumption | Core | `var(--sf-color-primary)` |
| `--sf-color-primary-600` | PUBLIC | consumption | Core | `color-mix(in oklab, var(--sf-color-primary) var(--sf-palette-mix-600), var(--sf-color-text))` |
| `--sf-color-primary-700` | PUBLIC | consumption | Core | `color-mix(in oklab, var(--sf-color-primary) var(--sf-palette-mix-700), var(--sf-color-text))` |
| `--sf-color-primary-800` | PUBLIC | consumption | Core | `color-mix(in oklab, var(--sf-color-primary) var(--sf-palette-mix-800), var(--sf-color-text))` |
| `--sf-color-primary-900` | PUBLIC | consumption | Core | `color-mix(in oklab, var(--sf-color-primary) var(--sf-palette-mix-900), var(--sf-color-text))` |
| `--sf-color-primary-950` | PUBLIC | consumption | Core | `color-mix(in oklab, var(--sf-color-primary) var(--sf-palette-mix-950), var(--sf-color-text))` |
| `--sf-color-primary-a10` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-primary) l c h / 0.10)` |
| `--sf-color-primary-a30` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-primary) l c h / 0.30)` |
| `--sf-color-primary-a5` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-primary) l c h / 0.05)` |
| `--sf-color-primary-a50` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-primary) l c h / 0.50)` |
| `--sf-color-primary-a80` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-primary) l c h / 0.80)` |
| `--sf-color-primary-darker` | PUBLIC | consumption | Core | `var(--sf-color-primary-600)` |
| `--sf-color-primary-lighter` | PUBLIC | consumption | Core | `var(--sf-color-primary-400)` |
| `--sf-color-primary-muted` | PUBLIC | consumption | Core | `var(--sf-color-primary-a30)` |
| `--sf-color-primary-source-dark` | PUBLIC | knob | Core | `oklch(0.715 0.243 264) (registered)` |
| `--sf-color-primary-source-light` | PUBLIC | knob | Core | `oklch(0.47 0.27 264)` |
| `--sf-color-primary-subtle` | PUBLIC | consumption | Core | `var(--sf-color-primary-a10)` |
| `--sf-color-primary-superdark` | PUBLIC | consumption | Core | `var(--sf-color-primary-950)` |
| `--sf-color-primary-superlight` | PUBLIC | consumption | Core | `var(--sf-color-primary-50)` |
| `--sf-color-primary-tint` | PUBLIC | consumption | Core | `var(--sf-color-primary-a5)` |
| `--sf-color-primary-xdark` | PUBLIC | consumption | Core | `var(--sf-color-primary-800)` |
| `--sf-color-primary-xlight` | PUBLIC | consumption | Core | `var(--sf-color-primary-200)` |
| `--sf-color-raised` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-base) calc(l + 0.04) c h)` |
| `--sf-color-scheme` | PUBLIC | knob | Core | `light dark` |
| `--sf-color-secondary` | PUBLIC | consumption | Core | `light-dark(var(--sf-color-secondary-source-light), var(--sf-color-secondary-source-dark, oklch(from var(--sf-color-secondary-source-light) clamp(0.65, calc(0.95 - l * 0.5), 0.88) calc(c * 0.9) h)))` |
| `--sf-color-secondary--active` | PUBLIC | consumption | Core | `var(--sf-color-secondary-xdark)` |
| `--sf-color-secondary--hover` | PUBLIC | consumption | Core | `var(--sf-color-secondary-darker)` |
| `--sf-color-secondary-100` | PUBLIC | consumption | Core | `color-mix(in oklab, var(--sf-color-secondary) var(--sf-palette-mix-100), var(--sf-color-surface))` |
| `--sf-color-secondary-200` | PUBLIC | consumption | Core | `color-mix(in oklab, var(--sf-color-secondary) var(--sf-palette-mix-200), var(--sf-color-surface))` |
| `--sf-color-secondary-300` | PUBLIC | consumption | Core | `color-mix(in oklab, var(--sf-color-secondary) var(--sf-palette-mix-300), var(--sf-color-surface))` |
| `--sf-color-secondary-400` | PUBLIC | consumption | Core | `color-mix(in oklab, var(--sf-color-secondary) var(--sf-palette-mix-400), var(--sf-color-surface))` |
| `--sf-color-secondary-50` | PUBLIC | consumption | Core | `color-mix(in oklab, var(--sf-color-secondary) var(--sf-palette-mix-50), var(--sf-color-surface))` |
| `--sf-color-secondary-500` | PUBLIC | consumption | Core | `var(--sf-color-secondary)` |
| `--sf-color-secondary-600` | PUBLIC | consumption | Core | `color-mix(in oklab, var(--sf-color-secondary) var(--sf-palette-mix-600), var(--sf-color-text))` |
| `--sf-color-secondary-700` | PUBLIC | consumption | Core | `color-mix(in oklab, var(--sf-color-secondary) var(--sf-palette-mix-700), var(--sf-color-text))` |
| `--sf-color-secondary-800` | PUBLIC | consumption | Core | `color-mix(in oklab, var(--sf-color-secondary) var(--sf-palette-mix-800), var(--sf-color-text))` |
| `--sf-color-secondary-900` | PUBLIC | consumption | Core | `color-mix(in oklab, var(--sf-color-secondary) var(--sf-palette-mix-900), var(--sf-color-text))` |
| `--sf-color-secondary-950` | PUBLIC | consumption | Core | `color-mix(in oklab, var(--sf-color-secondary) var(--sf-palette-mix-950), var(--sf-color-text))` |
| `--sf-color-secondary-a10` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-secondary) l c h / 0.10)` |
| `--sf-color-secondary-a30` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-secondary) l c h / 0.30)` |
| `--sf-color-secondary-a5` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-secondary) l c h / 0.05)` |
| `--sf-color-secondary-a50` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-secondary) l c h / 0.50)` |
| `--sf-color-secondary-a80` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-secondary) l c h / 0.80)` |
| `--sf-color-secondary-darker` | PUBLIC | consumption | Core | `var(--sf-color-secondary-600)` |
| `--sf-color-secondary-lighter` | PUBLIC | consumption | Core | `var(--sf-color-secondary-400)` |
| `--sf-color-secondary-muted` | PUBLIC | consumption | Core | `var(--sf-color-secondary-a30)` |
| `--sf-color-secondary-source-dark` | PUBLIC | knob | Core | `oklch(0.84 0.036 264) (registered)` |
| `--sf-color-secondary-source-light` | PUBLIC | knob | Core | `oklch(0.22 0.04 264)` |
| `--sf-color-secondary-subtle` | PUBLIC | consumption | Core | `var(--sf-color-secondary-a10)` |
| `--sf-color-secondary-superdark` | PUBLIC | consumption | Core | `var(--sf-color-secondary-950)` |
| `--sf-color-secondary-superlight` | PUBLIC | consumption | Core | `var(--sf-color-secondary-50)` |
| `--sf-color-secondary-tint` | PUBLIC | consumption | Core | `var(--sf-color-secondary-a5)` |
| `--sf-color-secondary-xdark` | PUBLIC | consumption | Core | `var(--sf-color-secondary-800)` |
| `--sf-color-secondary-xlight` | PUBLIC | consumption | Core | `var(--sf-color-secondary-200)` |
| `--sf-color-selection-bg` | PUBLIC | consumption | Core | `light-dark( oklch(from var(--sf-color-action-source-light) l c h / 0.28), oklch(from var(--sf-color-action-source-dark) clamp(0.62, calc(0.93 - l * 0.4), 0.78) c h / 0.55) )` |
| `--sf-color-selection-bg--alt` | PUBLIC | consumption | Core | `light-dark( oklch(from var(--sf-color-action-source-dark) clamp(0.62, calc(0.93 - l * 0.4), 0.78) c h / 0.55), oklch(from var(--sf-color-action-source-light) l c h / 0.28) )` |
| `--sf-color-selection-text` | PUBLIC | knob | Core | `inherit` |
| `--sf-color-selection-text--alt` | PUBLIC | knob | Core | `inherit` |
| `--sf-color-success` | PUBLIC | consumption | Core | `light-dark(var(--sf-color-success-source-light), var(--sf-color-success-source-dark, oklch(from var(--sf-color-success-source-light) clamp(0.65, calc(0.95 - l * 0.5), 0.88) calc(c * 0.9) h)))` |
| `--sf-color-success-muted` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-success) l c h / 0.3)` |
| `--sf-color-success-source-dark` | PUBLIC | knob | Core | `oklch(0.70 0.144 145) (registered)` |
| `--sf-color-success-source-light` | PUBLIC | knob | Core | `oklch(0.50 0.16 145)` |
| `--sf-color-success-strong` | PUBLIC | consumption | Core | `light-dark( oklch(from var(--sf-color-success-source-light) calc(l - 0.15) c h), oklch(from var(--sf-color-success) clamp(0.70, calc(l + 0.15), 1) c h) )` |
| `--sf-color-success-subtle` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-success) l c h / 0.12)` |
| `--sf-color-success-tint` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-success) l c h / 0.05)` |
| `--sf-color-surface` | PUBLIC | consumption | Core | `var(--sf-color-base)` |
| `--sf-color-tertiary` | PUBLIC | consumption | Core | `light-dark(var(--sf-color-tertiary-source-light), var(--sf-color-tertiary-source-dark, oklch(from var(--sf-color-tertiary-source-light) clamp(0.65, calc(0.95 - l * 0.5), 0.88) calc(c * 0.9) h)))` |
| `--sf-color-tertiary--active` | PUBLIC | consumption | Core | `var(--sf-color-tertiary-xdark)` |
| `--sf-color-tertiary--hover` | PUBLIC | consumption | Core | `var(--sf-color-tertiary-darker)` |
| `--sf-color-tertiary-100` | PUBLIC | consumption | Core | `color-mix(in oklab, var(--sf-color-tertiary) var(--sf-palette-mix-100), var(--sf-color-surface))` |
| `--sf-color-tertiary-200` | PUBLIC | consumption | Core | `color-mix(in oklab, var(--sf-color-tertiary) var(--sf-palette-mix-200), var(--sf-color-surface))` |
| `--sf-color-tertiary-300` | PUBLIC | consumption | Core | `color-mix(in oklab, var(--sf-color-tertiary) var(--sf-palette-mix-300), var(--sf-color-surface))` |
| `--sf-color-tertiary-400` | PUBLIC | consumption | Core | `color-mix(in oklab, var(--sf-color-tertiary) var(--sf-palette-mix-400), var(--sf-color-surface))` |
| `--sf-color-tertiary-50` | PUBLIC | consumption | Core | `color-mix(in oklab, var(--sf-color-tertiary) var(--sf-palette-mix-50), var(--sf-color-surface))` |
| `--sf-color-tertiary-500` | PUBLIC | consumption | Core | `var(--sf-color-tertiary)` |
| `--sf-color-tertiary-600` | PUBLIC | consumption | Core | `color-mix(in oklab, var(--sf-color-tertiary) var(--sf-palette-mix-600), var(--sf-color-text))` |
| `--sf-color-tertiary-700` | PUBLIC | consumption | Core | `color-mix(in oklab, var(--sf-color-tertiary) var(--sf-palette-mix-700), var(--sf-color-text))` |
| `--sf-color-tertiary-800` | PUBLIC | consumption | Core | `color-mix(in oklab, var(--sf-color-tertiary) var(--sf-palette-mix-800), var(--sf-color-text))` |
| `--sf-color-tertiary-900` | PUBLIC | consumption | Core | `color-mix(in oklab, var(--sf-color-tertiary) var(--sf-palette-mix-900), var(--sf-color-text))` |
| `--sf-color-tertiary-950` | PUBLIC | consumption | Core | `color-mix(in oklab, var(--sf-color-tertiary) var(--sf-palette-mix-950), var(--sf-color-text))` |
| `--sf-color-tertiary-a10` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-tertiary) l c h / 0.10)` |
| `--sf-color-tertiary-a30` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-tertiary) l c h / 0.30)` |
| `--sf-color-tertiary-a5` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-tertiary) l c h / 0.05)` |
| `--sf-color-tertiary-a50` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-tertiary) l c h / 0.50)` |
| `--sf-color-tertiary-a80` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-tertiary) l c h / 0.80)` |
| `--sf-color-tertiary-darker` | PUBLIC | consumption | Core | `var(--sf-color-tertiary-600)` |
| `--sf-color-tertiary-lighter` | PUBLIC | consumption | Core | `var(--sf-color-tertiary-400)` |
| `--sf-color-tertiary-muted` | PUBLIC | consumption | Core | `var(--sf-color-tertiary-a30)` |
| `--sf-color-tertiary-source-dark` | PUBLIC | knob | Core | `oklch(0.74 0.198 295) (registered)` |
| `--sf-color-tertiary-source-light` | PUBLIC | knob | Core | `oklch(0.42 0.22 295)` |
| `--sf-color-tertiary-subtle` | PUBLIC | consumption | Core | `var(--sf-color-tertiary-a10)` |
| `--sf-color-tertiary-superdark` | PUBLIC | consumption | Core | `var(--sf-color-tertiary-950)` |
| `--sf-color-tertiary-superlight` | PUBLIC | consumption | Core | `var(--sf-color-tertiary-50)` |
| `--sf-color-tertiary-tint` | PUBLIC | consumption | Core | `var(--sf-color-tertiary-a5)` |
| `--sf-color-tertiary-xdark` | PUBLIC | consumption | Core | `var(--sf-color-tertiary-800)` |
| `--sf-color-tertiary-xlight` | PUBLIC | consumption | Core | `var(--sf-color-tertiary-200)` |
| `--sf-color-text` | PUBLIC | consumption | Core | `light-dark( oklch(from var(--sf-color-neutral-source-light) clamp(0.05, calc(l - 0.4 - var(--sf-contrast-bias)), 0.35) c h), oklch(from var(--sf-color-neutral) clamp(0.70, calc(l + 0.25 + var(--sf-contrast-bias)), 1) c h) )` |
| `--sf-color-text--disabled` | PUBLIC | consumption | Core | `light-dark( oklch(from var(--sf-color-neutral-source-light) clamp(0.55, calc(l + 0.25), 0.82) c h), oklch(from var(--sf-color-neutral) clamp(0.25, calc(l - 0.2), 0.55) c h) )` |
| `--sf-color-text--inverse` | PUBLIC | consumption | Core | `light-dark( oklch(from var(--sf-color-neutral-source-light) clamp(0.85, calc(l + 0.4), 0.98) c h), oklch(from var(--sf-color-neutral) clamp(0.05, calc(l - 0.4), 0.35) c h) )` |
| `--sf-color-text--muted` | PUBLIC | consumption | Core | `light-dark( oklch(from var(--sf-color-neutral-source-light) clamp(0.35, calc(l - var(--sf-contrast-bias)), 0.62) c h), oklch(from var(--sf-color-neutral) clamp(0.48, calc(l + var(--sf-contrast-bias)), 0.74) c h) )` |
| `--sf-color-text--on-action` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-action) clamp(0.1, sign(var(--sf-contrast-threshold) - l) * 999, 0.95) 0 0)` |
| `--sf-color-text--on-base` | PUBLIC | consumption | Core | `var(--sf-color-text)` |
| `--sf-color-text--on-danger` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-danger) clamp(0.1, sign(var(--sf-contrast-threshold) - l) * 999, 0.95) 0 0)` |
| `--sf-color-text--on-info` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-info) clamp(0.1, sign(var(--sf-contrast-threshold) - l) * 999, 0.95) 0 0)` |
| `--sf-color-text--on-inverse` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-inverse) clamp(0.1, sign(var(--sf-contrast-threshold) - l) * 999, 0.95) 0 0)` |
| `--sf-color-text--on-neutral` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-neutral) clamp(0.1, sign(var(--sf-contrast-threshold) - l) * 999, 0.95) 0 0)` |
| `--sf-color-text--on-primary` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-primary) clamp(0.1, sign(var(--sf-contrast-threshold) - l) * 999, 0.95) 0 0)` |
| `--sf-color-text--on-secondary` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-secondary) clamp(0.1, sign(var(--sf-contrast-threshold) - l) * 999, 0.95) 0 0)` |
| `--sf-color-text--on-success` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-success) clamp(0.1, sign(var(--sf-contrast-threshold) - l) * 999, 0.95) 0 0)` |
| `--sf-color-text--on-tertiary` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-tertiary) clamp(0.1, sign(var(--sf-contrast-threshold) - l) * 999, 0.95) 0 0)` |
| `--sf-color-text--on-warning` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-warning) clamp(0.1, sign(var(--sf-contrast-threshold) - l) * 999, 0.95) 0 0)` |
| `--sf-color-text--placeholder` | PUBLIC | consumption | Core | `light-dark( oklch(from var(--sf-color-neutral-source-light) clamp(0.45, calc(l + 0.15), 0.75) c h), oklch(from var(--sf-color-neutral) clamp(0.35, calc(l - 0.1), 0.65) c h) )` |
| `--sf-color-text--secondary` | PUBLIC | consumption | Core | `light-dark( oklch(from var(--sf-color-neutral-source-light) clamp(0.15, calc(l - 0.25 - var(--sf-contrast-bias)), 0.45) c h), oklch(from var(--sf-color-neutral) clamp(0.55, calc(l + 0.1 + var(--sf-contrast-bias)), 0.90) c h) )` |
| `--sf-color-warning` | PUBLIC | consumption | Core | `light-dark(var(--sf-color-warning-source-light), var(--sf-color-warning-source-dark, oklch(from var(--sf-color-warning-source-light) clamp(0.65, calc(0.95 - l * 0.5), 0.88) calc(c * 0.9) h)))` |
| `--sf-color-warning-muted` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-warning) l c h / 0.3)` |
| `--sf-color-warning-source-dark` | PUBLIC | knob | Core | `oklch(0.65 0.153 80) (registered)` |
| `--sf-color-warning-source-light` | PUBLIC | knob | Core | `oklch(0.75 0.17 80)` |
| `--sf-color-warning-strong` | PUBLIC | consumption | Core | `light-dark( oklch(from var(--sf-color-warning-source-light) calc(l - 0.25) c h), oklch(from var(--sf-color-warning) clamp(0.70, calc(l + 0.05), 1) c h) )` |
| `--sf-color-warning-subtle` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-warning) l c h / 0.12)` |
| `--sf-color-warning-tint` | PUBLIC | consumption | Core | `oklch(from var(--sf-color-warning) l c h / 0.05)` |
| `--sf-color-white` | PUBLIC | knob | Core | `oklch(100% 0 0)` |
| `--sf-component-pad` | PUBLIC | consumption | Core | `var(--sf-space-m)` |
| `--sf-container-default` | PUBLIC | knob | Core | `75rem` |
| `--sf-container-full` | PUBLIC | knob | Core | `100%` |
| `--sf-container-narrow` | PUBLIC | knob | Core | `38rem` |
| `--sf-container-prose` | PUBLIC | knob | Core | `65ch` |
| `--sf-container-wide` | PUBLIC | knob | Core | `90rem` |
| `--sf-content-gap` | PUBLIC | consumption | Core | `var(--sf-space-s)` |
| `--sf-content-intrinsic-size` | PUBLIC | knob | Macros | `500px` |
| `--sf-content-width` | PUBLIC | consumption | Layout | `var(--sf-container-default)` |
| `--sf-contrast-bias` | PUBLIC-ADVANCED | knob | Core | `0` |
| `--sf-contrast-threshold` | PUBLIC-ADVANCED | knob | Core | `0.6` |
| `--sf-corner-scoop-at` | PUBLIC | knob | Macros | `100% 0` |
| `--sf-corner-scoop-size` | PUBLIC | consumption | Macros | `var(--sf-radius-2xl)` |
| `--sf-cover-min-height` | PUBLIC | knob | Layout | `100dvh` |
| `--sf-cover-padding` | PUBLIC | consumption | Layout | `var(--sf-section-pad)` |
| `--sf-current-font-weight` | PUBLIC | consumption | Core | `var(--sf-font-weight-bold)` |
| `--sf-density` | PUBLIC-ADVANCED | knob | Core | `1` |
| `--sf-display-l-line-height` | PUBLIC | knob | Core | `1` |
| `--sf-display-m-line-height` | PUBLIC | knob | Core | `1.05` |
| `--sf-display-s-line-height` | PUBLIC | consumption | Core | `var(--sf-leading-tight)` |
| `--sf-divider-color` | PUBLIC | consumption | Core | `var(--sf-color-border)` |
| `--sf-divider-gap` | PUBLIC | consumption | Core | `var(--sf-space-m)` |
| `--sf-divider-style` | PUBLIC | knob | Core | `solid` |
| `--sf-divider-width` | PUBLIC | consumption | Core | `var(--sf-border-width-1)` |
| `--sf-drop-shadow-l` | PUBLIC | consumption | Core | `drop-shadow(0 8px 16px oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 2.5), 0.7)))` |
| `--sf-drop-shadow-m` | PUBLIC | consumption | Core | `drop-shadow(0 4px 6px oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 2), 0.7)))` |
| `--sf-drop-shadow-s` | PUBLIC | consumption | Core | `drop-shadow(0 1px 2px oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 1.5), 0.7)))` |
| `--sf-drop-shadow-xl` | PUBLIC | consumption | Core | `drop-shadow(0 16px 32px oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 3), 0.7)))` |
| `--sf-drop-shadow-xs` | PUBLIC | consumption | Core | `drop-shadow(0 0.5px 1px oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 1), 0.7)))` |
| `--sf-duration-fast` | PUBLIC | consumption | Core | `calc(150ms * var(--sf-motion-scale))` |
| `--sf-duration-instant` | PUBLIC | consumption | Core | `calc(100ms * var(--sf-motion-scale))` |
| `--sf-duration-none` | PUBLIC | knob | Core | `0ms` |
| `--sf-duration-normal` | PUBLIC | consumption | Core | `calc(250ms * var(--sf-motion-scale))` |
| `--sf-duration-slow` | PUBLIC | consumption | Core | `calc(400ms * var(--sf-motion-scale))` |
| `--sf-duration-slower` | PUBLIC | consumption | Core | `calc(600ms * var(--sf-motion-scale))` |
| `--sf-ease-bounce` | PUBLIC | knob | Core | `linear(0, 0.35 18%, 1 32%, 0.86 42%, 1.02 56%, 0.98 72%, 1)` |
| `--sf-ease-elastic` | PUBLIC | knob | Core | `linear(0, 0.3, 1.2, 0.9, 1.05, 1)` |
| `--sf-ease-in` | PUBLIC | knob | Core | `cubic-bezier(0.5, 0, 0.75, 0.25)` |
| `--sf-ease-in-out` | PUBLIC | knob | Core | `cubic-bezier(0.4, 0, 0.2, 1)` |
| `--sf-ease-linear` | PUBLIC | knob | Core | `linear` |
| `--sf-ease-out` | PUBLIC | knob | Core | `cubic-bezier(0.25, 0, 0.15, 1)` |
| `--sf-ease-overshoot` | PUBLIC | knob | Core | `linear(0, 0.6 30%, 1.08 55%, 0.98 75%, 1)` |
| `--sf-ease-spring` | PUBLIC | knob | Core | `linear(0, 0.5, 1.1, 0.95, 1.02, 1)` |
| `--sf-equal-gap` | PUBLIC | consumption | Layout | `var(--sf-gap)` |
| `--sf-equal-min-col` | PUBLIC | knob | Layout | `16rem` |
| `--sf-equal-rule-color` | PUBLIC | consumption | Layout | `var(--sf-color-border)` |
| `--sf-equal-rule-style` | PUBLIC | knob | Layout | `solid` |
| `--sf-equal-rule-width` | PUBLIC | knob | Layout | `0` |
| `--sf-field-block` | PUBLIC | consumption | Core | `var(--sf-space-xs)` |
| `--sf-field-padding-block` | PUBLIC | consumption | Components (optional, incomplete) | `var(--sf-space-xs)` |
| `--sf-field-padding-inline` | PUBLIC | consumption | Components (optional, incomplete) | `var(--sf-space-s)` |
| `--sf-field-radius` | PUBLIC | consumption | Components (optional, incomplete) | `var(--sf-radius-m)` |
| `--sf-field-required-marker` | PUBLIC | knob | Core | `" *"` |
| `--sf-flow-space` | PUBLIC | consumption | Macros | `var(--sf-content-gap)` |
| `--sf-fluid-max-vw` | PUBLIC-ADVANCED | knob | Core | `90` |
| `--sf-fluid-min-vw` | PUBLIC-ADVANCED | knob | Core | `22.5` |
| `--sf-fluid-width` | PUBLIC | knob | Core | `100vw` |
| `--sf-focus-ring-color` | PUBLIC | consumption | Core | `var(--sf-color-action)` |
| `--sf-focus-ring-offset` | PUBLIC | knob | Core | `2px` |
| `--sf-focus-ring-shadow` | PUBLIC-ADVANCED | consumption | Core | `0 0 0 var(--sf-focus-ring-offset) var(--sf-color-bg, var(--sf-color-base-source-light, #fff)), 0 0 0 calc(var(--sf-focus-ring-offset) + var(--sf-focus-ring-width)) var(--sf-focus-ring-color)` |
| `--sf-focus-ring-style` | PUBLIC | knob | Core | `solid` |
| `--sf-focus-ring-width` | PUBLIC | knob | Core | `2px` |
| `--sf-font-body` | PUBLIC | knob | Core | `system-ui, -apple-system, sans-serif` |
| `--sf-font-display` | PUBLIC | consumption | Core | `var(--sf-font-heading)` |
| `--sf-font-features` | PUBLIC-ADVANCED | knob | Core | `normal` |
| `--sf-font-geometric` | PUBLIC | knob | Core | `"Avenir", "Montserrat", "Corbel", "URW Gothic", source-sans-pro, sans-serif` |
| `--sf-font-heading` | PUBLIC | consumption | Core | `var(--sf-font-body)` |
| `--sf-font-humanist` | PUBLIC | knob | Core | `"Seravek", "Gill Sans Nova", "Ubuntu", "Calibri", "DejaVu Sans", source-sans-pro, sans-serif` |
| `--sf-font-mono` | PUBLIC | knob | Core | `ui-monospace, monospace` |
| `--sf-font-numeric` | PUBLIC | knob | Core | `tabular-nums` |
| `--sf-font-slab` | PUBLIC | knob | Core | `"Rockwell", "Rockwell Nova", "Roboto Slab", "DejaVu Serif", "Sitka Small", serif` |
| `--sf-font-variation` | PUBLIC-ADVANCED | knob | Core | `normal` |
| `--sf-font-weight-body` | PUBLIC | consumption | Core | `var(--sf-font-weight-normal)` |
| `--sf-font-weight-bold` | PUBLIC | knob | Core | `700` |
| `--sf-font-weight-display` | PUBLIC | consumption | Core | `var(--sf-font-weight-bold)` |
| `--sf-font-weight-heading` | PUBLIC | consumption | Core | `var(--sf-font-weight-semibold)` |
| `--sf-font-weight-interactive` | PUBLIC | consumption | Core | `var(--sf-font-weight-semibold)` |
| `--sf-font-weight-light` | PUBLIC | knob | Core | `300` |
| `--sf-font-weight-medium` | PUBLIC | knob | Core | `500` |
| `--sf-font-weight-normal` | PUBLIC | knob | Core | `400` |
| `--sf-font-weight-semibold` | PUBLIC | knob | Core | `600` |
| `--sf-font-weight-strong` | PUBLIC | consumption | Core | `var(--sf-font-weight-bold)` |
| `--sf-frame-ratio` | PUBLIC | knob | Layout | `16 / 9` |
| `--sf-gap` | PUBLIC | consumption | Core | `var(--sf-space-m)` |
| `--sf-gradient-action` | PUBLIC | consumption | Core | `linear-gradient(in oklch 135deg, var(--sf-color-action), oklch(from var(--sf-color-action) calc(l - 0.08) c h))` |
| `--sf-gradient-brand` | PUBLIC | consumption | Core | `linear-gradient(in oklch 135deg, var(--sf-color-primary), oklch(from var(--sf-color-primary) l c calc(h + 30)))` |
| `--sf-gradient-fade--b` | PUBLIC | consumption | Core | `linear-gradient(in oklch to bottom, transparent, var(--sf-color-bg))` |
| `--sf-gradient-fade--l` | PUBLIC | consumption | Core | `linear-gradient(in oklch to left, transparent, var(--sf-color-bg))` |
| `--sf-gradient-fade--r` | PUBLIC | consumption | Core | `linear-gradient(in oklch to right, transparent, var(--sf-color-bg))` |
| `--sf-gradient-fade--t` | PUBLIC | consumption | Core | `linear-gradient(in oklch to top, transparent, var(--sf-color-bg))` |
| `--sf-gradient-primary` | PUBLIC | consumption | Core | `linear-gradient(in oklch 135deg, var(--sf-color-primary), oklch(from var(--sf-color-primary) calc(l - 0.08) c h))` |
| `--sf-gradient-secondary` | PUBLIC | consumption | Core | `linear-gradient(in oklch 135deg, var(--sf-color-secondary), oklch(from var(--sf-color-secondary) calc(l - 0.08) c h))` |
| `--sf-gradient-surface` | PUBLIC | consumption | Core | `linear-gradient(in oklab 180deg, var(--sf-color-surface), var(--sf-color-bg))` |
| `--sf-gradient-tertiary` | PUBLIC | consumption | Core | `linear-gradient(in oklch 135deg, var(--sf-color-tertiary), oklch(from var(--sf-color-tertiary) calc(l - 0.08) c h))` |
| `--sf-grid-gap` | PUBLIC | consumption | Layout | `var(--sf-gap)` |
| `--sf-grid-min` | PUBLIC | knob | Layout | `16rem` |
| `--sf-grid-min-2xl` | PUBLIC | knob | Layout | `28rem` |
| `--sf-grid-min-l` | PUBLIC | knob | Layout | `20rem` |
| `--sf-grid-min-m` | PUBLIC | knob | Layout | `16rem` |
| `--sf-grid-min-s` | PUBLIC | knob | Layout | `13rem` |
| `--sf-grid-min-xl` | PUBLIC | knob | Layout | `24rem` |
| `--sf-grid-min-xs` | PUBLIC | knob | Layout | `10rem` |
| `--sf-gutter` | PUBLIC | consumption | Core | `var(--sf-space-l)` |
| `--sf-h1-font-weight` | PUBLIC | consumption | Core | `var(--sf-font-weight-heading)` |
| `--sf-h1-letter-spacing` | PUBLIC | consumption | Core | `var(--sf-tracking-tight)` |
| `--sf-h1-line-height` | PUBLIC | consumption | Core | `var(--sf-leading-tight)` |
| `--sf-h1-max-width` | PUBLIC | knob | Core | `none` |
| `--sf-h1-size` | PUBLIC | consumption | Core | `var(--sf-text-4xl)` |
| `--sf-h2-font-weight` | PUBLIC | consumption | Core | `var(--sf-font-weight-heading)` |
| `--sf-h2-letter-spacing` | PUBLIC | consumption | Core | `var(--sf-tracking-tight)` |
| `--sf-h2-line-height` | PUBLIC | consumption | Core | `var(--sf-leading-tight)` |
| `--sf-h2-max-width` | PUBLIC | knob | Core | `none` |
| `--sf-h2-size` | PUBLIC | consumption | Core | `var(--sf-text-3xl)` |
| `--sf-h3-font-weight` | PUBLIC | consumption | Core | `var(--sf-font-weight-heading)` |
| `--sf-h3-letter-spacing` | PUBLIC | consumption | Core | `var(--sf-tracking-normal)` |
| `--sf-h3-line-height` | PUBLIC | consumption | Core | `var(--sf-leading-snug)` |
| `--sf-h3-max-width` | PUBLIC | knob | Core | `none` |
| `--sf-h3-size` | PUBLIC | consumption | Core | `var(--sf-text-2xl)` |
| `--sf-h4-font-weight` | PUBLIC | consumption | Core | `var(--sf-font-weight-heading)` |
| `--sf-h4-letter-spacing` | PUBLIC | consumption | Core | `var(--sf-tracking-normal)` |
| `--sf-h4-line-height` | PUBLIC | consumption | Core | `var(--sf-leading-snug)` |
| `--sf-h4-max-width` | PUBLIC | knob | Core | `none` |
| `--sf-h4-size` | PUBLIC | consumption | Core | `var(--sf-text-xl)` |
| `--sf-h5-font-weight` | PUBLIC | consumption | Core | `var(--sf-font-weight-heading)` |
| `--sf-h5-letter-spacing` | PUBLIC | consumption | Core | `var(--sf-tracking-normal)` |
| `--sf-h5-line-height` | PUBLIC | consumption | Core | `var(--sf-leading-normal)` |
| `--sf-h5-max-width` | PUBLIC | knob | Core | `none` |
| `--sf-h5-size` | PUBLIC | consumption | Core | `var(--sf-text-l)` |
| `--sf-h6-font-weight` | PUBLIC | consumption | Core | `var(--sf-font-weight-heading)` |
| `--sf-h6-letter-spacing` | PUBLIC | consumption | Core | `var(--sf-tracking-wide)` |
| `--sf-h6-line-height` | PUBLIC | consumption | Core | `var(--sf-leading-normal)` |
| `--sf-h6-max-width` | PUBLIC | knob | Core | `none` |
| `--sf-h6-size` | PUBLIC | consumption | Core | `var(--sf-text-m)` |
| `--sf-header-height` | PUBLIC | consumption | Core | `clamp( var(--sf-header-height-mobile), calc((var(--sf-header-height-desktop) - var(--sf-header-height-mobile)) / ((var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * 1rem) * (100vw - var(--sf-fluid-min-vw) * 1rem) + var(--sf-header-height-mobile)), var(--sf-header-height-desktop))` |
| `--sf-header-height-desktop` | PUBLIC | knob | Core | `5rem` |
| `--sf-header-height-mobile` | PUBLIC | knob | Core | `3.5rem` |
| `--sf-heading-color` | PUBLIC | consumption | Core | `var(--sf-color-heading)` |
| `--sf-heading-font-family` | PUBLIC | consumption | Core | `var(--sf-font-heading)` |
| `--sf-heading-text-wrap` | PUBLIC | knob | Core | `balance` |
| `--sf-hover-grow-scale` | PUBLIC | knob | Core | `1.05` |
| `--sf-hover-lift` | PUBLIC | knob | Core | `0.25em` |
| `--sf-hover-shrink-scale` | PUBLIC | knob | Core | `0.95` |
| `--sf-hover-slide` | PUBLIC | knob | Core | `0.5em` |
| `--sf-icon-2xl` | PUBLIC | knob | Core | `4em` |
| `--sf-icon-box-bg` | PUBLIC | consumption | Layout | `var(--sf-color-inset)` |
| `--sf-icon-box-border` | PUBLIC | consumption | Layout | `var(--sf-border-width-1) solid var(--sf-color-border)` |
| `--sf-icon-box-pad` | PUBLIC | knob | Layout | `0.5em` |
| `--sf-icon-box-radius` | PUBLIC | consumption | Layout | `var(--sf-radius-s)` |
| `--sf-icon-l` | PUBLIC | knob | Core | `2em` |
| `--sf-icon-m` | PUBLIC | knob | Core | `1.5em` |
| `--sf-icon-s` | PUBLIC | knob | Core | `1em` |
| `--sf-icon-xl` | PUBLIC | knob | Core | `3em` |
| `--sf-icon-xs` | PUBLIC | knob | Core | `0.875em` |
| `--sf-imposter-margin` | PUBLIC | consumption | Layout | `var(--sf-space-m)` |
| `--sf-is-active` | PUBLIC-ADVANCED | knob | Core | `0 (registered)` |
| `--sf-is-current` | PUBLIC-ADVANCED | knob | Core | `0 (registered)` |
| `--sf-is-dark` | INTERNAL | knob | Core | `0 (registered)` |
| `--sf-is-open` | PUBLIC-ADVANCED | knob | Core | `0 (registered)` |
| `--sf-is-pressed` | PUBLIC-ADVANCED | knob | Core | `0 (registered)` |
| `--sf-leading-normal` | PUBLIC | knob | Core | `1.5` |
| `--sf-leading-relaxed` | PUBLIC | knob | Core | `1.625` |
| `--sf-leading-snug` | PUBLIC | knob | Core | `1.3` |
| `--sf-leading-taper` | PUBLIC-ADVANCED | knob | Core | `0` |
| `--sf-leading-tight` | PUBLIC | knob | Core | `1.1` |
| `--sf-line-clamp` | PUBLIC | knob | Macros | `3` |
| `--sf-link-external-label` | PUBLIC | knob | Core | `"opens in a new window or external site"` |
| `--sf-link-external-marker` | PUBLIC | knob | Core | `" \\2197"` |
| `--sf-link-underline-offset` | PUBLIC | knob | Core | `0.15em` |
| `--sf-link-underline-thickness` | PUBLIC | knob | Core | `auto` |
| `--sf-lumlocker` | PUBLIC-ADVANCED | knob | Core | `0.65` |
| `--sf-mask-scrim-end` | PUBLIC-ADVANCED | consumption | Core | `var(--sf-space-l)` |
| `--sf-mask-scrim-start` | PUBLIC-ADVANCED | consumption | Core | `var(--sf-space-l)` |
| `--sf-media-radius` | PUBLIC | knob | Core | `0` |
| `--sf-motion-scale` | PUBLIC-ADVANCED | knob | Core | `1` |
| `--sf-object-fit` | PUBLIC | knob | Core | `cover` |
| `--sf-object-position` | PUBLIC | knob | Core | `50% 50%` |
| `--sf-opacity-disabled` | PUBLIC | knob | Core | `0.45` |
| `--sf-opacity-muted` | PUBLIC | knob | Core | `0.5` |
| `--sf-optical-sizing` | PUBLIC-ADVANCED | knob | Core | `auto` |
| `--sf-overlap-pull` | PUBLIC | consumption | Macros | `var(--sf-space-xl)` |
| `--sf-palette-mix-100` | PUBLIC-ADVANCED | knob | Core | `8%` |
| `--sf-palette-mix-200` | PUBLIC-ADVANCED | knob | Core | `20%` |
| `--sf-palette-mix-300` | PUBLIC-ADVANCED | knob | Core | `40%` |
| `--sf-palette-mix-400` | PUBLIC-ADVANCED | knob | Core | `65%` |
| `--sf-palette-mix-50` | PUBLIC-ADVANCED | knob | Core | `4%` |
| `--sf-palette-mix-600` | PUBLIC-ADVANCED | knob | Core | `82%` |
| `--sf-palette-mix-700` | PUBLIC-ADVANCED | knob | Core | `62%` |
| `--sf-palette-mix-800` | PUBLIC-ADVANCED | knob | Core | `38%` |
| `--sf-palette-mix-900` | PUBLIC-ADVANCED | knob | Core | `18%` |
| `--sf-palette-mix-950` | PUBLIC-ADVANCED | knob | Core | `8%` |
| `--sf-print-base-size` | PUBLIC-ADVANCED | knob | Core | `11pt` |
| `--sf-print-page-margin` | PUBLIC-ADVANCED | knob | Core | `2cm` |
| `--sf-print-page-size` | PUBLIC-ADVANCED | knob | Core | `a4` |
| `--sf-prose-block-margin` | PUBLIC | consumption | Macros | `var(--sf-space-m)` |
| `--sf-prose-blockquote-border` | PUBLIC | consumption | Macros | `var(--sf-border-width-2) solid var(--sf-color-border--subtle)` |
| `--sf-prose-blockquote-padding` | PUBLIC | consumption | Macros | `var(--sf-space-m)` |
| `--sf-prose-figcaption-size` | PUBLIC | consumption | Macros | `var(--sf-text-s)` |
| `--sf-prose-figure-margin` | PUBLIC | consumption | Macros | `var(--sf-space-l)` |
| `--sf-prose-heading-gap` | PUBLIC | consumption | Macros | `var(--sf-space-s)` |
| `--sf-prose-hr-margin` | PUBLIC | consumption | Macros | `var(--sf-space-l)` |
| `--sf-prose-list-gap` | PUBLIC | consumption | Macros | `var(--sf-space-xs)` |
| `--sf-prose-marker-color` | PUBLIC | consumption | Macros | `var(--sf-color-primary)` |
| `--sf-prose-media-margin` | PUBLIC | consumption | Macros | `var(--sf-space-m)` |
| `--sf-prose-media-radius` | PUBLIC | consumption | Macros | `var(--sf-radius-m)` |
| `--sf-prose-nested-list-gap` | PUBLIC | consumption | Macros | `var(--sf-space-2xs)` |
| `--sf-prose-paragraph` | PUBLIC | consumption | Layout | `var(--sf-content-gap)` |
| `--sf-prose-table-pad` | PUBLIC | consumption | Macros | `var(--sf-space-xs)` |
| `--sf-radius-2xl` | PUBLIC | consumption | Core | `calc(24px * var(--sf-radius-scale))` |
| `--sf-radius-2xs` | PUBLIC | consumption | Core | `calc(1px * var(--sf-radius-scale))` |
| `--sf-radius-3xl` | PUBLIC | consumption | Core | `calc(32px * var(--sf-radius-scale))` |
| `--sf-radius-4xl` | PUBLIC | consumption | Core | `calc(48px * var(--sf-radius-scale))` |
| `--sf-radius-full` | PUBLIC | knob | Core | `9999px` |
| `--sf-radius-l` | PUBLIC | consumption | Core | `calc(12px * var(--sf-radius-scale))` |
| `--sf-radius-m` | PUBLIC | consumption | Core | `calc(8px * var(--sf-radius-scale))` |
| `--sf-radius-none` | PUBLIC | knob | Core | `0` |
| `--sf-radius-outer` | PUBLIC-ADVANCED | consumption | Core | `calc(var(--sf-radius-m) + var(--sf-component-pad))` |
| `--sf-radius-pill` | PUBLIC | consumption | Core | `var(--sf-radius-full)` |
| `--sf-radius-s` | PUBLIC | consumption | Core | `calc(4px * var(--sf-radius-scale))` |
| `--sf-radius-scale` | PUBLIC-ADVANCED | knob | Core | `1` |
| `--sf-radius-xl` | PUBLIC | consumption | Core | `calc(16px * var(--sf-radius-scale))` |
| `--sf-radius-xs` | PUBLIC | consumption | Core | `calc(2px * var(--sf-radius-scale))` |
| `--sf-ratio-3-2` | PUBLIC | knob | Core | `3 / 2` |
| `--sf-ratio-4-3` | PUBLIC | knob | Core | `4 / 3` |
| `--sf-ratio-cinema` | PUBLIC | knob | Core | `21 / 9` |
| `--sf-ratio-golden` | PUBLIC | knob | Core | `1.618 / 1` |
| `--sf-ratio-portrait` | PUBLIC | knob | Core | `3 / 4` |
| `--sf-ratio-square` | PUBLIC | knob | Core | `1` |
| `--sf-ratio-video` | PUBLIC | knob | Core | `16 / 9` |
| `--sf-reel-gap` | PUBLIC | consumption | Layout | `var(--sf-gap)` |
| `--sf-reel-height` | PUBLIC | knob | Layout | `auto` |
| `--sf-reel-item-width` | PUBLIC | knob | Layout | `max-content` |
| `--sf-safe-bottom` | PUBLIC-ADVANCED | knob | Core | `env(safe-area-inset-bottom, 0px)` |
| `--sf-safe-left` | PUBLIC-ADVANCED | knob | Core | `env(safe-area-inset-left, 0px)` |
| `--sf-safe-right` | PUBLIC-ADVANCED | knob | Core | `env(safe-area-inset-right, 0px)` |
| `--sf-safe-top` | PUBLIC-ADVANCED | knob | Core | `env(safe-area-inset-top, 0px)` |
| `--sf-scrim-color` | PUBLIC | knob | Macros | `oklch(0 0 0 / 0.55)` |
| `--sf-scrim-direction` | PUBLIC | knob | Macros | `to top` |
| `--sf-scrim-gradient` | PUBLIC | consumption | Macros | `linear-gradient(var(--sf-scrim-direction), var(--sf-scrim-color), transparent)` |
| `--sf-scrim-text-shadow` | PUBLIC | knob | Macros | `0 1px 3px oklch(0 0 0 / 0.6)` |
| `--sf-scroll-shadow-size` | PUBLIC | knob | Macros | `2rem` |
| `--sf-scroll-timeline-range-end` | PUBLIC-ADVANCED | knob | Core | `cover 30%` |
| `--sf-scroll-timeline-range-exit-end` | PUBLIC | knob | Core | `exit 100%` |
| `--sf-scroll-timeline-range-exit-start` | PUBLIC | knob | Core | `cover 70%` |
| `--sf-scroll-timeline-range-start` | PUBLIC-ADVANCED | knob | Core | `entry 0%` |
| `--sf-scrollbar-thumb` | PUBLIC | consumption | Core | `var(--sf-color-neutral)` |
| `--sf-scrollbar-track` | PUBLIC | knob | Core | `transparent` |
| `--sf-section-pad` | PUBLIC | consumption | Core | `var(--sf-section-pad--m)` |
| `--sf-section-pad--2xl` | PUBLIC | consumption | Core | `calc(var(--sf-space-4xl) * 2 * var(--sf-section-scale))` |
| `--sf-section-pad--l` | PUBLIC | consumption | Core | `calc(var(--sf-space-4xl) * var(--sf-section-scale))` |
| `--sf-section-pad--m` | PUBLIC | consumption | Core | `calc(var(--sf-space-3xl) * var(--sf-section-scale))` |
| `--sf-section-pad--s` | PUBLIC | consumption | Core | `calc(var(--sf-space-2xl) * var(--sf-section-scale))` |
| `--sf-section-pad--xl` | PUBLIC | consumption | Core | `calc(var(--sf-space-4xl) * 1.5 * var(--sf-section-scale))` |
| `--sf-section-pad--xs` | PUBLIC | consumption | Core | `calc(var(--sf-space-xl) * var(--sf-section-scale))` |
| `--sf-section-scale` | PUBLIC-ADVANCED | knob | Core | `1` |
| `--sf-shadow-2xl` | PUBLIC | consumption | Core | `0 4px 12px 0 oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 0.6), 0.7)), 0 20px 60px 0 oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 4), 0.7)), 0 40px 100px -8px oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 5), 0.7))` |
| `--sf-shadow-color` | PUBLIC-ADVANCED | consumption | Core | `oklch(from var(--sf-color-neutral) var(--sf-shadow-lightness) c h)` |
| `--sf-shadow-glow` | PUBLIC | consumption | Core | `0 0 15px 2px oklch(from var(--sf-shadow-glow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 2), 0.7))` |
| `--sf-shadow-glow-color` | PUBLIC-ADVANCED | consumption | Core | `var(--sf-color-primary)` |
| `--sf-shadow-inner` | PUBLIC | consumption | Core | `inset 0 2px 4px 0 oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 2), 0.7))` |
| `--sf-shadow-l` | PUBLIC | consumption | Core | `0 2px 4px 0 oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 0.5), 0.7)), 0 8px 24px 0 oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 3), 0.7)), 0 16px 48px 0 oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 2), 0.7))` |
| `--sf-shadow-lightness` | PUBLIC | knob | Core | `0.15` |
| `--sf-shadow-m` | PUBLIC | consumption | Core | `0 1px 3px 0 oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 0.5), 0.7)), 0 4px 12px 0 oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 2), 0.7))` |
| `--sf-shadow-none` | PUBLIC | knob | Core | `none` |
| `--sf-shadow-s` | PUBLIC | consumption | Core | `0 1px 2px 0 oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 0.5), 0.7)), 0 2px 6px 0 oklch(from var(--sf-shadow-color) l c h / clamp(0, var(--sf-shadow-strength), 0.7))` |
| `--sf-shadow-strength` | PUBLIC-ADVANCED | knob | Core | `calc(0.08 + var(--sf-is-dark) * 0.17)` |
| `--sf-shadow-xl` | PUBLIC | consumption | Core | `0 2px 8px 0 oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 0.5), 0.7)), 0 12px 36px 0 oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 3.5), 0.7)), 0 24px 72px 0 oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 2.5), 0.7))` |
| `--sf-shadow-xs` | PUBLIC | consumption | Core | `0 1px 2px 0 oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 0.5), 0.7))` |
| `--sf-sidebar-gap` | PUBLIC | consumption | Layout | `var(--sf-gap)` |
| `--sf-sidebar-min-width` | PUBLIC | knob | Layout | `50%` |
| `--sf-sidebar-width` | PUBLIC | knob | Layout | `18rem` |
| `--sf-size-l` | PUBLIC | consumption | Core | `calc(3rem * var(--sf-density))` |
| `--sf-size-m` | PUBLIC | consumption | Core | `calc(2.5rem * var(--sf-density))` |
| `--sf-size-s` | PUBLIC | consumption | Core | `calc(2rem * var(--sf-density))` |
| `--sf-size-xl` | PUBLIC | consumption | Core | `calc(3.5rem * var(--sf-density))` |
| `--sf-size-xs` | PUBLIC | consumption | Core | `calc(1.5rem * var(--sf-density))` |
| `--sf-space-2xl` | PUBLIC | consumption | Core | `calc(clamp(calc(var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), 3) * 1rem), calc((var(--sf-space-base-max) * pow(var(--sf-space-ratio-max), 3) - var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), 3)) / (var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * (var(--sf-fluid-width) - var(--sf-fluid-min-vw) * 1rem) + var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), 3) * 1rem), calc(var(--sf-space-base-max) * pow(var(--sf-space-ratio-max), 3) * 1rem)) * var(--sf-space-scale))` |
| `--sf-space-2xs` | PUBLIC | consumption | Core | `calc(clamp(calc(var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), -3) * 1rem), calc((var(--sf-space-base-max) * pow(var(--sf-space-ratio-max), -3) - var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), -3)) / (var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * (var(--sf-fluid-width) - var(--sf-fluid-min-vw) * 1rem) + var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), -3) * 1rem), calc(var(--sf-space-base-max) * pow(var(--sf-space-ratio-max), -3) * 1rem)) * var(--sf-space-scale))` |
| `--sf-space-3xl` | PUBLIC | consumption | Core | `calc(clamp(calc(var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), 4) * 1rem), calc((var(--sf-space-base-max) * pow(var(--sf-space-ratio-max), 4) - var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), 4)) / (var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * (var(--sf-fluid-width) - var(--sf-fluid-min-vw) * 1rem) + var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), 4) * 1rem), calc(var(--sf-space-base-max) * pow(var(--sf-space-ratio-max), 4) * 1rem)) * var(--sf-space-scale))` |
| `--sf-space-4xl` | PUBLIC | consumption | Core | `calc(clamp(calc(var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), 5) * 1rem), calc((var(--sf-space-base-max) * pow(var(--sf-space-ratio-max), 5) - var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), 5)) / (var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * (var(--sf-fluid-width) - var(--sf-fluid-min-vw) * 1rem) + var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), 5) * 1rem), calc(var(--sf-space-base-max) * pow(var(--sf-space-ratio-max), 5) * 1rem)) * var(--sf-space-scale))` |
| `--sf-space-base-max` | PUBLIC-ADVANCED | knob | Core | `2` |
| `--sf-space-base-min` | PUBLIC-ADVANCED | knob | Core | `1` |
| `--sf-space-l` | PUBLIC | consumption | Core | `calc(clamp(calc(var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), 1) * 1rem), calc((var(--sf-space-base-max) * pow(var(--sf-space-ratio-max), 1) - var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), 1)) / (var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * (var(--sf-fluid-width) - var(--sf-fluid-min-vw) * 1rem) + var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), 1) * 1rem), calc(var(--sf-space-base-max) * pow(var(--sf-space-ratio-max), 1) * 1rem)) * var(--sf-space-scale))` |
| `--sf-space-m` | PUBLIC | consumption | Core | `calc(clamp(calc(var(--sf-space-base-min) * 1rem), calc((var(--sf-space-base-max) - var(--sf-space-base-min)) / (var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * (var(--sf-fluid-width) - var(--sf-fluid-min-vw) * 1rem) + var(--sf-space-base-min) * 1rem), calc(var(--sf-space-base-max) * 1rem)) * var(--sf-space-scale))` |
| `--sf-space-none` | PUBLIC | knob | Core | `0` |
| `--sf-space-px` | PUBLIC | knob | Core | `1px` |
| `--sf-space-ratio-max` | PUBLIC-ADVANCED | knob | Core | `1.333` |
| `--sf-space-ratio-min` | PUBLIC-ADVANCED | knob | Core | `1.25` |
| `--sf-space-s` | PUBLIC | consumption | Core | `calc(clamp(calc(var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), -1) * 1rem), calc((var(--sf-space-base-max) * pow(var(--sf-space-ratio-max), -1) - var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), -1)) / (var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * (var(--sf-fluid-width) - var(--sf-fluid-min-vw) * 1rem) + var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), -1) * 1rem), calc(var(--sf-space-base-max) * pow(var(--sf-space-ratio-max), -1) * 1rem)) * var(--sf-space-scale))` |
| `--sf-space-scale` | PUBLIC-ADVANCED | knob | Core | `1` |
| `--sf-space-xl` | PUBLIC | consumption | Core | `calc(clamp(calc(var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), 2) * 1rem), calc((var(--sf-space-base-max) * pow(var(--sf-space-ratio-max), 2) - var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), 2)) / (var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * (var(--sf-fluid-width) - var(--sf-fluid-min-vw) * 1rem) + var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), 2) * 1rem), calc(var(--sf-space-base-max) * pow(var(--sf-space-ratio-max), 2) * 1rem)) * var(--sf-space-scale))` |
| `--sf-space-xs` | PUBLIC | consumption | Core | `calc(clamp(calc(var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), -2) * 1rem), calc((var(--sf-space-base-max) * pow(var(--sf-space-ratio-max), -2) - var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), -2)) / (var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * (var(--sf-fluid-width) - var(--sf-fluid-min-vw) * 1rem) + var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), -2) * 1rem), calc(var(--sf-space-base-max) * pow(var(--sf-space-ratio-max), -2) * 1rem)) * var(--sf-space-scale))` |
| `--sf-stack-gap` | PUBLIC | consumption | Layout | `var(--sf-content-gap)` |
| `--sf-stagger-step` | PUBLIC | knob | Core | `75ms` |
| `--sf-state-pending-opacity` | PUBLIC | knob | Core | `0.7` |
| `--sf-sticky-offset` | PUBLIC | consumption | Core | `clamp( var(--sf-sticky-offset-mobile), calc((var(--sf-sticky-offset-desktop) - var(--sf-sticky-offset-mobile)) / ((var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * 1rem) * (100vw - var(--sf-fluid-min-vw) * 1rem) + var(--sf-sticky-offset-mobile)), var(--sf-sticky-offset-desktop))` |
| `--sf-sticky-offset-desktop` | PUBLIC | consumption | Core | `var(--sf-header-height-desktop)` |
| `--sf-sticky-offset-mobile` | PUBLIC | consumption | Core | `var(--sf-header-height-mobile)` |
| `--sf-surface-bg-animation` | PUBLIC | knob | Macros | `none` |
| `--sf-surface-bg-attachment` | PUBLIC | knob | Macros | `scroll` |
| `--sf-surface-bg-color` | PUBLIC | knob | Macros | `transparent` |
| `--sf-surface-bg-image` | PUBLIC | knob | Macros | `none` |
| `--sf-surface-bg-overlay` | PUBLIC | knob | Macros | `none` |
| `--sf-surface-bg-position` | PUBLIC | knob | Macros | `center` |
| `--sf-surface-bg-repeat` | PUBLIC | knob | Macros | `no-repeat` |
| `--sf-surface-bg-size` | PUBLIC | knob | Macros | `cover` |
| `--sf-surface-color` | PUBLIC | consumption | Macros | `var(--sf-color-base)` |
| `--sf-switcher-gap` | PUBLIC | consumption | Layout | `var(--sf-gap)` |
| `--sf-switcher-threshold` | PUBLIC | knob | Layout | `30rem` |
| `--sf-text-2xl` | PUBLIC | consumption | Core | `calc(clamp(calc(var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), 3) * 1rem), calc((var(--sf-text-base-max) * pow(var(--sf-text-ratio-max), 3) - var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), 3)) / (var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * (var(--sf-fluid-width) - var(--sf-fluid-min-vw) * 1rem) + var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), 3) * 1rem), calc(var(--sf-text-base-max) * pow(var(--sf-text-ratio-max), 3) * 1rem)) * var(--sf-text-scale))` |
| `--sf-text-2xl-font-weight` | PUBLIC | consumption | Core | `var(--sf-font-weight-heading)` |
| `--sf-text-2xl-letter-spacing` | PUBLIC | consumption | Core | `var(--sf-tracking-normal)` |
| `--sf-text-2xl-line-height` | PUBLIC | consumption | Core | `calc(var(--sf-leading-snug) - 6 * var(--sf-leading-taper))` |
| `--sf-text-2xl-max-width` | PUBLIC | knob | Core | `none` |
| `--sf-text-2xs` | PUBLIC | consumption | Core | `calc(clamp(calc(var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), -3) * 1rem), calc((var(--sf-text-base-max) * pow(var(--sf-text-ratio-max), -3) - var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), -3)) / (var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * (var(--sf-fluid-width) - var(--sf-fluid-min-vw) * 1rem) + var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), -3) * 1rem), calc(var(--sf-text-base-max) * pow(var(--sf-text-ratio-max), -3) * 1rem)) * var(--sf-text-scale))` |
| `--sf-text-2xs-font-weight` | PUBLIC | consumption | Core | `var(--sf-font-weight-body)` |
| `--sf-text-2xs-letter-spacing` | PUBLIC | consumption | Core | `var(--sf-tracking-normal)` |
| `--sf-text-2xs-line-height` | PUBLIC | consumption | Core | `var(--sf-leading-relaxed)` |
| `--sf-text-2xs-max-width` | PUBLIC | knob | Core | `55ch` |
| `--sf-text-3xl` | PUBLIC | consumption | Core | `calc(clamp(calc(var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), 4) * 1rem), calc((var(--sf-text-base-max) * pow(var(--sf-text-ratio-max), 4) - var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), 4)) / (var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * (var(--sf-fluid-width) - var(--sf-fluid-min-vw) * 1rem) + var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), 4) * 1rem), calc(var(--sf-text-base-max) * pow(var(--sf-text-ratio-max), 4) * 1rem)) * var(--sf-text-scale))` |
| `--sf-text-3xl-font-weight` | PUBLIC | consumption | Core | `var(--sf-font-weight-heading)` |
| `--sf-text-3xl-letter-spacing` | PUBLIC | consumption | Core | `var(--sf-tracking-tight)` |
| `--sf-text-3xl-line-height` | PUBLIC | consumption | Core | `calc(var(--sf-leading-tight) - 7 * var(--sf-leading-taper))` |
| `--sf-text-3xl-max-width` | PUBLIC | knob | Core | `none` |
| `--sf-text-4xl` | PUBLIC | consumption | Core | `calc(clamp(calc(var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), 5) * 1rem), calc((var(--sf-text-base-max) * pow(var(--sf-text-ratio-max), 5) - var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), 5)) / (var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * (var(--sf-fluid-width) - var(--sf-fluid-min-vw) * 1rem) + var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), 5) * 1rem), calc(var(--sf-text-base-max) * pow(var(--sf-text-ratio-max), 5) * 1rem)) * var(--sf-text-scale))` |
| `--sf-text-4xl-font-weight` | PUBLIC | consumption | Core | `var(--sf-font-weight-heading)` |
| `--sf-text-4xl-letter-spacing` | PUBLIC | consumption | Core | `var(--sf-tracking-tight)` |
| `--sf-text-4xl-line-height` | PUBLIC | consumption | Core | `calc(var(--sf-leading-tight) - 8 * var(--sf-leading-taper))` |
| `--sf-text-4xl-max-width` | PUBLIC | knob | Core | `none` |
| `--sf-text-base-max` | PUBLIC-ADVANCED | knob | Core | `1.25` |
| `--sf-text-base-min` | PUBLIC-ADVANCED | knob | Core | `1` |
| `--sf-text-display-base-max` | PUBLIC-ADVANCED | knob | Core | `3` |
| `--sf-text-display-base-min` | PUBLIC-ADVANCED | knob | Core | `2.4` |
| `--sf-text-display-l` | PUBLIC | consumption | Core | `calc(clamp(calc(var(--sf-text-display-base-min) * pow(var(--sf-text-ratio-min), 2) * 1rem), calc((var(--sf-text-display-base-max) * pow(var(--sf-text-ratio-max), 2) - var(--sf-text-display-base-min) * pow(var(--sf-text-ratio-min), 2)) / (var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * (var(--sf-fluid-width) - var(--sf-fluid-min-vw) * 1rem) + var(--sf-text-display-base-min) * pow(var(--sf-text-ratio-min), 2) * 1rem), calc(var(--sf-text-display-base-max) * pow(var(--sf-text-ratio-max), 2) * 1rem)) * var(--sf-text-display-scale))` |
| `--sf-text-display-m` | PUBLIC | consumption | Core | `calc(clamp(calc(var(--sf-text-display-base-min) * pow(var(--sf-text-ratio-min), 1) * 1rem), calc((var(--sf-text-display-base-max) * pow(var(--sf-text-ratio-max), 1) - var(--sf-text-display-base-min) * pow(var(--sf-text-ratio-min), 1)) / (var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * (var(--sf-fluid-width) - var(--sf-fluid-min-vw) * 1rem) + var(--sf-text-display-base-min) * pow(var(--sf-text-ratio-min), 1) * 1rem), calc(var(--sf-text-display-base-max) * pow(var(--sf-text-ratio-max), 1) * 1rem)) * var(--sf-text-display-scale))` |
| `--sf-text-display-s` | PUBLIC | consumption | Core | `calc(clamp(calc(var(--sf-text-display-base-min) * 1rem), calc((var(--sf-text-display-base-max) - var(--sf-text-display-base-min)) / (var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * (var(--sf-fluid-width) - var(--sf-fluid-min-vw) * 1rem) + var(--sf-text-display-base-min) * 1rem), calc(var(--sf-text-display-base-max) * 1rem)) * var(--sf-text-display-scale))` |
| `--sf-text-display-scale` | PUBLIC-ADVANCED | knob | Core | `1` |
| `--sf-text-l` | PUBLIC | consumption | Core | `calc(clamp(calc(var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), 1) * 1rem), calc((var(--sf-text-base-max) * pow(var(--sf-text-ratio-max), 1) - var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), 1)) / (var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * (var(--sf-fluid-width) - var(--sf-fluid-min-vw) * 1rem) + var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), 1) * 1rem), calc(var(--sf-text-base-max) * pow(var(--sf-text-ratio-max), 1) * 1rem)) * var(--sf-text-scale))` |
| `--sf-text-l-font-weight` | PUBLIC | consumption | Core | `var(--sf-font-weight-body)` |
| `--sf-text-l-letter-spacing` | PUBLIC | consumption | Core | `var(--sf-tracking-normal)` |
| `--sf-text-l-line-height` | PUBLIC | consumption | Core | `calc(var(--sf-leading-normal) - 4 * var(--sf-leading-taper))` |
| `--sf-text-l-max-width` | PUBLIC | knob | Core | `none` |
| `--sf-text-m` | PUBLIC | consumption | Core | `calc(clamp(calc(var(--sf-text-base-min) * 1rem), calc((var(--sf-text-base-max) - var(--sf-text-base-min)) / (var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * (var(--sf-fluid-width) - var(--sf-fluid-min-vw) * 1rem) + var(--sf-text-base-min) * 1rem), calc(var(--sf-text-base-max) * 1rem)) * var(--sf-text-scale))` |
| `--sf-text-m-font-weight` | PUBLIC | consumption | Core | `var(--sf-font-weight-body)` |
| `--sf-text-m-letter-spacing` | PUBLIC | consumption | Core | `var(--sf-tracking-normal)` |
| `--sf-text-m-line-height` | PUBLIC | consumption | Core | `calc(var(--sf-leading-normal) - 3 * var(--sf-leading-taper))` |
| `--sf-text-m-max-width` | PUBLIC | knob | Core | `65ch` |
| `--sf-text-ratio-max` | PUBLIC-ADVANCED | knob | Core | `1.333` |
| `--sf-text-ratio-min` | PUBLIC-ADVANCED | knob | Core | `1.25` |
| `--sf-text-s` | PUBLIC | consumption | Core | `calc(clamp(calc(var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), -1) * 1rem), calc((var(--sf-text-base-max) * pow(var(--sf-text-ratio-max), -1) - var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), -1)) / (var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * (var(--sf-fluid-width) - var(--sf-fluid-min-vw) * 1rem) + var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), -1) * 1rem), calc(var(--sf-text-base-max) * pow(var(--sf-text-ratio-max), -1) * 1rem)) * var(--sf-text-scale))` |
| `--sf-text-s-font-weight` | PUBLIC | consumption | Core | `var(--sf-font-weight-body)` |
| `--sf-text-s-letter-spacing` | PUBLIC | consumption | Core | `var(--sf-tracking-normal)` |
| `--sf-text-s-line-height` | PUBLIC | consumption | Core | `calc(var(--sf-leading-relaxed) - 2 * var(--sf-leading-taper))` |
| `--sf-text-s-max-width` | PUBLIC | knob | Core | `65ch` |
| `--sf-text-scale` | PUBLIC-ADVANCED | knob | Core | `1` |
| `--sf-text-shadow-l` | PUBLIC | consumption | Core | `0 4px 8px oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 2.5), 0.7))` |
| `--sf-text-shadow-m` | PUBLIC | consumption | Core | `0 2px 4px oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 2), 0.7))` |
| `--sf-text-shadow-none` | PUBLIC | knob | Core | `none` |
| `--sf-text-shadow-s` | PUBLIC | consumption | Core | `0 1px 2px oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 1.5), 0.7))` |
| `--sf-text-shadow-xl` | PUBLIC | consumption | Core | `0 8px 16px oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 3), 0.7))` |
| `--sf-text-shadow-xs` | PUBLIC | consumption | Core | `0 0.5px 1px oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 1), 0.7))` |
| `--sf-text-xl` | PUBLIC | consumption | Core | `calc(clamp(calc(var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), 2) * 1rem), calc((var(--sf-text-base-max) * pow(var(--sf-text-ratio-max), 2) - var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), 2)) / (var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * (var(--sf-fluid-width) - var(--sf-fluid-min-vw) * 1rem) + var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), 2) * 1rem), calc(var(--sf-text-base-max) * pow(var(--sf-text-ratio-max), 2) * 1rem)) * var(--sf-text-scale))` |
| `--sf-text-xl-font-weight` | PUBLIC | consumption | Core | `var(--sf-font-weight-body)` |
| `--sf-text-xl-letter-spacing` | PUBLIC | consumption | Core | `var(--sf-tracking-normal)` |
| `--sf-text-xl-line-height` | PUBLIC | consumption | Core | `calc(var(--sf-leading-snug) - 5 * var(--sf-leading-taper))` |
| `--sf-text-xl-max-width` | PUBLIC | knob | Core | `none` |
| `--sf-text-xs` | PUBLIC | consumption | Core | `calc(clamp(calc(var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), -2) * 1rem), calc((var(--sf-text-base-max) * pow(var(--sf-text-ratio-max), -2) - var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), -2)) / (var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * (var(--sf-fluid-width) - var(--sf-fluid-min-vw) * 1rem) + var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), -2) * 1rem), calc(var(--sf-text-base-max) * pow(var(--sf-text-ratio-max), -2) * 1rem)) * var(--sf-text-scale))` |
| `--sf-text-xs-font-weight` | PUBLIC | consumption | Core | `var(--sf-font-weight-body)` |
| `--sf-text-xs-letter-spacing` | PUBLIC | consumption | Core | `var(--sf-tracking-normal)` |
| `--sf-text-xs-line-height` | PUBLIC | consumption | Core | `calc(var(--sf-leading-relaxed) - 1 * var(--sf-leading-taper))` |
| `--sf-text-xs-max-width` | PUBLIC | knob | Core | `60ch` |
| `--sf-theme-transition-duration` | PUBLIC | consumption | Core | `calc(300ms * var(--sf-motion-scale))` |
| `--sf-touch-target` | PUBLIC | knob | Core | `2.75rem` |
| `--sf-tracking-normal` | PUBLIC | knob | Core | `0` |
| `--sf-tracking-tight` | PUBLIC | knob | Core | `-0.025em` |
| `--sf-tracking-wide` | PUBLIC | knob | Core | `0.025em` |
| `--sf-tracking-wider` | PUBLIC | knob | Core | `0.05em` |
| `--sf-tracking-widest` | PUBLIC | knob | Core | `0.1em` |
| `--sf-transition-colors` | PUBLIC | consumption | Core | `color var(--sf-duration-normal) var(--sf-ease-out), background-color var(--sf-duration-normal) var(--sf-ease-out), border-color var(--sf-duration-normal) var(--sf-ease-out), text-decoration-color var(--sf-duration-normal) var(--sf-ease-out), fill var(--sf-duration-normal) var(--sf-ease-out), stroke var(--sf-duration-normal) var(--sf-ease-out)` |
| `--sf-transition-enter` | PUBLIC | consumption | Core | `color var(--sf-duration-normal) var(--sf-ease-out), background-color var(--sf-duration-normal) var(--sf-ease-out), border-color var(--sf-duration-normal) var(--sf-ease-out), box-shadow var(--sf-duration-normal) var(--sf-ease-out), opacity var(--sf-duration-normal) var(--sf-ease-out), transform var(--sf-duration-normal) var(--sf-ease-out), filter var(--sf-duration-normal) var(--sf-ease-out)` |
| `--sf-transition-exit` | PUBLIC | consumption | Core | `color var(--sf-duration-fast) var(--sf-ease-in), background-color var(--sf-duration-fast) var(--sf-ease-in), border-color var(--sf-duration-fast) var(--sf-ease-in), box-shadow var(--sf-duration-fast) var(--sf-ease-in), opacity var(--sf-duration-fast) var(--sf-ease-in), transform var(--sf-duration-fast) var(--sf-ease-in), filter var(--sf-duration-fast) var(--sf-ease-in)` |
| `--sf-transition-fast` | PUBLIC | consumption | Core | `color var(--sf-duration-fast) var(--sf-ease-out), background-color var(--sf-duration-fast) var(--sf-ease-out), border-color var(--sf-duration-fast) var(--sf-ease-out), box-shadow var(--sf-duration-fast) var(--sf-ease-out), opacity var(--sf-duration-fast) var(--sf-ease-out), transform var(--sf-duration-fast) var(--sf-ease-out), filter var(--sf-duration-fast) var(--sf-ease-out)` |
| `--sf-transition-form-field` | PUBLIC | consumption | Core | `color var(--sf-duration-normal) var(--sf-ease-out), background-color var(--sf-duration-normal) var(--sf-ease-out), text-decoration-color var(--sf-duration-normal) var(--sf-ease-out), fill var(--sf-duration-normal) var(--sf-ease-out), stroke var(--sf-duration-normal) var(--sf-ease-out), border-color var(--sf-duration-fast) var(--sf-ease-out), box-shadow var(--sf-duration-fast) var(--sf-ease-out), opacity var(--sf-duration-fast) var(--sf-ease-out)` |
| `--sf-transition-opacity` | PUBLIC | consumption | Core | `opacity var(--sf-duration-normal) var(--sf-ease-out)` |
| `--sf-transition-overlay` | PUBLIC | consumption | Core | `overlay var(--sf-duration-normal) allow-discrete, display var(--sf-duration-normal) allow-discrete` |
| `--sf-transition-shadow` | PUBLIC | consumption | Core | `box-shadow var(--sf-duration-normal) var(--sf-ease-out)` |
| `--sf-transition-slow` | PUBLIC | consumption | Core | `color var(--sf-duration-slow) var(--sf-ease-in-out), background-color var(--sf-duration-slow) var(--sf-ease-in-out), border-color var(--sf-duration-slow) var(--sf-ease-in-out), box-shadow var(--sf-duration-slow) var(--sf-ease-in-out), opacity var(--sf-duration-slow) var(--sf-ease-in-out), transform var(--sf-duration-slow) var(--sf-ease-in-out), filter var(--sf-duration-slow) var(--sf-ease-in-out)` |
| `--sf-transition-transform` | PUBLIC | consumption | Core | `transform var(--sf-duration-normal) var(--sf-ease-out)` |
| `--sf-z-base` | PUBLIC | knob | Core | `0` |
| `--sf-z-below` | PUBLIC | knob | Core | `-1` |
| `--sf-z-dropdown` | PUBLIC | knob | Core | `1020` |
| `--sf-z-fixed` | PUBLIC | knob | Core | `1010` |
| `--sf-z-modal` | PUBLIC | knob | Core | `1040` |
| `--sf-z-overlay` | PUBLIC | knob | Core | `1030` |
| `--sf-z-raised` | PUBLIC | knob | Core | `1` |
| `--sf-z-sticky` | PUBLIC | knob | Core | `1000` |
| `--sf-z-toast` | PUBLIC | knob | Core | `1050` |
| `--sf-z-tooltip` | PUBLIC | knob | Core | `1060` |

