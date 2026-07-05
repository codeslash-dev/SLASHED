# Components

> **Status:** As of **v0.7.0** the first component tranche — `.sf-btn` and
> `.sf-card` — is **live** in the `slashed.components` layer (ships in the
> `*-components` and `full` bundles). The remaining reserved components below are
> still staged (commented out in `optional/components.css`, 0 bytes) and land
> incrementally in later minors. The `@layer slashed.components` slot is real and
> ordered.

Component names are reserved by convention and land incrementally as additive
features; none will be renamed. You can write your own BEM components against the
same selector pattern (e.g. `.my-button`) today and switch to the `.sf-*` class
when it ships.

## Component names

| # | Class | Status | Modifiers | Slots / children |
|---|---|---|---|---|
| 1 | `.sf-btn` | **live (0.7.0)** | `--primary`, `--neutral`, `--success`, `--warning`, `--info`, `--danger`, `--secondary`, `--ghost`, `--outline`, `--xs`, `--s`, `--l`, `--xl`, `--block`, `--block-cq` | — |
| 2 | `.sf-card` | **live (0.7.0)** | `--bordered`, `--elevated`, `--interactive` | `__header`, `__body`, `__footer`, `__media`, `__avatar`, `__title` |
| 3 | `.sf-badge` | staged | `--primary`, `--success`, `--warning`, `--danger`, `--info`, `--neutral` | — |
| 4 | `.sf-tag` | staged | `--primary`, `--success`, `--warning`, `--danger`, `--info`, `--removable` | `__remove` |
| 5 | `.sf-alert` | staged | `--success`, `--warning`, `--error`, `--info`, `--dismissible` | `__icon`, `__close` |
| 6 | `.sf-avatar` | staged | `--xs`, `--s`, `--m`, `--l`, `--xl`, `--square` | — |
| 7 | `.sf-modal` | staged | `--s`, `--m`, `--l`, `--full` | `__header`, `__body`, `__footer`, `__close` |
| 8 | `.sf-skeleton` | staged | `--text`, `--avatar`, `--card`, `--line` | — |

---

## `.sf-btn`

An interactive call-to-action. Apply to `<button>` or `<a>` — it stays intrinsic
width (never full-bleed) unless you opt in. Because it's excluded from the
classless `<button>` styling in `optional/forms.css` (via `:not([class*="sf-"])`),
`.sf-btn` fully owns its own look.

```html
<!-- Default (action colour) -->
<button class="sf-btn">Save</button>

<!-- Colour families -->
<button class="sf-btn sf-btn--primary">Primary</button>
<button class="sf-btn sf-btn--success">Confirm</button>
<button class="sf-btn sf-btn--danger">Delete</button>

<!-- Style treatments -->
<button class="sf-btn sf-btn--secondary">Secondary</button>
<button class="sf-btn sf-btn--ghost">Ghost</button>
<button class="sf-btn sf-btn--outline">Outline</button>

<!-- Outline composes with any colour family -->
<button class="sf-btn sf-btn--danger sf-btn--outline">Delete</button>

<!-- Sizes (m is the default) -->
<button class="sf-btn sf-btn--xs">XS</button>
<button class="sf-btn sf-btn--s">Small</button>
<button class="sf-btn sf-btn--l">Large</button>
<button class="sf-btn sf-btn--xl">XL</button>

<!-- States -->
<button class="sf-btn" disabled>Disabled</button>
<button class="sf-btn is-loading"><span>Saving…</span></button>

<!-- Full width -->
<button class="sf-btn sf-btn--block">Block</button>
```

**Modifiers**

| Group | Modifier | Effect |
|---|---|---|
| Colour | `--primary` `--neutral` `--success` `--warning` `--info` `--danger` | Swaps the colour family; base (no modifier) uses `--sf-color-action`. |
| Style | `--secondary` | Transparent fill, coloured text + border; subtle tint on hover. |
| Style | `--ghost` | Transparent fill **and** border; tint on hover. |
| Style | `--outline` | Coloured border/text, transparent fill; **fills** with the family colour on hover. Composes with any colour family. |
| Size | `--xs` `--s` `--l` `--xl` | Scales padding, font-size, and min-height (`m` = default). |
| Width | `--block` | Full width everywhere. |
| Width | `--block-cq` | Full width only inside a query container narrower than `20rem`. |
| State | `:disabled` / `.is-disabled` | Dimmed, `pointer-events: none`. |
| State | `.is-loading` | Hides content, shows a spinner (static under `prefers-reduced-motion: reduce`). |

