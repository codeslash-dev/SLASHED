# SLASHED — audyt finalnego `slashed.full.css`, konfiguratora i porównanie z Automatic.css 4.0.0

> **Rewizja po analizie finalnego artefaktu.** Głównym źródłem prawdy dla części
> frameworkowej jest wygenerowany `dist/slashed.full.css` v0.7.32 — cały plik,
> 5657 linii / 297 176 B. Pliki źródłowe i konfigurator służą wyłącznie do
> wyjaśniania mechanizmu oraz oceny narzędzi authoringowych.
>
> Ta rewizja zastępuje wcześniejszy draft. Poprzednia wersja błędnie uznała za
> nieobecne m.in. CSS Columns, boxed icon, złożone surfaces i LumLocker, a legalne
> fallback hooks opisała jako błędy. Wszystkie te tezy zostały poniżej poprawione.

## 0. Werdykt

SLASHED nie jest „uboższą kopią ACSS”. To inny produkt:

- **SLASHED** jest buildless, runtime-CSS, platform-agnostic, BEM-first i
  deterministyczny. Najmocniejsze strony to architektura kaskady, generatywne
  tokeny, scoped themes, content/layout primitives i przenośność.
- **Automatic.css 4** jest systemem authoringowym mocno zintegrowanym z WordPress,
  builderami, generowaniem CSS i dashboardem. Najmocniejsze strony to workflow,
  selektywne generowanie feature'ów, gotowe recipes/mixins oraz głębokie systemy
  ikon, efektów i treści CMS.

Po przeczytaniu finalnego bundle'a liczba istotnych luk jest znacznie mniejsza,
niż wynikało z wcześniejszej wersji raportu. SLASHED **już shipuje**:

- content grid z breakout/full-bleed;
- variable grid (`auto-fit`/`auto-fill`);
- CSS Columns / masonry-like flow (`.sf-equal`);
- boxed icon (`.sf-icon--boxed`);
- contextual surfaces z modern-gated adaptacją semantycznego foreground;
- osobny kompozytor złożonych surface backgrounds (`.sf-surface-bg`);
- LumLocker — wspólną jasność OKLCH dla czterech kolorów brandowych;
- gradient/overflow fades, scrim, clickable parent, focus parent;
- scroll entrance/exit, stagger, pełne formy, button i card components.

Najbardziej uzasadnione braki względem ACSS 4 to: pełny icon framework (listy,
light/dark, hover), bardziej kompozycyjna biblioteka efektów, granularny smart
spacing dla treści CMS, named overlay presets z blur/blend/inset, automatyczny
external-link indicator oraz kilka małych offer classes (`.sf-display-*`, część
hover helpers, opcjonalne z-index helpers).

---

## 1. Co faktycznie znajduje się w finalnym `slashed.full.css`

### 1.1 Artefakt i moduły

Finalny plik ma 17 sklejonych modułów:

| # | Moduł | Linie w `dist/slashed.full.css` |
|---:|---|---:|
| 1 | `core/layers.css` | 3–24 |
| 2 | `core/tokens.css` | 25–1746 |
| 3 | `core/tokens.layout.css` | 1747–1899 |
| 4 | `core/tokens.macros.css` | 1900–2027 |
| 5 | `core/reset.css` | 2028–2096 |
| 6 | `core/base.css` | 2097–2328 |
| 7 | `core/themes.css` | 2329–2597 |
| 8 | `core/layout.css` | 2598–3285 |
| 9 | `core/macros.css` | 3286–3689 |
| 10 | `core/states.css` | 3690–3850 |
| 11 | `core/motion.css` | 3851–4038 |
| 12 | `core/accessibility.css` | 4039–4332 |
| 13 | `core/print.css` | 4333–4419 |
| 14 | `optional/forms.css` | 4420–4719 |
| 15 | `optional/tokens.components.css` | 4720–4854 |
| 16 | `optional/components.css` | 4855–5400 |
| 17 | `optional/utilities.css` | 5401–5657 |

Globalny porządek 15 warstw jest deklarowany na liniach 8–23. Finalny full bundle
ma aktywne bloki w 13 warstwach; `slashed.legacy` i `slashed.overrides` pozostają
zarezerwowanymi, pustymi slotami. Po usunięciu komentarzy i stringów: **0 reguł
stylu poza `@layer`**.

### 1.2 Metryki wyliczone z finalnego pliku

