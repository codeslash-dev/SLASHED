# Components

> **Status:** As of **v0.7.0** SLASHED ships exactly two components —
> `.sf-btn` and `.sf-card` — **live** in the `slashed.components` layer (in the
> `*-components` and `full` bundles). The `@layer slashed.components` slot is real
> and ordered.

SLASHED stays BEM-first and token-first and deliberately does **not** carry a
broad component library. For anything beyond these two, write your own BEM
components against the same selector pattern (e.g. `.my-button`) using the
framework's tokens.

## Component names

| # | Class | Status | Modifiers | Slots / children |
|---|---|---|---|---|
| 1 | `.sf-btn` | **live (0.7.0)** | `--primary`, `--secondary`, `--tertiary`, `--action`, `--base`, `--neutral`, `--success`, `--warning`, `--info`, `--danger`, `--soft`, `--outline`, `--gradient`, `--xs`, `--s`, `--l`, `--xl`, `--block`, `--block-cq` | — |
| 2 | `.sf-card` | **live (0.7.0)** | `--bordered`, `--elevated`, `--interactive` | `__header`, `__body`, `__footer`, `__media`, `__avatar`, `__title` |

> **Breaking rename (0.7.7):** `.sf-btn--secondary` now selects the
> **secondary brand colour** (axis: Colour). The soft tonal *style* it used
> to name is now `.sf-btn--soft`. `.sf-btn--ghost` was removed entirely —
> no alias. See the changelog for the before → after mapping.

---

## `.sf-btn`

An interactive call-to-action. Apply to `<button>` or `<a>` — it stays intrinsic
width (never full-bleed) unless you opt in. Because it's excluded from the
classless `<button>` styling in `optional/forms.css` (via `:not([class*="sf-"])`),
`.sf-btn` fully owns its own look.

```html
<!-- Default: the button's default colour is --sf-color-action; no modifier needed -->
<button class="sf-btn">Save</button>

<!-- Colour families — all 10, 1:1 with the global palette -->
<button class="sf-btn sf-btn--primary">Primary</button>
<button class="sf-btn sf-btn--secondary">Secondary colour</button>
<button class="sf-btn sf-btn--tertiary">Tertiary</button>
<button class="sf-btn sf-btn--base">Base</button>
<button class="sf-btn sf-btn--success">Confirm</button>
<button class="sf-btn sf-btn--danger">Delete</button>

<!-- Style treatments -->
<button class="sf-btn sf-btn--soft">Soft</button>
<button class="sf-btn sf-btn--outline">Outline</button>

<!-- Styles compose with any colour family -->
<button class="sf-btn sf-btn--danger sf-btn--outline">Delete</button>
<button class="sf-btn sf-btn--secondary sf-btn--soft">Soft secondary</button>

<!-- Gradient (core-4 brand families) -->
<button class="sf-btn sf-btn--gradient">Gradient action</button>
<button class="sf-btn sf-btn--primary sf-btn--gradient">Gradient fill</button>
<button class="sf-btn sf-btn--primary sf-btn--gradient sf-btn--outline">Gradient border</button>

<!-- Sizes (m is the default) -->
<button class="sf-btn sf-btn--xs">XS</button>
<button class="sf-btn sf-btn--s">Small</button>
<button class="sf-btn sf-btn--l">Large</button>
<button class="sf-btn sf-btn--xl">XL</button>

<!-- States -->
<button class="sf-btn" disabled>Disabled</button>
<button class="sf-btn sf-is-loading"><span>Saving…</span></button>

<!-- Full width -->
<button class="sf-btn sf-btn--block">Block</button>
```

**Modifiers** — three orthogonal axes (Colour × Style × Gradient), freely
composable, plus size/width/state.

| Group | Modifier | Effect |
|---|---|---|
| Colour | `--primary` `--secondary` `--tertiary` `--action` `--base` `--neutral` `--success` `--warning` `--info` `--danger` | Swaps the colour family — 1:1 with the 10 global palette families. The default (no modifier) is `--sf-color-action`; `--action` names it explicitly. |
| Style | `--soft` | Soft **tonal fill** — a light wash of the family colour (`--sf-color-{family}-subtle`, deepening to `-muted` on hover), coloured text, no border. Lower-emphasis than the solid fill but visually distinct from `--outline`. (Degrades to a bordered treatment where relative color syntax is unsupported.) |
| Style | `--outline` | Coloured border/text, transparent fill; **fills** with the family colour on hover. Composes with any colour family. |
| Gradient | `--gradient` | Paints the fill (or, with `--outline`, the border ring) with the family's `--sf-gradient-{family}` token. **Core-4 brand families only** — `primary`/`secondary`/`tertiary`/`action` (and the default). For `base`/`neutral`/status families no gradient token exists: the modifier resolves to the solid family colour (documented no-op). Ignored under `--soft`. Degrades to the solid treatment where relative color syntax is unsupported. |
| Size | `--xs` `--s` `--l` `--xl` | Scales padding, font-size, and min-height (`m` = default). |
| Width | `--block` | Full width everywhere. |
| Width | `--block-cq` | Full width only inside a query container narrower than `20rem`. |
| State | `:disabled` / `.sf-is-disabled` | Dimmed, `pointer-events: none`. |
| State | `.sf-is-loading` | Hides content, shows a spinner (static under `prefers-reduced-motion: reduce`). |

