# Migration guide

Mapping concepts from popular CSS frameworks to SLASHED, plus intra-project
upgrade notes.

## SLASHED 0.6.25 → next

### `base` relative shade aliases removed

The `base` family is an **absolute** lightness scale (step 50 is always
near-white, step 950 always near-black), so relative aliases whose names
imply a direction from the source were misleading — e.g. against a
near-white base in light mode `--sf-color-base-lighter` actually resolved
*darker* than `--sf-color-base`. These six aliases have been removed:

| Removed | Replace with |
|---|---|
| `--sf-color-base-superlight` | `--sf-color-base-50` |
| `--sf-color-base-xlight` | `--sf-color-base-200` |
| `--sf-color-base-lighter` | `--sf-color-base-400` |
| `--sf-color-base-darker` | `--sf-color-base-600` |
| `--sf-color-base-xdark` | `--sf-color-base-800` |
| `--sf-color-base-superdark` | `--sf-color-base-950` |

If you wanted **mode-adaptive surface elevation** (lighter in light mode,
lighter-than-background in dark mode) rather than a fixed shade, switch to
the surface tokens instead: `--sf-color-bg`, `--sf-color-inset`,
`--sf-color-raised` (or `--sf-color-base--hover` / `--sf-color-base--active`
for interaction states). These adapt to both colour schemes automatically.

The numeric ramp (`--sf-color-base-50` … `-950`), alpha variants
(`-a5` … `-a80`), `-subtle` / `-muted` / `-ghost`, and `--hover` / `--active`
are unchanged. The relative aliases on the five mid-tone brand families
(`primary`, `secondary`, `tertiary`, `action`, `neutral`) are **unaffected** —
they remain valid there because those sources sit mid-ramp.

## SLASHED 0.6.10 → 0.6.11

### Color source tokens renamed

Source tokens (the ones you set for rebranding) are now named `-source-light` / `-source-dark`
instead of `-light` / `-dark`. This prevents confusion with the shade aliases
(`-lighter`, `-xlight`, `-superlight`, etc.).

| Was | Now |
|---|---|
| `--sf-color-primary-light` | `--sf-color-primary-source-light` |
| `--sf-color-primary-dark` | `--sf-color-primary-source-dark` |
| `--sf-color-secondary-light` | `--sf-color-secondary-source-light` |
| … (all 6 brand + 4 status source tokens) | … |

The resolved semantic tokens (`--sf-color-primary`, `--sf-color-danger`, etc.) are **unchanged**.

### `--sf-color-error` removed — use `--sf-color-danger`

`danger` is the single canonical red status token (destructive actions,
form validation errors, negative states). The `error` family has been removed.

- **Replace** `--sf-color-error` → `--sf-color-danger`
- **Replace** `--sf-color-error-subtle` → `--sf-color-danger-subtle`
- **Replace** `--sf-color-error-muted` → `--sf-color-danger-muted`
- **Replace** `--sf-color-error-strong` → `--sf-color-danger-strong`
- **Remove** any overrides to `--sf-color-error-source-light` / `--sf-color-error-source-dark`
  (they no longer exist). Override `--sf-color-danger-source-light` instead.

### New: `.sf-section--guttered`

Adds horizontal page gutters (`--sf-gutter`) directly to a section, so a separate
`.sf-container` wrapper is not needed:

```html
<!-- before (still valid) -->
<section class="sf-section">
  <div class="sf-container">…</div>
</section>

<!-- new alternative -->
<section class="sf-section sf-section--guttered">
  <div class="sf-stack">…</div>
</section>
```

---

## SLASHED 0.5.x → 0.6.0

v0.6.0 removes ~178 tokens from the public API (876 → 698). The cuts target
power-user / vestigial token families that marketing, landing, and business
sites don't reach for. **No classes were removed and no colour/theming behaviour
changed** — only token names. If your site never referenced the tokens below,
no changes are needed.

### Removed tokens → what to use instead

