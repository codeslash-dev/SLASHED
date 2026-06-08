# Token index

> **Generated** from source by `scripts/gen-token-index.js` —
> run `npm run docs:index` to refresh. Do not edit by hand.

A cross-reference of every `--sf-*` custom property by **source file**,
**stability tier**, and **legacy fallback** coverage. For just the default
values see [tokens.md](tokens.md); for the flat name list see
[registry.json](registry.json); for the tier contract and naming rules see
[architecture.md](architecture.md).

**771 tokens** (deduplicated by name across the 6 token source files).

| Tier | Count | Meaning |
|---|---|---|
| PUBLIC | 735 | Everyday knobs. SemVer-stable. |
| PUBLIC-ADVANCED | 35 | Same SemVer guarantee; niche/powerful. |
| INTERNAL | 1 | Implementation detail; may change without a major bump. |

**57** tokens have a legacy HSL fallback in `core/tokens.color-fallbacks.css`
(for engines without `light-dark()` / `oklch(from …)`), plus
**33** fallback-only channel tokens listed at the end.

## INTERNAL tokens

- `--sf-is-dark`

## PUBLIC-ADVANCED tokens

- `--sf-contrast-bias`
- `--sf-contrast-threshold`
- `--sf-focus-ring-shadow`
- `--sf-font-features`
- `--sf-font-variation`
- `--sf-is-active`
- `--sf-is-current`
- `--sf-is-open`
- `--sf-is-pressed`
- `--sf-lumlocker`
- `--sf-mask-scrim-end`
- `--sf-mask-scrim-start`
- `--sf-motion-scale`
- `--sf-optical-sizing`
- `--sf-perspective-far`
- `--sf-perspective-near`
- `--sf-perspective-normal`
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
- `--sf-shadow-color`
- `--sf-shadow-glow-color`
- `--sf-shadow-strength`
- `--sf-space-scale`
- `--sf-text-display-scale`
- `--sf-text-scale`
- `--sf-truncate-suffix`

## Full index