Every colour variant sets five rule-local custom properties — `--sf-btn-color`,
`--sf-btn-color--hover`, `--sf-btn-on-color`, `--sf-btn-soft-bg`,
`--sf-btn-soft-bg--hover` — which is what lets the style and gradient axes
stay orthogonal to the colour families.

**Tokens** (`optional/tokens.components.css`)

| Token | Default | Controls |
|---|---|---|
| `--sf-btn-radius` | `var(--sf-radius-m)` | Corner radius |
| `--sf-btn-padding-block` | `initial` → `var(--sf-space-xs)` at size `m` | Vertical padding |
| `--sf-btn-padding-inline` | `initial` → `var(--sf-space-m)` at size `m` | Horizontal padding |
| `--sf-btn-gap` | `var(--sf-space-2xs)` | Gap between icon + label |
| `--sf-btn-font-size` | `initial` → `var(--sf-text-m)` at size `m` | Label size |
| `--sf-btn-font-weight` | `var(--sf-font-weight-interactive)` | Label weight |
| `--sf-btn-min-height` | `initial` → `var(--sf-size-m)` at size `m` | Minimum target height (40px, WCAG 2.2 AA; set to `var(--sf-touch-target)` for the 44px AAA floor) |
| `--sf-btn-border-width` | `var(--sf-border-width-1)` | Border thickness |

The four size-varying knobs (`--sf-btn-padding-block`, `--sf-btn-padding-inline`,
`--sf-btn-font-size`, `--sf-btn-min-height`) are declared `initial`, not with a
concrete value: their effective per-size default lives on the rule-local
`--sf-btn-*--size` tier tokens that the size modifiers (`--xs`/`--s`/`--l`/`--xl`)
retune. Because each property reads the public knob first — e.g.
`font-size: var(--sf-btn-font-size, var(--sf-btn-font-size--size))` — setting a
knob on `:root` overrides **every** button size, while leaving it unset keeps the
size scale intact.

---

## `.sf-card`

A padded content container with optional header/body/footer and media/avatar/title
subcomponents. Uses **concentric radius** math — `--sf-card-radius-outer` on the
card, `--sf-card-radius` on inner elements — so nested corners stay visually
proportional.

```html
<article class="sf-card">
  <img class="sf-card__media" src="cover.jpg" alt="">
  <header class="sf-card__header">
    <h3 class="sf-card__title">Card title</h3>
  </header>
  <div class="sf-card__body">
    <p>Body content goes here.</p>
  </div>
  <footer class="sf-card__footer">
    <button class="sf-btn sf-btn--primary">Action</button>
  </footer>
</article>

<!-- Modifiers -->
<article class="sf-card sf-card--bordered">Flat, outlined (no shadow)</article>
<article class="sf-card sf-card--elevated">Floating (shadow, no border)</article>
<a class="sf-card sf-card--interactive sf-clickable-parent" href="#">
  Whole card lifts on hover / keyboard focus
</a>
```

A `.sf-btn` nested in a card keeps its own size — add `.sf-btn--s` explicitly
for a compact card action. Pair `--interactive` with `.sf-clickable-parent`
(from `core/accessibility.css`) when the entire card should be a single link.

**Modifiers**

| Modifier | Effect |
|---|---|
| `--bordered` | Keeps the border, drops the shadow (flat, outlined). |
| `--elevated` | Hides the border, uses a larger shadow (floating). |
| `--interactive` | Pointer cursor + shadow/translate lift on `:hover`/`:focus-within`; lift is suppressed under `prefers-reduced-motion: reduce`. |

**Tokens** (`optional/tokens.components.css`)

