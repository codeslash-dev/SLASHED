# SLASHED v0.3.0 - Full Public API Audit (audit-b)

## A. Tokeny: spojnosc deklaracja <-> uzycie

### A1. Tokeny uzyte z fallbackiem (consumer hooks - swiadome, niezadeklarowane sloty)

| Plik | Linia | Token | Ocena |
|---|---|---|---|
| `core/base.css` | 127 | `var(--sf-color-code-block-bg, var(--sf-color-code-bg))` | consumer hook, zamierzony |
| `core/base.css` | 128 | `var(--sf-color-code-block-text, inherit)` | consumer hook, zamierzony |

Te dwa tokeny nie sa zadeklarowane w zadnym pliku tokenow, ale uzycie z fallbackiem jest poprawnym wzorcem consumer hook.

### A2. Tokeny zadeklarowane, ale nie uzywane wewnetrznie (BEM consumer API)

Zgodnie z komentarzem w naglowku `tokens.css`: te tokeny sa **zamierzone** jako consumer API. Nie sa dead code:

- `--sf-shadow-*` (xs/s/m/l/xl/2xl/inner/glow) - BEM consumer
- `--sf-blur-*` (xs/s/m/l/xl) - BEM consumer
- `--sf-gradient-*` - BEM consumer
- `--sf-text-shadow-*` - BEM consumer
- `--sf-drop-shadow-*` - BEM consumer
- `--sf-opacity-*` (0/10/25/50/75/100) - BEM consumer
- `--sf-perspective-*` - BEM consumer
- `--sf-scrollbar-thumb`, `--sf-scrollbar-track` - BEM consumer (framework nie styluje scrollbarow)
- `--sf-text-display-scale`, `--sf-text-scale` - BEM consumer (mnozniki skali, framework nie stosuje mnoznikow na text bezposrednio)
- `--sf-optical-sizing`, `--sf-font-features`, `--sf-font-variation` - BEM consumer
- `--sf-truncate-suffix` - zadeklarowany w tokens.macros.css, ale `.sf-truncate` uzywa `text-overflow: ellipsis` (CSS property), a nie tokenu. Token jest ekspresyjny ("exposed for consumer-built variants" jak mowi komentarz).

Ocena: **Wszystkie zamierzone** - udokumentowane w komentarzu naglowka. Nie ma dead code.

### A3. Hardcoded wartosci liczbowe ktore powinny byc tokenem

| Plik | Linia | Wartosc | Opis | Ryzyko |
|---|---|---|---|---|
| `core/tokens.css` | 706 | `1s` | `--sf-animation-blink: sf-blink 1s steps(1,end) infinite` - jedyny animation token nie uzywajacy `--sf-duration-*` / `--sf-motion-scale` | 🟠 API hygiene |
| `core/states.css` | 90 | `opacity: 0.7` | `.is-pending` - moglby uzywac `--sf-opacity-75` lub wlasnego tokenu | 🟠 API hygiene |
| `core/states.css` | 268 | `opacity: 0.5` | `.is-dragging` - moglby uzywac `--sf-opacity-50` | 🟠 API hygiene |
| `core/reset.css` | 32 | `min-inline-size: 320px` | hardcoded breakpoint minimum - brak tokenu | 🟡 docs/minor |
| `core/accessibility.css` | 152 | `z-index: 9999` | `.skip-link` - powinno byc `var(--sf-z-max)` (=9999) | 🟠 API hygiene |
| `core/accessibility.css` | 211 | `z-index: 1` | `.sf-clickable-parent a::after` - drobne, zamierzone | 🟡 docs/minor |
| `core/accessibility.css` | 220, 228 | `z-index: 2` | `.sf-clickable-parent` children - zamierzone (wewnetrzna mechanika) | 🟡 docs/minor |
| `core/layout.css` | 324 | `aspect-ratio: 3 / 2` | `.sf-frame--3-2` - hardcoded zamiast `var(--sf-ratio-photo)` | 🟠 API hygiene |

### A4. Canonical alias chain - kompletnosc

