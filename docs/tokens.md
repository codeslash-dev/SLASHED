# SLASHED token reference (v0.2.0)

Every public design value SLASHED ships is exposed as a custom property under the `--sf-` prefix. Defaults below match a stock build (the values you get if you load `dist/slashed.essential.css` and add nothing). To change any token, redeclare it in your own `:root` rule (or any narrower selector) and the cascade will pick it up: `:root { --sf-color-primary-light: oklch(0.45 0.20 264); }`.

The `Override` column tells you what kind of token you are looking at:

- **source**: animatable `@property`-registered input. Override these to rebrand.
- **resolved**: derived from sources via `light-dark()` plus auto-derivation. Override at this level for full per-mode control.
- **derived**: computed from another resolved token (no per-mode override expected).
- **control**: numeric knob that tunes a system formula (shadow alpha curve, on-color flip threshold, dark-mode auto-derive curve).
- **alias**: pointer to another token, used as a stable consumer entry point.
- **component**: layout primitive or component-scoped slot.

Long `clamp()` expressions are abbreviated as `clamp(min, ..., max)`. Full expressions live in `core/tokens.css` and `core/tokens.layout.css`.

---

## Color: source pairs (`-light` / `-dark`)

Six brand and five status colors. Override either side; the other auto-derives if left unset.

| Token | Default | Description | Override |
|-------|---------|-------------|----------|
| `--sf-color-primary-light` | `oklch(0.45 0.20 264)` | Brand primary, light mode | source |
| `--sf-color-primary-dark` | auto-derived | Brand primary, dark mode | source |
| `--sf-color-secondary-light` | `oklch(0.25 0.03 260)` | Secondary brand, light mode | source |
| `--sf-color-secondary-dark` | auto-derived | Secondary brand, dark mode | source |
| `--sf-color-tertiary-light` | `oklch(0.55 0.14 310)` | Tertiary brand, light mode | source |
| `--sf-color-tertiary-dark` | auto-derived | Tertiary brand, dark mode | source |
| `--sf-color-action-light` | `oklch(0.60 0.16 210)` | Interactive accent, light mode | source |
| `--sf-color-action-dark` | auto-derived | Interactive accent, dark mode | source |
| `--sf-color-neutral-light` | `oklch(0.55 0.02 260)` | Neutral hue anchor, light mode | source |
| `--sf-color-neutral-dark` | auto-derived | Neutral hue anchor, dark mode | source |
| `--sf-color-base-light` | `oklch(0.98 0.005 260)` | Page surface, light mode | source |
| `--sf-color-base-dark` | auto-derived | Page surface, dark mode | source |
| `--sf-color-success-light` | `oklch(0.55 0.17 150)` | Success status, light mode | source |
| `--sf-color-success-dark` | auto-derived | Success status, dark mode | source |
| `--sf-color-warning-light` | `oklch(0.75 0.17 80)` | Warning status, light mode | source |
| `--sf-color-warning-dark` | auto-derived | Warning status, dark mode | source |
| `--sf-color-error-light` | `oklch(0.62 0.20 35)` | Form error, light mode | source |
| `--sf-color-error-dark` | auto-derived | Form error, dark mode | source |
| `--sf-color-info-light` | `oklch(0.55 0.15 240)` | Info status, light mode | source |
| `--sf-color-info-dark` | auto-derived | Info status, dark mode | source |
| `--sf-color-danger-light` | `oklch(0.48 0.24 12)` | Destructive action, light mode | source |
| `--sf-color-danger-dark` | auto-derived | Destructive action, dark mode | source |

## Color: resolved (`light-dark()`)

Mode-resolved values that components reference. Override these directly to bypass the auto-derive curve.

| Token | Default | Description | Override |
|-------|---------|-------------|----------|
| `--sf-color-primary` | `light-dark(...primary-light, ...primary-dark)` | Resolved brand primary | resolved |
| `--sf-color-secondary` | `light-dark(...secondary-light, ...secondary-dark)` | Resolved secondary | resolved |
| `--sf-color-tertiary` | `light-dark(...tertiary-light, ...tertiary-dark)` | Resolved tertiary | resolved |
| `--sf-color-action` | `light-dark(...action-light, ...action-dark)` | Resolved interactive accent | resolved |
| `--sf-color-neutral` | `light-dark(...neutral-light, ...neutral-dark)` | Resolved neutral | resolved |
| `--sf-color-base` | `light-dark(...base-light, ...base-dark)` | Resolved surface | resolved |
| `--sf-color-success` | `light-dark(...success-light, ...success-dark)` | Resolved success | resolved |
| `--sf-color-warning` | `light-dark(...warning-light, ...warning-dark)` | Resolved warning | resolved |
| `--sf-color-error` | `light-dark(...error-light, ...error-dark)` | Resolved error | resolved |
| `--sf-color-info` | `light-dark(...info-light, ...info-dark)` | Resolved info | resolved |
| `--sf-color-danger` | `light-dark(...danger-light, ...danger-dark)` | Resolved danger | resolved |

## Color: surfaces

Layered surface tints derived from `--sf-color-base`.

| Token | Default | Description | Override |
|-------|---------|-------------|----------|
| `--sf-color-bg` | `oklch(from base calc(l + 0.02) c h)` | Page background | derived |
| `--sf-color-surface` | `var(--sf-color-base)` | Default surface | alias |
| `--sf-color-well` | `oklch(from base calc(l - 0.02) c h)` | Inset / sunken surface | derived |
| `--sf-color-raised` | `oklch(from base calc(l + 0.04) c h)` | Elevated card surface | derived |
| `--sf-color-overlay` | `oklch(from base l c h / 0.9)` | Modal / scrim backdrop | derived |
| `--sf-color-inverse` | `oklch(from base calc(1 - l) c h)` | Inverted-mode surface | derived |