| Token | Default | Controls |
|---|---|---|
| `--sf-card-padding` | `var(--sf-space-l)` | Inner padding |
| `--sf-card-gap` | `var(--sf-space-m)` | Header/footer divider spacing |
| `--sf-card-radius` | `var(--sf-radius-m)` | Inner (media) radius |
| `--sf-card-radius-outer` | `calc(radius + padding)` | Outer card radius (concentric) |
| `--sf-card-bg` | `var(--sf-color-surface)` | Background |
| `--sf-card-border-width` | `var(--sf-border-width-1)` | Border thickness |
| `--sf-card-border-color` | `var(--sf-color-border)` | Border colour |
| `--sf-card-shadow` | `var(--sf-shadow-s)` | Resting shadow |
| `--sf-card-shadow--elevated` | `var(--sf-shadow-l)` | `--elevated` shadow |
| `--sf-card-shadow--hover` | `var(--sf-shadow-l)` | `--interactive` hover shadow |
| `--sf-card-media-ratio` | `var(--sf-ratio-video)` | `__media` aspect ratio |
| `--sf-card-avatar-size` | `2.5rem` | `__avatar` diameter |
| `--sf-card-heading-size` | `var(--sf-text-xl)` | `__title` size |

**Coloured cards**

`.sf-card` deliberately has no colour-family modifiers (its modifiers are
elevation/behaviour steps). For a card in a palette colour, compose with a
`.sf-surface--{family}` macro (see `macros.md`) or override the card tokens
directly:

```html
<!-- Surface macro: bg + auto-contrast text in one class -->
<article class="sf-card sf-surface--primary">…</article>

<!-- Or token override for finer control -->
<article class="sf-card" style="--sf-card-bg: var(--sf-color-info-subtle);
                                --sf-card-border-color: var(--sf-color-info)">…</article>
```

**Composing card body layout**

`.sf-card__body` is plain `display: block` — it doesn't have its own flex/grid
switch. For gap-controlled internal layout, compose it with the framework's
existing layout primitives instead of a card-specific modifier:

```html
<!-- Stacked spacing between arbitrary children -->
<div class="sf-card__body sf-flow">
  <p>First paragraph.</p>
  <p>Second paragraph, spaced via --sf-flow-space.</p>
</div>

<!-- Wrapped horizontal row (e.g. stat items or tag chips) -->
<div class="sf-card__body sf-cluster">
  <span>New</span>
  <span>Popular</span>
</div>
```

---

## Gradient buttons

> **Superseded (0.7.7):** the old copy-paste `.btn-gradient-outline` recipe
> (ad-hoc `--sf-grad-a`/`--sf-grad-b` variables) is replaced by the real
> `.sf-btn--gradient` modifier documented above — no hand-set variables
> needed.

`.sf-btn--gradient` is driven by the family gradient tokens
(`--sf-gradient-primary` / `-secondary` / `-tertiary` / `-action` in
`core/tokens.css`), so retinting a brand colour retints its gradient buttons
automatically:

```html
<!-- Gradient fill -->
<button class="sf-btn sf-btn--primary sf-btn--gradient">Primary gradient</button>

<!-- Gradient border (masked ring, filled with the gradient on hover) -->
<button class="sf-btn sf-btn--tertiary sf-btn--gradient sf-btn--outline">Tertiary ring</button>
```

Coverage is the 4 core brand families (`primary`/`secondary`/`tertiary`/
`action`); on the remaining families the modifier resolves to the solid
family colour. Extending gradient tokens to `base`/`neutral`/status families
is a possible follow-up if demand shows up.

## Out of scope for 0.x

Not reserved and won't ship in 0.x (need JS, already covered by a macro/recipe, or
the API needs more usage data). Write these as your own BEM class reading SLASHED
tokens:

- `.sf-tabs`, `.sf-accordion` — need JS for keyboard nav / disclosure
- `.sf-tooltip`, `.sf-popover` — popover API + anchor positioning still in flux
- `.sf-pagination` — needs UX research
- `.sf-breadcrumb` — too simple to justify a class API
- `.sf-progress` — native `<progress>` already styled in `slashed.base`
- `.sf-spinner` — `.sf-is-loading` covers it
- `.sf-table` — `.sf-prose` styles long-form tables
- `.sf-form-field` — forms are classless via `optional/forms.css`
- `.sf-nav` — too site-specific

## Roadmap

`.sf-btn` + `.sf-card` shipped in **v0.7.0** and are the component surface SLASHED
maintains today. Further components — `.sf-badge`, `.sf-tag`, `.sf-alert`,
`.sf-avatar`, `.sf-modal`, and a skeleton/placeholder shape component — are
planned; see `docs/roadmap.md` and
[#384](https://github.com/codeslash-dev/SLASHED/issues/384) for the tracked
list. Anything not on that list is expected to be authored as
project-specific BEM classes reading SLASHED tokens.