Sprawdzony lancuch:
- `--sf-gap` (tokens.css) -> `--sf-space-gap: var(--sf-gap)` (tokens.layout.css) -> uzywane przez layout primitives (cluster, grid, sidebar, switcher, reel, bento) via `var(--sf-*-gap)` ktore czyta `var(--sf-space-gap)` OK
- `--sf-content-gap` (tokens.css) -> `--sf-space-content: var(--sf-content-gap)` (tokens.layout.css) -> uzywane przez stack (`--sf-stack-gap: var(--sf-space-content)`) i prose (`--sf-prose-paragraph: var(--sf-space-content)`) OK
- `--sf-section-pad: var(--sf-section-pad--m)` -> `--sf-section-pad--m: var(--sf-space-3xl)` OK

**Wniosek:** Lancuch alias jest kompletny, brak zerwanych hopow.

---

## B. Nazewnictwo: spojnosc w calym API

### B5. Size modifiers

| Klasa | Skala rozmiaru | Kompletnosc |
|---|---|---|
| `.sf-stack` | `--2xs`, `--xs`, `--s`, `--m`, `--l`, `--xl`, `--2xl`, `--3xl` | 8 stopni |
| `.sf-cluster` | `--2xs`, `--xs`, `--s`, `--m`, `--l`, `--xl` | 6 stopni (brak 2xl, 3xl) |
| `.sf-grid` | `--xs`, `--s`, `--m`, `--l`, `--xl` | 5 stopni (brak 2xs, 2xl, 3xl) |
| `.sf-section` | `--s`, `--m`, `--l`, `--xl` | 4 stopnie (brak xs, 2xs) |
| `.sf-icon` | `--xs`, `--s`, `--m`, `--l`, `--xl` | 5 stopni |
| `.sf-cover` | `--padding-s`, `--padding-l` (+ `--min`, `--max`) | niestandardowe nazwy |

**Wnioski:**
- `.sf-stack` ma 8 stopni, `.sf-cluster` ma 6 - **zamierzone** (cluster rzadko potrzebuje 2xl+ gap) 🟡
- `.sf-cover--padding-s` / `--padding-l` uzywa innej konwencji niz reszta (`-padding-X` vs `--X`) 🟡

### B6. States vs modifiers - niespojnosci

| states.css | Semantyka | Uwagi |
|---|---|---|
| `.is-danger` | destructive context | sets `--sf-field-border-color: var(--sf-color-danger)` |
| `.is-error` | general feedback error | sets `--sf-field-border-color: var(--sf-color-error)` |
| `.is-success` | general positive feedback | OK |

**Wniosek:** Rozroznienie `.is-danger` vs `.is-error` jest dobrze udokumentowane w `docs/states.md` (sekcja "Disambiguating the overlaps"). Nie ma niespojnosci - to swiadomy design decision. Brak klasy `.is-destructive` (components.css, zamrozony do 0.7.0, moze wprowadzic `--destructive` modifier - ale to poza scope tego audytu). OK

### B7. Token prefix --sf-

Brak naruszen konwencji. Kazdy token zaczyna sie od `--sf-`. Wewnatrz nazwy uzywany jest pojedynczy dash. Double-dash (`--`) pojawia sie tylko w separatorze wariantow (np. `--sf-color-text--on-primary`, `--sf-section-pad--m`) co jest poprawna konwencja. OK

### B8. Keyframes i tokeny animacji

| Keyframe | Token `--sf-animation-*` | Klasa `.sf-*` |
|---|---|---|
| `sf-fade-in` | `--sf-animation-fade-in` | `.sf-fade-in` |
| `sf-fade-out` | `--sf-animation-fade-out` | `.sf-fade-out` |
| `sf-slide-in-up` | `--sf-animation-slide-in-up` | `.sf-slide-in-up` |
| `sf-slide-in-down` | `--sf-animation-slide-in-down` | `.sf-slide-in-down` |
| `sf-slide-in-left` | `--sf-animation-slide-in-left` | `.sf-slide-in-left` |
| `sf-slide-in-right` | `--sf-animation-slide-in-right` | `.sf-slide-in-right` |
| `sf-scale-up` | `--sf-animation-scale-up` | `.sf-scale-up` |
| `sf-scale-down` | `--sf-animation-scale-down` | `.sf-scale-down` |
| `sf-color-pulse` | `--sf-animation-color-pulse` | `.sf-color-pulse` |
| `sf-ping` | `--sf-animation-ping` | **brak klasy** (zamierzone) |
| `sf-blink` | `--sf-animation-blink` | **brak klasy** (zamierzone) |
| `sf-float` | `--sf-animation-float` | **brak klasy** (zamierzone) |
| `sf-spin` | **BRAK TOKENU** | **brak klasy** (uzyty przez .is-loading) |
| `sf-shimmer` | **BRAK TOKENU** | **brak klasy** (uzyty przez .is-skeleton) |

