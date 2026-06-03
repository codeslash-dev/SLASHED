# Theming guide

SLASHED is **token-first**: you rebrand the whole framework by overriding a
handful of source tokens. Dark mode, surfaces, reading text, status tints, and
on-colours all auto-derive from them via relative colour syntax. There is no
build step and no SCSS — just CSS custom properties.

A ready-to-copy starter lives at
[`optional/theme-example.css`](../optional/theme-example.css).

## Rebrand in 6 tokens

Override the six `-light` source tokens. Any valid CSS colour works (hex,
`oklch`, `hsl`, …):

```css
:root {
  --sf-color-primary-light:   oklch(0.55 0.18 280); /* brand / links     */
  --sf-color-secondary-light: oklch(0.30 0.04 280); /* muted brand        */
  --sf-color-tertiary-light:  oklch(0.62 0.15 200); /* accent             */
  --sf-color-action-light:    oklch(0.62 0.16 150); /* primary call-to-action */
  --sf-color-neutral-light:   oklch(0.45 0.01 280); /* greys / text base  */
  --sf-color-base-light:      oklch(0.99 0.004 280);/* page surface       */
}
```

That's it. `--sf-color-text`, `--sf-color-heading`, `--sf-color-bg`,
`--sf-color-surface`, every status colour and its readable on-colour are
derived from these.

> **Why `oklch`?** Perceptually uniform lightness means the auto-derivations
> (hover, tints, dark mode) stay visually consistent across hues. You can still
> pass hex/hsl — they're converted internally.

## Dark mode

Dark values are derived automatically from the `-light` sources, so the
6-token rebrand already themes both modes. Switch modes with `color-scheme`,
driven by `data-theme`:

```html
<html>                       <!-- follows the OS preference            -->
<html data-theme="dark">     <!-- force dark for the whole page        -->
<section data-theme="light"> <!-- force light for one region            -->
```

To take full control of a specific dark value, set the matching `-dark` token:

```css
:root { --sf-color-primary-dark: oklch(0.78 0.16 280); }
```

See the [dark-mode cookbook](dark-mode.md) for recipes (forced-dark headers, a
light card inside a dark page, the toggle script).

## Per-section & multi-brand theming

`data-theme` works on any element, not just `:root` — SLASHED re-declares all
mode-sensitive tokens directly on `[data-theme]` elements so colours, text,
borders, and links fully switch regardless of what `:root` is doing.

```html
<header data-theme="dark">Dark header on a light page</header>
<article data-theme="light">Light card inside a dark page</article>
```

For a different *palette* (not just light/dark), re-declare the six source
tokens under your own selector. All derived tokens re-compute automatically:

```css
[data-brand="sunset"] {
  --sf-color-primary-light: oklch(0.62 0.20 35);
  --sf-color-action-light:  oklch(0.70 0.18 60);
}
```

```html
<section data-brand="sunset"> … </section>
```

Combine both for a section with a different palette **and** a forced mode:

```html
<section data-brand="sunset" data-theme="dark"> … </section>
```

Because `slashed.themes` sits above the component/utility layers in the
cascade, these reassignments win without `!important`.

## Manual colour overrides

Three tiers of override, from least to most specific:

**Tier 1 — source token** (changes both modes automatically):
```css
:root { --sf-color-primary-light: oklch(0.55 0.18 280); }
```

**Tier 2 — dark source token** (changes dark mode only, light unchanged):
```css
:root { --sf-color-primary-dark: oklch(0.78 0.16 280); }
```

