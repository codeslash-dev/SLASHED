# SLASHED — Optimal Bundle: Complete Index

> **Bundle:** `slashed.optimal.css` / `slashed.optimal.min.css` / `slashed.optimal.flat.css`
> **Framework version:** `0.5.0-beta5`
> **Tagline:** **S**tandalone · **L**ean · **A**gnostic · **S**tructured · **H**ybrid · **E**xplicit · **D**eterministic
> **Nature:** A cascade-layer CSS framework. No build step required to consume it, no Node runtime, no runtime dependencies — plain CSS.

This document is an exhaustive index of **everything** shipped in the *optimal* bundle variant: every source file, every CSS feature relied upon, every cascade layer, every design token / CSS variable (all **812**), every class (**173** `.sf-*`, **40** `.is-*`, **8** unprefixed), the token-stability API contract, the theming/dark-mode system, browser support, and the build artifacts.

The optimal bundle is the **recommended** variant for most sites: it is the `essential` core plus the populated optional modules (palette, extended sizes, classless forms, legacy fallbacks). It deliberately **excludes** the still-empty `components`, `tokens.components`, and `utilities` stubs (those appear only in `*-components`, `*-utilities`, and `full`).

---

## 1. What "optimal" contains — file manifest

The bundle is a plain concatenation of these 17 source files, in this order (from `bundle.config.json` → `dist/slashed.optimal.css`):

| # | File | Layer it populates | Role |
|---|------|--------------------|------|
| 1 | `core/layers.css` | *(declares all layers)* | **Must load first.** The single `@layer` statement that fixes cascade order. |
| 2 | `core/tokens.css` | `slashed.tokens` | The core design-token system: colors (`@property` sources, resolved, derived), typography, spacing, shadows, motion, z-index, etc. |
| 3 | `core/tokens.layout.css` | `slashed.tokens` | Per-primitive layout override tokens (cluster/grid/sidebar/…). |
| 4 | `core/tokens.macros.css` | `slashed.tokens` | Per-recipe macro tokens (flow/line-clamp/aspect/scrim/…). |
| 5 | `core/reset.css` | `slashed.reset` | Lightweight cross-browser normalize (composable, non-destructive). |
| 6 | `core/base.css` | `slashed.base` | Readable element foundation (typography, links, code, media, tables). |
| 7 | `core/themes.css` | `slashed.themes` | Light/dark + section-level theming + LumLocker (token reassignments only). |
| 8 | `core/layout.css` | `slashed.layout` | The `.sf-*` layout primitives. |
| 9 | `core/macros.css` | `slashed.macros` | The `.sf-*` recipe/pattern classes. |
| 10 | `core/states.css` | `slashed.states` | The `.is-*` runtime-state classes. |
| 11 | `core/motion.css` | `slashed.motion` | Transitions, keyframes, animation presets, scroll-driven entrances. |
| 12 | `core/accessibility.css` | `slashed.accessibility` | Focus rings, reduced-motion, sr-only, skip-link, clickable/focus parent. |
| 13 | `core/print.css` | `slashed.print` | `@page`, print hide-list, color-adjust opt-ins. |
| 14 | `optional/tokens.palette.css` | `slashed.tokens` | 50–950 numeric ramps + a5–a95 alpha variants for the 6 brand families. |
| 15 | `optional/tokens.sizes-extended.css` | `slashed.tokens` | Fluid spacing/text "bridge" tokens + per-text-size sub-properties. |
| 16 | `optional/forms.css` | `slashed.forms` | Classless native-form-control styling (opt-in). |
| 17 | `optional/legacy.css` | `slashed.legacy` | **Must load last.** `@supports not(...)` property-level fallbacks. |

**Difference from `essential`:** optimal = essential (files 1–13) **+** `tokens.palette` **+** `tokens.sizes-extended` **+** `forms` **+** `legacy`.

**Not in optimal** (present only in larger variants): `optional/tokens.components.css`, `optional/components.css` (both incomplete — every class/token commented out, emit nothing), `optional/utilities.css` (empty stub), and `optional/theme-example.css` (a demo — its `.theme-transition` class is therefore **not** in this bundle).

---

## 2. Cascade layer order (the architecture)

Declared once in `core/layers.css`. Later layers win; concatenation order is irrelevant because every rule lives inside a layer:

```text
slashed.tokens → reset → base → forms → layout → components → macros →
utilities → states → themes → motion → accessibility → print → legacy → overrides
```

| Layer | Populated in optimal by | Notes |
|-------|-------------------------|-------|
| `slashed.tokens` | tokens.css, tokens.layout, tokens.macros, tokens.palette, tokens.sizes-extended | All `--sf-*` variables. |
| `slashed.reset` | reset.css | |
| `slashed.base` | base.css | |
| `slashed.forms` | forms.css | Between base and layout. |
| `slashed.layout` | layout.css | |
| `slashed.components` | *(empty in optimal)* | Layer declared, no rules emitted. |
| `slashed.macros` | macros.css | Between components and utilities. |
| `slashed.utilities` | *(empty in optimal)* | BEM-first; no utility classes ship in 0.x. |
| `slashed.states` | states.css | |
| `slashed.themes` | themes.css | Sits **above** layout/base/states so theme token reassignments can't be beaten by equal-specificity component rules. |
| `slashed.motion` | motion.css | |
| `slashed.accessibility` | accessibility.css | High priority; uses selective `!important` for hard a11y barriers. |
| `slashed.print` | print.css | |
| `slashed.legacy` | legacy.css | Gated by `@supports not(...)`; inert on modern engines. |
| `slashed.overrides` | *(reserved for the consumer)* | Always wins; never written by the framework. |

---

