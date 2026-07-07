# SLASHED — Architecture

## Layer order

Declared once in `core/layers.css`:

```css
@layer
  slashed.tokens,
  slashed.reset,
  slashed.base,
  slashed.forms,
  slashed.layout,
  slashed.components,
  slashed.macros,
  slashed.utilities,
  slashed.states,
  slashed.themes,
  slashed.motion,
  slashed.accessibility,
  slashed.print,
  slashed.legacy,
  slashed.overrides;
```

Priority increases left → right. Unlayered consumer CSS beats all layers. `slashed.overrides` ships empty. `slashed.legacy` is for backward-compatibility fallbacks and sits just below `slashed.overrides` so user overrides always win.

`slashed.macros` sits between `components` and `utilities`. Macros may compose with primitives and components, but a single-property utility still wins on the same selector.

---

## File structure

```text
core/
  layers.css                   @layer declaration only
  tokens.css                   slashed.tokens
  tokens.layout.css            slashed.tokens  (semantic layout tokens)
  tokens.macros.css     slashed.tokens  (semantic macro tokens)
  reset.css                    slashed.reset
  base.css                     slashed.base
  themes.css                   slashed.themes
  layout.css                   slashed.layout
  macros.css            slashed.macros  (recipes / patterns)
  states.css                   slashed.states
  motion.css                   slashed.motion
  accessibility.css            slashed.accessibility
  print.css                    slashed.print
optional/
  tokens.components.css   slashed.tokens  (component tokens for btn + card)
  theme-example.css       slashed.themes  (copy-and-customise rebrand example; not bundled)
  forms.css               slashed.forms  (classless native form-control styling)
  components.css          slashed.components  (btn + card — the only two components)
  utilities.css           slashed.utilities  (curated subset active — heading/text-size/hover/list-reset/marker/selection/sticky)
  legacy.css              slashed.legacy
```

`optional/components.css` and `optional/tokens.components.css` ship exactly two
components — `.sf-btn` and `.sf-card`, live since v0.7.0. These are the only
components SLASHED carries: the framework stays BEM-first and token-first and
does not maintain a broad component library. See [`docs/components.md`](components.md)
for the component reference.

`optional/utilities.css` ships a curated subset — the heading (`.sf-h1`–`.sf-h6`),
text-size (`.sf-text-*`), hover-transform (`.sf-hover-*`), list-reset,
marker-colour, alternate-selection, and sticky helpers are active; the rest stay
commented out. SLASHED is BEM-first by design, so it ships only this curated
subset of utility classes in 0.x.

---

## Class taxonomy

Every shipped class falls into exactly one of seven categories. The
category answers a single question for the consumer; this is the
decision tree to use when adding a new class.

| # | Category | Question it answers | File | Layer |
|---|---|---|---|---|
| 1 | **Layout primitives** | "How are children arranged?" | `core/layout.css` | `slashed.layout` |
| 2 | **Macro-classes** *(recipes)* | "What does this element DO / look like?" | `core/macros.css` | `slashed.macros` |
| 3 | **Animation primitives** | "How does this element move?" | `core/motion.css` | `slashed.motion` |
| 4 | **State utilities** *(`.sf-is-*`)* | "What state is this element in?" | `core/states.css` | `slashed.states` |
| 5 | **A11y utilities & patterns** | "How does this work for AT users?" | `core/accessibility.css` | `slashed.accessibility` |
| 6 | **Print utilities** *(`.print-*`)* | "How does this print?" | `core/print.css` | `slashed.print` |
| 7 | **Components** *(opt-in)* | "Pre-built visual block." | `optional/components.css` | `slashed.components` |

### Decision tree for adding a new class

