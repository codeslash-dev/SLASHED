# SLASHED — Checklist do Dokończenia Frameworka

**Data:** 2026-05-21  
**Scope:** Tylko istniejące warstwy (BEZ nowych komponentów, BEZ utility classes)  
**Benchmark:** Automatic.css v4 + Pico CSS v2  

---

## Który framework jest najbliższy SLASHED?

### Ranking podobieństwa:

| # | Framework | Overlap | Uzasadnienie |
|---|-----------|---------|--------------|
| **1** | **Automatic.css v4** | **~85%** | Variable-first, BEM-first, token system oklch + relative color syntax, fluid spacing/type, no-build, CSS layers, accessibility, container queries. Identyczna filozofia: "dajemy tokeny i prymitywy — ty budujesz BEM." |
| **2** | **Pico CSS v2** | **~55%** | Semantic HTML, CSS custom properties, no-build CDN-ready, dark mode via data-theme + prefers-color-scheme, lightweight. Ale: classless-first, brak fluid tokens, brak layout primitives. |
| **3** | Bulma v1 | ~45% | Modularny, CSS vars, data-theme dark mode. Ale: Sass-based, brak cascade layers, brak fluid tokens, brak oklch. |
| **4** | Semantic UI | ~25% | Zupełnie inne podejście — JS-heavy, Web Components, nie pure-CSS. |

### Dlaczego ACSS jest najbliższy:


SLASHED i Automatic.css dzielą tę samą DNA:
- **Token-first architecture** — konsument buduje własne klasy BEM używając `var(--sf-*)` / `var(--*)`
- **Fluid everything** — spacing i type scale oparte na `clamp()`
- **oklch color space** — z relative color syntax do auto-derivacji
- **No media queries for layout** — container queries + intrinsic design
- **Accessibility-first** — prefers-reduced-motion, focus-visible, touch targets
- **CSS cascade layers** — jawna kontrola kaskady
- **Zero JS runtime** — pure CSS, no build step wymagany

Różnica: ACSS jest zamknięty (płatny, WordPress-only), SLASHED jest open-source i agnostyczny.

### Dlaczego Pico jako drugi benchmark:

Pico reprezentuje "minimalistyczny ideał" — framework który z jednym `<link>` daje gotowy, ładny wynik na semantycznym HTML. SLASHED może się uczyć:
- **Classless base styling** — element-level defaults bez potrzeby klas
- **Elegancja prostoty** — jeden plik = gotowa strona
- **Form styling out-of-box** — natywne elementy wyglądają dobrze bez klas

---

## CHECKLISTА — PODZIELONA NA KATEGORIE

### Legenda:
- ✅ = Mamy, kompletne
- 🟡 = Mamy, ale wymaga dopracowania/uzupełnienia
- ❌ = Brakuje, trzeba dodać
- ⚠️ = Mamy w nadmiarze / do rozważenia usunięcia

---


## 1. WARSTWA: TOKENS (`core/tokens.css` + `core/tokens.layout.css`)

### 1.1 Kolory — Source Tokens

| Element | Status | Notatka |
|---------|--------|---------|
| 6 brand @property tokens (-light) | ✅ | primary, secondary, tertiary, action, neutral, base |
| 5 status @property tokens (-light) | ✅ | success, warning, error, info, danger |
| --sf-is-dark flag @property | ✅ | integer 0/1 |
| Resolved via light-dark() | ✅ | Auto dark-mode derivation |
| Surface hierarchy (bg/surface/well/raised/overlay/inverse) | ✅ | |
| Text hierarchy (text/secondary/muted/placeholder/disabled/inverse/heading) | ✅ | |
| Text-on-color auto-contrast | 🟡 | sign(0.6-l) fails AA Normal dla L≈0.55-0.65 — dodać ostrzeżenie w docs |
| Border tokens (default/subtle/strong/focus/disabled/translucent) | ✅ | |
| Link tokens (link/hover/active/visited/underline/disabled) | ✅ | |
| Interactive bg tokens (hover/active/selected/focus/disabled) | ✅ | |
| Selection & backdrop | ✅ | |
| Status triplets (subtle/muted/strong × 5) | ✅ | |
| Gradients (brand + fades) | ✅ | |
| Shadow tokens (xs→2xl + inner + glow) | ✅ | dark-adaptive via --sf-shadow-strength |
| Text shadows (s/m/l) | ✅ | |
| Drop shadows (s/m/l) | ✅ | |
| Scrollbar tokens | ✅ | |

### 1.2 Kolory — Brakujące

