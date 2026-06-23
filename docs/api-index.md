# API index

> **Generated** from source by `scripts/gen-api-index.js` —
> run `npm run docs:api` to refresh. Do not edit by hand.

A single browseable catalogue of every public SLASHED element — design
**tokens** and **classes** — with stability tier, category, bundle membership
and a short description. The machine-readable companion (with all columns) is
[api-index.json](api-index.json); for the flat name list see
[registry.json](registry.json); for the tier contract see
[architecture.md](architecture.md).

**918 elements** — 686 tokens, 232 classes.

| Tier | Count | Meaning |
|---|---|---|
| PUBLIC | 862 | Everyday surface. SemVer-stable. |
| PUBLIC-ADVANCED | 55 | Same SemVer guarantee; niche/powerful. |
| INTERNAL | 1 | Implementation detail; may change without a major bump. |

## Tokens (686)

### Component tokens (6)

| Token | Tier | Role | Namespace | Default | Description |
|---|---|---|---|---|---|
| `--sf-button-padding-block` | PUBLIC | consumption | button | `var(--sf-space-xs)` | Vertical (block) inner padding for buttons. |
| `--sf-button-padding-inline` | PUBLIC | consumption | button | `var(--sf-space-m)` | Horizontal (inline) inner padding for buttons. |
| `--sf-button-radius` | PUBLIC | consumption | button | `var(--sf-radius-m)` | Border radius for buttons. Defaults to --sf-radius-m; override to fully pill-round or square all buttons at once. |
| `--sf-field-padding-block` | PUBLIC | consumption | field | `var(--sf-space-xs)` | Vertical (block) inner padding for form field inputs. |
| `--sf-field-padding-inline` | PUBLIC | consumption | field | `var(--sf-space-s)` | Horizontal (inline) inner padding for form field inputs. |
| `--sf-field-radius` | PUBLIC | consumption | field | `var(--sf-radius-m)` | Border radius for form field inputs. Defaults to --sf-radius-m; override to reshape all inputs at once. |

### Core tokens (502)