## Color: text

| Token | Default | Description | Override |
|-------|---------|-------------|----------|
| `--sf-color-text` | clamp on `neutral` (mode-dependent) | Body copy | derived |
| `--sf-color-text--secondary` | clamp on `neutral`, looser | Secondary text | derived |
| `--sf-color-text--muted` | `var(--sf-color-neutral)` | Muted text | alias |
| `--sf-color-text--placeholder` | clamp on `neutral` | Form placeholder | derived |
| `--sf-color-text--disabled` | clamp on `neutral` | Disabled text | derived |
| `--sf-color-text--inverse` | clamp on `neutral`, inverted | Text on inverse surface | derived |
| `--sf-color-heading` | clamp on `neutral` | Headings | derived |

## Color: text-on-surface

`sign()`-driven auto-contrast text for any colored surface. See `docs/color-aliases-design-decisions.md` for the threshold discussion.

| Token | Default | Description | Override |
|-------|---------|-------------|----------|
| `--sf-color-text--on-primary` | `sign()` flip | Text on `--sf-color-primary` | derived |
| `--sf-color-text--on-secondary` | `sign()` flip | Text on `--sf-color-secondary` | derived |
| `--sf-color-text--on-tertiary` | `sign()` flip | Text on `--sf-color-tertiary` | derived |
| `--sf-color-text--on-action` | `sign()` flip | Text on `--sf-color-action` | derived |
| `--sf-color-text--on-neutral` | `sign()` flip | Text on `--sf-color-neutral` | derived |
| `--sf-color-text--on-base` | `var(--sf-color-text)` | Text on page surface | alias |
| `--sf-color-text--on-inverse` | `var(--sf-color-text--inverse)` | Text on inverse surface | alias |
| `--sf-color-text--on-success` | `sign()` flip | Text on success | derived |
| `--sf-color-text--on-warning` | `sign()` flip | Text on warning | derived |
| `--sf-color-text--on-error` | `sign()` flip | Text on error | derived |
| `--sf-color-text--on-info` | `sign()` flip | Text on info | derived |
| `--sf-color-text--on-danger` | `sign()` flip | Text on danger | derived |

## Color: borders

| Token | Default | Description | Override |
|-------|---------|-------------|----------|
| `--sf-color-border` | clamp on `neutral` (mode-dependent) | Default border | derived |
| `--sf-color-border--subtle` | clamp on `neutral`, lighter | Hairline border | derived |
| `--sf-color-border--strong` | clamp on `neutral`, denser | Emphasised border | derived |
| `--sf-color-border--focus` | `var(--sf-color-action)` | Focus outline color | alias |
| `--sf-color-border--disabled` | `oklch(from border--subtle l 0 h / 0.5)` | Disabled border | derived |
| `--sf-color-border--translucent` | `oklch(from neutral l c h / 0.15)` | Glass-effect border | derived |

## Color: links

| Token | Default | Description | Override |
|-------|---------|-------------|----------|
| `--sf-color-link` | `var(--sf-color-action)` | Link rest | alias |
| `--sf-color-link--hover` | `light-dark()` clamp on `action` | Link hover | derived |
| `--sf-color-link--active` | `light-dark()` clamp on `action` | Link active | derived |
| `--sf-color-link--visited` | `oklch(from action l c calc(h + 40))` | Link visited | derived |
| `--sf-color-link--underline` | `oklch(from action l c h / 0.3)` | Link underline | derived |
| `--sf-color-link--disabled` | `var(--sf-color-text--disabled)` | Link disabled | alias |

## Color: bg state

| Token | Default | Description | Override |
|-------|---------|-------------|----------|
| `--sf-color-bg--hover` | `oklch(from neutral l c h / 0.08)` | Hover overlay | derived |
| `--sf-color-bg--active` | `oklch(from neutral l c h / 0.12)` | Active overlay | derived |
| `--sf-color-bg--selected` | `oklch(from action l c h / 0.1)` | Selection overlay | derived |
| `--sf-color-bg--focus` | `oklch(from action l c h / 0.06)` | Focus tint | derived |
| `--sf-color-bg--disabled` | `var(--sf-color-well)` | Disabled background | alias |
| `--sf-color-code-bg` | `var(--sf-color-well)` | Inline code background | alias |

## Color: selection / mark / dim

| Token | Default | Description | Override |
|-------|---------|-------------|----------|
| `--sf-color-selection-bg` | `oklch(from action l c h / 0.22)` | Text selection background | derived |
| `--sf-color-selection-text` | `inherit` | Text selection foreground | derived |
| `--sf-color-mark-bg` | `oklch(from warning l c h / 0.25)` | `<mark>` background | derived |
| `--sf-color-mark-text` | `inherit` | `<mark>` foreground | derived |
| `--sf-color-dim` | `oklch(0 0 0 / 0.5)` | Generic dim/scrim | derived |

## Color: scrollbar

| Token | Default | Description | Override |
|-------|---------|-------------|----------|
| `--sf-scrollbar-thumb` | `var(--sf-color-neutral)` | Scrollbar thumb | alias |
| `--sf-scrollbar-track` | `transparent` | Scrollbar track | derived |

## Color: status triplets

Per status: `subtle` (low alpha bg), `strong` (text-grade), `muted` (mid alpha).

