# State classes (`.is-*`)

State classes describe a **runtime condition** toggled by JS or mirrored from
ARIA attributes — not static styling intent (that's for components/utilities).
They live in the `slashed.states` layer, are single-class / low-specificity,
and set the **minimum** needed to communicate the state; components layer
visuals on top.

All states are exercised in [`demo.html`](demo.html).

## Reference

| Class | Use when | ARIA / pairing |
|---|---|---|
| `.is-hidden` | element removed from layout | `hidden` attr equivalent |
| `.is-invisible` / `.is-visible` | hidden but keeps its box | `visibility` |
| `.is-disabled` | non-interactive, dimmed | `aria-disabled="true"` |
| `.is-readonly` | viewable, not editable | `aria-readonly` |
| `.is-loading` | content replaced by a spinner | `aria-busy="true"` |
| `.is-pending` | request in flight, content still usable (optimistic UI) | `aria-busy="true"` |
| `.is-busy` | cursor-only busy hint | `aria-busy` |
| `.is-skeleton` | placeholder shimmer | — |
| `.is-active` | generic active item (sets `--sf-is-active`) | — |
| `.is-selected` | selected in a set | `aria-selected` |
| `.is-current` | current page/step in navigation | `aria-current` |
| `.is-pressed` | toggle button in the on state | `aria-pressed="true"` |
| `.is-highlighted` | transient emphasis | — |
| `.is-open` / `.is-collapsed` | a thing is shown vs hidden (modal, drawer) | — |
| `.is-expanded` | disclosure/accordion trigger expanded | `aria-expanded="true"` |
| `.is-valid` / `.is-invalid` | **form-field** validation result | `aria-invalid` |
| `.is-success` / `.is-error` | **general** positive/negative feedback (a save, a step) | `role="status"` / `role="alert"` |
| `.is-warning` / `.is-info` | cautionary / informational feedback | — |
| `.is-danger` | destructive-action context (a delete button) | — |
| `.is-sticky` / `.is-pinned` / `.is-fixed` | positioning | — |
| `.is-fullscreen` | app-managed fullscreen overlay | prefer `:fullscreen` for the native API |
| `.is-clipped` / `.is-scrollable` / `.is-truncated` | overflow handling | — |
| `.is-resizable` | user-resizable (`resize: both`) | — |
| `.is-dragging` / `.is-drop-target` / `.is-draggable` | drag & drop | — |
| `.is-overlay` | absolute fill | — |
| `.is-clickable` / `.is-unselectable` | cursor / selection | — |
| `.is-focused` | programmatic focus ring (JS-driven, no `:focus-visible`) | — |
| `.is-empty:empty` | hide when empty | — |
| `.sr-only-focusable` | hidden until focused (skip-link pattern) | — |
| `.no-motion` | kill all animation/transition on this subtree | `prefers-reduced-motion` equivalent |

`.focus-parent` (no `is-`/`sf-` prefix) is a helper: a container with it rings
when any descendant has keyboard focus (`:focus-within`).

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
