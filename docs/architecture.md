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
  themes.css              slashed.themes
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

**slashed.themes** — selector-driven `color-scheme` overrides only. The brand and status palettes are theme-aware natively via `light-dark()` in `tokens.css` — no token swaps needed at this layer. Setting `data-theme="dark"` on any element flips `color-scheme` for its subtree, which makes every nested `light-dark()` resolve to its dark branch (including all derived tokens) without any further declarations.

**slashed.motion** — animation tokens, keyframes, transition utilities. No component selectors. Gated behind `@media (prefers-reduced-motion: no-preference)`.

**slashed.accessibility** — `:focus-visible`, `.sr-only`, `.skip-link`, reduced-motion resets. High in the stack to override motion without relying solely on `!important`. Selective `!important` used only where override is a genuine accessibility barrier (focus ring, reduced motion, sr-only).

**slashed.print** — `@media print` only. Contains `@page` rule consuming `--sf-print-*` tokens. `!important` permitted.

**slashed.legacy** — `@supports not (…)` fallbacks for the ~2022 baseline (first browsers with CSS cascade layers). Sits above `slashed.print` so fallbacks win, but below `slashed.overrides` so user CSS always wins.

**slashed.overrides** — ships empty. Consumer escape hatch.

---

## Tokens

- Colors: `oklch()` with relative color syntax for derived values; `color-mix(in oklch)` for tints/shades in palette
- `@property` registration for the `-light` and `-dark` companion brand & status tokens (enables animation and `initial` reset)
- Theming primitive: each active brand/status token is an unregistered custom property holding a `light-dark(var(--sf-color-X-light), var(--sf-color-X-dark))` expression, so it re-resolves at use-site based on the inherited `color-scheme`. Switching theme is a single `color-scheme` flip — no token swap blocks needed
- Sizing: `clamp(min, preferred, max)` — no bare viewport units in tokens
- Aliases: semantic tokens always reference palette tokens via `var()` — never literals
- Component tokens: always `var(--sf-*)` — never literals

---

## Theming

The framework is theme-aware natively. Switching theme is a single `color-scheme` flip; no token-swap blocks needed.

**Source tokens.** 22 colors registered with `@property` in `core/tokens.css`: 6 brand × 2 (`--sf-color-primary-light`, `--sf-color-primary-dark`, …) and 5 status × 2 (`--sf-color-success-light`, …).

**Active tokens.** 11 unregistered `:root` declarations:

```css
--sf-color-primary: light-dark(var(--sf-color-primary-light), var(--sf-color-primary-dark));
```

These are intentionally unregistered. A registered (`@property`) custom property would resolve `light-dark()` once at registration time. An unregistered one re-resolves at use-site, so it follows the inherited `color-scheme`.

**Theme switching.** `color-scheme` drives everything. Either let `prefers-color-scheme` set it (default) or force it via `<html data-theme="dark">`. No token reassignment required.

**Per-section theming.** Any nested element with `data-theme="dark"` (or `"light"`) gets its own `color-scheme`. Every `light-dark()` expression evaluated inside that subtree resolves accordingly, including all derived tokens.

**Derived tokens.** Where light and dark need different math (text, border, status text), each derived token is itself a `light-dark()` expression that reads from the matching `*-light` / `*-dark` source in each branch. Where the math reads sensibly through the active theme-aware token (surfaces from `--sf-color-base`, links from `--sf-color-action`), a single relative-color formula is used.

**Non-color scalars.** `light-dark()` only accepts `<color>` per spec. The one non-color theme-aware token, `--sf-shadow-strength`, uses selector-driven overrides in `core/themes.css`: an `@media (prefers-color-scheme: dark)` block plus a `[data-theme="dark"]` block, intentionally duplicated because CSS has no way to share declarations across both. Future theme-aware scalars must follow the same pattern.

**Optional palette.** `optional/tokens.palette.css` provides `-100..-900` and `-a10..-a75` for each brand color, plus M3-style `--sf-color-X-container` / `--sf-color-X-on-container` aliases for the 5 non-base brands. Tints mix with `--sf-color-base`, shades with `--sf-color-text`. Both anchors are theme-aware, so the entire numeric scale follows the theme.

**Auto-contrast.** `--sf-color-text--on-X` (defined in `core/tokens.css`) picks black or white based on the active brand color's lightness via `sign(0.6 - l)`. Use this when the BACKGROUND is the brand color itself.

**Consumer recipes.**

- Solid brand background → `background: var(--sf-color-primary); color: var(--sf-color-text--on-primary)`
- Tinted brand container → `background: var(--sf-color-primary-container); color: var(--sf-color-primary-on-container)`
- Brand color as text on neutral surface → `color: var(--sf-color-primary)` (works directly, both themes)
- Per-section dark island → `<section data-theme="dark">…</section>`

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
| Token override (both modes) | `:root { --sf-color-primary: #your-color }` (shadows the `light-dark()` declaration; same color in light and dark) |
| Per-mode color override | `:root { --sf-color-primary-light: #abc; --sf-color-primary-dark: #def }` (recommended for theme-aware brand customization) |
| Instance token | `style="--sf-button-radius: var(--sf-radius-full)"` |
| Layer override | `@layer slashed.overrides { … }` |
| Unlayered CSS | Author normally |
| Theme | `[data-theme="dark"] { color-scheme: dark }` |

---

## Responsive design

1. **Fluid tokens** — `--sf-space-*`, `--sf-text-*` use `clamp()`. No `@media` needed.
2. **Container primitives** — `.sf-grid`, `.sf-sidebar`, `.sf-alternate`, `.sf-bento` use `@container`. Note: `.sf-container` sets `container-type: inline-size` making it a query container for its children.
3. **Breakpoints** — `sm: 30em / md: 48em / lg: 64em / xl: 80em`. Last resort.

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
core/themes.css
core/motion.css
core/accessibility.css
core/print.css
```

Optional files are loaded independently by the consumer as needed.