| Token | Default | Description | Override |
|-------|---------|-------------|----------|
| `--sf-color-success-subtle` | `oklch(from success l c h / 0.12)` | Subtle success tint | derived |
| `--sf-color-success-strong` | `light-dark()` darken/lighten | High-contrast success | derived |
| `--sf-color-success-muted` | `oklch(from success l c h / 0.3)` | Muted success | derived |
| `--sf-color-warning-subtle` | `oklch(from warning l c h / 0.12)` | Subtle warning tint | derived |
| `--sf-color-warning-strong` | `light-dark()` darken/lighten | High-contrast warning | derived |
| `--sf-color-warning-muted` | `oklch(from warning l c h / 0.3)` | Muted warning | derived |
| `--sf-color-error-subtle` | `oklch(from error l c h / 0.1)` | Subtle error tint | derived |
| `--sf-color-error-strong` | `light-dark()` darken/lighten | High-contrast error | derived |
| `--sf-color-error-muted` | `oklch(from error l c h / 0.3)` | Muted error | derived |
| `--sf-color-info-subtle` | `oklch(from info l c h / 0.1)` | Subtle info tint | derived |
| `--sf-color-info-strong` | `light-dark()` darken/lighten | High-contrast info | derived |
| `--sf-color-info-muted` | `oklch(from info l c h / 0.3)` | Muted info | derived |
| `--sf-color-danger-subtle` | `oklch(from danger l c h / 0.1)` | Subtle danger tint | derived |
| `--sf-color-danger-strong` | `light-dark()` darken/lighten | High-contrast danger | derived |
| `--sf-color-danger-muted` | `oklch(from danger l c h / 0.3)` | Muted danger | derived |

## Color: gradients

| Token | Default | Description | Override |
|-------|---------|-------------|----------|
| `--sf-gradient-primary` | `linear-gradient(135deg, primary, darker)` | Primary brand gradient | derived |
| `--sf-gradient-secondary` | `linear-gradient(135deg, secondary, darker)` | Secondary gradient | derived |
| `--sf-gradient-tertiary` | `linear-gradient(135deg, tertiary, darker)` | Tertiary gradient | derived |
| `--sf-gradient-brand` | `linear-gradient(135deg, primary, hue-rotated)` | Brand mood gradient | derived |
| `--sf-gradient-surface` | `linear-gradient(180deg, surface, bg)` | Surface gradient | derived |
| `--sf-gradient-fade--r` | `linear-gradient(to right, transparent, bg)` | Fade right | derived |
| `--sf-gradient-fade--l` | `linear-gradient(to left, transparent, bg)` | Fade left | derived |
| `--sf-gradient-fade--t` | `linear-gradient(to top, transparent, bg)` | Fade top | derived |
| `--sf-gradient-fade--b` | `linear-gradient(to bottom, transparent, bg)` | Fade bottom | derived |

## Color: shadow controls

| Token | Default | Description | Override |
|-------|---------|-------------|----------|
| `--sf-shadow-color` | `0 0 0` | OKLCH `L C H` triple for shadow tint | control |
| `--sf-shadow-base-strength` | `0.08` | Light-mode shadow alpha floor | control |
| `--sf-shadow-dark-boost` | `0.17` | Extra alpha applied when `--sf-is-dark=1` | control |
| `--sf-shadow-cap` | `0.7` | Maximum allowed shadow alpha | control |
| `--sf-shadow-glow-color` | `var(--sf-color-primary)` | Color for `--sf-shadow-glow` | alias |
| `--sf-shadow-glow` | `0 0 15px 2px oklch(...)` | Brand-tinted glow | derived |
| `--sf-shadow-strength` | `calc(base + is-dark * dark-boost)` | Final per-mode alpha multiplier | derived |

---

## Typography: families

| Token | Default | Description | Override |
|-------|---------|-------------|----------|
| `--sf-font-body` | `system-ui, -apple-system, sans-serif` | Body family | derived |
| `--sf-font-heading` | `var(--sf-font-body)` | Heading family | alias |
| `--sf-font-display` | `var(--sf-font-heading)` | Display family | alias |
| `--sf-font-mono` | `ui-monospace, monospace` | Monospace family | derived |

## Typography: weights

Numeric scale 100..900 plus four semantic aliases.

| Token | Default | Description | Override |
|-------|---------|-------------|----------|
| `--sf-font-weight-100` | `100` | Thin | derived |
| `--sf-font-weight-200` | `200` | Extra Light | derived |
| `--sf-font-weight-300` | `300` | Light | derived |
| `--sf-font-weight-400` | `400` | Regular | derived |
| `--sf-font-weight-500` | `500` | Medium | derived |
| `--sf-font-weight-600` | `600` | Semibold | derived |
| `--sf-font-weight-700` | `700` | Bold | derived |
| `--sf-font-weight-800` | `800` | Extra Bold | derived |
| `--sf-font-weight-900` | `900` | Black | derived |
| `--sf-font-weight-body` | `400` | Body weight alias | alias |
| `--sf-font-weight-bold` | `700` | Bold alias | alias |
| `--sf-font-weight-heading` | `600` | Heading weight alias | alias |
| `--sf-font-weight-display` | `700` | Display weight alias | alias |

## Typography: fluid sizes

Full `clamp()` expressions in `core/tokens.css`.

