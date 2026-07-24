# SLASHED Cookbook

Task-oriented recipes: *"I want to build X"* → the markup and the tokens that
get you there. Every recipe is copy-paste ready and works in light and dark
mode with no extra CSS. For the reasoning behind each choice, follow the links
into the [LLM guide](llm-guide.md).

These recipes lean on the **optimal** bundle. Recipes that use `.sf-btn` or
`.sf-card` note that they need the **full** bundle.

- [Page shell](#page-shell)
- [Vertical rhythm (stack)](#vertical-rhythm-stack)
- [Card grid](#card-grid)
- [Hero / landing section](#hero--landing-section)
- [Sidebar layout](#sidebar-layout)
- [Long-form article (prose)](#long-form-article-prose)
- [A surface / panel](#a-surface--panel)
- [Buttons and actions](#buttons-and-actions)
- [Interactive states](#interactive-states)
- [Rebrand + dark-mode toggle](#rebrand--dark-mode-toggle)
- [Local tweaks without new tokens](#local-tweaks-without-new-tokens)

---

## Page shell

Centre and constrain content with `.sf-container`; it caps line length and adds
responsive side padding.

```html
<header class="sf-container"> … </header>
<main class="sf-container"> … </main>
<footer class="sf-container"> … </footer>
```

Width variants: `.sf-container--narrow`, `.sf-container--wide`,
`.sf-container--full`, `.sf-container--prose` (ideal reading measure).

---

## Vertical rhythm (stack)

`.sf-stack` puts consistent space **between** children — never margins on the
children themselves.

```html
<div class="sf-stack">
  <h2>Section title</h2>
  <p>First paragraph.</p>
  <p>Second paragraph.</p>
</div>
```

Tune the gap per-instance with a size modifier (`.sf-stack--s` …
`.sf-stack--2xl`) or globally with the `--sf-stack-gap` knob. See
[layout.md](layout.md).

---

## Card grid

A responsive grid that fits as many columns as will fit — no media queries.

```html
<ul class="sf-grid sf-grid--fit">
  <li class="sf-card">Card one</li>
  <li class="sf-card">Card two</li>
  <li class="sf-card">Card three</li>
</ul>
```

- `.sf-grid--fit` auto-fits columns based on `--sf-grid-min` (the minimum
  column width). Set `--sf-grid-min` to change the breakpoint density.
- `.sf-card` needs the **full** bundle. On the optimal bundle, use
  `.sf-surface` for the same panel look.
- Want a tighter grid? Set `--sf-grid-gap: var(--sf-space-s)` on the `<ul>`
  instead of writing a new class.

---

## Hero / landing section

`.sf-cover` vertically centres a headline block within a minimum-height region;
`.sf-section` adds generous top/bottom padding.

*(The `.sf-btn` buttons below need the **full** bundle; the layout itself works
on optimal.)*

```html
<section class="sf-section sf-cover">
  <div class="sf-container sf-stack">
    <h1>Ship your design system, not a build step.</h1>
    <p class="sf-text-l">One stylesheet. Six tokens to rebrand. Dark mode free.</p>
    <div class="sf-cluster">
      <a class="sf-btn sf-btn--primary" href="#">Get started</a>
      <a class="sf-btn sf-btn--outline" href="#">Read the docs</a>
    </div>
  </div>
</section>
```

`.sf-cluster` lays out the buttons in a row that wraps gracefully on small
screens. Section padding scales with `--sf-section-pad`.

---

## Sidebar layout

A content area with a sidebar that collapses below a threshold — again, no
breakpoints.

```html
<div class="sf-sidebar">
  <aside> … navigation … </aside>
  <main> … content … </main>
</div>
```

`.sf-sidebar--right` flips the side; `.sf-sidebar--wide` /
`.sf-sidebar--narrow` change the sidebar's target width, tuned by
`--sf-sidebar-width`. The pair wraps to a single column automatically when the
main content can no longer fit alongside — no breakpoints. See
[layout.md](layout.md).

---

## Long-form article (prose)

`.sf-prose` styles a block of raw HTML (headings, lists, blockquotes, code)
into a readable article — the one place you *want* rich classless typography.

```html
<article class="sf-container--prose sf-prose">
  <h1>Title</h1>
  <p>Body copy with <a href="#">links</a>, <code>inline code</code>, lists…</p>
  <blockquote>Pull quote.</blockquote>
</article>
```

Wrap anything you must exclude from prose styling in `.sf-not-prose`.

---

## A surface / panel

`.sf-surface` is the classless-friendly card look available in **every**
bundle: padded, rounded, elevated, theme-aware.

```html
<div class="sf-surface sf-stack">
  <h3>Panel title</h3>
  <p>Content on a raised surface.</p>
</div>
```

Semantic variants tint the surface: `.sf-surface--neutral`,
`.sf-surface--secondary`, `.sf-surface--success`, `.sf-surface--danger`,
`.sf-surface--info`, `.sf-surface--warning`, `.sf-surface--inverse`.

---

## Buttons and actions

*(Requires the **full** bundle.)*

```html
<button class="sf-btn sf-btn--primary">Primary</button>
<button class="sf-btn sf-btn--secondary">Secondary</button>
<button class="sf-btn sf-btn--outline">Outline</button>
<button class="sf-btn sf-btn--danger">Delete</button>
```

Sizes: `.sf-btn--xs` … `.sf-btn--xl`. Full-width: `.sf-btn--block`. Text
colour on coloured buttons uses the `--sf-color-text--on-*` auto-contrast
tokens, so it stays legible in both themes for free.

---

## Interactive states

State classes map to ARIA and drive visuals — toggle them from your JS instead
of editing inline styles. *(The `.sf-btn` / `.sf-card` examples need the
**full** bundle.)*

Pair each state class with the matching semantics: `aria-selected` needs a
`role="option"` inside a `role="listbox"` (a bare `<li>` does not support it),
and a disabled `<button>` needs the native `disabled` attribute — `aria-disabled`
only exposes the state, it does not block activation.

```html
<button class="sf-btn sf-btn--primary sf-is-loading" aria-busy="true">Saving…</button>

<ul role="listbox" aria-label="Choices">
  <li role="option" class="sf-card sf-is-selected" aria-selected="true">Chosen</li>
</ul>

<button class="sf-btn sf-is-disabled" disabled>Unavailable</button>
```

The full catalogue and its ARIA mapping is in [states.md](states.md). Prefer a
shimmer placeholder while loading? Use `.sf-is-shimmer`.

---

## Rebrand + dark-mode toggle

```css
/* your overrides — no !important needed */
:root {
  --sf-color-primary-source-light: #7048e8;
  --sf-color-base-source-light:    #f8f9fa;
}
```

```html
<button id="theme" type="button">Toggle theme</button>
<script>
  const root = document.documentElement;
  document.getElementById('theme').addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  });
</script>
```

Toggle the **attribute**, never the CSS variables — the framework recomputes the
whole palette from `data-theme`. Add `class="sf-theme-transition"` on `<html>`
for a smooth cross-fade.

---

## Local tweaks without new tokens

When you need a one-off variation, compose with `calc()` or override an existing
knob — do **not** invent a new token.

```css
/* ✓ a roomier hero — compose from the existing token */
.hero { padding-block: calc(var(--sf-section-pad) * 1.5); }

/* ✓ a tighter grid — set the knob, don't write .sf-grid--tight */
.compact-grid { --sf-grid-gap: var(--sf-space-s); }
```

Why: new tokens fragment the system and skip dark-mode derivation. The full set
of anti-patterns is in [Best Practices](llm-guide.md#14-best-practices).

---

## More building blocks

This cookbook covers the common cases. The complete class inventory —
`.sf-switcher`, `.sf-reel`, `.sf-frame`, `.sf-bento`, `.sf-center`,
`.sf-imposter`, overflow-fade, scroll-snap, and the rest — is in
[layout.md](layout.md), [macros.md](macros.md), and the generated
[classes.md](classes.md).