| Token | Tier | File(s) | Fallback | Default |
|---|---|---|---|---|
| `--sf-alternate-gap` | PUBLIC | Layout | — | `var(--sf-space-content)` |
| `--sf-alternate-inner-gap` | PUBLIC | Layout | — | `var(--sf-space-gap)` |
| `--sf-animation-blink` | PUBLIC | Core | — | `sf-blink calc(1s * var(--sf-motion-scale)) steps(1, end) infinite` |
| `--sf-animation-color-pulse` | PUBLIC | Core | — | `sf-color-pulse var(--sf-duration-slow) var(--sf-ease-in-out) infinite` |
| `--sf-animation-delay-1` | PUBLIC | Core | — | `calc(75ms * var(--sf-motion-scale))` |
| `--sf-animation-delay-2` | PUBLIC | Core | — | `calc(150ms * var(--sf-motion-scale))` |
| `--sf-animation-delay-3` | PUBLIC | Core | — | `calc(225ms * var(--sf-motion-scale))` |
| `--sf-animation-delay-4` | PUBLIC | Core | — | `calc(300ms * var(--sf-motion-scale))` |
| `--sf-animation-delay-5` | PUBLIC | Core | — | `calc(375ms * var(--sf-motion-scale))` |
| `--sf-animation-fade-in` | PUBLIC | Core | — | `sf-fade-in var(--sf-duration-normal) var(--sf-ease-out) both` |
| `--sf-animation-fade-out` | PUBLIC | Core | — | `sf-fade-out var(--sf-duration-normal) var(--sf-ease-in) both` |
| `--sf-animation-float` | PUBLIC | Core | — | `sf-float calc(3s * var(--sf-motion-scale)) var(--sf-ease-in-out) infinite` |
| `--sf-animation-ping` | PUBLIC | Core | — | `sf-ping var(--sf-duration-slow) var(--sf-ease-out) infinite` |
| `--sf-animation-scale-down` | PUBLIC | Core | — | `sf-scale-down var(--sf-duration-normal) var(--sf-ease-in) both` |
| `--sf-animation-scale-up` | PUBLIC | Core | — | `sf-scale-up var(--sf-duration-normal) var(--sf-ease-overshoot) both` |
| `--sf-animation-shimmer` | PUBLIC | Core | — | `sf-shimmer calc(1.5s * var(--sf-motion-scale)) var(--sf-ease-in-out) infinite` |
| `--sf-animation-slide-in-down` | PUBLIC | Core | — | `sf-slide-in-down var(--sf-duration-normal) var(--sf-ease-out) both` |
| `--sf-animation-slide-in-left` | PUBLIC | Core | — | `sf-slide-in-left var(--sf-duration-normal) var(--sf-ease-out) both` |
| `--sf-animation-slide-in-right` | PUBLIC | Core | — | `sf-slide-in-right var(--sf-duration-normal) var(--sf-ease-out) both` |
| `--sf-animation-slide-in-up` | PUBLIC | Core | — | `sf-slide-in-up var(--sf-duration-normal) var(--sf-ease-out) both` |
| `--sf-animation-spin` | PUBLIC | Core | — | `sf-spin var(--sf-duration-slower) linear infinite` |
| `--sf-aspect` | PUBLIC | Macros | — | `16 / 9` |
| `--sf-bento-cols-default` | PUBLIC | Layout | — | `3` |
| `--sf-bento-gap` | PUBLIC | Layout | — | `var(--sf-space-gap)` |
| `--sf-bento-row-compact` | PUBLIC | Layout | — | `6rem` |
| `--sf-bento-row-default` | PUBLIC | Layout | — | `10rem` |
| `--sf-bento-row-tall` | PUBLIC | Layout | — | `16rem` |
| `--sf-blur-l` | PUBLIC | Core | — | `32px` |
| `--sf-blur-m` | PUBLIC | Core | — | `16px` |
| `--sf-blur-s` | PUBLIC | Core | — | `8px` |
| `--sf-blur-xl` | PUBLIC | Core | — | `48px` |
| `--sf-blur-xs` | PUBLIC | Core | — | `4px` |
| `--sf-body-color` | PUBLIC | Core | — | `var(--sf-color-text)` |
| `--sf-body-em-style` | PUBLIC | Core | — | `italic` |
| `--sf-body-font-family` | PUBLIC | Core | — | `var(--sf-font-body)` |
| `--sf-body-font-size` | PUBLIC | Core | — | `var(--sf-text-m)` |
| `--sf-body-font-weight` | PUBLIC | Core | — | `var(--sf-font-weight-body)` |
| `--sf-body-line-height` | PUBLIC | Core | — | `var(--sf-leading-normal)` |
| `--sf-body-strong-weight` | PUBLIC | Core | — | `var(--sf-font-weight-bold)` |
| `--sf-body-text-wrap` | PUBLIC | Core | — | `pretty` |
| `--sf-border` | PUBLIC | Core | — | `var(--sf-border-width-1) var(--sf-border-style) var(--sf-color-border)` |
| `--sf-border-strong` | PUBLIC | Core | — | `var(--sf-border-width-1) var(--sf-border-style) var(--sf-color-border--strong)` |
| `--sf-border-style` | PUBLIC | Core | — | `solid` |
| `--sf-border-style-dotted` | PUBLIC | Core | — | `dotted` |
| `--sf-border-style-soft` | PUBLIC | Core | — | `dashed` |
| `--sf-border-subtle` | PUBLIC | Core | — | `var(--sf-border-width-1) var(--sf-border-style) var(--sf-color-border--subtle)` |
| `--sf-border-width-1` | PUBLIC | Core | — | `1px` |
| `--sf-border-width-2` | PUBLIC | Core | — | `2px` |
| `--sf-border-width-3` | PUBLIC | Core | — | `3px` |
| `--sf-border-width-4` | PUBLIC | Core | — | `4px` |
| `--sf-border-width-hairline` | PUBLIC | Core | — | `0.5px` |
| `--sf-box-border-color` | PUBLIC | Layout | — | `var(--sf-color-border)` |
| `--sf-box-border-width` | PUBLIC | Layout | — | `0` |
| `--sf-box-padding` | PUBLIC | Layout | — | `var(--sf-space-m)` |
| `--sf-breakout-width` | PUBLIC | Layout | — | `var(--sf-container-wide)` |
| `--sf-caret-color` | PUBLIC | Core | — | `var(--sf-color-action)` |
| `--sf-center-gutter` | PUBLIC | Layout | — | `var(--sf-space-gutter)` |
| `--sf-center-max` | PUBLIC | Layout | — | `var(--sf-container-default)` |
| `--sf-cluster-align` | PUBLIC | Layout | — | `center` |
| `--sf-cluster-gap` | PUBLIC | Layout | — | `var(--sf-space-gap)` |
| `--sf-cluster-justify` | PUBLIC | Layout | — | `flex-start` |
| `--sf-code-font-size` | PUBLIC | Core | — | `0.875em` |
| `--sf-col-rule-width-l` | PUBLIC | Core | — | `var(--sf-border-width-3)` |
| `--sf-col-rule-width-m` | PUBLIC | Core | — | `var(--sf-border-width-2)` |
| `--sf-col-rule-width-s` | PUBLIC | Core | — | `var(--sf-border-width-1)` |
| `--sf-col-width-l` | PUBLIC | Core | — | `32ch` |
| `--sf-col-width-m` | PUBLIC | Core | — | `24ch` |
| `--sf-col-width-s` | PUBLIC | Core | — | `16ch` |
| `--sf-color-action` | PUBLIC | Core | yes | `light-dark(var(--sf-color-action-light), var(--sf-color-action-dark, oklch(from var(--sf-color-action-light) clamp(0.65, calc(0.95 - l * 0.5), 0.88) calc(c * 0.9) h)))` |
| `--sf-color-action-100` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-action) 8%, var(--sf-color-surface))` |
| `--sf-color-action-200` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-action) 20%, var(--sf-color-surface))` |
| `--sf-color-action-300` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-action) 40%, var(--sf-color-surface))` |
| `--sf-color-action-400` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-action) 65%, var(--sf-color-surface))` |
| `--sf-color-action-50` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-action) 4%, var(--sf-color-surface))` |
| `--sf-color-action-500` | PUBLIC | Palette (optional) | — | `var(--sf-color-action)` |
| `--sf-color-action-600` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-action) 82%, var(--sf-color-text))` |
| `--sf-color-action-700` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-action) 62%, var(--sf-color-text))` |
| `--sf-color-action-800` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-action) 38%, var(--sf-color-text))` |
| `--sf-color-action-900` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-action) 18%, var(--sf-color-text))` |
| `--sf-color-action-950` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-action) 8%, var(--sf-color-text))` |
| `--sf-color-action-a10` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-action) 10%, transparent)` |
| `--sf-color-action-a20` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-action) 20%, transparent)` |
| `--sf-color-action-a30` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-action) 30%, transparent)` |
| `--sf-color-action-a40` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-action) 40%, transparent)` |
| `--sf-color-action-a5` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-action) 5%, transparent)` |
| `--sf-color-action-a50` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-action) 50%, transparent)` |
| `--sf-color-action-a60` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-action) 60%, transparent)` |
| `--sf-color-action-a70` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-action) 70%, transparent)` |
| `--sf-color-action-a80` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-action) 80%, transparent)` |
| `--sf-color-action-a90` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-action) 90%, transparent)` |
| `--sf-color-action-a95` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-action) 95%, transparent)` |
| `--sf-color-action-active` | PUBLIC | Core + Palette (optional) | — | `var(--sf-color-action-xdark)` |
| `--sf-color-action-darker` | PUBLIC | Core + Palette (optional) | — | `var(--sf-color-action-600)` |
| `--sf-color-action-ghost` | PUBLIC | Core + Palette (optional) | — | `var(--sf-color-action-a5)` |
| `--sf-color-action-hover` | PUBLIC | Core + Palette (optional) | — | `var(--sf-color-action-darker)` |
| `--sf-color-action-light` | PUBLIC | Core | — | `oklch(0.50 0.22 235)` |
| `--sf-color-action-lighter` | PUBLIC | Core + Palette (optional) | — | `var(--sf-color-action-400)` |
| `--sf-color-action-muted` | PUBLIC | Core + Palette (optional) | — | `var(--sf-color-action-a30)` |
| `--sf-color-action-subtle` | PUBLIC | Core + Palette (optional) | — | `var(--sf-color-action-a10)` |
| `--sf-color-action-superdark` | PUBLIC | Core + Palette (optional) | — | `var(--sf-color-action-950)` |
| `--sf-color-action-superlight` | PUBLIC | Core + Palette (optional) | — | `var(--sf-color-action-50)` |
| `--sf-color-action-xdark` | PUBLIC | Core + Palette (optional) | — | `var(--sf-color-action-800)` |
| `--sf-color-action-xlight` | PUBLIC | Core + Palette (optional) | — | `var(--sf-color-action-200)` |
| `--sf-color-base` | PUBLIC | Core | yes | `light-dark(var(--sf-color-base-light), var(--sf-color-base-dark, oklch(from var(--sf-color-base-light) clamp(0.16, calc(1.18 - l), 0.24) calc(c * 0.5) h)))` |
| `--sf-color-base-100` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-text) 8%, var(--sf-color-base))` |
| `--sf-color-base-200` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-text) 20%, var(--sf-color-base))` |
| `--sf-color-base-300` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-text) 40%, var(--sf-color-base))` |
| `--sf-color-base-400` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-text) 65%, var(--sf-color-base))` |
| `--sf-color-base-50` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-text) 4%, var(--sf-color-base))` |
| `--sf-color-base-500` | PUBLIC | Palette (optional) | — | `var(--sf-color-base)` |
| `--sf-color-base-600` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-base) 82%, var(--sf-color-text))` |
| `--sf-color-base-700` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-base) 62%, var(--sf-color-text))` |
| `--sf-color-base-800` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-base) 38%, var(--sf-color-text))` |
| `--sf-color-base-900` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-base) 18%, var(--sf-color-text))` |
| `--sf-color-base-950` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-base) 8%, var(--sf-color-text))` |
| `--sf-color-base-a10` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-base) 10%, transparent)` |
| `--sf-color-base-a20` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-base) 20%, transparent)` |
| `--sf-color-base-a30` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-base) 30%, transparent)` |
| `--sf-color-base-a40` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-base) 40%, transparent)` |
| `--sf-color-base-a5` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-base) 5%, transparent)` |
| `--sf-color-base-a50` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-base) 50%, transparent)` |
| `--sf-color-base-a60` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-base) 60%, transparent)` |
| `--sf-color-base-a70` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-base) 70%, transparent)` |
| `--sf-color-base-a80` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-base) 80%, transparent)` |
| `--sf-color-base-a90` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-base) 90%, transparent)` |
| `--sf-color-base-a95` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-base) 95%, transparent)` |
| `--sf-color-base-active` | PUBLIC | Core + Palette (optional) | — | `var(--sf-color-base-xdark)` |
| `--sf-color-base-darker` | PUBLIC | Core + Palette (optional) | — | `var(--sf-color-base-600)` |
| `--sf-color-base-ghost` | PUBLIC | Core + Palette (optional) | — | `var(--sf-color-base-a5)` |
| `--sf-color-base-hover` | PUBLIC | Core + Palette (optional) | — | `var(--sf-color-base-darker)` |
| `--sf-color-base-light` | PUBLIC | Core | — | `oklch(0.96 0.006 250)` |
| `--sf-color-base-lighter` | PUBLIC | Core + Palette (optional) | — | `var(--sf-color-base-400)` |
| `--sf-color-base-muted` | PUBLIC | Core + Palette (optional) | — | `var(--sf-color-base-a30)` |
| `--sf-color-base-subtle` | PUBLIC | Core + Palette (optional) | — | `var(--sf-color-base-a10)` |
| `--sf-color-base-superdark` | PUBLIC | Core + Palette (optional) | — | `var(--sf-color-base-950)` |
| `--sf-color-base-superlight` | PUBLIC | Core + Palette (optional) | — | `var(--sf-color-base-50)` |
| `--sf-color-base-xdark` | PUBLIC | Core + Palette (optional) | — | `var(--sf-color-base-800)` |
| `--sf-color-base-xlight` | PUBLIC | Core + Palette (optional) | — | `var(--sf-color-base-200)` |
| `--sf-color-bg` | PUBLIC | Core | yes | `oklch(from var(--sf-color-base) calc(l + 0.02) c h)` |
| `--sf-color-bg--active` | PUBLIC | Core | — | `oklch(from var(--sf-color-neutral) l c h / 0.12)` |
| `--sf-color-bg--disabled` | PUBLIC | Core | — | `var(--sf-color-inset)` |
| `--sf-color-bg--focus` | PUBLIC | Core | — | `oklch(from var(--sf-color-action) l c h / 0.06)` |
| `--sf-color-bg--hover` | PUBLIC | Core | — | `oklch(from var(--sf-color-neutral) l c h / 0.08)` |
| `--sf-color-bg--selected` | PUBLIC | Core | — | `oklch(from var(--sf-color-action) l c h / 0.1)` |
| `--sf-color-black` | PUBLIC | Core | — | `oklch(0% 0 0)` |
| `--sf-color-border` | PUBLIC | Core | yes | `light-dark( oklch(from var(--sf-color-neutral-light) clamp(0.70, calc(l + 0.35), 0.95) 0.005 h), oklch(from var(--sf-color-neutral) clamp(0.25, calc(l - 0.3), 0.55) 0.005 h) )` |
| `--sf-color-border--disabled` | PUBLIC | Core | — | `oklch(from var(--sf-color-border--subtle) l 0 h / 0.5)` |
| `--sf-color-border--focus` | PUBLIC | Core | — | `var(--sf-color-action)` |
| `--sf-color-border--strong` | PUBLIC | Core | yes | `light-dark( oklch(from var(--sf-color-neutral-light) clamp(0.55, calc(l + 0.1), 0.85) 0.02 h), oklch(from var(--sf-color-neutral) clamp(0.38, calc(l - 0.1), 0.65) 0.02 h) )` |
| `--sf-color-border--subtle` | PUBLIC | Core | yes | `light-dark( oklch(from var(--sf-color-neutral-light) clamp(0.75, calc(l + 0.4), 0.97) 0.005 h), oklch(from var(--sf-color-neutral) clamp(0.20, calc(l - 0.38), 0.45) 0.005 h) )` |
| `--sf-color-border--translucent` | PUBLIC | Core | — | `oklch(from var(--sf-color-neutral) l c h / 0.15)` |
| `--sf-color-code-bg` | PUBLIC | Core | — | `var(--sf-color-inset)` |
| `--sf-color-code-text` | PUBLIC | Core | — | `oklch(from var(--sf-color-code-bg) clamp(0.1, sign(var(--sf-contrast-threshold) - l) * 999, 0.95) 0 0)` |
| `--sf-color-danger` | PUBLIC | Core | yes | `light-dark(var(--sf-color-danger-light), var(--sf-color-danger-dark, oklch(from var(--sf-color-danger-light) clamp(0.65, calc(0.95 - l * 0.5), 0.88) calc(c * 0.9) h)))` |
| `--sf-color-danger-light` | PUBLIC | Core | — | `oklch(0.48 0.22 12)` |
| `--sf-color-danger-muted` | PUBLIC | Core | — | `oklch(from var(--sf-color-danger) l c h / 0.3)` |
| `--sf-color-danger-strong` | PUBLIC | Core | yes | `light-dark( oklch(from var(--sf-color-danger-light) calc(l - 0.1) c h), oklch(from var(--sf-color-danger) clamp(0.70, calc(l + 0.15), 1) c h) )` |
| `--sf-color-danger-subtle` | PUBLIC | Core | — | `oklch(from var(--sf-color-danger) l c h / 0.1)` |
| `--sf-color-dim` | PUBLIC | Core | — | `oklch(0 0 0 / 0.5)` |
| `--sf-color-error` | PUBLIC | Core | yes | `light-dark(var(--sf-color-error-light), var(--sf-color-error-dark, oklch(from var(--sf-color-error-light) clamp(0.65, calc(0.95 - l * 0.5), 0.88) calc(c * 0.9) h)))` |
| `--sf-color-error-light` | PUBLIC | Core | — | `oklch(0.50 0.20 25)` |
| `--sf-color-error-muted` | PUBLIC | Core | — | `oklch(from var(--sf-color-error) l c h / 0.3)` |
| `--sf-color-error-strong` | PUBLIC | Core | yes | `light-dark( oklch(from var(--sf-color-error-light) calc(l - 0.1) c h), oklch(from var(--sf-color-error) clamp(0.70, calc(l + 0.15), 1) c h) )` |
| `--sf-color-error-subtle` | PUBLIC | Core | — | `oklch(from var(--sf-color-error) l c h / 0.1)` |
| `--sf-color-heading` | PUBLIC | Core | yes | `light-dark( oklch(from var(--sf-color-neutral-light) clamp(0.05, calc(l - 0.4 - var(--sf-contrast-bias)), 0.35) c h), oklch(from var(--sf-color-neutral) clamp(0.70, calc(l + 0.25 + var(--sf-contrast-bias)), 1) c h) )` |
| `--sf-color-info` | PUBLIC | Core | yes | `light-dark(var(--sf-color-info-light), var(--sf-color-info-dark, oklch(from var(--sf-color-info-light) clamp(0.65, calc(0.95 - l * 0.5), 0.88) calc(c * 0.9) h)))` |
| `--sf-color-info-light` | PUBLIC | Core | — | `oklch(0.48 0.18 235)` |
| `--sf-color-info-muted` | PUBLIC | Core | — | `oklch(from var(--sf-color-info) l c h / 0.3)` |
| `--sf-color-info-strong` | PUBLIC | Core | yes | `light-dark( oklch(from var(--sf-color-info-light) calc(l - 0.1) c h), oklch(from var(--sf-color-info) clamp(0.70, calc(l + 0.15), 1) c h) )` |
| `--sf-color-info-subtle` | PUBLIC | Core | — | `oklch(from var(--sf-color-info) l c h / 0.1)` |
| `--sf-color-inset` | PUBLIC | Core | yes | `oklch(from var(--sf-color-base) calc(l - 0.02) c h)` |
| `--sf-color-inverse` | PUBLIC | Core | yes | `oklch(from var(--sf-color-base) calc(1 - l) c h)` |
| `--sf-color-link` | PUBLIC | Core | yes | `light-dark( oklch(from var(--sf-color-action) clamp(0, min(l - 0.07, 0.48), 1) c h), oklch(from var(--sf-color-action) clamp(0.68, l, 1) c h) )` |
| `--sf-color-link--active` | PUBLIC | Core | — | `light-dark( oklch(from var(--sf-color-action) clamp(0, min(l - 0.21, 0.34), 1) c h), oklch(from var(--sf-color-action) clamp(0, max(l + 0.15, 0.74), 1) c h) )` |
| `--sf-color-link--disabled` | PUBLIC | Core | — | `var(--sf-color-text--disabled)` |
| `--sf-color-link--hover` | PUBLIC | Core | — | `light-dark( oklch(from var(--sf-color-action) clamp(0, min(l - 0.15, 0.40), 1) c h), oklch(from var(--sf-color-action) clamp(0, max(l + 0.10, 0.68), 1) c h) )` |
| `--sf-color-link--underline` | PUBLIC | Core | — | `oklch(from var(--sf-color-action) l c h / 0.3)` |
| `--sf-color-link--visited` | PUBLIC | Core | — | `light-dark( oklch(from var(--sf-color-action) clamp(0, min(l - 0.07, 0.48), 1) c calc(h + 60)), oklch(from var(--sf-color-action) clamp(0.68, l, 1) c calc(h + 60)) )` |
| `--sf-color-mark-bg` | PUBLIC | Core | — | `oklch(from var(--sf-color-warning) l c h / 0.25)` |
| `--sf-color-mark-text` | PUBLIC | Core | — | `inherit` |
| `--sf-color-neutral` | PUBLIC | Core | yes | `light-dark(var(--sf-color-neutral-light), var(--sf-color-neutral-dark, oklch(from var(--sf-color-neutral-light) clamp(0.65, calc(0.95 - l * 0.5), 0.88) calc(c * 0.9) h)))` |
| `--sf-color-neutral-100` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-neutral) 8%, var(--sf-color-surface))` |
| `--sf-color-neutral-200` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-neutral) 20%, var(--sf-color-surface))` |
| `--sf-color-neutral-300` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-neutral) 40%, var(--sf-color-surface))` |
| `--sf-color-neutral-400` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-neutral) 65%, var(--sf-color-surface))` |
| `--sf-color-neutral-50` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-neutral) 4%, var(--sf-color-surface))` |
| `--sf-color-neutral-500` | PUBLIC | Palette (optional) | — | `var(--sf-color-neutral)` |
| `--sf-color-neutral-600` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-neutral) 82%, var(--sf-color-text))` |
| `--sf-color-neutral-700` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-neutral) 62%, var(--sf-color-text))` |
| `--sf-color-neutral-800` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-neutral) 38%, var(--sf-color-text))` |
| `--sf-color-neutral-900` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-neutral) 18%, var(--sf-color-text))` |
| `--sf-color-neutral-950` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-neutral) 8%, var(--sf-color-text))` |
| `--sf-color-neutral-a10` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-neutral) 10%, transparent)` |
| `--sf-color-neutral-a20` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-neutral) 20%, transparent)` |
| `--sf-color-neutral-a30` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-neutral) 30%, transparent)` |
| `--sf-color-neutral-a40` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-neutral) 40%, transparent)` |
| `--sf-color-neutral-a5` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-neutral) 5%, transparent)` |
| `--sf-color-neutral-a50` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-neutral) 50%, transparent)` |
| `--sf-color-neutral-a60` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-neutral) 60%, transparent)` |
| `--sf-color-neutral-a70` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-neutral) 70%, transparent)` |
| `--sf-color-neutral-a80` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-neutral) 80%, transparent)` |
| `--sf-color-neutral-a90` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-neutral) 90%, transparent)` |
| `--sf-color-neutral-a95` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-neutral) 95%, transparent)` |
| `--sf-color-neutral-active` | PUBLIC | Core + Palette (optional) | — | `var(--sf-color-neutral-xdark)` |
| `--sf-color-neutral-darker` | PUBLIC | Core + Palette (optional) | — | `var(--sf-color-neutral-600)` |
| `--sf-color-neutral-ghost` | PUBLIC | Core + Palette (optional) | — | `var(--sf-color-neutral-a5)` |
| `--sf-color-neutral-hover` | PUBLIC | Core + Palette (optional) | — | `var(--sf-color-neutral-darker)` |
| `--sf-color-neutral-light` | PUBLIC | Core | — | `oklch(0.52 0.025 260)` |
| `--sf-color-neutral-lighter` | PUBLIC | Core + Palette (optional) | — | `var(--sf-color-neutral-400)` |
| `--sf-color-neutral-muted` | PUBLIC | Core + Palette (optional) | — | `var(--sf-color-neutral-a30)` |
| `--sf-color-neutral-subtle` | PUBLIC | Core + Palette (optional) | — | `var(--sf-color-neutral-a10)` |
| `--sf-color-neutral-superdark` | PUBLIC | Core + Palette (optional) | — | `var(--sf-color-neutral-950)` |
| `--sf-color-neutral-superlight` | PUBLIC | Core + Palette (optional) | — | `var(--sf-color-neutral-50)` |
| `--sf-color-neutral-xdark` | PUBLIC | Core + Palette (optional) | — | `var(--sf-color-neutral-800)` |
| `--sf-color-neutral-xlight` | PUBLIC | Core + Palette (optional) | — | `var(--sf-color-neutral-200)` |
| `--sf-color-overlay` | PUBLIC | Core | yes | `oklch(from var(--sf-color-base) l c h / 0.9)` |
| `--sf-color-primary` | PUBLIC | Core | yes | `light-dark(var(--sf-color-primary-light), var(--sf-color-primary-dark, oklch(from var(--sf-color-primary-light) clamp(0.65, calc(0.95 - l * 0.5), 0.88) calc(c * 0.9) h)))` |
| `--sf-color-primary-100` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-primary) 8%, var(--sf-color-surface))` |
| `--sf-color-primary-200` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-primary) 20%, var(--sf-color-surface))` |
| `--sf-color-primary-300` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-primary) 40%, var(--sf-color-surface))` |
| `--sf-color-primary-400` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-primary) 65%, var(--sf-color-surface))` |
| `--sf-color-primary-50` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-primary) 4%, var(--sf-color-surface))` |
| `--sf-color-primary-500` | PUBLIC | Palette (optional) | — | `var(--sf-color-primary)` |
| `--sf-color-primary-600` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-primary) 82%, var(--sf-color-text))` |
| `--sf-color-primary-700` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-primary) 62%, var(--sf-color-text))` |
| `--sf-color-primary-800` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-primary) 38%, var(--sf-color-text))` |
| `--sf-color-primary-900` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-primary) 18%, var(--sf-color-text))` |
| `--sf-color-primary-950` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-primary) 8%, var(--sf-color-text))` |
| `--sf-color-primary-a10` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-primary) 10%, transparent)` |
| `--sf-color-primary-a20` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-primary) 20%, transparent)` |
| `--sf-color-primary-a30` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-primary) 30%, transparent)` |
| `--sf-color-primary-a40` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-primary) 40%, transparent)` |
| `--sf-color-primary-a5` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-primary) 5%, transparent)` |
| `--sf-color-primary-a50` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-primary) 50%, transparent)` |
| `--sf-color-primary-a60` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-primary) 60%, transparent)` |
| `--sf-color-primary-a70` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-primary) 70%, transparent)` |
| `--sf-color-primary-a80` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-primary) 80%, transparent)` |
| `--sf-color-primary-a90` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-primary) 90%, transparent)` |
| `--sf-color-primary-a95` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-primary) 95%, transparent)` |
| `--sf-color-primary-active` | PUBLIC | Core + Palette (optional) | — | `var(--sf-color-primary-xdark)` |
| `--sf-color-primary-darker` | PUBLIC | Core + Palette (optional) | — | `var(--sf-color-primary-600)` |
| `--sf-color-primary-ghost` | PUBLIC | Core + Palette (optional) | — | `var(--sf-color-primary-a5)` |
| `--sf-color-primary-hover` | PUBLIC | Core + Palette (optional) | — | `var(--sf-color-primary-darker)` |
| `--sf-color-primary-light` | PUBLIC | Core | — | `oklch(0.47 0.27 264)` |
| `--sf-color-primary-lighter` | PUBLIC | Core + Palette (optional) | — | `var(--sf-color-primary-400)` |
| `--sf-color-primary-muted` | PUBLIC | Core + Palette (optional) | — | `var(--sf-color-primary-a30)` |
| `--sf-color-primary-subtle` | PUBLIC | Core + Palette (optional) | — | `var(--sf-color-primary-a10)` |
| `--sf-color-primary-superdark` | PUBLIC | Core + Palette (optional) | — | `var(--sf-color-primary-950)` |
| `--sf-color-primary-superlight` | PUBLIC | Core + Palette (optional) | — | `var(--sf-color-primary-50)` |
| `--sf-color-primary-xdark` | PUBLIC | Core + Palette (optional) | — | `var(--sf-color-primary-800)` |
| `--sf-color-primary-xlight` | PUBLIC | Core + Palette (optional) | — | `var(--sf-color-primary-200)` |
| `--sf-color-raised` | PUBLIC | Core | yes | `oklch(from var(--sf-color-base) calc(l + 0.04) c h)` |
| `--sf-color-scheme` | PUBLIC | Core | — | `light dark` |
| `--sf-color-secondary` | PUBLIC | Core | yes | `light-dark(var(--sf-color-secondary-light), var(--sf-color-secondary-dark, oklch(from var(--sf-color-secondary-light) clamp(0.65, calc(0.95 - l * 0.5), 0.88) calc(c * 0.9) h)))` |
| `--sf-color-secondary-100` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-secondary) 8%, var(--sf-color-surface))` |
| `--sf-color-secondary-200` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-secondary) 20%, var(--sf-color-surface))` |
| `--sf-color-secondary-300` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-secondary) 40%, var(--sf-color-surface))` |
| `--sf-color-secondary-400` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-secondary) 65%, var(--sf-color-surface))` |
| `--sf-color-secondary-50` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-secondary) 4%, var(--sf-color-surface))` |
| `--sf-color-secondary-500` | PUBLIC | Palette (optional) | — | `var(--sf-color-secondary)` |
| `--sf-color-secondary-600` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-secondary) 82%, var(--sf-color-text))` |
| `--sf-color-secondary-700` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-secondary) 62%, var(--sf-color-text))` |
| `--sf-color-secondary-800` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-secondary) 38%, var(--sf-color-text))` |
| `--sf-color-secondary-900` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-secondary) 18%, var(--sf-color-text))` |
| `--sf-color-secondary-950` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-secondary) 8%, var(--sf-color-text))` |
| `--sf-color-secondary-a10` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-secondary) 10%, transparent)` |
| `--sf-color-secondary-a20` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-secondary) 20%, transparent)` |
| `--sf-color-secondary-a30` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-secondary) 30%, transparent)` |
| `--sf-color-secondary-a40` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-secondary) 40%, transparent)` |
| `--sf-color-secondary-a5` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-secondary) 5%, transparent)` |
| `--sf-color-secondary-a50` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-secondary) 50%, transparent)` |
| `--sf-color-secondary-a60` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-secondary) 60%, transparent)` |
| `--sf-color-secondary-a70` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-secondary) 70%, transparent)` |
| `--sf-color-secondary-a80` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-secondary) 80%, transparent)` |
| `--sf-color-secondary-a90` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-secondary) 90%, transparent)` |
| `--sf-color-secondary-a95` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-secondary) 95%, transparent)` |
| `--sf-color-secondary-active` | PUBLIC | Core + Palette (optional) | — | `var(--sf-color-secondary-xdark)` |
| `--sf-color-secondary-darker` | PUBLIC | Core + Palette (optional) | — | `var(--sf-color-secondary-600)` |
| `--sf-color-secondary-ghost` | PUBLIC | Core + Palette (optional) | — | `var(--sf-color-secondary-a5)` |
| `--sf-color-secondary-hover` | PUBLIC | Core + Palette (optional) | — | `var(--sf-color-secondary-darker)` |
| `--sf-color-secondary-light` | PUBLIC | Core | — | `oklch(0.22 0.04 264)` |
| `--sf-color-secondary-lighter` | PUBLIC | Core + Palette (optional) | — | `var(--sf-color-secondary-400)` |
| `--sf-color-secondary-muted` | PUBLIC | Core + Palette (optional) | — | `var(--sf-color-secondary-a30)` |
| `--sf-color-secondary-subtle` | PUBLIC | Core + Palette (optional) | — | `var(--sf-color-secondary-a10)` |
| `--sf-color-secondary-superdark` | PUBLIC | Core + Palette (optional) | — | `var(--sf-color-secondary-950)` |
| `--sf-color-secondary-superlight` | PUBLIC | Core + Palette (optional) | — | `var(--sf-color-secondary-50)` |
| `--sf-color-secondary-xdark` | PUBLIC | Core + Palette (optional) | — | `var(--sf-color-secondary-800)` |
| `--sf-color-secondary-xlight` | PUBLIC | Core + Palette (optional) | — | `var(--sf-color-secondary-200)` |
| `--sf-color-selection-bg` | PUBLIC | Core | yes | `light-dark( oklch(from var(--sf-color-action-light) l c h / 0.28), oklch(from var(--sf-color-action-light) clamp(0.62, calc(0.93 - l * 0.4), 0.78) c h / 0.55) )` |
| `--sf-color-selection-text` | PUBLIC | Core | — | `inherit` |
| `--sf-color-success` | PUBLIC | Core | yes | `light-dark(var(--sf-color-success-light), var(--sf-color-success-dark, oklch(from var(--sf-color-success-light) clamp(0.65, calc(0.95 - l * 0.5), 0.88) calc(c * 0.9) h)))` |
| `--sf-color-success-light` | PUBLIC | Core | — | `oklch(0.50 0.16 145)` |
| `--sf-color-success-muted` | PUBLIC | Core | — | `oklch(from var(--sf-color-success) l c h / 0.3)` |
| `--sf-color-success-strong` | PUBLIC | Core | yes | `light-dark( oklch(from var(--sf-color-success-light) calc(l - 0.15) c h), oklch(from var(--sf-color-success) clamp(0.70, calc(l + 0.15), 1) c h) )` |
| `--sf-color-success-subtle` | PUBLIC | Core | — | `oklch(from var(--sf-color-success) l c h / 0.12)` |
| `--sf-color-surface` | PUBLIC | Core | — | `var(--sf-color-base)` |
| `--sf-color-tertiary` | PUBLIC | Core | yes | `light-dark(var(--sf-color-tertiary-light), var(--sf-color-tertiary-dark, oklch(from var(--sf-color-tertiary-light) clamp(0.65, calc(0.95 - l * 0.5), 0.88) calc(c * 0.9) h)))` |
| `--sf-color-tertiary-100` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-tertiary) 8%, var(--sf-color-surface))` |
| `--sf-color-tertiary-200` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-tertiary) 20%, var(--sf-color-surface))` |
| `--sf-color-tertiary-300` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-tertiary) 40%, var(--sf-color-surface))` |
| `--sf-color-tertiary-400` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-tertiary) 65%, var(--sf-color-surface))` |
| `--sf-color-tertiary-50` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-tertiary) 4%, var(--sf-color-surface))` |
| `--sf-color-tertiary-500` | PUBLIC | Palette (optional) | — | `var(--sf-color-tertiary)` |
| `--sf-color-tertiary-600` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-tertiary) 82%, var(--sf-color-text))` |
| `--sf-color-tertiary-700` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-tertiary) 62%, var(--sf-color-text))` |
| `--sf-color-tertiary-800` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-tertiary) 38%, var(--sf-color-text))` |
| `--sf-color-tertiary-900` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-tertiary) 18%, var(--sf-color-text))` |
| `--sf-color-tertiary-950` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-tertiary) 8%, var(--sf-color-text))` |
| `--sf-color-tertiary-a10` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-tertiary) 10%, transparent)` |
| `--sf-color-tertiary-a20` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-tertiary) 20%, transparent)` |
| `--sf-color-tertiary-a30` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-tertiary) 30%, transparent)` |
| `--sf-color-tertiary-a40` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-tertiary) 40%, transparent)` |
| `--sf-color-tertiary-a5` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-tertiary) 5%, transparent)` |
| `--sf-color-tertiary-a50` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-tertiary) 50%, transparent)` |
| `--sf-color-tertiary-a60` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-tertiary) 60%, transparent)` |
| `--sf-color-tertiary-a70` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-tertiary) 70%, transparent)` |
| `--sf-color-tertiary-a80` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-tertiary) 80%, transparent)` |
| `--sf-color-tertiary-a90` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-tertiary) 90%, transparent)` |
| `--sf-color-tertiary-a95` | PUBLIC | Palette (optional) | — | `color-mix(in oklab, var(--sf-color-tertiary) 95%, transparent)` |
| `--sf-color-tertiary-active` | PUBLIC | Core + Palette (optional) | — | `var(--sf-color-tertiary-xdark)` |
| `--sf-color-tertiary-darker` | PUBLIC | Core + Palette (optional) | — | `var(--sf-color-tertiary-600)` |
| `--sf-color-tertiary-ghost` | PUBLIC | Core + Palette (optional) | — | `var(--sf-color-tertiary-a5)` |
| `--sf-color-tertiary-hover` | PUBLIC | Core + Palette (optional) | — | `var(--sf-color-tertiary-darker)` |
| `--sf-color-tertiary-light` | PUBLIC | Core | — | `oklch(0.42 0.22 295)` |
| `--sf-color-tertiary-lighter` | PUBLIC | Core + Palette (optional) | — | `var(--sf-color-tertiary-400)` |
| `--sf-color-tertiary-muted` | PUBLIC | Core + Palette (optional) | — | `var(--sf-color-tertiary-a30)` |
| `--sf-color-tertiary-subtle` | PUBLIC | Core + Palette (optional) | — | `var(--sf-color-tertiary-a10)` |
| `--sf-color-tertiary-superdark` | PUBLIC | Core + Palette (optional) | — | `var(--sf-color-tertiary-950)` |
| `--sf-color-tertiary-superlight` | PUBLIC | Core + Palette (optional) | — | `var(--sf-color-tertiary-50)` |
| `--sf-color-tertiary-xdark` | PUBLIC | Core + Palette (optional) | — | `var(--sf-color-tertiary-800)` |
| `--sf-color-tertiary-xlight` | PUBLIC | Core + Palette (optional) | — | `var(--sf-color-tertiary-200)` |
| `--sf-color-text` | PUBLIC | Core | yes | `light-dark( oklch(from var(--sf-color-neutral-light) clamp(0.05, calc(l - 0.4 - var(--sf-contrast-bias)), 0.35) c h), oklch(from var(--sf-color-neutral) clamp(0.70, calc(l + 0.25 + var(--sf-contrast-bias)), 1) c h) )` |
| `--sf-color-text--disabled` | PUBLIC | Core | — | `light-dark( oklch(from var(--sf-color-neutral-light) clamp(0.55, calc(l + 0.25), 0.82) c h), oklch(from var(--sf-color-neutral) clamp(0.25, calc(l - 0.2), 0.55) c h) )` |
| `--sf-color-text--inverse` | PUBLIC | Core | — | `light-dark( oklch(from var(--sf-color-neutral-light) clamp(0.85, calc(l + 0.4), 0.98) c h), oklch(from var(--sf-color-neutral) clamp(0.05, calc(l - 0.4), 0.35) c h) )` |
| `--sf-color-text--muted` | PUBLIC | Core | — | `var(--sf-color-neutral)` |
| `--sf-color-text--on-action` | PUBLIC | Core | yes | `oklch(from var(--sf-color-action) clamp(0.1, sign(var(--sf-contrast-threshold) - l) * 999, 0.95) 0 0)` |
| `--sf-color-text--on-base` | PUBLIC | Core | yes | `var(--sf-color-text)` |
| `--sf-color-text--on-danger` | PUBLIC | Core | yes | `oklch(from var(--sf-color-danger) clamp(0.1, sign(var(--sf-contrast-threshold) - l) * 999, 0.95) 0 0)` |
| `--sf-color-text--on-error` | PUBLIC | Core | yes | `oklch(from var(--sf-color-error) clamp(0.1, sign(var(--sf-contrast-threshold) - l) * 999, 0.95) 0 0)` |
| `--sf-color-text--on-info` | PUBLIC | Core | yes | `oklch(from var(--sf-color-info) clamp(0.1, sign(var(--sf-contrast-threshold) - l) * 999, 0.95) 0 0)` |
| `--sf-color-text--on-inverse` | PUBLIC | Core | yes | `var(--sf-color-text--inverse)` |
| `--sf-color-text--on-neutral` | PUBLIC | Core | yes | `oklch(from var(--sf-color-neutral) clamp(0.1, sign(var(--sf-contrast-threshold) - l) * 999, 0.95) 0 0)` |
| `--sf-color-text--on-primary` | PUBLIC | Core | yes | `oklch(from var(--sf-color-primary) clamp(0.1, sign(var(--sf-contrast-threshold) - l) * 999, 0.95) 0 0)` |
| `--sf-color-text--on-secondary` | PUBLIC | Core | yes | `oklch(from var(--sf-color-secondary) clamp(0.1, sign(var(--sf-contrast-threshold) - l) * 999, 0.95) 0 0)` |
| `--sf-color-text--on-success` | PUBLIC | Core | yes | `oklch(from var(--sf-color-success) clamp(0.1, sign(var(--sf-contrast-threshold) - l) * 999, 0.95) 0 0)` |
| `--sf-color-text--on-surface` | PUBLIC | Core | yes | `var(--sf-color-text--on-base)` |
| `--sf-color-text--on-tertiary` | PUBLIC | Core | yes | `oklch(from var(--sf-color-tertiary) clamp(0.1, sign(var(--sf-contrast-threshold) - l) * 999, 0.95) 0 0)` |
| `--sf-color-text--on-warning` | PUBLIC | Core | yes | `oklch(from var(--sf-color-warning) clamp(0.1, sign(var(--sf-contrast-threshold) - l) * 999, 0.95) 0 0)` |
| `--sf-color-text--placeholder` | PUBLIC | Core | — | `light-dark( oklch(from var(--sf-color-neutral-light) clamp(0.45, calc(l + 0.15), 0.75) c h), oklch(from var(--sf-color-neutral) clamp(0.35, calc(l - 0.1), 0.65) c h) )` |
| `--sf-color-text--secondary` | PUBLIC | Core | yes | `light-dark( oklch(from var(--sf-color-neutral-light) clamp(0.15, calc(l - 0.25 - var(--sf-contrast-bias)), 0.45) c h), oklch(from var(--sf-color-neutral) clamp(0.55, calc(l + 0.1 + var(--sf-contrast-bias)), 0.90) c h) )` |
| `--sf-color-warning` | PUBLIC | Core | yes | `light-dark(var(--sf-color-warning-light), var(--sf-color-warning-dark, oklch(from var(--sf-color-warning-light) clamp(0.65, calc(0.95 - l * 0.5), 0.88) calc(c * 0.9) h)))` |
| `--sf-color-warning-light` | PUBLIC | Core | — | `oklch(0.75 0.17 80)` |
| `--sf-color-warning-muted` | PUBLIC | Core | — | `oklch(from var(--sf-color-warning) l c h / 0.3)` |
| `--sf-color-warning-strong` | PUBLIC | Core | yes | `light-dark( oklch(from var(--sf-color-warning-light) calc(l - 0.25) c h), oklch(from var(--sf-color-warning) clamp(0.70, calc(l + 0.05), 1) c h) )` |
| `--sf-color-warning-subtle` | PUBLIC | Core | — | `oklch(from var(--sf-color-warning) l c h / 0.12)` |
| `--sf-color-white` | PUBLIC | Core | — | `oklch(100% 0 0)` |
| `--sf-component-pad` | PUBLIC | Core | — | `var(--sf-space-m)` |
| `--sf-container-default` | PUBLIC | Core | — | `75rem` |
| `--sf-container-full` | PUBLIC | Core | — | `100%` |
| `--sf-container-narrow` | PUBLIC | Core | — | `38rem` |
| `--sf-container-prose` | PUBLIC | Core | — | `65ch` |
| `--sf-container-wide` | PUBLIC | Core | — | `90rem` |
| `--sf-content-gap` | PUBLIC | Core | — | `var(--sf-space-s)` |
| `--sf-content-intrinsic-size` | PUBLIC | Macros | — | `500px` |
| `--sf-content-width` | PUBLIC | Layout | — | `var(--sf-container-default)` |
| `--sf-contrast-bias` | PUBLIC-ADVANCED | Core | — | `0` |
| `--sf-contrast-threshold` | PUBLIC-ADVANCED | Core | — | `0.6` |
| `--sf-cover-min-height` | PUBLIC | Layout | — | `100dvh` |
| `--sf-cover-padding` | PUBLIC | Layout | — | `var(--sf-section-pad)` |
| `--sf-current-font-weight` | PUBLIC | Core | — | `var(--sf-font-weight-bold)` |
| `--sf-divider-color` | PUBLIC | Core | — | `var(--sf-color-border)` |
| `--sf-divider-gap` | PUBLIC | Core | — | `var(--sf-space-m)` |
| `--sf-divider-style` | PUBLIC | Core | — | `solid` |
| `--sf-divider-width` | PUBLIC | Core | — | `var(--sf-border-width-1)` |
| `--sf-drop-shadow-l` | PUBLIC | Core | yes | `drop-shadow(0 8px 16px oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 2.5), 0.7)))` |
| `--sf-drop-shadow-m` | PUBLIC | Core | yes | `drop-shadow(0 4px 6px oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 2), 0.7)))` |
| `--sf-drop-shadow-s` | PUBLIC | Core | yes | `drop-shadow(0 1px 2px oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 1.5), 0.7)))` |
| `--sf-duration-fast` | PUBLIC | Core | — | `calc(150ms * var(--sf-motion-scale))` |
| `--sf-duration-instant` | PUBLIC | Core | — | `calc(100ms * var(--sf-motion-scale))` |
| `--sf-duration-none` | PUBLIC | Core | — | `0ms` |
| `--sf-duration-normal` | PUBLIC | Core | — | `calc(250ms * var(--sf-motion-scale))` |
| `--sf-duration-slow` | PUBLIC | Core | — | `calc(400ms * var(--sf-motion-scale))` |
| `--sf-duration-slower` | PUBLIC | Core | — | `calc(600ms * var(--sf-motion-scale))` |
| `--sf-ease-bounce` | PUBLIC | Core | — | `linear(0, 0.35 18%, 1 32%, 0.86 42%, 1.02 56%, 0.98 72%, 1)` |
| `--sf-ease-elastic` | PUBLIC | Core | — | `linear(0, 0.3, 1.2, 0.9, 1.05, 1)` |
| `--sf-ease-in` | PUBLIC | Core | — | `cubic-bezier(0.5, 0, 0.75, 0.25)` |
| `--sf-ease-in-out` | PUBLIC | Core | — | `cubic-bezier(0.4, 0, 0.2, 1)` |
| `--sf-ease-linear` | PUBLIC | Core | — | `linear` |
| `--sf-ease-out` | PUBLIC | Core | — | `cubic-bezier(0.25, 0, 0.15, 1)` |
| `--sf-ease-overshoot` | PUBLIC | Core | — | `linear(0, 0.6 30%, 1.08 55%, 0.98 75%, 1)` |
| `--sf-ease-spring` | PUBLIC | Core | — | `linear(0, 0.5, 1.1, 0.95, 1.02, 1)` |
| `--sf-equal-cols` | PUBLIC | Layout | — | `2` |
| `--sf-equal-gap` | PUBLIC | Layout | — | `var(--sf-space-gap)` |
| `--sf-field-block` | PUBLIC | Core | — | `var(--sf-space-l)` |
| `--sf-field-required-marker` | PUBLIC | Core | — | `" *"` |
| `--sf-flow-space` | PUBLIC | Macros | — | `var(--sf-space-content)` |
| `--sf-focus-ring-color` | PUBLIC | Core | — | `var(--sf-color-action)` |
| `--sf-focus-ring-offset` | PUBLIC | Core | — | `2px` |
| `--sf-focus-ring-shadow` | PUBLIC-ADVANCED | Core | — | `0 0 0 var(--sf-focus-ring-offset) var(--sf-color-bg), 0 0 0 calc(var(--sf-focus-ring-offset) + var(--sf-focus-ring-width)) var(--sf-focus-ring-color)` |
| `--sf-focus-ring-style` | PUBLIC | Core | — | `solid` |
| `--sf-focus-ring-width` | PUBLIC | Core | — | `2px` |
| `--sf-font-body` | PUBLIC | Core | — | `system-ui, -apple-system, sans-serif` |
| `--sf-font-display` | PUBLIC | Core | — | `var(--sf-font-heading)` |
| `--sf-font-features` | PUBLIC-ADVANCED | Core | — | `normal` |
| `--sf-font-geometric` | PUBLIC | Core | — | `"Avenir", "Montserrat", "Corbel", "URW Gothic", source-sans-pro, sans-serif` |
| `--sf-font-heading` | PUBLIC | Core | — | `var(--sf-font-body)` |
| `--sf-font-humanist` | PUBLIC | Core | — | `"Seravek", "Gill Sans Nova", "Ubuntu", "Calibri", "DejaVu Sans", source-sans-pro, sans-serif` |
| `--sf-font-mono` | PUBLIC | Core | — | `ui-monospace, monospace` |
| `--sf-font-numeric` | PUBLIC | Core | — | `tabular-nums` |
| `--sf-font-slab` | PUBLIC | Core | — | `"Rockwell", "Rockwell Nova", "Roboto Slab", "DejaVu Serif", "Sitka Small", serif` |
| `--sf-font-variation` | PUBLIC-ADVANCED | Core | — | `normal` |
| `--sf-font-weight-black` | PUBLIC | Core | — | `900` |
| `--sf-font-weight-body` | PUBLIC | Core | — | `var(--sf-font-weight-normal)` |
| `--sf-font-weight-bold` | PUBLIC | Core | — | `700` |
| `--sf-font-weight-display` | PUBLIC | Core | — | `var(--sf-font-weight-bold)` |
| `--sf-font-weight-extrabold` | PUBLIC | Core | — | `800` |
| `--sf-font-weight-extralight` | PUBLIC | Core | — | `200` |
| `--sf-font-weight-heading` | PUBLIC | Core | — | `var(--sf-font-weight-semibold)` |
| `--sf-font-weight-light` | PUBLIC | Core | — | `300` |
| `--sf-font-weight-medium` | PUBLIC | Core | — | `500` |
| `--sf-font-weight-normal` | PUBLIC | Core | — | `400` |
| `--sf-font-weight-semibold` | PUBLIC | Core | — | `600` |
| `--sf-font-weight-thin` | PUBLIC | Core | — | `100` |
| `--sf-frame-ratio` | PUBLIC | Layout | — | `16 / 9` |
| `--sf-gap` | PUBLIC | Core | — | `var(--sf-space-m)` |
| `--sf-gap-size` | PUBLIC | Layout | — | `var(--sf-space-gap)` |
| `--sf-gradient-brand` | PUBLIC | Core | — | `linear-gradient(in oklch 135deg, var(--sf-color-primary), oklch(from var(--sf-color-primary) l c calc(h + 30)))` |
| `--sf-gradient-fade--b` | PUBLIC | Core | — | `linear-gradient(in oklch to bottom, transparent, var(--sf-color-bg))` |
| `--sf-gradient-fade--l` | PUBLIC | Core | — | `linear-gradient(in oklch to left, transparent, var(--sf-color-bg))` |
| `--sf-gradient-fade--r` | PUBLIC | Core | — | `linear-gradient(in oklch to right, transparent, var(--sf-color-bg))` |
| `--sf-gradient-fade--t` | PUBLIC | Core | — | `linear-gradient(in oklch to top, transparent, var(--sf-color-bg))` |
| `--sf-gradient-primary` | PUBLIC | Core | — | `linear-gradient(in oklch 135deg, var(--sf-color-primary), oklch(from var(--sf-color-primary) calc(l - 0.08) c h))` |
| `--sf-gradient-secondary` | PUBLIC | Core | — | `linear-gradient(in oklch 135deg, var(--sf-color-secondary), oklch(from var(--sf-color-secondary) calc(l - 0.08) c h))` |
| `--sf-gradient-surface` | PUBLIC | Core | — | `linear-gradient(in oklab 180deg, var(--sf-color-surface), var(--sf-color-bg))` |
| `--sf-gradient-tertiary` | PUBLIC | Core | — | `linear-gradient(in oklch 135deg, var(--sf-color-tertiary), oklch(from var(--sf-color-tertiary) calc(l - 0.08) c h))` |
| `--sf-grid-gap` | PUBLIC | Layout | — | `var(--sf-space-gap)` |
| `--sf-grid-min` | PUBLIC | Layout | — | `16rem` |
| `--sf-grid-min-2xl` | PUBLIC | Layout | — | `28rem` |
| `--sf-grid-min-l` | PUBLIC | Layout | — | `20rem` |
| `--sf-grid-min-m` | PUBLIC | Layout | — | `16rem` |
| `--sf-grid-min-s` | PUBLIC | Layout | — | `13rem` |
| `--sf-grid-min-xl` | PUBLIC | Layout | — | `24rem` |
| `--sf-grid-min-xs` | PUBLIC | Layout | — | `10rem` |
| `--sf-h1-font-weight` | PUBLIC | Core | — | `var(--sf-font-weight-heading)` |
| `--sf-h1-letter-spacing` | PUBLIC | Core | — | `var(--sf-tracking-tight)` |
| `--sf-h1-line-height` | PUBLIC | Core | — | `var(--sf-leading-tight)` |
| `--sf-h1-size` | PUBLIC | Core | — | `var(--sf-text-4xl)` |
| `--sf-h2-font-weight` | PUBLIC | Core | — | `var(--sf-font-weight-heading)` |
| `--sf-h2-letter-spacing` | PUBLIC | Core | — | `var(--sf-tracking-tight)` |
| `--sf-h2-line-height` | PUBLIC | Core | — | `var(--sf-leading-tight)` |
| `--sf-h2-size` | PUBLIC | Core | — | `var(--sf-text-3xl)` |
| `--sf-h3-font-weight` | PUBLIC | Core | — | `var(--sf-font-weight-heading)` |
| `--sf-h3-letter-spacing` | PUBLIC | Core | — | `var(--sf-tracking-normal)` |
| `--sf-h3-line-height` | PUBLIC | Core | — | `var(--sf-leading-snug)` |
| `--sf-h3-size` | PUBLIC | Core | — | `var(--sf-text-2xl)` |
| `--sf-h4-font-weight` | PUBLIC | Core | — | `var(--sf-font-weight-heading)` |
| `--sf-h4-letter-spacing` | PUBLIC | Core | — | `var(--sf-tracking-normal)` |
| `--sf-h4-line-height` | PUBLIC | Core | — | `var(--sf-leading-snug)` |
| `--sf-h4-size` | PUBLIC | Core | — | `var(--sf-text-xl)` |
| `--sf-h5-font-weight` | PUBLIC | Core | — | `var(--sf-font-weight-heading)` |
| `--sf-h5-letter-spacing` | PUBLIC | Core | — | `var(--sf-tracking-normal)` |
| `--sf-h5-line-height` | PUBLIC | Core | — | `var(--sf-leading-normal)` |
| `--sf-h5-size` | PUBLIC | Core | — | `var(--sf-text-l)` |
| `--sf-h6-font-weight` | PUBLIC | Core | — | `var(--sf-font-weight-heading)` |
| `--sf-h6-letter-spacing` | PUBLIC | Core | — | `var(--sf-tracking-wide)` |
| `--sf-h6-line-height` | PUBLIC | Core | — | `var(--sf-leading-normal)` |
| `--sf-h6-size` | PUBLIC | Core | — | `var(--sf-text-m)` |
| `--sf-header-height` | PUBLIC | Core | — | `clamp( var(--sf-header-height-mobile), calc(0.022222222222222223 * (100vw - 22.5rem) + var(--sf-header-height-mobile)), var(--sf-header-height-desktop))` |
| `--sf-header-height-desktop` | PUBLIC | Core | — | `5rem` |
| `--sf-header-height-mobile` | PUBLIC | Core | — | `3.5rem` |
| `--sf-heading-color` | PUBLIC | Core | — | `var(--sf-color-heading)` |
| `--sf-heading-font-family` | PUBLIC | Core | — | `var(--sf-font-heading)` |
| `--sf-heading-text-wrap` | PUBLIC | Core | — | `balance` |
| `--sf-icon-2xl` | PUBLIC | Core | — | `4em` |
| `--sf-icon-box-bg` | PUBLIC | Layout | — | `var(--sf-color-inset)` |
| `--sf-icon-box-border` | PUBLIC | Layout | — | `var(--sf-border-width-1) solid var(--sf-color-border)` |
| `--sf-icon-box-pad` | PUBLIC | Layout | — | `0.5em` |
| `--sf-icon-box-radius` | PUBLIC | Layout | — | `var(--sf-radius-s)` |
| `--sf-icon-l` | PUBLIC | Core | — | `2em` |
| `--sf-icon-m` | PUBLIC | Core | — | `1.5em` |
| `--sf-icon-s` | PUBLIC | Core | — | `1em` |
| `--sf-icon-xl` | PUBLIC | Core | — | `3em` |
| `--sf-icon-xs` | PUBLIC | Core | — | `0.875em` |
| `--sf-imposter-margin` | PUBLIC | Layout | — | `var(--sf-space-m)` |
| `--sf-is-active` | PUBLIC-ADVANCED | Core | — | `0 (registered)` |
| `--sf-is-current` | PUBLIC-ADVANCED | Core | — | `0 (registered)` |
| `--sf-is-dark` | INTERNAL | Core | — | `0 (registered)` |
| `--sf-is-open` | PUBLIC-ADVANCED | Core | — | `0 (registered)` |
| `--sf-is-pressed` | PUBLIC-ADVANCED | Core | — | `0 (registered)` |
| `--sf-leading-normal` | PUBLIC | Core | — | `1.5` |
| `--sf-leading-relaxed` | PUBLIC | Core | — | `1.625` |
| `--sf-leading-snug` | PUBLIC | Core | — | `1.3` |
| `--sf-leading-tight` | PUBLIC | Core | — | `1.1` |
| `--sf-line-clamp` | PUBLIC | Macros | — | `3` |
| `--sf-link-external-marker` | PUBLIC | Core | — | `" \\2197"` |
| `--sf-link-underline-offset` | PUBLIC | Core | — | `0.15em` |
| `--sf-link-underline-thickness` | PUBLIC | Core | — | `auto` |
| `--sf-lumlocker` | PUBLIC-ADVANCED | Core | — | `0.65` |
| `--sf-mask-scrim-end` | PUBLIC-ADVANCED | Core | — | `var(--sf-space-l)` |
| `--sf-mask-scrim-start` | PUBLIC-ADVANCED | Core | — | `var(--sf-space-l)` |
| `--sf-motion-scale` | PUBLIC-ADVANCED | Core | — | `1` |
| `--sf-object-fit` | PUBLIC | Core | — | `cover` |
| `--sf-object-position` | PUBLIC | Core | — | `50% 50%` |
| `--sf-opacity-0` | PUBLIC | Core | — | `0` |
| `--sf-opacity-10` | PUBLIC | Core | — | `0.1` |
| `--sf-opacity-100` | PUBLIC | Core | — | `1` |
| `--sf-opacity-25` | PUBLIC | Core | — | `0.25` |
| `--sf-opacity-50` | PUBLIC | Core | — | `0.5` |
| `--sf-opacity-75` | PUBLIC | Core | — | `0.75` |
| `--sf-opacity-disabled` | PUBLIC | Core | — | `0.45` |
| `--sf-optical-sizing` | PUBLIC-ADVANCED | Core | — | `auto` |
| `--sf-perspective-far` | PUBLIC-ADVANCED | Core | — | `2000px` |
| `--sf-perspective-near` | PUBLIC-ADVANCED | Core | — | `500px` |
| `--sf-perspective-normal` | PUBLIC-ADVANCED | Core | — | `1000px` |
| `--sf-print-base-size` | PUBLIC-ADVANCED | Core | — | `11pt` |
| `--sf-print-page-margin` | PUBLIC-ADVANCED | Core | — | `2cm` |
| `--sf-print-page-size` | PUBLIC-ADVANCED | Core | — | `a4` |
| `--sf-prose-block-margin` | PUBLIC | Macros | — | `var(--sf-space-m)` |
| `--sf-prose-figcaption-size` | PUBLIC | Macros | — | `var(--sf-text-s)` |
| `--sf-prose-figure-margin` | PUBLIC | Macros | — | `var(--sf-space-l)` |
| `--sf-prose-heading-gap` | PUBLIC | Macros | — | `var(--sf-space-s)` |
| `--sf-prose-list-gap` | PUBLIC | Macros | — | `var(--sf-space-xs)` |
| `--sf-prose-marker-color` | PUBLIC | Macros | — | `var(--sf-color-primary)` |
| `--sf-prose-media-margin` | PUBLIC | Macros | — | `var(--sf-space-m)` |
| `--sf-prose-media-radius` | PUBLIC | Macros | — | `var(--sf-radius-m)` |
| `--sf-prose-paragraph` | PUBLIC | Layout | — | `var(--sf-space-content)` |
| `--sf-radius-2xl` | PUBLIC | Core | — | `calc(24px * var(--sf-radius-scale))` |
| `--sf-radius-3xl` | PUBLIC | Core | — | `calc(32px * var(--sf-radius-scale))` |
| `--sf-radius-4xl` | PUBLIC | Core | — | `calc(48px * var(--sf-radius-scale))` |
| `--sf-radius-full` | PUBLIC | Core | — | `9999px` |
| `--sf-radius-l` | PUBLIC | Core | — | `calc(12px * var(--sf-radius-scale))` |
| `--sf-radius-m` | PUBLIC | Core | — | `calc(8px * var(--sf-radius-scale))` |
| `--sf-radius-none` | PUBLIC | Core | — | `0` |
| `--sf-radius-outer` | PUBLIC-ADVANCED | Core | — | `calc(var(--sf-radius-m) + var(--sf-component-pad))` |
| `--sf-radius-pill` | PUBLIC | Core | — | `var(--sf-radius-full)` |
| `--sf-radius-s` | PUBLIC | Core | — | `calc(4px * var(--sf-radius-scale))` |
| `--sf-radius-scale` | PUBLIC-ADVANCED | Core | — | `1` |
| `--sf-radius-xl` | PUBLIC | Core | — | `calc(16px * var(--sf-radius-scale))` |
| `--sf-radius-xs` | PUBLIC | Core | — | `calc(2px * var(--sf-radius-scale))` |
| `--sf-ratio-3-2` | PUBLIC | Core | — | `3 / 2` |
| `--sf-ratio-4-3` | PUBLIC | Core | — | `4 / 3` |
| `--sf-ratio-cinema` | PUBLIC | Core | — | `21 / 9` |
| `--sf-ratio-golden` | PUBLIC | Core | — | `1.618 / 1` |
| `--sf-ratio-portrait` | PUBLIC | Core | — | `3 / 4` |
| `--sf-ratio-square` | PUBLIC | Core | — | `1` |
| `--sf-ratio-video` | PUBLIC | Core | — | `16 / 9` |
| `--sf-reel-gap` | PUBLIC | Layout | — | `var(--sf-space-gap)` |
| `--sf-reel-height` | PUBLIC | Layout | — | `auto` |
| `--sf-reel-item-width` | PUBLIC | Layout | — | `max-content` |
| `--sf-safe-bottom` | PUBLIC-ADVANCED | Core | — | `env(safe-area-inset-bottom, 0px)` |
| `--sf-safe-left` | PUBLIC-ADVANCED | Core | — | `env(safe-area-inset-left, 0px)` |
| `--sf-safe-right` | PUBLIC-ADVANCED | Core | — | `env(safe-area-inset-right, 0px)` |
| `--sf-safe-top` | PUBLIC-ADVANCED | Core | — | `env(safe-area-inset-top, 0px)` |
| `--sf-scrim-color` | PUBLIC | Macros | — | `oklch(0 0 0 / 0.55)` |
| `--sf-scrim-direction` | PUBLIC | Macros | — | `to top` |
| `--sf-scrim-gradient` | PUBLIC | Macros | — | `linear-gradient(var(--sf-scrim-direction), var(--sf-scrim-color), transparent)` |
| `--sf-scrim-text-shadow` | PUBLIC | Macros | — | `0 1px 3px oklch(0 0 0 / 0.6)` |
| `--sf-scroll-shadow-size` | PUBLIC | Macros | — | `2rem` |
| `--sf-scroll-timeline-range-end` | PUBLIC-ADVANCED | Core | — | `cover 30%` |
| `--sf-scroll-timeline-range-start` | PUBLIC-ADVANCED | Core | — | `entry 0%` |
| `--sf-scrollbar-thumb` | PUBLIC | Core | — | `var(--sf-color-neutral)` |
| `--sf-scrollbar-track` | PUBLIC | Core | — | `transparent` |
| `--sf-section-pad` | PUBLIC | Core | — | `var(--sf-section-pad--m)` |
| `--sf-section-pad--2xl` | PUBLIC | Core | — | `calc(var(--sf-space-4xl) * 2)` |
| `--sf-section-pad--l` | PUBLIC | Core | — | `var(--sf-space-4xl)` |
| `--sf-section-pad--m` | PUBLIC | Core | — | `var(--sf-space-3xl)` |
| `--sf-section-pad--s` | PUBLIC | Core | — | `var(--sf-space-2xl)` |
| `--sf-section-pad--xl` | PUBLIC | Core | — | `calc(var(--sf-space-4xl) * 1.5)` |
| `--sf-section-pad--xs` | PUBLIC | Core | — | `var(--sf-space-xl)` |
| `--sf-shadow-2xl` | PUBLIC | Core | yes | `0 4px 12px 0 oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 0.6), 0.7)), 0 20px 60px 0 oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 4), 0.7)), 0 40px 100px -8px oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 5), 0.7))` |
| `--sf-shadow-color` | PUBLIC-ADVANCED | Core | — | `oklch(from var(--sf-color-neutral) 0.15 c h)` |
| `--sf-shadow-glow` | PUBLIC | Core | — | `0 0 15px 2px oklch(from var(--sf-shadow-glow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 2), 0.7))` |
| `--sf-shadow-glow-color` | PUBLIC-ADVANCED | Core | — | `var(--sf-color-primary)` |
| `--sf-shadow-inner` | PUBLIC | Core | yes | `inset 0 2px 4px 0 oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 2), 0.7))` |
| `--sf-shadow-l` | PUBLIC | Core | yes | `0 2px 4px 0 oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 0.5), 0.7)), 0 8px 24px 0 oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 3), 0.7)), 0 16px 48px 0 oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 2), 0.7))` |
| `--sf-shadow-m` | PUBLIC | Core | yes | `0 1px 3px 0 oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 0.5), 0.7)), 0 4px 12px 0 oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 2), 0.7))` |
| `--sf-shadow-none` | PUBLIC | Core | yes | `none` |
| `--sf-shadow-s` | PUBLIC | Core | yes | `0 1px 2px 0 oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 0.5), 0.7)), 0 2px 6px 0 oklch(from var(--sf-shadow-color) l c h / clamp(0, var(--sf-shadow-strength), 0.7))` |
| `--sf-shadow-strength` | PUBLIC-ADVANCED | Core | — | `calc(0.08 + var(--sf-is-dark) * 0.17)` |
| `--sf-shadow-xl` | PUBLIC | Core | yes | `0 2px 8px 0 oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 0.5), 0.7)), 0 12px 36px 0 oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 3.5), 0.7)), 0 24px 72px 0 oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 2.5), 0.7))` |
| `--sf-shadow-xs` | PUBLIC | Core | yes | `0 1px 2px 0 oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 0.5), 0.7))` |
| `--sf-sidebar-gap` | PUBLIC | Layout | — | `var(--sf-space-gap)` |
| `--sf-sidebar-min-width` | PUBLIC | Layout | — | `50%` |
| `--sf-sidebar-width` | PUBLIC | Layout | — | `18rem` |
| `--sf-size-l` | PUBLIC | Core | — | `2.75rem` |
| `--sf-size-m` | PUBLIC | Core | — | `2.5rem` |
| `--sf-size-s` | PUBLIC | Core | — | `2rem` |
| `--sf-size-xl` | PUBLIC | Core | — | `3.5rem` |
| `--sf-size-xs` | PUBLIC | Core | — | `1.5rem` |
| `--sf-space-2xl` | PUBLIC | Core | — | `calc(clamp(1.95rem, calc(0.04133333333333333 * (100vw - 22.5rem) + 1.95rem), 4.74rem) * var(--sf-space-scale))` |
| `--sf-space-2xl-to-2xs` | PUBLIC | Sizes-extended (optional) | — | `calc(clamp(0.51rem, calc(0.0626666666666667 * (100vw - 22.5rem) + 0.51rem), 4.74rem) * var(--sf-space-scale))` |
| `--sf-space-2xl-to-l` | PUBLIC | Sizes-extended (optional) | — | `calc(clamp(1.25rem, calc(0.0517037037037037 * (100vw - 22.5rem) + 1.25rem), 4.74rem) * var(--sf-space-scale))` |
| `--sf-space-2xl-to-m` | PUBLIC | Sizes-extended (optional) | — | `calc(clamp(1rem, calc(0.0554074074074074 * (100vw - 22.5rem) + 1rem), 4.74rem) * var(--sf-space-scale))` |
| `--sf-space-2xl-to-s` | PUBLIC | Sizes-extended (optional) | — | `calc(clamp(0.8rem, calc(0.0583703703703704 * (100vw - 22.5rem) + 0.8rem), 4.74rem) * var(--sf-space-scale))` |
| `--sf-space-2xl-to-xl` | PUBLIC | Sizes-extended (optional) | — | `calc(clamp(1.56rem, calc(0.0471111111111111 * (100vw - 22.5rem) + 1.56rem), 4.74rem) * var(--sf-space-scale))` |
| `--sf-space-2xl-to-xs` | PUBLIC | Sizes-extended (optional) | — | `calc(clamp(0.64rem, calc(0.0607407407407407 * (100vw - 22.5rem) + 0.64rem), 4.74rem) * var(--sf-space-scale))` |
| `--sf-space-2xs` | PUBLIC | Core | — | `calc(clamp(0.51rem, calc(0.004888888888888888 * (100vw - 22.5rem) + 0.51rem), 0.84rem) * var(--sf-space-scale))` |
| `--sf-space-3xl` | PUBLIC | Core | — | `calc(clamp(2.44rem, calc(0.057333333333333326 * (100vw - 22.5rem) + 2.44rem), 6.31rem) * var(--sf-space-scale))` |
| `--sf-space-3xl-to-2xl` | PUBLIC | Sizes-extended (optional) | — | `calc(clamp(1.95rem, calc(0.0645925925925926 * (100vw - 22.5rem) + 1.95rem), 6.31rem) * var(--sf-space-scale))` |
| `--sf-space-3xl-to-2xs` | PUBLIC | Sizes-extended (optional) | — | `calc(clamp(0.51rem, calc(0.0859259259259259 * (100vw - 22.5rem) + 0.51rem), 6.31rem) * var(--sf-space-scale))` |
| `--sf-space-3xl-to-l` | PUBLIC | Sizes-extended (optional) | — | `calc(clamp(1.25rem, calc(0.074962962962963 * (100vw - 22.5rem) + 1.25rem), 6.31rem) * var(--sf-space-scale))` |
| `--sf-space-3xl-to-m` | PUBLIC | Sizes-extended (optional) | — | `calc(clamp(1rem, calc(0.0786666666666667 * (100vw - 22.5rem) + 1rem), 6.31rem) * var(--sf-space-scale))` |
| `--sf-space-3xl-to-s` | PUBLIC | Sizes-extended (optional) | — | `calc(clamp(0.8rem, calc(0.0816296296296296 * (100vw - 22.5rem) + 0.8rem), 6.31rem) * var(--sf-space-scale))` |
| `--sf-space-3xl-to-xl` | PUBLIC | Sizes-extended (optional) | — | `calc(clamp(1.56rem, calc(0.0703703703703704 * (100vw - 22.5rem) + 1.56rem), 6.31rem) * var(--sf-space-scale))` |
| `--sf-space-3xl-to-xs` | PUBLIC | Sizes-extended (optional) | — | `calc(clamp(0.64rem, calc(0.084 * (100vw - 22.5rem) + 0.64rem), 6.31rem) * var(--sf-space-scale))` |
| `--sf-space-4xl` | PUBLIC | Core | — | `calc(clamp(3.05rem, calc(0.07955555555555556 * (100vw - 22.5rem) + 3.05rem), 8.42rem) * var(--sf-space-scale))` |
| `--sf-space-4xl-to-2xl` | PUBLIC | Sizes-extended (optional) | — | `calc(clamp(1.95rem, calc(0.0958518518518519 * (100vw - 22.5rem) + 1.95rem), 8.42rem) * var(--sf-space-scale))` |
| `--sf-space-4xl-to-2xs` | PUBLIC | Sizes-extended (optional) | — | `calc(clamp(0.51rem, calc(0.117185185185185 * (100vw - 22.5rem) + 0.51rem), 8.42rem) * var(--sf-space-scale))` |
| `--sf-space-4xl-to-3xl` | PUBLIC | Sizes-extended (optional) | — | `calc(clamp(2.44rem, calc(0.0885925925925926 * (100vw - 22.5rem) + 2.44rem), 8.42rem) * var(--sf-space-scale))` |
| `--sf-space-4xl-to-l` | PUBLIC | Sizes-extended (optional) | — | `calc(clamp(1.25rem, calc(0.106222222222222 * (100vw - 22.5rem) + 1.25rem), 8.42rem) * var(--sf-space-scale))` |
| `--sf-space-4xl-to-m` | PUBLIC | Sizes-extended (optional) | — | `calc(clamp(1rem, calc(0.109925925925926 * (100vw - 22.5rem) + 1rem), 8.42rem) * var(--sf-space-scale))` |
| `--sf-space-4xl-to-s` | PUBLIC | Sizes-extended (optional) | — | `calc(clamp(0.8rem, calc(0.112888888888889 * (100vw - 22.5rem) + 0.8rem), 8.42rem) * var(--sf-space-scale))` |
| `--sf-space-4xl-to-xl` | PUBLIC | Sizes-extended (optional) | — | `calc(clamp(1.56rem, calc(0.10162962962963 * (100vw - 22.5rem) + 1.56rem), 8.42rem) * var(--sf-space-scale))` |
| `--sf-space-4xl-to-xs` | PUBLIC | Sizes-extended (optional) | — | `calc(clamp(0.64rem, calc(0.115259259259259 * (100vw - 22.5rem) + 0.64rem), 8.42rem) * var(--sf-space-scale))` |
| `--sf-space-content` | PUBLIC | Layout | — | `var(--sf-content-gap)` |
| `--sf-space-gap` | PUBLIC | Layout | — | `var(--sf-gap)` |
| `--sf-space-gutter` | PUBLIC | Core | — | `var(--sf-space-l)` |
| `--sf-space-l` | PUBLIC | Core | — | `calc(clamp(1.25rem, calc(0.021037037037037035 * (100vw - 22.5rem) + 1.25rem), 2.67rem) * var(--sf-space-scale))` |
| `--sf-space-l-to-2xs` | PUBLIC | Sizes-extended (optional) | — | `calc(clamp(0.51rem, calc(0.032 * (100vw - 22.5rem) + 0.51rem), 2.67rem) * var(--sf-space-scale))` |
| `--sf-space-l-to-m` | PUBLIC | Sizes-extended (optional) | — | `calc(clamp(1rem, calc(0.0247407407407407 * (100vw - 22.5rem) + 1rem), 2.67rem) * var(--sf-space-scale))` |
| `--sf-space-l-to-s` | PUBLIC | Sizes-extended (optional) | — | `calc(clamp(0.8rem, calc(0.0277037037037037 * (100vw - 22.5rem) + 0.8rem), 2.67rem) * var(--sf-space-scale))` |
| `--sf-space-l-to-xs` | PUBLIC | Sizes-extended (optional) | — | `calc(clamp(0.64rem, calc(0.0300740740740741 * (100vw - 22.5rem) + 0.64rem), 2.67rem) * var(--sf-space-scale))` |
| `--sf-space-m` | PUBLIC | Core | — | `calc(clamp(1rem, calc(0.014814814814814815 * (100vw - 22.5rem) + 1rem), 2rem) * var(--sf-space-scale))` |
| `--sf-space-m-to-2xs` | PUBLIC | Sizes-extended (optional) | — | `calc(clamp(0.51rem, calc(0.0220740740740741 * (100vw - 22.5rem) + 0.51rem), 2rem) * var(--sf-space-scale))` |
| `--sf-space-m-to-s` | PUBLIC | Sizes-extended (optional) | — | `calc(clamp(0.8rem, calc(0.0177777777777778 * (100vw - 22.5rem) + 0.8rem), 2rem) * var(--sf-space-scale))` |
| `--sf-space-m-to-xs` | PUBLIC | Sizes-extended (optional) | — | `calc(clamp(0.64rem, calc(0.0201481481481481 * (100vw - 22.5rem) + 0.64rem), 2rem) * var(--sf-space-scale))` |
| `--sf-space-none` | PUBLIC | Core | — | `0` |
| `--sf-space-px` | PUBLIC | Core | — | `1px` |
| `--sf-space-s` | PUBLIC | Core | — | `calc(clamp(0.8rem, calc(0.01037037037037037 * (100vw - 22.5rem) + 0.8rem), 1.5rem) * var(--sf-space-scale))` |
| `--sf-space-s-to-2xs` | PUBLIC | Sizes-extended (optional) | — | `calc(clamp(0.51rem, calc(0.0146666666666667 * (100vw - 22.5rem) + 0.51rem), 1.5rem) * var(--sf-space-scale))` |
| `--sf-space-s-to-xs` | PUBLIC | Sizes-extended (optional) | — | `calc(clamp(0.64rem, calc(0.0127407407407407 * (100vw - 22.5rem) + 0.64rem), 1.5rem) * var(--sf-space-scale))` |
| `--sf-space-scale` | PUBLIC-ADVANCED | Core | — | `1` |
| `--sf-space-xl` | PUBLIC | Core | — | `calc(clamp(1.56rem, calc(0.029481481481481477 * (100vw - 22.5rem) + 1.56rem), 3.55rem) * var(--sf-space-scale))` |
| `--sf-space-xl-to-2xs` | PUBLIC | Sizes-extended (optional) | — | `calc(clamp(0.51rem, calc(0.045037037037037 * (100vw - 22.5rem) + 0.51rem), 3.55rem) * var(--sf-space-scale))` |
| `--sf-space-xl-to-l` | PUBLIC | Sizes-extended (optional) | — | `calc(clamp(1.25rem, calc(0.0340740740740741 * (100vw - 22.5rem) + 1.25rem), 3.55rem) * var(--sf-space-scale))` |
| `--sf-space-xl-to-m` | PUBLIC | Sizes-extended (optional) | — | `calc(clamp(1rem, calc(0.0377777777777778 * (100vw - 22.5rem) + 1rem), 3.55rem) * var(--sf-space-scale))` |
| `--sf-space-xl-to-s` | PUBLIC | Sizes-extended (optional) | — | `calc(clamp(0.8rem, calc(0.0407407407407407 * (100vw - 22.5rem) + 0.8rem), 3.55rem) * var(--sf-space-scale))` |
| `--sf-space-xl-to-xs` | PUBLIC | Sizes-extended (optional) | — | `calc(clamp(0.64rem, calc(0.0431111111111111 * (100vw - 22.5rem) + 0.64rem), 3.55rem) * var(--sf-space-scale))` |
| `--sf-space-xs` | PUBLIC | Core | — | `calc(clamp(0.64rem, calc(0.007259259259259258 * (100vw - 22.5rem) + 0.64rem), 1.13rem) * var(--sf-space-scale))` |
| `--sf-space-xs-to-2xs` | PUBLIC | Sizes-extended (optional) | — | `calc(clamp(0.51rem, calc(0.00918518518518518 * (100vw - 22.5rem) + 0.51rem), 1.13rem) * var(--sf-space-scale))` |
| `--sf-stack-gap` | PUBLIC | Layout | — | `var(--sf-space-content)` |
| `--sf-state-pending-opacity` | PUBLIC | Core | — | `0.7` |
| `--sf-sticky-offset` | PUBLIC | Core | — | `clamp( var(--sf-sticky-offset-mobile), calc(0.022222222222222223 * (100vw - 22.5rem) + var(--sf-sticky-offset-mobile)), var(--sf-sticky-offset-desktop))` |
| `--sf-sticky-offset-desktop` | PUBLIC | Core | — | `var(--sf-header-height-desktop)` |
| `--sf-sticky-offset-mobile` | PUBLIC | Core | — | `var(--sf-header-height-mobile)` |
| `--sf-stroke-bold` | PUBLIC | Core | — | `2px` |
| `--sf-stroke-heavy` | PUBLIC | Core | — | `3px` |
| `--sf-stroke-regular` | PUBLIC | Core | — | `1.5px` |
| `--sf-stroke-thin` | PUBLIC | Core | — | `1px` |
| `--sf-switcher-gap` | PUBLIC | Layout | — | `var(--sf-space-gap)` |
| `--sf-switcher-threshold` | PUBLIC | Layout | — | `30rem` |
| `--sf-text-2xl` | PUBLIC | Core | — | `calc(clamp(1.95rem, calc(0.014962962962962963 * (100vw - 22.5rem) + 1.95rem), 2.96rem) * var(--sf-text-scale))` |
| `--sf-text-2xl-font-weight` | PUBLIC | Sizes-extended (optional) | — | `var(--sf-font-weight-heading)` |
| `--sf-text-2xl-letter-spacing` | PUBLIC | Sizes-extended (optional) | — | `var(--sf-tracking-normal)` |
| `--sf-text-2xl-line-height` | PUBLIC | Sizes-extended (optional) | — | `var(--sf-leading-snug)` |
| `--sf-text-2xl-max-width` | PUBLIC | Sizes-extended (optional) | — | `none` |
| `--sf-text-2xl-to-2xs` | PUBLIC | Sizes-extended (optional) | — | `clamp(0.51rem, calc(0.0362962962962963 * (100vw - 22.5rem) + 0.51rem), 2.96rem)` |
| `--sf-text-2xl-to-l` | PUBLIC | Sizes-extended (optional) | — | `clamp(1.25rem, calc(0.0253333333333333 * (100vw - 22.5rem) + 1.25rem), 2.96rem)` |
| `--sf-text-2xl-to-m` | PUBLIC | Sizes-extended (optional) | — | `clamp(1rem, calc(0.029037037037037 * (100vw - 22.5rem) + 1rem), 2.96rem)` |
| `--sf-text-2xl-to-s` | PUBLIC | Sizes-extended (optional) | — | `clamp(0.8rem, calc(0.032 * (100vw - 22.5rem) + 0.8rem), 2.96rem)` |
| `--sf-text-2xl-to-xl` | PUBLIC | Sizes-extended (optional) | — | `clamp(1.56rem, calc(0.0207407407407407 * (100vw - 22.5rem) + 1.56rem), 2.96rem)` |
| `--sf-text-2xl-to-xs` | PUBLIC | Sizes-extended (optional) | — | `clamp(0.64rem, calc(0.0343703703703704 * (100vw - 22.5rem) + 0.64rem), 2.96rem)` |
| `--sf-text-2xs` | PUBLIC | Core | — | `calc(clamp(0.51rem, calc(0.00029629629629629656 * (100vw - 22.5rem) + 0.51rem), 0.53rem) * var(--sf-text-scale))` |
| `--sf-text-2xs-font-weight` | PUBLIC | Sizes-extended (optional) | — | `var(--sf-font-weight-body)` |
| `--sf-text-2xs-letter-spacing` | PUBLIC | Sizes-extended (optional) | — | `var(--sf-tracking-normal)` |
| `--sf-text-2xs-line-height` | PUBLIC | Sizes-extended (optional) | — | `var(--sf-leading-relaxed)` |
| `--sf-text-2xs-max-width` | PUBLIC | Sizes-extended (optional) | — | `55ch` |
| `--sf-text-3xl` | PUBLIC | Core | — | `calc(clamp(2.44rem, calc(0.022370370370370374 * (100vw - 22.5rem) + 2.44rem), 3.95rem) * var(--sf-text-scale))` |
| `--sf-text-3xl-font-weight` | PUBLIC | Sizes-extended (optional) | — | `var(--sf-font-weight-heading)` |
| `--sf-text-3xl-letter-spacing` | PUBLIC | Sizes-extended (optional) | — | `var(--sf-tracking-tight)` |
| `--sf-text-3xl-line-height` | PUBLIC | Sizes-extended (optional) | — | `var(--sf-leading-tight)` |
| `--sf-text-3xl-max-width` | PUBLIC | Sizes-extended (optional) | — | `none` |
| `--sf-text-3xl-to-2xl` | PUBLIC | Sizes-extended (optional) | — | `clamp(1.95rem, calc(0.0296296296296296 * (100vw - 22.5rem) + 1.95rem), 3.95rem)` |
| `--sf-text-3xl-to-2xs` | PUBLIC | Sizes-extended (optional) | — | `clamp(0.51rem, calc(0.050962962962963 * (100vw - 22.5rem) + 0.51rem), 3.95rem)` |
| `--sf-text-3xl-to-l` | PUBLIC | Sizes-extended (optional) | — | `clamp(1.25rem, calc(0.04 * (100vw - 22.5rem) + 1.25rem), 3.95rem)` |
| `--sf-text-3xl-to-m` | PUBLIC | Sizes-extended (optional) | — | `clamp(1rem, calc(0.0437037037037037 * (100vw - 22.5rem) + 1rem), 3.95rem)` |
| `--sf-text-3xl-to-s` | PUBLIC | Sizes-extended (optional) | — | `clamp(0.8rem, calc(0.0466666666666667 * (100vw - 22.5rem) + 0.8rem), 3.95rem)` |
| `--sf-text-3xl-to-xl` | PUBLIC | Sizes-extended (optional) | — | `clamp(1.56rem, calc(0.0354074074074074 * (100vw - 22.5rem) + 1.56rem), 3.95rem)` |
| `--sf-text-3xl-to-xs` | PUBLIC | Sizes-extended (optional) | — | `clamp(0.64rem, calc(0.049037037037037 * (100vw - 22.5rem) + 0.64rem), 3.95rem)` |
| `--sf-text-4xl` | PUBLIC | Core | — | `calc(clamp(3.05rem, calc(0.03274074074074074 * (100vw - 22.5rem) + 3.05rem), 5.26rem) * var(--sf-text-scale))` |
| `--sf-text-4xl-font-weight` | PUBLIC | Sizes-extended (optional) | — | `var(--sf-font-weight-heading)` |
| `--sf-text-4xl-letter-spacing` | PUBLIC | Sizes-extended (optional) | — | `var(--sf-tracking-tight)` |
| `--sf-text-4xl-line-height` | PUBLIC | Sizes-extended (optional) | — | `var(--sf-leading-tight)` |
| `--sf-text-4xl-max-width` | PUBLIC | Sizes-extended (optional) | — | `none` |
| `--sf-text-4xl-to-2xl` | PUBLIC | Sizes-extended (optional) | — | `clamp(1.95rem, calc(0.049037037037037 * (100vw - 22.5rem) + 1.95rem), 5.26rem)` |
| `--sf-text-4xl-to-2xs` | PUBLIC | Sizes-extended (optional) | — | `clamp(0.51rem, calc(0.0703703703703704 * (100vw - 22.5rem) + 0.51rem), 5.26rem)` |
| `--sf-text-4xl-to-3xl` | PUBLIC | Sizes-extended (optional) | — | `clamp(2.44rem, calc(0.0417777777777778 * (100vw - 22.5rem) + 2.44rem), 5.26rem)` |
| `--sf-text-4xl-to-l` | PUBLIC | Sizes-extended (optional) | — | `clamp(1.25rem, calc(0.0594074074074074 * (100vw - 22.5rem) + 1.25rem), 5.26rem)` |
| `--sf-text-4xl-to-m` | PUBLIC | Sizes-extended (optional) | — | `clamp(1rem, calc(0.0631111111111111 * (100vw - 22.5rem) + 1rem), 5.26rem)` |
| `--sf-text-4xl-to-s` | PUBLIC | Sizes-extended (optional) | — | `clamp(0.8rem, calc(0.0660740740740741 * (100vw - 22.5rem) + 0.8rem), 5.26rem)` |
| `--sf-text-4xl-to-xl` | PUBLIC | Sizes-extended (optional) | — | `clamp(1.56rem, calc(0.0548148148148148 * (100vw - 22.5rem) + 1.56rem), 5.26rem)` |
| `--sf-text-4xl-to-xs` | PUBLIC | Sizes-extended (optional) | — | `clamp(0.64rem, calc(0.0684444444444444 * (100vw - 22.5rem) + 0.64rem), 5.26rem)` |
| `--sf-text-display-l` | PUBLIC | Core | — | `calc(clamp(3.75rem, calc(0.023407407407407408 * (100vw - 22.5rem) + 3.75rem), 5.33rem) * var(--sf-text-display-scale))` |
| `--sf-text-display-m` | PUBLIC | Core | — | `calc(clamp(3rem, calc(0.014814814814814815 * (100vw - 22.5rem) + 3rem), 4rem) * var(--sf-text-display-scale))` |
| `--sf-text-display-s` | PUBLIC | Core | — | `calc(clamp(2.4rem, calc(0.00888888888888889 * (100vw - 22.5rem) + 2.4rem), 3rem) * var(--sf-text-display-scale))` |
| `--sf-text-display-scale` | PUBLIC-ADVANCED | Core | — | `1` |
| `--sf-text-l` | PUBLIC | Core | — | `calc(clamp(1.25rem, calc(0.006222222222222221 * (100vw - 22.5rem) + 1.25rem), 1.67rem) * var(--sf-text-scale))` |
| `--sf-text-l-font-weight` | PUBLIC | Sizes-extended (optional) | — | `var(--sf-font-weight-body)` |
| `--sf-text-l-letter-spacing` | PUBLIC | Sizes-extended (optional) | — | `var(--sf-tracking-normal)` |
| `--sf-text-l-line-height` | PUBLIC | Sizes-extended (optional) | — | `var(--sf-leading-normal)` |
| `--sf-text-l-max-width` | PUBLIC | Sizes-extended (optional) | — | `none` |
| `--sf-text-l-to-2xs` | PUBLIC | Sizes-extended (optional) | — | `clamp(0.51rem, calc(0.0171851851851852 * (100vw - 22.5rem) + 0.51rem), 1.67rem)` |
| `--sf-text-l-to-m` | PUBLIC | Sizes-extended (optional) | — | `clamp(1rem, calc(0.00992592592592592 * (100vw - 22.5rem) + 1rem), 1.67rem)` |
| `--sf-text-l-to-s` | PUBLIC | Sizes-extended (optional) | — | `clamp(0.8rem, calc(0.0128888888888889 * (100vw - 22.5rem) + 0.8rem), 1.67rem)` |
| `--sf-text-l-to-xs` | PUBLIC | Sizes-extended (optional) | — | `clamp(0.64rem, calc(0.0152592592592593 * (100vw - 22.5rem) + 0.64rem), 1.67rem)` |
| `--sf-text-m` | PUBLIC | Core | — | `calc(clamp(1rem, calc(0.003703703703703704 * (100vw - 22.5rem) + 1rem), 1.25rem) * var(--sf-text-scale))` |
| `--sf-text-m-font-weight` | PUBLIC | Sizes-extended (optional) | — | `var(--sf-font-weight-body)` |
| `--sf-text-m-letter-spacing` | PUBLIC | Sizes-extended (optional) | — | `var(--sf-tracking-normal)` |
| `--sf-text-m-line-height` | PUBLIC | Sizes-extended (optional) | — | `var(--sf-leading-normal)` |
| `--sf-text-m-max-width` | PUBLIC | Sizes-extended (optional) | — | `65ch` |
| `--sf-text-m-to-2xs` | PUBLIC | Sizes-extended (optional) | — | `clamp(0.51rem, calc(0.010962962962963 * (100vw - 22.5rem) + 0.51rem), 1.25rem)` |
| `--sf-text-m-to-s` | PUBLIC | Sizes-extended (optional) | — | `clamp(0.8rem, calc(0.00666666666666667 * (100vw - 22.5rem) + 0.8rem), 1.25rem)` |
| `--sf-text-m-to-xs` | PUBLIC | Sizes-extended (optional) | — | `clamp(0.64rem, calc(0.00903703703703704 * (100vw - 22.5rem) + 0.64rem), 1.25rem)` |
| `--sf-text-s` | PUBLIC | Core | — | `calc(clamp(0.8rem, calc(0.002074074074074073 * (100vw - 22.5rem) + 0.8rem), 0.94rem) * var(--sf-text-scale))` |
| `--sf-text-s-font-weight` | PUBLIC | Sizes-extended (optional) | — | `var(--sf-font-weight-body)` |
| `--sf-text-s-letter-spacing` | PUBLIC | Sizes-extended (optional) | — | `var(--sf-tracking-normal)` |
| `--sf-text-s-line-height` | PUBLIC | Sizes-extended (optional) | — | `var(--sf-leading-relaxed)` |
| `--sf-text-s-max-width` | PUBLIC | Sizes-extended (optional) | — | `65ch` |
| `--sf-text-s-to-2xs` | PUBLIC | Sizes-extended (optional) | — | `clamp(0.51rem, calc(0.00637037037037037 * (100vw - 22.5rem) + 0.51rem), 0.94rem)` |
| `--sf-text-s-to-xs` | PUBLIC | Sizes-extended (optional) | — | `clamp(0.64rem, calc(0.00444444444444444 * (100vw - 22.5rem) + 0.64rem), 0.94rem)` |
| `--sf-text-scale` | PUBLIC-ADVANCED | Core | — | `1` |
| `--sf-text-shadow-l` | PUBLIC | Core | yes | `0 4px 8px oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 2.5), 0.7))` |
| `--sf-text-shadow-m` | PUBLIC | Core | yes | `0 2px 4px oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 2), 0.7))` |
| `--sf-text-shadow-none` | PUBLIC | Core | yes | `none` |
| `--sf-text-shadow-s` | PUBLIC | Core | yes | `0 1px 2px oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 1.5), 0.7))` |
| `--sf-text-xl` | PUBLIC | Core | — | `calc(clamp(1.56rem, calc(0.00977777777777778 * (100vw - 22.5rem) + 1.56rem), 2.22rem) * var(--sf-text-scale))` |
| `--sf-text-xl-font-weight` | PUBLIC | Sizes-extended (optional) | — | `var(--sf-font-weight-body)` |
| `--sf-text-xl-letter-spacing` | PUBLIC | Sizes-extended (optional) | — | `var(--sf-tracking-normal)` |
| `--sf-text-xl-line-height` | PUBLIC | Sizes-extended (optional) | — | `var(--sf-leading-snug)` |
| `--sf-text-xl-max-width` | PUBLIC | Sizes-extended (optional) | — | `none` |
| `--sf-text-xl-to-2xs` | PUBLIC | Sizes-extended (optional) | — | `clamp(0.51rem, calc(0.0253333333333333 * (100vw - 22.5rem) + 0.51rem), 2.22rem)` |
| `--sf-text-xl-to-l` | PUBLIC | Sizes-extended (optional) | — | `clamp(1.25rem, calc(0.0143703703703704 * (100vw - 22.5rem) + 1.25rem), 2.22rem)` |
| `--sf-text-xl-to-m` | PUBLIC | Sizes-extended (optional) | — | `clamp(1rem, calc(0.0180740740740741 * (100vw - 22.5rem) + 1rem), 2.22rem)` |
| `--sf-text-xl-to-s` | PUBLIC | Sizes-extended (optional) | — | `clamp(0.8rem, calc(0.021037037037037 * (100vw - 22.5rem) + 0.8rem), 2.22rem)` |
| `--sf-text-xl-to-xs` | PUBLIC | Sizes-extended (optional) | — | `clamp(0.64rem, calc(0.0234074074074074 * (100vw - 22.5rem) + 0.64rem), 2.22rem)` |
| `--sf-text-xs` | PUBLIC | Core | — | `calc(clamp(0.64rem, calc(0.0008888888888888881 * (100vw - 22.5rem) + 0.64rem), 0.7rem) * var(--sf-text-scale))` |
| `--sf-text-xs-font-weight` | PUBLIC | Sizes-extended (optional) | — | `var(--sf-font-weight-body)` |
| `--sf-text-xs-letter-spacing` | PUBLIC | Sizes-extended (optional) | — | `var(--sf-tracking-normal)` |
| `--sf-text-xs-line-height` | PUBLIC | Sizes-extended (optional) | — | `var(--sf-leading-relaxed)` |
| `--sf-text-xs-max-width` | PUBLIC | Sizes-extended (optional) | — | `60ch` |
| `--sf-text-xs-to-2xs` | PUBLIC | Sizes-extended (optional) | — | `clamp(0.51rem, calc(0.00281481481481481 * (100vw - 22.5rem) + 0.51rem), 0.7rem)` |
| `--sf-touch-target` | PUBLIC | Core | — | `var(--sf-size-l)` |
| `--sf-tracking-normal` | PUBLIC | Core | — | `0` |
| `--sf-tracking-tight` | PUBLIC | Core | — | `-0.025em` |
| `--sf-tracking-wide` | PUBLIC | Core | — | `0.025em` |
| `--sf-tracking-wider` | PUBLIC | Core | — | `0.05em` |
| `--sf-tracking-widest` | PUBLIC | Core | — | `0.1em` |
| `--sf-transition-all` | PUBLIC | Core | — | `all var(--sf-duration-normal) var(--sf-ease-out)` |
| `--sf-transition-colors` | PUBLIC | Core | — | `color var(--sf-duration-normal) var(--sf-ease-out), background-color var(--sf-duration-normal) var(--sf-ease-out), border-color var(--sf-duration-normal) var(--sf-ease-out), text-decoration-color var(--sf-duration-normal) var(--sf-ease-out), fill var(--sf-duration-normal) var(--sf-ease-out), stroke var(--sf-duration-normal) var(--sf-ease-out)` |
| `--sf-transition-enter` | PUBLIC | Core | — | `color var(--sf-duration-normal) var(--sf-ease-out), background-color var(--sf-duration-normal) var(--sf-ease-out), border-color var(--sf-duration-normal) var(--sf-ease-out), box-shadow var(--sf-duration-normal) var(--sf-ease-out), opacity var(--sf-duration-normal) var(--sf-ease-out), transform var(--sf-duration-normal) var(--sf-ease-out), filter var(--sf-duration-normal) var(--sf-ease-out)` |
| `--sf-transition-exit` | PUBLIC | Core | — | `color var(--sf-duration-fast) var(--sf-ease-in), background-color var(--sf-duration-fast) var(--sf-ease-in), border-color var(--sf-duration-fast) var(--sf-ease-in), box-shadow var(--sf-duration-fast) var(--sf-ease-in), opacity var(--sf-duration-fast) var(--sf-ease-in), transform var(--sf-duration-fast) var(--sf-ease-in), filter var(--sf-duration-fast) var(--sf-ease-in)` |
| `--sf-transition-fast` | PUBLIC | Core | — | `color var(--sf-duration-fast) var(--sf-ease-out), background-color var(--sf-duration-fast) var(--sf-ease-out), border-color var(--sf-duration-fast) var(--sf-ease-out), box-shadow var(--sf-duration-fast) var(--sf-ease-out), opacity var(--sf-duration-fast) var(--sf-ease-out), transform var(--sf-duration-fast) var(--sf-ease-out), filter var(--sf-duration-fast) var(--sf-ease-out)` |
| `--sf-transition-opacity` | PUBLIC | Core | — | `opacity var(--sf-duration-normal) var(--sf-ease-out)` |
| `--sf-transition-overlay` | PUBLIC | Core | — | `overlay var(--sf-duration-normal) allow-discrete, display var(--sf-duration-normal) allow-discrete` |
| `--sf-transition-shadow` | PUBLIC | Core | — | `box-shadow var(--sf-duration-normal) var(--sf-ease-out)` |
| `--sf-transition-slow` | PUBLIC | Core | — | `color var(--sf-duration-slow) var(--sf-ease-in-out), background-color var(--sf-duration-slow) var(--sf-ease-in-out), border-color var(--sf-duration-slow) var(--sf-ease-in-out), box-shadow var(--sf-duration-slow) var(--sf-ease-in-out), opacity var(--sf-duration-slow) var(--sf-ease-in-out), transform var(--sf-duration-slow) var(--sf-ease-in-out), filter var(--sf-duration-slow) var(--sf-ease-in-out)` |
| `--sf-transition-transform` | PUBLIC | Core | — | `transform var(--sf-duration-normal) var(--sf-ease-out)` |
| `--sf-truncate-suffix` | PUBLIC-ADVANCED | Macros | — | `"\\2026"` |
| `--sf-z-base` | PUBLIC | Core | — | `0` |
| `--sf-z-below` | PUBLIC | Core | — | `-1` |
| `--sf-z-dropdown` | PUBLIC | Core | — | `var(--sf-z-high)` |
| `--sf-z-fixed` | PUBLIC | Core | — | `var(--sf-z-mid)` |
| `--sf-z-high` | PUBLIC | Core | — | `500` |
| `--sf-z-low` | PUBLIC | Core | — | `10` |
| `--sf-z-max` | PUBLIC | Core | — | `9999` |
| `--sf-z-mid` | PUBLIC | Core | — | `100` |
| `--sf-z-overlay` | PUBLIC | Core | — | `var(--sf-z-max)` |
| `--sf-z-raised` | PUBLIC | Core | — | `1` |
| `--sf-z-sticky` | PUBLIC | Core | — | `var(--sf-z-low)` |
| `--sf-z-toast` | PUBLIC | Core | — | `var(--sf-z-top)` |
| `--sf-z-top` | PUBLIC | Core | — | `900` |

## Fallback-only tokens (`core/tokens.color-fallbacks.css`)

These 33 tokens exist only on the legacy HSL tier — channel sources (`--sf-{family}-h/s/l`) that consumers override to rebrand on older engines. They are intentionally absent from the modern token API and from `registry.json`.

- `--sf-action-h`
- `--sf-action-l`
- `--sf-action-s`
- `--sf-base-h`
- `--sf-base-l`
- `--sf-base-s`
- `--sf-danger-h`
- `--sf-danger-l`
- `--sf-danger-s`
- `--sf-error-h`
- `--sf-error-l`
- `--sf-error-s`
- `--sf-info-h`
- `--sf-info-l`
- `--sf-info-s`
- `--sf-neutral-h`
- `--sf-neutral-l`
- `--sf-neutral-s`
- `--sf-primary-h`
- `--sf-primary-l`
- `--sf-primary-s`
- `--sf-secondary-h`
- `--sf-secondary-l`
- `--sf-secondary-s`
- `--sf-success-h`
- `--sf-success-l`
- `--sf-success-s`
- `--sf-tertiary-h`
- `--sf-tertiary-l`
- `--sf-tertiary-s`
- `--sf-warning-h`
- `--sf-warning-l`
- `--sf-warning-s`
