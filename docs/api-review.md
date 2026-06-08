# SLASHED API Review & Competitive Gap Analysis

> Prepared 2026-06-08. Based on api-index.md (1024 elements — 802 tokens, 222 classes).
> Gap analysis references Automatic.css v4 (direct competitor), Bulma v1, and Tailwind CSS v4.
> **Scope exclusion:** utility class systems and component implementations are excluded from
> the competitive gap section per brief.

---

## Part 1 — API Classification

### Category definitions

| Category | Meaning |
|---|---|
| **Must Have** | Core infrastructure. SLASHED cannot claim to be production-ready without it. |
| **Should Have** | Material value; most real projects will need it; absence is a genuine gap. |
| **Nice to Have** | Real DX improvement; not blocking but worth shipping. |
| **Could Do Without** | Low ROI; redundant, overly granular, or so rare it adds API surface cost for near-zero gain. |
| **Not Useful** | Theoretical value; practically never needed; signals wrong abstraction level. |
| **Broken** | Stubbed, commented out, or documented as non-functional. |
| **Not Used** | Defined in the API but explicitly not consumed by the framework itself; token exists but nothing reads it. |

---

## Tokens (802)

### Color — Brand source tokens (6)

`--sf-color-primary-light`, `--sf-color-secondary-light`, `--sf-color-tertiary-light`,
`--sf-color-action-light`, `--sf-color-neutral-light`, `--sf-color-base-light`

**Rating: Must Have.**
These 6 are the actual rebrand API — the single overrides that cascade into the entire color system via OKLCH derivation + auto dark mode. Correctly named and minimal. The fact the entire system flows from these 6 is one of SLASHED's strongest design decisions.

---

### Color — Semantic brand aliases (per-brand: hover, active, ghost, subtle, muted, lighter, darker, xdark, xlight, superdark, superlight)

Approximately 60 tokens, 10 per brand color (primary, secondary, tertiary, action, neutral, base).

**Rating: Should Have.**
Interactive states (hover, active) and alpha variants (subtle, muted, ghost) are essential for component work. The redundant naming axis (`lighter/darker` vs `xlight/xdark` vs `superlight/superdark`) is confusing — three tiers of semantic lightness steps for the same color is too many. Recommend consolidating to: `subtle`, `muted`, `hover`, `active` + numeric palette for everything else.

---

### Color — Semantic surface tokens (bg, raised, inset, surface, overlay)

`--sf-color-bg`, `--sf-color-raised`, `--sf-color-inset`, `--sf-color-surface`, `--sf-color-overlay`

**Rating: Must Have.**
Four distinct surface levels (inset → base/surface → bg → raised) plus overlay. Well-designed and correctly derived from base. The inverse (`--sf-color-inverse`) is a bonus.

**Gap note:** Only 4 depth levels. Complex layered UIs (modals with inner panels, sidebars with sub-navigation) can need 5–6. This is a known limitation.

---

### Color — Interactive state background tokens

`--sf-color-bg--hover`, `--sf-color-bg--active`, `--sf-color-bg--focus`, `--sf-color-bg--selected`, `--sf-color-bg--disabled`

**Rating: Must Have.**
These are the universal interactive state backgrounds (alpha overlays on neutral/action). Essential for building interactive elements without hardcoding. Well done.

---

### Color — Semantic text tokens

`--sf-color-text`, `--sf-color-heading`, `--sf-color-text--secondary`, `--sf-color-text--muted`,
`--sf-color-text--disabled`, `--sf-color-text--inverse`, `--sf-color-text--placeholder`

**Rating: Must Have.**
Correct set of semantic text roles. Heading having its own separate derived color is a good typographic decision.

---

### Color — Text on colored backgrounds

`--sf-color-text--on-primary`, `--sf-color-text--on-secondary`, ...(all 11 `--on-*` variants)

**Rating: Should Have.**
Auto-contrast text using the luminance sign formula is elegant. These tokens are essential for any `sf-surface--*` class. The auto-contrast approach is technically superior to manual WCAG tables.

**Gap note:** Only covers the 6 brand + 5 status colors. Missing `--sf-color-text--on-base`, `--sf-color-text--on-raised`, `--sf-color-text--on-inset` for surface-level auto-contrast. Consumers have to handle these manually.

---

### Color — Border tokens

`--sf-border`, `--sf-border-subtle`, `--sf-border-strong`, `--sf-color-border`, `--sf-color-border--subtle`, `--sf-color-border--strong`, `--sf-color-border--focus`, `--sf-color-border--disabled`, `--sf-color-border--translucent`

**Rating: Must Have.**
Composite shorthand tokens + individual color tokens. The three-level contrast scale (subtle → default → strong) mirrors IBM Carbon / GitHub Primer's convention and is production-validated. The translucent and disabled variants cover the needed edge cases.

---

### Color — Status colors (success, warning, error, info, danger) with strong/subtle/muted

25 tokens across 5 status colors.

**Rating: Must Have.**
Well-structured. The `error` vs `danger` semantic distinction (form validation vs destructive action) is nuanced and correct. The strong/subtle/muted axis per status color is appropriate for alert/badge patterns.

---

### Color — Link tokens

`--sf-color-link`, `--sf-color-link--hover`, `--sf-color-link--active`, `--sf-color-link--visited`, `--sf-color-link--underline`, `--sf-color-link--disabled`

**Rating: Should Have.**
The WCAG-aware lightness clamping on link colors (ceiling in light mode, floor in dark mode) is technically sophisticated and a genuine differentiator. Visited link with 60° hue shift is thoughtful.

---

### Color — Selection, mark, code background

`--sf-color-selection-bg`, `--sf-color-selection-text`, `--sf-color-mark-bg`, `--sf-color-mark-text`, `--sf-color-code-bg`, `--sf-color-code-text`

**Rating: Nice to Have.**
Selection and mark colors are often forgotten in design systems and wiring these to brand color is correct. Code background auto-contrasting with code text is genuinely useful for theme-aware code blocks.

---

### Color — Static values (white, black, dim, inverse)

**Rating: Could Do Without.**
`--sf-color-white` and `--sf-color-black` as `oklch(100% 0 0)` / `oklch(0% 0 0)` add zero value over the literal values. `--sf-color-dim` (50% black) is marginally useful for overlay use cases. These 4 tokens are minor API clutter.

---

### Color — Gradient tokens

`--sf-gradient-brand`, `--sf-gradient-primary`, `--sf-gradient-secondary`, `--sf-gradient-tertiary`, `--sf-gradient-surface`, `--sf-gradient-fade--{t,b,l,r}`

**Rating: Nice to Have.**
Directional fade gradients are genuinely useful for scroll-shadow and hero treatments. The brand/primary/secondary/tertiary gradients auto-adapt to dark mode via brand colors — this is good. However the oklch hue-rotation gradient approach for `--sf-gradient-brand` produces visually varying results depending on the brand hue.

