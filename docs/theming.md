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

`data-theme` works on any element, not just `:root` — nest it to theme a
subtree. For a different *palette* (not just light/dark), re-declare the six
source tokens under your own selector:

```css
[data-brand="sunset"] {
  --sf-color-primary-light: oklch(0.62 0.20 35);
  --sf-color-action-light:  oklch(0.70 0.18 60);
}
```

```html
<section data-brand="sunset"> … </section>
```

Because `slashed.themes` sits above the component/utility layers in the
cascade, these reassignments win without `!important`.

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
| `--sf-color-base-light` | `--sf-color-bg`, `--sf-color-surface`, `--sf-color-well`, `--sf-color-raised` |
| any brand colour | `--sf-color-text--on-*` (auto black/white for WCAG AA) |

See the full [token reference](tokens.md) for every overridable property.