| Element | Status | Benchmark | Notatka |
|---------|--------|-----------|---------|
| --sf-color-accent (7th brand slot) | ❌ | ACSS ma accent | Opcjonalny dodatkowy kolor brandowy dla CTA/highlight |
| Scoped color override API docs | ❌ | ACSS | Dokumentacja jak per-section zmieniać kolory |


### 1.3 Typography Tokens

| Element | Status | Notatka |
|---------|--------|---------|
| Fluid type scale (2xs→4xl) | ✅ | 9 steps |
| Display sizes (s/m/l) | ✅ | 3 steps |
| Font families (body/heading/display/mono) | ✅ | |
| Bonus stacks (humanist/geometric/slab) | ✅ | |
| Font weights (full 100-900 numeric) | ✅ | thin→black |
| Semantic weight aliases (body/heading/display) | ✅ | |
| Line heights (tight/snug/normal/relaxed) | ✅ | |
| Letter spacing (tight/normal/wide/wider/widest) | ✅ | |
| H1-H6 size/lh/weight/tracking aliases | ✅ | Pełne per-heading control |
| Body typography aliases | ✅ | |
| --sf-font-features token | ✅ | Default: normal |
| --sf-font-variation token | ✅ | Default: normal |
| --sf-optical-sizing token | ✅ | Default: auto |
| Icon sizes (xs→xl) | ✅ | |
| Measure / prose max-width | ✅ | --sf-container-prose: 65ch |

### 1.4 Spacing Tokens

| Element | Status | Notatka |
|---------|--------|---------|
| Fluid spacing (2xs→4xl) | ✅ | 9 steps |
| Scale multiplier (--sf-space-scale) | ✅ | |
| Gutter token | ✅ | --sf-space-gutter |
| Section padding (s/m/l/xl) | ✅ | |
| BEM consumer aliases (gap/content-gap/component-pad/field-block) | ✅ | |
| Fixed spacing (none/px) | ✅ | |

### 1.5 Sizing & Containers

| Element | Status | Notatka |
|---------|--------|---------|
| UI sizes (xs→xl) | ✅ | 5 steps, good for buttons/inputs |
| Container widths (narrow/prose/default/wide/full) | ✅ | |
| Aspect ratios (square/video/cinema/photo/portrait/golden) | ✅ | |


### 1.6 Border & Radius Tokens

| Element | Status | Notatka |
|---------|--------|---------|
| Border widths (hairline/1/2/3/4) | ✅ | |
| Radius scale (none/xs→4xl/full) | ✅ | 10 steps, scalable via --sf-radius-scale |
| Stroke widths (thin/regular/bold/heavy) | ✅ | |

### 1.7 Shadow & Effects Tokens

| Element | Status | Notatka |
|---------|--------|---------|
| Box shadows (none/xs→2xl/inner/glow) | ✅ | 9 values, dark-adaptive |
| Text shadows (s/m/l) | ✅ | |
| Drop shadows (s/m/l) | ✅ | |
| Blur scale (xs→xl) | ✅ | 5 steps |
| Perspective (near/normal/far) | ✅ | |
| Opacity scale (0/10/25/50/75/100) | ✅ | |
| --sf-opacity-disabled | ✅ | |

### 1.8 Motion & Easing Tokens

| Element | Status | Notatka |
|---------|--------|---------|
| Duration scale (none/instant/fast/normal/slow/slower) | ✅ | 6 steps, scalable via --sf-motion-scale |
| Easing functions (linear/out/in/in-out/spring/elastic/bounce/overshoot) | ✅ | 8 easings incl. linear() |
| Animation presets (fade-in/out, slide-×4, scale-up/down, color-pulse) | ✅ | 9 presets |
| Transition shorthands (all/colors/transform/opacity/shadow) | ✅ | |
| Transition timing (fast/slow/enter/exit) | ✅ | |
| Legacy alias --sf-transition-base | ⚠️ | Deprecated, usunąć po v1.x |
| Scroll-driven animation range tokens | ✅ | |

### 1.9 Z-index & Layout Tokens

| Element | Status | Notatka |
|---------|--------|---------|
| Z-index scale (below/base/raised/low/mid/high/top/max) | ✅ | 8 named values |
| Header height | ✅ | --sf-header-height |
| Sticky offset | ✅ | |
| Focus ring tokens (width/offset/style/color/shadow) | ✅ | |
| Touch target size | ✅ | |
| Safe area insets (top/bottom/left/right) | ✅ | env() based |

### 1.10 Print Tokens

| Element | Status | Notatka |
|---------|--------|---------|
| Page margin | ✅ | |
| Page size | ✅ | |
| Print base font size | ✅ | |


### 1.11 Layout Tokens (`tokens.layout.css`)