---

### Color — HSL fallback tokens (33 tokens)

`--sf-primary-h/s/l`, `--sf-action-h/s/l`, etc. — 33 tokens, PUBLIC-ADVANCED.

**Rating: Could Do Without.**
These exist for browsers that don't support `light-dark()` or `oklch(from ...)`. Given SLASHED's stated browser floor (Chrome 123+, Safari 17.5+, Firefox 128+) these frameworks all support those features. The fallback coverage is an edge case serving <1% of traffic while adding 33 tokens that confuse the primary API story. Consider moving to `legacy.css` only and hiding from the default index.

---

### Color — Scrollbar tokens

`--sf-scrollbar-thumb`, `--sf-scrollbar-track`

**Rating: Nice to Have.**
Useful on projects with custom scrollbar styling. Low cost to keep.

---

### Typography — Font families

`--sf-font-body`, `--sf-font-heading`, `--sf-font-display`, `--sf-font-mono` + optional stacks (humanist, geometric, slab)

**Rating: Must Have** (core 4) / **Nice to Have** (optional stacks).
The four core font family roles are correct and minimal. The optional system font stacks (humanist, geometric, slab) are a useful zero-cost library for projects not loading web fonts — keep them but they don't need to be in the core bundle.

---

### Typography — Font weights (numeric + semantic aliases)

Numeric: thin–black (100–900). Semantic: body, heading, display, bold.

**Rating: Must Have.**
Correct. The semantic aliases on top of numeric are the right layering.

---

### Typography — Font variant controls

`--sf-font-numeric`, `--sf-font-features`, `--sf-font-variation`, `--sf-optical-sizing`

**Rating:** `--sf-font-numeric` → **Nice to Have**. The other three → **Not Used.**

`--sf-font-numeric` (tabular-nums) is consumed by forms.css for number inputs — useful. But `--sf-font-features`, `--sf-font-variation`, and `--sf-optical-sizing` are explicitly documented as "token-only, not applied by the framework." They are configuration knobs for consumers who know OpenType inside-out. Most devs will never touch them and they add noise. Move to PUBLIC-ADVANCED or remove.

---

### Typography — Text size scale (fluid, 2xs–4xl + display-s/m/l)

14 fluid `clamp()` tokens covering the full typographic scale.

**Rating: Must Have.**
The fluid scale using the framework's fixed viewport range (22.5rem → 90rem) is well-calibrated. The display variants (display-s, -m, -l) correctly serve hero/display typography needs separate from the heading scale.

---

### Typography — Line heights (tight, snug, normal, relaxed)

**Rating: Must Have.**

---

### Typography — Letter spacing / tracking (tight, normal, wide, wider, widest)

**Rating: Must Have.**

---

### Typography — Body and heading semantic aliases

`--sf-body-color`, `--sf-body-font-family`, `--sf-body-font-size`, `--sf-body-font-weight`, `--sf-body-line-height`, `--sf-body-text-wrap`, `--sf-body-em-style`, `--sf-body-strong-weight`, `--sf-heading-color`, `--sf-heading-font-family`, `--sf-heading-text-wrap`, `--sf-code-font-size`

**Rating: Must Have.**
These are the tokens that actually wire up `base.css`'s element defaults. `body-text-wrap: pretty` and `heading-text-wrap: balance` are useful ergonomic choices.

---

### Typography — Per-heading tokens (h1–h6, 4 properties each)

`--sf-h1-size`, `--sf-h1-font-weight`, `--sf-h1-line-height`, `--sf-h1-letter-spacing` × 6 headings = 24 tokens.

**Rating: Must Have.**
These are the standard override knobs for heading hierarchy. Essential for any typographic design system.

---

### Typography — Text scale multiplier

`--sf-text-scale`, `--sf-text-display-scale`

**Rating: Nice to Have.**
Global proportional scaling of all fluid text — useful for accessibility use cases or art-directed pages. `--sf-text-display-scale` is an appropriate separate knob for hero content.

---

### Spacing — Fluid space scale (2xs–4xl + none, px, gutter)

**Rating: Must Have.**
The core fluid spacing scale. Well-calibrated across the same viewport range as the type scale (good consistency).

---

### Spacing — Section padding scale (xs–2xl)

`--sf-section-pad`, `--sf-section-pad--xs` through `--sf-section-pad--2xl`

**Rating: Must Have.**
Section padding is a fundamental layout concern. The 6-step scale with a default alias is correct. The `.sf-section` class that consumes these is an important companion.

---

### Spacing — Space scale multiplier

`--sf-space-scale`

**Rating: Nice to Have.**
Same argument as text-scale — proportional scaling is useful for art direction. Underexposed in docs.

---

### Spacing — Sizes-extended: space bridging matrix (35 tokens)

`--sf-space-{larger}-to-{smaller}` — full descending matrix of intermediate clamp values.

**Rating: Could Do Without.**
The value proposition: set two tokens and get a clamp that spans between them. But:
1. Most components need adjacent steps, not `2xl-to-2xs`.
2. The token names are not intuitive (`--sf-space-3xl-to-xs` — what does this mean in context?).
3. Adds 35 tokens to an already large API surface.
These are better expressed via `calc()` at point of use.

---

### Spacing — Sizes-extended: per-size typography sub-properties (72 tokens)

`--sf-text-{size}-font-weight`, `--sf-text-{size}-letter-spacing`, `--sf-text-{size}-line-height`, `--sf-text-{size}-max-width` × 9 sizes = 36 tokens.
`--sf-text-{larger}-to-{smaller}` fluid bridges for text = 36 more tokens.

**Rating: Nice to Have** (per-size typography sub-properties) / **Could Do Without** (text bridges).
The per-size sub-properties (`--sf-text-xl-line-height: snug`) encode good typographic defaults. But they are explicitly NOT auto-applied — consumers must wire them. This creates a confusing situation where the tokens exist but nothing uses them unless the developer knows to look. If they're not applied automatically, they're reference documentation masquerading as an API.

The text bridges have the same issue as the space bridges — overly granular, rarely needed in practice.

---

### Border — Width scale and composites

`--sf-border-width-hairline`, `--sf-border-width-1` through `--sf-border-width-4`, `--sf-border`, `--sf-border-subtle`, `--sf-border-strong`, `--sf-border-style`

**Rating: Must Have.**
The composite shorthand tokens (`--sf-border: var(--sf-border-width-1) var(--sf-border-style) var(--sf-color-border)`) are a smart DX improvement. The global `--sf-border-style` knob for rounding corners globally is underrated.

---

### Border — Stroke widths for SVG

`--sf-stroke-thin`, `--sf-stroke-regular`, `--sf-stroke-bold`, `--sf-stroke-heavy`

