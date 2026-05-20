# SLASHED API Coverage Audit vs Reference Frameworks

**Date:** 2025  
**Frameworks compared:** Tailwind CSS v4, Open Props v2, Bulma v1, Bootstrap 5, Automatic.css v3  
**Scope:** Token breadth, color system, layout, states, utilities, components, typography, motion, accessibility, modern CSS

---

## Executive Summary

SLASHED has an impressively deep **token system** and **layout primitive layer** that rivals or exceeds most reference frameworks in sophistication. Its three-layer color architecture (source / resolved / derived) with automatic dark mode derivation is unique in the field. However, it has significant gaps in **utility classes**, **component tokens**, **BEM components**, and **animation presets** that prevent it from being a complete developer toolkit today.

---

## 1. Design Token Breadth

| Token Category | SLASHED | Tailwind v4 | Open Props v2 | Bulma v1 | Bootstrap 5 | Automatic.css |
|---|---|---|---|---|---|---|
| Color (brand slots) | 6 brand + 5 status | 22 hue families | 20 hue families | 8 theme colors | 8 theme colors | 6 contextual |
| Color (surfaces/text/border) | 20+ semantic | via utilities | - | basic | body/secondary/tertiary | limited |
| Typography scale | 12 fluid + 3 display | 13 static | 9 static + 4 fluid | 7 sizes | 6 sizes | fluid scale |
| Font families | 4 stacks | 3 stacks | 16 named stacks | 2 stacks | 2 stacks | 3 stacks |
| Font weights | 4 (body/bold/heading/display) | 9 (100-900) | 9 (100-900) | few | 7 | limited |
| Line heights | 4 | 5 | 6 | implicit | 3 | limited |
| Letter spacing | 5 | 6 | 8 | - | - | - |
| Spacing (fluid) | 9 fluid steps | linear multiplier | 10 fluid | static | static | fluid |
| Sizing (UI) | 5 sizes + icons | via spacing | 15 sizes | - | - | limited |
| Containers | 5 | 13 | 3 content-width | 1 | 5 breakpoint-based | limited |
| Radius | 10 scalable | 8 | 6 + drawn + blob + conditional | 1 | 6 | limited |
| Shadow | 8 (dark-adaptive) | 8 | 6 + 4 inner | 1 | 4 | limited |
| Blur | 5 | 7 | - | - | - | - |
| Motion/easing | 6 durations + 6 easings | 3 easings + 4 animations | 50+ easings + 20+ animations | - | basic | limited |
| Z-index | 8 named | via utility | 6 layers | implicit | 5 | - |
| Aspect ratios | 6 | 1 (video) | 6 | - | - | - |
| Opacity | 6 steps | via utility | - | - | 5 | - |
| Fluid/responsive | space + type | type only | both | - | - | both |
| Themeable via override | 6 tokens rebrand | CSS vars | CSS vars | Sass | Sass + CSS | dashboard |
| Dark mode aware | automatic | manual class | @media only | manual | data-bs-theme | - |

---

## 2. Color System Depth

| Feature | SLASHED | Tailwind v4 | Open Props v2 | Bulma v1 | Bootstrap 5 | Automatic.css |
|---|---|---|---|---|---|---|
| Brand color slots | 6 | raw palette | raw palette | 8 fixed | 8 fixed | 6 |
| Status colors (success/warning/error/info/danger) | 5 with triplets | via palette | - | 5 | 5 | 4 |
| Palette generation (tints/shades/alpha) | color-mix 8+5 per color | 11 shades per hue (oklch) | 13 shades per hue (hex) | Sass functions | Sass tint/shade | - |
| Dark mode approach | automatic (relative color) | manual dark: variant | @media swap | manual | data-attribute | - |
| Scoped theming | data-theme on any element | class-based | - | - | data-bs-theme | - |
| Text-on-color contrast | automatic sign(0.6-l) | manual | - | - | Sass contrast fn | - |
| Surface hierarchy | bg/surface/well/raised/overlay/inverse | - | - | basic | body/secondary/tertiary | - |
| Interactive state colors | hover/active/selected/focus/disabled | via hover utilities | - | partial | partial | partial |

---

## 3. Layout Primitives

