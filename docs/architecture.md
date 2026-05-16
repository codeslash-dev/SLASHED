# SLASHED — Architecture

## Overview

SLASHED is a cascade-layer CSS framework. Every architectural decision serves one goal: give the consumer a predictable, overridable, zero-build foundation.

---

## Layer hierarchy

Layers are declared once, in `main.css`, and never redeclared:

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

Priority increases left-to-right. `overrides` is the consumer's escape hatch — the framework ships no rules into it.

Any unlayered CSS the consumer writes beats all layers automatically, so `!important` is never needed to override the framework.

---

## File structure

```
/
├── main.css                          ← entry point: @layer + @import only
├── core/
│   ├── tokens.css                    ← @layer slashed.tokens
│   ├── reset.css                     ← @layer slashed.reset
│   ├── base.css                      ← @layer slashed.base
│   ├── layout.css                    ← @layer slashed.layout
│   ├── states.css                    ← @layer slashed.states
│   ├── accessibility.css             ← @layer slashed.accessibility
│   └── print.css                     ← @layer slashed.print
└── optional/
    ├── components.tokens.css         ← @layer slashed.tokens (component subset)
    ├── components.css                ← @layer slashed.components
    ├── utilities.css                 ← @layer slashed.utilities
    ├── themes.css                    ← @layer slashed.themes
    └── motion.css                    ← @layer slashed.motion
```

---

## Layer responsibilities

### `slashed.tokens` — `core/tokens.css` + `optional/components.tokens.css`

The single source of truth for all design values. Rules:

- Only `:root {}` selectors
- No element rules
- No literal values in component files — everything references a token
- Every value a consumer might want to change is a custom property

Token categories: colors (palette + semantic aliases), spacing, typography, radii, shadows, borders, opacity, breakpoints, z-index, transitions.

`optional/components.tokens.css` extends this layer with component-scoped defaults. Every value there must be `var(--global-token)`, never a literal — this makes themes work automatically.

### `slashed.reset` — `core/reset.css`

Browser normalization only. No design decisions. No `var()` calls — deliberately independent of tokens so it can load standalone.

### `slashed.base` — `core/base.css`

Opinionated element defaults built on top of reset. All values use `var()`. This is the foundation `components` builds on. Covers: headings, body text, links, code/pre/kbd, lists, blockquote, hr, tables, form element foundations, `::selection`.

### `slashed.layout` — `core/layout.css`

Composable, projection-agnostic layout primitives:

| Primitive | Purpose |
|-----------|---------|
| `.stack` | Vertical flow with consistent gap — document rhythm |
| `.cluster` | Horizontal wrapping group — tags, buttons, nav items |
| `.sidebar` | Two-column: fixed sidebar + fluid main |
| `.cover` | Full-viewport column with centered middle child |
| `.grid` | Auto-fitting grid (`auto-fit + minmax`) |

Page-context helpers: `.container` (max-width + padding), `.section`, `.wrapper`, `.full-bleed`.

Layout tokens are declared inline on `:root` inside the layer block — they're overridable per-instance via `style="--stack-gap: …"`.

### `slashed.components` — `optional/components.css`

Pre-built UI blocks. Every value via `var()`. Each component is self-contained. Requires `components.tokens.css`.

Included: `.btn`, `.card`, `.badge`, `.alert`, form elements (`.input`, `.textarea`, `.select`, `.form-group`), `.modal`, `.nav`, `.avatar`.

### `slashed.utilities` — `optional/utilities.css`

Single-purpose helpers. Subordinate in the cascade — components always win. Covers: spacing (margin/padding/gap), typography, color, display, flexbox, width/height, overflow, position, radius, shadow, cursor, opacity, miscellaneous.

**When to reach for utilities:** layout tweaks and one-off adjustments where authoring a BEM class would be overkill. If a pattern repeats, extract it to a BEM block.

### `slashed.states` — `core/states.css`

