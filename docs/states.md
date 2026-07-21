# State classes (`.sf-is-*`)

State classes describe a **runtime condition** toggled by JS or mirrored from
ARIA attributes — not static styling intent (that's for components/utilities/layout helpers such as `.sf-overlay`).
They live in the `slashed.states` layer, are single-class / low-specificity,
and set the **minimum** needed to communicate the state; components layer
visuals on top.

All states are exercised live in the [demo](/demo/).

## Prefer native state

A `.sf-is-*` class is a fallback for when the platform has no state mechanism
of its own — not the default reach. Before reaching for one, check whether a
native pseudo-class, attribute, or ARIA state already gets you there:

| Instead of | Reach for | Why |
|---|---|---|
| a hidden-state class | `[hidden]` | native, and already hardened to `display: none !important` in `core/reset.css` |
| a disabled-state class | `:disabled` / `[disabled]` | native on every real form control and `<button>` |
| a readonly-state class | `:read-only` | native on real inputs/textareas; doesn't block text selection the way a hand-rolled `pointer-events: none` does |
| an empty-state class | `:empty` | native, zero JS, reacts to DOM content automatically |
| a validation-state class | `:user-invalid` / `:invalid` / `[aria-invalid]` | native for client-side constraint validation (see [forms.css](/optional/forms.css) and `.sf-live-validate`) |
| a busy-cursor-only class | `[aria-busy="true"]` | you set this for assistive tech anyway, so it's sufficient as the sole hook — no parallel class needed |
| an active/expanded/selected/pressed/current class | `[aria-current]`, `[aria-expanded]`, `[aria-selected]`, `[aria-pressed]` | required for accessible custom widgets regardless of framework, so styling off the attribute you must already set avoids toggling two things for one state |

`.sf-is-*` earns its place only when **no native mechanism reaches the same
condition** (`.sf-is-loading`'s spinner, `.sf-is-skeleton`'s shimmer, the
drag-and-drop trio — CSS has no native drag state at all) or when the class
is a **token setter** consumed elsewhere in the framework (the validation
family writing `--sf-field-*`, the `active`/`current`/`open`/`pressed` flags
writing their `--sf-is-*` custom property for your own `calc()` branching —
see [architecture.md § BEM consumer-API tokens](architecture.md)). Where a
class and a native attribute can coexist for different purposes — e.g. an
element carrying both `.sf-is-invalid` (a manual/server-side override) and
`:user-invalid` (the browser's own opinion) — cascade layer order lets the
manual class win regardless of specificity; see "Wiring validation text
colour" below.

`.sf-is-hidden`, `.sf-is-readonly`, and `.sf-is-busy` were removed for exactly
this reason: `.sf-is-hidden` duplicated `[hidden]` byte-for-byte (both this
framework's own `core/reset.css` and the browser already give you that), `.sf-is-readonly`
duplicated `:read-only` while also blocking text selection a real read-only
field should allow, and `.sf-is-busy` was a single `cursor: progress` with no
distinct visual — `[aria-busy="true"]` alone covers the same ground.

## Reference

> **Layer note:** Most state classes live in `core/states.css` (layer
> `slashed.states`). Two accessibility-related entries (`.no-motion`,
> `.sr-only-focusable`) moved to `core/accessibility.css`
> (layer `slashed.accessibility`) for better layering priority.

| Class | Use when | ARIA / pairing | Layer |
|---|---|---|---|
| `.sf-is-invisible` / `.sf-is-visible` | hidden but keeps its box | `visibility` | states |
| `.sf-is-disabled` | non-interactive, dimmed — for elements that can't take the native `disabled` attribute (e.g. `<a class="sf-btn">`) | `aria-disabled="true"` | states |
| `.sf-is-loading` | content replaced by a spinner | `aria-busy="true"` | states |
| `.sf-is-pending` | request in flight, content still usable (optimistic UI) | `aria-busy="true"` | states |
| `.sf-is-skeleton` | placeholder shimmer | — | states |
| `.sf-is-active` | generic active item (sets `--sf-is-active`) | — | states |
| `.sf-is-selected` | selected in a set | `aria-selected` | states |
| `.sf-is-current` | current page/step in navigation | `aria-current` | states |
| `.sf-is-pressed` | toggle button in the on state | `aria-pressed="true"` | states |
| `.sf-is-highlighted` | transient emphasis | — | states |
| `.sf-is-open` / `.sf-is-collapsed` | a thing is shown vs hidden (modal, drawer) | — | states |
| `.sf-is-expanded` | disclosure/accordion trigger expanded | `aria-expanded="true"` | states |
| `.sf-is-valid` / `.sf-is-invalid` | **form-field** validation result | `aria-invalid` | states |
| `.sf-is-success` / `.sf-is-error` | **general** positive/negative feedback (a save, a step) | `role="status"` / `role="alert"` | states |
| `.sf-is-warning` / `.sf-is-info` | cautionary / informational feedback | — | states |
| `.sf-is-danger` | destructive-action context (a delete button) | — | states |
| `.sf-is-dragging` / `.sf-is-drop-target` / `.sf-is-draggable` | drag & drop | — | states |
| `.sf-is-empty:empty` | hide when empty | — | states |
| `.sr-only-focusable` | hidden until focused (skip-link pattern) | — | accessibility |
| `.no-motion` | kill all animation/transition on this subtree | `prefers-reduced-motion` equivalent | accessibility |

`.sf-focus-parent` (in `core/accessibility.css`): a container that rings when any
descendant has keyboard focus (`:focus-within`).

`.sf-focus-shadow` (in `core/accessibility.css`): switches the `:focus-visible`
indicator from the default `outline` ring to a `box-shadow` ring
(`var(--sf-focus-ring-shadow)`), for rounded or `overflow: hidden` elements where
an outline would clip. Uses `!important` to survive unlayered resets.

## Disambiguating the overlaps

These pairs look similar but signal different intent — pick by **context**:

- **`.sf-is-invalid` vs `.sf-is-error`** — `.sf-is-invalid` is for a **form field** that
  failed validation (maps to `aria-invalid`); `.sf-is-error` is **general
  component** feedback not tied to one field (a failed network save, a broken
  widget).
- **`.sf-is-valid` vs `.sf-is-success`** — same split on the positive side: field
  validation passed vs a general positive outcome.
- **`.sf-is-danger` vs `.sf-is-error`** — `.sf-is-danger` marks a **destructive-action
  context** (a delete button, a "this cannot be undone" zone). It is *not* a
  validation/error result. An error message uses `.sf-is-error`; the delete button
  that triggered the risky flow uses `.sf-is-danger`.
- **`.sf-is-open` vs `.sf-is-expanded`** — both set `--sf-is-open: 1`. Use
  `.sf-is-open`/`.sf-is-collapsed` for *shown vs hidden* surfaces (modal, dropdown,
  drawer); use `.sf-is-expanded` for a *disclosure trigger* (maps to
  `aria-expanded` on the button that toggles a panel).
- **`.sf-is-loading` vs `.sf-is-pending`** — `.sf-is-loading` masks content with a
  spinner (content not yet available); `.sf-is-pending` keeps content visible and
  usable while a background request settles (optimistic UI).

## Consumer responsibility (CSS can't do it for you)

State classes are visual. Always pair them with the matching ARIA attribute so
assistive tech is informed — e.g. `class="sf-is-expanded" aria-expanded="true"`.
Live updates (a toast appearing, a validation message) need an ARIA live region
(`aria-live`, `role="status"`/`"alert"`); CSS cannot announce changes.

## Wiring validation text colour

Validation states (`.sf-is-valid`, `.sf-is-invalid`, `.sf-is-error`, etc.) set two
tokens: `--sf-field-border-color` (consumed by `forms.css` automatically) and
`--sf-field-text-color` (a consumer hook).

The framework recolours the **border** for you. For **text** (error messages,
labels, helper hints), wire the token in your own component CSS:

```css
.form-error,
.form-helper {
  color: var(--sf-field-text-color, inherit);
}
```

Because the token inherits, place the `.sf-is-*` class on a wrapper and every
descendant picks it up — regardless of whether your pattern uses visible
labels, sr-only labels with placeholders, or a custom markup structure:

```html
<div class="field-group sf-is-invalid">
  <label class="sr-only">Email</label>
  <input type="email" placeholder="Email">
  <span class="form-error">Please enter a valid email</span>
</div>
```