## 3. Modern CSS technologies & features relied upon

The optimal bundle is built on contemporary CSS. Key features in use:

| Feature | Used for | Where |
|---------|----------|-------|
| **CSS Cascade Layers** (`@layer`) | The entire architecture / deterministic ordering | layers.css + every file |
| **`@property`** (registered custom properties, `inherits: true`) | Animatable, type-checked color source tokens & integer state flags | tokens.css |
| **`light-dark()`** | Auto light/dark resolution of every mode-sensitive color | tokens.css |
| **OKLCH + relative color syntax** (`oklch(from … l c h)`, `sign()`, `clamp()`, `calc()`) | Auto dark-mode derivation, auto-contrast text, tints/shades, link clamping | tokens.css, themes.css |
| **`color-mix(in oklab …)`** | Numeric shade ramps & alpha variants (palette), semantic shade aliases | tokens.css, tokens.palette.css |
| **Fluid `clamp()` with viewport math** | Fluid type scale, fluid spacing, bridge tokens | tokens.css, tokens.sizes-extended.css |
| **Container queries** (`@container`, named `sf-layout` / `sf-alternate`) | Breakpoint-free responsive primitives | layout.css |
| **`@supports`** | Progressive enhancement gates (relative color, `interpolate-size`, `animation-timeline`, `view-transition-name`, `@property`, `:focus-visible`, `dvh`, `scrollbar-gutter`) | many |
| **Scroll-driven animations** (`animation-timeline: view()`, `animation-range`) | `.sf-entrance--*` | motion.css |
| **View Transitions** (`::view-transition-old/new(root)`) | Theme-switch crossfade timing | motion.css |
| **`@starting-style` / `transition-behavior: allow-discrete`** | Top-layer (dialog/popover) entry/exit transitions (token building block) | tokens.css (`--sf-transition-overlay`) |
| **`content-visibility` / `contain-intrinsic-size`** | `.sf-content-auto` offscreen render skipping | macros.css |
| **`field-sizing: content`** | Auto-growing `<textarea>` | forms.css |
| **`interpolate-size: allow-keywords`** | Animating to/from intrinsic sizes | reset.css |
| **Logical properties** (`inline-size`, `block-size`, `inset-*`, `margin-block`, `:dir(rtl)`) | RTL-safe layout throughout | all |
| **`:has()`, `:is()`, `:where()`, `:focus-within`, `:user-valid/invalid`, `:any-link`** | Required markers, clickable-parent, validation, low-specificity selectors | forms.css, accessibility.css |
| **`accent-color`, `::file-selector-button`, `::-webkit-slider-*`, `::-moz-range-*`** | Native form control theming | forms.css |
| **`@page`, `print-color-adjust`, `break-inside`** | Print stylesheet | print.css |
| **Dynamic viewport units (`dvh`)**, **`scrollbar-gutter`**, **`hanging-punctuation`**, **`text-wrap: balance/pretty`** | Layout/typography polish (with legacy fallbacks) | reset.css, base.css, legacy.css |
| **`forced-colors` / `prefers-contrast` / `prefers-reduced-motion` / `prefers-reduced-transparency`** media queries | Accessibility adaptation | accessibility.css |

**Naming conventions:** all variables prefixed `--sf-`; all framework classes prefixed `.sf-` (structural) or `.is-` (runtime state). BEM is the intended consumer authoring model (`block__element--modifier`). A small set of a11y/print classes are intentionally unprefixed (industry convention): `.sr-only`, `.skip-link`, `.no-print`, etc.

---

## 4. The token API — stability contract

Tokens are classified into three tiers (declared in the header of `core/tokens.css`):

- **PUBLIC** — everyday, prominently documented knobs. Removal/rename = major version bump (after freeze).
- **PUBLIC-ADVANCED** — same SemVer guarantee, but niche/powerful (documented separately). Examples: `--sf-lumlocker`, `--sf-contrast-bias`, `--sf-contrast-threshold`, `--sf-shadow-strength`, `--sf-shadow-color`, `--sf-shadow-glow-color`, `--sf-font-features`, `--sf-font-variation`, `--sf-optical-sizing`, the `--sf-*-scale` multipliers, `--sf-scroll-timeline-range-*`, `--sf-mask-scrim-*`, `--sf-safe-*`, `--sf-perspective-*`, `--sf-truncate-suffix`, `--sf-radius-outer`, `--sf-is-active/current/pressed/open`, `--sf-focus-ring-shadow`, `--sf-print-*`.
- **INTERNAL** — implementation detail, may change without a major bump: `--sf-is-dark` (mode flag; set via `data-theme`/media query, never directly).

**Canonical-source aliases** (deliberate two-name contracts; override the canonical right-hand side to move everything downstream):
- `--sf-space-gap` → `--sf-gap` (read by all layout primitives)
- `--sf-space-content` → `--sf-content-gap` (stack/prose rhythm)
- `--sf-section-pad` → `--sf-section-pad--m`

The alias graph is ≤3 hops, giving three override levels: **local** (`style="--sf-cluster-gap: …"`), **all-primitives** (`--sf-space-gap`), **global** (`--sf-gap`).

> "Not used internally" ≠ dead code: every token is exercised in `docs/demo.html` and guarded by the regression suite in `tests/`.

---

## 5. Color system (the heart of the framework)

A three-layer color architecture:

1. **`@property` source tokens** — animatable, registered `<color>` with `inherits: true`. Six brand + five status, `-light` only (the `-dark` counterpart is optional & unregistered).
2. **Resolved semantic tokens** — `light-dark()` wrapping each source, with **automatic dark derivation** from the light value via relative-color math.
3. **Derived tokens** — auto-contrast text, tints/shades, gradients, status triplets, etc.