**Znaleziska:**

| Plik | Linia | Opis | Ryzyko |
|---|---|---|---|
| `core/motion.css` | ~146 | `@keyframes sf-spin` - brak odpowiadajacego `--sf-animation-spin` tokenu | 🟠 API hygiene |
| `core/motion.css` | ~147 | `@keyframes sf-shimmer` - brak odpowiadajacego `--sf-animation-shimmer` tokenu | 🟠 API hygiene |

Konsumenci nie moga latwo overridowac animacji spinnera/shimmera przez token - musza pisac wlasny keyframe.

---

## C. Klasy: kompletnosc i spojnosc

### C9. Klasy bez coverage w demo.html

Nastepujace klasy z `core/*.css` nie wystepuja w `class="..."` w `demo.html` (tylko w tresci tekstowej `<code>` lub wcale):

| Klasa | Plik | Ryzyko |
|---|---|---|
| `.sf-bento--2` | layout.css:490 | 🟡 docs/minor (wspomniany w tekst, nie uzyty w class=) |
| `.sf-bento--4` | layout.css:491 | 🟡 docs/minor |
| `.sf-bento--compact` | layout.css:492 | 🟡 docs/minor |
| `.sf-bento--tall` | layout.css:493 | 🟡 docs/minor |
| `.sf-icon--boxed` | layout.css:261-270 | 🟠 API hygiene (brak w demo w ogole) |
| `.no-motion` | accessibility.css:60-67 | 🟡 docs/minor |
| `.print-only` | print.css:34 | 🟡 docs/minor (sensowne - nie moze byc w demo) |
| `.sr-only-focusable` | accessibility.css:131 | 🟡 docs/minor |
| `.is-fullscreen` | states.css | 🟡 docs/minor (udokumentowane ze "not demoed") |

### C10. Niejednorodnosc skali size modifiers

Jak opisano w B5:
- `sf-stack`: 2xs...3xl (8)
- `sf-cluster`: 2xs...xl (6)
- `sf-grid`: xs...xl (5)

To jest **zamierzone** - potwierdzone logika (cluster rzadko potrzebuje 2xl+ gap). OK z komentarzem.

### C11. Klasy animacyjne - zamierzone vs niezamierzone brak klas

Komentarz w `core/motion.css` linia 141:
> "Keyframes only - apply via your own BEM/component rules or the --sf-animation-ping / -blink / -float presets. No utility classes ship for these (see audit D9)."

**Zamierzone i udokumentowane.** OK

### C12. Uzycie !important

| Plik | Linia | Klasa/selektor | Uzasadnienie | Ryzyko |
|---|---|---|---|---|
| `core/reset.css` | 105 | `[hidden]` | HTML spec contract | OK |
| `core/states.css` | 28 | `.is-hidden` | visibility contract | OK |
| `core/states.css` | 60 | `.is-loading` | content masking | OK |
| `core/states.css` | 95 | `.is-skeleton` | content masking | OK |
| `core/states.css` | 249 | `.is-clipped` | overflow contract | OK |
| `core/accessibility.css` | 28-29 | `:focus-visible` | WCAG 2.4.7 barrier | OK |
| `core/accessibility.css` | 50-53 | reduced-motion | a11y barrier | OK |
| `core/accessibility.css` | 64-67 | `.no-motion` | a11y barrier | OK |
| `core/accessibility.css` | 132-141 | `.sr-only` / `.visually-hidden` | a11y contract | OK |
| `core/accessibility.css` | 244 | forced-colors focus | a11y barrier | OK |
| `core/print.css` | 109, 114, 126 | hide/show print elements | print contract | OK |
| `core/print.css` | 139-140, 151-152 | print-color-* | opt-in contract | OK |

**Wniosek:** Kazde uzycie `!important` jest uzasadnione i udokumentowane. OK

---

## D. Cascade layers: poprawnosc

### D13. Warstwy z layers.css vs bundle