**Rating: Nice to Have.**
Useful for icon/illustration design systems that need SVG stroke widths to match the UI language. Not blocking; easy to add per-project if not provided.

---

### Radius scale

`--sf-radius-none`, `--sf-radius-xs` through `--sf-radius-4xl`, `--sf-radius-full`, `--sf-radius-pill`, `--sf-radius-scale`, `--sf-radius-outer`

**Rating: Must Have** (scale + full + pill + scale multiplier) / **Nice to Have** (`--sf-radius-outer`).
The `--sf-radius-scale` global multiplier (set to 0 for sharp mode, leave at 1 for rounded) is excellent. `--sf-radius-pill` as a semantic alias for `--sf-radius-full` is intentional and correct. `--sf-radius-outer` (concentric nesting helper) is clever but niche.

---

### Shadow scale (box, drop, text, glow, inner)

`--sf-shadow-none/xs/s/m/l/xl/2xl`, `--sf-drop-shadow-s/m/l`, `--sf-text-shadow-none/s/m/l`, `--sf-shadow-glow`, `--sf-shadow-inner`

Plus knobs: `--sf-shadow-color`, `--sf-shadow-strength`, `--sf-shadow-glow-color`

**Rating: Must Have** (box shadows + color/strength knobs) / **Should Have** (drop shadows, text shadows) / **Nice to Have** (glow, inner).
The adaptive shadow strength that increases in dark mode via `--sf-is-dark` is a genuinely clever design. The tinted shadow color derived from neutral is a nice touch that makes shadows feel less generic.

---

### Motion — Duration scale, easing functions, motion scale

`--sf-duration-none/instant/fast/normal/slow/slower`, 8 easing functions, `--sf-motion-scale`

**Rating: Must Have.**
Excellent. The `--sf-motion-scale` (0 kills all animations via `calc()`) is the right implementation for "reduce motion at token level." The easing library (spring, elastic, bounce, overshoot) goes beyond the generic in-out-linear set.

---

### Motion — Animation compound tokens

20 tokens (`--sf-animation-fade-in`, `--sf-animation-slide-in-*`, `--sf-animation-scale-*`, `--sf-animation-ping`, `--sf-animation-shimmer`, etc.)

**Rating: Should Have.**
These compose keyframe name + duration + easing into single-token consumption (`animation: var(--sf-animation-fade-in)`). Elegant API. The selection is practical: fade, slide (4 directions), scale, loading states (ping, shimmer, spin), decorative (float, blink, color-pulse).

---

### Motion — Stagger delays (5 tokens)

`--sf-animation-delay-1` through `--sf-animation-delay-5`

**Rating: Nice to Have.**
Useful for list entrance choreography without JS. The 75ms multiplier respects `--sf-motion-scale`.

---

### Motion — Transition compound tokens

`--sf-transition-all`, `--sf-transition-colors`, `--sf-transition-transform`, `--sf-transition-opacity`, `--sf-transition-shadow`, `--sf-transition-fast`, `--sf-transition-slow`, `--sf-transition-enter`, `--sf-transition-exit`, `--sf-transition-overlay`

**Rating: Must Have.**
`--sf-transition-enter` / `--sf-transition-exit` (asymmetric: out faster than in) reflects real UI motion design principle. `--sf-transition-overlay` (allows-discrete for `display` + `overlay`) is future-forward for native popover/dialog animations.

---

### Z-index — Numeric scale + semantic aliases

Numeric: `below, base, raised, low, mid, high, top, max`. Semantic: `sticky, fixed, dropdown, toast, overlay`.

**Rating: Must Have.**
The two-layer system (numeric primitives + semantic role aliases) is the correct architecture. The documented ordering (raised < sticky < fixed < dropdown < toast) prevents the classic z-index arms race.

---

### Focus ring tokens

`--sf-focus-ring-color`, `--sf-focus-ring-width`, `--sf-focus-ring-offset`, `--sf-focus-ring-style`, `--sf-focus-ring-shadow` (ADVANCED)

**Rating: Must Have.**
The split between outline-based (default) and box-shadow-based (`.sf-focus-shadow` opt-in) focus indicators is correct. Both approaches have legitimate use cases.

---

### Blur tokens

`--sf-blur-xs` through `--sf-blur-xl`

**Rating: Should Have.**
Useful for glassmorphism patterns, backdrop-filter, and depth effects. Low API surface cost.

---

### Opacity scale

`--sf-opacity-0/10/25/50/75/100`, `--sf-opacity-disabled`

**Rating: Should Have.**
The non-uniform steps (10/25/50/75 instead of 20/40/60/80) is debatable — these match common CSS conventions. `--sf-opacity-disabled: 0.45` is a specific, useful semantic value.

---

### Aspect ratio tokens

`--sf-ratio-square`, `--sf-ratio-video`, `--sf-ratio-4-3`, `--sf-ratio-3-2`, `--sf-ratio-portrait`, `--sf-ratio-cinema`, `--sf-ratio-golden`

**Rating: Should Have.**
Useful for `.sf-frame` and `.sf-aspect` classes. Golden ratio is nice to have. These encode common media aspect ratios as named tokens.

---

### Icon size tokens

`--sf-icon-xs` through `--sf-icon-2xl` (em-based)

**Rating: Should Have.**
The em-based design (icons scale with surrounding text) is the correct approach. The 6-step scale from 0.875em to 4em covers most icon use cases.

---

### UI sizes (fixed heights for components)

`--sf-size-xs` through `--sf-size-xl` (1.5rem–3.5rem)

**Rating: Should Have.**
These are the component height tokens (buttons, inputs, chips). Fixed-height tokens should be accompanied by component token recipes that consume them, but they're at least here.

---

### Container max-widths

`--sf-container-narrow`, `--sf-container-prose`, `--sf-container-default`, `--sf-container-wide`, `--sf-container-full`

**Rating: Must Have.**

---

### Header height + sticky offset

`--sf-header-height`, `--sf-header-height-mobile`, `--sf-header-height-desktop`, `--sf-sticky-offset`, `--sf-sticky-offset-mobile`, `--sf-sticky-offset-desktop`

**Rating: Must Have.**
The fluid interpolation between mobile and desktop header heights (using the same slope as the type/space scales) is consistent and thoughtful. `--sf-sticky-offset` defaults to header height — correct for `position: sticky` top positioning.

---

### Touch target

`--sf-touch-target: var(--sf-size-l)` (2.75rem)

**Rating: Should Have.**
WCAG 2.5.5 compliance token. Small cost, real value.

---

### Component pad + content/gap aliases

`--sf-component-pad`, `--sf-content-gap`, `--sf-gap`, `--sf-space-gap`, `--sf-space-content`