| Layout Pattern | SLASHED | Tailwind v4 | Open Props v2 | Bulma v1 | Bootstrap 5 | Automatic.css |
|---|---|---|---|---|---|---|
| Stack (vertical rhythm) | .sf-stack | space-y utility | - | - | - | partial |
| Cluster (inline wrap) | .sf-cluster | flex-wrap utilities | - | level | flex utilities | - |
| Sidebar (asymmetric) | .sf-sidebar | manual flex | - | - | - | - |
| Grid (auto-fill/fit) | .sf-grid + variants | grid utilities | - | columns (12-col) | 12-col grid | grid |
| Fixed column grids | .sf-grid-1 to -6, ratio grids | grid-cols utility | - | is-1 to is-12 | col-1 to col-12 | partial |
| Content grid (breakout) | .sf-content-grid | - | - | - | - | yes |
| Reel (horizontal scroll) | .sf-reel | - | - | - | - | - |
| Bento grid | .sf-bento | - | - | - | - | - |
| Center | .sf-center | mx-auto | - | container | container | partial |
| Prose / long-form | .sf-prose | @tailwindcss/typography | - | content class | - | partial |
| Cover (full-height) | .sf-cover | - | - | hero | - | - |
| Frame (aspect ratio) | .sf-frame | aspect utility | - | image | ratio helper | - |
| Imposter (overlay center) | .sf-imposter | manual | - | - | - | - |
| Switcher (threshold) | .sf-switcher | - | - | - | - | - |
| Alternate (zigzag) | .sf-alternate | - | - | - | - | - |
| Pancake (sticky footer) | .sf-pancake | - | - | - | - | - |
| Box (padded container) | .sf-box | - | - | box | card body | - |
| Section | .sf-section | - | - | section | - | yes |
| Container | .sf-container | container utility | - | container | container | yes |
| Subgrid | .sf-subgrid | - | - | - | - | - |
| Container queries | used throughout | @container variant | - | - | - | - |
| Responsive breakpoints (media) | uses CQ only | sm/md/lg/xl/2xl | - | mobile-first | sm-xxl | yes |

---

## 4. State Classes

| State | SLASHED | Tailwind v4 | Open Props v2 | Bulma v1 | Bootstrap 5 | Automatic.css |
|---|---|---|---|---|---|---|
| Hidden/visible/invisible | yes | hidden utility | - | is-hidden | d-none/visible | - |
| Disabled | .is-disabled | disabled: variant | - | - | .disabled | - |
| Loading (spinner) | .is-loading | - | - | is-loading | spinner component | - |
| Skeleton | .is-skeleton | - | - | is-skeleton | placeholder | - |
| Active/selected/current | yes | via variants | - | is-active | .active | - |
| Open/collapsed/expanded | yes | - | - | - | .collapse | - |
| Valid/invalid/warning | yes | via variants | - | - | is-valid/invalid | - |
| Sticky/pinned/fixed | yes | sticky utility | - | - | position utilities | - |
| Dragging/drop-target | yes | - | - | - | - | - |
| Truncated/clipped/scrollable | yes | truncate utility | - | - | text-truncate | - |
| Busy (progress cursor) | yes | - | - | - | - | - |
| **Missing: .is-focused** | ABSENT | focus: variant | - | - | - | - |
| **Missing: .is-pressed** | ABSENT | - | - | - | - | - |
| **Missing: .is-pending** | ABSENT | - | - | - | - | - |

---

## 5. Utility Classes

| Utility Category | SLASHED | Tailwind v4 | Open Props v2 | Bulma v1 | Bootstrap 5 | Automatic.css |
|---|---|---|---|---|---|---|
| Display | TODO | yes | - | yes | yes | partial |
| Flex/grid helpers | TODO | yes | - | yes | yes | partial |
| Spacing (margin/padding) | TODO | yes | - | yes | yes | yes |
| Typography (size/weight/align) | TODO | yes | - | yes | yes | yes |
| Color (text/bg) | TODO | yes | - | yes | yes | yes |
| Border / radius | TODO | yes | - | - | yes | partial |
| Overflow | TODO | yes | - | - | yes | - |
| Position | TODO | yes | - | - | yes | - |
| Sizing (w/h) | TODO | yes | - | - | yes | partial |
| Cursor | TODO | yes | - | - | - | - |
| Z-index | TODO | yes | - | - | yes | - |
| Gap | TODO | yes | - | yes | yes | partial |
| Object-fit | TODO | yes | - | - | yes | - |