| Element | Status | Notatka |
|---------|--------|---------|
| Stack gap | ✅ | |
| Box padding/border | ✅ | |
| Center max/gutter | ✅ | |
| Cluster gap/align/justify | ✅ | |
| Sidebar gap/min-width/width-default | ✅ | |
| Switcher threshold/gap | ✅ | |
| Grid min/gap + size variants (xs→xl) | ✅ | |
| Cover min-height/padding | ✅ | |
| Frame ratio | ✅ | |
| Reel item-width/gap/height | ✅ | |
| Imposter margin | ✅ | |
| Bento cols/row/gap | ✅ | |
| Content grid breakout/content widths | ✅ | |
| Prose paragraph spacing | ✅ | |

### 1.12 Tokens — Brakujące / Do uzupełnienia

| Element | Status | Benchmark | Priorytet |
|---------|--------|-----------|-----------|
| --sf-divider token (shorthand border) | ❌ | ACSS var(--divider) | Niski |
| --sf-text-decoration-thickness | ❌ | Pico | Niski |
| --sf-outline-offset (beyond focus) | ❌ | - | Niski |
| Komentarz deprecation --sf-transition-base | 🟡 | - | Średni — dodać @deprecated JSDoc-style |

---

## 2. WARSTWA: RESET (`core/reset.css`)

| Element | Status | Benchmark | Notatka |
|---------|--------|-----------|---------|
| Universal box-sizing | ✅ | Oba | |
| Margin/padding zero | ✅ | Oba | |
| text-size-adjust | ✅ | Pico | |
| scroll-padding-top | ✅ | - | Unikalny dla SLASHED |
| scrollbar-gutter: stable | ✅ | - | Unikalny |
| color-scheme inheritance | ✅ | Pico | |
| hanging-punctuation | ✅ | - | Nice touch |
| interpolate-size opt-in | ✅ | - | Nowoczesne, progressive |
| body min-height 100dvh | ✅ | Pico | |
| body min-inline-size 320px | ✅ | - | |
| List style reset | ✅ | Oba | |
| Media elements block + max-width | ✅ | Oba | |
| iframe/embed reset | ✅ | - | |
| Form font inheritance | ✅ | Oba | |
| button text-transform none | ✅ | - | |
| fieldset/legend reset | ✅ | - | |
| touch-action manipulation | ✅ | - | |
| summary cursor pointer | ✅ | Pico | |
| textarea resize vertical | ✅ | - | |
| table border-collapse | ✅ | Oba | |
| [hidden] enforcement | ✅ | Oba | |
| dialog/[popover] reset | ✅ | - | Unikalny |
| [inert] cursor | ✅ | - | |


### 2.1 Reset — Brakujące

| Element | Status | Benchmark | Priorytet |
|---------|--------|-----------|-----------|
| search element reset | ❌ | Pico | Niski — nowy HTML element |
| ::file-selector-button pełny reset | 🟡 | Pico | Niski — mamy font:inherit |
| hr reset w reset.css (nie base.css) | 🟡 | - | Kosmetyczne — hr styling jest w base |

**Werdykt:** Reset jest kompletny i na najwyższym poziomie. Nic krytycznego nie brakuje.

---

## 3. WARSTWA: BASE (`core/base.css`)

| Element | Status | Notatka |
|---------|--------|---------|
| Body defaults (font/color/bg) | ✅ | Wszystko via var() |
| Headings (h1-h6) full styling | ✅ | family/weight/lh/color/text-wrap/scroll-margin |
| Paragraph (text-wrap: pretty, orphans/widows) | ✅ | |
| Strong/bold weight | ✅ | |
| Small font-size | ✅ | |
| Mark styling | ✅ | |
| Abbr[title] | ✅ | |
| Kbd/samp mono | ✅ | |
| Sub/sup positioning | ✅ | |
| Links full state cycle (link/hover/visited/active) | ✅ | |
| Code inline styling | ✅ | |
| Pre/code block styling | ✅ | |
| SVG fill: currentcolor | ✅ | |
| Hr via border-block-start + token | ✅ | |
| :target scroll-margin | ✅ | |
| ::selection styling | ✅ | |
| th/caption text-align: start | ✅ | |
| address/cite/dfn/var font-style normal | ✅ | |
| Input caret-color & accent-color | ✅ | |
| ::backdrop | ✅ | |
| ::placeholder opacity fix | ✅ | |


### 3.1 Base — Brakujące / Do rozważenia

