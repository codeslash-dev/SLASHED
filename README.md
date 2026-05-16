# SLASHED

**S**tandalone · **L**ean · **A**gnostic · **S**tructured · **H**ybrid · **E**dgeless · **D**eterministic

A cascade-layer CSS framework. No build step. No Node. No runtime dependencies. Link a file — it works.

---

## Quick start

### Full bundle (everything)

```html
<link rel="stylesheet" href="main.css">
```

### Selective (core only — tokens + reset + base + layout)

```html
<link rel="stylesheet" href="core/tokens.css">
<link rel="stylesheet" href="core/reset.css">
<link rel="stylesheet" href="core/base.css">
<link rel="stylesheet" href="core/layout.css">
```

Or mix in what you need:

```html
<!-- Core always -->
<link rel="stylesheet" href="core/tokens.css">
<link rel="stylesheet" href="core/reset.css">
<link rel="stylesheet" href="core/base.css">
<link rel="stylesheet" href="core/layout.css">
<link rel="stylesheet" href="core/states.css">
<link rel="stylesheet" href="core/accessibility.css">
<link rel="stylesheet" href="core/print.css">

<!-- Optional — pick what you need -->
<link rel="stylesheet" href="optional/components.tokens.css">
<link rel="stylesheet" href="optional/components.css">
<link rel="stylesheet" href="optional/utilities.css">
<link rel="stylesheet" href="optional/themes.css">
<link rel="stylesheet" href="optional/motion.css">
```

---

## Module overview

### Core — always loaded

| File | Layer | What's inside |
|------|-------|---------------|
| `core/tokens.css` | `tokens` | Global design tokens — colors, spacing, typography, radii, shadows, z-index, transitions |
| `core/reset.css` | `reset` | Browser normalization. No design decisions. No `var()` |
| `core/base.css` | `base` | Opinionated element defaults — headings, links, code, tables. All values via tokens |
| `core/layout.css` | `layout` | Composable primitives: `.stack`, `.cluster`, `.sidebar`, `.cover`, `.grid`, `.container` |
| `core/states.css` | `states` | Global state markers: `.is-hidden`, `.is-disabled`, `.is-loading`, `.is-active`, … |
| `core/accessibility.css` | `accessibility` | Focus styles, `.sr-only`, `.skip-link`, reduced-motion token reset |
| `core/print.css` | `print` | Print-only overrides inside `@media print` |

### Optional — load only what you need

| File | Layer | What's inside |
|------|-------|---------------|
| `optional/components.tokens.css` | `tokens` | Component-scoped token defaults (button sizing, card radius, input padding, …) |
| `optional/components.css` | `components` | Pre-built UI: button, card, badge, alert, form elements, modal, nav, avatar |
| `optional/utilities.css` | `utilities` | Single-purpose helpers — spacing, typography, display, flexbox, color, cursor |
| `optional/themes.css` | `themes` | Dark mode, forced colors, and brand palette token overrides |
| `optional/motion.css` | `motion` | Keyframes, transition utilities, animation classes |

---

## Authoring your own components

SLASHED is BEM-first. The pre-built components in `optional/components.css` are a convenience layer — you don't have to use them. Write your own:

```html
<article class="product-card">
  <div class="product-card__media">…</div>
  <div class="product-card__body">
    <h2 class="product-card__title">…</h2>
    <p class="product-card__price">…</p>
  </div>
  <div class="product-card__footer">
    <button class="product-card__cta">…</button>
  </div>
</article>
```

```css
.product-card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  /* ... */
}
```

Use framework tokens everywhere — `var(--spacing-4)`, `var(--color-primary)`, `var(--radius-md)` — and theming and dark mode work automatically.

---

## Layer hierarchy

Layers are declared once in `main.css`. Specificity order, low → high:

```
tokens → reset → base → layout → components → utilities →
states → themes → motion → accessibility → print → overrides
```

`overrides` has no framework file — it is the consumer's escape hatch. Any unlayered CSS you write also beats all framework layers, so you never need `!important` to override the framework.

---

## Responsive design

Three layers, in order of preference:

1. **Fluid tokens** — `--spacing-*`, `--font-size-*` use `clamp()` and scale with the viewport. Reach for these first; no `@media` rule needed.
2. **Container-aware primitives** — `.grid`, `.sidebar`, and other layout primitives respond to their container via `@container`.
3. **Breakpoints** — `sm: 30em / md: 48em / lg: 64em / xl: 80em`. Use only when (1) and (2) are not enough.

---

## Philosophy

See [`PHILOSOPHY.md`](PHILOSOPHY.md).