Global `.is-*` state markers. The `.is-*` prefix is exclusive to this layer — utilities never use it. Components may add visual prescriptions on top of these markers using their own specificity.

### `slashed.themes` — `optional/themes.css`

Token overrides only — no new rules. Mechanism: re-declare semantic aliases from `tokens`. Because `components` and `utilities` use `var()`, theme changes propagate automatically.

Includes: dark mode (media query + `[data-theme="dark"]`), forced colors / high contrast, brand palette themes.

### `slashed.motion` — `optional/motion.css`

Animation tokens, keyframe definitions, transition utilities, and animation utility classes. No component selectors here — components reference `--transition-*` tokens directly.

### `slashed.accessibility` — `core/accessibility.css`

Focus management, screen-reader helpers, and reduced-motion token resets. Positioned high in the layer stack so it can override motion from `motion` without `!important`.

Includes: `:focus-visible` styles, `.sr-only` / `.visually-hidden`, `.skip-link`, `@media (prefers-reduced-motion)` token resets, `@media (forced-colors: active)` adjustments.

### `slashed.print` — `core/print.css`

Everything inside `@media print {}`. `!important` is permitted here — print is an isolated context. Hides interactive chrome, expands links, enforces page break rules.

---

## Token derivation rules

New tokens must follow existing derivation patterns:

- **Colors:** `color-mix()` for tints/shades, `light-dark()` for mode-aware aliases
- **Sizing:** `clamp(min, preferred, max)` for fluid scaling — never bare viewport units in tokens
- **Aliases:** semantic tokens always reference palette tokens via `var()` — never literals
- **Component tokens:** always `var(--global-token)` — never literals

Magic numbers in framework CSS are bugs. Every value a consumer might want to change must be a custom property.

---

## Specificity model

```
unlayered consumer CSS         (highest — beats everything)
├── @layer slashed.overrides   (consumer escape hatch)
├── @layer slashed.print
├── @layer slashed.accessibility
├── @layer slashed.motion
├── @layer slashed.themes
├── @layer slashed.states
├── @layer slashed.utilities
├── @layer slashed.components
├── @layer slashed.layout
├── @layer slashed.base
├── @layer slashed.reset
└── @layer slashed.tokens      (lowest)
```

Within a layer, standard specificity rules apply. The framework keeps selectors as low-specificity as possible (single class, `:root`, element) to ensure consumer overrides win without `!important`.

---

## Responsive design model

Three layers, in strict preference order:

1. **Fluid tokens** (`clamp()`) — reach for these first; they scale with the viewport with no `@media` rule at all
2. **Container-aware primitives** (`@container`) — layout primitives respond to their own container, not the viewport
3. **Breakpoint utilities** (`@media min-width`) — discrete viewport-level switches only when 1 and 2 are insufficient

Breakpoint values: `sm: 30em / md: 48em / lg: 64em / xl: 80em`. CSS custom properties cannot be used inside `@media` queries — these values are hardcoded where needed.

---

## Consumer authoring model

SLASHED is BEM-first. The pre-built `.sf-*` components (when adopted) are a convenience layer — consumers may ignore them entirely and author their own BEM blocks styled with framework tokens. Both paths are equally idiomatic.

BEM naming rules apply identically in both cases:
- `__` for elements: `.block__element`
- `--` for modifiers: `.block--modifier` or `.block__element--modifier`
- No element-of-element nesting in class names
- kebab-case throughout
- `.sf-*` namespace reserved for framework-shipped components

---

## Extension points

| Mechanism | How |
|-----------|-----|
| Token override | `:root { --color-primary: #your-color }` in your own CSS |
| Component instance token | `style="--button-radius: var(--radius-full)"` on the element |
| Layer override | Write rules into `@layer overrides { … }` |
| Unlayered CSS | Author normally — beats all framework layers automatically |
| Theme | `[data-theme="your-theme"] { --color-primary: … }` |
