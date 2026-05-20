# SLASHED — Comparative Audit
Date: 2026-05-20
Auditor: Kiro (SLASHED audit subagent)
SLASHED commit: e2d8165fa6ea3d5307b3a22a517de1f1734fca45

## 1. Executive summary

_TODO: filled by FEAT-002._

## 2. Methodology

Audyt porównuje SLASHED (15 plików CSS: 10 w `core/` + 5 w `optional/`) z czterema referencyjnymi frameworkami: Pico CSS v2, Automatic.css v4, Bulma v1 oraz Tailwind CSS v4. Sandbox działa w trybie `OPEN_INTERNET`, więc dokumentacja Pico, Bulmy i Tailwinda jest pobierana bezpośrednio z URL-i wymienionych w Załączniku C; każda komórka i ustalenie cytuje konkretny URL referencyjny. Wyjątkiem jest `automaticcss.com` — domena jest osłonięta Cloudflare turnstile (HTTP 403 + "Just a moment"), więc wszystkie komórki ACSS w sekcji 3 oraz każdy odnośnik `Compared-to` w sekcji 4 niosą znacznik `[unverified]`. Twarde ramy: bez migracji na Sass / PostCSS / Node / build-step (SLASHED jest świadomie surowym CSS-em); trzy pliki-stuby `optional/components.css`, `optional/utilities.css`, `optional/tokens.components.css` są celową luką pokrycia i raportowane jako `gap` (nigdy `bug`). Selektory liczono `grep`em wprost na drzewie roboczym; tokeny pobrano z `:root` i `@property` w trzech plikach tokenów.

## 3. Capability matrix

