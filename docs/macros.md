# Macros

Recipes / patterns from `core/macros.css`. Macros answer
**"what does this element do / look like?"** — distinct from layout
primitives, which answer **"where do my children go?"**.

Layer: `slashed.macros` (between `slashed.components` and
`slashed.utilities`). Macros may compose with primitives and components,
but a single-property utility still wins on the same selector.

All tokens listed below live in `core/tokens.macros.css` and ship
in the optimal bundle.

---

## `.sf-prose`

Long-form text column with automatic vertical rhythm.

```html
<div class="sf-prose">
  <h2>Heading</h2>
  <p>Paragraph one.</p>
  <p>Paragraph two — automatically spaced.</p>
  <ul><li>Bullet</li><li>List</li></ul>
</div>
```

Styles direct children with `margin-block-start: var(--sf-prose-paragraph)`,
restores native list bullets, lays out `figure`, `figcaption`, `table`,
`video`. Inside a `.sf-prose`, drop `.sf-not-prose` on a region to opt out.

Tokens:

| Token | Default | What it controls |
|---|---|---|
| `--sf-prose-paragraph` | `var(--sf-content-gap)` | gap between block children |

## `.sf-not-prose`

Resets `.sf-prose` styling inside the marked subtree (block margins,
list styling, figure margins, image rounding). Useful for embedded
widgets in long-form text.

```html
<div class="sf-prose">
  <p>Article body.</p>
  <div class="sf-not-prose">
    <!-- a card or widget that should not inherit prose rules -->
  </div>
  <p>More body.</p>
</div>
```

---

## `.sf-flow`

Heydon Pickering's "lobotomized owl". Every flow child after the first
gets `margin-block-start: var(--sf-flow-space)`.

```html
<div class="sf-flow">
  <p>One</p>
  <p>Two</p>     <!-- has top margin -->
  <p>Three</p>   <!-- has top margin -->
</div>
```

Tokens:

| Token | Default | What it controls |
|---|---|---|
| `--sf-flow-space` | `var(--sf-content-gap)` | distance between consecutive children |

Override per element: `style="--sf-flow-space: 2rem"`.

---

## `.sf-truncate`

Single-line ellipsis. The element must have a finite inline-size for
the overflow to actually clip.

```html
<div class="sf-truncate" style="max-inline-size: 20rem">
  This very long sentence will be ellipsised after one line.
</div>
```

The ellipsis is supplied by `text-overflow: ellipsis`; no token is needed.

---

## `.sf-line-clamp-2`, `.sf-line-clamp-3`, `.sf-line-clamp-N`

Multi-line clamp with ellipsis. The fixed-count variants hardcode the
line count; `-N` reads `--sf-line-clamp`.

```html
<p class="sf-line-clamp-2">Two-line clamp.</p>
<p class="sf-line-clamp-3">Three-line clamp.</p>
<p class="sf-line-clamp-N" style="--sf-line-clamp: 5">N-line clamp.</p>
```

Tokens:

| Token | Default | What it controls |
|---|---|---|
| `--sf-line-clamp` | `3` | line count for `.sf-line-clamp-N` |

`-webkit-line-clamp` is a de-facto standard despite the prefix — every
modern engine implements it. The unprefixed `line-clamp` from CSS
Overflow 4 is set alongside for forward compatibility.

---

## `.sf-equal-height`

Forces flex children to share the tallest child's height.

```html
<div class="sf-equal-height">
  <div>Short</div>
  <div>Two<br>lines</div>      <!-- becomes 3-line tall -->
  <div>Three<br>lines<br>here</div>
</div>
```

Pairs naturally with grid layouts where rows already stretch.
Use this when working in flex contexts.

---

## `.sf-aspect`

Generic aspect-ratio container.

```html
<div class="sf-aspect" style="--sf-aspect: 4 / 3">…</div>
```

Tokens:

| Token | Default | What it controls |
|---|---|---|
| `--sf-aspect` | `16 / 9` | the ratio |

Distinct from the `.sf-frame` layout primitive, which is media-specific
(includes `object-fit: cover` for child `img`/`video`). `.sf-aspect`
is content-agnostic.

---

## `.sf-scroll-shadow`

Top + bottom mask gradient that fades content near the edges of a
vertically scrolling container. Pure CSS — no scroll listener.

