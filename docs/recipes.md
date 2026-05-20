# SLASHED recipes

Practical patterns for common customisation tasks. Each recipe lands in your own stylesheet (or a `<style>` block); none of them require rebuilding the framework.

---

## 1. Custom brand colors

Four equivalent ways to recolor SLASHED. Pick whichever fits your input format and how much per-mode control you want.

```css
/* (a) light-dark() shorthand: one line per resolved token */
:root {
  --sf-color-primary:   light-dark(#3b5bdb, #748ffc);
  --sf-color-action:    light-dark(#0ca678, #38d9a9);
  --sf-color-base:      light-dark(#f8f9fa, #1a1b1e);
}

/* (b) Separate -light / -dark sources: full per-mode control */
:root {
  --sf-color-primary-light: oklch(0.45 0.20 264);
  --sf-color-primary-dark:  oklch(0.75 0.18 264);
}

/* (c) OKLCH only on -light: dark auto-derives via the curve */
:root {
  --sf-color-primary-light: oklch(0.45 0.20 264);
}

/* (d) Hex / hsl / rgb only on -light: any color() input is fine */
:root {
  --sf-color-primary-light: #3b5bdb;
  --sf-color-action-light:  hsl(170 90% 35%);
  --sf-color-neutral-light: rgb(73 80 87);
}
```

Approach (c) is the smallest change for a quick rebrand. Approach (b) is best when the auto-derived dark value is not quite right. Approach (a) is one line per token but skips the curve entirely. Approach (d) lets you paste designer hex codes directly.

---

## 2. Scoped theming via `data-theme` nesting

A page can host multiple themes simultaneously by scoping token overrides to `[data-theme="..."]` blocks.

```html
<body data-theme="light">
  <main>... default light theme ...</main>

  <aside data-theme="dark">
    <p>This panel inherits dark tokens regardless of OS preference.</p>
  </aside>

  <section data-theme="brand-purple">
    <h2>Brand purple section</h2>
  </section>
</body>
```

```css
[data-theme="dark"] {
  color-scheme: dark;
}
[data-theme="brand-purple"] {
  --sf-color-primary-light: oklch(0.55 0.22 300);
  --sf-color-action-light:  oklch(0.62 0.18 290);
}
```

Token overrides cascade into the subtree, so any descendants reading `--sf-color-primary` resolve to the scoped value. The default `:root` rule keeps governing everything outside the scoped block.

---

## 3. Forced-colors testing

Forced-colors mode (Windows High Contrast, custom OS palettes) is hard to validate manually because turning it on switches every app at once. Chrome DevTools can emulate it per page.

```text
1. Open DevTools.
2. Cmd/Ctrl+Shift+P, type "Show Rendering", open the panel.
3. Scroll to "Emulate CSS media feature forced-colors".
4. Switch to "active".
```

The `core/accessibility.css` block under `@media (forced-colors: active)` swaps SLASHED tokens to `CanvasText`, `Canvas`, `LinkText` and friends, which the OS overrides to the user's chosen palette. To verify your own components participate, give every author rule that paints a border or background a fallback that uses `CanvasText` when forced-colors is active:

```css
.my-card {
  border: 1px solid var(--sf-color-border);
}
@media (forced-colors: active) {
  .my-card { border-color: CanvasText; }
}
```

---

## 4. Custom shadow tinting

`--sf-shadow-color` is an OKLCH `L C H` triple (no parentheses). The shadow tokens build their alpha around it, so you only need to override one line to tint every shadow.

```css
:root {
  /* Cool blue-tinted shadows */
  --sf-shadow-color: 0.2 0.05 260;
}

[data-theme="warm"] {
  /* Warm sepia shadow */
  --sf-shadow-color: 0.25 0.06 60;
}

.my-button {
  box-shadow: var(--sf-shadow-m);
  /* Inherits the tinted color via --sf-shadow-color */
}
```

Pair it with `--sf-shadow-base-strength` and `--sf-shadow-dark-boost` for finer tuning of the alpha curve.

---

## 5. Custom font with feature and variation overrides