```text
1. Does it answer "where do my children go?"
   YES → core/layout.css                 (slashed.layout)
   NO  → step 2

2. Does it modify an element's runtime state?
      (hover, active, disabled, loading…)
   YES → core/states.css (.sf-is-*/.sf-has-*)  (slashed.states)
   NO  → step 3

3. Is it an a11y pattern or a11y utility?
      (sr-only, sf-focus-parent, clickable-parent…)
   YES → core/accessibility.css          (slashed.accessibility)
   NO  → step 4

4. Is it a single-property animation trigger?
   YES → core/motion.css                 (slashed.motion)
   NO  → step 5

5. Is it an opinionated visual component?
      (button, card, alert…)
   YES → optional/components.css         (slashed.components)
   NO  → core/macros.css          (slashed.macros)  ← default
```

Macros are the default fallback for behavioural/visual recipes that aren't
layout, state, a11y, animation, or component.

### Layout primitives vs macros

| Test | Primitive | Macro / recipe |
|---|---|---|
| Used as the only class on an element? | Often (`<ul class="sf-cluster">`) | Rarely — usually composed (`class="card sf-clickable-parent"`) |
| Defines arrangement of children? | Yes (display, gap, grid-template) | Sometimes, but secondary |
| Has tokenised knobs (`--sf-X-gap` etc.)? | Yes, central to the API | Sometimes — minimal |
| Touches pseudo-elements / states? | Rarely | Often (`::after`, `:hover`, `:focus-within`) |
| Container queries inside? | Often | Rarely |
| Sole responsibility | "Where do my children go?" | "What does this DO / look like?" |

Heuristic: a primitive is a *noun* (a stack, a grid); a macro is a *verb*/adjective
(clickable, scrollable, prose).

Two conceptually-macro classes stay in `layout.css` in 0.x for compatibility:

- `.sf-content-grid` / `.sf-breakout` / `.sf-full-bleed` — article-with-breakouts;
  layout-first because the rule defines a grid.
- `.sf-icon` (and `.sf-icon--xs..xl..boxed`) — graphical primitive reached for as
  a single class.

---

## Layers

**slashed.tokens** — custom properties only, `:root` only. No element rules. All values consumers might override are tokens. Spread across multiple files: `tokens.css` (core — brand/status/semantic/numeric palette/alpha tokens), `tokens.layout.css` (layout primitives), `tokens.macros.css` (macros), and `tokens.components.css` (optional component-level tokens).

**slashed.reset** — browser normalization. Minimal `var()` usage (only with hardcoded fallbacks for critical layout values like `scroll-padding-top`).

**slashed.base** — element defaults, all values via `var()`. A minimal,
readable foundation for flow and inline text — **not** a classless UI kit.
SLASHED is BEM-first: the token API is the product, and the base holds the
line at three tiers:

- *Global base* — flow/inline readability: headings, `p`, `a`, `code`,
  `pre`, `mark`, `hr`, `sub`/`sup`, `abbr`, `::selection`.
- *Rich blocks* (`table`, `blockquote`, `figure`, `dl`) — styled **only
  inside `.sf-prose`** (a macro-class), never globally.
- *Interactive widgets* (`dialog`, `details`, `progress`, `meter`) —
  consumer/component territory (the opt-in `slashed.components` layer);
  `core` carries reset-level normalization only.

Native form controls are out of base entirely — they live in the opt-in
`slashed.forms` layer.

**slashed.forms** — opt-in classless styling for native form controls
(`input`, `select`, `textarea`, `button`, checkbox/radio, `fieldset`,
`label`) from `optional/forms.css`. Element-level only, no classes. Reads
`--sf-field-border-color` so the `.sf-is-*` validation states in
`slashed.states` recolour fields. Skip the file entirely if you prefer full
BEM control.

**slashed.layout** — layout primitives: `.sf-stack`, `.sf-cluster`, `.sf-sidebar`, `.sf-cover`, `.sf-grid`, `.sf-container`, `.sf-content-grid`, `.sf-icon`, etc. Layout tokens declared in `tokens.layout.css`, overridable per-instance via `style="--sf-stack-gap: …"`.

**slashed.components** — UI blocks: `.sf-btn` and `.sf-card`, live since v0.7.0.
These are the only two components SLASHED ships — it stays BEM-first and does
not carry a broad component library. Every value goes through `var()`. Requires
`tokens.components.css`.