| Element | Status | Benchmark | Priorytet |
|---------|--------|-----------|-----------|
| Classless form styling (input/select/textarea/button bez klas) | ❌ | Pico (core feature) | **WYSOKI** — Pico daje piękne formy bez żadnej klasy |
| Classless table styling (thead/tbody/td) | ❌ | Pico | Średni |
| details/summary base styling | ❌ | Pico | Średni — mamy reset ale brak visual styling |
| progress element styling | ❌ | Pico | Niski |
| meter element styling | ❌ | Pico | Niski |
| blockquote visual styling | ❌ | Pico | Średni — mamy w .sf-prose ale nie globalnie |
| figure/figcaption base styling | ❌ | Pico | Niski — mamy w .sf-prose |
| dialog base styling (non-component) | ❌ | Pico | Niski — deferred do components |

> **UWAGA:** To jest największa różnica vs Pico. Pico daje "piękne defaults" na surowym HTML. SLASHED wymaga klas. Rozważ opcjonalny `core/classless.css` lub rozbudowę base.css o element-level form/table styling.

---

## 4. WARSTWA: THEMES (`core/themes.css`)

| Element | Status | Notatka |
|---------|--------|---------|
| @media (prefers-color-scheme: dark) | ✅ | :root:not([data-theme]) |
| [data-theme="light"] | ✅ | |
| [data-theme="dark"] | ✅ | |
| Scoped per-element theming | ✅ | Dowolny element |
| --sf-is-dark flag flip | ✅ | |
| color-scheme flip | ✅ | |

### 4.1 Themes — Brakujące

| Element | Status | Benchmark | Priorytet |
|---------|--------|-----------|-----------|
| [data-theme="auto"] explicit selector | ❌ | ACSS | Niski — domyślne zachowanie już jest auto |
| Branded theme example / docs | ❌ | ACSS | Średni — potrzeba example theme file |
| Multi-brand theme tokens (--sf-brand-*) | ❌ | ACSS | Niski — architektura na to pozwala |
| Theme transition (smooth color switch) | ❌ | Pico | Niski — może być opt-in w motion |

**Werdykt:** Themes layer jest kompletny i elegancki. Tylko dokumentacja/przykłady do dodania.

---


## 5. WARSTWA: LAYOUT (`core/layout.css`)

### 5.1 Prymitywy — Stan

| Prymityw | Status | Modyfikatory | Notatka |
|----------|--------|-------------|---------|
| .sf-section | ✅ | s/m/l/xl | + section-group |
| .sf-container | ✅ | narrow/prose/wide/full | Named container `sf-layout` |
| .sf-stack | ✅ | 2xs→3xl + center/end/stretch | |
| .sf-box | ✅ | - | Via tokens override |
| .sf-center | ✅ | --intrinsic | |
| .sf-cluster | ✅ | 2xs→xl + no-wrap/center/end/between | |
| .sf-sidebar | ✅ | --right + narrow/wide | |
| .sf-switcher | ✅ | --no-wrap/--vertical | |
| .sf-grid (auto-fill) | ✅ | --fit + xs→xl | |
| .sf-cover | ✅ | --min/--max/--padding-s/--padding-l | + __center child |
| .sf-frame | ✅ | square/video/cinema/portrait/4-3/3-2/golden | |
| .sf-reel | ✅ | - | Scroll-snap |
| .sf-imposter | ✅ | --fixed/--contain | |
| .sf-alternate | ✅ | - | Named container `sf-alternate` |
| .sf-pancake | ✅ | - | Sticky footer grid |
| .sf-grid-1/2/3/4/6 | ✅ | - | CQ responsive |
| .sf-grid-1-2/2-1/1-3/3-1 | ✅ | - | Ratio grids |
| .sf-content-grid | ✅ | - | Breakout pattern |
| .sf-bento | ✅ | --2/--4/--compact/--tall | CQ responsive |
| .sf-subgrid / .sf-subgrid-rows | ✅ | - | |
| .sf-prose | ✅ | - | + .sf-not-prose reset |
| .sf-breakout / .sf-full-bleed | ✅ | - | Children of content-grid |

### 5.2 Layout — Brakujące

| Element | Status | Benchmark | Priorytet |
|---------|--------|-----------|-----------|
| .sf-grid--masonry (CSS masonry) | ❌ | - | Niski — spec jeszcze nie finalna |
| .sf-wrap (flex-wrap container bez gap) | ❌ | ACSS | Niski — sf-cluster pokrywa |
| .sf-auto-grid responsive columns token | 🟡 | ACSS | Niski — mamy sf-grid-* |
| .sf-divider / .sf-separator (visual hr) | ❌ | ACSS divider system | Średni |
| .sf-aspect (standalone aspect-ratio class) | ❌ | - | Niski — sf-frame pokrywa |
| .sf-sidebar responsive breakpoint control | 🟡 | ACSS | Niski — flex-basis trick działa |