| Token | Tier | Role | Namespace | Default | Description |
|---|---|---|---|---|---|
| `--sf-animation-blink` | PUBLIC | consumption | animation | `sf-blink calc(1s * var(--sf-motion-scale)) steps(1, end) infinite` | Blinking visibility loop. Use for cursor indicators or critical attention cues. Respect prefers-reduced-motion. |
| `--sf-animation-color-pulse` | PUBLIC | consumption | animation | `sf-color-pulse var(--sf-duration-slow) var(--sf-ease-in-out) infinite` | Pulsing color loop. Use for live-status badges (recording, live). Respect prefers-reduced-motion. |
| `--sf-animation-delay-1` | PUBLIC | consumption | animation | `calc(75ms * var(--sf-motion-scale))` | Shortest stagger delay. Apply to the first element in a sequentially animated group. |
| `--sf-animation-delay-2` | PUBLIC | consumption | animation | `calc(150ms * var(--sf-motion-scale))` | Second stagger delay step. |
| `--sf-animation-delay-3` | PUBLIC | consumption | animation | `calc(225ms * var(--sf-motion-scale))` | Third stagger delay step. |
| `--sf-animation-delay-4` | PUBLIC | consumption | animation | `calc(300ms * var(--sf-motion-scale))` | Fourth stagger delay step. |
| `--sf-animation-delay-5` | PUBLIC | consumption | animation | `calc(375ms * var(--sf-motion-scale))` | Longest stagger delay. Apply to the last element in a sequentially animated group. |
| `--sf-animation-fade-in` | PUBLIC | consumption | animation | `sf-fade-in var(--sf-duration-normal) var(--sf-ease-out) both` | Fade-in entrance animation shorthand. Use directly as animation property value. |
| `--sf-animation-fade-out` | PUBLIC | consumption | animation | `sf-fade-out var(--sf-duration-normal) var(--sf-ease-in) both` | Fade-out exit animation shorthand. |
| `--sf-animation-float` | PUBLIC | consumption | animation | `sf-float calc(3s * var(--sf-motion-scale)) var(--sf-ease-in-out) infinite` | Gentle floating / levitating loop. Use for hero illustrations or floating UI elements. Decorative — disable for prefers-reduced-motion. |
| `--sf-animation-ping` | PUBLIC | consumption | animation | `sf-ping var(--sf-duration-slow) var(--sf-ease-out) infinite` | Expanding ping / ripple loop. Use for notification badges and live-indicator dots. |
| `--sf-animation-scale-down` | PUBLIC | consumption | animation | `sf-scale-down var(--sf-duration-normal) var(--sf-ease-in) both` | Scale-down exit animation. Pairs with --sf-animation-scale-up for enter/leave transitions. |
| `--sf-animation-scale-up` | PUBLIC | consumption | animation | `sf-scale-up var(--sf-duration-normal) var(--sf-ease-overshoot) both` | Scale-up entrance animation. Use for modals, popovers, and tooltips appearing. |
| `--sf-animation-shimmer` | PUBLIC | consumption | animation | `sf-shimmer calc(1.5s * var(--sf-motion-scale)) var(--sf-ease-in-out) infinite` | Shimmer / skeleton-loading sweep. Apply on placeholder elements while content loads. |
| `--sf-animation-slide-in-down` | PUBLIC | consumption | animation | `sf-slide-in-down var(--sf-duration-normal) var(--sf-ease-out) both` | Slide-in from above. Use for dropdown menus and top-attached sheets. |
| `--sf-animation-slide-in-left` | PUBLIC | consumption | animation | `sf-slide-in-left var(--sf-duration-normal) var(--sf-ease-out) both` | Slide-in from the left. Use for left-side drawers and navigation panels. |
| `--sf-animation-slide-in-right` | PUBLIC | consumption | animation | `sf-slide-in-right var(--sf-duration-normal) var(--sf-ease-out) both` | Slide-in from the right. Use for right-side drawers and detail panels. |
| `--sf-animation-slide-in-up` | PUBLIC | consumption | animation | `sf-slide-in-up var(--sf-duration-normal) var(--sf-ease-out) both` | Slide-in from below. Use for bottom sheets, toasts, and floating action buttons. |
| `--sf-animation-spin` | PUBLIC | consumption | animation | `sf-spin var(--sf-duration-slower) linear infinite` | Continuous rotation loop. Use for loading spinners and progress indicators. |
| `--sf-blur` | PUBLIC | knob | blur | `12px` | Backdrop-filter blur amount for frosted-glass surfaces (navbars, overlays, dialogs). Default 12px. Pair with a semi-transparent background. |
| `--sf-body-color` | PUBLIC | consumption | body | `var(--sf-color-text)` | Text color for body copy. Alias of --sf-color-text. Override here to deviate body text from the global text color. |
| `--sf-body-em-style` | PUBLIC | knob | body | `italic` | font-style for <em> inside body text (italic by default). Override to suppress italics if your typeface has no italic variant. |
| `--sf-body-font-family` | PUBLIC | consumption | body | `var(--sf-font-body)` | Font family for body text. Alias of --sf-font-body. |
| `--sf-body-font-size` | PUBLIC | consumption | body | `var(--sf-text-m)` | Base font size for body paragraphs. Alias of --sf-text-m. |
| `--sf-body-font-weight` | PUBLIC | consumption | body | `var(--sf-font-weight-body)` | Font weight for body text. Alias of --sf-font-weight-body. |
| `--sf-body-line-height` | PUBLIC | consumption | body | `var(--sf-leading-normal)` | Line height for body paragraphs. Alias of --sf-leading-normal. |
| `--sf-body-strong-weight` | PUBLIC | consumption | body | `var(--sf-font-weight-strong)` | Font weight for <strong> inside body text. Override to choose a specific weight instead of inheriting bold. |
| `--sf-body-text-wrap` | PUBLIC | knob | body | `pretty` | text-wrap mode for body paragraphs. 'pretty' prevents orphaned last words; 'balance' equalises line lengths. |
| `--sf-border` | PUBLIC | consumption | border | `var(--sf-border-width-1) var(--sf-border-style) var(--sf-color-border)` | Default border shorthand (width + solid + color). Apply directly to border property. |
| `--sf-border-scale` | PUBLIC | knob | border | `1` | Global border-width multiplier. Set to 0 for borderless UI; 0.5 for hairline-only; 2 to double all border widths across the system. |
| `--sf-border-strong` | PUBLIC | consumption | border | `var(--sf-border-width-1) var(--sf-border-style) var(--sf-color-border--strong)` | Strong-emphasis border shorthand. |
| `--sf-border-style` | PUBLIC | knob | border | `solid` | Global border-style default applied across all border tokens. |
| `--sf-border-subtle` | PUBLIC | consumption | border | `var(--sf-border-width-1) var(--sf-border-style) var(--sf-color-border--subtle)` | Low-contrast subtle border shorthand. |
| `--sf-border-width-1` | PUBLIC | consumption | border | `calc(1px * var(--sf-border-scale, 1))` | Standard 1px border width. |
| `--sf-border-width-2` | PUBLIC | consumption | border | `calc(2px * var(--sf-border-scale, 1))` | Medium 2px border width. Common for focus outlines. |
| `--sf-border-width-3` | PUBLIC | consumption | border | `calc(3px * var(--sf-border-scale, 1))` | Thick 3px border width. |
| `--sf-border-width-4` | PUBLIC | consumption | border | `calc(4px * var(--sf-border-scale, 1))` | Extra-thick 4px border width for decorative borders. |
| `--sf-border-width-hairline` | PUBLIC | knob | border | `0.5px` | 1px border width (hairline). |
| `--sf-caret-color` | PUBLIC | consumption | caret | `var(--sf-color-action)` | Cursor caret color inside text inputs and contenteditable elements. |
| `--sf-code-font-size` | PUBLIC | knob | code | `0.875em` | Font size for inline <code> and <pre>. Usually slightly smaller than body text so monospace doesn't feel oversized. |
| `--sf-color-action` | PUBLIC | consumption | color | `light-dark(var(--sf-color-action-source-light), var(--sf-color-action-source-dark, oklch(from var(--sf-color-action-source-light) clamp(0.65, calc(0.95 - l * 0.5), 0.88) calc(c * 0.9) h)))` | Primary interactive color. Applied to filled buttons, active indicators, and brand accent surfaces. |
| `--sf-color-action--active` | PUBLIC | consumption | color | `var(--sf-color-action-xdark)` | Action color at pressed/active brightness. |
| `--sf-color-action--hover` | PUBLIC | consumption | color | `var(--sf-color-action-darker)` | Action color at hover brightness. |
| `--sf-color-action-darker` | PUBLIC | consumption | color | `var(--sf-color-action-600)` | Deep action shade for high-contrast contexts. |
| `--sf-color-action-ghost` | PUBLIC | consumption | color | `oklch(from var(--sf-color-action) l c h / 0.05)` | Near-transparent action tint for ghost-button hover backgrounds. |
| `--sf-color-action-lighter` | PUBLIC | consumption | color | `var(--sf-color-action-400)` | Light action shade for soft accents. |
| `--sf-color-action-muted` | PUBLIC | consumption | color | `oklch(from var(--sf-color-action) l c h / 0.30)` | Medium action fill — outlined button hover backgrounds. |
| `--sf-color-action-source-dark` | PUBLIC | knob | color | `oklch(0.70 0.198 235)` | Registered <color> dark counterpart of --sf-color-action. Enables smooth CSS transitions when toggling between light and dark mode; without <color> registration the browser cannot interpolate and transitions snap at 50%. |
| `--sf-color-action-source-light` | PUBLIC | knob | color | `oklch(0.50 0.22 235)` | OKLCH lightness source for the action color. Animate this to smoothly transition between light and dark brand themes. |
| `--sf-color-action-subtle` | PUBLIC | consumption | color | `oklch(from var(--sf-color-action) l c h / 0.10)` | Lightest action tint — selected rows, active nav, chips. |
| `--sf-color-action-superdark` | PUBLIC | consumption | color | `var(--sf-color-action-950)` | Near-black action shade for maximum contrast on light surfaces. |
| `--sf-color-action-superlight` | PUBLIC | consumption | color | `var(--sf-color-action-50)` | Near-white action shade for maximum contrast on dark surfaces. |
| `--sf-color-action-xdark` | PUBLIC | consumption | color | `var(--sf-color-action-800)` | Extra-dark action shade. |
| `--sf-color-action-xlight` | PUBLIC | consumption | color | `var(--sf-color-action-200)` | Extra-light action shade. |
| `--sf-color-base` | PUBLIC | consumption | color | `light-dark(var(--sf-color-base-source-light), var(--sf-color-base-source-dark, oklch(from var(--sf-color-base-source-light) clamp(0.16, calc(1.18 - l), 0.24) calc(c * 0.5) h)))` | Secondary interactive color for supporting actions and secondary buttons. |
| `--sf-color-base--active` | PUBLIC | consumption | color | `var(--sf-color-base-xdark)` | Base color at pressed/active brightness. |
| `--sf-color-base--hover` | PUBLIC | consumption | color | `var(--sf-color-base-darker)` | Base color at hover brightness. |
| `--sf-color-base-darker` | PUBLIC | consumption | color | `var(--sf-color-base-600)` | Deep base shade. |
| `--sf-color-base-ghost` | PUBLIC | consumption | color | `oklch(from var(--sf-color-base) l c h / 0.05)` | Near-transparent base tint for ghost-button hover backgrounds. |
| `--sf-color-base-lighter` | PUBLIC | consumption | color | `var(--sf-color-base-400)` | Light base shade. |
| `--sf-color-base-muted` | PUBLIC | consumption | color | `oklch(from var(--sf-color-base) l c h / 0.30)` | Medium base fill. |
| `--sf-color-base-source-dark` | PUBLIC | knob | color | `oklch(0.22 0.003 250)` | Registered <color> dark counterpart of --sf-color-base. |
| `--sf-color-base-source-light` | PUBLIC | knob | color | `oklch(0.96 0.006 250)` | OKLCH lightness source for the base color. |
| `--sf-color-base-subtle` | PUBLIC | consumption | color | `oklch(from var(--sf-color-base) l c h / 0.10)` | Lightest base tint. |
| `--sf-color-base-superdark` | PUBLIC | consumption | color | `var(--sf-color-base-950)` | Near-black base shade. |
| `--sf-color-base-superlight` | PUBLIC | consumption | color | `var(--sf-color-base-50)` | Near-white base shade. |
| `--sf-color-base-xdark` | PUBLIC | consumption | color | `var(--sf-color-base-800)` | Extra-dark base shade. |
| `--sf-color-base-xlight` | PUBLIC | consumption | color | `var(--sf-color-base-200)` | Extra-light base shade. |
| `--sf-color-bg` | PUBLIC | consumption | color | `oklch(from var(--sf-color-base) calc(l + 0.02) c h)` | Base page / component background. The canvas all other surfaces layer on top of. |
| `--sf-color-bg--active` | PUBLIC | consumption | color | `oklch(from var(--sf-color-neutral) l c h / 0.12)` | Background tint for pressed/active interactive elements. |
| `--sf-color-bg--disabled` | PUBLIC | consumption | color | `var(--sf-color-inset)` | Background for disabled interactive elements. |
| `--sf-color-bg--focus` | PUBLIC | consumption | color | `oklch(from var(--sf-color-action) l c h / 0.06)` | Background tint for focused interactive elements. |
| `--sf-color-bg--hover` | PUBLIC | consumption | color | `oklch(from var(--sf-color-neutral) l c h / 0.08)` | Background tint for hovered interactive elements (rows, list items, etc.). |
| `--sf-color-bg--selected` | PUBLIC | consumption | color | `oklch(from var(--sf-color-action) l c h / 0.1)` | Background for selected items (checked rows, active nav links). |
| `--sf-color-black` | PUBLIC | knob | color | `oklch(0% 0 0)` | Absolute black reference value. |
| `--sf-color-border` | PUBLIC | consumption | color | `light-dark( oklch(from var(--sf-color-neutral-source-light) clamp(0.70, calc(l + 0.35), 0.95) 0.005 h), oklch(from var(--sf-color-neutral) clamp(0.25, calc(l - 0.3), 0.55) 0.005 h) )` | Default border for dividers and component edges. |
| `--sf-color-border--disabled` | PUBLIC | consumption | color | `oklch(from var(--sf-color-border--subtle) l 0 h / 0.5)` | Semi-transparent border for disabled element edges. |
| `--sf-color-border--focus` | PUBLIC | consumption | color | `var(--sf-color-action)` | Focus indicator border, used alongside --sf-focus-ring-color. |
| `--sf-color-border--strong` | PUBLIC | consumption | color | `light-dark( oklch(from var(--sf-color-neutral-source-light) clamp(0.55, calc(l + 0.1), 0.85) 0.02 h), oklch(from var(--sf-color-neutral) clamp(0.38, calc(l - 0.1), 0.65) 0.02 h) )` | Stronger border for visually prominent edges and active outlines. |
| `--sf-color-border--subtle` | PUBLIC | consumption | color | `light-dark( oklch(from var(--sf-color-neutral-source-light) clamp(0.75, calc(l + 0.4), 0.97) 0.005 h), oklch(from var(--sf-color-neutral) clamp(0.20, calc(l - 0.38), 0.45) 0.005 h) )` | Low-contrast border for subtle separation without strong visual weight. |
| `--sf-color-border--translucent` | PUBLIC | consumption | color | `oklch(from var(--sf-color-neutral) l c h / 0.15)` | Translucent border for glass-morphism and frosted surfaces. |
| `--sf-color-code-bg` | PUBLIC | consumption | color | `var(--sf-color-inset)` | Background for inline <code> elements. Usually a subtle tint of the inset surface. |
| `--sf-color-code-text` | PUBLIC | consumption | color | `oklch(from var(--sf-color-code-bg) clamp(0.1, sign(var(--sf-contrast-threshold) - l) * 999, 0.95) 0 0)` | Text color for inline code and monospace preformatted text. |
| `--sf-color-danger` | PUBLIC | consumption | color | `light-dark(var(--sf-color-danger-source-light), var(--sf-color-danger-source-dark, oklch(from var(--sf-color-danger-source-light) clamp(0.65, calc(0.95 - l * 0.5), 0.88) calc(c * 0.9) h)))` | Destructive / danger state color. Used for delete actions, error alerts, and critical warnings. |
| `--sf-color-danger-muted` | PUBLIC | consumption | color | `oklch(from var(--sf-color-danger) l c h / 0.3)` | Medium danger fill for icon backgrounds and badge fills. |
| `--sf-color-danger-source-dark` | PUBLIC | knob | color | `oklch(0.71 0.198 12)` | Registered <color> dark counterpart of --sf-color-danger. |
| `--sf-color-danger-source-light` | PUBLIC | knob | color | `oklch(0.48 0.22 12)` | OKLCH lightness source for the danger status color (covers destructive actions and form validation errors). |
| `--sf-color-danger-strong` | PUBLIC | consumption | color | `light-dark( oklch(from var(--sf-color-danger-source-light) calc(l - 0.1) c h), oklch(from var(--sf-color-danger) clamp(0.70, calc(l + 0.15), 1) c h) )` | High-contrast danger color for alert body text and icons. |
| `--sf-color-danger-subtle` | PUBLIC | consumption | color | `oklch(from var(--sf-color-danger) l c h / 0.1)` | Light danger tint for error row backgrounds and alert container fills. |
| `--sf-color-dim` | PUBLIC | knob | color | `oklch(0 0 0 / 0.5)` | Backdrop overlay color for modals, drawers, and lightboxes. |
| `--sf-color-heading` | PUBLIC | consumption | color | `light-dark( oklch(from var(--sf-color-neutral-source-light) clamp(0.05, calc(l - 0.4 - var(--sf-contrast-bias)), 0.35) c h), oklch(from var(--sf-color-neutral) clamp(0.70, calc(l + 0.25 + var(--sf-contrast-bias)), 1) c h) )` | Heading text color. Slightly stronger contrast than body text for visual hierarchy. |
| `--sf-color-info` | PUBLIC | consumption | color | `light-dark(var(--sf-color-info-source-light), var(--sf-color-info-source-dark, oklch(from var(--sf-color-info-source-light) clamp(0.65, calc(0.95 - l * 0.5), 0.88) calc(c * 0.9) h)))` | Informational color for neutral tips, hints, and non-urgent notices. |
| `--sf-color-info-muted` | PUBLIC | consumption | color | `oklch(from var(--sf-color-info) l c h / 0.3)` | Medium info fill for info icons and hint chips. |
| `--sf-color-info-source-dark` | PUBLIC | knob | color | `oklch(0.71 0.162 235)` | Registered <color> dark counterpart of --sf-color-info. |
| `--sf-color-info-source-light` | PUBLIC | knob | color | `oklch(0.48 0.18 235)` | OKLCH lightness source for the info status color. |
| `--sf-color-info-strong` | PUBLIC | consumption | color | `light-dark( oklch(from var(--sf-color-info-source-light) calc(l - 0.1) c h), oklch(from var(--sf-color-info) clamp(0.70, calc(l + 0.15), 1) c h) )` | High-contrast info color for hint body text. |
| `--sf-color-info-subtle` | PUBLIC | consumption | color | `oklch(from var(--sf-color-info) l c h / 0.1)` | Light info tint for informational note backgrounds. |
| `--sf-color-inset` | PUBLIC | consumption | color | `oklch(from var(--sf-color-base) calc(l - 0.02) c h)` | Slightly inset surface for nested areas — inputs, code blocks, sidebar panels. |
| `--sf-color-inverse` | PUBLIC | consumption | color | `oklch(from var(--sf-color-base) calc(1 - l) c h)` | Inverted (dark-on-light / light-on-dark) surface for high-contrast banners or tooltips. |
| `--sf-color-link` | PUBLIC | consumption | color | `light-dark( oklch(from var(--sf-color-action) clamp(0, min(l - 0.07, 0.48), 1) c h), oklch(from var(--sf-color-action) clamp(0.68, l, 1) c h) )` | Default hyperlink color. |
| `--sf-color-link--active` | PUBLIC | consumption | color | `light-dark( oklch(from var(--sf-color-action) clamp(0, min(l - 0.21, 0.34), 1) c h), oklch(from var(--sf-color-action) clamp(0, max(l + 0.15, 0.74), 1) c h) )` | Link color when actively pressed. |
| `--sf-color-link--disabled` | PUBLIC | consumption | color | `var(--sf-color-text--disabled)` | Disabled link color (low contrast, no interaction). |
| `--sf-color-link--hover` | PUBLIC | consumption | color | `light-dark( oklch(from var(--sf-color-action) clamp(0, min(l - 0.15, 0.40), 1) c h), oklch(from var(--sf-color-action) clamp(0, max(l + 0.10, 0.68), 1) c h) )` | Link color on hover. |
| `--sf-color-link--underline` | PUBLIC | consumption | color | `oklch(from var(--sf-color-action) l c h / 0.3)` | Color of the link underline decoration. Defaults to a semi-transparent variant of the link color. |
| `--sf-color-link--visited` | PUBLIC | consumption | color | `light-dark( oklch(from var(--sf-color-action) clamp(0, min(l - 0.07, 0.48), 1) c calc(h + 60)), oklch(from var(--sf-color-action) clamp(0.68, l, 1) c calc(h + 60)) )` | Visited link color. |
| `--sf-color-mark-bg` | PUBLIC | consumption | color | `oklch(from var(--sf-color-warning) l c h / 0.25)` | Background color for highlighted <mark> elements. |
| `--sf-color-mark-text` | PUBLIC | knob | color | `inherit` | Text color inside highlighted <mark> elements. |
| `--sf-color-neutral` | PUBLIC | consumption | color | `light-dark(var(--sf-color-neutral-source-light), var(--sf-color-neutral-source-dark, oklch(from var(--sf-color-neutral-source-light) clamp(0.65, calc(0.95 - l * 0.5), 0.88) calc(c * 0.9) h)))` | Neutral interactive color for low-emphasis actions and tertiary buttons. |
| `--sf-color-neutral--active` | PUBLIC | consumption | color | `var(--sf-color-neutral-xdark)` | Neutral color at pressed/active brightness. |
| `--sf-color-neutral--hover` | PUBLIC | consumption | color | `var(--sf-color-neutral-darker)` | Neutral color at hover brightness. |
| `--sf-color-neutral-darker` | PUBLIC | consumption | color | `var(--sf-color-neutral-600)` | Deep neutral shade for high-contrast contexts. |
| `--sf-color-neutral-ghost` | PUBLIC | consumption | color | `oklch(from var(--sf-color-neutral) l c h / 0.05)` | Near-transparent neutral tint for ghost-button hover backgrounds. |
| `--sf-color-neutral-lighter` | PUBLIC | consumption | color | `var(--sf-color-neutral-400)` | Light neutral shade. |
| `--sf-color-neutral-muted` | PUBLIC | consumption | color | `oklch(from var(--sf-color-neutral) l c h / 0.30)` | Muted neutral fill for low-emphasis contexts. |
| `--sf-color-neutral-source-dark` | PUBLIC | knob | color | `oklch(0.69 0.0225 260)` | Registered <color> dark counterpart of --sf-color-neutral. |
| `--sf-color-neutral-source-light` | PUBLIC | knob | color | `oklch(0.52 0.025 260)` | OKLCH lightness source for the neutral color. |
| `--sf-color-neutral-subtle` | PUBLIC | consumption | color | `oklch(from var(--sf-color-neutral) l c h / 0.10)` | Lightest neutral semantic tint. |
| `--sf-color-neutral-superdark` | PUBLIC | consumption | color | `var(--sf-color-neutral-950)` | Near-black neutral shade. |
| `--sf-color-neutral-superlight` | PUBLIC | consumption | color | `var(--sf-color-neutral-50)` | Near-white neutral shade. |
| `--sf-color-neutral-xdark` | PUBLIC | consumption | color | `var(--sf-color-neutral-800)` | Extra-dark neutral shade. |
| `--sf-color-neutral-xlight` | PUBLIC | consumption | color | `var(--sf-color-neutral-200)` | Extra-light neutral shade. |
| `--sf-color-overlay` | PUBLIC | consumption | color | `oklch(from var(--sf-color-base) l c h / 0.9)` | Overlay surface for floating panels, sheets, and modals. |
| `--sf-color-primary` | PUBLIC | consumption | color | `light-dark(var(--sf-color-primary-source-light), var(--sf-color-primary-source-dark, oklch(from var(--sf-color-primary-source-light) clamp(0.65, calc(0.95 - l * 0.5), 0.88) calc(c * 0.9) h)))` | Raw primary palette token aliased from the action role by default. Override to decouple primary from action. |
| `--sf-color-primary--active` | PUBLIC | consumption | color | `var(--sf-color-primary-xdark)` | Primary color at pressed/active brightness. |
| `--sf-color-primary--hover` | PUBLIC | consumption | color | `var(--sf-color-primary-darker)` | Primary color at hover brightness. |
| `--sf-color-primary-darker` | PUBLIC | consumption | color | `var(--sf-color-primary-600)` | Deep primary shade. |
| `--sf-color-primary-ghost` | PUBLIC | consumption | color | `oklch(from var(--sf-color-primary) l c h / 0.05)` | Near-transparent primary tint for ghost-button hover backgrounds. |
| `--sf-color-primary-lighter` | PUBLIC | consumption | color | `var(--sf-color-primary-400)` | Light primary shade. |
| `--sf-color-primary-muted` | PUBLIC | consumption | color | `oklch(from var(--sf-color-primary) l c h / 0.30)` | Muted primary fill. |
| `--sf-color-primary-source-dark` | PUBLIC | knob | color | `oklch(0.715 0.243 264)` | Registered <color> dark counterpart of --sf-color-primary. |
| `--sf-color-primary-source-light` | PUBLIC | knob | color | `oklch(0.47 0.27 264)` | OKLCH lightness source for the primary color. |
| `--sf-color-primary-subtle` | PUBLIC | consumption | color | `oklch(from var(--sf-color-primary) l c h / 0.10)` | Lightest primary semantic tint. |
| `--sf-color-primary-superdark` | PUBLIC | consumption | color | `var(--sf-color-primary-950)` | Near-black primary shade. |
| `--sf-color-primary-superlight` | PUBLIC | consumption | color | `var(--sf-color-primary-50)` | Near-white primary shade. |
| `--sf-color-primary-xdark` | PUBLIC | consumption | color | `var(--sf-color-primary-800)` | Extra-dark primary shade. |
| `--sf-color-primary-xlight` | PUBLIC | consumption | color | `var(--sf-color-primary-200)` | Extra-light primary shade. |
| `--sf-color-raised` | PUBLIC | consumption | color | `oklch(from var(--sf-color-base) calc(l + 0.04) c h)` | Elevated card surface that floats above the page background. |
| `--sf-color-scheme` | PUBLIC | knob | color | `light dark` | Preferred color scheme hint (light / dark / normal). Sent to the browser to influence UA chrome styling. |
| `--sf-color-secondary` | PUBLIC | consumption | color | `light-dark(var(--sf-color-secondary-source-light), var(--sf-color-secondary-source-dark, oklch(from var(--sf-color-secondary-source-light) clamp(0.65, calc(0.95 - l * 0.5), 0.88) calc(c * 0.9) h)))` | Raw secondary palette token for the secondary brand color. |
| `--sf-color-secondary--active` | PUBLIC | consumption | color | `var(--sf-color-secondary-xdark)` | Secondary color at pressed/active brightness. |
| `--sf-color-secondary--hover` | PUBLIC | consumption | color | `var(--sf-color-secondary-darker)` | Secondary color at hover brightness. |
| `--sf-color-secondary-darker` | PUBLIC | consumption | color | `var(--sf-color-secondary-600)` | Deep secondary shade. |
| `--sf-color-secondary-ghost` | PUBLIC | consumption | color | `oklch(from var(--sf-color-secondary) l c h / 0.05)` | Near-transparent secondary tint for ghost-button hover backgrounds. |
| `--sf-color-secondary-lighter` | PUBLIC | consumption | color | `var(--sf-color-secondary-400)` | Light secondary shade. |
| `--sf-color-secondary-muted` | PUBLIC | consumption | color | `oklch(from var(--sf-color-secondary) l c h / 0.30)` | Muted secondary fill. |
| `--sf-color-secondary-source-dark` | PUBLIC | knob | color | `oklch(0.84 0.036 264)` | Registered <color> dark counterpart of --sf-color-secondary. |
| `--sf-color-secondary-source-light` | PUBLIC | knob | color | `oklch(0.22 0.04 264)` | OKLCH lightness source for the secondary color. |
| `--sf-color-secondary-subtle` | PUBLIC | consumption | color | `oklch(from var(--sf-color-secondary) l c h / 0.10)` | Lightest secondary semantic tint. |
| `--sf-color-secondary-superdark` | PUBLIC | consumption | color | `var(--sf-color-secondary-950)` | Near-black secondary shade. |
| `--sf-color-secondary-superlight` | PUBLIC | consumption | color | `var(--sf-color-secondary-50)` | Near-white secondary shade. |
| `--sf-color-secondary-xdark` | PUBLIC | consumption | color | `var(--sf-color-secondary-800)` | Extra-dark secondary shade. |
| `--sf-color-secondary-xlight` | PUBLIC | consumption | color | `var(--sf-color-secondary-200)` | Extra-light secondary shade. |
| `--sf-color-selection-bg` | PUBLIC | consumption | color | `light-dark( oklch(from var(--sf-color-action-source-light) l c h / 0.28), oklch(from var(--sf-color-action-source-light) clamp(0.62, calc(0.93 - l * 0.4), 0.78) c h / 0.55) )` | Background color applied to browser text selections. |
| `--sf-color-selection-text` | PUBLIC | knob | color | `inherit` | Text color inside browser text selections. |
| `--sf-color-success` | PUBLIC | consumption | color | `light-dark(var(--sf-color-success-source-light), var(--sf-color-success-source-dark, oklch(from var(--sf-color-success-source-light) clamp(0.65, calc(0.95 - l * 0.5), 0.88) calc(c * 0.9) h)))` | Positive / success color for confirmation messages and completed-state indicators. |
| `--sf-color-success-muted` | PUBLIC | consumption | color | `oklch(from var(--sf-color-success) l c h / 0.3)` | Medium success fill for success icons and status chips. |
| `--sf-color-success-source-dark` | PUBLIC | knob | color | `oklch(0.70 0.144 145)` | Registered <color> dark counterpart of --sf-color-success. |
| `--sf-color-success-source-light` | PUBLIC | knob | color | `oklch(0.50 0.16 145)` | OKLCH lightness source for the success status color. |
| `--sf-color-success-strong` | PUBLIC | consumption | color | `light-dark( oklch(from var(--sf-color-success-source-light) calc(l - 0.15) c h), oklch(from var(--sf-color-success) clamp(0.70, calc(l + 0.15), 1) c h) )` | High-contrast success color for confirmation message text. |
| `--sf-color-success-subtle` | PUBLIC | consumption | color | `oklch(from var(--sf-color-success) l c h / 0.12)` | Light success tint for confirmation backgrounds. |
| `--sf-color-surface` | PUBLIC | consumption | color | `var(--sf-color-base)` | Elevated surface color (e.g. card background one step above page background). |
| `--sf-color-tertiary` | PUBLIC | consumption | color | `light-dark(var(--sf-color-tertiary-source-light), var(--sf-color-tertiary-source-dark, oklch(from var(--sf-color-tertiary-source-light) clamp(0.65, calc(0.95 - l * 0.5), 0.88) calc(c * 0.9) h)))` | Raw tertiary palette token for the third brand color. |
| `--sf-color-tertiary--active` | PUBLIC | consumption | color | `var(--sf-color-tertiary-xdark)` | Tertiary color at pressed/active brightness. |
| `--sf-color-tertiary--hover` | PUBLIC | consumption | color | `var(--sf-color-tertiary-darker)` | Tertiary color at hover brightness. |
| `--sf-color-tertiary-darker` | PUBLIC | consumption | color | `var(--sf-color-tertiary-600)` | Deep tertiary shade. |
| `--sf-color-tertiary-ghost` | PUBLIC | consumption | color | `oklch(from var(--sf-color-tertiary) l c h / 0.05)` | Near-transparent tertiary tint for ghost-button hover backgrounds. |
| `--sf-color-tertiary-lighter` | PUBLIC | consumption | color | `var(--sf-color-tertiary-400)` | Light tertiary shade. |
| `--sf-color-tertiary-muted` | PUBLIC | consumption | color | `oklch(from var(--sf-color-tertiary) l c h / 0.30)` | Muted tertiary fill. |
| `--sf-color-tertiary-source-dark` | PUBLIC | knob | color | `oklch(0.74 0.198 295)` | Registered <color> dark counterpart of --sf-color-tertiary. |
| `--sf-color-tertiary-source-light` | PUBLIC | knob | color | `oklch(0.42 0.22 295)` | OKLCH lightness source for the tertiary color. |
| `--sf-color-tertiary-subtle` | PUBLIC | consumption | color | `oklch(from var(--sf-color-tertiary) l c h / 0.10)` | Lightest tertiary semantic tint. |
| `--sf-color-tertiary-superdark` | PUBLIC | consumption | color | `var(--sf-color-tertiary-950)` | Near-black tertiary shade. |
| `--sf-color-tertiary-superlight` | PUBLIC | consumption | color | `var(--sf-color-tertiary-50)` | Near-white tertiary shade. |
| `--sf-color-tertiary-xdark` | PUBLIC | consumption | color | `var(--sf-color-tertiary-800)` | Extra-dark tertiary shade. |
| `--sf-color-tertiary-xlight` | PUBLIC | consumption | color | `var(--sf-color-tertiary-200)` | Extra-light tertiary shade. |
| `--sf-color-text` | PUBLIC | consumption | color | `light-dark( oklch(from var(--sf-color-neutral-source-light) clamp(0.05, calc(l - 0.4 - var(--sf-contrast-bias)), 0.35) c h), oklch(from var(--sf-color-neutral) clamp(0.70, calc(l + 0.25 + var(--sf-contrast-bias)), 1) c h) )` | Primary text color. Contrasts against --sf-color-bg for body copy. |
| `--sf-color-text--disabled` | PUBLIC | consumption | color | `light-dark( oklch(from var(--sf-color-neutral-source-light) clamp(0.55, calc(l + 0.25), 0.82) c h), oklch(from var(--sf-color-neutral) clamp(0.25, calc(l - 0.2), 0.55) c h) )` | Text color for disabled UI elements. Intentionally low contrast. |
| `--sf-color-text--inverse` | PUBLIC | consumption | color | `light-dark( oklch(from var(--sf-color-neutral-source-light) clamp(0.85, calc(l + 0.4), 0.98) c h), oklch(from var(--sf-color-neutral) clamp(0.05, calc(l - 0.4), 0.35) c h) )` | Text color for use on dark/inverted backgrounds. |
| `--sf-color-text--muted` | PUBLIC | consumption | color | `light-dark( oklch(from var(--sf-color-neutral-source-light) clamp(0.35, calc(l - var(--sf-contrast-bias)), 0.62) c h), oklch(from var(--sf-color-neutral) clamp(0.48, calc(l + var(--sf-contrast-bias)), 0.74) c h) )` | Muted text for metadata, timestamps, and low-priority annotations. |
| `--sf-color-text--on-action` | PUBLIC | consumption | color | `oklch(from var(--sf-color-action) clamp(0.1, sign(var(--sf-contrast-threshold) - l) * 999, 0.95) 0 0)` | Accessible foreground color for text on action-colored backgrounds. |
| `--sf-color-text--on-base` | PUBLIC | consumption | color | `var(--sf-color-text)` | Accessible foreground for text on base-colored backgrounds. |
| `--sf-color-text--on-danger` | PUBLIC | consumption | color | `oklch(from var(--sf-color-danger) clamp(0.1, sign(var(--sf-contrast-threshold) - l) * 999, 0.95) 0 0)` | Accessible foreground for text on danger-colored backgrounds. |
| `--sf-color-text--on-info` | PUBLIC | consumption | color | `oklch(from var(--sf-color-info) clamp(0.1, sign(var(--sf-contrast-threshold) - l) * 999, 0.95) 0 0)` | Accessible foreground for text on info-colored backgrounds. |
| `--sf-color-text--on-inverse` | PUBLIC | consumption | color | `oklch(from var(--sf-color-inverse) clamp(0.1, sign(var(--sf-contrast-threshold) - l) * 999, 0.95) 0 0)` | Accessible foreground for text on inverted (dark-on-light / light-on-dark) backgrounds. |
| `--sf-color-text--on-neutral` | PUBLIC | consumption | color | `oklch(from var(--sf-color-neutral) clamp(0.1, sign(var(--sf-contrast-threshold) - l) * 999, 0.95) 0 0)` | Accessible foreground for text placed on neutral-colored backgrounds. |
| `--sf-color-text--on-primary` | PUBLIC | consumption | color | `oklch(from var(--sf-color-primary) clamp(0.1, sign(var(--sf-contrast-threshold) - l) * 999, 0.95) 0 0)` | Accessible foreground for text placed on primary-colored backgrounds. |
| `--sf-color-text--on-secondary` | PUBLIC | consumption | color | `oklch(from var(--sf-color-secondary) clamp(0.1, sign(var(--sf-contrast-threshold) - l) * 999, 0.95) 0 0)` | Accessible foreground for text placed on secondary-colored backgrounds. |
| `--sf-color-text--on-success` | PUBLIC | consumption | color | `oklch(from var(--sf-color-success) clamp(0.1, sign(var(--sf-contrast-threshold) - l) * 999, 0.95) 0 0)` | Accessible foreground for text on success-colored backgrounds. |
| `--sf-color-text--on-tertiary` | PUBLIC | consumption | color | `oklch(from var(--sf-color-tertiary) clamp(0.1, sign(var(--sf-contrast-threshold) - l) * 999, 0.95) 0 0)` | Accessible foreground for text placed on tertiary-colored backgrounds. |
| `--sf-color-text--on-warning` | PUBLIC | consumption | color | `oklch(from var(--sf-color-warning) clamp(0.1, sign(var(--sf-contrast-threshold) - l) * 999, 0.95) 0 0)` | Accessible foreground for text on warning-colored backgrounds. |
| `--sf-color-text--placeholder` | PUBLIC | consumption | color | `light-dark( oklch(from var(--sf-color-neutral-source-light) clamp(0.45, calc(l + 0.15), 0.75) c h), oklch(from var(--sf-color-neutral) clamp(0.35, calc(l - 0.1), 0.65) c h) )` | Placeholder text color for inputs and textareas. |
| `--sf-color-text--secondary` | PUBLIC | consumption | color | `light-dark( oklch(from var(--sf-color-neutral-source-light) clamp(0.15, calc(l - 0.25 - var(--sf-contrast-bias)), 0.45) c h), oklch(from var(--sf-color-neutral) clamp(0.55, calc(l + 0.1 + var(--sf-contrast-bias)), 0.90) c h) )` | De-emphasised secondary text (captions, labels, supporting copy). |
| `--sf-color-warning` | PUBLIC | consumption | color | `light-dark(var(--sf-color-warning-source-light), var(--sf-color-warning-source-dark, oklch(from var(--sf-color-warning-source-light) clamp(0.65, calc(0.95 - l * 0.5), 0.88) calc(c * 0.9) h)))` | Warning / caution color for non-critical alerts and degraded-state indicators. |
| `--sf-color-warning-muted` | PUBLIC | consumption | color | `oklch(from var(--sf-color-warning) l c h / 0.3)` | Medium warning fill for icons and caution chips. |
| `--sf-color-warning-source-dark` | PUBLIC | knob | color | `oklch(0.65 0.153 80)` | Registered <color> dark counterpart of --sf-color-warning. |
| `--sf-color-warning-source-light` | PUBLIC | knob | color | `oklch(0.75 0.17 80)` | OKLCH lightness source for the warning status color. |
| `--sf-color-warning-strong` | PUBLIC | consumption | color | `light-dark( oklch(from var(--sf-color-warning-source-light) calc(l - 0.25) c h), oklch(from var(--sf-color-warning) clamp(0.70, calc(l + 0.05), 1) c h) )` | High-contrast warning color for caution text. |
| `--sf-color-warning-subtle` | PUBLIC | consumption | color | `oklch(from var(--sf-color-warning) l c h / 0.12)` | Light warning tint for warning notification backgrounds. |
| `--sf-color-white` | PUBLIC | knob | color | `oklch(100% 0 0)` | Absolute white reference value. |
| `--sf-component-pad` | PUBLIC | consumption | component | `var(--sf-space-m)` | Standard inner padding for interactive components (buttons, form inputs, chips). |
| `--sf-container-default` | PUBLIC | knob | container | `75rem` | Default content container max-width (~1200px). |
| `--sf-container-full` | PUBLIC | knob | container | `100%` | Full-width container — removes the max-width constraint. |
| `--sf-container-narrow` | PUBLIC | knob | container | `38rem` | Narrow content max-width — ideal for article body and blog posts (~65ch). |
| `--sf-container-prose` | PUBLIC | knob | container | `65ch` | Prose max-width — optimised for readability (~75ch). |
| `--sf-container-wide` | PUBLIC | knob | container | `90rem` | Wide container for marketing / dashboard layouts (~1440px). |
| `--sf-content-gap` | PUBLIC | consumption | content | `var(--sf-space-s)` | Tight gap within related content (stack, flow, prose). Override globally to retune all tight primitives at once. |
| `--sf-contrast-bias` | PUBLIC-ADVANCED | knob | contrast | `0` | Global text-contrast nudge. Positive values push derived reading-text colors toward the extremes (darker in light mode, lighter in dark). Default 0 (neutral). |
| `--sf-contrast-threshold` | PUBLIC-ADVANCED | knob | contrast | `0.6` | OKLCH lightness crossover for auto-contrast on colored surfaces. Colors with L above this get dark text; below get light text. Default 0.6. |
| `--sf-current-font-weight` | PUBLIC | consumption | current | `var(--sf-font-weight-bold)` | Inherits the current font-weight from context. Useful as a reset. |
| `--sf-display-l-line-height` | PUBLIC | knob | display | `1` | Line height for large display text (--sf-text-display-l). Very tight to avoid excessive gaps at oversized sizes. |
| `--sf-display-m-line-height` | PUBLIC | knob | display | `1.05` | Line height for medium display text (--sf-text-display-m). |
| `--sf-display-s-line-height` | PUBLIC | consumption | display | `var(--sf-leading-tight)` | Line height for small display text (--sf-text-display-s). |
| `--sf-divider-color` | PUBLIC | consumption | divider | `var(--sf-color-border)` | Color of horizontal/vertical divider rules. |
| `--sf-divider-gap` | PUBLIC | consumption | divider | `var(--sf-space-m)` | Spacing (margin) around divider elements. |
| `--sf-divider-style` | PUBLIC | knob | divider | `solid` | Border style of dividers. |
| `--sf-divider-width` | PUBLIC | consumption | divider | `var(--sf-border-width-1)` | Stroke width of horizontal and vertical divider rules. |
| `--sf-drop-shadow-l` | PUBLIC | consumption | drop | `drop-shadow(0 8px 16px oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 2.5), 0.7)))` | Large CSS filter: drop-shadow for prominent illustrated or cut-out elements. |
| `--sf-drop-shadow-m` | PUBLIC | consumption | drop | `drop-shadow(0 4px 6px oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 2), 0.7)))` | Medium CSS filter: drop-shadow for elevated icons and card thumbnails. |
| `--sf-drop-shadow-s` | PUBLIC | consumption | drop | `drop-shadow(0 1px 2px oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 1.5), 0.7)))` | Small CSS filter: drop-shadow. Use filter (not box-shadow) for elements with transparent areas — SVGs, PNGs, cutout images. |
| `--sf-duration-fast` | PUBLIC | consumption | duration | `calc(150ms * var(--sf-motion-scale))` | Fast duration (~100ms). Hover transitions, tooltip appear. |
| `--sf-duration-instant` | PUBLIC | consumption | duration | `calc(100ms * var(--sf-motion-scale))` | Near-instant duration (~50ms). Micro-interactions and cursor-follow effects. |
| `--sf-duration-none` | PUBLIC | knob | duration | `0ms` | 0ms duration. Disables transitions (respects prefers-reduced-motion). |
| `--sf-duration-normal` | PUBLIC | consumption | duration | `calc(250ms * var(--sf-motion-scale))` | Normal duration (~200ms). Default for most transitions. |
| `--sf-duration-slow` | PUBLIC | consumption | duration | `calc(400ms * var(--sf-motion-scale))` | Slow duration (~350ms). Emphasis transitions, drawers. |
| `--sf-duration-slower` | PUBLIC | consumption | duration | `calc(600ms * var(--sf-motion-scale))` | Extra-slow duration (~600ms). Page-level enter/exit transitions. |
| `--sf-ease-bounce` | PUBLIC | knob | ease | `linear(0, 0.35 18%, 1 32%, 0.86 42%, 1.02 56%, 0.98 72%, 1)` | Bounce easing. Playful overshooting effect. |
| `--sf-ease-elastic` | PUBLIC | knob | ease | `linear(0, 0.3, 1.2, 0.9, 1.05, 1)` | Elastic easing. Spring-like overshooting effect. |
| `--sf-ease-in` | PUBLIC | knob | ease | `cubic-bezier(0.5, 0, 0.75, 0.25)` | Accelerating easing. Use for elements leaving the viewport. |
| `--sf-ease-in-out` | PUBLIC | knob | ease | `cubic-bezier(0.4, 0, 0.2, 1)` | Symmetric easing. Use for elements that move within the viewport. |
| `--sf-ease-linear` | PUBLIC | knob | ease | `linear` | Linear easing. Use for progress indicators and spinner rotations. |
| `--sf-ease-out` | PUBLIC | knob | ease | `cubic-bezier(0.25, 0, 0.15, 1)` | Decelerating easing. Use for elements entering the viewport. |
| `--sf-ease-overshoot` | PUBLIC | knob | ease | `linear(0, 0.6 30%, 1.08 55%, 0.98 75%, 1)` | Subtle overshoot easing. Softer spring effect. |
| `--sf-ease-spring` | PUBLIC | knob | ease | `linear(0, 0.5, 1.1, 0.95, 1.02, 1)` | Spring easing. Natural physics-based motion. |
| `--sf-field-block` | PUBLIC | consumption | field | `var(--sf-space-l)` | Vertical (block) padding inside form fields. |
| `--sf-field-required-marker` | PUBLIC | knob | field | `" *"` | CSS content value for required-field markers (e.g. " *"). Used by pseudo-elements in the .required utility pattern. |
| `--sf-fluid-max-vw` | PUBLIC-ADVANCED | knob | fluid | `90` | Maximum viewport width (in rem) at which the fluid scale clamps to its largest values. Default 90rem (~1440px). Part of the fluid scale engine. |
| `--sf-fluid-min-vw` | PUBLIC-ADVANCED | knob | fluid | `22.5` | Minimum viewport width (in rem) at which the fluid scale clamps to its smallest values. Default 22.5rem (~360px). Part of the fluid scale engine. |
| `--sf-focus-ring-color` | PUBLIC | consumption | focus | `var(--sf-color-action)` | Color of the keyboard focus ring. Ensure sufficient contrast against all background surfaces. |
| `--sf-focus-ring-offset` | PUBLIC | knob | focus | `2px` | Gap between the element edge and the focus ring. |
| `--sf-focus-ring-shadow` | PUBLIC-ADVANCED | consumption | focus | `0 0 0 var(--sf-focus-ring-offset) var(--sf-color-bg, var(--sf-color-base-source-light, #fff)), 0 0 0 calc(var(--sf-focus-ring-offset) + var(--sf-focus-ring-width)) var(--sf-focus-ring-color)` | Computed box-shadow value for the focus ring — two-layer technique: offset shadow in bg color, then ring shadow in focus-ring color. Tune via --sf-focus-ring-width and --sf-focus-ring-color instead of overriding this directly. |
| `--sf-focus-ring-style` | PUBLIC | knob | focus | `solid` | Border style of the focus ring (solid, dashed, dotted). |
| `--sf-focus-ring-width` | PUBLIC | knob | focus | `2px` | Stroke width of the focus ring outline. |
| `--sf-font-body` | PUBLIC | knob | font | `system-ui, -apple-system, sans-serif` | Font family stack for body text. Override to set your primary typeface. |
| `--sf-font-display` | PUBLIC | consumption | font | `var(--sf-font-heading)` | Font family for display/marketing text. Override for large headline typefaces. |
| `--sf-font-features` | PUBLIC-ADVANCED | knob | font | `normal` | OpenType feature-settings string for body text (e.g. 'ss01', 'cv11'). Default 'normal'. Override on :root or a subtree to enable ligatures, alternate glyphs, etc. |
| `--sf-font-geometric` | PUBLIC | knob | font | `"Avenir", "Montserrat", "Corbel", "URW Gothic", source-sans-pro, sans-serif` | Geometric sans-serif slot — circular letterforms for brand alternates. |
| `--sf-font-heading` | PUBLIC | consumption | font | `var(--sf-font-body)` | Font family for headings. Defaults to display if not overridden separately. |
| `--sf-font-humanist` | PUBLIC | knob | font | `"Seravek", "Gill Sans Nova", "Ubuntu", "Calibri", "DejaVu Sans", source-sans-pro, sans-serif` | Humanist sans-serif slot — warm, readable alternate typeface. |
| `--sf-font-mono` | PUBLIC | knob | font | `ui-monospace, monospace` | Monospace font family for code, pre, and kbd elements. |
| `--sf-font-numeric` | PUBLIC | knob | font | `tabular-nums` | font-variant-numeric shorthand (e.g. tabular-nums) for aligned numeric data. |
| `--sf-font-slab` | PUBLIC | knob | font | `"Rockwell", "Rockwell Nova", "Roboto Slab", "DejaVu Serif", "Sitka Small", serif` | Slab-serif slot for editorial or display headings. |
| `--sf-font-variation` | PUBLIC-ADVANCED | knob | font | `normal` | Variable-font axis settings for body text (e.g. "wght" 450). Default 'normal'. Override on :root or a subtree to activate variable-font axes. |
| `--sf-font-weight-body` | PUBLIC | consumption | font | `var(--sf-font-weight-normal)` | Font weight for body text (typically 400 / normal). |
| `--sf-font-weight-bold` | PUBLIC | knob | font | `700` | Strong emphasis weight (700). |
| `--sf-font-weight-display` | PUBLIC | consumption | font | `var(--sf-font-weight-bold)` | Font weight for display-size text. |
| `--sf-font-weight-heading` | PUBLIC | consumption | font | `var(--sf-font-weight-semibold)` | Font weight for headings (typically 600–700). |
| `--sf-font-weight-interactive` | PUBLIC | consumption | font | `var(--sf-font-weight-semibold)` | Font weight for interactive role text — buttons, badges, and navigation labels. Defaults to semibold. |
| `--sf-font-weight-light` | PUBLIC | knob | font | `300` | Light weight (300). Use sparingly — check contrast at small sizes. |
| `--sf-font-weight-medium` | PUBLIC | knob | font | `500` | Medium weight (500). Subtle emphasis without full bold. |
| `--sf-font-weight-normal` | PUBLIC | knob | font | `400` | Normal / regular weight (400). |
| `--sf-font-weight-semibold` | PUBLIC | knob | font | `600` | Semibold weight (600). Common for labels and subheadings. |
| `--sf-font-weight-strong` | PUBLIC | consumption | font | `var(--sf-font-weight-bold)` | Font weight for strong/emphasis inline role. Defaults to bold. |
| `--sf-gap` | PUBLIC | consumption | gap | `var(--sf-space-m)` | Default gap between components (the loose rhythm). Layout primitives like cluster/grid/sidebar default to it. Override globally to retune them all at once, or set a primitive token (e.g. --sf-cluster-gap) for one element. |
| `--sf-gradient-brand` | PUBLIC | consumption | gradient | `linear-gradient(in oklch 135deg, var(--sf-color-primary), oklch(from var(--sf-color-primary) l c calc(h + 30)))` | Multi-stop brand gradient spanning primary and secondary palette colors. Use for hero backgrounds and brand accents. |
| `--sf-gradient-fade--b` | PUBLIC | consumption | gradient | `linear-gradient(in oklch to bottom, transparent, var(--sf-color-bg))` | Fade-to-bottom gradient (transparent → surface). Use to fade content into a background below (infinite scroll fade, content cutoff). |
| `--sf-gradient-fade--l` | PUBLIC | consumption | gradient | `linear-gradient(in oklch to left, transparent, var(--sf-color-bg))` | Fade-to-left gradient. Use to indicate left-side scrollable overflow. |
| `--sf-gradient-fade--r` | PUBLIC | consumption | gradient | `linear-gradient(in oklch to right, transparent, var(--sf-color-bg))` | Fade-to-right gradient. Use to indicate right-side scrollable overflow. |
| `--sf-gradient-fade--t` | PUBLIC | consumption | gradient | `linear-gradient(in oklch to top, transparent, var(--sf-color-bg))` | Fade-to-top gradient (transparent → surface). Use to fade content into a background above. |
| `--sf-gradient-primary` | PUBLIC | consumption | gradient | `linear-gradient(in oklch 135deg, var(--sf-color-primary), oklch(from var(--sf-color-primary) calc(l - 0.08) c h))` | Gradient using primary palette colors (light to saturated). |
| `--sf-gradient-secondary` | PUBLIC | consumption | gradient | `linear-gradient(in oklch 135deg, var(--sf-color-secondary), oklch(from var(--sf-color-secondary) calc(l - 0.08) c h))` | Gradient using secondary palette colors. |
| `--sf-gradient-surface` | PUBLIC | consumption | gradient | `linear-gradient(in oklab 180deg, var(--sf-color-surface), var(--sf-color-bg))` | Subtle surface-color gradient for depth layering and glass effects. |
| `--sf-gradient-tertiary` | PUBLIC | consumption | gradient | `linear-gradient(in oklch 135deg, var(--sf-color-tertiary), oklch(from var(--sf-color-tertiary) calc(l - 0.08) c h))` | Gradient using tertiary palette colors. |
| `--sf-gutter` | PUBLIC | consumption | gutter | `var(--sf-space-l)` | Wide page/section-edge gutter (used by center/container). Override to set the page-edge breathing room across breakpoints. |
| `--sf-h1-font-weight` | PUBLIC | consumption | h1 | `var(--sf-font-weight-heading)` | Font weight for <h1>. |
| `--sf-h1-letter-spacing` | PUBLIC | consumption | h1 | `var(--sf-tracking-tight)` | Letter-spacing for <h1>. Typically slightly negative at large sizes. |
| `--sf-h1-line-height` | PUBLIC | consumption | h1 | `var(--sf-leading-tight)` | Line height for <h1>. Tighter than body to avoid excessive whitespace at large sizes. |
| `--sf-h1-max-width` | PUBLIC | knob | h1 | `none` | Max-inline-size cap for <h1>. Default none (unconstrained). Set to a ch value (e.g. 20ch) to prevent wide headings from spanning the full column on large screens. |
| `--sf-h1-size` | PUBLIC | consumption | h1 | `var(--sf-text-4xl)` | Font size for <h1>. |
| `--sf-h2-font-weight` | PUBLIC | consumption | h2 | `var(--sf-font-weight-heading)` | Font weight for <h2>. |
| `--sf-h2-letter-spacing` | PUBLIC | consumption | h2 | `var(--sf-tracking-tight)` | Letter-spacing for <h2>. |
| `--sf-h2-line-height` | PUBLIC | consumption | h2 | `var(--sf-leading-tight)` | Line height for <h2>. |
| `--sf-h2-max-width` | PUBLIC | knob | h2 | `none` | Max-inline-size cap for <h2>. Default none. |
| `--sf-h2-size` | PUBLIC | consumption | h2 | `var(--sf-text-3xl)` | Font size for <h2>. |
| `--sf-h3-font-weight` | PUBLIC | consumption | h3 | `var(--sf-font-weight-heading)` | Font weight for <h3>. |
| `--sf-h3-letter-spacing` | PUBLIC | consumption | h3 | `var(--sf-tracking-normal)` | Letter-spacing for <h3>. |
| `--sf-h3-line-height` | PUBLIC | consumption | h3 | `var(--sf-leading-snug)` | Line height for <h3>. |
| `--sf-h3-max-width` | PUBLIC | knob | h3 | `none` | Max-inline-size cap for <h3>. Default none. |
| `--sf-h3-size` | PUBLIC | consumption | h3 | `var(--sf-text-2xl)` | Font size for <h3>. |
| `--sf-h4-font-weight` | PUBLIC | consumption | h4 | `var(--sf-font-weight-heading)` | Font weight for <h4>. |
| `--sf-h4-letter-spacing` | PUBLIC | consumption | h4 | `var(--sf-tracking-normal)` | Letter-spacing for <h4>. |
| `--sf-h4-line-height` | PUBLIC | consumption | h4 | `var(--sf-leading-snug)` | Line height for <h4>. |
| `--sf-h4-max-width` | PUBLIC | knob | h4 | `none` | Max-inline-size cap for <h4>. Default none. |
| `--sf-h4-size` | PUBLIC | consumption | h4 | `var(--sf-text-xl)` | Font size for <h4>. |
| `--sf-h5-font-weight` | PUBLIC | consumption | h5 | `var(--sf-font-weight-heading)` | Font weight for <h5>. |
| `--sf-h5-letter-spacing` | PUBLIC | consumption | h5 | `var(--sf-tracking-normal)` | Letter-spacing for <h5>. |
| `--sf-h5-line-height` | PUBLIC | consumption | h5 | `var(--sf-leading-normal)` | Line height for <h5>. |
| `--sf-h5-max-width` | PUBLIC | knob | h5 | `none` | Max-inline-size cap for <h5>. Default none. |
| `--sf-h5-size` | PUBLIC | consumption | h5 | `var(--sf-text-l)` | Font size for <h5>. |
| `--sf-h6-font-weight` | PUBLIC | consumption | h6 | `var(--sf-font-weight-heading)` | Font weight for <h6>. |
| `--sf-h6-letter-spacing` | PUBLIC | consumption | h6 | `var(--sf-tracking-wide)` | Letter-spacing for <h6>. |
| `--sf-h6-line-height` | PUBLIC | consumption | h6 | `var(--sf-leading-normal)` | Line height for <h6>. |
| `--sf-h6-max-width` | PUBLIC | knob | h6 | `none` | Max-inline-size cap for <h6>. Default none. |
| `--sf-h6-size` | PUBLIC | consumption | h6 | `var(--sf-text-m)` | Font size for <h6>. |
| `--sf-header-height` | PUBLIC | consumption | header | `clamp( var(--sf-header-height-mobile), calc((var(--sf-header-height-desktop) - var(--sf-header-height-mobile)) / ((var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * 1rem) * (100vw - var(--sf-fluid-min-vw) * 1rem) + var(--sf-header-height-mobile)), var(--sf-header-height-desktop))` | Total height of the sticky page header. Used by --sf-sticky-offset to prevent content from hiding under it. |
| `--sf-header-height-desktop` | PUBLIC | knob | header | `5rem` | Header height at desktop breakpoints. |
| `--sf-header-height-mobile` | PUBLIC | knob | header | `3.5rem` | Header height at mobile breakpoints. |
| `--sf-heading-color` | PUBLIC | consumption | heading | `var(--sf-color-heading)` | Text color for all headings (h1–h6). Alias of --sf-color-heading. |
| `--sf-heading-font-family` | PUBLIC | consumption | heading | `var(--sf-font-heading)` | Font family for all headings. Alias of --sf-font-heading. |
| `--sf-heading-text-wrap` | PUBLIC | knob | heading | `balance` | text-wrap for headings. 'balance' prevents orphaned short last lines in multi-line headings. |
| `--sf-icon-2xl` | PUBLIC | knob | icon | `4em` | 2× large icon size (~40px+). Hero or onboarding icons. |
| `--sf-icon-l` | PUBLIC | knob | icon | `2em` | Large icon size (~24px). Standalone icon buttons. |
| `--sf-icon-m` | PUBLIC | knob | icon | `1.5em` | Medium icon size (~20px). Default for inline and button icons. |
| `--sf-icon-s` | PUBLIC | knob | icon | `1em` | Small icon size (~16px). Dense UI chrome. |
| `--sf-icon-xl` | PUBLIC | knob | icon | `3em` | Extra-large icon size (~32px). Feature icons. |
| `--sf-icon-xs` | PUBLIC | knob | icon | `0.875em` | Extra-small icon size (~12px). Inline indicators. |
| `--sf-is-active` | PUBLIC-ADVANCED | knob | is | `0` | Integer state flag for the active state. Set to 1 (via JS or .is-active) to drive branching calc() expressions. 0 = default (inactive). |
| `--sf-is-current` | PUBLIC-ADVANCED | knob | is | `0` | Integer state flag for the current/selected state. Set to 1 (via .is-current) to drive branching calc() expressions. 0 = default. |
| `--sf-is-dark` | INTERNAL | knob | is | `0` | Mode flag — 0 in light mode, 1 in dark mode. Set automatically by [data-theme='dark'] and prefers-color-scheme. Drives dark-mode formula branches in calc(). |
| `--sf-is-open` | PUBLIC-ADVANCED | knob | is | `0` | Integer state flag for the open/expanded state. Set to 1 (via .is-open) to drive branching calc() expressions. 0 = default (closed). |
| `--sf-is-pressed` | PUBLIC-ADVANCED | knob | is | `0` | Integer state flag for the pressed state. Set to 1 (via .is-pressed) to drive branching calc() expressions. 0 = default. |
| `--sf-leading-normal` | PUBLIC | knob | leading | `1.5` | Normal line height (~1.5). Default for body text. |
| `--sf-leading-relaxed` | PUBLIC | knob | leading | `1.625` | Relaxed line height (~1.65). Long-form reading text. |
| `--sf-leading-snug` | PUBLIC | knob | leading | `1.3` | Snug line height (~1.35). Use for sub-headings. |
| `--sf-leading-taper` | PUBLIC-ADVANCED | knob | leading | `0` | Progressive leading tightener: each step up the type scale subtracts step-index × taper from its per-size line-height token. Default 0 keeps the curated defaults. |
| `--sf-leading-tight` | PUBLIC | knob | leading | `1.1` | Tight line height (~1.2). Use for large display headings. |
| `--sf-link-external-marker` | PUBLIC | knob | link | `" \\2197"` | CSS content value appended to external links (e.g. " ↗"). Used by the .external-link pseudo-element pattern. |
| `--sf-link-underline-offset` | PUBLIC | knob | link | `0.15em` | Vertical offset of the link underline from the text baseline. |
| `--sf-link-underline-thickness` | PUBLIC | knob | link | `auto` | Stroke width of the link underline. |
| `--sf-lumlocker` | PUBLIC-ADVANCED | knob | lumlocker | `0.65` | OKLCH lightness lock value. When :root has [data-lumlocker], brand colors (primary, secondary, action, base) are remapped to this L so their contrast remains constant as hues shift. |
| `--sf-mask-scrim-end` | PUBLIC-ADVANCED | consumption | mask | `var(--sf-space-l)` | End stop for edge-fade mask gradients. Mirrors --sf-mask-scrim-start for the trailing edge of a scroll container. |
| `--sf-mask-scrim-start` | PUBLIC-ADVANCED | consumption | mask | `var(--sf-space-l)` | Start stop for edge-fade mask gradients on scroll reels / overflow containers. Use in mask-image: linear-gradient(..., transparent var(--sf-mask-scrim-start)) to fade content near the leading edge. |
| `--sf-motion-scale` | PUBLIC-ADVANCED | knob | motion | `1` | Global motion multiplier. All transition and animation durations multiply by this factor. Set to 0 to disable all motion; reduce below 1 for snappier feel. |
| `--sf-object-fit` | PUBLIC | knob | object | `cover` | Default object-fit value for replaced elements (img, video). |
| `--sf-object-position` | PUBLIC | knob | object | `50% 50%` | Default object-position for replaced elements. |
| `--sf-opacity-disabled` | PUBLIC | knob | opacity | `0.45` | Opacity for disabled UI elements (typically 0.4–0.5). |
| `--sf-opacity-muted` | PUBLIC | knob | opacity | `0.5` | General de-emphasis opacity for secondary content, ghost elements, or non-primary layers. Default 0.5. |
| `--sf-optical-sizing` | PUBLIC-ADVANCED | knob | optical | `auto` | CSS font-optical-sizing value. 'auto' lets the browser optimize letterforms for the rendered size. Set 'none' to disable optical sizing. |
| `--sf-print-base-size` | PUBLIC-ADVANCED | knob | print | `11pt` | Base font size for @media print stylesheets. Default 11pt. Override on :root to adjust printed body text size. |
| `--sf-print-page-margin` | PUBLIC-ADVANCED | knob | print | `2cm` | Page margin for printed output. Default 2cm. Maps to @page margin. |
| `--sf-print-page-size` | PUBLIC-ADVANCED | knob | print | `a4` | Target paper size for printing. Default 'a4'. Maps to @page size. Common values: a4, letter, legal. |
| `--sf-radius-2xl` | PUBLIC | consumption | radius | `calc(24px * var(--sf-radius-scale))` | 2× large radius (~20px). Rounded card variants. |
| `--sf-radius-2xs` | PUBLIC | consumption | radius | `calc(1px * var(--sf-radius-scale))` | Extra-extra-small radius (~1px). Minimal rounding for very tight UI elements. |
| `--sf-radius-3xl` | PUBLIC | consumption | radius | `calc(32px * var(--sf-radius-scale))` | 3× large radius (~24px). Large rounded surfaces. |
| `--sf-radius-4xl` | PUBLIC | consumption | radius | `calc(48px * var(--sf-radius-scale))` | 4× large radius (~32px). Near-pill rounding. |
| `--sf-radius-full` | PUBLIC | knob | radius | `9999px` | Full rounding (50%). For circular elements like avatars. |
| `--sf-radius-l` | PUBLIC | consumption | radius | `calc(12px * var(--sf-radius-scale))` | Large radius (~12px). Modals, popovers, panels. |
| `--sf-radius-m` | PUBLIC | consumption | radius | `calc(8px * var(--sf-radius-scale))` | Medium radius (~6–8px). Default — inputs, standard buttons, cards. |
| `--sf-radius-none` | PUBLIC | knob | radius | `0` | Zero border radius — square corners. |
| `--sf-radius-outer` | PUBLIC-ADVANCED | consumption | radius | `calc(var(--sf-radius-m) + var(--sf-component-pad))` | Concentric corner helper: outer radius for a container that wraps content with inner radius of --sf-radius-m. Computed as --sf-radius-m + --sf-component-pad so corners align visually. |
| `--sf-radius-pill` | PUBLIC | consumption | radius | `var(--sf-radius-full)` | Pill rounding (9999px). Tags, toggle pills, status badges. |
| `--sf-radius-s` | PUBLIC | consumption | radius | `calc(4px * var(--sf-radius-scale))` | Small radius (~4px). Badges, chips, small buttons. |
| `--sf-radius-scale` | PUBLIC-ADVANCED | knob | radius | `1` | Global border-radius multiplier. Scales the entire radius ramp up (>1) or down (<1) from one knob. Set to 0 for sharp corners everywhere. |
| `--sf-radius-xl` | PUBLIC | consumption | radius | `calc(16px * var(--sf-radius-scale))` | Extra-large radius (~16px). Prominent cards and feature blocks. |
| `--sf-radius-xs` | PUBLIC | consumption | radius | `calc(2px * var(--sf-radius-scale))` | Hairline radius (~2px). Subtle rounding for tight components. |
| `--sf-ratio-3-2` | PUBLIC | knob | ratio | `3 / 2` | 3:2 aspect ratio. Common for landscape photography. |
| `--sf-ratio-4-3` | PUBLIC | knob | ratio | `4 / 3` | 4:3 aspect ratio. Classic screen ratio. |
| `--sf-ratio-cinema` | PUBLIC | knob | ratio | `21 / 9` | 2.39:1 cinematic widescreen aspect ratio. |
| `--sf-ratio-golden` | PUBLIC | knob | ratio | `1.618 / 1` | 1.618:1 golden ratio. Harmonious proportions. |
| `--sf-ratio-portrait` | PUBLIC | knob | ratio | `3 / 4` | 2:3 portrait aspect ratio. |
| `--sf-ratio-square` | PUBLIC | knob | ratio | `1` | 1:1 square aspect ratio. Use for avatars, icon containers, and square thumbnails. |
| `--sf-ratio-video` | PUBLIC | knob | ratio | `16 / 9` | 16:9 widescreen video aspect ratio. Use for video embeds and video-thumbnail containers. |
| `--sf-safe-bottom` | PUBLIC-ADVANCED | knob | safe | `env(safe-area-inset-bottom, 0px)` | Device safe-area inset at the bottom edge (home indicator, gesture bar). Resolves to env(safe-area-inset-bottom, 0px). Use for fixed footers. |
| `--sf-safe-left` | PUBLIC-ADVANCED | knob | safe | `env(safe-area-inset-left, 0px)` | Device safe-area inset at the left edge. Resolves to env(safe-area-inset-left, 0px). |
| `--sf-safe-right` | PUBLIC-ADVANCED | knob | safe | `env(safe-area-inset-right, 0px)` | Device safe-area inset at the right edge (rounded corners, home indicator). Resolves to env(safe-area-inset-right, 0px). |
| `--sf-safe-top` | PUBLIC-ADVANCED | knob | safe | `env(safe-area-inset-top, 0px)` | Device safe-area inset at the top edge (notch, Dynamic Island). Resolves to env(safe-area-inset-top, 0px). Use for fixed headers on notched devices. |
| `--sf-scroll-timeline-range-end` | PUBLIC-ADVANCED | knob | scroll | `cover 30%` | animation-range end value for scroll-driven entrance effects. Default 'cover 30%'. Override on an element to control when its entrance animation finishes. |
| `--sf-scroll-timeline-range-start` | PUBLIC-ADVANCED | knob | scroll | `entry 0%` | animation-range start value for scroll-driven entrance effects. Default 'entry 0%'. Override on an element to control when its entrance animation begins. |
| `--sf-scrollbar-thumb` | PUBLIC | consumption | scrollbar | `var(--sf-color-neutral)` | Color of the custom scrollbar thumb. |
| `--sf-scrollbar-track` | PUBLIC | knob | scrollbar | `transparent` | Color of the custom scrollbar track. |
| `--sf-section-pad` | PUBLIC | consumption | section | `var(--sf-section-pad--m)` | Default vertical padding for full-width page sections. |
| `--sf-section-pad--2xl` | PUBLIC | consumption | section | `calc(var(--sf-space-4xl) * 2 * var(--sf-section-scale))` | 2× large section vertical padding for hero areas. |
| `--sf-section-pad--l` | PUBLIC | consumption | section | `calc(var(--sf-space-4xl) * var(--sf-section-scale))` | Large section vertical padding. |
| `--sf-section-pad--m` | PUBLIC | consumption | section | `calc(var(--sf-space-3xl) * var(--sf-section-scale))` | Medium section vertical padding. |
| `--sf-section-pad--s` | PUBLIC | consumption | section | `calc(var(--sf-space-2xl) * var(--sf-section-scale))` | Small section vertical padding. |
| `--sf-section-pad--xl` | PUBLIC | consumption | section | `calc(var(--sf-space-4xl) * 1.5 * var(--sf-section-scale))` | Extra-large vertical section padding for hero and feature sections. |
| `--sf-section-pad--xs` | PUBLIC | consumption | section | `calc(var(--sf-space-xl) * var(--sf-section-scale))` | Extra-small vertical section padding for compact in-page modules. |
| `--sf-section-scale` | PUBLIC-ADVANCED | knob | section | `1` | Global multiplier applied to every --sf-section-pad--* size — one dial re-rhythms all section padding (default 1). |
| `--sf-shadow-2xl` | PUBLIC | consumption | shadow | `0 4px 12px 0 oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 0.6), 0.7)), 0 20px 60px 0 oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 4), 0.7)), 0 40px 100px -8px oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 5), 0.7))` | Largest shadow for hero cards, feature highlights, and marketing surfaces. |
| `--sf-shadow-color` | PUBLIC-ADVANCED | consumption | shadow | `oklch(from var(--sf-color-neutral) var(--sf-shadow-lightness) c h)` | Near-black shadow tint derived from the neutral palette. Inherits the neutral's chroma and hue so colorless neutrals produce colorless shadows. |
| `--sf-shadow-glow` | PUBLIC | consumption | shadow | `0 0 15px 2px oklch(from var(--sf-shadow-glow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 2), 0.7))` | Glow box-shadow shorthand for decorative glow effects. |
| `--sf-shadow-glow-color` | PUBLIC-ADVANCED | consumption | shadow | `var(--sf-color-primary)` | Ambient glow tint used by --sf-shadow-glow. Override to retint all glow shadows; opacity and dark-mode boost are controlled by --sf-shadow-strength. |
| `--sf-shadow-inner` | PUBLIC | consumption | shadow | `inset 0 2px 4px 0 oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 2), 0.7))` | Inset shadow for pressed states, inset inputs, and recessed surfaces. |
| `--sf-shadow-l` | PUBLIC | consumption | shadow | `0 2px 4px 0 oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 0.5), 0.7)), 0 8px 24px 0 oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 3), 0.7)), 0 16px 48px 0 oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 2), 0.7))` | Large shadow for drawers, sidebars, and prominent elevated surfaces. |
| `--sf-shadow-lightness` | PUBLIC | knob | shadow | `0.15` | OKLCH lightness component of the shadow color. Lower = denser-looking shadows. Tune this independently of --sf-shadow-strength to control tonal weight without affecting opacity. |
| `--sf-shadow-m` | PUBLIC | consumption | shadow | `0 1px 3px 0 oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 0.5), 0.7)), 0 4px 12px 0 oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 2), 0.7))` | Medium shadow for cards and content panels. |
| `--sf-shadow-none` | PUBLIC | knob | shadow | `none` | No box-shadow (resets inherited shadows). Use to explicitly remove elevation. |
| `--sf-shadow-s` | PUBLIC | consumption | shadow | `0 1px 2px 0 oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 0.5), 0.7)), 0 2px 6px 0 oklch(from var(--sf-shadow-color) l c h / clamp(0, var(--sf-shadow-strength), 0.7))` | Small shadow for chips, tags, and inline elevated surfaces. |
| `--sf-shadow-strength` | PUBLIC-ADVANCED | knob | shadow | `calc(0.08 + var(--sf-is-dark) * 0.17)` | Base opacity for the entire shadow ramp. Auto-boosted in dark mode via --sf-is-dark. Override with calc() to preserve the adaptation: e.g. calc(0.12 + var(--sf-is-dark) * 0.17). |
| `--sf-shadow-xl` | PUBLIC | consumption | shadow | `0 2px 8px 0 oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 0.5), 0.7)), 0 12px 36px 0 oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 3.5), 0.7)), 0 24px 72px 0 oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 2.5), 0.7))` | Extra-large shadow for modals, dialogs, and high-elevation sheets. |
| `--sf-shadow-xs` | PUBLIC | consumption | shadow | `0 1px 2px 0 oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 0.5), 0.7))` | Extra-small shadow for barely-elevated elements (focused inputs, small chips). |
| `--sf-size-l` | PUBLIC | knob | size | `2.75rem` | Large UI component height (~44px). Touch-friendly interactive elements. |
| `--sf-size-m` | PUBLIC | knob | size | `2.5rem` | Medium UI component height (~36px). Default size for buttons and inputs. |
| `--sf-size-s` | PUBLIC | knob | size | `2rem` | Small UI component height (~28px). Compact buttons and input variants. |
| `--sf-size-xl` | PUBLIC | knob | size | `3.5rem` | Extra-large interactive component height (~52px). For oversized or prominently touch-friendly controls. |
| `--sf-size-xs` | PUBLIC | knob | size | `1.5rem` | Extra-small interactive component height (~24px). For very compact inline elements and micro-controls. |
| `--sf-space-2xl` | PUBLIC | consumption | space | `calc(clamp(calc(var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), 3) * 1rem), calc((var(--sf-space-base-max) * pow(var(--sf-space-ratio-max), 3) - var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), 3)) / (var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * (100vw - var(--sf-fluid-min-vw) * 1rem) + var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), 3) * 1rem), calc(var(--sf-space-base-max) * pow(var(--sf-space-ratio-max), 3) * 1rem)) * var(--sf-space-scale))` | 48px-equivalent spacing. Large section spacing. |
| `--sf-space-2xs` | PUBLIC | consumption | space | `calc(clamp(calc(var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), -3) * 1rem), calc((var(--sf-space-base-max) * pow(var(--sf-space-ratio-max), -3) - var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), -3)) / (var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * (100vw - var(--sf-fluid-min-vw) * 1rem) + var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), -3) * 1rem), calc(var(--sf-space-base-max) * pow(var(--sf-space-ratio-max), -3) * 1rem)) * var(--sf-space-scale))` | 4px-equivalent spacing. Tight inline gaps, icon-to-text padding. |
| `--sf-space-3xl` | PUBLIC | consumption | space | `calc(clamp(calc(var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), 4) * 1rem), calc((var(--sf-space-base-max) * pow(var(--sf-space-ratio-max), 4) - var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), 4)) / (var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * (100vw - var(--sf-fluid-min-vw) * 1rem) + var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), 4) * 1rem), calc(var(--sf-space-base-max) * pow(var(--sf-space-ratio-max), 4) * 1rem)) * var(--sf-space-scale))` | 64px-equivalent spacing. Extra-large layout gaps. |
| `--sf-space-4xl` | PUBLIC | consumption | space | `calc(clamp(calc(var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), 5) * 1rem), calc((var(--sf-space-base-max) * pow(var(--sf-space-ratio-max), 5) - var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), 5)) / (var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * (100vw - var(--sf-fluid-min-vw) * 1rem) + var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), 5) * 1rem), calc(var(--sf-space-base-max) * pow(var(--sf-space-ratio-max), 5) * 1rem)) * var(--sf-space-scale))` | 96px-equivalent spacing. Hero / page-level section padding. |
| `--sf-space-base-max` | PUBLIC-ADVANCED | knob | space | `2` | Maximum base spacing unit (rem) at the widest viewport. Drives the top of the fluid spacing ramp. Part of the fluid scale engine. |
| `--sf-space-base-min` | PUBLIC-ADVANCED | knob | space | `1` | Minimum base spacing unit (rem) at the narrowest viewport. Drives the bottom of the fluid spacing ramp. Part of the fluid scale engine. |
| `--sf-space-l` | PUBLIC | consumption | space | `calc(clamp(calc(var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), 1) * 1rem), calc((var(--sf-space-base-max) * pow(var(--sf-space-ratio-max), 1) - var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), 1)) / (var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * (100vw - var(--sf-fluid-min-vw) * 1rem) + var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), 1) * 1rem), calc(var(--sf-space-base-max) * pow(var(--sf-space-ratio-max), 1) * 1rem)) * var(--sf-space-scale))` | 24px-equivalent spacing. Card padding, section dividers. |
| `--sf-space-m` | PUBLIC | consumption | space | `calc(clamp(calc(var(--sf-space-base-min) * 1rem), calc((var(--sf-space-base-max) - var(--sf-space-base-min)) / (var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * (100vw - var(--sf-fluid-min-vw) * 1rem) + var(--sf-space-base-min) * 1rem), calc(var(--sf-space-base-max) * 1rem)) * var(--sf-space-scale))` | 16px-equivalent spacing. Default unit, widely applicable. |
| `--sf-space-none` | PUBLIC | knob | space | `0` | Zero spacing. Explicit alias for clarity in utility classes. |
| `--sf-space-px` | PUBLIC | knob | space | `1px` | 1px spacing. Hairline offset for fine adjustments. |
| `--sf-space-ratio-max` | PUBLIC-ADVANCED | knob | space | `1.333` | Modular spacing ratio at the widest viewport. Controls step-to-step growth in the spacing ramp. Default 1.333 (perfect fourth). Part of the fluid scale engine. |
| `--sf-space-ratio-min` | PUBLIC-ADVANCED | knob | space | `1.25` | Modular spacing ratio at the narrowest viewport. Controls step-to-step growth in the spacing ramp. Default 1.25 (major third). Part of the fluid scale engine. |
| `--sf-space-s` | PUBLIC | consumption | space | `calc(clamp(calc(var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), -1) * 1rem), calc((var(--sf-space-base-max) * pow(var(--sf-space-ratio-max), -1) - var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), -1)) / (var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * (100vw - var(--sf-fluid-min-vw) * 1rem) + var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), -1) * 1rem), calc(var(--sf-space-base-max) * pow(var(--sf-space-ratio-max), -1) * 1rem)) * var(--sf-space-scale))` | 12px-equivalent spacing. Form field inner padding, narrow gaps. |
| `--sf-space-scale` | PUBLIC-ADVANCED | knob | space | `1` | Global spacing multiplier. Scales the fluid spacing ramp. Increase above 1 for airier layouts; reduce below 1 for compact UIs. |
| `--sf-space-xl` | PUBLIC | consumption | space | `calc(clamp(calc(var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), 2) * 1rem), calc((var(--sf-space-base-max) * pow(var(--sf-space-ratio-max), 2) - var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), 2)) / (var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * (100vw - var(--sf-fluid-min-vw) * 1rem) + var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), 2) * 1rem), calc(var(--sf-space-base-max) * pow(var(--sf-space-ratio-max), 2) * 1rem)) * var(--sf-space-scale))` | 32px-equivalent spacing. Feature row gaps, generous section padding. |
| `--sf-space-xs` | PUBLIC | consumption | space | `calc(clamp(calc(var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), -2) * 1rem), calc((var(--sf-space-base-max) * pow(var(--sf-space-ratio-max), -2) - var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), -2)) / (var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * (100vw - var(--sf-fluid-min-vw) * 1rem) + var(--sf-space-base-min) * pow(var(--sf-space-ratio-min), -2) * 1rem), calc(var(--sf-space-base-max) * pow(var(--sf-space-ratio-max), -2) * 1rem)) * var(--sf-space-scale))` | 8px-equivalent spacing. Compact list rows, tab padding. |
| `--sf-state-pending-opacity` | PUBLIC | knob | state | `0.7` | Opacity for pending / loading state elements. |
| `--sf-sticky-offset` | PUBLIC | consumption | sticky | `clamp( var(--sf-sticky-offset-mobile), calc((var(--sf-sticky-offset-desktop) - var(--sf-sticky-offset-mobile)) / ((var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * 1rem) * (100vw - var(--sf-fluid-min-vw) * 1rem) + var(--sf-sticky-offset-mobile)), var(--sf-sticky-offset-desktop))` | top offset for position: sticky elements, accounting for the header height. |
| `--sf-sticky-offset-desktop` | PUBLIC | consumption | sticky | `var(--sf-header-height-desktop)` | Sticky offset at desktop breakpoints. |
| `--sf-sticky-offset-mobile` | PUBLIC | consumption | sticky | `var(--sf-header-height-mobile)` | Sticky offset at mobile breakpoints. |
| `--sf-text-2xl` | PUBLIC | consumption | text | `calc(clamp(calc(var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), 3) * 1rem), calc((var(--sf-text-base-max) * pow(var(--sf-text-ratio-max), 3) - var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), 3)) / (var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * (100vw - var(--sf-fluid-min-vw) * 1rem) + var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), 3) * 1rem), calc(var(--sf-text-base-max) * pow(var(--sf-text-ratio-max), 3) * 1rem)) * var(--sf-text-scale))` | 2× large font size (~24px). Section headings. |
| `--sf-text-2xl-font-weight` | PUBLIC | consumption | text | `var(--sf-font-weight-heading)` | Font weight for 2×-large text. |
| `--sf-text-2xl-letter-spacing` | PUBLIC | consumption | text | `var(--sf-tracking-normal)` | Letter-spacing for 2×-large text. |
| `--sf-text-2xl-line-height` | PUBLIC | consumption | text | `calc(var(--sf-leading-snug) - 6 * var(--sf-leading-taper))` | Line height for 2×-large text. |
| `--sf-text-2xl-max-width` | PUBLIC | knob | text | `none` | Optimal line length for 2×-large text. |
| `--sf-text-2xs` | PUBLIC | consumption | text | `calc(clamp(calc(var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), -3) * 1rem), calc((var(--sf-text-base-max) * pow(var(--sf-text-ratio-max), -3) - var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), -3)) / (var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * (100vw - var(--sf-fluid-min-vw) * 1rem) + var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), -3) * 1rem), calc(var(--sf-text-base-max) * pow(var(--sf-text-ratio-max), -3) * 1rem)) * var(--sf-text-scale))` | Extra-extra-small font size (~11px). Fine print, badges. |
| `--sf-text-2xs-font-weight` | PUBLIC | consumption | text | `var(--sf-font-weight-body)` | Font weight for 2×-extra-small text. Override to deviate from the global weight at this size. |
| `--sf-text-2xs-letter-spacing` | PUBLIC | consumption | text | `var(--sf-tracking-normal)` | Letter-spacing for 2×-extra-small text. |
| `--sf-text-2xs-line-height` | PUBLIC | consumption | text | `var(--sf-leading-relaxed)` | Line height for 2×-extra-small text. |
| `--sf-text-2xs-max-width` | PUBLIC | knob | text | `55ch` | Optimal line length (max-width in ch) for 2×-extra-small text. |
| `--sf-text-3xl` | PUBLIC | consumption | text | `calc(clamp(calc(var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), 4) * 1rem), calc((var(--sf-text-base-max) * pow(var(--sf-text-ratio-max), 4) - var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), 4)) / (var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * (100vw - var(--sf-fluid-min-vw) * 1rem) + var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), 4) * 1rem), calc(var(--sf-text-base-max) * pow(var(--sf-text-ratio-max), 4) * 1rem)) * var(--sf-text-scale))` | 3× large font size (~30px). Major headings. |
| `--sf-text-3xl-font-weight` | PUBLIC | consumption | text | `var(--sf-font-weight-heading)` | Font weight for 3×-large text. |
| `--sf-text-3xl-letter-spacing` | PUBLIC | consumption | text | `var(--sf-tracking-tight)` | Letter-spacing for 3×-large text. Typically negative to tighten large headings. |
| `--sf-text-3xl-line-height` | PUBLIC | consumption | text | `calc(var(--sf-leading-tight) - 7 * var(--sf-leading-taper))` | Line height for 3×-large text. |
| `--sf-text-3xl-max-width` | PUBLIC | knob | text | `none` | Optimal line length for 3×-large text. |
| `--sf-text-4xl` | PUBLIC | consumption | text | `calc(clamp(calc(var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), 5) * 1rem), calc((var(--sf-text-base-max) * pow(var(--sf-text-ratio-max), 5) - var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), 5)) / (var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * (100vw - var(--sf-fluid-min-vw) * 1rem) + var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), 5) * 1rem), calc(var(--sf-text-base-max) * pow(var(--sf-text-ratio-max), 5) * 1rem)) * var(--sf-text-scale))` | 4× large font size (~36px). Display-level headings. |
| `--sf-text-4xl-font-weight` | PUBLIC | consumption | text | `var(--sf-font-weight-heading)` | Font weight for 4×-large text. |
| `--sf-text-4xl-letter-spacing` | PUBLIC | consumption | text | `var(--sf-tracking-tight)` | Letter-spacing for 4×-large text. |
| `--sf-text-4xl-line-height` | PUBLIC | consumption | text | `calc(var(--sf-leading-tight) - 8 * var(--sf-leading-taper))` | Line height for 4×-large text. |
| `--sf-text-4xl-max-width` | PUBLIC | knob | text | `none` | Optimal line length for 4×-large text. |
| `--sf-text-base-max` | PUBLIC-ADVANCED | knob | text | `1.25` | Maximum base font size (rem) at the widest viewport. End point for the fluid type scale at wide screens. Part of the fluid scale engine. |
| `--sf-text-base-min` | PUBLIC-ADVANCED | knob | text | `1` | Minimum base font size (rem) at the narrowest viewport. Starting point for the fluid type scale at narrow screens. Part of the fluid scale engine. |
| `--sf-text-display-base-max` | PUBLIC-ADVANCED | knob | text | `3` | Maximum display/hero font size (rem) at the widest viewport. Drives the ceiling of the fluid display type scale. Part of the fluid scale engine. |
| `--sf-text-display-base-min` | PUBLIC-ADVANCED | knob | text | `2.4` | Minimum display/hero font size (rem) at the narrowest viewport. Drives the floor of the fluid display type scale. Part of the fluid scale engine. |
| `--sf-text-display-l` | PUBLIC | consumption | text | `calc(clamp(calc(var(--sf-text-display-base-min) * pow(var(--sf-text-ratio-min), 2) * 1rem), calc((var(--sf-text-display-base-max) * pow(var(--sf-text-ratio-max), 2) - var(--sf-text-display-base-min) * pow(var(--sf-text-ratio-min), 2)) / (var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * (100vw - var(--sf-fluid-min-vw) * 1rem) + var(--sf-text-display-base-min) * pow(var(--sf-text-ratio-min), 2) * 1rem), calc(var(--sf-text-display-base-max) * pow(var(--sf-text-ratio-max), 2) * 1rem)) * var(--sf-text-display-scale))` | Large display font size (~68px+). Oversized hero text. |
| `--sf-text-display-m` | PUBLIC | consumption | text | `calc(clamp(calc(var(--sf-text-display-base-min) * pow(var(--sf-text-ratio-min), 1) * 1rem), calc((var(--sf-text-display-base-max) * pow(var(--sf-text-ratio-max), 1) - var(--sf-text-display-base-min) * pow(var(--sf-text-ratio-min), 1)) / (var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * (100vw - var(--sf-fluid-min-vw) * 1rem) + var(--sf-text-display-base-min) * pow(var(--sf-text-ratio-min), 1) * 1rem), calc(var(--sf-text-display-base-max) * pow(var(--sf-text-ratio-max), 1) * 1rem)) * var(--sf-text-display-scale))` | Medium display font size (~54px). Hero headings. |
| `--sf-text-display-s` | PUBLIC | consumption | text | `calc(clamp(calc(var(--sf-text-display-base-min) * 1rem), calc((var(--sf-text-display-base-max) - var(--sf-text-display-base-min)) / (var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * (100vw - var(--sf-fluid-min-vw) * 1rem) + var(--sf-text-display-base-min) * 1rem), calc(var(--sf-text-display-base-max) * 1rem)) * var(--sf-text-display-scale))` | Small display font size (~42px). Hero sub-headings. |
| `--sf-text-display-scale` | PUBLIC-ADVANCED | knob | text | `1` | Multiplier applied only to the display/hero type scale (--sf-text-display-*). Tune headline impact independently of body text. |
| `--sf-text-l` | PUBLIC | consumption | text | `calc(clamp(calc(var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), 1) * 1rem), calc((var(--sf-text-base-max) * pow(var(--sf-text-ratio-max), 1) - var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), 1)) / (var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * (100vw - var(--sf-fluid-min-vw) * 1rem) + var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), 1) * 1rem), calc(var(--sf-text-base-max) * pow(var(--sf-text-ratio-max), 1) * 1rem)) * var(--sf-text-scale))` | Large font size (~18px). Lead paragraphs, prominent labels. |
| `--sf-text-l-font-weight` | PUBLIC | consumption | text | `var(--sf-font-weight-body)` | Font weight for large text. |
| `--sf-text-l-letter-spacing` | PUBLIC | consumption | text | `var(--sf-tracking-normal)` | Letter-spacing for large text. |
| `--sf-text-l-line-height` | PUBLIC | consumption | text | `calc(var(--sf-leading-normal) - 4 * var(--sf-leading-taper))` | Line height for large text. |
| `--sf-text-l-max-width` | PUBLIC | knob | text | `none` | Optimal line length for large text. |
| `--sf-text-m` | PUBLIC | consumption | text | `calc(clamp(calc(var(--sf-text-base-min) * 1rem), calc((var(--sf-text-base-max) - var(--sf-text-base-min)) / (var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * (100vw - var(--sf-fluid-min-vw) * 1rem) + var(--sf-text-base-min) * 1rem), calc(var(--sf-text-base-max) * 1rem)) * var(--sf-text-scale))` | Medium / base font size (~16px). Typical body text. |
| `--sf-text-m-font-weight` | PUBLIC | consumption | text | `var(--sf-font-weight-body)` | Font weight for medium (body) text. |
| `--sf-text-m-letter-spacing` | PUBLIC | consumption | text | `var(--sf-tracking-normal)` | Letter-spacing for medium text. |
| `--sf-text-m-line-height` | PUBLIC | consumption | text | `calc(var(--sf-leading-normal) - 3 * var(--sf-leading-taper))` | Line height for medium text. |
| `--sf-text-m-max-width` | PUBLIC | knob | text | `65ch` | Optimal reading line length for medium text (~65–75ch). |
| `--sf-text-ratio-max` | PUBLIC-ADVANCED | knob | text | `1.333` | Modular type scale ratio at the widest viewport. Controls step-to-step size growth. Default 1.333. Part of the fluid scale engine. |
| `--sf-text-ratio-min` | PUBLIC-ADVANCED | knob | text | `1.25` | Modular type scale ratio at the narrowest viewport. Controls step-to-step size growth in the fluid type ramp. Default 1.25. Part of the fluid scale engine. |
| `--sf-text-s` | PUBLIC | consumption | text | `calc(clamp(calc(var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), -1) * 1rem), calc((var(--sf-text-base-max) * pow(var(--sf-text-ratio-max), -1) - var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), -1)) / (var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * (100vw - var(--sf-fluid-min-vw) * 1rem) + var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), -1) * 1rem), calc(var(--sf-text-base-max) * pow(var(--sf-text-ratio-max), -1) * 1rem)) * var(--sf-text-scale))` | Small font size (~14px). Secondary content, UI annotations. |
| `--sf-text-s-font-weight` | PUBLIC | consumption | text | `var(--sf-font-weight-body)` | Font weight for small text. |
| `--sf-text-s-letter-spacing` | PUBLIC | consumption | text | `var(--sf-tracking-normal)` | Letter-spacing for small text. |
| `--sf-text-s-line-height` | PUBLIC | consumption | text | `calc(var(--sf-leading-relaxed) - 2 * var(--sf-leading-taper))` | Line height for small text. |
| `--sf-text-s-max-width` | PUBLIC | knob | text | `65ch` | Optimal line length for small text. |
| `--sf-text-scale` | PUBLIC-ADVANCED | knob | text | `1` | Global type-size multiplier. Scales the entire fluid type scale. 1.08 gives noticeably larger body text without breaking layout. |
| `--sf-text-shadow-l` | PUBLIC | consumption | text | `0 4px 8px oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 2.5), 0.7))` | Large text-shadow for high-contrast text over busy or dark image backgrounds. |
| `--sf-text-shadow-m` | PUBLIC | consumption | text | `0 2px 4px oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 2), 0.7))` | Medium text-shadow. Use for text overlaid on images to improve legibility. |
| `--sf-text-shadow-none` | PUBLIC | knob | text | `none` | Removes text-shadow (use to explicitly reset inherited shadows). |
| `--sf-text-shadow-s` | PUBLIC | consumption | text | `0 1px 2px oklch(from var(--sf-shadow-color) l c h / clamp(0, calc(var(--sf-shadow-strength) * 1.5), 0.7))` | Small text-shadow for subtle depth on display headings. |
| `--sf-text-xl` | PUBLIC | consumption | text | `calc(clamp(calc(var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), 2) * 1rem), calc((var(--sf-text-base-max) * pow(var(--sf-text-ratio-max), 2) - var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), 2)) / (var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * (100vw - var(--sf-fluid-min-vw) * 1rem) + var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), 2) * 1rem), calc(var(--sf-text-base-max) * pow(var(--sf-text-ratio-max), 2) * 1rem)) * var(--sf-text-scale))` | Extra-large font size (~20px). Sub-headings, callout text. |
| `--sf-text-xl-font-weight` | PUBLIC | consumption | text | `var(--sf-font-weight-body)` | Font weight for extra-large text. |
| `--sf-text-xl-letter-spacing` | PUBLIC | consumption | text | `var(--sf-tracking-normal)` | Letter-spacing for extra-large text. |
| `--sf-text-xl-line-height` | PUBLIC | consumption | text | `calc(var(--sf-leading-snug) - 5 * var(--sf-leading-taper))` | Line height for extra-large text. |
| `--sf-text-xl-max-width` | PUBLIC | knob | text | `none` | Optimal line length for extra-large text. |
| `--sf-text-xs` | PUBLIC | consumption | text | `calc(clamp(calc(var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), -2) * 1rem), calc((var(--sf-text-base-max) * pow(var(--sf-text-ratio-max), -2) - var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), -2)) / (var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw)) * (100vw - var(--sf-fluid-min-vw) * 1rem) + var(--sf-text-base-min) * pow(var(--sf-text-ratio-min), -2) * 1rem), calc(var(--sf-text-base-max) * pow(var(--sf-text-ratio-max), -2) * 1rem)) * var(--sf-text-scale))` | Extra-small font size (~12px). Labels, captions, metadata. |
| `--sf-text-xs-font-weight` | PUBLIC | consumption | text | `var(--sf-font-weight-body)` | Font weight for extra-small text. |
| `--sf-text-xs-letter-spacing` | PUBLIC | consumption | text | `var(--sf-tracking-normal)` | Letter-spacing for extra-small text. |
| `--sf-text-xs-line-height` | PUBLIC | consumption | text | `calc(var(--sf-leading-relaxed) - 1 * var(--sf-leading-taper))` | Line height for extra-small text. |
| `--sf-text-xs-max-width` | PUBLIC | knob | text | `60ch` | Optimal line length for extra-small text. |
| `--sf-theme-transition-duration` | PUBLIC | consumption | theme | `calc(300ms * var(--sf-motion-scale))` | Duration of the .sf-theme-transition animated color-scheme crossfade. Scales with --sf-motion-scale so reduced-motion preferences are respected. Default 300ms. |
| `--sf-touch-target` | PUBLIC | consumption | touch | `var(--sf-size-l)` | Minimum touch-target size for interactive elements per WCAG 2.5.5. |
| `--sf-tracking-normal` | PUBLIC | knob | tracking | `0` | Normal letter-spacing (0). Default for body text. |
| `--sf-tracking-tight` | PUBLIC | knob | tracking | `-0.025em` | Tight letter-spacing (slightly negative). Suitable for large headings. |
| `--sf-tracking-wide` | PUBLIC | knob | tracking | `0.025em` | Wide letter-spacing. Use for small-caps labels. |
| `--sf-tracking-wider` | PUBLIC | knob | tracking | `0.05em` | Wider letter-spacing for strongly spaced labels. |
| `--sf-tracking-widest` | PUBLIC | knob | tracking | `0.1em` | Widest letter-spacing for all-caps microcopy. |
| `--sf-transition-colors` | PUBLIC | consumption | transition | `color var(--sf-duration-normal) var(--sf-ease-out), background-color var(--sf-duration-normal) var(--sf-ease-out), border-color var(--sf-duration-normal) var(--sf-ease-out), text-decoration-color var(--sf-duration-normal) var(--sf-ease-out), fill var(--sf-duration-normal) var(--sf-ease-out), stroke var(--sf-duration-normal) var(--sf-ease-out)` | Transition shorthand for color-related properties (color, background, border-color). |
| `--sf-transition-enter` | PUBLIC | consumption | transition | `color var(--sf-duration-normal) var(--sf-ease-out), background-color var(--sf-duration-normal) var(--sf-ease-out), border-color var(--sf-duration-normal) var(--sf-ease-out), box-shadow var(--sf-duration-normal) var(--sf-ease-out), opacity var(--sf-duration-normal) var(--sf-ease-out), transform var(--sf-duration-normal) var(--sf-ease-out), filter var(--sf-duration-normal) var(--sf-ease-out)` | Enter-phase transition (ease-out). Use on elements appearing in the viewport. |
| `--sf-transition-exit` | PUBLIC | consumption | transition | `color var(--sf-duration-fast) var(--sf-ease-in), background-color var(--sf-duration-fast) var(--sf-ease-in), border-color var(--sf-duration-fast) var(--sf-ease-in), box-shadow var(--sf-duration-fast) var(--sf-ease-in), opacity var(--sf-duration-fast) var(--sf-ease-in), transform var(--sf-duration-fast) var(--sf-ease-in), filter var(--sf-duration-fast) var(--sf-ease-in)` | Exit-phase transition (ease-in). Use on elements leaving the viewport. |
| `--sf-transition-fast` | PUBLIC | consumption | transition | `color var(--sf-duration-fast) var(--sf-ease-out), background-color var(--sf-duration-fast) var(--sf-ease-out), border-color var(--sf-duration-fast) var(--sf-ease-out), box-shadow var(--sf-duration-fast) var(--sf-ease-out), opacity var(--sf-duration-fast) var(--sf-ease-out), transform var(--sf-duration-fast) var(--sf-ease-out), filter var(--sf-duration-fast) var(--sf-ease-out)` | Fast-duration transition shorthand. |
| `--sf-transition-form-field` | PUBLIC | consumption | transition | `color var(--sf-duration-normal) var(--sf-ease-out), background-color var(--sf-duration-normal) var(--sf-ease-out), text-decoration-color var(--sf-duration-normal) var(--sf-ease-out), fill var(--sf-duration-normal) var(--sf-ease-out), stroke var(--sf-duration-normal) var(--sf-ease-out), border-color var(--sf-duration-fast) var(--sf-ease-out), box-shadow var(--sf-duration-fast) var(--sf-ease-out), opacity var(--sf-duration-fast) var(--sf-ease-out)` | Transition shorthand optimised for form fields: color and background at normal pace so label color shifts feel natural; border, shadow, and opacity at fast pace so focus rings appear crisply. |
| `--sf-transition-opacity` | PUBLIC | consumption | transition | `opacity var(--sf-duration-normal) var(--sf-ease-out)` | Transition shorthand for opacity. |
| `--sf-transition-overlay` | PUBLIC | consumption | transition | `overlay var(--sf-duration-normal) allow-discrete, display var(--sf-duration-normal) allow-discrete` | Transition shorthand for overlay fades (opacity + visibility). |
| `--sf-transition-shadow` | PUBLIC | consumption | transition | `box-shadow var(--sf-duration-normal) var(--sf-ease-out)` | Transition shorthand for box-shadow. |
| `--sf-transition-slow` | PUBLIC | consumption | transition | `color var(--sf-duration-slow) var(--sf-ease-in-out), background-color var(--sf-duration-slow) var(--sf-ease-in-out), border-color var(--sf-duration-slow) var(--sf-ease-in-out), box-shadow var(--sf-duration-slow) var(--sf-ease-in-out), opacity var(--sf-duration-slow) var(--sf-ease-in-out), transform var(--sf-duration-slow) var(--sf-ease-in-out), filter var(--sf-duration-slow) var(--sf-ease-in-out)` | Slow-duration transition shorthand. |
| `--sf-transition-transform` | PUBLIC | consumption | transition | `transform var(--sf-duration-normal) var(--sf-ease-out)` | Transition shorthand for transform. |
| `--sf-z-base` | PUBLIC | knob | z | `0` | Base stacking level (1). Establishes a stacking context without elevation. |
| `--sf-z-below` | PUBLIC | knob | z | `-1` | Z-index below stacking context base. For decorative pseudo-elements. |
| `--sf-z-dropdown` | PUBLIC | knob | z | `1020` | Z-index for dropdown menus and select popups. |
| `--sf-z-fixed` | PUBLIC | knob | z | `1010` | Z-index for position: fixed elements. |
| `--sf-z-modal` | PUBLIC | knob | z | `1040` | Z-index for modal dialogs and their non-top-layer backdrop scrims. Sits above overlays and dropdowns. Default 1040. |
| `--sf-z-overlay` | PUBLIC | knob | z | `1030` | Z-index for modal / dialog backdrops. |
| `--sf-z-raised` | PUBLIC | knob | z | `1` | Raised elevation (50). Cards, sticky headers. |
| `--sf-z-sticky` | PUBLIC | knob | z | `1000` | Z-index for position: sticky elements (navbars, table headers). |
| `--sf-z-toast` | PUBLIC | knob | z | `1050` | Z-index for toast / snackbar notifications. |
| `--sf-z-tooltip` | PUBLIC | knob | z | `1060` | Z-index for tooltips and transient floating notifications. Highest named layer in the z-index stack. Default 1060. |