### 5.1 Brand source tokens (override these 6 to rebrand)

| Token | Default (OKLCH) |
|-------|-----------------|
| `--sf-color-primary-light` | `oklch(0.47 0.27 264)` |
| `--sf-color-secondary-light` | `oklch(0.22 0.04 264)` |
| `--sf-color-tertiary-light` | `oklch(0.42 0.22 295)` |
| `--sf-color-action-light` | `oklch(0.50 0.22 235)` |
| `--sf-color-neutral-light` | `oklch(0.52 0.025 260)` |
| `--sf-color-base-light` | `oklch(0.96 0.006 250)` |

Optional `-dark` overrides (no `@property`): `--sf-color-{primary,secondary,tertiary,action,neutral,base}-dark`.

### 5.2 Status source tokens
`--sf-color-success-light` `oklch(0.50 0.16 145)` · `--sf-color-warning-light` `oklch(0.75 0.17 80)` · `--sf-color-error-light` `oklch(0.50 0.20 25)` · `--sf-color-info-light` `oklch(0.48 0.18 235)` · `--sf-color-danger-light` `oklch(0.48 0.22 12)`. (`error` = form validation, `danger` = destructive actions.) Optional `-dark` overrides exist for each.

### 5.3 State flags (`@property`, `<integer>`)
`--sf-is-dark` (INTERNAL), `--sf-is-active`, `--sf-is-current`, `--sf-is-pressed`, `--sf-is-open`.

### 5.4 Resolved semantic colors (auto light/dark)
Brand: `--sf-color-{primary,secondary,tertiary,action,neutral,base}`. Status: `--sf-color-{success,warning,error,info,danger}`.

### 5.5 Surfaces (derived from base)
`--sf-color-surface`, `--sf-color-bg` (+0.02 L), `--sf-color-inset` (−0.02 L), `--sf-color-raised` (+0.04 L), `--sf-color-overlay` (0.9 α), `--sf-color-inverse` (1−L).

### 5.6 Text colors
`--sf-color-text`, `--sf-color-text--secondary`, `--sf-color-text--muted`, `--sf-color-text--placeholder`, `--sf-color-text--disabled`, `--sf-color-text--inverse`, `--sf-color-heading`, `--sf-color-code-text` (auto-contrast against code bg).

**Text-on-color** (auto black/white via `sign(threshold − l)`; guarantees ≥ 3:1): `--sf-color-text--on-{primary,secondary,tertiary,action,neutral,base,surface,inverse,success,warning,error,info,danger}`.

### 5.7 Borders, links, interactive
- Borders: `--sf-color-border`, `--sf-color-border--subtle`, `--sf-color-border--strong`, `--sf-color-border--focus`, `--sf-color-border--disabled`, `--sf-color-border--translucent`.
- Links: `--sf-color-link`, `--sf-color-link--hover`, `--sf-color-link--active`, `--sf-color-link--visited` (+60° hue), `--sf-color-link--underline`, `--sf-color-link--disabled`; geometry `--sf-link-underline-offset` (`0.15em`), `--sf-link-underline-thickness` (`auto`).
- Interactive backgrounds: `--sf-color-bg--hover`, `--sf-color-bg--active`, `--sf-color-bg--selected`, `--sf-color-bg--focus`, `--sf-color-bg--disabled`, `--sf-color-code-bg`.

### 5.8 Selection / misc anchors
`--sf-color-selection-bg`, `--sf-color-selection-text`, `--sf-color-mark-bg`, `--sf-color-mark-text`, `--sf-color-dim`, `--sf-color-white`, `--sf-color-black`, `--sf-scrollbar-thumb`, `--sf-scrollbar-track`.

### 5.9 Status triplets
For each of success/warning/error/info/danger: `-subtle` (≈0.1–0.12 α), `-strong` (mode-dependent readable text), `-muted` (0.3 α).

### 5.10 Semantic shade & alpha aliases (all 11 families)
For **brand** families (primary, secondary, tertiary, action, neutral, base) and **status** families (success, warning, error, info, danger):
`-superlight`, `-xlight`, `-lighter`, `-darker`, `-xdark`, `-superdark`, `-hover`, `-active`, `-subtle`, `-muted`, `-ghost`.
(Status families omit the `-subtle`/`-muted` alpha aliases here because their triplets in §5.9 already provide them; they keep `-ghost` and the light/dark shade aliases.)

> When `optional/tokens.palette.css` loads (it does, in optimal), these aliases are **re-pointed** at the numeric scale steps (§9) for the 6 brand families — same computed color, but overriding a numeric step now propagates to its alias.

### 5.11 Gradients
`--sf-gradient-primary`, `--sf-gradient-secondary`, `--sf-gradient-tertiary`, `--sf-gradient-brand` (+30° hue), `--sf-gradient-surface`, and edge fades `--sf-gradient-fade--{r,l,t,b}`.

### 5.12 Shadow color controls
`--sf-shadow-strength` (scales up in dark mode via `--sf-is-dark`), `--sf-shadow-color`, `--sf-shadow-glow-color`, `--sf-shadow-glow`. Plus `--sf-opacity-disabled` (0.45), `--sf-state-pending-opacity` (0.7), `--sf-focus-ring-color`, `--sf-focus-ring-shadow`, `--sf-caret-color`.

---

## 6. Non-color core tokens (`core/tokens.css`)

### 6.1 Scale multipliers (global knobs)
`--sf-space-scale`, `--sf-text-scale`, `--sf-text-display-scale`, `--sf-radius-scale`, `--sf-motion-scale` (all default `1`).