**Werdykt:** Layout layer jest WYJĄTKOWY — 16+ prymitywów to więcej niż jakikolwiek inny framework. Kompletny.

---


## 6. WARSTWA: STATES (`core/states.css`)

### 6.1 Stany — Stan aktualny

| Kategoria | Klasy | Status |
|-----------|-------|--------|
| Visibility | .is-hidden, .is-invisible, .is-visible | ✅ |
| Interactivity | .is-disabled, .is-readonly | ✅ |
| Loading | .is-loading, .is-busy, .is-skeleton | ✅ |
| Active/Selection | .is-active, .is-selected, .is-current, .is-highlighted | ✅ |
| Disclosure | .is-open, .is-collapsed, .is-expanded | ✅ |
| Validation | .is-valid, .is-invalid, .is-warning, .is-success, .is-error, .is-info, .is-danger | ✅ |
| Position | .is-sticky, .is-pinned, .is-fixed | ✅ |
| Overflow | .is-clipped, .is-scrollable, .is-truncated | ✅ |
| Drag & Drop | .is-dragging, .is-drop-target, .is-draggable | ✅ |
| Overlay | .is-overlay | ✅ |
| Interaction | .is-clickable, .is-unselectable | ✅ |
| Empty state | .is-empty | ✅ |

### 6.2 States — Brakujące

| Element | Status | Benchmark | Priorytet |
|---------|--------|-----------|-----------|
| .is-focused (programmatic focus indicator) | ❌ | ACSS | Średni |
| .is-pressed (aria-pressed visual) | ❌ | - | Niski |
| .is-pending (async operation, distinct from loading) | ❌ | - | Niski |
| .is-offline / .is-stale (connectivity state) | ❌ | - | Niski |
| .is-transitioning (mid-transition marker) | ❌ | - | Niski |
| .is-fullscreen | ❌ | - | Niski |
| .is-resizable | ❌ | - | Niski |

**Werdykt:** States layer jest bardzo dobrze rozbudowany — 30+ stanów. Jedyny istotny brak to .is-focused.

---

## 7. WARSTWA: MOTION (`core/motion.css`)

| Element | Status | Notatka |
|---------|--------|---------|
| smooth scroll (no-preference gated) | ✅ | |
| focus-within scroll-behavior: auto | ✅ | Andy Bell pattern |
| Broad transition for interactive elements | ✅ | Full property list |
| View transition support (@supports) | ✅ | |
| Animation opt-in classes (8 presets) | ✅ | fade/slide/scale |
| Keyframes (8 + spin + shimmer + color-pulse) | ✅ | 11 total |
| @property color interpolation demo | ✅ | .sf-color-pulse |
| prefers-reduced-motion gating | ✅ | |

### 7.1 Motion — Brakujące

| Element | Status | Benchmark | Priorytet |
|---------|--------|-----------|-----------|
| .sf-spin (standalone spinning class) | ❌ | ACSS | Średni — keyframe exists, brak klasy |
| .sf-pulse (pulsing opacity class) | ❌ | Tailwind animate-pulse | Niski |
| .sf-bounce (bouncing class) | ❌ | Tailwind animate-bounce | Niski |
| Scroll-driven animation utility classes | ❌ | - | Niski — tokens exist, brak klas |
| @starting-style patterns | ❌ | - | Deferred do components |
| Animation delay utilities (--delay token) | ❌ | ACSS | Średni |
| Animation stagger pattern (.sf-stagger) | ❌ | ACSS effects | Średni |

**Werdykt:** Motion jest solidny. Brakuje ~3 dodatkowych klas pomocniczych i delay/stagger pattern.

---


## 8. WARSTWA: ACCESSIBILITY (`core/accessibility.css`)

| Element | Status | Notatka |
|---------|--------|---------|
| :focus-visible ring | ✅ | !important hardened |
| :focus:not(:focus-visible) hide | ✅ | |
| prefers-reduced-motion (full nuke) | ✅ | !important on animation/transition |
| prefers-contrast: more (ring thickens) | ✅ | |
| prefers-reduced-transparency | ✅ | ::backdrop |
| Touch targets (44px on coarse pointer) | ✅ | |
| [disabled]/[aria-disabled] cursor | ✅ | |
| .sr-only / .visually-hidden | ✅ | !important atomic, overflow: clip |
| .skip-link | ✅ | Themed, positioned |
| @media (forced-colors: active) | ✅ | Ring + shadow removal |

### 8.1 Accessibility — Brakujące

