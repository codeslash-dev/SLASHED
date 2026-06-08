# Theming

Rebrand the whole framework by overriding a handful of source tokens. Dark mode,
surfaces, reading text, status tints, and on-colours all auto-derive via relative
colour syntax. No build step, no SCSS.

Starter file: [`optional/theme-example.css`](../optional/theme-example.css).

## Rebrand in 6 tokens

Override the six `-light` source tokens. Any valid CSS colour works (hex,
`oklch`, `hsl`, …):

```css
:root {
  --sf-color-primary-light:   oklch(0.55 0.18 280); /* brand / links          */
  --sf-color-secondary-light: oklch(0.30 0.04 280); /* muted brand            */
  --sf-color-tertiary-light:  oklch(0.62 0.15 200); /* accent                 */
  --sf-color-action-light:    oklch(0.62 0.16 150); /* primary call-to-action */
  --sf-color-neutral-light:   oklch(0.45 0.01 280); /* greys / text base      */
  --sf-color-base-light:      oklch(0.99 0.004 280);/* page surface           */
}
```

`oklch` lightness is perceptually uniform, so the auto-derivations (hover, tints,
dark mode) stay consistent across hues. Hex/hsl inputs are converted internally.

## What gets derived

| You set | Framework derives |
|---|---|
| `--sf-color-*-light` (6) | dark equivalents, hover/active variants, tints/shades (palette), status mixes |
| `--sf-color-neutral-light` | `--sf-color-text`, `--sf-color-text--secondary`, `--sf-color-heading`, borders |
| `--sf-color-base-light` | `--sf-color-bg`, `--sf-color-inset`, `--sf-color-raised`, `--sf-color-overlay`, `--sf-color-inverse` |
| any brand colour | `--sf-color-text--on-*` (auto black/white for WCAG AA) |

Structural contract: `--sf-color-base-light` must be light and
`--sf-color-base-dark` must be dark (they are the page surfaces);
`--sf-color-neutral` is the greyscale/text base. Inverting this breaks contrast.

See the [token reference](tokens.md) for every overridable property.

## Dark mode

Dark values derive automatically from the `-light` sources — the 6-token rebrand
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

## Per-section & multi-brand

Re-declare the six source tokens under your own selector for a different palette;
all derived tokens re-compute. Combine `data-brand` with `data-theme` to switch
palette and mode together:

```css
[data-brand="sunset"] {
  --sf-color-primary-light: oklch(0.62 0.20 35);
  --sf-color-action-light:  oklch(0.70 0.18 60);
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
:root { --sf-color-primary-light: oklch(0.55 0.18 280); }
```

**Tier 2 — dark source token** (changes dark mode only):
```css
:root { --sf-color-primary-dark: oklch(0.78 0.16 280); }
```

**Tier 3 — resolved token** (overrides the final computed value; use when you
need a value the formula can't produce):
```css
:root { --sf-color-link: oklch(0.40 0.14 280); }                                  /* both modes */
:root { --sf-color-link: light-dark(oklch(0.40 0.14 280), oklch(0.72 0.16 280)); } /* per mode  */
```

Place Tier 3 overrides in `slashed.overrides` (loaded after the bundle) so they
survive framework updates. See `optional/overrides-example.css`.

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
  while toggling themes is a paint footgun. Use the opt-in `.theme-transition`
  class (`optional/theme-example.css`) only while the toggle is in flight, or
  rely on the view transition.
- **`color-scheme` matters for form controls and scrollbars.** `data-theme` flips
  it; if you hand-roll a theme, set `color-scheme` too.
- **Images don't auto-adapt.** Swap art with `<picture>` +
  `prefers-color-scheme`, or dim with a token-driven overlay.