| Token | Default | Description | Override |
|-------|---------|-------------|----------|
| `--sf-text-2xs` | `clamp(0.51rem, ..., 0.53rem)` | Smallest text | derived |
| `--sf-text-xs` | `clamp(0.64rem, ..., 0.7rem)` | Tiny text | derived |
| `--sf-text-s` | `clamp(0.8rem, ..., 0.94rem)` | Small text | derived |
| `--sf-text-m` | `clamp(1rem, ..., 1.25rem)` | Body text | derived |
| `--sf-text-l` | `clamp(1.25rem, ..., 1.67rem)` | Large text | derived |
| `--sf-text-xl` | `clamp(1.56rem, ..., 2.22rem)` | XL text | derived |
| `--sf-text-2xl` | `clamp(1.95rem, ..., 2.96rem)` | 2XL text | derived |
| `--sf-text-3xl` | `clamp(2.44rem, ..., 3.95rem)` | 3XL text | derived |
| `--sf-text-4xl` | `clamp(3.05rem, ..., 5.26rem)` | 4XL text | derived |
| `--sf-text-display-s` | `clamp(2.4rem, ..., 3rem)` | Display small | derived |
| `--sf-text-display-m` | `clamp(3rem, ..., 4rem)` | Display medium | derived |
| `--sf-text-display-l` | `clamp(3.75rem, ..., 5.33rem)` | Display large | derived |

## Typography: line-height, tracking, icon sizes

| Token | Default | Description | Override |
|-------|---------|-------------|----------|
| `--sf-leading-tight` | `1.1` | Tight leading | derived |
| `--sf-leading-snug` | `1.3` | Snug leading | derived |
| `--sf-leading-normal` | `1.5` | Normal leading | derived |
| `--sf-leading-relaxed` | `1.625` | Relaxed leading | derived |
| `--sf-tracking-tight` | `-0.025em` | Tight tracking | derived |
| `--sf-tracking-normal` | `0` | Normal tracking | derived |
| `--sf-tracking-wide` | `0.025em` | Wide tracking | derived |
| `--sf-tracking-wider` | `0.05em` | Wider tracking | derived |
| `--sf-tracking-widest` | `0.1em` | Widest tracking | derived |
| `--sf-icon-xs` | `0.875em` | Icon, extra small | derived |
| `--sf-icon-s` | `1em` | Icon, small | derived |
| `--sf-icon-m` | `1.5em` | Icon, medium | derived |
| `--sf-icon-l` | `2em` | Icon, large | derived |
| `--sf-icon-xl` | `3em` | Icon, extra large | derived |

## Typography: font features, variation, optical sizing

Per-family OpenType features and variable-font axes. Body, heading and mono auto-wire on the matching elements via `core/base.css`. The `display` slot has no auto-wire target: apply it manually on your display class.

| Token | Default | Description | Override |
|-------|---------|-------------|----------|
| `--sf-font-features-body` | `normal` | `font-feature-settings` for body | control |
| `--sf-font-features-heading` | `normal` | `font-feature-settings` for headings | control |
| `--sf-font-features-display` | `normal` | `font-feature-settings` for display class | control |
| `--sf-font-features-mono` | `normal` | `font-feature-settings` for mono | control |
| `--sf-font-variation-body` | `normal` | `font-variation-settings` for body | control |
| `--sf-font-variation-heading` | `normal` | `font-variation-settings` for headings | control |
| `--sf-font-variation-display` | `normal` | `font-variation-settings` for display class | control |
| `--sf-font-optical-sizing` | `auto` | Global `font-optical-sizing` | control |

## Typography: aliases

Pre-wired typographic slots used by `core/base.css`.

| Token | Default | Description | Override |
|-------|---------|-------------|----------|
| `--sf-body-font-size` | `var(--sf-text-m)` | Body font size | alias |
| `--sf-body-line-height` | `var(--sf-leading-normal)` | Body line height | alias |
| `--sf-body-font-weight` | `var(--sf-font-weight-body)` | Body weight | alias |
| `--sf-body-font-family` | `var(--sf-font-body)` | Body family | alias |
| `--sf-body-color` | `var(--sf-color-text)` | Body color | alias |
| `--sf-body-text-wrap` | `pretty` | Body `text-wrap` | derived |
| `--sf-body-strong-weight` | `var(--sf-font-weight-heading)` | `<strong>` weight | alias |
| `--sf-body-em-style` | `italic` | `<em>` style | derived |
| `--sf-heading-font-family` | `var(--sf-font-heading)` | Heading family alias | alias |
| `--sf-heading-color` | `var(--sf-color-heading)` | Heading color | alias |
| `--sf-heading-text-wrap` | `balance` | Heading `text-wrap` | derived |
| `--sf-h1-size` | `var(--sf-text-4xl)` | h1 size | alias |
| `--sf-h1-line-height` | `var(--sf-leading-tight)` | h1 line height | alias |
| `--sf-h1-font-weight` | `var(--sf-font-weight-heading)` | h1 weight | alias |
| `--sf-h1-letter-spacing` | `var(--sf-tracking-tight)` | h1 tracking | alias |
| `--sf-h2-size` | `var(--sf-text-3xl)` | h2 size | alias |
| `--sf-h2-line-height` | `var(--sf-leading-tight)` | h2 line height | alias |
| `--sf-h2-font-weight` | `var(--sf-font-weight-heading)` | h2 weight | alias |
| `--sf-h2-letter-spacing` | `var(--sf-tracking-tight)` | h2 tracking | alias |
| `--sf-h3-size` | `var(--sf-text-2xl)` | h3 size | alias |
| `--sf-h3-line-height` | `var(--sf-leading-snug)` | h3 line height | alias |
| `--sf-h3-font-weight` | `var(--sf-font-weight-heading)` | h3 weight | alias |
| `--sf-h3-letter-spacing` | `var(--sf-tracking-normal)` | h3 tracking | alias |
| `--sf-h4-size` | `var(--sf-text-xl)` | h4 size | alias |
| `--sf-h4-line-height` | `var(--sf-leading-snug)` | h4 line height | alias |
| `--sf-h4-font-weight` | `var(--sf-font-weight-heading)` | h4 weight | alias |
| `--sf-h4-letter-spacing` | `var(--sf-tracking-normal)` | h4 tracking | alias |
| `--sf-h5-size` | `var(--sf-text-l)` | h5 size | alias |
| `--sf-h5-line-height` | `var(--sf-leading-normal)` | h5 line height | alias |
| `--sf-h5-font-weight` | `var(--sf-font-weight-heading)` | h5 weight | alias |
| `--sf-h5-letter-spacing` | `var(--sf-tracking-normal)` | h5 tracking | alias |
| `--sf-h6-size` | `var(--sf-text-m)` | h6 size | alias |
| `--sf-h6-line-height` | `var(--sf-leading-normal)` | h6 line height | alias |
| `--sf-h6-font-weight` | `var(--sf-font-weight-heading)` | h6 weight | alias |
| `--sf-h6-letter-spacing` | `var(--sf-tracking-wide)` | h6 tracking | alias |

