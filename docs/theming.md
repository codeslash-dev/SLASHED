# Theming

Rebrand the whole framework by overriding a handful of source tokens. Dark mode,
surfaces, reading text, status tints, and on-colours all auto-derive via relative
colour syntax. No build step, no SCSS.

Starter file: [`optional/customize-example.css`](../optional/customize-example.css).

## Rebrand in 6 tokens

Override the six `-source-light` tokens. Any valid CSS colour works (hex,
`oklch`, `hsl`, …):

```css
:root {
  --sf-color-primary-source-light:   oklch(0.55 0.18 280); /* brand / links          */
  --sf-color-secondary-source-light: oklch(0.30 0.04 280); /* muted brand            */
  --sf-color-tertiary-source-light:  oklch(0.62 0.15 200); /* accent                 */
  --sf-color-action-source-light:    oklch(0.62 0.16 150); /* primary call-to-action */
  --sf-color-neutral-source-light:   oklch(0.45 0.01 280); /* greys / text base      */
  --sf-color-base-source-light:      oklch(0.99 0.004 280);/* page surface           */
}
```

`oklch` lightness is perceptually uniform, so the auto-derivations (hover, tints,
dark mode) stay consistent across hues. Hex/hsl inputs are converted internally.

## What gets derived

| You set | Framework derives |
|---|---|
| `--sf-color-*-source-light` (6) | dark equivalents, hover/active variants, ghost/subtle/muted alpha variants (core), numeric tints/shades (optional palette), status mixes |
| `--sf-color-neutral-source-light` | `--sf-color-text`, `--sf-color-text--secondary`, `--sf-color-heading`, borders |
| `--sf-color-base-source-light` | `--sf-color-bg`, `--sf-color-inset`, `--sf-color-raised`, `--sf-color-overlay`, `--sf-color-inverse` |
| any brand colour | `--sf-color-text--on-*` (auto black/white for WCAG AA) |

Structural contract: `--sf-color-base-source-light` must be light and
`--sf-color-base-source-dark` must be dark (they are the page surfaces);
`--sf-color-neutral` is the greyscale/text base. Inverting this breaks contrast.

See the [token reference](tokens.md) for every overridable property.

## Fluid engine

Colour is half the system; the other half is generative too. The fluid type,
display, and space scales are computed **at runtime** from 12 input scalars —
change one, and every `clamp()` in the system recalibrates. No build step, no
token regeneration.

| Input | Default | Effect |
|---|---|---|
| `--sf-fluid-min-vw` | `22.5` | viewport (rem) where fluidity starts — below it, all fluid values sit at their minimum |
| `--sf-fluid-max-vw` | `90` | viewport (rem) where fluidity stops — above it, all fluid values sit at their maximum |
| `--sf-text-ratio-min` | `1.25` | modular ratio of the type scale at the min viewport |
| `--sf-text-ratio-max` | `1.333` | modular ratio of the type scale at the max viewport |
| `--sf-text-base-min` | `1` | `--sf-text-m` at the min viewport (rem) |
| `--sf-text-base-max` | `1.25` | `--sf-text-m` at the max viewport (rem) |
| `--sf-text-display-base-min` | `2.4` | `--sf-text-display-s` at the min viewport (rem) |
| `--sf-text-display-base-max` | `3` | `--sf-text-display-s` at the max viewport (rem) |
| `--sf-space-ratio-min` | `1.25` | modular ratio of the space scale at the min viewport |
| `--sf-space-ratio-max` | `1.333` | modular ratio of the space scale at the max viewport |
| `--sf-space-base-min` | `1` | `--sf-space-m` at the min viewport (rem) |
| `--sf-space-base-max` | `2` | `--sf-space-m` at the max viewport (rem) |

The dual-ratio design means the scale can be subtle on phones and dramatic on
desktops — most systems expose a single ratio; SLASHED interpolates between two.