**Rating: Should Have.**
These bridge the gap between the raw space scale and the conceptual roles (gap between items vs. padding within a component vs. gap within body copy). The layered aliasing adds some complexity but the intent is clear.

---

### Divider tokens

`--sf-divider-color`, `--sf-divider-width`, `--sf-divider-style`, `--sf-divider-gap`

**Rating: Should Have.**
Drives both the `hr` element styling and the `.sf-divider` class. Clean.

---

### Column layout tokens (multi-column CSS)

`--sf-col-width-s/m/l`, `--sf-col-rule-width-s/m/l`

**Rating: Nice to Have.**
Useful for magazine-style multi-column text layouts. Low cost to keep.

---

### Scrollbar tokens

`--sf-scrollbar-thumb`, `--sf-scrollbar-track`

**Rating: Nice to Have.**
Noted above — low cost.

---

### Contrast knobs

`--sf-contrast-bias`, `--sf-contrast-threshold` (ADVANCED)

**Rating: Should Have.**
`--sf-contrast-threshold` (default 0.6) for the sign()-based auto-contrast calculation is the most user-serviceable accessibility knob in the framework. Not many devs will need it, but the devs who do need it critically will thank you.

---

### Object fit / position

`--sf-object-fit`, `--sf-object-position`

**Rating: Should Have.**
Applied to `img` and `video` in `base.css`. Letting users set these globally via token (e.g., `--sf-object-position: top`) is useful for the common "hero image shows top content" pattern.

---

### Link geometry

`--sf-link-underline-offset`, `--sf-link-underline-thickness`, `--sf-link-external-marker`

**Rating: Should Have.**
The `text-underline-offset` token is a real typographic refinement. External link marker as a token (so consumers can swap or empty it) is correct.

---

### Safe area insets

`--sf-safe-top/right/bottom/left` (wrapping `env(safe-area-inset-*)`)

**Rating: Nice to Have.**
Useful for iOS notch-aware layouts. Saves repetitive `env()` calls.

---

### Caret color

`--sf-caret-color: var(--sf-color-action)`

**Rating: Nice to Have.**
Applied in `base.css`. Wires caret to action color for brand consistency. Good detail.

---

### State flag tokens

`--sf-is-active`, `--sf-is-current`, `--sf-is-open`, `--sf-is-pressed` (ADVANCED) / `--sf-is-dark` (INTERNAL)

**Rating: Should Have.**
The integer-flag pattern (0/1 state driving CSS calc) enables CSS-only stateful rendering without JS — a genuinely clever architectural pattern. The INTERNAL `--sf-is-dark` drives shadow strength scaling, so it's consumed but should remain INTERNAL.

---

### Mask scrim controls

`--sf-mask-scrim-start`, `--sf-mask-scrim-end` (ADVANCED)

**Rating: Could Do Without.**
These are edge-fade stops for overflow masks. They're too niche to be in the default API — most projects using this pattern will write the `mask-image` gradient directly.

---

### Scroll timeline range tokens

`--sf-scroll-timeline-range-start`, `--sf-scroll-timeline-range-end` (ADVANCED)

**Rating: Not Used.**
Explicitly documented: "not consumed by the framework itself; intended for BEM component authors." These are reference-documentation tokens pretending to be an API. Remove from the formal index or mark as EXAMPLE.

---

### 3D perspective tokens

`--sf-perspective-near`, `--sf-perspective-normal`, `--sf-perspective-far` (ADVANCED)

**Rating: Not Useful.**
No layout primitive or macro consumes these. 3D transforms are a niche, project-specific concern. These add 3 tokens with zero framework integration. Remove.

---

### Print tokens

`--sf-print-base-size`, `--sf-print-page-margin`, `--sf-print-page-size` (ADVANCED)

**Rating: Nice to Have.**
Print is often forgotten. Having print tokens is good. Print page size is a sensible knob.

---

### Lumlocker

`--sf-lumlocker: 0.65` (ADVANCED)

**Rating: Could Do Without.**
The lumlocker concept (lock all brand colors to one shared OKLCH lightness for visual harmony) is innovative but too specialized for the main API surface. It's the kind of feature a design systems engineer will appreciate but a typical consumer will never discover or use. Move to a dedicated "advanced theming" doc with no formal API status.

---

### Palette tokens (132 — numeric scales + alpha variants)

`--sf-color-primary-50` through `--sf-color-primary-950`, `--sf-color-primary-a5` through `--sf-color-primary-a95` × 5 brands (primary, secondary, tertiary, action, neutral, base).

**Rating: Nice to Have.**
These are the escape-hatch tokens — when you need a specific shade not covered by the semantic set. Dynamically derived via `color-mix()` from the resolved semantic tokens, so they adapt to dark mode automatically. The concern is API weight: 132 tokens for an "optional" module that many projects will import in their optimal bundle just to use 5–6 shades.

---

### Layout tokens (48)

`--sf-stack-gap`, `--sf-cluster-gap`, `--sf-grid-gap`, `--sf-sidebar-width`, `--sf-bento-gap`, `--sf-cover-min-height`, `--sf-reel-gap`, `--sf-prose-paragraph`, etc.

**Rating: Must Have.**
All of these directly drive the layout primitive classes. These are the core customization knobs for the layout system. Well-scoped; each layout component has the right tokens.

---

### Macro tokens (18)

`--sf-flow-space`, `--sf-line-clamp`, `--sf-prose-*`, `--sf-scrim-*`, `--sf-scroll-shadow-size`, `--sf-content-intrinsic-size`, `--sf-truncate-suffix`, `--sf-aspect`

**Rating: Should Have** (flow-space, line-clamp, prose-*, scrim-*) / **Not Used** (`--sf-truncate-suffix`).

`--sf-truncate-suffix` is documented as "the CSS text-overflow property doesn't read it directly" — this is a broken contract. The token exists but cannot be consumed by the CSS property it describes. Mark as NOT USED or remove.

---

## Classes (222)

### Accessibility (7)

`sr-only`, `sr-only-focusable`, `skip-link`, `no-motion`, `.sf-clickable-parent`, `.sf-focus-parent`, `.sf-focus-shadow`

**Rating: Must Have** (sr-only, sr-only-focusable, skip-link, no-motion) / **Should Have** (sf-clickable-parent, sf-focus-parent) / **Nice to Have** (sf-focus-shadow).

The `.sf-clickable-parent` card pattern is well-designed — single-anchor card makes the whole card clickable via `after` pseudo-element while keeping inner interactive elements in the tab order. `.sf-focus-parent` delegating focus ring to a parent is a genuine a11y pattern.

---

### Layout primitives — Core stack (sf-stack, sf-cluster, sf-grid variants, sf-sidebar, sf-container, sf-center, sf-cover, sf-frame, sf-box)

