# Audyt publicznego API SLASHED v0.3.0

**Data:** 2026-05-25  
**Zakres:** pełny audyt przed zamrożeniem API (kategorie A–G)  
**Pliki pominięte celowo:** `optional/components.css`, `optional/tokens.components.css`, `optional/utilities.css`

---

## A. Tokeny: spójność deklaracja ↔ użycie

### A1 🔴 PUBLIC API contract — dramatycznie niekompletny
**`core/tokens.css:41-52`**

Lista PUBLIC w nagłówku wymienia kilka grup (`--sf-space-*`, `--sf-shadow-*`, `--sf-z-*` itp.) ale **pomija całkowicie** następujące rodziny tokenów, które konsumenci regularnie będą konsumować i które muszą być objęte SemVer:

| Brakująca rodzina | Liczba tokenów |
|---|---|
| `--sf-animation-*` (presety + delay) | 17 |
| `--sf-gradient-*` | 10 |
| `--sf-color-link-*`, `--sf-color-bg--*`, `--sf-color-text--on-*`, `--sf-color-*-subtle/muted/strong` | ~35 |
| `--sf-opacity-*` | 6 |
| `--sf-blur-*` | 5 |
| `--sf-icon-*` | 5 |
| `--sf-container-*` | 5 |
| `--sf-ratio-*` | 6 |
| `--sf-size-*` | 5 |
| `--sf-stroke-*` | 4 |
| Aliasy typograficzne (`--sf-body-*`, `--sf-h1-h6-*`, `--sf-heading-*`) | ~30 |
| Rodziny fontów (`--sf-font-body/heading/mono/humanist…`) | 7 |
| `--sf-focus-ring-*` | 4 |
| `--sf-contrast-bias`, `--sf-contrast-threshold`, `--sf-lumlocker` | 3 |
| Scale multipliery (`--sf-space-scale`, `--sf-text-scale`…) | 5 |
| `--sf-header-height`, `--sf-sticky-offset`, `--sf-touch-target` | 3 |
| `--sf-safe-*`, `--sf-print-*`, `--sf-scrollbar-*`, `--sf-mask-scrim-*`, `--sf-scroll-timeline-range-*`, `--sf-perspective-*` | ~15 |

Przed zamrożeniem API każdy token musi być jednoznacznie sklasyfikowany. Tokeny nieoznaczone mogą zostać zmienione bez bump major, co złamie konsumentów.

---

### A2 🟠 `--sf-field-border-color` i `--sf-field-text-color` — undeclared cross-file consumer hooks
**`core/states.css:176-208`, `optional/forms.css:78,297`**

Ustawiane przez stany `.is-valid/.is-invalid/.is-error` itp., odczytywane przez forms.css. Nigdzie niezadeklarowane w tokens.css. Brak ich w `docs/tokens.md` i w PUBLIC API list. Konsument budujący własne komponenty walidacji nie znajdzie ich w dokumentacji tokenów.

---

### A3 🟠 `--sf-color-code-block-bg` i `--sf-color-code-block-text` — undeclared consumer hooks dla `<pre>`
**`core/base.css:127-128`**

```css
background: var(--sf-color-code-block-bg, var(--sf-color-code-bg));
color:       var(--sf-color-code-block-text, inherit);
```

Używane z fallbackami (poprawny wzorzec consumer hook), ale bez deklaracji w tokens.css i bez wzmianki w PUBLIC API. Konsument który chce inaczej stylować bloki kodu musi to odkryć samodzielnie.

---

### A4 🟠 Scoped override tokens niezadeklarowane: `--sf-icon-size`, `--sf-bento-cols`, `--sf-bento-row`
**`core/layout.css:250,480,481`**

```css
inline-size: var(--sf-icon-size, var(--sf-icon-m));          /* layout.css:250 */
grid-template-columns: repeat(var(--sf-bento-cols, var(--sf-bento-cols-default)), 1fr); /* :480 */
grid-auto-rows: minmax(var(--sf-bento-row, var(--sf-bento-row-default)), auto);  /* :481 */
```