---

## 6. Component Tokens

| Component Token Namespace | SLASHED | Open Props v2 | Bootstrap 5 | Automatic.css |
|---|---|---|---|---|
| Button tokens | TODO | --btn-* | --bs-btn-* | yes |
| Card tokens | TODO | - | --bs-card-* | partial |
| Form/input tokens | partial (field-border/text in states) | - | --bs-form-* | yes |
| Alert/notice tokens | TODO | - | --bs-alert-* | - |
| Modal/dialog tokens | TODO | - | --bs-modal-* | - |
| Nav/menu tokens | TODO | - | --bs-nav-* | partial |
| Badge tokens | TODO | - | --bs-badge-* | - |
| Table tokens | TODO | - | --bs-table-* | - |
| Tooltip tokens | TODO | - | --bs-tooltip-* | - |

---

## 7. BEM / Component Layer

| Component | Usage Frequency | DIY Difficulty | Token Value | SLASHED | Bulma | Bootstrap |
|---|---|---|---|---|---|---|
| Button | Critical | Medium | High | TODO | yes | yes |
| Form inputs | Critical | High | High | TODO | yes | yes |
| Card | High | Low | Medium | TODO | yes | yes |
| Alert/notice | High | Low | High | TODO | yes | yes |
| Badge/tag | High | Low | Medium | TODO | yes | yes |
| Modal/dialog | High | High | Medium | TODO | yes | yes |
| Navigation/navbar | High | High | Medium | TODO | yes | yes |
| Table | Medium | Medium | Medium | TODO | yes | yes |
| Tooltip/popover | Medium | High | Low | TODO | - | yes |
| Breadcrumb | Medium | Low | Low | TODO | yes | yes |
| Avatar | Medium | Low | Medium | TODO | - | - |
| Accordion/disclosure | Medium | Medium | Medium | TODO | - | yes |
| Progress bar | Low | Low | Medium | TODO | yes | yes |

---

## 8. Typography System

| Feature | SLASHED | Tailwind v4 | Open Props v2 | Bulma v1 | Bootstrap 5 | Automatic.css |
|---|---|---|---|---|---|---|
| Fluid type scale | clamp-based | static | 4 fluid sizes | - | - | yes |
| Heading tokens (h1-h6) | size + lh + tracking | via utilities | - | implicit | Sass vars | yes |
| Display sizes | 3 fluid display | via text-* | - | - | 6 display classes | - |
| Measure (max line-length) | --sf-container-prose: 65ch | max-w-prose | --size-content-3: 60ch | - | - | partial |
| Optical sizing token | ABSENT | - | - | - | - | - |
| font-feature-settings token | ABSENT | --font-sans--font-feature-settings | - | - | - | - |
| Variable font axis tokens | ABSENT | --font-*--font-variation-settings | - | - | - | - |
| Named font stacks (beyond 4) | 4 generic | 3 | 16 curated | - | - | - |
| Prose/long-form styling | .sf-prose comprehensive | @typography plugin | - | .content | - | partial |

---

## 9. Motion / Animation

| Feature | SLASHED | Tailwind v4 | Open Props v2 | Bulma v1 | Bootstrap 5 | Automatic.css |
|---|---|---|---|---|---|---|
| Duration tokens | 6 scalable | 1 default | implicit | - | - | partial |
| Easing tokens | 6 (incl spring, elastic) | 3 | 50+ (spring, bounce, elastic) | - | - | - |
| prefers-reduced-motion | comprehensive | motion-safe/reduce | - | - | partial | - |
| Named animation presets | only sf-spin + sf-shimmer | 4 (spin, ping, pulse, bounce) | 20+ (fade, slide, scale, shake, float) | - | - | - |
| View transition tokens | basic root transition | - | - | - | - | - |
| Scroll-driven animation tokens | ABSENT | - | - | - | - | - |
| Animation composition utilities | ABSENT | - | - | - | - | - |
| @starting-style support | ABSENT | - | - | - | - | - |
| Transition shorthand tokens | 5 (base/fast/slow/enter/exit) | - | - | - | - | - |

---

## 10. Accessibility Beyond sr-only

