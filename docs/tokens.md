# Token reference

> **Generated** from source by `scripts/gen-token-reference.js` —
> run `npm run docs:tokens` to refresh. Do not edit by hand.

**691 tokens.** Every `--sf-*` custom property and its default value, grouped by source file.
If a token is defined in multiple files, it is listed once per section — so this
count can be higher than `docs/registry.json` (which deduplicates by name). See
[architecture.md](architecture.md) for the PUBLIC / PUBLIC-ADVANCED / INTERNAL
contract and naming conventions (a DEPRECATED tier will be introduced when
tokens are first retired), and [theming.md](theming.md) for the
rebrand workflow.

## Core tokens (`core/tokens.css`)

608 tokens.

| Token | Default |
|---|---|
| `--sf-animation-blink` | `sf-blink calc(1s * var(--sf-motion-scale)) steps(1, end) infinite` |
| `--sf-animation-color-pulse` | `sf-color-pulse var(--sf-duration-slow) var(--sf-ease-in-out) infinite` |
| `--sf-animation-delay-1` | `calc(75ms * var(--sf-motion-scale))` |
| `--sf-animation-delay-2` | `calc(150ms * var(--sf-motion-scale))` |
| `--sf-animation-delay-3` | `calc(225ms * var(--sf-motion-scale))` |
| `--sf-animation-delay-4` | `calc(300ms * var(--sf-motion-scale))` |
| `--sf-animation-delay-5` | `calc(375ms * var(--sf-motion-scale))` |
| `--sf-animation-fade-in` | `sf-fade-in var(--sf-duration-normal) var(--sf-ease-out) both` |
| `--sf-animation-fade-out` | `sf-fade-out var(--sf-duration-normal) var(--sf-ease-in) both` |
| `--sf-animation-float` | `sf-float calc(3s * var(--sf-motion-scale)) var(--sf-ease-in-out) infinite` |
| `--sf-animation-ping` | `sf-ping var(--sf-duration-slow) var(--sf-ease-out) infinite` |
| `--sf-animation-scale-down` | `sf-scale-down var(--sf-duration-normal) var(--sf-ease-in) both` |
| `--sf-animation-scale-up` | `sf-scale-up var(--sf-duration-normal) var(--sf-ease-overshoot) both` |
| `--sf-animation-shimmer` | `sf-shimmer calc(1.5s * var(--sf-motion-scale)) var(--sf-ease-in-out) infinite` |
| `--sf-animation-slide-in-down` | `sf-slide-in-down var(--sf-duration-normal) var(--sf-ease-out) both` |
| `--sf-animation-slide-in-left` | `sf-slide-in-left var(--sf-duration-normal) var(--sf-ease-out) both` |
| `--sf-animation-slide-in-right` | `sf-slide-in-right var(--sf-duration-normal) var(--sf-ease-out) both` |
| `--sf-animation-slide-in-up` | `sf-slide-in-up var(--sf-duration-normal) var(--sf-ease-out) both` |
| `--sf-animation-spin` | `sf-spin var(--sf-duration-slower) linear infinite` |
| `--sf-blur` | `12px` |
| `--sf-body-color` | `var(--sf-color-text)` |
| `--sf-body-em-style` | `italic` |
| `--sf-body-font-family` | `var(--sf-font-body)` |
| `--sf-body-font-size` | `var(--sf-text-m)` |
| `--sf-body-font-weight` | `var(--sf-font-weight-body)` |
| `--sf-body-line-height` | `var(--sf-leading-normal)` |
| `--sf-body-strong-weight` | `var(--sf-font-weight-strong)` |
| `--sf-body-text-wrap` | `pretty` |
| `--sf-border` | `var(--sf-border-width-1) var(--sf-border-style) var(--sf-color-border)` |
| `--sf-border-scale` | `1` |
| `--sf-border-strong` | `var(--sf-border-width-1) var(--sf-border-style) var(--sf-color-border--strong)` |
| `--sf-border-style` | `solid` |
| `--sf-border-subtle` | `var(--sf-border-width-1) var(--sf-border-style) var(--sf-color-border--subtle)` |
| `--sf-border-width-1` | `calc(1px * var(--sf-border-scale, 1))` |
| `--sf-border-width-2` | `calc(2px * var(--sf-border-scale, 1))` |
| `--sf-border-width-3` | `calc(3px * var(--sf-border-scale, 1))` |
| `--sf-border-width-4` | `calc(4px * var(--sf-border-scale, 1))` |
| `--sf-border-width-hairline` | `0.5px` |
| `--sf-caret-color` | `var(--sf-color-action)` |
| `--sf-code-font-size` | `0.875em` |
| `--sf-color-action` | `light-dark(var(--sf-color-action-source-light), var(--sf-color-action-source-dark, oklch(from var(--sf-color-action-source-light) clamp(0.65, calc(0.95 - l * 0.5), 0.88) calc(c * 0.9) h)))` |
| `--sf-color-action--active` | `var(--sf-color-action-xdark)` |
| `--sf-color-action--hover` | `var(--sf-color-action-darker)` |
| `--sf-color-action-100` | `color-mix(in oklab, var(--sf-color-action) var(--sf-palette-mix-100), var(--sf-color-surface))` |
| `--sf-color-action-200` | `color-mix(in oklab, var(--sf-color-action) var(--sf-palette-mix-200), var(--sf-color-surface))` |
| `--sf-color-action-300` | `color-mix(in oklab, var(--sf-color-action) var(--sf-palette-mix-300), var(--sf-color-surface))` |
| `--sf-color-action-400` | `color-mix(in oklab, var(--sf-color-action) var(--sf-palette-mix-400), var(--sf-color-surface))` |
| `--sf-color-action-50` | `color-mix(in oklab, var(--sf-color-action) var(--sf-palette-mix-50), var(--sf-color-surface))` |
| `--sf-color-action-500` | `var(--sf-color-action)` |
| `--sf-color-action-600` | `color-mix(in oklab, var(--sf-color-action) var(--sf-palette-mix-600), var(--sf-color-text))` |
| `--sf-color-action-700` | `color-mix(in oklab, var(--sf-color-action) var(--sf-palette-mix-700), var(--sf-color-text))` |
| `--sf-color-action-800` | `color-mix(in oklab, var(--sf-color-action) var(--sf-palette-mix-800), var(--sf-color-text))` |
| `--sf-color-action-900` | `color-mix(in oklab, var(--sf-color-action) var(--sf-palette-mix-900), var(--sf-color-text))` |
| `--sf-color-action-950` | `color-mix(in oklab, var(--sf-color-action) var(--sf-palette-mix-950), var(--sf-color-text))` |
| `--sf-color-action-a10` | `oklch(from var(--sf-color-action) l c h / 0.10)` |
| `--sf-color-action-a30` | `oklch(from var(--sf-color-action) l c h / 0.30)` |
| `--sf-color-action-a5` | `oklch(from var(--sf-color-action) l c h / 0.05)` |
| `--sf-color-action-a50` | `oklch(from var(--sf-color-action) l c h / 0.50)` |
| `--sf-color-action-a80` | `oklch(from var(--sf-color-action) l c h / 0.80)` |
| `--sf-color-action-darker` | `var(--sf-color-action-600)` |
| `--sf-color-action-ghost` | `var(--sf-color-action-a5)` |
| `--sf-color-action-lighter` | `var(--sf-color-action-400)` |
| `--sf-color-action-muted` | `var(--sf-color-action-a30)` |
| `--sf-color-action-source-dark` | `oklch(0.70 0.198 235) *(registered)*` |
| `--sf-color-action-source-light` | `oklch(0.50 0.22 235)` |
| `--sf-color-action-subtle` | `var(--sf-color-action-a10)` |
| `--sf-color-action-superdark` | `var(--sf-color-action-950)` |
| `--sf-color-action-superlight` | `var(--sf-color-action-50)` |
| `--sf-color-action-xdark` | `var(--sf-color-action-800)` |
| `--sf-color-action-xlight` | `var(--sf-color-action-200)` |
| `--sf-color-base` | `light-dark(var(--sf-color-base-source-light), var(--sf-color-base-source-dark, oklch(from var(--sf-color-base-source-light) clamp(0.16, calc(1.18 - l), 0.24) calc(c * 0.5) h)))` |
| `--sf-color-base--active` | `var(--sf-color-base-xdark)` |
| `--sf-color-base--hover` | `var(--sf-color-base-darker)` |
| `--sf-color-base-100` | `color-mix(in oklab, var(--sf-color-text) var(--sf-palette-mix-100), var(--sf-color-base))` |
| `--sf-color-base-200` | `color-mix(in oklab, var(--sf-color-text) var(--sf-palette-mix-200), var(--sf-color-base))` |
| `--sf-color-base-300` | `color-mix(in oklab, var(--sf-color-text) var(--sf-palette-mix-300), var(--sf-color-base))` |
| `--sf-color-base-400` | `color-mix(in oklab, var(--sf-color-text) var(--sf-palette-mix-400), var(--sf-color-base))` |
| `--sf-color-base-50` | `color-mix(in oklab, var(--sf-color-text) var(--sf-palette-mix-50), var(--sf-color-base))` |
| `--sf-color-base-500` | `var(--sf-color-base)` |
| `--sf-color-base-600` | `color-mix(in oklab, var(--sf-color-base) var(--sf-palette-mix-600), var(--sf-color-text))` |
| `--sf-color-base-700` | `color-mix(in oklab, var(--sf-color-base) var(--sf-palette-mix-700), var(--sf-color-text))` |
| `--sf-color-base-800` | `color-mix(in oklab, var(--sf-color-base) var(--sf-palette-mix-800), var(--sf-color-text))` |
| `--sf-color-base-900` | `color-mix(in oklab, var(--sf-color-base) var(--sf-palette-mix-900), var(--sf-color-text))` |
| `--sf-color-base-950` | `color-mix(in oklab, var(--sf-color-base) var(--sf-palette-mix-950), var(--sf-color-text))` |
| `--sf-color-base-a10` | `oklch(from var(--sf-color-base) l c h / 0.10)` |
| `--sf-color-base-a30` | `oklch(from var(--sf-color-base) l c h / 0.30)` |
| `--sf-color-base-a5` | `oklch(from var(--sf-color-base) l c h / 0.05)` |
| `--sf-color-base-a50` | `oklch(from var(--sf-color-base) l c h / 0.50)` |
| `--sf-color-base-a80` | `oklch(from var(--sf-color-base) l c h / 0.80)` |
| `--sf-color-base-darker` | `var(--sf-color-base-600)` |
| `--sf-color-base-ghost` | `var(--sf-color-base-a5)` |
| `--sf-color-base-lighter` | `var(--sf-color-base-400)` |
| `--sf-color-base-muted` | `var(--sf-color-base-a30)` |
| `--sf-color-base-source-dark` | `oklch(0.22 0.003 250) *(registered)*` |
| `--sf-color-base-source-light` | `oklch(0.96 0.006 250)` |
| `--sf-color-base-subtle` | `var(--sf-color-base-a10)` |
| `--sf-color-base-superdark` | `var(--sf-color-base-950)` |
| `--sf-color-base-superlight` | `var(--sf-color-base-50)` |
| `--sf-color-base-xdark` | `var(--sf-color-base-800)` |
| `--sf-color-base-xlight` | `var(--sf-color-base-200)` |
| `--sf-color-bg` | `oklch(from var(--sf-color-base) calc(l + 0.02) c h)` |
| `--sf-color-bg--active` | `oklch(from var(--sf-color-neutral) l c h / 0.12)` |
| `--sf-color-bg--disabled` | `var(--sf-color-inset)` |
| `--sf-color-bg--focus` | `oklch(from var(--sf-color-action) l c h / 0.06)` |
| `--sf-color-bg--hover` | `oklch(from var(--sf-color-neutral) l c h / 0.08)` |
| `--sf-color-bg--selected` | `oklch(from var(--sf-color-action) l c h / 0.1)` |
| `--sf-color-black` | `oklch(0% 0 0)` |
| `--sf-color-border` | `light-dark( oklch(from var(--sf-color-neutral-source-light) clamp(0.70, calc(l + 0.35), 0.95) 0.005 h), oklch(from var(--sf-color-neutral) clamp(0.25, calc(l - 0.3), 0.55) 0.005 h) )` |
| `--sf-color-border--disabled` | `oklch(from var(--sf-color-border--subtle) l 0 h / 0.5)` |
| `--sf-color-border--focus` | `var(--sf-color-action)` |
| `--sf-color-border--strong` | `light-dark( oklch(from var(--sf-color-neutral-source-light) clamp(0.55, calc(l + 0.1), 0.85) 0.02 h), oklch(from var(--sf-color-neutral) clamp(0.38, calc(l - 0.1), 0.65) 0.02 h) )` |
| `--sf-color-border--subtle` | `light-dark( oklch(from var(--sf-color-neutral-source-light) clamp(0.75, calc(l + 0.4), 0.97) 0.005 h), oklch(from var(--sf-color-neutral) clamp(0.20, calc(l - 0.38), 0.45) 0.005 h) )` |
| `--sf-color-border--translucent` | `oklch(from var(--sf-color-neutral) l c h / 0.15)` |
| `--sf-color-code-bg` | `var(--sf-color-inset)` |
| `--sf-color-code-text` | `oklch(from var(--sf-color-code-bg) clamp(0.1, sign(var(--sf-contrast-threshold) - l) * 999, 0.95) 0 0)` |
| `--sf-color-danger` | `light-dark(var(--sf-color-danger-source-light), var(--sf-color-danger-source-dark, oklch(from var(--sf-color-danger-source-light) clamp(0.65, calc(0.95 - l * 0.5), 0.88) calc(c * 0.9) h)))` |
| `--sf-color-danger-muted` | `oklch(from var(--sf-color-danger) l c h / 0.3)` |
| `--sf-color-danger-source-dark` | `oklch(0.71 0.198 12) *(registered)*` |
| `--sf-color-danger-source-light` | `oklch(0.48 0.22 12)` |
| `--sf-color-danger-strong` | `light-dark( oklch(from var(--sf-color-danger-source-light) calc(l - 0.1) c h), oklch(from var(--sf-color-danger) clamp(0.70, calc(l + 0.15), 1) c h) )` |
| `--sf-color-danger-subtle` | `oklch(from var(--sf-color-danger) l c h / 0.1)` |
| `--sf-color-dim` | `oklch(0 0 0 / 0.5)` |
| `--sf-color-heading` | `light-dark( oklch(from var(--sf-color-neutral-source-light) clamp(0.05, calc(l - 0.4 - var(--sf-contrast-bias)), 0.35) c h), oklch(from var(--sf-color-neutral) clamp(0.70, calc(l + 0.25 + var(--sf-contrast-bias)), 1) c h) )` |
| `--sf-color-info` | `light-dark(var(--sf-color-info-source-light), var(--sf-color-info-source-dark, oklch(from var(--sf-color-info-source-light) clamp(0.65, calc(0.95 - l * 0.5), 0.88) calc(c * 0.9) h)))` |
| `--sf-color-info-muted` | `oklch(from var(--sf-color-info) l c h / 0.3)` |
| `--sf-color-info-source-dark` | `oklch(0.71 0.162 235) *(registered)*` |
| `--sf-color-info-source-light` | `oklch(0.48 0.18 235)` |
| `--sf-color-info-strong` | `light-dark( oklch(from var(--sf-color-info-source-light) calc(l - 0.1) c h), oklch(from var(--sf-color-info) clamp(0.70, calc(l + 0.15), 1) c h) )` |
| `--sf-color-info-subtle` | `oklch(from var(--sf-color-info) l c h / 0.1)` |
| `--sf-color-inset` | `oklch(from var(--sf-color-base) calc(l - 0.02) c h)` |
| `--sf-color-inverse` | `oklch(from var(--sf-color-base) calc(1 - l) c h)` |
| `--sf-color-link` | `light-dark( oklch(from var(--sf-color-action) clamp(0, min(l - 0.07, 0.48), 1) c h), oklch(from var(--sf-color-action) clamp(0.68, l, 1) c h) )` |
| `--sf-color-link--active` | `light-dark( oklch(from var(--sf-color-action) clamp(0, min(l - 0.21, 0.34), 1) c h), oklch(from var(--sf-color-action) clamp(0, max(l + 0.15, 0.74), 1) c h) )` |
| `--sf-color-link--disabled` | `var(--sf-color-text--disabled)` |
| `--sf-color-link--hover` | `light-dark( oklch(from var(--sf-color-action) clamp(0, min(l - 0.15, 0.40), 1) c h), oklch(from var(--sf-color-action) clamp(0, max(l + 0.10, 0.68), 1) c h) )` |
| `--sf-color-link--underline` | `oklch(from var(--sf-color-action) l c h / 0.3)` |
| `--sf-color-link--visited` | `light-dark( oklch(from var(--sf-color-action) clamp(0, min(l - 0.07, 0.48), 1) c calc(h + 60)), oklch(from var(--sf-color-action) clamp(0.68, l, 1) c calc(h + 60)) )` |
| `--sf-color-mark-bg` | `oklch(from var(--sf-color-warning) l c h / 0.25)` |
| `--sf-color-mark-text` | `inherit` |
| `--sf-color-neutral` | `light-dark(var(--sf-color-neutral-source-light), var(--sf-color-neutral-source-dark, oklch(from var(--sf-color-neutral-source-light) clamp(0.65, calc(0.95 - l * 0.5), 0.88) calc(c * 0.9) h)))` |
| `--sf-color-neutral--active` | `var(--sf-color-neutral-xdark)` |
| `--sf-color-neutral--hover` | `var(--sf-color-neutral-darker)` |
| `--sf-color-neutral-100` | `color-mix(in oklab, var(--sf-color-neutral) var(--sf-palette-mix-100), var(--sf-color-surface))` |
| `--sf-color-neutral-200` | `color-mix(in oklab, var(--sf-color-neutral) var(--sf-palette-mix-200), var(--sf-color-surface))` |
| `--sf-color-neutral-300` | `color-mix(in oklab, var(--sf-color-neutral) var(--sf-palette-mix-300), var(--sf-color-surface))` |
| `--sf-color-neutral-400` | `color-mix(in oklab, var(--sf-color-neutral) var(--sf-palette-mix-400), var(--sf-color-surface))` |
| `--sf-color-neutral-50` | `color-mix(in oklab, var(--sf-color-neutral) var(--sf-palette-mix-50), var(--sf-color-surface))` |
| `--sf-color-neutral-500` | `var(--sf-color-neutral)` |
| `--sf-color-neutral-600` | `color-mix(in oklab, var(--sf-color-neutral) var(--sf-palette-mix-600), var(--sf-color-text))` |
| `--sf-color-neutral-700` | `color-mix(in oklab, var(--sf-color-neutral) var(--sf-palette-mix-700), var(--sf-color-text))` |
| `--sf-color-neutral-800` | `color-mix(in oklab, var(--sf-color-neutral) var(--sf-palette-mix-800), var(--sf-color-text))` |
| `--sf-color-neutral-900` | `color-mix(in oklab, var(--sf-color-neutral) var(--sf-palette-mix-900), var(--sf-color-text))` |
| `--sf-color-neutral-950` | `color-mix(in oklab, var(--sf-color-neutral) var(--sf-palette-mix-950), var(--sf-color-text))` |
| `--sf-color-neutral-a10` | `oklch(from var(--sf-color-neutral) l c h / 0.10)` |
| `--sf-color-neutral-a30` | `oklch(from var(--sf-color-neutral) l c h / 0.30)` |
| `--sf-color-neutral-a5` | `oklch(from var(--sf-color-neutral) l c h / 0.05)` |
| `--sf-color-neutral-a50` | `oklch(from var(--sf-color-neutral) l c h / 0.50)` |
| `--sf-color-neutral-a80` | `oklch(from var(--sf-color-neutral) l c h / 0.80)` |
| `--sf-color-neutral-darker` | `var(--sf-color-neutral-600)` |
| `--sf-color-neutral-ghost` | `var(--sf-color-neutral-a5)` |
| `--sf-color-neutral-lighter` | `var(--sf-color-neutral-400)` |
| `--sf-color-neutral-muted` | `var(--sf-color-neutral-a30)` |
| `--sf-color-neutral-source-dark` | `oklch(0.69 0.0225 260) *(registered)*` |
| `--sf-color-neutral-source-light` | `oklch(0.52 0.025 260)` |
| `--sf-color-neutral-subtle` | `var(--sf-color-neutral-a10)` |
| `--sf-color-neutral-superdark` | `var(--sf-color-neutral-950)` |
| `--sf-color-neutral-superlight` | `var(--sf-color-neutral-50)` |
| `--sf-color-neutral-xdark` | `var(--sf-color-neutral-800)` |
| `--sf-color-neutral-xlight` | `var(--sf-color-neutral-200)` |
| `--sf-color-overlay` | `oklch(from var(--sf-color-base) l c h / 0.9)` |
| `--sf-color-primary` | `light-dark(var(--sf-color-primary-source-light), var(--sf-color-primary-source-dark, oklch(from var(--sf-color-primary-source-light) clamp(0.65, calc(0.95 - l * 0.5), 0.88) calc(c * 0.9) h)))` |
| `--sf-color-primary--active` | `var(--sf-color-primary-xdark)` |
| `--sf-color-primary--hover` | `var(--sf-color-primary-darker)` |
| `--sf-color-primary-100` | `color-mix(in oklab, var(--sf-color-primary) var(--sf-palette-mix-100), var(--sf-color-surface))` |
| `--sf-color-primary-200` | `color-mix(in oklab, var(--sf-color-primary) var(--sf-palette-mix-200), var(--sf-color-surface))` |
| `--sf-color-primary-300` | `color-mix(in oklab, var(--sf-color-primary) var(--sf-palette-mix-300), var(--sf-color-surface))` |
| `--sf-color-primary-400` | `color-mix(in oklab, var(--sf-color-primary) var(--sf-palette-mix-400), var(--sf-color-surface))` |
| `--sf-color-primary-50` | `color-mix(in oklab, var(--sf-color-primary) var(--sf-palette-mix-50), var(--sf-color-surface))` |
| `--sf-color-primary-500` | `var(--sf-color-primary)` |
| `--sf-color-primary-600` | `color-mix(in oklab, var(--sf-color-primary) var(--sf-palette-mix-600), var(--sf-color-text))` |
| `--sf-color-primary-700` | `color-mix(in oklab, var(--sf-color-primary) var(--sf-palette-mix-700), var(--sf-color-text))` |
| `--sf-color-primary-800` | `color-mix(in oklab, var(--sf-color-primary) var(--sf-palette-mix-800), var(--sf-color-text))` |
| `--sf-color-primary-900` | `color-mix(in oklab, var(--sf-color-primary) var(--sf-palette-mix-900), var(--sf-color-text))` |
| `--sf-color-primary-950` | `color-mix(in oklab, var(--sf-color-primary) var(--sf-palette-mix-950), var(--sf-color-text))` |
| `--sf-color-primary-a10` | `oklch(from var(--sf-color-primary) l c h / 0.10)` |
| `--sf-color-primary-a30` | `oklch(from var(--sf-color-primary) l c h / 0.30)` |
| `--sf-color-primary-a5` | `oklch(from var(--sf-color-primary) l c h / 0.05)` |
| `--sf-color-primary-a50` | `oklch(from var(--sf-color-primary) l c h / 0.50)` |
| `--sf-color-primary-a80` | `oklch(from var(--sf-color-primary) l c h / 0.80)` |
| `--sf-color-primary-darker` | `var(--sf-color-primary-600)` |
| `--sf-color-primary-ghost` | `var(--sf-color-primary-a5)` |
| `--sf-color-primary-lighter` | `var(--sf-color-primary-400)` |
| `--sf-color-primary-muted` | `var(--sf-color-primary-a30)` |
| `--sf-color-primary-source-dark` | `oklch(0.715 0.243 264) *(registered)*` |
| `--sf-color-primary-source-light` | `oklch(0.47 0.27 264)` |
| `--sf-color-primary-subtle` | `var(--sf-color-primary-a10)` |
| `--sf-color-primary-superdark` | `var(--sf-color-primary-950)` |
| `--sf-color-primary-superlight` | `var(--sf-color-primary-50)` |
| `--sf-color-primary-xdark` | `var(--sf-color-primary-800)` |
| `--sf-color-primary-xlight` | `var(--sf-color-primary-200)` |
| `--sf-color-raised` | `oklch(from var(--sf-color-base) calc(l + 0.04) c h)` |
| `--sf-color-scheme` | `light dark` |
| `--sf-color-secondary` | `light-dark(var(--sf-color-secondary-source-light), var(--sf-color-secondary-source-dark, oklch(from var(--sf-color-secondary-source-light) clamp(0.65, calc(0.95 - l * 0.5), 0.88) calc(c * 0.9) h)))` |
| `--sf-color-secondary--active` | `var(--sf-color-secondary-xdark)` |
| `--sf-color-secondary--hover` | `var(--sf-color-secondary-darker)` |
| `--sf-color-secondary-100` | `color-mix(in oklab, var(--sf-color-secondary) var(--sf-palette-mix-100), var(--sf-color-surface))` |
| `--sf-color-secondary-200` | `color-mix(in oklab, var(--sf-color-secondary) var(--sf-palette-mix-200), var(--sf-color-surface))` |
| `--sf-color-secondary-300` | `color-mix(in oklab, var(--sf-color-secondary) var(--sf-palette-mix-300), var(--sf-color-surface))` |
| `--sf-color-secondary-400` | `color-mix(in oklab, var(--sf-color-secondary) var(--sf-palette-mix-400), var(--sf-color-surface))` |
| `--sf-color-secondary-50` | `color-mix(in oklab, var(--sf-color-secondary) var(--sf-palette-mix-50), var(--sf-color-surface))` |
| `--sf-color-secondary-500` | `var(--sf-color-secondary)` |
| `--sf-color-secondary-600` | `color-mix(in oklab, var(--sf-color-secondary) var(--sf-palette-mix-600), var(--sf-color-text))` |
| `--sf-color-secondary-700` | `color-mix(in oklab, var(--sf-color-secondary) var(--sf-palette-mix-700), var(--sf-color-text))` |
| `--sf-color-secondary-800` | `color-mix(in oklab, var(--sf-color-secondary) var(--sf-palette-mix-800), var(--sf-color-text))` |
| `--sf-color-secondary-900` | `color-mix(in oklab, var(--sf-color-secondary) var(--sf-palette-mix-900), var(--sf-color-text))` |
| `--sf-color-secondary-950` | `color-mix(in oklab, var(--sf-color-secondary) var(--sf-palette-mix-950), var(--sf-color-text))` |
| `--sf-color-secondary-a10` | `oklch(from var(--sf-color-secondary) l c h / 0.10)` |
| `--sf-color-secondary-a30` | `oklch(from var(--sf-color-secondary) l c h / 0.30)` |
| `--sf-color-secondary-a5` | `oklch(from var(--sf-color-secondary) l c h / 0.05)` |
| `--sf-color-secondary-a50` | `oklch(from var(--sf-color-secondary) l c h / 0.50)` |
| `--sf-color-secondary-a80` | `oklch(from var(--sf-color-secondary) l c h / 0.80)` |
| `--sf-color-secondary-darker` | `var(--sf-color-secondary-600)` |
| `--sf-color-secondary-ghost` | `var(--sf-color-secondary-a5)` |
| `--sf-color-secondary-lighter` | `var(--sf-color-secondary-400)` |
| `--sf-color-secondary-muted` | `var(--sf-color-secondary-a30)` |
| `--sf-color-secondary-source-dark` | `oklch(0.84 0.036 264) *(registered)*` |
| `--sf-color-secondary-source-light` | `oklch(0.22 0.04 264)` |
| `--sf-color-secondary-subtle` | `var(--sf-color-secondary-a10)` |
| `--sf-color-secondary-superdark` | `var(--sf-color-secondary-950)` |
| `--sf-color-secondary-superlight` | `var(--sf-color-secondary-50)` |
| `--sf-color-secondary-xdark` | `var(--sf-color-secondary-800)` |
| `--sf-color-secondary-xlight` | `var(--sf-color-secondary-200)` |
| `--sf-color-selection-bg` | `light-dark( oklch(from var(--sf-color-action-source-light) l c h / 0.28), oklch(from var(--sf-color-action-source-dark) clamp(0.62, calc(0.93 - l * 0.4), 0.78) c h / 0.55) )` |
| `--sf-color-selection-text` | `inherit` |
| `--sf-color-success` | `light-dark(var(--sf-color-success-source-light), var(--sf-color-success-source-dark, oklch(from var(--sf-color-success-source-light) clamp(0.65, calc(0.95 - l * 0.5), 0.88) calc(c * 0.9) h)))` |
| `--sf-color-success-muted` | `oklch(from var(--sf-color-success) l c h / 0.3)` |
| `--sf-color-success-source-dark` | `oklch(0.70 0.144 145) *(registered)*` |
| `--sf-color-success-source-light` | `oklch(0.50 0.16 145)` |
| `--sf-color-success-strong` | `light-dark( oklch(from var(--sf-color-success-source-light) calc(l - 0.15) c h), oklch(from var(--sf-color-success) clamp(0.70, calc(l + 0.15), 1) c h) )` |
| `--sf-color-success-subtle` | `oklch(from var(--sf-color-success) l c h / 0.12)` |
| `--sf-color-surface` | `var(--sf-color-base)` |
| `--sf-color-tertiary` | `light-dark(var(--sf-color-tertiary-source-light), var(--sf-color-tertiary-source-dark, oklch(from var(--sf-color-tertiary-source-light) clamp(0.65, calc(0.95 - l * 0.5), 0.88) calc(c * 0.9) h)))` |
| `--sf-color-tertiary--active` | `var(--sf-color-tertiary-xdark)` |
| `--sf-color-tertiary--hover` | `var(--sf-color-tertiary-darker)` |
| `--sf-color-tertiary-100` | `color-mix(in oklab, var(--sf-color-tertiary) var(--sf-palette-mix-100), var(--sf-color-surface))` |
| `--sf-color-tertiary-200` | `color-mix(in oklab, var(--sf-color-tertiary) var(--sf-palette-mix-200), var(--sf-color-surface))` |
| `--sf-color-tertiary-300` | `color-mix(in oklab, var(--sf-color-tertiary) var(--sf-palette-mix-300), var(--sf-color-surface))` |
| `--sf-color-tertiary-400` | `color-mix(in oklab, var(--sf-color-tertiary) var(--sf-palette-mix-400), var(--sf-color-surface))` |
| `--sf-color-tertiary-50` | `color-mix(in oklab, var(--sf-color-tertiary) var(--sf-palette-mix-50), var(--sf-color-surface))` |
| `--sf-color-tertiary-500` | `var(--sf-color-tertiary)` |
| `--sf-color-tertiary-600` | `color-mix(in oklab, var(--sf-color-tertiary) var(--sf-palette-mix-600), var(--sf-color-text))` |
| `--sf-color-tertiary-700` | `color-mix(in oklab, var(--sf-color-tertiary) var(--sf-palette-mix-700), var(--sf-color-text))` |
| `--sf-color-tertiary-800` | `color-mix(in oklab, var(--sf-color-tertiary) var(--sf-palette-mix-800), var(--sf-color-text))` |
| `--sf-color-tertiary-900` | `color-mix(in oklab, var(--sf-color-tertiary) var(--sf-palette-mix-900), var(--sf-color-text))` |
| `--sf-color-tertiary-950` | `color-mix(in oklab, var(--sf-color-tertiary) var(--sf-palette-mix-950), var(--sf-color-text))` |
| `--sf-color-tertiary-a10` | `oklch(from var(--sf-color-tertiary) l c h / 0.10)` |
| `--sf-color-tertiary-a30` | `oklch(from var(--sf-color-tertiary) l c h / 0.30)` |
| `--sf-color-tertiary-a5` | `oklch(from var(--sf-color-tertiary) l c h / 0.05)` |
| `--sf-color-tertiary-a50` | `oklch(from var(--sf-color-tertiary) l c h / 0.50)` |
| `--sf-color-tertiary-a80` | `oklch(from var(--sf-color-tertiary) l c h / 0.80)` |
| `--sf-color-tertiary-darker` | `var(--sf-color-tertiary-600)` |
| `--sf-color-tertiary-ghost` | `var(--sf-color-tertiary-a5)` |
| `--sf-color-tertiary-lighter` | `var(--sf-color-tertiary-400)` |
| `--sf-color-tertiary-muted` | `var(--sf-color-tertiary-a30)` |
| `--sf-color-tertiary-source-dark` | `oklch(0.74 0.198 295) *(registered)*` |
| `--sf-color-tertiary-source-light` | `oklch(0.42 0.22 295)` |
| `--sf-color-tertiary-subtle` | `var(--sf-color-tertiary-a10)` |
| `--sf-color-tertiary-superdark` | `var(--sf-color-tertiary-950)` |
| `--sf-color-tertiary-superlight` | `var(--sf-color-tertiary-50)` |
| `--sf-color-tertiary-xdark` | `var(--sf-color-tertiary-800)` |
| `--sf-color-tertiary-xlight` | `var(--sf-color-tertiary-200)` |
| `--sf-color-text` | `light-dark( oklch(from var(--sf-color-neutral-source-light) clamp(0.05, calc(l - 0.4 - var(--sf-contrast-bias)), 0.35) c h), oklch(from var(--sf-color-neutral) clamp(0.70, calc(l + 0.25 + var(--sf-contrast-bias)), 1) c h) )` |
| `--sf-color-text--disabled` | `light-dark( oklch(from var(--sf-color-neutral-source-light) clamp(0.55, calc(l + 0.25), 0.82) c h), oklch(from var(--sf-color-neutral) clamp(0.25, calc(l - 0.2), 0.55) c h) )` |
| `--sf-color-text--inverse` | `light-dark( oklch(from var(--sf-color-neutral-source-light) clamp(0.85, calc(l + 0.4), 0.98) c h), oklch(from var(--sf-color-neutral) clamp(0.05, calc(l - 0.4), 0.35) c h) )` |
| `--sf-color-text--muted` | `light-dark( oklch(from var(--sf-color-neutral-source-light) clamp(0.35, calc(l - var(--sf-contrast-bias)), 0.62) c h), oklch(from var(--sf-color-neutral) clamp(0.48, calc(l + var(--sf-contrast-bias)), 0.74) c h) )` |
| `--sf-color-text--on-action` | `oklch(from var(--sf-color-action) clamp(0.1, sign(var(--sf-contrast-threshold) - l) * 999, 0.95) 0 0)` |
| `--sf-color-text--on-base` | `var(--sf-color-text)` |
| `--sf-color-text--on-danger` | `oklch(from var(--sf-color-danger) clamp(0.1, sign(var(--sf-contrast-threshold) - l) * 999, 0.95) 0 0)` |
| `--sf-color-text--on-info` | `oklch(from var(--sf-color-info) clamp(0.1, sign(var(--sf-contrast-threshold) - l) * 999, 0.95) 0 0)` |
| `--sf-color-text--on-inverse` | `oklch(from var(--sf-color-inverse) clamp(0.1, sign(var(--sf-contrast-threshold) - l) * 999, 0.95) 0 0)` |
| `--sf-color-text--on-neutral` | `oklch(from var(--sf-color-neutral) clamp(0.1, sign(var(--sf-contrast-threshold) - l) * 999, 0.95) 0 0)` |
| `--sf-color-text--on-primary` | `oklch(from var(--sf-color-primary) clamp(0.1, sign(var(--sf-contrast-threshold) - l) * 999, 0.95) 0 0)` |
| `--sf-color-text--on-secondary` | `oklch(from var(--sf-color-secondary) clamp(0.1, sign(var(--sf-contrast-threshold) - l) * 999, 0.95) 0 0)` |
| `--sf-color-text--on-success` | `oklch(from var(--sf-color-success) clamp(0.1, sign(var(--sf-contrast-threshold) - l) * 999, 0.95) 0 0)` |
| `--sf-color-text--on-tertiary` | `oklch(from var(--sf-color-tertiary) clamp(0.1, sign(var(--sf-contrast-threshold) - l) * 999, 0.95) 0 0)` |
| `--sf-color-text--on-warning` | `oklch(from var(--sf-color-warning) clamp(0.1, sign(var(--sf-contrast-threshold) - l) * 999, 0.95) 0 0)` |
| `--sf-color-text--placeholder` | `light-dark( oklch(from var(--sf-color-neutral-source-light) clamp(0.45, calc(l + 0.15), 0.75) c h), oklch(from var(--sf-color-neutral) clamp(0.35, calc(l - 0.1), 0.65) c h) )` |
| `--sf-color-text--secondary` | `light-dark( oklch(from var(--sf-color-neutral-source-light) clamp(0.15, calc(l - 0.25 - var(--sf-contrast-bias)), 0.45) c h), oklch(from var(--sf-color-neutral) clamp(0.55, calc(l + 0.1 + var(--sf-contrast-bias)), 0.90) c h) )` |
| `--sf-color-warning` | `light-dark(var(--sf-color-warning-source-light), var(--sf-color-warning-source-dark, oklch(from var(--sf-color-warning-source-light) clamp(0.65, calc(0.95 - l * 0.5), 0.88) calc(c * 0.9) h)))` |
| `--sf-color-warning-muted` | `oklch(from var(--sf-color-warning) l c h / 0.3)` |
| `--sf-color-warning-source-dark` | `oklch(0.65 0.153 80) *(registered)*` |
| `--sf-color-warning-source-light` | `oklch(0.75 0.17 80)` |
| `--sf-color-warning-strong` | `light-dark( oklch(from var(--sf-color-warning-source-light) calc(l - 0.25) c h), oklch(from var(--sf-color-warning) clamp(0.70, calc(l + 0.05), 1) c h) )` |
| `--sf-color-warning-subtle` | `oklch(from var(--sf-color-warning) l c h / 0.12)` |
| `--sf-color-white` | `oklch(100% 0 0)` |
| `--sf-component-pad` | `var(--sf-space-m)` |
| `--sf-container-default` | `75rem` |
| `--sf-container-full` | `100%` |
| `--sf-container-narrow` | `38rem` |
| `--sf-container-prose` | `65ch` |
| `--sf-container-wide` | `90rem` |
| `--sf-content-gap` | `var(--sf-space-s)` |
| `--sf-contrast-bias` | `0` |
| `--sf-contrast-threshold` | `0.6` |
| `--sf-current-font-weight` | `var(--sf-font-weight-bold)` |
| `--sf-display-l-line-height` | `1` |
| `--sf-display-m-line-height` | `1.05` |
| `--sf-display-s-line-height` | `var(--sf-leading-tight)` |
| `--sf-divider-color` | `var(--sf-color-border)` |
| `--sf-divider-gap` | `var(--sf-space-m)` |
| `--sf-divider-style` | `solid` |
| `--sf-divider-width` | `var(--sf-border-width-1)` |
| `--sf-drop-shadow-l` | `drop-shadow(0 8px 16px oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 2.5), 0.7)))` |
| `--sf-drop-shadow-m` | `drop-shadow(0 4px 6px oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 2), 0.7)))` |
| `--sf-drop-shadow-s` | `drop-shadow(0 1px 2px oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 1.5), 0.7)))` |
| `--sf-duration-fast` | `calc(150ms * var(--sf-motion-scale))` |
| `--sf-duration-instant` | `calc(100ms * var(--sf-motion-scale))` |
| `--sf-duration-none` | `0ms` |
| `--sf-duration-normal` | `calc(250ms * var(--sf-motion-scale))` |
| `--sf-duration-slow` | `calc(400ms * var(--sf-motion-scale))` |
| `--sf-duration-slower` | `calc(600ms * var(--sf-motion-scale))` |
| `--sf-ease-bounce` | `linear(0, 0.35 18%, 1 32%, 0.86 42%, 1.02 56%, 0.98 72%, 1)` |
| `--sf-ease-elastic` | `linear(0, 0.3, 1.2, 0.9, 1.05, 1)` |
| `--sf-ease-in` | `cubic-bezier(0.5, 0, 0.75, 0.25)` |
| `--sf-ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` |
| `--sf-ease-linear` | `linear` |
| `--sf-ease-out` | `cubic-bezier(0.25, 0, 0.15, 1)` |
| `--sf-ease-overshoot` | `linear(0, 0.6 30%, 1.08 55%, 0.98 75%, 1)` |
| `--sf-ease-spring` | `linear(0, 0.5, 1.1, 0.95, 1.02, 1)` |
| `--sf-field-block` | `var(--sf-space-l)` |
| `--sf-field-required-marker` | `" *"` |
| `--sf-fluid-max-vw` | `90` |
| `--sf-fluid-min-vw` | `22.5` |
| `--sf-focus-ring-color` | `var(--sf-color-action)` |
| `--sf-focus-ring-offset` | `2px` |
| `--sf-focus-ring-shadow` | `0 0 0 var(--sf-focus-ring-offset) var(--sf-color-bg, var(--sf-color-base-source-light, #fff)), 0 0 0 calc(var(--sf-focus-ring-offset) + var(--sf-focus-ring-width)) var(--sf-focus-ring-color)` |
| `--sf-focus-ring-style` | `solid` |
| `--sf-focus-ring-width` | `2px` |
| `--sf-font-body` | `system-ui, -apple-system, sans-serif` |
| `--sf-font-display` | `var(--sf-font-heading)` |
| `--sf-font-features` | `normal` |
| `--sf-font-geometric` | `"Avenir", "Montserrat", "Corbel", "URW Gothic", source-sans-pro, sans-serif` |
| `--sf-font-heading` | `var(--sf-font-body)` |
| `--sf-font-humanist` | `"Seravek", "Gill Sans Nova", "Ubuntu", "Calibri", "DejaVu Sans", source-sans-pro, sans-serif` |
| `--sf-font-mono` | `ui-monospace, monospace` |
| `--sf-font-numeric` | `tabular-nums` |
| `--sf-font-slab` | `"Rockwell", "Rockwell Nova", "Roboto Slab", "DejaVu Serif", "Sitka Small", serif` |
| `--sf-font-variation` | `normal` |
| `--sf-font-weight-body` | `var(--sf-font-weight-normal)` |
| `--sf-font-weight-bold` | `700` |
| `--sf-font-weight-display` | `var(--sf-font-weight-bold)` |
| `--sf-font-weight-heading` | `var(--sf-font-weight-semibold)` |
| `--sf-font-weight-interactive` | `var(--sf-font-weight-semibold)` |
| `--sf-font-weight-light` | `300` |
| `--sf-font-weight-medium` | `500` |
| `--sf-font-weight-normal` | `400` |
| `--sf-font-weight-semibold` | `600` |
| `--sf-font-weight-strong` | `var(--sf-font-weight-bold)` |
| `--sf-gap` | `var(--sf-space-m)` |
| `--sf-gradient-brand` | `linear-gradient(in oklch 135deg, var(--sf-color-primary), oklch(from var(--sf-color-primary) l c calc(h + 30)))` |
| `--sf-gradient-fade--b` | `linear-gradient(in oklch to bottom, transparent, var(--sf-color-bg))` |
| `--sf-gradient-fade--l` | `linear-gradient(in oklch to left, transparent, var(--sf-color-bg))` |
| `--sf-gradient-fade--r` | `linear-gradient(in oklch to right, transparent, var(--sf-color-bg))` |
| `--sf-gradient-fade--t` | `linear-gradient(in oklch to top, transparent, var(--sf-color-bg))` |
| `--sf-gradient-primary` | `linear-gradient(in oklch 135deg, var(--sf-color-primary), oklch(from var(--sf-color-primary) calc(l - 0.08) c h))` |
| `--sf-gradient-secondary` | `linear-gradient(in oklch 135deg, var(--sf-color-secondary), oklch(from var(--sf-color-secondary) calc(l - 0.08) c h))` |
| `--sf-gradient-surface` | `linear-gradient(in oklab 180deg, var(--sf-color-surface), var(--sf-color-bg))` |
| `--sf-gradient-tertiary` | `linear-gradient(in oklch 135deg, var(--sf-color-tertiary), oklch(from var(--sf-color-tertiary) calc(l - 0.08) c h))` |
| `--sf-gutter` | `var(--sf-space-l)` |
| `--sf-h1-font-weight` | `var(--sf-font-weight-heading)` |
| `--sf-h1-letter-spacing` | `var(--sf-tracking-tight)` |
| `--sf-h1-line-height` | `var(--sf-leading-tight)` |
| `--sf-h1-max-width` | `none` |
| `--sf-h1-size` | `var(--sf-text-4xl)` |
| `--sf-h2-font-weight` | `var(--sf-font-weight-heading)` |
| `--sf-h2-letter-spacing` | `var(--sf-tracking-tight)` |
| `--sf-h2-line-height` | `var(--sf-leading-tight)` |
| `--sf-h2-max-width` | `none` |
| `--sf-h2-size` | `var(--sf-text-3xl)` |
| `--sf-h3-font-weight` | `var(--sf-font-weight-heading)` |
| `--sf-h3-letter-spacing` | `var(--sf-tracking-normal)` |
| `--sf-h3-line-height` | `var(--sf-leading-snug)` |
| `--sf-h3-max-width` | `none` |
| `--sf-h3-size` | `var(--sf-text-2xl)` |
| `--sf-h4-font-weight` | `var(--sf-font-weight-heading)` |
| `--sf-h4-letter-spacing` | `var(--sf-tracking-normal)` |
| `--sf-h4-line-height` | `var(--sf-leading-snug)` |
| `--sf-h4-max-width` | `none` |
| `--sf-h4-size` | `var(--sf-text-xl)` |
| `--sf-h5-font-weight` | `var(--sf-font-weight-heading)` |
| `--sf-h5-letter-spacing` | `var(--sf-tracking-normal)` |
| `--sf-h5-line-height` | `var(--sf-leading-normal)` |
| `--sf-h5-max-width` | `none` |
| `--sf-h5-size` | `var(--sf-text-l)` |
| `--sf-h6-font-weight` | `var(--sf-font-weight-heading)` |
| `--sf-h6-letter-spacing` | `var(--sf-tracking-wide)` |
| `--sf-h6-line-height` | `var(--sf-leading-normal)` |
| `--sf-h6-max-width` | `none` |
| `--sf-h6-size` | `var(--sf-text-m)` |
| `--sf-header-height` | `clamp( var(--sf-header-height-mobile), calc((var(--sf-header-height-desktop) - var(--sf-header-height-mobile)) / ((var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * 1rem) * (100vw - var(--sf-fluid-min-vw) * 1rem) + var(--sf-header-height-mobile)), var(--sf-header-height-desktop))` |
| `--sf-header-height-desktop` | `5rem` |
| `--sf-header-height-mobile` | `3.5rem` |
| `--sf-heading-color` | `var(--sf-color-heading)` |
| `--sf-heading-font-family` | `var(--sf-font-heading)` |
| `--sf-heading-text-wrap` | `balance` |
| `--sf-icon-2xl` | `4em` |
| `--sf-icon-l` | `2em` |
| `--sf-icon-m` | `1.5em` |
| `--sf-icon-s` | `1em` |
| `--sf-icon-xl` | `3em` |
| `--sf-icon-xs` | `0.875em` |
| `--sf-is-active` | `0 *(registered)*` |
| `--sf-is-current` | `0 *(registered)*` |
| `--sf-is-dark` | `0 *(registered)*` |
| `--sf-is-open` | `0 *(registered)*` |
| `--sf-is-pressed` | `0 *(registered)*` |
| `--sf-leading-normal` | `1.5` |
| `--sf-leading-relaxed` | `1.625` |
| `--sf-leading-snug` | `1.3` |
| `--sf-leading-taper` | `0` |
| `--sf-leading-tight` | `1.1` |
| `--sf-link-external-marker` | `" \2197"` |
| `--sf-link-underline-offset` | `0.15em` |
| `--sf-link-underline-thickness` | `auto` |
| `--sf-lumlocker` | `0.65` |
| `--sf-mask-scrim-end` | `var(--sf-space-l)` |
| `--sf-mask-scrim-start` | `var(--sf-space-l)` |
| `--sf-motion-scale` | `1` |
| `--sf-object-fit` | `cover` |
| `--sf-object-position` | `50% 50%` |
| `--sf-opacity-disabled` | `0.45` |
| `--sf-opacity-muted` | `0.5` |
| `--sf-optical-sizing` | `auto` |
| `--sf-palette-mix-100` | `8%` |
| `--sf-palette-mix-200` | `20%` |
| `--sf-palette-mix-300` | `40%` |
| `--sf-palette-mix-400` | `65%` |
| `--sf-palette-mix-50` | `4%` |
| `--sf-palette-mix-600` | `82%` |
| `--sf-palette-mix-700` | `62%` |
| `--sf-palette-mix-800` | `38%` |
| `--sf-palette-mix-900` | `18%` |
| `--sf-palette-mix-950` | `8%` |
| `--sf-print-base-size` | `11pt` |
| `--sf-print-page-margin` | `2cm` |
| `--sf-print-page-size` | `a4` |
| `--sf-radius-2xl` | `calc(24px * var(--sf-radius-scale))` |
| `--sf-radius-2xs` | `calc(1px * var(--sf-radius-scale))` |
| `--sf-radius-3xl` | `calc(32px * var(--sf-radius-scale))` |
| `--sf-radius-4xl` | `calc(48px * var(--sf-radius-scale))` |
| `--sf-radius-full` | `9999px` |
| `--sf-radius-l` | `calc(12px * var(--sf-radius-scale))` |
| `--sf-radius-m` | `calc(8px * var(--sf-radius-scale))` |
| `--sf-radius-none` | `0` |
| `--sf-radius-outer` | `calc(var(--sf-radius-m) + var(--sf-component-pad))` |
| `--sf-radius-pill` | `var(--sf-radius-full)` |
| `--sf-radius-s` | `calc(4px * var(--sf-radius-scale))` |
| `--sf-radius-scale` | `1` |
| `--sf-radius-xl` | `calc(16px * var(--sf-radius-scale))` |
| `--sf-radius-xs` | `calc(2px * var(--sf-radius-scale))` |
| `--sf-ratio-3-2` | `3 / 2` |
| `--sf-ratio-4-3` | `4 / 3` |
| `--sf-ratio-cinema` | `21 / 9` |
| `--sf-ratio-golden` | `1.618 / 1` |
| `--sf-ratio-portrait` | `3 / 4` |
| `--sf-ratio-square` | `1` |
| `--sf-ratio-video` | `16 / 9` |
| `--sf-safe-bottom` | `env(safe-area-inset-bottom, 0px)` |
| `--sf-safe-left` | `env(safe-area-inset-left, 0px)` |
| `--sf-safe-right` | `env(safe-area-inset-right, 0px)` |
| `--sf-safe-top` | `env(safe-area-inset-top, 0px)` |
| `--sf-scroll-timeline-range-end` | `cover 30%` |
| `--sf-scroll-timeline-range-start` | `entry 0%` |
| `--sf-scrollbar-thumb` | `var(--sf-color-neutral)` |
| `--sf-scrollbar-track` | `transparent` |
| `--sf-section-pad` | `var(--sf-section-pad--m)` |
| `--sf-section-pad--2xl` | `calc(var(--sf-space-4xl) * 2 * var(--sf-section-scale))` |
| `--sf-section-pad--l` | `calc(var(--sf-space-4xl) * var(--sf-section-scale))` |
| `--sf-section-pad--m` | `calc(var(--sf-space-3xl) * var(--sf-section-scale))` |
| `--sf-section-pad--s` | `calc(var(--sf-space-2xl) * var(--sf-section-scale))` |
| `--sf-section-pad--xl` | `calc(var(--sf-space-4xl) * 1.5 * var(--sf-section-scale))` |
| `--sf-section-pad--xs` | `calc(var(--sf-space-xl) * var(--sf-section-scale))` |
| `--sf-section-scale` | `1` |
| `--sf-shadow-2xl` | `0 4px 12px 0 oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 0.6), 0.7)), 0 20px 60px 0 oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 4), 0.7)), 0 40px 100px -8px oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 5), 0.7))` |
| `--sf-shadow-color` | `oklch(from var(--sf-color-neutral) var(--sf-shadow-lightness) c h)` |
| `--sf-shadow-glow` | `0 0 15px 2px oklch(from var(--sf-shadow-glow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 2), 0.7))` |
| `--sf-shadow-glow-color` | `var(--sf-color-primary)` |
| `--sf-shadow-inner` | `inset 0 2px 4px 0 oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 2), 0.7))` |
| `--sf-shadow-l` | `0 2px 4px 0 oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 0.5), 0.7)), 0 8px 24px 0 oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 3), 0.7)), 0 16px 48px 0 oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 2), 0.7))` |
| `--sf-shadow-lightness` | `0.15` |
| `--sf-shadow-m` | `0 1px 3px 0 oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 0.5), 0.7)), 0 4px 12px 0 oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 2), 0.7))` |
| `--sf-shadow-none` | `none` |
| `--sf-shadow-s` | `0 1px 2px 0 oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 0.5), 0.7)), 0 2px 6px 0 oklch(from var(--sf-shadow-color) l c h / clamp(0, var(--sf-shadow-strength), 0.7))` |
| `--sf-shadow-strength` | `calc(0.08 + var(--sf-is-dark) * 0.17)` |
| `--sf-shadow-xl` | `0 2px 8px 0 oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 0.5), 0.7)), 0 12px 36px 0 oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 3.5), 0.7)), 0 24px 72px 0 oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 2.5), 0.7))` |
| `--sf-shadow-xs` | `0 1px 2px 0 oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 0.5), 0.7))` |
| `--sf-size-l` | `2.75rem` |
| `--sf-size-m` | `2.5rem` |
| `--sf-size-s` | `2rem` |
| `--sf-size-xl` | `3.5rem` |
| `--sf-size-xs` | `1.5rem` |
| `--sf-space-2xl` | `calc(clamp(calc(var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), 3) * 1rem), calc((var(--sf-space-base-max) * pow(var(--sf-space-ratio-max), 3) - var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), 3)) / (var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * (100vw - var(--sf-fluid-min-vw) * 1rem) + var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), 3) * 1rem), calc(var(--sf-space-base-max) * pow(var(--sf-space-ratio-max), 3) * 1rem)) * var(--sf-space-scale))` |
| `--sf-space-2xs` | `calc(clamp(calc(var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), -3) * 1rem), calc((var(--sf-space-base-max) * pow(var(--sf-space-ratio-max), -3) - var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), -3)) / (var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * (100vw - var(--sf-fluid-min-vw) * 1rem) + var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), -3) * 1rem), calc(var(--sf-space-base-max) * pow(var(--sf-space-ratio-max), -3) * 1rem)) * var(--sf-space-scale))` |
| `--sf-space-3xl` | `calc(clamp(calc(var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), 4) * 1rem), calc((var(--sf-space-base-max) * pow(var(--sf-space-ratio-max), 4) - var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), 4)) / (var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * (100vw - var(--sf-fluid-min-vw) * 1rem) + var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), 4) * 1rem), calc(var(--sf-space-base-max) * pow(var(--sf-space-ratio-max), 4) * 1rem)) * var(--sf-space-scale))` |
| `--sf-space-4xl` | `calc(clamp(calc(var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), 5) * 1rem), calc((var(--sf-space-base-max) * pow(var(--sf-space-ratio-max), 5) - var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), 5)) / (var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * (100vw - var(--sf-fluid-min-vw) * 1rem) + var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), 5) * 1rem), calc(var(--sf-space-base-max) * pow(var(--sf-space-ratio-max), 5) * 1rem)) * var(--sf-space-scale))` |
| `--sf-space-base-max` | `2` |
| `--sf-space-base-min` | `1` |
| `--sf-space-l` | `calc(clamp(calc(var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), 1) * 1rem), calc((var(--sf-space-base-max) * pow(var(--sf-space-ratio-max), 1) - var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), 1)) / (var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * (100vw - var(--sf-fluid-min-vw) * 1rem) + var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), 1) * 1rem), calc(var(--sf-space-base-max) * pow(var(--sf-space-ratio-max), 1) * 1rem)) * var(--sf-space-scale))` |
| `--sf-space-m` | `calc(clamp(calc(var(--sf-space-base-min) * 1rem), calc((var(--sf-space-base-max) - var(--sf-space-base-min)) / (var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * (100vw - var(--sf-fluid-min-vw) * 1rem) + var(--sf-space-base-min) * 1rem), calc(var(--sf-space-base-max) * 1rem)) * var(--sf-space-scale))` |
| `--sf-space-none` | `0` |
| `--sf-space-px` | `1px` |
| `--sf-space-ratio-max` | `1.333` |
| `--sf-space-ratio-min` | `1.25` |
| `--sf-space-s` | `calc(clamp(calc(var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), -1) * 1rem), calc((var(--sf-space-base-max) * pow(var(--sf-space-ratio-max), -1) - var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), -1)) / (var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * (100vw - var(--sf-fluid-min-vw) * 1rem) + var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), -1) * 1rem), calc(var(--sf-space-base-max) * pow(var(--sf-space-ratio-max), -1) * 1rem)) * var(--sf-space-scale))` |
| `--sf-space-scale` | `1` |
| `--sf-space-xl` | `calc(clamp(calc(var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), 2) * 1rem), calc((var(--sf-space-base-max) * pow(var(--sf-space-ratio-max), 2) - var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), 2)) / (var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * (100vw - var(--sf-fluid-min-vw) * 1rem) + var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), 2) * 1rem), calc(var(--sf-space-base-max) * pow(var(--sf-space-ratio-max), 2) * 1rem)) * var(--sf-space-scale))` |
| `--sf-space-xs` | `calc(clamp(calc(var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), -2) * 1rem), calc((var(--sf-space-base-max) * pow(var(--sf-space-ratio-max), -2) - var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), -2)) / (var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * (100vw - var(--sf-fluid-min-vw) * 1rem) + var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), -2) * 1rem), calc(var(--sf-space-base-max) * pow(var(--sf-space-ratio-max), -2) * 1rem)) * var(--sf-space-scale))` |
| `--sf-state-pending-opacity` | `0.7` |
| `--sf-sticky-offset` | `clamp( var(--sf-sticky-offset-mobile), calc((var(--sf-sticky-offset-desktop) - var(--sf-sticky-offset-mobile)) / ((var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * 1rem) * (100vw - var(--sf-fluid-min-vw) * 1rem) + var(--sf-sticky-offset-mobile)), var(--sf-sticky-offset-desktop))` |
| `--sf-sticky-offset-desktop` | `var(--sf-header-height-desktop)` |
| `--sf-sticky-offset-mobile` | `var(--sf-header-height-mobile)` |
| `--sf-text-2xl` | `calc(clamp(calc(var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), 3) * 1rem), calc((var(--sf-text-base-max) * pow(var(--sf-text-ratio-max), 3) - var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), 3)) / (var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * (100vw - var(--sf-fluid-min-vw) * 1rem) + var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), 3) * 1rem), calc(var(--sf-text-base-max) * pow(var(--sf-text-ratio-max), 3) * 1rem)) * var(--sf-text-scale))` |
| `--sf-text-2xl-font-weight` | `var(--sf-font-weight-heading)` |
| `--sf-text-2xl-letter-spacing` | `var(--sf-tracking-normal)` |
| `--sf-text-2xl-line-height` | `calc(var(--sf-leading-snug) - 6 * var(--sf-leading-taper))` |
| `--sf-text-2xl-max-width` | `none` |
| `--sf-text-2xs` | `calc(clamp(calc(var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), -3) * 1rem), calc((var(--sf-text-base-max) * pow(var(--sf-text-ratio-max), -3) - var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), -3)) / (var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * (100vw - var(--sf-fluid-min-vw) * 1rem) + var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), -3) * 1rem), calc(var(--sf-text-base-max) * pow(var(--sf-text-ratio-max), -3) * 1rem)) * var(--sf-text-scale))` |
| `--sf-text-2xs-font-weight` | `var(--sf-font-weight-body)` |
| `--sf-text-2xs-letter-spacing` | `var(--sf-tracking-normal)` |
| `--sf-text-2xs-line-height` | `var(--sf-leading-relaxed)` |
| `--sf-text-2xs-max-width` | `55ch` |
| `--sf-text-3xl` | `calc(clamp(calc(var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), 4) * 1rem), calc((var(--sf-text-base-max) * pow(var(--sf-text-ratio-max), 4) - var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), 4)) / (var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * (100vw - var(--sf-fluid-min-vw) * 1rem) + var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), 4) * 1rem), calc(var(--sf-text-base-max) * pow(var(--sf-text-ratio-max), 4) * 1rem)) * var(--sf-text-scale))` |
| `--sf-text-3xl-font-weight` | `var(--sf-font-weight-heading)` |
| `--sf-text-3xl-letter-spacing` | `var(--sf-tracking-tight)` |
| `--sf-text-3xl-line-height` | `calc(var(--sf-leading-tight) - 7 * var(--sf-leading-taper))` |
| `--sf-text-3xl-max-width` | `none` |
| `--sf-text-4xl` | `calc(clamp(calc(var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), 5) * 1rem), calc((var(--sf-text-base-max) * pow(var(--sf-text-ratio-max), 5) - var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), 5)) / (var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * (100vw - var(--sf-fluid-min-vw) * 1rem) + var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), 5) * 1rem), calc(var(--sf-text-base-max) * pow(var(--sf-text-ratio-max), 5) * 1rem)) * var(--sf-text-scale))` |
| `--sf-text-4xl-font-weight` | `var(--sf-font-weight-heading)` |
| `--sf-text-4xl-letter-spacing` | `var(--sf-tracking-tight)` |
| `--sf-text-4xl-line-height` | `calc(var(--sf-leading-tight) - 8 * var(--sf-leading-taper))` |
| `--sf-text-4xl-max-width` | `none` |
| `--sf-text-base-max` | `1.25` |
| `--sf-text-base-min` | `1` |
| `--sf-text-display-base-max` | `3` |
| `--sf-text-display-base-min` | `2.4` |
| `--sf-text-display-l` | `calc(clamp(calc(var(--sf-text-display-base-min) * pow(var(--sf-text-ratio-min), 2) * 1rem), calc((var(--sf-text-display-base-max) * pow(var(--sf-text-ratio-max), 2) - var(--sf-text-display-base-min) * pow(var(--sf-text-ratio-min), 2)) / (var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * (100vw - var(--sf-fluid-min-vw) * 1rem) + var(--sf-text-display-base-min) * pow(var(--sf-text-ratio-min), 2) * 1rem), calc(var(--sf-text-display-base-max) * pow(var(--sf-text-ratio-max), 2) * 1rem)) * var(--sf-text-display-scale))` |
| `--sf-text-display-m` | `calc(clamp(calc(var(--sf-text-display-base-min) * pow(var(--sf-text-ratio-min), 1) * 1rem), calc((var(--sf-text-display-base-max) * pow(var(--sf-text-ratio-max), 1) - var(--sf-text-display-base-min) * pow(var(--sf-text-ratio-min), 1)) / (var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * (100vw - var(--sf-fluid-min-vw) * 1rem) + var(--sf-text-display-base-min) * pow(var(--sf-text-ratio-min), 1) * 1rem), calc(var(--sf-text-display-base-max) * pow(var(--sf-text-ratio-max), 1) * 1rem)) * var(--sf-text-display-scale))` |
| `--sf-text-display-s` | `calc(clamp(calc(var(--sf-text-display-base-min) * 1rem), calc((var(--sf-text-display-base-max) - var(--sf-text-display-base-min)) / (var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * (100vw - var(--sf-fluid-min-vw) * 1rem) + var(--sf-text-display-base-min) * 1rem), calc(var(--sf-text-display-base-max) * 1rem)) * var(--sf-text-display-scale))` |
| `--sf-text-display-scale` | `1` |
| `--sf-text-l` | `calc(clamp(calc(var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), 1) * 1rem), calc((var(--sf-text-base-max) * pow(var(--sf-text-ratio-max), 1) - var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), 1)) / (var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * (100vw - var(--sf-fluid-min-vw) * 1rem) + var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), 1) * 1rem), calc(var(--sf-text-base-max) * pow(var(--sf-text-ratio-max), 1) * 1rem)) * var(--sf-text-scale))` |
| `--sf-text-l-font-weight` | `var(--sf-font-weight-body)` |
| `--sf-text-l-letter-spacing` | `var(--sf-tracking-normal)` |
| `--sf-text-l-line-height` | `calc(var(--sf-leading-normal) - 4 * var(--sf-leading-taper))` |
| `--sf-text-l-max-width` | `none` |
| `--sf-text-m` | `calc(clamp(calc(var(--sf-text-base-min) * 1rem), calc((var(--sf-text-base-max) - var(--sf-text-base-min)) / (var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * (100vw - var(--sf-fluid-min-vw) * 1rem) + var(--sf-text-base-min) * 1rem), calc(var(--sf-text-base-max) * 1rem)) * var(--sf-text-scale))` |
| `--sf-text-m-font-weight` | `var(--sf-font-weight-body)` |
| `--sf-text-m-letter-spacing` | `var(--sf-tracking-normal)` |
| `--sf-text-m-line-height` | `calc(var(--sf-leading-normal) - 3 * var(--sf-leading-taper))` |
| `--sf-text-m-max-width` | `65ch` |
| `--sf-text-ratio-max` | `1.333` |
| `--sf-text-ratio-min` | `1.25` |
| `--sf-text-s` | `calc(clamp(calc(var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), -1) * 1rem), calc((var(--sf-text-base-max) * pow(var(--sf-text-ratio-max), -1) - var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), -1)) / (var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * (100vw - var(--sf-fluid-min-vw) * 1rem) + var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), -1) * 1rem), calc(var(--sf-text-base-max) * pow(var(--sf-text-ratio-max), -1) * 1rem)) * var(--sf-text-scale))` |
| `--sf-text-s-font-weight` | `var(--sf-font-weight-body)` |
| `--sf-text-s-letter-spacing` | `var(--sf-tracking-normal)` |
| `--sf-text-s-line-height` | `calc(var(--sf-leading-relaxed) - 2 * var(--sf-leading-taper))` |
| `--sf-text-s-max-width` | `65ch` |
| `--sf-text-scale` | `1` |
| `--sf-text-shadow-l` | `0 4px 8px oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 2.5), 0.7))` |
| `--sf-text-shadow-m` | `0 2px 4px oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 2), 0.7))` |
| `--sf-text-shadow-none` | `none` |
| `--sf-text-shadow-s` | `0 1px 2px oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 1.5), 0.7))` |
| `--sf-text-xl` | `calc(clamp(calc(var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), 2) * 1rem), calc((var(--sf-text-base-max) * pow(var(--sf-text-ratio-max), 2) - var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), 2)) / (var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * (100vw - var(--sf-fluid-min-vw) * 1rem) + var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), 2) * 1rem), calc(var(--sf-text-base-max) * pow(var(--sf-text-ratio-max), 2) * 1rem)) * var(--sf-text-scale))` |
| `--sf-text-xl-font-weight` | `var(--sf-font-weight-body)` |
| `--sf-text-xl-letter-spacing` | `var(--sf-tracking-normal)` |
| `--sf-text-xl-line-height` | `calc(var(--sf-leading-snug) - 5 * var(--sf-leading-taper))` |
| `--sf-text-xl-max-width` | `none` |
| `--sf-text-xs` | `calc(clamp(calc(var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), -2) * 1rem), calc((var(--sf-text-base-max) * pow(var(--sf-text-ratio-max), -2) - var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), -2)) / (var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * (100vw - var(--sf-fluid-min-vw) * 1rem) + var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), -2) * 1rem), calc(var(--sf-text-base-max) * pow(var(--sf-text-ratio-max), -2) * 1rem)) * var(--sf-text-scale))` |
| `--sf-text-xs-font-weight` | `var(--sf-font-weight-body)` |
| `--sf-text-xs-letter-spacing` | `var(--sf-tracking-normal)` |
| `--sf-text-xs-line-height` | `calc(var(--sf-leading-relaxed) - 1 * var(--sf-leading-taper))` |
| `--sf-text-xs-max-width` | `60ch` |
| `--sf-theme-transition-duration` | `calc(300ms * var(--sf-motion-scale))` |
| `--sf-touch-target` | `var(--sf-size-l)` |
| `--sf-tracking-normal` | `0` |
| `--sf-tracking-tight` | `-0.025em` |
| `--sf-tracking-wide` | `0.025em` |
| `--sf-tracking-wider` | `0.05em` |
| `--sf-tracking-widest` | `0.1em` |
| `--sf-transition-colors` | `color var(--sf-duration-normal) var(--sf-ease-out), background-color var(--sf-duration-normal) var(--sf-ease-out), border-color var(--sf-duration-normal) var(--sf-ease-out), text-decoration-color var(--sf-duration-normal) var(--sf-ease-out), fill var(--sf-duration-normal) var(--sf-ease-out), stroke var(--sf-duration-normal) var(--sf-ease-out)` |
| `--sf-transition-enter` | `color var(--sf-duration-normal) var(--sf-ease-out), background-color var(--sf-duration-normal) var(--sf-ease-out), border-color var(--sf-duration-normal) var(--sf-ease-out), box-shadow var(--sf-duration-normal) var(--sf-ease-out), opacity var(--sf-duration-normal) var(--sf-ease-out), transform var(--sf-duration-normal) var(--sf-ease-out), filter var(--sf-duration-normal) var(--sf-ease-out)` |
| `--sf-transition-exit` | `color var(--sf-duration-fast) var(--sf-ease-in), background-color var(--sf-duration-fast) var(--sf-ease-in), border-color var(--sf-duration-fast) var(--sf-ease-in), box-shadow var(--sf-duration-fast) var(--sf-ease-in), opacity var(--sf-duration-fast) var(--sf-ease-in), transform var(--sf-duration-fast) var(--sf-ease-in), filter var(--sf-duration-fast) var(--sf-ease-in)` |
| `--sf-transition-fast` | `color var(--sf-duration-fast) var(--sf-ease-out), background-color var(--sf-duration-fast) var(--sf-ease-out), border-color var(--sf-duration-fast) var(--sf-ease-out), box-shadow var(--sf-duration-fast) var(--sf-ease-out), opacity var(--sf-duration-fast) var(--sf-ease-out), transform var(--sf-duration-fast) var(--sf-ease-out), filter var(--sf-duration-fast) var(--sf-ease-out)` |
| `--sf-transition-form-field` | `color var(--sf-duration-normal) var(--sf-ease-out), background-color var(--sf-duration-normal) var(--sf-ease-out), text-decoration-color var(--sf-duration-normal) var(--sf-ease-out), fill var(--sf-duration-normal) var(--sf-ease-out), stroke var(--sf-duration-normal) var(--sf-ease-out), border-color var(--sf-duration-fast) var(--sf-ease-out), box-shadow var(--sf-duration-fast) var(--sf-ease-out), opacity var(--sf-duration-fast) var(--sf-ease-out)` |
| `--sf-transition-opacity` | `opacity var(--sf-duration-normal) var(--sf-ease-out)` |
| `--sf-transition-overlay` | `overlay var(--sf-duration-normal) allow-discrete, display var(--sf-duration-normal) allow-discrete` |
| `--sf-transition-shadow` | `box-shadow var(--sf-duration-normal) var(--sf-ease-out)` |
| `--sf-transition-slow` | `color var(--sf-duration-slow) var(--sf-ease-in-out), background-color var(--sf-duration-slow) var(--sf-ease-in-out), border-color var(--sf-duration-slow) var(--sf-ease-in-out), box-shadow var(--sf-duration-slow) var(--sf-ease-in-out), opacity var(--sf-duration-slow) var(--sf-ease-in-out), transform var(--sf-duration-slow) var(--sf-ease-in-out), filter var(--sf-duration-slow) var(--sf-ease-in-out)` |
| `--sf-transition-transform` | `transform var(--sf-duration-normal) var(--sf-ease-out)` |
| `--sf-z-base` | `0` |
| `--sf-z-below` | `-1` |
| `--sf-z-dropdown` | `1020` |
| `--sf-z-fixed` | `1010` |
| `--sf-z-modal` | `1040` |
| `--sf-z-overlay` | `1030` |
| `--sf-z-raised` | `1` |
| `--sf-z-sticky` | `1000` |
| `--sf-z-toast` | `1050` |
| `--sf-z-tooltip` | `1060` |

