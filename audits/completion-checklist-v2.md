# SLASHED — Production Readiness Checklist v2

> Generated: 2026-05-21
> Framework version: 0.1.0
> Target: v1.0 release

---

## Table of Contents

1. [Tokens](#1-tokens)
2. [Reset](#2-reset)
3. [Base](#3-base)
4. [Forms](#4-forms)
5. [Layout](#5-layout)
6. [States](#6-states)
7. [Themes](#7-themes)
8. [Motion](#8-motion)
9. [Accessibility](#9-accessibility)
10. [Print](#10-print)
11. [Legacy](#11-legacy)
12. [Build & Distribution](#12-build--distribution)
13. [Tests](#13-tests)
14. [Documentation](#14-documentation)
15. [Internal Consistency](#15-internal-consistency)
16. [Top 25 Priorities](#top-25-priorities)
17. [What We Have in Excess](#what-we-have-in-excess)
18. [Summary](#summary)
19. [Gap Analysis vs Each Benchmark](#gap-analysis-vs-each-benchmark)
20. [Roadmap](#roadmap)

---


## 1. Tokens

### 1.1 Color Tokens

| Item | Status | Benchmark | Priority | Note |
|------|--------|-----------|----------|------|
| 6 brand colors (@property, animatable) | ✓ | ACSS | - | primary, secondary, tertiary, action, neutral, base |
| 5 status colors (@property) | ✓ | ACSS | - | success, warning, error, info, danger |
| Auto dark-mode derivation (relative color syntax) | ✓ | ACSS | - | clamp formula with optional -dark override |
| light-dark() resolved tokens | ✓ | - | - | All 11 colors resolved |
| Surface tokens (bg, surface, well, raised, overlay, inverse) | ✓ | ACSS | - | Derived from --sf-color-base |
| Text hierarchy (text, secondary, muted, placeholder, disabled, inverse, heading) | ✓ | ACSS | - | Direction-dependent formulas |
| Text-on-color (auto contrast via sign()) | ✓ | ACSS | - | 11 families covered |
| Border tokens (default, subtle, strong, focus, disabled, translucent) | ✓ | ACSS | - | Direction-dependent |
| Link tokens (default, hover, active, visited, underline, disabled) | ✓ | ACSS | - | Derived from action |
| Interactive states (hover, active, selected, focus, disabled bg) | ✓ | ACSS | - | |
| Selection & backdrop | ✓ | Pico | - | selection-bg, selection-text, mark-bg, mark-text, dim |
| Status triplets (subtle, strong, muted) | ✓ | ACSS | - | 5 statuses x 3 variants |
| Gradients (brand + fade directional) | ✓ | OpenProps | - | 5 brand + 4 directional fades |
| Scrollbar tokens | ✓ | - | - | thumb + track (BEM API) |
| --sf-color-accent (7th brand slot) | ✗ | ACSS | MEDIUM | ACSS provides an accent color distinct from action. Add as optional 7th @property brand token |
| Color partials (H/S/L split per color) | ✗ | ACSS | LOW | oklch makes this less necessary; relative color syntax replaces manual H/S/L manipulation. Deliberately rejected |
| --sf-color-code-text token | 🟡 | Pico | LOW | Declared in base.css as fallback `inherit` but not in tokens.css. Add to tokens.css for discoverability |


### 1.2 Shadow & Depth Tokens

| Item | Status | Benchmark | Priority | Note |
|------|--------|-----------|----------|------|
| Shadow scale (none, xs, s, m, l, xl, 2xl, inner) | ✓ | OpenProps | - | 8 levels + glow |
| Dark-mode auto-strengthening (--sf-shadow-strength) | ✓ | ACSS | - | Unique to SLASHED |
| Text shadows (s, m, l) | ✓ | OpenProps | - | |
| Drop shadows (s, m, l) | ✓ | OpenProps | - | filter: drop-shadow() variants |
| Blur scale (xs, s, m, l, xl) | ✓ | OpenProps | - | |
| 3D perspective tokens (near, normal, far) | ✓ | - | - | |
| Opacity scale (0, 10, 25, 50, 75, 100) | ✓ | OpenProps | - | |
| --sf-shadow-glow (brand-tinted) | ✓ | ACSS | - | |

### 1.3 Typography Tokens

| Item | Status | Benchmark | Priority | Note |
|------|--------|-----------|----------|------|
| Font families (body, heading, display, mono) | ✓ | ACSS | - | + 3 optional system stacks |
| Font weight scale (100-900 numeric) | ✓ | OpenProps | - | + semantic aliases (body, heading, display) |
| Fluid font sizes (2xs-4xl + 3 display) | ✓ | ACSS | - | 9 + 3 display = 12 sizes |
| Line heights (tight, snug, normal, relaxed) | ✓ | OpenProps | - | |
| Letter spacing (tight, normal, wide, wider, widest) | ✓ | OpenProps | - | |
| Per-heading tokens (size, line-height, weight, tracking) | ✓ | ACSS | - | h1-h6 fully tokenized |
| OpenType features token (--sf-font-features) | ✓ | - | - | BEM API |
| Variable font variation (--sf-font-variation) | ✓ | - | - | BEM API |
| --sf-text-decoration-thickness | ✗ | Pico | LOW | Add for link/underline customization |
| --sf-line-clamp token | ✗ | ACSS | LOW | Utility concern, defer to utilities layer |


### 1.4 Spacing & Sizing Tokens

| Item | Status | Benchmark | Priority | Note |
|------|--------|-----------|----------|------|
| Fluid spacing scale (2xs-4xl) | ✓ | ACSS | - | 9 fluid steps + none + px + gutter |
| --sf-space-scale multiplier | ✓ | ACSS | - | Global scale override |
| UI sizes (xs-xl) | ✓ | - | - | Fixed sizes for buttons/controls |
| Container widths (narrow, prose, default, wide, full) | ✓ | ACSS | - | |
| Aspect ratios (square, video, cinema, photo, portrait, golden) | ✓ | OpenProps | - | |
| Section padding (s, m, l, xl) | ✓ | ACSS | - | |
| Spacing aliases (gap, content-gap, component-pad, field-block) | ✓ | ACSS | - | BEM consumer API |
| Icon sizes (xs-xl) | ✓ | ACSS | - | em-based |
| --sf-content-min-width (fluid baseline) | ✗ | ACSS | LOW | Not needed — --sf-container-narrow + 320px min body serves same purpose |

### 1.5 Border & Radius Tokens

| Item | Status | Benchmark | Priority | Note |
|------|--------|-----------|----------|------|
| Border widths (hairline, 1-4) | ✓ | OpenProps | - | 5 levels |
| Radius scale (none, xs-4xl, full) | ✓ | OpenProps | - | 10 levels, scalable |
| --sf-radius-scale multiplier | ✓ | ACSS | - | |
| Stroke widths (thin, regular, bold, heavy) | ✓ | - | - | SVG/icon stroke |
| --sf-divider-size token | ✗ | ACSS | HIGH | ACSS global divider system. Add --sf-divider-width, --sf-divider-style, --sf-divider-color |
| --sf-divider-style token | ✗ | ACSS | HIGH | Part of divider system |
| --sf-divider-color token | ✗ | ACSS | HIGH | Part of divider system |


### 1.6 Motion & Transition Tokens

| Item | Status | Benchmark | Priority | Note |
|------|--------|-----------|----------|------|
| Duration scale (none, instant, fast, normal, slow, slower) | ✓ | OpenProps | - | 6 levels, --sf-motion-scale multiplier |
| Easing library (linear, out, in, in-out, spring, elastic, bounce, overshoot) | ✓ | OpenProps | - | 8 easings including CSS linear() |
| Animation presets (9 token shorthands) | ✓ | OpenProps | - | fade-in/out, slides, scales, color-pulse |
| Transition shorthands (all, colors, transform, opacity, shadow) | ✓ | ACSS | - | + fast/slow/enter/exit |
| Scroll-driven timeline range tokens | ✓ | - | - | start/end range |
| --sf-transition-base deprecated alias | ✓ | - | - | Points to --sf-transition-all with deprecation note |
| --sf-ease-out-2..5 (multiple intensities per family) | ✗ | OpenProps | LOW | OpenProps has 5 variants per easing; our single set is sufficient for framework scope |
| --sf-animation-delay-* (stagger tokens) | ✗ | ACSS | MEDIUM | ACSS provides --animation-delay-1 through -5 for stagger patterns |
| Gradient tokens (numbered --gradient-1..30) | ✗ | OpenProps | LOW | Decorative, not framework concern. Deliberately rejected |
| Mask/edge-fade tokens (--sf-mask-edge-*) | ✗ | OpenProps | MEDIUM | Useful for reel/scroll edges. Add --sf-mask-scrim-start, --sf-mask-scrim-end |

### 1.7 Z-Index & Layout Tokens

| Item | Status | Benchmark | Priority | Note |
|------|--------|-----------|----------|------|
| Z-index scale (below, base, raised, low, mid, high, top, max) | ✓ | - | - | 8 levels |
| Safe-area inset tokens | ✓ | - | - | env() wrappers |
| --sf-header-height + sticky-offset | ✓ | ACSS | - | |
| Focus ring tokens (width, offset, style, color) | ✓ | ACSS | - | |
| Touch target token | ✓ | - | - | --sf-touch-target |
| --sf-contrast-bias | ✓ | - | - | Reserved for future contrast tuning |

### 1.8 Palette (optional/tokens.palette.css)

| Item | Status | Benchmark | Priority | Note |
|------|--------|-----------|----------|------|
| Numeric scale 50-950 per brand color (6 colors) | ✓ | Tailwind | - | Using color-mix(in oklab) |
| Alpha variants a5-a95 per brand color | ✓ | ACSS | - | 11 alpha stops |
| Shade aliases (superlight/xlight/lighter/darker/xdark/superdark) | ✓ | ACSS | - | |
| Functional aliases (hover/active/subtle/muted/ghost) | ✓ | ACSS | - | |
| Base color inverted mix direction | ✓ | - | - | V-shaped ramp documented |
| Status colors in palette (numeric scale) | ✗ | ACSS | LOW | Status already have subtle/strong/muted in tokens.css. Full numeric expansion not needed for status |


---

## 2. Reset

| Item | Status | Benchmark | Priority | Note |
|------|--------|-----------|----------|------|
| Universal box-sizing + margin/padding reset | ✓ | modern-normalize | - | |
| html: text-size-adjust, scroll-padding, scrollbar-gutter, color-scheme | ✓ | andy-bell-reset | - | |
| html: hanging-punctuation | ✓ | andy-bell-reset | - | |
| html: interpolate-size: allow-keywords (@supports) | ✓ | - | - | Progressive, Chrome 129+/Safari 18+ |
| body: min-height 100dvh + min-inline-size 320px | ✓ | modern-normalize | - | |
| List reset (menu, ul, ol) | ✓ | andy-bell-reset | - | |
| Media elements block + max-width + height auto | ✓ | modern-normalize | - | img, picture, video, canvas, svg |
| Embeds (iframe, embed, object) | ✓ | - | - | block, max-width, no border |
| Form inheritance (font, color, letter-spacing, color-scheme, line-height) | ✓ | modern-normalize | - | |
| Button text-transform: none | ✓ | modern-normalize | - | |
| Fieldset: no border, no padding, min-width 0 | ✓ | Pico | - | |
| Legend: padding 0 | ✓ | - | - | |
| Touch-action: manipulation on interactive elements | ✓ | - | - | a, button, input, select, textarea, summary |
| Summary: no list-style + cursor pointer | ✓ | Pico | - | |
| Textarea: resize vertical | ✓ | modern-normalize | - | |
| Button: cursor pointer | ✓ | Pico | - | |
| Table: border-collapse + spacing 0 | ✓ | modern-normalize | - | |
| [hidden]: display none !important | ✓ | - | - | |
| dialog, [popover]: padding 0, border none, bg none, color inherit | ✓ | - | - | HTML5.3 elements covered |
| [inert]: cursor default | ✓ | - | - | |
| search element reset | 🟡 | - | LOW | <search> is semantic only (no visual UA style); no specific reset needed but could add display:block for older engines |
| ::file-selector-button reset | ✗ | modern-normalize | LOW | Only font:inherit is set in base.css. Consider adding appearance:button in reset for consistency |
| Redundant resets | ⚠️ | - | LOW | `textarea { resize: vertical }` appears in both reset.css AND forms.css. Remove from forms.css |

---

## 3. Base (Element Defaults)

| Item | Status | Benchmark | Priority | Note |
|------|--------|-----------|----------|------|
| body: full token chain (family, size, line-height, weight, color, bg) | ✓ | Pico | - | |
| h1-h6: token-driven sizes, weights, tracking, text-wrap balance | ✓ | Pico | - | scroll-margin-top included |
| p: text-wrap pretty, overflow-wrap, orphans/widows | ✓ | - | - | |
| b/strong: weight token | ✓ | Pico | - | |
| small: size token | ✓ | Pico | - | |
| mark: bg + color + radius + padding | ✓ | Pico | - | |
| abbr[title]: underline dotted + cursor help | ✓ | Pico | - | |
| kbd, samp: mono font | ✓ | Pico | - | |
| sub, sup: proper positioning | ✓ | modern-normalize | - | |
| a: full state chain (default, hover, visited, active) + transition | ✓ | Pico | - | |
| code: mono, size, padding, radius, bg | ✓ | Pico | - | |
| pre: mono, size, padding, radius, bg, overflow-x, tab-size | ✓ | Pico | - | |
| pre code: reset nested | ✓ | Pico | - | |
| svg: fill currentcolor | ✓ | - | - | |
| hr: token-driven border | ✓ | Pico | - | |
| :target: scroll-margin-top | ✓ | - | - | |
| ::selection: token bg + color | ✓ | Pico | - | |
| th, caption: text-align start | ✓ | - | - | |
| address, cite, dfn, var: no italic | ✓ | - | - | |
| input, textarea: caret-color token | ✓ | - | - | |
| input, progress: accent-color token | ✓ | Pico | - | |
| ::backdrop: dim color | ✓ | - | - | |
| ::placeholder: opacity 1 + color token | ✓ | Pico | - | |
| ::file-selector-button: font inherit | ✓ | - | - | |
| optgroup: font inherit | ✓ | - | - | |
| blockquote (global) | ✗ | Pico | HIGH | Only styled inside .sf-prose. Add base blockquote with left border + padding + token color |
| table/thead/tbody/td/th (global) | ✗ | Pico | MEDIUM | Only in .sf-prose. Global table styling is classless-Pico territory; intentional omission for opt-in via forms.css pattern |
| details/summary (global) | ✗ | Pico | HIGH | No base styling for disclosure widgets. Add marker/icon + padding + border |
| progress element | ✗ | Pico | MEDIUM | No base styling. Add height + radius + accent-color. Pico fully styles it |
| meter element | ✗ | Pico | LOW | Complex cross-browser styling. Defer |
| figure/figcaption (global) | ✗ | Pico | MEDIUM | Only in .sf-prose. Add base margin + caption styling |
| dialog element (global) | ✗ | Pico | HIGH | Reset exists but no visual defaults. Add padding + radius + shadow + max-width |
| dl/dt/dd (global) | ✗ | Pico | MEDIUM | No definition list styling. Add spacing + dt bold |


---

## 4. Forms (optional/forms.css)

| Item | Status | Benchmark | Priority | Note |
|------|--------|-----------|----------|------|
| Text-like inputs (text, email, password, url, tel, number, search, date, datetime-local, month, week, time, color) | ✓ | Pico | - | All covered in :where() selector |
| Select with custom arrow | ✓ | Pico | - | SVG data-URI, appearance:none |
| Textarea (min-height, resize) | ✓ | Pico | - | |
| Button / submit / reset | ✓ | Pico | - | inline-flex, token colors, hover/focus/disabled |
| Checkbox & radio (accent-color) | ✓ | Pico | - | Minimal but functional |
| Fieldset + legend | ✓ | Pico | - | Border, radius, padding, legend weight |
| Label | ✓ | Pico | - | block, weight, margin |
| Focus states (focus-visible) | ✓ | Pico | - | border-color + outline ring |
| Disabled states | ✓ | Pico | - | bg, color, opacity, cursor |
| Placeholder styling | ✓ | Pico | - | color token, opacity 1 |
| input[type="file"] (::file-selector-button) | ✗ | Pico | HIGH | Missing custom file input styling. Add button-like appearance for ::file-selector-button |
| input[type="range"] (track + thumb) | ✗ | Pico | HIGH | Missing range slider styling. Add ::-webkit-slider-thumb/track and ::-moz-range-thumb/track |
| switch (checkbox[role="switch"]) | ✗ | Pico | MEDIUM | Pico has a toggle switch. Consider adding as opt-in pattern |
| Form group pattern (label + input + helper) | ✗ | ACSS | MEDIUM | Structural spacing between label/input/helper text. Could use .sf-stack or add spacing rules |
| Required asterisk indicator | ✗ | ACSS | LOW | Add via `label:has(+ :required)::after` or explicit class |
| Helper text / error text below input | ✗ | ACSS | MEDIUM | Small text below inputs for validation messages. Integrate with .is-* states |
| .is-invalid/.is-error integration with forms | 🟡 | ACSS | HIGH | States set --sf-field-border-color but forms.css doesn't consume it. Add `border-color: var(--sf-field-border-color, var(--sf-color-border))` to inputs |
| Select arrow cross-browser (currentColor) | 🟡 | Pico | MEDIUM | SVG uses stroke="currentColor" but may not inherit in all browsers. Test in Firefox/Safari; consider using mask-image approach instead |
| textarea resize: vertical duplication | ⚠️ | - | LOW | Duplicated from reset.css. Remove from forms.css |

---

## 5. Layout

### 5.1 Every Layout Primitives Coverage

| Primitive | Status | Benchmark | Note |
|-----------|--------|-----------|------|
| Stack (.sf-stack) | ✓ | EveryLayout | flex column, 8 gap modifiers, 3 alignment modifiers |
| Box (.sf-box) | ✓ | EveryLayout | padding + outline border (not box-model disturbing) |
| Center (.sf-center) | ✓ | EveryLayout | content-box + max-inline-size + intrinsic variant |
| Cluster (.sf-cluster) | ✓ | EveryLayout | flex-wrap, 6 gap modifiers, justify modifiers |
| Sidebar (.sf-sidebar) | ✓ | EveryLayout | flex-wrap, min-width trick, --right variant, narrow/wide |
| Switcher (.sf-switcher) | ✓ | EveryLayout | calc threshold trick, vertical/no-wrap variants |
| Cover (.sf-cover) | ✓ | EveryLayout | min-height, __center auto-margin, size/padding variants |
| Grid (.sf-grid) | ✓ | EveryLayout | auto-fill + --fit variant, 5 min-size modifiers |
| Frame (.sf-frame) | ✓ | EveryLayout | aspect-ratio, 7 ratio modifiers, media cover |
| Reel (.sf-reel) | ✓ | EveryLayout | scroll-snap, overscroll-behavior, thin scrollbar |
| Imposter (.sf-imposter) | ✓ | EveryLayout | absolute centered, --fixed, --contain variants |
| Icon (sizing primitive) | ✗ | EveryLayout | LOW | EveryLayout's Icon is width/height em-based. We have --sf-icon-* tokens but no .sf-icon class. Utility concern |


### 5.2 SLASHED-Specific Layout Primitives

| Primitive | Status | Benchmark | Note |
|-----------|--------|-----------|------|
| Alternate (.sf-alternate) | ✓ | - | Zigzag media-object, container-query responsive, named container |
| Pancake (.sf-pancake) | ✓ | - | Sticky footer (grid auto 1fr auto) |
| Content-Grid (.sf-content-grid) | ✓ | ACSS | Breakout pattern with named grid lines |
| Bento (.sf-bento) | ✓ | - | Auto-flow dense, CQ responsive, col/row modifiers |
| Subgrid (.sf-subgrid, .sf-subgrid-rows) | ✓ | - | Inherit parent tracks |
| Prose (.sf-prose) | ✓ | - | Vertical rhythm + .sf-not-prose reset |
| Section (.sf-section) | ✓ | ACSS | Padding-block with s/m/l/xl modifiers |
| Section-group (.sf-section-group) | ✓ | ACSS | Collapses adjacent section padding |
| Container (.sf-container) | ✓ | ACSS | Named container, 4 width modifiers |
| Fixed grids (.sf-grid-1 through .sf-grid-6) | ✓ | - | CQ-responsive column grids |
| Ratio grids (.sf-grid-1-2, 2-1, 1-3, 3-1) | ✓ | - | CQ-responsive ratio grids |

### 5.3 Layout Gaps & Improvements

| Item | Status | Benchmark | Priority | Note |
|------|--------|-----------|----------|------|
| Every primitive has tokens | ✓ | EveryLayout | - | All in tokens.layout.css |
| Every primitive has size modifiers | ✓ | - | - | Via gap modifiers or dedicated tokens |
| Every primitive demoed in demo.html | ✓ | - | - | Confirmed via grep: all present |
| Container query usage | ✓ | - | - | Bento, grid-N, ratio grids, alternate all use @container |
| .sf-container establishes named container (sf-layout) | ✓ | - | - | Enables targeted CQ from children |
| .sf-divider / .sf-separator class | ✗ | ACSS | HIGH | ACSS has a visual divider component with gap, size, style, color. Add .sf-divider consuming --sf-divider-* tokens in layout layer |
| Auto-fit grid responsive by item width | ✓ | ACSS | - | .sf-grid--fit already implements this |
| Grid dense flow utility | 🟡 | - | LOW | Only on .sf-bento. Consider adding .sf-grid--dense for regular grids |
| Prose: blockquote styling | ✓ | - | - | margin-block rule in prose |
| Prose: table styling | ✓ | - | - | margin-block + overflow-x in prose |
| Prose: figure/figcaption | ✓ | - | - | Styled within prose |

---

## 6. States

### 6.1 Existing States Audit

| State | Status | Benchmark | Note |
|-------|--------|-----------|------|
| .is-hidden | ✓ | Bulma | display:none !important |
| .is-invisible | ✓ | Bulma | visibility:hidden |
| .is-visible | ✓ | Bulma | visibility:visible |
| .is-disabled | ✓ | Bulma/ACSS | opacity + pointer-events + cursor + user-select |
| .is-readonly | ✓ | - | pointer-events + user-select |
| .is-loading | ✓ | Bulma | Spinner pseudo-element + transparent text |
| .is-busy | ✓ | - | cursor:progress |
| .is-skeleton | ✓ | - | Shimmer animation + transparent text |
| .is-active | ✓ | Bulma | Sets --sf-is-active token |
| .is-selected | ✓ | - | bg-selected color |
| .is-current | ✓ | Bulma | Font-weight token + --sf-is-current |
| .is-highlighted | ✓ | - | bg-focus color |
| .is-open | ✓ | Bulma | Sets --sf-is-open: 1 |
| .is-collapsed | ✓ | - | Sets --sf-is-open: 0 |
| .is-expanded | ✓ | - | Sets --sf-is-open: 1 |
| .is-valid | ✓ | - | field-border-color success |
| .is-invalid | ✓ | - | field-border-color error |
| .is-warning | ✓ | - | field-border-color warning |
| .is-success | ✓ | - | field-border-color success |
| .is-error | ✓ | - | field-border-color error |
| .is-info | ✓ | - | field-border-color info |
| .is-danger | ✓ | - | field-border-color danger |
| .is-sticky | ✓ | Bulma | position:sticky + offset + z-index |
| .is-pinned | ✓ | - | sticky top:0 + z-mid |
| .is-fixed | ✓ | Bulma | position:fixed |
| .is-clipped | ✓ | Bulma | overflow:hidden !important |
| .is-scrollable | ✓ | - | overflow:auto + overscroll-behavior |
| .is-truncated | ✓ | - | ellipsis single-line |
| .is-dragging | ✓ | - | opacity + cursor:grabbing |
| .is-drop-target | ✓ | - | dashed outline |
| .is-draggable | ✓ | - | cursor:grab |
| .is-overlay | ✓ | Bulma | absolute inset:0 |
| .is-clickable | ✓ | Bulma | cursor:pointer |
| .is-unselectable | ✓ | Bulma | user-select:none |
| .is-empty | ✓ | - | :empty hides element |


### 6.2 Missing States

| Item | Status | Benchmark | Priority | Note |
|------|--------|-----------|----------|------|
| .is-focused (programmatic focus indicator) | ✗ | ACSS | MEDIUM | For JS-driven focus without :focus-visible. Add outline ring matching accessibility.css |
| .is-pressed (aria-pressed) | ✗ | - | LOW | Toggle buttons. Consider adding bg-active + --sf-is-pressed token |
| .is-pending (async, distinct from loading) | ✗ | - | LOW | For optimistic UI. Could set opacity:0.7 + cursor:wait |
| .is-fullscreen | ✗ | - | LOW | Rare. position:fixed + inset:0 + z-max. Consider vs native :fullscreen |
| .is-resizable | ✗ | - | LOW | resize:both. Very niche utility |
| .focus-parent (parent matches when child has focus) | ✗ | ACSS | MEDIUM | ACSS pattern: parent styles when :focus-within. Add with :has(:focus-visible) or :focus-within |

### 6.3 State Overlaps (Documentation Needed)

| Overlap | Action | Priority | Note |
|---------|--------|----------|------|
| .is-error vs .is-invalid | Document | HIGH | .is-error = generic component state; .is-invalid = form field validation |
| .is-danger vs .is-error | Document | HIGH | .is-danger = destructive action context; .is-error = validation feedback |
| .is-open vs .is-expanded | Document | MEDIUM | .is-open = disclosure (modal, dropdown); .is-expanded = accordion section |
| .is-valid vs .is-success | Document | MEDIUM | .is-valid = form-specific; .is-success = general positive state |

---

## 7. Themes

| Item | Status | Benchmark | Priority | Note |
|------|--------|-----------|----------|------|
| OS preference detection (prefers-color-scheme: dark) | ✓ | Pico | - | :root:not([data-theme]) |
| Explicit data-theme="light/dark" on any element | ✓ | Pico | - | Section-level scoped themes |
| --sf-is-dark mode flag | ✓ | - | - | Integer 0/1 for formula direction |
| color-scheme flip (light/dark) | ✓ | Pico | - | |
| Token-only reassignments (no new selectors) | ✓ | CUBE | - | Architecture principle maintained |
| Layer position above components/states | ✓ | - | - | Verified by layers.spec.js |
| Theme transition (smooth color switch via view-transition) | ✗ | - | MEDIUM | Add opt-in class or token for cross-document view-transition on theme change. motion.css has VT support but not tied to theme toggle |
| Example branded theme file | ✗ | ACSS | HIGH | Missing: a sample file showing how to override 6 brand tokens + add a custom color-scheme. Critical for adoption |
| Multi-brand theming documentation | ✗ | ACSS | MEDIUM | Architecture allows it (override -light tokens per brand) but no documentation |
| Pre-compiled color themes (like Pico's 20 themes) | ✗ | Pico | LOW | Deliberate omission — oklch + 6 tokens makes pre-compiled themes unnecessary |
| High-contrast theme variant | ✗ | - | LOW | prefers-contrast:more adjusts focus ring but no full high-contrast override. Acceptable |

---

## 8. Motion

### 8.1 Keyframes & Classes

| Item | Status | Benchmark | Priority | Note |
|------|--------|-----------|----------|------|
| sf-fade-in / sf-fade-out | ✓ | OpenProps | - | Keyframe + class + token preset |
| sf-slide-in-up/down/left/right | ✓ | OpenProps | - | 4 directions |
| sf-scale-up / sf-scale-down | ✓ | OpenProps | - | |
| sf-spin | ✓ (keyframe only) | - | - | Used by .is-loading but no standalone .sf-spin class |
| sf-shimmer | ✓ (keyframe only) | - | - | Used by .is-skeleton |
| sf-color-pulse | ✓ | - | - | @property interpolation demo + class |
| .sf-spin standalone class | ✗ | Tailwind | HIGH | Keyframe exists, add class: `.sf-spin { animation: sf-spin 1s linear infinite; }` inside no-preference |
| .sf-pulse class | ✗ | Tailwind | MEDIUM | Add keyframe + class for notification dot pulse |
| .sf-bounce class | ✗ | Tailwind | LOW | Decorative, lower priority |
| sf-blink keyframe (cursor blink) | ✗ | OpenProps | LOW | Niche. Consider adding for cursor/caret animations |
| sf-ping keyframe (notification pulse) | ✗ | OpenProps | MEDIUM | Useful for badges/notifications. Scale+fade out ring |
| sf-float keyframe (gentle float) | ✗ | OpenProps | LOW | Decorative hover animation |


### 8.2 Motion Infrastructure

| Item | Status | Benchmark | Priority | Note |
|------|--------|-----------|----------|------|
| prefers-reduced-motion gate on all classes | ✓ | - | - | All .sf-* animation classes inside no-preference |
| View-transition support | ✓ | - | - | Duration + easing applied to ::view-transition-* |
| Smooth scroll (html) | ✓ | - | - | With focus-within override for keyboard |
| Interactive element transitions (broad property set) | ✓ | - | - | a, button, input, select, textarea, summary |
| Animation delay tokens (--sf-delay-1..5) | ✗ | ACSS | MEDIUM | Stagger pattern: set progressively longer delays on children. Add 5 tokens (100ms increments) |
| .sf-stagger class (nth-child delay assignment) | ✗ | ACSS | MEDIUM | Auto-assigns --sf-delay-* based on child index. Useful with .sf-fade-in |
| Scroll-driven animation utility classes | ✗ | - | LOW | Tokens exist (--sf-scroll-timeline-range-*) but no classes. Utility concern, defer |
| @starting-style readiness | 🟡 | - | LOW | Not used yet. Chrome 117+ / Safari 17.5+. Could add for entry animations on display:none toggle. Document as future enhancement |

---

## 9. Accessibility

| Item | Status | Benchmark | Priority | Note |
|------|--------|-----------|----------|------|
| :focus-visible outline (WCAG 2.4.7) | ✓ | - | - | !important, token-driven |
| :focus:not(:focus-visible) outline suppression | ✓ | - | - | Mouse users don't see ring |
| Reduced motion nuke (0.01ms + iteration:1) | ✓ | - | - | !important on all elements |
| Duration token zeroing under reduce | ✓ | - | - | Token-level + property-level double guarantee |
| prefers-contrast: more | ✓ | - | - | Wider focus ring + thicker hr |
| prefers-reduced-transparency | ✓ | - | - | Solid backdrop |
| Touch targets (pointer:coarse) 44px | ✓ | - | - | Left normal (not !important) — intentional |
| Disabled cursor (disabled + aria-disabled) | ✓ | - | - | |
| .sr-only / .visually-hidden | ✓ | Bootstrap | - | clip-path + overflow:clip + !important |
| .skip-link (focus reveals) | ✓ | Bootstrap | - | Token-driven, themeable |
| Forced colors (Windows High Contrast) | ✓ | - | - | Highlight ring + shadow removal |
| .sr-only-focusable (becomes visible on focus) | ✗ | Bootstrap/ACSS | HIGH | Critical for skip-link alternatives and focus-trap exits. Add: `.sr-only-focusable:focus, .sr-only-focusable:focus-within { position: static; width: auto; height: auto; ... }` |
| .no-motion (manual override, not OS preference) | ✗ | ACSS | MEDIUM | Per-element motion suppression regardless of OS setting. Add: `.no-motion, .no-motion * { animation: none !important; transition: none !important; }` |
| prefers-reduced-data (@supports) | ✗ | - | LOW | Draft spec. Could add defensive `@media (prefers-reduced-data: reduce)` for lazy-load hints. Very speculative |
| Forced-colors: form element borders | 🟡 | - | MEDIUM | Forms lose visible borders in forced-colors. Add `@media (forced-colors: active) { input, select, textarea { border: 1px solid ButtonText; } }` |
| ARIA live-region considerations | ✗ | - | LOW | CSS-only framework cannot address; document as consumer responsibility |

---

## 10. Print

| Item | Status | Benchmark | Priority | Note |
|------|--------|-----------|----------|------|
| @page rule (size + margin tokens) | ✓ | - | - | |
| Shadow removal (decorative) | ✓ | - | - | Not !important — consumer can keep shadows |
| Link URL expansion (a[href]::after) | ✓ | Bootstrap | - | Excludes anchors and javascript: |
| abbr[title] expansion | ✓ | Bootstrap | - | |
| Break-inside: avoid on media/tables/pre/blockquote | ✓ | Bootstrap | - | |
| thead: table-header-group | ✓ | Bootstrap | - | |
| Headings: break-after avoid + orphans/widows | ✓ | - | - | |
| p: orphans/widows | ✓ | - | - | |
| pre/blockquote: border + padding in print | ✓ | - | - | |
| Hide list (nav, aside, button, input, dialog, .no-print) | ✓ | Bootstrap | - | !important justified |
| details: expand all, hide summary | ✓ | - | - | |
| .print-color-exact | ✓ | - | - | Force color reproduction |
| .print-no-color | ✓ | - | - | Ink-on-paper mode |
| Consume --sf-print-base-size | ✗ | - | HIGH | Token declared in tokens.css but NEVER consumed. Add `body { font-size: var(--sf-print-base-size); }` inside @media print |
| .print-only class | ✗ | Bootstrap | MEDIUM | Display:none normally, display:block in print. Add: `.print-only { display: none; } @media print { .print-only { display: block !important; } }` |
| .no-print standalone documentation | 🟡 | - | LOW | Exists in hide-list but not explicitly documented as a standalone class |
| video, audio in hide-list | 🟡 | - | LOW | video/audio produce blank boxes in print. Consider adding to hide-list or document as consumer decision |
| @page named pages | ✗ | - | LOW | Advanced: `@page cover { margin: 0; }` with `.cover-page { page: cover; }`. Defer to v1.x |
| page-break-before utility | ✗ | - | LOW | `.print-break-before { break-before: page; }` — utility concern, defer |


---

## 11. Legacy (optional/legacy.css)

| Item | Status | Benchmark | Priority | Note |
|------|--------|-----------|----------|------|
| dvh fallback (100vh) | ✓ | - | - | @supports not (height: 100dvh) |
| :focus-visible fallback (:focus) | ✓ | - | - | WCAG-critical |
| scrollbar-gutter fallback (overflow-y: scroll) | ✓ | - | - | Safari gap |
| accent-color documentation (no CSS fallback) | ✓ | - | - | Documented as no-op |
| Support floor documented | ✓ | - | - | Chrome 123+, Safari 17.5+, Firefox 128+ |
| Container query fallback | ✗ | - | LOW | CQ is baseline 2023. No fallback needed for stated support floor |
| @layer fallback | ✗ | - | LOW | Layers are the foundational architecture. No fallback possible. Support floor already requires layers |

---

## 12. Build & Distribution

| Item | Status | Benchmark | Priority | Note |
|------|--------|-----------|----------|------|
| Concatenation bundler (scripts/bundle.js) | ✓ | - | - | Handles multiple bundle configs |
| Essential bundle (11 core files) | ✓ | - | - | dist/slashed.essential.css |
| Full bundle (essential + palette + legacy) | ✓ | - | - | dist/slashed.full.css |
| Watch mode | ✓ | - | - | --watch flag with debounce |
| npm exports map (., ./essential, ./core/*, ./optional/*) | ✓ | - | - | Package subpath exports |
| unpkg/jsdelivr entry points | ✓ | - | - | Both point to full bundle |
| Version banner in built files | ✓ | Bulma | - | `/* SLASHED v{version} — filename */` |
| Path traversal prevention | ✓ | - | - | resolveInsideRoot() check |
| Minified bundle (.min.css) | ✗ | ACSS/Pico | CRITICAL | No minification. Add cssnano or lightningcss --minify to build pipeline |
| Source maps (.map) | ✗ | Tailwind | HIGH | Required for debugging production bundles |
| Gzip/Brotli size reporting | ✗ | - | MEDIUM | Add build-time size report (gzip-size package or brotli-size) |
| Bundle size badge in README | ✗ | OpenProps | MEDIUM | Show compressed size via bundlephobia or shields.io |
| forms.css not in any bundle | 🟡 | - | MEDIUM | optional/forms.css must be @imported separately. Consider adding a `slashed.with-forms.css` bundle or documenting more prominently |
| Separate layers.css entry point | 🟡 | - | LOW | Consumers who build custom bundles must import layers.css first. Document this requirement |
| Lightning CSS integration | ✗ | Tailwind | MEDIUM | Replace concat-only with lightningcss for minification + nesting + vendor prefixes |

---

## 13. Tests

| Item | Status | Benchmark | Priority | Note |
|------|--------|-----------|----------|------|
| Token regression (light + dark) | ✓ | - | - | tests/tokens.spec.js — resolves all tokens, contrast check, scale check |
| Layer order verification | ✓ | - | - | tests/layers.spec.js — 3 cascade tests |
| Selector coverage (every class in demo.html) | ✓ | - | - | tests/coverage.spec.js |
| Print behavior (color preservation, hide, force) | ✓ | - | - | tests/print.spec.js — 3 tests |
| Visual regression (demo.html comprehensive) | ✓ | - | - | tests/demo-visual.spec.js — 700+ lines covering all sections |
| WCAG contrast on all on-color pairs | ✓ | - | - | In tokens.spec.js — asserts >= 4.5:1 |
| axe-core a11y audit | ✗ | - | HIGH | Run axe-core on demo.html/fixture.html. Add @axe-core/playwright dependency |
| Container query breakpoint tests | ✗ | - | MEDIUM | Verify CQ rules trigger at correct widths for grid-N, bento, alternate |
| States visual test (all .is-* classes) | 🟡 | - | MEDIUM | demo-visual.spec.js tests some states (loading, skeleton, disabled, truncated, hidden) but not all 33 |
| Reduced-motion behavior test | ✗ | - | MEDIUM | Emulate prefers-reduced-motion:reduce and verify animation-duration resolves to 0.01ms |
| Cross-browser matrix (Firefox, WebKit) | ✗ | - | HIGH | Currently Chromium only (playwright.config.js). Add Firefox + WebKit projects |
| Forced-colors rendering test | ✗ | - | LOW | Playwright can emulate forced-colors. Verify focus ring uses Highlight |
| Performance/bundle-size regression | ✗ | - | MEDIUM | Assert bundle size stays below threshold (e.g. < 30KB uncompressed essential) |


---

## 14. Documentation

### 14.1 Existing Documentation

| Item | Status | Priority | Note |
|------|--------|----------|------|
| README.md (quickstart, install, CDN, architecture overview) | ✓ | - | |
| docs/architecture.md (layer order, file structure, layer descriptions) | ✓ | - | Comprehensive layer docs |
| docs/demo.html (interactive showcase) | ✓ | - | 2372 lines, covers all primitives and states |
| In-source documentation (header comments in every file) | ✓ | - | Excellent: API docs, usage, consumed tokens |
| CHANGELOG.md | ✓ | - | conventional-changelog via release-it |

### 14.2 Demo Coverage Gaps

| Class/Feature Missing from Demo | Status | Priority | Note |
|------|--------|----------|------|
| All .sf-* and .is-* classes present | ✓ | - | Confirmed by coverage.spec.js — all pass |
| Interactive state demos with descriptions | 🟡 | MEDIUM | States appear minimally (1 occurrence each). Add descriptive examples showing each state's purpose |
| Animation class visual demos (with replay button) | 🟡 | MEDIUM | Easing demo exists but preset classes could use before/after comparison |

### 14.3 Missing Documentation

| Item | Status | Benchmark | Priority | Note |
|------|--------|-----------|----------|------|
| Theming guide (how to rebrand with 6 tokens) | ✗ | ACSS | HIGH | Critical for adoption. Show: override -light tokens, auto dark, optional -dark override |
| Per-section theming examples | ✗ | Pico | MEDIUM | data-theme on sections, nested themes |
| Token reference table (all --sf-* listed with defaults) | ✗ | ACSS | HIGH | ACSS dashboard parity. Machine-readable token list |
| Dark mode cookbook | ✗ | Pico | MEDIUM | Common patterns: forced dark header, light card in dark page, theme toggle JS snippet |
| Layout primitives visual guide | ✗ | EveryLayout | HIGH | Diagram per primitive showing what it does. EveryLayout has excellent visuals |
| Performance considerations | ✗ | - | MEDIUM | Document: bundle size, paint performance of oklch, @property animation costs, transition-all footgun |
| Browser support matrix (detailed) | ✗ | Pico | HIGH | Table of features vs browsers with version numbers |
| Migration guide (Pico/Bulma to SLASHED) | ✗ | - | LOW | Mapping of equivalent classes/concepts |
| Contributing guide | ✗ | - | MEDIUM | For open-source contributors |
| State documentation (when to use each .is-*) | ✗ | - | HIGH | Table of state + ARIA mapping + usage guidance |

### 14.4 Architecture.md Issues

| Item | Status | Priority | Note |
|------|--------|----------|------|
| Layer order in architecture.md is OUTDATED | 🟡 | HIGH | Lists 13 layers without `slashed.forms`. Actual layers.css has 14 layers with forms between base and layout. UPDATE architecture.md |
| Missing tokens.palette.css in file structure diagram | 🟡 | MEDIUM | File structure section doesn't mention it's in the full bundle |

---

## 15. Internal Consistency

### 15.1 Tokens Declared but Not Consumed Internally

| Token | Declared In | Consumed In | Status | Note |
|-------|-------------|-------------|--------|------|
| --sf-scrollbar-thumb | tokens.css | nowhere | 🟡 | BEM consumer API — document explicitly |
| --sf-scrollbar-track | tokens.css | nowhere | 🟡 | BEM consumer API — document explicitly |
| --sf-body-text-wrap | tokens.css | nowhere | 🟡 | Declared as `pretty` but body in base.css doesn't consume it. Add `text-wrap: var(--sf-body-text-wrap)` to body |
| --sf-body-em-style | tokens.css | nowhere | 🟡 | Not consumed. Add `em { font-style: var(--sf-body-em-style); }` to base.css |
| --sf-body-strong-weight | tokens.css | nowhere | 🟡 | Not consumed. base.css uses --sf-font-weight-bold directly for b/strong. Align: use var(--sf-body-strong-weight) |
| --sf-heading-text-wrap | tokens.css | nowhere | 🟡 | Declared as `balance` but base.css h1-h6 uses hardcoded `balance`. Replace with var(--sf-heading-text-wrap) |
| --sf-h1-font-weight through --sf-h6-font-weight | tokens.css | nowhere | 🟡 | Per-heading weight tokens exist but base.css uses --sf-font-weight-heading for all. Consume per-heading tokens |
| --sf-print-base-size | tokens.css | nowhere | 🟡 | Not consumed in print.css. Add `body { font-size: var(--sf-print-base-size); }` in @media print |
| --sf-contrast-bias | tokens.css | nowhere | 🟡 | Reserved token for future contrast adjustment. Document as reserved/planned |
| --sf-optical-sizing | tokens.css | nowhere | 🟡 | BEM consumer API. Document |


### 15.2 Naming Consistency

| Issue | Status | Priority | Note |
|-------|--------|----------|------|
| All tokens use --sf-* prefix | ✓ | - | Consistent throughout |
| Color naming: --sf-color-X-light vs --sf-color-X--variant | 🟡 | LOW | Source tokens use -light/-dark (no double dash). Derived use --variant (double dash for modifiers). This is intentional but should be documented: single dash = source layer, double dash = modifier |
| Status tokens in tokens.css vs palette: no conflict | ✓ | - | Status has subtle/strong/muted in core; palette only covers brand colors |
| Layer naming: slashed.* consistent | ✓ | - | All 14 layers use slashed.* prefix |
| Class naming: .sf-* for framework, .is-* for states | ✓ | - | No violations found |
| Print classes (.print-color-exact, .print-no-color, .no-print) | 🟡 | LOW | Inconsistent: .no-print vs .print-no-color vs .print-color-exact. Consider standardizing to .print-* namespace |

### 15.3 Layer Architecture Verification

| Item | Status | Priority | Note |
|------|--------|----------|------|
| slashed.forms position (between base and layout) | ✓ | - | Intentional: forms opt-in styling should override base but not layout primitives |
| 14 layers in layers.css match architecture intent | ✓ | - | tokens > reset > base > forms > layout > components > utilities > states > themes > motion > accessibility > print > legacy > overrides |
| No !important in tokens/reset/base/layout/states/themes/motion | ✓ | - | Only accessibility.css and print.css use !important (documented justification) |
| States layer above utilities (CUBE methodology) | ✓ | - | States override utilities at equal specificity |
| Themes above states (theme always wins) | ✓ | - | Verified by test |

---


## Top 25 Priorities

Sorted by: impact x effort x benchmark-parity.

| # | Task | Category | Priority | Effort | Benchmark |
|---|------|----------|----------|--------|-----------|
| 1 | Add minified bundles (.min.css) via lightningcss/cssnano | Build | CRITICAL | S | ACSS/Pico/Tailwind |
| 2 | Consume --sf-print-base-size in print.css | Print | HIGH | XS | - |
| 3 | Add .sr-only-focusable class | Accessibility | HIGH | XS | Bootstrap/ACSS |
| 4 | Add .sf-spin standalone class | Motion | HIGH | XS | Tailwind |
| 5 | Add --sf-divider-* tokens + .sf-divider class | Tokens/Layout | HIGH | S | ACSS |
| 6 | Integrate .is-* states with forms.css (consume --sf-field-border-color) | Forms | HIGH | XS | ACSS |
| 7 | Add blockquote base styling (global) | Base | HIGH | XS | Pico |
| 8 | Add details/summary base styling | Base | HIGH | S | Pico |
| 9 | Add dialog base styling (padding, radius, shadow, max-width) | Base | HIGH | S | Pico |
| 10 | Write theming guide (rebrand in 6 tokens) | Docs | HIGH | M | ACSS |
| 11 | Create example branded theme file | Themes | HIGH | S | ACSS |
| 12 | Update architecture.md (add slashed.forms layer) | Docs | HIGH | XS | - |
| 13 | Write browser support matrix | Docs | HIGH | S | Pico |
| 14 | Add axe-core a11y test | Tests | HIGH | S | - |
| 15 | Add cross-browser test matrix (Firefox + WebKit) | Tests | HIGH | S | - |
| 16 | Generate source maps | Build | HIGH | S | Tailwind |
| 17 | Consume unconsumed typography tokens (body-text-wrap, heading-text-wrap, per-heading weights) | Base | HIGH | XS | - |
| 18 | Write state documentation (when to use each .is-*) | Docs | HIGH | M | - |
| 19 | Add input[type="file"] styling (::file-selector-button) | Forms | HIGH | S | Pico |
| 20 | Add input[type="range"] styling | Forms | HIGH | M | Pico |
| 21 | Add .sf-pulse / sf-ping keyframe + class | Motion | MEDIUM | XS | OpenProps/Tailwind |
| 22 | Add animation delay tokens (--sf-delay-1..5) | Motion | MEDIUM | XS | ACSS |
| 23 | Add .print-only class | Print | MEDIUM | XS | Bootstrap |
| 24 | Add mask/scrim tokens (--sf-mask-scrim-*) | Tokens | MEDIUM | S | OpenProps |
| 25 | Add forced-colors form border fix | Accessibility | MEDIUM | XS | - |

---

## What We Have in Excess

Items that could be removed or consolidated:

| Item | Location | Recommendation | Note |
|------|----------|----------------|------|
| textarea { resize: vertical } duplication | reset.css + forms.css | Remove from forms.css | reset.css already handles it |
| --sf-transition-base deprecated alias | tokens.css | Keep until v1.1, then remove | Documented deprecation path exists |
| .is-visible (inverse of .is-invisible) | states.css | Keep | Low cost, explicit complement. Excluded from coverage test already |
| .is-collapsed + .is-expanded overlap with .is-open | states.css | Document semantics | All three set --sf-is-open. Document: open=generic, expanded=accordion, collapsed=explicit closed |
| --sf-contrast-bias (unused, no implementation) | tokens.css | Document as reserved OR remove | If no v1.0 use case, remove to reduce token surface |
| 3 optional system font stacks (humanist, geometric, slab) | tokens.css | Keep | Zero cost (just declarations), useful BEM API |
| --sf-font-features + --sf-font-variation + --sf-optical-sizing | tokens.css | Keep + document | BEM consumer API, zero cost |
| .sf-cover--max variant | layout.css | Keep but document | max-height:100dvh is niche; document use case |

---


## Summary

### Completeness per Layer

| Layer | Items Audited | Complete | Needs Work | Missing | Score |
|-------|---------------|----------|------------|---------|-------|
| Tokens (core) | 52 | 44 | 3 | 5 | 85% |
| Tokens (palette) | 6 | 5 | 0 | 1 | 83% |
| Reset | 22 | 20 | 1 | 1 | 91% |
| Base | 30 | 23 | 0 | 7 | 77% |
| Forms | 18 | 12 | 2 | 4 | 67% |
| Layout | 27 | 25 | 1 | 1 | 93% |
| States | 39 | 33 | 0 | 6 | 85% |
| Themes | 10 | 6 | 0 | 4 | 60% |
| Motion | 18 | 11 | 1 | 6 | 61% |
| Accessibility | 14 | 10 | 1 | 3 | 71% |
| Print | 14 | 10 | 2 | 2 | 71% |
| Legacy | 6 | 6 | 0 | 0 | 100% |
| Build | 12 | 6 | 2 | 4 | 50% |
| Tests | 12 | 5 | 1 | 6 | 42% |
| Documentation | 15 | 5 | 2 | 8 | 33% |
| Internal Consistency | 16 | 8 | 8 | 0 | 50% |

### Overall Score: **72%** production-ready

**Breakdown:**
- Core CSS (tokens + reset + base + layout + states): **86%** — excellent foundation
- Optional modules (forms, themes, motion, a11y, print, legacy): **72%** — good, needs polish
- Infrastructure (build, tests, docs): **42%** — significant gaps for v1.0

---

## Gap Analysis vs Each Benchmark

### From Automatic.css (ACSS) — PRIMARY

**What we take:**
- Fluid spacing + typography with mathematical scale ✓
- oklch color space with relative color syntax ✓
- Auto/Variable grids responsive by item width ✓
- Section spacing system with content-width control ✓
- Smart spacing (gap-based, no margin) ✓
- Color partials via palette module (functional aliases) ✓
- Content width + breakout system ✓

**What we still need:**
- Global divider system (--sf-divider-* tokens + class)
- Animation delay + stagger patterns
- .is-focused / .focus-parent states
- --sf-color-accent (7th brand)
- Line-clamp utility (defer to utilities layer)
- Marker classes (defer to utilities layer)
- Selection styling tokens (already have them!)

**What we deliberately reject:**
- Sass/PHP preprocessor dependency
- BEM component library (out of scope for v1.0)
- Color partials as H/S/L split (oklch relative color makes this unnecessary)
- Dashboard GUI (separate product concern)

### From Open Props

**What we take:**
- Pure token philosophy ✓
- Naming convention (--sf-*-s/m/l scale) ✓
- Easing library with spring/elastic/bounce ✓
- Animation as tokens ✓
- Gradient tokens ✓
- Shadow layered system (Material-style) ✓
- Border size scale ✓

**What we still need:**
- Mask/edge-fade tokens
- sf-ping / sf-pulse animations
- Animation delay tokens

**What we deliberately reject:**
- 30 numbered gradient tokens (decorative bloat)
- 5 intensity levels per easing (one set is sufficient)
- Pure-token-only approach (we intentionally add layout classes)
- Camera shake animations (novelty)

### From Every Layout

**What we take:**
- All 11 original primitives ✓ (Stack, Box, Center, Cluster, Sidebar, Switcher, Cover, Grid, Frame, Reel, Imposter)
- Token-based API per primitive ✓
- Intrinsic sizing philosophy ✓

**What we still need:**
- Icon primitive (documented as utility concern)

**What we deliberately reject:**
- JavaScript-based container query polyfills (native CQ supported)
- Custom element implementations (pure CSS approach)

### From Pico CSS

**What we take:**
- Classless-first for forms (optional/forms.css) ✓
- data-theme dark/light on any element ✓
- prefers-color-scheme detection ✓
- CSS custom properties for all values ✓

**What we still need:**
- Base blockquote, details/summary, dialog, dl/dt/dd, figure, progress styling
- input[type="file"] and input[type="range"] in forms
- switch toggle pattern

**What we deliberately reject:**
- 20 precompiled color themes (6-token override makes this unnecessary)
- Conditional/scoped CSS file variants (layer architecture handles this)
- Fully classless approach for everything (layout requires classes)

### From CUBE CSS (Methodology)

**What we take:**
- Composition = layout layer ✓
- Utility = utilities layer (deferred) ✓
- Block = components layer (deferred) ✓
- Exception = states layer (.is-*) ✓
- Clear layer boundaries ✓

**Assessment:** Architecture fully aligned with CUBE methodology. Layer separation is clean and verified by tests.

### From Tailwind CSS v4

**What we take:**
- Token naming parity for familiar DX (--sf-color-*, --sf-shadow-*, --sf-ease-*) ✓
- @theme-level token definition ✓ (our @layer slashed.tokens)
- Font weight 100-900 numeric scale ✓

**What we still need:**
- .sf-spin, .sf-pulse, .sf-bounce utility classes

**What we deliberately reject:**
- Utility-first paradigm (we are token-first + layout-first)
- Arbitrary value syntax
- JIT compilation
- HTML-littering class approach

---


## Roadmap

### v0.2 — Foundation Polish (next release)

Focus: Internal consistency + critical missing items

1. **Consume unconsumed tokens** — body-text-wrap, heading-text-wrap, per-heading weights, body-em-style, body-strong-weight, print-base-size (XS effort each)
2. **Add .sr-only-focusable** (XS)
3. **Add .sf-spin class** (XS)
4. **Add blockquote + details/summary + dialog base styling** (S)
5. **Integrate .is-* with forms** (consume --sf-field-border-color) (XS)
6. **Add .print-only class** (XS)
7. **Update architecture.md** (add forms layer) (XS)
8. **Add --sf-divider-* tokens** (S)
9. **Remove textarea resize duplication from forms.css** (XS)

### v0.3 — Build & Test Infrastructure

Focus: Production tooling

1. **Add lightningcss/cssnano for minification** — .min.css bundles (S)
2. **Generate source maps** (S)
3. **Add axe-core a11y test** (S)
4. **Add Firefox + WebKit to test matrix** (S)
5. **Add bundle size reporting + threshold test** (S)
6. **Add input[type="file"] + input[type="range"] to forms** (M)
7. **Add .sf-divider class in layout** (S)
8. **Add animation delay tokens + .sf-stagger** (S)
9. **Add .sf-pulse / sf-ping keyframe** (XS)
10. **Add mask/scrim tokens** (S)
11. **Add forced-colors form border fix** (XS)
12. **Add .no-motion class** (XS)

### v0.4 — Documentation Sprint

Focus: Adoption readiness

1. **Theming guide** (M)
2. **Browser support matrix** (S)
3. **Token reference table** (auto-generate from source) (M)
4. **Layout primitives visual guide** (L)
5. **State documentation** (M)
6. **Dark mode cookbook** (S)
7. **Performance considerations** (S)
8. **Example branded theme file** (S)
9. **Contributing guide** (S)

### v1.0 — Production Release

Prerequisites (all must be green):
- [ ] All CRITICAL and HIGH items resolved
- [ ] Minified bundles shipping
- [ ] axe-core passing on demo.html
- [ ] Cross-browser tests green (Chrome + Firefox + WebKit)
- [ ] Theming guide published
- [ ] Browser support matrix published
- [ ] Token reference published
- [ ] Bundle size < 25KB gzipped (essential)
- [ ] All --sf-* tokens either consumed internally OR documented as BEM API
- [ ] No deprecated aliases remaining without removal timeline
- [ ] CHANGELOG complete with all changes since v0.1.0

---

*End of checklist. Generated from source analysis of all core/*.css, optional/*.css, tests/*.js, scripts/bundle.js, package.json, and docs/ files.*
