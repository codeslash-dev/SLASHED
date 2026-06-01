# Dark-mode cookbook

Dark mode in SLASHED is automatic: dark colours derive from the six `-light`
source tokens, and `data-theme` flips `color-scheme`. These recipes cover the
common "but I need…" cases. See also the [theming guide](theming.md).

## 1. Default — follow the OS

Do nothing. With no `data-theme`, `:root` follows
`@media (prefers-color-scheme)`.

```html
<html> … </html>
```

## 2. A manual toggle

Flip `data-theme` on `<html>`. Persist the choice and animate the swap with a
view transition (falls back to an instant swap where unsupported):

```html
<button id="theme-toggle" aria-pressed="false">Toggle theme</button>
```

```js
const root = document.documentElement;
const btn = document.getElementById('theme-toggle');
const apply = (t) => {
  root.dataset.theme = t;
  localStorage.theme = t;
  btn.setAttribute('aria-pressed', String(t === 'dark'));
};

// restore on load
if (localStorage.theme) apply(localStorage.theme);

btn.addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  if (document.startViewTransition) document.startViewTransition(() => apply(next));
  else apply(next);
});
```

The `::view-transition(root)` cross-fade is already styled in
`core/motion.css` and respects `prefers-reduced-motion`.

## 3. A permanently dark header on a light page

Scope `data-theme` to the region. SLASHED re-declares all mode-sensitive tokens
on `[data-theme]` elements, so colours, text, borders, and links all switch
correctly — not just `color-scheme`:

```html
<header data-theme="dark"> … </header>
<main> … </main>
```

Works on any element: `<section>`, `<aside>`, `<div>`, `<article>`, etc.
Requires browsers that support CSS relative colour syntax (Chrome 119+,
Safari 17.2+, Firefox 128+). Older browsers fall back to root colours
gracefully — no visible breakage.

## 4. A light card inside a dark page

The same mechanism works in reverse — nest `data-theme="light"` anywhere inside
a dark page:

```html
<html data-theme="dark">
  …
  <article data-theme="light" class="sf-box">Always-light card</article>
```

## 5. Tweaking a single dark value

Auto-derivation is usually right, but you can override any one mode without
touching the other by setting the `-dark` token on `:root`:

```css
:root {
  --sf-color-base-dark: oklch(0.18 0.01 280); /* a slightly warmer dark bg */
}
```

All derived tokens (surfaces, text, borders) automatically re-compute from the
new value.

## 6. Manual per-token colour override

To override a resolved token directly — bypassing auto-derivation entirely —
use the token name in `slashed.overrides` or unlayered CSS:

```css
/* Always dark regardless of mode */
:root { --sf-color-text: oklch(0.93 0.005 250); }

/* Dark-mode only override (two selectors cover forced + OS-preference dark) */
:root[data-theme="dark"] {
  --sf-color-primary: oklch(0.72 0.20 280);
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    --sf-color-primary: oklch(0.72 0.20 280);
  }
}
```

Or simpler with the `-dark` source token (preferred):

```css
:root { --sf-color-primary-dark: oklch(0.72 0.20 280); }
```

## 7. Boosting dark-mode contrast

`--sf-contrast-bias` lightens reading text in dark mode (and darkens it in
light mode) as it increases:

```css
[data-theme="dark"] { --sf-contrast-bias: 0.04; }
```

## 8. Per-section brand palette

Combine `[data-theme]` with `[data-brand]` to switch both the palette and the
mode in one element:

```css
/* In slashed.themes: */
[data-brand="night"] {
  --sf-color-primary-light: oklch(0.55 0.22 240);
  --sf-color-base-light:    oklch(0.985 0.003 240);
}
```

```html
<section data-brand="night" data-theme="dark">
  Dark section with a custom palette
</section>
```

## Gotchas

- **Don't transition every colour globally.** A blanket `transition: all` on
  `*` while toggling themes is a paint footgun. Use the opt-in
  `.theme-transition` class (see `optional/theme-example.css`) only while the
  toggle is in flight, or rely on the view transition.
- **`color-scheme` matters for form controls and scrollbars.** SLASHED flips it
  for you via `data-theme`; if you hand-roll a theme, set `color-scheme` too.
- **Images/illustrations don't auto-adapt.** Swap art with
  `<picture>` + `prefers-color-scheme`, or dim with a token-driven overlay.
- **Older browsers (pre-2023) skip section-level theming.** The re-declaration
  block is gated behind `@supports (color: oklch(from red l c h))`. Browsers
  that predate relative colour syntax (Chrome < 119, Safari < 17.2, FF < 128)
  will still have `color-scheme` and `--sf-is-dark` set correctly — only the
  explicit token values fall back to the root's values.