```html
<div class="sf-scroll-shadow" style="block-size: 12rem">
  <p>Lots of content…</p>
</div>
```

Tokens:

| Token | Default | What it controls |
|---|---|---|
| `--sf-scroll-shadow-size` | `2rem` | fade depth on both edges |

Pairs nicely with overflow-y'd lists, code blocks, or tall card bodies.

---

## `.sf-scroll-snap`

Vertical scroll-snap container. Each direct child snaps to start.
For horizontal snap, use the `.sf-reel` layout primitive.

```html
<div class="sf-scroll-snap" style="block-size: 100dvh">
  <section style="block-size: 100dvh">A</section>
  <section style="block-size: 100dvh">B</section>
  <section style="block-size: 100dvh">C</section>
</div>
```

---

## `.sf-overflow-fade`

Gradient mask fade for overflowing content. Pure alpha mask — respects
the element's actual background. Reads `--sf-mask-scrim-start` /
`--sf-mask-scrim-end` for fade depth.

All directions are **physical** (not logical): `--right` always fades
the physical right edge regardless of writing direction. For logical
inline-end fading in RTL layouts, add a `:dir(rtl)` override that
swaps the gradient direction. Modifier classes work standalone and
target a specific edge or axis:

| Class | Fades |
|---|---|
| `.sf-overflow-fade` | right edge (default) |
| `.sf-overflow-fade--right` | right edge (explicit) |
| `.sf-overflow-fade--left` | left edge |
| `.sf-overflow-fade--top` | top edge |
| `.sf-overflow-fade--bottom` | bottom edge |
| `.sf-overflow-fade--block` | top **and** bottom edges |
| `.sf-overflow-fade--inline` | left **and** right edges |

```html
<!-- Single edge -->
<div class="sf-overflow-fade" style="white-space: nowrap">
  <span class="tag">…</span>
  <span class="tag">…</span>
</div>

<!-- Both inline edges (left + right) -->
<div class="sf-overflow-fade--inline" style="white-space: nowrap">…</div>

<!-- Bottom-only (e.g. truncated prose preview) -->
<div class="sf-overflow-fade--bottom" style="max-height: 6rem">…</div>
```

---

## `.sf-no-tap-highlight`

Suppresses the WebKit/Android grey tap-highlight overlay on
interactive elements where it conflicts with the framework's own
`.sf-is-active` / hover treatment.

```html
<a class="sf-no-tap-highlight" href="…">…</a>
```

Just sets `-webkit-tap-highlight-color: transparent`. No tokens.

---

## `.sf-content-auto`

Skips rendering (layout + paint) for offscreen content until it scrolls
near the viewport — a large initial-render win on long pages (product
grids, long articles).

```html
<section class="sf-content-auto">…repeated long-page section…</section>

<!-- Override the reserved placeholder size -->
<section class="sf-content-auto" style="--sf-content-intrinsic-size: 800px">…</section>
```

Tokens:

| Token | Default | What it controls |
|---|---|---|
| `--sf-content-intrinsic-size` | `500px` | placeholder block size fed to `contain-intrinsic-size` |

Sets `content-visibility: auto` plus `contain-intrinsic-size: auto
var(--sf-content-intrinsic-size)`. The `auto` keyword caches each section's
last-rendered size; the token reserves space before first render so the scrollbar
and scroll position stay stable. Unsupported engines (Safari < 18) ignore both
declarations and render normally.

> Deliberately not paired with `will-change` — it pre-creates compositing layers
> and usually hurts performance when applied broadly; set it from JS only while an
> element is actively animating.

---

## `.sf-tabular-nums`

Fixed-width digits so numbers align in vertical columns (price lists,
totals, invoices, dashboards).

```html
<table class="sf-tabular-nums">…numeric columns…</table>
```

Tokens:

| Token | Default | What it controls |
|---|---|---|
| `--sf-font-numeric` | `tabular-nums` | figure style (`core/tokens.css`) |

Sets `font-variant-numeric: var(--sf-font-numeric, tabular-nums)`. The
same token is applied to `<input type="number">` in `optional/forms.css`.
Universal browser support.

---

## `.sf-drop-shadow-xs` / `.sf-drop-shadow-s` / `.sf-drop-shadow-m` / `.sf-drop-shadow-l` / `.sf-drop-shadow-xl`

