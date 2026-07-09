<!-- OWNERSHIP / STATUS
     Jednorazowy, ręczny audyt źródeł CSS (core/ + optional/) — nie jest częścią
     `npm run build`/CI. Metodologia: statyczna analiza krzyżowa deklaracji
     `--sf-*` i selektorów `.sf-*` we wszystkich plikach źródłowych (komentarze
     i stringi odfiltrowane), zestawiona z bramkami CI (`audit:check`,
     `check:llm-guide`, `check:macros`, `check:registry`, `lint:css`)
     i wbudowanym raportem `node scripts/audit.js --unused`. -->

# Audyt źródeł CSS — tokeny, klasy, spójność

**Framework:** SLASHED v0.7.8 · **Data:** 2026-07-09
**Zakres:** 13 plików `core/*.css` + 8 plików `optional/*.css` (5 559 linii),
735 tokenów, 292 klasy `.sf-*`, 28 klas `.sf-is-*`, 69 makr, 18 `@keyframes`.

---

## 1. Podsumowanie

Architektura jest spójna i działa jak jeden mechanizm: wszystkie bramki CI
przechodzą, stylelint jest czysty, komplet `@keyframes` ma konsumentów,
pary plików token→konsument (`tokens.layout.css`→`layout.css`,
`tokens.macros.css`→`macros.css`) mają **zero** osieroconych tokenów,
a wszystkie celowo zduplikowane formuły (SL-001 w `themes.css`,
kopie skal w `.sf-fluid-cq` w `layout.css`) są **znak-w-znak zsynchronizowane**
ze swoimi pierwowzorami w `tokens.css` (zweryfikowano mechanicznie: 21 kopii
skal, 0 rozjazdów; formuły clamp() dark-derivation zgodne).

Znaleziono natomiast **3 twarde defekty** (zdefiniowane knoby, które nie
działają, bo konsument ich nie czyta), **2 niespójności niskiej wagi**
i kilka obserwacji porządkowych. Żadna klasa, primitive ani makro nie jest
"niedziałające" w sensie zepsutego selektora czy brakującego tokenu.

| # | Znalezisko | Waga | Typ |
|---|-----------|------|-----|
| F1 | `--sf-field-radius`, `--sf-field-padding-block/-inline` zdefiniowane, ale `forms.css` ich nie czyta | **wysoka** | martwy knob |
| F2 | `--sf-print-page-margin`, `--sf-print-page-size` zdefiniowane, ale `@page` w `print.css` hardcoduje wartości | **średnia** | martwy knob |
| F3 | `--sf-size-m` — martwy szczebel skali rozmiarów; `.sf-btn--l` pomija `--sf-size-l` | **średnia** | niespójne mapowanie |
| F4 | Autofill w `forms.css` ustawia `caret-color` z pominięciem tokenu `--sf-caret-color` | niska | niespójność |
| F5 | Fallback `--sf-card-radius-outer` w `components.css` powiela formułę z `tokens.components.css` | niska | redundancja |

---

## 2. Twarde defekty

### F1 — Tokeny pól formularzy nie są podpięte (martwe knoby) — WYSOKA

`optional/tokens.components.css:46-48` definiuje:

```css
--sf-field-radius:         var(--sf-radius-m);
--sf-field-padding-block:  var(--sf-space-xs);
--sf-field-padding-inline: var(--sf-space-s);
```

…ale `optional/forms.css:23-30` (jedyny komponent pól) używa wartości
bezpośrednio:

```css
padding-block: var(--sf-space-xs);
padding-inline: var(--sf-space-s);
border-radius: var(--sf-radius-m);
```

Te trzy tokeny **nie są konsumowane przez żaden plik źródłowy** — ustawienie
ich przez użytkownika nic nie zmienia, mimo że nagłówek `forms.css` deklaruje:
„Values resolve through core and optional component tokens". Pozostałe tokeny
`--sf-field-*` (`-border-color`, `-text-color`, `-required-marker`, `-block`)
działają poprawnie.