| Feature | SLASHED | Tailwind v4 | Open Props v2 | Bulma v1 | Bootstrap 5 | Automatic.css |
|---|---|---|---|---|---|---|
| sr-only / visually-hidden | yes | yes | - | - | yes | - |
| Skip link | yes | - | - | - | - | - |
| Focus-visible tokens | ring width/offset/color | ring utilities | - | - | focus-ring | - |
| prefers-reduced-motion | comprehensive | yes | - | - | partial | - |
| prefers-contrast: more | ring thickens | - | - | - | - | - |
| prefers-reduced-transparency | backdrop | - | - | - | - | - |
| Touch target enforcement | 44px on coarse pointer | - | - | - | - | - |
| forced-colors / high contrast | ABSENT | forced-color-adjust | - | - | - | - |
| ARIA live region utilities | ABSENT | - | - | - | partial | - |
| Color-scheme token | yes | dark variant | - | - | data-bs-theme | - |
| Safe area insets | env() tokens | - | - | - | - | - |

---

## 11. Modern CSS Features

| Feature | SLASHED | Tailwind v4 | Open Props v2 | Bulma v1 | Bootstrap 5 | Automatic.css |
|---|---|---|---|---|---|---|
| @layer (cascade layers) | slashed.* layers | @layer | :where() | partial | - | - |
| Container queries | used in layout.css | @container variant | - | - | - | - |
| :has() | ABSENT | has-* variant | - | - | - | - |
| Logical properties | inline/block throughout | yes | - | some | partial | - |
| Relative color syntax | core architecture | - | - | - | - | - |
| color-mix() | palette module | - | - | - | - | - |
| light-dark() | core architecture | - | - | - | - | - |
| @property | source tokens | - | - | - | - | - |
| CSS nesting | ABSENT | yes | - | Sass | Sass | - |
| @starting-style | ABSENT | - | - | - | - | - |
| Anchor positioning | ABSENT | - | - | - | - | - |
| subgrid | .sf-subgrid | - | - | - | - | - |
| interpolate-size | opt-in @supports | - | - | - | - | - |
| view-transition | basic support | - | - | - | - | - |
| scroll-snap | in .sf-reel | snap utilities | - | - | - | - |
| text-wrap: balance/pretty | headings + p | text-balance | - | - | - | - |
| env() safe areas | yes | - | - | - | - | - |

---

## Gap Analysis

### Critical (every serious framework has this; SLASHED is blocked without it)

1. **Utility classes (entirely absent)**
   - *Who has it:* All five frameworks.
   - *Approach:* Implement a minimal semantic utility set (not Tailwind-scale). Priority categories: text alignment (.u-text-center/start/end), font size (.u-text-s through .u-text-3xl referencing tokens), font weight, display (.u-block/.u-flex/.u-grid/.u-none), margin/padding (.u-m-* / .u-p-* using --sf-space-* tokens), gap (.u-gap-*), and color (.u-color-primary/success/error, .u-bg-*). Keep each utility as a single declaration mapping to a token.

2. **Button component + tokens**
   - *Who has it:* Bootstrap, Bulma, Automatic.css.
   - *Approach:* Add `--sf-btn-*` tokens (padding-block/inline, radius, font-size, font-weight, min-height tied to --sf-size-*) in tokens.components.css. Implement `.sf-btn` with modifiers (`--primary`, `--secondary`, `--danger`, `--outline`, `--ghost`, `--s`, `--l`).

3. **Form input component + tokens**
   - *Who has it:* Bootstrap, Bulma.
   - *Approach:* Add `--sf-input-*` tokens (height, padding, radius, border-color, bg). Implement `.sf-input`, `.sf-select`, `.sf-textarea` with states already wired via `.is-valid`/`.is-invalid`.

### Important (significant DX improvement, frequently needed)

4. **Named animation presets**
   - *Who has it:* Open Props (20+), Tailwind (4).
   - *Approach:* Add ~8 keyframe animations (fade-in, fade-out, slide-in-up/down/left/right, scale-up, scale-down) as `@keyframes` + `--sf-animation-*` tokens in motion.css. They already respect reduced-motion via the accessibility layer.

5. **font-feature-settings / variable font axis tokens**
   - *Who has it:* Tailwind v4.
   - *Approach:* Add `--sf-font-features` and `--sf-font-variation` tokens to typography section. Default to `normal`; let developers override for their chosen variable fonts.

6. **Alert / notice component**
   - *Who has it:* Bootstrap, Bulma.
   - *Approach:* `.sf-alert` with `--status` variants mapping to existing status triplets (subtle bg, strong text, status border). Minimal CSS given token coverage already exists.