| Removed | Replacement |
|---|---|
| `--sf-{space,text}-{step}-to-{step}` (fluid bridge matrix) | Use the base `--sf-space-*` / `--sf-text-*` scales (already fluid), or a custom `clamp()` |
| `--sf-color-*-a{20,40,60,70,90,95}` | Kept steps `-a5/-a10/-a30/-a50/-a80`; for others `oklch(from var(--sf-color-x) l c h / .NN)` |
| `--sf-fluid-custom-{1,2,3}` (+ `-min`/`-max`) | Write a `clamp()` directly; `--sf-fluid-{min,max}-vw` unchanged |
| `--sf-blur-{xs,s,m,l,xl}` | `--sf-blur` (single default), or inline `blur(Npx)` |
| `--sf-opacity-{0,10,25,50,75,100}` | `--sf-opacity-muted` (0.5) and `--sf-opacity-disabled`, or a literal value |
| `--sf-stroke-{thin,regular,bold,heavy}` | SVG `stroke-width="N"` or `--sf-border-width-*` |
| `--sf-col-width-{s,m,l}`, `--sf-col-rule-width-{s,m,l}` | Set `column-width` / `column-rule-width` directly |
| `--sf-truncate-suffix` | (was never read) — `.sf-truncate` uses `text-overflow: ellipsis` |
| `--sf-font-weight-{thin,extralight,extrabold,black}` | `font-weight: 100/200/800/900` inline, or override a role token |
| `--sf-z-{low,mid,high,top,max}` | Semantic roles below |
| `--sf-color-text--on-surface` | `--sf-color-text--on-base` (was a pre-1.0 compat alias; none are retained) |

### Renamed / re-pointed

| Was | Now |
|---|---|
| `--sf-z-low` | `--sf-z-sticky` (1000) |
| `--sf-z-mid` | `--sf-z-fixed` (1010) |
| `--sf-z-high` | `--sf-z-dropdown` (1020) |
| `--sf-z-max` (modal fallback) | `--sf-z-overlay` (1030) / `--sf-z-modal` (1040) |
| `--sf-z-top` | `--sf-z-toast` (1050) |
| — | `--sf-z-tooltip` (1060, new top rung) |
| `--sf-body-strong-weight` → `var(--sf-font-weight-bold)` | now `var(--sf-font-weight-strong)` (same value) |

### Font weights are now base + semantic roles

Base weights `light(300) / normal(400) / medium(500) / semibold(600) / bold(700)`
plus semantic roles you can override to reweight the whole site:
`--sf-font-weight-{body,heading,display,interactive,strong}`. To go lighter or
heavier than the named set, write `font-weight: 300` directly, or re-tune a role:

```css
:root { --sf-font-weight-body: 300; --sf-font-weight-heading: 400; }
```

### New: opt-in theme cross-fade

Add `class="sf-theme-transition"` to `<html>` (or any subtree) so colours fade
instead of switching instantly when `[data-theme]` flips. Tune with
`--sf-theme-transition-duration` (default 300ms). Disabled under
`prefers-reduced-motion`.

### Gap tokens flattened (base → semantic → component)

The middle "layout" tier of gap aliases is gone; layout primitives now default
straight to three semantic rhythms. Only matters if you overrode the middle tier.

| Removed / renamed | Use instead |
|---|---|
| `--sf-space-gap` | `--sf-gap` (loose: between components) |
| `--sf-space-content` | `--sf-content-gap` (tight: within content) |
| `--sf-space-gutter` | `--sf-gutter` (wide: page/section edges) |
| `--sf-gutter-width` | `--sf-gutter` (renamed) |
| `--sf-gap-size` | `--sf-gap` (the `.sf-gap` utility now reads it) |

Override scopes are unchanged in spirit:
- **All loose primitives at once:** set `--sf-gap` (was `--sf-space-gap`).
- **One primitive:** set its own token, e.g. `style="--sf-cluster-gap: 0.5rem"` (unchanged).

```css
/* before */ :root { --sf-space-gap: 2rem; }
/* after  */ :root { --sf-gap: 2rem; }
```

## SLASHED 0.2.x → 0.3.0

v0.3.0 adds the `slashed.macros` cascade layer and relocates three class
definitions to fit the new taxonomy. Class names and declared properties are
unchanged — only their cascade layer changes.

### What changed

| # | Class / file | Was (0.2.x) | Now (0.3.0) |
|---|---|---|---|
| 1 | `.sf-prose`, `.sf-not-prose` | `slashed.layout` (in `core/layout.css`) | `slashed.macros` (in `core/macros.css`) |
| 2 | `.sf-focus-parent` | `slashed.states` (in `core/states.css`) | `slashed.accessibility` (in `core/accessibility.css`) |
| 3 | new layer | — | `slashed.macros` between `components` and `utilities` |

### Are these breaking changes?