---

## Spacing

Fluid 9-step ladder, three fixed values, BEM aliases, section pads. All fluid steps multiply through `--sf-space-scale`.

| Token | Default | Description | Override |
|-------|---------|-------------|----------|
| `--sf-space-none` | `0` | Zero spacing | derived |
| `--sf-space-px` | `1px` | Single pixel | derived |
| `--sf-space-gutter` | `var(--sf-space-l)` | Gutter alias | alias |
| `--sf-space-2xs` | `clamp(0.51rem, ..., 0.84rem)` | 2xs fluid | derived |
| `--sf-space-xs` | `clamp(0.64rem, ..., 1.13rem)` | xs fluid | derived |
| `--sf-space-s` | `clamp(0.8rem, ..., 1.5rem)` | s fluid | derived |
| `--sf-space-m` | `clamp(1rem, ..., 2rem)` | m fluid (default) | derived |
| `--sf-space-l` | `clamp(1.25rem, ..., 2.67rem)` | l fluid | derived |
| `--sf-space-xl` | `clamp(1.56rem, ..., 3.55rem)` | xl fluid | derived |
| `--sf-space-2xl` | `clamp(1.95rem, ..., 4.74rem)` | 2xl fluid | derived |
| `--sf-space-3xl` | `clamp(2.44rem, ..., 6.31rem)` | 3xl fluid | derived |
| `--sf-space-4xl` | `clamp(3.05rem, ..., 8.42rem)` | 4xl fluid | derived |
| `--sf-gap` | `var(--sf-space-m)` | BEM component gap | alias |
| `--sf-content-gap` | `var(--sf-space-s)` | Within-component rhythm | alias |
| `--sf-component-pad` | `var(--sf-space-m)` | Component padding | alias |
| `--sf-field-block` | `var(--sf-space-l)` | Form field block spacing | alias |
| `--sf-section-pad` | `var(--sf-section-pad--m)` | Section padding default | alias |
| `--sf-section-pad--s` | `var(--sf-space-2xl)` | Section padding small | alias |
| `--sf-section-pad--m` | `var(--sf-space-3xl)` | Section padding medium | alias |
| `--sf-section-pad--l` | `var(--sf-space-4xl)` | Section padding large | alias |
| `--sf-section-pad--xl` | `calc(var(--sf-space-4xl) * 1.5)` | Section padding xl | derived |

## Sizing

UI sizes, container widths and aspect ratios.

| Token | Default | Description | Override |
|-------|---------|-------------|----------|
| `--sf-size-xs` | `1.5rem` | UI size xs | derived |
| `--sf-size-s` | `2rem` | UI size s | derived |
| `--sf-size-m` | `2.5rem` | UI size m | derived |
| `--sf-size-l` | `2.75rem` | UI size l | derived |
| `--sf-size-xl` | `3.5rem` | UI size xl | derived |
| `--sf-container-narrow` | `38rem` | Narrow container max-width | derived |
| `--sf-container-prose` | `65ch` | Prose container max-width | derived |
| `--sf-container-default` | `75rem` | Default container max-width | derived |
| `--sf-container-wide` | `90rem` | Wide container max-width | derived |
| `--sf-container-full` | `100%` | Full-bleed container | derived |
| `--sf-ratio-square` | `1` | 1:1 ratio | derived |
| `--sf-ratio-video` | `16 / 9` | Video ratio | derived |
| `--sf-ratio-cinema` | `21 / 9` | Cinema ratio | derived |
| `--sf-ratio-photo` | `3 / 2` | Photo ratio | derived |
| `--sf-ratio-portrait` | `3 / 4` | Portrait ratio | derived |
| `--sf-ratio-golden` | `1.618 / 1` | Golden ratio | derived |

## Layout primitives

Component slots from `core/tokens.layout.css`. Override per primitive (`--sf-stack-gap`, `--sf-cluster-gap`, etc.) for instance-level tuning.