SLASHED auto-wires `font-feature-settings`, `font-variation-settings` and `font-optical-sizing` on body, headings and mono. You enable them by overriding the per-family token.

```css
:root {
  --sf-font-body:    "Inter", system-ui, sans-serif;
  --sf-font-heading: "Inter Display", "Inter", system-ui, sans-serif;
  --sf-font-mono:    "JetBrains Mono", ui-monospace, monospace;

  /* Inter cv11 = single-storey g, ss01 = curly l */
  --sf-font-features-body:    "cv11", "ss01";
  --sf-font-features-heading: "cv11", "ss01", "case";

  /* Variable-font axis: optical size + slight grade */
  --sf-font-variation-heading: "opsz" 32, "GRAD" 50;

  /* JetBrains Mono ligatures */
  --sf-font-features-mono: "calt", "liga";
}
```

The display slot has no auto-wire target. Apply it on your own display class:

```css
.display {
  font-family: var(--sf-font-display);
  font-feature-settings: var(--sf-font-features-display);
  font-variation-settings: var(--sf-font-variation-display);
}
```

---

## 6. Tuning the fluid scale

Two multipliers reshape the entire fluid ladder without touching individual tokens.

```css
/* Compact UI: shrink spacing and text 12% */
[data-density="compact"] {
  --sf-space-scale: 0.88;
  --sf-text-scale:  0.88;
}

/* Reading mode: bump text only */
.reading-mode {
  --sf-text-scale: 1.15;
}

/* Hero section: dial display sizes only */
.hero {
  --sf-text-display-scale: 1.25;
}
```

Both scales multiply through every clamp() expression they participate in, so the fluid response stays smooth at every viewport width. Combine with `--sf-radius-scale` and `--sf-motion-scale` for a per-density preset.

---

## 7. Animation presets in author classes

The eight `--sf-animation-*` tokens are full `animation` shorthands. Reference them directly from your own class.

```css
.toast {
  animation: var(--sf-animation-slide-in-up);
}

.modal__panel {
  animation: var(--sf-animation-scale-up);
}

.notification--exit {
  animation: var(--sf-animation-fade-out);
}

.menu-item:hover {
  animation: var(--sf-animation-slide-in-right);
}
```

Reduced-motion is honoured automatically: `core/accessibility.css` zeros every `--sf-duration-*` and forces `animation-duration: 0s !important`, so users who request reduced motion see the end state without a transition.

---

## 8. Using `@starting-style` for popover and dialog

Top-layer elements (`<dialog>`, `[popover]`) need a starting style to animate into the open state. SLASHED provides one for the default open transition; you can layer an animation preset on top.

```html
<button popovertarget="menu">Menu</button>
<div id="menu" popover>...</div>
```

```css
[popover] {
  border: 1px solid var(--sf-color-border);
  border-radius: var(--sf-radius-m);
  padding: var(--sf-space-m);
  background: var(--sf-color-raised);
  box-shadow: var(--sf-shadow-l);
}

/* Replace the framework's default scale-from-0.95 with a slide */
[popover]:popover-open {
  animation: var(--sf-animation-slide-in-down);
}
```

The framework's `@starting-style` block in `core/motion.css` covers the gracefully-degrade case: even without the override above, the popover fades and scales in.

---

## 9. Container queries with `--sf-cq-*` tokens

Component-scoped breakpoints. Wrap the component in `.sf-container` (or any element with `container-type: inline-size`) and query against the size tokens.

```html
<article class="sf-container card">
  <h2 class="card__title">Title</h2>
  <p class="card__body">Body copy.</p>
  <button class="card__action">Action</button>
</article>
```

```css
.card {
  display: grid;
  gap: var(--sf-content-gap);
}

@container (min-width: var(--sf-cq-md)) {
  .card {
    grid-template-columns: 1fr auto;
    align-items: baseline;
  }
}

@container (min-width: var(--sf-cq-lg)) {
  .card__title { font-size: var(--sf-text-2xl); }
}
```

The same card works at any width because the layout reacts to its container, not the viewport. Drop it inside a sidebar at 320px or a hero at 1280px and it adapts both times.
