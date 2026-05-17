# SLASHED

**S**tandalone · **L**ean · **A**gnostic · **S**tructured · **H**ybrid · **E**dgeless · **D**eterministic

A cascade-layer CSS framework. No build step. No Node. No runtime dependencies. Link a file — it works.

---

## Quick start

Load `layers.css` first — it declares the cascade layer order. Then link whatever modules you need:

```html
<!-- Always first — sets cascade layer order -->
<link rel="stylesheet" href="layers.css">

<!-- Core -->
<link rel="stylesheet" href="core/tokens.css">
<link rel="stylesheet" href="core/reset.css">
<link rel="stylesheet" href="core/base.css">
<link rel="stylesheet" href="core/layout.css">
<link rel="stylesheet" href="core/states.css">
<link rel="stylesheet" href="core/accessibility.css">
<link rel="stylesheet" href="core/print.css">

<!-- Optional — pick what you need -->
<link rel="stylesheet" href="optional/components.css">
<link rel="stylesheet" href="optional/utilities.css">
<link rel="stylesheet" href="optional/themes.css">
<link rel="stylesheet" href="optional/motion.css">
```

---

## Module overview

### Core

| File | Layer | What's inside |
|------|-------|---------------|
| `core/tokens.css` | `slashed.tokens` | Global design tokens — colors, spacing, typography, radii, shadows, z-index, transitions |
| `core/reset.css` | `slashed.reset` | Browser normalization. No design decisions. No `var()` |
| `core/base.css` | `slashed.base` | Opinionated element defaults — headings, links, code, tables. All values via tokens |
| `core/layout.css` | `slashed.layout` | Composable primitives: `.stack`, `.cluster`, `.sidebar`, `.cover`, `.grid`, `.container` |
| `core/states.css` | `slashed.states` | Global state markers: `.is-hidden`, `.is-disabled`, `.is-loading`, `.is-active`, … |
| `core/accessibility.css` | `slashed.accessibility` | Focus styles, `.sr-only`, `.skip-link`, reduced-motion token reset |
| `core/print.css` | `slashed.print` | Print-only overrides inside `@media print` |

### Optional

| File | Layer | What's inside |
|------|-------|---------------|
| `optional/components.css` | `slashed.components` | Pre-built UI: button, card, badge, alert, form elements, modal, nav |
| `optional/utilities.css` | `slashed.utilities` | Single-purpose helpers — spacing, typography, display, flexbox, color, cursor |
| `optional/themes.css` | `slashed.themes` | Dark mode, forced colors, and brand palette token overrides |
| `optional/motion.css` | `slashed.motion` | Keyframes, transition utilities, animation classes |

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
  background: var(--sf-color-surface);
  border-radius: var(--sf-radius-l);
  box-shadow: var(--sf-shadow-s);
  /* ... */
}
```

Use framework tokens everywhere — `var(--sf-spacing-4)`, `var(--sf-color-primary)`, `var(--sf-radius-m)` — and theming and dark mode work automatically.

---

## Layer hierarchy

Layers are declared once in `layers.css`. Specificity order, low → high:

```text
slashed.tokens → slashed.reset → slashed.base → slashed.layout →
slashed.components → slashed.utilities → slashed.states →
slashed.themes → slashed.motion → slashed.accessibility →
slashed.print → slashed.overrides
```

`slashed.overrides` has no framework file — it is the consumer's escape hatch. Any unlayered CSS you write also beats all framework layers, so you never need `!important` to override the framework.

---

## Responsive design

Three layers, in order of preference:

1. **Fluid tokens** — `--sf-spacing-*`, `--sf-text-*` use `clamp()` and scale with the viewport. Reach for these first; no `@media` rule needed.
2. **Container-aware primitives** — `.grid`, `.sidebar`, and other layout primitives respond to their container via `@container`.
3. **Breakpoints** — `sm: 30em / md: 48em / lg: 64em / xl: 80em`. Use only when (1) and (2) are not enough.
