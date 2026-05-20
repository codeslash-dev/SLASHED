# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### ⚠️ BREAKING — print colour contract reversed (Phase 3 / F-04)

`core/print.css` no longer flattens authored colour by default. The legacy
blanket reset

```css
* { background: transparent !important; color: CanvasText !important; }
```

destroyed semantic colour in print — `<mark>` lost its highlight, `.is-success`
lost its green, status pills lost their tint. The new contract:

- **Default**: authored colour reaches paper. Browsers handle ink-saving via
  their own `print-color-adjust: economy` heuristics.
- **`.print-color-exact`**: opt-in for colour-coded data that loses meaning
  when flattened (status pills, syntax highlighting, charts).
- **`.print-no-color`**: opt-in for ink-on-paper output where ink-saving is
  the contract (corporate boilerplate forms). Restores the pre-Phase-3
  blanket reset for the marked subtree.

`box-shadow` and `text-shadow` are still suppressed in print, but no longer
with `!important` — an authored shadow that explicitly overrides the print
layer is now the consumer's call.

`!important` in print is now reserved for selectors whose semantics require
defeating consumer-authored CSS:

- `nav, aside, button, input, select, textarea, dialog, [popover], .no-print`
  — content negative-space that must vanish from print.
- `details > summary` — disclosure widget carries no print value.
- The two opt-in colour classes — when the consumer marks a region with them
  they are explicitly asking to override authored colour.

#### Migration

If your site relied on the old blanket flatten — for example, you authored
brand backgrounds for screen and expected the print stylesheet to drop them
silently — wrap the affected region in `.print-no-color` to restore the
previous behaviour.

#### Manual verification

`docs/demo.html` ships a new `#print` section with a checklist. Open print
preview (`Cmd`/`Ctrl` + `P`) to confirm `<mark>`, status colours, the
SCREEN-ONLY badge, and the two opt-in callouts behave as documented.