All values are unitless numbers (`@property <number>`), so they compose into
`pow()` and `calc()`. Worked examples:

```css
/* steeper headline hierarchy on desktop only */
:root { --sf-text-ratio-max: 1.414; }

/* keep growing until very wide screens */
:root { --sf-fluid-max-vw: 110; }

/* denser overall layout: same curve, smaller spacing endpoints */
:root { --sf-space-base-max: 1.6; }
```

On top of the generative inputs sit linear multipliers — `--sf-text-scale`,
`--sf-space-scale`, `--sf-text-display-scale`, `--sf-radius-scale`,
`--sf-motion-scale`, `--sf-section-scale` (one dial for all section padding),
and `--sf-leading-taper` (progressively tightens the per-size line-heights up
the scale; default `0`).

For a single copy-paste file exposing every dial, see
[`optional/customize-example.css`](../optional/customize-example.css).

### Ad-hoc fluid values

For a one-off fluid value — "this padding should go from 0.875rem to 1.375rem" —
write a `clamp()` that reads the engine's viewport range so it recalibrates with
the rest of the scale instead of drifting on magic numbers:

```css
/* fluid from MIN rem to MAX rem across the engine's viewport range */
--my-value: clamp(
  MINrem,
  calc((MAX - MIN) / (var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw))
       * (100vw - var(--sf-fluid-min-vw) * 1rem) + MINrem),
  MAXrem
);
```

Because it reads `--sf-fluid-*`, every value built this way recalibrates with
the engine instead of drifting on magic numbers.

## Dark mode

Dark values derive automatically from the `-source-light` tokens — the 6-token rebrand
themes both modes. `data-theme` flips `color-scheme`:

```html
<html>                       <!-- follows OS preference        -->
<html data-theme="dark">     <!-- force dark for the page       -->
<section data-theme="light"> <!-- force light for one region    -->
```

`data-theme` works on any element. SLASHED re-declares all mode-sensitive tokens
on `[data-theme]` elements, so colours, text, borders, and links fully switch —
not just `color-scheme`. The re-declaration block is gated behind
`@supports (color: oklch(from red l c h))`; older engines (Chrome < 119,
Safari < 16.4, FF < 128) still get `color-scheme` and `--sf-is-dark`, but
section-level token values fall back to the root's values.

### Toggle script

Persist the choice and animate the swap with a view transition (falls back to an
instant swap):

```js
const root = document.documentElement;
const btn = document.getElementById('theme-toggle');
const apply = (t) => {
  root.dataset.theme = t;
  localStorage.theme = t;
  btn.setAttribute('aria-pressed', String(t === 'dark'));
};

if (localStorage.theme) apply(localStorage.theme);

btn.addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  if (document.startViewTransition) document.startViewTransition(() => apply(next));
  else apply(next);
});
```

The `::view-transition(root)` cross-fade is styled in `core/motion.css` and
respects `prefers-reduced-motion`.

### Per-element colours per mode — the simplest, universal way

When you just need **one element to use a specific colour in light vs dark**,
reach for CSS `light-dark()` before any theme selector. It is the simplest and
most portable option: one declaration, no `[data-theme]` selector, and it works
in **every** context that sets `color-scheme` — the OS preference, a
`data-theme` toggle, or a host that flips `color-scheme` via its own attribute
(e.g. a page builder's dark-mode switch):

```css
.my-element {
  color:        light-dark(#1f2937, #e5e7eb);
  background:   light-dark(#ffffff, #111827);
  border-color: light-dark(#e5e7eb, #374151);
}
```

You can mix framework tokens with a one-off accent — auto-switching base plus
your own value only where you want it:

```css
.my-element {
  color: light-dark(var(--sf-color-text), oklch(0.85 0.15 30));
}
```

Reach for it whenever the difference is a **colour**. It substitutes a colour
value, so it covers `color`, `background-color`, `border-color`, `fill`, and the
colour part of `box-shadow`. `light-dark()` picks its branch from the inherited
`color-scheme`, which SLASHED sets on every `[data-theme]` element (and which the
OS default and host toggles set too) — so no selector is needed. If an element
ever lands in a subtree with no `color-scheme` set, it falls back to the light
branch.

For a per-mode change that **isn't** a colour (`background-image`, `display`,
layout) `light-dark()` doesn't apply — branch on the universal `--sf-is-dark`
flag instead, which is `1` in dark and `0` in light in every context above:

```css
@layer slashed.overrides {
  @container style(--sf-is-dark: 1) {
    .my-element { background-image: url(hero-dark.avif); }
  }
}
```

## Per-section & multi-brand

Re-declare the six source tokens under your own selector for a different palette;
all derived tokens re-compute. Combine `data-brand` with `data-theme` to switch
palette and mode together:

```css
[data-brand="sunset"] {
  --sf-color-primary-source-light: oklch(0.62 0.20 35);
  --sf-color-action-source-light:  oklch(0.70 0.18 60);
}
```

```html
<section data-brand="sunset" data-theme="dark"> … </section>
```

`slashed.themes` sits above the component/utility layers, so these reassignments
win without `!important`.

## Manual colour overrides

Three tiers, least to most specific:

**Tier 1 — source token** (changes both modes):
```css
:root { --sf-color-primary-source-light: oklch(0.55 0.18 280); }
```

**Tier 2 — dark source token** (changes dark mode only):
```css
:root { --sf-color-primary-source-dark: oklch(0.78 0.16 280); }
```

**Tier 3 — resolved token** (overrides the final computed value; use when you
need a value the formula can't produce):
```css
:root { --sf-color-link: oklch(0.40 0.14 280); }                                  /* both modes */
:root { --sf-color-link: light-dark(oklch(0.40 0.14 280), oklch(0.72 0.16 280)); } /* per mode  */
```

Place Tier 3 overrides in `slashed.overrides` (loaded after the bundle) so they
survive framework updates. See `optional/customize-example.css`.

## Per-surface color control

`.sf-surface--*` named variants automatically wire text, borders, links, focus
rings, and caret to the `--sf-color-text--on-*` token for that role. When the
auto-contrast formula produces a value that still doesn't meet your requirements,
you can override any surface token in `slashed.overrides`:

```css
@layer slashed.overrides {
  /* Force a specific foreground on the primary surface */
  .sf-surface--primary {
    --sf-color-text--on-primary: oklch(0.12 0 0);
  }

  /* For generic .sf-surface with a custom --sf-surface-color in the
     ambiguous lightness band, pin the public surface-facing tokens */
  .my-card.sf-surface {
    --sf-color-text:       oklch(0.10 0 0);
    --sf-color-heading:    var(--sf-color-text);
    --sf-focus-ring-color: var(--sf-color-text);
    --sf-caret-color:      var(--sf-color-text);
  }
}
```

On named variants (`.sf-surface--*`), every surface-derived token
(`--sf-color-text`, `--sf-color-heading`, `--sf-color-link`,
`--sf-color-border`, `--sf-focus-ring-color`, `--sf-caret-color`, …) follows
the variant's `--sf-color-text--on-*` token, so that single override fixes
every descendant. On the generic `.sf-surface` the foreground is derived
internally from `--sf-surface-color`; pin the public tokens shown above
when you need a different result.

For a per-brand-palette shift without per-element overrides, re-declare the
source token under your own selector — all derived tokens recompute:

```css
[data-brand="midnight"] {
  --sf-color-primary-source-light: oklch(0.28 0.15 260);
}
```

## Contrast guarantee

SLASHED auto-picks near-black (`oklch(0.1 0 0)`) or near-white
(`oklch(0.95 0 0)`) for text on colored surfaces based on the background's
OKLCH lightness. This guarantees **≥ 3:1** (WCAG AA Large Text / UI components)
for the vast majority of inputs.

**The ambiguous band (L ≈ 0.52–0.67):** the binary black/white choice cannot
guarantee 4.5:1 here — both extremes land near the perceptual crossover. If your
brand color lands in this range you have two options:

1. **Adjust `--sf-contrast-threshold`** — shift the crossover so one of the two
   extremes moves further from the background:
   ```css
   @layer slashed.overrides {
     /* Primary brand at L ≈ 0.58; shift down so white text is chosen */
     .sf-surface--primary { --sf-contrast-threshold: 0.55; }
   }
   ```

2. **Override the resolved token** — pin a known-good foreground colour:
   ```css
   @layer slashed.overrides {
     :root { --sf-color-text--on-primary: oklch(0.12 0 0); }
   }
   ```

The CSS `contrast-color()` function (currently in the specification, not yet
in any browser) will replace this formula automatically once it ships — the
framework already uses the same perceptual channel so the migration will be
mechanical.

## Link contrast

`--sf-color-link` keeps your action hue but clamps its OKLCH lightness toward a
contrast-safe band (ceiling in light mode, floor in dark mode), clearing
**WCAG AA (4.5:1)** on the page background for the default palette and most brand
overrides automatically.

Caveat: a very high-chroma hue (saturated yellow, lime green) can still fall
short of 4.5:1 even at a clamped lightness, because those hues are intrinsically
luminous. Set the link colour explicitly if your action colour is in that range:

```css
:root { --sf-color-link: oklch(0.45 0.12 110); }
```

`tests/link-contrast.spec.js` verifies the clamp holds AA across moderate-chroma
overrides; `tests/a11y.spec.js` runs axe-core on the default palette.

On-colour text (`--sf-color-text--on-*`) auto-picks near-black or near-white by
the fill's lightness (threshold L≈0.6); a fill at exactly the crossover with very
high chroma may need an explicit override of its `--sf-color-text--on-*` token.

## Contrast bias

`--sf-contrast-bias` (default `0`) nudges reading-text colours toward the
extremes — darker in light mode, lighter in dark mode. SLASHED raises it
automatically under `@media (prefers-contrast: more)`.

```css
:root { --sf-contrast-bias: 0.05; }
[data-theme="dark"] { --sf-contrast-bias: 0.04; }
```

## Gotchas

- **Don't transition every colour globally.** A blanket `transition: all` on `*`
  while toggling themes is a paint footgun. Use the opt-in `.sf-theme-transition`
  helper (add it to `<html>` or a subtree) — it cross-fades only the registered
  `@property` colour tokens, tuned by `--sf-theme-transition-duration` (default
  300ms) and disabled under `prefers-reduced-motion`. Or rely on the view
  transition.
- **`color-scheme` matters for form controls and scrollbars.** `data-theme` flips
  it; if you hand-roll a theme, set `color-scheme` too.
- **Images don't auto-adapt.** Swap art with `<picture>` +
  `prefers-color-scheme`, or dim with a token-driven overlay.

## Root size, rem and user zoom

SLASHED is rem-based end to end: every fluid scale, spacing token, and
container width resolves against the root font size.

- **Don't set a `px` font-size on `:root`/`html`.** A fixed pixel root
  overrides the user's browser font-size preference and breaks text-only zoom —
  the whole system would stop honouring it. The framework deliberately leaves
  the root size alone (user agent default = `16px` unless the user says
  otherwise).
- **The engine bases are rem multipliers, not lengths.** `--sf-text-base-min: 1`
  means "1× the user's root size", so a user who sets a 20px default font gets
  a proportionally larger system — type, spacing, and section rhythm together.
- **Zoom is free.** Page zoom and text-only zoom both scale the rem, and
  everything derived from it follows. Avoid re-introducing `px` values in
  overrides if you want to keep that property.
- **Want denser or larger output?** Reach for the multipliers
  (`--sf-text-scale`, `--sf-space-scale`, …) or the engine bases — never the
  root font-size.
