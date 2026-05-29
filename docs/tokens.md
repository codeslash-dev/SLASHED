# Token reference

> **Generated** from source by `scripts/gen-token-reference.js` —
> run `npm run docs:tokens` to refresh. Do not edit by hand.

**623 tokens.** Every `--sf-*` custom property and its default value. See
[architecture.md](architecture.md) for the PUBLIC / PUBLIC-ADVANCED / INTERNAL
contract and naming conventions (a DEPRECATED tier will be introduced
post-0.5.0 when tokens are retired), and [theming.md](theming.md) for the
rebrand workflow.

## Core tokens (`core/tokens.css`)

372 tokens.

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
| `--sf-blur-l` | `32px` |
| `--sf-blur-m` | `16px` |
| `--sf-blur-s` | `8px` |
| `--sf-blur-xl` | `48px` |
| `--sf-blur-xs` | `4px` |
| `--sf-body-color` | `var(--sf-color-text)` |
| `--sf-body-em-style` | `italic` |
| `--sf-body-font-family` | `var(--sf-font-body)` |
| `--sf-body-font-size` | `var(--sf-text-m)` |
| `--sf-body-font-weight` | `var(--sf-font-weight-body)` |
| `--sf-body-line-height` | `var(--sf-leading-normal)` |
| `--sf-body-strong-weight` | `var(--sf-font-weight-bold)` |
| `--sf-body-text-wrap` | `pretty` |
| `--sf-border-style` | `solid` |
| `--sf-border-style-dotted` | `dotted` |
| `--sf-border-style-soft` | `dashed` |
| `--sf-border-style-strong` | `solid` |
| `--sf-border-width-1` | `1px` |
| `--sf-border-width-2` | `2px` |
| `--sf-border-width-3` | `3px` |
| `--sf-border-width-4` | `4px` |
| `--sf-border-width-hairline` | `0.5px` |
| `--sf-caret-color` | `var(--sf-color-action)` |
| `--sf-code-font-size` | `0.875em` |
| `--sf-color-action` | `light-dark(var(--sf-color-action-light), var(--sf-color-action-dark, oklch(from var(--sf-color-action-light) clamp(0.65, calc(0.95 - l * 0.5), 0.88) calc(c * 0.9) h)))` |
| `--sf-color-action-light` | `oklch(0.50 0.22 235) *(registered)*` |
| `--sf-color-base` | `light-dark(var(--sf-color-base-light), var(--sf-color-base-dark, oklch(from var(--sf-color-base-light) clamp(0.16, calc(1.18 - l), 0.24) calc(c * 0.5) h)))` |
| `--sf-color-base-light` | `oklch(0.96 0.006 250) *(registered)*` |
| `--sf-color-bg` | `oklch(from var(--sf-color-base) calc(l + 0.02) c h)` |
| `--sf-color-bg--active` | `oklch(from var(--sf-color-neutral) l c h / 0.12)` |
| `--sf-color-bg--disabled` | `var(--sf-color-well)` |
| `--sf-color-bg--focus` | `oklch(from var(--sf-color-action) l c h / 0.06)` |
| `--sf-color-bg--hover` | `oklch(from var(--sf-color-neutral) l c h / 0.08)` |
| `--sf-color-bg--selected` | `oklch(from var(--sf-color-action) l c h / 0.1)` |
| `--sf-color-border` | `light-dark( oklch(from var(--sf-color-neutral-light) clamp(0.70, calc(l + 0.35), 0.95) 0.005 h), oklch(from var(--sf-color-neutral) clamp(0.25, calc(l - 0.3), 0.55) 0.005 h) )` |
| `--sf-color-border--disabled` | `oklch(from var(--sf-color-border--subtle) l 0 h / 0.5)` |
| `--sf-color-border--focus` | `var(--sf-color-action)` |
| `--sf-color-border--strong` | `light-dark( oklch(from var(--sf-color-neutral-light) clamp(0.55, calc(l + 0.1), 0.85) 0.02 h), oklch(from var(--sf-color-neutral) clamp(0.38, calc(l - 0.1), 0.65) 0.02 h) )` |
| `--sf-color-border--subtle` | `light-dark( oklch(from var(--sf-color-neutral-light) clamp(0.75, calc(l + 0.4), 0.97) 0.005 h), oklch(from var(--sf-color-neutral) clamp(0.20, calc(l - 0.38), 0.45) 0.005 h) )` |
| `--sf-color-border--translucent` | `oklch(from var(--sf-color-neutral) l c h / 0.15)` |
| `--sf-color-code-bg` | `var(--sf-color-well)` |
| `--sf-color-code-text` | `oklch(from var(--sf-color-code-bg) clamp(0.1, sign(var(--sf-contrast-threshold) - l) * 999, 0.95) 0 0)` |
| `--sf-color-danger` | `light-dark(var(--sf-color-danger-light), var(--sf-color-danger-dark, oklch(from var(--sf-color-danger-light) clamp(0.65, calc(0.95 - l * 0.5), 0.88) calc(c * 0.9) h)))` |
| `--sf-color-danger-light` | `oklch(0.48 0.22 12) *(registered)*` |
| `--sf-color-danger-muted` | `oklch(from var(--sf-color-danger) l c h / 0.3)` |
| `--sf-color-danger-strong` | `light-dark( oklch(from var(--sf-color-danger-light) calc(l - 0.1) c h), oklch(from var(--sf-color-danger) clamp(0.70, calc(l + 0.15), 1) c h) )` |
| `--sf-color-danger-subtle` | `oklch(from var(--sf-color-danger) l c h / 0.1)` |
| `--sf-color-dim` | `oklch(0 0 0 / 0.5)` |
| `--sf-color-error` | `light-dark(var(--sf-color-error-light), var(--sf-color-error-dark, oklch(from var(--sf-color-error-light) clamp(0.65, calc(0.95 - l * 0.5), 0.88) calc(c * 0.9) h)))` |
| `--sf-color-error-light` | `oklch(0.50 0.20 25) *(registered)*` |
| `--sf-color-error-muted` | `oklch(from var(--sf-color-error) l c h / 0.3)` |
| `--sf-color-error-strong` | `light-dark( oklch(from var(--sf-color-error-light) calc(l - 0.1) c h), oklch(from var(--sf-color-error) clamp(0.70, calc(l + 0.15), 1) c h) )` |
| `--sf-color-error-subtle` | `oklch(from var(--sf-color-error) l c h / 0.1)` |
| `--sf-color-heading` | `light-dark( oklch(from var(--sf-color-neutral-light) clamp(0.05, calc(l - 0.4 - var(--sf-contrast-bias)), 0.35) c h), oklch(from var(--sf-color-neutral) clamp(0.70, calc(l + 0.25 + var(--sf-contrast-bias)), 1) c h) )` |
| `--sf-color-info` | `light-dark(var(--sf-color-info-light), var(--sf-color-info-dark, oklch(from var(--sf-color-info-light) clamp(0.65, calc(0.95 - l * 0.5), 0.88) calc(c * 0.9) h)))` |
| `--sf-color-info-light` | `oklch(0.48 0.18 235) *(registered)*` |
| `--sf-color-info-muted` | `oklch(from var(--sf-color-info) l c h / 0.3)` |
| `--sf-color-info-strong` | `light-dark( oklch(from var(--sf-color-info-light) calc(l - 0.1) c h), oklch(from var(--sf-color-info) clamp(0.70, calc(l + 0.15), 1) c h) )` |
| `--sf-color-info-subtle` | `oklch(from var(--sf-color-info) l c h / 0.1)` |
| `--sf-color-inverse` | `oklch(from var(--sf-color-base) calc(1 - l) c h)` |
| `--sf-color-link` | `light-dark( oklch(from var(--sf-color-action) clamp(0, min(l - 0.07, 0.48), 1) c h), oklch(from var(--sf-color-action) clamp(0.68, l, 1) c h) )` |
| `--sf-color-link--active` | `light-dark( oklch(from var(--sf-color-action) clamp(0, min(l - 0.21, 0.34), 1) c h), oklch(from var(--sf-color-action) clamp(0, max(l + 0.15, 0.74), 1) c h) )` |
| `--sf-color-link--disabled` | `var(--sf-color-text--disabled)` |
| `--sf-color-link--hover` | `light-dark( oklch(from var(--sf-color-action) clamp(0, min(l - 0.15, 0.40), 1) c h), oklch(from var(--sf-color-action) clamp(0, max(l + 0.10, 0.68), 1) c h) )` |
| `--sf-color-link--underline` | `oklch(from var(--sf-color-action) l c h / 0.3)` |
| `--sf-color-link--visited` | `light-dark( oklch(from var(--sf-color-action) clamp(0, min(l - 0.07, 0.48), 1) c calc(h + 60)), oklch(from var(--sf-color-action) clamp(0.68, l, 1) c calc(h + 60)) )` |
| `--sf-color-mark-bg` | `oklch(from var(--sf-color-warning) l c h / 0.25)` |
| `--sf-color-mark-text` | `inherit` |
| `--sf-color-neutral` | `light-dark(var(--sf-color-neutral-light), var(--sf-color-neutral-dark, oklch(from var(--sf-color-neutral-light) clamp(0.65, calc(0.95 - l * 0.5), 0.88) calc(c * 0.9) h)))` |
| `--sf-color-neutral-light` | `oklch(0.52 0.025 260) *(registered)*` |
| `--sf-color-overlay` | `oklch(from var(--sf-color-base) l c h / 0.9)` |
| `--sf-color-primary` | `light-dark(var(--sf-color-primary-light), var(--sf-color-primary-dark, oklch(from var(--sf-color-primary-light) clamp(0.65, calc(0.95 - l * 0.5), 0.88) calc(c * 0.9) h)))` |
| `--sf-color-primary-light` | `oklch(0.47 0.27 264) *(registered)*` |
| `--sf-color-raised` | `oklch(from var(--sf-color-base) calc(l + 0.04) c h)` |
| `--sf-color-scheme` | `light dark` |
| `--sf-color-secondary` | `light-dark(var(--sf-color-secondary-light), var(--sf-color-secondary-dark, oklch(from var(--sf-color-secondary-light) clamp(0.65, calc(0.95 - l * 0.5), 0.88) calc(c * 0.9) h)))` |
| `--sf-color-secondary-light` | `oklch(0.22 0.04 264) *(registered)*` |
| `--sf-color-selection-bg` | `light-dark( oklch(from var(--sf-color-action-light) l c h / 0.28), oklch(from var(--sf-color-action-light) clamp(0.62, calc(0.93 - l * 0.4), 0.78) c h / 0.55) )` |
| `--sf-color-selection-text` | `inherit` |
| `--sf-color-success` | `light-dark(var(--sf-color-success-light), var(--sf-color-success-dark, oklch(from var(--sf-color-success-light) clamp(0.65, calc(0.95 - l * 0.5), 0.88) calc(c * 0.9) h)))` |
| `--sf-color-success-light` | `oklch(0.50 0.16 145) *(registered)*` |
| `--sf-color-success-muted` | `oklch(from var(--sf-color-success) l c h / 0.3)` |
| `--sf-color-success-strong` | `light-dark( oklch(from var(--sf-color-success-light) calc(l - 0.15) c h), oklch(from var(--sf-color-success) clamp(0.70, calc(l + 0.15), 1) c h) )` |
| `--sf-color-success-subtle` | `oklch(from var(--sf-color-success) l c h / 0.12)` |
| `--sf-color-surface` | `var(--sf-color-base)` |
| `--sf-color-tertiary` | `light-dark(var(--sf-color-tertiary-light), var(--sf-color-tertiary-dark, oklch(from var(--sf-color-tertiary-light) clamp(0.65, calc(0.95 - l * 0.5), 0.88) calc(c * 0.9) h)))` |
| `--sf-color-tertiary-light` | `oklch(0.42 0.22 295) *(registered)*` |
| `--sf-color-text` | `light-dark( oklch(from var(--sf-color-neutral-light) clamp(0.05, calc(l - 0.4 - var(--sf-contrast-bias)), 0.35) c h), oklch(from var(--sf-color-neutral) clamp(0.70, calc(l + 0.25 + var(--sf-contrast-bias)), 1) c h) )` |
| `--sf-color-text--disabled` | `light-dark( oklch(from var(--sf-color-neutral-light) clamp(0.55, calc(l + 0.25), 0.82) c h), oklch(from var(--sf-color-neutral) clamp(0.25, calc(l - 0.2), 0.55) c h) )` |
| `--sf-color-text--inverse` | `light-dark( oklch(from var(--sf-color-neutral-light) clamp(0.85, calc(l + 0.4), 0.98) c h), oklch(from var(--sf-color-neutral) clamp(0.05, calc(l - 0.4), 0.35) c h) )` |
| `--sf-color-text--muted` | `var(--sf-color-neutral)` |
| `--sf-color-text--on-action` | `oklch(from var(--sf-color-action) clamp(0.1, sign(var(--sf-contrast-threshold) - l) * 999, 0.95) 0 0)` |
| `--sf-color-text--on-base` | `var(--sf-color-text)` |
| `--sf-color-text--on-danger` | `oklch(from var(--sf-color-danger) clamp(0.1, sign(var(--sf-contrast-threshold) - l) * 999, 0.95) 0 0)` |
| `--sf-color-text--on-error` | `oklch(from var(--sf-color-error) clamp(0.1, sign(var(--sf-contrast-threshold) - l) * 999, 0.95) 0 0)` |
| `--sf-color-text--on-info` | `oklch(from var(--sf-color-info) clamp(0.1, sign(var(--sf-contrast-threshold) - l) * 999, 0.95) 0 0)` |
| `--sf-color-text--on-inverse` | `var(--sf-color-text--inverse)` |
| `--sf-color-text--on-neutral` | `oklch(from var(--sf-color-neutral) clamp(0.1, sign(var(--sf-contrast-threshold) - l) * 999, 0.95) 0 0)` |
| `--sf-color-text--on-primary` | `oklch(from var(--sf-color-primary) clamp(0.1, sign(var(--sf-contrast-threshold) - l) * 999, 0.95) 0 0)` |
| `--sf-color-text--on-secondary` | `oklch(from var(--sf-color-secondary) clamp(0.1, sign(var(--sf-contrast-threshold) - l) * 999, 0.95) 0 0)` |
| `--sf-color-text--on-success` | `oklch(from var(--sf-color-success) clamp(0.1, sign(var(--sf-contrast-threshold) - l) * 999, 0.95) 0 0)` |
| `--sf-color-text--on-tertiary` | `oklch(from var(--sf-color-tertiary) clamp(0.1, sign(var(--sf-contrast-threshold) - l) * 999, 0.95) 0 0)` |
| `--sf-color-text--on-warning` | `oklch(from var(--sf-color-warning) clamp(0.1, sign(var(--sf-contrast-threshold) - l) * 999, 0.95) 0 0)` |
| `--sf-color-text--placeholder` | `light-dark( oklch(from var(--sf-color-neutral-light) clamp(0.45, calc(l + 0.15), 0.75) c h), oklch(from var(--sf-color-neutral) clamp(0.35, calc(l - 0.1), 0.65) c h) )` |
| `--sf-color-text--secondary` | `light-dark( oklch(from var(--sf-color-neutral-light) clamp(0.15, calc(l - 0.25 - var(--sf-contrast-bias)), 0.45) c h), oklch(from var(--sf-color-neutral) clamp(0.55, calc(l + 0.1 + var(--sf-contrast-bias)), 0.90) c h) )` |
| `--sf-color-warning` | `light-dark(var(--sf-color-warning-light), var(--sf-color-warning-dark, oklch(from var(--sf-color-warning-light) clamp(0.65, calc(0.95 - l * 0.5), 0.88) calc(c * 0.9) h)))` |
| `--sf-color-warning-light` | `oklch(0.75 0.17 80) *(registered)*` |
| `--sf-color-warning-muted` | `oklch(from var(--sf-color-warning) l c h / 0.3)` |
| `--sf-color-warning-strong` | `light-dark( oklch(from var(--sf-color-warning-light) calc(l - 0.25) c h), oklch(from var(--sf-color-warning) clamp(0.70, calc(l + 0.05), 1) c h) )` |
| `--sf-color-warning-subtle` | `oklch(from var(--sf-color-warning) l c h / 0.12)` |
| `--sf-color-well` | `oklch(from var(--sf-color-base) calc(l - 0.02) c h)` |
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
| `--sf-divider-color` | `var(--sf-color-border)` |
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
| `--sf-focus-ring-color` | `var(--sf-color-action)` |
| `--sf-focus-ring-offset` | `2px` |
| `--sf-focus-ring-shadow` | `0 0 0 var(--sf-focus-ring-offset) var(--sf-color-bg), 0 0 0 calc(var(--sf-focus-ring-offset) + var(--sf-focus-ring-width)) var(--sf-focus-ring-color)` |
| `--sf-focus-ring-style` | `solid` |
| `--sf-focus-ring-width` | `2px` |
| `--sf-font-body` | `system-ui, -apple-system, sans-serif` |
| `--sf-font-display` | `var(--sf-font-heading)` |
| `--sf-font-features` | `normal` |
| `--sf-font-geometric` | `"Avenir", "Montserrat", "Corbel", "URW Gothic", source-sans-pro, sans-serif` |
| `--sf-font-heading` | `var(--sf-font-body)` |
| `--sf-font-humanist` | `"Seravek", "Gill Sans Nova", "Ubuntu", "Calibri", "DejaVu Sans", source-sans-pro, sans-serif` |
| `--sf-font-mono` | `ui-monospace, monospace` |
| `--sf-font-slab` | `"Rockwell", "Rockwell Nova", "Roboto Slab", "DejaVu Serif", "Sitka Small", serif` |
| `--sf-font-variation` | `normal` |
| `--sf-font-weight-black` | `900` |
| `--sf-font-weight-body` | `var(--sf-font-weight-normal)` |
| `--sf-font-weight-bold` | `700` |
| `--sf-font-weight-display` | `var(--sf-font-weight-bold)` |
| `--sf-font-weight-extrabold` | `800` |
| `--sf-font-weight-extralight` | `200` |
| `--sf-font-weight-heading` | `var(--sf-font-weight-semibold)` |
| `--sf-font-weight-light` | `300` |
| `--sf-font-weight-medium` | `500` |
| `--sf-font-weight-normal` | `400` |
| `--sf-font-weight-semibold` | `600` |
| `--sf-font-weight-thin` | `100` |
| `--sf-gap` | `var(--sf-space-m)` |
| `--sf-gradient-brand` | `linear-gradient(135deg, var(--sf-color-primary), oklch(from var(--sf-color-primary) l c calc(h + 30)))` |
| `--sf-gradient-fade--b` | `linear-gradient(to bottom, transparent, var(--sf-color-bg))` |
| `--sf-gradient-fade--l` | `linear-gradient(to left, transparent, var(--sf-color-bg))` |
| `--sf-gradient-fade--r` | `linear-gradient(to right, transparent, var(--sf-color-bg))` |
| `--sf-gradient-fade--t` | `linear-gradient(to top, transparent, var(--sf-color-bg))` |
| `--sf-gradient-primary` | `linear-gradient(135deg, var(--sf-color-primary), oklch(from var(--sf-color-primary) calc(l - 0.08) c h))` |
| `--sf-gradient-secondary` | `linear-gradient(135deg, var(--sf-color-secondary), oklch(from var(--sf-color-secondary) calc(l - 0.08) c h))` |
| `--sf-gradient-surface` | `linear-gradient(180deg, var(--sf-color-surface), var(--sf-color-bg))` |
| `--sf-gradient-tertiary` | `linear-gradient(135deg, var(--sf-color-tertiary), oklch(from var(--sf-color-tertiary) calc(l - 0.08) c h))` |
| `--sf-h1-font-weight` | `var(--sf-font-weight-heading)` |
| `--sf-h1-letter-spacing` | `var(--sf-tracking-tight)` |
| `--sf-h1-line-height` | `var(--sf-leading-tight)` |
| `--sf-h1-size` | `var(--sf-text-4xl)` |
| `--sf-h2-font-weight` | `var(--sf-font-weight-heading)` |
| `--sf-h2-letter-spacing` | `var(--sf-tracking-tight)` |
| `--sf-h2-line-height` | `var(--sf-leading-tight)` |
| `--sf-h2-size` | `var(--sf-text-3xl)` |
| `--sf-h3-font-weight` | `var(--sf-font-weight-heading)` |
| `--sf-h3-letter-spacing` | `var(--sf-tracking-normal)` |
| `--sf-h3-line-height` | `var(--sf-leading-snug)` |
| `--sf-h3-size` | `var(--sf-text-2xl)` |
| `--sf-h4-font-weight` | `var(--sf-font-weight-heading)` |
| `--sf-h4-letter-spacing` | `var(--sf-tracking-normal)` |
| `--sf-h4-line-height` | `var(--sf-leading-snug)` |
| `--sf-h4-size` | `var(--sf-text-xl)` |
| `--sf-h5-font-weight` | `var(--sf-font-weight-heading)` |
| `--sf-h5-letter-spacing` | `var(--sf-tracking-normal)` |
| `--sf-h5-line-height` | `var(--sf-leading-normal)` |
| `--sf-h5-size` | `var(--sf-text-l)` |
| `--sf-h6-font-weight` | `var(--sf-font-weight-heading)` |
| `--sf-h6-letter-spacing` | `var(--sf-tracking-wide)` |
| `--sf-h6-line-height` | `var(--sf-leading-normal)` |
| `--sf-h6-size` | `var(--sf-text-m)` |
| `--sf-header-height` | `8rem` |
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
| `--sf-leading-tight` | `1.1` |
| `--sf-link-external-marker` | `" \2197"` |
| `--sf-lumlocker` | `0.65` |
| `--sf-mask-scrim-end` | `var(--sf-space-l)` |
| `--sf-mask-scrim-start` | `var(--sf-space-l)` |
| `--sf-motion-scale` | `1` |
| `--sf-opacity-0` | `0` |
| `--sf-opacity-10` | `0.1` |
| `--sf-opacity-100` | `1` |
| `--sf-opacity-25` | `0.25` |
| `--sf-opacity-50` | `0.5` |
| `--sf-opacity-75` | `0.75` |
| `--sf-opacity-disabled` | `0.45` |
| `--sf-optical-sizing` | `auto` |
| `--sf-perspective-far` | `2000px` |
| `--sf-perspective-near` | `500px` |
| `--sf-perspective-normal` | `1000px` |
| `--sf-print-base-size` | `11pt` |
| `--sf-print-page-margin` | `2cm` |
| `--sf-print-page-size` | `a4` |
| `--sf-radius-2xl` | `calc(24px * var(--sf-radius-scale))` |
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
| `--sf-section-pad--2xl` | `calc(var(--sf-space-4xl) * 2)` |
| `--sf-section-pad--l` | `var(--sf-space-4xl)` |
| `--sf-section-pad--m` | `var(--sf-space-3xl)` |
| `--sf-section-pad--s` | `var(--sf-space-2xl)` |
| `--sf-section-pad--xl` | `calc(var(--sf-space-4xl) * 1.5)` |
| `--sf-section-pad--xs` | `var(--sf-space-xl)` |
| `--sf-shadow-2xl` | `0 4px 12px 0 oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 0.6), 0.7)), 0 20px 60px 0 oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 4), 0.7)), 0 40px 100px -8px oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 5), 0.7))` |
| `--sf-shadow-color` | `oklch(from var(--sf-color-neutral) 0.15 c h)` |
| `--sf-shadow-glow` | `0 0 15px 2px oklch(from var(--sf-shadow-glow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 2), 0.7))` |
| `--sf-shadow-glow-color` | `var(--sf-color-primary)` |
| `--sf-shadow-inner` | `inset 0 2px 4px 0 oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 2), 0.7))` |
| `--sf-shadow-l` | `0 2px 4px 0 oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 0.5), 0.7)), 0 8px 24px 0 oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 3), 0.7)), 0 16px 48px 0 oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 2), 0.7))` |
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
| `--sf-space-2xl` | `calc(clamp(1.95rem, calc(0.04133333333333333 * (100vw - 22.5rem) + 1.95rem), 4.74rem) * var(--sf-space-scale))` |
| `--sf-space-2xs` | `calc(clamp(0.51rem, calc(0.004888888888888888 * (100vw - 22.5rem) + 0.51rem), 0.84rem) * var(--sf-space-scale))` |
| `--sf-space-3xl` | `calc(clamp(2.44rem, calc(0.057333333333333326 * (100vw - 22.5rem) + 2.44rem), 6.31rem) * var(--sf-space-scale))` |
| `--sf-space-4xl` | `calc(clamp(3.05rem, calc(0.07955555555555556 * (100vw - 22.5rem) + 3.05rem), 8.42rem) * var(--sf-space-scale))` |
| `--sf-space-gutter` | `var(--sf-space-l)` |
| `--sf-space-l` | `calc(clamp(1.25rem, calc(0.021037037037037035 * (100vw - 22.5rem) + 1.25rem), 2.67rem) * var(--sf-space-scale))` |
| `--sf-space-m` | `calc(clamp(1rem, calc(0.014814814814814815 * (100vw - 22.5rem) + 1rem), 2rem) * var(--sf-space-scale))` |
| `--sf-space-none` | `0` |
| `--sf-space-px` | `1px` |
| `--sf-space-s` | `calc(clamp(0.8rem, calc(0.01037037037037037 * (100vw - 22.5rem) + 0.8rem), 1.5rem) * var(--sf-space-scale))` |
| `--sf-space-scale` | `1` |
| `--sf-space-xl` | `calc(clamp(1.56rem, calc(0.029481481481481477 * (100vw - 22.5rem) + 1.56rem), 3.55rem) * var(--sf-space-scale))` |
| `--sf-space-xs` | `calc(clamp(0.64rem, calc(0.007259259259259258 * (100vw - 22.5rem) + 0.64rem), 1.13rem) * var(--sf-space-scale))` |
| `--sf-state-pending-opacity` | `0.7` |
| `--sf-sticky-offset` | `var(--sf-header-height)` |
| `--sf-stroke-bold` | `2px` |
| `--sf-stroke-heavy` | `3px` |
| `--sf-stroke-regular` | `1.5px` |
| `--sf-stroke-thin` | `1px` |
| `--sf-text-2xl` | `clamp(1.95rem, calc(0.014962962962962963 * (100vw - 22.5rem) + 1.95rem), 2.96rem)` |
| `--sf-text-2xs` | `clamp(0.51rem, calc(0.00029629629629629656 * (100vw - 22.5rem) + 0.51rem), 0.53rem)` |
| `--sf-text-3xl` | `clamp(2.44rem, calc(0.022370370370370374 * (100vw - 22.5rem) + 2.44rem), 3.95rem)` |
| `--sf-text-4xl` | `clamp(3.05rem, calc(0.03274074074074074 * (100vw - 22.5rem) + 3.05rem), 5.26rem)` |
| `--sf-text-display-l` | `clamp(3.75rem, calc(0.023407407407407408 * (100vw - 22.5rem) + 3.75rem), 5.33rem)` |
| `--sf-text-display-m` | `clamp(3rem, calc(0.014814814814814815 * (100vw - 22.5rem) + 3rem), 4rem)` |
| `--sf-text-display-s` | `clamp(2.4rem, calc(0.00888888888888889 * (100vw - 22.5rem) + 2.4rem), 3rem)` |
| `--sf-text-display-scale` | `1` |
| `--sf-text-l` | `clamp(1.25rem, calc(0.006222222222222221 * (100vw - 22.5rem) + 1.25rem), 1.67rem)` |
| `--sf-text-m` | `clamp(1rem, calc(0.003703703703703704 * (100vw - 22.5rem) + 1rem), 1.25rem)` |
| `--sf-text-s` | `clamp(0.8rem, calc(0.002074074074074073 * (100vw - 22.5rem) + 0.8rem), 0.94rem)` |
| `--sf-text-scale` | `1` |
| `--sf-text-shadow-l` | `0 4px 8px oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 2.5), 0.7))` |
| `--sf-text-shadow-m` | `0 2px 4px oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 2), 0.7))` |
| `--sf-text-shadow-none` | `none` |
| `--sf-text-shadow-s` | `0 1px 2px oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 1.5), 0.7))` |
| `--sf-text-xl` | `clamp(1.56rem, calc(0.00977777777777778 * (100vw - 22.5rem) + 1.56rem), 2.22rem)` |
| `--sf-text-xs` | `clamp(0.64rem, calc(0.0008888888888888881 * (100vw - 22.5rem) + 0.64rem), 0.7rem)` |
| `--sf-touch-target` | `var(--sf-size-l)` |
| `--sf-tracking-normal` | `0` |
| `--sf-tracking-tight` | `-0.025em` |
| `--sf-tracking-wide` | `0.025em` |
| `--sf-tracking-wider` | `0.05em` |
| `--sf-tracking-widest` | `0.1em` |
| `--sf-transition-all` | `all var(--sf-duration-normal) var(--sf-ease-out)` |
| `--sf-transition-colors` | `color var(--sf-duration-normal) var(--sf-ease-out), background-color var(--sf-duration-normal) var(--sf-ease-out), border-color var(--sf-duration-normal) var(--sf-ease-out), text-decoration-color var(--sf-duration-normal) var(--sf-ease-out), fill var(--sf-duration-normal) var(--sf-ease-out), stroke var(--sf-duration-normal) var(--sf-ease-out)` |
| `--sf-transition-enter` | `all var(--sf-duration-normal) var(--sf-ease-out)` |
| `--sf-transition-exit` | `all var(--sf-duration-fast) var(--sf-ease-in)` |
| `--sf-transition-fast` | `all var(--sf-duration-fast) var(--sf-ease-out)` |
| `--sf-transition-opacity` | `opacity var(--sf-duration-normal) var(--sf-ease-out)` |
| `--sf-transition-shadow` | `box-shadow var(--sf-duration-normal) var(--sf-ease-out)` |
| `--sf-transition-slow` | `all var(--sf-duration-slow) var(--sf-ease-in-out)` |
| `--sf-transition-transform` | `transform var(--sf-duration-normal) var(--sf-ease-out)` |
| `--sf-z-base` | `0` |
| `--sf-z-below` | `-1` |
| `--sf-z-high` | `500` |
| `--sf-z-low` | `10` |
| `--sf-z-max` | `9999` |
| `--sf-z-mid` | `100` |
| `--sf-z-raised` | `1` |
| `--sf-z-top` | `900` |