Dodatkowy niuans: `forms.css` jest w każdym bundle'u (także tych **bez**
`tokens.components.css`), więc poprawka powinna czytać tokeny przez fallback,
np. `padding-block: var(--sf-field-padding-block, var(--sf-space-xs))` — tak
jak robi to już `--sf-field-border-color`.

### F2 — Tokeny strony wydruku nie są podpięte — ŚREDNIA

`core/tokens.css:1471-1472` definiuje `--sf-print-page-margin: 2cm` i
`--sf-print-page-size: a4` (oba sklasyfikowane jako PUBLIC-ADVANCED w
`scripts/token-tiers.js`), ale `core/print.css:15-19`:

```css
@page {
  size:   a4 portrait;
  margin: 2cm;
}
```

hardcoduje te same wartości. Ustawienie tokenów nic nie zmienia. Uwaga
techniczna: `var()` w kontekście `@page` ma ograniczone wsparcie przeglądarek —
jeśli hardcode jest świadomym obejściem, tokeny należałoby usunąć albo
oznaczyć w dokumentacji jako „do własnych arkuszy print użytkownika"
(obecnie `--sf-print-base-size` działa, dwa pozostałe to wydmuszki).

### F3 — Dziura w skali rozmiarów: `--sf-size-m` osierocony, `.sf-btn--l` używa `--sf-size-xl` — ŚREDNIA

Skala `--sf-size-*` (`tokens.css:1172-1176`): xs 1.5rem · s 2rem · m 2.5rem ·
l 2.75rem · xl 3.5rem. Faktyczne mapowanie w `optional/components.css:302-325`:

| Wariant przycisku | min-height czyta | Oczekiwane |
|---|---|---|
| `.sf-btn--xs` | `--sf-size-xs` | ✓ |
| `.sf-btn--s` | `--sf-size-s` | ✓ |
| domyślny (m) | `--sf-touch-target` (= `--sf-size-l`) | świadome (WCAG touch target) |
| `.sf-btn--l` | `--sf-size-xl` | `--sf-size-l`? |
| `.sf-btn--xl` | `calc(var(--sf-size-xl) + var(--sf-space-s))` | `--sf-size-xl`? |

Skutki: `--sf-size-m` nie jest konsumowany przez nic w frameworku (pułapka —
override nic nie robi), a `--sf-size-l` działa tylko pośrednio przez
`--sf-touch-target`. Jeśli przeskok domyślnego rozmiaru na `size-l` jest
świadomy (44px touch target), to drabinka `l→xl`, `xl→xl+space-s` wygląda na
kompensację, ale wtedy `--sf-size-m` (2.5rem) jest martwym wpisem — do
usunięcia albo do podpięcia (np. jako domyślny min-height gdy touch target
nie obowiązuje, `@media (pointer: fine)`).

---

## 3. Niespójności niskiej wagi

### F4 — Autofill omija token karetki

`core/base.css:173` ustawia `caret-color: var(--sf-caret-color)`
(token adaptowany powierzchniowo przez makra w `macros.css:286`), ale reguły
autofill w `optional/forms.css:71,77` ustawiają `caret-color:
var(--sf-color-text)` na sztywno. W polu autofillowanym wewnątrz
`.sf-surface--*` karetka przestanie się adaptować. Prawdopodobnie zamierzone
dopasowanie do `-webkit-text-fill-color`, ale warto ujednolicić do
`var(--sf-caret-color)` albo zostawić komentarz dlaczego nie.

### F5 — Zduplikowana formuła fallbacku promienia karty

`optional/components.css:390`:

```css
border-radius: var(--sf-card-radius-outer, calc(var(--sf-radius-m) + var(--sf-space-l)));
```

Fallback ręcznie odtwarza formułę z `tokens.components.css:18`
(`calc(var(--sf-card-radius) + var(--sf-card-padding))`) przez podstawienie
domyślnych wartości. Jeśli defaulty `--sf-card-radius`/`--sf-card-padding`
kiedyś się zmienią, fallback się rozjedzie. Warte komentarza „keep in sync"
w stylu SL-001 (bundle'y z `components.css` zawsze zawierają
`tokens.components.css`, więc fallback i tak jest tylko siatką bezpieczeństwa).