### Layout tokens (49)

| Token | Tier | Role | Namespace | Default | Description |
|---|---|---|---|---|---|
| `--sf-alternate-gap` | PUBLIC | consumption | alternate | `var(--sf-content-gap)` | Gap between items in the alternating zigzag layout. |
| `--sf-alternate-inner-gap` | PUBLIC | consumption | alternate | `var(--sf-gap)` | Gap between content and media within each zigzag item. |
| `--sf-bento-cols-default` | PUBLIC | knob | bento | `4` | Default column count for the bento grid. |
| `--sf-bento-gap` | PUBLIC | consumption | bento | `var(--sf-gap)` | Gap between bento grid cells. |
| `--sf-bento-row-compact` | PUBLIC | knob | bento | `6rem` | Row height for compact-variant bento items. |
| `--sf-bento-row-default` | PUBLIC | knob | bento | `10rem` | Default row height for standard bento grid cells. |
| `--sf-bento-row-tall` | PUBLIC | knob | bento | `16rem` | Tall row height for visually prominent or hero bento cells. |
| `--sf-box-border-color` | PUBLIC | consumption | box | `var(--sf-color-border)` | Border color for the box layout primitive. |
| `--sf-box-border-width` | PUBLIC | knob | box | `0` | Border width for the box layout primitive. |
| `--sf-box-padding` | PUBLIC | consumption | box | `var(--sf-space-m)` | Inner padding for the box layout primitive. |
| `--sf-breakout-width` | PUBLIC | consumption | breakout | `var(--sf-container-wide)` | Width of full-bleed breakout elements inside a content grid. |
| `--sf-center-gutter` | PUBLIC | consumption | center | `var(--sf-gutter)` | Minimum side gutter for the center layout. |
| `--sf-center-max` | PUBLIC | consumption | center | `var(--sf-container-default)` | Maximum width for the center layout. |
| `--sf-cluster-align` | PUBLIC | knob | cluster | `center` | Vertical alignment of cluster items (align-items value). |
| `--sf-cluster-gap` | PUBLIC | consumption | cluster | `var(--sf-gap)` | Gap between wrapped inline items in the cluster layout. |
| `--sf-cluster-justify` | PUBLIC | knob | cluster | `flex-start` | Horizontal justification of the cluster (justify-content value). |
| `--sf-content-width` | PUBLIC | consumption | content | `var(--sf-container-default)` | Max-width of the main content column in a content grid. |
| `--sf-cover-min-height` | PUBLIC | knob | cover | `100dvh` | Minimum height of the cover layout (typically 100svh). |
| `--sf-cover-padding` | PUBLIC | consumption | cover | `var(--sf-section-pad)` | Inner padding for the cover layout. |
| `--sf-equal-gap` | PUBLIC | consumption | equal | `var(--sf-gap)` | Gap between equal columns. |
| `--sf-equal-min-col` | PUBLIC | knob | equal | `16rem` | Minimum column width for the default auto-fill equal-columns layout. Columns fill the row until this width is reached, then wrap to the next line. |
| `--sf-equal-min-col-2` | PUBLIC | knob | equal | `28rem` | Minimum column width for the 2-column equal preset. |
| `--sf-equal-min-col-3` | PUBLIC | knob | equal | `15rem` | Minimum column width for the 3-column equal preset. |
| `--sf-equal-min-col-4` | PUBLIC | knob | equal | `16rem` | Minimum column width for the 4-column equal preset. |
| `--sf-equal-min-col-6` | PUBLIC | knob | equal | `10rem` | Minimum column width for the 6-column equal preset. |
| `--sf-frame-ratio` | PUBLIC | knob | frame | `16 / 9` | Aspect ratio for the frame (media container) layout. |
| `--sf-grid-gap` | PUBLIC | consumption | grid | `var(--sf-gap)` | Gap between auto-fill grid cells. |
| `--sf-grid-min` | PUBLIC | knob | grid | `16rem` | Minimum column width for the auto-fill grid. |
| `--sf-grid-min-2xl` | PUBLIC | knob | grid | `28rem` | Minimum column width at the 2× breakpoint. |
| `--sf-grid-min-l` | PUBLIC | knob | grid | `20rem` | Large minimum column width for the auto-fill grid. |
| `--sf-grid-min-m` | PUBLIC | knob | grid | `16rem` | Medium minimum column width for the auto-fill grid. |
| `--sf-grid-min-s` | PUBLIC | knob | grid | `13rem` | Small minimum column width for the auto-fill grid. |
| `--sf-grid-min-xl` | PUBLIC | knob | grid | `24rem` | Extra-large minimum column width for the auto-fill grid. Use for wide content cards. |
| `--sf-grid-min-xs` | PUBLIC | knob | grid | `10rem` | Extra-small minimum column width for the auto-fill grid. Use for very compact tile layouts (icon grids). |
| `--sf-icon-box-bg` | PUBLIC | consumption | icon | `var(--sf-color-inset)` | Background color for boxed icon containers. |
| `--sf-icon-box-border` | PUBLIC | consumption | icon | `var(--sf-border-width-1) solid var(--sf-color-border)` | Border for boxed icon containers. |
| `--sf-icon-box-pad` | PUBLIC | knob | icon | `0.5em` | Padding inside boxed icon containers. |
| `--sf-icon-box-radius` | PUBLIC | consumption | icon | `var(--sf-radius-s)` | Border radius for boxed icon containers. |
| `--sf-imposter-margin` | PUBLIC | consumption | imposter | `var(--sf-space-m)` | Margin between the imposter overlay and the viewport edges. |
| `--sf-prose-paragraph` | PUBLIC | consumption | prose | `var(--sf-content-gap)` | Max width of prose paragraphs (layout token for the prose layout). |
| `--sf-reel-gap` | PUBLIC | consumption | reel | `var(--sf-gap)` | Gap between items in the horizontal reel. |
| `--sf-reel-height` | PUBLIC | knob | reel | `auto` | Fixed height of the reel container. |
| `--sf-reel-item-width` | PUBLIC | knob | reel | `max-content` | Width of each item in the reel. |
| `--sf-sidebar-gap` | PUBLIC | consumption | sidebar | `var(--sf-gap)` | Gap between sidebar and main content column. |
| `--sf-sidebar-min-width` | PUBLIC | knob | sidebar | `50%` | Minimum sidebar width before the layout collapses to stacking. |
| `--sf-sidebar-width` | PUBLIC | knob | sidebar | `18rem` | Preferred width of the sidebar column. |
| `--sf-stack-gap` | PUBLIC | consumption | stack | `var(--sf-content-gap)` | Vertical gap between stacked block-level elements in the stack layout. |
| `--sf-switcher-gap` | PUBLIC | consumption | switcher | `var(--sf-gap)` | Gap between switcher columns / rows. |
| `--sf-switcher-threshold` | PUBLIC | knob | switcher | `30rem` | Inline-size threshold below which the switcher flips from horizontal to vertical. |