**slashed.macros** — recipes / patterns: `.sf-prose`,
`.sf-not-prose`, `.sf-flow`, `.sf-truncate`, `.sf-line-clamp-{2,3,N}`,
`.sf-equal-height`, `.sf-aspect`, `.sf-scroll-shadow`, `.sf-scroll-snap`,
`.sf-overflow-fade`, `.sf-no-tap-highlight`. Tokens for these classes
live in `core/tokens.macros.css`.

**slashed.utilities** — single-purpose helpers. SLASHED ships no
utility classes in 0.x; the layer slot is reserved for the future.

**slashed.states** — `.sf-is-*` markers. Exclusive prefix — utilities never use it. `.sf-is-current` exposes `--sf-current-font-weight` (defaults to `--sf-font-weight-bold`) for consumers to override without specificity battles.

**slashed.themes** — token reassignments only. Lives in `core/themes.css`. Holds `@media (prefers-color-scheme: dark)` and the `[data-theme="light|dark"]` selectors that flip `color-scheme` and `--sf-is-dark`. Sits above `slashed.{states, utilities, components}` so theme overrides cannot be beaten by an equal-specificity component or utility rule. Consumers can extend this layer with `forced-colors` swaps, brand-palette scopes, or any other token-only reassignment (see `optional/theme-example.css`).

**slashed.motion** — animation tokens, keyframes, transition utilities. No component selectors. Gated behind `@media (prefers-reduced-motion: no-preference)`. Transition tokens live in `core/tokens.css` — see [motion.md](motion.md). `.sf-color-pulse` animates `--sf-color-primary-source-light` lightness, demonstrating `@property` colour interpolation in oklch.

**slashed.accessibility** — `:focus-visible`, `.sr-only`, `.skip-link`, reduced-motion resets, plus the a11y patterns `.sf-focus-parent` and `.sf-clickable-parent`. High in the stack to override motion without relying solely on `!important`. Selective `!important` used only where override is a genuine accessibility barrier (focus ring, reduced motion, sr-only). `.sr-only` uses `overflow: clip` (modern consensus — avoids creating a new scroll container unlike the legacy `overflow: hidden`).

**slashed.print** — `@media print` only. Contains `@page` rule consuming `--sf-print-*` tokens. Authored colour is preserved by default; consumers opt into ink-on-paper via `.print-no-color` or force colour via `.print-color-exact`. `!important` is reserved for selectors whose semantics require defeating consumer CSS: the hide-list (`nav, aside, button, input, select, textarea, dialog, [popover], .no-print`), `details > summary`, and the two opt-in colour classes.

**slashed.legacy** — `@supports not (…)` fallbacks for the ~2022 baseline (first browsers with CSS cascade layers). Sits above `slashed.print` so fallbacks win, but below `slashed.overrides` so user CSS always wins.

**slashed.overrides** — ships empty. Consumer escape hatch.

---

## Tokens

- Colors: `oklch()` with relative color syntax for derived values; `oklch(from …)` for semantic alpha variants (ghost/subtle/muted) in core; `color-mix(in oklab)` for numeric tints/shades in the optional palette; the optional palette's numeric alpha variants (-a5/-a10/-a30/-a50/-a80) are gated behind `@supports (color: oklch(from red l c h))`
- `@property` registration for 20 source colours (10 `-source-light` + 10 `-source-dark`, 6 brand + 4 status) and 5 interaction-state integers (`--sf-is-dark`, `--sf-is-active`, `--sf-is-current`, `--sf-is-pressed`, `--sf-is-open`) — enables animation and typed `initial` reset
- Sizing: `clamp(min, preferred, max)` — no bare viewport units in tokens
- Aliases: semantic tokens always reference palette tokens via `var()` — never literals
- Component tokens: always `var(--sf-*)` — never literals

### Naming conventions