7. **Badge / tag component**
   - *Who has it:* Bootstrap, Bulma.
   - *Approach:* `.sf-badge` using --sf-text-xs, compact padding, --sf-radius-full. Variants via brand/status colors.

8. **Card component + tokens**
   - *Who has it:* Bootstrap, Bulma.
   - *Approach:* Add `--sf-card-*` tokens (padding, radius, shadow, border-width, bg). Implement `.sf-card` with `.sf-card__header`, `.sf-card__body`, `.sf-card__footer` using existing surface/shadow/radius tokens.

9. **Font weight granularity (full 100-900 scale)**
   - *Who has it:* Tailwind v4, Open Props.
   - *Approach:* Add `--sf-font-weight-thin` through `--sf-font-weight-black` (100-900) to the typography section. Keep existing semantic aliases but expose the full numeric scale for BEM consumers.

10. **Additional easing tokens (bounce, spring variants)**
    - *Who has it:* Open Props (50+ easings).
    - *Approach:* Add 2-3 bounce variants (`--sf-ease-bounce-1/2/3`) as `linear()` functions for micro-interactions.

11. **forced-colors / Windows High Contrast support**
    - *Who has it:* Tailwind (forced-color-adjust utility).
    - *Approach:* Add a `@media (forced-colors: active)` block in accessibility.css ensuring borders become visible, focus rings use `Highlight`, and custom shadows are removed.

12. **Responsive breakpoint utilities (media-query based)**
    - *Who has it:* All five frameworks.
    - *Approach:* Expose `--sf-breakpoint-sm/md/lg/xl` tokens. Optionally add `@media`-based responsive modifiers for key utilities (`.u-hidden@sm`, `.u-text-center@md`).

13. **:has() usage for parent-state styling**
    - *Who has it:* Tailwind v4 (has-* variant).
    - *Approach:* Consider using `:has()` in component layer for patterns like "form-group :has(.is-invalid) shows error border." Document the pattern.

### Nice-to-Have (good to have but not blocking)

14. **Scroll-driven animation tokens**
    - *Who has it:* None of the five frameworks yet.
    - *Approach:* Add `--sf-scroll-timeline` and `--sf-view-timeline` tokens as forward-looking opt-in.

15. **@starting-style for entry animations**
    - *Who has it:* None of the five frameworks.
    - *Approach:* When implementing dialog/popover components, use `@starting-style` for open transitions.

16. **Anchor positioning tokens**
    - *Who has it:* None of the five frameworks.
    - *Approach:* Future tooltip/popover component could use anchor positioning. Add `--sf-anchor-offset` token when implementing tooltip.

17. **Named font stacks beyond 4**
    - *Who has it:* Open Props (16 curated stacks).
    - *Approach:* Optionally add `--sf-font-humanist`, `--sf-font-neo-grotesque`, `--sf-font-slab-serif` as an optional palette file.

18. **Optical sizing token**
    - *Who has it:* No framework exposes this explicitly.
    - *Approach:* Add `--sf-optical-sizing: auto` to typography tokens.

19. **Perspective tokens**
    - *Who has it:* Tailwind v4 (5 perspective values).
    - *Approach:* Add `--sf-perspective-near/normal/far` for 3D transform contexts.

20. **Text shadow tokens**
    - *Who has it:* Tailwind v4 (5 text-shadow levels).
    - *Approach:* Add `--sf-text-shadow-s/m/l` alongside existing box-shadow tokens.

21. **Drop shadow tokens (filter-based)**
    - *Who has it:* Tailwind v4 (6 drop-shadow levels).
    - *Approach:* Add `--sf-drop-shadow-s/m/l` for use with `filter: drop-shadow()`.

---

## Advantages (What SLASHED Does Better)

1. **Automatic dark mode derivation** - No other framework auto-generates dark mode from a single set of light tokens using relative color syntax. Zero manual duplication.

2. **Text-on-color contrast automation** - The `sign(0.6 - l) * 999` technique automatically selects light/dark text for any background. Bootstrap uses a Sass function (build-time only); SLASHED does it at runtime.

3. **Three-layer token architecture** - @property source -> resolved (light-dark) -> derived (relative color) is more principled than any competitor. Enables animation of color tokens and type-safe fallbacks.