Including all size modifiers and directional variants.

**Rating: Must Have.**
These are the Every Layout patterns translated into a token-first CSS API. Well-executed. Container-query responsive behavior (no viewport breakpoints) is the right architectural choice.

---

### Layout primitives — Extended patterns (sf-reel, sf-bento, sf-switcher, sf-alternate, sf-imposter, sf-pancake)

**Rating: Should Have** (reel, bento, switcher) / **Nice to Have** (alternate, imposter, pancake).

Reel (horizontal scroll strip with snap) and bento (free-form dense grid) are commonly needed. Switcher is underused but elegant. Alternate (zigzag media-object) and imposter (absolutely centered overlay) are useful but can be replicated with other primitives. Pancake (sticky footer grid) is niche but solves a common frustration.

---

### Layout primitives — Subgrid

`sf-subgrid`, `sf-subgrid-rows`

**Rating: Should Have.**
CSS Subgrid is now baseline. The `sf-subgrid` shortcut class is a legitimate ergonomic improvement.

---

### Layout primitives — Icon (sf-icon + size modifiers + boxed)

**Rating: Should Have.**
Em-based icon sizing that tracks surrounding text is correct. The boxed variant (`.sf-icon--boxed`) fills a common UI pattern (icons in chips, badges, stat cards).

---

### Layout primitives — Section (sf-section + size modifiers + sf-section-group + collapse modifier)

**Rating: Must Have.**
`.sf-section` is one of the most-used layout primitives for real web projects — every page is composed of sections. The `--collapse` modifier (redistributing padding across adjacent section boundaries) is a particularly elegant solution to the "double padding" problem.

---

### Layout primitives — Divider (sf-divider + style modifiers + gradient + vertical)

**Rating: Should Have.**
Good coverage of divider styles (dashed, dotted, gradient, soft, strong, vertical). The gradient variant (hairline fading at both ends) is a common design pattern.

---

### Layout primitives — Content grid (sf-content-grid, sf-breakout, sf-full-bleed)

**Rating: Should Have.**
The breakout pattern (full-width content inside a centered container) is a standard editorial layout technique. Well-implemented.

---

### Layout primitives — Equal columns (sf-equal + fixed variants)

**Rating: Nice to Have.**
Distinguished from `sf-grid-N` (responsive) as non-collapsing. The use case (calendars, data tables, comparison layouts) is real but narrow.

---

### Layout primitives — Gap utility (sf-gap + size modifiers)

**Rating: Should Have.**
Injects gap into any existing flex/grid container without imposing display type. Fills the gap (heh) between layout-agnostic spacing and opinionated layout classes.

---

### Macro classes — Prose (sf-prose, sf-not-prose, sf-flow)

**Rating: Must Have.**
`.sf-prose` is essential for any project with long-form content. `.sf-flow` (lobotomized owl) is a simpler alternative for non-rich-text content. `.sf-not-prose` correctly uses higher specificity as a documented exception.

---

### Macro classes — Truncation (sf-truncate, sf-line-clamp-2, -3, -N)

**Rating: Should Have.**
Standard patterns. `-2` and `-3` as hardcoded variants plus `-N` (reads `--sf-line-clamp`) is the right approach.

---

### Macro classes — Surface (sf-surface--primary, --secondary, etc.)

11 variants covering all brand + status + inverse colors.

**Rating: Should Have.**
Background + auto-contrasted foreground in one class is the correct DX. Well designed. The missing variants are `sf-surface--raised`, `sf-surface--inset` for neutral surface depth — these would be the most commonly needed surface classes.

---

### Macro classes — Scrim + text-protect

`sf-scrim`, `sf-scrim--bottom/top/full`, `sf-text-protect`

**Rating: Nice to Have.**
Text-over-image legibility is a real problem. Scrim (gradient overlay) and text-protect (shadow halo) are the two correct approaches. Both belong here.

---

### Macro classes — Scroll effects (sf-scroll-shadow, sf-overflow-fade, sf-scroll-snap)

**Rating: Nice to Have.**
These are CSS-only scroll UX patterns. `sf-scroll-shadow` (mask-based gradient reveal on scroll) is genuinely useful for overflow containers. `sf-scroll-snap` for full-page scrolling is more niche.

---

### Macro classes — Text effects (sf-text-gradient, sf-tabular-nums, sf-no-tap-highlight)

**Rating: Nice to Have** (text-gradient, tabular-nums) / **Could Do Without** (no-tap-highlight).
Text gradient via `background-clip` is a common design pattern. Tabular nums is a real need for financial UIs. No-tap-highlight is a single `-webkit-tap-highlight-color` override — trivial and probably not worth a named class.

---

### Macro classes — Content visibility (sf-content-auto, sf-equal-height)

**Rating: Nice to Have** (content-auto) / **Could Do Without** (equal-height).
`content-auto` for virtual scrolling performance is useful for long product grids. `sf-equal-height` asserts `align-items: stretch` — the kind of thing that should just work in grid/flex without a class.

---

### Macro classes — External link (sf-link-external)

**Rating: Nice to Have.**
Opt-in external link indicator. Correct to make this opt-in rather than automatic.

---

### Macro classes — Link variants (sf-link--subtle, sf-link--reverse)

**Rating: Nice to Have.**
These adjust underline treatment (not color) — useful for nav lists, footers, and dense link contexts.

---

### State classes (40)

Full classification:

**Must Have:** `is-hidden`, `is-visible`, `is-active`, `is-disabled`, `is-current`, `is-selected`, `is-open`, `is-collapsed`, `is-loading`, `is-error`, `is-invalid`, `is-valid`, `is-success`

**Should Have:** `is-focused`, `is-pressed`, `is-expanded`, `is-readonly`, `is-invisible`, `is-highlighted`, `is-danger`, `is-warning`, `is-info`, `is-pending`, `is-busy`, `is-skeleton`, `is-clickable`, `is-sticky`, `is-fixed`, `is-pinned`, `is-overlay`

**Nice to Have:** `is-draggable`, `is-dragging`, `is-drop-target`, `is-scrollable`, `is-clipped`, `is-truncated`, `is-unselectable`, `is-empty`, `is-resizable`, `is-fullscreen`

**Could Do Without:** `is-empty` (`:empty` pseudo-class caveats make it unreliable with server-rendered whitespace).

The state system is the strongest in-class among token-first frameworks. The `--sf-is-*` flag tokens enabling CSS-only stateful rendering is architecturally impressive.

---

### Motion / animation classes (15)

`sf-fade-in/out`, `sf-scale-up/down`, `sf-slide-in-{up,down,left,right}`, `sf-entrance--fade`, `sf-entrance--fade-{up,down,left,right}`, `sf-entrance--scale-up`, `sf-color-pulse`