## Layout tokens (`core/tokens.layout.css`)

48 tokens.

| Token | Default |
|---|---|
| `--sf-alternate-gap` | `var(--sf-space-content)` |
| `--sf-alternate-inner-gap` | `var(--sf-space-gap)` |
| `--sf-bento-cols-default` | `3` |
| `--sf-bento-gap` | `var(--sf-space-gap)` |
| `--sf-bento-row-compact` | `6rem` |
| `--sf-bento-row-default` | `10rem` |
| `--sf-bento-row-tall` | `16rem` |
| `--sf-box-border-color` | `var(--sf-color-border)` |
| `--sf-box-border-width` | `0` |
| `--sf-box-padding` | `var(--sf-space-m)` |
| `--sf-breakout-width` | `var(--sf-container-wide)` |
| `--sf-center-gutter` | `var(--sf-space-gutter)` |
| `--sf-center-max` | `var(--sf-container-default)` |
| `--sf-cluster-align` | `center` |
| `--sf-cluster-gap` | `var(--sf-space-gap)` |
| `--sf-cluster-justify` | `flex-start` |
| `--sf-content-width` | `var(--sf-container-default)` |
| `--sf-cover-min-height` | `100dvh` |
| `--sf-cover-padding` | `var(--sf-section-pad)` |
| `--sf-equal-cols` | `2` |
| `--sf-equal-gap` | `var(--sf-space-gap)` |
| `--sf-frame-ratio` | `16 / 9` |
| `--sf-gap-size` | `var(--sf-space-gap)` |
| `--sf-grid-gap` | `var(--sf-space-gap)` |
| `--sf-grid-min` | `16rem` |
| `--sf-grid-min-2xl` | `28rem` |
| `--sf-grid-min-l` | `20rem` |
| `--sf-grid-min-m` | `16rem` |
| `--sf-grid-min-s` | `13rem` |
| `--sf-grid-min-xl` | `24rem` |
| `--sf-grid-min-xs` | `10rem` |
| `--sf-icon-box-bg` | `var(--sf-color-well)` |
| `--sf-icon-box-border` | `var(--sf-border-width-1) solid var(--sf-color-border)` |
| `--sf-icon-box-pad` | `0.5em` |
| `--sf-icon-box-radius` | `var(--sf-radius-s)` |
| `--sf-imposter-margin` | `var(--sf-space-m)` |
| `--sf-prose-paragraph` | `var(--sf-space-content)` |
| `--sf-reel-gap` | `var(--sf-space-gap)` |
| `--sf-reel-height` | `auto` |
| `--sf-reel-item-width` | `max-content` |
| `--sf-sidebar-gap` | `var(--sf-space-gap)` |
| `--sf-sidebar-min-width` | `50%` |
| `--sf-sidebar-width` | `18rem` |
| `--sf-space-content` | `var(--sf-content-gap)` |
| `--sf-space-gap` | `var(--sf-gap)` |
| `--sf-stack-gap` | `var(--sf-space-content)` |
| `--sf-switcher-gap` | `var(--sf-space-gap)` |
| `--sf-switcher-threshold` | `30rem` |

