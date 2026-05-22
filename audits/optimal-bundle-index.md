# SLASHED Optimal Bundle — Complete Index & Inventory

> **Bundle:** `dist/slashed.optimal.css`
> **Date:** 2026-05-22
> **Scope:** Full inventory of every token, class, alias, keyframe, and cascade relationship in the optimal bundle.

---

## Table of Contents

1. [Bundle Composition & Layer Order](#1-bundle-composition--layer-order)
2. [Token Inventory — core/tokens.css](#2-token-inventory--coretokenscss)
3. [Token Inventory — core/tokens.layout.css](#3-token-inventory--coretokenslayoutcss)
4. [Token Inventory — optional/tokens.palette.css](#4-token-inventory--optionaltokenspalettecss)
5. [Class Inventory — All Layers](#5-class-inventory--all-layers)
6. [Keyframes Inventory](#6-keyframes-inventory)
7. [Alias & Indirection Map](#7-alias--indirection-map)
8. [Redundancy & Overlap Analysis](#8-redundancy--overlap-analysis)
9. [Token Consumption Map](#9-token-consumption-map)
10. [Summary Statistics](#10-summary-statistics)

---

## 1. Bundle Composition & Layer Order

### Files included (load order):


| # | File | Layer | Role |
|---|------|-------|------|
| 1 | `core/layers.css` | (declaration) | Establishes cascade layer order |
| 2 | `core/tokens.css` | `slashed.tokens` | Design tokens: color, type, space, radius, shadow, motion, z-index |
| 3 | `core/tokens.layout.css` | `slashed.tokens` | Layout-primitive tokens (gaps, padding, min-widths) |
| 4 | `core/reset.css` | `slashed.reset` | Global reset (box-sizing, list-style, media) |
| 5 | `core/base.css` | `slashed.base` | Element-level typography & link styling |
| 6 | `core/themes.css` | `slashed.themes` | Dark/light mode switching via `[data-theme]` |
| 7 | `core/layout.css` | `slashed.layout` | Layout primitives (stack, grid, cluster, etc.) |
| 8 | `core/states.css` | `slashed.states` | Stateful `.is-*` classes |
| 9 | `core/motion.css` | `slashed.motion` | Transitions, keyframes, animation classes |
| 10 | `core/accessibility.css` | `slashed.accessibility` | Focus, reduced-motion, SR-only, skip-link |
| 11 | `core/print.css` | `slashed.print` | Print styles & `@page` |
| 12 | `optional/tokens.palette.css` | `slashed.tokens` | Numeric/alpha/alias palette scales per brand color |
| 13 | `optional/forms.css` | `slashed.forms` | Classless form element styling |
| 14 | `optional/legacy.css` | `slashed.legacy` | Fallbacks for dvh, :focus-visible, scrollbar-gutter |

### Layer cascade order (top = lowest priority):
```
slashed.tokens
slashed.reset
slashed.base
slashed.forms
slashed.layout
slashed.components    (empty in optimal)
slashed.utilities     (not in optimal)
slashed.states
slashed.themes
slashed.motion
slashed.accessibility
slashed.print
slashed.legacy
slashed.overrides     (consumer layer, not shipped)
```

---


## 2. Token Inventory — core/tokens.css

### 2.1 @property Registered Tokens (animatable, source-of-truth)

| Token | Syntax | Initial Value |
|-------|--------|---------------|
| `--sf-color-primary-light` | `<color>` | `oklch(0.45 0.20 264)` |
| `--sf-color-secondary-light` | `<color>` | `oklch(0.25 0.03 260)` |
| `--sf-color-tertiary-light` | `<color>` | `oklch(0.48 0.14 310)` |
| `--sf-color-action-light` | `<color>` | `oklch(0.60 0.16 210)` |
| `--sf-color-neutral-light` | `<color>` | `oklch(0.45 0.02 260)` |
| `--sf-color-base-light` | `<color>` | `oklch(0.98 0.005 260)` |
| `--sf-color-success-light` | `<color>` | `oklch(0.48 0.17 150)` |
| `--sf-color-warning-light` | `<color>` | `oklch(0.75 0.17 80)` |
| `--sf-color-error-light` | `<color>` | `oklch(0.62 0.20 35)` |
| `--sf-color-info-light` | `<color>` | `oklch(0.48 0.15 240)` |
| `--sf-color-danger-light` | `<color>` | `oklch(0.48 0.24 12)` |
| `--sf-is-dark` | `<integer>` | `0` |

**Total @property: 12**


### 2.2 Color Tokens — Resolved Semantic (light-dark())

| Token | Derivation |
|-------|-----------|
| `--sf-color-primary` | light-dark(primary-light, primary-dark OR auto-derived) |
| `--sf-color-secondary` | light-dark(secondary-light, secondary-dark OR auto-derived) |
| `--sf-color-tertiary` | light-dark(tertiary-light, tertiary-dark OR auto-derived) |
| `--sf-color-action` | light-dark(action-light, action-dark OR auto-derived) |
| `--sf-color-neutral` | light-dark(neutral-light, neutral-dark OR auto-derived) |
| `--sf-color-base` | light-dark(base-light, base-dark OR auto-derived) |
| `--sf-color-success` | light-dark(success-light, success-dark OR auto-derived) |
| `--sf-color-warning` | light-dark(warning-light, warning-dark OR auto-derived) |
| `--sf-color-error` | light-dark(error-light, error-dark OR auto-derived) |
| `--sf-color-info` | light-dark(info-light, info-dark OR auto-derived) |
| `--sf-color-danger` | light-dark(danger-light, danger-dark OR auto-derived) |

**Total: 11**

### 2.3 Surface Tokens

| Token | Derived From |
|-------|-------------|
| `--sf-color-bg` | oklch(from base calc(l + 0.02) c h) |
| `--sf-color-surface` | = --sf-color-base (alias) |
| `--sf-color-well` | oklch(from base calc(l - 0.02) c h) |
| `--sf-color-raised` | oklch(from base calc(l + 0.04) c h) |
| `--sf-color-overlay` | oklch(from base l c h / 0.9) |
| `--sf-color-inverse` | oklch(from base calc(1 - l) c h) |

**Total: 6**


### 2.4 Text Color Tokens

| Token | Notes |
|-------|-------|
| `--sf-color-text` | Primary reading text |
| `--sf-color-text--secondary` | De-emphasized text |
| `--sf-color-text--muted` | = --sf-color-neutral (alias) |
| `--sf-color-text--placeholder` | Input placeholder |
| `--sf-color-text--disabled` | Disabled element text |
| `--sf-color-text--inverse` | Inverted text |
| `--sf-color-heading` | Heading text (same formula as --sf-color-text) |
| `--sf-color-code-text` | Auto-contrasts with code-bg |

**Total: 8**

### 2.5 Text-on-Color Tokens

| Token |
|-------|
| `--sf-color-text--on-primary` |
| `--sf-color-text--on-secondary` |
| `--sf-color-text--on-tertiary` |
| `--sf-color-text--on-action` |
| `--sf-color-text--on-neutral` |
| `--sf-color-text--on-base` |
| `--sf-color-text--on-inverse` |
| `--sf-color-text--on-success` |
| `--sf-color-text--on-warning` |
| `--sf-color-text--on-error` |
| `--sf-color-text--on-info` |
| `--sf-color-text--on-danger` |

**Total: 12**

### 2.6 Border Color Tokens

| Token | Notes |
|-------|-------|
| `--sf-color-border` | Default border |
| `--sf-color-border--subtle` | Lighter border |
| `--sf-color-border--strong` | Heavier border |
| `--sf-color-border--focus` | = --sf-color-action (alias) |
| `--sf-color-border--disabled` | Semi-transparent subtle border |
| `--sf-color-border--translucent` | 15% alpha neutral |

**Total: 6**


### 2.7 Link Color Tokens

| Token |
|-------|
| `--sf-color-link` |
| `--sf-color-link--hover` |
| `--sf-color-link--active` |
| `--sf-color-link--visited` |
| `--sf-color-link--underline` |
| `--sf-color-link--disabled` |

**Total: 6**

### 2.8 Interactive State Tokens (bg)

| Token | Notes |
|-------|-------|
| `--sf-color-bg--hover` | 8% alpha neutral |
| `--sf-color-bg--active` | 12% alpha neutral |
| `--sf-color-bg--selected` | 10% alpha action |
| `--sf-color-bg--focus` | 6% alpha action |
| `--sf-color-bg--disabled` | = --sf-color-well (alias) |
| `--sf-color-code-bg` | = --sf-color-well (alias) |

**Total: 6**

### 2.9 Selection & Miscellaneous Color Tokens

| Token |
|-------|
| `--sf-color-selection-bg` |
| `--sf-color-selection-text` |
| `--sf-color-mark-bg` |
| `--sf-color-mark-text` |
| `--sf-color-dim` |
| `--sf-scrollbar-thumb` |
| `--sf-scrollbar-track` |
| `--sf-color-scheme` |

**Total: 8**


### 2.10 Status Triplet Tokens

| Color | Tokens |
|-------|--------|
| success | `--sf-color-success-subtle`, `--sf-color-success-strong`, `--sf-color-success-muted` |
| warning | `--sf-color-warning-subtle`, `--sf-color-warning-strong`, `--sf-color-warning-muted` |
| error | `--sf-color-error-subtle`, `--sf-color-error-strong`, `--sf-color-error-muted` |
| info | `--sf-color-info-subtle`, `--sf-color-info-strong`, `--sf-color-info-muted` |
| danger | `--sf-color-danger-subtle`, `--sf-color-danger-strong`, `--sf-color-danger-muted` |

**Total: 15**

### 2.11 Gradient Tokens

| Token |
|-------|
| `--sf-gradient-primary` |
| `--sf-gradient-secondary` |
| `--sf-gradient-tertiary` |
| `--sf-gradient-brand` |
| `--sf-gradient-surface` |
| `--sf-gradient-fade--r` |
| `--sf-gradient-fade--l` |
| `--sf-gradient-fade--t` |
| `--sf-gradient-fade--b` |

**Total: 9**

### 2.12 Shadow Tokens

| Token |
|-------|
| `--sf-shadow-strength` |
| `--sf-shadow-glow-color` |
| `--sf-shadow-glow` |
| `--sf-shadow-color` |
| `--sf-shadow-none` |
| `--sf-shadow-xs` |
| `--sf-shadow-s` |
| `--sf-shadow-m` |
| `--sf-shadow-l` |
| `--sf-shadow-xl` |
| `--sf-shadow-2xl` |
| `--sf-shadow-inner` |
| `--sf-text-shadow-none` |
| `--sf-text-shadow-s` |
| `--sf-text-shadow-m` |
| `--sf-text-shadow-l` |
| `--sf-drop-shadow-s` |
| `--sf-drop-shadow-m` |
| `--sf-drop-shadow-l` |
| `--sf-opacity-disabled` |

**Total: 20**


### 2.13 Font Family Tokens

| Token | Value |
|-------|-------|
| `--sf-font-body` | system-ui, -apple-system, sans-serif |
| `--sf-font-heading` | var(--sf-font-body) |
| `--sf-font-display` | var(--sf-font-heading) |
| `--sf-font-mono` | ui-monospace, monospace |
| `--sf-font-humanist` | "Seravek", "Gill Sans Nova", ... |
| `--sf-font-geometric` | "Avenir", "Montserrat", ... |
| `--sf-font-slab` | "Rockwell", "Rockwell Nova", ... |
| `--sf-font-features` | normal |
| `--sf-font-variation` | normal |
| `--sf-optical-sizing` | auto |

**Total: 10**

### 2.14 Font Weight Tokens

| Token | Value |
|-------|-------|
| `--sf-font-weight-thin` | 100 |
| `--sf-font-weight-extralight` | 200 |
| `--sf-font-weight-light` | 300 |
| `--sf-font-weight-normal` | 400 |
| `--sf-font-weight-medium` | 500 |
| `--sf-font-weight-semibold` | 600 |
| `--sf-font-weight-bold` | 700 |
| `--sf-font-weight-extrabold` | 800 |
| `--sf-font-weight-black` | 900 |
| `--sf-font-weight-body` | var(--sf-font-weight-normal) — ALIAS |
| `--sf-font-weight-heading` | var(--sf-font-weight-semibold) — ALIAS |
| `--sf-font-weight-display` | var(--sf-font-weight-bold) — ALIAS |
| `--sf-current-font-weight` | var(--sf-font-weight-bold) — ALIAS |

**Total: 13**


### 2.15 Font Size Tokens (fluid clamp)

| Token | Range |
|-------|-------|
| `--sf-text-2xs` | 0.51rem → 0.53rem |
| `--sf-text-xs` | 0.64rem → 0.7rem |
| `--sf-text-s` | 0.8rem → 0.94rem |
| `--sf-text-m` | 1rem → 1.25rem |
| `--sf-text-l` | 1.25rem → 1.67rem |
| `--sf-text-xl` | 1.56rem → 2.22rem |
| `--sf-text-2xl` | 1.95rem → 2.96rem |
| `--sf-text-3xl` | 2.44rem → 3.95rem |
| `--sf-text-4xl` | 3.05rem → 5.26rem |
| `--sf-text-display-s` | 2.4rem → 3rem |
| `--sf-text-display-m` | 3rem → 4rem |
| `--sf-text-display-l` | 3.75rem → 5.33rem |

**Total: 12**

### 2.16 Line Height & Letter Spacing Tokens

| Token | Value |
|-------|-------|
| `--sf-leading-tight` | 1.1 |
| `--sf-leading-snug` | 1.3 |
| `--sf-leading-normal` | 1.5 |
| `--sf-leading-relaxed` | 1.625 |
| `--sf-tracking-tight` | -0.025em |
| `--sf-tracking-normal` | 0 |
| `--sf-tracking-wide` | 0.025em |
| `--sf-tracking-wider` | 0.05em |
| `--sf-tracking-widest` | 0.1em |

**Total: 9**

### 2.17 Icon Size Tokens

| Token | Value |
|-------|-------|
| `--sf-icon-xs` | 0.875em |
| `--sf-icon-s` | 1em |
| `--sf-icon-m` | 1.5em |
| `--sf-icon-l` | 2em |
| `--sf-icon-xl` | 3em |

**Total: 5**


### 2.18 Spacing Tokens (fluid)

| Token | Range |
|-------|-------|
| `--sf-space-none` | 0 |
| `--sf-space-px` | 1px |
| `--sf-space-gutter` | var(--sf-space-l) — ALIAS |
| `--sf-space-2xs` | 0.51rem → 0.84rem |
| `--sf-space-xs` | 0.64rem → 1.13rem |
| `--sf-space-s` | 0.8rem → 1.5rem |
| `--sf-space-m` | 1rem → 2rem |
| `--sf-space-l` | 1.25rem → 2.67rem |
| `--sf-space-xl` | 1.56rem → 3.55rem |
| `--sf-space-2xl` | 1.95rem → 4.74rem |
| `--sf-space-3xl` | 2.44rem → 6.31rem |
| `--sf-space-4xl` | 3.05rem → 8.42rem |

**Total: 12**

### 2.19 Scale Multipliers

| Token | Default |
|-------|---------|
| `--sf-space-scale` | 1 |
| `--sf-text-scale` | 1 |
| `--sf-text-display-scale` | 1 |
| `--sf-radius-scale` | 1 |
| `--sf-motion-scale` | 1 |

**Total: 5**

### 2.20 UI Size Tokens

| Token | Value |
|-------|-------|
| `--sf-size-xs` | 1.5rem |
| `--sf-size-s` | 2rem |
| `--sf-size-m` | 2.5rem |
| `--sf-size-l` | 2.75rem |
| `--sf-size-xl` | 3.5rem |

**Total: 5**

### 2.21 Container Tokens

| Token | Value |
|-------|-------|
| `--sf-container-narrow` | 38rem |
| `--sf-container-prose` | 65ch |
| `--sf-container-default` | 75rem |
| `--sf-container-wide` | 90rem |
| `--sf-container-full` | 100% |

**Total: 5**


### 2.22 Aspect Ratio Tokens

| Token | Value |
|-------|-------|
| `--sf-ratio-square` | 1 |
| `--sf-ratio-video` | 16 / 9 |
| `--sf-ratio-cinema` | 21 / 9 |
| `--sf-ratio-photo` | 3 / 2 |
| `--sf-ratio-portrait` | 3 / 4 |
| `--sf-ratio-golden` | 1.618 / 1 |

**Total: 6**

### 2.23 Border Width & Divider Tokens

| Token | Value |
|-------|-------|
| `--sf-border-width-hairline` | 0.5px |
| `--sf-border-width-1` | 1px |
| `--sf-border-width-2` | 2px |
| `--sf-border-width-3` | 3px |
| `--sf-border-width-4` | 4px |
| `--sf-divider-width` | var(--sf-border-width-1) |
| `--sf-divider-style` | solid |
| `--sf-divider-color` | var(--sf-color-border) |

**Total: 8**

### 2.24 Border Radius Tokens

| Token | Value |
|-------|-------|
| `--sf-radius-none` | 0 |
| `--sf-radius-xs` | calc(2px * scale) |
| `--sf-radius-s` | calc(4px * scale) |
| `--sf-radius-m` | calc(8px * scale) |
| `--sf-radius-l` | calc(12px * scale) |
| `--sf-radius-xl` | calc(16px * scale) |
| `--sf-radius-2xl` | calc(24px * scale) |
| `--sf-radius-3xl` | calc(32px * scale) |
| `--sf-radius-4xl` | calc(48px * scale) |
| `--sf-radius-full` | 9999px |

**Total: 10**


### 2.25 Blur, Perspective & Opacity Tokens

| Token | Value |
|-------|-------|
| `--sf-blur-xs` | 4px |
| `--sf-blur-s` | 8px |
| `--sf-blur-m` | 16px |
| `--sf-blur-l` | 32px |
| `--sf-blur-xl` | 48px |
| `--sf-perspective-near` | 500px |
| `--sf-perspective-normal` | 1000px |
| `--sf-perspective-far` | 2000px |
| `--sf-opacity-0` | 0 |
| `--sf-opacity-10` | 0.1 |
| `--sf-opacity-25` | 0.25 |
| `--sf-opacity-50` | 0.5 |
| `--sf-opacity-75` | 0.75 |
| `--sf-opacity-100` | 1 |

**Total: 14**

### 2.26 Duration & Easing Tokens

| Token | Value |
|-------|-------|
| `--sf-duration-none` | 0ms |
| `--sf-duration-instant` | calc(100ms * motion-scale) |
| `--sf-duration-fast` | calc(150ms * motion-scale) |
| `--sf-duration-normal` | calc(250ms * motion-scale) |
| `--sf-duration-slow` | calc(400ms * motion-scale) |
| `--sf-duration-slower` | calc(600ms * motion-scale) |
| `--sf-ease-linear` | linear |
| `--sf-ease-out` | cubic-bezier(0.25, 0, 0.15, 1) |
| `--sf-ease-in` | cubic-bezier(0.5, 0, 0.75, 0.25) |
| `--sf-ease-in-out` | cubic-bezier(0.4, 0, 0.2, 1) |
| `--sf-ease-spring` | linear(...) |
| `--sf-ease-elastic` | linear(...) |
| `--sf-ease-bounce` | linear(...) |
| `--sf-ease-overshoot` | linear(...) |

**Total: 14**


### 2.27 Animation Preset Tokens

| Token | Keyframe + Duration + Easing |
|-------|------------------------------|
| `--sf-animation-fade-in` | sf-fade-in / normal / ease-out |
| `--sf-animation-fade-out` | sf-fade-out / normal / ease-in |
| `--sf-animation-slide-in-up` | sf-slide-in-up / normal / ease-out |
| `--sf-animation-slide-in-down` | sf-slide-in-down / normal / ease-out |
| `--sf-animation-slide-in-left` | sf-slide-in-left / normal / ease-out |
| `--sf-animation-slide-in-right` | sf-slide-in-right / normal / ease-out |
| `--sf-animation-scale-up` | sf-scale-up / normal / ease-overshoot |
| `--sf-animation-scale-down` | sf-scale-down / normal / ease-in |
| `--sf-animation-color-pulse` | sf-color-pulse / slow / ease-in-out / infinite |
| `--sf-animation-ping` | sf-ping / slow / ease-out / infinite |
| `--sf-animation-blink` | sf-blink / 1s / steps(1,end) / infinite |
| `--sf-animation-float` | sf-float / 3s×scale / ease-in-out / infinite |
| `--sf-animation-delay-1` | 75ms × motion-scale |
| `--sf-animation-delay-2` | 150ms × motion-scale |
| `--sf-animation-delay-3` | 225ms × motion-scale |
| `--sf-animation-delay-4` | 300ms × motion-scale |
| `--sf-animation-delay-5` | 375ms × motion-scale |

**Total: 17**

### 2.28 Scroll & Mask Tokens

| Token | Value |
|-------|-------|
| `--sf-scroll-timeline-range-start` | 0% |
| `--sf-scroll-timeline-range-end` | 100% |
| `--sf-mask-scrim-start` | var(--sf-space-l) |
| `--sf-mask-scrim-end` | var(--sf-space-l) |

**Total: 4**

### 2.29 Z-Index Tokens

| Token | Value |
|-------|-------|
| `--sf-z-below` | -1 |
| `--sf-z-base` | 0 |
| `--sf-z-raised` | 1 |
| `--sf-z-low` | 10 |
| `--sf-z-mid` | 100 |
| `--sf-z-high` | 500 |
| `--sf-z-top` | 900 |
| `--sf-z-max` | 9999 |

**Total: 8**


### 2.30 Layout & Accessibility Tokens

| Token | Value |
|-------|-------|
| `--sf-header-height` | 8rem |
| `--sf-sticky-offset` | var(--sf-header-height) |
| `--sf-focus-ring-width` | 2px |
| `--sf-focus-ring-offset` | 2px |
| `--sf-focus-ring-style` | solid |
| `--sf-touch-target` | var(--sf-size-l) |
| `--sf-contrast-bias` | 0 |
| `--sf-safe-top` | env(safe-area-inset-top, 0px) |
| `--sf-safe-bottom` | env(safe-area-inset-bottom, 0px) |
| `--sf-safe-left` | env(safe-area-inset-left, 0px) |
| `--sf-safe-right` | env(safe-area-inset-right, 0px) |

**Total: 11**

### 2.31 Print Tokens

| Token | Value |
|-------|-------|
| `--sf-print-page-margin` | 2cm |
| `--sf-print-page-size` | a4 |
| `--sf-print-base-size` | 11pt |

**Total: 3**

### 2.32 Stroke Tokens

| Token | Value |
|-------|-------|
| `--sf-stroke-thin` | 1px |
| `--sf-stroke-regular` | 1.5px |
| `--sf-stroke-bold` | 2px |
| `--sf-stroke-heavy` | 3px |

**Total: 4**

### 2.33 Typography Alias Tokens

| Token | Points To |
|-------|-----------|
| `--sf-body-font-size` | var(--sf-text-m) |
| `--sf-body-line-height` | var(--sf-leading-normal) |
| `--sf-body-font-weight` | var(--sf-font-weight-body) |
| `--sf-body-font-family` | var(--sf-font-body) |
| `--sf-body-color` | var(--sf-color-text) |
| `--sf-body-text-wrap` | pretty |
| `--sf-body-strong-weight` | var(--sf-font-weight-bold) |
| `--sf-body-em-style` | italic |
| `--sf-heading-font-family` | var(--sf-font-heading) |
| `--sf-heading-color` | var(--sf-color-heading) |
| `--sf-heading-text-wrap` | balance |

**Total: 11**


### 2.34 Heading Size Alias Tokens (h1–h6)

| Token | Points To |
|-------|-----------|
| `--sf-h1-size` | var(--sf-text-4xl) |
| `--sf-h1-line-height` | var(--sf-leading-tight) |
| `--sf-h1-font-weight` | var(--sf-font-weight-heading) |
| `--sf-h1-letter-spacing` | var(--sf-tracking-tight) |
| `--sf-h2-size` | var(--sf-text-3xl) |
| `--sf-h2-line-height` | var(--sf-leading-tight) |
| `--sf-h2-font-weight` | var(--sf-font-weight-heading) |
| `--sf-h2-letter-spacing` | var(--sf-tracking-tight) |
| `--sf-h3-size` | var(--sf-text-2xl) |
| `--sf-h3-line-height` | var(--sf-leading-snug) |
| `--sf-h3-font-weight` | var(--sf-font-weight-heading) |
| `--sf-h3-letter-spacing` | var(--sf-tracking-normal) |
| `--sf-h4-size` | var(--sf-text-xl) |
| `--sf-h4-line-height` | var(--sf-leading-snug) |
| `--sf-h4-font-weight` | var(--sf-font-weight-heading) |
| `--sf-h4-letter-spacing` | var(--sf-tracking-normal) |
| `--sf-h5-size` | var(--sf-text-l) |
| `--sf-h5-line-height` | var(--sf-leading-normal) |
| `--sf-h5-font-weight` | var(--sf-font-weight-heading) |
| `--sf-h5-letter-spacing` | var(--sf-tracking-normal) |
| `--sf-h6-size` | var(--sf-text-m) |
| `--sf-h6-line-height` | var(--sf-leading-normal) |
| `--sf-h6-font-weight` | var(--sf-font-weight-heading) |
| `--sf-h6-letter-spacing` | var(--sf-tracking-wide) |

**Total: 24**

### 2.35 Spacing Alias & Section Tokens

| Token | Points To |
|-------|-----------|
| `--sf-gap` | var(--sf-space-m) |
| `--sf-content-gap` | var(--sf-space-s) |
| `--sf-component-pad` | var(--sf-space-m) |
| `--sf-field-block` | var(--sf-space-l) |
| `--sf-section-pad` | var(--sf-section-pad--m) — ALIAS |
| `--sf-section-pad--s` | var(--sf-space-2xl) |
| `--sf-section-pad--m` | var(--sf-space-3xl) |
| `--sf-section-pad--l` | var(--sf-space-4xl) |
| `--sf-section-pad--xl` | calc(var(--sf-space-4xl) * 1.5) |

**Total: 9**


### 2.36 Transition Shorthand Tokens

| Token | Value | Notes |
|-------|-------|-------|
| `--sf-transition-all` | all duration-normal ease-out | |
| `--sf-transition-colors` | color, bg, border, text-dec, fill, stroke | Scoped |
| `--sf-transition-transform` | transform duration-normal ease-out | Scoped |
| `--sf-transition-opacity` | opacity duration-normal ease-out | Scoped |
| `--sf-transition-shadow` | box-shadow duration-normal ease-out | Scoped |
| `--sf-transition-base` | var(--sf-transition-all) | **DEPRECATED ALIAS** |
| `--sf-transition-fast` | all duration-fast ease-out | |
| `--sf-transition-slow` | all duration-slow ease-in-out | |
| `--sf-transition-enter` | all duration-normal ease-out | |
| `--sf-transition-exit` | all duration-fast ease-in | |

**Total: 10**

### 2.37 Focus Ring Token (from tokens.css, shadow shorthand)

| Token | Value |
|-------|-------|
| `--sf-focus-ring-color` | var(--sf-color-action) |
| `--sf-focus-ring-shadow` | compound box-shadow (double ring) |
| `--sf-caret-color` | var(--sf-color-action) |

**Total: 3**

---

**GRAND TOTAL core/tokens.css: 345 unique custom properties**

---

## 3. Token Inventory — core/tokens.layout.css

| Token | Points To | Used By |
|-------|-----------|---------|
| `--sf-space-gap` | var(--sf-gap) | Layout primitives |
| `--sf-space-content` | var(--sf-content-gap) | Stack, prose |
| `--sf-stack-gap` | var(--sf-space-content) | .sf-stack |
| `--sf-box-padding` | var(--sf-space-m) | .sf-box |
| `--sf-box-border-width` | 0 | .sf-box |
| `--sf-box-border-color` | var(--sf-color-border) | .sf-box |
| `--sf-center-max` | var(--sf-container-default) | .sf-center |
| `--sf-center-gutter` | var(--sf-space-gutter) | .sf-center |
| `--sf-cluster-gap` | var(--sf-space-gap) | .sf-cluster |
| `--sf-cluster-align` | center | .sf-cluster |
| `--sf-cluster-justify` | flex-start | .sf-cluster |
| `--sf-sidebar-gap` | var(--sf-space-gap) | .sf-sidebar |
| `--sf-sidebar-min-width` | 50% | .sf-sidebar |
| `--sf-sidebar-width-default` | 18rem | .sf-sidebar |
| `--sf-switcher-threshold` | 30rem | .sf-switcher |
| `--sf-switcher-gap` | var(--sf-space-gap) | .sf-switcher |
| `--sf-grid-min` | 16rem | .sf-grid |
| `--sf-grid-gap` | var(--sf-space-gap) | .sf-grid |
| `--sf-grid-min-xs` | 10rem | .sf-grid--xs |
| `--sf-grid-min-s` | 13rem | .sf-grid--s |
| `--sf-grid-min-default` | 16rem | (unused - see analysis) |
| `--sf-grid-min-m` | 16rem | .sf-grid--m |
| `--sf-grid-min-l` | 20rem | .sf-grid--l |
| `--sf-grid-min-xl` | 24rem | .sf-grid--xl |
| `--sf-cover-min-height` | 100dvh | .sf-cover |
| `--sf-cover-padding` | var(--sf-section-pad) | .sf-cover |
| `--sf-frame-ratio` | 16 / 9 | .sf-frame |
| `--sf-reel-item-width` | max-content | .sf-reel |
| `--sf-reel-gap` | var(--sf-space-gap) | .sf-reel |
| `--sf-reel-height` | auto | (unused internally) |
| `--sf-imposter-margin` | var(--sf-space-m) | .sf-imposter--contain |
| `--sf-bento-cols-default` | 3 | .sf-bento |
| `--sf-bento-row-default` | 10rem | .sf-bento |
| `--sf-bento-row-compact` | 6rem | .sf-bento--compact |
| `--sf-bento-row-tall` | 16rem | .sf-bento--tall |
| `--sf-bento-gap` | var(--sf-space-gap) | .sf-bento |
| `--sf-breakout-width` | var(--sf-container-wide) | .sf-content-grid |
| `--sf-content-width` | var(--sf-container-default) | .sf-content-grid |
| `--sf-prose-paragraph` | var(--sf-space-content) | .sf-prose |

**TOTAL tokens.layout.css: 39 custom properties**


---

## 4. Token Inventory — optional/tokens.palette.css

Generates a full numeric + alpha + alias scale for each of the 6 brand colors.

### Per-color token pattern (×6 colors: primary, secondary, tertiary, action, neutral, base):

| Pattern | Count per color | Example |
|---------|----------------|---------|
| `-50` through `-950` (11 steps) | 11 | `--sf-color-primary-50` |
| `-a5` through `-a95` (11 steps) | 11 | `--sf-color-primary-a10` |
| Shade aliases: `-superlight`, `-xlight`, `-lighter`, `-darker`, `-xdark`, `-superdark` | 6 | `--sf-color-primary-darker` |
| Functional aliases: `-hover`, `-active`, `-subtle`, `-muted`, `-ghost` | 5 | `--sf-color-primary-hover` |

**Per color: 33 tokens × 6 colors = 198 tokens**

### Shade alias → numeric mapping (same for all colors):

| Alias | Points To |
|-------|-----------|
| `-superlight` | `-50` |
| `-xlight` | `-200` |
| `-lighter` | `-400` |
| `-darker` | `-600` |
| `-xdark` | `-800` |
| `-superdark` | `-950` |

### Functional alias → other alias mapping:

| Alias | Points To |
|-------|-----------|
| `-hover` | `-darker` → `-600` |
| `-active` | `-xdark` → `-800` |
| `-subtle` | `-a10` |
| `-muted` | `-a30` |
| `-ghost` | `-a5` |

**TOTAL tokens.palette.css: 198 custom properties**

---


## 5. Class Inventory — All Layers

### 5.1 Layout Classes (core/layout.css) — `slashed.layout`

| Class | Type | Purpose |
|-------|------|---------|
| `.sf-section` | Block | Section with vertical padding |
| `.sf-section--s` | Modifier | Small section padding |
| `.sf-section--m` | Modifier | Medium section padding |
| `.sf-section--l` | Modifier | Large section padding |
| `.sf-section--xl` | Modifier | XL section padding |
| `.sf-section-group` | Block | Collapses adjacent section tops |
| `.sf-divider` | Block | Horizontal separator |
| `.sf-divider--vertical` | Modifier | Vertical separator |
| `.sf-container` | Block | Max-width centered container |
| `.sf-container--narrow` | Modifier | 38rem max |
| `.sf-container--prose` | Modifier | 65ch max |
| `.sf-container--wide` | Modifier | 90rem max |
| `.sf-container--full` | Modifier | 100% max |
| `.sf-stack` | Block | Flex column with gap |
| `.sf-stack--2xs` | Modifier | Gap: space-2xs |
| `.sf-stack--xs` | Modifier | Gap: space-xs |
| `.sf-stack--s` | Modifier | Gap: space-s |
| `.sf-stack--m` | Modifier | Gap: space-m |
| `.sf-stack--l` | Modifier | Gap: space-l |
| `.sf-stack--xl` | Modifier | Gap: space-xl |
| `.sf-stack--2xl` | Modifier | Gap: space-2xl |
| `.sf-stack--3xl` | Modifier | Gap: space-3xl |
| `.sf-stack--center` | Modifier | align-items: center |
| `.sf-stack--end` | Modifier | align-items: flex-end |
| `.sf-stack--stretch` | Modifier | align-items: stretch |
| `.sf-box` | Block | Padded box with optional border |
| `.sf-center` | Block | Content-box centered max-width |
| `.sf-center--intrinsic` | Modifier | Intrinsic centering |
| `.sf-cluster` | Block | Flex-wrap group |
| `.sf-cluster--2xs` | Modifier | Gap: space-2xs |
| `.sf-cluster--xs` | Modifier | Gap: space-xs |
| `.sf-cluster--s` | Modifier | Gap: space-s |
| `.sf-cluster--m` | Modifier | Gap: space-m |
| `.sf-cluster--l` | Modifier | Gap: space-l |
| `.sf-cluster--xl` | Modifier | Gap: space-xl |
| `.sf-cluster--no-wrap` | Modifier | flex-wrap: nowrap |
| `.sf-cluster--center` | Modifier | justify-content: center |
| `.sf-cluster--end` | Modifier | justify-content: flex-end |
| `.sf-cluster--between` | Modifier | justify-content: space-between |
| `.sf-sidebar` | Block | Two-column sidebar layout |
| `.sf-sidebar--right` | Modifier | Sidebar on right side |
| `.sf-sidebar--narrow` | Modifier | 12rem sidebar |
| `.sf-sidebar--wide` | Modifier | 26rem sidebar |
| `.sf-switcher` | Block | Column/row switcher |
| `.sf-switcher--no-wrap` | Modifier | No wrap, scroll |
| `.sf-switcher--vertical` | Modifier | Column direction |
| `.sf-grid` | Block | Auto-fill CSS grid |
| `.sf-grid--fit` | Modifier | auto-fit instead of auto-fill |
| `.sf-grid--xs` | Modifier | grid-min: 10rem |
| `.sf-grid--s` | Modifier | grid-min: 13rem |
| `.sf-grid--m` | Modifier | grid-min: 16rem |
| `.sf-grid--l` | Modifier | grid-min: 20rem |
| `.sf-grid--xl` | Modifier | grid-min: 24rem |
| `.sf-grid--dense` | Modifier | grid-auto-flow: dense |

| `.sf-icon` | Block | Inline icon sizing |
| `.sf-icon--xs` | Modifier | 0.875em |
| `.sf-icon--s` | Modifier | 1em |
| `.sf-icon--m` | Modifier | 1.5em |
| `.sf-icon--l` | Modifier | 2em |
| `.sf-icon--xl` | Modifier | 3em |
| `.sf-cover` | Block | Full-height flex column |
| `.sf-cover__center` | Element | Vertically centered child |
| `.sf-cover--min` | Modifier | min-height: 50dvh |
| `.sf-cover--max` | Modifier | max-height: 100dvh |
| `.sf-cover--padding-s` | Modifier | Small padding |
| `.sf-cover--padding-l` | Modifier | Large padding |
| `.sf-frame` | Block | Aspect-ratio container |
| `.sf-frame--square` | Modifier | 1:1 |
| `.sf-frame--video` | Modifier | 16:9 |
| `.sf-frame--cinema` | Modifier | 21:9 |
| `.sf-frame--portrait` | Modifier | 3:4 |
| `.sf-frame--4-3` | Modifier | 4:3 (uses --sf-ratio-photo = 3/2!) |
| `.sf-frame--3-2` | Modifier | 3:2 (hardcoded) |
| `.sf-frame--golden` | Modifier | golden ratio |
| `.sf-reel` | Block | Horizontal scroll snap |
| `.sf-imposter` | Block | Centered absolute overlay |
| `.sf-imposter--fixed` | Modifier | position: fixed |
| `.sf-imposter--contain` | Modifier | Contained with max sizes |
| `.sf-alternate` | Block | Zigzag two-column |
| `.sf-pancake` | Block | Sticky footer grid |
| `.sf-grid-1` | Block | 1-column grid |
| `.sf-grid-2` | Block | 2-column responsive grid |
| `.sf-grid-3` | Block | 3-column responsive grid |
| `.sf-grid-4` | Block | 4-column responsive grid |
| `.sf-grid-6` | Block | 6-column responsive grid |
| `.sf-grid-1-2` | Block | 1:2 ratio grid |
| `.sf-grid-2-1` | Block | 2:1 ratio grid |
| `.sf-grid-1-3` | Block | 1:3 ratio grid |
| `.sf-grid-3-1` | Block | 3:1 ratio grid |
| `.sf-content-grid` | Block | Breakout pattern grid |
| `.sf-breakout` | Element | Breakout-width child |
| `.sf-full-bleed` | Element | Full-width child |
| `.sf-bento` | Block | Bento grid |
| `.sf-bento--2` | Modifier | 2 columns |
| `.sf-bento--4` | Modifier | 4 columns |
| `.sf-bento--compact` | Modifier | Compact rows |
| `.sf-bento--tall` | Modifier | Tall rows |
| `.sf-subgrid` | Block | Column subgrid |
| `.sf-subgrid-rows` | Block | Row subgrid |
| `.sf-prose` | Block | Long-form text rhythm |
| `.sf-not-prose` | Block | Resets prose styles |

**Total layout classes: 101**


### 5.2 State Classes (core/states.css) — `slashed.states`

| Class | Category | Sets |
|-------|----------|------|
| `.is-hidden` | Visibility | display: none !important |
| `.is-invisible` | Visibility | visibility: hidden |
| `.is-visible` | Visibility | visibility: visible |
| `.is-disabled` | Interactivity | opacity, pointer-events, cursor, user-select |
| `.is-readonly` | Interactivity | pointer-events, user-select |
| `.is-loading` | Async | Spinner pseudo-element |
| `.is-busy` | Async | cursor: progress |
| `.is-pending` | Async | opacity: 0.7, cursor: progress |
| `.is-skeleton` | Async | Shimmer gradient animation |
| `.is-active` | Toggle | --sf-is-active: 1 |
| `.is-selected` | Toggle | bg: --sf-color-bg--selected |
| `.is-current` | Navigation | font-weight: bold |
| `.is-highlighted` | Toggle | bg: --sf-color-bg--focus |
| `.is-pressed` | Toggle | --sf-is-pressed: 1, bg: selected |
| `.is-open` | Disclosure | --sf-is-open: 1 |
| `.is-collapsed` | Disclosure | --sf-is-open: 0 |
| `.is-expanded` | Disclosure | --sf-is-open: 1 |
| `.is-valid` | Validation | border + text: success |
| `.is-invalid` | Validation | border + text: error |
| `.is-warning` | Validation | border + text: warning |
| `.is-success` | Feedback | border + text: success |
| `.is-error` | Feedback | border + text: error |
| `.is-info` | Feedback | border + text: info |
| `.is-danger` | Feedback | border + text: danger |
| `.is-sticky` | Position | sticky + z-low |
| `.is-pinned` | Position | sticky top:0 + z-mid |
| `.is-fixed` | Position | position: fixed |
| `.is-fullscreen` | Position | fixed inset:0 + z-max |
| `.is-resizable` | Position | resize: both |
| `.is-clipped` | Overflow | overflow: hidden !important |
| `.is-scrollable` | Overflow | overflow: auto |
| `.is-truncated` | Overflow | ellipsis overflow |
| `.is-dragging` | Drag | opacity: 0.5, grabbing |
| `.is-drop-target` | Drag | dashed outline |
| `.is-draggable` | Drag | cursor: grab |
| `.is-overlay` | Overlay | absolute inset: 0 |
| `.is-clickable` | Interaction | cursor: pointer |
| `.is-unselectable` | Interaction | user-select: none |
| `.is-focused` | Interaction | Programmatic focus ring |
| `.focus-parent` | Interaction | :focus-within outline |
| `.is-empty` | Empty | display: none when :empty |

**Total state classes: 41**


### 5.3 Motion Classes (core/motion.css) — `slashed.motion`

| Class | Animation |
|-------|-----------|
| `.sf-fade-in` | sf-fade-in |
| `.sf-fade-out` | sf-fade-out |
| `.sf-slide-in-up` | sf-slide-in-up |
| `.sf-slide-in-down` | sf-slide-in-down |
| `.sf-slide-in-left` | sf-slide-in-left |
| `.sf-slide-in-right` | sf-slide-in-right |
| `.sf-scale-up` | sf-scale-up |
| `.sf-scale-down` | sf-scale-down |
| `.sf-color-pulse` | sf-color-pulse |

**Total motion classes: 9** (all wrapped in `@media (prefers-reduced-motion: no-preference)`)

### 5.4 Accessibility Classes (core/accessibility.css) — `slashed.accessibility`

| Class | Purpose |
|-------|---------|
| `.sr-only` | Screen-reader only (visually hidden) |
| `.visually-hidden` | Synonym of .sr-only |
| `.sr-only-focusable` | SR-only but visible on focus |
| `.no-motion` | Manual motion suppression |
| `.skip-link` | Skip-to-content link |
| `.focus-parent` | (also in states, but different layer) |

**Total accessibility classes: 5** (+ pseudo-class rules)

### 5.5 Print Classes (core/print.css) — `slashed.print`

| Class | Purpose |
|-------|---------|
| `.no-print` | Hidden in print |
| `.print-only` | Visible only in print |
| `.print-color-exact` | Force colour-faithful print |
| `.print-no-color` | Force ink-saving print |

**Total print classes: 4**

### 5.6 Forms (optional/forms.css) — `slashed.forms`

No classes — entirely classless element-level styling. Targets native elements via `:where()` selectors.

**Total form classes: 0**

---

**GRAND TOTAL CLASSES IN OPTIMAL BUNDLE: 160**

---


## 6. Keyframes Inventory

| Keyframe | Defined In | Referenced By |
|----------|-----------|---------------|
| `sf-fade-in` | motion.css | .sf-fade-in, --sf-animation-fade-in |
| `sf-fade-out` | motion.css | .sf-fade-out, --sf-animation-fade-out |
| `sf-slide-in-up` | motion.css | .sf-slide-in-up, --sf-animation-slide-in-up |
| `sf-slide-in-down` | motion.css | .sf-slide-in-down, --sf-animation-slide-in-down |
| `sf-slide-in-left` | motion.css | .sf-slide-in-left, --sf-animation-slide-in-left |
| `sf-slide-in-right` | motion.css | .sf-slide-in-right, --sf-animation-slide-in-right |
| `sf-scale-up` | motion.css | .sf-scale-up, --sf-animation-scale-up |
| `sf-scale-down` | motion.css | .sf-scale-down, --sf-animation-scale-down |
| `sf-spin` | motion.css | .is-loading (states.css) |
| `sf-shimmer` | motion.css | .is-skeleton (states.css) |
| `sf-ping` | motion.css | --sf-animation-ping (token only, no class) |
| `sf-blink` | motion.css | --sf-animation-blink (token only, no class) |
| `sf-float` | motion.css | --sf-animation-float (token only, no class) |
| `sf-color-pulse` | motion.css | .sf-color-pulse |

**Total keyframes: 14**

---

## 7. Alias & Indirection Map

This section traces every token that is an alias (points to another token via `var()`), including multi-hop chains.

### 7.1 Documented Canonical-Source Aliases (intentional, by design)

| Alias Token | → Canonical Source | Hop Count | Purpose |
|-------------|-------------------|-----------|---------|
| `--sf-space-gap` | → `--sf-gap` | 1 | Layout primitives read this name |
| `--sf-space-content` | → `--sf-content-gap` | 1 | Stack/prose rhythm |
| `--sf-section-pad` | → `--sf-section-pad--m` | 1 | Unsuffixed = the -m default |

### 7.2 Multi-Hop Alias Chains

| Start | Chain | Hops |
|-------|-------|------|
| `.sf-stack` gap | → `--sf-stack-gap` → `--sf-space-content` → `--sf-content-gap` → `--sf-space-s` | **4** |
| `.sf-cluster` gap | → `--sf-cluster-gap` → `--sf-space-gap` → `--sf-gap` → `--sf-space-m` | **4** |
| `.sf-grid` gap | → `--sf-grid-gap` → `--sf-space-gap` → `--sf-gap` → `--sf-space-m` | **4** |
| `.sf-sidebar` gap | → `--sf-sidebar-gap` → `--sf-space-gap` → `--sf-gap` → `--sf-space-m` | **4** |
| `.sf-switcher` gap | → `--sf-switcher-gap` → `--sf-space-gap` → `--sf-gap` → `--sf-space-m` | **4** |
| `.sf-reel` gap | → `--sf-reel-gap` → `--sf-space-gap` → `--sf-gap` → `--sf-space-m` | **4** |
| `.sf-bento` gap | → `--sf-bento-gap` → `--sf-space-gap` → `--sf-gap` → `--sf-space-m` | **4** |
| `.sf-center` gutter | → `--sf-center-gutter` → `--sf-space-gutter` → `--sf-space-l` | **3** |
| `.sf-cover` padding | → `--sf-cover-padding` → `--sf-section-pad` → `--sf-section-pad--m` → `--sf-space-3xl` | **4** |
| `body` font-family | → `--sf-body-font-family` → fallback `--sf-font-body` | 2 |
| `body` font-size | → `--sf-body-font-size` → fallback `--sf-text-m` | 2 |
| `h1` font-weight | → `--sf-h1-font-weight` → `--sf-font-weight-heading` → `--sf-font-weight-semibold` | 3 |


### 7.3 Simple Aliases (1 hop, semantic → scale)

| Alias | Points To |
|-------|-----------|
| `--sf-color-surface` | `--sf-color-base` |
| `--sf-color-text--muted` | `--sf-color-neutral` |
| `--sf-color-border--focus` | `--sf-color-action` |
| `--sf-color-bg--disabled` | `--sf-color-well` |
| `--sf-color-code-bg` | `--sf-color-well` |
| `--sf-color-link--disabled` | `--sf-color-text--disabled` |
| `--sf-color-text--on-base` | `--sf-color-text` |
| `--sf-color-text--on-inverse` | `--sf-color-text--inverse` |
| `--sf-focus-ring-color` | `--sf-color-action` |
| `--sf-caret-color` | `--sf-color-action` |
| `--sf-scrollbar-thumb` | `--sf-color-neutral` |
| `--sf-sticky-offset` | `--sf-header-height` |
| `--sf-touch-target` | `--sf-size-l` |
| `--sf-space-gutter` | `--sf-space-l` |
| `--sf-font-heading` | `--sf-font-body` |
| `--sf-font-display` | `--sf-font-heading` → `--sf-font-body` (2-hop) |
| `--sf-font-weight-body` | `--sf-font-weight-normal` |
| `--sf-font-weight-heading` | `--sf-font-weight-semibold` |
| `--sf-font-weight-display` | `--sf-font-weight-bold` |
| `--sf-current-font-weight` | `--sf-font-weight-bold` |
| `--sf-transition-base` | `--sf-transition-all` (DEPRECATED) |
| `--sf-divider-width` | `--sf-border-width-1` |
| `--sf-divider-color` | `--sf-color-border` |
| `--sf-gap` | `--sf-space-m` |
| `--sf-content-gap` | `--sf-space-s` |
| `--sf-component-pad` | `--sf-space-m` |
| `--sf-field-block` | `--sf-space-l` |

### 7.4 Palette Alias Chains (tokens.palette.css)

| Alias | Chain |
|-------|-------|
| `--sf-color-primary-hover` | → `-darker` → `-600` (numeric step) |
| `--sf-color-primary-active` | → `-xdark` → `-800` (numeric step) |
| `--sf-color-primary-subtle` | → `-a10` (alpha step) |
| `--sf-color-primary-muted` | → `-a30` (alpha step) |
| `--sf-color-primary-ghost` | → `-a5` (alpha step) |
| `--sf-color-primary-superlight` | → `-50` (numeric step) |
| `--sf-color-primary-xlight` | → `-200` (numeric step) |
| `--sf-color-primary-lighter` | → `-400` (numeric step) |
| `--sf-color-primary-xdark` | → `-800` (numeric step) |
| `--sf-color-primary-superdark` | → `-950` (numeric step) |

*(Same pattern repeated for secondary, tertiary, action, neutral, base = 60 aliases total)*

---


## 8. Redundancy & Overlap Analysis

### 8.1 POTENTIAL REDUNDANCIES FOUND

#### R1: `--sf-grid-min-default` vs `--sf-grid-min` — DOUBLED TOKEN

| Token | Value | Used By |
|-------|-------|---------|
| `--sf-grid-min` | 16rem | `.sf-grid` (directly consumed) |
| `--sf-grid-min-default` | 16rem | **NOTHING** — never referenced anywhere |
| `--sf-grid-min-m` | 16rem | `.sf-grid--m` modifier |

**Finding:** `--sf-grid-min-default` is dead. It has the same value as `--sf-grid-min` and `--sf-grid-min-m`, and is never consumed. The `.sf-grid--m` modifier points to `--sf-grid-min-m`, making `--sf-grid-min-default` purely orphaned.

**Verdict:** REMOVE `--sf-grid-min-default`

---

#### R2: `--sf-grid-min-m` duplicates the base `--sf-grid-min` value

Both are 16rem. The `.sf-grid--m` class sets `--sf-grid-min: var(--sf-grid-min-m)` which resolves to... the same value as the default. Applying `.sf-grid--m` is a no-op.

**Verdict:** `.sf-grid--m` is effectively dead code (no-op modifier). Consider removing or documenting as "explicit default" if intentional.

---

#### R3: `--sf-color-heading` duplicates `--sf-color-text` formula

Both use the identical oklch formula:
```css
--sf-color-text:    light-dark(oklch(from neutral-light clamp(0.05, calc(l - 0.4 - bias), 0.35) c h), ...)
--sf-color-heading: light-dark(oklch(from neutral-light clamp(0.05, calc(l - 0.4 - bias), 0.35) c h), ...)
```

**Finding:** These resolve to the exact same computed value in all modes. The separation exists so consumers can independently override heading color, which is a valid design pattern. However, they are currently _identically derived_.

**Verdict:** INTENTIONAL (override knob). Not a bug, but worth noting they never diverge without user intervention.

---

#### R4: `.is-valid` and `.is-success` — OVERLAPPING STATE CLASSES

| Class | Sets |
|-------|------|
| `.is-valid` | `--sf-field-border-color: success`, `--sf-field-text-color: success-strong` |
| `.is-success` | `--sf-field-border-color: success`, `--sf-field-text-color: success-strong` |

**Finding:** These two classes set the exact same tokens to the exact same values. The distinction is semantic (validation vs. feedback), but the output is identical.

**Verdict:** INTENTIONAL semantic distinction (documented in comments). CSS output is identical by design — not a bug, but a potential point of confusion.

---


#### R5: `.is-open` and `.is-expanded` — IDENTICAL OUTPUT

| Class | Sets |
|-------|------|
| `.is-open` | `--sf-is-open: 1` |
| `.is-expanded` | `--sf-is-open: 1` |

**Finding:** Identical. Semantic distinction (container shown vs. trigger expanded/aria-expanded), but the CSS output is the same custom property set to the same value.

**Verdict:** INTENTIONAL semantic distinction. No CSS-level redundancy issue (both needed for different ARIA contexts).

---

#### R6: `--sf-transition-all` vs `--sf-transition-enter` — DUPLICATE VALUES

```css
--sf-transition-all:   all var(--sf-duration-normal) var(--sf-ease-out);
--sf-transition-enter: all var(--sf-duration-normal) var(--sf-ease-out);
```

**Finding:** These resolve to the exact same value. `--sf-transition-enter` is semantically "for elements entering" but the actual CSS is identical to `--sf-transition-all`.

**Verdict:** REDUNDANT. `--sf-transition-enter` adds no new information. Consumers should use `--sf-transition-all` or the scoped variants. Recommend deprecating `--sf-transition-enter`.

---

#### R7: `--sf-transition-base` — DEPRECATED ALIAS

```css
--sf-transition-base: var(--sf-transition-all);
```

**Finding:** Already marked deprecated. Pure alias that adds a 2-hop chain for no benefit.

**Verdict:** SCHEDULED FOR REMOVAL (confirmed deprecated in comments).

---

#### R8: `--sf-reel-height` — UNUSED TOKEN

Declared as `auto` in tokens.layout.css. Never consumed by any rule in the bundle.

**Verdict:** Dead token. Either remove or document as consumer-facing API.

---

#### R9: `--sf-color-bg--disabled` and `--sf-color-code-bg` — SAME SOURCE

Both alias to `var(--sf-color-well)`:
```css
--sf-color-bg--disabled: var(--sf-color-well);
--sf-color-code-bg:      var(--sf-color-well);
```

**Finding:** Two distinct semantic tokens pointing to the same underlying value. This is standard token architecture (semantic layer over primitive), not a redundancy.

**Verdict:** INTENTIONAL. Different consumers, same underlying value. Correct design.

---

#### R10: `--sf-focus-ring-color` and `--sf-caret-color` — BOTH ALIAS `--sf-color-action`

```css
--sf-focus-ring-color: var(--sf-color-action);
--sf-caret-color:      var(--sf-color-action);
```

Also: `--sf-color-border--focus: var(--sf-color-action)`

**Finding:** Three tokens all pointing to `--sf-color-action`. Each serves a distinct semantic role (focus ring, text cursor, focus border). Standard practice.

**Verdict:** INTENTIONAL. Three independent override points that happen to share a default.

---


#### R11: `--sf-gap` and `--sf-component-pad` — SAME VALUE

```css
--sf-gap:           var(--sf-space-m);
--sf-component-pad: var(--sf-space-m);
```

**Finding:** Same underlying value, different semantic meaning (inter-element gap vs. intra-element padding). Standard token arch.

**Verdict:** INTENTIONAL.

---

#### R12: `.sf-frame--4-3` uses `--sf-ratio-photo` which is `3 / 2`, NOT `4 / 3`

```css
--sf-ratio-photo:    3 / 2;
.sf-frame--4-3     { aspect-ratio: var(--sf-ratio-photo); }  /* ACTUALLY 3:2! */
.sf-frame--3-2     { aspect-ratio: 3 / 2; }                 /* Also 3:2 */
```

**Finding:** The class name `.sf-frame--4-3` implies 4:3 ratio but actually applies 3:2 via `--sf-ratio-photo`. Meanwhile `.sf-frame--3-2` hardcodes 3:2 directly. This means:
- `.sf-frame--4-3` and `.sf-frame--3-2` produce the SAME aspect ratio (3:2).
- There is NO actual 4:3 class.

**Verdict:** BUG / NAMING ERROR. `.sf-frame--4-3` is misleading. Either rename it to `--3-2` (duplicating the existing one) or fix to actually be `4 / 3`. Currently doubled output.

---

#### R13: `--sf-font-weight-display` and `--sf-current-font-weight` — SAME VALUE

Both alias `--sf-font-weight-bold` (700). Different semantic roles (display typography weight vs. current-nav indicator weight).

**Verdict:** INTENTIONAL. Independent override points.

---

#### R14: `--sf-space-gutter` and `--sf-field-block` — SAME VALUE

Both resolve to `var(--sf-space-l)`.

**Verdict:** INTENTIONAL. Different semantic roles (page gutters vs. form field spacing).

---

#### R15: Palette `--sf-color-X-muted` (tokens.palette.css) vs Status `--sf-color-X-muted` (tokens.css)

In core/tokens.css:
```css
--sf-color-success-muted: oklch(from var(--sf-color-success) l c h / 0.3);
--sf-color-warning-muted: oklch(from var(--sf-color-warning) l c h / 0.3);
--sf-color-error-muted:   oklch(from var(--sf-color-error) l c h / 0.3);
--sf-color-info-muted:    oklch(from var(--sf-color-info) l c h / 0.3);
--sf-color-danger-muted:  oklch(from var(--sf-color-danger) l c h / 0.3);
```

In tokens.palette.css (for brand colors only):
```css
--sf-color-primary-muted:   var(--sf-color-primary-a30);   /* = color-mix(...30%, transparent) */
--sf-color-secondary-muted: var(--sf-color-secondary-a30);
...etc
```

**Finding:** The `-muted` naming pattern is used in BOTH files but for different color families and with slightly different derivation methods (oklch alpha vs color-mix alpha). The status colors (success/warning/error/info/danger) don't get palette treatment; the brand colors (primary/secondary/tertiary/action/neutral/base) don't get status triplets. NO actual collision — the namespaces don't overlap.

**Verdict:** CLEAN. No conflict. Different color families, consistent naming convention.

---


#### R16: `--sf-color-surface` — is it needed separately from `--sf-color-base`?

```css
--sf-color-surface: var(--sf-color-base);
```

Consumed by: `optional/forms.css` (input background-color), and available for consumer use.

**Verdict:** INTENTIONAL override knob. Allows consumers to change card/component surface independently from the page base. Useful architecture.

---

### 8.2 SUMMARY OF ACTIONABLE FINDINGS

| # | Type | Item | Recommendation |
|---|------|------|----------------|
| R1 | Dead token | `--sf-grid-min-default` | **REMOVE** — never referenced |
| R2 | No-op class | `.sf-grid--m` | **REMOVE or document** — identical to default |
| R6 | Duplicate value | `--sf-transition-enter` = `--sf-transition-all` | **DEPRECATE** |
| R7 | Deprecated alias | `--sf-transition-base` | **REMOVE** (already deprecated) |
| R8 | Dead token | `--sf-reel-height` | **REMOVE or use** |
| R12 | Naming bug | `.sf-frame--4-3` uses 3:2 ratio | **FIX** — either rename or add `--sf-ratio-4-3: 4/3` |

### 8.3 INTENTIONAL DUPLICATIONS (not bugs)

| # | Items | Reason |
|---|-------|--------|
| R3 | `--sf-color-heading` = `--sf-color-text` | Independent override knob |
| R4 | `.is-valid` = `.is-success` | Semantic contexts (validation vs feedback) |
| R5 | `.is-open` = `.is-expanded` | Different ARIA mapping intent |
| R9 | `--sf-color-bg--disabled` = `--sf-color-code-bg` | Different semantic roles |
| R10 | Three tokens → `--sf-color-action` | Independent override points |
| R11 | `--sf-gap` = `--sf-component-pad` | Gap vs padding semantics |
| R13 | `--sf-font-weight-display` = `--sf-current-font-weight` | Different domains |
| R14 | `--sf-space-gutter` = `--sf-field-block` | Page gutter vs form spacing |
| R15 | Brand `-muted` vs Status `-muted` | Different color families, no collision |
| R16 | `--sf-color-surface` = `--sf-color-base` | Consumer override flexibility |

---


## 9. Token Consumption Map

Shows which tokens from `tokens.css` / `tokens.layout.css` are actually consumed internally by the framework's own rules (vs. being purely BEM consumer API).

### 9.1 Tokens consumed internally by framework CSS

| Token | Consumed In |
|-------|-------------|
| `--sf-color-text` | base.css (body color) |
| `--sf-color-bg` | base.css (body bg) |
| `--sf-color-heading` | base.css (h1-h6) |
| `--sf-color-link` / hover / visited / active | base.css (a) |
| `--sf-color-link--underline` | base.css (a) |
| `--sf-color-code-bg` | base.css (code, pre) |
| `--sf-color-code-text` | base.css (code) |
| `--sf-color-mark-bg`, `--sf-color-mark-text` | base.css (mark) |
| `--sf-color-selection-bg`, `--sf-color-selection-text` | base.css (::selection) |
| `--sf-color-dim` | base.css (::backdrop) |
| `--sf-color-action` | base.css (caret, accent), forms.css (buttons, inputs) |
| `--sf-color-border` | forms.css (inputs), layout.css (.sf-divider) |
| `--sf-color-border--focus` | forms.css (focus), accessibility.css |
| `--sf-color-border--subtle` | forms.css (fieldset) |
| `--sf-color-border--strong` | states.css (.is-loading) |
| `--sf-color-bg--selected` | states.css (.is-selected, .is-pressed) |
| `--sf-color-bg--focus` | states.css (.is-highlighted) |
| `--sf-color-surface` | forms.css (input bg) |
| `--sf-color-well` | states.css (.is-skeleton) |
| `--sf-color-raised` | states.css (.is-skeleton) |
| `--sf-color-text--on-action` | forms.css (button color) |
| `--sf-color-text--placeholder` | forms.css (::placeholder) |
| `--sf-color-text--disabled` | forms.css (disabled) |
| `--sf-color-text--muted` | layout.css (.sf-prose figcaption) |
| `--sf-color-success`, `-strong` | states.css (.is-valid/.is-success) |
| `--sf-color-warning`, `-strong` | states.css (.is-warning) |
| `--sf-color-error`, `-strong` | states.css (.is-invalid/.is-error), forms.css (required marker) |
| `--sf-color-info`, `-strong` | states.css (.is-info) |
| `--sf-color-danger`, `-strong` | states.css (.is-danger) |
| `--sf-color-neutral` | accessibility.css (reduced-transparency backdrop) |
| `--sf-font-body` | base.css (body fallback) |
| `--sf-font-heading` | base.css (h1-h6 fallback) |
| `--sf-font-mono` | base.css (code, kbd, pre) |
| `--sf-font-weight-heading` | forms.css (button, label, legend) |
| `--sf-font-weight-bold` | (via `--sf-current-font-weight` in states.css .is-current) |
| `--sf-text-m` | forms.css (input/button font-size) |
| `--sf-text-s` | base.css (small, pre), layout.css (.sf-prose figcaption) |
| `--sf-leading-tight` | base.css (headings) |
| `--sf-leading-normal` | base.css (body fallback), forms.css (inputs) |
| `--sf-space-xs` | forms.css (padding), layout.css (.sf-prose) |
| `--sf-space-s` | forms.css (padding), layout.css (.sf-prose), print.css |
| `--sf-space-m` | base.css (scroll-margin), forms.css, layout.css, states.css |
| `--sf-space-l` | layout.css (.sf-prose figure) |
| `--sf-space-xl` | layout.css (.sf-cover--padding-s) |
| `--sf-space-4xl` | layout.css (.sf-cover--padding-l) |
| `--sf-radius-xs` | base.css (mark, code) |
| `--sf-radius-s` | states.css (.is-skeleton) |
| `--sf-radius-m` | base.css (pre), forms.css (inputs, buttons), layout.css (.sf-prose img) |
| `--sf-radius-full` | forms.css (range track/thumb), states.css (.is-loading) |
| `--sf-border-width-1` | forms.css (inputs, buttons), accessibility.css (forced-colors) |
| `--sf-border-width-3` | forms.css (range track) |
| `--sf-divider-width`, `-style`, `-color` | base.css (hr), layout.css (.sf-divider) |
| `--sf-duration-fast` | base.css (a transition), motion.css |
| `--sf-duration-normal` | motion.css (view transitions) |
| `--sf-ease-out` | base.css (a transition), motion.css |
| `--sf-focus-ring-width` | accessibility.css, forms.css |
| `--sf-focus-ring-offset` | accessibility.css, forms.css |
| `--sf-focus-ring-color` | accessibility.css |
| `--sf-focus-ring-style` | accessibility.css |
| `--sf-opacity-disabled` | states.css (.is-disabled), forms.css (disabled) |
| `--sf-header-height` | base.css (scroll-margin-top) |
| `--sf-z-low` | states.css (.is-sticky) |
| `--sf-z-mid` | states.css (.is-pinned) |
| `--sf-z-max` | states.css (.is-fullscreen) |
| `--sf-is-dark` | themes.css (set), tokens.css (shadow-strength calc) |
| `--sf-transition-colors` | forms.css |
| `--sf-container-default` | layout.css (.sf-container) |
| `--sf-container-narrow` | layout.css (.sf-container--narrow) |
| `--sf-container-prose` | layout.css (.sf-container--prose, .sf-prose) |
| `--sf-container-wide` | layout.css (.sf-container--wide) |
| `--sf-container-full` | layout.css (.sf-container--full) |
| `--sf-print-page-size` | print.css (@page) |
| `--sf-print-page-margin` | print.css (@page) |
| `--sf-print-base-size` | print.css (body) |
| `--sf-contrast-bias` | tokens.css (text/heading color derivation) |


### 9.2 Tokens NOT consumed internally (pure BEM consumer API)

These tokens exist solely for use in consumer BEM classes (`.card`, `.nav`, `.hero`, etc.). They are validated by tests/demo.html but never referenced by the framework's own CSS rules.

| Category | Tokens |
|----------|--------|
| Shadows | `--sf-shadow-none/xs/s/m/l/xl/2xl/inner`, `--sf-shadow-color`, `--sf-shadow-glow`, `--sf-text-shadow-*`, `--sf-drop-shadow-*` |
| Blur | `--sf-blur-xs/s/m/l/xl` |
| Perspective | `--sf-perspective-near/normal/far` |
| Opacity scale | `--sf-opacity-0/10/25/50/75/100` |
| Gradients | All `--sf-gradient-*` tokens |
| Font stacks | `--sf-font-humanist`, `--sf-font-geometric`, `--sf-font-slab` |
| Font features | `--sf-font-features`, `--sf-font-variation`, `--sf-optical-sizing` |
| Font weights | `--sf-font-weight-thin/extralight/light/medium/extrabold/black` |
| Display sizes | `--sf-text-display-s/m/l` |
| Leading | `--sf-leading-snug` (only in heading aliases), `--sf-leading-relaxed` |
| Tracking | All `--sf-tracking-*` except those in heading aliases |
| Icon sizes | Used only by `.sf-icon` (which is in the bundle) — ACTUALLY CONSUMED |
| UI sizes | `--sf-size-xs/s/m/xl` (only `-l` used via `--sf-touch-target`) |
| Aspect ratios | `--sf-ratio-square/video/cinema/photo/portrait/golden` (consumed by .sf-frame modifiers) — ACTUALLY CONSUMED |
| Scale multipliers | `--sf-text-scale`, `--sf-text-display-scale` (space/radius/motion scales ARE consumed) |
| Easing (exotic) | `--sf-ease-spring/elastic/bounce/overshoot` (overshoot consumed by scale-up anim) |
| Animation delays | `--sf-animation-delay-1` through `-5` |
| Scroll timeline | `--sf-scroll-timeline-range-*` |
| Mask scrim | `--sf-mask-scrim-*` |
| Stroke widths | `--sf-stroke-thin/regular/bold/heavy` |
| Safe areas | `--sf-safe-top/bottom/left/right` |
| Border widths | `--sf-border-width-2/4` (only 1 and 3 consumed) |
| Z-index | `--sf-z-below/base/raised/high/top` (only low/mid/max consumed) |
| Spacing | `--sf-space-none/px/2xs/2xl/3xl/4xl` (partially consumed) |
| Containers | None — all consumed |
| All palette tokens | 198 tokens in tokens.palette.css — NONE consumed internally |

**Estimated BEM-consumer-only tokens: ~200+ from tokens.css, all 198 from tokens.palette.css**

---


## 10. Summary Statistics

### Token Counts

| Source File | Count |
|-------------|-------|
| core/tokens.css (incl. @property) | 345 |
| core/tokens.layout.css | 39 |
| optional/tokens.palette.css | 198 |
| **TOTAL custom properties** | **582** |

### Class Counts

| Layer | Count |
|-------|-------|
| slashed.layout | 101 |
| slashed.states | 41 |
| slashed.motion | 9 |
| slashed.accessibility | 5 |
| slashed.print | 4 |
| slashed.forms | 0 (classless) |
| slashed.legacy | 0 (fallback rules only) |
| **TOTAL classes** | **160** |

### Keyframes

| Total | 14 |
|-------|-----|

### Alias Depth

| Max hop depth | 4 (layout primitive gaps) |
|---------------|--------------------------|
| Average hop depth | 2 |
| Documented canonical aliases | 3 |
| Deprecated aliases | 2 (--sf-transition-base, --sf-transition-enter recommended) |

### Actionable Issues

| Priority | Count | Items |
|----------|-------|-------|
| Remove (dead code) | 3 | `--sf-grid-min-default`, `--sf-reel-height`, `--sf-transition-base` |
| Fix (bug) | 1 | `.sf-frame--4-3` naming/value mismatch |
| Deprecate | 1 | `--sf-transition-enter` (= `--sf-transition-all`) |
| No-op (consider removing) | 1 | `.sf-grid--m` modifier |

### Bundle Architecture Quality

- **Max alias hop depth:** 4 (acceptable but at the documented limit of "≤2 hops" claimed in tokens.css header — the layout gap chains exceed this)
- **Dangling tokens:** 2 (`--sf-grid-min-default`, `--sf-reel-height`)
- **Circular references:** 0
- **Naming collisions across files:** 0
- **Layer conflicts:** 0

---

*End of index.*