Applies `filter: drop-shadow(...)` — unlike `box-shadow`, this follows the
actual alpha shape of the element (PNG cutouts, SVG icons, transparent
logos) instead of hugging the bounding box.

```html
<img class="sf-drop-shadow-m" src="logo.svg" alt="">
<svg class="sf-drop-shadow-xl" ...>...</svg>
```

Tokens:

| Token | What it controls |
|---|---|
| `--sf-drop-shadow-xs` / `-s` / `-m` / `-l` / `-xl` | drop-shadow value consumed 1:1 by the matching class (`core/tokens.css`) |

`--sf-text-shadow-xs` / `-s` / `-m` / `-l` / `-xl` mirror the same five-step
scale for `text-shadow` (no dedicated utility class — apply the token
directly via `text-shadow: var(--sf-text-shadow-l)`), matching the
`box-shadow` ramp's `xs`..`2xl` rhythm at the small/large ends.

---

## `.sf-surface` and `.sf-surface--*`

Contextual background + auto-contrast text color. Apply to any element
to give it a filled surface with accessible foreground text.

### Generic surface: any color

`.sf-surface` (no modifier) takes **any** color through `--sf-surface-color`
(default: `--sf-color-base`) — including palette shades — and derives the
background, an auto-contrast foreground (the same lightness-flip used by
`--sf-color-text--on-*`), and the full contextual token set:

```html
<!-- a palette tint surface -->
<section class="sf-surface" style="--sf-surface-color: var(--sf-color-primary-100)">
  Text, headings, links and borders re-derive automatically.
</section>

<!-- any arbitrary color works -->
<aside class="sf-surface" style="--sf-surface-color: oklch(0.35 0.09 200)">…</aside>
```

`--sf-surface-color` inherits: a nested `.sf-surface` picks up the outer
surface's color unless it sets its own. The derivation requires relative
color syntax; outside the `@supports` gate only the background applies.

### Named variants

11 precomputed variants: `primary`, `secondary`, `tertiary`, `action`,
`neutral`, `inverse`, `success`, `warning`, `error`, `info`, `danger`.

```html
<div class="sf-surface--primary">White text on primary bg</div>
<div class="sf-surface--danger">White text on danger bg</div>
<div class="sf-surface--neutral">Auto-contrast text on neutral bg</div>
```

Each variant sets `background` to the resolved color token
(`--sf-color-{name}`) and `color` to the matching on-color token
(`--sf-color-text--on-{name}`). No extra tokens needed.

### Author your own surface

Both forms rebind the same contextual token set so descendants adapt with no
extra classes. To make any BEM component a conforming surface, copy the
contract (shown here seeded from a custom foreground/background pair):

```css
@supports (color: oklch(from red l c h)) {
  .my-component {
    /* your component's background */
    --my-bg: var(--sf-color-primary);
    background: var(--my-bg);

    /* pick or derive the foreground for your background */
    --my-fg: var(--sf-color-text--on-primary);
    color: var(--my-fg);

    --sf-color-text:              var(--my-fg);
    --sf-color-heading:           var(--my-fg);
    --sf-color-link:              oklch(from var(--my-fg) l calc(c + 0.08) h);
    --sf-color-link--hover:       var(--my-fg);
    --sf-color-link--underline:   oklch(from var(--my-fg) l c h / 0.5);
    --sf-color-text--secondary:   oklch(from var(--my-fg) l c h / 0.70);
    --sf-color-text--placeholder: oklch(from var(--my-fg) l c h / 0.45);
    --sf-color-text--disabled:    oklch(from var(--my-fg) l c h / 0.30);
    --sf-color-border:            oklch(from var(--my-fg) l c h / 0.20);
    --sf-color-border--subtle:    oklch(from var(--my-fg) l c h / 0.12);
    --sf-color-border--strong:    oklch(from var(--my-fg) l c h / 0.35);
    --sf-shadow-color:            oklch(from var(--my-bg) 0.15 c h);
  }
}
```

In most cases the simpler route is to set `--sf-surface-color` on
`.sf-surface` and let the framework do this for you.

---

## `.sf-text-gradient`

Fills text with a gradient (default `--sf-gradient-primary`).

```html
<h2 class="sf-text-gradient">Gradient headline</h2>

<!-- Override per-instance -->
<h2 class="sf-text-gradient" style="background-image: var(--sf-gradient-secondary)">
  Secondary gradient
</h2>
```