| Element | Status | Benchmark | Priorytet |
|---------|--------|-----------|-----------|
| .sr-only-focusable (visible on focus) | ❌ | Bootstrap/ACSS | **WYSOKI** — potrzebne do skip-link wariantów |
| ARIA live region helper (.aria-live-polite/assertive) | ❌ | - | Niski — to JS territory |
| prefers-color-scheme: dark a11y adjustments | 🟡 | - | Niski — handled by token system |
| High contrast mode border visibility enforcement | 🟡 | - | Niski — forced-colors ma basic support |
| Reduced data preference (@media prefers-reduced-data) | ❌ | - | Niski — spec wciąż draft |
| .no-motion class (manual override, nie OS) | ❌ | ACSS | Średni |

**Werdykt:** Accessibility jest best-in-class. Jedyny realny brak to .sr-only-focusable.

---

## 9. WARSTWA: PRINT (`core/print.css`)

| Element | Status | Notatka |
|---------|--------|---------|
| @page rule with tokens | ✅ | |
| Shadow removal (bez !important) | ✅ | Consumer can override |
| Link URL expansion | ✅ | Excludes # and javascript: |
| abbr[title] expansion | ✅ | |
| break-inside: avoid (media, tables) | ✅ | |
| thead display: table-header-group | ✅ | |
| Heading break-after: avoid + orphans/widows | ✅ | |
| pre/blockquote border (token-based) | ✅ | Fixed: now uses var() |
| Hide list (nav/aside/button/input...) | ✅ | !important justified |
| details print preservation | ✅ | |
| .print-color-exact | ✅ | |
| .print-no-color | ✅ | Opt-in blanket reset |

### 9.1 Print — Brakujące

| Element | Status | Benchmark | Priorytet |
|---------|--------|-----------|-----------|
| .print-only (show only in print) | ❌ | Bootstrap | Średni |
| .no-print (mamy hide list, ale nie explicit class) | 🟡 | Oba | Średni — `.no-print` jest w hide-list ale nie docs'd standalone |
| @page named pages support | ❌ | - | Niski — advanced print |
| Print font-size override (use --sf-print-base-size) | 🟡 | - | Średni — token exists, not consumed |
| page-break-before utility for sections | ❌ | - | Niski |

**Werdykt:** Print jest wyjątkowo kompletny. Drobne braki: .print-only class i konsumpcja --sf-print-base-size.

---


## 10. WARSTWA: LEGACY (`optional/legacy.css`)

| Element | Status | Notatka |
|---------|--------|---------|
| dvh fallback (Safari 15.0-15.3) | ✅ | @supports not (height: 100dvh) |
| :focus-visible fallback | ✅ | @supports not selector(:focus-visible) |
| scrollbar-gutter fallback | ✅ | @supports not (scrollbar-gutter: stable) |
| accent-color documented gap | ✅ | Intentional no-op |

**Werdykt:** Legacy jest kompletny dla zadeklarowanego floor'u. Nic do dodania.

---

## 11. WARSTWA: PALETTE (`optional/tokens.palette.css`)

| Element | Status | Notatka |
|---------|--------|---------|
| Numeric scale 50-950 (per brand color × 6) | ✅ | 11 steps each |
| Alpha variants a5-a95 (per brand × 6) | ✅ | 11 steps each |
| Shade aliases (superlight→superdark) | ✅ | |
| Functional aliases (hover/active/subtle/muted/ghost) | ✅ | |
| color-mix(in oklab) — no hue drift | ✅ | |
| Base color V-shaped ramp (documented) | ✅ | |

**Werdykt:** Palette jest w pełni kompletna i dobrze udokumentowana.

---

## 12. DOKUMENTACJA & DX

| Element | Status | Priorytet | Notatka |
|---------|--------|-----------|---------|
| README.md | ✅ | - | Quick start, bundles, customization |
| docs/architecture.md | ✅ | - | Layer order, specificity, extension points |
| docs/demo.html | 🟡 | **WYSOKI** | Brakuje demonstracji ~50% klas (patrz F-14 w audycie) |
| Inline @layer JSDoc-style comments | ✅ | - | Wszystkie pliki mają headers |
| CHANGELOG.md | ✅ | - | Auto-generated |
| Browser support section | ✅ | - | Corrected floor |

### 12.1 Dokumentacja — Brakujące