- **Single dash vs double dash.** Two parallel rules, applied consistently:
  - **`<role>-<variant>` (single dash)** — names a *palette/shade variant*; the
    name describes the colour itself (`--sf-color-primary-source-light`,
    `--sf-color-primary-darker`, `--sf-color-success-strong`,
    `--sf-color-action-subtle`). The token IS a colour value.
  - **`<role>--<context>` (double dash)** — names an *application slot*; the
    name describes where/when the colour is applied (`--sf-color-bg--hover`,
    `--sf-color-text--muted`, `--sf-color-link--hover`,
    `--sf-color-border--subtle`, `--sf-color-primary--hover`,
    `--sf-color-action--active`). The token is consumed in a specific
    semantic context.
  Read `--variant` as "a flavour of the token to its left" and `-variant` as
  "a name-derived shade of the role to its left". Brand hover/active slots
  (`--sf-color-{primary,...}--hover`, `--hover/--active`) live in
  `core/tokens.css` — they map interaction states to palette shades.
- **Stability tiers.** Token-file headers classify every token into one of
  three SemVer tiers: **PUBLIC** (everyday knobs — brand/status sources,
  resolved semantic tokens, scales, BEM consumer aliases), **PUBLIC-ADVANCED**
  (same SemVer guarantee but niche/powerful — e.g. generative scale inputs and
  the per-size typography sub-properties in `core/tokens.css`), and
  **INTERNAL** (`--sf-is-dark` — implementation detail, may change without a
  major bump). The enumerated tier sets live in `scripts/token-tiers.js`; the
  full cross-reference is [token-index.md](token-index.md).
- **Role: knob vs consumption.** Orthogonal to tier (and carrying no SemVer
  meaning), each token is a **knob** — an input you *set* (a literal primitive
  value) — or a **consumption** value — a ready-to-use output you *read*,
  derived from other tokens via `var(--sf-…)`. Role is computed deterministically
  from the declared value (`roleOf` in `scripts/token-tiers.js`) and surfaced in
  both index docs.
- **Semantic gap layer (base → semantic → component).** Layout primitives
  default directly to one of three semantic gap tokens — `--sf-gap` (loose),
  `--sf-content-gap` (tight), `--sf-gutter` (wide) — which in turn read the
  `--sf-space-*` scale. Override the semantic token to move every primitive of
  that rhythm at once, or a per-primitive token (e.g. `--sf-cluster-gap`) for
  one element. The alias graph traverses at most 3 nodes
  (per-primitive → semantic → scale) with no duplicates/dangling/cycles.
  (`--sf-section-pad`→`--sf-section-pad--m` is a similar unsuffixed default.)

### BEM consumer-API tokens

Many tokens — `--sf-shadow-*`, `--sf-blur-*`, `--sf-gap`, `--sf-gradient-*`,
`--sf-scrollbar-*`, `--sf-optical-sizing` — are **not consumed by the framework
itself**. They exist for your own BEM classes
(`.card { box-shadow: var(--sf-shadow-m) }`) and are exercised in
`docs/demo.html` and validated by `tests/`.

### Print class naming

Print helpers use the `.print-*` prefix: `.print-only` (show only on paper),
`.no-print` (hide on paper), `.print-color-exact` (force colour), and
`.print-no-color` (force ink-saving flatten). See the **slashed.print** layer.

### Naming exceptions

A small number of classes are intentionally unprefixed (no `sf-` or `sf-is-`).
They are short, universally understood terms where a prefix would add noise
without reducing collision risk in practice.

| Class | Layer | Rationale |
|---|---|---|
| `.sr-only` | accessibility | Industry-standard screen-reader name |
| `.sr-only-focusable` | accessibility | Companion to `.sr-only` |
| `.skip-link` | accessibility | Common a11y pattern name |
| `.no-motion` | accessibility | Reads as a behaviour toggle |
| `.no-print` | print | Reads as a behaviour toggle |
| `.print-only` | print | Reads as a behaviour toggle |
| `.print-color-exact` | print | Self-documenting intent |
| `.print-no-color` | print | Self-documenting intent |
| `.theme-transition` | themes | Scoped opt-in helper |

---

## Specificity

