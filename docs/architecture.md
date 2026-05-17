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
  slashed.overrides;
```

Priority increases left → right. Unlayered consumer CSS beats all layers. `slashed.overrides` ships empty.

---

## File structure

```text
core/
  layers.css              @layer declaration only
  tokens.css              slashed.tokens
  reset.css               slashed.reset
  base.css                slashed.base
  layout.css              slashed.layout
  states.css              slashed.states
  accessibility.css       slashed.accessibility
  print.css               slashed.print
optional/
  components.css          slashed.components  (imports components.tokens.css)
  components.tokens.css   slashed.tokens
  utilities.css           slashed.utilities
  themes.css              slashed.themes
  motion.css              slashed.motion
```

---

## Layers

**slashed.tokens** — custom properties only, `:root` only. No element rules. All values consumers might override are tokens.

**slashed.reset** — browser normalization. No `var()`.

**slashed.base** — element defaults. All values via `var()`.

**slashed.layout** — layout primitives: `.stack`, `.cluster`, `.sidebar`, `.cover`, `.grid`, `.container`. Layout tokens declared inline, overridable per-instance via `style="--stack-gap: …"`.

**slashed.components** — UI blocks. Every value via `var()`. Requires `components.tokens.css`.

**slashed.utilities** — single-purpose helpers. Components always win.

**slashed.states** — `.is-*` markers. Exclusive prefix — utilities never use it.

**slashed.themes** — token overrides only, no new rules. Dark mode, forced colors, brand palettes.

**slashed.motion** — animation tokens, keyframes, transition utilities. No component selectors.

**slashed.accessibility** — `:focus-visible`, `.sr-only`, `.skip-link`, reduced-motion resets. High in the stack to override motion without `!important`.

**slashed.print** — `@media print` only. `!important` permitted.

---

## Tokens

- Colors: `color-mix()` for tints/shades, `light-dark()` for mode-aware aliases
- Sizing: `clamp(min, preferred, max)` — no bare viewport units in tokens
- Aliases: semantic tokens always reference palette tokens via `var()` — never literals
- Component tokens: always `var(--sf-*)` — never literals

---

## Specificity

```text
unlayered consumer CSS       highest
slashed.overrides
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
2. **Container primitives** — `.grid`, `.sidebar` use `@container`.
3. **Breakpoints** — `sm: 30em / md: 48em / lg: 64em / xl: 80em`. Last resort.