**Tier 3 — resolved token** (overrides the final computed value directly;
use when you need a specific value the formula can't produce):
```css
/* Global: always this value regardless of mode */
:root { --sf-color-link: oklch(0.40 0.14 280); }

/* Mode-specific: different value per mode */
:root {
  --sf-color-link: light-dark(oklch(0.40 0.14 280), oklch(0.72 0.16 280));
}
```

Place Tier 3 overrides in `slashed.overrides` (load after the SLASHED bundle)
so they survive framework updates. See `optional/overrides-example.css`.

## How universal is the colour system?

SLASHED is built to work with **any** brand colours, not a curated palette.
Here's exactly how far that goes, and where pure-CSS auto-derivation hits its
limits — check the **live Accessibility report** in the demo's Theme Customizer
to see the real numbers for *your* colours.

| Aspect | Universal? | Detail |
|---|---|---|
| Brand **hue / chroma** | ✅ Fully | Pick any hue/saturation for the 6 source colours — every derived tint, shade, hover and dark value follows. |
| **On-colour text** (`--sf-color-text--on-*`) | ✅ ~Always | Auto-picks near-black or near-white by the fill's lightness (threshold L≈0.6). Robust for essentially all colours; can be marginal only for a fill sitting *exactly* at the crossover with very high chroma. |
| **Reading text / headings / surfaces** | ✅ Within a contract | Derived from `--sf-color-neutral` and `--sf-color-surface` with lightness clamps, so text stays dark-on-light / light-on-dark regardless of the exact neutral you pick. |
| **Links on background** | ⚠️ Mostly | Lightness-clamped to clear AA for the default and most overrides; saturated yellow/green can still fall short (see below). |
| **Status colours** | ✅ Fully | Independent fixed hues with subtle/strong/muted variants; on-colours auto-derive. |

**The one structural contract:** `--sf-color-base-light` is your *light-mode
page surface* and must be light; `--sf-color-base-dark` is the dark-mode surface
and must be dark. `--sf-color-neutral` is your greyscale/text base. Within that
(entirely conventional) contract, any colours work. If you invert it — e.g. set
a dark `surface-light` — "light mode" simply isn't light, and contrast breaks; that
is a misconfiguration, not a framework limit.

**Why not guarantee 4.5:1 for every possible input in CSS alone?** Because WCAG
contrast depends on chroma and hue, not lightness alone, and CSS has no
luminance/contrast function. The framework gets you correct results for the vast
majority of real palettes automatically; for the rare edge (extreme high-chroma
links/fills) the demo's live report flags it and you override the one token.

## Link contrast

Default link text (`--sf-color-link`) keeps your **action hue** but clamps its
OKLCH lightness toward a contrast-safe band — a ceiling in light mode, a floor
in dark mode. This means links clear **WCAG AA (4.5:1)** on the page background
not only for the default palette but for the large majority of brand
overrides, automatically, without you tuning anything.

**The one caveat:** lightness dominates OKLCH contrast but doesn't fully
determine it. A *very high-chroma* hue — saturated yellow or lime green — can
still fall short of 4.5:1 even at a clamped lightness, because those hues are
intrinsically luminous. (This is the same limitation every framework that
keeps brand-coloured links has; most don't clamp at all.) If your action colour
is in that range, set the link colour explicitly:

```css
:root {
  --sf-color-link: oklch(0.45 0.12 110); /* a darker, less-saturated green */
}
```

The regression suite (`tests/link-contrast.spec.js`) verifies the clamp holds
AA across a range of moderate-chroma overrides; `tests/a11y.spec.js` runs an
axe-core audit on the default palette.

## Tuning contrast

`--sf-contrast-bias` (default `0`) is a global knob that nudges reading-text
colours toward the extremes — darker in light mode, lighter in dark mode.
Positive values increase contrast:

```css
:root { --sf-contrast-bias: 0.05; }
```

SLASHED raises it automatically under `@media (prefers-contrast: more)`.

## What gets derived

| You set | Framework derives |
|---|---|
| `--sf-color-*-light` (6) | dark equivalents, hover/active variants, tints/shades (palette), status mixes |
| `--sf-color-neutral-light` | `--sf-color-text`, `--sf-color-text--secondary`, `--sf-color-heading`, borders |
| `--sf-color-base-light` | `--sf-color-bg`, `--sf-color-inset`, `--sf-color-raised`, `--sf-color-overlay`, `--sf-color-inverse` |
| any brand colour | `--sf-color-text--on-*` (auto black/white for WCAG AA) |

See the full [token reference](tokens.md) for every overridable property.