| Element | Status | Benchmark | Priorytet |
|---------|--------|-----------|-----------|
| **demo.html completeness** — brakujące sekcje: | ❌ | Oba | **WYSOKI** |
| → sf-alternate demo | ❌ | | |
| → sf-imposter demo | ❌ | | |
| → sf-subgrid demo | ❌ | | |
| → sf-section-group demo | ❌ | | |
| → sf-pancake demo | ❌ | | |
| → sf-cover modifiers demo | ❌ | | |
| → sf-scale-down demo | ❌ | | |
| → All .is-* states demo (28 brakujących) | ❌ | | |
| → sf-grid-1, ratio grids demo | ❌ | | |
| → sf-content-grid demo | ❌ | | |
| Theming guide (how to rebrand) | ❌ | ACSS docs | **WYSOKI** |
| Per-section theming example | ❌ | ACSS | Średni |
| Migration guide from other frameworks | ❌ | Bulma, Pico | Niski |
| Token reference table (all --sf-* listed) | ❌ | ACSS dashboard | Średni |
| Dark mode cookbook | ❌ | Pico docs | Średni |
| Layout primitives visual guide | ❌ | ACSS | Średni |
| Performance considerations doc | ❌ | - | Niski |


---

## 13. BUILD & DISTRIBUTION

| Element | Status | Notatka |
|---------|--------|---------|
| bundle.config.json | ✅ | 2 bundles defined |
| scripts/bundle.js | ✅ | Concatenation-based |
| dist/slashed.essential.css | ✅ | |
| dist/slashed.full.css | ✅ | |
| Stylelint config | ✅ | |
| Playwright tests | ✅ | Token regression |
| CI workflow | ✅ | |
| Release workflow (release-it) | ✅ | |
| Conventional commits + commitlint | ✅ | |
| Git hooks (pre-commit, commit-msg) | ✅ | |

### 13.1 Build — Brakujące

| Element | Status | Benchmark | Priorytet |
|---------|--------|-----------|-----------|
| Minified bundle (.min.css) | ❌ | Oba | **WYSOKI** — standard dla CDN |
| Gzip/Brotli size reporting | ❌ | - | Średni |
| Individual file CDN imports (unpkg/jsdelivr) | ❌ | Pico | Średni |
| npm publish configuration (main/exports) | 🟡 | Pico | Średni — package.json brakuje "main"/"exports" |
| Source map generation | ❌ | - | Niski |
| Bundle size badge w README | ❌ | Pico | Niski |
| Version banner in built files | ❌ | Bulma | Niski |

---

## 14. TESTY & QA

| Element | Status | Notatka |
|---------|--------|---------|
| Token regression (light + dark) | ✅ | tokens.spec.js |
| Layer order test | ✅ | layers.spec.js |
| Coverage spec | ✅ | coverage.spec.js |
| Print spec | ✅ | print.spec.js |
| Visual regression (demo) | ✅ | demo-visual.spec.js |
| Playwright config | ✅ | |

### 14.1 Testy — Brakujące

| Element | Status | Priorytet | Notatka |
|---------|--------|-----------|---------|
| Accessibility audit test (axe-core) | ❌ | **WYSOKI** | Automated WCAG compliance |
| Container query breakpoint tests | ❌ | Średni | Verify CQ triggers correctly |
| States visual test | ❌ | Średni | All .is-* states rendering |
| Motion/animation test (reduced-motion) | ❌ | Średni | Verify animations disabled |
| Legacy fallback test (feature detection) | ❌ | Niski | |
| Print rendering test | 🟡 | Niski | Mamy basic, ale nie comprehensive |
| Cross-browser matrix (Safari/Firefox) | ❌ | Średni | Currently Chromium only |


---

## 15. CO MAMY W NADMIARZE (⚠️)

| Element | Plik | Problem | Rekomendacja |
|---------|------|---------|--------------|
| --sf-transition-base (deprecated alias) | tokens.css | Duplikat --sf-transition-all | Usunąć po v1.x, dodać migration note |
| .is-error + .is-invalid (overlap) | states.css | Oba robią to samo (error border) | Udokumentować: .is-invalid = form, .is-error = generic |
| .is-danger + .is-error (overlap) | states.css | Subtlenie: danger=destructive action, error=validation | Udokumentować rozróżnienie |
| .is-open + .is-expanded (overlap) | states.css | Semantycznie identyczne | Udokumentować: open=disclosure, expanded=accordion |
| .is-collapsed (inverse of expanded) | states.css | Czy potrzebne skoro mamy :not(.is-expanded)? | Zachować — JS convenience |
| 6 container sizes vs 5 w tokens | layout.css | narrow/prose/default/wide/full — overkill? | Zachować — different use cases |

---

## 16. SPÓJNOŚĆ WEWNĘTRZNA (BUGS/ISSUES Z AUDYTU)