### Macro tokens (23)

| Token | Tier | Role | Namespace | Default | Description |
|---|---|---|---|---|---|
| `--sf-aspect` | PUBLIC | knob | aspect | `16 / 9` | Aspect ratio value for the .aspect-ratio macro. |
| `--sf-content-intrinsic-size` | PUBLIC | knob | content | `500px` | Intrinsic-size hint for content-visibility: auto (prevents layout shift on first reveal). |
| `--sf-flow-space` | PUBLIC | consumption | flow | `var(--sf-content-gap)` | Margin-block-start applied to all flow children except the first. |
| `--sf-line-clamp` | PUBLIC | knob | line | `3` | Number of visible lines before text is clipped with an ellipsis. |
| `--sf-prose-block-margin` | PUBLIC | consumption | prose | `var(--sf-space-m)` | Block margin between prose elements (h2, p, ul, etc.). |
| `--sf-prose-blockquote-border` | PUBLIC | consumption | prose | `var(--sf-border-width-2) solid var(--sf-color-border--subtle)` | Left border style for blockquotes inside prose. |
| `--sf-prose-blockquote-padding` | PUBLIC | consumption | prose | `var(--sf-space-m)` | Inner padding for blockquotes inside prose. |
| `--sf-prose-figcaption-size` | PUBLIC | consumption | prose | `var(--sf-text-s)` | Font size for figure captions inside .prose. Typically smaller than body text. |
| `--sf-prose-figure-margin` | PUBLIC | consumption | prose | `var(--sf-space-l)` | Block margin around <figure> elements inside .prose. |
| `--sf-prose-heading-gap` | PUBLIC | consumption | prose | `var(--sf-space-s)` | Space between a heading and the content that follows it inside .prose. |
| `--sf-prose-hr-margin` | PUBLIC | consumption | prose | `var(--sf-space-l)` | Block margin around <hr> rules inside .prose. |
| `--sf-prose-list-gap` | PUBLIC | consumption | prose | `var(--sf-space-xs)` | Gap between list items inside .prose. |
| `--sf-prose-marker-color` | PUBLIC | consumption | prose | `var(--sf-color-primary)` | Color of list bullets and ordered-list numbers inside .prose. |
| `--sf-prose-media-margin` | PUBLIC | consumption | prose | `var(--sf-space-m)` | Block margin around images, video, and figures inside .prose. |
| `--sf-prose-media-radius` | PUBLIC | consumption | prose | `var(--sf-radius-m)` | Border radius applied to images and media inside .prose. |
| `--sf-prose-nested-list-gap` | PUBLIC | consumption | prose | `var(--sf-space-2xs)` | Gap between items in nested lists inside .prose. |
| `--sf-prose-table-pad` | PUBLIC | consumption | prose | `var(--sf-space-xs)` | Cell padding for tables inside .prose. |
| `--sf-scrim-color` | PUBLIC | knob | scrim | `oklch(0 0 0 / 0.55)` | Base color of the gradient scrim overlay. |
| `--sf-scrim-direction` | PUBLIC | knob | scrim | `to top` | Direction of the scrim gradient (to bottom, to top, etc.). |
| `--sf-scrim-gradient` | PUBLIC | consumption | scrim | `linear-gradient(var(--sf-scrim-direction), var(--sf-scrim-color), transparent)` | Full gradient shorthand for the scrim. Override to customise the fade. |
| `--sf-scrim-text-shadow` | PUBLIC | knob | scrim | `0 1px 3px oklch(0 0 0 / 0.6)` | Text-shadow layered over the scrim gradient to ensure legibility for text placed directly on image backgrounds. |
| `--sf-scroll-shadow-size` | PUBLIC | knob | scroll | `2rem` | Size of the scroll-shadow fade effect on overflowing containers. |
| `--sf-surface-color` | PUBLIC | consumption | surface | `var(--sf-color-base)` | Input for the generic .sf-surface macro. Set any color (including palette shades); the macro derives background, auto-contrast foreground, and the contextual token set from it. |

