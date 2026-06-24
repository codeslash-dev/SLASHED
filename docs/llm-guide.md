# Slashed Framework — LLM Reference Guide

> Version: **0.6.10** · Tokens: **693** · Prefix: `--sf-`

---

## Table of Contents

1. [Introduction & Philosophy](#1-introduction--philosophy)
2. [Framework Architecture](#2-framework-architecture)
3. [Naming Conventions & Tier System](#3-naming-conventions--tier-system)
4. [Browser Support](#4-browser-support)
5. [Token System — Colors](#5-token-system--colors)
6. [Token System — Typography](#6-token-system--typography)
7. [Token System — Spacing](#7-token-system--spacing)
8. [Token System — Layout & Primitives](#8-token-system--layout--primitives)
9. [Token System — Motion & Interaction](#9-token-system--motion--interaction)
10. [Global Scale Multipliers](#10-global-scale-multipliers)
11. [PUBLIC-ADVANCED Tokens](#11-public-advanced-tokens)
12. [When to Use Which Tokens](#12-when-to-use-which-tokens)
13. [Minimal Recipes — Rebranding](#13-minimal-recipes--rebranding)
14. [Best Practices](#14-best-practices)

---

## 1. Introduction & Philosophy

Slashed (`sf`) is a modern CSS framework built on design tokens. Key traits:

**Token-first architecture:** every visual value comes from a CSS custom property (`--sf-*`). Hardcoded numbers are a bug.

**Automatic dark mode:** dark mode is derived automatically via `light-dark()` and relative color syntax (`oklch(from …)`). Set 6 source tokens — dark mode works. Activation: `data-theme="dark"` attribute on any element, or the OS-level `prefers-color-scheme: dark`.

**Fluid everywhere:** typography and spacing interpolate smoothly between a minimum and maximum viewport via `clamp()` with a generative modular scale. Zero breakpoints for the scale.

**One token, global change:** multipliers like `--sf-radius-scale: 0` (sharp corners everywhere) or `--sf-motion-scale: 0` (no animations) change the entire design with a single value.

**Semantics over numbers:** `--sf-z-modal: 1040` instead of a magic `z-index: 9999`. `--sf-shadow-m` instead of a copy-pasted box-shadow.

---

## 2. Framework Architecture

```
slashed/
├── core/
│   ├── layers.css           # @layer declarations — cascade order
│   ├── tokens.css           # Main tokens (colors, typography, spacing, shadows, motion)
│   ├── tokens.layout.css    # Override knobs for layout primitives
│   ├── tokens.macros.css    # Override knobs for macro / recipe classes
│   ├── themes.css           # Dark/light mode logic, --sf-is-dark
│   ├── reset.css            # Normalisation + color-scheme
│   ├── base.css             # HTML typography, links, img/video
│   ├── layout.css           # Primitive classes: stack, cluster, grid, sidebar…
│   ├── macros.css           # Recipe classes: prose, surface, flow, scrim…
│   ├── states.css           # State classes: .is-active, .is-current…
│   ├── accessibility.css    # Focus, skip links, screen-reader utilities
│   ├── motion.css           # @keyframes for animations + view-transition
│   └── print.css            # Print styles
└── optional/
    ├── tokens.components.css # Component tokens (field, button…)
    ├── forms.css             # Form styles
    ├── utilities.css         # Utility classes
    ├── components.css        # Optional components
    └── overrides-example.css / theme-example.css / config-example.css
```

**Optional files** (`optional/`) are loaded only when needed. The full numeric color scale lives in `core/tokens.css` alongside the semantic aliases (`-superlight`, `-xlight`, etc.).

> **Important:** `tokens.macros.css` lives in `core/`, not `optional/`.

---

## 3. Naming Conventions & Tier System

### Prefix and separators

```css
--sf-color-primary          /* color from the primary family */
--sf-space-m                /* medium spacing */
--sf-shadow-l               /* large shadow */
--sf-text-xl                /* xl text size */
--sf-radius-scale           /* global multiplier */
```

State modifiers use a double-dash: `--sf-color-border--focus`, `--sf-color-bg--hover`.

### Tier — stability level

| Tier | Meaning |
|---|---|
| `PUBLIC` | Stable, SemVer-guaranteed. Safe to use everywhere |
| `PUBLIC-ADVANCED` | Same guarantee, but niche — for advanced use cases |
| `INTERNAL` | Implementation detail. **Never override** |

### Token role

| Role | Meaning |
|---|---|
| `knob` | **Input** — a primitive you set (color, number, font-stack). The configuration point |
| `consumption` | **Output** — a value derived from other tokens via `var()`, `light-dark()`, `oklch()`. Used in CSS |

### Editability

| Level | Meaning |
|---|---|
| **Direct** | Intended to be overridden — the single configuration point for this value |
| **Indirect** | Changes automatically when you override other tokens; can also be overridden directly |
| **Advanced** | Can be overridden, but only when you understand the consequences |
| **Do not edit** | Internal token — manual editing breaks the framework |

---

## 4. Browser Support

Slashed requires modern CSS features. Effective minimum:

| Browser | Minimum version | Why |
|---|---|---|
| Chrome / Edge | 125+ | CSS `pow()` in `calc()` (generative scale) |
| Safari | 18.0+ | `oklch(from …)` relative color + `light-dark()` |
| Firefox | 129+ | `color-mix()` + relative color syntax |
| Chrome / Edge | 138+ (for auto-contrast) | `sign()` in `oklch()` for `--sf-color-text--on-{family}` |

**Graceful degradation:** color tokens live inside `@supports` blocks, so older engines receive sensible fallbacks (the `initial-value` from `@property`). The generative fluid scale requires CSS `pow()` — without it the token resolves to its `@property` initial value.

---

## 5. Token System — Colors

### 5.1 Activating dark mode

```html
<!-- Whole page dark -->
<html data-theme="dark">

<!-- Only this section dark (section-level theming) -->
<section data-theme="dark">

<!-- Force light for a sub-section inside a dark root -->
<article data-theme="light">
```

Without `data-theme` the framework auto-detects `prefers-color-scheme: dark`. The `--sf-is-dark` token (INTERNAL — do not set directly) is managed automatically.

**Smooth mode transition:**
```html
<html class="sf-theme-transition">
<!-- Adding this class animates color tokens when data-theme flips -->
<!-- Speed: --sf-theme-transition-duration (default 300ms) -->
```

### 5.2 Brand source colors (the only rebranding point)

Set these 6 `oklch()` tokens — dark mode and all derived palettes are computed automatically.

```css
/* Light mode — the only values you need to change for rebranding */
--sf-color-primary-source-light:   oklch(0.47 0.27 264)   /* Primary brand color */
--sf-color-secondary-source-light: oklch(0.22 0.04 264)   /* Secondary brand color */
--sf-color-tertiary-source-light:  oklch(0.42 0.22 295)   /* Tertiary brand color */
--sf-color-action-source-light:    oklch(0.50 0.22 235)   /* CTAs, links, focus ring */
--sf-color-neutral-source-light:   oklch(0.52 0.025 260)  /* Slightly chromatic grey */
--sf-color-base-source-light:      oklch(0.96 0.006 250)  /* Near-white base surface */

/* Dark mode — optional override (auto-computed by default) */
/* Auto formula: clamp(0.65, 0.95 - l*0.5, 0.88) for brand, chroma * 0.9 */
/* For base: clamp(0.16, 1.18 - l, 0.24) — near-white → near-dark */
--sf-color-primary-source-dark:    oklch(0.715 0.243 264)  /* Optional — auto-derived if omitted */
--sf-color-secondary-source-dark:  /* same — override or omit */
--sf-color-tertiary-source-dark:   /* same */
--sf-color-action-source-dark:     /* same */
--sf-color-neutral-source-dark:    /* same */
--sf-color-base-source-dark:       /* same — near-dark surface when omitted */
```

### 5.3 Status colors

```css
/* Light mode (knob) */
--sf-color-success-source-light:  oklch(0.50 0.16 145)  /* Green */
--sf-color-warning-source-light:  oklch(0.75 0.17 80)   /* Yellow — L=0.75 → dark text auto */
--sf-color-info-source-light:     oklch(0.48 0.18 235)  /* Blue */
--sf-color-danger-source-light:   oklch(0.48 0.22 12)   /* Red — destructive actions AND form validation errors */

/* Dark mode — optional override (same auto-derivation as brand) */
--sf-color-success-source-dark:   /* auto-derived if omitted */
--sf-color-warning-source-dark:   /* auto-derived if omitted */
--sf-color-info-source-dark:      /* auto-derived if omitted */
--sf-color-danger-source-dark:    /* auto-derived if omitted */
```

### 5.4 Resolved colors — use these in components

Auto-switch between light and dark modes. These are the tokens you reference in CSS.

```css
/* Brand */
--sf-color-primary          /* Active primary value */
--sf-color-secondary
--sf-color-tertiary
--sf-color-action           /* Focus ring, caret, links */
--sf-color-neutral          /* Text, borders, shadows */
--sf-color-base             /* Surfaces */
--sf-color-surface          /* Alias for --sf-color-base */

/* Status */
--sf-color-success   --sf-color-warning   --sf-color-danger
--sf-color-info
```

### 5.5 Text colors

```css
--sf-color-text             /* Primary body text */
--sf-color-text--muted      /* Captions, metadata, helper labels */
--sf-color-text--secondary  /* Between muted and primary */
--sf-color-text--placeholder /* Form field placeholders */
--sf-color-text--disabled   /* Disabled text */
--sf-color-text--inverse    /* Light text on dark bg, and vice versa */
--sf-color-heading          /* h1–h6 headings */

/* Auto-contrast on colored backgrounds (requires Chrome 138+ / Safari 18+) */
--sf-color-text--on-primary    /* Automatically white or black */
--sf-color-text--on-secondary
--sf-color-text--on-tertiary
--sf-color-text--on-action
--sf-color-text--on-neutral
--sf-color-text--on-success
--sf-color-text--on-warning
--sf-color-text--on-info
--sf-color-text--on-danger
--sf-color-text--on-inverse
--sf-color-text--on-base      /* Alias for --sf-color-text */
```

> **Important:** `--sf-color-text--on-*` tokens guarantee ≥ 3:1 contrast (WCAG AA Large Text). Colors in the mid-luminance range (L ≈ 0.52–0.67) may not reach 4.5:1 — that is a mathematical limitation of any binary black/white decision. Use `--sf-contrast-threshold` to tune.

### 5.6 Surface colors

```css
--sf-color-bg               /* Page background — base + 0.02 L */
--sf-color-inset            /* Recessed surface — form fields, pre, code */
--sf-color-raised           /* Elevated surface — cards on top of bg */
--sf-color-overlay          /* Semi-transparent overlay (base / 0.9) */
--sf-color-inverse          /* Full inversion of base */
--sf-color-dim              /* Modal scrim — oklch(0 0 0 / 0.5) */
--sf-color-white            /* Pure white constant — do not edit */
--sf-color-black            /* Pure black constant — do not edit */

/* Interaction states */
--sf-color-bg--hover        /* neutral / 0.08 */
--sf-color-bg--active       /* neutral / 0.12 */
--sf-color-bg--selected     /* action / 0.10 */
--sf-color-bg--focus        /* action / 0.06 */
--sf-color-bg--disabled     /* var(--sf-color-inset) */

/* Text selection and highlight */
--sf-color-selection-bg     /* Selection background — action / 0.28 (light) */
--sf-color-selection-text   /* Selection text color — inherit */
--sf-color-mark-bg          /* <mark> background — warning / 0.25 */
--sf-color-mark-text        /* <mark> text color — inherit */
```

### 5.7 Border and divider colors

```css
/* Borders */
--sf-color-border           /* Standard border */
--sf-color-border--subtle   /* Lighter */
--sf-color-border--strong   /* Heavier */
--sf-color-border--focus    /* Focus ring — var(--sf-color-action) */
--sf-color-border--disabled /* Disabled field — neutral / 0.5 */
--sf-color-border--translucent  /* neutral / 0.15 — overlay on images */

/* Divider — separator system (hr and .sf-divider) */
--sf-divider-width          /* var(--sf-border-width-1) */
--sf-divider-style          /* solid */
--sf-divider-color          /* var(--sf-color-border) */
--sf-divider-gap            /* var(--sf-space-m) */
```

### 5.8 Link colors

```css
--sf-color-link             /* Unvisited links — action with lightness clamped for contrast */
--sf-color-link--hover      /* Hover */
--sf-color-link--active     /* Active */
--sf-color-link--visited    /* Visited — action with +60° hue shift */
--sf-color-link--underline  /* action / 0.3 — underline color */
--sf-color-link--disabled   /* var(--sf-color-text--disabled) */

/* Underline geometry */
--sf-link-underline-offset:    0.15em   /* distance from text */
--sf-link-underline-thickness: auto     /* thickness — auto = font metrics */
--sf-link-external-marker:     " ↗"    /* marker for .sf-link-external */
```

### 5.9 Code colors

```css
--sf-color-code-bg          /* Inline code background — var(--sf-color-inset) */
--sf-color-code-text        /* Inline code text — auto-contrasts with code bg */

/* Scoped override hooks for code blocks — set these on .sf-code-block or your own class */
--sf-color-code-block-bg    /* falls back to --sf-color-code-bg when unset */
--sf-color-code-block-text  /* falls back to inherit when unset */
```

### 5.10 Semantic shade aliases

For each of the 6 brand families (`primary`, `secondary`, `tertiary`, `action`, `neutral`, `base`):

```css
--sf-color-{family}-superlight   /* 4% of color — subtle section backgrounds */
--sf-color-{family}-xlight       /* 20% — highlight backgrounds */
--sf-color-{family}-lighter      /* 65% — icon and tag backgrounds */
--sf-color-{family}-darker       /* button hover */
--sf-color-{family}-xdark        /* button active */
--sf-color-{family}-superdark    /* Darkest variant */
--sf-color-{family}--hover       /* Alias for -darker */
--sf-color-{family}--active      /* Alias for -xdark */
--sf-color-{family}-subtle       /* color / 0.10 — subtle backgrounds */
--sf-color-{family}-muted        /* color / 0.30 */
--sf-color-{family}-ghost        /* color / 0.05 — most subtle backgrounds */
```

> Shade aliases use `color-mix(in oklab)` relative to `--sf-color-surface` — they are surface-aware and correct on any background.

Examples: `--sf-color-primary-superlight`, `--sf-color-action-muted`, `--sf-color-neutral--hover`.

**Status families do not have numeric shades** — they use triplets only (see below).

### 5.11 Status triplets

For each status (`success`, `warning`, `info`, `danger`):

```css
--sf-color-{status}-subtle    /* color / 0.12 — alert background */
--sf-color-{status}-muted     /* color / 0.30 — border / icon */
--sf-color-{status}-strong    /* Status text — darker in light mode, lighter in dark */
```

Examples: `--sf-color-danger-subtle`, `--sf-color-warning-strong`.

### 5.12 Gradients

```css
--sf-gradient-primary:    /* 135° oklch — primary → darker primary */
--sf-gradient-secondary
--sf-gradient-tertiary
--sf-gradient-brand:      /* 135° oklch — primary → primary +30° hue — multicolor */
--sf-gradient-surface:    /* 180° oklab — surface → bg — subtle transition */

/* Edge fades — use as mask-image for overflow containers */
--sf-gradient-fade--r / --l / --t / --b
```

### 5.13 Shadows

```css
/* Box shadow */
--sf-shadow-none
--sf-shadow-xs              /* Chips, tags */
--sf-shadow-s               /* Dropdowns */
--sf-shadow-m               /* Cards, panels — default */
--sf-shadow-l               /* Large panels, sidebars */
--sf-shadow-xl              /* Modals, drawers */
--sf-shadow-2xl             /* Mega-cards */
--sf-shadow-inner           /* inset — input fields */

/* Text shadow */
--sf-text-shadow-none
--sf-text-shadow-s / -m / -l

/* Drop shadow (respects alpha — PNG, SVG) */
--sf-drop-shadow-s / -m / -l

/* Glow */
--sf-shadow-glow            /* 0 0 15px 2px color — luminous effect */
--sf-shadow-glow-color      /* Glow color — defaults to primary */

/* PUBLIC-ADVANCED controls */
--sf-shadow-strength        /* Base opacity. Auto-boosted in dark mode */
--sf-shadow-lightness       /* Shadow tint lightness (default 0.15) */
--sf-shadow-color           /* Computed shadow color — rarely override */
```

### 5.14 Core numeric palette

`core/tokens.css` ships 11 steps for each of the 6 brand families:

```css
--sf-color-{family}-50      /* Lightest */
--sf-color-{family}-100 … -900
--sf-color-{family}-950     /* Darkest */

/* Alpha variants */
--sf-color-{family}-a5 / -a10 / -a30 / -a50 / -a80

/* PUBLIC-ADVANCED: ramp shape */
--sf-palette-mix-50:  4%;    /* How far step 50 blends toward surface */
--sf-palette-mix-100: 8%;    /* … */
--sf-palette-mix-200: 20%;
--sf-palette-mix-300: 40%;
--sf-palette-mix-400: 65%;
/* step 500 is the source color itself; no separate mix knob exists */
--sf-palette-mix-600: 82%;
--sf-palette-mix-700: 62%;
--sf-palette-mix-800: 38%;
--sf-palette-mix-900: 18%;
--sf-palette-mix-950: 8%;     /* deepest step */
```

Status families (success/warning/info/danger) have **no numeric scale** — use their triplets.

### 5.15 Scrollbar and color scheme

```css
--sf-scrollbar-thumb        /* var(--sf-color-neutral) — scrollbar handle color */
--sf-scrollbar-track        /* transparent — scrollbar track color */
--sf-color-scheme           /* light dark — color-scheme declaration */
```

---

## 6. Token System — Typography

### 6.1 Font families

```css
/* Knob — edit directly */
--sf-font-body:     system-ui, -apple-system, sans-serif
--sf-font-heading:  var(--sf-font-body)    /* defaults to body */
--sf-font-display:  var(--sf-font-heading) /* defaults to heading */
--sf-font-mono:     ui-monospace, monospace

/* Ready-made system-font stacks (zero-cost, no @import) */
--sf-font-humanist:  "Seravek", "Gill Sans Nova", "Ubuntu", "Calibri"…
--sf-font-geometric: "Avenir", "Montserrat", "Corbel"…
--sf-font-slab:      "Rockwell", "Roboto Slab"…
```

### 6.2 OpenType and variable fonts

```css
/* Token-only (not applied by the framework automatically) */
--sf-font-features:  normal   /* e.g. "cv11", "ss01" */
--sf-font-variation: normal   /* e.g. "wght" 450, "opsz" 32 */
--sf-optical-sizing: auto
```

### 6.3 Font weights

```css
/* Primitive (knob) */
--sf-font-weight-light:    300
--sf-font-weight-normal:   400
--sf-font-weight-medium:   500
--sf-font-weight-semibold: 600
--sf-font-weight-bold:     700

/* Semantic roles (consumption) — edit these */
--sf-font-weight-body:        var(--sf-font-weight-normal)    /* body copy */
--sf-font-weight-heading:     var(--sf-font-weight-semibold)  /* h1–h6 */
--sf-font-weight-display:     var(--sf-font-weight-bold)      /* hero */
--sf-font-weight-interactive: var(--sf-font-weight-semibold)  /* buttons, nav */
--sf-font-weight-strong:      var(--sf-font-weight-bold)      /* <strong> */

/* State token */
--sf-current-font-weight: var(--sf-font-weight-bold)  /* .is-current in nav */
```

### 6.4 Text sizes (fluid, generative)

Generated by `clamp()` from a modular scale. **Do not edit directly** — change `--sf-text-ratio-*` or `--sf-text-base-*` (PUBLIC-ADVANCED).

```css
/* Body scale */
--sf-text-2xs   /* ~0.51–0.56rem — legal, metadata */
--sf-text-xs    /* ~0.64–0.70rem — captions */
--sf-text-s     /* ~0.80–0.94rem — small UI labels */
--sf-text-m     /* ~1.00–1.25rem — base body */
--sf-text-l     /* ~1.25–1.67rem — lead paragraphs */
--sf-text-xl    /* ~1.56–2.22rem — small section headings */
--sf-text-2xl   /* ~1.95–2.96rem — h3 */
--sf-text-3xl   /* ~2.44–3.95rem — h2 */
--sf-text-4xl   /* ~3.05–5.27rem — h1 */

/* Display scale (hero) — separate base ~2.4–3rem */
--sf-text-display-s / -m / -l
```

### 6.5 Per-size typography sub-properties

Pattern: `--sf-text-{size}-{property}`

```css
--sf-text-{size}-line-height     /* relaxed → tight as size grows */
--sf-text-{size}-font-weight     /* body for small, heading for large */
--sf-text-{size}-letter-spacing  /* tight for large, normal for small */
--sf-text-{size}-max-width       /* line length in ch (or none) */

/* Explicit max-width knobs by size */
--sf-text-2xs-max-width / --sf-text-xs-max-width / --sf-text-s-max-width
--sf-text-m-max-width / --sf-text-l-max-width / --sf-text-xl-max-width
--sf-text-2xl-max-width / --sf-text-3xl-max-width / --sf-text-4xl-max-width
```

Not applied automatically — opt in: `line-height: var(--sf-text-xl-line-height)`.

### 6.6 Leading (line-height)

```css
--sf-leading-tight:   1.1    /* display headings */
--sf-leading-snug:    1.3    /* h3–h4 */
--sf-leading-normal:  1.5    /* body */
--sf-leading-relaxed: 1.625  /* small text */

/* Display-specific line-heights (not auto-applied) */
--sf-display-s-line-height: var(--sf-leading-tight)
--sf-display-m-line-height: 1.05
--sf-display-l-line-height: 1
```

### 6.7 Tracking (letter-spacing)

```css
--sf-tracking-tight:   -0.025em  /* large headings */
--sf-tracking-normal:   0        /* body */
--sf-tracking-wide:     0.025em  /* buttons, caps */
--sf-tracking-wider:    0.05em
--sf-tracking-widest:   0.1em    /* legal, all-caps */
--sf-font-numeric:      tabular-nums  /* prices, dates, numeric columns */
```

### 6.8 Heading aliases h1–h6

Pattern: `--sf-h1-{property}` through `--sf-h6-{property}`

```css
--sf-h1-size:           var(--sf-text-4xl)
--sf-h1-line-height:    var(--sf-leading-tight)
--sf-h1-font-weight:    var(--sf-font-weight-heading)
--sf-h1-letter-spacing: var(--sf-tracking-tight)
--sf-h1-max-width:      none   /* e.g. 20ch — caps heading line length */

--sf-h2-size:           var(--sf-text-3xl)   /* tracking-tight */
--sf-h2-max-width:      none
--sf-h3-size:           var(--sf-text-2xl)   /* tracking-normal */
--sf-h3-max-width:      none
--sf-h4-size:           var(--sf-text-xl)    /* tracking-normal */
--sf-h4-max-width:      none
--sf-h5-size:           var(--sf-text-l)     /* tracking-normal */
--sf-h5-max-width:      none
--sf-h6-size:           var(--sf-text-m)     /* tracking-wide */
--sf-h6-max-width:      none
/* similarly: -line-height, -font-weight, -letter-spacing for each */
```

### 6.9 Global heading aliases

```css
--sf-heading-font-family: var(--sf-font-heading)
--sf-heading-color:       var(--sf-color-heading)
--sf-heading-text-wrap:   balance
```

### 6.10 Body aliases

```css
--sf-body-font-family:   var(--sf-font-body)
--sf-body-font-size:     var(--sf-text-m)
--sf-body-font-weight:   var(--sf-font-weight-body)
--sf-body-line-height:   var(--sf-leading-normal)
--sf-body-color:         var(--sf-color-text)
--sf-body-text-wrap:     pretty
--sf-body-strong-weight: var(--sf-font-weight-strong)
--sf-body-em-style:      italic
--sf-code-font-size:     0.875em
```

---

## 7. Token System — Spacing

### 7.1 Static

```css
--sf-space-none: 0    /* reset */
--sf-space-px:   1px  /* hairline spacer */
```

### 7.2 Fluid (generative modular scale)

`clamp()` with a modular scale. **Do not edit directly.** Change `--sf-space-ratio-*` or `--sf-space-base-*` (PUBLIC-ADVANCED).

```css
--sf-space-2xs   /* ~0.32–0.56rem */
--sf-space-xs    /* ~0.40–0.75rem */
--sf-space-s     /* ~0.50–1.00rem */
--sf-space-m     /* ~1.00–2.00rem — base */
--sf-space-l     /* ~1.25–2.67rem */
--sf-space-xl    /* ~1.56–3.56rem */
--sf-space-2xl   /* ~1.95–4.74rem */
--sf-space-3xl   /* ~2.44–6.32rem */
--sf-space-4xl   /* ~3.05–8.42rem */
```

### 7.3 Semantic gap hierarchy — edit these

```css
--sf-gap:           var(--sf-space-m)  /* loose gap — between components (cluster, grid…) */
--sf-content-gap:   var(--sf-space-s)  /* tight gap — within content (stack, flow, prose) */
--sf-gutter:        var(--sf-space-l)  /* wide gutter — page/section edges (center) */
--sf-component-pad: var(--sf-space-m)  /* button, card padding */
--sf-field-block:   var(--sf-space-l)  /* vertical spacing for form field groups */
```

### 7.4 Section padding

```css
--sf-section-pad:      var(--sf-section-pad--m)  /* Alias for -m — default */
--sf-section-pad--xs   /* var(--sf-space-xl)  × section-scale */
--sf-section-pad--s    /* var(--sf-space-2xl) × section-scale */
--sf-section-pad--m    /* var(--sf-space-3xl) × section-scale */
--sf-section-pad--l    /* var(--sf-space-4xl) × section-scale */
--sf-section-pad--xl   /* space-4xl × 1.5 × section-scale */
--sf-section-pad--2xl  /* space-4xl × 2   × section-scale */
```

**Layout pattern — two approaches for horizontal gutters:**

```html
<!-- Standard: container owns the horizontal gutter -->
<section class="sf-section">
  <div class="sf-container">…</div>
</section>

<!-- Alternative: section owns the gutter (skip nested container) -->
<section class="sf-section sf-section--guttered">
  <div class="sf-stack">…</div>
</section>
```

Use `sf-section--guttered` when the section contains a single layout without needing per-column width control. Use `sf-container` (nested inside the section) when you need `--narrow`, `--wide`, or multiple width zones in one section.

### 7.5 Icons and UI sizes

```css
/* Icons — em-based, scale with surrounding font context */
--sf-icon-xs:  0.875em    --sf-icon-s:  1em
--sf-icon-m:   1.5em      --sf-icon-l:  2em
--sf-icon-xl:  3em         --sf-icon-2xl: 4em

/* UI sizes — rem-based, fixed (buttons, inputs, touch targets) */
--sf-size-xs:  1.5rem   /* 24px */
--sf-size-s:   2rem     /* 32px */
--sf-size-m:   2.5rem   /* 40px */
--sf-size-l:   2.75rem  /* 44px — WCAG 2.5.5 touch target */
--sf-size-xl:  3.5rem   /* 56px */
```

---

## 8. Token System — Layout & Primitives

### 8.1 Containers and ratios

```css
/* Containers */
--sf-container-narrow:  38rem   /* forms, dialogs */
--sf-container-prose:   65ch    /* optimal reading width */
--sf-container-default: 75rem   /* 1200px */
--sf-container-wide:    90rem   /* 1440px */
--sf-container-full:    100%    /* full width */

/* Ratios — use with aspect-ratio: var(--sf-ratio-video) */
--sf-ratio-square:   1
--sf-ratio-video:    16 / 9
--sf-ratio-cinema:   21 / 9
--sf-ratio-4-3:      4 / 3
--sf-ratio-3-2:      3 / 2
--sf-ratio-portrait: 3 / 4
--sf-ratio-golden:   1.618 / 1
```

### 8.2 Borders

```css
/* Widths */
--sf-border-width-hairline: 0.5px   /* Retina only — rounds to 1px on 1× DPR */
--sf-border-width-1:  calc(1px × border-scale)
--sf-border-width-2 / -3 / -4
--sf-border-scale:    1    /* Multiplier — 0 = borderless, 2 = heavy */
--sf-border-style:    solid

/* Shorthands */
--sf-border:        1px solid --sf-color-border
--sf-border-subtle: 1px solid --sf-color-border--subtle
--sf-border-strong: 1px solid --sf-color-border--strong
```

### 8.3 Border radius

All steps multiplied by `--sf-radius-scale` (except `full` and `pill`).

```css
--sf-radius-none             /* 0 */
--sf-radius-2xs / -xs        /* 1px / 2px */
--sf-radius-s                /* 4px */
--sf-radius-m                /* 8px — cards, buttons */
--sf-radius-l                /* 12px */
--sf-radius-xl               /* 16px */
--sf-radius-2xl / -3xl / -4xl /* 24px / 32px / 48px */
--sf-radius-full             /* 9999px — NOT scaled — always circle/capsule */
--sf-radius-pill             /* Alias for full — capsule badge/chip */
--sf-radius-outer            /* radius-m + component-pad — concentric helper */
--sf-radius-scale            /* Multiplier — 0 = sharp, 2 = very rounded */
```

### 8.4 Z-index

Semantic ladder — no magic numbers.

```css
--sf-z-below:    -1
--sf-z-base:      0
--sf-z-raised:    1
--sf-z-sticky:   1000  /* sticky headers / sidebars */
--sf-z-fixed:    1010  /* fixed app chrome (navbar, FAB) */
--sf-z-dropdown: 1020  /* menus — clears sticky + fixed */
--sf-z-overlay:  1030  /* scrims / non-top-layer backdrops */
--sf-z-modal:    1040  /* dialogs (non-top-layer fallback) */
--sf-z-toast:    1050  /* transient notifications */
--sf-z-tooltip:  1060  /* tooltips — above everything */
```

> Native `<dialog>` and `[popover]` render in the browser top layer — independent of z-index. The `modal`/`tooltip` rungs are fallbacks for custom implementations.

### 8.5 Layout primitive override knobs

Each primitive has its own knobs. Override locally (`style="--sf-cluster-gap: 2rem"`) or globally (`:root`).

```css
/* Stack */
--sf-stack-gap: var(--sf-content-gap)

/* Box */
--sf-box-padding:      var(--sf-space-m)
--sf-box-border-width: 0
--sf-box-border-color: var(--sf-color-border)

/* Center */
--sf-center-max:    var(--sf-container-default)
--sf-center-gutter: var(--sf-gutter)

/* Cluster */
--sf-cluster-gap:     var(--sf-gap)
--sf-cluster-align:   center
--sf-cluster-justify: flex-start

/* Sidebar */
--sf-sidebar-gap:       var(--sf-gap)
--sf-sidebar-width:     18rem      /* sidebar panel */
--sf-sidebar-min-width: 50%        /* minimum content column */

/* Switcher */
--sf-switcher-gap:       var(--sf-gap)
--sf-switcher-threshold: 30rem     /* width at which row → column */

/* Grid (auto-fill, breakpoint-free) */
--sf-grid-gap:     var(--sf-gap)
--sf-grid-min:     16rem           /* minimum column width */
--sf-grid-min-xs / --sf-grid-min-s / --sf-grid-min-m
--sf-grid-min-l / --sf-grid-min-xl / --sf-grid-min-2xl   /* 10rem … 28rem */

/* Equal columns */
--sf-equal-gap:        var(--sf-gap)
--sf-equal-min-col:    16rem
--sf-equal-min-col-2 / --sf-equal-min-col-3
--sf-equal-min-col-4 / --sf-equal-min-col-6

/* Cover */
--sf-cover-min-height: 100dvh
--sf-cover-padding:    var(--sf-section-pad)

/* Frame (ratio box) */
--sf-frame-ratio: 16 / 9

/* Reel (horizontal scroll) */
--sf-reel-item-width: max-content
--sf-reel-gap:        var(--sf-gap)
--sf-reel-height:     auto

/* Imposter (centered overlay) */
--sf-imposter-margin: var(--sf-space-m)

/* Bento */
--sf-bento-cols-default: 4
--sf-bento-gap:          var(--sf-gap)
--sf-bento-row-default / --sf-bento-row-compact / --sf-bento-row-tall
                                    /* 10rem / 6rem / 16rem */

/* Content grid (breakout pattern) */
--sf-content-width:  var(--sf-container-default)
--sf-breakout-width: var(--sf-container-wide)

/* Prose */
--sf-prose-paragraph:        var(--sf-content-gap)
--sf-prose-heading-gap:      var(--sf-space-s)
--sf-prose-list-gap:         var(--sf-space-xs)
--sf-prose-block-margin:     var(--sf-space-m)
--sf-prose-media-margin:     var(--sf-space-m)
--sf-prose-media-radius:     var(--sf-radius-m)
--sf-prose-figure-margin:    var(--sf-space-l)
--sf-prose-marker-color:     var(--sf-color-primary)
--sf-prose-figcaption-size:  var(--sf-text-s)
/* also: -blockquote-padding, -blockquote-border, -hr-margin, -nested-list-gap, -table-pad */

/* Alternate (zigzag layout) */
--sf-alternate-gap:       var(--sf-content-gap)
--sf-alternate-inner-gap: var(--sf-gap)

/* Icon box (.sf-icon--boxed) */
--sf-icon-box-pad:    0.5em
--sf-icon-box-radius: var(--sf-radius-s)
--sf-icon-box-bg:     var(--sf-color-inset)
--sf-icon-box-border: var(--sf-border-width-1) solid var(--sf-color-border)
```

### 8.6 Macro override knobs

```css
--sf-flow-space:             var(--sf-content-gap)  /* .sf-flow > * + * gap */
--sf-line-clamp:             3          /* default line count for .sf-line-clamp-N */
--sf-aspect:                 16 / 9    /* .sf-aspect ratio */
--sf-scroll-shadow-size:     2rem       /* .sf-scroll-shadow, .sf-overflow-fade */
--sf-content-intrinsic-size: 500px      /* .sf-content-auto placeholder size */
--sf-surface-color:          var(--sf-color-base)  /* .sf-surface input color */

/* Scrim (.sf-scrim) */
--sf-scrim-color:      oklch(0 0 0 / 0.55)
--sf-scrim-direction:  to top
--sf-scrim-gradient:   linear-gradient(…)   /* composed — override for multi-stop */
--sf-scrim-text-shadow: 0 1px 3px oklch(0 0 0 / 0.6)  /* .sf-text-protect */
```

### 8.7 Header and safe area

```css
/* Header */
--sf-header-height-mobile:  3.5rem
--sf-header-height-desktop: 5rem
--sf-header-height:         clamp(…)    /* fluid — reference this in CSS */
--sf-sticky-offset-mobile:  var(--sf-header-height-mobile)
--sf-sticky-offset-desktop: var(--sf-header-height-desktop)
--sf-sticky-offset:         clamp(…)    /* fluid offset for top: var(--sf-sticky-offset) */

/* Safe area (notches, home indicators) */
--sf-safe-top / --sf-safe-bottom / --sf-safe-left / --sf-safe-right
                                    /* env(safe-area-inset-*) */
```

### 8.8 Replaced elements (img, video)

```css
--sf-object-fit:      cover   /* default fit for img and video */
--sf-object-position: 50% 50% /* position — override: style="--sf-object-position: top" */
```

### 8.9 Print

```css
--sf-print-page-margin: 2cm
--sf-print-page-size:   a4
--sf-print-base-size:   11pt
```

---

## 9. Token System — Motion & Interaction

### 9.1 Durations

All (except `none`) are multiplied by `--sf-motion-scale`.

```css
--sf-duration-none:    0ms
--sf-duration-instant: 100ms   /* micro-interactions */
--sf-duration-fast:    150ms   /* hover, tooltips */
--sf-duration-normal:  250ms   /* buttons, cards */
--sf-duration-slow:    400ms   /* modals, accordions */
--sf-duration-slower:  600ms   /* page transitions */

--sf-theme-transition-duration: 300ms × motion-scale  /* .sf-theme-transition */
```

### 9.2 Easing

```css
--sf-ease-linear           /* loading bars */
--sf-ease-out              /* entering elements — natural deceleration */
--sf-ease-in               /* exiting elements */
--sf-ease-in-out           /* movements, sliders */
--sf-ease-spring           /* springy — cards, buttons */
--sf-ease-elastic          /* stronger overshoot */
--sf-ease-bounce           /* bouncy — playful UI */
--sf-ease-overshoot        /* slight overshoot — modals */
```

### 9.3 Transition presets

Ready-made `transition` values. **Never use `transition: all`.**

```css
--sf-transition-colors       /* color, bg, border, text-decoration-color, fill, stroke */
--sf-transition-form-field   /* colors at normal + border/shadow/opacity at fast (focus rings) */
--sf-transition-transform    /* transform only */
--sf-transition-opacity      /* opacity only */
--sf-transition-shadow       /* box-shadow only */
--sf-transition-fast         /* all interactive properties at fast duration */
--sf-transition-slow         /* all interactive properties at slow duration */
--sf-transition-enter        /* entrance: normal + ease-out */
--sf-transition-exit         /* exit: fast + ease-in */
--sf-transition-overlay      /* overlay + display with allow-discrete — for top-layer dialog/popover */
```

### 9.4 Animation presets

Ready-made `animation` values — keyframe + duration + easing + fill-mode.

```css
--sf-animation-fade-in / -fade-out
--sf-animation-slide-in-up / -down / -left / -right
--sf-animation-scale-up / -scale-down
--sf-animation-ping          /* Notification dot, live indicator */
--sf-animation-blink         /* Text cursor, critical alert */
--sf-animation-float         /* Decorative hero elements */
--sf-animation-spin          /* Loading spinner */
--sf-animation-shimmer       /* Skeleton loader */
--sf-animation-color-pulse   /* Live status badge */

/* Stagger delays — scaled by motion-scale */
--sf-animation-delay-1 / -2 / -3 / -4 / -5   /* 75ms … 375ms */
```

### 9.5 Scroll-driven animations

```css
/* Attach to animation-range on your own scroll-timeline */
--sf-scroll-timeline-range-start: entry 0%
--sf-scroll-timeline-range-end:   cover 30%
```

### 9.6 Mask scrim (edge fade)

```css
--sf-mask-scrim-start: var(--sf-space-l)  /* fade-in extent at left/top edge */
--sf-mask-scrim-end:   var(--sf-space-l)  /* fade-in extent at right/bottom edge */
```

### 9.7 Focus ring

```css
--sf-focus-ring-width:  2px
--sf-focus-ring-offset: 2px
--sf-focus-ring-style:  solid
--sf-focus-ring-color:  var(--sf-color-action)
--sf-focus-ring-shadow: /* composite box-shadow — implement focus via shadow */
                        0 0 0 offset var(--sf-color-bg),
                        0 0 0 (offset + width) var(--sf-color-action)
```

### 9.8 Remaining interaction states

```css
--sf-caret-color:           var(--sf-color-action)
--sf-touch-target:          var(--sf-size-l)    /* 44px — WCAG 2.5.5 */
--sf-opacity-disabled:      0.45
--sf-state-pending-opacity: 0.7                  /* async operations */
--sf-opacity-muted:         0.5
--sf-blur:                  12px                 /* frosted glass backdrop-filter */
```

### 9.9 State flags (PUBLIC-ADVANCED — Style Queries)

Used by `.is-active`, `.is-current`, etc. in `core/states.css`. Allow components to react to ancestor states via CSS Style Queries.

```css
--sf-is-active:  0   /* 1 = active element (.is-active) */
--sf-is-current: 0   /* 1 = current page (.is-current in nav) */
--sf-is-pressed: 0   /* 1 = pressed */
--sf-is-open:    0   /* 1 = open (accordion, dropdown) */
```

### 9.10 Form field tokens

```css
--sf-field-required-marker: " *"               /* required field marker */
--sf-link-external-marker:  " ↗"              /* marker for .sf-link-external */

/* Scoped override hooks — set per-field/form to override global borders/text */
--sf-field-border-color     /* set by validation states (error/success/warning/info/danger) */
--sf-field-text-color       /* set by validation states for text color feedback */
```

Component tokens from `optional/tokens.components.css`:

```css
/* Form fields */
--sf-field-radius:          var(--sf-radius-m)
--sf-field-padding-block:   var(--sf-space-xs)
--sf-field-padding-inline:  var(--sf-space-s)

/* Buttons */
--sf-button-radius:         var(--sf-radius-m)
--sf-button-padding-block:  var(--sf-space-xs)
--sf-button-padding-inline: var(--sf-space-m)
```

---

## 10. Global Scale Multipliers

One token changes the entire design. Override on `:root`. All are PUBLIC-ADVANCED.

```css
--sf-radius-scale:       1  /* 0 = sharp UI, 2 = very rounded */
--sf-motion-scale:       1  /* 0 = no animations (prefers-reduced-motion) */
--sf-border-scale:       1  /* 0 = borderless, 2 = heavy borders */
--sf-section-scale:      1  /* 0.8 = denser layout */
--sf-space-scale:        1  /* global fluid spacing multiplier */
--sf-text-scale:         1  /* global body type scale multiplier */
--sf-text-display-scale: 1  /* global display type scale multiplier */
```

---

## 11. PUBLIC-ADVANCED Tokens

Stable (same SemVer guarantee as PUBLIC), but niche or powerful. Override with care.

### 11.1 Generative scale engine (fluid inputs)

Overriding any of these reshapes the entire fluid scale. No need to edit individual `--sf-text-*` or `--sf-space-*` tokens.

```css
/* Viewport range for interpolation */
--sf-fluid-min-vw: 22.5    /* in rem (360px) */
--sf-fluid-max-vw: 90      /* in rem (1440px) */

/* Body type scale */
--sf-text-ratio-min:   1.25    /* modular ratio at min viewport */
--sf-text-ratio-max:   1.333   /* modular ratio at max viewport */
--sf-text-base-min:    1       /* --sf-text-m on mobile (rem) */
--sf-text-base-max:    1.25    /* --sf-text-m on desktop (rem) */

/* Display scale */
--sf-text-display-base-min: 2.4   /* --sf-text-display-s on mobile */
--sf-text-display-base-max: 3     /* --sf-text-display-s on desktop */

/* Space scale */
--sf-space-ratio-min:  1.25
--sf-space-ratio-max:  1.333
--sf-space-base-min:   1   /* --sf-space-m on mobile */
--sf-space-base-max:   2   /* --sf-space-m on desktop */
```

### 11.2 LumLocker

Aligns the luminance (L) of all 4 brand colors to a single shared value. Preserves each color's hue and chroma. Useful when a brand palette has colors with wildly different L values.

```css
--sf-lumlocker: 0.65    /* target lightness */
```

Activation: add `data-lumlocker` attribute to `<html>`.

```html
<html data-lumlocker>
```

Neutral and base are **excluded** from LumLocker by design.

### 11.3 Contrast tuning

```css
--sf-contrast-bias:      0    /* positive = more text contrast (darker/lighter) */
--sf-contrast-threshold: 0.6  /* L crossover for text-on-color: > threshold → dark text */
```

Example — if your primary brand color has L ≈ 0.6 and you prefer white text:
```css
@layer slashed.overrides {
  .sf-surface--primary { --sf-contrast-threshold: 0.55; }
}
```

### 11.4 Leading taper

```css
--sf-leading-taper: 0   /* 0 = off. e.g. 0.02 = smooth tightening up the scale */
```

Each step up the type scale subtracts `step-index × taper` from that step's default line-height.

### 11.5 Palette mix percentages

```css
/* Shape of the 50–950 numeric palette ramp */
--sf-palette-mix-50:  4%    /* how far step 50 blends toward surface */
--sf-palette-mix-100: 8%
--sf-palette-mix-200: 20%
--sf-palette-mix-300: 40%
/* … similarly for all steps */
```

### 11.6 Scroll and mask

```css
--sf-scroll-timeline-range-start: entry 0%
--sf-scroll-timeline-range-end:   cover 30%
--sf-mask-scrim-start: var(--sf-space-l)
--sf-mask-scrim-end:   var(--sf-space-l)
```

### 11.7 Print

```css
--sf-print-page-margin: 2cm
--sf-print-page-size:   a4
--sf-print-base-size:   11pt
```

### 11.8 Safe area insets

```css
--sf-safe-top / --sf-safe-bottom / --sf-safe-left / --sf-safe-right
                                    /* env(safe-area-inset-*) */
```

### 11.9 Focus ring shadow

```css
--sf-focus-ring-shadow  /* composite box-shadow — use in CSS when you don't want outline */
```

---

## 12. When to Use Which Tokens

### Use `consumption` tokens in components

```css
.card {
    background: var(--sf-color-raised);
    padding: var(--sf-component-pad);
    border-radius: var(--sf-radius-m);
    box-shadow: var(--sf-shadow-m);
    border: var(--sf-border-subtle);
    transition: var(--sf-transition-shadow);
}

.card:hover {
    box-shadow: var(--sf-shadow-l);
}
```

### Use semantic gap tokens, not space tokens directly

```css
/* Correct — loose gap between components */
.feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(var(--sf-grid-min-m), 1fr));
    gap: var(--sf-gap);
}

/* Correct — tight gap within content */
.article-body {
    display: flex;
    flex-direction: column;
    gap: var(--sf-content-gap);
}

/* Avoid — hardcoded */
.card { gap: 1.5rem; }
```

### Local overrides via knobs

```css
/* Don't create new tokens — override existing knobs */
.hero {
    --sf-section-pad: var(--sf-section-pad--xl);
}

.tight-grid {
    --sf-grid-gap: var(--sf-space-s);
    --sf-grid-min: var(--sf-grid-min-xs);
}

.wide-cluster {
    --sf-cluster-gap: var(--sf-space-l);
}
```

### Components with auto-contrast

```css
/* On colored backgrounds — use text--on-* */
.badge--primary {
    background: var(--sf-color-primary);
    color: var(--sf-color-text--on-primary);   /* Automatically white or black */
}

/* Status alert */
.alert--danger {
    background: var(--sf-color-danger-subtle);
    border: 1px solid var(--sf-color-danger-muted);
    color: var(--sf-color-danger-strong);
}

/* Link with proper contrast */
a {
    color: var(--sf-color-link);
    text-decoration-color: var(--sf-color-link--underline);
}
a:visited { color: var(--sf-color-link--visited); }
```

### Animations — use presets

```css
.modal {
    animation: var(--sf-animation-scale-up);
    /* For top-layer (native <dialog>) add transition-overlay */
    transition: var(--sf-transition-overlay),
                opacity var(--sf-duration-normal) var(--sf-ease-out);
}

.toast {
    animation: var(--sf-animation-slide-in-up);
}

/* Staggered list */
.list-item:nth-child(1) { animation-delay: var(--sf-animation-delay-1); }
.list-item:nth-child(2) { animation-delay: var(--sf-animation-delay-2); }
```

### Section-level dark mode

```html
<!-- Framework automatically sets the correct background and text color
     when data-theme is on a non-root element -->
<section data-theme="dark" class="promo">
    <!-- --sf-color-bg, --sf-color-text etc. are automatically dark -->
    <!-- background-color and color set by :where([data-theme]:not(:root, html)) -->
</section>
```

---

## 13. Minimal Recipes — Rebranding

### Minimum rebranding (6 tokens)

```css
:root {
    --sf-color-primary-source-light:   oklch(0.50 0.25 30);    /* Your primary color */
    --sf-color-secondary-source-light: oklch(0.25 0.05 30);    /* Secondary color */
    --sf-color-tertiary-source-light:  oklch(0.45 0.20 60);    /* Tertiary color */
    --sf-color-action-source-light:    oklch(0.52 0.22 220);   /* CTAs, links, focus */
    --sf-color-neutral-source-light:   oklch(0.50 0.02 30);    /* Grey (slightly tinted) */
    --sf-color-base-source-light:      oklch(0.97 0.003 30);   /* Near-white */
}
/* Dark mode computed automatically */
```

### Typical project customisation

```css
:root {
    /* Fonts */
    --sf-font-body:    "Inter", system-ui, sans-serif;
    --sf-font-heading: "Cal Sans", var(--sf-font-body);

    /* Visual style — one token = global change */
    --sf-radius-scale:  0;      /* Sharp corners */
    --sf-motion-scale:  0;      /* No animations */
    --sf-border-scale:  0;      /* No borders */
    --sf-section-scale: 0.8;    /* Denser layout */
}
```

### Luminance alignment (LumLocker)

```html
<html data-lumlocker>
```
```css
:root {
    --sf-lumlocker: 0.60;  /* Adjust for your palette */
}
```

### Local per-element override

```css
.hero {
    --sf-section-pad: var(--sf-section-pad--xl);
    --sf-grid-min: 20rem;
}

.compact-nav {
    --sf-cluster-gap: var(--sf-space-xs);
    --sf-cluster-align: center;
}
```

### Full dark mode control for a single color

```css
:root {
    --sf-color-primary-source-dark: oklch(0.80 0.15 30);  /* Manual override */
    /* All other colors still auto-computed */
}
```

---

## 14. Best Practices

**1. Never hardcode visual values.** If you want `8px`, use `var(--sf-radius-m)`. If you want `1.5rem`, use `var(--sf-space-m)`. Every hardcoded value breaks consistency and dark mode.

**2. Don't create your own tokens for values that already exist.** The framework has `--sf-space-m` — don't create `--my-padding`. Instead override an existing knob: `--sf-component-pad: var(--sf-space-m)`.

**3. Use semantic tokens, not primitive ones.** Prefer `var(--sf-gap)` over `var(--sf-space-m)` in a grid, because the semantic token lets you change every loose gap globally without touching components.

**4. Use `calc()` for variations, not new tokens.**
```css
/* Correct */
.spacious-section { padding-block: calc(var(--sf-section-pad) * 1.5); }

/* Wrong — don't invent new tokens; compose with calc() instead */
:root { --my-section-pad-xl-plus: 8rem; }
```

**5. `knob` tokens are for setting; `consumption` tokens are for using.**
- You edit `--sf-color-primary-source-light` (knob).
- You reference `--sf-color-primary` (consumption) in component CSS.

**6. Dark mode is free — don't fight it.** Don't set `--sf-color-primary-source-dark` unless you want full manual control. The framework handles it.

**7. One multiplier = global redesign.**
- `--sf-radius-scale: 0` → sharp design system.
- `--sf-motion-scale: 0` → respects `prefers-reduced-motion`.
- `--sf-border-scale: 0` → borderless design.

**8. Layout override knobs > new classes.** Instead of creating `.grid--tight`, set `--sf-grid-gap: var(--sf-space-s)` on the relevant element.

**9. Never edit `INTERNAL` tokens.** `--sf-is-dark` is managed by the framework. Editing it manually breaks dark mode and all derived computations.

**10. `--sf-color-text--on-*` tokens give WCAG AA Large for free.** Always use them on colored backgrounds instead of manually choosing white or black. For body text on color, tune `--sf-contrast-threshold` or override the token directly.

**11. Section-level theming works via `data-theme`.** Don't toggle modes by manually manipulating CSS variables in JavaScript — change `data-theme` instead.

**12. Don't edit the generative scale directly.** `--sf-text-*` and `--sf-space-*` tokens are computed from a modular scale. Change the inputs (`--sf-text-ratio-max`, etc.) or override a specific step only if you need to pin one value.

---

## Quick Reference for LLMs

| What you want to do | Token / approach |
|---|---|
| Rebranding | 6 `--sf-color-*-source-light` tokens |
| Font | `--sf-font-body`, `--sf-font-heading` |
| Sharp corners globally | `--sf-radius-scale: 0` |
| Disable animations | `--sf-motion-scale: 0` |
| Dark mode (whole page) | `<html data-theme="dark">` |
| Dark mode (section) | `<section data-theme="dark">` |
| Smooth theme transition | `<html class="sf-theme-transition">` |
| Align brand luminance | `<html data-lumlocker>` + `--sf-lumlocker: 0.65` |
| Text on colored background | `--sf-color-text--on-{color}` |
| Disabled / placeholder text | `--sf-color-text--disabled` / `--sf-color-text--placeholder` |
| Gap between cards in a grid | `--sf-gap` |
| Gap within article / content | `--sf-content-gap` |
| Section padding | `--sf-section-pad` / `--sf-section-pad--xl` |
| Card shadow | `--sf-shadow-m` |
| Focus ring | `--sf-focus-ring-shadow` |
| Link with contrast | `--sf-color-link`, `--sf-color-link--visited` |
| Local layout override | `--sf-grid-gap`, `--sf-cluster-gap`, etc. |
| Entrance animation | `animation: var(--sf-animation-fade-in)` |
| Modal with native `<dialog>` | `--sf-transition-overlay` + `animation: var(--sf-animation-scale-up)` |
| Body text | `--sf-text-m`, `--sf-leading-normal` |
| h1 heading | `--sf-h1-size` (defaults to `--sf-text-4xl`) |
| Status alert | `--sf-color-{status}-subtle` + `-muted` + `-strong` |
| Skeleton loader | `animation: var(--sf-animation-shimmer)` |
| Frosted glass | `backdrop-filter: blur(var(--sf-blur))` |
| Modal backdrop | `--sf-color-dim` |
| Brand gradient | `--sf-gradient-primary` / `--sf-gradient-brand` |
| Image ratio | `aspect-ratio: var(--sf-ratio-video)` |
| Tabular numbers / prices | `font-variant-numeric: var(--sf-font-numeric)` |
| Notch / home indicator padding | `padding-top: var(--sf-safe-top)` |
| Full numeric color ramp | `core/tokens.css` → `--sf-color-primary-500` |
| Reshape fluid scale | change `--sf-text-ratio-max` / `--sf-space-base-max` |