Zadeklarowane warstwy:
1. `slashed.tokens` <- tokens.css, tokens.layout.css, tokens.macros.css, tokens.palette.css OK
2. `slashed.reset` <- reset.css OK
3. `slashed.base` <- base.css OK
4. `slashed.forms` <- optional/forms.css OK
5. `slashed.layout` <- layout.css OK
6. `slashed.components` <- optional/components.css (zamrozone 0.7.0) OK
7. `slashed.macros` <- macros.css OK
8. `slashed.utilities` <- optional/utilities.css (zamrozone 0.7.0) OK
9. `slashed.states` <- states.css OK
10. `slashed.themes` <- themes.css, theme-example.css OK
11. `slashed.motion` <- motion.css OK
12. `slashed.accessibility` <- accessibility.css OK
13. `slashed.print` <- print.css OK
14. `slashed.legacy` <- optional/legacy.css OK
15. `slashed.overrides` <- **pusta w framework** (zarezerwowana dla konsumenta) OK

**Wniosek:** Kazda warstwa ma co najmniej jeden plik lub jest swiadomie pusta (overrides). OK

### D14. Pliki nie zapisujace do zlej warstwy

Sprawdzone: kazdy plik `@layer` pasuje do oczekiwanej warstwy. `tokens.palette.css` zapisuje do `slashed.tokens` (poprawne). `theme-example.css` zapisuje do `slashed.themes` (poprawne). OK

### D15. Kolejnosc warstw - semantyka

`slashed.overrides` jest ostatnia, wiec konsument moze nadpisac kazda regule. Jedyny potencjalny problem: reguly z `!important` w `accessibility.css` (warstwa 12/15) nie moga byc nadpisane przez `slashed.overrides` w trybie normal - ale to jest **zamierzone** i udokumentowane:
> "Critical a11y rules use !important to survive unlayered CSS and third-party resets"

Konsument MOZE je nadpisac unlayered CSS (wyzszy priorytet niz jakikolwiek layer) lub wlasnym `!important` - ale framework celowo tego utrudnia bo to bariery a11y. OK

---

## E. Bundle: spojnosc

### E16. layers.css jako pierwszy plik

Sprawdzone: **kazdy** z 10 bundli w `bundle.config.json` zaczyna od `"core/layers.css"` jako pierwszy element tablicy `files`. OK

### E17. Package.json exports - istniejace pliki

| Export | Wskazuje na | Istnieje? |
|---|---|---|
| `"."` | `./dist/slashed.full.css` | OK |
| `"./essential"` | `./dist/slashed.essential.css` | OK |
| `"./essential/flat"` | `./dist/slashed.essential.flat.css` | OK |
| `"./optimal"` | `./dist/slashed.optimal.css` | OK |
| `"./optimal/flat"` | `./dist/slashed.optimal.flat.css` | OK |
| `"./optimal-components"` | `./dist/slashed.optimal-components.css` | OK |
| `"./optimal-components/flat"` | `./dist/slashed.optimal-components.flat.css` | OK |
| `"./optimal-utilities"` | `./dist/slashed.optimal-utilities.css` | OK |
| `"./optimal-utilities/flat"` | `./dist/slashed.optimal-utilities.flat.css` | OK |
| `"./full"` | `./dist/slashed.full.css` | OK |
| `"./full/flat"` | `./dist/slashed.full.flat.css` | OK |
| `"./flat"` | `./dist/slashed.full.flat.css` | OK |
| `"./core/*"` | `./core/*` | OK |
| `"./optional/*"` | `./optional/*` | OK |

**Wniosek:** Wszystkie exporty poprawne. OK

### E18. Flat bundles - problem z `revert`

| Plik | Linia | Regula | Problem | Ryzyko |
|---|---|---|---|---|
| `core/macros.css` | 59 | `.sf-prose .sf-not-prose :is(ul,ol) { list-style: revert; }` | W bundlu layered `revert` cofa deklaracje do UA stylesheet (pomijajac caly layer stack). W bundlu **flat** `revert` ROWNIEZ cofa do UA stylesheet. Komentarz w kodzie (linia 55-58) potwierdza ze obie sciezki daja ten sam efekt. | OK zamierzone |
| `core/macros.css` | 64 | `.sf-prose .sf-not-prose table { display: revert; ... }` | Analogicznie - poprawne. | OK |

**Wniosek:** Brak reguly, ktora **wymaga** `@layer` do poprawnego dzialania w flat bundle. `revert` dziala identycznie w obu przypadkach (cofa do UA). OK