### Palette tokens (106)

| Token | Tier | Role | Namespace | Default | Description |
|---|---|---|---|---|---|
| `--sf-color-action-100` | PUBLIC | consumption | color | `color-mix(in oklab, var(--sf-color-action) var(--sf-palette-mix-100), var(--sf-color-surface))` | Very light action shade. Hover fills on white surfaces, badge backgrounds. |
| `--sf-color-action-200` | PUBLIC | consumption | color | `color-mix(in oklab, var(--sf-color-action) var(--sf-palette-mix-200), var(--sf-color-surface))` | Light action shade. Subtle fills and outlined badge backgrounds. |
| `--sf-color-action-300` | PUBLIC | consumption | color | `color-mix(in oklab, var(--sf-color-action) var(--sf-palette-mix-300), var(--sf-color-surface))` | Light-mid action shade. Borders on light backgrounds, low-emphasis fills. |
| `--sf-color-action-400` | PUBLIC | consumption | color | `color-mix(in oklab, var(--sf-color-action) var(--sf-palette-mix-400), var(--sf-color-surface))` | Mid-light action shade. Disabled state fills, decorative accents. |
| `--sf-color-action-50` | PUBLIC | consumption | color | `color-mix(in oklab, var(--sf-color-action) var(--sf-palette-mix-50), var(--sf-color-surface))` | Lightest action tint. Background fill for subtle action-tinted surfaces. |
| `--sf-color-action-500` | PUBLIC | consumption | color | `var(--sf-color-action)` | Mid action shade — the 'pure' hue. Accessible on both light and dark backgrounds. |
| `--sf-color-action-600` | PUBLIC | consumption | color | `color-mix(in oklab, var(--sf-color-action) var(--sf-palette-mix-600), var(--sf-color-text))` | Mid-dark action shade. Text on light surfaces, icon fills. |
| `--sf-color-action-700` | PUBLIC | consumption | color | `color-mix(in oklab, var(--sf-color-action) var(--sf-palette-mix-700), var(--sf-color-text))` | Dark action shade. Strong text and icon fills on light backgrounds. |
| `--sf-color-action-800` | PUBLIC | consumption | color | `color-mix(in oklab, var(--sf-color-action) var(--sf-palette-mix-800), var(--sf-color-text))` | Very dark action shade. High-contrast text on white. |
| `--sf-color-action-900` | PUBLIC | consumption | color | `color-mix(in oklab, var(--sf-color-action) var(--sf-palette-mix-900), var(--sf-color-text))` | Near-black action shade. Extreme contrast on white surfaces. |
| `--sf-color-action-950` | PUBLIC | consumption | color | `color-mix(in oklab, var(--sf-color-action) var(--sf-palette-mix-950), var(--sf-color-text))` | Darkest action tint. Near-black for dark-theme surface accents. |
| `--sf-color-action-a10` | PUBLIC | consumption | color | `oklch(from var(--sf-color-action) l c h / 0.10)` | 10% opacity action tint. Subtle hover or selected-row background. |
| `--sf-color-action-a30` | PUBLIC | consumption | color | `oklch(from var(--sf-color-action) l c h / 0.30)` | 30% opacity action tint. |
| `--sf-color-action-a5` | PUBLIC | consumption | color | `oklch(from var(--sf-color-action) l c h / 0.05)` | 5% opacity action tint. Barely-there hover highlight. |
| `--sf-color-action-a50` | PUBLIC | consumption | color | `oklch(from var(--sf-color-action) l c h / 0.50)` | 50% opacity action tint. Mid-transparency badge or overlay. |
| `--sf-color-action-a80` | PUBLIC | consumption | color | `oklch(from var(--sf-color-action) l c h / 0.80)` | 80% opacity action tint. |
| `--sf-color-base-100` | PUBLIC | consumption | color | `color-mix(in oklab, var(--sf-color-text) var(--sf-palette-mix-100), var(--sf-color-base))` | Very light base shade. Hover fills, badge backgrounds. |
| `--sf-color-base-200` | PUBLIC | consumption | color | `color-mix(in oklab, var(--sf-color-text) var(--sf-palette-mix-200), var(--sf-color-base))` | Light base shade. |
| `--sf-color-base-300` | PUBLIC | consumption | color | `color-mix(in oklab, var(--sf-color-text) var(--sf-palette-mix-300), var(--sf-color-base))` | Light-mid base shade. Borders on light backgrounds. |
| `--sf-color-base-400` | PUBLIC | consumption | color | `color-mix(in oklab, var(--sf-color-text) var(--sf-palette-mix-400), var(--sf-color-base))` | Mid-light base shade. Disabled fills. |
| `--sf-color-base-50` | PUBLIC | consumption | color | `color-mix(in oklab, var(--sf-color-text) var(--sf-palette-mix-50), var(--sf-color-base))` | Lightest base tint. |
| `--sf-color-base-500` | PUBLIC | consumption | color | `var(--sf-color-base)` | Mid base shade — the 'pure' hue. |
| `--sf-color-base-600` | PUBLIC | consumption | color | `color-mix(in oklab, var(--sf-color-base) var(--sf-palette-mix-600), var(--sf-color-text))` | Mid-dark base shade. Text on light surfaces. |
| `--sf-color-base-700` | PUBLIC | consumption | color | `color-mix(in oklab, var(--sf-color-base) var(--sf-palette-mix-700), var(--sf-color-text))` | Dark base shade. |
| `--sf-color-base-800` | PUBLIC | consumption | color | `color-mix(in oklab, var(--sf-color-base) var(--sf-palette-mix-800), var(--sf-color-text))` | Very dark base shade. |
| `--sf-color-base-900` | PUBLIC | consumption | color | `color-mix(in oklab, var(--sf-color-base) var(--sf-palette-mix-900), var(--sf-color-text))` | Near-black base shade. |
| `--sf-color-base-950` | PUBLIC | consumption | color | `color-mix(in oklab, var(--sf-color-base) var(--sf-palette-mix-950), var(--sf-color-text))` | Darkest base tint. |
| `--sf-color-base-a10` | PUBLIC | consumption | color | `oklch(from var(--sf-color-base) l c h / 0.10)` | 10% opacity base tint. |
| `--sf-color-base-a30` | PUBLIC | consumption | color | `oklch(from var(--sf-color-base) l c h / 0.30)` | 30% opacity base tint. |
| `--sf-color-base-a5` | PUBLIC | consumption | color | `oklch(from var(--sf-color-base) l c h / 0.05)` | 5% opacity base tint. |
| `--sf-color-base-a50` | PUBLIC | consumption | color | `oklch(from var(--sf-color-base) l c h / 0.50)` | 50% opacity base tint. |
| `--sf-color-base-a80` | PUBLIC | consumption | color | `oklch(from var(--sf-color-base) l c h / 0.80)` | 80% opacity base tint. |
| `--sf-color-neutral-100` | PUBLIC | consumption | color | `color-mix(in oklab, var(--sf-color-neutral) var(--sf-palette-mix-100), var(--sf-color-surface))` | Very light neutral shade. |
| `--sf-color-neutral-200` | PUBLIC | consumption | color | `color-mix(in oklab, var(--sf-color-neutral) var(--sf-palette-mix-200), var(--sf-color-surface))` | Light neutral shade. |
| `--sf-color-neutral-300` | PUBLIC | consumption | color | `color-mix(in oklab, var(--sf-color-neutral) var(--sf-palette-mix-300), var(--sf-color-surface))` | Light-mid neutral shade. |
| `--sf-color-neutral-400` | PUBLIC | consumption | color | `color-mix(in oklab, var(--sf-color-neutral) var(--sf-palette-mix-400), var(--sf-color-surface))` | Mid-light neutral shade. |
| `--sf-color-neutral-50` | PUBLIC | consumption | color | `color-mix(in oklab, var(--sf-color-neutral) var(--sf-palette-mix-50), var(--sf-color-surface))` | Lightest neutral tint. |
| `--sf-color-neutral-500` | PUBLIC | consumption | color | `var(--sf-color-neutral)` | Mid neutral shade — the 'pure' hue. |
| `--sf-color-neutral-600` | PUBLIC | consumption | color | `color-mix(in oklab, var(--sf-color-neutral) var(--sf-palette-mix-600), var(--sf-color-text))` | Mid-dark neutral shade. |
| `--sf-color-neutral-700` | PUBLIC | consumption | color | `color-mix(in oklab, var(--sf-color-neutral) var(--sf-palette-mix-700), var(--sf-color-text))` | Dark neutral shade. |
| `--sf-color-neutral-800` | PUBLIC | consumption | color | `color-mix(in oklab, var(--sf-color-neutral) var(--sf-palette-mix-800), var(--sf-color-text))` | Very dark neutral shade. |
| `--sf-color-neutral-900` | PUBLIC | consumption | color | `color-mix(in oklab, var(--sf-color-neutral) var(--sf-palette-mix-900), var(--sf-color-text))` | Near-black neutral shade. |
| `--sf-color-neutral-950` | PUBLIC | consumption | color | `color-mix(in oklab, var(--sf-color-neutral) var(--sf-palette-mix-950), var(--sf-color-text))` | Darkest neutral tint. |
| `--sf-color-neutral-a10` | PUBLIC | consumption | color | `oklch(from var(--sf-color-neutral) l c h / 0.10)` | 10% opacity neutral tint. |
| `--sf-color-neutral-a30` | PUBLIC | consumption | color | `oklch(from var(--sf-color-neutral) l c h / 0.30)` | 30% opacity neutral tint. |
| `--sf-color-neutral-a5` | PUBLIC | consumption | color | `oklch(from var(--sf-color-neutral) l c h / 0.05)` | 5% opacity neutral tint. |
| `--sf-color-neutral-a50` | PUBLIC | consumption | color | `oklch(from var(--sf-color-neutral) l c h / 0.50)` | 50% opacity neutral tint. |
| `--sf-color-neutral-a80` | PUBLIC | consumption | color | `oklch(from var(--sf-color-neutral) l c h / 0.80)` | 80% opacity neutral tint. |
| `--sf-color-primary-100` | PUBLIC | consumption | color | `color-mix(in oklab, var(--sf-color-primary) var(--sf-palette-mix-100), var(--sf-color-surface))` | Very light primary shade. |
| `--sf-color-primary-200` | PUBLIC | consumption | color | `color-mix(in oklab, var(--sf-color-primary) var(--sf-palette-mix-200), var(--sf-color-surface))` | Light primary shade. |
| `--sf-color-primary-300` | PUBLIC | consumption | color | `color-mix(in oklab, var(--sf-color-primary) var(--sf-palette-mix-300), var(--sf-color-surface))` | Light-mid primary shade. |
| `--sf-color-primary-400` | PUBLIC | consumption | color | `color-mix(in oklab, var(--sf-color-primary) var(--sf-palette-mix-400), var(--sf-color-surface))` | Mid-light primary shade. |
| `--sf-color-primary-50` | PUBLIC | consumption | color | `color-mix(in oklab, var(--sf-color-primary) var(--sf-palette-mix-50), var(--sf-color-surface))` | Lightest primary tint. |
| `--sf-color-primary-500` | PUBLIC | consumption | color | `var(--sf-color-primary)` | Mid primary shade — the 'pure' hue. |
| `--sf-color-primary-600` | PUBLIC | consumption | color | `color-mix(in oklab, var(--sf-color-primary) var(--sf-palette-mix-600), var(--sf-color-text))` | Mid-dark primary shade. |
| `--sf-color-primary-700` | PUBLIC | consumption | color | `color-mix(in oklab, var(--sf-color-primary) var(--sf-palette-mix-700), var(--sf-color-text))` | Dark primary shade. |
| `--sf-color-primary-800` | PUBLIC | consumption | color | `color-mix(in oklab, var(--sf-color-primary) var(--sf-palette-mix-800), var(--sf-color-text))` | Very dark primary shade. |
| `--sf-color-primary-900` | PUBLIC | consumption | color | `color-mix(in oklab, var(--sf-color-primary) var(--sf-palette-mix-900), var(--sf-color-text))` | Near-black primary shade. |
| `--sf-color-primary-950` | PUBLIC | consumption | color | `color-mix(in oklab, var(--sf-color-primary) var(--sf-palette-mix-950), var(--sf-color-text))` | Darkest primary tint. |
| `--sf-color-primary-a10` | PUBLIC | consumption | color | `oklch(from var(--sf-color-primary) l c h / 0.10)` | 10% opacity primary tint. |
| `--sf-color-primary-a30` | PUBLIC | consumption | color | `oklch(from var(--sf-color-primary) l c h / 0.30)` | 30% opacity primary tint. |
| `--sf-color-primary-a5` | PUBLIC | consumption | color | `oklch(from var(--sf-color-primary) l c h / 0.05)` | 5% opacity primary tint. |
| `--sf-color-primary-a50` | PUBLIC | consumption | color | `oklch(from var(--sf-color-primary) l c h / 0.50)` | 50% opacity primary tint. |
| `--sf-color-primary-a80` | PUBLIC | consumption | color | `oklch(from var(--sf-color-primary) l c h / 0.80)` | 80% opacity primary tint. |
| `--sf-color-secondary-100` | PUBLIC | consumption | color | `color-mix(in oklab, var(--sf-color-secondary) var(--sf-palette-mix-100), var(--sf-color-surface))` | Very light secondary shade. |
| `--sf-color-secondary-200` | PUBLIC | consumption | color | `color-mix(in oklab, var(--sf-color-secondary) var(--sf-palette-mix-200), var(--sf-color-surface))` | Light secondary shade. |
| `--sf-color-secondary-300` | PUBLIC | consumption | color | `color-mix(in oklab, var(--sf-color-secondary) var(--sf-palette-mix-300), var(--sf-color-surface))` | Light-mid secondary shade. |
| `--sf-color-secondary-400` | PUBLIC | consumption | color | `color-mix(in oklab, var(--sf-color-secondary) var(--sf-palette-mix-400), var(--sf-color-surface))` | Mid-light secondary shade. |
| `--sf-color-secondary-50` | PUBLIC | consumption | color | `color-mix(in oklab, var(--sf-color-secondary) var(--sf-palette-mix-50), var(--sf-color-surface))` | Lightest secondary tint. |
| `--sf-color-secondary-500` | PUBLIC | consumption | color | `var(--sf-color-secondary)` | Mid secondary shade — the 'pure' hue. |
| `--sf-color-secondary-600` | PUBLIC | consumption | color | `color-mix(in oklab, var(--sf-color-secondary) var(--sf-palette-mix-600), var(--sf-color-text))` | Mid-dark secondary shade. |
| `--sf-color-secondary-700` | PUBLIC | consumption | color | `color-mix(in oklab, var(--sf-color-secondary) var(--sf-palette-mix-700), var(--sf-color-text))` | Dark secondary shade. |
| `--sf-color-secondary-800` | PUBLIC | consumption | color | `color-mix(in oklab, var(--sf-color-secondary) var(--sf-palette-mix-800), var(--sf-color-text))` | Very dark secondary shade. |
| `--sf-color-secondary-900` | PUBLIC | consumption | color | `color-mix(in oklab, var(--sf-color-secondary) var(--sf-palette-mix-900), var(--sf-color-text))` | Near-black secondary shade. |
| `--sf-color-secondary-950` | PUBLIC | consumption | color | `color-mix(in oklab, var(--sf-color-secondary) var(--sf-palette-mix-950), var(--sf-color-text))` | Darkest secondary tint. |
| `--sf-color-secondary-a10` | PUBLIC | consumption | color | `oklch(from var(--sf-color-secondary) l c h / 0.10)` | 10% opacity secondary tint. |
| `--sf-color-secondary-a30` | PUBLIC | consumption | color | `oklch(from var(--sf-color-secondary) l c h / 0.30)` | 30% opacity secondary tint. |
| `--sf-color-secondary-a5` | PUBLIC | consumption | color | `oklch(from var(--sf-color-secondary) l c h / 0.05)` | 5% opacity secondary tint. |
| `--sf-color-secondary-a50` | PUBLIC | consumption | color | `oklch(from var(--sf-color-secondary) l c h / 0.50)` | 50% opacity secondary tint. |
| `--sf-color-secondary-a80` | PUBLIC | consumption | color | `oklch(from var(--sf-color-secondary) l c h / 0.80)` | 80% opacity secondary tint. |
| `--sf-color-tertiary-100` | PUBLIC | consumption | color | `color-mix(in oklab, var(--sf-color-tertiary) var(--sf-palette-mix-100), var(--sf-color-surface))` | Very light tertiary shade. |
| `--sf-color-tertiary-200` | PUBLIC | consumption | color | `color-mix(in oklab, var(--sf-color-tertiary) var(--sf-palette-mix-200), var(--sf-color-surface))` | Light tertiary shade. |
| `--sf-color-tertiary-300` | PUBLIC | consumption | color | `color-mix(in oklab, var(--sf-color-tertiary) var(--sf-palette-mix-300), var(--sf-color-surface))` | Light-mid tertiary shade. |
| `--sf-color-tertiary-400` | PUBLIC | consumption | color | `color-mix(in oklab, var(--sf-color-tertiary) var(--sf-palette-mix-400), var(--sf-color-surface))` | Mid-light tertiary shade. |
| `--sf-color-tertiary-50` | PUBLIC | consumption | color | `color-mix(in oklab, var(--sf-color-tertiary) var(--sf-palette-mix-50), var(--sf-color-surface))` | Lightest tertiary tint. |
| `--sf-color-tertiary-500` | PUBLIC | consumption | color | `var(--sf-color-tertiary)` | Mid tertiary shade — the 'pure' hue. |
| `--sf-color-tertiary-600` | PUBLIC | consumption | color | `color-mix(in oklab, var(--sf-color-tertiary) var(--sf-palette-mix-600), var(--sf-color-text))` | Mid-dark tertiary shade. |
| `--sf-color-tertiary-700` | PUBLIC | consumption | color | `color-mix(in oklab, var(--sf-color-tertiary) var(--sf-palette-mix-700), var(--sf-color-text))` | Dark tertiary shade. |
| `--sf-color-tertiary-800` | PUBLIC | consumption | color | `color-mix(in oklab, var(--sf-color-tertiary) var(--sf-palette-mix-800), var(--sf-color-text))` | Very dark tertiary shade. |
| `--sf-color-tertiary-900` | PUBLIC | consumption | color | `color-mix(in oklab, var(--sf-color-tertiary) var(--sf-palette-mix-900), var(--sf-color-text))` | Near-black tertiary shade. |
| `--sf-color-tertiary-950` | PUBLIC | consumption | color | `color-mix(in oklab, var(--sf-color-tertiary) var(--sf-palette-mix-950), var(--sf-color-text))` | Darkest tertiary tint. |
| `--sf-color-tertiary-a10` | PUBLIC | consumption | color | `oklch(from var(--sf-color-tertiary) l c h / 0.10)` | 10% opacity tertiary tint. |
| `--sf-color-tertiary-a30` | PUBLIC | consumption | color | `oklch(from var(--sf-color-tertiary) l c h / 0.30)` | 30% opacity tertiary tint. |
| `--sf-color-tertiary-a5` | PUBLIC | consumption | color | `oklch(from var(--sf-color-tertiary) l c h / 0.05)` | 5% opacity tertiary tint. |
| `--sf-color-tertiary-a50` | PUBLIC | consumption | color | `oklch(from var(--sf-color-tertiary) l c h / 0.50)` | 50% opacity tertiary tint. |
| `--sf-color-tertiary-a80` | PUBLIC | consumption | color | `oklch(from var(--sf-color-tertiary) l c h / 0.80)` | 80% opacity tertiary tint. |
| `--sf-palette-mix-100` | PUBLIC-ADVANCED | knob | palette | `8%` | Color-mix percentage for palette step 100. Controls blend depth toward the surface. Default 8%. |
| `--sf-palette-mix-200` | PUBLIC-ADVANCED | knob | palette | `20%` | Color-mix percentage for palette step 200. Controls blend depth toward the surface. Default 20%. |
| `--sf-palette-mix-300` | PUBLIC-ADVANCED | knob | palette | `40%` | Color-mix percentage for palette step 300. Controls blend depth toward the surface. Default 40%. |
| `--sf-palette-mix-400` | PUBLIC-ADVANCED | knob | palette | `65%` | Color-mix percentage for palette step 400 (near-mid tint). Controls blend depth. Default 65%. |
| `--sf-palette-mix-50` | PUBLIC-ADVANCED | knob | palette | `4%` | Color-mix percentage for the lightest palette step (50). Controls how far step 50 blends toward the surface. Default 4%. |
| `--sf-palette-mix-600` | PUBLIC-ADVANCED | knob | palette | `82%` | Color-mix percentage for palette step 600 (near-mid shade). Controls blend depth toward the text color. Default 82%. |
| `--sf-palette-mix-700` | PUBLIC-ADVANCED | knob | palette | `62%` | Color-mix percentage for palette step 700. Controls blend depth toward the text color. Default 62%. |
| `--sf-palette-mix-800` | PUBLIC-ADVANCED | knob | palette | `38%` | Color-mix percentage for palette step 800 (dark shade). Controls blend depth toward text. Default 38%. |
| `--sf-palette-mix-900` | PUBLIC-ADVANCED | knob | palette | `18%` | Color-mix percentage for palette step 900 (very dark shade). Controls blend depth toward text. Default 18%. |
| `--sf-palette-mix-950` | PUBLIC-ADVANCED | knob | palette | `8%` | Color-mix percentage for the darkest palette step (950). Controls how far step 950 blends toward the text color. Default 8%. |

