# Colors

SLASHED's entire color system is generated from **10 source colors**. You set
those, and everything else — dark mode, hover states, tints, borders, text
contrast — is derived automatically. You should never need to hand-pick a hex
value for a hover state or a dark-mode variant.

> Source of truth: `core/tokens.css` and `core/themes.css`. If anything here
> ever looks out of date, those files win.

## The 10 source colors

| Token | Role | Use it for |
|---|---|---|
| `--sf-color-primary` | Brand identity | Hero sections, brand-forward surfaces, marketing CTAs |
| `--sf-color-secondary` | Supporting brand color (darker, low-chroma by default) | Secondary brand surfaces, footers, dark bands |
| `--sf-color-tertiary` | Accent brand color | Tags, chart accents, decorative flourishes |
| `--sf-color-action` | **Default interactive color** | Buttons, links, focus rings, form controls — anything clickable |
| `--sf-color-neutral` | Desaturated grey | Feeds text, borders, scrollbars — not used directly very often |
| `--sf-color-base` | Page surface color | Feeds backgrounds (`bg`, `inset`, `raised`) — not used directly very often |
| `--sf-color-success` | Positive status | Confirmations, success alerts/badges |
| `--sf-color-warning` | Caution status | Non-blocking warnings |
| `--sf-color-info` | Neutral/informational status | Informational banners/badges |
| `--sf-color-danger` | Negative status | Errors, validation failures, destructive actions |

**The most common mistake:** reaching for `primary` when you mean `action`.
`primary` is your brand color; `action` is what buttons and links actually use
by default. They can be the same hue, but they're separate knobs on purpose —
you can retune interactive elements without recoloring your brand mark, or
vice versa.

## Rebranding

Override the six brand/base source tokens on `:root`. Any valid CSS color
works (hex, `hsl`, `oklch`, …):

```css
:root {
  --sf-color-primary-source-light:   oklch(0.55 0.18 280);
  --sf-color-secondary-source-light: oklch(0.30 0.04 280);
  --sf-color-tertiary-source-light:  oklch(0.62 0.15 200);
  --sf-color-action-source-light:    oklch(0.62 0.16 150);
  --sf-color-neutral-source-light:   oklch(0.45 0.01 280);
  --sf-color-base-source-light:      oklch(0.99 0.004 280);
}
```

That's it — dark mode, hover states, tints, and text contrast all recompute
from these six values. A starter file is provided at
[`optional/customize-example.css`](../optional/customize-example.css).

## Light and dark mode, automatically

Every source color has a `-source-light` value. You *may* also set a
`-source-dark` value for full control, but if you don't, SLASHED derives one
for you — lightened/desaturated appropriately for a dark background. Dark mode
activates via `prefers-color-scheme`, or explicitly via `data-theme="dark"` /
`data-theme="light"` on `<html>` or any container (which enables per-section
theming).

You never need to write `[data-theme="dark"] { color: ... }` rules yourself —
just use the semantic tokens (`--sf-color-text`, `--sf-color-action`, etc.) and
they'll flip automatically.

## Using colors in your CSS

For a colored surface with correctly-contrasting content inside it, use the
ready-made surface classes rather than wiring backgrounds/text by hand:

```html
<div class="sf-surface--primary">
  <p>This text, links, and borders inside here all auto-contrast.</p>
</div>
```

Available: `.sf-surface--primary`, `--secondary`, `--tertiary`, `--action`,
`--neutral`, `--inverse`, `--success`, `--warning`, `--info`, `--danger`.

For everything else (body text, headings, borders, links), just use the
semantic tokens directly — don't reference brand colors for these:

```css
p        { color: var(--sf-color-text); }
h1, h2   { color: var(--sf-color-heading); }
.card    { border-color: var(--sf-color-border); background: var(--sf-color-surface); }
a:link   { color: var(--sf-color-link); }
```

These already track your `neutral`/`base`/`action` source colors and already
adapt to dark mode — that's the point of the semantic layer.

## Shade ramps — which shade to use

`primary`, `secondary`, `tertiary`, `action`, `neutral`, and `base` each expose
a numeric 50→950 ramp:

| Step | What it looks like | Typical use |
|---|---|---|
| 50–100 | barely-there tint | subtle backgrounds, soft hover wash |
| 200–300 | light tint | badge/pill backgrounds |
| 400 | lighter | borders/dividers on a colored component |
| **500** | the color itself | the base swatch — same value as `--sf-color-primary` |
| 600–700 | darkened | hover/active states, text-on-tint |
| 800–900 | heavily darkened | pressed states, high-contrast text |
| 950 | near-black/near-text | ramp floor, rarely used directly |

