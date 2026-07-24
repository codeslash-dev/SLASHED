---
name: slashed-build
description: >-
  Use when building or styling a UI, website, page, or component with the
  SLASHED CSS framework (the `--sf-*` token API and `.sf-*` classes) — writing
  the HTML/CSS, choosing tokens over hardcoded values, laying out with
  primitives, rebranding, or wiring dark mode. Routes to the framework's
  authoritative, CI-gated docs; does not duplicate token or class lists.
---

# Building with SLASHED

SLASHED is a token-first, BEM-first CSS framework: the `--sf-*` design-token API
is the product, and you compose components on top of it. This skill is the
entry point — it teaches the mental model and the build workflow, then routes
you to the authoritative reference docs for the exhaustive lists. **Do not
memorise or reproduce token/class inventories from here; look them up in the
linked docs, which CI keeps in sync with the source.**

## When to use

Use this whenever the task involves writing or styling markup that should look
like SLASHED: new pages, components, layouts, rebrands, theming, or dark mode.
If the user's project loads a `slashed*.css` bundle or uses `--sf-*` / `.sf-*`
names, you are in scope.

## The five principles (in priority order)

1. **Never hardcode a visual value.** Every colour, space, radius, shadow,
   font, z-index, and duration is a token. `padding: 24px` is a bug; write
   `padding: var(--sf-space-m)`. Hardcoded numbers break consistency and dark
   mode.
2. **BEM-first, classes where they count.** Base elements are styled classless.
   Use `.sf-*` classes for layout primitives, macros, and states; build your
   own BEM components on the token API for everything else.
3. **Prefer semantic tokens over primitive ones.** Reach for `var(--sf-gap)`
   over `var(--sf-space-m)` in a grid — the semantic token lets one change
   ripple everywhere without touching components.
4. **Dark mode is free — don't fight it.** Never write dark-mode colour CSS or
   toggle CSS variables in JS. Set `data-theme` and let the framework recompute
   the palette from the source tokens.
5. **Tweak by knob or `calc()`, never a new token.** For a one-off variation,
   override an existing knob (`--sf-grid-gap: var(--sf-space-s)`) or compose
   with `calc()`. Inventing `--my-*` tokens fragments the system and skips
   dark-mode derivation.

> **Advanced escape hatch (not the default workflow):** because everything
> flows from tokens, global multipliers such as `--sf-radius-scale: 0` or
> `--sf-motion-scale: 0` can restyle an entire site in one line. Treat these as
> a deliberate power-user switch, hidden by default — do not introduce them
> into ordinary component work.

## Build workflow

1. **Load the framework.** Confirm a bundle is present (or add one). Optimal is
   the default; the full bundle adds `.sf-btn` / `.sf-card` + utilities. See
   [getting-started.md](../../../docs/getting-started.md).
2. **Lay out with primitives, not custom CSS.** Reach for `.sf-container`,
   `.sf-stack`, `.sf-grid`, `.sf-cluster`, `.sf-sidebar`, `.sf-cover`, and
   friends before writing flexbox/grid by hand. → [layout.md](../../../docs/layout.md)
3. **Style with macros + tokens.** Panels → `.sf-surface`; articles →
   `.sf-prose`; spacing/typography → tokens. → [macros.md](../../../docs/macros.md)
4. **Wire state through `.sf-is-*` classes + ARIA**, toggled from JS — not
   inline styles. → [states.md](../../../docs/states.md)
5. **Brand via the six source colours** in the overrides space; add
   `data-theme` for forced modes. → [theming.md](../../../docs/theming.md)
6. **Verify token-first.** Before finishing, scan your CSS for hardcoded
   colours/px/rem and replace them with tokens.

## Decision tree — "I want to…"

| Goal | Reach for | Reference |
| --- | --- | --- |
| Constrain / centre page content | `.sf-container` (+ `--narrow`/`--wide`/`--prose`) | [layout.md](../../../docs/layout.md) |
| Space stacked children | `.sf-stack` | [layout.md](../../../docs/layout.md) |
| Responsive card grid (no media queries) | `.sf-grid .sf-grid--fit` + `--sf-grid-min` | [layout.md](../../../docs/layout.md) |
| Row that wraps (buttons, tags) | `.sf-cluster` | [layout.md](../../../docs/layout.md) |
| Content + collapsing sidebar | `.sf-sidebar` | [layout.md](../../../docs/layout.md) |
| A padded, elevated panel | `.sf-surface` (any bundle) / `.sf-card` (full) | [macros.md](../../../docs/macros.md) |
| Rich article typography | `.sf-prose` | [macros.md](../../../docs/macros.md) |
| Buttons | `.sf-btn` + variant (full bundle) | [classes.md](../../../docs/classes.md) |
| Loading / selected / disabled state | `.sf-is-*` + matching ARIA | [states.md](../../../docs/states.md) |
| A specific spacing / colour / radius value | a `--sf-*` token | [llm-guide.md](../../../docs/llm-guide.md) · [tokens.md](../../../docs/tokens.md) |
| Rebrand the whole site | six `--sf-color-*-source-light` tokens | [theming.md](../../../docs/theming.md) |
| Dark mode | `data-theme="dark"` on `<html>` or a section | [theming.md](../../../docs/theming.md) |
| Look a name up programmatically | `api-index.json` / `token-index.json` | [docs/](../../../docs/) |

## Reference map (authoritative, CI-gated)

- **[getting-started.md](../../../docs/getting-started.md)** — install, bundle
  choice, boilerplate, first rebrand.
- **[cookbook.md](../../../docs/cookbook.md)** — copy-paste recipes for common
  builds (page shell, card grid, hero, sidebar, form states, rebrand).
- **[llm-guide.md](../../../docs/llm-guide.md)** — the deep token reference:
  colour/type/space/layout/motion systems, tiers, best practices.
- **[layout.md](../../../docs/layout.md)** / **[macros.md](../../../docs/macros.md)**
  / **[states.md](../../../docs/states.md)** — every layout primitive, macro,
  and state class.
- **[theming.md](../../../docs/theming.md)** — rebrand, dark mode, multi-brand,
  contrast.
- **[classes.md](../../../docs/classes.md)** / **[tokens.md](../../../docs/tokens.md)**
  — the complete generated inventories.
- **`api-index.json`** / **`token-index.json`** — machine-readable indexes for
  programmatic lookup.

## Guardrails

- Only reference `--sf-*` tokens and `.sf-*` classes that actually exist — check
  the reference docs or the JSON indexes rather than guessing a name.
- Do not edit `INTERNAL` tokens (e.g. `--sf-is-dark`); they are framework-managed.
- Put your overrides in plain `:root` / your own selectors — the
  `slashed.overrides` layer sits last, so you never need `!important`.