- 753 unikalne nazwy `--sf-*` mają realne przypisanie wartości w bundle;
- 580 unikalnych tokenów jest czytanych przez `var(--sf-*)`;
- 175 zadeklarowanych nazw nie ma wewnętrznego `var()` read-site;
- po uwzględnieniu `@container style(--sf-surface-active: 1)` pozostają 174 bez
  wewnętrznego read-site;
- dwa `var(--sf-*)` nie mają deklaracji: `--sf-color-code-block-bg` i
  `--sf-color-code-block-text`; oba mają bezpieczne fallbacki i są legalnymi
  extension hooks (`full.css:2215–2216`), a nie błędami runtime;
- 303 klasy `sf-*` występują w żywych selektorach; razem z `.no-motion`,
  `.no-print`, `.skip-link`, `.sr-only`, `.sr-only-focusable` daje to 308 klas;
- 40 deklaracji `!important` — 1 reset, 4 states, 33 accessibility, 2 print.

Różnica **753 vs 734 katalogowane tokeny** jest ważna: 734 to canonical token API
z czterech token-source files, natomiast 753 obejmuje również lokalne custom
properties implementacji zadeklarowane w layout/macros/states/components.
Nie należy przedstawiać wszystkich 753 jako publicznego API.

### 1.3 „Niekonsumowany” nie znaczy „martwy”

Framework BEM-first świadomie oferuje tokeny do użycia w CSS użytkownika. Token
może być wartościowym offer API nawet bez read-site wewnątrz bundle'a. Wśród 175
nazw bez `var()` read-site znajdują się m.in. rampy kolorów, display scale,
shadow/radius offers, safe-area values i dodatkowe transition shorthands.

Najbardziej podejrzane, ale nadal nie automatycznie błędne, są:

- `--sf-animation-ping`, `--sf-animation-blink`, `--sf-animation-float` — mają
  keyframes/tokens, lecz odpowiadające utility classes są zakomentowane;
- cztery `--sf-animation-slide-out-*` — brak bezpośredniego read-site;
- cztery `--sf-gradient-fade--{t,r,b,l}` — `.sf-overflow-fade*` używa maski i
  innego zestawu tokenów.

To jest lista do decyzji „udokumentowany offer vs podłączenie vs usunięcie”, a
nie lista dziewięciu udowodnionych bugów.

---

## 2. Porównanie funkcjonalne z Automatic.css 4.0.0