### 6.2 Fonts
- Families: `--sf-font-body` (`system-ui, …`), `--sf-font-heading`, `--sf-font-display`, `--sf-font-mono` (`ui-monospace, monospace`), plus zero-cost system stacks `--sf-font-humanist`, `--sf-font-geometric`, `--sf-font-slab`.
- OpenType controls (token-only): `--sf-font-features`, `--sf-font-variation`, `--sf-optical-sizing`.
- Weights: `--sf-font-weight-{thin=100, extralight=200, light=300, normal=400, medium=500, semibold=600, bold=700, extrabold=800, black=900}`; semantic `--sf-font-weight-{body,heading,display}`; `--sf-current-font-weight`.
- Numeric figures: `--sf-font-numeric` (`tabular-nums`).

### 6.3 Type scale (fluid `clamp`)
Sizes: `--sf-text-{2xs,xs,s,m,l,xl,2xl,3xl,4xl}`; display `--sf-text-display-{s,m,l}`.
Line-height: `--sf-leading-{tight=1.1,snug=1.3,normal=1.5,relaxed=1.625}`.
Tracking: `--sf-tracking-{tight,normal,wide,wider,widest}`.

### 6.4 Spacing
Fixed: `--sf-space-{none,px,gutter}`. Fluid: `--sf-space-{2xs,xs,s,m,l,xl,2xl,3xl,4xl}` (each multiplied by `--sf-space-scale`).

### 6.5 Sizing & layout scalars
- UI sizes: `--sf-size-{xs=1.5rem,s=2rem,m=2.5rem,l=2.75rem,xl=3.5rem}`.
- Icon sizes (em-based): `--sf-icon-{xs,s,m,l,xl,2xl}`.
- Containers: `--sf-container-{narrow=38rem,prose=65ch,default=75rem,wide=90rem,full=100%}`.
- Aspect ratios: `--sf-ratio-{square,video,cinema,portrait,golden,4-3,3-2}`.

### 6.6 Borders, dividers, radius
- Widths: `--sf-border-width-{hairline=0.5px,1,2,3,4}`.
- Styles: `--sf-border-style{,-strong,-soft,-dotted}`.
- Shorthands: `--sf-border`, `--sf-border-subtle`, `--sf-border-strong`.
- Divider: `--sf-divider-{width,style,color,gap}`.
- Radius: `--sf-radius-{none,xs,s,m,l,xl,2xl,3xl,4xl,full,pill}` (+ concentric helper `--sf-radius-outer`). `full`/`pill` are not scaled by `--sf-radius-scale`.

### 6.7 Shadows
`--sf-shadow-{none,xs,s,m,l,xl,2xl,inner}`; text shadows `--sf-text-shadow-{none,s,m,l}`; drop shadows `--sf-drop-shadow-{s,m,l}`.

### 6.8 Blur, perspective, opacity
`--sf-blur-{xs,s,m,l,xl}`; `--sf-perspective-{near,normal,far}`; `--sf-opacity-{0,10,25,50,75,100}`.

### 6.9 Motion
- Durations: `--sf-duration-{none,instant,fast,normal,slow,slower}` (scaled by `--sf-motion-scale`).
- Easings: `--sf-ease-{linear,out,in,in-out,spring,elastic,bounce,overshoot}`.
- Animation presets: `--sf-animation-{fade-in,fade-out,slide-in-up,slide-in-down,slide-in-left,slide-in-right,scale-up,scale-down,color-pulse,ping,blink,float,spin,shimmer}`.
- Stagger delays: `--sf-animation-delay-{1,2,3,4,5}`.
- Scroll-driven range: `--sf-scroll-timeline-range-{start,end}`.
- Mask scrim: `--sf-mask-scrim-{start,end}`.
- Transition shorthands: `--sf-transition-{all,colors,transform,opacity,shadow,fast,slow,enter,exit,overlay}`.

### 6.10 Z-index
`--sf-z-{below=-1,base=0,raised=1,low=10,mid=100,high=500,top=900,max=9999}`.

### 6.11 Layout / a11y scalars
Header & sticky: `--sf-header-height{,-mobile,-desktop}`, `--sf-sticky-offset{,-mobile,-desktop}`.
Focus: `--sf-focus-ring-{width=2px,offset=2px,style=solid}`. `--sf-touch-target`.
Contrast knobs: `--sf-contrast-bias` (0), `--sf-contrast-threshold` (0.6).
Safe-area: `--sf-safe-{top,bottom,left,right}`.

### 6.12 Print, stroke, object-fit, multi-column
`--sf-print-{page-margin=2cm,page-size=a4,base-size=11pt}`; `--sf-stroke-{thin,regular,bold,heavy}`; `--sf-object-fit` (`cover`), `--sf-object-position`; `--sf-col-width-{s,m,l}`, `--sf-col-rule-width-{s,m,l}`.

### 6.13 Typography aliases
Body: `--sf-body-{font-size,line-height,font-weight,font-family,color,text-wrap,strong-weight,em-style}`; `--sf-code-font-size`.
Heading: `--sf-heading-{font-family,color,text-wrap}`; per-level `--sf-h{1..6}-{size,line-height,font-weight,letter-spacing}`.

### 6.14 BEM consumer aliases
`--sf-gap`, `--sf-content-gap`, `--sf-component-pad`, `--sf-field-block`, `--sf-field-required-marker` (`" *"`), `--sf-link-external-marker` (`" ↗"`).
Section padding: `--sf-section-pad`, `--sf-section-pad--{xs,s,m,l,xl,2xl}`.

---

## 7. Layout primitive tokens (`core/tokens.layout.css`)