| Token | Default | Description | Override |
|-------|---------|-------------|----------|
| `--sf-space-gap` | `var(--sf-gap)` | Shared layout gap | alias |
| `--sf-space-content` | `var(--sf-content-gap)` | Shared content rhythm | alias |
| `--sf-stack-gap` | `var(--sf-space-content)` | Stack gap | component |
| `--sf-box-padding` | `var(--sf-space-m)` | Box padding | component |
| `--sf-box-border-width` | `0` | Box border width | component |
| `--sf-box-border-color` | `var(--sf-color-border)` | Box border color | component |
| `--sf-center-max` | `var(--sf-container-default)` | Center max-width | component |
| `--sf-center-gutter` | `var(--sf-space-gutter)` | Center gutter | component |
| `--sf-cluster-gap` | `var(--sf-space-gap)` | Cluster gap | component |
| `--sf-cluster-align` | `center` | Cluster align-items | component |
| `--sf-cluster-justify` | `flex-start` | Cluster justify-content | component |
| `--sf-sidebar-gap` | `var(--sf-space-gap)` | Sidebar gap | component |
| `--sf-sidebar-min-width` | `50%` | Sidebar content min-width | component |
| `--sf-sidebar-width-default` | `18rem` | Sidebar panel default width | component |
| `--sf-switcher-threshold` | `30rem` | Switcher pivot point | component |
| `--sf-switcher-gap` | `var(--sf-space-gap)` | Switcher gap | component |
| `--sf-grid-min` | `16rem` | Grid track minimum | component |
| `--sf-grid-gap` | `var(--sf-space-gap)` | Grid gap | component |
| `--sf-grid-min-xs` | `10rem` | Grid track min, xs | component |
| `--sf-grid-min-s` | `13rem` | Grid track min, s | component |
| `--sf-grid-min-default` | `16rem` | Grid track min, default | component |
| `--sf-grid-min-m` | `16rem` | Grid track min, m | component |
| `--sf-grid-min-l` | `20rem` | Grid track min, l | component |
| `--sf-grid-min-xl` | `24rem` | Grid track min, xl | component |
| `--sf-cover-min-height` | `100dvh` | Cover min height | component |
| `--sf-cover-padding` | `var(--sf-section-pad)` | Cover padding | component |
| `--sf-frame-ratio` | `16 / 9` | Frame aspect ratio | component |
| `--sf-reel-item-width` | `max-content` | Reel item width | component |
| `--sf-reel-gap` | `var(--sf-space-gap)` | Reel gap | component |
| `--sf-reel-height` | `auto` | Reel height | component |
| `--sf-imposter-margin` | `var(--sf-space-m)` | Imposter margin | component |
| `--sf-bento-cols-default` | `3` | Bento columns | component |
| `--sf-bento-row-default` | `10rem` | Bento row, default | component |
| `--sf-bento-row-compact` | `6rem` | Bento row, compact | component |
| `--sf-bento-row-tall` | `16rem` | Bento row, tall | component |
| `--sf-bento-gap` | `var(--sf-space-gap)` | Bento gap | component |
| `--sf-breakout-width` | `var(--sf-container-wide)` | Breakout column width | component |
| `--sf-content-width` | `var(--sf-container-default)` | Content column width | component |
| `--sf-prose-paragraph` | `var(--sf-space-content)` | Prose paragraph rhythm | component |

## Breakpoints

Last-resort `@media` thresholds. Container queries are preferred.

| Token | Default | Description | Override |
|-------|---------|-------------|----------|
| `--sf-bp-xs` | `20em` | 320px | derived |
| `--sf-bp-sm` | `30em` | 480px | derived |
| `--sf-bp-md` | `48em` | 768px | derived |
| `--sf-bp-lg` | `64em` | 1024px | derived |
| `--sf-bp-xl` | `80em` | 1280px | derived |
| `--sf-bp-2xl` | `96em` | 1536px | derived |

The bare `@media (min-width: var(--sf-bp-md))` syntax is **not** yet supported in stable Chrome, Safari, or Firefox as of 2025. Substitution of `var()` inside `@media` feature values is specified by CSS Conditional 5 / Values 5 but unimplemented in stable browsers; the at-rule is dropped. Use container queries (see below) as the primary modern responsive path. The breakpoint tokens still serve two consumer use cases:

- **JavaScript** reads via `getComputedStyle(document.documentElement).getPropertyValue('--sf-bp-md')` for `matchMedia()` calls or other layout logic.
- **PostCSS / `@custom-media` preprocessing**: declare `@custom-media --sf-bp-md (min-width: 48em);` once and write `@media (--sf-bp-md) { … }`, resolved at build time by your preprocessor.

## Container queries

| Token | Default | Description | Override |
|-------|---------|-------------|----------|
| `--sf-cq-xs` | `20em` | 320px | derived |
| `--sf-cq-sm` | `30em` | 480px | derived |
| `--sf-cq-md` | `48em` | 768px | derived |
| `--sf-cq-lg` | `64em` | 1024px | derived |
| `--sf-cq-xl` | `80em` | 1280px | derived |

---

## Motion: durations and scale

| Token | Default | Description | Override |
|-------|---------|-------------|----------|
| `--sf-motion-scale` | `1` | Multiplier on every duration | control |
| `--sf-duration-none` | `0ms` | Zero | derived |
| `--sf-duration-instant` | `calc(100ms * scale)` | Instant | derived |
| `--sf-duration-fast` | `calc(150ms * scale)` | Fast | derived |
| `--sf-duration-normal` | `calc(250ms * scale)` | Normal | derived |
| `--sf-duration-slow` | `calc(400ms * scale)` | Slow | derived |
| `--sf-duration-slower` | `calc(600ms * scale)` | Slower | derived |

## Motion: easings