Oficjalne materiały ACSS opisują v4 jako lżejszy, variable-first/BEM-first,
bez predefiniowanych breakpointów, z layers, OKLCH i nowym dark mode:
[What's New in ACSS 4.x](https://docs.automaticcss.com/setup/whats-new-in-4).

### 2.1 Obszary parytetu lub przewagi SLASHED

| Obszar | SLASHED full.css | Ocena względem ACSS 4 |
|---|---|---|
| Layers | 15 nazwanych warstw, 0 unlayered rules | bardzo mocne; pełny parytet architektoniczny |
| BEM/variable-first | 734 canonical tokens + curated classes | zgodne z kierunkiem ACSS 4 |
| OKLCH / dark mode | `light-dark()`, relative OKLCH, scoped `data-theme` | pełny parytet koncepcyjny |
| Unified lightness | LumLocker (`full.css:2369–2405`) | istnieje; węższy zakres niż ACSS |
| Auto foreground | `.sf-surface*` w gate `relative OKLCH + sign()` adaptuje text/heading/default link/border/focus/caret/shadow (`3553–3587`) | częściowy odpowiednik; bez pełnych link states i relacji przycisków ACSS |
| Variable grid | `.sf-grid`, `.sf-grid--fit`, min-width tokens | funkcjonalny parytet |
| Content grid | content/breakout/full lines (`3201–3234`) | pełny parytet |
| CSS Columns | `.sf-equal`, counts 2/3/4/6, gaps i rules (`3188–3198`) | odpowiednik ACSS Columns/Masonry recipe |
| Fluid type/space | runtime `pow()` + dual ratio + `clamp()` | bardzo mocny; bez kompilacji |
| Line length | per-size/per-heading max-width tokens i utilities | parytet z [ACSS line length](https://docs.automaticcss.com/typography/text-heading-line-length) |
| Gradient fades | `.sf-overflow-fade*` przez maskę | parytet funkcjonalny |
| Clickable/focus parent | czyste CSS helpers | parytet z [ACSS Clickable Parent](https://docs.automaticcss.com/accessibility/clickable-parent) |
| Shadows | box/text/drop shadow families | parytet koncepcyjny |
| Header/scroll offset | fluid header height + sticky/scroll offset | parytet |
| Portability | CDN/source, zero runtime deps, dowolny stack | przewaga SLASHED poza WordPressem |

SLASHED ma też mocny system migracyjny poza samym CSS: stable token IDs,
tombstone'y, theme-file migration i generowane katalogi. To jest przewaga w
utrzymaniu API, choć nie jest funkcją finalnego arkusza.

### 2.2 Kolory, surfaces i overlays — poprawione porównanie

#### Co SLASHED już ma

1. Dziesięć surface variants (`primary`, `secondary`, `tertiary`, `action`,
   `neutral`, `inverse`, cztery statusy) na `full.css:3533–3551`.
2. Auto-kontrast i adaptację semantycznych foreground variables na
   `full.css:3553–3587`. Mechanizm działa wewnątrz `@supports` wymagającego
   relative OKLCH oraz `sign()`; obejmuje tekst, headings, bazowy link,
   muted/placeholder/disabled, borders, focus ring, caret i shadow, ale nie
   redeklaruje visited/active links ani stylu przycisków.
3. Scrim z kierunkiem top/bottom/full (`3589–3610`).
4. `.sf-surface-bg` (`3617–3626`) komponujący:
   - background color;
   - image/gradient/pattern;
   - overlay jako górną warstwę background-image;
   - size, position, repeat, attachment;
   - animation.
5. LumLocker dla primary/secondary/tertiary/action w light i dark.

Dlatego wcześniejsze tezy „brak złożonych surfaces”, „surface to tylko kolor” i
„brak unified lightness” były błędne.

#### Co nadal ma ACSS więcej

ACSS oferuje do pięciu nazwanych surface slots z UI, asset handling, nazwaną
klasą i relacją kolorystyczną:
[ACSS Surfaces](https://docs.automaticcss.com/backgrounds/surfaces). Ma również
osobny system custom overlays z backdrop blur, blend mode, radius, inset i
numerowanymi/nazwanymi slotami:
[ACSS Custom Overlays](https://docs.automaticcss.com/overlays/custom-overlays).

SLASHED ma dobry **generic background compositor**, ale nie pełny odpowiednik
systemu ACSS: `.sf-surface-bg` sama nie ustawia kontrastu, relacji foreground ani
nazwanego slotu. Generator presetów może użyć jej jako warstwy tła, lecz musi
jawnie skomponować scrim/foreground z `.sf-surface*`. Brakuje także blur/blend/
inset; ewentualne rozszerzenie mogłoby dodać:

- `--sf-surface-bg-blend-mode`;
- `--sf-surface-bg-backdrop-filter`;
- `--sf-surface-bg-inset` (jeśli powstanie pseudo-element overlay primitive).

LumLocker jest odpowiednikiem [ACSS Unified Lightness](https://docs.automaticcss.com/colors/unified-lightness),
ale obejmuje cztery brand colors; ACSS pozwala osobno objąć main/base i semantic
colors. Tu realny gap to **zakres i kontrola**, nie brak funkcji.

### 2.3 Layout

- **Variable Grid:** już jest w `.sf-grid`.
- **CSS Multi-column / masonry-like flow:** już jest pod nazwą `.sf-equal`;
  wcześniejsza teza o braku Columns była błędna. To parytet z recipe CSS Columns
  ACSS, ale nie uniwersalny masonry grid: flow jest column-major, a
  `column-count` współpracuje z `column-width`, więc nie zawsze wymusza dokładną
  liczbę kolumn. Trzeba uważać na reading order kart. ACSS opisuje ten wzorzec w
  [Masonry Layouts](https://docs.automaticcss.com/columns/masonry-layouts).
- **Content grid:** kompletne content/breakout/full-bleed.
- **Content-width-safe:** brak dedykowanego aliasu odpowiadającego
  [ACSS Content Width Safe](https://docs.automaticcss.com/dimension/content-width-safe).
  To mały, uzasadniony candidate: `--sf-content-width-safe` + opcjonalna
  `.sf-content-safe`.
- **Boxed page layout:** brak gotowego presetu odpowiadającego
  [ACSS Boxed Layout](https://docs.automaticcss.com/dimension/boxed-layout), ale
  jest to niszowa funkcja i łatwa do złożenia w CSS użytkownika.
- **Inverted radius:** brak odpowiednika
  [ACSS Inverted Radius Framework](https://docs.automaticcss.com/borders-dividers/inverted-radius-framework).
  Funkcja wartościowa w konkretnym designie, lecz za ciężka i zbyt niszowa na
  core SLASHED. Lepszy byłby opt-in recipe/snippet.

### 2.4 Ikony

Wcześniejsza teza „SLASHED ma tylko rozmiary i brak boxed icon” była błędna.
Finalny bundle ma:

- `.sf-icon` i 6 rozmiarów (`full.css:2974–2989`);
- `.sf-icon--boxed` z paddingiem, borderem, radius, background i box-sizing
  (`2991–3000`);
- odpowiednie tokeny w tokenach layoutu.

Względem pełnego [ACSS Icon Framework](https://docs.automaticcss.com/icons/icon-framework)
pozostają realne braki:

- icon-list primitive;
- niezależne light/dark icon themes;
- boxed/naked switching jako data attribute;
- hover values dla icon, icon background i border;
- global/default styling przez semantic icon tokens.

Największą wartość dałoby `.sf-icon-list` + kilka semantycznych tokenów ikony,
a nie kolejna skala rozmiarów.

### 2.5 Efekty i motion

SLASHED shipuje:

- fade/slide/scale time animations;
- entrance/exit scroll-driven effects;
- stagger;
- color pulse;
- loading i shimmer states;
- sześć hover-transform utilities;
- keyframes spin/shimmer/ping/blink/float.

Nie shipuje żywych `.sf-spin`, `.sf-ping`, `.sf-blink`, `.sf-float`,
`.sf-shimmer` utility classes — ich definicje są zakomentowane na
`full.css:5504–5528`. Nie ma też generic hover helpers dla shadow/glow/filter/
fade. Wyjątek: `.sf-card--interactive` ma własny hover/focus shadow i lift
(`5380–5397`).

ACSS ma bardziej kompozycyjną bibliotekę hover/enter/exit/visible z wariantami
children/stagger i opcjonalnym Intersection Observer:
[ACSS Effects Overview](https://docs.automaticcss.com/effects/effects-overview).

Uzasadnione małe dodatki do `optional/utilities.css`:

- `.sf-hover-shadow`, `.sf-hover-glow`, `.sf-hover-brighten`, `.sf-hover-fade`;
- aktywacja istniejących dekoracyjnych animation utilities, jeśli rozmiar jest
  akceptowalny;
- nie dodawać JS-powered `on-visible` do core — naruszałoby to zero-JS contract.

### 2.6 Typografia i treść CMS

SLASHED ma silne fluid type, heading/text role utilities, per-level measures,
prose, flow, list styling i blockquote. Brakuje generowania `@font-face`; ACSS
robi to z dashboardu:
[ACSS Custom Fonts](https://docs.automaticcss.com/typography/custom-fonts).
W SLASHED najlepiej dodać generator snippetów w configuratorze, nie runtime
font loader w frameworku.

[ACSS Smart Spacing](https://docs.automaticcss.com/spacing/smart-spacing) ma
bardziej granularne spacing values dla headings, paragraphs, list/nested list,
figure, figcaption i blockquote. SLASHED już ma większość odpowiedników:
paragraph, heading gap, list i nested-list gap, figure/media/hr margins oraz
wspólny block margin. Realne braki to dopiero rozdzielenie figcaption,
blockquote od `pre` oraz ewentualnie per-heading spacing — nie potrzeba drugiego,
równoległego pełnego systemu.

### 2.7 External links

Na ekranie SLASHED ma manualne `.sf-link-external` (`full.css:3637–3650`), ale
nie automatyzuje `a[target="_blank"]`. Print automatycznie dopisuje URL dla
większości linków (`4359–4364`), co jest osobną funkcją.

ACSS oferuje automatyczne oznaczanie z wykluczeniami i kontrolą indicatora:
[ACSS External Link Indication](https://docs.automaticcss.com/links/external-link-indication).
Dobry kompromis dla SLASHED: opt-in container, np.
`.sf-auto-external-links a[target="_blank"]`, nie globalny selector, który
mógłby zaskoczyć użytkownika.

---

## 3. Rzeczywiste problemy i ryzyka w finalnym bundle

### 3.1 Token-only APIs wymagają lepszego oznaczenia

`--sf-text-display-{s,m,l}` i display line heights istnieją (`full.css:1036–1062`),
ale nie ma `.sf-display-*`. To nie są martwe tokeny — komentarz w bundle wprost
pokazuje użycie w BEM użytkownika — lecz configurator/dokumentacja powinny
oznaczać je jako **offer-only / wire in your component**, aby użytkownik nie
oczekiwał zmiany elementów bazowych.

Podobnie osiem z-index rungów nie ma read-site; `--sf-z-tooltip` zasila
`.skip-link`, a `--sf-z-sticky` zasila `.sf-sticky`. Klasy `.sf-z-*` są
zakomentowane. To świadome offer tokens, nie dowód awarii.

### 3.2 Duplikacja utrzymaniowa, nie konflikt runtime

117 nazw ma więcej niż jedną deklarację, ale parser kontekstu nie znalazł
powtórzenia tego samego tokenu w dokładnie tym samym selector/supports/layer
context. Przykładowo `--sf-color-primary` ma siedem deklaracji: fallback,
`light-dark()`, LumLocker i scoped light/dark overrides. To zamierzona kaskada,
nie siedem konfliktów.

Ryzykiem jest **utrzymanie ręcznie lustrzanych formuł**:

- dark derivation w tokens i themes;
- auto-contrast w root i scoped themes;
- fluid scales w root oraz `.sf-fluid-cq > *`.

Gate'y zmniejszają ryzyko, ale rozwiązaniem docelowym może być generowanie tych
bloków z jednego modelu. W raporcie nie należy nazywać ich runtime conflict.

### 3.3 `!important` i layers

40 `!important` dotyczy głównie hardened a11y/state/print contracts. Ważna
korekta: przy important declarations kolejność warstw jest odwrócona — wcześniejsza
warstwa ma wyższy priorytet. Przy tym samym author origin zarówno important w
ostatnim `slashed.overrides`, jak i unlayered important przegrają z important we
wcześniejszej warstwie niezależnie od specyficzności. Konsument powinien albo
respektować hardened contract, albo świadomie zadeklarować własną warstwę
**przed** warstwami frameworka. To powinno być jasno opisane w architecture docs.

Normalne, niewarstwowane reguły użytkownika nadal łatwo wygrywają z normalnymi
regułami named-layer frameworka.

### 3.4 Behavioral incompatibility markers/prose

`.sf-prose` nie jest zdefiniowana dwa razy. Definicja jest w macros; utilities
używa `:not(.sf-prose *)` w marker guardzie. Guard zapobiega nadpisaniu prose,
ale jest zbyt szeroki: wyłącza marker utility również wewnątrz
`.sf-prose .sf-not-prose`, mimo że ten escape hatch resetuje prose list styles.
To nie konflikt deklaracji, lecz realna incompatibility zachowania. Guard trzeba
zawęzić albo wyjątek jawnie udokumentować.

### 3.5 `:has()`-based section rule

Reguła sole-child content-grid dla `.sf-section--guttered` zależy od struktury
elementów. Komentarze HTML nie wpływają na selektor (wcześniejszy draft błędnie
to sugerował), ale dodanie drugiego elementu-child już tak. Zachowanie jest
poprawne, lecz mało oczywiste; warto pokazać kontrprzykład w docs layoutu.

### 3.6 Legacy module jest poza full bundle

`optional/legacy.css` nie jest składnikiem `slashed.full.css`, więc nie należy
oceniać jego treści jako błędu finalnego bundle. Osobny source audit wykazał, że
nagłówek wspomina fallback `:has()`, którego plik nie implementuje. To błąd
komentarza/dokumentacji modułu opt-in, nie błąd `full.css`.

### 3.7 Browser floor i supports

Finalny bundle zachowuje fallback/progressive-enhancement bloki dla funkcji,
które są już dostępne na deklarowanym floorze. To zwiększa wagę pliku, ale przed
usunięciem trzeba zważyć:

- czy arkusz ma zachować częściową degradację poza formalnym floor;
- czy embed/builders rzeczywiście gwarantują ten floor;
- ile gzip/Brotli realnie oszczędzi usunięcie fallbacków.

Nie należy usuwać gate'ów tylko dlatego, że wyglądają na redundantne w raw CSS.
Najpierw potrzebny jest pomiar bundla i testy w silnikach granicznych. `pow()`
pozostaje bardziej krytycznym wymaganiem, bo type/space engine nie ma
statycznego fallbacku.

---

## 4. Audyt konfiguratora

Ta część wymaga kodu Svelte — nie da się jej wyprowadzić wyłącznie z full.css.
Wnioski zostały skorygowane tak, aby respektowały rzeczywisty shipped API.

### 4.1 Co jest dobre

- preview działa w realnym iframe z finalnym framework CSS;
- kolory są odczytywane przez `getComputedStyle`, więc browser rozwiązuje
  `light-dark()`/relative OKLCH, zamiast JS-owej imitacji;
- `SliderRow` obsługuje variable picker, numeric slider i raw CSS;
- typography ma dual-value fluid controls, presets i scale previews;
- per-size button editor faktycznie obsługuje template-generated token names;
- export/share/theme files mają stabilne ID i sanitizację.

### 4.2 Nierówny poziom edycji

**Zbyt płytko:**

- siedem ratio tokens korzysta z raw inputs mimo istnienia `AspectRatioInput`;
- easing ma input tekstowy, a SVG preview pozostaje statyczną krzywą presetu;
- shadows poza głównymi presetami i część keyword/enum tokens spada do raw text;
- hover scale/lift/slide oraz część bazowych button/layout knobs nie ma
  purpose-built control i jest dostępna przez All Tokens.

**Za dużo pozornej precyzji:**

- z-index jest sliderem o ogromnym zakresie, choć 8 rungów to offer-only API,
  a w bundle konsumentów mają tylko sticky i tooltip;
- generic `TokenRow` zgaduje typ przez substring; border-width może dostać
  traktowanie kolorystyczne przez fragment `-border`;
- space preview pokazuje midpoint min/max, a nie konkretny viewport endpoint.

**Dobrze dobrana głębokość:**

- color desk i theme preview;
- type/space source scalars;
- button/card visual controls;
- line-length controls;
- variable-scale pickers.

### 4.3 Konkretne błędy/wiring risks

1. `MiscPanel.svelte` ma błędne metadane skali: w tabeli rozmiarów
   `--sf-size-l` ma default `2.75`, podczas gdy finalny `full.css` deklaruje
   `3rem`.
2. Osobno, touch target jest źle powiązany w UI z `var(--sf-size-l)`: finalny
   CSS celowo trzyma `--sf-touch-target: 2.75rem` niezależnie od size scale, aby
   retuning skali nie obniżał minimum dostępności.
3. Opis `--sf-z-base` w UI sugeruje offset całej drabiny, lecz finalny CSS
   deklaruje każdy z-index rung jako niezależny literal; base nie przesuwa
   pozostałych kroków.
4. Help dla ikon używa nazw `.sf-icon-*` i `.sf-icon-box`, podczas gdy żywe
   selektory to `.sf-icon--*` i `.sf-icon--boxed`.
5. Token→panel jest rozproszone między nav, labels, router, domain patterns i
   preview map; substring precedence może klasyfikować component font token do
   Typography mimo edycji w Components.
6. `TokenRow` powinien korzystać z generated metadata, nie name heuristics.
7. Panel formulas/defaults są częściowo ręcznie kopiowane z CSS; brak CI gate'u
   porównującego je z generated API.
8. `computeDerivedOverrides()` powiela część formuł fluid/radius/border/duration.
   To ryzyko synchronizacji. Sam brak derived values w eksporcie nie jest
   automatycznie błędem — finalny framework ma je obliczyć — ale preview nie
   powinien syntetyzować nazw/relacji nieobecnych w żywym CSS.
9. Scale shadow warnings obejmują text/space/display, lecz nie wszystkie inne
   generowane ladders.
10. Ratio min/max można ustawić w kombinacji powodującej `clamp(min > max)` na
    części kroków; UI powinno ostrzegać o utracie fluidity.

### 4.4 Zalecana organizacja konfiguratora

- **Basic**: źródła kolorów, font families, type/space scale, content/gutter,
  radius/shadow strength, buttons/cards, light/dark.
- **Advanced**: individual ramps, offer-only tokens, z-index, safe-area,
  animation shorthands, raw formulas.
- **Generated/diagnostic**: derived values read-only + „used by” + source token.
- All Tokens pozostawić jako escape hatch, ale oznaczać `knob`, `derived`,
  `offer-only`, `internal/local`.

To rozwiązuje jednocześnie problem „za płytko” i „za głęboko”: zwykły user nie
widzi 753 implementation names, a ekspert nadal ma pełną kontrolę.

---

## 5. Priorytety wdrożeniowe

### P0 — poprawność narzędzia i komunikacji API

1. Naprawić metadane `--sf-size-l` w tabeli skali (`2.75` → `3`), ale
   pozostawić niezależny `--sf-touch-target: 2.75rem` i usunąć jego fałszywe
   powiązanie z size scale.
2. Naprawić opis z-index base offset i nazwy klas ikon w helpie konfiguratora.
3. Dodać CI gate: panel token literal/template musi mapować do live API lub
   jawnego local hooka.
4. Dodać CI gate dla hardcoded panel defaults vs generated defaults.
5. Oznaczyć offer-only tokens w API/configuratorze zamiast nazywać je dead.
6. Poprawić dokumentację important-layer precedence.

### P1 — małe dodatki o wysokiej wartości

1. `.sf-display-s/.sf-display-m/.sf-display-l` — pełna visual role (font family,
   size, line-height, weight, tracking), skoro tokeny już shipują.
2. Opcjonalne `.sf-hover-shadow/-glow/-brighten/-fade`.
3. `.sf-icon-list` oraz semantic icon foreground/background/border/hover tokens.
4. `--sf-content-width-safe` + `.sf-content-safe`.
5. Opt-in external-link container helper.
6. Rozdzielić tylko brakujące prose controls: figcaption, blockquote vs `pre`
   i opcjonalnie per-heading spacing; nie duplikować istniejących paragraph/list/
   figure/media margins.

### P2 — konfigurator i presets, bez powiększania core

1. Named surface/overlay preset generator oparty na `.sf-surface-bg`.
2. `@font-face` snippet generator.
3. Żywy cubic-bezier editor.
4. Wspólny structured editor dla aspect-ratio tokens.
5. Radius/border/duration shadow notices oraz fluid monotonicity diagnostics.

### P3 — tylko jako opt-in recipes

- inverted radius;
- boxed page layout;
- ribbons;
- bardziej rozbudowane overlay pseudos;
- JS one-shot visible effects.

---

## 6. Czego nie robić

- Nie dodawać drugiego systemu CSS Columns — `.sf-equal` już pokrywa
  multi-column/masonry-like flow; nowy grid byłby potrzebny tylko dla innego
  reading order lub innego modelu layoutu.
- Nie dodawać ponownie boxed icon — `.sf-icon--boxed` już istnieje.
- Nie projektować od zera surfaces — rozszerzyć/generować presety dla
  `.sf-surface-bg`.
- Nie nazywać wszystkich tokenów bez wewnętrznego read-site martwymi; część to
  świadome BEM offer API.
- Nie deklarować fallback hooks jako bugów tylko dlatego, że nie mają `:root`
  defaultu.
- Nie kopiować całego ACSS. Builder/WordPress integrations, dynamic CSS output,
  recipes i dashboard są inną warstwą produktu niż buildless runtime framework.

---

## 7. Źródła ACSS

- [What's New in ACSS 4.x](https://docs.automaticcss.com/setup/whats-new-in-4)
- [Automatic Color Relationships](https://docs.automaticcss.com/color-assignments/automatic-color-relationships)
- [Surfaces](https://docs.automaticcss.com/backgrounds/surfaces)
- [Custom Overlays](https://docs.automaticcss.com/overlays/custom-overlays)
- [Unified Lightness](https://docs.automaticcss.com/colors/unified-lightness)
- [Effects Overview](https://docs.automaticcss.com/effects/effects-overview)
- [Smart Spacing](https://docs.automaticcss.com/spacing/smart-spacing)
- [Masonry Layouts](https://docs.automaticcss.com/columns/masonry-layouts)
- [Icon Framework](https://docs.automaticcss.com/icons/icon-framework)
- [Content Width Safe](https://docs.automaticcss.com/dimension/content-width-safe)
- [Custom Fonts](https://docs.automaticcss.com/typography/custom-fonts)
- [Inverted Radius Framework](https://docs.automaticcss.com/borders-dividers/inverted-radius-framework)

Content was rephrased for compliance with licensing restrictions.