`background-clip: text` and `color: transparent` are applied unconditionally (no
`@supports` gate). The unprefixed form is used — it is supported at the framework
floor (Safari 18.0+, Chrome 125+, Firefox 129+). Browsers that don't clip
backgrounds to text render the text invisible — an accepted consequence of the
support floor.

> **Known limitation:** selecting gradient text reveals the clipping boundary
> (text appears to lose colour during selection) in most browsers.

---

## `.sf-link-external`

Adds an external-link indicator glyph after the link text via `::after`,
plus a screen-reader-only accessible name for that glyph using the CSS
alt-text syntax (`content: <value> / <string>`) — assistive tech reads it
appended after the link's own text; sighted users only see the glyph.

```html
<a href="https://example.com" class="sf-link-external">Example</a>
```

Tokens:

| Token | Default | What it controls |
|---|---|---|
| `--sf-link-external-marker` | `" \2197"` (arrow with leading space) | glyph appended after link text |
| `--sf-link-external-label` | `"opens in a new window or external site"` | accessible name read by screen readers for the glyph |

Disable globally (both the glyph and its accessible name):

```css
:root {
  --sf-link-external-marker: "";
  --sf-link-external-label: "";
}
```

Localise the announcement by overriding `--sf-link-external-label` inside a
`:lang()` block or a locale-scoped selector.

### Automatic detection by domain

`.sf-link-external` is opt-in — you add the class per link. To apply the
same treatment automatically to every cross-origin link, write your own
rule keyed to your site's own host (CSS selectors can't read a custom
property, so the host has to be a literal string) and exclude links that
wrap an image, since those carry their own accessible name:

```css
a[href^="http"]:not([href*="example.com"]):not(:has(img, svg, picture))::after {
  content: var(--sf-link-external-marker) / var(--sf-link-external-label);
  display: inline-block;
  font-size: 0.85em;
  text-decoration: none;
}
```

Swap `example.com` for your own domain. Page builders and CMS integrations
(e.g. the WordPress plugin) can generate this rule with the site's real
host injected server-side.

---

## `.sf-link--subtle`, `.sf-link--reverse`

Opt-in link underline affordances. They don't change link **colour**
(that stays the auto-contrast `--sf-color-link`); they only toggle the
underline.

```html
<a href="…" class="sf-link--subtle">Underline appears on hover/focus</a>
<a href="…" class="sf-link--reverse">Underlined at rest, clears on hover</a>
```

| Class | Resting state | Hover / focus |
|---|---|---|
| `.sf-link--subtle` | no underline | underline (currentcolor) |
| `.sf-link--reverse` | underline | no underline |

`.sf-link--subtle` suits dense link lists (nav, footers) where a
permanent underline is noisy; the hover underline preserves the
affordance at the moment of interaction.

The base `a:link` underline geometry is tokenised (added for parity with
the colour tokens):

| Token | Default | What it controls |
|---|---|---|
| `--sf-link-underline-offset` | `0.15em` | distance from the text baseline |
| `--sf-link-underline-thickness` | `auto` | underline stroke width (`auto` = font metrics) |

---

## `.sf-scrim`

Darkening overlay for text placed over a background image, so the text
clears contrast **without dimming the whole picture**. Apply to a
positioned wrapper holding the image + text; the scrim paints as a
`::before` gradient between them (the macro sets `position: relative`
and `isolation: isolate` itself).

```html
<div class="sf-scrim sf-scrim--bottom" style="position:relative">
  <img src="hero.jpg" alt="" style="display:block; inline-size:100%">
  <div class="sf-scrim__content" style="position:absolute; inset-block-end:0">
    <h2>Legible headline</h2>
  </div>
</div>
```

Media children (`img`, `picture`, `video`, `svg`, `canvas`) are left in
the background layer so the scrim darkens them; only non-media children
are lifted above the scrim. Position your content over the image with
`position: absolute` (as above) or use a CSS `background-image` on the
wrapper instead of an `<img>` child.

**Media background + overlay + stacked content, with no manual
`z-index`:** compose with the [`.sf-bg-layer`](layout.md) layout primitive
instead of a plain `<img>` — it auto-fills the parent (`position:
absolute; inset: 0`) and already composes under `.sf-scrim` by design,
so `img`/`video` background, gradient, and content stack correctly with
zero extra positioning:

```html
<div class="sf-scrim sf-scrim--bottom">
  <img class="sf-bg-layer" src="hero.jpg" alt="">
  <div class="sf-scrim__content">
    <h2>Media background, scrim, and content — no z-index to manage</h2>
  </div>
</div>
```

This is the framework's answer to "background media + overlay + stacked
content" — no dedicated macro needed on top of `.sf-bg-layer` + `.sf-scrim`.

Variants:

| Class | Effect |
|---|---|
| `.sf-scrim--bottom` | gradient darkest at the bottom (default — text at bottom) |
| `.sf-scrim--top` | gradient darkest at the top |
| `.sf-scrim--full` | even wash over the whole image |

Tokens:

| Token | Default | What it controls |
|---|---|---|
| `--sf-scrim-color` | `oklch(0 0 0 / 0.55)` | the dark stop |
| `--sf-scrim-direction` | `to top` | gradient direction |
| `--sf-scrim-gradient` | `linear-gradient(var(--sf-scrim-direction), var(--sf-scrim-color), transparent)` | the whole composed gradient (override for multi-stop / radial) |

The lift selector is `.sf-scrim > :not(img, picture, video, svg, canvas) { z-index: 1 }`.

---

## `.sf-surface-bg`

A reusable, **named background surface** preset. Where `.sf-surface` sets a
solid colour and `.sf-scrim` adds a single gradient overlay, `.sf-surface-bg`
bundles a full background into one class you can name once and reuse: base
colour fallback + image/gradient/pattern + sizing + an optional overlay
layered above the image + an optional animation.

The class itself is inert — it only composes the `--sf-surface-bg-*` tokens.
Define a preset by setting those tokens on a scope, then apply the class:

```css
.hero-surface {
  --sf-surface-bg-image:     url("/hero.avif");
  --sf-surface-bg-overlay:   var(--sf-scrim-gradient);   /* reuse the scrim */
  --sf-surface-bg-animation: sf-pan 40s linear infinite; /* optional */
}
```

```html
<section class="hero-surface sf-surface-bg">…</section>
```

The overlay is the **first** `background-image` layer, so it paints *above*
the image (use it for a scrim/tint over a photo). Builds on the existing
scrim + gradient tokens rather than new infrastructure; for a blurred backdrop
compose `.sf-scrim` or a `filter` on top.

Tokens:

| Token | Default | What it controls |
|---|---|---|
| `--sf-surface-bg-color` | `transparent` | base colour fallback (below the image) |
| `--sf-surface-bg-image` | `none` | the image / gradient / pattern layer |
| `--sf-surface-bg-overlay` | `none` | overlay layered above the image (e.g. a scrim) |
| `--sf-surface-bg-size` | `cover` | `background-size` |
| `--sf-surface-bg-position` | `center` | `background-position` |
| `--sf-surface-bg-repeat` | `no-repeat` | `background-repeat` |
| `--sf-surface-bg-attachment` | `scroll` | `background-attachment` |
| `--sf-surface-bg-animation` | `none` | optional `animation` shorthand |

---

## `.sf-text-protect`

Lighter-weight alternative to `.sf-scrim`: protects text legibility over
a busy image **without** a darkening layer, using a soft shadow halo
behind the glyphs. Apply directly to the text element.

```html
<h2 class="sf-text-protect">Readable over a photo</h2>
```

Tokens:

| Token | Default | What it controls |
|---|---|---|
| `--sf-scrim-text-shadow` | `0 1px 3px oklch(0 0 0 / 0.6)` | the protective text shadow |

---

## `.sf-entrance--*`

Scroll-driven entrance animations. Elements animate into view as they
enter the viewport.

6 variants: `fade`, `fade-up`, `fade-down`, `fade-left`, `fade-right`,
`scale-up`.

```html
<div class="sf-entrance--fade-up">Fades in while sliding up</div>
<div class="sf-entrance--scale-up">Scales from 95% to 100%</div>
```

**How it works:** Uses `animation-timeline: view()` where supported
(Chrome/Edge 115+). In browsers without scroll-driven animation support
(Firefox, which keeps it behind a flag, and Safari), the class falls back
to a one-shot time-driven animation at `--sf-duration-slow`.

Tokens:

| Token | Default | What it controls |
|---|---|---|
| `--sf-scroll-timeline-range-start` | `entry 0%` | when the animation begins |
| `--sf-scroll-timeline-range-end` | `cover 30%` | when the animation completes |

