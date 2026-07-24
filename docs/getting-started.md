# Getting Started with SLASHED

The fastest path from zero to a styled page — for humans and for LLM agents.
This page answers the four questions the token reference does not: **how do I
load it, which bundle do I pick, what is the minimal boilerplate, and what do I
do first.** For the exhaustive API, follow the links in
[Where to go next](#where-to-go-next).

---

## 1. Add one stylesheet

SLASHED ships as plain CSS with no runtime dependency and nothing to compile.
Via the CDN it needs no Node or build step at all; the npm path below installs
the same stylesheet through your package manager and resolves it with a bundler.

### CDN (fastest)

```html
<link rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/codeslash-dev/SLASHED@dist/slashed.optimal.min.css">
```

### npm

```bash
npm install slashed
```

```css
/* in your own CSS */
@import "slashed/optimal";   /* recommended bundle */
/* or */
@import "slashed";           /* the full bundle (adds .sf-btn / .sf-card + utilities) */
```

The package exposes the bundles as subpath imports: `slashed` and
`slashed/full` resolve to the full bundle, `slashed/optimal` to the optimal
one, and `slashed/flat` to a layer-flattened variant for tooling that cannot
parse `@layer`.

---

## 2. Pick a bundle

| Bundle | Load this when… | Adds over `optimal` |
| --- | --- | --- |
| `slashed.optimal.css` | **default choice** — you build your own components on the token API | — |
| `slashed.full.css` | you want the shipped `.sf-btn` / `.sf-card` components and the curated utility helpers | component + utility layers |

Both ship as readable, `.min` (with source map), and `.flat` (layer-flattened)
variants on the [CDN](https://cdn.jsdelivr.net/gh/codeslash-dev/SLASHED@dist/).
When in doubt, start with **optimal** — you can switch to full later by changing
one URL.

> À la carte loading of individual `core/` and `optional/` files is possible
> but rarely needed — see the README's *À la carte* section. If you go that
> route, `core/layers.css` must load **first**.

---

## 3. Minimal boilerplate

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet"
    href="https://cdn.jsdelivr.net/gh/codeslash-dev/SLASHED@dist/slashed.optimal.min.css">
  <title>My SLASHED page</title>
</head>
<body>
  <main class="sf-container">
    <div class="sf-stack">
      <h1>Hello, SLASHED</h1>
      <p>Base elements are styled with no classes. Layout uses primitives.</p>
    </div>
  </main>
</body>
</html>
```

That is a complete, responsive, dark-mode-ready page. `.sf-container` centres
and constrains the content; `.sf-stack` spaces its children with a consistent
rhythm. Everything else — headings, paragraphs, links — is styled **classless**
from `core/base.css`.

---

## 4. Dark mode is already on

No script, no flash of the wrong theme. The page follows the OS preference out
of the box. To force a mode, set one attribute:

```html
<html data-theme="dark">      <!-- force dark for the whole page -->
<section data-theme="dark">   <!-- a dark section inside a light page -->
```

You do **not** write any dark-mode CSS. Every colour derives automatically from
the source tokens via `light-dark()` and relative colour syntax.

---

## 5. Make it yours — rebrand in six tokens

Override six source colours in the reserved `slashed.overrides` space (plain
`:root` works — the overrides layer sits last, so no `!important` needed):

```css
:root {
  --sf-color-primary-source-light:   #3b5bdb;
  --sf-color-secondary-source-light: #5c677d;
  --sf-color-tertiary-source-light:  #0c8599;
  --sf-color-action-source-light:    #0ca678;
  --sf-color-neutral-source-light:   #495057;
  --sf-color-base-source-light:      #f8f9fa;
}
```

Every hover state, tint, shade, tonal step, the four status colours, and the
whole dark palette derive from those six. Prefer to design visually? Open the
[configurator](https://slashed.codeslash.dev/configurator/) and export the
override CSS.

---

## 6. The one rule that matters

**Never hardcode a visual value.** Reach for a token instead:

```css
/* ✗ hardcoded — breaks consistency and dark mode */
.promo { padding: 24px; border-radius: 8px; box-shadow: 0 2px 8px #0002; }

/* ✓ token-first — one knob changes it everywhere */
.promo {
  padding: var(--sf-space-m);
  border-radius: var(--sf-radius-m);
  box-shadow: var(--sf-shadow-m);
}
```

This single habit keeps your design consistent and makes dark mode automatic.
The full rationale and the rest of the principles live in the
[LLM guide](llm-guide.md#14-best-practices).

> **Advanced, opt-in:** because every value flows from tokens, global
> multipliers like `--sf-radius-scale: 0` (sharp corners everywhere) or
> `--sf-motion-scale: 0` (drop animation) can restyle a whole site in one line.
> These are a power-user escape hatch, **not** part of the everyday workflow —
> reach for them only when you deliberately want a system-wide switch.

---

## Where to go next

| You want to… | Read |
| --- | --- |
| Build real pages step by step (recipes) | [Cookbook](cookbook.md) |
| Understand the token system deeply | [LLM guide](llm-guide.md) |
| Lay out a page (grid, stack, sidebar, cover…) | [Layout primitives](layout.md) |
| Use recipe classes (prose, surface, flow…) | [Macros](macros.md) |
| Wire up interactive states (loading, selected…) | [State classes](states.md) |
| Rebrand, theme, or go multi-brand | [Theming](theming.md) |
| Look up any token or class programmatically | [`api-index.json`](api-index.json) · [`token-index.json`](token-index.json) |

Building with an AI assistant? Point it at the **`slashed-build` skill**
(`.claude/skills/slashed-build/`), which turns this documentation set into a
guided build workflow.
