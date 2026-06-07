# SLASHED — Optimal Bundle Master Index

Complete reference for **`dist/slashed.optimal.css`** — every technology, feature, cascade layer, token/variable, class, macro, state, element default, and fallback contained in the optimal bundle variant. Reflects the current source (`slashed` v0.5.0-beta5).

> **S**tandalone · **L**ean · **A**gnostic · **S**tructured · **H**ybrid · **E**xplicit · **D**eterministic — a cascade-layer CSS framework with no build step, no Node runtime, and no runtime dependencies.

---

## 1. What the optimal bundle is

`slashed.optimal.css` = the full `essential` core (all 14 `core/` files) **plus** four populated optional modules. It is the recommended bundle for most sites: full theming + numeric palette ramps + extended size bridges + classless native form styling + legacy property fallbacks.

### 1.1 File composition & mandatory load order

Concatenated in this exact order (`bundle.config.json` → `dist/slashed.optimal.css`):

| # | File | Layer(s) it populates | Role |
|---|------|----------------------|------|
| 1 | `core/layers.css` | *(declares all layers)* | **Must load first.** Fixes cascade order. |
| 2 | `core/tokens.color-fallbacks.css` | `slashed.tokens` | HSL sRGB color fallbacks (ungated, light only) |
| 3 | `core/tokens.css` | `slashed.tokens` | Core token system (3-layer color architecture + all non-color tokens) |
| 4 | `core/tokens.layout.css` | `slashed.tokens` | Per-primitive layout tokens |
| 5 | `core/tokens.macros.css` | `slashed.tokens` | Per-recipe macro tokens |
| 6 | `core/reset.css` | `slashed.reset` | Lightweight normalize |
| 7 | `core/base.css` | `slashed.base` | Element-level base styling |
| 8 | `core/themes.css` | `slashed.themes` | Dark/light/section theming, LumLocker |
| 9 | `core/layout.css` | `slashed.layout` | Layout primitives (`.sf-*`) |
| 10 | `core/macros.css` | `slashed.macros` | Macro/recipe classes (`.sf-*`) |
| 11 | `core/states.css` | `slashed.states` | State classes (`.is-*`) |
| 12 | `core/motion.css` | `slashed.motion` | Transitions, animations, keyframes |
| 13 | `core/accessibility.css` | `slashed.accessibility` | Focus, reduced-motion, SR-only, a11y patterns |
| 14 | `core/print.css` | `slashed.print` | Print rules + `@page` |
| 15 | `optional/tokens.palette.css` | `slashed.tokens` | 50–950 numeric scales + alpha + aliases (6 brand families) |
| 16 | `optional/tokens.sizes-extended.css` | `slashed.tokens` | Spacing/text bridge tokens + per-size sub-properties |
| 17 | `optional/forms.css` | `slashed.forms` | Classless native form-control styling |
| 18 | `optional/legacy.css` | `slashed.legacy` | **Must load last.** Non-color property fallbacks (`@supports not`) |

**À-la-carte rule:** `core/layers.css` must always load first; `optional/legacy.css` must always load last. Because every rule lives in an `@layer`, concatenation order otherwise never affects the cascade.

### 1.2 Bundle distribution artifacts