## Layout tokens (`core/tokens.layout.css`)

54 tokens.

| Token | Default |
|---|---|
| `--sf-alternate-gap` | `var(--sf-content-gap)` |
| `--sf-alternate-inner-gap` | `var(--sf-gap)` |
| `--sf-bento-cols-default` | `4` |
| `--sf-bento-gap` | `var(--sf-gap)` |
| `--sf-bento-row-compact` | `6rem` |
| `--sf-bento-row-default` | `10rem` |
| `--sf-bento-row-tall` | `16rem` |
| `--sf-bg-fit` | `cover` |
| `--sf-bg-inset` | `0` |
| `--sf-bg-position` | `50% 50%` |
| `--sf-bg-radius` | `0` |
| `--sf-bg-z` | `-2` |
| `--sf-box-border-color` | `var(--sf-color-border)` |
| `--sf-box-border-width` | `0` |
| `--sf-box-padding` | `var(--sf-space-m)` |
| `--sf-breakout-width` | `var(--sf-container-wide)` |
| `--sf-center-gutter` | `var(--sf-gutter)` |
| `--sf-center-max` | `var(--sf-container-default)` |
| `--sf-cluster-align` | `center` |
| `--sf-cluster-gap` | `var(--sf-gap)` |
| `--sf-cluster-justify` | `flex-start` |
| `--sf-content-width` | `var(--sf-container-default)` |
| `--sf-cover-min-height` | `100dvh` |
| `--sf-cover-padding` | `var(--sf-section-pad)` |
| `--sf-equal-gap` | `var(--sf-gap)` |
| `--sf-equal-min-col` | `16rem` |
| `--sf-equal-min-col-2` | `28rem` |
| `--sf-equal-min-col-3` | `15rem` |
| `--sf-equal-min-col-4` | `16rem` |
| `--sf-equal-min-col-6` | `10rem` |
| `--sf-frame-ratio` | `16 / 9` |
| `--sf-grid-gap` | `var(--sf-gap)` |
| `--sf-grid-min` | `16rem` |
| `--sf-grid-min-2xl` | `28rem` |
| `--sf-grid-min-l` | `20rem` |
| `--sf-grid-min-m` | `16rem` |
| `--sf-grid-min-s` | `13rem` |
| `--sf-grid-min-xl` | `24rem` |
| `--sf-grid-min-xs` | `10rem` |
| `--sf-icon-box-bg` | `var(--sf-color-inset)` |
| `--sf-icon-box-border` | `var(--sf-border-width-1) solid var(--sf-color-border)` |
| `--sf-icon-box-pad` | `0.5em` |
| `--sf-icon-box-radius` | `var(--sf-radius-s)` |
| `--sf-imposter-margin` | `var(--sf-space-m)` |
| `--sf-prose-paragraph` | `var(--sf-content-gap)` |
| `--sf-reel-gap` | `var(--sf-gap)` |
| `--sf-reel-height` | `auto` |
| `--sf-reel-item-width` | `max-content` |
| `--sf-sidebar-gap` | `var(--sf-gap)` |
| `--sf-sidebar-min-width` | `50%` |
| `--sf-sidebar-width` | `18rem` |
| `--sf-stack-gap` | `var(--sf-content-gap)` |
| `--sf-switcher-gap` | `var(--sf-gap)` |
| `--sf-switcher-threshold` | `30rem` |