Every variant sets three rule-local custom properties — `--sf-btn-color`,
`--sf-btn-color--hover`, `--sf-btn-on-color` — which is what lets `--outline`
stay orthogonal to the colour families.

**Tokens** (`optional/tokens.components.css`)

| Token | Default | Controls |
|---|---|---|
| `--sf-btn-radius` | `var(--sf-radius-m)` | Corner radius |
| `--sf-btn-padding-block` | `var(--sf-space-xs)` | Vertical padding |
| `--sf-btn-padding-inline` | `var(--sf-space-m)` | Horizontal padding |
| `--sf-btn-gap` | `var(--sf-space-2xs)` | Gap between icon + label |
| `--sf-btn-font-size` | `var(--sf-text-m)` | Label size |
| `--sf-btn-font-weight` | `var(--sf-font-weight-interactive)` | Label weight |
| `--sf-btn-min-height` | `var(--sf-touch-target)` | Minimum target height (WCAG 2.2) |
| `--sf-btn-border-width` | `var(--sf-border-width-1)` | Border thickness |

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

A `.sf-btn` nested in a card automatically shrinks to `--sf-card-btn-font-size`.
Pair `--interactive` with `.sf-clickable-parent` (from `core/accessibility.css`)
when the entire card should be a single link.

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
| `--sf-card-shadow` | `var(--sf-shadow-s)` | Base shadow |
| `--sf-card-shadow--elevated` | `var(--sf-shadow-l)` | `--elevated` shadow |
| `--sf-card-shadow--hover` | `var(--sf-shadow-l)` | `--interactive` hover shadow |
| `--sf-card-media-ratio` | `var(--sf-ratio-video)` | `__media` aspect ratio |
| `--sf-card-heading-size` | `var(--sf-text-xl)` | `__title` size |
| `--sf-card-btn-font-size` | `var(--sf-text-s)` | Nested `.sf-btn` size |

---

## Recipe: gradient-outline button

A gradient border isn't a shipped `.sf-btn` variant (solid outline covers the
common case), but it's a low-cost copy-paste recipe using the framework's gradient
tokens. It layers a gradient behind the button and masks out the centre so only the
border shows; `@property` makes the gradient animatable on hover.

```css
@property --sf-grad-a { syntax: "<color>"; inherits: false; initial-value: transparent; }
@property --sf-grad-b { syntax: "<color>"; inherits: false; initial-value: transparent; }

.btn-gradient-outline {
  position: relative;
  background: transparent;
  color: var(--sf-color-text);
  border-color: transparent;
}
.btn-gradient-outline::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: var(--sf-border-width-1);
  background: linear-gradient(120deg, var(--sf-grad-a), var(--sf-grad-b));
  /* Punch out the centre so only the padding (the "border") shows. */
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
          mask-composite: exclude;
  --sf-grad-a: var(--sf-color-primary);
  --sf-grad-b: var(--sf-color-action);
  transition: --sf-grad-a var(--sf-duration-normal), --sf-grad-b var(--sf-duration-normal);
}
.btn-gradient-outline:hover::before {
  --sf-grad-a: var(--sf-color-action);
  --sf-grad-b: var(--sf-color-primary);
}
```

Apply it alongside `.sf-btn` (`class="sf-btn btn-gradient-outline"`) to inherit the
button's sizing, radius, and layout. The mask technique and animated `@property`
are within SLASHED's supported browser floor.

## Out of scope for 0.x

Not reserved and won't ship in 0.x (need JS, already covered by a macro/recipe, or
the API needs more usage data). Write these as your own BEM class reading SLASHED
tokens:

- `.sf-tabs`, `.sf-accordion` — need JS for keyboard nav / disclosure
- `.sf-tooltip`, `.sf-popover` — popover API + anchor positioning still in flux
- `.sf-pagination` — needs UX research
- `.sf-breadcrumb` — too simple to justify a class API
- `.sf-progress` — native `<progress>` already styled in `slashed.base`
- `.sf-spinner` — `.is-loading` covers it
- `.sf-table` — `.sf-prose` styles long-form tables
- `.sf-form-field` — forms are classless via `optional/forms.css`
- `.sf-nav` — too site-specific

## Roadmap

The first batch — `.sf-btn` + `.sf-card` — shipped in **v0.7.0**. Each subsequent
minor that ships a component uncomments its block in `optional/components.css` +
the matching token block, documents it here with HTML examples, adds tests under
`tests/`, and bumps `MINOR` only (no breaking changes).
