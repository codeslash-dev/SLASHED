# State classes (`.is-*`)

State classes describe a **runtime condition** toggled by JS or mirrored from
ARIA attributes — not static styling intent (that's for components/utilities).
They live in the `slashed.states` layer, are single-class / low-specificity,
and set the **minimum** needed to communicate the state; components layer
visuals on top.

All states are exercised in [`demo.html`](demo.html).

## Reference

> **Layer note:** Most state classes live in `core/states.css` (layer
> `slashed.states`). Two accessibility-related entries (`.no-motion`,
> `.sr-only-focusable`) moved to `core/accessibility.css`
> (layer `slashed.accessibility`) for better layering priority.

| Class | Use when | ARIA / pairing | Layer |
|---|---|---|---|
| `.is-hidden` | element removed from layout | `hidden` attr equivalent | states |
| `.is-invisible` / `.is-visible` | hidden but keeps its box | `visibility` | states |
| `.is-disabled` | non-interactive, dimmed | `aria-disabled="true"` | states |
| `.is-readonly` | viewable, not editable | `aria-readonly` | states |
| `.is-loading` | content replaced by a spinner | `aria-busy="true"` | states |
| `.is-pending` | request in flight, content still usable (optimistic UI) | `aria-busy="true"` | states |
| `.is-busy` | cursor-only busy hint | `aria-busy` | states |
| `.is-skeleton` | placeholder shimmer | — | states |
| `.is-active` | generic active item (sets `--sf-is-active`) | — | states |
| `.is-selected` | selected in a set | `aria-selected` | states |
| `.is-current` | current page/step in navigation | `aria-current` | states |
| `.is-pressed` | toggle button in the on state | `aria-pressed="true"` | states |
| `.is-highlighted` | transient emphasis | — | states |
| `.is-open` / `.is-collapsed` | a thing is shown vs hidden (modal, drawer) | — | states |
| `.is-expanded` | disclosure/accordion trigger expanded | `aria-expanded="true"` | states |
| `.is-valid` / `.is-invalid` | **form-field** validation result | `aria-invalid` | states |
| `.is-success` / `.is-error` | **general** positive/negative feedback (a save, a step) | `role="status"` / `role="alert"` | states |
| `.is-warning` / `.is-info` | cautionary / informational feedback | — | states |
| `.is-danger` | destructive-action context (a delete button) | — | states |
| `.is-sticky` / `.is-pinned` / `.is-fixed` | positioning | — | states |
| `.is-fullscreen` | app-managed fullscreen overlay | prefer `:fullscreen` for the native API | states |
| `.is-clipped` / `.is-scrollable` / `.is-truncated` | overflow handling | — | states |
| `.is-resizable` | user-resizable (`resize: both`) | — | states |
| `.is-dragging` / `.is-drop-target` / `.is-draggable` | drag & drop | — | states |
| `.is-overlay` | absolute fill | — | states |
| `.is-clickable` / `.is-unselectable` | cursor / selection | — | states |
| `.is-focused` | programmatic focus ring (JS-driven, no `:focus-visible`) | — | states |
| `.is-empty:empty` | hide when empty | — | states |
| `.sr-only-focusable` | hidden until focused (skip-link pattern) | — | accessibility |
| `.no-motion` | kill all animation/transition on this subtree | `prefers-reduced-motion` equivalent | accessibility |

`.sf-focus-parent` is a helper: a container with it rings
when any descendant has keyboard focus (`:focus-within`). It lives in
`core/accessibility.css` (layer `slashed.accessibility`).

`.sf-focus-shadow` is an opt-in modifier that switches the element's
`:focus-visible` indicator from the default `outline` ring to a
`box-shadow` ring (`box-shadow: var(--sf-focus-ring-shadow)`). Useful on
rounded or `overflow: hidden` elements where the box-shadow follows the
border-radius and the outline would clip. It replaces one always-visible
ring with another (keyboard focus stays guaranteed) and, like the base
ring, uses `!important` to survive unlayered resets. Also in
`core/accessibility.css`.

`.sr-only-focusable` hides an element with the screen-reader-only technique
**until** it receives focus — then it becomes visible. Use for skip links and
off-screen navigation that should appear on keyboard focus.

`.no-motion` suppresses all `animation` and `transition` on the element and all
its descendants, regardless of the OS reduced-motion preference. Use for a
site-level "disable animations" toggle driven by JS.

## Disambiguating the overlaps

These pairs look similar but signal different intent — pick by **context**:

- **`.is-invalid` vs `.is-error`** — `.is-invalid` is for a **form field** that
  failed validation (maps to `aria-invalid`); `.is-error` is **general
  component** feedback not tied to one field (a failed network save, a broken
  widget).
- **`.is-valid` vs `.is-success`** — same split on the positive side: field
  validation passed vs a general positive outcome.
- **`.is-danger` vs `.is-error`** — `.is-danger` marks a **destructive-action
  context** (a delete button, a "this cannot be undone" zone). It is *not* a
  validation/error result. An error message uses `.is-error`; the delete button
  that triggered the risky flow uses `.is-danger`.
- **`.is-open` vs `.is-expanded`** — both set `--sf-is-open: 1`. Use
  `.is-open`/`.is-collapsed` for *shown vs hidden* surfaces (modal, dropdown,
  drawer); use `.is-expanded` for a *disclosure trigger* (maps to
  `aria-expanded` on the button that toggles a panel).
- **`.is-loading` vs `.is-pending`** — `.is-loading` masks content with a
  spinner (content not yet available); `.is-pending` keeps content visible and
  usable while a background request settles (optimistic UI).

## Consumer responsibility (CSS can't do it for you)

State classes are visual. Always pair them with the matching ARIA attribute so
assistive tech is informed — e.g. `class="is-expanded" aria-expanded="true"`.
Live updates (a toast appearing, a validation message) need an ARIA live region
(`aria-live`, `role="status"`/`"alert"`); CSS cannot announce changes.

## Wiring validation text colour

Validation states (`.is-valid`, `.is-invalid`, `.is-error`, etc.) set two
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

Because the token inherits, place the `.is-*` class on a wrapper and every
descendant picks it up — regardless of whether your pattern uses visible
labels, sr-only labels with placeholders, or a custom markup structure:

```html
<div class="field-group is-invalid">
  <label class="sr-only">Email</label>
  <input type="email" placeholder="Email">
  <span class="form-error">Please enter a valid email</span>
</div>
```