**Rating: Should Have** (entrance scroll-driven, fade-in/out) / **Nice to Have** (directional slides, scale-down).

The scroll-driven entrance effects (`sf-entrance--*`) are a forward-looking feature using CSS scroll-driven animations — no JS required. The `sf-color-pulse` class demonstrating `@property` color animation is a showpiece for the registered custom property system.

---

### Print classes (4)

`no-print`, `print-only`, `print-color-exact`, `print-no-color`

**Rating: Nice to Have.**
Correct and complete print class set. Low cost.

---

### Theme helper (1)

`theme-transition`

**Rating: Nice to Have.**
Smooth theme switching via transition on color properties. Correct to use `transition-*` individual properties rather than shorthand (to avoid reset collisions).

---

### Broken / Incomplete

**Broken — components.css:** 8 component stubs (button, card, badge, etc.) described as "incomplete." These exist as selectors but have no meaningful implementation. Until completed, they are empty promises that may mislead consumers into depending on a non-functional API surface. Ship nothing or ship something — stubs in between are worse than absence.

**Broken — utilities.css:** Empty file reserved for future use. The `slashed.optimal-utilities.css` bundle references it. Importing an empty file wastes a request and misleads consumers. Remove from bundles until content exists.

**Broken — tokens.components.css:** "Commented out" per the architecture docs. Same issue as above — if it's not ready, it shouldn't be in the formal API surface.

---

### Summary counts

| Category | Token count | Class count |
|---|---|---|
| Must Have | ~280 | ~100 |
| Should Have | ~160 | ~65 |
| Nice to Have | ~200 | ~35 |
| Could Do Without | ~90 | ~8 |
| Not Useful | ~10 | ~2 |
| Broken | — | ~14 (stubs) |
| Not Used | ~8 | — |

The ratio is healthy — the overwhelming majority of the API justifies its existence. The main cleanup opportunities are: the sizes-extended matrix, the HSL fallbacks, the 3D perspective tokens, scroll timeline tokens, and the unused OpenType control tokens.

---

---

## Part 2 — Competitive Gap Analysis

> Framework scope: Automatic.css v4 (direct competitor), Bulma v1, Tailwind CSS v4.
> Analysis scope: semantic system, token architecture, theming, typography, spacing, layout systems.
> **Excluded:** utility classes, component libraries.
>
> SLASHED philosophy: token-first BEM tool. Provide the materials (tokens + layout primitives);
> consumer builds semantic components on top. No auto-application of opinions to HTML elements
> beyond minimal reset/base. No utility class layer. No breakpoint-based responsiveness.

---

### Where SLASHED leads

Before listing gaps, it is worth stating where SLASHED genuinely outperforms both competitors at the system level:

1. **OKLCH at runtime, not just at build time.** Automatic.css v4 uses OKLCH internally for shade generation but compiles the results to hex/HSL values in shipped CSS — the token values in the browser are `light-dark(#0055ff, #66aaff)` static pairs. SLASHED keeps OKLCH as the live token value (`oklch(from var(--sf-color-primary-light) clamp(0.65, ...) calc(c * 0.9) h)`), meaning the entire dark palette is computed at runtime by the browser. This is what allows SLASHED's `@property`-registered brand colors to be animated (the browser can interpolate between two `oklch()` values; it cannot interpolate between two compiled hex values). Bulma v1 uses HSL channel decomposition with no OKLCH involvement. This is a technical advantage for SLASHED in animation and perceptual accuracy.

2. **Auto-derived dark mode from light source tokens.** Override 6 `-light` tokens and the entire dark mode adapts via `oklch(from ... clamp(...))` formulas. Neither ACSS nor Bulma provides this level of automatic derivation — both require explicit dark theme values. This is SLASHED's most differentiated technical feature.

3. **Container-query native layout.** SLASHED uses container queries throughout. ACSS v4 and Bulma v1 both still use viewport-based breakpoints as primary responsive mechanism. This is a meaningful architectural advantage for component reuse.

4. **`@property` registration for token animation.** Brand and status colors are registered with `syntax: "<color>"` enabling smooth CSS animation of color tokens. ACSS and Bulma don't do this.

5. **Cascade layers throughout.** SLASHED is layer-native — every rule lives in a named `@layer`. Overrides require zero specificity fighting. ACSS and Bulma have added layer support but it's less comprehensive.

6. **Sign()-based auto-contrast text.** The `sign(--sf-contrast-threshold - l) * 999` formula for `--sf-color-text--on-*` is mode-agnostic and works for any user-supplied brand color. ACSS uses a simpler luminance check that can fail at mid-range hues.

---

### Gap 1 — Fluid range not user-configurable (High Impact)

**What competitors have:**
Automatic.css v4 exposes `--viewport-min` and `--viewport-max` as user-overridable tokens. Set them once on `:root` and every fluid value in the system (type, spacing, section padding) recalibrates to your project's actual viewport target.

**What SLASHED does:**
The viewport range (22.5rem → 90rem / 360px → 1440px) is hardcoded inside every `clamp()` formula. Changing the range requires regenerating all 802 tokens via `npm run docs:api` and rebuilding the CSS source.

**Why this matters:**
A marketing site targeting 320px minimum → 1920px maximum cannot adapt SLASHED's fluid scale to its needs. A component library targeting only 768px → 1440px is over-scaling everything. Consumer overrides cannot fix hardcoded slope constants inside `clamp()`.

**Recommendation:**
Register `--sf-viewport-min` and `--sf-viewport-max` as `@property` tokens (with fallbacks). Rewrite each clamp formula to derive the slope and intercept from those tokens using `calc()`. This is technically possible in modern CSS but requires `@property` with `inherits: true` for the values to flow down. Alternatively, expose the range endpoints as tokens that feed into the clamp generator at build time, with a documented regeneration path.

---

### Gap 2 — No semantic element auto-styling beyond minimal reset (High Impact)

**What competitors have:**
ACSS v4 automatically applies:
- Section padding to `section`, `header`, `footer`, `.section` via `--content-padding`
- Readable line length (max-width) to `p`, `li`, `figcaption`
- Correct line-height at each type size
- Gap/margin to adjacent headings inside content regions

Bulma v1 styles semantic HTML elements (`h1`–`h6`, `p`, `ul`, `ol`) with its design system tokens out of the box.

**What SLASHED does:**
`base.css` is intentionally "minimal foundation, not a classless UI kit." Headings, paragraphs, and body text get only the most basic defaults. All semantic styling is delegated to `.sf-prose` (opt-in) or consumer BEM.

**Why this matters:**
A new SLASHED user sees nothing. An ACSS user sees a working visual hierarchy immediately. This gap is by philosophical design, but it creates a steep "time to visible result" curve that disadvantages SLASHED in evaluation and adoption.