## Macro tokens (`core/tokens.macros.css`)

23 tokens.

| Token | Default |
|---|---|
| `--sf-aspect` | `16 / 9` |
| `--sf-content-intrinsic-size` | `500px` |
| `--sf-flow-space` | `var(--sf-content-gap)` |
| `--sf-line-clamp` | `3` |
| `--sf-prose-block-margin` | `var(--sf-space-m)` |
| `--sf-prose-blockquote-border` | `var(--sf-border-width-2) solid var(--sf-color-border--subtle)` |
| `--sf-prose-blockquote-padding` | `var(--sf-space-m)` |
| `--sf-prose-figcaption-size` | `var(--sf-text-s)` |
| `--sf-prose-figure-margin` | `var(--sf-space-l)` |
| `--sf-prose-heading-gap` | `var(--sf-space-s)` |
| `--sf-prose-hr-margin` | `var(--sf-space-l)` |
| `--sf-prose-list-gap` | `var(--sf-space-xs)` |
| `--sf-prose-marker-color` | `var(--sf-color-primary)` |
| `--sf-prose-media-margin` | `var(--sf-space-m)` |
| `--sf-prose-media-radius` | `var(--sf-radius-m)` |
| `--sf-prose-nested-list-gap` | `var(--sf-space-2xs)` |
| `--sf-prose-table-pad` | `var(--sf-space-xs)` |
| `--sf-scrim-color` | `oklch(0 0 0 / 0.55)` |
| `--sf-scrim-direction` | `to top` |
| `--sf-scrim-gradient` | `linear-gradient(var(--sf-scrim-direction), var(--sf-scrim-color), transparent)` |
| `--sf-scrim-text-shadow` | `0 1px 3px oklch(0 0 0 / 0.6)` |
| `--sf-scroll-shadow-size` | `2rem` |
| `--sf-surface-color` | `var(--sf-color-base)` |

## Component tokens (`optional/tokens.components.css`)

6 tokens.

| Token | Default |
|---|---|
| `--sf-button-padding-block` | `var(--sf-space-xs)` |
| `--sf-button-padding-inline` | `var(--sf-space-m)` |
| `--sf-button-radius` | `var(--sf-radius-m)` |
| `--sf-field-padding-block` | `var(--sf-space-xs)` |
| `--sf-field-padding-inline` | `var(--sf-space-s)` |
| `--sf-field-radius` | `var(--sf-radius-m)` |