Each bundle is emitted readable + minified + source-mapped:
- `dist/slashed.optimal.css`
- `dist/slashed.optimal.min.css`
- `dist/slashed.optimal.min.css.map`
- `dist/slashed.optimal.flat.css` — the same files with `@layer` wrappers stripped (for environments that can't use cascade layers).

A `flat` variant exists for every bundle. In the flat build, `revert` keywords fall back directly to the UA stylesheet (same visual result as the layered build).

### 1.3 Token count

Per the README: ≈ **571 `--sf-*` tokens in `essential`**, ≈ **812 in `optimal`/`full`** (the +241 delta comes mostly from `optional/tokens.palette.css` and `optional/tokens.sizes-extended.css`).

---

## 2. Technology & engineering features

| Area | Technology used |
|------|-----------------|
| Distribution | Plain CSS. No build step, no Node, no runtime deps. Bundles are concatenations. |
| Naming | BEM-first. Framework prefix `--sf-*` (tokens), `.sf-*` (classes), `.is-*` (states), `.sr-only`/`.skip-link`/`.no-print`/`.no-motion`/`.print-only` (unprefixed a11y/utility hooks). |
| Cascade control | **CSS cascade layers** (`@layer`) — 15 ordered layers fix specificity battles deterministically. |
| Color model | **OKLCH** source of truth; **OKLab** for mixing (prevents hue drift). |
| Dynamic color | `light-dark()`, `@property` (registered animatable custom props with `inherits: true`), `oklch(from … )` relative color syntax, `color-mix(in oklab/oklch …)`. |
| Auto-derivation | Dark mode auto-derived from light source tokens via relative color formulas; text-on-color auto-contrast via `sign()` luminance crossover. |
| Fluid scaling | `clamp()`-based fluid type & spacing (viewport-interpolated between 22.5rem and wider). |
| Responsive layout | **Container queries** (`@container`) + intrinsic flex/grid tricks (`calc((threshold - 100%) * 999)`) — largely breakpoint-free. |
| Logical properties | `inline-size`, `block-size`, `inset-*`, `margin-block`, `padding-inline`, `:dir(rtl)` mirroring. |
| Modern CSS | `aspect-ratio`, `subgrid`, `content-visibility`, `scroll-snap`, scroll-driven animations (`animation-timeline: view()`), `@starting-style`/`allow-discrete` building blocks, `field-sizing: content`, `interpolate-size: allow-keywords`, mask gradients, `view-transition`. |
| Accessibility | `:focus-visible` hardening (`!important`), reduced-motion/contrast/transparency media queries, forced-colors (Windows High Contrast), WCAG 2.4.7 / 2.5.5 handling, SR-only utilities, skip link, clickable-parent & focus-parent patterns. |
| Progressive enhancement | Every advanced feature wrapped in `@supports`; fallbacks degrade silently. |
| Tooling (repo) | stylelint, Playwright (light+dark regression), `culori`, `fast-check` (property tests), `lightningcss` (minify), release-it + conventional commits. |

### 2.1 Browser support floor

**Chrome 123+ · Safari 17.5+ · Firefox 128+** (≈ April–July 2024). Set by three color features with no graceful fallback:
- `light-dark()` (Chrome 123, Safari 17.5, Firefox 120)
- `@property` with `inherits: true` (Firefox 128)
- `oklch(from … )` relative color syntax (Firefox 113, Safari 16.4)

`optional/legacy.css` smooths **non-color** property gaps (dvh, `:focus-visible`, `scrollbar-gutter`) within the cascade-layer-supporting window but does **not** lower the floor. Below the floor, colors collapse to `initial`. The ungated HSL fallbacks in `tokens.color-fallbacks.css` bridge engines that support `@layer` but not all three color features.

---

## 3. Cascade layer order

Declared in `core/layers.css` (later layers win):

```
slashed.tokens → reset → base → forms → layout → components → macros →
utilities → states → themes → motion → accessibility → print → legacy → overrides
```

| Layer | Populated in optimal? | Notes |
|-------|----------------------|-------|
| `slashed.tokens` | ✅ | All token files |
| `slashed.reset` | ✅ | reset.css |
| `slashed.base` | ✅ | base.css |
| `slashed.forms` | ✅ | optional/forms.css |
| `slashed.layout` | ✅ | layout.css |
| `slashed.components` | ⬜ (declared, empty) | reserved; populated only in `*-components`/`full` |
| `slashed.macros` | ✅ | macros.css |
| `slashed.utilities` | ⬜ (declared, empty) | BEM-first; no utility classes ship in 0.x |
| `slashed.states` | ✅ | states.css |
| `slashed.themes` | ✅ | themes.css (sits above states/layout so themes can't be beaten by equal-specificity rules) |
| `slashed.motion` | ✅ | motion.css |
| `slashed.accessibility` | ✅ | accessibility.css |
| `slashed.print` | ✅ | print.css |
| `slashed.legacy` | ✅ | optional/legacy.css (gated `@supports not`; inert on modern engines) |
| `slashed.overrides` | (reserved) | Empty — reserved for consumer overrides; always wins. |

---

## 4. Color system architecture

Three conceptual layers, all in `slashed.tokens`:

1. **`@property` source tokens** — animatable, registered with `syntax:"<color>"; inherits:true`. 6 brand + 5 status `-light` tokens (the `-dark` counterparts are optional, unregistered). Plain `:root` mirrors are character-identical for engines lacking `@property`.
2. **Resolved semantic tokens** — `light-dark()` with auto-derivation of dark from light via relative color syntax.
3. **Derived tokens** — relative color syntax for auto-contrast text, surfaces, tints/shades, gradients, shadows.

### 4.1 Brand source tokens (override these 6 to rebrand)

| Token | Default (OKLCH) |
|-------|-----------------|
| `--sf-color-primary-light` | `oklch(0.47 0.27 264)` |
| `--sf-color-secondary-light` | `oklch(0.22 0.04 264)` |
| `--sf-color-tertiary-light` | `oklch(0.42 0.22 295)` |
| `--sf-color-action-light` | `oklch(0.50 0.22 235)` |
| `--sf-color-neutral-light` | `oklch(0.52 0.025 260)` |
| `--sf-color-base-light` | `oklch(0.96 0.006 250)` |

### 4.2 Status source tokens

| Token | Default (OKLCH) |
|-------|-----------------|
| `--sf-color-success-light` | `oklch(0.50 0.16 145)` |
| `--sf-color-warning-light` | `oklch(0.75 0.17 80)` |
| `--sf-color-error-light` | `oklch(0.50 0.20 25)` |
| `--sf-color-info-light` | `oklch(0.48 0.18 235)` |
| `--sf-color-danger-light` | `oklch(0.48 0.22 12)` |

Optional per-mode override: set `--sf-color-{name}-dark` (unregistered) for full dark control. Or use shorthand `--sf-color-primary: light-dark(#x, #y)`.

### 4.3 Dark-mode derivation formulas

- Brand/status dark: `oklch(from <light> clamp(0.65, 0.95 - l*0.5, 0.88) calc(c*0.9) h)`
- Surface (base) dark: `oklch(from <light> clamp(0.16, 1.18 - l, 0.24) calc(c*0.5) h)`
- Text/heading: direction-dependent clamps referencing `--sf-color-neutral(-light)` plus `--sf-contrast-bias`.
- Text-on-color: `oklch(from <color> clamp(0.1, sign(--sf-contrast-threshold - l)*999, 0.95) 0 0)` — guarantees ≥3:1; mid-luminance (L≈0.52–0.67) may not reach 4.5:1 (binary black/white math limit).
- Links: action hue, lightness clamped to a contrast-safe band; visited = action hue + 60°.

### 4.4 sRGB / HSL fallbacks (`tokens.color-fallbacks.css`)

Ungated, **light mode only** (dark handled exclusively by modern CSS). Override the channel triplets to rebrand the fallback tree:

`--sf-{family}-h / -s / -l` channel variables for: `primary, secondary, tertiary, action, neutral, base, success, warning, error, info, danger`. From these it derives `--sf-color-*` brand/status, `-strong` status variants, surfaces (`bg`/`inset`/`raised`), text (`text`/`--secondary`/`heading`), borders (`border`/`--subtle`/`--strong`), `link`, `selection-bg`, and shadows (`xs`/`s`/`m`/`l`).

---

## 5. Token reference (full inventory)

All tokens use the `--sf-` prefix. Stability tiers: **PUBLIC** (everyday), **PUBLIC-ADVANCED** (stable but niche), **INTERNAL** (may change). Both PUBLIC tiers share the SemVer freeze guarantee.

### 5.1 Color — resolved semantic (`tokens.css`)

- **Brand resolved:** `--sf-color-{primary, secondary, tertiary, action, neutral, base}`
- **Surface alias:** `--sf-color-surface` (→ base)
- **Surfaces (derived):** `--sf-color-{bg, inset, raised, overlay, inverse}`
- **Status resolved:** `--sf-color-{success, warning, error, info, danger}`
- **Status triplets:** each status × `{-strong, -subtle, -muted}`; plus `-ghost`, `-superlight`, `-xlight`, `-lighter`, `-darker`, `-xdark`, `-superdark`, `-hover`, `-active` (status families have no numeric scale by design)
- **Text:** `--sf-color-text`, `--sf-color-text--{secondary, muted, placeholder, disabled, inverse}`, `--sf-color-heading`
- **Text-on-color:** `--sf-color-text--on-{base, surface, inverse, primary, secondary, tertiary, action, neutral, success, warning, error, info, danger}`
- **Borders:** `--sf-color-border`, `--sf-color-border--{subtle, strong, focus, disabled, translucent}`
- **Links:** `--sf-color-link`, `--sf-color-link--{hover, active, visited, disabled, underline}`
- **Interactive bg:** `--sf-color-bg--{hover, active, selected, focus, disabled}`
- **Selection/mark/backdrop:** `--sf-color-selection-bg`, `--sf-color-selection-text`, `--sf-color-mark-bg`, `--sf-color-mark-text`, `--sf-color-dim`
- **Code:** `--sf-color-code-bg`, `--sf-color-code-text` (+ scoped `--sf-color-code-block-bg`, `--sf-color-code-block-text`)
- **Anchors:** `--sf-color-white`, `--sf-color-black`
- **Scheme:** `--sf-color-scheme` (`light dark`)
- **Shade/alpha aliases** for the 6 brand families: `{family}-{superlight, xlight, lighter, darker, xdark, superdark, hover, active, subtle, muted, ghost}` (formula in `tokens.css`; overridden to numeric steps when `tokens.palette.css` loads — it does in optimal).

### 5.2 Gradients

`--sf-gradient-{primary, secondary, tertiary, brand, surface}`, `--sf-gradient-fade--{r, l, t, b}`

### 5.3 Shadows / blur / opacity

- Box shadows: `--sf-shadow-{none, xs, s, m, l, xl, 2xl, inner}`, plus `--sf-shadow-glow`
- Text shadows: `--sf-text-shadow-{none, s, m, l}`
- Drop shadows: `--sf-drop-shadow-{s, m, l}`
- Shadow internals *(advanced)*: `--sf-shadow-strength` (scales with `--sf-is-dark`), `--sf-shadow-color`, `--sf-shadow-glow-color`
- Blur: `--sf-blur-{xs, s, m, l, xl}`
- 3D *(advanced)*: `--sf-perspective-{near, normal, far}`
- Opacity: `--sf-opacity-{0, 10, 25, 50, 75, 100}`, `--sf-opacity-disabled` (0.45), `--sf-state-pending-opacity` (0.7)

### 5.4 Typography

- Families: `--sf-font-{body, heading, display, mono, humanist, geometric, slab}`
- OpenType *(advanced)*: `--sf-font-features`, `--sf-font-variation`, `--sf-optical-sizing`
- Weights numeric: `--sf-font-weight-{thin(100), extralight(200), light(300), normal(400), medium(500), semibold(600), bold(700), extrabold(800), black(900)}`
- Weight aliases: `--sf-font-weight-{body, heading, display}`, `--sf-current-font-weight`
- Fluid sizes: `--sf-text-{2xs, xs, s, m, l, xl, 2xl, 3xl, 4xl}`
- Display sizes: `--sf-text-display-{s, m, l}`
- Leading: `--sf-leading-{tight(1.1), snug(1.3), normal(1.5), relaxed(1.625)}`
- Tracking: `--sf-tracking-{tight, normal, wide, wider, widest}`
- Numeric figures: `--sf-font-numeric` (`tabular-nums`)
- Body aliases: `--sf-body-{font-size, line-height, font-weight, font-family, color, text-wrap, strong-weight, em-style}`
- Code: `--sf-code-font-size` (0.875em)
- Heading aliases: `--sf-heading-{font-family, color, text-wrap}`
- Per-heading: `--sf-h{1..6}-{size, line-height, font-weight, letter-spacing}`

### 5.5 Icons & UI sizes

- Icons (em-based): `--sf-icon-{xs(0.875em), s(1em), m(1.5em), l(2em), xl(3em), 2xl(4em)}`
- UI sizes: `--sf-size-{xs(1.5rem), s(2rem), m(2.5rem), l(2.75rem), xl(3.5rem)}`

### 5.6 Spacing

- Fixed: `--sf-space-{none, px}`, `--sf-space-gutter` (→ space-l)
- Fluid: `--sf-space-{2xs, xs, s, m, l, xl, 2xl, 3xl, 4xl}` (all × `--sf-space-scale`)
- BEM aliases: `--sf-gap`, `--sf-content-gap`, `--sf-component-pad`, `--sf-field-block`, `--sf-field-required-marker` (`" *"`), `--sf-link-external-marker` (`" ↗"`)
- Canonical-source aliases: `--sf-space-gap`→`--sf-gap`, `--sf-space-content`→`--sf-content-gap`
- Section padding: `--sf-section-pad` (→ -m), `--sf-section-pad--{xs, s, m, l, xl, 2xl}`

### 5.7 Containers, ratios, borders, radius, divider

- Containers: `--sf-container-{narrow(38rem), prose(65ch), default(75rem), wide(90rem), full(100%)}`
- Ratios: `--sf-ratio-{square, video, cinema, 4-3, 3-2, portrait, golden}`
- Border widths: `--sf-border-width-{hairline(0.5px), 1, 2, 3, 4}`
- Border styles: `--sf-border-style`(solid), `--sf-border-style-{strong, soft(dashed), dotted}`
- Border shorthands: `--sf-border`, `--sf-border-subtle`, `--sf-border-strong`
- Divider: `--sf-divider-{width, style, color, gap}`
- Radius: `--sf-radius-{none, xs, s, m, l, xl, 2xl, 3xl, 4xl}` (× `--sf-radius-scale`), `--sf-radius-full`(9999px, unscaled), `--sf-radius-pill`(→full), `--sf-radius-outer` *(advanced concentric helper)*
- Multi-column: `--sf-col-width-{s, m, l}`, `--sf-col-rule-width-{s, m, l}`
- Stroke: `--sf-stroke-{thin, regular, bold, heavy}`
- Object: `--sf-object-fit`(cover), `--sf-object-position`(50% 50%)

### 5.8 Motion

- Durations: `--sf-duration-{none, instant, fast, normal, slow, slower}` (× `--sf-motion-scale`)
- Easing: `--sf-ease-{linear, out, in, in-out, spring, elastic, bounce, overshoot}`
- Transitions: `--sf-transition-{all, colors, transform, opacity, shadow, fast, slow, enter, exit, overlay}`
- Animation presets: `--sf-animation-{fade-in, fade-out, slide-in-up, slide-in-down, slide-in-left, slide-in-right, scale-up, scale-down, color-pulse, ping, blink, float, spin, shimmer}`
- Stagger delays: `--sf-animation-delay-{1..5}`
- Scroll-driven *(advanced)*: `--sf-scroll-timeline-range-{start, end}`
- Mask scrim *(advanced)*: `--sf-mask-scrim-{start, end}`

### 5.9 Z-index, layout/a11y, focus, scrollbar

- Z-index: `--sf-z-{below(-1), base(0), raised(1), low(10), mid(100), high(500), top(900), max(9999)}`
- Header/sticky: `--sf-header-height{, -mobile, -desktop}`, `--sf-sticky-offset{, -mobile, -desktop}`
- Focus: `--sf-focus-ring-{width(2px), offset(2px), style, color}`, `--sf-focus-ring-shadow` *(advanced)*
- Caret: `--sf-caret-color`
- Scrollbar: `--sf-scrollbar-{thumb, track}`
- Touch: `--sf-touch-target` (→ size-l)
- Contrast *(advanced)*: `--sf-contrast-bias`(0), `--sf-contrast-threshold`(0.6)
- LumLocker *(advanced)*: `--sf-lumlocker`(0.65)
- Safe-area *(advanced)*: `--sf-safe-{top, bottom, left, right}`
- Scale multipliers *(advanced)*: `--sf-space-scale`, `--sf-text-scale`, `--sf-text-display-scale`, `--sf-radius-scale`, `--sf-motion-scale`

### 5.10 Print *(advanced)*

`--sf-print-{page-margin(2cm), page-size(a4), base-size(11pt)}`

### 5.11 State flags

- *(advanced)* `--sf-is-active`, `--sf-is-current`, `--sf-is-pressed`, `--sf-is-open` (registered `<integer>`, default 0)
- **INTERNAL:** `--sf-is-dark` (set by themes.css; do not set directly)

### 5.12 Link geometry

`--sf-link-underline-offset`(0.15em), `--sf-link-underline-thickness`(auto)

### 5.13 Layout primitive tokens (`tokens.layout.css`)

Per-primitive override knobs (all PUBLIC):

| Primitive | Tokens |
|-----------|--------|
| Stack | `--sf-stack-gap` |
| Gap | `--sf-gap-size` |
| Box | `--sf-box-{padding, border-width, border-color}` |
| Center | `--sf-center-{max, gutter}` |
| Cluster | `--sf-cluster-{gap, align, justify}` |
| Sidebar | `--sf-sidebar-{gap, min-width, width}` |
| Switcher | `--sf-switcher-{threshold, gap}` |
| Grid | `--sf-grid-{min, gap}`, `--sf-grid-min-{xs, s, m, l, xl, 2xl}` |
| Equal | `--sf-equal-{cols, gap}` |
| Cover | `--sf-cover-{min-height, padding}` |
| Frame | `--sf-frame-ratio` |
| Icon (boxed) | `--sf-icon-box-{pad, radius, bg, border}` |
| Reel | `--sf-reel-{item-width, gap, height}` |
| Imposter | `--sf-imposter-margin` |
| Bento | `--sf-bento-{cols-default, row-default, row-compact, row-tall, gap}` |
| Content grid | `--sf-breakout-width`, `--sf-content-width` |
| Prose | `--sf-prose-paragraph` |
| Alternate | `--sf-alternate-{gap, inner-gap}` |
| Shared aliases | `--sf-space-gap`, `--sf-space-content` |
| Scoped overrides | `--sf-icon-size`, `--sf-bento-cols`, `--sf-bento-row` |

### 5.14 Macro tokens (`tokens.macros.css`)

`--sf-flow-space`, `--sf-line-clamp`(3), `--sf-truncate-suffix`(`"…"`), `--sf-aspect`(16/9), `--sf-prose-{heading-gap, list-gap, block-margin, media-margin, media-radius, figure-margin, marker-color, figcaption-size}`, `--sf-scroll-shadow-size`(2rem), `--sf-content-intrinsic-size`(500px), `--sf-scrim-{color, direction, gradient, text-shadow}`

### 5.15 Palette tokens — `optional/tokens.palette.css`

For each of the **6 brand families** (`primary, secondary, tertiary, action, neutral, base`):
- **Numeric scale:** `-50, -100, -200, -300, -400, -500, -600, -700, -800, -900, -950` (500 = base color; tints mix toward `--sf-color-surface`, shades toward `--sf-color-text`; `base` uses an inverted V-shaped ramp).
- **Alpha variants:** `-a5, -a10, -a20, -a30, -a40, -a50, -a60, -a70, -a80, -a90, -a95` (mixed with `transparent`).
- **Shade aliases (→ numeric):** `-superlight(50), -xlight(200), -lighter(400), -darker(600), -xdark(800), -superdark(950)`.
- **Functional aliases:** `-hover(→darker), -active(→xdark), -subtle(→a10), -muted(→a30), -ghost(→a5)`.

Computed with `color-mix(in oklab, …)` (Cartesian, no hue drift). Status families are intentionally excluded (they keep only subtle/muted/strong from core).

### 5.16 Extended-size tokens — `optional/tokens.sizes-extended.css`

- **Spacing bridges** (fluid clamp from larger step's max → smaller step's min, × `--sf-space-scale`): full descending matrix `--sf-space-{A}-to-{B}` for A>B over `{4xl,3xl,2xl,xl,l,m,s,xs,2xs}` (e.g. `--sf-space-4xl-to-3xl` … `--sf-space-xs-to-2xs`).
- **Text bridges** (no scale multiplier): full descending matrix `--sf-text-{A}-to-{B}` over `{4xl,3xl,2xl,xl,l,m,s,xs,2xs}`.
- **Per-text-size sub-properties** (opt-in, not auto-applied) for each size `{2xs, xs, s, m, l, xl, 2xl, 3xl, 4xl}`: `--sf-text-{size}-{line-height, font-weight, letter-spacing, max-width}`. Defaults encode typographic convention (large = tight leading; small = relaxed leading + measure cap).

---

## 6. Elements styled (no classes required)

### 6.1 `reset.css` (`slashed.reset`)

- `*, *::before, *::after` → `box-sizing: border-box`
- `html` → text-size-adjust 100%, `scroll-padding-top`, `scrollbar-gutter: stable`, `color-scheme`, `hanging-punctuation: first last`; `interpolate-size: allow-keywords` (gated)
- `body` → `min-height:100dvh`, `min-inline-size:320px`
- `button` → `text-transform:none`; `search` → block; `summary` → pointer; `table` → border-collapse; `[hidden]` → `display:none !important`; `dialog,[popover]` → reset padding/border, `background:Canvas`; `fieldset` → `min-width:0`; `[inert]` → default cursor

> Deliberately does **not** zero global margins/padding or strip list markers — keeps the reset composable with third-party UI (WP admin bar, builders).

### 6.2 `base.css` (`slashed.base`)

Styled elements: `body`, `h1–h6`, `p`, `b/strong`, `em`, `small`, `mark`, `abbr[title]`, `kbd/samp`, `sub/sup`, `a:link/:hover/:visited/:active`, `code`, `pre`, `pre code`, `img/picture/video/canvas`, `img/video` (object-fit), `iframe/embed/object`, `hr`, `:target`, `::selection`, `th/caption`, form controls (`button, input, select, textarea` font/color inheritance), `button` cursor, `touch-action`, `textarea` resize, `optgroup`, `::placeholder`, `blockquote`, `dt`, `dd`, `table`, `th`, `td/th`.

> The `a:link` (not bare `a`) selector is intentional — matches WebKit UA `a:link { color:-webkit-link }` specificity. Rich blocks (table/blockquote/figure/dl) get only minimal distinction here; full styling lives in `.sf-prose`. Interactive widgets (dialog/details/progress/meter) are consumer/component territory.

---

## 7. Theming (`themes.css`, `slashed.themes`)

Token reassignment only — no new selectors/properties.

- **OS preference:** `@media (prefers-color-scheme: dark)` on `:root:not([data-theme])` → `color-scheme:dark; --sf-is-dark:1`.
- **Explicit:** `[data-theme="light"]` / `[data-theme="dark"]` (works on `:root` or any element for section-level theming).
- **Section-level theming:** full token re-declaration on `[data-theme]` elements (light-dark() only resolves at declaration on `:root`, so child theming re-declares every mode-sensitive token with explicit light/dark formulas). Gated in `@supports (color: oklch(from red l c h))`.
- **LumLocker:** opt-in `:root[data-lumlocker]` locks the 5 brand colors (not base) to a shared OKLCH lightness (`--sf-lumlocker`, default 0.65), preserving each hue/chroma. Per-color escape by overriding under `:root[data-lumlocker]`.
- **Multi-brand:** scope a palette by re-declaring the 6 source tokens under any selector (e.g. `[data-brand="x"]`).
- **Theme transition:** toggling `[data-theme]` via `document.startViewTransition()` animates `::view-transition(root)` (rules in motion.css).

**Usage:**
```html
<html>                       <!-- follows OS -->
<html data-theme="dark">     <!-- whole page dark -->
<section data-theme="dark">  <!-- section dark inside light page -->
```

---

## 8. Layout primitives — `layout.css` (`slashed.layout`)

| Class | Purpose | Modifiers |
|-------|---------|-----------|
| `.sf-section` | Vertical section padding | `--xs, --s, --m, --l, --xl, --2xl`, `--collapse` (50/50 boundary share) |
| `.sf-section-group` | Removes double padding between stacked sections | — |
| `.sf-divider` | Standalone separator | `--vertical, --soft, --strong, --dashed, --dotted, --gradient` |
| `.sf-container` | Max-width centered container; establishes named container `sf-layout` | `--narrow, --prose, --wide, --full` |
| `.sf-stack` | Flex column, even vertical gap | `--xs, --s, --m, --l, --xl, --2xl`, `--center, --end, --stretch` |
| `.sf-gap` | Inject gap into existing flex/grid | `--xs, --s, --m, --l, --xl, --2xl` |
| `.sf-box` | Padding + optional outline border | — |
| `.sf-center` | Centered max-inline-size with gutters (content-box) | `--intrinsic` |
| `.sf-cluster` | Flex-wrap group | `--xs…--2xl`, `--no-wrap, --center, --end, --between` |
| `.sf-sidebar` | Two-column sidebar/main (collapses responsively) | `--right, --narrow, --wide` |
| `.sf-switcher` | Column↔row switch, no media queries | `--no-wrap, --vertical` |
| `.sf-grid` | Auto-fill grid, breakpoint-free | `--fit` (auto-fit), `--xs…--2xl`, `--dense` |
| `.sf-icon` | Inline icon sizing (em-based) | `--xs…--2xl`, `--boxed` |
| `.sf-cover` | Full-height flex column; `.sf-cover__center` centers | `--min, --max, --padding-s, --padding-l` |
| `.sf-frame` | Aspect-ratio media container (object-fit cover) | `--square, --video, --cinema, --portrait, --4-3, --3-2, --golden` |
| `.sf-reel` | Horizontal scroll-snap | — |
| `.sf-imposter` | Absolutely-centered overlay | `--fixed, --contain` |
| `.sf-alternate` | Zigzag/media-object (container-query, named `sf-alternate`) | — |
| `.sf-pancake` | Sticky-footer grid (`auto 1fr auto`, 100dvh) | — |
| `.sf-grid-1/2/3/4/6` | Fixed-column grids, container-query responsive | — |
| `.sf-grid-1-2 / 2-1 / 1-3 / 3-1` | Two-column ratio grids (CQ) | — |
| `.sf-equal` | Fixed N-column grid (never collapses) | `--2, --3, --4, --6` |
| `.sf-content-grid` | Breakout grid; children `.sf-breakout`, `.sf-full-bleed` | — |
| `.sf-bento` | Auto-flow-dense bento grid (CQ) | `--2, --4, --compact, --tall` |
| `.sf-subgrid` / `.sf-subgrid-rows` | Subgrid inheritance | — |

> Fixed-column `.sf-grid-N`, ratio grids, and `.sf-bento` use **anonymous `@container` queries** — they need a container-context ancestor (e.g. `.sf-container`) to respond.

---

## 9. Macro classes — `macros.css` (`slashed.macros`)

| Class | Purpose |
|-------|---------|
| `.sf-prose` | Long-form vertical rhythm (headings, lists, blockquote, img, figure, table, video, `::marker`). `.sf-not-prose` resets within. |
| `.sf-flow` | Lobotomized-owl spacing (`> * + *`) via `--sf-flow-space` |
| `.sf-truncate` | Single-line ellipsis |
| `.sf-line-clamp-2 / -3 / -N` | Multi-line clamp (`-N` reads `--sf-line-clamp`) |
| `.sf-equal-height` | Force flex children to equal height |
| `.sf-aspect` | Generic aspect-ratio container (content-agnostic) |
| `.sf-scroll-shadow` | Top+bottom mask-gradient fade on vertical scroll |
| `.sf-scroll-snap` | Vertical scroll-snap container (`> *` snap-start) |
| `.sf-overflow-fade` | End-edge horizontal mask fade |
| `.sf-no-tap-highlight` | Removes WebKit/Android tap highlight |
| `.sf-surface--{primary, secondary, tertiary, action, neutral, inverse, success, warning, error, info, danger}` | Background + auto-contrast foreground; re-declares descendant text/border tokens (gated `@supports`) |
| `.sf-scrim` | Darkening gradient overlay for text over images; `.sf-scrim__content`; `--top, --bottom, --full` |
| `.sf-text-protect` | Shadow halo for text over images (no darkening) |
| `.sf-text-gradient` | Gradient-filled text (`-webkit-background-clip:text` + unprefixed) |
| `.sf-link-external` | Appends external-link marker via `::after` |
| `.sf-content-auto` | `content-visibility:auto` + intrinsic size |
| `.sf-tabular-nums` | Tabular figures |
| `.sf-link--subtle` | Underline only on hover/focus (`:link`/`:visited`) |
| `.sf-link--reverse` | Underlined by default, removed on hover/focus |

---

## 10. State classes — `states.css` (`slashed.states`)

Prefix `.is-*`. Low specificity (single class), token-driven, minimal property sets.

| Group | Classes |
|-------|---------|
| Visibility | `.is-hidden` (`!important`), `.is-invisible`, `.is-visible` |
| Interactivity | `.is-disabled`, `.is-readonly` |
| Loading/async | `.is-loading` (spinner via `sf-spin`), `.is-busy`, `.is-pending` (optimistic UI), `.is-skeleton` (shimmer) |
| Active/selected/current | `.is-active`, `.is-selected`, `.is-current` (sets `--sf-current-font-weight`), `.is-highlighted`, `.is-pressed` |
| Open/closed | `.is-open`, `.is-collapsed`, `.is-expanded` |
| Validation/feedback | `.is-valid`, `.is-invalid`, `.is-success`, `.is-error`, `.is-warning`, `.is-info`, `.is-danger` (set `--sf-field-border-color` + `--sf-field-text-color`) |
| Position/stickiness | `.is-sticky`, `.is-pinned`, `.is-fixed`, `.is-fullscreen`, `.is-resizable` |
| Overflow/clipping | `.is-clipped` (`!important`), `.is-scrollable`, `.is-truncated` |
| Drag & drop | `.is-dragging`, `.is-drop-target`, `.is-draggable` |
| Overlay | `.is-overlay` |
| Focus/interaction | `.is-clickable`, `.is-unselectable`, `.is-focused` |
| Empty | `.is-empty:empty` |

**Overlap semantics:** `.is-valid`/`.is-invalid` = form-field validation (maps to `aria-invalid`); `.is-success`/`.is-error` = general component feedback; `.is-danger` = destructive-action context (not validation). `.is-valid`≡`.is-success` and `.is-invalid`≡`.is-error` in CSS but differ semantically.

---

## 11. Motion — `motion.css` (`slashed.motion`)

All animation classes are gated by `@media (prefers-reduced-motion: no-preference)`.

- **Smooth scroll:** `html { scroll-behavior:smooth }` (auto on `:focus-within`)
- **Interactive transitions:** `a, button, input, select, textarea, summary` transition the full animatable property set at `--sf-duration-fast`/`--sf-ease-out`
- **View transitions:** `::view-transition-old/new(root)` (gated `@supports`)
- **Entrance classes (one-shot):** `.sf-fade-in, .sf-fade-out, .sf-slide-in-{up, down, left, right}, .sf-scale-up, .sf-scale-down`
- **Scroll-driven entrance:** `.sf-entrance--{fade, fade-up, fade-down, fade-left, fade-right, scale-up}` (use `animation-timeline:view()` where supported; gated `@supports`, falls back to one-shot)
- **Color pulse:** `.sf-color-pulse` (gated on `@property` color interpolation)
- **Keyframes:** `sf-fade-in, sf-fade-out, sf-slide-in-{up,down,left,right}, sf-scale-up, sf-scale-down, sf-spin, sf-shimmer, sf-ping, sf-blink, sf-float, sf-color-pulse`

> `sf-spin` and `sf-shimmer` power `.is-loading` / `.is-skeleton` in states.css. `@starting-style` rules are intentionally not shipped globally (element-specific).

---

## 12. Accessibility — `accessibility.css` (`slashed.accessibility`)

Critical a11y rules use `!important` selectively (only genuine barriers).

- **Focus:** `:focus:not(:focus-visible){outline:none}`; `:focus-visible` ring **hardened** (`!important`, WCAG 2.4.7)
- **`.sf-focus-shadow`** — opt-in box-shadow focus ring (forced-colors restores outline)
- **Reduced motion:** `@media (prefers-reduced-motion: reduce)` zeroes durations (token + property-level `!important` on `*, ::before, ::after`)
- **`.no-motion`** — manual consumer motion opt-out (same suppression)
- **High contrast:** `@media (prefers-contrast: more)` → `--sf-focus-ring-width:3px`, `--sf-contrast-bias:0.06`, thicker `hr`
- **Reduced transparency:** `@media (prefers-reduced-transparency: reduce)` → opaque `::backdrop`
- **Touch targets:** `@media (pointer: coarse)` → min touch-target on buttons/inputs/select/summary/checkbox/radio (WCAG 2.5.5, left non-`!important`)
- **Disabled:** `[disabled], [aria-disabled="true"]` → `cursor:not-allowed`
- **`.sr-only` / `.sr-only-focusable`** — screen-reader-only (hardened, all `!important`)
- **`.skip-link` / `.skip-link:focus`** — skip navigation link
- **`.sf-focus-parent:focus-within`** — focus ring on parent
- **`.sf-clickable-parent`** — card-with-link pattern (`[data-overlay-link]`, `[data-no-overlay]`, `--sf-clickable-overlay-z`, `:focus-within` ring)
- **Forced colors:** `@media (forced-colors: active)` → `Highlight` focus color, drop decorative shadows (zero-specificity), re-assert form-control borders

---

## 13. Print — `print.css` (`slashed.print`)

- `.print-only` — hidden on screen, revealed in print
- `@media print`: `@page { size:a4 portrait; margin:2cm }` (var() invalid in `@page`, hardcoded); body font `--sf-print-base-size`(11pt); strip shadows; expand link URLs via `::after attr(href)` (excludes `#`, `javascript:`, `mailto:`, `tel:`, `.sf-link-external`); `abbr[title]::after`; break-inside avoidance for media/table/pre/blockquote; `thead` as header group; heading `break-after:avoid`; orphans/widows 3; bordered pre/blockquote
- **Hide-list** (`!important`): `nav, aside, button, input, select, textarea, audio, video, dialog, [popover], .no-print`
- `details` preserved (open/closed); `summary` hidden (`!important`)
- **Color opt-ins:** `.print-color-exact` (force exact colors `!important`) and `.print-no-color` (transparent bg + `CanvasText` `!important`)

---

## 14. Forms — `optional/forms.css` (`slashed.forms`)

Classless native styling (opt-in module).

- **Text-like inputs / select / textarea:** `appearance:none`, full-width block, padding, font, color, `--sf-color-surface` bg, token border reading `--sf-field-border-color`, radius, transition. (Excludes `[type="color"]`.)
- **Focus:** `:focus-visible` → `--sf-color-border--focus` border + outline
- **Disabled:** muted bg/text + `not-allowed`
- **Placeholder:** `--sf-color-text--placeholder`
- **Autofill:** inset box-shadow repaint to surface (`:autofill` + `:-webkit-autofill`)
- **Native validation:** `:user-invalid`→error, `:user-valid`→success (set `--sf-field-border-color`; additive to JS `.is-*`)
- **Numeric inputs:** tabular figures
- **Textarea:** min-height 6rem, `resize:vertical`, `field-sizing:content`
- **Select:** chevron via data-URI SVG (`FieldText` system color, RTL-mirrored)
- **Buttons** (`button`, `input[type=submit/reset/button]`): inline-flex, action bg, on-action text, hover (`--sf-color-action-hover` fallback), focus ring, disabled
- **Checkbox/radio:** `accent-color`, sizing
- **File input:** `::file-selector-button` styled as button
- **Range:** track + thumb (WebKit + Firefox pseudo-elements), focus ring
- **Fieldset/legend:** bordered fieldset, weighted legend
- **Label:** block, weighted, reads `--sf-field-text-color`; required marker via `:has(:required)` / `:has(+ :required)` → `--sf-field-required-marker`

> State integration: validation `.is-*` classes (states.css) set `--sf-field-border-color` (consumed) and `--sf-field-text-color` (a hook for your own message/label CSS).

---

## 15. Legacy fallbacks — `optional/legacy.css` (`slashed.legacy`)

Loads last; declared before `slashed.overrides` so consumer overrides always win. **Non-color property smoothing only** (color fallbacks live in tokens layer). All gated `@supports not (...)` → inert on modern engines.

1. **`dvh`** — `@supports not (height:100dvh)` → `body { min-height:100vh }` (Safari 15.0–15.3)
2. **`:focus-visible`** — `@supports not selector(:focus-visible)` → `:focus` shows the ring (Safari <15.4; prevents whole accessibility focus rule from being dropped — WCAG 2.4.7)
3. **`scrollbar-gutter`** — `@supports not (scrollbar-gutter:stable)` → `html { overflow-y:scroll }` (Safari, all versions to date)

---

## 16. Quick customization recipes

**Rebrand (6 tokens):**
```css
:root {
  --sf-color-primary-light:   #3b5bdb;
  --sf-color-secondary-light: oklch(0.22 0.04 264);
  --sf-color-tertiary-light:  oklch(0.42 0.22 295);
  --sf-color-action-light:    #0ca678;
  --sf-color-neutral-light:   #495057;
  --sf-color-base-light:      #f8f9fa;
}
```
Dark mode auto-derives. Add `--sf-color-{name}-dark` for full per-mode control (up to 22 color tokens: 11 light + 11 dark).

**Global multipliers:** `--sf-space-scale`, `--sf-text-scale`, `--sf-radius-scale`, `--sf-motion-scale`.

**Consume tokens in your own BEM CSS:**
```css
.card { box-shadow: var(--sf-shadow-m); gap: var(--sf-gap); border-radius: var(--sf-radius-m); }
```

**Override gaps everywhere:** set `--sf-gap` (canonical source of `--sf-space-gap` → all layout primitives).