```text
unlayered consumer CSS       highest
slashed.overrides
slashed.legacy
slashed.print
slashed.accessibility
slashed.motion
slashed.themes
slashed.states
slashed.utilities
slashed.macros
slashed.components
slashed.layout
slashed.forms
slashed.base
slashed.reset
slashed.tokens               lowest
```

Selectors stay low-specificity (single class, `:root`, element). Consumer overrides win without `!important`.

---

## Extension points

| Mechanism | Example |
|-----------|---------|
| Token override | `:root { --sf-color-primary: #your-color }` |
| Instance token | `style="--sf-button-radius: var(--sf-radius-full)"` |
| Layer override | `@layer slashed.overrides { … }` |
| Unlayered CSS | Author normally |
| Theme | `[data-theme="dark"] { --sf-color-primary: … }` |

---

## Responsive design

1. **Fluid tokens** — `--sf-space-*`, `--sf-text-*` use `clamp()`. No `@media` needed.
2. **Container primitives** — `.sf-grid`, `.sf-sidebar`, `.sf-alternate`, `.sf-bento` use `@container`. `.sf-container` declares the named container `sf-layout` (see Container query contract below); `.sf-alternate` declares its own `sf-alternate`.
3. **Breakpoints** — a last resort. The framework ships no breakpoint tokens (custom properties can't be used in `@media`/`@container` conditions); hard-code a value in your own query if you truly need one.

---

## Container query contract

The framework declares two named containers:

| Selector | Container name | Type | Where consumed |
|---|---|---|---|
| `.sf-container` | `sf-layout` | `inline-size` | open — consumers can target with `@container sf-layout (...)` in their own CSS |
| `.sf-alternate` | `sf-alternate` | `inline-size` | framework-internal — the zigzag flip query is bound to this name so a nested `.sf-alternate` flips on its own width, not its outer container's |

The `.sf-bento` and `.sf-grid-cols-*` (fixed-column and ratio) primitives use **anonymous** `@container (...)` queries on purpose. They are designed to react to whatever the nearest `inline-size` ancestor reports — typically `.sf-container`, but legitimately also a parent `.sf-bento`, `.sf-alternate`, or any user-declared container. This portability is the feature: drop `.sf-grid-cols-3` inside any inline-size context and it adapts.

If precision is needed in a consumer layout — e.g. a `.sf-grid-cols-3` that must respond to the outer `.sf-container` and ignore an intermediate container — the consumer wraps the grid in their own named container or uses `@container sf-layout (...)` directly in user CSS.

---

## Bundle configuration

The optimal bundle (`dist/slashed.optimal.css`) — the recommended default —
includes core files plus classless form styling in order:

```text
core/layers.css
core/tokens.css
core/tokens.layout.css
core/tokens.macros.css
core/reset.css
core/base.css
core/themes.css
core/layout.css
core/macros.css
core/states.css
core/motion.css
core/accessibility.css
core/print.css
optional/forms.css
```

Each bundle is emitted readable **and** minified with a source map
(`*.css`, `*.min.css`, `*.min.css.map`) via lightningcss; the minifier does
not down-level modern colour syntax (no `targets`), so `light-dark()` and
`oklch(from …)` survive. `npm run build` reports raw/gzip/brotli sizes.
Custom hand-built bundles must load `core/layers.css` first.

Four tiered bundles — each also emitted as a layer-flattened `.flat` variant,
so `bundle.config.json` lists eight outputs in total — are built by
`scripts/bundle.js`:

| Bundle | Contents |
|---|---|
| `slashed.optimal.css` | all `core/` + `forms` |
| `slashed.optimal-components.css` | optimal + `tokens.components` + `components` *(btn + card — the only two)* |
| `slashed.optimal-utilities.css` | optimal + `utilities` *(curated subset active, rest staged)* |
| `slashed.full.css` | optimal + `tokens.components` + `components` *(btn + card)* + `utilities` *(curated subset active, rest staged)* |

`optional/legacy.css` is **not bundled by default** — add it explicitly when
you need back-compat shims. Because every rule sits in an `@layer`,
concatenation order within a bundle does not affect the cascade. The bundler
strips local `@import` statements (the explicit file list resolves them), so
the `tokens.components` import inside `components.css` is inlined by listing
the token file first. `components.css` and `tokens.components.css` ship
`.sf-btn` / `.sf-card` and their tokens — the only two components; `utilities.css`
ships a curated subset (heading, text-size, hover, list-reset, marker, selection,
and sticky helpers active, rest commented). Consumers can also build à la carte: raw
`core/` plus hand-picked optional files. Each bundle also has a
layer-flattened `.flat` variant.

---

## Performance

Plain CSS, no runtime. The notable costs:

- **`transition: all`** watches every animatable property and is a known
  performance footgun — it was removed from the public token API. Use scoped
  tokens (`--sf-transition-colors` / `-transform` / `-opacity` / `-shadow`);
  animate `transform`/`opacity` where possible (compositor-only paths).
- **`oklch` + relative-colour tokens** recompute when their inputs change.
  Animating a registered colour (e.g. `.sf-color-pulse` mutating
  `--sf-color-primary-source-light`) re-derives everything downstream each frame — fine
  for a small accent, not for a token hundreds of elements read. A theme toggle
  re-resolves the graph once (negligible).
- **`@property` registration** (22 colours + 5 state flags) is a one-time parse
  cost; immaterial.
- **`@layer`** has no runtime cost — resolved at parse time. Low-specificity
  selectors keep style recalc fast.
- **`@container`** establishes a layout/style boundary (scoped invalidation, a
  win); avoid thousands of tiny containers. `sf-layout` is declared once on
  `.sf-container`.
- **Bundle size** — ship only what you use; serve compressed (the token-heavy
  `:root` gzips well). See [bundle configuration](#bundle-configuration).
- **Reduced motion** — `core/accessibility.css` neutralises
  animation/transition under `prefers-reduced-motion: reduce` (and `.no-motion`)
  with property-level `!important`.

## Known intentional tradeoffs

Deliberate behaviours, documented so they aren't mistaken for bugs.

- **Text-on-color uses a binary lightness threshold.** `--sf-color-text--on-*`
  use `sign(var(--sf-contrast-threshold) - l)` to pick black or white text (threshold defaults to 0.6). This is a binary decision: a
  colour at lightness 0.59 gets white text, 0.60 gets black. The framework's
  default brand and status palettes are picked so every on-color foreground
  meets WCAG AA Normal (4.5:1) — verified by `tests/tokens.spec.js`. The
  trough at L 0.6 is inherent to any binary approach, so user-supplied
  colours that land in the L≈0.55..0.65 band may require an explicit
  override of their matching `--sf-color-text--on-*` token. A future
  upgrade path is CSS `contrast-color()` once it has broad support.
- **Smooth scroll is always enabled.** `core/base.css` sets `scroll-behavior: smooth` on `html`. There is no focus-based override — keyboard users navigate with arrow keys and smooth scroll does not interfere. To suppress per-element, use `scroll-behavior: auto` locally.
- **The `base` palette ramp is V-shaped, not monotonic.** In
  `core/tokens.css`, `base-*` mixes `--sf-color-text` *into* base for
  tints and base *into* text for shades, so it is surface-relative, not a perceptual
  lightness ramp. `base-600` can be lighter than `base-400`. This is intentional and
  differs from the conventional monotonic lightness ramp.
- **Palette token values are not part of the public API.** The *names*
  (`--sf-color-primary-source-light`, `--sf-color-action--hover`, etc.) are stable and
  covered by SemVer. The *computed colour values* they resolve to may shift
  between minor releases as derivation formulas are refined. Pin your own
  overrides to the 6 source tokens if you need colour stability.

---

## Deferred

`@starting-style` and CSS anchor positioning are only meaningful attached to
a specific element/component transition (dialog, popover, tooltip). SLASHED
ships only `.sf-btn` and `.sf-card` and stays BEM-first, so these belong to
consumer components rather than the framework and are out of scope here. The
component-free part — scroll-driven animation range tokens
(`--sf-scroll-timeline-range-*`) — already ships in `core/tokens.css`.
