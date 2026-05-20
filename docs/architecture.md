# SLASHED — Architecture

## Layer order

Declared once in `core/layers.css`:

```css
@layer
  slashed.tokens,
  slashed.reset,
  slashed.base,
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
  layout.css              slashed.layout
  states.css              slashed.states
  motion.css              slashed.motion
  accessibility.css       slashed.accessibility
  print.css               slashed.print
optional/
  tokens.palette.css      slashed.tokens  (tints/shades/alpha for brand colors)
  tokens.components.css   slashed.tokens  (component-level tokens)
  components.css          slashed.components  (imports tokens.components.css)
  utilities.css           slashed.utilities
  legacy.css              slashed.legacy
```

---

## Layers

**slashed.tokens** — custom properties only, `:root` only. No element rules. All values consumers might override are tokens. Spread across multiple files: `tokens.css` (core), `tokens.layout.css` (layout primitives), `tokens.palette.css` (optional tints/shades), `tokens.components.css` (optional component tokens).

**slashed.reset** — browser normalization. Minimal `var()` usage (only with hardcoded fallbacks for critical layout values like `scroll-padding-top`).

**slashed.base** — element defaults. All values via `var()`.

**slashed.layout** — layout primitives: `.sf-stack`, `.sf-cluster`, `.sf-sidebar`, `.sf-cover`, `.sf-grid`, `.sf-container`, `.sf-prose`, etc. Layout tokens declared in `tokens.layout.css`, overridable per-instance via `style="--sf-stack-gap: …"`.

**slashed.components** — UI blocks. Every value via `var()`. Requires `tokens.components.css`.

**slashed.utilities** — single-purpose helpers. Components always win.

**slashed.states** — `.is-*` markers. Exclusive prefix — utilities never use it.

**slashed.themes** — token overrides only, no new rules. Dark mode, forced colors, brand palettes.

**slashed.motion** — animation tokens, keyframes, transition utilities. No component selectors. Gated behind `@media (prefers-reduced-motion: no-preference)`.

**slashed.accessibility** — `:focus-visible`, `.sr-only`, `.skip-link`, reduced-motion resets. High in the stack to override motion without relying solely on `!important`. Selective `!important` used only where override is a genuine accessibility barrier (focus ring, reduced motion, sr-only).

**slashed.print** — `@media print` only. Contains `@page` rule consuming `--sf-print-*` tokens. `!important` permitted.

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
2. **Container primitives** — `.sf-grid`, `.sf-sidebar`, `.sf-alternate`, `.sf-bento` use `@container`. Note: `.sf-container` sets `container-type: inline-size` making it a query container for its children.
3. **Container query tokens** — component-scoped thresholds, preferred over `@media`:

   | Token            | Value | Px equivalent |
   |------------------|-------|---------------|
   | `--sf-cq-xs`     | `20em` |  320px |
   | `--sf-cq-sm`     | `30em` |  480px |
   | `--sf-cq-md`     | `48em` |  768px |
   | `--sf-cq-lg`     | `64em` | 1024px |
   | `--sf-cq-xl`     | `80em` | 1280px |

   Usage: `@container (min-width: var(--sf-cq-md)) { … }`

4. **Breakpoints** — last-resort viewport thresholds for global layout decisions:

   | Token            | Value | Px equivalent |
   |------------------|-------|---------------|
   | `--sf-bp-xs`     | `20em` |  320px |
   | `--sf-bp-sm`     | `30em` |  480px |
   | `--sf-bp-md`     | `48em` |  768px |
   | `--sf-bp-lg`     | `64em` | 1024px |
   | `--sf-bp-xl`     | `80em` | 1280px |
   | `--sf-bp-2xl`    | `96em` | 1536px |

   Usage: `@media (min-width: var(--sf-bp-md)) { … }`

---

## Bundle configuration

The essential bundle (`dist/slashed.essential.css`) includes core files in order:

```text
core/layers.css
core/tokens.css
core/tokens.layout.css
core/reset.css
core/base.css
core/layout.css
core/states.css
core/motion.css
core/accessibility.css
core/print.css
```

Optional files are loaded independently by the consumer as needed.