Readable aliases exist for the steps you'll actually reach for:

```
--sf-color-primary-superlight   (= -50)
--sf-color-primary-xlight       (= -200)
--sf-color-primary-lighter      (= -400)
--sf-color-primary-darker       (= -600)
--sf-color-primary-xdark        (= -800)
--sf-color-primary-superdark    (= -950)
--sf-color-primary--hover       (= -600, same as darker)
--sf-color-primary--active      (= -800, same as xdark)
```

(same pattern for `secondary`, `tertiary`, `action`, `neutral`)

Prefer `--hover` / `--active` over the raw numeric step when styling
interactive states — the intent is clearer and it's the same value.

**`base` is different.** It's an absolute grey ladder (near-white at `-50` down
to near-black at `-950`) that does **not** change between light and dark mode —
useful when you want a fixed grey regardless of theme. If you want something
that *adapts* to light/dark instead (a page background, a card, an inset
panel), use the surface tokens instead of the base ramp directly:

```css
--sf-color-bg       /* page background */
--sf-color-surface  /* same as --sf-color-base, use for cards/containers */
--sf-color-inset    /* recessed panel, slightly darker than bg */
--sf-color-raised   /* elevated panel, slightly lighter than bg */
```

## Alpha (transparent) variants

Every family also has alpha steps for laying a color over an unknown
background:

| Token | Opacity | Alias |
|---|---|---|
| `-a5` | 5% | `-tint` |
| `-a10` | 10% | `-subtle` |
| `-a30` | 30% | `-muted` |
| `-a50` | 50% | — |
| `-a80` | 80% | — |

Use these (not the numeric 50–950 ramp) when the element sits on top of a
background you don't control — e.g. a colored badge that might appear on a
light or dark card. The numeric ramp is baked against a specific surface/text
color and will look wrong if the background changes underneath it; the alpha
variants stay correct anywhere.

## Status colors

`success`, `warning`, `info`, `danger` don't have a full numeric ramp — they
have a smaller, purpose-built set:

| Token | Use for |
|---|---|
| `--sf-color-{status}` | icons, small accents, borders |
| `--sf-color-{status}-strong` | solid backgrounds needing more contrast, hover/active on a status button |
| `--sf-color-{status}-subtle` (~12% alpha) | tinted container background (e.g. an alert box) |
| `--sf-color-{status}-muted` (~30% alpha) | stronger wash, e.g. a badge background |

Example — an error alert:

```css
.alert--danger {
  background:   var(--sf-color-danger-subtle);
  border-color: var(--sf-color-danger);
  color:        var(--sf-color-danger-strong);
}
```

## Text on a colored background

Whenever text sits directly on a solid brand/status color, use the matching
`--sf-color-text--on-*` token instead of hardcoding black or white — it
auto-picks whichever gives better contrast against that specific color:

```css
.badge--primary {
  background: var(--sf-color-primary);
  color:      var(--sf-color-text--on-primary);
}
```

Available: `--on-primary`, `--on-secondary`, `--on-tertiary`, `--on-action`,
`--on-neutral`, `--on-success`, `--on-warning`, `--on-info`, `--on-danger`,
`--on-inverse`.

If your brand color sits in an in-between lightness where neither black nor
white text is great, you can override the crossover point for just that
surface:

```css
.sf-surface--primary { --sf-contrast-threshold: 0.55; }
```

or override the exact text color directly:

```css
.sf-surface--primary { --sf-color-text--on-primary: oklch(0.15 0 0); }
```

## Quick reference: "I need..."

| I need... | Reach for |
|---|---|
| A button / link / focus ring | `--sf-color-action` (+ `--hover` / `--active`) |
| A brand-colored hero/marketing block | `--sf-color-primary` |
| An accent tag/chip color | `--sf-color-tertiary` |
| Body text, headings, borders | `--sf-color-text`, `--sf-color-heading`, `--sf-color-border` |
| Page/card backgrounds | `--sf-color-bg`, `--sf-color-surface`, `--sf-color-inset`, `--sf-color-raised` |
| Success/warning/info/error feedback | the matching status token, `-subtle` for backgrounds, `-strong` for hover |
| Text on a solid color | `--sf-color-text--on-*` |
| A colored "card" where everything inside should just look right | `.sf-surface--*` macro class |
| A tint of a brand color over a *known* background | numeric ramp (`-100`…`-400`) |
| A tint of a brand color over an *unknown* background | alpha variant (`-tint` / `-subtle` / `-muted`) |

## See also

- [`docs/theming.md`](../docs/theming.md) — rebranding reference and the fluid
  type/space engine
- [`docs/tokens.md`](../docs/tokens.md) — full token reference