To zamierzony wzorzec inline override (konsument pisze `style="--sf-icon-size: var(--sf-icon-l)"`). Ale nigdzie nie zadeklarowane — ani w `tokens.layout.css`, ani w PUBLIC liście. Przed freeze'em: albo formalnie zadeklarować jako PUBLIC scoped tokens, albo udokumentować wzorzec.

---

### A5 🟠 Canonical alias chain — komentarz mówi ≤2 hopy, rzeczywistość to 3 hopy
**`core/tokens.css:60`**

Komentarz głosi: *"alias graph is otherwise ≤2 hops (primitive → semantic → scale)"*. Rzeczywisty łańcuch dla stack:

```
--sf-stack-gap → --sf-space-content → --sf-content-gap → --sf-space-s
```
(3 hopy: primitive → alias-alias → canonical → scale)

I dla cluster:

```
--sf-cluster-gap → --sf-space-gap → --sf-gap → --sf-space-m
```
(3 hopy tak samo)

Komentarz jest błędny lub chain jest zbyt głęboki. Mylące dla konsumentów debugujących cascade.

---

### A6 🟠 Scoped state tokens niezadeklarowane: `--sf-is-active`, `--sf-is-open`, `--sf-is-current`, `--sf-is-pressed`
**`core/states.css:116,129,153,161,140`**

Ustawiane przez klasy stanów, przewidziane do konsumowania przez komponenty. Nie ma `@property` ani `:root` deklaracji. Nie ma ich w PUBLIC API. Są de facto publicznym API do budowania komponentów.

---

### A7 🟡 `--sf-focus-ring-shadow` zadeklarowany, ale framework go nie konsumuje
**`core/tokens.css:378-379`**

Zadeklarowany jako BEM consumer token. Celowe (dokumentacja nagłówka to potwierdza), ale nie wymieniony w PUBLIC API liście. Niskie ryzyko, konsument który go używa może się rozczarować jeśli zostanie usunięty.

---

## B. Nazewnictwo: spójność w całym API

### B1 🟠 Niespójna skala size modifierów
**`core/layout.css:93-100` (stack), `148-153` (cluster), `234-238` (grid), `16-19` (section)**

| Klasa | Skala modifierów |
|---|---|
| `.sf-stack` | `--2xs` / `--xs` / `--s` / `--m` / `--l` / `--xl` / `--2xl` / **`--3xl`** |
| `.sf-cluster` | `--2xs` / `--xs` / `--s` / `--m` / `--l` / `--xl` |
| `.sf-grid` | ~~`--2xs`~~ / `--xs` / `--s` / `--m` / `--l` / `--xl` |
| `.sf-section` | ~~`--2xs`~~ / ~~`--xs`~~ / `--s` / `--m` / `--l` / `--xl` |
| `.sf-icon` | ~~`--2xs`~~ / `--xs` / `--s` / `--m` / `--l` / `--xl` |

Niejednorodność nie jest udokumentowana jako celowa. Konsument budujący design system oczekuje spójnej skali. `--sf-stack--3xl` jest unikatem — żadna inna klasa nie sięga tak daleko.

---

### B2 🟠 Keyframe'y `sf-spin` i `sf-shimmer` bez tokenów `--sf-animation-*`
**`core/motion.css:135-136`**

Wszystkie 10 keyframe'ów przeznaczonych do użycia przez konsumentów ma tokeny `--sf-animation-*`. Dwa keyframe'y używane wewnętrznie przez framework nie mają tokenów:

| Keyframe | Token | Używany przez |
|---|---|---|
| `sf-fade-in` | `--sf-animation-fade-in` ✓ | `.sf-fade-in` |
| `sf-ping` | `--sf-animation-ping` ✓ | BEM consumer API |
| **`sf-spin`** | ❌ brak | `.is-loading::after` (states.css:80) |
| **`sf-shimmer`** | ❌ brak | `.is-skeleton` (states.css:103) |

Konsument chcący dostosować timing spinnera nie ma tokenu przez który to zrobi (musi nadpisać bezpośrednio animację).

---