Tabela porównuje SLASHED z czterema referencyjnymi frameworkami (Pico CSS v2, Automatic.css v4, Bulma v1, Tailwind CSS v4) w 13 tematycznych blokach pokrycia. Glify: `✓ ships`, `🟡 partial`, `● missing`, `⚫ out-of-scope`, `📦 stub`, `[unverified]`. Każda komórka SLASHED zawiera odniesienie `path:line` do drzewa źródłowego na commicie `e2d8165`; każda komórka benchmarkowa cytuje URL z [Załącznika C / sources.md](#10-appendix-c--sources-cited) za pomocą `[tekst](url)`. Wszystkie pozytywne tezy o Automatic.css v4 są oznaczone `[unverified]`, ponieważ `automaticcss.com` zwraca HTTP 403 + Cloudflare turnstile dla klientów niebędących przeglądarką (patrz sekcja 10).

| Capability | SLASHED | Pico CSS v2 | Automatic.css v4 | Bulma v1 | Tailwind CSS v4 |
| --- | --- | --- | --- | --- | --- |
| **Tokens** |  |  |  |  |  |
| Color tokens (oklch) | ✓ ships — core/tokens.css:50 | 🟡 partial — RGB hex, no oklch — [Pico colors](https://picocss.com/docs/colors) | [unverified] | 🟡 partial — HSL Sass — [Bulma customize](https://bulma.io/documentation/customize/) | ✓ ships — [Tailwind v4 colors (OKLCH)](https://tailwindcss.com/docs/colors) |
| Light/dark switch | ✓ ships `light-dark()` — core/tokens.css:91 | ✓ ships — [Pico color schemes](https://picocss.com/docs/color-schemes) | [unverified] | ✓ ships `[data-theme]` — [Bulma customize](https://bulma.io/documentation/customize/) | ✓ ships `dark:` variant — [Tailwind dark mode](https://tailwindcss.com/docs/dark-mode) |
| Brand color slots | ✓ ships 6 slots — core/tokens.css:50 | 🟡 partial — `--pico-primary` only — [Pico CSS variables](https://picocss.com/docs/css-variables) | [unverified] | 🟡 partial — `primary/link/info/success/warning/danger` Sass — [Bulma customize](https://bulma.io/documentation/customize/) | 🟡 partial — utility palette, no semantic brand slots — [Tailwind colors](https://tailwindcss.com/docs/colors) |
| Status color slots | ✓ ships 5 slots — core/tokens.css:59 | 🟡 partial — `--pico-form-element-invalid-*` only — [Pico CSS variables](https://picocss.com/docs/css-variables) | [unverified] | ✓ ships info/success/warning/danger — [Bulma customize](https://bulma.io/documentation/customize/) | 🟡 partial — color names, no semantic role slots — [Tailwind colors](https://tailwindcss.com/docs/colors) |
| Numeric palette (50–950) | ✓ ships — optional/tokens.palette.css:30 | ● missing — [Pico colors](https://picocss.com/docs/colors) ships 19 hue families with no per-stop indices | [unverified] | ● missing — [Bulma customize](https://bulma.io/documentation/customize/) (Sass `lighten/darken` only) | ✓ ships 50–950 — [Tailwind colors](https://tailwindcss.com/docs/colors) |
| Alpha palette | ✓ ships a5–a95 — optional/tokens.palette.css:42 | ● missing — [Pico CSS variables](https://picocss.com/docs/css-variables) | [unverified] | ● missing — [Bulma helpers](https://bulma.io/documentation/helpers/) | ✓ ships `bg-black/50` opacity modifiers — [Tailwind colors](https://tailwindcss.com/docs/colors) |
| Spacing scale (fluid) | ✓ ships clamp() — core/tokens.css:418 | 🟡 partial — fixed `--pico-spacing` — [Pico CSS variables](https://picocss.com/docs/css-variables) | [unverified] | ● missing — [Bulma helpers](https://bulma.io/documentation/helpers/) (m-/p- helpers are fixed) | 🟡 partial — `--spacing` variable, not fluid clamp — [Tailwind docs](https://tailwindcss.com/docs) |
| Typography scale (fluid) | ✓ ships clamp() — core/tokens.css:370 | 🟡 partial — fixed sizes — [Pico typography](https://picocss.com/docs/typography) | [unverified] | 🟡 partial — `is-size-1..7` fixed — [Bulma helpers](https://bulma.io/documentation/helpers/) | 🟡 partial — `text-xs..9xl` fixed — [Tailwind font-size](https://tailwindcss.com/docs/font-size) |
| Display sizes | ✓ ships display-s/m/l — core/tokens.css:380 | ● missing — [Pico typography](https://picocss.com/docs/typography) | [unverified] | ● missing — [Bulma helpers](https://bulma.io/documentation/helpers/) | 🟡 partial — covered by `text-7xl..9xl` — [Tailwind font-size](https://tailwindcss.com/docs/font-size) |
| Font weight scale | ✓ ships thin–black — core/tokens.css:351 | 🟡 partial — `--pico-font-weight` only — [Pico CSS variables](https://picocss.com/docs/css-variables) | [unverified] | ✓ ships `has-text-weight-*` — [Bulma helpers](https://bulma.io/documentation/helpers/) | ✓ ships `font-thin..font-black` — [Tailwind font-weight](https://tailwindcss.com/docs/font-weight) |
| Letter-spacing tokens | ✓ ships tight..widest — core/tokens.css:393 | ● missing — [Pico CSS variables](https://picocss.com/docs/css-variables) | [unverified] | ● missing — [Bulma helpers](https://bulma.io/documentation/helpers/) | ✓ ships `tracking-*` — [Tailwind docs](https://tailwindcss.com/docs) |
| Line-height tokens | ✓ ships tight..relaxed — core/tokens.css:388 | 🟡 partial — `--pico-line-height` only — [Pico CSS variables](https://picocss.com/docs/css-variables) | [unverified] | ● missing — [Bulma helpers](https://bulma.io/documentation/helpers/) | ✓ ships `leading-*` — [Tailwind docs](https://tailwindcss.com/docs) |
| Radius scale | ✓ ships none..full — core/tokens.css:473 | 🟡 partial — `--pico-border-radius` only — [Pico CSS variables](https://picocss.com/docs/css-variables) | [unverified] | 🟡 partial — `is-radiusless` + Sass `$radius-*` — [Bulma customize](https://bulma.io/documentation/customize/) | ✓ ships `rounded-{xs..4xl,full}` — [Tailwind border-radius](https://tailwindcss.com/docs/border-radius) |
| Shadow scale | ✓ ships xs..2xl + inner — core/tokens.css:497 | 🟡 partial — `--pico-card-box-shadow` — [Pico CSS variables](https://picocss.com/docs/css-variables) | [unverified] | ✓ ships `is-shadowless` + Sass `$shadow` — [Bulma customize](https://bulma.io/documentation/customize/) | ✓ ships `shadow-{xs..2xl,inner}` — [Tailwind box-shadow](https://tailwindcss.com/docs/box-shadow) |
| Blur scale | ✓ ships xs..xl — core/tokens.css:532 | ● missing — [Pico CSS variables](https://picocss.com/docs/css-variables) | [unverified] | ● missing — [Bulma helpers](https://bulma.io/documentation/helpers/) | ✓ ships `blur-*` — [Tailwind docs](https://tailwindcss.com/docs) |
| Drop-shadow tokens | ✓ ships s/m/l — core/tokens.css:524 | ● missing — [Pico CSS variables](https://picocss.com/docs/css-variables) | [unverified] | ● missing — [Bulma helpers](https://bulma.io/documentation/helpers/) | ✓ ships `drop-shadow-*` — [Tailwind box-shadow](https://tailwindcss.com/docs/box-shadow) |
| Aspect-ratio tokens | ✓ ships square..golden — core/tokens.css:452 | ● missing — [Pico CSS variables](https://picocss.com/docs/css-variables) | [unverified] | ● missing — [Bulma helpers](https://bulma.io/documentation/helpers/) | ✓ ships `aspect-{square,video,...}` — [Tailwind aspect-ratio](https://tailwindcss.com/docs/aspect-ratio) |
| Motion duration tokens | ✓ ships none..slower — core/tokens.css:554 | ● missing — [Pico CSS variables](https://picocss.com/docs/css-variables) | [unverified] | ● missing — [Bulma helpers](https://bulma.io/documentation/helpers/) | ✓ ships `duration-*` — [Tailwind animation](https://tailwindcss.com/docs/animation) |
| Easing tokens | ✓ ships linear..overshoot — core/tokens.css:561 | ● missing — [Pico CSS variables](https://picocss.com/docs/css-variables) | [unverified] | ● missing — [Bulma helpers](https://bulma.io/documentation/helpers/) | ✓ ships `ease-*` — [Tailwind animation](https://tailwindcss.com/docs/animation) |
| Z-index tokens | ✓ ships below..max — core/tokens.css:595 | ● missing — [Pico CSS variables](https://picocss.com/docs/css-variables) | [unverified] | ● missing — [Bulma helpers](https://bulma.io/documentation/helpers/) | ✓ ships `z-*` — [Tailwind docs](https://tailwindcss.com/docs) |
| Container-width tokens | ✓ ships narrow..full — core/tokens.css:442 | 🟡 partial — single `--pico-container` — [Pico container](https://picocss.com/docs/container) | [unverified] | ✓ ships `is-fluid` + `$container-*` Sass — [Bulma layout](https://bulma.io/documentation/layout/) | ✓ ships `container` + `max-w-*` — [Tailwind docs](https://tailwindcss.com/docs) |
| Breakpoint tokens | ● missing — breakpoint-free by design — optional/utilities.css:1 | 🟡 partial — Sass `$breakpoints` — [Pico Sass](https://picocss.com/docs/sass) | [unverified] | ✓ ships `$breakpoints` Sass map — [Bulma customize](https://bulma.io/documentation/customize/) | ✓ ships sm/md/lg/xl/2xl — [Tailwind responsive design](https://tailwindcss.com/docs/responsive-design) |
| Safe-area-inset tokens | ✓ ships top/bottom/left/right — core/tokens.css:621 | ● missing — [Pico CSS variables](https://picocss.com/docs/css-variables) | [unverified] | ● missing — [Bulma helpers](https://bulma.io/documentation/helpers/) | 🟡 partial — `safe-*` modifiers, no token — [Tailwind docs](https://tailwindcss.com/docs) |
| Print tokens | ✓ ships page-margin/size/base-size — core/tokens.css:633 | ● missing — [Pico CSS variables](https://picocss.com/docs/css-variables) | [unverified] | ● missing — [Bulma helpers](https://bulma.io/documentation/helpers/) | 🟡 partial — `print:` variant only, no tokens — [Tailwind docs](https://tailwindcss.com/docs) |
| @property registration of brand colors | ✓ ships 12 registrations — core/tokens.css:50 | ● missing — [Pico CSS variables](https://picocss.com/docs/css-variables) | [unverified] | ● missing — [Bulma customize](https://bulma.io/documentation/customize/) | 🟡 partial — internal `@property` for utilities — [Tailwind docs](https://tailwindcss.com/docs) |
| Relative color syntax | ✓ ships `oklch(from var(...) ...)` — core/tokens.css:91 | ● missing — [Pico CSS variables](https://picocss.com/docs/css-variables) | [unverified] | ● missing — [Bulma customize](https://bulma.io/documentation/customize/) | 🟡 partial — opacity modifiers via `color-mix`, no `from` — [Tailwind colors](https://tailwindcss.com/docs/colors) |
| color-mix() palette generation | ✓ ships 6 brands × 22 stops — optional/tokens.palette.css:30 | ● missing — [Pico CSS variables](https://picocss.com/docs/css-variables) | [unverified] | ● missing — [Bulma customize](https://bulma.io/documentation/customize/) | 🟡 partial — used internally for opacity — [Tailwind colors](https://tailwindcss.com/docs/colors) |
| light-dark() switching | ✓ ships on every semantic — core/tokens.css:91 | ● missing — uses `[data-theme]` only — [Pico color schemes](https://picocss.com/docs/color-schemes) | [unverified] | ● missing — [Bulma customize](https://bulma.io/documentation/customize/) | ● missing — uses `dark:` variant duplication — [Tailwind dark mode](https://tailwindcss.com/docs/dark-mode) |
| sign() auto-contrast | ✓ ships text-on-color — core/tokens.css:152 | ● missing — [Pico colors](https://picocss.com/docs/colors) (manual pairing) | [unverified] | ● missing — [Bulma customize](https://bulma.io/documentation/customize/) (manual `$X-invert` pairs) | ● missing — [Tailwind colors](https://tailwindcss.com/docs/colors) (manual contrast pairing) |
| **Reset / normalize** |  |  |  |  |  |
| Reset/normalize | ✓ ships universal box-sizing reset — core/reset.css:7 | ✓ ships — [Pico classless](https://picocss.com/docs/classless) (Pico ships its own normalize) | [unverified] | ✓ ships — [Bulma start](https://bulma.io/documentation/overview/start/) (extends minireset) | ✓ ships preflight — [Tailwind docs](https://tailwindcss.com/docs) |
| Form-control font inheritance | ✓ ships `font: inherit` — core/reset.css:50 | ✓ ships — [Pico forms](https://picocss.com/docs/forms) | [unverified] | ✓ ships — [Bulma form](https://bulma.io/documentation/form/) | ✓ ships in preflight — [Tailwind docs](https://tailwindcss.com/docs) |
| dialog/[popover] reset | ✓ ships padding/border/bg/color reset — core/reset.css:98 | 🟡 partial — `dialog` styled, popover not addressed — [Pico modal](https://picocss.com/docs/modal) | [unverified] | ● missing — [Bulma components](https://bulma.io/documentation/components/) (no popover; modal is custom markup, not native dialog) | ● missing — [Tailwind docs](https://tailwindcss.com/docs) (preflight is element-only) |
| **Layout primitives** |  |  |  |  |  |
| Stack | ✓ ships `.sf-stack` 8 sizes — core/layout.css:44 | ● missing — [Pico classless](https://picocss.com/docs/classless) (rely on element margins) | [unverified] | ● missing — [Bulma columns](https://bulma.io/documentation/columns/) | 🟡 partial — `space-y-*` utilities — [Tailwind docs](https://tailwindcss.com/docs) |
| Cluster | ✓ ships `.sf-cluster` 6 sizes — core/layout.css:97 | ● missing — [Pico group](https://picocss.com/docs/group) (button-row only) | [unverified] | 🟡 partial — `is-flex is-flex-wrap-wrap` helpers — [Bulma helpers](https://bulma.io/documentation/helpers/) | 🟡 partial — `flex flex-wrap gap-*` utilities — [Tailwind docs](https://tailwindcss.com/docs) |
| Sidebar | ✓ ships `.sf-sidebar` + width modifiers — core/layout.css:122 | ● missing — [Pico grid](https://picocss.com/docs/grid) | [unverified] | ✓ ships `is-narrow` columns — [Bulma columns](https://bulma.io/documentation/columns/) | ● missing — composed manually — [Tailwind docs](https://tailwindcss.com/docs) |
| Switcher | ✓ ships `.sf-switcher` (Every-Layout pattern) — core/layout.css:159 | ● missing — [Pico grid](https://picocss.com/docs/grid) | [unverified] | ● missing — [Bulma columns](https://bulma.io/documentation/columns/) | ● missing — composed manually — [Tailwind docs](https://tailwindcss.com/docs) |
| Cover | ✓ ships `.sf-cover` 100dvh — core/layout.css:202 | ● missing — [Pico classless](https://picocss.com/docs/classless) | [unverified] | ✓ ships `.hero` — [Bulma layout](https://bulma.io/documentation/layout/) | ● missing — composed manually — [Tailwind docs](https://tailwindcss.com/docs) |
| Frame | ✓ ships `.sf-frame` 7 ratios — core/layout.css:223 | ● missing — [Pico classless](https://picocss.com/docs/classless) | [unverified] | 🟡 partial — `.image.is-16by9` — [Bulma elements](https://bulma.io/documentation/elements/) | ✓ ships `aspect-*` — [Tailwind aspect-ratio](https://tailwindcss.com/docs/aspect-ratio) |
| Imposter | ✓ ships `.sf-imposter` (centered overlay) — core/layout.css:271 | ● missing — [Pico classless](https://picocss.com/docs/classless) | [unverified] | ● missing — [Bulma layout](https://bulma.io/documentation/layout/) | 🟡 partial — `absolute inset-0 grid place-items-center` — [Tailwind docs](https://tailwindcss.com/docs) |
| Reel | ✓ ships horizontal scroll — core/layout.css:251 | ● missing — [Pico classless](https://picocss.com/docs/classless) | [unverified] | ● missing — [Bulma layout](https://bulma.io/documentation/layout/) | 🟡 partial — `flex overflow-x-auto snap-x` — [Tailwind docs](https://tailwindcss.com/docs) |
| Bento | ✓ ships `.sf-bento` 4 variants — core/layout.css:391 | ● missing — [Pico grid](https://picocss.com/docs/grid) | [unverified] | ✓ ships `.tile` — [Bulma layout](https://bulma.io/documentation/layout/) | ● missing — composed manually — [Tailwind docs](https://tailwindcss.com/docs) |
| Subgrid | ✓ ships `.sf-subgrid`/`-rows` — core/layout.css:412 | ● missing — [Pico grid](https://picocss.com/docs/grid) | [unverified] | ● missing — [Bulma columns](https://bulma.io/documentation/columns/) | 🟡 partial — `grid-cols-subgrid` utility — [Tailwind docs](https://tailwindcss.com/docs) |
| Content-grid breakout | ✓ ships `.sf-content-grid` + `.sf-breakout`/`.sf-full-bleed` — core/layout.css:366 | ● missing — [Pico classless](https://picocss.com/docs/classless) | [unverified] | ● missing — [Bulma layout](https://bulma.io/documentation/layout/) | ● missing — composed manually — [Tailwind docs](https://tailwindcss.com/docs) |
| Auto-fill grid | ✓ ships breakpoint-free `.sf-grid` — core/layout.css:180 | 🟡 partial — fixed 2-col grid — [Pico grid](https://picocss.com/docs/grid) | [unverified] | 🟡 partial — `is-multiline` columns — [Bulma columns](https://bulma.io/documentation/columns/) | 🟡 partial — `grid-cols-[auto-fill,...]` arbitrary value — [Tailwind docs](https://tailwindcss.com/docs) |
| Container-query primitives | ✓ ships 5× `@container` rules — core/layout.css:305 | ● missing — [Pico grid](https://picocss.com/docs/grid) | [unverified] | ● missing — [Bulma layout](https://bulma.io/documentation/layout/) | ✓ ships `@container` + `@sm/@md/...` variants — [Tailwind responsive design](https://tailwindcss.com/docs/responsive-design) |
| Center | ✓ ships `.sf-center` (content-box) — core/layout.css:79 | ✓ ships `<main class="container">` — [Pico container](https://picocss.com/docs/container) | [unverified] | ✓ ships `.container` — [Bulma layout](https://bulma.io/documentation/layout/) | 🟡 partial — `mx-auto max-w-*` — [Tailwind docs](https://tailwindcss.com/docs) |
| Box | ✓ ships `.sf-box` (outline-based) — core/layout.css:68 | ✓ ships `<article>` card primitive — [Pico card](https://picocss.com/docs/card) | [unverified] | ✓ ships `.box` — [Bulma elements](https://bulma.io/documentation/elements/) | 🟡 partial — composed `p-* border` — [Tailwind docs](https://tailwindcss.com/docs) |
| Section | ✓ ships `.sf-section` 4 paddings — core/layout.css:15 | ✓ ships semantic `<section>` styling — [Pico classless](https://picocss.com/docs/classless) | [unverified] | ✓ ships `.section` — [Bulma layout](https://bulma.io/documentation/layout/) | ● missing — composed `py-*` — [Tailwind docs](https://tailwindcss.com/docs) |
| Container | ✓ ships `.sf-container` 5 widths — core/layout.css:27 | ✓ ships `.container`/`.container-fluid` — [Pico container](https://picocss.com/docs/container) | [unverified] | ✓ ships `.container`/`is-fluid` — [Bulma layout](https://bulma.io/documentation/layout/) | ✓ ships `container` — [Tailwind docs](https://tailwindcss.com/docs) |
| Pancake (sticky footer) | ✓ ships `.sf-pancake` — core/layout.css:317 | ● missing — [Pico classless](https://picocss.com/docs/classless) | [unverified] | ✓ ships `.footer` + body flex — [Bulma layout](https://bulma.io/documentation/layout/) | ● missing — composed `min-h-screen flex flex-col` — [Tailwind docs](https://tailwindcss.com/docs) |
| Prose / long-form | ✓ ships `.sf-prose`/`.sf-not-prose` — core/layout.css:420 | ✓ ships classless typography — [Pico typography](https://picocss.com/docs/typography) | [unverified] | ✓ ships `.content` — [Bulma elements](https://bulma.io/documentation/elements/) | ✓ ships `prose` plugin — [Tailwind typography plugin](https://tailwindcss.com/docs/typography-plugin) |
| **UI components** |  |  |  |  |  |
| Button | 📦 stub — optional/components.css:1 | ✓ ships — [Pico button](https://picocss.com/docs/button) | [unverified] | ✓ ships `.button` — [Bulma elements](https://bulma.io/documentation/elements/) | ● missing — composed utilities — [Tailwind docs](https://tailwindcss.com/docs) |
| Form-controls | 📦 stub — optional/components.css:1 | ✓ ships — [Pico forms](https://picocss.com/docs/forms) | [unverified] | ✓ ships — [Bulma form](https://bulma.io/documentation/form/) | ● missing — composed utilities — [Tailwind docs](https://tailwindcss.com/docs) |
| Card | 📦 stub — optional/components.css:1 | ✓ ships `<article>` card — [Pico card](https://picocss.com/docs/card) | [unverified] | ✓ ships `.card` — [Bulma components](https://bulma.io/documentation/components/) | ● missing — composed utilities — [Tailwind docs](https://tailwindcss.com/docs) |
| Alert | 📦 stub — optional/components.css:1 | ● missing — [Pico docs](https://picocss.com/docs) | [unverified] | ✓ ships `.notification`/`.message` — [Bulma components](https://bulma.io/documentation/components/) | ● missing — composed utilities — [Tailwind docs](https://tailwindcss.com/docs) |
| Badge | 📦 stub — optional/components.css:1 | ● missing — [Pico docs](https://picocss.com/docs) | [unverified] | ✓ ships `.tag` — [Bulma elements](https://bulma.io/documentation/elements/) | ● missing — composed utilities — [Tailwind docs](https://tailwindcss.com/docs) |
| Modal/Dialog | 🟡 partial — reset only — core/reset.css:98 | ✓ ships `<dialog>` styling — [Pico modal](https://picocss.com/docs/modal) | [unverified] | ✓ ships `.modal` — [Bulma components](https://bulma.io/documentation/components/) | ● missing — composed utilities — [Tailwind docs](https://tailwindcss.com/docs) |
| Navbar | 📦 stub — optional/components.css:1 | ✓ ships `<nav>` styling — [Pico nav](https://picocss.com/docs/nav) | [unverified] | ✓ ships `.navbar` — [Bulma components](https://bulma.io/documentation/components/) | ● missing — composed utilities — [Tailwind docs](https://tailwindcss.com/docs) |
| Breadcrumb | 📦 stub — optional/components.css:1 | ● missing — [Pico nav](https://picocss.com/docs/nav) | [unverified] | ✓ ships `.breadcrumb` — [Bulma components](https://bulma.io/documentation/components/) | ● missing — composed utilities — [Tailwind docs](https://tailwindcss.com/docs) |
| Pagination | 📦 stub — optional/components.css:1 | ● missing — [Pico docs](https://picocss.com/docs) | [unverified] | ✓ ships `.pagination` — [Bulma components](https://bulma.io/documentation/components/) | ● missing — composed utilities — [Tailwind docs](https://tailwindcss.com/docs) |
| Tabs | 📦 stub — optional/components.css:1 | ● missing — [Pico docs](https://picocss.com/docs) | [unverified] | ✓ ships `.tabs` — [Bulma components](https://bulma.io/documentation/components/) | ● missing — composed utilities — [Tailwind docs](https://tailwindcss.com/docs) |
| Accordion | 🟡 partial — `summary` cursor — core/reset.css:74 | ✓ ships `<details>` — [Pico accordion](https://picocss.com/docs/accordion) | [unverified] | ● missing — [Bulma components](https://bulma.io/documentation/components/) | ● missing — composed utilities — [Tailwind docs](https://tailwindcss.com/docs) |
| Tooltip | 📦 stub — optional/components.css:1 | ✓ ships `data-tooltip` — [Pico tooltip](https://picocss.com/docs/tooltip) | [unverified] | ● missing — removed in v1 — [Bulma components](https://bulma.io/documentation/components/) | ● missing — composed utilities — [Tailwind docs](https://tailwindcss.com/docs) |
| Toast | 📦 stub — optional/components.css:1 | ● missing — [Pico docs](https://picocss.com/docs) | [unverified] | 🟡 partial — `.notification` is closest — [Bulma elements](https://bulma.io/documentation/elements/) | ● missing — composed utilities — [Tailwind docs](https://tailwindcss.com/docs) |
| Dropdown | 📦 stub — optional/components.css:1 | ✓ ships `<details role="list">` — [Pico dropdown](https://picocss.com/docs/dropdown) | [unverified] | ✓ ships `.dropdown` — [Bulma components](https://bulma.io/documentation/components/) | ● missing — composed utilities — [Tailwind docs](https://tailwindcss.com/docs) |
| Progress | 🟡 partial — element reset — core/base.css:182 | ✓ ships `<progress>` styling — [Pico progress](https://picocss.com/docs/progress) | [unverified] | ✓ ships `.progress` — [Bulma elements](https://bulma.io/documentation/elements/) | ● missing — composed utilities — [Tailwind docs](https://tailwindcss.com/docs) |
| Table | 🟡 partial — element reset — core/reset.css:88 | ✓ ships `<table>` styling — [Pico table](https://picocss.com/docs/table) | [unverified] | ✓ ships `.table` — [Bulma elements](https://bulma.io/documentation/elements/) | ● missing — composed utilities — [Tailwind docs](https://tailwindcss.com/docs) |
| **Utilities** |  |  |  |  |  |
| Spacing utilities | 📦 stub — optional/utilities.css:1 | ● missing — [Pico classless](https://picocss.com/docs/classless) (classless by design) | [unverified] | ✓ ships `m-*`/`p-*` 0–6 — [Bulma helpers](https://bulma.io/documentation/helpers/) | ✓ ships full `m-*`/`p-*` scale — [Tailwind docs](https://tailwindcss.com/docs) |
| Typography utilities | 📦 stub — optional/utilities.css:1 | ● missing — [Pico classless](https://picocss.com/docs/classless) | [unverified] | ✓ ships `is-size-*`/`has-text-*` — [Bulma helpers](https://bulma.io/documentation/helpers/) | ✓ ships `text-*`/`font-*`/`leading-*` — [Tailwind font-size](https://tailwindcss.com/docs/font-size) |
| Color utilities | 📦 stub — optional/utilities.css:1 | ● missing — [Pico classless](https://picocss.com/docs/classless) | [unverified] | ✓ ships `has-text-*`/`has-background-*` — [Bulma helpers](https://bulma.io/documentation/helpers/) | ✓ ships `text-*`/`bg-*` palette — [Tailwind colors](https://tailwindcss.com/docs/colors) |
| Display utilities | 📦 stub — optional/utilities.css:1 | ● missing — [Pico classless](https://picocss.com/docs/classless) | [unverified] | ✓ ships `is-block`/`is-flex`/`is-hidden` — [Bulma helpers](https://bulma.io/documentation/helpers/) | ✓ ships `block`/`flex`/`hidden` — [Tailwind docs](https://tailwindcss.com/docs) |
| Flex/grid helpers | 📦 stub — optional/utilities.css:1 | ● missing — [Pico classless](https://picocss.com/docs/classless) | [unverified] | ✓ ships `is-flex-*` — [Bulma helpers](https://bulma.io/documentation/helpers/) | ✓ ships `flex-*`/`grid-*` — [Tailwind docs](https://tailwindcss.com/docs) |
| Border / radius utilities | 📦 stub — optional/utilities.css:1 | ● missing — [Pico classless](https://picocss.com/docs/classless) | [unverified] | 🟡 partial — `is-radiusless`/`is-shadowless` — [Bulma helpers](https://bulma.io/documentation/helpers/) | ✓ ships `border-*`/`rounded-*` — [Tailwind border-radius](https://tailwindcss.com/docs/border-radius) |
| Position utilities | 📦 stub — optional/utilities.css:1 | ● missing — [Pico classless](https://picocss.com/docs/classless) | [unverified] | 🟡 partial — `is-relative`/`is-clipped` — [Bulma helpers](https://bulma.io/documentation/helpers/) | ✓ ships `static/relative/absolute/fixed/sticky` — [Tailwind docs](https://tailwindcss.com/docs) |
| Sizing utilities | 📦 stub — optional/utilities.css:1 | ● missing — [Pico classless](https://picocss.com/docs/classless) | [unverified] | ✓ ships `is-{full,half,...}width` — [Bulma helpers](https://bulma.io/documentation/helpers/) | ✓ ships `w-*`/`h-*`/`max-*` — [Tailwind docs](https://tailwindcss.com/docs) |
| Z-index utilities | 📦 stub — optional/utilities.css:1 | ● missing — [Pico classless](https://picocss.com/docs/classless) | [unverified] | ● missing — [Bulma helpers](https://bulma.io/documentation/helpers/) | ✓ ships `z-*` — [Tailwind docs](https://tailwindcss.com/docs) |
| **States** |  |  |  |  |  |
| .is-* state markers | ✓ ships 35 markers — core/states.css:27 | ● missing — [Pico classless](https://picocss.com/docs/classless) (relies on ARIA + element state) | [unverified] | ✓ ships `is-active`/`is-loading`/... — [Bulma elements](https://bulma.io/documentation/elements/) | ● missing — uses ARIA + variants — [Tailwind docs](https://tailwindcss.com/docs) |
| Loading/skeleton/busy | ✓ ships spinner + shimmer — core/states.css:61 | ✓ ships `aria-busy="true"` — [Pico loading](https://picocss.com/docs/loading) | [unverified] | 🟡 partial — `is-loading` on button only — [Bulma elements](https://bulma.io/documentation/elements/) | ● missing — composed `animate-pulse` — [Tailwind animation](https://tailwindcss.com/docs/animation) |
| **Themes / dark mode** |  |  |  |  |  |
| prefers-color-scheme | ✓ ships — core/base.css:24 | ✓ ships — [Pico color schemes](https://picocss.com/docs/color-schemes) | [unverified] | ✓ ships — [Bulma customize](https://bulma.io/documentation/customize/) | ✓ ships `dark:` media variant — [Tailwind dark mode](https://tailwindcss.com/docs/dark-mode) |
| [data-theme] | ✓ ships — core/base.css:32 | ✓ ships `data-theme="light\|dark"` — [Pico color schemes](https://picocss.com/docs/color-schemes) | [unverified] | ✓ ships `data-theme` — [Bulma customize](https://bulma.io/documentation/customize/) | 🟡 partial — class strategy via `dark:` — [Tailwind dark mode](https://tailwindcss.com/docs/dark-mode) |
| Scoped theming on any element | ✓ ships `[data-theme]` on any element — core/base.css:32 | 🟡 partial — `data-theme` recommended on root — [Pico color schemes](https://picocss.com/docs/color-schemes) | [unverified] | 🟡 partial — `data-theme` documented on `:root` — [Bulma customize](https://bulma.io/documentation/customize/) | 🟡 partial — class on any ancestor — [Tailwind dark mode](https://tailwindcss.com/docs/dark-mode) |
| forced-colors mode | ✓ ships ring + shadow neutralisation — core/accessibility.css:153 | ● missing — [Pico color schemes](https://picocss.com/docs/color-schemes) | [unverified] | ● missing — [Bulma customize](https://bulma.io/documentation/customize/) | 🟡 partial — `forced-color-adjust-*` utilities — [Tailwind docs](https://tailwindcss.com/docs) |
| **Motion** |  |  |  |  |  |
| prefers-reduced-motion gating | ✓ ships hard `!important` block — core/accessibility.css:38 | ● missing — [Pico docs](https://picocss.com/docs) | [unverified] | ● missing — [Bulma start](https://bulma.io/documentation/overview/start/) | ✓ ships `motion-reduce:` variant — [Tailwind animation](https://tailwindcss.com/docs/animation) |
| Named animation presets | ✓ ships fade/slide/scale 8 keyframes — core/motion.css:55 | ● missing — [Pico docs](https://picocss.com/docs) | [unverified] | ● missing — [Bulma start](https://bulma.io/documentation/overview/start/) | ✓ ships `animate-spin/ping/pulse/bounce` — [Tailwind animation](https://tailwindcss.com/docs/animation) |
| View-transition support | ✓ ships `::view-transition-old/new` — core/motion.css:41 | ● missing — [Pico docs](https://picocss.com/docs) | [unverified] | ● missing — [Bulma start](https://bulma.io/documentation/overview/start/) | 🟡 partial — `view-transition-name-*` utilities — [Tailwind docs](https://tailwindcss.com/docs) |
| Scroll-driven animation tokens | 🟡 partial — range tokens only — core/tokens.css:588 | ● missing — [Pico docs](https://picocss.com/docs) | [unverified] | ● missing — [Bulma start](https://bulma.io/documentation/overview/start/) | 🟡 partial — `animation-timeline-*` utilities — [Tailwind docs](https://tailwindcss.com/docs) |
| **Accessibility** |  |  |  |  |  |
| :focus-visible | ✓ ships hardened ring — core/accessibility.css:29 | ✓ ships — [Pico classless](https://picocss.com/docs/classless) | [unverified] | ✓ ships — [Bulma start](https://bulma.io/documentation/overview/start/) | ✓ ships `focus-visible:` variant — [Tailwind docs](https://tailwindcss.com/docs) |
| sr-only / visually-hidden | ✓ ships hardened — core/accessibility.css:115 | ● missing — [Pico classless](https://picocss.com/docs/classless) | [unverified] | ✓ ships `is-sr-only` — [Bulma helpers](https://bulma.io/documentation/helpers/) | ✓ ships `sr-only` — [Tailwind docs](https://tailwindcss.com/docs) |
| Skip link | ✓ ships `.skip-link` — core/accessibility.css:130 | ● missing — [Pico classless](https://picocss.com/docs/classless) | [unverified] | ● missing — [Bulma helpers](https://bulma.io/documentation/helpers/) | ● missing — composed utilities — [Tailwind docs](https://tailwindcss.com/docs) |
| Touch-target enforcement (pointer:coarse) | ✓ ships 44×44 min — core/accessibility.css:87 | ● missing — [Pico forms](https://picocss.com/docs/forms) | [unverified] | ● missing — [Bulma form](https://bulma.io/documentation/form/) | ● missing — manual — [Tailwind docs](https://tailwindcss.com/docs) |
| prefers-contrast: more | ✓ ships ring/hr boost — core/accessibility.css:61 | ● missing — [Pico classless](https://picocss.com/docs/classless) | [unverified] | ● missing — [Bulma start](https://bulma.io/documentation/overview/start/) | 🟡 partial — `contrast-more:` variant — [Tailwind docs](https://tailwindcss.com/docs) |
| prefers-reduced-transparency | ✓ ships backdrop opacity — core/accessibility.css:74 | ● missing — [Pico classless](https://picocss.com/docs/classless) | [unverified] | ● missing — [Bulma start](https://bulma.io/documentation/overview/start/) | ● missing — [Tailwind docs](https://tailwindcss.com/docs) |
| **Print** |  |  |  |  |  |
| @page | ✓ ships size + margin — core/print.css:12 | ● missing — [Pico classless](https://picocss.com/docs/classless) | [unverified] | ● missing — [Bulma start](https://bulma.io/documentation/overview/start/) | ● missing — [Tailwind docs](https://tailwindcss.com/docs) (only `print:` variant) |
| Link expansion (`a[href]::after`) | ✓ ships URL after links — core/print.css:26 | ● missing — [Pico classless](https://picocss.com/docs/classless) | [unverified] | ● missing — [Bulma start](https://bulma.io/documentation/overview/start/) | ● missing — [Tailwind docs](https://tailwindcss.com/docs) |
| break-* hardening | ✓ ships `break-inside`/`break-after` — core/print.css:41 | ● missing — [Pico classless](https://picocss.com/docs/classless) | [unverified] | ● missing — [Bulma start](https://bulma.io/documentation/overview/start/) | 🟡 partial — `break-*` utilities, no print baseline — [Tailwind docs](https://tailwindcss.com/docs) |
| **Responsive** |  |  |  |  |  |
| Media-query breakpoints | ⚫ out-of-scope — breakpoint-free by design — core/layout.css:174 | 🟡 partial — Sass `$breakpoints` — [Pico Sass](https://picocss.com/docs/sass) | [unverified] | ✓ ships `is-mobile/tablet/...` — [Bulma columns](https://bulma.io/documentation/columns/) | ✓ ships `sm/md/lg/xl/2xl` — [Tailwind responsive design](https://tailwindcss.com/docs/responsive-design) |
| Container queries | ✓ ships 5 inline `@container` — core/layout.css:305 | ● missing — [Pico grid](https://picocss.com/docs/grid) | [unverified] | ● missing — [Bulma columns](https://bulma.io/documentation/columns/) | ✓ ships `@sm/@md/.../@7xl` — [Tailwind responsive design](https://tailwindcss.com/docs/responsive-design) |
| Fluid clamp tokens | ✓ ships text + spacing — core/tokens.css:370 | ● missing — [Pico typography](https://picocss.com/docs/typography) | [unverified] | ● missing — [Bulma helpers](https://bulma.io/documentation/helpers/) | ● missing — fixed scale — [Tailwind font-size](https://tailwindcss.com/docs/font-size) |
| **Browser-support floor** |  |  |  |  |  |
| Declared floor | ✓ ships Safari 15.4 / Chrome 99 / Firefox 97 — core/layers.css:5 | 🟡 partial — "all modern browsers", no version floor — [Pico docs](https://picocss.com/docs) | [unverified] | 🟡 partial — modern browsers, no explicit floor — [Bulma start](https://bulma.io/documentation/overview/start/) | 🟡 partial — Safari 16.4+ / Chrome 111+ / Firefox 128+ for v4 — [Tailwind docs](https://tailwindcss.com/docs) |
| Cascade-layer baseline | ✓ ships `@layer` declaration — core/layers.css:5 | ● missing — no `@layer` use — [Pico docs](https://picocss.com/docs) (cf. [caniuse cascade layers](https://caniuse.com/css-cascade-layers)) | [unverified] | ● missing — no `@layer` use — [Bulma start](https://bulma.io/documentation/overview/start/) | 🟡 partial — `@layer base/components/utilities` — [Tailwind adding custom styles](https://tailwindcss.com/docs/adding-custom-styles) |
| **Distribution** |  |  |  |  |  |
| `<link>`-only usage | ✓ ships file-per-layer — core/layers.css:1 | ✓ ships CDN link — [Pico classless](https://picocss.com/docs/classless) | [unverified] | ✓ ships CDN link — [Bulma start](https://bulma.io/documentation/overview/start/) | ● missing — v4 mandates CLI/PostCSS build — [Tailwind docs](https://tailwindcss.com/docs) |
| Pre-built bundle | ✓ ships essential + full — dist/slashed.essential.css:1 | ✓ ships `pico.min.css` — [Pico classless](https://picocss.com/docs/classless) | [unverified] | ✓ ships `bulma.min.css` — [Bulma start](https://bulma.io/documentation/overview/start/) | ✓ ships Play CDN — [Tailwind docs](https://tailwindcss.com/docs) |
| npm/CDN | 🟡 partial — CDN via GitHub raw, not on npm — dist/slashed.essential.css:1 | ✓ ships npm + jsDelivr — [Pico classless](https://picocss.com/docs/classless) | [unverified] | ✓ ships npm + cdnjs — [Bulma start](https://bulma.io/documentation/overview/start/) | ✓ ships npm + Play CDN — [Tailwind docs](https://tailwindcss.com/docs) |
| Sass dependency | ⚫ out-of-scope — no build step — core/layers.css:1 | 🟡 partial — Sass available, classless CSS shipped — [Pico Sass](https://picocss.com/docs/sass) | [unverified] | ✓ ships Sass-first — [Bulma customize](https://bulma.io/documentation/customize/) | ⚫ out-of-scope — CSS-native v4 — [Tailwind docs](https://tailwindcss.com/docs) |
| PostCSS dependency | ⚫ out-of-scope — no build step — core/layers.css:1 | ⚫ out-of-scope — [Pico classless](https://picocss.com/docs/classless) | [unverified] | ⚫ out-of-scope — [Bulma start](https://bulma.io/documentation/overview/start/) | ✓ ships v4 PostCSS plugin — [Tailwind adding custom styles](https://tailwindcss.com/docs/adding-custom-styles) |
| JS runtime dependency | ● missing — core/layers.css:1 | ● missing — [Pico classless](https://picocss.com/docs/classless) | ● missing | ● missing — [Bulma start](https://bulma.io/documentation/overview/start/) | ● missing — [Tailwind docs](https://tailwindcss.com/docs) |
| Cascade-layer based stacking | ✓ ships 13-layer order — core/layers.css:5 | ● missing — [Pico classless](https://picocss.com/docs/classless) | [unverified] | ● missing — [Bulma start](https://bulma.io/documentation/overview/start/) | 🟡 partial — `@layer base/components/utilities` — [Tailwind adding custom styles](https://tailwindcss.com/docs/adding-custom-styles) |

## 4. Findings

Sekcja zawiera 20 ustaleń uporządkowanych malejąco wg severity (`critical → high → medium → low → nit`). Każde ustalenie cytuje konkretny `path:line` z drzewa źródłowego na commicie `e2d8165` oraz co najmniej jeden URL referencyjny z [Załącznika C / sources.md](#10-appendix-c--sources-cited). Trzy świadome stuby (`optional/components.css`, `optional/utilities.css`, `optional/tokens.components.css`) raportowane są jako `gap`, nigdy `bug` — zgodnie z user-confirmed deliberate-stub. Trzy udokumentowane intencjonalne tradeoffy z `docs/architecture.md` § Known intentional tradeoffs (binary `sign(0.6 - l)`, `html:focus-within { scroll-behavior: auto }`, V-shaped ramp `base-*`) są w tej sekcji wyłącznie informacyjne (`docs`); polemika żyje w sekcji 7. Stałe stwierdzenia historyczne z poprzednich audytów, które kod już rozwiązuje (BUG-1/2/3, WARN-1, forced-colors absent, scroll-driven tokens, font-feature tokens, presets `sf-spin`/`sf-shimmer`-only, 4-stopniowa skala `font-weight`), są weryfikowane jako `⚠️ stale` w sekcji 5 i celowo nie są refilowane jako świeże ustalenia.

### F-01 — Brak bibliotecznych komponentów UI: `optional/components.css` jest pustym szkieletem
Severity:   critical
Category:   gap
Evidence:   `optional/components.css:7-11` — całe wnętrze warstwy to znacznik pracy:
```css
@layer slashed.components {
  /* TODO */
}
```
Compared to: Pico v2 dostarcza pełen katalog semantycznych komponentów bez klas (button, form, card, modal, nav, table, accordion, dropdown, tooltip, progress) — patrz [Pico button](https://picocss.com/docs/button). Bulma v1 ma 11 elementów + 10 komponentów (`.button`, `.card`, `.modal`, `.notification`, `.tag`, `.navbar`, `.breadcrumb`, `.pagination`, `.tabs`, `.message`, …) — patrz [Bulma elements](https://bulma.io/documentation/elements/) i [Bulma components](https://bulma.io/documentation/components/).
Impact:     Konsument linkujący `slashed.full.css` w gotowej stronie nie dostaje żadnego renderowanego buttona, karty, modala ani alertu — tylko prymitywy układu z `core/layout.css` i tokeny. Każdy projekt poza demo musi sam napisać warstwę komponentów, co przekreśla obietnicę "no build, no Node, just link CSS" dla aplikacji aspirujących do parytetu z Pico/Bulmą.
Recommendation: Utrzymać status `gap`, nie przekształcać w `bug` — stuby są celowe (potwierdzone przez użytkownika) i opisane w `docs/architecture.md` § Deferred. Zaprojektować pierwszą iterację warstwy komponentów (button, card, alert, modal — minimum produktowy) jako oddzielną epicę po zamknięciu tego audytu; do tego czasu README i wiersz "What's not here yet" w sekcji 1 mają jawnie wymieniać brakujące komponenty.
Effort:     L

### F-02 — Floor wsparcia przeglądarek w README jest niezgodny z faktycznym feature-line frameworka
Severity:   high
Category:   docs
Evidence:   `README.md:113-117` deklaruje cascade-layer baseline jako próg:
```text
Targets modern browsers; requires native cascade layers (floor:
~2022 — Safari 15.4, Chrome 99, Firefox 97).
```
Tymczasem `core/tokens.css:91` używa `light-dark()`, `core/tokens.css:152-163` używa `sign()`, `core/tokens.css:50` rejestruje 12 `@property` z `<color>` oraz typowanymi liczbami, a `optional/tokens.palette.css:30` używa `color-mix(in oklch …)` z relative color syntax.
Compared to: Tailwind v4 jawnie deklaruje wymóg Safari 16.4+ / Chrome 111+ / Firefox 128+ ze względu na te same prymitywy — patrz [Tailwind v4 colors](https://tailwindcss.com/docs/colors). Realny feature-line SLASHED to: `light-dark()` Safari 17.5+ ([caniuse light-dark](https://caniuse.com/mdn-css_types_color_light-dark)), `@property` Firefox 128+ ([caniuse @property](https://caniuse.com/mdn-css_at-rules_property)), `oklch()` + relative color syntax Safari 16.4+ ([caniuse oklch](https://caniuse.com/mdn-css_types_color_oklch), [caniuse relative colors](https://caniuse.com/css-relative-colors)), `color-mix()` Firefox 113+ ([caniuse color-mix](https://caniuse.com/mdn-css_types_color_color-mix)), `:has()` Firefox 121+ ([caniuse :has](https://caniuse.com/css-has)), `sign()` cross-browser dopiero od mid-2024 ([caniuse sign()](https://caniuse.com/mdn-css_types_sign)).
Impact:     Konsument na bazie deklaracji README zakłada, że framework działa na Safari 15.4 / Firefox 97 i wdraża go do produkcji — w rzeczywistości na tych przeglądarkach ciemny motyw jest nieprzełączalny (`light-dark()` nieobsługiwane), tokeny `text--on-*` zwracają `unset` (`sign()` brak), a paleta `optional/tokens.palette.css` nie generuje stopni (`color-mix` brak na Firefox <113). To bug-class incident w przeglądarce, którą README oficjalnie dopuszcza.
Recommendation: Przepisać akapit `Browser support` w README — podać prawdziwy próg (Safari 17.5 / Chrome 119 / Firefox 128, datowane na maj 2026) i jednym zdaniem wyjaśnić, że cascade-layer baseline jest wymogiem koniecznym, ale nie wystarczającym; zaktualizować `docs/architecture.md` § Browser support tym samym tekstem.
Effort:     S

### F-03 — Warstwa `slashed.themes` zadeklarowana, ale w drzewie źródłowym faktycznie pusta
Severity:   medium
Category:   inconsistency
Evidence:   `core/layers.css:13` deklaruje warstwę i `docs/architecture.md:68` opisuje jej zawartość ("Dark mode, forced colors, brand palettes"):
```css
slashed.themes,
```
Faktyczne reguły dark-mode siedzą jednak w `core/base.css:32-33` (warstwa `slashed.base`), a forced-colors w `core/accessibility.css:153-166` (warstwa `slashed.accessibility`) — `grep -RIn 'slashed.themes' core/ optional/` zwraca wyłącznie deklarację z `core/layers.css`.
Compared to: Tailwind v4 trzyma `dark:` w spójnym mechanizmie variant-based — patrz [Tailwind dark mode](https://tailwindcss.com/docs/dark-mode); Pico v2 kapsułkuje motywy w `[data-theme]` blokach z dokumentem-schedulerem — patrz [Pico color schemes](https://picocss.com/docs/color-schemes). W obu przypadkach jest jeden węzeł CSS z motywami, nie deklaracja-bez-implementacji.
Impact:     Ktoś próbujący dodać własny motyw przez `@layer slashed.themes { … }` (zgodnie z `docs/architecture.md`) odkryje, że jego reguły wygrywają z `[data-theme]` w `slashed.base` — bo `themes` jest wyżej w stosie. Dla maintenance-team gap "deklaracja vs implementacja" zwiększa koszt nawigacji i utrudnia code-review.
Recommendation: Przenieść bloki `[data-theme="light"|="dark"]` z `core/base.css:32-33` oraz `@media (forced-colors: active)` z `core/accessibility.css:153-166` do nowego pliku `core/themes.css` z `@layer slashed.themes { … }`, dodać go do `bundle.config.json` essential bundle bezpośrednio za `core/states.css` (tj. tam gdzie ma stać wg layer order). Alternatywnie: usunąć deklarację `slashed.themes` z `core/layers.css` i zaktualizować `docs/architecture.md` jeśli intencją jest by motywy żyły rozproszone.
Effort:     M

### F-04 — `prefers-contrast: more` zwiększa wyłącznie grubość focus-ringa, nie podnosi kontrastu treści
Severity:   medium
Category:   a11y
Evidence:   `core/accessibility.css:61-69`:
```css
@media (prefers-contrast: more) {
  :root { --sf-focus-ring-width: 3px; }
  hr    { border-block-start-width: 2px; }
}
```
Cały blok ignoruje semantyczne tokeny tekstowe (`--sf-color-text--muted`, `--sf-color-border--subtle`) i tokeny statusowe.
Compared to: Pico v2 ma w pełni zhardenowaną gamę kolorów testowanych pod kątem AA — patrz [Pico colors](https://picocss.com/docs/colors); Tailwind v4 oferuje variant `contrast-more:` pozwalający przesterować dowolne klasy utility — patrz [Tailwind v4 colors](https://tailwindcss.com/docs/colors). SLASHED nie podbija ani jednego rozmytego koloru, mimo że ma na wejściu request użytkownika.
Impact:     Użytkownik systemowy z włączoną opcją "Increase contrast" (macOS, Windows High Contrast pre-forced-colors, Android) dostaje grubszy focus-ring, ale tekst przez `--sf-color-text--muted` nadal ma kontrast bliski progu AA Large; w trybie `dark` z brand `tertiary` (L 0.55) wynik jest niezdolny do AA Normal. To regres dostępności w grupie najbardziej wrażliwej.
Recommendation: W bloku `@media (prefers-contrast: more)` przesterować również: `--sf-color-text--muted: var(--sf-color-text)`, `--sf-color-border--subtle: var(--sf-color-border)`, `--sf-color-text--placeholder: var(--sf-color-text--secondary)` oraz wymusić `text-decoration: underline` na linkach inline. Każdy override jednolinijkowy w istniejącym bloku.
Effort:     S

### F-05 — `docs/demo.html` pokrywa 36 z 101 zadeklarowanych klas `.sf-*` i 6 z 35 klas `.is-*`
Severity:   medium
Category:   docs
Evidence:   Liczniki:
```sh
grep -hoE '\.sf-[a-z0-9-]+' core/*.css optional/*.css | sort -u | wc -l   # 101
grep -oE 'class="[^"]*"' docs/demo.html | grep -oE 'sf-[a-z0-9-]+' | sort -u | wc -l   # 36
grep -hoE '\.is-[a-z-]+' core/*.css optional/*.css | sort -u | wc -l      # 35
grep -oE 'class="[^"]*"' docs/demo.html | grep -oE 'is-[a-z-]+' | sort -u | wc -l       # 6
```
Niedemonstrowane (próbka): `sf-alternate`, `sf-box`, `sf-center`, `sf-imposter`, `sf-subgrid`, `sf-grid--xs/--s/--m/--l/--xl`, `sf-grid-1`, `sf-grid-6`, `sf-grid-1-2`, `sf-grid-3-1`, `sf-section--s/--l/--xl`, `sf-section-group`, `sf-cover--min/--max/--padding-s/--padding-l`, `sf-container--full/--wide`, `sf-cluster--2xs/--xs/--center/--end/--between/--no-wrap`, `sf-stack--2xl/--3xl/--center/--end/--stretch`, `sf-frame--3-2/--4-3/--golden`, `sf-sidebar--narrow/--wide`, `sf-fade-out`, `sf-scale-down`, `sf-bento--2/--4/--compact/--tall` oraz prawie cała rodzina `.is-*` (`is-active`, `is-busy`, `is-clickable`, `is-clipped`, `is-collapsed`, `is-current`, `is-danger`, `is-draggable`, `is-dragging`, `is-drop-target`, `is-empty`, `is-error`, `is-expanded`, `is-fixed`, `is-highlighted`, `is-info`, `is-invalid`, `is-overlay`, `is-pinned`, `is-readonly`, `is-scrollable`, `is-selected`, `is-success`, `is-sticky`, `is-unselectable`, `is-valid`, `is-visible`, `is-warning`).
Compared to: Pico v2 ma osobną stronę docs dla każdej rodziny komponentów — patrz [Pico docs](https://picocss.com/docs); Bulma v1 dla każdego helpera ma sekcję z live-przykładem — patrz [Bulma helpers](https://bulma.io/documentation/helpers/). SLASHED ma jedną stronę `docs/demo.html` (1832 linie) prezentującą głównie rdzeń.
Impact:     Konsument oceniający framework przed adopcją nie wie, że istnieje `.sf-imposter` ani `.sf-bento--tall`, bo demo ich nie pokazuje — ryzykuje zduplikowanie funkcjonalności w aplikacji albo odrzucenie SLASHED na tym etapie. Maintenance-team nie ma też ścieżki regression-przez-eyeball (klasa pominięta w demo nie zostanie zauważona, gdy ktoś ją niechcący zepsuje).
Recommendation: Dodać do `docs/demo.html` sekcję "Layout primitives — full coverage" z minimalnym wzorcem dla każdej brakującej klasy układu (`.sf-imposter`, wszystkie warianty `.sf-bento`, wszystkie warianty `.sf-grid-N-M`, wszystkie warianty `.sf-cluster--*` i `.sf-stack--*`) oraz dla każdej klasy stanu sekcję "States" z listą `.is-*` na sztucznym przycisku/diviku.
Effort:     M

### F-06 — `sign(0.6 - l) * 999` wymusza binarny próg kontrastu tekst-na-kolorze (informacyjne, NIE bug)
Severity:   medium
Category:   docs
Evidence:   `core/tokens.css:152-163`:
```css
--sf-color-text--on-tertiary:  oklch(from var(--sf-color-tertiary)   clamp(0.1, sign(0.6 - l) * 999, 0.95) 0 0);
--sf-color-text--on-neutral:   oklch(from var(--sf-color-neutral)    clamp(0.1, sign(0.6 - l) * 999, 0.95) 0 0);
```
`docs/architecture.md:159-170` § Known intentional tradeoffs eksplicytnie kodyfikuje ten zachowanie i dopuszcza AA Large (~4.2:1) dla `tertiary`/`neutral`.
Compared to: Pico v2 dostarcza ręcznie sparowane jasny/ciemny tekst dla każdej hue family — patrz [Pico colors](https://picocss.com/docs/colors); Tailwind v4 zostawia decyzję autorowi (`text-white`/`text-black` na bazie utility) — patrz [Tailwind colors](https://tailwindcss.com/docs/colors). Przyszłe `contrast-color()` rozwiąże to natywnie ([caniuse contrast-color](https://caniuse.com/mdn-css_types_color_oklch) — feature-line jeszcze niedojrzały).
Impact:     Konsument używający domyślnego `--sf-color-tertiary` lub `--sf-color-neutral` jako tła karty z napisem `--sf-color-text--on-*` dostanie tekst o kontraście ~4.2:1 — niezgodny z WCAG AA Normal dla tekstu poniżej 18pt. Ustalenie jest informacyjne; sekcja 7 audytu polemizuje z tradeoffem na poziomie projektowym.
Recommendation: Pozostawić zachowanie zgodne z `docs/architecture.md` — to nie jest bug. Dodać do README jednoakapitową notę "Text-on-color is AA Large for `tertiary`/`neutral`; use `--sf-color-text` for body copy" z linkiem do rozdziału § Known intentional tradeoffs. Po dojrzeniu `contrast-color()` wymienić wyrażenie `sign(0.6 - l)` na natywną funkcję.
Effort:     XS

### F-07 — README promuje 14 ręcznych `<link>` ponad pre-built bundle, co czyni kolejność load-bearing
Severity:   medium
Category:   foot-gun
Evidence:   `README.md:17-37` przedstawia jako pierwsze 14 niezależnych `<link>` w ścisłym porządku (`core/layers.css` najpierw, `optional/legacy.css` ostatni); dopiero `README.md:39-48` opcjonalnie ("**Recommended:**") wspomina o `slashed.essential.css` / `slashed.full.css`:
```html
<link rel="stylesheet" href="core/layers.css">
<link rel="stylesheet" href="core/tokens.css">
…
<link rel="stylesheet" href="optional/legacy.css">
```
Compared to: Tailwind v4 ma domyślnie pojedynczy plik wynikowy z dyrektywą `@import "tailwindcss"` i dopiero zaawansowani konfigurują warstwy — patrz [Tailwind getting started](https://tailwindcss.com/docs); Pico v2 ma jeden CDN `<link>` w pierwszym kroku quick-start — patrz [Pico docs](https://picocss.com/docs); Bulma v1 to też jeden plik — patrz [Bulma overview](https://bulma.io/documentation/overview/start/).
Impact:     Konsument kopiuje 14 tagów do swojej aplikacji i przy refaktoringu (np. zmiana kolejności linków, usunięcie nieużywanego pliku) łamie kaskadę — `core/layers.css` musi być pierwszy, inaczej `@layer` nie istnieje gdy reszta plików go używa. To classic foot-gun: wszystko działa lokalnie, łamie się dopiero w momencie, gdy ktoś wstawi własny `<link>` przed `layers.css` w `<head>`.
Recommendation: Odwrócić wagę: Quick-start ma pokazywać dwie linijki bundle (`<link rel="stylesheet" href="dist/slashed.essential.css">` lub `slashed.full.css`); 14-link-setup spakować w `<details><summary>Manual file-by-file setup (advanced)</summary>` — z jawną notą "Order matters; `core/layers.css` MUST load first". Zmiana czysto edytorska w `README.md`.
Effort:     XS

### F-08 — Literały `1px solid #999` w `core/print.css` i `2px solid/dashed` w `core/states.css` łamią regułę "every value via var()"
Severity:   low
Category:   inconsistency
Evidence:   `core/print.css:65`:
```css
border:  1px solid #999;
```
`core/states.css:74`:
```css
border:        2px solid var(--sf-color-border--strong);
```
`core/states.css:228-229`:
```css
outline:        2px dashed var(--sf-color-action);
outline-offset: 2px;
```
`docs/architecture.md:31-39` § Tokens explicitly: "Every value via `var()`."
Compared to: Tailwind v4 utility-classes nie mają literałów w wynikowym CSS (każdy `border-2` to token `var(--border-width-2)`) — patrz [Tailwind border-width](https://tailwindcss.com/docs/border-width); Bulma v1 wszystkie wymiary dla `.box` pochodzą z `$box-radius`, `$box-shadow` — patrz [Bulma customize](https://bulma.io/documentation/customize/).
Impact:     Konsument przesterowujący `--sf-border-width-2`/`--sf-color-border` (np. dla brand-skinningu) zaobserwuje, że `.is-loading::after` i `.is-drop-target` nadal mają stary wygląd — bo trzy literały po cichu obchodzą token-system. Print-style pokaże szare ramki niezależnie od motywu.
Recommendation: Zamienić literały na istniejące tokeny:
```css
/* core/print.css:65 */
border: var(--sf-border-width-1) solid var(--sf-color-border);
/* core/states.css:74 */
border: var(--sf-border-width-2) solid var(--sf-color-border--strong);
/* core/states.css:228-229 */
outline:        var(--sf-border-width-2) dashed var(--sf-color-action);
outline-offset: var(--sf-space-2xs);
```
Jeśli `--sf-border-width-1`/`--sf-border-width-2` jeszcze nie istnieją — dodać je do `core/tokens.css` w sekcji "Borders" (token `var()`-only zgodnie z architekturą).
Effort:     XS

### F-09 — `core/accessibility.css` używa literału `44px` zamiast tokena `--sf-touch-target`
Severity:   low
Category:   inconsistency
Evidence:   `core/accessibility.css:95-99`:
```css
a {
  min-height: 44px;
  min-width:  44px;
}
```
Token `core/tokens.css:613`: `--sf-touch-target: var(--sf-size-l);` — istnieje, ale nie jest tu konsumowany.
Compared to: Tailwind v4 wystawia `min-h-touch` przez tokens.json — patrz [Tailwind size](https://tailwindcss.com/docs); Pico v2 ma `--pico-form-element-height` jako single source — patrz [Pico CSS variables](https://picocss.com/docs/css-variables). Mając token, użycie literału jest dryf konsystencji.
Impact:     Konsument próbujący zmienić touch-target z 44px na 48px (np. dla projektu mobile-first) przesterowuje `--sf-touch-target` w `:root`, ale `@media (pointer: coarse)` nadal wymusza 44px na buttonach i linkach — token jest martwą deklaracją przy obecnym kodzie.
Recommendation: Zamienić literały na token w istniejącym bloku:
```css
@media (pointer: coarse) {
  button, input[type="button"], input[type="submit"], input[type="reset"],
  select, summary, a {
    min-height: var(--sf-touch-target);
    min-width:  var(--sf-touch-target);
  }
}
```
Effort:     XS

### F-10 — `.is-truncated` bez `min-width: 0` — wielokropek nie pojawia się we flex/grid track
Severity:   low
Category:   bug
Evidence:   `core/states.css:212-216`:
```css
.is-truncated {
  overflow:      hidden;
  text-overflow: ellipsis;
  white-space:   nowrap;
}
```
Compared to: Bulma v1 `.is-clipped` nie obsługuje truncation, ale Tailwind v4 helpera `truncate` wzbogaca o `min-width: 0` — patrz [Tailwind text-overflow](https://tailwindcss.com/docs). Pico v2 nie ma odpowiednika.
Impact:     Element `<span class="is-truncated">…</span>` umieszczony jako dziecko `.sf-cluster` (flex z `min-content` defaultem) nie obetnie się — w computed-style `min-width` rezolwuje do `auto = max-content`, więc kontener flexowy daje mu pełną szerokość treści zamiast wymusić ellipsy. To realna pętla bug-reportowa: "wielokropek mi nie działa".
Recommendation: Dodać jeden wiersz w istniejącej regule (zachowuje obecny set):
```css
.is-truncated {
  overflow:      hidden;
  text-overflow: ellipsis;
  white-space:   nowrap;
  min-width:     0;
}
```
Effort:     XS

### F-11 — `@media (pointer: coarse)` wymusza 44×44 na każdym `<a>`, łamiąc linki inline w paragrafach
Severity:   low
Category:   a11y
Evidence:   `core/accessibility.css:87-101`:
```css
@media (pointer: coarse) {
  button, input[type="button"], input[type="submit"], input[type="reset"],
  select, summary,
  a { min-height: 44px; min-width: 44px; }
}
```
Komentarz powyżej w `core/accessibility.css:82-86` celowo zostawia regułę "normal" jako "recommendation, not unbreakable rule" — ale selektor `a` jest zbyt szeroki.
Compared to: Pico v2 stosuje touch-target wyłącznie do `<button>`/form-controls, nie do tekstowych `<a>` — patrz [Pico forms](https://picocss.com/docs/forms); Bulma v1 nie wymusza w ogóle (właściciel projektu odpowiada) — patrz [Bulma overview](https://bulma.io/documentation/overview/start/). WCAG 2.5.5 dopuszcza wyjątek "inline link in a sentence" — selektor go nie respektuje.
Impact:     Każdy link tekstowy w akapicie na urządzeniu dotykowym zostaje rozciągnięty do 44px wysokości, łamiąc rytm wiersza i wymuszając duże białe pasy między linijkami z hipertekstem. To regresja UX dokładnie w grupie, którą reguła miała chronić.
Recommendation: Zawęzić selektor `a` do `a[role="button"], .sf-button a, nav a` (lub innej deklaracji "to jest link-jak-button"), zostawiając goły `<a>` w paragrafie nieobjęty regułą:
```css
@media (pointer: coarse) {
  button, input[type="button"], input[type="submit"], input[type="reset"],
  select, summary,
  a[role="button"] { min-height: var(--sf-touch-target); min-width: var(--sf-touch-target); }
}
```
Effort:     S

### F-12 — 106 wystąpień `oklch(from …)` w `core/tokens.css` przeliczanych przy każdym repaint
Severity:   low
Category:   perf
Evidence:   `grep -c 'oklch(from' core/tokens.css` zwraca `106`. Próbka z `core/tokens.css:152-163`:
```css
--sf-color-text--on-primary:   oklch(from var(--sf-color-primary)   clamp(0.1, sign(0.6 - l) * 999, 0.95) 0 0);
--sf-color-text--on-secondary: oklch(from var(--sf-color-secondary)  clamp(0.1, sign(0.6 - l) * 999, 0.95) 0 0);
```
Compared to: Tailwind v4 emituje statyczne klasy utility z gotowymi wartościami `oklch()` (bez relative-color przeliczania) — patrz [Tailwind theme](https://tailwindcss.com/docs/theme). Pico v2 trzyma RGB w hex, bez żadnego runtime-CSS-color-eval — patrz [Pico CSS variables](https://picocss.com/docs/css-variables).
Impact:     Strona z dużą paletą (`slashed.full.css` ładuje też `optional/tokens.palette.css` z dodatkowymi 132 `color-mix()`) zmusza silnik renderujący do re-rezolwowania wszystkich relative-color expressions przy każdej zmianie `--sf-color-primary` (np. theme-toggle). Na słabszym sprzęcie mobilnym pojedynczy theme-switch jest mierzalnie wolniejszy niż w Pico/Tailwind. Brak dokumentacji tej charakterystyki.
Recommendation: Nie precomputować — to zniszczyłoby no-build promise. Zamiast tego dodać do README sekcję "Performance characteristics" z notą o relative-color-syntax-cost i zaleceniem unikania theme-toggle w hot-path. Zaktualizować `docs/architecture.md` o akapit "Repaint cost" w § Tokens.
Effort:     S

### F-13 — 132 tokeny palety w `optional/tokens.palette.css` definiowane przez `color-mix()` per-paint
Severity:   low
Category:   perf
Evidence:   `grep -c 'color-mix' optional/tokens.palette.css` zwraca `127`. Próbka z `optional/tokens.palette.css:30-45`:
```css
--sf-color-primary-50:  color-mix(in oklch, var(--sf-color-primary)  4%, var(--sf-color-base));
--sf-color-primary-a5:  color-mix(in oklch, var(--sf-color-primary)  5%, transparent);
```
6 brand × (11 stopni + 11 alfa) ≈ 132 tokeny — wszystkie eager-evaluated.
Compared to: Tailwind v4 nadal emituje statyczne hex/oklch dla klas paletowych — patrz [Tailwind colors](https://tailwindcss.com/docs/colors); Bulma v1 generuje paletę w Sass-time, więc CSS-output jest płaski — patrz [Bulma customize](https://bulma.io/documentation/customize/).
Impact:     `slashed.full.css` ma dodatkowy koszt repaintu wprost proporcjonalny do liczby derived-tokenów (132 mixów). Na stronach lazy-load sekcjach z `data-theme="dark"` widoczny jest paint-tearing przy pierwszym wejściu w dark section. Konsument bez wiedzy o tym zjawisku diagnozuje to jako "framework jest wolny".
Recommendation: Pozostawić architekturę — to świadomy tradeoff za no-build. Rozszerzyć README § Bundles o akapit: "`slashed.full.css` adds 132 derived palette tokens computed via `color-mix(in oklch …)`. If you only need brand colors, link `slashed.essential.css` instead — palette is opt-in." Plus w `docs/architecture.md` § Tokens: "Palette is opt-in; cost-neutral if you only ship `slashed.essential.css`."
Effort:     XS

### F-14 — Brak tokenów breakpointów (świadomy wybór, ale nieoznakowany w README)
Severity:   low
Category:   DX
Evidence:   `docs/architecture.md:130-134` § Responsive design jawnie odrzuca breakpoint tokens:
```text
3. **Breakpoints** — a last resort. The framework ships no breakpoint tokens
   (custom properties can't be used in `@media`/`@container` conditions);
   hard-code a value in your own query if you truly need one.
```
W matrix sekcji 3 audytu wiersz "Breakpoint tokens" (linia 42) ma `● missing — breakpoint-free by design`.
Compared to: Tailwind v4 wystawia 5 breakpointów + container-query variants — patrz [Tailwind responsive design](https://tailwindcss.com/docs/responsive-design); Bulma v1 ma `$breakpoints` Sass map — patrz [Bulma columns sizes](https://bulma.io/documentation/columns/sizes/).
Impact:     Konsument migrujący z Tailwind/Bulma traci 30 minut szukając `--sf-breakpoint-md` zanim znajdzie akapit w `docs/architecture.md`. To friction-cost przy pierwszej godzinie z frameworkiem — nie problem inżynierski, lecz DX-ergonomic.
Recommendation: Pozostawić wybór architektoniczny. Dodać do README jednolinijkową notę pod `## Browser support`: "Responsive design is container-query-first. No `--sf-breakpoint-*` tokens — see [docs/architecture.md § Responsive design](docs/architecture.md#responsive-design)."
Effort:     XS

### F-15 — `dist/slashed.essential.css` po cichu pomija `optional/tokens.palette.css`
Severity:   low
Category:   foot-gun
Evidence:   `bundle.config.json:4-15` — essential bundle nie zawiera plików palette ani legacy:
```json
"output": "dist/slashed.essential.css",
"files": [
  "core/layers.css", "core/tokens.css", … "core/print.css"
]
```
README.md:67-72 ("Bundles") ma tabelkę porównawczą, ale nie wymienia konkretnych tokenów które się różnią.
Compared to: Tailwind v4 dystrybuuje pojedynczy plik (paleta w core, brak rozszczepienia) — patrz [Tailwind v4 colors](https://tailwindcss.com/docs/colors); Pico v2 dystrybuuje "classless" / "all" / "minimum" jako oddzielne pliki, każdy z full-paletą — patrz [Pico docs](https://picocss.com/docs).
Impact:     Konsument linkuje `slashed.essential.css`, próbuje użyć `var(--sf-color-primary-500)` w swoim CSS i dostaje pustą wartość bez ostrzeżenia (niezarejestrowane custom property). Diagnoza wymaga przeczytania `bundle.config.json` i połączenia faktów. Token-name-pattern jest publiczny (`--sf-color-*-N00` brzmi jak Tailwind), więc consumer-expectation jest "to powinno działać".
Recommendation: Rozszerzyć tabelkę "Bundles" w README.md o trzecią kolumnę "Includes palette ladder?" z `❌` dla essential, `✓` dla full. Alternatywnie: dodać do `core/tokens.css` `@property --sf-color-primary-500 { syntax: "<color>"; inherits: true; initial-value: transparent }` żeby consumer dostawał `transparent` zamiast `unset` (lepszy fail-mode).
Effort:     XS

### F-16 — Blok `accent-color` w `optional/legacy.css:80-94` jest komentarzem-no-op
Severity:   nit
Category:   docs
Evidence:   `optional/legacy.css:80-94`:
```css
/* ============================================================
   4. accent-color — form control tint
   …
   (no-op: accent-color has no CSS fallback; native default
   control colour is the accepted degradation.)
   ============================================================ */
```
Cały blok jest 15-liniowym komentarzem bez deklaracji.
Compared to: Bulma v1 nie wystawia legacy-fallbacków (Sass-only) — patrz [Bulma customize](https://bulma.io/documentation/customize/); Tailwind v4 zostawia browser-degrade autorowi — patrz [Tailwind getting started](https://tailwindcss.com/docs).
Impact:     Czytelnik `optional/legacy.css` widzi 5 numerowanych sekcji — `1. forced-colors`, `2. scrollbar-gutter`, `3. overflow-y: scroll`, `4. accent-color`, `5. (kontynuacja)` — i spodziewa się działającego kodu pod każdym numerem. Pusty blok łamie tę umowę. Dokumentacyjny.
Recommendation: Albo usunąć cały blok (4 sekcja) i opisać luki w `CHANGELOG.md` przy kolejnym release, albo przenieść komentarz do `docs/architecture.md` § Deferred. Lekka edycja jednego pliku.
Effort:     XS

### F-17 — Container-query-first jako pozytyw architektoniczny vs Tailwind classes-with-breakpoints
Severity:   nit
Category:   DX
Evidence:   `core/layout.css:27-31`:
```css
.sf-container {
  container-type: inline-size;
}
```
oraz `core/layout.css:296` (`.sf-bento`), `core/layout.css:305-358` (cztery bloki `@container (min-width: …)` na `.sf-alternate`/`.sf-bento`/`.sf-sidebar`), `core/layout.css:399-401` (`.sf-sidebar` przełącza orientację per-container, nie per-viewport).
Compared to: Tailwind v4 utrzymuje breakpoint-first model (`sm:flex`, `md:grid`) z container-query variants jako sekundarnym narzędziem — patrz [Tailwind responsive design](https://tailwindcss.com/docs/responsive-design); Pico v2 nie ma container-queries w core. SLASHED jako jedyny w porównaniu robi to natywnie i konsekwentnie.
Impact:     Konsument próbujący zrobić sidebar widget reusable na desktop i w sekcji `aside` na mobile w Tailwind ma dwa zestawy klas (responsive + container variants). W SLASHED ten sam `.sf-sidebar` przełącza się sam zależnie od kontenera, w którym żyje. To realna DX-przewaga, ale dziś niewspomniana w README.
Recommendation: Dodać do README sekcję "Why container-queries first?" (3-5 linii) z linkiem do `docs/architecture.md` § Responsive design. Headline-jeden, treść-trzy zdania, link-jeden — czysty content-edit.
Effort:     XS

### F-18 — README quick-start linkuje 3 puste pliki stub jako wymagane
Severity:   nit
Category:   docs
Evidence:   `README.md:30-34` — w bloku "optional" wymieniane są trzy pliki które są obecnie pustymi szkieletami:
```html
<link rel="stylesheet" href="optional/tokens.components.css">
<link rel="stylesheet" href="optional/components.css">
<link rel="stylesheet" href="optional/utilities.css">
```
`optional/components.css` (11 linii), `optional/utilities.css` (9 linii), `optional/tokens.components.css` (9 linii) zawierają tylko deklaracje warstw i `/* TODO */`.
Compared to: Pico v2 ma `pico.classless.css` / `pico.css` / `pico.min.css` jako kompletne, samowystarczalne pliki — patrz [Pico docs](https://picocss.com/docs); Bulma v1 nie udostępnia pustych helpers — patrz [Bulma helpers](https://bulma.io/documentation/helpers/).
Impact:     Czytelnik README wykonuje quick-start, dodaje 14 tagów, potem widzi 0 efektu od `components.css`/`utilities.css` i traci czas na diagnostykę "czemu nie ma buttona". Trzy `<link>` to 3 zbędne HTTP request bez korzyści przez cały okres do uzupełnienia warstwy komponentów.
Recommendation: Wyciąć trzy stub-`<link>` z bloku "optional" w README, zostawiając tam tylko `tokens.palette.css` i `legacy.css`. Dodać uwagę pod blokiem: "`optional/components.css`, `optional/utilities.css` and `optional/tokens.components.css` ship empty today — link them only when the component layer is published."
Effort:     XS

### F-19 — Brak deklaratywnego API `data-*`/ARIA — wszystko przez klasy, w odróżnieniu od Pico
Severity:   nit
Category:   DX
Evidence:   `grep -RIn 'data-[a-z]' core/*.css optional/*.css` zwraca tylko `core/base.css:32-33` (`[data-theme]`) — żadnego `data-tooltip`, `data-toggle`, `data-target`. Komponenty `.is-loading` (`core/states.css:60-77`) nie konsumują `aria-busy`:
```css
.is-loading {
  color:          transparent !important;
  pointer-events: none;
  position:       relative;
}
```
Compared to: Pico v2 stylizuje `aria-busy="true"` jako spinner — patrz [Pico loading](https://picocss.com/docs/loading), `data-tooltip` jako tooltip — patrz [Pico tooltip](https://picocss.com/docs/tooltip), `<details role="list">` jako dropdown — patrz [Pico dropdown](https://picocss.com/docs/dropdown). To headline value-prop "classless / semantic-HTML-first" Pico.
Impact:     Konsument używający `<button aria-busy="true">` w wycinku HTML z innego frameworka musi w SLASHED jeszcze dodać `class="is-loading"`. Dla migrującego z Pico to friction. Dla a11y-pierwszych developerów (preferują ARIA nad ad-hoc class) to gap w idiomie.
Recommendation: Dodać selektor równoległy na `[aria-busy="true"]` w `core/states.css` (alias `.is-loading`):
```css
.is-loading,
[aria-busy="true"] { /* …existing rules… */ }
```
Reszta `data-*`-API to scope kolejnej warstwy komponentów (poza FEAT) — opisać w `docs/architecture.md` § Deferred.
Effort:     S

### F-20 — `--sf-color-link--visited` rotuje hue o `+40°` bez dokumentacji
Severity:   nit
Category:   docs
Evidence:   `core/tokens.css:200`:
```css
--sf-color-link--visited:   oklch(from var(--sf-color-action) l c calc(h + 40));
```
Brak adnotacji o tym zachowaniu w `docs/architecture.md`, w `docs/color-aliases-design-decisions.md`, ani w README.
Compared to: Pico v2 trzyma `--pico-color-visited` jako jawny hex bez magic-number — patrz [Pico CSS variables](https://picocss.com/docs/css-variables); Tailwind v4 zostawia `visited:` variant autorowi — patrz [Tailwind colors](https://tailwindcss.com/docs/colors).
Impact:     Konsument debugujący "czemu mój link odwiedzony jest fioletowy zamiast zielonego jak `--sf-color-action`" musi przeczytać 723 linie `core/tokens.css` zanim natknie się na `calc(h + 40)`. To 20-minutowy time-sink w pierwszym tygodniu z frameworkiem.
Recommendation: Dodać 3-liniową notę do `docs/color-aliases-design-decisions.md`: "`--sf-color-link--visited` rotates hue of `--sf-color-action` by `+40°` (in OKLCH) to ensure visual distinction without re-defining a token. Override the whole token to disable."
Effort:     XS

## 5. Existing audits — verification

_TODO: filled by FEAT-002._

## 6. Recommendations — prioritized roadmap

_TODO: filled by FEAT-002._

## 7. Out-of-scope / disagreements

_TODO: filled by FEAT-002._

## 8. Appendix A — Full SLASHED selector inventory

Każdy podrozdział odpowiada jednemu plikowi CSS w drzewie roboczym (15 plików łącznie: 10 w `core/`, 5 w `optional/`). Cytaty `path:line` odnoszą się do commita `e2d8165fa6ea3d5307b3a22a517de1f1734fca45`. Liczniki klas, stanów i at-reguł zostały ustalone przez `grep`/`awk` na drzewie źródłowym i opisują *unikalne* nazwy selektorów w danym pliku.

### core/layers.css

- Declared layer: pojedyncza deklaracja `@layer slashed.tokens, slashed.reset, slashed.base, slashed.layout, slashed.components, slashed.utilities, slashed.states, slashed.themes, slashed.motion, slashed.accessibility, slashed.print, slashed.legacy, slashed.overrides;` w `core/layers.css:5-17` — zwykła lista nazw, bez bloków zagnieżdżonych i bez selektorów.
- Element selectors: 0.
- `.sf-*` class selectors: 0.
- `.is-*` state classes: 0.
- Pseudo-classes / attribute selectors: 0.
- At-rules: jedyną zawartością pliku jest blok `@layer ... ;` (linie 5-17). Brak `@media`, `@container`, `@supports`, `@page`, `@keyframes`, `@property`.

### core/tokens.css

- Declared layer: `@layer slashed.tokens` (`core/tokens.css:43`). Cały plik liczy 723 linie, zawartość zawinięta w jeden blok layera.
- Selectors: tylko deklaracje `:root { ... }` (np. `core/tokens.css:75`, `core/tokens.css:104`, kolejne grupy do `core/tokens.css:723`); brak selektorów typu, klasy ani stanu — pełna lista wartości znajduje się w Załączniku B.
- At-rules: 12 rejestracji `@property` (`core/tokens.css:50-55`, `:59-63`, `:67`) — 6 marek `*-light`, 5 statusów `*-light`, plus `--sf-is-dark` (`<integer>`); brak `@media`, `@container`, `@supports`, `@page`, `@keyframes`.

### core/tokens.layout.css

- Declared layer: `@layer slashed.tokens` (`core/tokens.layout.css:20`). Zawartość: pojedynczy blok `:root { ... }` (`core/tokens.layout.css:21-122`).
- Selectors: wyłącznie `:root`; brak `.sf-*`, `.is-*`, pseudo-klas, selektorów atrybutu.
- At-rules: brak. Plik to czysta deklaracja tokenów layoutu (Załącznik B wymienia 39 pozycji).

### core/reset.css

- Declared layer: `@layer slashed.reset` (`core/reset.css:5`).
- Element / universal selectors: `*, *::before, *::after` (`core/reset.css:7`); typy HTML w blokach `core/reset.css:13-104` — `html`, `body`, `menu, ul, ol`, `img, picture, video, canvas, svg`, `iframe, embed, object`, `button, input, select, textarea`, `button` (×2), `fieldset`, `legend`, `a, button, input, select, textarea, summary`, `summary`, `textarea`, `table`.
- `.sf-*` / `.is-*`: 0.
- Pseudo-elements: `::before`, `::after` (uniwersalny reset, `core/reset.css:7`).
- Attribute selectors: `[hidden]` (`core/reset.css:94`), `dialog, [popover]` (`core/reset.css:98`), `[inert]` (`core/reset.css:105`).
- At-rules: 1 × `@supports (interpolate-size: allow-keywords)` (`core/reset.css:24-26`). Brak `@media`, `@container`, `@page`, `@keyframes`, `@property`.

### core/base.css

- Declared layer: `@layer slashed.base` (`core/base.css:5`).
- Element selectors: `:root` (`core/base.css:21`), `body` (`core/base.css:36`), `h1..h6` (`core/base.css:46-62`), `p` (`core/base.css:64`), `b, strong` (`core/base.css:71`), `small` (`core/base.css:75`), `mark` (`core/base.css:79`), `kbd, samp` (`core/base.css:90`), `sub, sup` + `sup`/`sub` (`core/base.css:95-101`), `a` + warianty (`core/base.css:103-116`), `a, code` (`core/base.css:118`), `code`, `pre`, `pre code` (`core/base.css:122-148`), `svg`, `hr` (`core/base.css:150-156`), `th, caption` (`core/base.css:170`), `address, cite, dfn, var` (`core/base.css:174`), `input, textarea` (`core/base.css:178`), `input, progress` (`core/base.css:182`), `optgroup` (`core/base.css:189`).
- `.sf-*` / `.is-*`: 0.
- Pseudo-classes / pseudo-elements: `:root:not([data-theme])` (`core/base.css:25`), `a:hover|:visited|:active` (`core/base.css:113-115`), `a:not([class])` (`core/base.css:116`), `:target` (`core/base.css:160`), `::selection` (`core/base.css:164`), `::backdrop` (`core/base.css:186`), `::file-selector-button` (`core/base.css:191`), `::placeholder` (`core/base.css:192`).
- Attribute selectors: `[data-theme="light"]` / `[data-theme="dark"]` (`core/base.css:32-33`), `abbr[title]` (`core/base.css:85`).
- At-rules: 1 × `@media (prefers-color-scheme: dark)` (`core/base.css:24-30`). Brak `@container`, `@supports`, `@page`, `@keyframes`, `@property`.

### core/layout.css

- Declared layer: `@layer slashed.layout` (`core/layout.css:8`).
- `.sf-*` class selectors: 92 unikalnych nazw klas (łącznie ~131 wystąpień), m.in. `.sf-section, .sf-section--{s,m,l,xl}, .sf-section-group` (`core/layout.css:15-21`); `.sf-container, .sf-container--{narrow,prose,wide,full}` (`core/layout.css:27-37`); `.sf-stack, .sf-stack--{2xs..3xl,center,end,stretch}` (`core/layout.css:44-60`); `.sf-box` (`core/layout.css:68`); `.sf-center, .sf-center--intrinsic` (`core/layout.css:79-90`); `.sf-cluster, .sf-cluster--{2xs..xl, no-wrap, center, end, between}` (`core/layout.css:97-114`); `.sf-sidebar, .sf-sidebar--{right,narrow,wide}` + warianty `> :first-child / :last-child` (`core/layout.css:122-151`); `.sf-switcher, .sf-switcher--{no-wrap,vertical}` (`core/layout.css:159-171`); `.sf-grid, .sf-grid--{fit,xs..xl}` (`core/layout.css:180-194`); `.sf-cover, .sf-cover__center, .sf-cover--{min,max,padding-s,padding-l}` (`core/layout.css:202-225`); `.sf-frame, .sf-frame--{square,video,cinema,portrait,4-3,3-2,golden}` (`core/layout.css:233-258`); `.sf-reel` + `> *` (`core/layout.css:266-279`); `.sf-imposter, .sf-imposter--{fixed,contain}` (`core/layout.css:286-302`); `.sf-alternate` (`core/layout.css:310`); `.sf-pancake` (`core/layout.css:317`); fixed-column grids `.sf-grid-{1,2,3,4,6}` + ratio grids `.sf-grid-{1-2,2-1,1-3,3-1}` (`core/layout.css:327-358`); `.sf-content-grid, .sf-breakout, .sf-full-bleed` (`core/layout.css:366-384`); `.sf-bento, .sf-bento--{2,4,compact,tall}` (`core/layout.css:391-406`); `.sf-subgrid, .sf-subgrid-rows` (`core/layout.css:412-413`); `.sf-prose, .sf-not-prose` + dziedziczone potomki (`core/layout.css:420-447`).
- `.is-*`: 0.
- Element selectors: tylko jako potomki klas (`.sf-frame > img`, `.sf-prose img`, `.sf-prose ul` itp., `core/layout.css:241-242, 425-447`).
- Pseudo-classes / structural: `:first-child`, `:last-child` (`core/layout.css:128, 133, 139, 145`), `:nth-child(even)` (`core/layout.css:307-308`), `::marker` (`core/layout.css:433, 442`), funkcjonalna `:is(...)` (`core/layout.css:426, 428, 430, 441`).
- Attribute selectors: 0.
- At-rules: 5 × `@container` (`core/layout.css:305, 332, 337, 354, 399`). Brak `@media`, `@supports`, `@page`, `@keyframes`, `@property`.

### core/motion.css

- Declared layer: `@layer slashed.motion` (`core/motion.css:17`).
- `.sf-*` class selectors: 8 unikalnych — `.sf-fade-in, .sf-fade-out, .sf-slide-in-{up,down,left,right}, .sf-scale-{up,down}` (`core/motion.css:55-62`).
- Element selectors: `html` (`core/motion.css:21`), `html:focus-within` (`core/motion.css:26`), `a, button, input, select, textarea, summary` (`core/motion.css:32`).
- `.is-*`: 0.
- Pseudo-classes / pseudo-elements: `:focus-within` (`core/motion.css:26`), `::view-transition-old(root)`, `::view-transition-new(root)` (`core/motion.css:42-43`).
- Attribute selectors: 0.
- At-rules: 1 × `@media (prefers-reduced-motion: no-preference)` (`core/motion.css:19`), 1 × `@supports (view-transition-name: none)` (`core/motion.css:41`), 8 × `@keyframes` (`core/motion.css:68-75`: `sf-fade-in/out`, `sf-slide-in-{up,down,left,right}`, `sf-scale-{up,down}`).

### core/print.css

- Declared layer: `@layer slashed.print` (`core/print.css:8`).
- `.sf-*` / `.is-*`: 0.
- Element selectors (wewnątrz `@media print`): `*, *::before, *::after` (`core/print.css:16`), `a[href]::after`, `a[href^="#"]::after`, `a[href^="javascript:" i]::after` (`core/print.css:26-34`), `abbr[title]::after` (`core/print.css:37`), `img, svg, video, canvas, figure, table, pre, blockquote` (`core/print.css:41`), `thead`, `tr` (`core/print.css:45-49`), `h1..h6` (`core/print.css:52`), `p` (`core/print.css:58`), `pre, blockquote` (`core/print.css:63`), `nav, aside, button, input, select, textarea, dialog, [popover], .no-print` (`core/print.css:71`), `details`, `details > summary`, `details:not([open]) > :not(summary)` (`core/print.css:76-83`).
- Pseudo-elements: `::before`, `::after` (uniwersalny reset, `core/print.css:16`), `a[...]::after`, `abbr[title]::after` (`core/print.css:26-37`).
- Attribute selectors: `a[href]`, `a[href^="#"]`, `a[href^="javascript:" i]`, `abbr[title]`, `[popover]` (`core/print.css:26-37, 71`).
- Functional pseudo: `:not([open])`, `:not(summary)` (`core/print.css:82`).
- At-rules: 1 × `@media print` (`core/print.css:10`), 1 × `@page` (`core/print.css:12-15`). Brak `@container`, `@supports`, `@keyframes`, `@property`.

### core/states.css

- Declared layer: `@layer slashed.states` (`core/states.css:21`).
- `.is-*` state classes: 35 unikalnych — `.is-hidden, .is-invisible, .is-visible` (`core/states.css:27-37`); `.is-disabled, .is-readonly` (`core/states.css:43-55`); `.is-loading, .is-loading::after, .is-busy, .is-skeleton` (`core/states.css:61-93`); `.is-active, .is-selected, .is-current, .is-highlighted` (`core/states.css:99-118`); `.is-open, .is-collapsed, .is-expanded` (`core/states.css:124-134`); `.is-valid, .is-invalid, .is-warning, .is-success, .is-error, .is-info, .is-danger` (`core/states.css:140-174`); `.is-sticky, .is-pinned, .is-fixed` (`core/states.css:180-195`); `.is-clipped, .is-scrollable, .is-truncated` (`core/states.css:201-215`); `.is-dragging, .is-drop-target, .is-draggable` (`core/states.css:221-234`); `.is-overlay` (`core/states.css:240`); `.is-clickable, .is-unselectable` (`core/states.css:246-252`); `.is-empty:empty` (`core/states.css:258`).
- `.sf-*`: 0.
- Element selectors: 0.
- Pseudo-classes / pseudo-elements: `::after` na `.is-loading` (`core/states.css:65`), funkcjonalne `:empty` na `.is-empty` (`core/states.css:258`).
- Attribute selectors: 0.
- At-rules: 2 × `@keyframes` — `sf-spin` (`core/states.css:269`) i `sf-shimmer` (`core/states.css:273`). Brak `@media`, `@container`, `@supports`, `@page`, `@property`.

### core/accessibility.css

- Declared layer: `@layer slashed.accessibility` (`core/accessibility.css:14`).
- Class selectors (poza prefiksem `.sf-`): `.sr-only`, `.visually-hidden` (`core/accessibility.css:115-124`), `.skip-link`, `.skip-link:focus` (`core/accessibility.css:130-141`).
- Element selectors: `:root` (`core/accessibility.css:39, 62, 75, 154`), `*, *::before, *::after` (`core/accessibility.css:46-48`), `hr` (`core/accessibility.css:65`), `button, input[type="button"|"submit"|"reset"], select, summary, a` (`core/accessibility.css:88-94`).
- `.sf-*` / `.is-*`: 0.
- Pseudo-classes / pseudo-elements: `:focus:not(:focus-visible)` (`core/accessibility.css:25`), `:focus-visible` (`core/accessibility.css:29, 158`), `::backdrop` (`core/accessibility.css:77`), funkcjonalna `:where(*)` (`core/accessibility.css:163`).
- Attribute selectors: `input[type="button"]`, `input[type="submit"]`, `input[type="reset"]` (`core/accessibility.css:89-91`), `[disabled]`, `[aria-disabled="true"]` (`core/accessibility.css:103-104`).
- At-rules: 5 × `@media` — `prefers-reduced-motion: reduce` (`:38`), `prefers-contrast: more` (`:61`), `prefers-reduced-transparency: reduce` (`:74`), `pointer: coarse` (`:87`), `forced-colors: active` (`:153`). Brak `@container`, `@supports`, `@page`, `@keyframes`, `@property`.

### optional/tokens.palette.css

- Declared layer: `@layer slashed.tokens` (`optional/tokens.palette.css:24`). Zawartość: pojedynczy `:root { ... }` (`optional/tokens.palette.css:25-275`).
- Selectors: wyłącznie `:root`; brak `.sf-*`, `.is-*`, pseudo-klas, selektorów atrybutu.
- At-rules: brak. Plik to wyłącznie deklaracje tokenów (Załącznik B wymienia 198 pozycji: skala 50–950 + warianty alpha + aliasy shade/funkcjonalne dla 6 marek).

### optional/tokens.components.css

📦 stub — intentional skeleton, no selectors yet.

### optional/components.css

📦 stub — intentional skeleton, no selectors yet.

### optional/utilities.css

📦 stub — intentional skeleton, no selectors yet.

### optional/legacy.css

- Declared layer: `@layer slashed.legacy` (`optional/legacy.css:25`).
- Element selectors: `body` (`optional/legacy.css:37`), `:focus` (`optional/legacy.css:57`), `html` (`optional/legacy.css:76`).
- `.sf-*` / `.is-*`: 0.
- Pseudo-classes: `:focus` (`optional/legacy.css:57`).
- Attribute selectors: 0.
- At-rules: 3 × `@supports not (...)` — `not (height: 100dvh)` (`optional/legacy.css:36`), `not selector(:focus-visible)` (`optional/legacy.css:56`), `not (scrollbar-gutter: stable)` (`optional/legacy.css:75`). Brak `@media`, `@container`, `@page`, `@keyframes`, `@property`. Cała zawartość jest gated — na nowoczesnym silniku reguły są inertne.

## 9. Appendix B — Full SLASHED token inventory

Pełna lista zadeklarowanych zmiennych niestandardowych `--sf-*` z trzech plików tokenów (`core/tokens.css`, `core/tokens.layout.css`, `optional/tokens.palette.css`); kolumna `@property` wskazuje, czy token jest zarejestrowany w bloku `@property` (animatable, type-checked).

| Token | Type | Source | @property |
| --- | --- | --- | --- |
| `--sf-color-primary-light` | color | core/tokens.css:50 | yes |
| `--sf-color-secondary-light` | color | core/tokens.css:51 | yes |
| `--sf-color-tertiary-light` | color | core/tokens.css:52 | yes |
| `--sf-color-action-light` | color | core/tokens.css:53 | yes |
| `--sf-color-neutral-light` | color | core/tokens.css:54 | yes |
| `--sf-color-base-light` | color | core/tokens.css:55 | yes |
| `--sf-color-success-light` | color | core/tokens.css:59 | yes |
| `--sf-color-warning-light` | color | core/tokens.css:60 | yes |
| `--sf-color-error-light` | color | core/tokens.css:61 | yes |
| `--sf-color-info-light` | color | core/tokens.css:62 | yes |
| `--sf-color-danger-light` | color | core/tokens.css:63 | yes |
| `--sf-is-dark` | integer | core/tokens.css:67 | yes |
| `--sf-color-scheme` | keyword | core/tokens.css:79 | no |
| `--sf-color-primary` | color | core/tokens.css:91 | no |
| `--sf-color-secondary` | color | core/tokens.css:92 | no |
| `--sf-color-tertiary` | color | core/tokens.css:93 | no |
| `--sf-color-action` | color | core/tokens.css:94 | no |
| `--sf-color-neutral` | color | core/tokens.css:95 | no |
| `--sf-color-base` | color | core/tokens.css:96 | no |
| `--sf-color-success` | color | core/tokens.css:98 | no |
| `--sf-color-warning` | color | core/tokens.css:99 | no |
| `--sf-color-error` | color | core/tokens.css:100 | no |
| `--sf-color-info` | color | core/tokens.css:101 | no |
| `--sf-color-danger` | color | core/tokens.css:102 | no |
| `--sf-color-bg` | color | core/tokens.css:108 | no |
| `--sf-color-surface` | color | core/tokens.css:109 | no |
| `--sf-color-well` | color | core/tokens.css:110 | no |
| `--sf-color-raised` | color | core/tokens.css:111 | no |
| `--sf-color-overlay` | color | core/tokens.css:112 | no |
| `--sf-color-inverse` | color | core/tokens.css:113 | no |
| `--sf-color-text` | color | core/tokens.css:120 | no |
| `--sf-color-text--secondary` | color | core/tokens.css:124 | no |
| `--sf-color-text--muted` | color | core/tokens.css:128 | no |
| `--sf-color-text--placeholder` | color | core/tokens.css:129 | no |
| `--sf-color-text--disabled` | color | core/tokens.css:133 | no |
| `--sf-color-text--inverse` | color | core/tokens.css:137 | no |
| `--sf-color-heading` | color | core/tokens.css:141 | no |
| `--sf-color-text--on-primary` | color | core/tokens.css:152 | no |
| `--sf-color-text--on-secondary` | color | core/tokens.css:153 | no |
| `--sf-color-text--on-tertiary` | color | core/tokens.css:154 | no |
| `--sf-color-text--on-action` | color | core/tokens.css:155 | no |
| `--sf-color-text--on-neutral` | color | core/tokens.css:156 | no |
| `--sf-color-text--on-base` | color | core/tokens.css:157 | no |
| `--sf-color-text--on-inverse` | color | core/tokens.css:158 | no |
| `--sf-color-text--on-success` | color | core/tokens.css:159 | no |
| `--sf-color-text--on-warning` | color | core/tokens.css:160 | no |
| `--sf-color-text--on-error` | color | core/tokens.css:161 | no |
| `--sf-color-text--on-info` | color | core/tokens.css:162 | no |
| `--sf-color-text--on-danger` | color | core/tokens.css:163 | no |
| `--sf-color-border` | color | core/tokens.css:171 | no |
| `--sf-color-border--subtle` | color | core/tokens.css:175 | no |
| `--sf-color-border--strong` | color | core/tokens.css:179 | no |
| `--sf-color-border--focus` | color | core/tokens.css:183 | no |
| `--sf-color-border--disabled` | color | core/tokens.css:184 | no |
| `--sf-color-border--translucent` | color | core/tokens.css:185 | no |
| `--sf-color-link` | color | core/tokens.css:191 | no |
| `--sf-color-link--hover` | color | core/tokens.css:192 | no |
| `--sf-color-link--active` | color | core/tokens.css:196 | no |
| `--sf-color-link--visited` | color | core/tokens.css:200 | no |
| `--sf-color-link--underline` | color | core/tokens.css:201 | no |
| `--sf-color-link--disabled` | color | core/tokens.css:202 | no |
| `--sf-color-bg--hover` | color | core/tokens.css:208 | no |
| `--sf-color-bg--active` | color | core/tokens.css:209 | no |
| `--sf-color-bg--selected` | color | core/tokens.css:210 | no |
| `--sf-color-bg--focus` | color | core/tokens.css:211 | no |
| `--sf-color-bg--disabled` | color | core/tokens.css:212 | no |
| `--sf-color-code-bg` | color | core/tokens.css:213 | no |
| `--sf-color-selection-bg` | color | core/tokens.css:219 | no |
| `--sf-color-selection-text` | color | core/tokens.css:220 | no |
| `--sf-color-mark-bg` | color | core/tokens.css:221 | no |
| `--sf-color-mark-text` | color | core/tokens.css:222 | no |
| `--sf-color-dim` | color | core/tokens.css:223 | no |
| `--sf-scrollbar-thumb` | alias | core/tokens.css:229 | no |
| `--sf-scrollbar-track` | alias | core/tokens.css:230 | no |
| `--sf-color-success-subtle` | alias | core/tokens.css:239 | no |
| `--sf-color-success-strong` | color | core/tokens.css:240 | no |
| `--sf-color-success-muted` | alias | core/tokens.css:244 | no |
| `--sf-color-warning-subtle` | alias | core/tokens.css:246 | no |
| `--sf-color-warning-strong` | color | core/tokens.css:247 | no |
| `--sf-color-warning-muted` | alias | core/tokens.css:251 | no |
| `--sf-color-error-subtle` | alias | core/tokens.css:253 | no |
| `--sf-color-error-strong` | color | core/tokens.css:254 | no |
| `--sf-color-error-muted` | alias | core/tokens.css:258 | no |
| `--sf-color-info-subtle` | alias | core/tokens.css:260 | no |
| `--sf-color-info-strong` | color | core/tokens.css:261 | no |
| `--sf-color-info-muted` | alias | core/tokens.css:265 | no |
| `--sf-color-danger-subtle` | alias | core/tokens.css:267 | no |
| `--sf-color-danger-strong` | color | core/tokens.css:268 | no |
| `--sf-color-danger-muted` | alias | core/tokens.css:272 | no |
| `--sf-gradient-primary` | gradient | core/tokens.css:278 | no |
| `--sf-gradient-secondary` | gradient | core/tokens.css:279 | no |
| `--sf-gradient-tertiary` | gradient | core/tokens.css:280 | no |
| `--sf-gradient-brand` | gradient | core/tokens.css:281 | no |
| `--sf-gradient-surface` | gradient | core/tokens.css:282 | no |
| `--sf-gradient-fade--r` | gradient | core/tokens.css:284 | no |
| `--sf-gradient-fade--l` | gradient | core/tokens.css:285 | no |
| `--sf-gradient-fade--t` | gradient | core/tokens.css:286 | no |
| `--sf-gradient-fade--b` | gradient | core/tokens.css:287 | no |
| `--sf-shadow-strength` | multiplier | core/tokens.css:293 | no |
| `--sf-shadow-glow-color` | color | core/tokens.css:294 | no |
| `--sf-shadow-glow` | shadow | core/tokens.css:295 | no |
| `--sf-opacity-disabled` | opacity | core/tokens.css:296 | no |
| `--sf-focus-ring-color` | alias | core/tokens.css:302 | no |
| `--sf-focus-ring-shadow` | shadow | core/tokens.css:303 | no |
| `--sf-caret-color` | alias | core/tokens.css:305 | no |
| `--sf-space-scale` | multiplier | core/tokens.css:321 | no |
| `--sf-text-scale` | multiplier | core/tokens.css:322 | no |
| `--sf-text-display-scale` | multiplier | core/tokens.css:323 | no |
| `--sf-radius-scale` | multiplier | core/tokens.css:324 | no |
| `--sf-motion-scale` | multiplier | core/tokens.css:325 | no |
| `--sf-font-body` | font | core/tokens.css:331 | no |
| `--sf-font-heading` | font | core/tokens.css:332 | no |
| `--sf-font-display` | font | core/tokens.css:333 | no |
| `--sf-font-mono` | font | core/tokens.css:334 | no |
| `--sf-font-humanist` | font | core/tokens.css:337 | no |
| `--sf-font-geometric` | font | core/tokens.css:338 | no |
| `--sf-font-slab` | font | core/tokens.css:339 | no |
| `--sf-font-features` | keyword | core/tokens.css:342 | no |
| `--sf-font-variation` | keyword | core/tokens.css:343 | no |
| `--sf-optical-sizing` | keyword | core/tokens.css:344 | no |
| `--sf-font-weight-thin` | integer | core/tokens.css:351 | no |
| `--sf-font-weight-extralight` | integer | core/tokens.css:352 | no |
| `--sf-font-weight-light` | integer | core/tokens.css:353 | no |
| `--sf-font-weight-normal` | integer | core/tokens.css:354 | no |
| `--sf-font-weight-medium` | integer | core/tokens.css:355 | no |
| `--sf-font-weight-semibold` | integer | core/tokens.css:356 | no |
| `--sf-font-weight-bold` | integer | core/tokens.css:357 | no |
| `--sf-font-weight-extrabold` | integer | core/tokens.css:358 | no |
| `--sf-font-weight-black` | integer | core/tokens.css:359 | no |
| `--sf-font-weight-body` | alias | core/tokens.css:362 | no |
| `--sf-font-weight-heading` | alias | core/tokens.css:363 | no |
| `--sf-font-weight-display` | alias | core/tokens.css:364 | no |
| `--sf-text-2xs` | length | core/tokens.css:370 | no |
| `--sf-text-xs` | length | core/tokens.css:371 | no |
| `--sf-text-s` | length | core/tokens.css:372 | no |
| `--sf-text-m` | length | core/tokens.css:373 | no |
| `--sf-text-l` | length | core/tokens.css:374 | no |
| `--sf-text-xl` | length | core/tokens.css:375 | no |
| `--sf-text-2xl` | length | core/tokens.css:376 | no |
| `--sf-text-3xl` | length | core/tokens.css:377 | no |
| `--sf-text-4xl` | length | core/tokens.css:378 | no |
| `--sf-text-display-s` | length | core/tokens.css:380 | no |
| `--sf-text-display-m` | length | core/tokens.css:381 | no |
| `--sf-text-display-l` | length | core/tokens.css:382 | no |
| `--sf-leading-tight` | ratio | core/tokens.css:388 | no |
| `--sf-leading-snug` | ratio | core/tokens.css:389 | no |
| `--sf-leading-normal` | ratio | core/tokens.css:390 | no |
| `--sf-leading-relaxed` | ratio | core/tokens.css:391 | no |
| `--sf-tracking-tight` | length | core/tokens.css:393 | no |
| `--sf-tracking-normal` | length | core/tokens.css:394 | no |
| `--sf-tracking-wide` | length | core/tokens.css:395 | no |
| `--sf-tracking-wider` | length | core/tokens.css:396 | no |
| `--sf-tracking-widest` | length | core/tokens.css:397 | no |
| `--sf-icon-xs` | length | core/tokens.css:403 | no |
| `--sf-icon-s` | length | core/tokens.css:404 | no |
| `--sf-icon-m` | length | core/tokens.css:405 | no |
| `--sf-icon-l` | length | core/tokens.css:406 | no |
| `--sf-icon-xl` | length | core/tokens.css:407 | no |
| `--sf-space-none` | length | core/tokens.css:413 | no |
| `--sf-space-px` | length | core/tokens.css:414 | no |
| `--sf-space-gutter` | length | core/tokens.css:415 | no |
| `--sf-space-2xs` | length | core/tokens.css:418 | no |
| `--sf-space-xs` | length | core/tokens.css:419 | no |
| `--sf-space-s` | length | core/tokens.css:420 | no |
| `--sf-space-m` | length | core/tokens.css:421 | no |
| `--sf-space-l` | length | core/tokens.css:422 | no |
| `--sf-space-xl` | length | core/tokens.css:423 | no |
| `--sf-space-2xl` | length | core/tokens.css:424 | no |
| `--sf-space-3xl` | length | core/tokens.css:425 | no |
| `--sf-space-4xl` | length | core/tokens.css:426 | no |
| `--sf-size-xs` | length | core/tokens.css:432 | no |
| `--sf-size-s` | length | core/tokens.css:433 | no |
| `--sf-size-m` | length | core/tokens.css:434 | no |
| `--sf-size-l` | length | core/tokens.css:435 | no |
| `--sf-size-xl` | length | core/tokens.css:436 | no |
| `--sf-container-narrow` | length | core/tokens.css:442 | no |
| `--sf-container-prose` | length | core/tokens.css:443 | no |
| `--sf-container-default` | length | core/tokens.css:444 | no |
| `--sf-container-wide` | length | core/tokens.css:445 | no |
| `--sf-container-full` | length | core/tokens.css:446 | no |
| `--sf-ratio-square` | ratio | core/tokens.css:452 | no |
| `--sf-ratio-video` | ratio | core/tokens.css:453 | no |
| `--sf-ratio-cinema` | ratio | core/tokens.css:454 | no |
| `--sf-ratio-photo` | ratio | core/tokens.css:455 | no |
| `--sf-ratio-portrait` | ratio | core/tokens.css:456 | no |
| `--sf-ratio-golden` | ratio | core/tokens.css:457 | no |
| `--sf-border-width-hairline` | length | core/tokens.css:463 | no |
| `--sf-border-width-1` | length | core/tokens.css:464 | no |
| `--sf-border-width-2` | length | core/tokens.css:465 | no |
| `--sf-border-width-3` | length | core/tokens.css:466 | no |
| `--sf-border-width-4` | length | core/tokens.css:467 | no |
| `--sf-radius-none` | length | core/tokens.css:473 | no |
| `--sf-radius-xs` | length | core/tokens.css:474 | no |
| `--sf-radius-s` | length | core/tokens.css:475 | no |
| `--sf-radius-m` | length | core/tokens.css:476 | no |
| `--sf-radius-l` | length | core/tokens.css:477 | no |
| `--sf-radius-xl` | length | core/tokens.css:478 | no |
| `--sf-radius-2xl` | length | core/tokens.css:479 | no |
| `--sf-radius-3xl` | length | core/tokens.css:480 | no |
| `--sf-radius-4xl` | length | core/tokens.css:481 | no |
| `--sf-radius-full` | length | core/tokens.css:482 | no |
| `--sf-shadow-color` | color | core/tokens.css:495 | no |
| `--sf-shadow-none` | shadow | core/tokens.css:497 | no |
| `--sf-shadow-xs` | shadow | core/tokens.css:498 | no |
| `--sf-shadow-s` | shadow | core/tokens.css:499 | no |
| `--sf-shadow-m` | shadow | core/tokens.css:501 | no |
| `--sf-shadow-l` | shadow | core/tokens.css:503 | no |
| `--sf-shadow-xl` | shadow | core/tokens.css:506 | no |
| `--sf-shadow-2xl` | shadow | core/tokens.css:509 | no |
| `--sf-shadow-inner` | shadow | core/tokens.css:512 | no |
| `--sf-text-shadow-none` | shadow | core/tokens.css:518 | no |
| `--sf-text-shadow-s` | shadow | core/tokens.css:519 | no |
| `--sf-text-shadow-m` | shadow | core/tokens.css:520 | no |
| `--sf-text-shadow-l` | shadow | core/tokens.css:521 | no |
| `--sf-drop-shadow-s` | shadow | core/tokens.css:524 | no |
| `--sf-drop-shadow-m` | shadow | core/tokens.css:525 | no |
| `--sf-drop-shadow-l` | shadow | core/tokens.css:526 | no |
| `--sf-blur-xs` | length | core/tokens.css:532 | no |
| `--sf-blur-s` | length | core/tokens.css:533 | no |
| `--sf-blur-m` | length | core/tokens.css:534 | no |
| `--sf-blur-l` | length | core/tokens.css:535 | no |
| `--sf-blur-xl` | length | core/tokens.css:536 | no |
| `--sf-perspective-near` | length | core/tokens.css:539 | no |
| `--sf-perspective-normal` | length | core/tokens.css:540 | no |
| `--sf-perspective-far` | length | core/tokens.css:541 | no |
| `--sf-opacity-0` | opacity | core/tokens.css:543 | no |
| `--sf-opacity-10` | opacity | core/tokens.css:544 | no |
| `--sf-opacity-25` | opacity | core/tokens.css:545 | no |
| `--sf-opacity-50` | opacity | core/tokens.css:546 | no |
| `--sf-opacity-75` | opacity | core/tokens.css:547 | no |
| `--sf-opacity-100` | opacity | core/tokens.css:548 | no |
| `--sf-duration-none` | duration | core/tokens.css:554 | no |
| `--sf-duration-instant` | duration | core/tokens.css:555 | no |
| `--sf-duration-fast` | duration | core/tokens.css:556 | no |
| `--sf-duration-normal` | duration | core/tokens.css:557 | no |
| `--sf-duration-slow` | duration | core/tokens.css:558 | no |
| `--sf-duration-slower` | duration | core/tokens.css:559 | no |
| `--sf-ease-linear` | easing-fn | core/tokens.css:561 | no |
| `--sf-ease-out` | easing-fn | core/tokens.css:562 | no |
| `--sf-ease-in` | easing-fn | core/tokens.css:563 | no |
| `--sf-ease-in-out` | easing-fn | core/tokens.css:564 | no |
| `--sf-ease-spring` | easing-fn | core/tokens.css:565 | no |
| `--sf-ease-elastic` | easing-fn | core/tokens.css:566 | no |
| `--sf-ease-bounce` | easing-fn | core/tokens.css:567 | no |
| `--sf-ease-overshoot` | easing-fn | core/tokens.css:568 | no |
| `--sf-animation-fade-in` | transition | core/tokens.css:575 | no |
| `--sf-animation-fade-out` | transition | core/tokens.css:576 | no |
| `--sf-animation-slide-in-up` | transition | core/tokens.css:577 | no |
| `--sf-animation-slide-in-down` | transition | core/tokens.css:578 | no |
| `--sf-animation-slide-in-left` | transition | core/tokens.css:579 | no |
| `--sf-animation-slide-in-right` | transition | core/tokens.css:580 | no |
| `--sf-animation-scale-up` | transition | core/tokens.css:581 | no |
| `--sf-animation-scale-down` | transition | core/tokens.css:582 | no |
| `--sf-scroll-timeline-range-start` | length | core/tokens.css:588 | no |
| `--sf-scroll-timeline-range-end` | length | core/tokens.css:589 | no |
| `--sf-z-below` | z | core/tokens.css:595 | no |
| `--sf-z-base` | z | core/tokens.css:596 | no |
| `--sf-z-raised` | z | core/tokens.css:597 | no |
| `--sf-z-low` | z | core/tokens.css:598 | no |
| `--sf-z-mid` | z | core/tokens.css:599 | no |
| `--sf-z-high` | z | core/tokens.css:600 | no |
| `--sf-z-top` | z | core/tokens.css:601 | no |
| `--sf-z-max` | z | core/tokens.css:602 | no |
| `--sf-header-height` | length | core/tokens.css:608 | no |
| `--sf-sticky-offset` | length | core/tokens.css:609 | no |
| `--sf-focus-ring-width` | length | core/tokens.css:610 | no |
| `--sf-focus-ring-offset` | length | core/tokens.css:611 | no |
| `--sf-focus-ring-style` | keyword | core/tokens.css:612 | no |
| `--sf-touch-target` | alias | core/tokens.css:613 | no |
| `--sf-contrast-bias` | integer | core/tokens.css:614 | no |
| `--sf-safe-top` | env | core/tokens.css:616 | no |
| `--sf-safe-bottom` | env | core/tokens.css:617 | no |
| `--sf-safe-left` | env | core/tokens.css:618 | no |
| `--sf-safe-right` | env | core/tokens.css:619 | no |
| `--sf-print-page-margin` | length | core/tokens.css:625 | no |
| `--sf-print-page-size` | keyword | core/tokens.css:626 | no |
| `--sf-print-base-size` | length | core/tokens.css:627 | no |
| `--sf-stroke-thin` | length | core/tokens.css:633 | no |
| `--sf-stroke-regular` | length | core/tokens.css:634 | no |
| `--sf-stroke-bold` | length | core/tokens.css:635 | no |
| `--sf-stroke-heavy` | length | core/tokens.css:636 | no |
| `--sf-body-font-size` | alias | core/tokens.css:646 | no |
| `--sf-body-line-height` | alias | core/tokens.css:647 | no |
| `--sf-body-font-weight` | alias | core/tokens.css:648 | no |
| `--sf-body-font-family` | alias | core/tokens.css:649 | no |
| `--sf-body-color` | alias | core/tokens.css:650 | no |
| `--sf-body-text-wrap` | alias | core/tokens.css:651 | no |
| `--sf-body-strong-weight` | alias | core/tokens.css:652 | no |
| `--sf-body-em-style` | alias | core/tokens.css:653 | no |
| `--sf-heading-font-family` | alias | core/tokens.css:655 | no |
| `--sf-heading-color` | alias | core/tokens.css:656 | no |
| `--sf-heading-text-wrap` | alias | core/tokens.css:657 | no |
| `--sf-h1-size` | alias | core/tokens.css:659 | no |
| `--sf-h1-line-height` | alias | core/tokens.css:660 | no |
| `--sf-h1-font-weight` | alias | core/tokens.css:661 | no |
| `--sf-h1-letter-spacing` | alias | core/tokens.css:662 | no |
| `--sf-h2-size` | alias | core/tokens.css:664 | no |
| `--sf-h2-line-height` | alias | core/tokens.css:665 | no |
| `--sf-h2-font-weight` | alias | core/tokens.css:666 | no |
| `--sf-h2-letter-spacing` | alias | core/tokens.css:667 | no |
| `--sf-h3-size` | alias | core/tokens.css:669 | no |
| `--sf-h3-line-height` | alias | core/tokens.css:670 | no |
| `--sf-h3-font-weight` | alias | core/tokens.css:671 | no |
| `--sf-h3-letter-spacing` | alias | core/tokens.css:672 | no |
| `--sf-h4-size` | alias | core/tokens.css:674 | no |
| `--sf-h4-line-height` | alias | core/tokens.css:675 | no |
| `--sf-h4-font-weight` | alias | core/tokens.css:676 | no |
| `--sf-h4-letter-spacing` | alias | core/tokens.css:677 | no |
| `--sf-h5-size` | alias | core/tokens.css:679 | no |
| `--sf-h5-line-height` | alias | core/tokens.css:680 | no |
| `--sf-h5-font-weight` | alias | core/tokens.css:681 | no |
| `--sf-h5-letter-spacing` | alias | core/tokens.css:682 | no |
| `--sf-h6-size` | alias | core/tokens.css:684 | no |
| `--sf-h6-line-height` | alias | core/tokens.css:685 | no |
| `--sf-h6-font-weight` | alias | core/tokens.css:686 | no |
| `--sf-h6-letter-spacing` | alias | core/tokens.css:687 | no |
| `--sf-gap` | alias | core/tokens.css:697 | no |
| `--sf-content-gap` | alias | core/tokens.css:698 | no |
| `--sf-component-pad` | alias | core/tokens.css:699 | no |
| `--sf-field-block` | alias | core/tokens.css:700 | no |
| `--sf-section-pad` | alias | core/tokens.css:706 | no |
| `--sf-section-pad--s` | alias | core/tokens.css:707 | no |
| `--sf-section-pad--m` | alias | core/tokens.css:708 | no |
| `--sf-section-pad--l` | alias | core/tokens.css:709 | no |
| `--sf-section-pad--xl` | alias | core/tokens.css:710 | no |
| `--sf-transition-base` | transition | core/tokens.css:716 | no |
| `--sf-transition-fast` | transition | core/tokens.css:717 | no |
| `--sf-transition-slow` | transition | core/tokens.css:718 | no |
| `--sf-transition-enter` | transition | core/tokens.css:719 | no |
| `--sf-transition-exit` | transition | core/tokens.css:720 | no |
| `--sf-space-gap` | alias | core/tokens.layout.css:25 | no |
| `--sf-space-content` | alias | core/tokens.layout.css:26 | no |
| `--sf-stack-gap` | alias | core/tokens.layout.css:31 | no |
| `--sf-box-padding` | alias | core/tokens.layout.css:36 | no |
| `--sf-box-border-width` | alias | core/tokens.layout.css:37 | no |
| `--sf-box-border-color` | alias | core/tokens.layout.css:38 | no |
| `--sf-center-max` | alias | core/tokens.layout.css:43 | no |
| `--sf-center-gutter` | alias | core/tokens.layout.css:44 | no |
| `--sf-cluster-gap` | alias | core/tokens.layout.css:49 | no |
| `--sf-cluster-align` | alias | core/tokens.layout.css:50 | no |
| `--sf-cluster-justify` | alias | core/tokens.layout.css:51 | no |
| `--sf-sidebar-gap` | alias | core/tokens.layout.css:56 | no |
| `--sf-sidebar-min-width` | alias | core/tokens.layout.css:57 | no |
| `--sf-sidebar-width-default` | alias | core/tokens.layout.css:58 | no |
| `--sf-switcher-threshold` | alias | core/tokens.layout.css:63 | no |
| `--sf-switcher-gap` | alias | core/tokens.layout.css:64 | no |
| `--sf-grid-min` | alias | core/tokens.layout.css:69 | no |
| `--sf-grid-gap` | alias | core/tokens.layout.css:70 | no |
| `--sf-grid-min-xs` | alias | core/tokens.layout.css:72 | no |
| `--sf-grid-min-s` | alias | core/tokens.layout.css:73 | no |
| `--sf-grid-min-default` | alias | core/tokens.layout.css:74 | no |
| `--sf-grid-min-m` | alias | core/tokens.layout.css:75 | no |
| `--sf-grid-min-l` | alias | core/tokens.layout.css:76 | no |
| `--sf-grid-min-xl` | alias | core/tokens.layout.css:77 | no |
| `--sf-cover-min-height` | alias | core/tokens.layout.css:82 | no |
| `--sf-cover-padding` | alias | core/tokens.layout.css:83 | no |
| `--sf-frame-ratio` | ratio | core/tokens.layout.css:88 | no |
| `--sf-reel-item-width` | alias | core/tokens.layout.css:93 | no |
| `--sf-reel-gap` | alias | core/tokens.layout.css:94 | no |
| `--sf-reel-height` | alias | core/tokens.layout.css:95 | no |
| `--sf-imposter-margin` | alias | core/tokens.layout.css:100 | no |
| `--sf-bento-cols-default` | integer | core/tokens.layout.css:105 | no |
| `--sf-bento-row-default` | length | core/tokens.layout.css:106 | no |
| `--sf-bento-row-compact` | length | core/tokens.layout.css:107 | no |
| `--sf-bento-row-tall` | length | core/tokens.layout.css:108 | no |
| `--sf-bento-gap` | alias | core/tokens.layout.css:109 | no |
| `--sf-breakout-width` | alias | core/tokens.layout.css:114 | no |
| `--sf-content-width` | alias | core/tokens.layout.css:115 | no |
| `--sf-prose-paragraph` | alias | core/tokens.layout.css:120 | no |
| `--sf-color-primary-50` | color | optional/tokens.palette.css:30 | no |
| `--sf-color-primary-100` | color | optional/tokens.palette.css:31 | no |
| `--sf-color-primary-200` | color | optional/tokens.palette.css:32 | no |
| `--sf-color-primary-300` | color | optional/tokens.palette.css:33 | no |
| `--sf-color-primary-400` | color | optional/tokens.palette.css:34 | no |
| `--sf-color-primary-500` | color | optional/tokens.palette.css:35 | no |
| `--sf-color-primary-600` | color | optional/tokens.palette.css:36 | no |
| `--sf-color-primary-700` | color | optional/tokens.palette.css:37 | no |
| `--sf-color-primary-800` | color | optional/tokens.palette.css:38 | no |
| `--sf-color-primary-900` | color | optional/tokens.palette.css:39 | no |
| `--sf-color-primary-950` | color | optional/tokens.palette.css:40 | no |
| `--sf-color-primary-a5` | color | optional/tokens.palette.css:42 | no |
| `--sf-color-primary-a10` | color | optional/tokens.palette.css:43 | no |
| `--sf-color-primary-a20` | color | optional/tokens.palette.css:44 | no |
| `--sf-color-primary-a30` | color | optional/tokens.palette.css:45 | no |
| `--sf-color-primary-a40` | color | optional/tokens.palette.css:46 | no |
| `--sf-color-primary-a50` | color | optional/tokens.palette.css:47 | no |
| `--sf-color-primary-a60` | color | optional/tokens.palette.css:48 | no |
| `--sf-color-primary-a70` | color | optional/tokens.palette.css:49 | no |
| `--sf-color-primary-a80` | color | optional/tokens.palette.css:50 | no |
| `--sf-color-primary-a90` | color | optional/tokens.palette.css:51 | no |
| `--sf-color-primary-a95` | color | optional/tokens.palette.css:52 | no |
| `--sf-color-primary-superlight` | alias | optional/tokens.palette.css:54 | no |
| `--sf-color-primary-xlight` | alias | optional/tokens.palette.css:55 | no |
| `--sf-color-primary-lighter` | alias | optional/tokens.palette.css:56 | no |
| `--sf-color-primary-darker` | alias | optional/tokens.palette.css:57 | no |
| `--sf-color-primary-xdark` | alias | optional/tokens.palette.css:58 | no |
| `--sf-color-primary-superdark` | alias | optional/tokens.palette.css:59 | no |
| `--sf-color-primary-hover` | alias | optional/tokens.palette.css:61 | no |
| `--sf-color-primary-active` | alias | optional/tokens.palette.css:62 | no |
| `--sf-color-primary-subtle` | alias | optional/tokens.palette.css:63 | no |
| `--sf-color-primary-muted` | alias | optional/tokens.palette.css:64 | no |
| `--sf-color-primary-ghost` | alias | optional/tokens.palette.css:65 | no |
| `--sf-color-secondary-50` | color | optional/tokens.palette.css:71 | no |
| `--sf-color-secondary-100` | color | optional/tokens.palette.css:72 | no |
| `--sf-color-secondary-200` | color | optional/tokens.palette.css:73 | no |
| `--sf-color-secondary-300` | color | optional/tokens.palette.css:74 | no |
| `--sf-color-secondary-400` | color | optional/tokens.palette.css:75 | no |
| `--sf-color-secondary-500` | color | optional/tokens.palette.css:76 | no |
| `--sf-color-secondary-600` | color | optional/tokens.palette.css:77 | no |
| `--sf-color-secondary-700` | color | optional/tokens.palette.css:78 | no |
| `--sf-color-secondary-800` | color | optional/tokens.palette.css:79 | no |
| `--sf-color-secondary-900` | color | optional/tokens.palette.css:80 | no |
| `--sf-color-secondary-950` | color | optional/tokens.palette.css:81 | no |
| `--sf-color-secondary-a5` | color | optional/tokens.palette.css:83 | no |
| `--sf-color-secondary-a10` | color | optional/tokens.palette.css:84 | no |
| `--sf-color-secondary-a20` | color | optional/tokens.palette.css:85 | no |
| `--sf-color-secondary-a30` | color | optional/tokens.palette.css:86 | no |
| `--sf-color-secondary-a40` | color | optional/tokens.palette.css:87 | no |
| `--sf-color-secondary-a50` | color | optional/tokens.palette.css:88 | no |
| `--sf-color-secondary-a60` | color | optional/tokens.palette.css:89 | no |
| `--sf-color-secondary-a70` | color | optional/tokens.palette.css:90 | no |
| `--sf-color-secondary-a80` | color | optional/tokens.palette.css:91 | no |
| `--sf-color-secondary-a90` | color | optional/tokens.palette.css:92 | no |
| `--sf-color-secondary-a95` | color | optional/tokens.palette.css:93 | no |
| `--sf-color-secondary-superlight` | alias | optional/tokens.palette.css:95 | no |
| `--sf-color-secondary-xlight` | alias | optional/tokens.palette.css:96 | no |
| `--sf-color-secondary-lighter` | alias | optional/tokens.palette.css:97 | no |
| `--sf-color-secondary-darker` | alias | optional/tokens.palette.css:98 | no |
| `--sf-color-secondary-xdark` | alias | optional/tokens.palette.css:99 | no |
| `--sf-color-secondary-superdark` | alias | optional/tokens.palette.css:100 | no |
| `--sf-color-secondary-hover` | alias | optional/tokens.palette.css:102 | no |
| `--sf-color-secondary-active` | alias | optional/tokens.palette.css:103 | no |
| `--sf-color-secondary-subtle` | alias | optional/tokens.palette.css:104 | no |
| `--sf-color-secondary-muted` | alias | optional/tokens.palette.css:105 | no |
| `--sf-color-secondary-ghost` | alias | optional/tokens.palette.css:106 | no |
| `--sf-color-tertiary-50` | color | optional/tokens.palette.css:112 | no |
| `--sf-color-tertiary-100` | color | optional/tokens.palette.css:113 | no |
| `--sf-color-tertiary-200` | color | optional/tokens.palette.css:114 | no |
| `--sf-color-tertiary-300` | color | optional/tokens.palette.css:115 | no |
| `--sf-color-tertiary-400` | color | optional/tokens.palette.css:116 | no |
| `--sf-color-tertiary-500` | color | optional/tokens.palette.css:117 | no |
| `--sf-color-tertiary-600` | color | optional/tokens.palette.css:118 | no |
| `--sf-color-tertiary-700` | color | optional/tokens.palette.css:119 | no |
| `--sf-color-tertiary-800` | color | optional/tokens.palette.css:120 | no |
| `--sf-color-tertiary-900` | color | optional/tokens.palette.css:121 | no |
| `--sf-color-tertiary-950` | color | optional/tokens.palette.css:122 | no |
| `--sf-color-tertiary-a5` | color | optional/tokens.palette.css:124 | no |
| `--sf-color-tertiary-a10` | color | optional/tokens.palette.css:125 | no |
| `--sf-color-tertiary-a20` | color | optional/tokens.palette.css:126 | no |
| `--sf-color-tertiary-a30` | color | optional/tokens.palette.css:127 | no |
| `--sf-color-tertiary-a40` | color | optional/tokens.palette.css:128 | no |
| `--sf-color-tertiary-a50` | color | optional/tokens.palette.css:129 | no |
| `--sf-color-tertiary-a60` | color | optional/tokens.palette.css:130 | no |
| `--sf-color-tertiary-a70` | color | optional/tokens.palette.css:131 | no |
| `--sf-color-tertiary-a80` | color | optional/tokens.palette.css:132 | no |
| `--sf-color-tertiary-a90` | color | optional/tokens.palette.css:133 | no |
| `--sf-color-tertiary-a95` | color | optional/tokens.palette.css:134 | no |
| `--sf-color-tertiary-superlight` | alias | optional/tokens.palette.css:136 | no |
| `--sf-color-tertiary-xlight` | alias | optional/tokens.palette.css:137 | no |
| `--sf-color-tertiary-lighter` | alias | optional/tokens.palette.css:138 | no |
| `--sf-color-tertiary-darker` | alias | optional/tokens.palette.css:139 | no |
| `--sf-color-tertiary-xdark` | alias | optional/tokens.palette.css:140 | no |
| `--sf-color-tertiary-superdark` | alias | optional/tokens.palette.css:141 | no |
| `--sf-color-tertiary-hover` | alias | optional/tokens.palette.css:143 | no |
| `--sf-color-tertiary-active` | alias | optional/tokens.palette.css:144 | no |
| `--sf-color-tertiary-subtle` | alias | optional/tokens.palette.css:145 | no |
| `--sf-color-tertiary-muted` | alias | optional/tokens.palette.css:146 | no |
| `--sf-color-tertiary-ghost` | alias | optional/tokens.palette.css:147 | no |
| `--sf-color-action-50` | color | optional/tokens.palette.css:153 | no |
| `--sf-color-action-100` | color | optional/tokens.palette.css:154 | no |
| `--sf-color-action-200` | color | optional/tokens.palette.css:155 | no |
| `--sf-color-action-300` | color | optional/tokens.palette.css:156 | no |
| `--sf-color-action-400` | color | optional/tokens.palette.css:157 | no |
| `--sf-color-action-500` | color | optional/tokens.palette.css:158 | no |
| `--sf-color-action-600` | color | optional/tokens.palette.css:159 | no |
| `--sf-color-action-700` | color | optional/tokens.palette.css:160 | no |
| `--sf-color-action-800` | color | optional/tokens.palette.css:161 | no |
| `--sf-color-action-900` | color | optional/tokens.palette.css:162 | no |
| `--sf-color-action-950` | color | optional/tokens.palette.css:163 | no |
| `--sf-color-action-a5` | color | optional/tokens.palette.css:165 | no |
| `--sf-color-action-a10` | color | optional/tokens.palette.css:166 | no |
| `--sf-color-action-a20` | color | optional/tokens.palette.css:167 | no |
| `--sf-color-action-a30` | color | optional/tokens.palette.css:168 | no |
| `--sf-color-action-a40` | color | optional/tokens.palette.css:169 | no |
| `--sf-color-action-a50` | color | optional/tokens.palette.css:170 | no |
| `--sf-color-action-a60` | color | optional/tokens.palette.css:171 | no |
| `--sf-color-action-a70` | color | optional/tokens.palette.css:172 | no |
| `--sf-color-action-a80` | color | optional/tokens.palette.css:173 | no |
| `--sf-color-action-a90` | color | optional/tokens.palette.css:174 | no |
| `--sf-color-action-a95` | color | optional/tokens.palette.css:175 | no |
| `--sf-color-action-superlight` | alias | optional/tokens.palette.css:177 | no |
| `--sf-color-action-xlight` | alias | optional/tokens.palette.css:178 | no |
| `--sf-color-action-lighter` | alias | optional/tokens.palette.css:179 | no |
| `--sf-color-action-darker` | alias | optional/tokens.palette.css:180 | no |
| `--sf-color-action-xdark` | alias | optional/tokens.palette.css:181 | no |
| `--sf-color-action-superdark` | alias | optional/tokens.palette.css:182 | no |
| `--sf-color-action-hover` | alias | optional/tokens.palette.css:184 | no |
| `--sf-color-action-active` | alias | optional/tokens.palette.css:185 | no |
| `--sf-color-action-subtle` | alias | optional/tokens.palette.css:186 | no |
| `--sf-color-action-muted` | alias | optional/tokens.palette.css:187 | no |
| `--sf-color-action-ghost` | alias | optional/tokens.palette.css:188 | no |
| `--sf-color-neutral-50` | color | optional/tokens.palette.css:194 | no |
| `--sf-color-neutral-100` | color | optional/tokens.palette.css:195 | no |
| `--sf-color-neutral-200` | color | optional/tokens.palette.css:196 | no |
| `--sf-color-neutral-300` | color | optional/tokens.palette.css:197 | no |
| `--sf-color-neutral-400` | color | optional/tokens.palette.css:198 | no |
| `--sf-color-neutral-500` | color | optional/tokens.palette.css:199 | no |
| `--sf-color-neutral-600` | color | optional/tokens.palette.css:200 | no |
| `--sf-color-neutral-700` | color | optional/tokens.palette.css:201 | no |
| `--sf-color-neutral-800` | color | optional/tokens.palette.css:202 | no |
| `--sf-color-neutral-900` | color | optional/tokens.palette.css:203 | no |
| `--sf-color-neutral-950` | color | optional/tokens.palette.css:204 | no |
| `--sf-color-neutral-a5` | color | optional/tokens.palette.css:206 | no |
| `--sf-color-neutral-a10` | color | optional/tokens.palette.css:207 | no |
| `--sf-color-neutral-a20` | color | optional/tokens.palette.css:208 | no |
| `--sf-color-neutral-a30` | color | optional/tokens.palette.css:209 | no |
| `--sf-color-neutral-a40` | color | optional/tokens.palette.css:210 | no |
| `--sf-color-neutral-a50` | color | optional/tokens.palette.css:211 | no |
| `--sf-color-neutral-a60` | color | optional/tokens.palette.css:212 | no |
| `--sf-color-neutral-a70` | color | optional/tokens.palette.css:213 | no |
| `--sf-color-neutral-a80` | color | optional/tokens.palette.css:214 | no |
| `--sf-color-neutral-a90` | color | optional/tokens.palette.css:215 | no |
| `--sf-color-neutral-a95` | color | optional/tokens.palette.css:216 | no |
| `--sf-color-neutral-superlight` | alias | optional/tokens.palette.css:218 | no |
| `--sf-color-neutral-xlight` | alias | optional/tokens.palette.css:219 | no |
| `--sf-color-neutral-lighter` | alias | optional/tokens.palette.css:220 | no |
| `--sf-color-neutral-darker` | alias | optional/tokens.palette.css:221 | no |
| `--sf-color-neutral-xdark` | alias | optional/tokens.palette.css:222 | no |
| `--sf-color-neutral-superdark` | alias | optional/tokens.palette.css:223 | no |
| `--sf-color-neutral-hover` | alias | optional/tokens.palette.css:225 | no |
| `--sf-color-neutral-active` | alias | optional/tokens.palette.css:226 | no |
| `--sf-color-neutral-subtle` | alias | optional/tokens.palette.css:227 | no |
| `--sf-color-neutral-muted` | alias | optional/tokens.palette.css:228 | no |
| `--sf-color-neutral-ghost` | alias | optional/tokens.palette.css:229 | no |
| `--sf-color-base-50` | color | optional/tokens.palette.css:237 | no |
| `--sf-color-base-100` | color | optional/tokens.palette.css:238 | no |
| `--sf-color-base-200` | color | optional/tokens.palette.css:239 | no |
| `--sf-color-base-300` | color | optional/tokens.palette.css:240 | no |
| `--sf-color-base-400` | color | optional/tokens.palette.css:241 | no |
| `--sf-color-base-500` | color | optional/tokens.palette.css:242 | no |
| `--sf-color-base-600` | color | optional/tokens.palette.css:243 | no |
| `--sf-color-base-700` | color | optional/tokens.palette.css:244 | no |
| `--sf-color-base-800` | color | optional/tokens.palette.css:245 | no |
| `--sf-color-base-900` | color | optional/tokens.palette.css:246 | no |
| `--sf-color-base-950` | color | optional/tokens.palette.css:247 | no |
| `--sf-color-base-a5` | color | optional/tokens.palette.css:249 | no |
| `--sf-color-base-a10` | color | optional/tokens.palette.css:250 | no |
| `--sf-color-base-a20` | color | optional/tokens.palette.css:251 | no |
| `--sf-color-base-a30` | color | optional/tokens.palette.css:252 | no |
| `--sf-color-base-a40` | color | optional/tokens.palette.css:253 | no |
| `--sf-color-base-a50` | color | optional/tokens.palette.css:254 | no |
| `--sf-color-base-a60` | color | optional/tokens.palette.css:255 | no |
| `--sf-color-base-a70` | color | optional/tokens.palette.css:256 | no |
| `--sf-color-base-a80` | color | optional/tokens.palette.css:257 | no |
| `--sf-color-base-a90` | color | optional/tokens.palette.css:258 | no |
| `--sf-color-base-a95` | color | optional/tokens.palette.css:259 | no |
| `--sf-color-base-superlight` | alias | optional/tokens.palette.css:261 | no |
| `--sf-color-base-xlight` | alias | optional/tokens.palette.css:262 | no |
| `--sf-color-base-lighter` | alias | optional/tokens.palette.css:263 | no |
| `--sf-color-base-darker` | alias | optional/tokens.palette.css:264 | no |
| `--sf-color-base-xdark` | alias | optional/tokens.palette.css:265 | no |
| `--sf-color-base-superdark` | alias | optional/tokens.palette.css:266 | no |
| `--sf-color-base-hover` | alias | optional/tokens.palette.css:268 | no |
| `--sf-color-base-active` | alias | optional/tokens.palette.css:269 | no |
| `--sf-color-base-subtle` | alias | optional/tokens.palette.css:270 | no |
| `--sf-color-base-muted` | alias | optional/tokens.palette.css:271 | no |
| `--sf-color-base-ghost` | alias | optional/tokens.palette.css:272 | no |

Razem: 567 unikalnych tokenów (330 w `core/tokens.css`, 39 w `core/tokens.layout.css`, 198 w `optional/tokens.palette.css`; 12 zarejestrowanych przez `@property`).

## 10. Appendix C — Sources cited

### Pico CSS v2

- [Pico CSS v2 documentation index](https://picocss.com/docs)
- [Classless mode (semantic, no classes)](https://picocss.com/docs/classless)
- [Built-in colors (19 families, AA-tested)](https://picocss.com/docs/colors)
- [Color schemes — `data-theme` + `prefers-color-scheme`](https://picocss.com/docs/color-schemes)
- [`--pico-*` CSS variables reference](https://picocss.com/docs/css-variables)
- [Typography scale](https://picocss.com/docs/typography)
- [Form controls](https://picocss.com/docs/forms)
- [Auto-balanced grid](https://picocss.com/docs/grid)
- [`.container` / `.container-fluid` widths](https://picocss.com/docs/container)
- [`[role=group]` button / form clusters](https://picocss.com/docs/group)
- [`<button>` styles + outline / secondary modifiers](https://picocss.com/docs/button)
- [`<article>` card pattern](https://picocss.com/docs/card)
- [`<dialog>` modal](https://picocss.com/docs/modal)
- [`<nav>` navigation](https://picocss.com/docs/nav)
- [`<table>` semantic styling](https://picocss.com/docs/table)
- [`aria-busy="true"` loading spinner](https://picocss.com/docs/loading)
- [`<details>` + `<summary>` accordion](https://picocss.com/docs/accordion)
- [`<details role="list">` dropdown](https://picocss.com/docs/dropdown)
- [`data-tooltip` attribute pattern](https://picocss.com/docs/tooltip)
- [`<progress>` element](https://picocss.com/docs/progress)
- [Sass-based customisation (build step)](https://picocss.com/docs/sass)

### Automatic.css v4 (unverified — Cloudflare turnstile)

Pobranie `automaticcss.com` z tego sandboxa zwraca HTTP 403 + stronę challenge "Just a moment" Cloudflare turnstile dla każdego klienta nie-przeglądarkowego (`curl`, `web_fetch`). W konsekwencji każda komórka ACSS w sekcji 3 oraz każda linia `Compared-to` w sekcji 4 odnosząca się do ACSS niesie znacznik `[unverified]` — cytaty pozostają w celu zachowania ścieżki audytu, ale ich treść nie została potwierdzona z dokumentacją z tego sandboxa.

- [Automatic.css v4 documentation index (gated)](https://automaticcss.com/docs/)
- [Automatic.css marketing site (gated)](https://automaticcss.com)

### Bulma v1

- [Bulma documentation index](https://bulma.io/documentation/)
- [Install + classless attribute mode](https://bulma.io/documentation/overview/start/)
- [12-column flex grid + size modifiers](https://bulma.io/documentation/columns/)
- [Layout primitives — `.section`, `.container`, `.hero`, `.level`, `.media`, `.tile`, `.footer`](https://bulma.io/documentation/layout/)
- [Elements — box, button, content, delete, icon, image, notification, progress, table, tag, title](https://bulma.io/documentation/elements/)
- [Components — breadcrumb, card, dropdown, menu, message, modal, navbar, pagination, panel, tabs](https://bulma.io/documentation/components/)
- [Form control catalogue](https://bulma.io/documentation/form/)
- [Helpers — color, typography, spacing, flexbox, visibility utility classes](https://bulma.io/documentation/helpers/)
- [Customize — Sass variables and v1 with-variables CSS-vars hybrid](https://bulma.io/documentation/customize/)

### Tailwind CSS v4

- [Tailwind CSS v4 documentation index](https://tailwindcss.com/docs)
- [Color palette (22 hue families × 11 stops)](https://tailwindcss.com/docs/colors)
- [Dark mode — `dark:` variant + class / media-query strategies](https://tailwindcss.com/docs/dark-mode)
- [Responsive design — breakpoint + container-query variants](https://tailwindcss.com/docs/responsive-design)
- [Font family utilities](https://tailwindcss.com/docs/font-family)
- [Font feature settings utilities](https://tailwindcss.com/docs/font-feature-settings)
- [Font size utilities](https://tailwindcss.com/docs/font-size)
- [Font weight utilities](https://tailwindcss.com/docs/font-weight)
- [Border radius utilities](https://tailwindcss.com/docs/border-radius)
- [Box shadow utilities](https://tailwindcss.com/docs/box-shadow)
- [Aspect ratio utilities](https://tailwindcss.com/docs/aspect-ratio)
- [Built-in named animations](https://tailwindcss.com/docs/animation)
- [`@tailwindcss/typography` (`prose` long-form helper)](https://tailwindcss.com/docs/typography-plugin)
- [Adding custom styles — `@layer components/utilities` cascade-layer integration](https://tailwindcss.com/docs/adding-custom-styles)

### Standards / caniuse / MDN

- [caniuse — CSS cascade layers (`@layer`)](https://caniuse.com/css-cascade-layers)
- [caniuse — `@property` registered at-rule](https://caniuse.com/mdn-css_at-rules_property)
- [caniuse — `light-dark()` color function](https://caniuse.com/mdn-css_types_color_light-dark)
- [caniuse — `oklch()` color](https://caniuse.com/mdn-css_types_color_oklch)
- [caniuse — relative color syntax (`from`)](https://caniuse.com/css-relative-colors)
- [caniuse — `color-mix()`](https://caniuse.com/mdn-css_types_color_color-mix)
- [caniuse — `:has()` selector](https://caniuse.com/css-has)
- [caniuse — `sign()` math function](https://caniuse.com/mdn-css_types_sign)
- [caniuse — `@container` (container queries)](https://caniuse.com/css-container-queries)
- [caniuse — `subgrid` value](https://caniuse.com/css-subgrid)
- [caniuse — view transitions](https://caniuse.com/css-view-transitions)
- [MDN — `@property` reference](https://developer.mozilla.org/en-US/docs/Web/CSS/@property)
- [MDN — `sign()` reference](https://developer.mozilla.org/en-US/docs/Web/CSS/sign)
- [W3C — CSS Cascade Level 5 (`@layer` spec)](https://www.w3.org/TR/css-cascade-5/)
