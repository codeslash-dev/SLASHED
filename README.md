# SLASHED

**S**tandalone · **L**ean · **A**gnostic · **S**tructured · **H**ybrid · **E**dgeless · **D**eterministic

A cascade-layer CSS framework. No build step. No Node. No runtime dependencies.

---

## Quick start

```html
<link rel="stylesheet" href="core/layers.css">
<link rel="stylesheet" href="core/tokens.css">
<link rel="stylesheet" href="core/reset.css">
<link rel="stylesheet" href="core/base.css">
<link rel="stylesheet" href="core/layout.css">
<link rel="stylesheet" href="core/states.css">
<link rel="stylesheet" href="core/accessibility.css">
<link rel="stylesheet" href="core/print.css">

<link rel="stylesheet" href="optional/components.css">
<link rel="stylesheet" href="optional/utilities.css">
<link rel="stylesheet" href="optional/themes.css">
<link rel="stylesheet" href="optional/motion.css">
```

---

## Modules

### Core

| File | Layer |
|------|-------|
| `core/layers.css` | — |
| `core/tokens.css` | `slashed.tokens` |
| `core/reset.css` | `slashed.reset` |
| `core/base.css` | `slashed.base` |
| `core/layout.css` | `slashed.layout` |
| `core/states.css` | `slashed.states` |
| `core/accessibility.css` | `slashed.accessibility` |
| `core/print.css` | `slashed.print` |

### Optional

| File | Layer |
|------|-------|
| `optional/components.css` | `slashed.components` |
| `optional/components.tokens.css` | `slashed.tokens` |
| `optional/utilities.css` | `slashed.utilities` |
| `optional/themes.css` | `slashed.themes` |
| `optional/motion.css` | `slashed.motion` |

`components.tokens.css` is loaded automatically by `components.css`.

---

## Authoring

BEM-first. Use framework tokens — theming and dark mode work automatically.

```css
.product-card {
  background: var(--sf-color-surface);
  border-radius: var(--sf-radius-l);
  box-shadow: var(--sf-shadow-s);
}
```

---

## Layer order

```text
slashed.tokens → slashed.reset → slashed.base → slashed.layout →
slashed.components → slashed.utilities → slashed.states →
slashed.themes → slashed.motion → slashed.accessibility →
slashed.print → slashed.overrides
```

`slashed.overrides` has no framework file — consumer escape hatch. Unlayered CSS beats all layers automatically.