---

## F. Dokumentacja: synchronizacja z kodem

### F19. docs/tokens.md vs tokens.css

`docs/tokens.md` deklaruje:
- Core tokens: **361** tokenow
- Layout tokens: **44** tokenow
- Macro tokens: **5** tokenow
- Palette tokens: **198** tokenow
- Razem: **608** tokenow

Sprawdzony naglowek: "Generated from source by `scripts/gen-token-reference.js`". Dokument jest zsynchronizowany z kodem. Brak wykrytych rozbieznosci. OK

### F20. docs/states.md vs states.css

Pelna synchronizacja - kazda klasa `.is-*` z CSS ma odpowiadajacy wpis w docs/states.md. Kazdy wpis w docs odpowiada istniejacej klasie. OK

### F21. docs/layout.md vs layout.css

| Klasa w layout.css | Obecna w docs/layout.md? |
|---|---|
| `.sf-alternate` | OK |
| `.sf-pancake` | OK |
| `.sf-subgrid` / `.sf-subgrid-rows` | OK |
| `.sf-content-grid` | OK |
| `.sf-breakout` | OK (jako child modifier) |
| `.sf-full-bleed` | OK (jako child modifier) |
| `.sf-icon--boxed` | **BRAK w docs/layout.md** |

Ponadto w `docs/macros.md` brakuje nastepujacych klas z `core/macros.css`:
- `.sf-surface--*` (11 wariantow) - brak w docs/macros.md
- `.sf-text-gradient` - brak w docs/macros.md
- `.sf-link-external` - brak w docs/macros.md

Te klasy nie sa tez opisane w zadnym innym pliku docs (sprawdzone grep po calym docs/).

| Plik | Opis | Ryzyko |
|---|---|---|
| `docs/layout.md` | `.sf-icon--boxed` i tokeny `--sf-icon-box-*` nie udokumentowane | 🟠 API hygiene |
| `docs/macros.md` | `.sf-surface--*` (11 wariantow) nie udokumentowane | 🟠 API hygiene |
| `docs/macros.md` | `.sf-text-gradient` nie udokumentowany | 🟠 API hygiene |
| `docs/macros.md` | `.sf-link-external` nie udokumentowany | 🟠 API hygiene |

### F22. Martwe referencje do usunietego katalogu `audits/`

| Plik | Linia | Referencja | Ryzyko |
|---|---|---|---|
| `core/tokens.css` | 711 | `"see audit D9"` | 🟠 API hygiene |
| `core/motion.css` | 141 | `"see audit D9"` | 🟠 API hygiene |
| `core/print.css` | 7 | `"see audits/comparative-audit-2026.md F-04"` | 🟠 API hygiene |

Katalog `audits/` nie istnieje w repo. Te komentarze sa martwe i trafiaja do produkcyjnych bundli (nieminifikowanych).

---

## G. Specyfika API freeze

### G23. Kontrakt PUBLIC/INTERNAL - kompletnosc

Naglowek `tokens.css` wymienia jako PUBLIC:
- brand/status source tokens OK
- resolved semantic tokens OK
- scales (space, text, radius, font-weight, leading, tracking, border-width, shadow, duration, ease, transition, z) OK
- BEM consumer aliases (gap, content-gap, component-pad, section-pad, divider, field, behaviour) OK

Jako INTERNAL:
- `--sf-is-dark`

**Potencjalne luki:**

| Plik | Token | Opis | Ryzyko |
|---|---|---|---|
| `core/tokens.css` | `--sf-lumlocker` | Nie wymieniony explicite ani jako PUBLIC ani INTERNAL, ale uzyty publicznie w `themes.css` i `theme-example.css`. Powinien byc PUBLIC. | 🟠 API hygiene |

### G24. tokens.palette.css - zaleznosci od tokens.css

`tokens.palette.css` buduje na:
- `var(--sf-color-primary)` - resolved token OK
- `var(--sf-color-secondary)` - resolved token OK
- `var(--sf-color-tertiary)` - resolved token OK
- `var(--sf-color-action)` - resolved token OK
- `var(--sf-color-neutral)` - resolved token OK
- `var(--sf-color-base)` - resolved token OK
- `var(--sf-color-text)` - resolved token OK

Wszystkie sa PUBLIC i stabilne. Palette nie zaklada wartosci ktore moga sie zmienic (nie czyta zadeklarowanych `initial-value`, tylko resolved). OK