## Classes (232)

### Accessibility (8)

| Class | Tier | Kind | Group | Description |
|---|---|---|---|---|
| `.no-motion` | PUBLIC | accessibility | Reduced motion. Token override helps components that read | Suppresses all animations and transitions within the subtree. Apply to a container to create a reduced-motion zone without relying on the system preference. |
| `.sf-clickable-parent` | PUBLIC | accessibility | Clickable-parent | Makes the entire card or list-item clickable via an absolutely-positioned child overlay link. Apply to the container; place sf-clickable-parent__overlay on the <a>. |
| `.sf-clickable-parent__overlay` | PUBLIC | accessibility | Clickable-parent | The full-bleed overlay link inside an sf-clickable-parent. Stretches to cover the parent and uses pointer-events to let interactive children keep their own clicks. |
| `.sf-focus-parent` | PUBLIC | accessibility | Focus-parent | Forwards focus-visible styling to this container when any descendant is keyboard-focused. Useful for custom controls that wrap a visually-hidden <input>. |
| `.sf-focus-shadow` | PUBLIC | accessibility | Focus-shadow opt-in | Applies the standard focus ring as a box-shadow to any element. Use on custom controls where the native :focus-visible ring doesn't render correctly. |
| `.skip-link` | PUBLIC | accessibility | Skip link | Accessible skip-navigation link. Hidden until focused; jumps keyboard users past repeated navigation blocks. Place as the very first element in <body>. |
| `.sr-only` | PUBLIC | accessibility | Screen-reader-only. Atomic contract: a partial override | Visually hides content while keeping it accessible to screen readers. Use for labels, descriptions, and off-screen text that assistive technology needs. |
| `.sr-only-focusable` | PUBLIC | accessibility | Screen-reader-only. Atomic contract: a partial override | Extends sr-only — also reveals the element when it receives keyboard focus. Typical use: skip links and visually-hidden focus targets. |