### B3 🟠 `.sf-alternate` nie ma per-primitive tokenów gap
**`core/layout.css:384,389`**

```css
.sf-alternate     { gap: var(--sf-space-content); }  /* nie --sf-alternate-gap */
.sf-alternate > * { gap: var(--sf-space-gap); }      /* nie --sf-alternate-inner-gap */
```

Każdy inny layout primitive (stack, cluster, grid, sidebar, reel, bento…) ma własny `--sf-X-gap` token pozwalający na lokalny override przez `style="--sf-cluster-gap: 2rem"`. `.sf-alternate` wymaga nadpisania globalnych `--sf-space-content` / `--sf-space-gap`, co wpływa na wszystkie primitives. Udokumentowane w layout.md jako "`--sf-space-content, --sf-space-gap`" ale semantycznie niespójne z resztą API.

---

### B4 🟡 Niespójna nazwa `.sf-section--collapse` wobec wzorca modifierów
**`core/layout.css:37-42`**

Inne modifiery sekcji (`--s`, `--m`, `--l`, `--xl`) to skrótowce rozmiaru. `--collapse` to modifer zachowania — różna kategoria, ale ta sama składnia. Zmiana padding wymaga lokalnego `--sf-section-pad`, co jest nieoczywiste.

---

## C. Klasy: kompletność i spójność

### C1 🟡 `.sf-icon--boxed` — brak w `docs/layout.md` i brak w `demo.html`
**`core/layout.css:267-275`**

Klasa istnieje w kodzie, ma dedykowane tokeny (`--sf-icon-box-pad`, `--sf-icon-box-radius`, `--sf-icon-box-bg`, `--sf-icon-box-border` — wszystkie zadeklarowane w `tokens.layout.css:122-125`), ale:
- Nie pojawia się w tabeli `docs/layout.md`
- Nie pojawia się w `demo.html` (coverage.spec.js może jej nie testować)

---

### C2 🟡 `.sf-bento--2` i `.sf-bento--4` — w demo.html tylko jako tekst, nie jako klasy
**`docs/demo.html:2105`**

```html
<p>Modifiers: <code>.sf-bento--2</code>, <code>.sf-bento--4</code>…</p>
```

Klasy wspomniane tekstowo, nie użyte jako rzeczywiste klasy CSS. `tests/coverage.spec.js` może zgłosić brakujące pokrycie.

---

### C3 🟠 `.sf-entrance--*` — 6 klas animacyjnych bez dokumentacji
**`core/motion.css:90-117`**