Formally yes (a class's cascade layer changed); practically no — the classes and
their properties are byte-identical to v0.2.x, so a 0.2.x site works in 0.3.0
without markup changes. You only see a difference if your CSS targeted these
classes from **within a specific layer that lost the priority race**:

- `@layer slashed.layout { .sf-prose { … } }` no longer participates (`.sf-prose`
  left `slashed.layout`). Move the override to `slashed.overrides`.
- `@layer slashed.states { .sf-focus-parent { … } }` stops winning. Same fix.

### What's new in essential

- New file: `core/macros.css` (12 recipes).
- New file: `core/tokens.macros.css` (5 macro tokens).
- New a11y pattern: `.sf-clickable-parent` (the card-with-link pattern).
- New modifier: `.sf-icon--boxed` on the existing `.sf-icon`.
- New tokens: border-style scale (`--sf-border-style`, `-strong`,
  `-soft`, `-dotted`) and the icon-boxed tokens (`--sf-icon-box-pad`,
  `-radius`, `-bg`, `-border`).

See [`docs/macros.md`](macros.md) for the full macro reference.

### Components — incomplete files

`optional/components.css` and `optional/tokens.components.css` now contain
structured class definitions and tokens, but **every line is commented out**. The
`@layer` declarations are real and 8 component names are taken; implementations
land in upcoming minor releases (additive only). See
[`docs/components.md`](components.md).

If you previously wrote your own `.sf-button` / `.sf-card` styles, either keep
them until the activation minor (then adopt the framework version or rename), or
rename to a project-prefixed class (`.app-button`) now to avoid future collision.

---

## SLASHED 0.3.0 → 0.4.x

The 0.4.x series simplified the public API surface ahead of a token-API
freeze. These changes are additive or removal-only — no renamed tokens.

### Tokens removed

| Token | Replacement |
|---|---|
| `--sf-ratio-photo` | Use `--sf-ratio-3-2` (identical value) or `--sf-ratio-4-3` |
| `--sf-sidebar-width-default` | Override `--sf-sidebar-width` directly (now declared as `18rem`) |
| `--sf-grid-min-default` | Override `--sf-grid-min` directly (now declared as `16rem`) |
| `--sf-color-primary--hover` | Use `--sf-color-primary-hover` from `core/tokens.css` |
| `--sf-color-secondary--hover` | Use `--sf-color-secondary-hover` from `core/tokens.css` |
| `--sf-color-tertiary--hover` | Use `--sf-color-tertiary-hover` from `core/tokens.css` |
| `--sf-color-action--hover` | Use `--sf-color-action-hover` from `core/tokens.css` |
| `--sf-color-neutral--hover` | Use `--sf-color-neutral-hover` from `core/tokens.css` |

**Note:** The single-dash brand hover variants (`--sf-color-{role}-hover`)
live in `core/tokens.css` (shipped in the
`optimal`+ bundles). If you relied on the double-dash hover tokens in
the `essential` bundle, you must switch to the `optimal` bundle or
declare your own hover colour.

> **See also:** The [0.4.x → 0.5.x](#slashed-04x--05x) section
> documents a further rename: `-hover` → `--hover` (single-dash back to
> double-dash, now with BEM semantics). Migrating from 0.3.x directly to
> 0.6.0: `--sf-color-{family}--hover` is the final canonical name.

### Class modifiers removed

| Removed | Replacement |
|---|---|
| `.sf-stack--2xs` | `style="--sf-stack-gap: var(--sf-space-2xs)"` |
| `.sf-stack--3xl` | `style="--sf-stack-gap: var(--sf-space-3xl)"` |
| `.sf-cluster--2xs` | `style="--sf-cluster-gap: var(--sf-space-2xs)"` |

The underlying space tokens (`--sf-space-2xs`, `--sf-space-3xl`,
`--sf-space-4xl`) remain part of the public API.

### Class modifiers added

- `.sf-cluster--2xl` — gap at `--sf-space-2xl`
- `.sf-grid--2xl` — min column width `28rem` (new token `--sf-grid-min-2xl`)
- `.sf-section--xs` — padding at `--sf-section-pad--xs` (new token)
- `.sf-section--2xl` — padding at `--sf-section-pad--2xl` (new token)
- `.sf-icon--2xl` — icon size at `4em` (new token `--sf-icon-2xl`)

**Result:** every size-aware primitive now supports the canonical
`--xs --s --m --l --xl --2xl` range.

### Component modifier renamed (taken-names table)

| Old name | New name | Rationale |
|---|---|---|
| `.sf-button--destructive` | `.sf-button--danger` | Aligns with the `--danger` intent used by `.is-danger`, `.sf-surface--danger`, and the `--sf-color-danger-*` tokens. |

The component CSS isn't active yet (commented out), so no runtime breakage.

---

## SLASHED 0.4.x → 0.5.x

Pre-1.0 cleanup ahead of the API freeze. Consumer-visible changes: two source-token **renames**, one removal,
two brand-colour token renames (hover/active separator), and two layout-class
renames — there are no other renamed tokens; everything else is additive.

### Tokens renamed

| Was | Now | Notes |
|---|---|---|
| `--sf-color-surface-source-light` / `-dark` | `--sf-color-base-source-light` / `-dark` | The page-surface **source** family is renamed for clarity. The full scale (`-50` … `-950`) and alpha steps follow the same rename and have **no** back-compat alias. The on-colour token `--sf-color-text--on-surface` was renamed to `--sf-color-text--on-base`; the compat alias was dropped in 0.6.0 (see the 0.5→0.6 section). |
| `--sf-color-well` | `--sf-color-inset` | Renamed to communicate the recessed / indented surface role. `--sf-color-well` is removed (no alias). |
| `--sf-color-{family}-hover` | `--sf-color-{family}--hover` | Separator changed from single-dash to double-dash for BEM state-modifier compliance. Applies to all 6 brand families: `primary`, `secondary`, `tertiary`, `action`, `neutral`, `base`. Available in `core/tokens.css`. No back-compat alias. |
| `--sf-color-{family}-active` | `--sf-color-{family}--active` | Same BEM separator fix as `-hover` above. Same 6 families. No back-compat alias. |

**The resolved semantic token `--sf-color-surface` (the page-surface anchor)
is unchanged** — only the underlying *source* family prefix changed. If you
only ever consumed `var(--sf-color-surface)`, nothing changes. If you
**overrode** `--sf-color-surface-source-light` / `--sf-color-surface-source-dark` to rebrand
the page surface, rename those overrides to `--sf-color-base-source-light` / `-dark`.

### Tokens removed

| Removed | Replacement |
|---|---|
| `--sf-color-{success,warning,error,info,danger}-{50…950}` | The numeric ramp for status families is gone. Status colours are functional — use the `subtle` / `muted` / base / `strong` aliases, or derive a step with `color-mix(in oklab, var(--sf-color-danger) 40%, var(--sf-color-surface))`. Brand families keep their full numeric scale via `core/tokens.css`. |

### Classes renamed

| Was | Now | Notes |
|---|---|---|
| `.sf-grid-1 / -2 / -3 / -4 / -6` | `.sf-grid-cols-1 / -2 / -3 / -4 / -6` | Fixed-column grids renamed to make the distinction from the auto-fill `.sf-grid` explicit. |
| `.sf-grid-1-2 / -2-1 / -1-3 / -3-1` | `.sf-grid-cols-1-2 / -2-1 / -1-3 / -3-1` | Ratio grids follow the same rename. |

### What's new (additive — no action needed)

- Macros: `.sf-content-auto`, `.sf-tabular-nums`, `.sf-scrim` / `.sf-text-protect`,
  `.sf-focus-shadow`, `.sf-link--subtle` / `.sf-link--reverse`, divider modifiers
  (`--soft` / `--strong` / `--dashed` / `--dotted` / `--gradient`).
- Per-text-size sub-properties (`--sf-text-{size}-{line-height,font-weight,letter-spacing,max-width}`) merged into `core/tokens.css`.
- Contextual on-surface colour cascade for `.sf-surface--*` variants.
- Colour anchors `--sf-color-white` / `--sf-color-black`, border shorthands
  (`--sf-border`, `-subtle`, `-strong`), object-fit/position and multi-column
  tokens.

---

## SLASHED 0.5.x → 0.6.0

No breaking changes. All changes are additive or internal.

### Tokens moved to core (now available in essential bundle)

The brand semantic alpha tokens — `ghost`, `subtle`, and `muted` — were previously
declared in `optional/tokens.palette.css`. In 0.6.0 they live in `core/tokens.css`
and ship in every bundle:

| Family | Tokens now in core |
|---|---|
| primary, secondary, tertiary | `--sf-color-{family}-ghost` / `-subtle` / `-muted` |
| action, neutral, base | `--sf-color-{family}-ghost` / `-subtle` / `-muted` |

No markup or CSS changes are required — the token names are unchanged.
If you were on the `essential` bundle and used these tokens via a `<link>` to
`optional/tokens.palette.css`, no extra palette link is needed.

### New token

| Token | Default | Notes |
|---|---|---|
| `--sf-gutter-width` | `var(--sf-space-l)` | Canonical source for container gutters. `--sf-space-gutter` is now an alias of this token; both names resolve identically. |

### Color syntax change (internal, no consumer impact)

Alpha transparency for the brand ghost/subtle/muted tokens now uses
`oklch(from var(--sf-color-X) l c h / α)` instead of
`color-mix(in oklab, var(--sf-color-X) N%, transparent)`. The computed colours
are equivalent; the change improves color-space fidelity and allows these tokens
to live in core without depending on the optional palette file.

The numeric alpha scale (`-a5`, `-a10`, `-a30`, `-a50`, `-a80`) in `core/tokens.css` is now
gated behind `@supports (color: oklch(from red l c h))`. Browsers below the
framework floor do not load these tokens.

### Bug fixes

| Fixed | Details |
|---|---|
| `--sf-color-text--muted` | Now uses a contrast-aware formula (clamped neutral lightness) instead of a plain neutral reference. |
| `--sf-color-text--on-inverse` | Now correctly derives from `--sf-color-inverse` rather than the text inverse alias. |
| `--sf-focus-ring-shadow` | Now includes a `var(--sf-color-bg, …)` fallback for contexts where `--sf-color-bg` is not set. |

---

## From other frameworks

SLASHED is **token + BEM**, not utility-first and not classless — so
the migration is mostly about *where* styling lives.

### Mental model

| Concern | Classless / element-styled | Utility-first | **SLASHED** |
|---|---|---|---|
| Element defaults | global element styles | reset only | minimal `base` layer (flow/inline text) |
| Components | restyle bare elements | utility classes on markup | your own BEM classes consuming `--sf-*` tokens |
| Theming | CSS vars (some) | config file + build | override 6 source tokens, no build |
| Layout | utility/grid classes | flex/grid utilities | container-query primitives (`.sf-*`) |
| Recipes | bespoke per project | utility chains | macros (`.sf-prose`, `.sf-flow`, …) |
| States | `:disabled` etc. | variant modifiers | `.is-*` state classes |

### From a classless / element-styled framework

These frameworks style bare HTML globally; SLASHED keeps `base` minimal and expects components.

- **Rich element styling** (`table`, `blockquote`, `figure`, `dl`): globally
  styled in classless frameworks. In SLASHED they're styled **inside
  `.sf-prose`** — wrap long-form content in `<div class="sf-prose">`.
- **Forms**: many classless frameworks style inputs globally. SLASHED's are
  opt-in — add `optional/forms.css` (the `optimal` bundle includes it).
- **Containers**: use `.sf-container`.
- **Pre-compiled colour themes**: not needed — override the 6 source tokens.

### From a component / modifier framework

- **Helpers/modifiers** (`.is-primary`, `.is-active`): SLASHED reserves `.is-*`
  exclusively for runtime **states** (`.is-active`, `.is-disabled`, …). Visual
  variants belong in your component CSS using brand tokens
  (`background: var(--sf-color-primary)`).
- **Columns**: use `.sf-grid`, `.sf-grid-N`, or `.sf-switcher`.
- **Section/container**: `.sf-section` / `.sf-container`.

### From a utility-first framework

- **Utility classes on markup**: SLASHED is not utility-first. Compose with the
  layout primitives, the macros (`.sf-flow`, `.sf-truncate`, etc.), and
  write small BEM components that read tokens.
- **Config file / build step**: there's no config or build — override `--sf-*`
  tokens in a stylesheet. See [theming.md](theming.md).
- **Dark variant syntax**: use `data-theme` (auto-derived dark mode) — see
  [theming.md](theming.md).
- **Spacing/colour scales**: available as tokens (`--sf-space-*`,
  `--sf-color-*`) — use them in your own classes instead of inline utilities.
- **`line-clamp-N` / `truncate`**: directly available as `.sf-line-clamp-N`
  and `.sf-truncate` macros.

### Practical steps

1. Drop in a bundle (`slashed.optimal.css` is a good default).
2. Rebrand with the 6 source tokens.
3. Replace layout utilities with layout primitives.
4. Replace recurring patterns with macros (prose, flow, truncate, …).
5. Move element-level overrides into BEM components that consume tokens.
6. Wrap long-form content in `.sf-prose`.
7. Map interactive state toggles to `.is-*` classes (+ matching ARIA).