| Token | Default | Description | Override |
|-------|---------|-------------|----------|
| `--sf-ease-linear` | `linear` | Linear | derived |
| `--sf-ease-out` | `cubic-bezier(0.25, 0, 0.15, 1)` | Decelerate | derived |
| `--sf-ease-in` | `cubic-bezier(0.5, 0, 0.75, 0.25)` | Accelerate | derived |
| `--sf-ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Smooth in-out | derived |
| `--sf-ease-spring` | `linear(0, 0.5, 1.1, 0.95, 1.02, 1)` | Spring | derived |
| `--sf-ease-elastic` | `linear(0, 0.3, 1.2, 0.9, 1.05, 1)` | Elastic | derived |
| `--sf-ease-back-in` | `cubic-bezier(0.36, 0, 0.66, -0.56)` | Anticipate | derived |
| `--sf-ease-back-out` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Overshoot | derived |
| `--sf-ease-bounce` | `linear(0, 0.4, 0.95, 0.7, 1.05, 0.85, 1.02, 0.95, 1)` | Bounce | derived |

## Motion: animation presets

Shorthand pairings of keyframe + duration + easing. Reduced-motion is honoured automatically (durations zero out via `core/accessibility.css`).

| Token | Default | Description | Override |
|-------|---------|-------------|----------|
| `--sf-animation-fade-in` | `sf-fade-in normal ease-out both` | Fade in | derived |
| `--sf-animation-fade-out` | `sf-fade-out normal ease-in both` | Fade out | derived |
| `--sf-animation-slide-in-up` | `sf-slide-in-up normal ease-out both` | Slide in from below | derived |
| `--sf-animation-slide-in-down` | `sf-slide-in-down normal ease-out both` | Slide in from above | derived |
| `--sf-animation-slide-in-left` | `sf-slide-in-left normal ease-out both` | Slide in from the left | derived |
| `--sf-animation-slide-in-right` | `sf-slide-in-right normal ease-out both` | Slide in from the right | derived |
| `--sf-animation-scale-up` | `sf-scale-up normal back-out both` | Scale in (overshoot) | derived |
| `--sf-animation-scale-down` | `sf-scale-down normal ease-in both` | Scale in (settle) | derived |

> Note on slide-in axis naming: the X axis tokens (`--sf-animation-slide-in-left` / `-right`) describe the ORIGIN side ("starts on the left, moves rightward"), matching Tailwind and Animate.css. The Y axis tokens (`--sf-animation-slide-in-up` / `-down`) describe the MOTION DIRECTION ("starts below, moves upward"). The two axes follow different conventions because each matches the most common ecosystem precedent for that axis. When in doubt, trust the Description column above; the bare token name alone may not be enough.

## Motion: transition shorthands

| Token | Default | Description | Override |
|-------|---------|-------------|----------|
| `--sf-transition-base` | `all normal ease-out` | Default transition | derived |
| `--sf-transition-fast` | `all fast ease-out` | Fast transition | derived |
| `--sf-transition-slow` | `all slow ease-in-out` | Slow transition | derived |
| `--sf-transition-enter` | `all normal ease-out` | Enter transition | derived |
| `--sf-transition-exit` | `all fast ease-in` | Exit transition | derived |

---

## Shadows: box and glow

Strength scales up automatically in dark mode (`--sf-shadow-strength` adds `--sf-shadow-dark-boost`). Cap via `--sf-shadow-cap`.

| Token | Default | Description | Override |
|-------|---------|-------------|----------|
| `--sf-shadow-none` | `none` | No shadow | derived |
| `--sf-shadow-xs` | `0 1px 2px ...` | Hairline shadow | derived |
| `--sf-shadow-s` | `0 1px 2px, 0 2px 6px` | Small shadow | derived |
| `--sf-shadow-m` | `0 1px 3px, 0 4px 12px` | Medium shadow | derived |
| `--sf-shadow-l` | `0 2px 4px, 0 8px 24px (capped), 0 16px 48px` | Large shadow | derived |
| `--sf-shadow-xl` | `0 2px 8px, 0 12px 36px (capped), 0 24px 72px` | XL shadow | derived |
| `--sf-shadow-2xl` | `0 4px 12px, 0 20px 60px (capped), 0 40px 100px (capped)` | 2XL shadow | derived |
| `--sf-shadow-inner` | `inset 0 2px 4px ...` | Inset shadow | derived |
| `--sf-shadow-glow` | `0 0 15px 2px ...` | Brand glow | derived |

## Shadows: text and drop

| Token | Default | Description | Override |
|-------|---------|-------------|----------|
| `--sf-text-shadow-s` | `0 1px 2px ...` | Small text shadow | derived |
| `--sf-text-shadow-m` | `0 2px 4px ...` | Medium text shadow | derived |
| `--sf-text-shadow-l` | `0 4px 8px ...` | Large text shadow | derived |
| `--sf-drop-shadow-s` | `drop-shadow(0 1px 2px ...)` | Small filter shadow | derived |
| `--sf-drop-shadow-m` | `drop-shadow(0 4px 6px ...)` | Medium filter shadow | derived |
| `--sf-drop-shadow-l` | `drop-shadow(0 8px 16px ...)` | Large filter shadow | derived |

---

## Borders and radius

| Token | Default | Description | Override |
|-------|---------|-------------|----------|
| `--sf-border-width-hairline` | `0.5px` | Hairline border | derived |
| `--sf-border-width-1` | `1px` | 1px border | derived |
| `--sf-border-width-2` | `2px` | 2px border | derived |
| `--sf-border-width-3` | `3px` | 3px border | derived |
| `--sf-border-width-4` | `4px` | 4px border | derived |
| `--sf-radius-scale` | `1` | Multiplier on every radius | control |
| `--sf-radius-none` | `0` | No radius | derived |
| `--sf-radius-xs` | `calc(2px * scale)` | xs radius | derived |
| `--sf-radius-s` | `calc(4px * scale)` | s radius | derived |
| `--sf-radius-m` | `calc(8px * scale)` | m radius (default) | derived |
| `--sf-radius-l` | `calc(12px * scale)` | l radius | derived |
| `--sf-radius-xl` | `calc(16px * scale)` | xl radius | derived |
| `--sf-radius-2xl` | `calc(24px * scale)` | 2xl radius | derived |
| `--sf-radius-3xl` | `calc(32px * scale)` | 3xl radius | derived |
| `--sf-radius-4xl` | `calc(48px * scale)` | 4xl radius | derived |
| `--sf-radius-full` | `9999px` | Pill / circle | derived |

## Blur and opacity

| Token | Default | Description | Override |
|-------|---------|-------------|----------|
| `--sf-blur-xs` | `4px` | xs blur | derived |
| `--sf-blur-s` | `8px` | s blur | derived |
| `--sf-blur-m` | `16px` | m blur | derived |
| `--sf-blur-l` | `32px` | l blur | derived |
| `--sf-blur-xl` | `48px` | xl blur | derived |
| `--sf-opacity-0` | `0` | Fully transparent | derived |
| `--sf-opacity-10` | `0.1` | 10% opacity | derived |
| `--sf-opacity-25` | `0.25` | 25% opacity | derived |
| `--sf-opacity-50` | `0.5` | 50% opacity | derived |
| `--sf-opacity-75` | `0.75` | 75% opacity | derived |
| `--sf-opacity-100` | `1` | Fully opaque | derived |
| `--sf-opacity-disabled` | `0.45` | Disabled element opacity | derived |

## Z-index

| Token | Default | Description | Override |
|-------|---------|-------------|----------|
| `--sf-z-below` | `-1` | Below stacking context | derived |
| `--sf-z-base` | `0` | Base | derived |
| `--sf-z-raised` | `1` | Raised | derived |
| `--sf-z-low` | `10` | Low (dropdown) | derived |
| `--sf-z-mid` | `100` | Mid (sticky) | derived |
| `--sf-z-high` | `500` | High (modal) | derived |
| `--sf-z-top` | `900` | Top (toast) | derived |
| `--sf-z-max` | `9999` | Max | derived |

---

## Accessibility and layout chrome

| Token | Default | Description | Override |
|-------|---------|-------------|----------|
| `--sf-focus-ring-color` | `var(--sf-color-action)` | Focus ring color | alias |
| `--sf-focus-ring-width` | `2px` | Focus ring width | derived |
| `--sf-focus-ring-offset` | `2px` | Focus ring offset | derived |
| `--sf-focus-ring-style` | `solid` | Focus ring style | derived |
| `--sf-touch-target` | `var(--sf-size-l)` | Minimum touch target on coarse pointer | alias |
| `--sf-contrast-bias` | `0` | Contrast nudge for `prefers-contrast: more` | control |
| `--sf-header-height` | `8rem` | Sticky header height | derived |
| `--sf-sticky-offset` | `var(--sf-header-height)` | Sticky offset for in-page anchors | alias |
| `--sf-safe-top` | `env(safe-area-inset-top, 0px)` | Safe-area inset, top | derived |
| `--sf-safe-bottom` | `env(safe-area-inset-bottom, 0px)` | Safe-area inset, bottom | derived |
| `--sf-safe-left` | `env(safe-area-inset-left, 0px)` | Safe-area inset, left | derived |
| `--sf-safe-right` | `env(safe-area-inset-right, 0px)` | Safe-area inset, right | derived |

## Print

| Token | Default | Description | Override |
|-------|---------|-------------|----------|
| `--sf-print-page-margin` | `2cm` | `@page` margin | derived |
| `--sf-print-page-size` | `a4` | `@page` size | derived |
| `--sf-print-base-size` | `11pt` | Base font size in print | derived |

## Stroke

| Token | Default | Description | Override |
|-------|---------|-------------|----------|
| `--sf-stroke-thin` | `1px` | Thin stroke | derived |
| `--sf-stroke-regular` | `1.5px` | Regular stroke | derived |
| `--sf-stroke-bold` | `2px` | Bold stroke | derived |
| `--sf-stroke-heavy` | `3px` | Heavy stroke | derived |

## Forward-looking

CSS Anchor Positioning and 3D-perspective slots. Not consumed internally; provided for consumer authoring.

| Token | Default | Description | Override |
|-------|---------|-------------|----------|
| `--sf-anchor-offset` | `0` | Default anchor inset | derived |
| `--sf-perspective-near` | `500px` | Near perspective | derived |
| `--sf-perspective-normal` | `1000px` | Normal perspective | derived |
| `--sf-perspective-far` | `2000px` | Far perspective | derived |

---

## Control parameters (0.2.0)

Numeric knobs that tune system formulas. Override any of these to reshape behaviour without redeclaring every derived token.

| Token | Default | Description | Override |
|-------|---------|-------------|----------|
| `--sf-on-color-light` | `0.97` | L value picked when surface is dark | control |
| `--sf-on-color-dark` | `0.13` | L value picked when surface is light | control |
| `--sf-on-color-threshold` | `0.6` | L threshold for the on-color flip | control |
| `--sf-shadow-cap` | `0.7` | Hard ceiling for shadow alpha | control |
| `--sf-shadow-base-strength` | `0.08` | Light-mode shadow alpha floor | control |
| `--sf-shadow-dark-boost` | `0.17` | Dark-mode shadow alpha boost | control |
| `--sf-derive-l-min` | `0.65` | Brand/status dark-mode L floor | control |
| `--sf-derive-l-max` | `0.88` | Brand/status dark-mode L ceiling | control |
| `--sf-derive-l-slope` | `0.5` | Brand/status dark-mode L slope | control |
| `--sf-derive-l-intercept` | `0.95` | Brand/status dark-mode L intercept | control |
| `--sf-derive-c-factor` | `0.9` | Brand/status dark-mode chroma factor | control |
| `--sf-derive-base-l-min` | `0.16` | Base surface dark-mode L floor | control |
| `--sf-derive-base-l-max` | `0.24` | Base surface dark-mode L ceiling | control |
| `--sf-derive-base-l-intercept` | `1.18` | Base surface dark-mode L intercept | control |
| `--sf-derive-base-c-factor` | `0.5` | Base surface dark-mode chroma factor | control |