`.sf-entrance--fade`, `.sf-entrance--fade-up`, `.sf-entrance--fade-down`, `.sf-entrance--fade-left`, `.sf-entrance--fade-right`, `.sf-entrance--scale-up` są w kodzie i w demo.html (linie 2478-2486), ale **brak ich w jakimkolwiek pliku docs/**. Nie ma opisów, nie ma listy tokenów (`--sf-scroll-timeline-range-*`), brak informacji o fallbacku dla Safari.

---

### C4 🟡 Hardcoded `opacity: 0.5` w `.is-dragging` — powinien być tokenem
**`core/states.css:270`**

```css
.is-dragging { opacity: 0.5; }
```

Token `--sf-opacity-50: 0.5` jest zadeklarowany w tokens.css. Brak spójności.

---

### C5 🟠 Hardcoded `opacity: 0.7` w `.is-pending` — brak tokenu
**`core/states.css:103`**

```css
.is-pending { opacity: 0.7; }
```

Skala opacity w tokens.css: 0, 0.1, 0.25, 0.5, 0.75, 1. Wartość 0.7 jest poza skalą, brak tokenu.

---

### C6 🟠 Hardcoded `calc(1.5s * ...)` w `.is-skeleton` — poza skalą duration tokenów
**`core/states.css:103`**

```css
animation: sf-shimmer calc(1.5s * var(--sf-motion-scale)) ease-in-out infinite;
```

`--sf-duration-slower: 600ms` to max skali. `1.5s` jest ponad 2× poza skalą. Konsument skalujący `--sf-motion-scale` do 0.5 (aby spowolnić UI) otrzyma shimmer trwający 750ms zamiast tokenowego `--sf-duration-slower`. Nieczytelna semantyka.

---

### C7 🟠 Hardcoded `z-index: 9999` w `.skip-link`
**`core/accessibility.css:152`**

```css
.skip-link { z-index: 9999; }
```

Token `--sf-z-max: 9999` jest zadeklarowany w tokens.css. Należy użyć `var(--sf-z-max)`.

---

### C8 🟡 `.sf-section--collapse` — w demo.html ale nie w `docs/layout.md`
**`core/layout.css:37-42`, `docs/demo.html:2468`**

Klasa jest w kodzie i zademonstrowana w demo.html (linia 2468). Nie ma jej w tabeli prymitywów w `docs/layout.md`. Brak opisanego wzorca użycia i ograniczenia (wymaga `--sf-section-pad` dla rozmiarów innych niż m).

---

### C9 🟡 `.sf-color-pulse` w osobnym bloku `@media` — niejednorodna struktura
**`core/motion.css:156-160`**

Klasy `.sf-fade-in`, `.sf-slide-in-*` itp. (linie 55-62) są w pierwszym bloku `@media (prefers-reduced-motion: no-preference)`. `.sf-color-pulse` jest w **osobnym** bloku `@media` na końcu pliku (linie 156-160). Celowe (komentarz wyjaśnia osobną naturę), ale rozbija czytelność pliku.

---

## D. Cascade layers: poprawność

### D1 ✅ Każda zadeklarowana warstwa ma wypełniający ją plik
**`core/layers.css:5-20`**

Wszystkie 15 warstw (oprócz `slashed.overrides` — celowo pusta, slot dla konsumenta) mają odpowiadające pliki CSS w bundlach. `slashed.forms`, `slashed.components`, `slashed.utilities` są opcjonalne — to jest prawidłowe, pusta zadeklarowana warstwa nie przeszkadza.

---

### D2 ✅ Żaden plik nie zapisuje do błędnej warstwy
Wszystkie pliki używają właściwego `@layer slashed.X`.

---

### D3 🟠 Flat bundle zmienia semantykę kaskady — brak ostrzeżenia w dokumentacji
**`scripts/bundle.js`, `bundle.config.json`**

W bundlu warstwowym: `a { color: blue }` konsumenta (unlayered, specyficzność 0-0-1) **wygrywa** z `slashed.base`'s `a:link { color: var(--sf-color-link) }` (layered, spec. 0-1-1) — bo unlayered normal beats layered normal.

W flat bundlu: `a:link` frameworka jest unlayered. Konsumenckie `a { color: blue }` (0-0-1) **przegrywa** ze specyficznością 0-1-1. Brakuje ostrzeżenia w README/docs.

---

### D4 🟡 `slashed.themes` po `slashed.states` w kolejności warstw
**`core/layers.css:9,14`**

```
…slashed.states, slashed.themes…
```

Oznacza to, że jeśli komponent chciałby nadpisać token kolorystyczny przez stan (np. `--sf-color-primary: red` w `.is-active`), themes może go potem zresetować. Nie ma to obecnego wpływu (states.css nie nadpisuje tokenów kolorystycznych), ale jest to kontrakt który warto udokumentować przed freeze'em.

---

## E. Bundle: spójność

### E1 ✅ Wszystkie bundles mają `core/layers.css` jako pierwszy plik
**`bundle.config.json:6,25,44,…`** — requirement spełniony.

### E2 ✅ Wszystkie package.json export paths wskazują na istniejące pliki
**`package.json:9-23`** — wszystkie `dist/*.css` wymienione w exports istnieją.

### E3 🟠 Brak export paths dla `.min.css` wersji w package.json
**`package.json:9-23`**

Pliki `dist/slashed.full.min.css`, `dist/slashed.optimal.min.css` itp. istnieją ale nie mają eksportów (`"./full/min": ...`). Dostępne tylko przez `unpkg`/`jsdelivr`. Konsument bundlera (Vite/webpack) nie może zaimportować wersji minified przez nazwę paczki. Celowe (minifikacja leży po stronie bundlera konsumenta) ale warto to udokumentować.

---

## F. Dokumentacja: synchronizacja z kodem

### F1 🟡 Dead reference: `audits/comparative-audit-2026.md`
**`core/print.css:7`**

```css
/* Color contract (Phase 3, see audits/comparative-audit-2026.md F-04): */
```

Katalog `audits/` nie istniał w repozytorium w momencie audytu. Referencja martwa.

### F2 🟡 Dead reference: `(see audit §D9)` — dwa miejsca
**`core/tokens.css:711`, `core/motion.css:141`**

```css
/* SLASHED ships no .sf-stagger utility class (see audit §D9). */
/* No utility classes ship for these (see audit §D9). */
```

`§D9` nie istnieje w żadnym dostępnym dokumencie. Należy zastąpić inline wyjaśnieniem lub PR reference.

### F3 🟡 `docs/tokens.md` nie oznacza deprecated tokenów
**`docs/tokens.md:404-405,422-423`**

`--sf-grid-min-default` i `--sf-sidebar-width-default` są oznaczone `@deprecated 0.4.0, removed in 0.5.0` w tokens.layout.css, ale w wygenerowanej tabeli docs/tokens.md brak tej informacji. Generator `gen-token-reference.js` pomija adnotacje deprecation.

### F4 🟡 `docs/states.md` nie wymienia `.visually-hidden` ani `.skip-link`
**`core/accessibility.css:130-142,148-161`**

`.visually-hidden` (alias `.sr-only`) jest zadeklarowane w accessibility.css ale brakuje go w tabeli states.md. `.skip-link` jest klasą frameworka (nie consumer-provided) ale też nieuwzględniona.

### F5 🟠 `.sf-entrance--*` — 6 klas bez jakiejkolwiek dokumentacji
**`core/motion.css:90-117`**

Klasy są w bundlu `essential`, mają tokeny (`--sf-scroll-timeline-range-*`), Safari fallback, ale zero dokumentacji poza kodem. W szczególności: brak opisu że te klasy potrzebują ancestor z `container-type` lub `overflow: visible` aby `view()` timeline działał.

### F6 🟡 `docs/layout.md` — brakuje `.sf-alternate` per-primitive token note
**`docs/layout.md:27`**

Tabela mówi `--sf-space-content, --sf-space-gap` dla `.sf-alternate`, co jest poprawne, ale brakuje adnotacji że **lokalne nadpisanie przez `style="..."` działa inaczej niż dla innych primitywów** (niszczy gap dla wszystkich innych prymitywów na tej samej gałęzi DOM).

---

## G. Specyfika API freeze

### G1 🔴 PUBLIC API contract niekompletny — identyczny z A1
**`core/tokens.css:41-52`**

*Patrz A1.* Bez uzupełnienia tej listy nie jest możliwe wydanie v1.0 z wiarygodnym SemVer contract. Konsumenci nie będą wiedzieć które tokeny są safe-to-consume a które mogą się zmienić.

### G2 🟠 Scoped tokens (`--sf-icon-size`, `--sf-bento-cols/row`) — niejednoznaczny status PUBLIC/INTERNAL
**`core/layout.css:250,480,481`**

Te tokeny są "wirtualnie publiczne" (konsument może je ustawiać przez `style=""`), ale nie mogą być nadpisane przez `:root {}`. Wzorzec ma ważne implikacje dla konsumentów budujących systemy tematyczne. Przed freeze'em: albo zadeklarować jako PUBLIC scoped (z dokumentacją ograniczenia `style=`-only), albo jako INTERNAL (i wypisać je z nagłówka).

### G3 🟡 `tokens.palette.css` — buduje na `--sf-color-text` (derived token, nie source)
**`optional/tokens.palette.css:48-52`**

Shades 600-950 dla brand colors miksują `var(--sf-color-primary)` z `var(--sf-color-text)`. Jeśli formuła `--sf-color-text` zmieni się (lub konsument nadpisze ją nieprawidłową wartością), cały ramp 600-950 zmieni wygląd. Mała podatność, ale warta ostrzeżenia w komentarzu.

### G4 ✅ `theme-example.css` — poprawne, API aktualne
**`optional/theme-example.css`** — wartości przykładowe, `data-theme`, `data-brand`, `.theme-transition` — zgodne z obecnym API.

### G5 🟠 Deprecated tokens będą nadal obecne w v0.4 bundle bez wyraźnego ostrzeżenia
**`core/tokens.layout.css:72-73,98-104`**

`--sf-sidebar-width-default` i `--sf-grid-min-default` są oznaczone jako `removed in 0.5.0`. Jeśli `docs/tokens.md` ich nie oznacza jako deprecated, konsumenci budujący w tym oknie (v0.3 → v0.4 → v0.5) nie będą ostrzeżeni.

---

## Tabela priorytetów: tylko 🔴 i 🟠

| # | Ryzyko | Lokalizacja | Opis |
|---|---|---|---|
| 1 | 🔴 | `tokens.css:41-52` | PUBLIC API contract niekompletny — ~120 tokenów bez statusu (A1, G1) |
| 2 | 🔴 | `tokens.css:41-52` | Brak w PUBLIC: `--sf-animation-*`, `--sf-gradient-*`, `--sf-opacity-*`, `--sf-icon-*`, aliasy typograficzne i inne (A1) |
| 3 | 🟠 | `states.css:176-208`, `forms.css:78,297` | `--sf-field-border-color` / `--sf-field-text-color` — undeclared cross-file hooks, nie w docs/tokens.md (A2) |
| 4 | 🟠 | `base.css:127-128` | `--sf-color-code-block-bg` / `--sf-color-code-block-text` — undeclared consumer hooks (A3) |
| 5 | 🟠 | `layout.css:250,480,481` | `--sf-icon-size`, `--sf-bento-cols`, `--sf-bento-row` — scoped override tokens niezadeklarowane, niejednoznaczny status PUBLIC/INTERNAL (A4, G2) |
| 6 | 🟠 | `tokens.css:60` | Komentarz alias chain "≤2 hops" niepoprawny, rzeczywistość to 3 hopy (A5) |
| 7 | 🟠 | `states.css:116,129,140,153` | `--sf-is-active/open/current/pressed` — state scoped tokens nie w PUBLIC contract (A6) |
| 8 | 🟠 | `layout.css:93-100,148-153,234-238,16-19` | Niespójna skala size modifierów (--2xs→--3xl vs --xs→--xl vs --s→--xl) bez dokumentacji (B1) |
| 9 | 🟠 | `motion.css:135-136` | `sf-spin` i `sf-shimmer` bez `--sf-animation-spin/shimmer` tokenów, niespójne z resztą (B2) |
| 10 | 🟠 | `layout.css:384,389` | `.sf-alternate` bez per-primitive `--sf-alternate-gap` tokenu — jedyny prymityw wymuszający zmianę globalnego tokenu (B3) |
| 11 | 🟠 | `states.css:103` | `.is-skeleton` — `calc(1.5s * ...)` poza skalą `--sf-duration-*` tokenów (C6) |
| 12 | 🟠 | `accessibility.css:152` | `.skip-link { z-index: 9999 }` zamiast `var(--sf-z-max)` (C7) |
| 13 | 🟠 | `states.css:270` | `.is-dragging { opacity: 0.5 }` zamiast `var(--sf-opacity-50)` (C4) |
| 14 | 🟠 | `states.css:103` | `.is-pending { opacity: 0.7 }` — wartość poza skalą opacity (C5) |
| 15 | 🟠 | `motion.css:90-117` | `.sf-entrance--*` — 6 klas publicznych bez dokumentacji (C3, F5) |
| 16 | 🟠 | `scripts/bundle.js`, `bundle.config.json` | Flat bundle zmienia semantykę kaskady — brak ostrzeżenia (D3) |
| 17 | 🟠 | `tokens.layout.css:72-73,98-104`, `docs/tokens.md` | Deprecated tokens nieoznaczone jako deprecated w generowanej dokumentacji (F3, G5) |
