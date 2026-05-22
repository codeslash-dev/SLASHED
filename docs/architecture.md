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

---

## File structure

```text
core/
  layers.css              @layer declaration only
  tokens.css              slashed.tokens
  tokens.layout.css       slashed.tokens  (semantic layout tokens)
  reset.css               slashed.reset
  base.css                slashed.base
  themes.css              slashed.themes
  layout.css              slashed.layout
  states.css              slashed.states
  motion.css              slashed.motion
  accessibility.css       slashed.accessibility
  print.css               slashed.print
optional/
  tokens.palette.css      slashed.tokens  (tints/shades/alpha for brand colors)
  tokens.components.css   slashed.tokens  (component-level tokens — empty stub)
  forms.css               slashed.forms  (classless native form-control styling)
  components.css          slashed.components  (empty stub)
  utilities.css           slashed.utilities  (empty stub)
  legacy.css              slashed.legacy
```

The three empty stubs are reserved for a future component layer and
ship in source only — they are excluded from `bundle.config.json` and
the README Quick start.

---

## Layers

**slashed.tokens** — custom properties only, `:root` only. No element rules. All values consumers might override are tokens. Spread across multiple files: `tokens.css` (core), `tokens.layout.css` (layout primitives), `tokens.palette.css` (optional tints/shades), `tokens.components.css` (optional component tokens).

**slashed.reset** — browser normalization. Minimal `var()` usage (only with hardcoded fallbacks for critical layout values like `scroll-padding-top`).

**slashed.base** — element defaults, all values via `var()`. A minimal,
readable foundation for flow and inline text — **not** a classless UI kit.
SLASHED is BEM-first: the token API is the product, and the base holds the
line at three tiers:

- *Global base* — flow/inline readability: headings, `p`, `a`, `code`,
  `pre`, `mark`, `hr`, `sub`/`sup`, `abbr`, `::selection`.
- *Rich blocks* (`table`, `blockquote`, `figure`, `dl`) — styled **only
  inside `.sf-prose`** (a layout primitive), never globally.
- *Interactive widgets* (`dialog`, `details`, `progress`, `meter`) —
  consumer/component territory (future `components` layer); `core` carries
  reset-level normalization only.

Native form controls are out of base entirely — they live in the opt-in
`slashed.forms` layer.

**slashed.forms** — opt-in classless styling for native form controls
(`input`, `select`, `textarea`, `button`, checkbox/radio, `fieldset`,
`label`) from `optional/forms.css`. Element-level only, no classes. Reads
`--sf-field-border-color` so the `.is-*` validation states in
`slashed.states` recolour fields. Skip the file entirely if you prefer full
BEM control.

**slashed.layout** — layout primitives: `.sf-stack`, `.sf-cluster`, `.sf-sidebar`, `.sf-cover`, `.sf-grid`, `.sf-container`, `.sf-prose`, etc. Layout tokens declared in `tokens.layout.css`, overridable per-instance via `style="--sf-stack-gap: …"`.

**slashed.components** — UI blocks. Every value via `var()`. Requires `tokens.components.css`.

**slashed.utilities** — single-purpose helpers. Components always win.

**slashed.states** — `.is-*` markers. Exclusive prefix — utilities never use it. `.is-current` exposes `--sf-current-font-weight` (defaults to `--sf-font-weight-bold`) for consumers to override without specificity battles.

**slashed.themes** — token reassignments only. Lives in `core/themes.css`. Holds `@media (prefers-color-scheme: dark)` and the `[data-theme="light|dark"]` selectors that flip `color-scheme` and `--sf-is-dark`. Sits above `slashed.{states, utilities, components}` so theme overrides cannot be beaten by an equal-specificity component or utility rule. Add `forced-colors`, brand-palette swaps, or any other token-only theme reassignment here.

**slashed.motion** — animation tokens, keyframes, transition utilities. No component selectors. Gated behind `@media (prefers-reduced-motion: no-preference)`.

Transition tokens live in `core/tokens.css`:

| Token | Scope | Notes |
|-------|-------|-------|
| `--sf-transition-all` | all properties | Convenient but a performance footgun — forces browser to watch every computed value |
| `--sf-transition-colors` | color, background-color, border-color, text-decoration-color, fill, stroke | Preferred for interactive colour changes |
| `--sf-transition-transform` | transform | Preferred for movement/scale |
| `--sf-transition-opacity` | opacity | Preferred for show/hide fades |
| `--sf-transition-shadow` | box-shadow | Preferred for elevation changes |
| `--sf-transition-base` | *(deprecated alias)* | Maps to `--sf-transition-all`. Will be removed after v1.x — migrate to a scoped token |
| `--sf-transition-fast` | all, fast duration | Quick interactions |
| `--sf-transition-slow` | all, slow duration | Deliberate transitions |
| `--sf-transition-enter` | all, normal duration | Mount/appear |
| `--sf-transition-exit` | all, fast duration | Unmount/disappear |