All entrance classes are gated by `prefers-reduced-motion: no-preference`;
when the user opts out of motion the animations are inert (no movement).

---

## `.sf-exit--*`

Scroll-driven exit animations — the symmetric counterpart of
`.sf-entrance--*`. Elements animate out as they leave the viewport.

6 variants: `fade`, `fade-up`, `fade-down`, `fade-left`, `fade-right`,
`scale-down`.

```html
<div class="sf-exit--fade-up">Fades out while sliding up as it leaves</div>
<div class="sf-exit--scale-down">Scales from 100% to 92% on exit</div>
```

**How it works:** Uses `animation-timeline: view()` where supported
(Chrome/Edge 115+). Unlike `.sf-entrance--*`, there is **no** time-driven
fallback: `animation-name` only applies inside
`@supports (animation-timeline: view())`. An unconditional one-shot exit
animation would fade the element out on load and leave it hidden forever
in engines without scroll-driven animation support — so those engines
just render the element normally, visible and static.

Tokens:

| Token | Default | What it controls |
|---|---|---|
| `--sf-scroll-timeline-range-exit-start` | `cover 70%` | when the exit animation begins |
| `--sf-scroll-timeline-range-exit-end` | `exit 100%` | when the exit animation completes |

All exit classes are gated by `prefers-reduced-motion: no-preference`;
when the user opts out of motion the animations are inert (no movement).

Lives in `core/motion.css`, layer `slashed.motion`.

---

## `.sf-corner-scoop`

A corner that curves **away** from the box (a concave "notch"), instead
of the normal convex `border-radius`. Reveals whatever sits behind the
element at that corner via a `mask-image` radial gradient. Default
corner is top-right.

```html
<div class="sf-card sf-corner-scoop sf-corner-scoop--bottom-right">
  Panel with a corner that curves away
</div>
```

Variants:

| Class | Effect |
|---|---|
| `.sf-corner-scoop--top-left` | scoop at the top-left corner |
| `.sf-corner-scoop--top-right` | scoop at the top-right corner |
| `.sf-corner-scoop--bottom-left` | scoop at the bottom-left corner |
| `.sf-corner-scoop--bottom-right` | scoop at the bottom-right corner |

Tokens:

| Token | Default | What it controls |
|---|---|---|
| `--sf-corner-scoop-size` | `var(--sf-radius-2xl)` | radius of the concave cut |
| `--sf-corner-scoop-at` | `100% 0` | position of the cut (set by the variants above) |

**Limitations:** masking cuts the element's entire paint at that
corner — `box-shadow`/`border` don't survive the cut there (put shadows
on a wrapper element if needed). Only one scoop per element — a second
mask layer would fill the first hole rather than adding a second cut.
Doesn't compose with other mask-based macros (`.sf-overflow-fade`,
`.sf-scroll-shadow`) on the same element — the last `mask-image` wins.

---

## `.sf-overlap` and `.sf-overlap-host`

A recipe for one element intentionally overlapping the element before
it (e.g. an avatar or image pulled up over the card below it), and the
receiving container that reserves space for the intrusion.

```html
<img class="sf-overlap" src="badge.png" alt="">
<article class="sf-card sf-overlap-host">
  Content starts below the intruding image automatically.
</article>
```

`.sf-overlap` variants (directional — standalone, not knob re-pointers,
since each moves a different margin):

| Class | Effect |
|---|---|
| `.sf-overlap` | pulls up over the previous element (default) |
| `.sf-overlap--down` | pulls down over the next element |
| `.sf-overlap--start` | pulls into the inline-start side |
| `.sf-overlap--end` | pulls into the inline-end side |

Tokens:

| Token | Default | What it controls |
|---|---|---|
| `--sf-overlap-pull` | `var(--sf-space-xl)` | how far `.sf-overlap` pulls into the adjacent element |

`.sf-overlap-host`'s block-start padding reads `var(--sf-overlap-host-pad, var(--sf-overlap-pull))`
directly in the CSS declaration rather than through a declared token, so it isn't part of the
token registry — set `--sf-overlap-host-pad` inline on an instance to compensate by something
other than the default pull amount.

`.sf-overlap-host` sets `isolation: isolate` so the overlapping element's
raised `z-index` stays scoped to this container rather than fighting
page-level stacking.
