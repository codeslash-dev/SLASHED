# Macros

Recipes / patterns from `core/macros.css`. Macros answer
**"what does this element do / look like?"** — distinct from layout
primitives, which answer **"where do my children go?"**.

Layer: `slashed.macros` (between `slashed.components` and
`slashed.utilities`). Macros may compose with primitives and components,
but a single-property utility still wins on the same selector.

All tokens listed below live in `core/tokens.macros.css` and ship
in the essential bundle.

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

End-edge horizontal fade for inline content that overflows its
container (e.g. a row of tags, a wide code block). Pure mask, so it
respects the element's actual background.

```html
<div class="sf-overflow-fade" style="white-space: nowrap; overflow: hidden">
  <span class="tag">…</span>
  <span class="tag">…</span>
  <span class="tag">…</span>
</div>
```

Reads `--sf-scroll-shadow-size` for the fade width.

---

## `.sf-no-tap-highlight`

Suppresses the WebKit/Android grey tap-highlight overlay on
interactive elements where it conflicts with the framework's own
`.is-active` / hover treatment.

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

Adds an external-link indicator glyph after the link text via `::after`.

```html
<a href="https://example.com" class="sf-link-external">Example</a>
```

Tokens:

| Token | Default | What it controls |
|---|---|---|
| `--sf-link-external-marker` | `" \2197"` (arrow with leading space) | glyph appended after link text |

Disable globally:

```css
:root { --sf-link-external-marker: ""; }
```

For automatic detection of external links (without adding the class
manually), write your own rule targeting `a[rel~="external"]` or
`a[href^="https://"]` and apply the same marker technique.

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

Lives in `core/motion.css`, layer `slashed.motion`.