## Macro tokens (`core/tokens.macros.css`)

5 tokens.

| Token | Default |
|---|---|
| `--sf-aspect` | `16 / 9` |
| `--sf-flow-space` | `var(--sf-space-content)` |
| `--sf-line-clamp` | `3` |
| `--sf-scroll-shadow-size` | `2rem` |
| `--sf-truncate-suffix` | `"\2026"` |

## Palette tokens (`optional/tokens.palette.css`)

198 tokens.

| Token | Default |
|---|---|
| `--sf-color-action-100` | `color-mix(in oklab, var(--sf-color-action) 8%, var(--sf-color-base))` |
| `--sf-color-action-200` | `color-mix(in oklab, var(--sf-color-action) 20%, var(--sf-color-base))` |
| `--sf-color-action-300` | `color-mix(in oklab, var(--sf-color-action) 40%, var(--sf-color-base))` |
| `--sf-color-action-400` | `color-mix(in oklab, var(--sf-color-action) 65%, var(--sf-color-base))` |
| `--sf-color-action-50` | `color-mix(in oklab, var(--sf-color-action) 4%, var(--sf-color-base))` |
| `--sf-color-action-500` | `var(--sf-color-action)` |
| `--sf-color-action-600` | `color-mix(in oklab, var(--sf-color-action) 82%, var(--sf-color-text))` |
| `--sf-color-action-700` | `color-mix(in oklab, var(--sf-color-action) 62%, var(--sf-color-text))` |
| `--sf-color-action-800` | `color-mix(in oklab, var(--sf-color-action) 38%, var(--sf-color-text))` |
| `--sf-color-action-900` | `color-mix(in oklab, var(--sf-color-action) 18%, var(--sf-color-text))` |
| `--sf-color-action-950` | `color-mix(in oklab, var(--sf-color-action) 8%, var(--sf-color-text))` |
| `--sf-color-action-a10` | `color-mix(in oklab, var(--sf-color-action) 10%, transparent)` |
| `--sf-color-action-a20` | `color-mix(in oklab, var(--sf-color-action) 20%, transparent)` |
| `--sf-color-action-a30` | `color-mix(in oklab, var(--sf-color-action) 30%, transparent)` |
| `--sf-color-action-a40` | `color-mix(in oklab, var(--sf-color-action) 40%, transparent)` |
| `--sf-color-action-a5` | `color-mix(in oklab, var(--sf-color-action) 5%, transparent)` |
| `--sf-color-action-a50` | `color-mix(in oklab, var(--sf-color-action) 50%, transparent)` |
| `--sf-color-action-a60` | `color-mix(in oklab, var(--sf-color-action) 60%, transparent)` |
| `--sf-color-action-a70` | `color-mix(in oklab, var(--sf-color-action) 70%, transparent)` |
| `--sf-color-action-a80` | `color-mix(in oklab, var(--sf-color-action) 80%, transparent)` |
| `--sf-color-action-a90` | `color-mix(in oklab, var(--sf-color-action) 90%, transparent)` |
| `--sf-color-action-a95` | `color-mix(in oklab, var(--sf-color-action) 95%, transparent)` |
| `--sf-color-action-active` | `var(--sf-color-action-xdark)` |
| `--sf-color-action-darker` | `var(--sf-color-action-600)` |
| `--sf-color-action-ghost` | `var(--sf-color-action-a5)` |
| `--sf-color-action-hover` | `var(--sf-color-action-darker)` |
| `--sf-color-action-lighter` | `var(--sf-color-action-400)` |
| `--sf-color-action-muted` | `var(--sf-color-action-a30)` |
| `--sf-color-action-subtle` | `var(--sf-color-action-a10)` |
| `--sf-color-action-superdark` | `var(--sf-color-action-950)` |
| `--sf-color-action-superlight` | `var(--sf-color-action-50)` |
| `--sf-color-action-xdark` | `var(--sf-color-action-800)` |
| `--sf-color-action-xlight` | `var(--sf-color-action-200)` |
| `--sf-color-base-100` | `color-mix(in oklab, var(--sf-color-text) 8%, var(--sf-color-base))` |
| `--sf-color-base-200` | `color-mix(in oklab, var(--sf-color-text) 20%, var(--sf-color-base))` |
| `--sf-color-base-300` | `color-mix(in oklab, var(--sf-color-text) 40%, var(--sf-color-base))` |
| `--sf-color-base-400` | `color-mix(in oklab, var(--sf-color-text) 65%, var(--sf-color-base))` |
| `--sf-color-base-50` | `color-mix(in oklab, var(--sf-color-text) 4%, var(--sf-color-base))` |
| `--sf-color-base-500` | `var(--sf-color-base)` |
| `--sf-color-base-600` | `color-mix(in oklab, var(--sf-color-base) 82%, var(--sf-color-text))` |
| `--sf-color-base-700` | `color-mix(in oklab, var(--sf-color-base) 62%, var(--sf-color-text))` |
| `--sf-color-base-800` | `color-mix(in oklab, var(--sf-color-base) 38%, var(--sf-color-text))` |
| `--sf-color-base-900` | `color-mix(in oklab, var(--sf-color-base) 18%, var(--sf-color-text))` |
| `--sf-color-base-950` | `color-mix(in oklab, var(--sf-color-base) 8%, var(--sf-color-text))` |
| `--sf-color-base-a10` | `color-mix(in oklab, var(--sf-color-base) 10%, transparent)` |
| `--sf-color-base-a20` | `color-mix(in oklab, var(--sf-color-base) 20%, transparent)` |
| `--sf-color-base-a30` | `color-mix(in oklab, var(--sf-color-base) 30%, transparent)` |
| `--sf-color-base-a40` | `color-mix(in oklab, var(--sf-color-base) 40%, transparent)` |
| `--sf-color-base-a5` | `color-mix(in oklab, var(--sf-color-base) 5%, transparent)` |
| `--sf-color-base-a50` | `color-mix(in oklab, var(--sf-color-base) 50%, transparent)` |
| `--sf-color-base-a60` | `color-mix(in oklab, var(--sf-color-base) 60%, transparent)` |
| `--sf-color-base-a70` | `color-mix(in oklab, var(--sf-color-base) 70%, transparent)` |
| `--sf-color-base-a80` | `color-mix(in oklab, var(--sf-color-base) 80%, transparent)` |
| `--sf-color-base-a90` | `color-mix(in oklab, var(--sf-color-base) 90%, transparent)` |
| `--sf-color-base-a95` | `color-mix(in oklab, var(--sf-color-base) 95%, transparent)` |
| `--sf-color-base-active` | `var(--sf-color-base-xdark)` |
| `--sf-color-base-darker` | `var(--sf-color-base-600)` |
| `--sf-color-base-ghost` | `var(--sf-color-base-a5)` |
| `--sf-color-base-hover` | `var(--sf-color-base-darker)` |
| `--sf-color-base-lighter` | `var(--sf-color-base-400)` |
| `--sf-color-base-muted` | `var(--sf-color-base-a30)` |
| `--sf-color-base-subtle` | `var(--sf-color-base-a10)` |
| `--sf-color-base-superdark` | `var(--sf-color-base-950)` |
| `--sf-color-base-superlight` | `var(--sf-color-base-50)` |
| `--sf-color-base-xdark` | `var(--sf-color-base-800)` |
| `--sf-color-base-xlight` | `var(--sf-color-base-200)` |
| `--sf-color-neutral-100` | `color-mix(in oklab, var(--sf-color-neutral) 8%, var(--sf-color-base))` |
| `--sf-color-neutral-200` | `color-mix(in oklab, var(--sf-color-neutral) 20%, var(--sf-color-base))` |
| `--sf-color-neutral-300` | `color-mix(in oklab, var(--sf-color-neutral) 40%, var(--sf-color-base))` |
| `--sf-color-neutral-400` | `color-mix(in oklab, var(--sf-color-neutral) 65%, var(--sf-color-base))` |
| `--sf-color-neutral-50` | `color-mix(in oklab, var(--sf-color-neutral) 4%, var(--sf-color-base))` |
| `--sf-color-neutral-500` | `var(--sf-color-neutral)` |
| `--sf-color-neutral-600` | `color-mix(in oklab, var(--sf-color-neutral) 82%, var(--sf-color-text))` |
| `--sf-color-neutral-700` | `color-mix(in oklab, var(--sf-color-neutral) 62%, var(--sf-color-text))` |
| `--sf-color-neutral-800` | `color-mix(in oklab, var(--sf-color-neutral) 38%, var(--sf-color-text))` |
| `--sf-color-neutral-900` | `color-mix(in oklab, var(--sf-color-neutral) 18%, var(--sf-color-text))` |
| `--sf-color-neutral-950` | `color-mix(in oklab, var(--sf-color-neutral) 8%, var(--sf-color-text))` |
| `--sf-color-neutral-a10` | `color-mix(in oklab, var(--sf-color-neutral) 10%, transparent)` |
| `--sf-color-neutral-a20` | `color-mix(in oklab, var(--sf-color-neutral) 20%, transparent)` |
| `--sf-color-neutral-a30` | `color-mix(in oklab, var(--sf-color-neutral) 30%, transparent)` |
| `--sf-color-neutral-a40` | `color-mix(in oklab, var(--sf-color-neutral) 40%, transparent)` |
| `--sf-color-neutral-a5` | `color-mix(in oklab, var(--sf-color-neutral) 5%, transparent)` |
| `--sf-color-neutral-a50` | `color-mix(in oklab, var(--sf-color-neutral) 50%, transparent)` |
| `--sf-color-neutral-a60` | `color-mix(in oklab, var(--sf-color-neutral) 60%, transparent)` |
| `--sf-color-neutral-a70` | `color-mix(in oklab, var(--sf-color-neutral) 70%, transparent)` |
| `--sf-color-neutral-a80` | `color-mix(in oklab, var(--sf-color-neutral) 80%, transparent)` |
| `--sf-color-neutral-a90` | `color-mix(in oklab, var(--sf-color-neutral) 90%, transparent)` |
| `--sf-color-neutral-a95` | `color-mix(in oklab, var(--sf-color-neutral) 95%, transparent)` |
| `--sf-color-neutral-active` | `var(--sf-color-neutral-xdark)` |
| `--sf-color-neutral-darker` | `var(--sf-color-neutral-600)` |
| `--sf-color-neutral-ghost` | `var(--sf-color-neutral-a5)` |
| `--sf-color-neutral-hover` | `var(--sf-color-neutral-darker)` |
| `--sf-color-neutral-lighter` | `var(--sf-color-neutral-400)` |
| `--sf-color-neutral-muted` | `var(--sf-color-neutral-a30)` |
| `--sf-color-neutral-subtle` | `var(--sf-color-neutral-a10)` |
| `--sf-color-neutral-superdark` | `var(--sf-color-neutral-950)` |
| `--sf-color-neutral-superlight` | `var(--sf-color-neutral-50)` |
| `--sf-color-neutral-xdark` | `var(--sf-color-neutral-800)` |
| `--sf-color-neutral-xlight` | `var(--sf-color-neutral-200)` |
| `--sf-color-primary-100` | `color-mix(in oklab, var(--sf-color-primary) 8%, var(--sf-color-base))` |
| `--sf-color-primary-200` | `color-mix(in oklab, var(--sf-color-primary) 20%, var(--sf-color-base))` |
| `--sf-color-primary-300` | `color-mix(in oklab, var(--sf-color-primary) 40%, var(--sf-color-base))` |
| `--sf-color-primary-400` | `color-mix(in oklab, var(--sf-color-primary) 65%, var(--sf-color-base))` |
| `--sf-color-primary-50` | `color-mix(in oklab, var(--sf-color-primary) 4%, var(--sf-color-base))` |
| `--sf-color-primary-500` | `var(--sf-color-primary)` |
| `--sf-color-primary-600` | `color-mix(in oklab, var(--sf-color-primary) 82%, var(--sf-color-text))` |
| `--sf-color-primary-700` | `color-mix(in oklab, var(--sf-color-primary) 62%, var(--sf-color-text))` |
| `--sf-color-primary-800` | `color-mix(in oklab, var(--sf-color-primary) 38%, var(--sf-color-text))` |
| `--sf-color-primary-900` | `color-mix(in oklab, var(--sf-color-primary) 18%, var(--sf-color-text))` |
| `--sf-color-primary-950` | `color-mix(in oklab, var(--sf-color-primary) 8%, var(--sf-color-text))` |
| `--sf-color-primary-a10` | `color-mix(in oklab, var(--sf-color-primary) 10%, transparent)` |
| `--sf-color-primary-a20` | `color-mix(in oklab, var(--sf-color-primary) 20%, transparent)` |
| `--sf-color-primary-a30` | `color-mix(in oklab, var(--sf-color-primary) 30%, transparent)` |
| `--sf-color-primary-a40` | `color-mix(in oklab, var(--sf-color-primary) 40%, transparent)` |
| `--sf-color-primary-a5` | `color-mix(in oklab, var(--sf-color-primary) 5%, transparent)` |
| `--sf-color-primary-a50` | `color-mix(in oklab, var(--sf-color-primary) 50%, transparent)` |
| `--sf-color-primary-a60` | `color-mix(in oklab, var(--sf-color-primary) 60%, transparent)` |
| `--sf-color-primary-a70` | `color-mix(in oklab, var(--sf-color-primary) 70%, transparent)` |
| `--sf-color-primary-a80` | `color-mix(in oklab, var(--sf-color-primary) 80%, transparent)` |
| `--sf-color-primary-a90` | `color-mix(in oklab, var(--sf-color-primary) 90%, transparent)` |
| `--sf-color-primary-a95` | `color-mix(in oklab, var(--sf-color-primary) 95%, transparent)` |
| `--sf-color-primary-active` | `var(--sf-color-primary-xdark)` |
| `--sf-color-primary-darker` | `var(--sf-color-primary-600)` |
| `--sf-color-primary-ghost` | `var(--sf-color-primary-a5)` |
| `--sf-color-primary-hover` | `var(--sf-color-primary-darker)` |
| `--sf-color-primary-lighter` | `var(--sf-color-primary-400)` |
| `--sf-color-primary-muted` | `var(--sf-color-primary-a30)` |
| `--sf-color-primary-subtle` | `var(--sf-color-primary-a10)` |
| `--sf-color-primary-superdark` | `var(--sf-color-primary-950)` |
| `--sf-color-primary-superlight` | `var(--sf-color-primary-50)` |
| `--sf-color-primary-xdark` | `var(--sf-color-primary-800)` |
| `--sf-color-primary-xlight` | `var(--sf-color-primary-200)` |
| `--sf-color-secondary-100` | `color-mix(in oklab, var(--sf-color-secondary) 8%, var(--sf-color-base))` |
| `--sf-color-secondary-200` | `color-mix(in oklab, var(--sf-color-secondary) 20%, var(--sf-color-base))` |
| `--sf-color-secondary-300` | `color-mix(in oklab, var(--sf-color-secondary) 40%, var(--sf-color-base))` |
| `--sf-color-secondary-400` | `color-mix(in oklab, var(--sf-color-secondary) 65%, var(--sf-color-base))` |
| `--sf-color-secondary-50` | `color-mix(in oklab, var(--sf-color-secondary) 4%, var(--sf-color-base))` |
| `--sf-color-secondary-500` | `var(--sf-color-secondary)` |
| `--sf-color-secondary-600` | `color-mix(in oklab, var(--sf-color-secondary) 82%, var(--sf-color-text))` |
| `--sf-color-secondary-700` | `color-mix(in oklab, var(--sf-color-secondary) 62%, var(--sf-color-text))` |
| `--sf-color-secondary-800` | `color-mix(in oklab, var(--sf-color-secondary) 38%, var(--sf-color-text))` |
| `--sf-color-secondary-900` | `color-mix(in oklab, var(--sf-color-secondary) 18%, var(--sf-color-text))` |
| `--sf-color-secondary-950` | `color-mix(in oklab, var(--sf-color-secondary) 8%, var(--sf-color-text))` |
| `--sf-color-secondary-a10` | `color-mix(in oklab, var(--sf-color-secondary) 10%, transparent)` |
| `--sf-color-secondary-a20` | `color-mix(in oklab, var(--sf-color-secondary) 20%, transparent)` |
| `--sf-color-secondary-a30` | `color-mix(in oklab, var(--sf-color-secondary) 30%, transparent)` |
| `--sf-color-secondary-a40` | `color-mix(in oklab, var(--sf-color-secondary) 40%, transparent)` |
| `--sf-color-secondary-a5` | `color-mix(in oklab, var(--sf-color-secondary) 5%, transparent)` |
| `--sf-color-secondary-a50` | `color-mix(in oklab, var(--sf-color-secondary) 50%, transparent)` |
| `--sf-color-secondary-a60` | `color-mix(in oklab, var(--sf-color-secondary) 60%, transparent)` |
| `--sf-color-secondary-a70` | `color-mix(in oklab, var(--sf-color-secondary) 70%, transparent)` |
| `--sf-color-secondary-a80` | `color-mix(in oklab, var(--sf-color-secondary) 80%, transparent)` |
| `--sf-color-secondary-a90` | `color-mix(in oklab, var(--sf-color-secondary) 90%, transparent)` |
| `--sf-color-secondary-a95` | `color-mix(in oklab, var(--sf-color-secondary) 95%, transparent)` |
| `--sf-color-secondary-active` | `var(--sf-color-secondary-xdark)` |
| `--sf-color-secondary-darker` | `var(--sf-color-secondary-600)` |
| `--sf-color-secondary-ghost` | `var(--sf-color-secondary-a5)` |
| `--sf-color-secondary-hover` | `var(--sf-color-secondary-darker)` |
| `--sf-color-secondary-lighter` | `var(--sf-color-secondary-400)` |
| `--sf-color-secondary-muted` | `var(--sf-color-secondary-a30)` |
| `--sf-color-secondary-subtle` | `var(--sf-color-secondary-a10)` |
| `--sf-color-secondary-superdark` | `var(--sf-color-secondary-950)` |
| `--sf-color-secondary-superlight` | `var(--sf-color-secondary-50)` |
| `--sf-color-secondary-xdark` | `var(--sf-color-secondary-800)` |
| `--sf-color-secondary-xlight` | `var(--sf-color-secondary-200)` |
| `--sf-color-tertiary-100` | `color-mix(in oklab, var(--sf-color-tertiary) 8%, var(--sf-color-base))` |
| `--sf-color-tertiary-200` | `color-mix(in oklab, var(--sf-color-tertiary) 20%, var(--sf-color-base))` |
| `--sf-color-tertiary-300` | `color-mix(in oklab, var(--sf-color-tertiary) 40%, var(--sf-color-base))` |
| `--sf-color-tertiary-400` | `color-mix(in oklab, var(--sf-color-tertiary) 65%, var(--sf-color-base))` |
| `--sf-color-tertiary-50` | `color-mix(in oklab, var(--sf-color-tertiary) 4%, var(--sf-color-base))` |
| `--sf-color-tertiary-500` | `var(--sf-color-tertiary)` |
| `--sf-color-tertiary-600` | `color-mix(in oklab, var(--sf-color-tertiary) 82%, var(--sf-color-text))` |
| `--sf-color-tertiary-700` | `color-mix(in oklab, var(--sf-color-tertiary) 62%, var(--sf-color-text))` |
| `--sf-color-tertiary-800` | `color-mix(in oklab, var(--sf-color-tertiary) 38%, var(--sf-color-text))` |
| `--sf-color-tertiary-900` | `color-mix(in oklab, var(--sf-color-tertiary) 18%, var(--sf-color-text))` |
| `--sf-color-tertiary-950` | `color-mix(in oklab, var(--sf-color-tertiary) 8%, var(--sf-color-text))` |
| `--sf-color-tertiary-a10` | `color-mix(in oklab, var(--sf-color-tertiary) 10%, transparent)` |
| `--sf-color-tertiary-a20` | `color-mix(in oklab, var(--sf-color-tertiary) 20%, transparent)` |
| `--sf-color-tertiary-a30` | `color-mix(in oklab, var(--sf-color-tertiary) 30%, transparent)` |
| `--sf-color-tertiary-a40` | `color-mix(in oklab, var(--sf-color-tertiary) 40%, transparent)` |
| `--sf-color-tertiary-a5` | `color-mix(in oklab, var(--sf-color-tertiary) 5%, transparent)` |
| `--sf-color-tertiary-a50` | `color-mix(in oklab, var(--sf-color-tertiary) 50%, transparent)` |
| `--sf-color-tertiary-a60` | `color-mix(in oklab, var(--sf-color-tertiary) 60%, transparent)` |
| `--sf-color-tertiary-a70` | `color-mix(in oklab, var(--sf-color-tertiary) 70%, transparent)` |
| `--sf-color-tertiary-a80` | `color-mix(in oklab, var(--sf-color-tertiary) 80%, transparent)` |
| `--sf-color-tertiary-a90` | `color-mix(in oklab, var(--sf-color-tertiary) 90%, transparent)` |
| `--sf-color-tertiary-a95` | `color-mix(in oklab, var(--sf-color-tertiary) 95%, transparent)` |
| `--sf-color-tertiary-active` | `var(--sf-color-tertiary-xdark)` |
| `--sf-color-tertiary-darker` | `var(--sf-color-tertiary-600)` |
| `--sf-color-tertiary-ghost` | `var(--sf-color-tertiary-a5)` |
| `--sf-color-tertiary-hover` | `var(--sf-color-tertiary-darker)` |
| `--sf-color-tertiary-lighter` | `var(--sf-color-tertiary-400)` |
| `--sf-color-tertiary-muted` | `var(--sf-color-tertiary-a30)` |
| `--sf-color-tertiary-subtle` | `var(--sf-color-tertiary-a10)` |
| `--sf-color-tertiary-superdark` | `var(--sf-color-tertiary-950)` |
| `--sf-color-tertiary-superlight` | `var(--sf-color-tertiary-50)` |
| `--sf-color-tertiary-xdark` | `var(--sf-color-tertiary-800)` |
| `--sf-color-tertiary-xlight` | `var(--sf-color-tertiary-200)` |

## Component tokens (`optional/tokens.components.css`)

0 tokens.

| Token | Default |
|---|---|