`@property` color interpolation is demonstrated by `.sf-color-pulse` which animates `--sf-color-primary-light` lightness via `sf-color-pulse` keyframes — proving that registered custom properties interpolate smoothly in oklch.

**slashed.accessibility** — `:focus-visible`, `.sr-only`, `.skip-link`, reduced-motion resets. High in the stack to override motion without relying solely on `!important`. Selective `!important` used only where override is a genuine accessibility barrier (focus ring, reduced motion, sr-only). `.sr-only` uses `overflow: clip` (modern consensus — avoids creating a new scroll container unlike the legacy `overflow: hidden`).

**slashed.print** — `@media print` only. Contains `@page` rule consuming `--sf-print-*` tokens. Authored colour is preserved by default; consumers opt into ink-on-paper via `.print-no-color` or force colour via `.print-color-exact`. `!important` is reserved for selectors whose semantics require defeating consumer CSS: the hide-list (`nav, aside, button, input, select, textarea, dialog, [popover], .no-print`), `details > summary`, and the two opt-in colour classes.

**slashed.legacy** — `@supports not (…)` fallbacks for the ~2022 baseline (first browsers with CSS cascade layers). Sits above `slashed.print` so fallbacks win, but below `slashed.overrides` so user CSS always wins.

**slashed.overrides** — ships empty. Consumer escape hatch.

---

## Tokens

- Colors: `oklch()` with relative color syntax for derived values; `color-mix(in oklch)` for tints/shades in palette
- `@property` registration for brand & status colors (enables animation and `initial` reset)
- Sizing: `clamp(min, preferred, max)` — no bare viewport units in tokens
- Aliases: semantic tokens always reference palette tokens via `var()` — never literals
- Component tokens: always `var(--sf-*)` — never literals

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

The `.sf-bento` and `.sf-grid-*` (fixed-column and ratio) primitives use **anonymous** `@container (...)` queries on purpose. They are designed to react to whatever the nearest `inline-size` ancestor reports — typically `.sf-container`, but legitimately also a parent `.sf-bento`, `.sf-alternate`, or any user-declared container. This portability is the feature: drop `.sf-grid-3` inside any inline-size context and it adapts.

If precision is needed in a consumer layout — e.g. a `.sf-grid-3` that must respond to the outer `.sf-container` and ignore an intermediate container — the consumer wraps the grid in their own named container or uses `@container sf-layout (...)` directly in user CSS.

---

## Bundle configuration

The essential bundle (`dist/slashed.essential.css`) includes core files in order:

```text
core/layers.css
core/tokens.css
core/tokens.layout.css
core/reset.css
core/base.css
core/themes.css
core/layout.css
core/states.css
core/motion.css
core/accessibility.css
core/print.css
```

The full bundle (`dist/slashed.full.css`) adds the populated optional files
(`optional/tokens.palette.css`, `optional/forms.css`, then `optional/legacy.css`
last). The empty `components`/`utilities`/`tokens.components` files are not
bundled. Bundles are declared in `bundle.config.json` and built by
`scripts/bundle.js`. Because every rule sits in an `@layer`, concatenation order
within a bundle does not affect the cascade — `core/layers.css` fixes it.

---

## Known intentional tradeoffs

These behaviors are deliberate. Documented here so they aren't mistaken for bugs.

- **Text-on-color uses a binary lightness threshold.** `--sf-color-text--on-*`
  use `sign(0.6 - l)` to pick black or white text. This is a binary decision: a
  colour at lightness 0.59 gets white text, 0.60 gets black. The framework's
  default brand and status palettes are picked so every on-color foreground
  meets WCAG AA Normal (4.5:1) — verified by `tests/tokens.spec.js`. The
  trough at L 0.6 is inherent to any binary approach, so user-supplied
  colours that land in the L≈0.55..0.65 band may require an explicit
  override of their matching `--sf-color-text--on-*` token. A future
  upgrade path is CSS `contrast-color()` once it has broad support.
- **Smooth scroll is disabled while something has focus.** `core/motion.css` sets
  `html:focus-within { scroll-behavior: auto }` (the Andy Bell pattern). Clicking an
  anchor focuses the target, so smooth scroll won't animate for that click — a
  deliberate trade to avoid hijacking keyboard navigation.
- **The `base` palette ramp is V-shaped, not monotonic.** In
  `optional/tokens.palette.css`, `base-*` mixes `--sf-color-text` *into* base for
  tints and base *into* text for shades, so it is surface-relative, not a perceptual
  lightness ramp. `base-600` can be lighter than `base-400`. This is intentional and
  differs from Material/Tailwind conventions.

---

## Deferred (until the component layer exists)

`@starting-style` and CSS anchor positioning are only meaningful attached to a
specific element/component transition (dialog, popover, tooltip). They are out of
scope while `optional/components.css` is empty and will be added with the components.
The component-free part — scroll-driven animation range tokens
(`--sf-scroll-timeline-range-*`) — already ships in `core/tokens.css`.