**Recommendation:**
SLASHED philosophy should NOT become ACSS-style auto-application (that would destroy the BEM-first approach). However, a companion `slashed.classless.css` optional module that auto-applies all SLASHED tokens to semantic HTML elements (similar to `normalize.css` but token-driven) would bridge the gap for CMS-content and documentation sites without compromising the token-first philosophy for everyone else.

---

### Gap 3 — Component token recipes are stubs (High Impact)

**What competitors have:**
ACSS v4 ships functional semantic tokens for buttons, cards, inputs, badges with documented usage. Bulma v1's entire value proposition is styled components.

**What SLASHED does:**
`tokens.components.css` is "incomplete, commented out." `components.css` has 8 stub selectors with no implementation.

**Why this matters:**
SLASHED's stated goal is to help consumers build BEM components using framework tokens. But without shipped component token recipes demonstrating HOW to wire `--sf-button-bg: var(--sf-color-action)`, `--sf-button-radius: var(--sf-radius-m)`, `--sf-button-padding-block: var(--sf-space-s)`, consumers have to rediscover the pattern themselves. This is the single largest gap between SLASHED's potential and its current state.

**Recommendation:**
Ship a minimum of 4–5 complete component token recipes as canonical reference implementations: button, card, badge, input, and one compound pattern (e.g., alert/callout). These become the authoritative demonstration of the BEM-on-SLASHED-tokens pattern. They don't need to be pre-styled — they can be purely token-layer definitions with no visual opinions. This IS the killer feature of the framework; ship it.

---

### Gap 4 — Line-height not automatically adjusted for type size (Medium Impact)

**What competitors have:**
ACSS v4 automatically applies tighter line-height as text grows larger — a fundamental typographic convention (display text at 1.1, body text at 1.5). This is built into the generated values. SLASHED has per-size leading tokens in `sizes-extended` (`--sf-text-xl-line-height: snug`, `--sf-text-2xl-line-height: snug`, etc.) but explicitly does NOT auto-apply them.

**Why this matters:**
The per-size leading tokens encode correct typographic defaults (the framework team knows the right values) but delegates the wiring to consumers who may not know these conventions exist. The API surface exists; the automation gap is all that's missing.

**Recommendation:**
Apply the sizes-extended line-height sub-properties to the heading element tokens (`--sf-h1-line-height`, `--sf-h2-line-height`, etc.) by default. These are already consumed in `base.css`. The type-size-to-leading relationship should be wired at the token layer, not left as opt-in documentation.

---

### Gap 5 — No prose max-width (measure) auto-applied to body text (Medium Impact)

**What competitors have:**
ACSS v4 applies `max-width` to `p`, `li`, `blockquote` to enforce readable measure. Tailwind CSS typography plugin does the same within prose containers. The `65ch` measure limit is a well-established UX guideline.

**What SLASHED does:**
`--sf-text-m-max-width: 65ch` exists in sizes-extended. Nothing applies it.

**Why this matters:**
Long lines are a primary readability failure mode. Most consumer projects will not know to apply measure limits unless prompted. The token exists; it just needs a home.

**Recommendation:**
Apply `max-width: var(--sf-text-m-max-width)` to `p` inside `.sf-prose` (already partially handled) and consider adding it to the `classless.css` module (see Gap 2 recommendation). Also document it prominently as "the first thing to apply after importing SLASHED."

---

### Gap 6 — Missing "icon color" semantic tokens (Medium Impact)

**What competitors have:**
ACSS v4 has `--icon-color`, `--icon-color-hover`, icon-on-brand-color etc. Bulma has icon color inherit from text but documents explicit icon coloring patterns.

**What SLASHED does:**
Icon sizes exist (`--sf-icon-xs` through `--sf-icon-2xl`) but there are no semantic color tokens for icons. Consumers must use `--sf-color-text--muted`, `--sf-color-text`, or brand colors directly.

**Why this matters:**
Icons appear in four common states: default (matches text), muted (secondary/tertiary attention), active/highlighted (matches action color), and on-brand (on colored button/badge). Without named tokens, consumers hardcode these relationships or use the generic text colors without naming intent.

**Recommendation:**
Add 4 icon color tokens to the core token set:
- `--sf-color-icon: var(--sf-color-text--secondary)` — default icon color (slightly subdued)
- `--sf-color-icon--active: var(--sf-color-action)` — highlighted/interactive state
- `--sf-color-icon--muted: var(--sf-color-text--muted)` — disabled/low-attention icons
- `--sf-color-icon--on-primary: var(--sf-color-text--on-primary)` — icons on brand surfaces

---

### Gap 7 — No semantic "on dark section" scope pattern (Medium Impact)

**What competitors have:**
ACSS v4 has "dark section" context tokens where placing a `.is-dark` class on a `section` automatically flips text, surface, and link colors to dark-mode equivalents regardless of the page's overall color scheme. This enables mixed light/dark sections on the same page.

**What SLASHED does:**
`[data-theme="dark"]` can be placed on any element, which correctly flips all light-dark() tokens within that element's subtree. This is technically equivalent. However: (1) it's not documented as the "dark section" pattern, (2) `data-theme` feels like a page-level attribute, and (3) there's no `.sf-section--dark` modifier that pairs with the existing `.sf-section` class.

**Recommendation:**
Document and add `.sf-section--inverse` modifier that sets `data-theme="dark"` on itself (or directly overrides the key tokens). This makes the pattern discoverable via the `.sf-section` API rather than requiring knowledge of the global theme system.

---

### Gap 8 — No configurable type scale ratio (Low-Medium Impact)

**What competitors have:**
ACSS v4 allows users to define a `--type-ratio` (e.g., 1.25 Major Third, 1.333 Perfect Fourth) from which all heading sizes derive. Users select a scale ratio and get a mathematically harmonious type hierarchy.

**What SLASHED does:**
Individual fluid clamp values are calibrated by the framework team. The scale is hardcoded at specific rem breakpoints rather than derived from a ratio. Users can override individual `--sf-h*-size` tokens but can't change the whole scale systematically.

**Why this matters:**
Less critical than viewport range configurability, but a common request for design system builders who want mathematical scale harmony. The current scales are well-chosen, but the lack of a systematic control is a gap vs ACSS in user perception.

**Recommendation:**
This is a genuine philosophical choice — hardcoded fine-tuned values vs. mathematically derived. SLASHED's approach produces better results for the default scale but makes systematic customization harder. Consider documenting the type scale rationale and providing a companion scale generator tool.

---

### Gap 9 — Missing smart prose/editorial spacing tokens (Medium Impact)

**What competitors have:**
ACSS v4 ships a dedicated set of "smart spacing" tokens for editorial contexts that go far beyond `--sf-flow-space`:

```
--paragraph-spacing         --heading-spacing
--h2-spacing through --h6-spacing
--list-spacing              --list-item-spacing
--list-indent-spacing       --nested-list-spacing
--figure-spacing            --figcaption-spacing
--blockquote-spacing
```

These are then auto-applied to the relevant elements in content regions, removing all browser-default margins and replacing them with controlled token-driven spacing.

**What SLASHED does:**
`.sf-prose` applies spacing within long-form content zones, but through a single `--sf-prose-block-margin` and `--sf-prose-paragraph` token. There are no independent tokens for list item spacing, heading gap before/after, blockquote indent, or figcaption distance.

**Why this matters:**
When building editorial sites, CMS article pages, or documentation, the ability to control prose spacing at this granular level — without overriding `.sf-prose` entirely — is frequently needed. Currently SLASHED users must add CSS within `@layer slashed.overrides` to adjust any individual prose element's spacing.

**Recommendation:**
Extend `--sf-prose-*` token set to cover: `--sf-prose-list-item-gap`, `--sf-prose-blockquote-indent`, `--sf-prose-figure-gap`, `--sf-prose-figcaption-gap`, and per-heading level spacing (`--sf-prose-h2-gap`, etc.). Wire them into `.sf-prose` internals.

---

### Gap 9b — Missing color channel decomposition tokens (Low Impact)

**What competitors have:**
Both ACSS v4 and Bulma v1 expose color channel variables for each semantic color:

ACSS: `--primary-h`, `--primary-s`, `--primary-l`, `--primary-rgb`
Bulma: `--bulma-primary-h`, `--bulma-primary-s`, `--bulma-primary-l`, `--bulma-primary-rgb`

These let consumers compose custom derivations: `rgba(var(--primary-rgb), 0.4)`, or `hsl(var(--primary-h) var(--primary-s) calc(var(--primary-l) + 20%))`.

**What SLASHED does:**
The palette tokens (50–950, a5–a95) provide pre-generated derivations. `oklch(from var(--sf-color-primary) l c h / 0.4)` works natively. But there are no decomposed channel variables for OKLCH: no `--sf-color-primary-L`, `--sf-color-primary-C`, `--sf-color-primary-H`.

**Why this matters for SLASHED specifically:**
The lack of channel decomposition is less critical than in HSL-based frameworks because SLASHED's relative-color syntax (`oklch(from var(--sf-color-primary) ...)`) handles most derivations natively. However, consumers who want to do channel-based animation or gradients with `linear-gradient(in oklch, ...)` may need the decomposed values. Low priority.

---

### Gap 10 — Spacing scale lacks semantic tier distinction (Low Impact)

**What competitors have:**
ACSS v4 explicitly distinguishes between:
- **Content spacing** — space between elements within a component (small)
- **Component spacing** — space between components within a section (medium)
- **Section spacing** — space between sections on a page (large)

These map to three tiers of the scale with named semantic aliases.

**What SLASHED does:**
SLASHED has `--sf-content-gap`, `--sf-gap`, `--sf-section-pad` which implicitly covers this three-tier distinction. But the mapping between the numeric scale and the tiers is implicit rather than documented. `--sf-component-pad` partially fills this but only covers padding, not gap.

**Recommendation:**
Document the three-tier spacing model explicitly. Possibly add `--sf-space-within` (equivalent to content-gap), `--sf-space-between` (gap between sibling components), `--sf-space-section` (alias for section-pad). The existing tokens mostly cover this — the gap is in naming clarity and documentation.

---

### Gap 11 — No surface hierarchy beyond 4 levels (Low Impact)

**What competitors have:**
Bulma v1 has a finer-grained surface system. ACSS v4 has explicit surface-1 through surface-4 (or -5) for layered card-in-card patterns.

**What SLASHED does:**
`inset → surface/base → bg → raised` = 4 levels. This covers most UI patterns. Complex dashboard UIs with 3+ levels of nesting (main page → sidebar panel → card → tooltip) can exhaust the palette.

**Recommendation:**
Add `--sf-color-floating` above `--sf-color-raised` for tooltips and popovers that appear above the primary raised surface. This one addition covers most 5-level UI patterns without bloating the surface hierarchy.

---

### Summary: Gap Priority Matrix

| Gap | Impact | Effort | Priority |
|---|---|---|---|
| Component token recipes (stubs) | High | High | **P0 — Ship or remove** |
| Fluid viewport range configurable | High | High | **P1 — Major feature** |
| No semantic element auto-styling | High | Medium | **P1 — `classless.css` module** |
| Line-height not auto-applied per size | Medium | Low | **P2 — Quick fix** |
| No prose max-width auto-applied | Medium | Low | **P2 — Quick fix** |
| Missing icon color semantic tokens | Medium | Low | **P2 — 4 tokens** |
| No dark section scope pattern (documented) | Medium | Low | **P2 — Docs + 1 modifier** |
| Missing smart prose spacing tokens | Medium | Medium | **P2 — Extend `--sf-prose-*` set** |
| Configurable type scale ratio | Low-Medium | High | **P3 — Generator tool** |
| Spacing tier naming clarity | Low | Low | **P3 — Docs + aliases** |
| Surface hierarchy depth | Low | Low | **P3 — 1 token** |
| Color channel decomposition | Low | Low | **P3 — Optional; relative color covers most needs** |

---

### What SLASHED should NOT borrow from competitors

The following ACSS/Bulma patterns would damage SLASHED's architecture if adopted:

- **HSL-based color derivation (Bulma)** — OKLCH is objectively better. Do not regress. (Note: ACSS v4 now also uses OKLCH for generation, but exposes compiled hex values rather than runtime oklch() tokens — SLASHED's fully runtime OKLCH approach remains technically superior for animation and dynamic theming.)
- **Viewport-based breakpoints (ACSS/Bulma)** — Container queries are the future. Maintain the no-breakpoints stance.
- **Auto-styled HTML elements in the core** — SLASHED's minimal `base.css` is a feature, not a bug, for its BEM consumer audience. The optional `classless.css` module (recommended above) serves the other audience without contaminating the core.
- **Utility class layer (Tailwind)** — SLASHED explicitly defers this to `utilities.css` (currently empty). If utilities are added, keep them genuinely rare: `sr-only` is correct; `text-center` is not.

---

### Conclusion

SLASHED's token architecture is technically superior to ACSS v4 and Bulma v1 in color model, dark mode derivation, and responsiveness approach. The gaps are concentrated in three areas: **missing component token recipes** (the framework's core promise, partially unfulfilled), **hardcoded fluid range** (makes the scale non-portable), and **semantic automation vs. explicit application** (the philosophy gap that makes ACSS feel more "automatic"). Closing P0–P2 would make SLASHED meaningfully more competitive.

The framework is not missing features — it is missing the *bridge* between its powerful token system and the practical BEM patterns it is designed to enable.