| Issue | Status | Plik | Fix |
|-------|--------|------|-----|
| F-06: sign(0.6-l) contrast ~4.2:1 dla L≈0.55 | 🟡 | tokens.css | Obniżyć --sf-color-tertiary-light L do ≤0.48 LUB podnieść threshold do 0.55 |
| F-09: --sf-color-text--inverse clamp floor za wysoki | 🟡 | tokens.css | Zmienić clamp(0.70,...) na clamp(0.85,...) |
| F-07: sf-spin/sf-shimmer keyframes w motion vs states | 🟡 | states.css/motion.css | OK — dokumentacja wyjaśnia dependency |
| F-10: Anonymous CQ can match wrong container | 🟡 | layout.css | Documented — intended behavior |
| F-13: --sf-transition-all performance | 🟡 | tokens.css | Mamy już scoped tokens, dodać deprecation warning |
| F-14: Demo incomplete | ❌ | docs/demo.html | Dodać brakujące sekcje |
| --sf-print-base-size declared but never consumed | 🟡 | tokens.css/print.css | Dodać `body { font-size: var(--sf-print-base-size) }` w @media print |

---


---

## 17. PRIORYTETOWA LISTA IMPLEMENTACJI (TOP 20)

Ranking bazowany na: impact × effort × benchmark-parity

| # | Zadanie | Kategoria | Priorytet | Effort | Benchmark |
|---|---------|-----------|-----------|--------|-----------|
| 1 | **Minified bundle (.min.css)** | Build | KRYTYCZNY | XS | Oba |
| 2 | **demo.html — uzupełnić brakujące ~50% klas** | Docs | KRYTYCZNY | L | - |
| 3 | **Classless form styling w base.css** | Base | WYSOKI | M | Pico |
| 4 | **.sr-only-focusable class** | A11y | WYSOKI | XS | Bootstrap/ACSS |
| 5 | **Theming guide doc** | Docs | WYSOKI | M | ACSS |
| 6 | **npm package exports (main/module/exports)** | Build | WYSOKI | XS | Pico |
| 7 | **axe-core accessibility test** | Tests | WYSOKI | S | - |
| 8 | **Fix: --sf-color-tertiary-light L≤0.48** (WCAG AA) | Tokens | WYSOKI | XS | - |
| 9 | **Fix: --sf-color-text--inverse clamp widening** | Tokens | ŚREDNI | XS | - |
| 10 | **Consume --sf-print-base-size in print.css** | Print | ŚREDNI | XS | - |
| 11 | **.print-only class** | Print | ŚREDNI | XS | Bootstrap |
| 12 | **.sf-spin standalone class** | Motion | ŚREDNI | XS | ACSS |
| 13 | **Animation delay/stagger tokens** | Motion | ŚREDNI | S | ACSS |
| 14 | **.is-focused state class** | States | ŚREDNI | XS | ACSS |
| 15 | **.no-motion manual override class** | A11y | ŚREDNI | XS | ACSS |
| 16 | **Classless table styling** | Base | ŚREDNI | S | Pico |
| 17 | **details/summary base visual styling** | Base | ŚREDNI | S | Pico |
| 18 | **Token reference table doc** | Docs | ŚREDNI | M | ACSS |
| 19 | **.sf-divider layout primitive** | Layout | ŚREDNI | S | ACSS |
| 20 | **Cross-browser test matrix** | Tests | ŚREDNI | M | - |

---

## 18. PODSUMOWANIE STANU FRAMEWORKA

### Kompletność per warstwa:

| Warstwa | Kompletność | Komentarz |
|---------|-------------|-----------|
| **Tokens** | 98% | Najlepsza w branży. Brak: accent color, divider token |
| **Reset** | 99% | Praktycznie idealny |
| **Base** | 75% | Brak classless form/table — główna przewaga Pico |
| **Themes** | 95% | Kompletny mechanizm, brak docs/examples |
| **Layout** | 99% | Best-in-class, 16+ prymitywów |
| **States** | 95% | 30+ stanów, brak .is-focused |
| **Motion** | 88% | Solidny, brak spin/pulse/stagger klas |
| **Accessibility** | 93% | Best-in-class, brak .sr-only-focusable |
| **Print** | 90% | Bardzo dobry, brak .print-only + unused token |
| **Legacy** | 100% | Kompletny |
| **Palette** | 100% | Kompletny |
| **Docs** | 60% | demo.html niekompletny, brak guides |
| **Build/DX** | 75% | Brak minification, npm exports |
| **Tests** | 70% | Brak axe-core, cross-browser |

### Ogólna gotowość: **~85%** (bez components/utilities)

Framework jest architektonicznie kompletny i na najwyższym poziomie technicznym.
Główne luki to: DX (docs, demo, build), a nie architektura.