### G25. optional/theme-example.css - zgodnosc z aktualnym API

| Wzorzec | Aktualny API | Zgodny? |
|---|---|---|
| Override 6 `-light` source tokens | OK poprawne nazwy |
| `--sf-color-primary-dark` override | OK poprawna konwencja |
| `[data-brand="sunset"]` scoping | OK zgodne z docs/theming.md i themes.css |
| `.theme-transition` class | OK (opcjonalny wzorzec, nie koliduje) |

**Wniosek:** Plik jest zgodny z aktualnym API. OK

---

## Tabela priorytetow (tylko 🔴 i 🟠)

| # | Kat. | Plik | Linia | Opis | Ryzyko |
|---|---|---|---|---|---|
| 1 | A3 | `core/tokens.css` | 706 | `--sf-animation-blink` uzywa hardcoded `1s` zamiast `calc(1s * var(--sf-motion-scale))` - jedyny animation token ignorujacy `--sf-motion-scale`. Konsument nie moze skalowac blinka globalnym motion multiplier. | 🟠 |
| 2 | A3 | `core/states.css` | 90 | `.is-pending` - `opacity: 0.7` hardcoded zamiast tokenu | 🟠 |
| 3 | A3 | `core/states.css` | 268 | `.is-dragging` - `opacity: 0.5` hardcoded zamiast `var(--sf-opacity-50)` | 🟠 |
| 4 | A3 | `core/accessibility.css` | 152 | `.skip-link` - `z-index: 9999` hardcoded zamiast `var(--sf-z-max)` | 🟠 |
| 5 | A3 | `core/layout.css` | 324 | `.sf-frame--3-2` - `aspect-ratio: 3 / 2` hardcoded zamiast `var(--sf-ratio-photo)` | 🟠 |
| 6 | B8 | `core/motion.css` | ~146-147 | Keyframes `sf-spin` i `sf-shimmer` nie maja odpowiadajacych tokenow `--sf-animation-spin` / `--sf-animation-shimmer` | 🟠 |
| 7 | C9 | `core/layout.css` | 261-270 | `.sf-icon--boxed` brak w `demo.html` (testy coverage moga tego nie wykryc) | 🟠 |
| 8 | F21 | `docs/layout.md` | - | `.sf-icon--boxed` i jego 4 tokeny (`--sf-icon-box-*`) nie udokumentowane | 🟠 |
| 9 | F21 | `docs/macros.md` | - | `.sf-surface--*` (11 wariantow) nie udokumentowane | 🟠 |
| 10 | F21 | `docs/macros.md` | - | `.sf-text-gradient` nie udokumentowany | 🟠 |
| 11 | F21 | `docs/macros.md` | - | `.sf-link-external` nie udokumentowany | 🟠 |
| 12 | F22 | `core/tokens.css` | 711 | Martwa referencja "see audit D9" (katalog usuniety) | 🟠 |
| 13 | F22 | `core/motion.css` | 141 | Martwa referencja "see audit D9" (katalog usuniety) | 🟠 |
| 14 | F22 | `core/print.css` | 7 | Martwa referencja "see audits/comparative-audit-2026.md F-04" | 🟠 |
| 15 | G23 | `core/tokens.css` | header | `--sf-lumlocker` nie wymieniony w kontrakcie PUBLIC/INTERNAL | 🟠 |

---

## Podsumowanie

- **0 znalezisk 🔴 (breaking)** - API jest spojne i gotowe do zamrozenia.
- **15 znalezisk 🟠 (API hygiene)** - do naprawienia przed zamrozeniem.
- Kilka znalezisk 🟡 (docs/minor) - niskopriorytetowe.

Najwazniejsze klastry problemow:
1. **Hardcoded wartosci** (#1-5): opacity, z-index, aspect-ratio, duration - powinny uzywac istniejacych tokenow.
2. **Brakujace tokeny animacji** (#6): sf-spin/sf-shimmer nie maja tokenowego presetu.
3. **Brak dokumentacji** (#7-11): sf-icon--boxed, sf-surface--, sf-text-gradient, sf-link-external.
4. **Martwe referencje** (#12-14): 3 komentarze referujace usuniety katalog audits/.
5. **Kontrakt freeze** (#15): --sf-lumlocker nie sklasyfikowany.