Per-primitive override knobs (all PUBLIC, all overridable inline):
- Shared: `--sf-space-gap`, `--sf-space-content`.
- Stack: `--sf-stack-gap`. Gap: `--sf-gap-size`.
- Box: `--sf-box-{padding,border-width,border-color}`.
- Center: `--sf-center-{max,gutter}`.
- Cluster: `--sf-cluster-{gap,align,justify}`.
- Sidebar: `--sf-sidebar-{gap,min-width,width}`.
- Switcher: `--sf-switcher-{threshold,gap}`.
- Grid: `--sf-grid-min`, `--sf-grid-gap`, `--sf-grid-min-{xs,s,m,l,xl,2xl}`.
- Equal: `--sf-equal-{cols,gap}`.
- Cover: `--sf-cover-{min-height,padding}`.
- Frame: `--sf-frame-ratio`.
- Icon (boxed): `--sf-icon-box-{pad,radius,bg,border}`.
- Reel: `--sf-reel-{item-width,gap,height}`.
- Imposter: `--sf-imposter-margin`.
- Bento: `--sf-bento-{cols-default,row-default,row-compact,row-tall,gap}`.
- Content grid: `--sf-breakout-width`, `--sf-content-width`.
- Prose: `--sf-prose-paragraph`.
- Alternate: `--sf-alternate-{gap,inner-gap}`.

---

## 8. Macro tokens (`core/tokens.macros.css`)

- Flow: `--sf-flow-space`.
- Line clamp: `--sf-line-clamp` (3).
- Truncate: `--sf-truncate-suffix` (`…`).
- Aspect: `--sf-aspect` (16/9).
- Prose: `--sf-prose-{heading-gap,list-gap,block-margin,media-margin,media-radius,figure-margin,marker-color,figcaption-size}`.
- Scroll shadow / overflow fade: `--sf-scroll-shadow-size` (2rem).
- Content visibility: `--sf-content-intrinsic-size` (500px).
- Scrim: `--sf-scrim-{color,direction,gradient,text-shadow}`.

---

## 9. Palette tokens (`optional/tokens.palette.css`) — optimal-only addition

Auto-generated with `color-mix(in oklab …)` (oklab to avoid hue drift). For **each of the 6 brand families** (`primary, secondary, tertiary, action, neutral, base`):

- **Numeric ramp:** `-50, -100, -200, -300, -400, -500, -600, -700, -800, -900, -950` (500 = the base color; 50–400 tint toward surface, 600–950 shade toward text; `base` inverts the mix direction for a V-shaped ramp).
- **Alpha variants:** `-a5, -a10, -a20, -a30, -a40, -a50, -a60, -a70, -a80, -a90, -a95` (mixed toward transparent).
- **Shade aliases re-pointed:** `-superlight→-50`, `-xlight→-200`, `-lighter→-400`, `-darker→-600`, `-xdark→-800`, `-superdark→-950`.
- **Functional aliases re-pointed:** `-hover→-darker`, `-active→-xdark`, `-subtle→-a10`, `-muted→-a30`, `-ghost→-a5`.

(Status families keep their core triplets — no numeric ramp here, by design.)

---

## 10. Extended size tokens (`optional/tokens.sizes-extended.css`) — optimal-only addition

1. **Spacing bridges** — fluid `clamp()` spanning two non-adjacent steps, full descending matrix `--sf-space-{LARGER}-to-{SMALLER}` (respect `--sf-space-scale`):
   `4xl-to-{3xl,2xl,xl,l,m,s,xs,2xs}`, `3xl-to-{2xl,xl,l,m,s,xs,2xs}`, `2xl-to-{xl,l,m,s,xs,2xs}`, `xl-to-{l,m,s,xs,2xs}`, `l-to-{m,s,xs,2xs}`, `m-to-{s,xs,2xs}`, `s-to-{xs,2xs}`, `xs-to-2xs`.
2. **Text bridges** — same matrix for type: `--sf-text-{LARGER}-to-{SMALLER}` (no scale multiplier, matching core text tokens).
3. **Per-text-size sub-properties** (opt-in composable overrides, not auto-applied) for each of `2xs, xs, s, m, l, xl, 2xl, 3xl, 4xl`: `-line-height`, `-font-weight`, `-letter-spacing`, `-max-width`.

---

## 11. Reset layer (`core/reset.css`)

Lightweight, **composable** normalize (deliberately does *not* zero global margins or strip list markers, so it coexists with WP admin bar / page-builder chrome). Key rules: universal `box-sizing: border-box`; `html` gets `text-size-adjust`, `scroll-padding-top`, `scrollbar-gutter: stable`, `color-scheme`, `hanging-punctuation`, and `interpolate-size: allow-keywords` (gated); `body { min-height:100dvh; min-inline-size:320px }`; normalizations for `button`, `search`, `summary`, `table` (border-collapse), `[hidden]`, `dialog`/`[popover]` (Canvas bg), `fieldset { min-width:0 }`, `[inert]`.

---

## 12. Base layer (`core/base.css`)

A **minimal readable foundation, not a classless UI kit** (SLASHED is BEM-first). Globally styled: `body` typography; `h1–h6` (per-level tokens, `text-wrap`, scroll-margin); `p` (orphans/widows, `text-wrap: pretty`); `b/strong`, `em`, `small`, `mark`, `abbr[title]`, `kbd/samp`, `sub/sup`; links via **`a:link`** (specificity-matched to beat WebKit UA `-webkit-link`) + `:hover/:visited/:active`; inline `code` & `pre` (+ `pre code`); media (`img,picture,video,canvas` → block, capped width; `object-fit`); `iframe/embed/object`; `hr` (divider tokens); `:target`; `::selection`; `::backdrop`; `::placeholder`; form-control font/color inheritance restoration; `textarea { resize: vertical }`; `touch-action: manipulation`; minimal `blockquote`/`dt`/`dd`/`table`/`th`/`td` defaults (rich block styling is reserved for `.sf-prose`).