---

## 4. Tokeny „osierocone" — klasyfikacja 162 pozycji z `audit.js --unused`

`node scripts/audit.js --unused` raportuje 162 tokeny zadeklarowane, lecz nie
konsumowane przez framework. Po przeglądzie ręcznym:

**Celowe publiczne API (nie ruszać)** — zdecydowana większość:
- rampy palet `--sf-color-{base|primary|…}-{50…950,a50,a80,tint,lighter,…}`
  (generowane, PUBLIC/ADVANCED — surowiec dla użytkownika),
- skala z-index `--sf-z-*` (below…toast) — framework sam nie warstwuje, knoby
  dla aplikacji,
- `--sf-transition-*`, `--sf-ease-{bounce,elastic,spring,linear}`,
  `--sf-duration-{none,instant}`, `--sf-animation-*` (gotowe presety),
- fonty alternatywne `--sf-font-{display,geometric,humanist,slab}`,
  wagi `light/medium/display`, `--sf-tracking-{wider,widest}`,
- `--sf-gradient-{brand,surface,fade--*}`, `--sf-shadow-{glow,inner,…}`,
  `--sf-text-shadow-*`, `--sf-blur`, `--sf-border`/`--sf-border-strong`,
- `--sf-safe-*` (safe-area), `--sf-color-{white,black,overlay}`,
- `--sf-text-display-*` + `--sf-display-*-line-height` — para wyjściowa dla
  własnych stylów hero (udokumentowana przykładem w `tokens.css:1054-1058`);
  spójna, choć framework sam jej nie używa (żadna klasa `.sf-display` nie
  istnieje — świadoma decyzja, nie defekt).

**Zepsute knoby (opisane wyżej):** `--sf-field-radius`,
`--sf-field-padding-block/-inline` (F1), `--sf-print-page-margin/-size` (F2),
`--sf-size-m` (F3).