### Layout primitives (127)

| Class | Tier | Kind | Group | Description |
|---|---|---|---|---|
| `.sf-alternate` | PUBLIC | layout | Alternate (zigzag / media-object) | Zigzag / alternating two-column layout. Even children align image-left/text-right; odd children flip. Collapses to a single column below the breakpoint. |
| `.sf-bento` | PUBLIC | layout | Bento grid | Auto-fill bento grid for card dashboards. Children span 1 column by default; use span modifiers (sf-bento-wide, sf-bento-tall, sf-bento-full, sf-bento-featured) to break the grid. |
| `.sf-bento--2` | PUBLIC | layout | Bento grid | Bento grid variant with a 2-column base layout. |
| `.sf-bento--3` | PUBLIC | layout | Bento grid | Bento grid variant with a 3-column base layout. |
| `.sf-bento--6` | PUBLIC | layout | Bento grid | Bento grid variant with a 6-column base layout. |
| `.sf-bento--compact` | PUBLIC | layout | Bento grid | Bento grid variant with shorter default row height. |
| `.sf-bento--tall` | PUBLIC | layout | Bento grid | Bento grid variant with taller default row height. |
| `.sf-bento-featured` | PUBLIC | layout | Bento grid | Span modifier for a bento item: takes up 2×2 cells (featured hero placement). |
| `.sf-bento-full` | PUBLIC | layout | Bento grid | Span modifier for a bento item: stretches across all columns (full-width banner). |
| `.sf-bento-tall` | PUBLIC | layout | Bento grid | Span modifier for a bento item: doubles the row height (tall card). |
| `.sf-bento-wide` | PUBLIC | layout | Bento grid | Span modifier for a bento item: spans 2 columns (wide card). |
| `.sf-box` | PUBLIC | layout | Box | Minimal padding container that applies --sf-component-pad on all sides. The simplest layout primitive for adding breathing room. |
| `.sf-breakout` | PUBLIC | layout | Content grid (breakout pattern) | Breaks a child element out of a parent sf-content-grid, spanning full bleed (or a named grid area) regardless of the parent column. Useful for full-width sections inside constrained prose. |
| `.sf-center` | PUBLIC | layout | Center | Centers children both horizontally and vertically using flexbox. Optionally add sf-center--intrinsic to size the container to its content. |
| `.sf-center--intrinsic` | PUBLIC | layout | Center | Modifier for sf-center: constrains the container to the natural width of its children (no stretching to fill available space). |
| `.sf-cluster` | PUBLIC | layout | Cluster | Flex-wrap row of variable-width items with automatic gap. Children wrap when the container is too narrow. Use for tag lists, button groups, and icon rows. |
| `.sf-cluster--2xl` | PUBLIC | layout | Cluster | Cluster variant with 2xl gap between items. |
| `.sf-cluster--between` | PUBLIC | layout | Cluster | Cluster variant that distributes items with space-between alignment. |
| `.sf-cluster--center` | PUBLIC | layout | Cluster | Cluster variant that centers the item row horizontally. |
| `.sf-cluster--end` | PUBLIC | layout | Cluster | Cluster variant that aligns items to the inline end (right in LTR). |
| `.sf-cluster--l` | PUBLIC | layout | Cluster | Cluster variant with large (l) gap between items. |
| `.sf-cluster--m` | PUBLIC | layout | Cluster | Cluster variant with medium (m) gap between items. |
| `.sf-cluster--no-wrap` | PUBLIC | layout | Cluster | Cluster variant that prevents item wrapping (single-line row). |
| `.sf-cluster--s` | PUBLIC | layout | Cluster | Cluster variant with small (s) gap between items. |
| `.sf-cluster--xl` | PUBLIC | layout | Cluster | Cluster variant with xl gap between items. |
| `.sf-cluster--xs` | PUBLIC | layout | Cluster | Cluster variant with xs gap between items. |
| `.sf-container` | PUBLIC | layout | Section | Max-width page container, centered with auto side gutters. Establishes a named inline-size container (cq-container) for container queries. Default width is --sf-container-m. |
| `.sf-container--full` | PUBLIC | layout | Container | Container variant that spans the full viewport width (no max-width cap). |
| `.sf-container--narrow` | PUBLIC | layout | Container | Container variant with a narrower max-width (--sf-container-s). Use for single-column prose and forms. |
| `.sf-container--prose` | PUBLIC | layout | Container | Container variant with a prose-optimised max-width (--sf-container-prose). Ideal for long-form reading content. |
| `.sf-container--wide` | PUBLIC | layout | Container | Container variant with a wider max-width (--sf-container-l). Use for dashboards and wide media. |
| `.sf-content-grid` | PUBLIC | layout | Content grid (breakout pattern) | Holy-grail content grid with named areas: full-bleed, popout, and content columns. Use sf-breakout on children to escape the content column. |
| `.sf-cover` | PUBLIC | layout | Cover | Vertically stretches to at least a viewport height with a centered element (sf-cover__center). Typical use: hero sections. |
| `.sf-cover__center` | PUBLIC | layout | Cover | The centered focal element inside an sf-cover. Stays vertically centered even when the cover content is shorter than the viewport. |
| `.sf-cover--max` | PUBLIC | layout | Cover | Cover variant that uses a max-height instead of min-height for the viewport constraint. |
| `.sf-cover--min` | PUBLIC | layout | Cover | Cover variant that reduces the minimum height to half a viewport. |
| `.sf-cover--padding-l` | PUBLIC | layout | Cover | Cover variant with large vertical padding above and below the centered content. |
| `.sf-cover--padding-s` | PUBLIC | layout | Cover | Cover variant with small vertical padding above and below the centered content. |
| `.sf-cq` | PUBLIC | layout | Container query context | Assigns an inline-size container context to any element. Children can then use @container rules or container-query-aware tokens. |
| `.sf-divider` | PUBLIC | layout | Divider | Horizontal rule (divider line). Uses --sf-divider-* tokens for color, width, and style. Modifiers change dash style or orientation. |
| `.sf-divider--dashed` | PUBLIC | layout | Divider | Divider variant with a dashed stroke. |
| `.sf-divider--dotted` | PUBLIC | layout | Divider | Divider variant with a dotted stroke. |
| `.sf-divider--gradient` | PUBLIC | layout | Divider | Divider variant rendered as a gradient that fades to transparent at both ends. |
| `.sf-divider--soft` | PUBLIC | layout | Divider | Divider variant with reduced opacity (subtle separator). |
| `.sf-divider--strong` | PUBLIC | layout | Divider | Divider variant with stronger/darker color for a more prominent separator. |
| `.sf-divider--vertical` | PUBLIC | layout | Divider | Divider variant rendered as a vertical line. Use inside flex or grid containers. |
| `.sf-equal` | PUBLIC | layout | Equal columns (intrinsically responsive) | Auto-fill equal-columns grid. Columns fill the row and wrap when they hit --sf-equal-min-col. No breakpoints needed. |
| `.sf-equal--2` | PUBLIC | layout | Equal columns (intrinsically responsive) | Equal-columns variant locked to 2 columns using --sf-equal-min-col-2. |
| `.sf-equal--3` | PUBLIC | layout | Equal columns (intrinsically responsive) | Equal-columns variant locked to 3 columns using --sf-equal-min-col-3. |
| `.sf-equal--4` | PUBLIC | layout | Equal columns (intrinsically responsive) | Equal-columns variant locked to 4 columns using --sf-equal-min-col-4. |
| `.sf-equal--6` | PUBLIC | layout | Equal columns (intrinsically responsive) | Equal-columns variant locked to 6 columns using --sf-equal-min-col-6. |
| `.sf-frame` | PUBLIC | layout | Frame | Aspect-ratio container for media (images, video, maps). Children fill and cover the fixed-ratio box. Default ratio is 16:9. |
| `.sf-frame--3-2` | PUBLIC | layout | Frame | Frame variant locked to a 3:2 aspect ratio. |
| `.sf-frame--4-3` | PUBLIC | layout | Frame | Frame variant locked to a 4:3 aspect ratio. |
| `.sf-frame--cinema` | PUBLIC | layout | Frame | Frame variant locked to a cinematic 21:9 aspect ratio. |
| `.sf-frame--golden` | PUBLIC | layout | Frame | Frame variant locked to the golden ratio (1.618:1). |
| `.sf-frame--portrait` | PUBLIC | layout | Frame | Frame variant locked to a portrait 2:3 aspect ratio. |
| `.sf-frame--square` | PUBLIC | layout | Frame | Frame variant locked to a square 1:1 aspect ratio. |
| `.sf-frame--video` | PUBLIC | layout | Frame | Frame variant locked to the standard 16:9 video aspect ratio. |
| `.sf-full-bleed` | PUBLIC | layout | Content grid (breakout pattern) | Forces an element to span the full viewport width, breaking out of any centered container. Use for full-bleed images and section backgrounds. |
| `.sf-gap` | PUBLIC | layout | Gap | Injects the default --sf-gap into an existing flex or grid container without imposing display:flex itself. Use when the parent is already a flex or grid. |
| `.sf-gap--2xl` | PUBLIC | layout | Gap | Gap injection variant with 2xl gap value. |
| `.sf-gap--l` | PUBLIC | layout | Gap | Gap injection variant with large (l) gap value. |
| `.sf-gap--m` | PUBLIC | layout | Gap | Gap injection variant with medium (m) gap value. |
| `.sf-gap--s` | PUBLIC | layout | Gap | Gap injection variant with small (s) gap value. |
| `.sf-gap--xl` | PUBLIC | layout | Gap | Gap injection variant with xl gap value. |
| `.sf-gap--xs` | PUBLIC | layout | Gap | Gap injection variant with xs gap value. |
| `.sf-grid` | PUBLIC | layout | Grid (auto) | Auto-fill CSS grid. Columns are sized with RAM pattern (Repeat, Auto-fill, Minmax) and wrap automatically. Default column min-width is --sf-grid-min-col. |
| `.sf-grid--2xl` | PUBLIC | layout | Grid (auto) | Grid variant with a 2xl minimum column width. |
| `.sf-grid--dense` | PUBLIC | layout | Grid (auto) | Grid variant with grid-auto-flow: dense, allowing the grid to fill holes created by span modifiers. |
| `.sf-grid--fit` | PUBLIC | layout | Grid (auto) | Grid variant that switches from auto-fill to auto-fit, collapsing empty columns. |
| `.sf-grid--l` | PUBLIC | layout | Grid (auto) | Grid variant with a large (l) minimum column width. |
| `.sf-grid--m` | PUBLIC | layout | Grid (auto) | Grid variant with a medium (m) minimum column width. |
| `.sf-grid--s` | PUBLIC | layout | Grid (auto) | Grid variant with a small (s) minimum column width. |
| `.sf-grid--xl` | PUBLIC | layout | Grid (auto) | Grid variant with an xl minimum column width. |
| `.sf-grid--xs` | PUBLIC | layout | Grid (auto) | Grid variant with an xs minimum column width. |
| `.sf-grid-cols-1` | PUBLIC | layout | Single-column grid | Single-column layout (forces all children to one column). |
| `.sf-grid-cols-1-2` | PUBLIC | layout | Ratio grids | Two-column ratio grid: first child takes 1fr, second takes 2fr. Container-query responsive. |
| `.sf-grid-cols-1-3` | PUBLIC | layout | Ratio grids | Two-column ratio grid: first child takes 1fr, second takes 3fr. Container-query responsive. |
| `.sf-grid-cols-2` | PUBLIC | layout | Fixed column grids (container-query responsive) | Responsive 2-column fixed grid. Uses container queries to collapse to one column on narrow containers. |
| `.sf-grid-cols-2-1` | PUBLIC | layout | Ratio grids | Two-column ratio grid: first child takes 2fr, second takes 1fr. Container-query responsive. |
| `.sf-grid-cols-3` | PUBLIC | layout | Fixed column grids (container-query responsive) | Responsive 3-column fixed grid. Collapses progressively on narrow containers. |
| `.sf-grid-cols-3-1` | PUBLIC | layout | Ratio grids | Two-column ratio grid: first child takes 3fr, second takes 1fr. Container-query responsive. |
| `.sf-grid-cols-4` | PUBLIC | layout | Fixed column grids (container-query responsive) | Responsive 4-column fixed grid. Collapses progressively on narrow containers. |
| `.sf-grid-cols-6` | PUBLIC | layout | Fixed column grids (container-query responsive) | Responsive 6-column fixed grid. Collapses progressively on narrow containers. |
| `.sf-icon` | PUBLIC | layout | Icon | Inline icon sizing primitive. Sets width and height to --sf-icon-m via em-based tokens so the icon scales with the surrounding text. |
| `.sf-icon--2xl` | PUBLIC | layout | Icon | Icon variant sized to --sf-icon-2xl (extra-extra-large). |
| `.sf-icon--boxed` | PUBLIC | layout | Icon | Icon variant with a square bordered box background. Useful for standalone icon buttons and feature icons. |
| `.sf-icon--l` | PUBLIC | layout | Icon | Icon variant sized to --sf-icon-l (large). |
| `.sf-icon--m` | PUBLIC | layout | Icon | Icon variant sized to --sf-icon-m (medium, same as base sf-icon). |
| `.sf-icon--s` | PUBLIC | layout | Icon | Icon variant sized to --sf-icon-s (small). |
| `.sf-icon--xl` | PUBLIC | layout | Icon | Icon variant sized to --sf-icon-xl (extra-large). |
| `.sf-icon--xs` | PUBLIC | layout | Icon | Icon variant sized to --sf-icon-xs (extra-small). |
| `.sf-imposter` | PUBLIC | layout | Imposter | Absolutely positions an element at the center of its nearest positioned ancestor. Use for overlays, badges, and floating labels. |
| `.sf-imposter--contain` | PUBLIC | layout | Imposter | Imposter variant that clamps the element within the bounds of its parent using overflow:hidden on the parent. |
| `.sf-imposter--fixed` | PUBLIC | layout | Imposter | Imposter variant that uses position:fixed instead of absolute. Use for viewport-level overlays and modals. |
| `.sf-pancake` | PUBLIC | layout | Pancake (sticky footer) | Three-row layout (header, main, footer) where main takes all remaining vertical space via flex-grow. The footer always sticks to the bottom on tall viewports. |
| `.sf-reel` | PUBLIC | layout | Reel | Horizontally scrollable row of fixed-height items with snap scrolling. Children don't shrink below their intrinsic width, creating a card carousel effect. |
| `.sf-section` | PUBLIC | layout | Section | Full-width page section with vertical padding (--sf-section-pad-default). Use to create visually distinct content bands. |
| `.sf-section--2xl` | PUBLIC | layout | Section | Section variant with 2xl vertical padding. |
| `.sf-section--collapse` | PUBLIC | layout | Collapse modifier | Section variant that removes vertical padding (zero-padding section for adjacent same-color blocks). |
| `.sf-section--guttered` | PUBLIC | layout | Section | Adds horizontal page gutters directly to a section — use when you want to skip a separate .sf-container wrapper (gutterless layout inside section). Neutralises container gutter to prevent double padding. |
| `.sf-section--l` | PUBLIC | layout | Section | Section variant with large (l) vertical padding. |
| `.sf-section--m` | PUBLIC | layout | Section | Section variant with medium (m) vertical padding. |
| `.sf-section--s` | PUBLIC | layout | Section | Section variant with small (s) vertical padding. |
| `.sf-section--xl` | PUBLIC | layout | Section | Section variant with xl vertical padding. |
| `.sf-section--xs` | PUBLIC | layout | Section | Section variant with xs vertical padding. |
| `.sf-section-group` | PUBLIC | layout | Section | Groups adjacent sf-section elements so their combined padding collapses correctly at the top and bottom edges. |
| `.sf-sidebar` | PUBLIC | layout | Sidebar | Two-column sidebar layout: first child is the sidebar, second child is main content. The sidebar collapses below the breakpoint (--sf-sidebar-min-width). Default sidebar on the left. |
| `.sf-sidebar--narrow` | PUBLIC | layout | Sidebar | Sidebar variant with a narrower sidebar column. |
| `.sf-sidebar--right` | PUBLIC | layout | Sidebar | Sidebar variant with the sidebar on the right (second child becomes the sidebar). |
| `.sf-sidebar--wide` | PUBLIC | layout | Sidebar | Sidebar variant with a wider sidebar column. |
| `.sf-stack` | PUBLIC | layout | Stack | Flex column with even vertical spacing between children (--sf-stack-gap). Stacking context for vertical rhythm. |
| `.sf-stack--2xl` | PUBLIC | layout | Stack | Stack variant with 2xl gap between children. |
| `.sf-stack--center` | PUBLIC | layout | Stack | Stack variant that centers children on the cross axis. |
| `.sf-stack--end` | PUBLIC | layout | Stack | Stack variant that aligns children to the cross-axis end (right in LTR). |
| `.sf-stack--l` | PUBLIC | layout | Stack | Stack variant with large (l) gap between children. |
| `.sf-stack--m` | PUBLIC | layout | Stack | Stack variant with medium (m) gap between children. |
| `.sf-stack--s` | PUBLIC | layout | Stack | Stack variant with small (s) gap between children. |
| `.sf-stack--stretch` | PUBLIC | layout | Stack | Stack variant that stretches children to fill the full available width. |
| `.sf-stack--xl` | PUBLIC | layout | Stack | Stack variant with xl gap between children. |
| `.sf-stack--xs` | PUBLIC | layout | Stack | Stack variant with xs gap between children. |
| `.sf-subgrid` | PUBLIC | layout | Subgrid | Passes the parent grid columns through to children via subgrid. Place on a grid item that should align its own children to the outer grid columns. |
| `.sf-subgrid-rows` | PUBLIC | layout | Subgrid | Passes the parent grid rows through to children via subgrid. Place on a grid item that should align its own children to the outer grid rows. |
| `.sf-switcher` | PUBLIC | layout | Switcher | Flex layout that switches from a horizontal row to a vertical column when the container is narrower than --sf-switcher-threshold. |
| `.sf-switcher--no-wrap` | PUBLIC | layout | Switcher | Switcher variant that stays horizontal and never wraps (single-line regardless of container width). |
| `.sf-switcher--vertical` | PUBLIC | layout | Switcher | Switcher variant that starts in the vertical (stacked) direction on all sizes. |