4. **Container-query-first layout primitives** - Layout responds to parent width, not viewport. No other framework makes this the default. Results in truly composable, context-independent components.

5. **Layout primitive breadth** - 16+ named layout patterns (stack, cluster, sidebar, switcher, grid, bento, content-grid, reel, imposter, alternate, pancake, cover, frame, prose, subgrid) exceeds any single competitor.

6. **Fluid spacing AND type on the same scale** - Both spacing and typography use coordinated fluid scales with a shared multiplier (`--sf-space-scale`, `--sf-text-scale`). Open Props has this partially; others don't.

7. **Surface hierarchy system** - 6 named surfaces (bg, surface, well, raised, overlay, inverse) all auto-derived from a single base color. No competitor offers this depth of semantic surface tokens.

8. **Status color triplets (subtle/strong/muted)** - Each of 5 status colors gets three automatic variants for backgrounds, text, and borders. Eliminates manual color picking for alerts/badges/forms.

9. **Accessibility depth** - prefers-reduced-motion + prefers-contrast + prefers-reduced-transparency + touch targets + safe area insets + skip-link + focus-visible, all in one coordinated layer. Most comprehensive a11y baseline of any framework.

10. **Scoped theming via data-theme on any element** - `[data-theme="dark"]` works on `<section>` or any element, not just `:root`. Combined with auto-derivation, enables mixed-mode UIs trivially.

---

## Recommended Implementation Order (Top 15)

| # | Item | Rationale |
|---|---|---|
| 1 | **Core utility classes (text, display, spacing, gap)** | Unblocks daily dev use. Without these, developers can't do basic layout tweaks without writing custom CSS. Focus on ~40-50 semantic utilities mapping to existing tokens. |
| 2 | **Button component + tokens** | Most-used interactive element. Demonstrates the BEM + token architecture to users. Unlocks forms, CTAs, navigation. |
| 3 | **Form input component + tokens** | Second most critical interactive pattern. States layer (.is-valid/.is-invalid) already exists but has nothing to attach to. |
| 4 | **Alert/notice component** | Trivial to implement given existing status triplets. Immediately usable. High signal-to-effort ratio. |
| 5 | **Badge/tag component** | ~10 lines of CSS, references existing tokens. Common in dashboards, CMSs, docs. |
| 6 | **Card component + tokens** | Most common content container. Low effort given existing surface/shadow/radius tokens. |
| 7 | **Named animation presets (8-10 keyframes)** | Fade, slide, scale families. Huge perceived quality boost. motion.css + accessibility.css already provide the infrastructure. |
| 8 | **Font weight scale (100-900)** | Trivial addition (9 custom properties). Unlocks variable font usage and finer typographic control for BEM consumers. |
| 9 | **forced-colors media query support** | Small CSS block, significant accessibility improvement for Windows High Contrast users. |
| 10 | **Navigation/navbar component** | Complex to DIY, high token leverage (uses spacing, color, z-index, motion tokens). Pairs with .is-current state. |
| 11 | **Modal/dialog component + tokens** | Hard to DIY correctly (focus trap, backdrop, animation). Can leverage ::backdrop, @starting-style, and existing overlay tokens. |
| 12 | **Color utility classes (.u-color-*, .u-bg-*)** | Maps to existing semantic tokens. Enables quick prototyping without writing custom properties. |
| 13 | **Text shadow + drop shadow tokens** | 6 new custom properties total. Fills token gap for text-over-image and filter-based shadow use cases. |
| 14 | **Responsive breakpoint tokens + optional media-query utilities** | Define `--sf-breakpoint-*` tokens. Add responsive modifiers for display/hidden utilities. Complements CQ-first approach. |
| 15 | **Table component + tokens** | Medium difficulty, high frequency in dashboards/admin UIs. Benefits from existing border, spacing, and text tokens. |

---

## Summary

SLASHED's **foundation is exceptionally strong** - its token system, color architecture, layout primitives, accessibility layer, and modern CSS usage are best-in-class. The critical gap is the **absence of consumable components and utilities** that let developers build UIs without writing custom CSS for every element. The recommended path is: utilities first (unlock daily use), then the 5 table-stakes components (button, input, alert, badge, card), then animation presets and remaining components. This order maximizes developer adoption while leveraging the robust token infrastructure already in place.