---

## 13. Theme layer (`core/themes.css`)

Token reassignments only (no new selectors/properties). Provides:
- **OS preference** dark mode via `@media (prefers-color-scheme: dark)` on `:root:not([data-theme])` (sets `--sf-is-dark: 1`).
- **Explicit theming**: `[data-theme="light"]` / `[data-theme="dark"]` on `:root` *or any element* (section-level theming) — re-declares every mode-sensitive token with the explicit light/dark formula (because `light-dark()` doesn't re-resolve on inheritance), gated by `@supports (color: oklch(from red l c h))`.
- **LumLocker**: opt-in `:root[data-lumlocker]` locks the 5 brand colors (not base) to a shared OKLCH lightness `--sf-lumlocker` (0.65) while keeping each hue/chroma.

Usage: `<html>` (OS), `<html data-theme="dark">` (forced), `<section data-theme="dark">` (scoped). Theme transitions animate via View Transitions (motion.css) — never transition every color globally.

---

## 14. Layout primitives (`core/layout.css`, layer `slashed.layout`)

Breakpoint-free, **container-query-driven** (`@container`, named `sf-layout`/`sf-alternate`). Each is one class with per-instance tokens (override inline). Classes:

| Class (+ modifiers) | What it does |
|---|---|
| `.sf-section` (`--xs/--s/--m/--l/--xl/--2xl`, `--collapse`) | Vertical page rhythm / block padding. |
| `.sf-section-group` | Collapses the gap between adjacent sections. |
| `.sf-container` (`--narrow/--prose/--wide/--full`) | Centered max-width wrapper; declares the `sf-layout` container. |
| `.sf-box` | Isolated padded unit with optional border outline. |
| `.sf-center` (`--intrinsic`) | Intrinsic centering with max-width + gutters. |
| `.sf-stack` (`--xs…--2xl`, `--center/--end/--stretch`) | Vertical flow with consistent gap (the "owl"). |
| `.sf-cluster` (`--xs…--2xl`, `--center/--end/--between`, `--no-wrap`) | Wrapping inline group. |
| `.sf-sidebar` (`--narrow/--wide/--right`) | Content + side panel, wraps when narrow. |
| `.sf-switcher` (`--no-wrap`, `--vertical`) | N columns above a threshold, stacked below. |
| `.sf-grid` (`--fit`, `--xs…--2xl`, `--dense`) | Auto-fill responsive grid. |
| `.sf-grid-1 / -2 / -3 / -4 / -6` | Fixed-column grids, container-responsive (no `-5`). |
| `.sf-grid-1-2 / -2-1 / -1-3 / -3-1` | Ratio two-column grids. |
| `.sf-bento` (`--2/--4/--compact/--tall`) | Dense free-form grid. |
| `.sf-alternate` | Zigzag two-column layout; reverses every other row. |
| `.sf-pancake` | Sticky-footer grid: header / main(1fr) / footer. |
| `.sf-content-grid` (children `.sf-breakout`, `.sf-full-bleed`) | Breakout layout. |
| `.sf-cover` (`--min/--max/--padding-s/--padding-l`, child `.sf-cover__center`) | Full-height region with centered child. |
| `.sf-frame` (`--square/--video/--cinema/--4-3/--3-2/--portrait/--golden`) | Aspect-ratio media box (`object-fit: cover`). |
| `.sf-reel` | Horizontal scroll strip (mask scrim). |
| `.sf-imposter` (`--fixed`, `--contain`) | Absolutely-centered overlay. |
| `.sf-subgrid` / `.sf-subgrid-rows` | Inherit parent grid tracks. |
| `.sf-divider` (`--vertical/--soft/--strong/--dashed/--dotted/--gradient`) | Token-driven separator. |
| `.sf-gap` (`--xs…--2xl`) | Injects gap into any flex/grid without imposing display. |
| `.sf-equal` (`--2/--3/--4/--6`) | Fixed N-column grid that never collapses. |
| `.sf-icon` (`--xs…--2xl`, `--boxed`) | Em-based inline icon sizing; boxed = padded/bordered frame. |

---

## 15. Macros / recipes (`core/macros.css`, layer `slashed.macros`)

Answer "what does this element do/look like?":

| Class (+ variants) | What it does |
|---|---|
| `.sf-prose` | Long-form text column with automatic vertical rhythm; restores list bullets; styles figure/table/video. |
| `.sf-not-prose` | Opts a subtree out of `.sf-prose` styling. |
| `.sf-flow` | Lobotomized owl — `margin-block-start` on every flow child after the first. |
| `.sf-truncate` | Single-line ellipsis. |
| `.sf-line-clamp-2`, `.sf-line-clamp-3`, `.sf-line-clamp-N` | Multi-line clamp (`-N` reads `--sf-line-clamp`). |
| `.sf-equal-height` | Forces flex children to share the tallest height. |
| `.sf-aspect` | Generic aspect-ratio container (content-agnostic). |
| `.sf-scroll-shadow` | Top+bottom fade mask on a vertical scroller (pure CSS). |
| `.sf-scroll-snap` | Vertical scroll-snap container. |
| `.sf-overflow-fade` | End-edge horizontal fade for overflowing inline content. |
| `.sf-no-tap-highlight` | Removes WebKit/Android tap-highlight overlay. |
| `.sf-content-auto` | `content-visibility: auto` — skips offscreen render. |
| `.sf-tabular-nums` | Fixed-width digits (`font-variant-numeric`). |
| `.sf-surface--{primary,secondary,tertiary,action,neutral,inverse,success,warning,error,info,danger}` | Filled surface + auto-contrast text (11 variants). |
| `.sf-text-gradient` | Fills text with a gradient (`background-clip: text`). |
| `.sf-link-external` | Appends an external-link glyph via `::after`. |
| `.sf-link--subtle`, `.sf-link--reverse` | Underline affordances (no color change). |
| `.sf-scrim` (`--top/--bottom/--full`) | Darkening overlay for text-over-image legibility. |
| `.sf-text-protect` | Soft text-shadow halo (legibility without darkening). |

---

## 16. Animation / motion (`core/motion.css`, layer `slashed.motion`)

All decorative animation is gated by `@media (prefers-reduced-motion: no-preference)`.

- `html { scroll-behavior: smooth }` (auto during keyboard focus).
- Broadens base link transition to all interactive elements (full animatable property set).
- View-transition root timing.
- **Animation preset classes:** `.sf-fade-in`, `.sf-fade-out`, `.sf-slide-in-{up,down,left,right}`, `.sf-scale-{up,down}`, `.sf-color-pulse`.
- **Scroll-driven entrances:** `.sf-entrance--{fade,fade-up,fade-down,fade-left,fade-right,scale-up}` (use `animation-timeline: view()` where supported; fall back to a one-shot time-driven animation).
- **Keyframes:** `sf-fade-in`, `sf-fade-out`, `sf-slide-in-{up,down,left,right}`, `sf-scale-{up,down}`, `sf-spin`, `sf-shimmer`, `sf-ping`, `sf-blink`, `sf-float`, `sf-color-pulse` (the latter gated by `@property` support). `sf-spin`/`sf-shimmer` power `.is-loading`/`.is-skeleton`.

---

## 17. State classes (`core/states.css` + a11y entries) — 40 total

Runtime conditions toggled by JS / mirrored from ARIA. Low-specificity, set the minimum needed.

`is-hidden`, `is-invisible`, `is-visible`, `is-disabled`, `is-readonly`, `is-loading`, `is-pending`, `is-busy`, `is-skeleton`, `is-active`, `is-selected`, `is-current`, `is-pressed`, `is-highlighted`, `is-open`, `is-collapsed`, `is-expanded`, `is-valid`, `is-invalid`, `is-success`, `is-error`, `is-warning`, `is-info`, `is-danger`, `is-sticky`, `is-pinned`, `is-fixed`, `is-fullscreen`, `is-clipped`, `is-scrollable`, `is-truncated`, `is-resizable`, `is-dragging`, `is-drop-target`, `is-draggable`, `is-overlay`, `is-clickable`, `is-unselectable`, `is-focused`, `is-empty`.

**Disambiguation:** `.is-invalid` (form field, `aria-invalid`) vs `.is-error` (general component feedback); `.is-valid` vs `.is-success`; `.is-danger` (destructive-action context) vs `.is-error`; `.is-open` (shown/hidden surface) vs `.is-expanded` (disclosure trigger, `aria-expanded`); `.is-loading` (content masked) vs `.is-pending` (content still usable). Validation states set `--sf-field-border-color` (consumed by forms.css) and `--sf-field-text-color` (consumer hook). Always pair `.is-*` with the matching ARIA attribute.

---

## 18. Accessibility (`core/accessibility.css`, layer `slashed.accessibility`)

Selective `!important` only for hard barriers. Includes:
- **Focus ring**: `:focus:not(:focus-visible){outline:none}` + hardened `:focus-visible` outline (WCAG 2.4.7).
- **`.sf-focus-shadow`** — opt-in box-shadow focus ring (for rounded/clipped elements); forced-colors fallback to outline.
- **Reduced motion** — neutralizes animation/transition durations (`@media (prefers-reduced-motion: reduce)` + the JS-toggled **`.no-motion`** class).
- **High contrast** (`prefers-contrast: more`) — thicker focus ring, contrast bias bump, thicker `hr`.
- **Reduced transparency** — opaque `::backdrop`.
- **Touch targets** (`pointer: coarse`) — min size on buttons/inputs/select/summary/checkbox/radio.
- **Disabled** — `cursor: not-allowed` on `[disabled]`/`[aria-disabled="true"]`.
- **`.sr-only`** & **`.sr-only-focusable`** — screen-reader-only (hardened).
- **`.skip-link`** — skip-navigation link (themeable position/color).
- **`.sf-focus-parent`** — container rings on `:focus-within`.
- **`.sf-clickable-parent`** — card-with-link pattern (`::after` overlay; `[data-overlay-link]` explicit mode, `[data-no-overlay]` escape; `:focus-within` ring; `--sf-clickable-overlay-z`).
- **Forced colors** (Windows High Contrast) — adopts system `Highlight`, drops decorative shadows, re-asserts form borders.

---

## 19. Print (`core/print.css`, layer `slashed.print`)

`@page { size: a4 portrait; margin: 2cm }`; print base font size; strips shadows; expands `a[href]` URLs (excluding `#`/`javascript:`/`mailto:`/`tel:`/`.sf-link-external`); `abbr[title]` expansion; `break-inside: avoid` on media/table/pre/blockquote/tr; `thead` repeats; heading `break-after: avoid`; paragraph orphans/widows; bordered pre/blockquote; **hide-list** (`nav, aside, button, input, select, textarea, audio, video, dialog, [popover], .no-print` → `display:none !important`); `<details>` content preserved; opt-in color classes **`.print-color-exact`** and **`.print-no-color`**; **`.print-only`** (hidden on screen, revealed in print).

---

## 20. Forms (`optional/forms.css`, layer `slashed.forms`) — optimal-only addition

**Classless** opt-in styling of native controls. Covers: text-like inputs / `select` / `textarea` (shared border, padding, `appearance:none` to fix WebKit dark-mode bg, focus-visible ring, disabled, placeholder, autofill repaint); native `:user-valid` / `:user-invalid` border recoloring (additive to the JS `.is-*` classes); `input[type="number"]` tabular figures; `textarea` (`min-block-size`, `field-sizing: content`); `select` chevron (data-URI SVG using `FieldText`, RTL-mirrored); buttons / submit / reset / `::file-selector-button` (action-colored); checkbox & radio (`accent-color`); `input[type="range"]` track+thumb (WebKit + Firefox); `fieldset`/`legend`; `label` (block, weight, `--sf-field-text-color`); classless **required marker** via `label:has(:required)::after` / `label:has(+ :required)::after`. Reads `--sf-field-border-color`, `--sf-field-text-color`, `--sf-field-required-marker`, and many color/space/motion tokens.

---

## 21. Legacy fallbacks (`optional/legacy.css`, layer `slashed.legacy`) — optimal-only addition

**Loads last.** Property-level smoothing via `@supports not(...)`, inert on modern engines. Does **not** lower the color-system floor. Three blocks:
1. `dvh` → `min-height: 100vh` fallback (Safari 15.0–15.3).
2. `:focus-visible` unsupported → show ring on every `:focus` (WCAG 2.4.7 protection, Safari < 15.4).
3. `scrollbar-gutter: stable` absent → `html { overflow-y: scroll }` (Safari).

---

## 22. Unprefixed classes in the optimal bundle (8)

`sr-only`, `sr-only-focusable`, `no-motion` (accessibility) · `skip-link` (accessibility) · `no-print`, `print-only`, `print-color-exact`, `print-no-color` (print).

> The registry also lists `theme-transition`, but that class lives in `optional/theme-example.css`, which is **not** part of the optimal bundle.

---

## 23. Browser support

**Floor: Chrome 123+, Safari 17.5+, Firefox 128+** (≈ April–July 2024), set by three colorsystem features with no graceful fallback: `light-dark()`, `@property` with `inherits: true`, and `oklch(from … sign(…) …)` relative color syntax. Below the floor, colors collapse to `initial`. `optional/legacy.css` only smooths a few non-color gaps within the layer-supporting window.

---

## 24. Build artifacts & package entry points

Each bundle is emitted readable, minified, and with a source map (built via LightningCSS in `scripts/bundle.js`):
- `dist/slashed.optimal.css`
- `dist/slashed.optimal.min.css`
- `dist/slashed.optimal.min.css.map`
- `dist/slashed.optimal.flat.css` (a "flat" variant; also `.min` + map)

`package.json` exports for this variant: `slashed/optimal` → `dist/slashed.optimal.css`; `slashed/optimal/flat` → `dist/slashed.optimal.flat.css`. (The package `main`/`style`/`unpkg`/`jsdelivr` default to `full`.) `tests/bundle-size.spec.js` guards size; `npm run build` reports raw/gzip/brotli per bundle.

**Quick start (optimal):**
```html
<link rel="stylesheet" href="slashed.optimal.css">
```

---

## 25. Counts at a glance (optimal)

| Inventory | Count |
|---|---|
| Source files concatenated | 17 |
| Cascade layers declared | 15 |
| `--sf-*` design tokens | **812** |
| `.sf-*` classes (layout + macros + motion + a11y patterns) | **173** |
| `.is-*` state classes | **40** |
| Unprefixed classes | **8** (9 in the registry, minus the non-bundled `theme-transition`) |

> Counts mirror `docs/registry.json` (generated by `scripts/audit.js`). The optimal and full bundles share the same 812-token total because the components/utilities stubs emit nothing.

---

## Appendix A — Complete `--sf-*` token list (all 812)

The full alphabetical list of every custom property present in the optimal bundle is maintained in [`docs/registry.json`](registry.json) under the `"tokens"` key (812 entries) and documented with computed defaults in [`docs/tokens.md`](tokens.md). Token families enumerated above expand as follows so nothing is implicit:

- **Color families × suffixes.** Brand families `{primary, secondary, tertiary, action, neutral, base}` each carry: `-light`, (optional) `-dark`, the resolved name, `-50…-950` (11), `-a5…-a95` (11), and aliases `-superlight, -xlight, -lighter, -darker, -xdark, -superdark, -hover, -active, -subtle, -muted, -ghost`. Status families `{success, warning, error, info, danger}` carry: `-light`, (optional) `-dark`, the resolved name, `-subtle/-strong/-muted`, and aliases `-superlight, -xlight, -lighter, -darker, -xdark, -superdark, -hover, -active, -ghost`.
- **Spacing/text bridges.** Every `{larger}-to-{smaller}` pair across `{2xs,xs,s,m,l,xl,2xl,3xl,4xl}` for both `--sf-space-*-to-*` and `--sf-text-*-to-*`.
- **Per-text-size sub-properties.** For each of `{2xs,xs,s,m,l,xl,2xl,3xl,4xl}`: `-line-height, -font-weight, -letter-spacing, -max-width`.

For the authoritative, machine-generated flat list, see `docs/registry.json` → `tokens`.

## Appendix B — Complete class lists

- **`.sf-*` (173):** see `docs/registry.json` → `sf_classes`.
- **`.is-*` (40):** see `docs/registry.json` → `is_classes` (enumerated in §17).
- **Unprefixed (8 in bundle):** §22.

---

*Generated as a reference index of the `slashed.optimal` bundle for SLASHED `0.5.0-beta5`. Source of truth: `bundle.config.json`, the `core/` and `optional/` CSS files, and `docs/registry.json`.*