### Macro classes (36)

| Class | Tier | Kind | Group | Description |
|---|---|---|---|---|
| `.sf-aspect` | PUBLIC | macro | Aspect | Sets aspect-ratio from a --sf-aspect-ratio scoped token. Override the token inline to get any ratio without a new class. |
| `.sf-content-auto` | PUBLIC | macro | Content visibility | Sets content-visibility: auto on the element. The browser skips rendering off-screen content, improving LCP for long pages. |
| `.sf-equal-height` | PUBLIC | macro | Equal height | Forces all flex children to equal height (align-items: stretch). Use on a flex row to make cards in a grid share the tallest card's height. |
| `.sf-flow` | PUBLIC | macro | Flow | Applies --sf-flow-space as margin-block-start to all direct children except the first. Establishes consistent vertical rhythm in prose-like containers. |
| `.sf-line-clamp-2` | PUBLIC | macro | Truncate / line-clamp | Clamps text to 2 lines with an ellipsis. Applies -webkit-line-clamp: 2. |
| `.sf-line-clamp-3` | PUBLIC | macro | Truncate / line-clamp | Clamps text to 3 lines with an ellipsis. Applies -webkit-line-clamp: 3. |
| `.sf-line-clamp-N` | PUBLIC | macro | Truncate / line-clamp | Clamps text to a custom N lines. Set --sf-line-clamp on the element to control the number of visible lines. |
| `.sf-link--reverse` | PUBLIC | macro | Link variants | Link color modifier: reverses the default link color to work on dark/inverted backgrounds. Sets color to --sf-color-text--inverse. |
| `.sf-link--subtle` | PUBLIC | macro | Link variants | Link color modifier: renders the link in the body text color instead of the default action color. Underline still indicates the link on hover. |
| `.sf-link-external` | PUBLIC | macro | External link indication | Automatically appends an external-link icon (via ::after content) to indicate the link opens in a new tab or goes to an external domain. |
| `.sf-no-tap-highlight` | PUBLIC | macro | No tap highlight | Removes the mobile tap highlight color (-webkit-tap-highlight-color: transparent). Use on interactive elements with a custom active state. |
| `.sf-not-prose` | PUBLIC | macro | Prose | Opt-out of sf-prose typography styles within a prose block. Apply to an element that should keep default browser or component styles. |
| `.sf-overflow-fade` | PUBLIC | macro | Overflow fade | Adds a gradient fade at the inline-end of an overflowing element to hint at hidden content. Use inside sf-reel or any scroll container. |
| `.sf-prose` | PUBLIC | macro | Prose | Opinionated typographic defaults for long-form content: heading hierarchy, paragraph spacing, blockquote, code, and list styling. Override with sf-not-prose. |
| `.sf-scrim` | PUBLIC | macro | Scrim | Overlay container with a gradient darkening scrim behind text placed on an image or colored background. |
| `.sf-scrim__content` | PUBLIC | macro | Scrim | Content area inside an sf-scrim. Positioned above the gradient overlay layer. |
| `.sf-scrim--bottom` | PUBLIC | macro | Scrim | Scrim variant with the gradient emanating from the bottom edge (bottom-to-top fade). |
| `.sf-scrim--full` | PUBLIC | macro | Scrim | Scrim variant that covers the entire surface with a uniform translucent overlay. |
| `.sf-scrim--top` | PUBLIC | macro | Scrim | Scrim variant with the gradient emanating from the top edge (top-to-bottom fade). |
| `.sf-scroll-shadow` | PUBLIC | macro | Scroll shadow | Adds inset box-shadows at the top and bottom of a scrollable container to indicate hidden overflow above or below. |
| `.sf-scroll-snap` | PUBLIC | macro | Scroll snap | Enables CSS scroll-snap-type: x mandatory on a horizontal scroll container. Children should have scroll-snap-align. |
| `.sf-surface` | PUBLIC | macro | Surface | Generic semantic surface: applies --sf-surface-color as the background and automatically sets a contrasting text color. Tone variants (--primary, --action, etc.) activate preset palettes. |
| `.sf-surface--action` | PUBLIC | macro | Surface | Surface variant using the action color palette (button/CTA primary color). |
| `.sf-surface--danger` | PUBLIC | macro | Surface | Surface variant using the danger status palette. |
| `.sf-surface--info` | PUBLIC | macro | Surface | Surface variant using the info status palette. |
| `.sf-surface--inverse` | PUBLIC | macro | Surface | Surface variant that inverts light/dark, creating an always-dark surface in light mode and always-light in dark mode. |
| `.sf-surface--neutral` | PUBLIC | macro | Surface | Surface variant using the neutral palette (muted/gray). |
| `.sf-surface--primary` | PUBLIC | macro | Surface | Surface variant using the primary brand color palette. |
| `.sf-surface--secondary` | PUBLIC | macro | Surface | Surface variant using the secondary brand color palette. |
| `.sf-surface--success` | PUBLIC | macro | Surface | Surface variant using the success status palette. |
| `.sf-surface--tertiary` | PUBLIC | macro | Surface | Surface variant using the tertiary brand color palette. |
| `.sf-surface--warning` | PUBLIC | macro | Surface | Surface variant using the warning status palette. |
| `.sf-tabular-nums` | PUBLIC | macro | Tabular figures | Forces tabular (monospaced) number rendering. Use on price tables, counters, and anywhere numbers need to align vertically across rows. |
| `.sf-text-gradient` | PUBLIC | macro | Text gradient | Applies a brand gradient to inline text. Sets the background to the gradient, clips it to the text, and makes the text color transparent. |
| `.sf-text-protect` | PUBLIC | macro | Text protect | Wraps text in a translucent dark gradient overlay to ensure legibility when placed over a light or variable background image. |
| `.sf-truncate` | PUBLIC | macro | Truncate / line-clamp | Single-line text overflow with ellipsis. Equivalent to the classic text-overflow: ellipsis trio (white-space nowrap, overflow hidden, text-overflow ellipsis). |

### Motion / animation (15)

| Class | Tier | Kind | Group | Description |
|---|---|---|---|---|
| `.sf-color-pulse` | PUBLIC | motion | @property color animation | Applies a gentle color-pulse animation to draw attention to a dynamic value change (e.g. a counter updating). Scoped to users who have not requested reduced motion. |
| `.sf-entrance--fade` | PUBLIC | motion | Scroll-driven entrances | Scroll-driven entrance: element fades in as it enters the viewport. Animation tied to scroll progress via animation-timeline. |
| `.sf-entrance--fade-down` | PUBLIC | motion | Scroll-driven entrances | Scroll-driven entrance: element fades in while moving downward into position. |
| `.sf-entrance--fade-left` | PUBLIC | motion | Scroll-driven entrances | Scroll-driven entrance: element fades in while moving from the right toward the left. |
| `.sf-entrance--fade-right` | PUBLIC | motion | Scroll-driven entrances | Scroll-driven entrance: element fades in while moving from the left toward the right. |
| `.sf-entrance--fade-up` | PUBLIC | motion | Scroll-driven entrances | Scroll-driven entrance: element fades in while moving upward into position. |
| `.sf-entrance--scale-up` | PUBLIC | motion | Scroll-driven entrances | Scroll-driven entrance: element fades in while scaling up from a slightly smaller size. |
| `.sf-fade-in` | PUBLIC | motion | Animation presets | One-shot fade-in animation (opacity 0 → 1). Scoped to no-preference so it stops automatically for reduced-motion users. |
| `.sf-fade-out` | PUBLIC | motion | Animation presets | One-shot fade-out animation (opacity 1 → 0). Scoped to no-preference. |
| `.sf-scale-down` | PUBLIC | motion | Animation presets | One-shot scale-down animation (element shrinks from full size). Scoped to no-preference. |
| `.sf-scale-up` | PUBLIC | motion | Animation presets | One-shot scale-up animation (element grows from smaller size). Scoped to no-preference. |
| `.sf-slide-in-down` | PUBLIC | motion | Animation presets | One-shot slide-in-from-above animation. Scoped to no-preference. |
| `.sf-slide-in-left` | PUBLIC | motion | Animation presets | One-shot slide-in-from-right animation (slides to the left). Scoped to no-preference. |
| `.sf-slide-in-right` | PUBLIC | motion | Animation presets | One-shot slide-in-from-left animation (slides to the right). Scoped to no-preference. |
| `.sf-slide-in-up` | PUBLIC | motion | Animation presets | One-shot slide-in-from-below animation. Scoped to no-preference. |

### Print (4)

| Class | Tier | Kind | Group | Description |
|---|---|---|---|---|
| `.no-print` | PUBLIC | print | Print visibility utilities | Hides the element in @media print. Use on sidebars, navigation bars, and decorative elements that should not appear on paper. |
| `.print-color-exact` | PUBLIC | print | Opt-in colour treatment | Forces exact color rendering in print (print-color-adjust: exact). Use on charts and colored badges that must preserve their fill colors in print. |
| `.print-no-color` | PUBLIC | print | Opt-in colour treatment | Strips color information in print (print-color-adjust: economy). Defers to the printer's ink-saving mode for backgrounds and non-critical color fills. |
| `.print-only` | PUBLIC | print | Print visibility utilities | Hides the element on screen (display: none) but shows it in @media print. Use for print-only headers, footers, and supplementary content not needed on screen. |

### State classes (40)

| Class | Tier | Kind | Group | Description |
|---|---|---|---|---|
| `.is-active` | PUBLIC | state | ACTIVE / SELECTED / CURRENT | Active state — applied to the currently interacted-with element (e.g. pressed button, active menu item). Sets --sf-is-active to 1 for calc() branching. |
| `.is-busy` | PUBLIC | state | LOADING / ASYNC FEEDBACK | Busy state — shows a progress cursor to indicate background processing. Does not mask content; use is-loading when content should be hidden during loading. |
| `.is-clickable` | PUBLIC | state | FOCUS / INTERACTION MODIFIERS | Makes the element appear interactive (pointer cursor). Use when an element has a click handler but no native button or link role. |
| `.is-clipped` | PUBLIC | state | OVERFLOW / CLIPPING | Clips overflowing content (overflow: hidden). Use to constrain media or tooltips within a container boundary. |
| `.is-collapsed` | PUBLIC | state | OPEN / CLOSED | Collapsed state for disclosure widgets — hides the expandable region. Pair with is-expanded or is-open. Components add transitions. |
| `.is-current` | PUBLIC | state | ACTIVE / SELECTED / CURRENT | Current/selected state — marks the active page in navigation or the selected item in a list. Sets --sf-is-current to 1 for calc() branching. |
| `.is-danger` | PUBLIC | state | VALIDATION / FEEDBACK | Danger status state — applies danger color tokens for destructive actions (e.g. a delete confirmation dialog) and form validation errors. |
| `.is-disabled` | PUBLIC | state | INTERACTIVITY | Disabled state — dims the element (--sf-opacity-disabled), removes pointer events, and sets cursor: not-allowed. Inherited by child elements that re-enable pointer events. |
| `.is-draggable` | PUBLIC | state | DRAG & DROP | Draggable state — shows a grab cursor to indicate the element can be dragged. Apply before a drag interaction begins. |
| `.is-dragging` | PUBLIC | state | DRAG & DROP | Active drag state — shows a grabbing cursor while the element is being dragged. Apply during the drag event. |
| `.is-drop-target` | PUBLIC | state | DRAG & DROP | Drop-target state — applies a visual highlight to indicate a valid drag-and-drop destination. Toggle on drag-over events. |
| `.is-empty` | PUBLIC | state | EMPTY STATE | Empty state — hides the element when it has no child nodes (:empty). Used for dynamic lists or containers that may render empty. |
| `.is-error` | PUBLIC | state | VALIDATION / FEEDBACK | Error state — alias for is-danger. Applies danger color tokens to indicate a validation failure or system error. Visual styling is identical to is-invalid. |
| `.is-expanded` | PUBLIC | state | OPEN / CLOSED | Expanded state for disclosure widgets — shows the expandable region. Inverse of is-collapsed. Components add transitions. |
| `.is-fixed` | PUBLIC | state | POSITION / STICKINESS | Fixed positioning state — removes the element from the document flow and positions it relative to the viewport. Respects writing-mode (logical variant of fixed positioning). |
| `.is-focused` | PUBLIC | state | FOCUS / INTERACTION MODIFIERS | Programmatic focus state — applies the focus ring to an element that should appear focused. Use when :focus-visible alone is insufficient (e.g. custom select). |
| `.is-fullscreen` | PUBLIC | state | POSITION / STICKINESS | Fullscreen positioning state — stretches the element to cover the viewport. Bare positioning only; consumers supply inset values. |
| `.is-hidden` | PUBLIC | state | VISIBILITY | Hidden state — removes the element from layout and accessibility tree (display: none !important). |
| `.is-highlighted` | PUBLIC | state | ACTIVE / SELECTED / CURRENT | Highlighted state — applies a highlight background. Useful for search result highlighting and keyboard-navigated lists. |
| `.is-info` | PUBLIC | state | VALIDATION / FEEDBACK | Info status state — applies info color tokens. Use for neutral informational messages and hints. |
| `.is-invalid` | PUBLIC | state | VALIDATION / FEEDBACK | Invalid state — applies danger color tokens to form fields with validation failures. Identical visual output to is-error; the name signals form-field context. |
| `.is-invisible` | PUBLIC | state | VISIBILITY | Invisible state — hides the element visually but keeps it in the layout and accessibility tree (visibility: hidden). |
| `.is-loading` | PUBLIC | state | LOADING / ASYNC FEEDBACK | Loading state — hides the element's text (color: transparent), removes pointer events, and renders a spinner via ::after. Use for buttons and containers awaiting async results. |
| `.is-open` | PUBLIC | state | OPEN / CLOSED | Open/shown state for modals, dropdowns, and drawers — counterpart to is-collapsed/is-hidden. Sets --sf-is-open to 1 for calc() branching. |
| `.is-overlay` | PUBLIC | state | OVERLAY / BACKDROP | Overlay positioning state — renders the element as a full-screen fixed overlay with a backdrop scrim. Use for modal backgrounds. |
| `.is-pending` | PUBLIC | state | LOADING / ASYNC FEEDBACK | Pending state for optimistic UI — content remains visible but dimmed while an async request is in flight. Differs from is-loading (which hides content entirely). |
| `.is-pinned` | PUBLIC | state | POSITION / STICKINESS | Pinned / sticky state — applies a visual affordance (e.g. border or shadow) to indicate the element is in its stuck (sticky) position. Toggle via IntersectionObserver. |
| `.is-pressed` | PUBLIC | state | ACTIVE / SELECTED / CURRENT | Pressed/toggled-on state for toggle buttons. Sets --sf-is-pressed to 1 for calc() branching and signals the selected state to components. |
| `.is-readonly` | PUBLIC | state | INTERACTIVITY | Readonly state — removes pointer events and text selection. Use for fields that display data but cannot be edited. |
| `.is-resizable` | PUBLIC | state | POSITION / STICKINESS | Resizable state — enables user resize handle on the element (resize: both). Typically applied to textareas or panels. |
| `.is-scrollable` | PUBLIC | state | OVERFLOW / CLIPPING | Makes the element scrollable (overflow: auto) when its content overflows. Applies to both axes. |
| `.is-selected` | PUBLIC | state | ACTIVE / SELECTED / CURRENT | Selected state — marks an item as selected in a list, table row, or grid cell. Visual specifics (background, border) are applied by component styles. |
| `.is-skeleton` | PUBLIC | state | LOADING / ASYNC FEEDBACK | Skeleton loading placeholder state. Applies a shimmer animation over the element to indicate that content is loading. Works on both img and non-media elements. |
| `.is-sticky` | PUBLIC | state | POSITION / STICKINESS | Sticky positioning state — sets position: sticky with a top offset from --sf-sticky-offset. Useful for sticky headers and sidebar sub-menus. |
| `.is-success` | PUBLIC | state | VALIDATION / FEEDBACK | Success status state — applies success color tokens. Use for confirmation messages, completed form steps, and positive feedback. |
| `.is-truncated` | PUBLIC | state | OVERFLOW / CLIPPING | Single-line truncation state — clips overflowing text with an ellipsis (overflow: hidden, text-overflow: ellipsis, white-space: nowrap). |
| `.is-unselectable` | PUBLIC | state | FOCUS / INTERACTION MODIFIERS | Prevents text selection (user-select: none) on the element. Use on interactive drag handles, labels, and UI chrome that shouldn't be selected. |
| `.is-valid` | PUBLIC | state | VALIDATION / FEEDBACK | Valid state — applies success color tokens to form fields that have passed validation. Visual styling is identical to is-success; the name signals form-field context. |
| `.is-visible` | PUBLIC | state | VISIBILITY | Visible state — forces the element to be visible (visibility: visible). Use to un-hide an element that inherited visibility: hidden from a parent. |
| `.is-warning` | PUBLIC | state | VALIDATION / FEEDBACK | Warning status state — applies warning color tokens. Use for cautionary messages and non-critical alerts. |

### Theme example (1)

| Class | Tier | Kind | Group | Description |
|---|---|---|---|---|
| `.theme-transition` | PUBLIC | theme | 5. SMOOTH THEME-TRANSITION HELPER | Internal helper class used by the sf-theme-transition macro. Applies per-property transitions to registered color tokens during light/dark mode switches. |

### Theme utilities (1)

| Class | Tier | Kind | Group | Description |
|---|---|---|---|---|
| `.sf-theme-transition` | PUBLIC | theme | OPT-IN THEME CROSS-FADE | Opt-in animated light/dark theme crossfade. Apply to <html> (or a subtree) so color tokens transition smoothly when [data-theme] changes. Duration controlled by --sf-theme-transition-duration. |

