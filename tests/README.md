# Test conventions

Two runners, split by whether a test needs a real browser:

- **`*.spec.js`** — Playwright (`npm test`). Runs across chromium/firefox/webkit.
  Use for anything that renders CSS and reads computed styles, layout geometry,
  or visual output — imports `test`/`expect` from `@playwright/test`.
- **`*.test.js`** — Node's built-in test runner (`npm run test:unit`), single
  process, no browser. Use for pure fs/regex/data-shape checks that never touch
  a DOM — imports `test`/`describe` from `node:test` and `assert` from
  `node:assert/strict`. New files are picked up automatically: `test:unit` runs
  the `tests/*.test.js` glob and `pretest` delegates to it, so no `package.json`
  wiring is needed — just drop the file in `tests/`.

If a test doesn't call `page.*` or read a computed style, it almost certainly
belongs in `*.test.js`, not `*.spec.js` — see SL-027 (`coverage.test.js` used
to be Playwright-discovered despite never touching a browser, tripling its CI
cost for no reason).

## `tier1-p*` numbering (SL-032)

`tier1-p2-coverage`, `tier1-p7-oldengine`, `tier1-p8-modern`, and
`tier1-p10-contrast` number their properties P2/P7/P8/P10 with no P1,
P3-P6, or P9 anywhere in the repo. These numbers come from the
tier-1-color-fallback feature's original property enumeration (see each
file's own `Property N:` header comment) — only a subset of the enumerated
properties warranted a dedicated automated test; the rest were covered by
other existing tests, manual review, or judged unnecessary to automate. The
gaps are not dead history — don't renumber these files sequentially.