**Tokeny-hooki bez definicji (celowe, udokumentowane):** 3 tokeny są używane,
choć nigdzie nie zdefiniowane — wszystkie przez `var(…, fallback)` i wszystkie
opisane w `docs/llm-guide.md`: `--sf-color-code-block-bg`,
`--sf-color-code-block-text` (`base.css:118-119`), `--sf-overlap-host-pad`
(`macros.css:437`, celowo nie prebaked na `:root` — komentarz #496). Uwaga
porządkowa: jako niezadeklarowane nie wchodzą do `docs/registry.json` ani
token-registry — są widoczne tylko w llm-guide.

---

## 5. Konflikty i redundancje — zweryfikowane jako celowe

Wszystkie poniższe wyglądają w surowym grep jak konflikty, ale są celową,
udokumentowaną architekturą (zweryfikowano synchronizację kopii):

- **SL-001** — formuły dark-derivation zduplikowane między
  `tokens.css` (wersja `light-dark()` na `:root`) a `themes.css` (wersja
  płaska dla `[data-theme]` na dowolnym elemencie). Kopie zgodne
  (`clamp(0.65, 0.95−l·0.5, 0.88)`, base `clamp(0.16, 1.18−l, 0.24)`).
- **Kopie skal w `layout.css:130-152`** (`.sf-fluid-cq > *`) — re-derywacja
  container-query; 21 formuł znak-w-znak identycznych z `tokens.css`.
- **Nadpisania powierzchniowe w `macros.css:253-288`** (`--sf-color-text`,
  `--sf-color-border*`, `--sf-caret-color`, `--sf-focus-ring-color`,
  `--sf-shadow-color`… od `--sf-surface-contrast`) — mechanizm adaptacji
  `.sf-surface--*`.
- **Nadpisania a11y w `accessibility.css`** (`--sf-duration-*: 0.01ms`,
  `--sf-shadow-strength: 0`, `--sf-blur: 0px`, `--sf-contrast-bias`,
  `--sf-focus-ring-*`) — pod `prefers-reduced-motion/-data/-contrast`
  i `forced-colors`.
- **`--sf-card-bg`/`--sf-card-border-color` w `core/themes.css:33-34`** —
  celowa re-substytucja aliasu dla sekcyjnego `data-theme` (długi komentarz
  na miejscu); wartości zgodne z `tokens.components.css`.
- **Statyczne fallbacki `--sf-color-text--on-*` i `--sf-color-code-text`**
  (`tokens.css:305-315` vs bramka `sign()` w `tokens.css:668-677`) —
  udokumentowany fallback dla Chrome 125-137/Firefox 128-130.
- **Warianty w klasach** (`--sf-btn-*` × 10 kolorów × 4 rozmiary,
  `--sf-divider-*`, `--sf-grid-min-*`, `--sf-icon-size`, `--sf-section-pad`,
  `--sf-sidebar-width--narrow/wide`, `--sf-scrim-*`, `--sf-corner-scoop-at`)
  — idiom „token-per-variant", nie konflikt.

**Klasy w wielu plikach (5) — wszystkie zasadne:** `.sf-is-disabled`
(states + components: stan ogólny vs button), `.sf-is-loading`
(+ reduced-motion w accessibility), `.sf-link-external` (+ print URL),
`.sf-prose` (guard `:not(.sf-prose *)` w utilities — ochrona, nie definicja),
`.sf-text-gradient` (+ forced-colors reset w accessibility).

---

## 6. Współdziałanie całości — wyniki kontroli mechanicznych

| Kontrola | Wynik |
|---|---|
| `npm run audit:check` / `check:registry` (771 id) | PASS |
| `npm run check:llm-guide` (503 refy tokenów) | PASS |
| `npm run check:macros` (69 makr) | PASS |
| `npm run lint:css` (stylelint, wszystkie źródła) | PASS |
| `var(--sf-*)` bez definicji i bez fallbacku | **0** |
| `@property` zarejestrowane bez deklaracji wartości | 0 |
| `@keyframes` bez konsumenta / animacje bez `@keyframes` | 0 / 0 |
| Osierocone tokeny w `tokens.layout.css` / `tokens.macros.css` | 0 / 0 |
| Osierocone tokeny w `tokens.components.css` | **3** (F1) |
| Klasy wymienione w `llm-guide.md` nieistniejące w źródle | 0 (4 dopasowania to wildcardy `.sf-exit--*` itp.) |
| Rozjazd kopii formuł (layout↔tokens, SL-001) | 0 |
| Kolejność warstw: `@layer` w plikach vs `layers.css` | zgodna; bundle.config.json ładuje `layers.css` pierwszy w każdym bundle'u |

Luka w bramkach CI warta odnotowania: `check:llm-guide` waliduje tylko nazwy
tokenów, a `audit.js --unused` jest raportem ostrzegawczym nieuruchamianym
w CI — defekty klasy F1/F2 (knob zdefiniowany, konsument go nie czyta) nie
mają dziś strażnika. Tani wariant: lista dozwolonych „intencjonalnie
niekonsumowanych" tokenów + fail, gdy pojawi się nowy niekonsumowany token
spoza listy.

---

## 7. Rekomendacje (wg priorytetu)

1. **F1:** podpiąć `--sf-field-{radius,padding-block,padding-inline}` w
   `forms.css` przez `var(token, dotychczasowa-wartość)`.
2. **F3:** zdecydować los `--sf-size-m` (podpiąć albo usunąć z majorem)
   i rozważyć `.sf-btn--l` → `--sf-size-l`.
3. **F2:** usunąć/przemianować `--sf-print-page-{margin,size}` albo
   udokumentować je jako tokeny wyłącznie dla własnych arkuszy użytkownika.
4. **F4/F5:** kosmetyka — ujednolicić caret w autofill, dodać komentarz
   „keep in sync" przy fallbacku `--sf-card-radius-outer`.
5. Rozważyć CI-owy strażnik niekonsumowanych tokenów (sekcja 6).
