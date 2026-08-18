# SLASHED — dogłębny audyt frameworka i konfiguratora, porównanie z Automatic.css v4.0.0

> Dokument roboczy z sesji przeglądu. Źródła: kod frameworka (`core/`, `optional/`,
> `scripts/`), konfigurator (`configurator/src/**`), dokumentacja projektu
> (`docs/*.md`, `docs/*.json`), oraz oficjalna dokumentacja ACSS 4.x
> (docs.automaticcss.com). Wszystkie liczby zostały przeliczone z rzeczywistego
> kodu (grep/node/jq), nie z deklaracji w README.

## 0. Skrócona ocena

SLASHED jest technicznie bardzo solidny w warstwie *procesu* — 15 nazwanych
`@layer`ów bez ani jednej reguły poza warstwą, ~20 skryptów CI-gate, rejestr
tokenów ze stabilnymi ID i tombstone'ami usunięć. To jest rzadkie i dobrze
wykonane. Największe realne braki nie leżą w dyscyplinie, ale w **powierzchni
funkcjonalnej** (czego ACSS v4 ma, a SLASHED nie ma) i w **głębi
konfiguratora** (część kontrolek jest płytsza niż tokeny, które reprezentują,
a część głębsza niż to, co framework faktycznie robi).

Poniżej: (1) czego brakuje funkcjonalnie względem ACSS v4, (2) błędy/konflikty
w samym frameworku CSS, (3) błędy/konflikty w konfiguratorze, (4) konkretna
lista poprawek w kolejności priorytetu.

---

## 1. Czego SLASHED nie ma, a ACSS 4.0 ma (realny gap funkcjonalny)

Poniższa lista to funkcje ACSS 4.x, które są rzeczywiście używane w produkcji
i nie mają odpowiednika w SLASHED. Pozycje pogrubione = najbardziej wartościowe
do rozważenia; nie oznacza to "skopiuj 1:1", tylko że pokrywają realną potrzebę.

### 1.1 Kolor i tło

- **Auto Color Relationships** — w ACSS użycie klasy `.bg--ultra-dark` na
  sekcji automatycznie przełącza kolor tekstu, nagłówków, linków i styl
  przycisków wewnątrz niej. SLASHED ma odpowiednik częściowy: auto-contrast
  `--sf-color-text--on-*` (bardzo dobra, "branchless" implementacja przez
  `sign()`), ale **działa tylko dla tekstu na konkretnym kolorze**, nie ma
  mechanizmu "zmiana tła sekcji → automatyczna zmiana stylu przycisku/linku
  wewnątrz". To jest różnica jakościowa: ACSS wiąże to z klasą kontekstową
  (`.bg--*`), SLASHED nie ma klas `.sf-bg--*` w ogóle — tło ustawia się tylko
  przez zmienne, bez żadnego mechanizmu propagacji na potomków.
- **Surfaces (tła złożone)** — ACSS ma osobny system "Surface": nazwane,
  wielokrotnie użyte tła złożone z obrazu/gradientu/wzoru + pozycja + rozmiar +
  overlay + animacja + integracja z color-relationship, do 5 zdefiniowanych
  slotów. SLASHED ma `--sf-color-surface` (alias `--sf-color-base`, **tylko
  kolor**) i osobno `.sf-surface--*` (tonalne warianty kolorystyczne w
  `core/macros.css`). Nie ma **żadnego** mechanizmu tła obrazkowego/gradientowego
  jako reużywalnego, nazwanego presetu z overlay. To jest realna dziura —
  strony marketingowe (hero sections) potrzebują tego bardzo często.
- **Custom Overlays** — ACSS ma do 5 konfigurowalnych overlayów (gradient/obraz/
  blur/blend-mode/animacja/inset), generujące `.overlay-{name}`. SLASHED ma
  tylko `.sf-overlay` — jedna klasa w `core/layout.css:146`, brak wariantów,
  brak blend-mode, brak animacji, brak per-instance konfiguracji poza jednym
  kolorem/opacity. Scrim (`core/tokens.macros.css`) to inny, równoległy,
  jednopoziomowy, zahardkodowany na czarno mechanizm — nie zintegrowany z
  systemem kolorów OKLCH.
- **Unified Lightness** — przełącznik "wszystkie kolory bazowe mają tę samą
  jasność OKLCH" (spójność percepcyjna palety). SLASHED nie ma tego jako
  przełącznika — użytkownik musi ręcznie dopasować L każdego `-source-light`.
  Łatwe do dodania: jeden dodatkowy token `--sf-palette-unify-l` + `oklch(from
  var(--sf-color-x-source-light) var(--sf-palette-unify-l) c h)`.
- **Transparencies przez `color-mix()`** — ACSS 4 świadomie *usunął* predefiniowane
  tokeny transparencji na rzecz `color-mix()`/relative color w locie. SLASHED
  robi to *odwrotnie*: ma 30 zahardkodowanych tokenów `-a5/-a10/-a30/-a50/-a80`
  (tylko dla 6 rodzin, nie dla statusów) i **zero** użyć `color-mix()` w całym
  kodzie. To nie jest "brak funkcji" per se, ale jest niekonsekwentne: SLASHED
  chwali się w README podejściem "runtime, formulaic", a tu robi to samo co
  ACSS 3.x robił i co ACSS 4 uznał za przestarzałe podejście.

### 1.2 Layout

- **Boxed Layout** — kompletny, jednoprzełącznikowy system "canvas + boxed body
  + border + shadow + top margin" do layoutów w stylu oldschoolowych, ramkowanych
  stron. SLASHED nie ma nic podobnego — trzeba by to złożyć ręcznie z tokenów
  layoutu. Niski priorytet (niszowa funkcja), ale zero-effort do dodania jako
  jedna klasa `.sf-boxed` + kilka tokenów.
- **Variable Grid** — grid, który *nie* zależy od breakpointów, tylko wypełnia
  wiersz tak długo, aż dzieci osiągną `--min`. SLASHED ma to! — `.sf-grid`
  (`auto-fit`/`auto-fill`, `minmax(min(var(--sf-grid-min),100%),1fr)`,
  `core/layout.css:333-356`) to funkcjonalny odpowiednik Variable Grid. **Brak
  gapu** w tym miejscu — to nie jest gap funkcjonalny, tylko wart odnotowania:
  SLASHED ma tu realną parytet.
- **Masonry (CSS `columns`)** — ACSS ma `?columns` recipe z `column-count`/
  `column-width`, ruled columns. SLASHED **nie ma żadnego** mechanizmu CSS
  Columns / masonry — `grep -n "column-count\|columns:"` w `core/`+`optional/`
  zwraca zero trafień poza `grid-template-columns`. To jest prawdziwa dziura:
  masonry to popularny wzorzec (galerie, karty o różnych wysokościach) i
  natywny CSS `columns` jest tani do zaimplementowania (kilka tokenów +
  1 klasa `.sf-columns` + modyfikator `--fit`).
- **Content Width Safe** (`min(var(--content-width), calc(100% -
  var(--gutter)*2))`) — pojedynczy, "bezpieczny" token łączący content-width z
  gutterem dla elementów **poza** sekcją/kontenerem. SLASHED ma
  `--sf-content-width` i `--sf-gutter` jako osobne prymitywy oraz `.sf-center`,
  ale **nie ma** jednego tokenu/klasy odpowiadającej `content-width--safe` —
  użytkownik poza `.sf-container`/`.sf-content-grid` nie ma gotowego sposobu na
  "content width + gwarantowany gutter" bez ręcznego `calc()`. Łatwy do
  dodania alias.
- **Inverted Radius Framework** — nietrywialny, ale unikalny w ACSS: technika
  "wyciętego rogu" (radius, który zagina się w stronę rodzica) realizowana
  przez pseudo-elementy + box-shadow, konfigurowalna przez atrybuty `data-*`.
  SLASHED nie ma tego wcale. Wysoki koszt implementacji, niski/średni priorytet
  — rzadko potrzebne, ale gdy jest potrzebne, jest bardzo trudne do zrobienia
  ręcznie; framework, który by to miał, wygrywałby konkretne case'y designerskie.
- **Header Height / Scroll Offsets „breakpoint-less"** — SLASHED **ma** to
  (`--sf-header-height` fluid, `--sf-sticky-offset`, `scroll-padding-block-start`
  w `core/reset.css:16`) — to jest realny parytet, wręcz SLASHED robi to
  "fluid" (ACSS 4 też przeszedł na to podejście, "based on fluid heading
  height" — dokładnie ten sam kierunek).

### 1.3 Typografia

- **Text/Heading Line Length caps (`ch`)** — ACSS pozwala ustawić `max-width`
  w `ch` per rozmiar tekstu/nagłówka z panelu dashboardu. **SLASHED to już ma**
  w CSS (`--sf-text-*-max-width`, `--sf-h*-max-width`, `core/tokens.css:1066+`,
  `:1589+`) i **konfigurator to eksponuje** (`TypographyPanel.svelte:869+`,
  `876+`). To jest realny parytet — dobra wiadomość, nie trzeba nic dodawać.
- **Custom self-hosted fonts z generowanym `@font-face`** — ACSS ma UI do
  wgrywania plików fontów i generowania `@font-face` (w tym fallbacki,
  variable fonts, `font-display`). SLASHED **nie generuje żadnego CSS fontów**
  — to naturalna konsekwencja bycia frameworkiem bez build-time/dashboardu
  (font-face trzeba pisać osobno), ale jest to prawdziwy brak funkcjonalny
  wobec ACSS, który *ma* dashboard. Nie da się tego dodać bez panelu
  administracyjnego — więc to nie jest coś do "naprawienia" w CSS, ale warto
  rozważyć **prostą sekcję w configuratorze**, która generuje boilerplate
  `@font-face` do skopiowania (czysto generatywna funkcja UI, nie wymaga
  zmiany frameworka).
- **Auto-BEM / t-shirt-size do numeric width conversion** — nieistotne dla
  SLASHED (BEM-first z założenia).

### 1.4 Efekty / interaktywność

- **Effects — pełny system `.on-hover--*` / `.on-enter--*` / `.on-exit--*` /
  `.on-visible--*`** — ACSS ma jednolitą taksonomię efektów z kompozycyjnością
  (`on-enter--fade on-enter--float on-enter--grow` na jednym elemencie) i
  stagger przez `sibling-index()`. SLASHED ma **fragmenty** tego rozproszone
  po plikach: `.sf-hover-*` (utilities, 6 klas), `.sf-entrance--*`/`.sf-exit--*`
  (motion, ~11 klas), `.sf-stagger` (motion). Braki wobec ACSS:
  - **brak kompozycyjności udokumentowanej explicite** — SLASHED *technicznie*
    pozwala dać dwie klasy `.sf-entrance--fade` + coś innego, ale nie ma
    drugiego wymiaru efektu do złożenia (np. "fade + grow" jednocześnie) —
    `.sf-entrance--*` to jedna klasa na jedną transformację, nie da się
    złożyć grow+fade bez własnego CSS.
  - **brak `.on-visible` (IntersectionObserver-backed)** — wszystko w SLASHED
    jest CSS-only (`animation-timeline: view()`), co jest "bardziej
    deterministyczne", ale traci możliwość "animuj raz i zostań" (one-shot)
    bez JS, które niektóre providery CMS wymagają dla starszych silników.
    Utrata pokrycia w Firefox jest jawnie dokumentowana w kodzie
    (`core/motion.css:76-80` — brak fallbacku na Firefox to świadoma decyzja).
  - **brak Exit Effects na scroll dla shadow/glow/filter** — ACSS ma warianty
    filter/shadow/opacity w hover; SLASHED `.sf-hover-*` ma tylko transform
    (grow/shrink/float/sink/slide) — **nie ma `.sf-hover-shadow`,
    `.sf-hover-glow`, `.sf-hover-brighten`, `.sf-hover-fade`**. To jest
    konkretna, łatwa do domknięcia dziura (tokeny box-shadow i filter już
    istnieją w systemie, potrzeba tylko klas `:hover`).
- **Ribbons** — narożne "ribbon" etykiety (np. "Sale"), z tokenami offset/
  width/padding/bg/tekst/shadow. SLASHED nie ma tego wcale. Niska częstość
  użycia ogólnie, ale zerowy koszt implementacji (to jest dosłownie jedna mała
  klasa + zestaw tokenów, podobna technicznie do już istniejącego `.sf-scrim`).
- **Gradient Fades (`.fade--{axis}`)** — ACSS ma uniwersalny mixin/klasę do
  zanikania krawędzi elementu w tło (top/right/bottom/left/block/inline).
  SLASHED ma **coś podobnego, ale gorzej pokryte**: `.sf-overflow-fade(--top/
  --bottom/--left/--right/--block/--inline)` w `core/macros.css` robi
  identyczną rzecz przez `mask-image`. To jest w praktyce parytet
  funkcjonalny — SLASHED go już ma, tylko nazwany inaczej (`overflow-fade` vs
  `fade`). Dobra wiadomość, nie trzeba dodawać.
- **External Link Indication** — automatyczne oznaczanie linków `target=_blank`
  wizualnie i dla czytników ekranu, z `:has()`-based wykluczeniami. SLASHED ma
  `.sf-link-external` (manualna klasa) — **ale nie ma automatycznego
  wykrywania `target="_blank"` lub linku do innej domeny**; użytkownik musi
  ręcznie dodać klasę. To jest różnica: ACSS robi to "automatycznie" (opt-in
  w dashboardzie, ale bez ręcznego oznaczania każdego linku), SLASHED wymaga
  ręcznej klasy na każdym linku. Dla frameworka bez JS/build-time trudno to
  zautomatyzować bez atrybutowego selektora `a[target="_blank"]::after` — co
  jest *technicznie* możliwe do dodania w czystym CSS i nie wymaga JS.
- **Clickable Parent / Focus Parent** — SLASHED **ma** to
  (`.sf-clickable-parent`, `.sf-focus-parent`, `core/accessibility.css:204+`) —
  parytet potwierdzony, nawet lepiej zaimplementowany bez potrzeby SCSS
  mixinów (ACSS wymaga SCSS dla wersji poza recipe).

### 1.5 Cienie / filtry

- SLASHED ma `--sf-shadow-{xs..xl}`, `--sf-text-shadow-*`, `--sf-drop-shadow-*`
  — trzy typy cieni, analogiczne do ACSS (Box/Text/Drop Shadows). **Parytet
  koncepcyjny potwierdzony.** Różnica: ACSS pozwala **nazwać** dowolny slot
  (`--box-shadow-subtle` zamiast `--box-shadow-1`); SLASHED trzyma się t-shirt
  sizes bez możliwości przemianowania — drobna różnica UX w dashboardzie ACSS,
  nieistotna dla frameworka bez JS.

### 1.6 Ikony

- **Icon Framework** — kompletny system (boxed/naked, dwa motywy jasny/ciemny,
  listy ikon, rozmiary, hover) sterowany atrybutem `data-icon`. SLASHED ma
  **tylko rozmiary** (`--sf-icon-{xs..2xl}`, `.sf-icon--*`, `core/layout.css:
  378-399`) — **brak "boxed" wariantu** (padding+border+bg+radius jako
  jedna przełączana forma), **brak systemu list ikon** (`icon-list`), **brak
  motywu light/dark per-ikona** niezależnego od theme strony. To jest
  realna, średniej wagi dziura — strony z listami "feature + ikona" są
  bardzo częste, a SLASHED nie ma gotowego wzorca na "ikona w okrągłym tle
  z kolorem statusu", trzeba komponować ręcznie z `.sf-box` + `.sf-icon`.

### 1.7 Formularze i dostępność

- **Smart Spacing** — automatyczne zerowanie marginesów w elementach rich-text
  i re-aplikowanie inteligentnego odstępu tylko między sąsiadującymi
  elementami (`:not(:first-child)`), z osobnymi tokenami per typ elementu
  (nagłówki, paragrafy, listy, zagnieżdżone listy, figury, blockquote). SLASHED
  ma częściowy odpowiednik w `.sf-flow`/`.sf-prose` (`core/macros.css`,
  `core/tokens.macros.css`) — flow-spacing owszem istnieje
  (`--sf-flow-space`), ale **nie ma granularnych tokenów per typ elementu**
  (nagłówek h2 vs h3, zagnieżdżone listy, figury/figcaption) — `.sf-prose` ma
  jeden wspólny zestaw, nie 16 tokenów jak ACSS. To jest realny, średni gap:
  blogi/CMS-content chcą precyzyjnej kontroli spacingu każdego typu elementu.
- **Automatic Spacing z zero-specificity auto-container/content/grid-gap** —
  ACSS potrafi *automatycznie* dodać gap do wszystkich sekcji/kontenerów/
  gridów bez klas, z zerową specyficznością (łatwo nadpisywalne). SLASHED nie
  ma nic podobnego — spacing jest zawsze explicite przez klasę (`.sf-stack`,
  `.sf-section`). To jest filozoficzna różnica (SLASHED = "Explicit" w samej
  nazwie), więc **nie polecam kopiowania tej funkcji** — byłaby niekonsystentna
  z deklarowaną filozofią frameworka. Odnotowuję jako świadomą różnicę, nie
  jako brak.

### 1.8 Podsumowanie sekcji 1 — priorytetowa lista realnych braków

Uporządkowane według (wartość dla typowego use case) × (koszt implementacji
w czystym CSS, bez JS/build):

1. **Surfaces / tła złożone z overlay** (obraz+gradient+overlay+color relationship)
   — brak jest odczuwalny na stronach marketingowych; średni koszt.
2. **Rozszerzenie `.sf-hover-*` o shadow/glow/brighten/fade** — tokeny box-shadow
   i filter już istnieją, brakuje tylko klas `:hover`; niski koszt, wysoka wartość.
3. **CSS Columns / masonry** (`.sf-columns`, `--sf-col-count`, `--sf-col-gap`,
   `--sf-col-rule-*`) — zero pokrycia dziś; niski koszt.
4. **Icon "boxed" wariant + icon-list** — częsty wzorzec UI (feature lists);
   średni koszt.
5. **Granularne tokeny spacing per typ elementu w `.sf-prose`/`.sf-flow`**
   (h2..h6, listy zagnieżdżone, figure/figcaption, blockquote osobno) —
   średni koszt, wysoka wartość dla treści CMS/blog.
6. **Unified Lightness** przełącznik percepcyjny — niski koszt (jeden token +
   `oklch(from ...)`), średnia wartość.
7. **Ribbons** — bardzo niski koszt, niska/średnia wartość.
8. **Content-width-safe alias** — trywialny koszt, drobna wartość.
9. **Boxed layout preset** — niski koszt, niska wartość (niszowe).
10. **Inverted Radius Framework** — wysoki koszt, niska/średnia wartość — nie
    priorytetowe teraz.

---

## 2. Błędy i konflikty w samym frameworku CSS (core/optional)

Zweryfikowane bezpośrednio w kodzie (grep/node, nie tylko dokumentacja):

### 2.1 Tokeny konsumowane, ale nigdzie niezadeklarowane — **realne bugi**

```
core/base.css:118  background: var(--sf-color-code-block-bg, var(--sf-color-code-bg));
core/base.css:119  color:      var(--sf-color-code-block-text, inherit);
```
`--sf-color-code-block-bg` i `--sf-color-code-block-text` nie są deklarowane
nigdzie w źródle. Framework je "udaje" jako fallback-only hook tokens
(`scripts/hook-tokens.js`), co jest świadomym wzorcem — ale sam mechanizm
gate'u (`check:hook-tokens`) tylko **weryfikuje**, że te dwa są rzeczywiście
takie, nie **wykrywa** nowych. To jest bezpieczne dziś, fragile na przyszłość.

Podobnie `--sf-icon-size` (`core/layout.css:380`) nie jest deklarowany jako
token domyślny — istnieje tylko jako fallback w `var(--sf-icon-size,
var(--sf-icon-m))`, ustawiany lokalnie przez `.sf-icon--{size}`. To jest
zamierzony wzorzec (lokalna zmienna), ale nie jest wpisany do
`hook-tokens.js` — asymetria w traktowaniu identycznego wzorca.

### 2.2 Podwójne/konfliktowe deklaracje najważniejszych tokenów kolorów

`--sf-color-primary` (i analogicznie 9 innych rodzin) jest deklarowany
**sześć razy** w dwóch plikach z **czterema różnymi wartościami** w zależności
od kontekstu (`core/tokens.css:92,390`; `core/themes.css:66,72,104,162` —
LumLocker dark/light + source-dark + source-light). Wszystkie 10 tokenów
`--sf-color-text--on-*` są deklarowane **cztery razy** (dwa pliki, ta sama
formuła `sign()` powtórzona bajt-w-bajt). Framework to wie i gate'uje
(`check:mirrors` — "10 SL-001 dark derivations verified"), ale to wciąż
oznacza: **dwa źródła prawdy dla najważniejszych tokenów w systemie**, a gate
tylko potwierdza, że kopie się dziś zgadzają — nie zapobiega przyszłej
desynchronizacji przy edycji tylko jednego miejsca.

**Rekomendacja:** scalić `core/themes.css`'s re-declarations do jednego
miejsca (np. `@layer slashed.tokens` z pojedynczą definicją per selektor
`:root`/`[data-theme]`/`[data-lumlocker]`), albo wygenerować `themes.css`
automatycznie ze wspólnego szablonu w buildzie, żeby zniknęła potrzeba gate'u
"czy kopie się zgadzają".

### 2.3 161 nieużywanych tokenów (21% z 751) — gate informacyjny, nie blokujący

`node scripts/audit.js --unused` (odtworzone lokalnie) zwraca listę m.in.:
cały `--sf-z-*` (10 tokenów — martwe, bo klasy `.sf-z-*` są **zakomentowane**
w `optional/utilities.css:91-100`), `--sf-safe-*` (4, `env(safe-area-inset-*)`
— brak konsumenta), `--sf-radius-2xl/2xs/3xl/4xl/l/none/outer/pill/xl` (9),
`--sf-text-display-{s,m,l}` (3 — **uwaga: to są główne tokeny "display" skali
typografii, martwe bo core nie ma jeszcze klasy `.sf-display-*`**, tylko
konfigurator je odczytuje przez All-tokens/ClampField), `--sf-tracking-wider/
-widest` (2), `--sf-transition-{enter,exit,fast,slow,opacity}` (5),
`--sf-gradient-fade--{t,r,b,l}` + `--sf-gradient-surface` (5), `--sf-opacity-
muted`, `--sf-optical-sizing`, `--sf-space-none/px` (2).

To jest największy pojedynczy problem "sprzątania" we frameworku: **21%
publicznego, semver-zamrożonego API nie robi nic w dostawianym CSS**.
Konsekwencje praktyczne:
- Konfigurator wystawia kontrolki do tokenów, które nie mają żadnego efektu
  wizualnego (`--sf-text-display-s/m/l` mają panel w TypographyPanel — user
  przesunie slider i **nic się nie zmieni**, bo core nie konsumuje display
  scale scale bez klasy `.sf-display-*`, która nie istnieje).
- `--sf-gradient-fade--*` istnieją w tokens.css, ale nic w `core/` ich nie
  używa — a `.sf-overflow-fade` (podobna koncepcyjnie funkcja) używa
  zupełnie innego mechanizmu (`mask-image` + `--sf-mask-scrim-end`, token
  osobny). To wygląda na **dwie niezależne, częściowo zaimplementowane wersje
  tej samej funkcji** (jedna martwa, jedna żywa).

**Rekomendacja:** rozdzielić listę 161 na (a) legalne "public knobs bez
lokalnego konsumenta, bo są przeznaczone do użycia we własnym CSS" (np.
`--sf-safe-*`) i (b) faktyczne sieroty generatora/duplikaty (`--sf-gradient-
fade--*`, `--sf-radius-2xl` itd.). Dla (b): albo podłączyć konsumenta (np.
dokończyć `.sf-display-*` klasy dla `--sf-text-display-*`, odkomentować
`.sf-z-*` w utilities), albo usunąć token i zapisać w `token-renames.json`
jako `removal`.

### 2.4 `optional/legacy.css` obiecuje funkcję, której nie ma

Nagłówek pliku: *"Fallbacks for older browser gaps: dynamic viewport units,
focus-visible, scrollbar gutter, **has()**, dvh."* Treść pliku ma **trzy**
`@supports not (...)` bloki (dvh, focus-visible, scrollbar-gutter) — **żadnego
fallbacku dla `:has()`**, choć `core/layout.css` twardo zależy od `:has()`
(`.sf-section--guttered:has(...)`, `core/layout.css:63`). To jest
dokumentacyjny bug: obiecana funkcja nie istnieje w pliku. Do naprawy: albo
dopisać fallback, albo poprawić komentarz nagłówkowy (usunąć "has()").

Dodatkowo `optional/legacy.css` **nie jest w żadnym z 4 bundli**
(`bundle.config.json`) — trzeba go linkować ręcznie, co jest udokumentowane w
README, ale sprawia że jest praktycznie niewidoczny/łatwy do przeoczenia.

### 2.5 `:has()`-based reguła strukturalna w `.sf-section--guttered` jest fragile

```css
.sf-section--guttered:has(> .sf-content-grid):not(:has(> :not(.sf-content-grid)))
```
(`core/layout.css:63`) — dodanie **jakiegokolwiek** drugiego dziecka do sekcji
guttered (nawet komentarza-elementu typu `<script>` czy `<!-- -->`, w
zależności od silnika) cichutko zmienia inline padding sekcji. To jest
strukturalnie ryzykowne API — zachowanie zależy od dokładnej liczby i typu
dzieci, co nie jest oczywiste z samej klasy.

### 2.6 Niekonsekwentna specyficzność (`:where()` vs `:is()` vs goła klasa)

`optional/forms.css` używa `:where()` 19×  (zero specyficzności — łatwo
nadpisać), `core/layout.css` (147 klas, najważniejszy plik layoutu) używa
`:where()` **raz**. `core/accessibility.css` ma **36 `!important`**, co w
połączeniu z warstwami (`!important` odwraca kolejność *między* warstwami)
oznacza, że reguły a11y biją wszystko poza `print`/`legacy`/`overrides` —
świadome, ale niedokumentowane jako "hazard przy nadpisywaniu". Brak jednej,
udokumentowanej polityki specyficzności dla całego frameworka.

### 2.7 `optional/utilities.css` musi "łatać" kolizję z `core/macros.css`

`.sf-prose` jest zdefiniowany w obu plikach. Ponieważ `utilities` > `macros`
w porządku warstw, `optional/utilities.css:193-196` musi dodać
`:not(.sf-prose *)` guard na 4 klasach markerów tylko żeby nie nadpisać
typografii `.sf-prose`. To jest system warstw "przegrywający" z realną
potrzebą — symptom, że marker-utilities i prose-macro powinny być w tej samej
warstwie albo że marker-utilities nie powinny mieć wyższego priorytetu niż
prose w ogóle.

### 2.8 ~12 z 36 bloków `@supports` jest martwych przy deklarowanym floor przeglądarek

Floor to Chrome 125 / Safari 18.0 / Firefox 129. Ale `@supports (color:
light-dark(...))`, `@supports (color: oklch(from ...))`,
`@supports (width: calc(1px * sign(1)))` sprawdzają funkcje, które są wsparte
*poniżej* tego floora we wszystkich trzech silnikach — więc te gate'y **nigdy
nie failują** i cały "ungated fallback" (setki linii kolorów awaryjnych w
`core/tokens.css:92-101,294-300`) jest bajtami wysyłanymi do przeglądarek,
których framework i tak nie wspiera. Jednocześnie system fluid (`pow()`) **nie
ma żadnego `@supports` gate'u i żadnego fallbacku** — jeśli `pow()` nie
działa, cała typografia/spacing łamie się bez żadnej sieci bezpieczeństwa.
Postura ryzyka jest odwrócona: dużo ochrony tam gdzie niepotrzebna, zero tam
gdzie faktycznie ryzykowne.

**Rekomendacja:** usunąć `@supports` gate'y i ungated-fallbacki dla funkcji
poniżej stanowionego floora (redukcja realnego rozmiaru CSS), a dla `pow()`
albo podnieść floor jawnie w dokumentacji jako "wymagany, bez fallbacku", albo
dodać minimalny fallback (statyczne wartości rem bez `clamp()`).

### 2.9 Asymetria palety: kolory statusu (success/warning/info/danger) mają 7 tokenów, brand ma 30

Kolory brandowe (primary/secondary/tertiary/action/neutral) mają pełną rampę
(11 kroków numerycznych + 5 alpha + hover/active + lighter/darker/xlight/
xdark/superlight/superdark/tint/muted/subtle = 30 tokenów). Statusy mają
tylko: nazwa, dwa source, `-strong`, `-subtle`, `-muted`, `-tint` = 7. **Brak
hover/active i brak alpha dla statusów** oznacza, że nie można zrobić np.
przycisku "danger" z takim samym poziomem wykończenia hover jak przycisku
"primary" bez ręcznego `oklch(from ...)`. To jest prawdopodobnie zamierzone
(statusy używane rzadziej, mniejsza potrzeba), ale warto to jawnie
zadokumentować jako decyzję, bo dziś wygląda jak przeoczenie.

### 2.10 Zahardkodowane wartości, które powinny być tokenami

`core/layout.css:312-313` (`.sf-sidebar--narrow/--wide` = `12rem`/`26rem` na
surowo), `core/layout.css:502` (`::-webkit-scrollbar { block-size: 6px }`),
wszystkie breakpointy `@container` (`48rem`, `30rem`, `29.99rem`, `47.99rem`,
`20rem` w `optional/components.css:387`) — te ostatnie są **z konieczności**
zahardkodowane (spec CSS nie pozwala na `var()` w warunku `@container`), co
framework słusznie dokumentuje jako "SL-005". Ale to oznacza, że **cały
responsywny słownik 147 klas layoutu to dosłownie dwie liczby** (`30rem`,
`48rem`) — bardzo gruboziarniste na tak dużą liczbę prymitywów.

---

## 3. Błędy i konflikty w konfiguratorze (Svelte app)

### 3.1 Brak jednego źródła prawdy "token → panel"

Mapowanie tokenu na panel istnieje w **pięciu niezależnych miejscach**:
`SidebarNav.svelte` (`NAV_ITEMS`), `App.svelte` (`DOMAIN_LABELS`),
`DomainPanel.svelte` (`{#if domain === …}`), `src/data/domain-patterns.json`
(substringi tokenów per domena), `src/lib/preview/index.ts`
(`PANEL_TO_TAB`). Nie ma generatora, który by to złączył. Efekt: `domainOf()`
zwraca **pierwszą pasującą domenę w kolejności kluczy JSON**
(macros→colors→typography→spacing→layout→components→borders→shadows→motion→
effects→misc) — niedokumentowany priorytet, który **źle klasyfikuje**
tokeny typu `--sf-btn-l-font-size` (dopasowuje się do wzorca "font" z
typography *przed* wzorcem "btn-" z components) — więc przyciski są
odznaczane/resetowane pod "Typography", a ComponentsPanel (który faktycznie
je edytuje) nie ma o tym żadnej wiedzy przy operacji "reset domeny".

### 3.2 41 knobów bez dedykowanej kontrolki — ale nie 41, po weryfikacji: 0 kompletnie "martwych", tylko rozproszone

Wstępna analiza sub-agenta wskazała 41 knobów bez purpose-built control.
Dogłębna, druga weryfikacja (dopasowanie wzorców szablonowych `--sf-btn-
${rung}-font-size` itp.) pokazała, że **wszystkie 249 PUBLIC/PUBLIC-ADVANCED
knobs mają jakąś ścieżkę dostępu** w kodzie konfiguratora — ale część tylko
przez All-tokens tab (fallback), nie przez dedykowaną kontrolkę. Realnie
potwierdzone jako **niedostępne przez żadną kontrolkę** (0 wystąpień w
`configurator/src`):
```
--sf-hover-grow-scale, --sf-hover-shrink-scale, --sf-hover-lift, --sf-hover-slide,
--sf-card-avatar-size, --sf-container-full, --sf-fluid-width,
--sf-btn-min-height, --sf-btn-padding-block, --sf-btn-padding-inline,
--sf-sidebar-min-width, --sf-sidebar-width (base, non-narrow/wide)
```
Te tokeny są edytowalne wyłącznie poprzez wpisanie surowej wartości w zakładce
"All tokens" (`TokenRow` free-text). Dla efektów hover (grow/shrink/lift/
slide) to jest szczególnie odczuwalne, bo są to bardzo "widzialne" ustawienia
UX, które użytkownik configuratora prawdopodobnie chce dostrajać wizualnie z
podglądem — a dostaje tylko pole tekstowe bez podglądu numerycznego kontekstu.

### 3.3 Kontrolki nieadekwatne do typu tokenu

- **Aspect ratio jako wolny tekst**: `AspectRatioInput.svelte` istnieje i
  działa dobrze, ale jest użyty **tylko raz** (`LayoutPanel.svelte:513`).
  Siedem nazwanych tokenów ratio (`--sf-ratio-square/portrait/3-2/4-3/video/
  cinema/golden`) edytowane są jako `RawTokenRow` — wolny tekst
  (`LayoutPanel.svelte:626-651`). Dwa rozwiązania na ten sam typ wartości w
  jednym pliku.
- **Easing jako `<input type="text">` z fałszywym podglądem**: krzywe w
  `MotionPanel.svelte` mają hardkodowany SVG path w tabeli `EASINGS`
  (`preview: "M0,40 C8,40 28,0 40,0"`), który **nie renderuje się na nowo**,
  gdy użytkownik wpisze własny `cubic-bezier()`. Brakuje edytora uchwytów
  beziera — użytkownik widzi krzywą, która nie odpowiada wpisanej wartości.
- **Z-index na 1101-stopniowym sliderze**: wszystkie 9 tokenów `--sf-z-*`
  mają `min={-1} max={1100} step={1}` (`MiscPanel.svelte:99-104`), mimo że
  realne wartości to 1000/1010/1020… (skoki po 10). To jest bezsensowna
  rozdzielczość dla wartości, które i tak nic nie robią (patrz 2.3 — klasy
  `.sf-z-*` są zakomentowane, więc te sliderki w ogóle nie mają efektu
  wizualnego w podglądzie).
- **`TokenRow`'s type-guessing przez substring**: fallback dla każdego tokenu
  bez dedykowanej kontroli zgaduje typ na podstawie nazwy (`n.includes("color")
  ||n.includes("-bg")||n.includes("-border") → "color"`). Efekt:
  `--sf-border-width-1` zawiera `-border`, więc dostaje **próbnik koloru**
  mimo że jest liczbą w px. Realny, widoczny bug UX.
- **Gradienty**: `ColorsPanel.svelte` trzyma **ręcznie skopiowaną drugą
  wersję** formuł CSS gradientów jako literały JS (żeby zasilić strukturalne
  edytory kąta/stopów) — to jest drugie źródło prawdy dla tej samej logiki,
  które może się rozjechać z `core/tokens.css` przy każdej zmianie formuły.
- **Enum jako chip-row w jednym miejscu, wolny tekst w drugim**:
  `--sf-object-fit` ma rząd przycisków, ale `--sf-object-position`,
  `--sf-field-required-marker`, cztery `--sf-safe-*` to gołe pola tekstowe —
  niekonsekwentne mimo że wszystkie są tokenami enum/keyword.

### 3.4 Podgląd (preview) rozjeżdża się z eksportem dla tokenów derywowanych

`computeDerivedOverrides()` w `persistence.ts` to **osobna implementacja w
JS** formuły fluid z CSS (`fluidClamp`), plus zahardkodowane w JS ladders
(promienie zaokrągleń, szerokości obramowań, czasy trwania animacji) i
domyślne wartości skalarów wejściowych. Konsekwencje:
1. Zmiana ladderów w CSS (np. dodanie nowego kroku `--sf-radius-*`) **nie
   synchronizuje się automatycznie** z JS — trzeba pamiętać o edycji w dwóch
   miejscach.
2. JS wstrzykuje relacje, których eksport CSS **nigdy nie wygeneruje** — np.
   `--sf-radius-outer: calc(var(--sf-radius-m) + var(--sf-component-pad))` —
   podgląd pokazuje coś, czego wyeksportowany plik CSS finalnie nie zawiera.
   To jest realna rozbieżność "co widzę" vs "co dostanę".
3. Potwierdzony konkretny błąd: `MiscPanel.svelte:30` ma
   `{ token: "--sf-size-l", default: 2.75 }`, podczas gdy realna wartość CSS
   to `3rem` (`core/tokens.css:1158: --sf-size-l: 3rem`). Slider otwiera się
   w złej pozycji i etykieta "default" jest fałszywa. Do tego ten sam błędny
   `2.75rem` jest powtórzony jako fallback podglądu touch-target
   (`MiscPanel.svelte:80`).
4. **18 dodatkowych miejsc** hand-kopiuje rozwiniętą wartość liczbową dla
   tokenów, których CSS default to referencja `var()` (np. `--sf-field-radius`
   jako `0.5` zamiast `var(--sf-radius-m)`, `--sf-btn-radius`,
   `--sf-card-padding` itd.) — każda zmiana tokenu bazowego w CSS
   (`--sf-radius-m`, `--sf-space-m`) rozjeżdża te 18 hardkodowanych liczb bez
   żadnego ostrzeżenia czy testu.

### 3.5 Brak ochrony przed niemonotoniczną skalą fluid w edytorze

`ClampField` chroni ratio wewnątrz `[1.05, 1.8]` i wymusza `min ≤ max`, ale
**ratio-min i ratio-max są od siebie niezależne** — ustawienie
`ratio-min=1.8` i `ratio-max=1.05` powoduje na wyższych krokach skali
`sMin > sMax`, co w CSS `clamp(sMin, …, sMax)` z `min > max` **zawsze zwraca
sMin** — skala się spłaszcza/odwraca bez żadnego ostrzeżenia w UI. Podobnie
All-tokens tab pozwala wpisać dowolny tekst w te skalary — `getNum()` po
cichu spada na hardkodowany default przy nieparsowalnej wartości, więc
podgląd i realny eksport mogą się różnić bez żadnego komunikatu błędu.

### 3.6 `ScaleShadowNotice` nie obejmuje wszystkich ladderów, które generator nadpisuje

Istnieje mechanizm wykrywający, kiedy zapisany krok (np. `--sf-space-l`)
"przykrywa" generator skali i pokazuje ostrzeżenie z opcją czyszczenia — ale
działa tylko dla space/text/display. **Radius, border-width i duration** też
są generowane przez `computeDerivedOverrides` z multiplikatorów
(`--sf-radius-scale`, `--sf-border-scale`, `--sf-motion-scale`), ale nie mają
odpowiadającego ostrzeżenia — użytkownik może ustawić `--sf-radius-l` wprost
i nie dostanie żadnej informacji, że to "zabija" pokrętło `--sf-radius-scale`
dla tego kroku.

### 3.7 Martwy kod i nieużywane propsy

`GenericTokenPanel.svelte` jest nieosiągalny (każda domena z `NAV_ITEMS` ma
swój branch w `DomainPanel.svelte`, więc fallback do generic nigdy się nie
wykonuje) — i nawet gdyby się wykonał, ogranicza się do 60 wierszy bez
paginacji. `SpacingPanel.svelte` deklaruje prop `tokens` w typie, ale nie
destrukturyzuje go — `DomainPanel.svelte` przekazuje go, ale jest po cichu
ignorowany.

### 3.8 Brak gate'u CI na wiązanie kontrolka↔token

Żaden istniejący skrypt (`check-curation.mjs`, `check-dead-knobs.js`) nie
weryfikuje: (a) że literał `--sf-*` wpisany ręcznie w komponencie Svelte
faktycznie istnieje w `api-index.generated.json` (błąd nazwy = martwa
kontrolka, cicho), (b) że zahardkodowana liczba "default" w panelu zgadza
się z realną wartością w CSS (patrz 3.4.3), (c) że każdy PUBLIC knob ma
dedykowaną kontrolkę lub jest explicite dopuszczony do fallbacku "All
tokens". `check-curation.mjs` sprawdza tylko czy nazwa *zawiera* jakiś
substring domeny — bardzo słaby test, zresztą z pustą (nieużywaną)
ALLOWLIST.

---

## 4. Czy poziom edycji w konfiguratorze jest właściwy?

Krótka odpowiedź: **jest nierówny** — miejscami zbyt płytki (aspect ratio,
easing, enumy, cienie tekstu/box poza 5 presetami), miejscami odpowiednio
głęboki i dobrze zaprojektowany (`SliderRow` z trójmodowym przełączaniem
zmienna/slider/raw CSS — to jest naprawdę dobry wzorzec), a miejscami *za
głęboki* względem tego, co framework faktycznie renderuje:

- **Zbyt płytko**: aspect ratio, easing curves, enumy (object-position, safe-
  area), gradienty (druga kopia formuł), cienie poza 5 presetami box-shadow.
- **W porządku / dobrze zaprojektowane**: kolory (readback przez
  `getComputedStyle` z żywego iframe — to jest właściwy sposób na
  weryfikację derywowanych OKLCH formuł), typografia (dual-thumb ClampField z
  presetami modular scale), przyciski (per-rung editor z fallbackiem na skalę).
- **Zbyt głęboko / fałszywa precyzja**: z-index (1101 kroków dla tokenu, który
  nic nie renderuje bo klasa jest zakomentowana), display-scale (kontrolka
  istnieje, ale `--sf-text-display-*` nie ma żadnego konsumenta w core —
  użytkownik dostaje slider, który wizualnie nic nie zmienia), podgląd space-
  scale w `SpacingPanel` (liczby obliczane jako średnia min/max ratio, które
  nie odpowiadają żadnej realnej szerokości viewportu — fałszywa precyzja
  liczbowa `{scaled.toFixed(2)}rem`).

**Wniosek:** przed dalszym rozwojem konfiguratora warto najpierw domknąć
martwe tokeny we frameworku (sekcja 2.3) — bo część "płytkości" konfiguratora
to w rzeczywistości poprawnie odzwierciedlanie tego, że dany token *faktycznie
nic nie robi* w core. Naprawienie tokenów najpierw automatycznie podniesie
wartość istniejących kontrolek bez zmiany ani linii kodu w Svelte.

---

## 5. Priorytetowa lista poprawek

### Framework (core/optional)
1. Podłączyć konsumenta dla `--sf-text-display-{s,m,l}` (klasy `.sf-display-*`)
   albo usunąć token i wpisać do `token-renames.json` jako removal.
2. Odkomentować `.sf-z-*` w `optional/utilities.css` (tokeny już istnieją i są
   PUBLIC) albo usunąć oba (token+martwa klasa) razem.
3. Zadeklarować `--sf-color-code-block-bg`/`-text` jako realne tokeny z
   defaultem, zamiast trzymać je jako "fallback-only hook" — usuwa dwa
   niezweryfikowane bugi.
4. Naprawić nagłówek `optional/legacy.css` (usunąć wzmiankę o `:has()` albo
   dodać fallback) i rozważyć dodanie go do bundla `full` jako opt-in flag w
   buildzie.
5. Scalić 6-krotną deklarację `--sf-color-primary` (i analogicznych) do
   jednego miejsca generowanego, zamiast czterech ręcznie synchronizowanych
   kopii w dwóch plikach.
6. Usunąć `@supports` gate'y dla funkcji poniżej deklarowanego floora
   (redukcja realnego rozmiaru bundla), dodać minimalny fallback dla `pow()`
   albo jawnie zaakceptować "brak sizingu bez pow()" w dokumentacji floora.
7. Rozważyć dodanie `.sf-hover-shadow/-glow/-brighten/-fade` (tokeny już
   istnieją), `.sf-columns` (masonry), prostego `.sf-surface-image` z overlay.

### Konfigurator
1. Naprawić `--sf-size-l` default (`2.75` → `3rem`) i zrobić przegląd
   wszystkich 18 hand-copied resolved defaults względem `api-index.generated.json`
   — najlepiej automatycznym skryptem CI, nie ręcznie.
2. Dodać dedykowane kontrolki dla `--sf-hover-grow/-shrink/-lift/-slide` (4
   sliderki, tokeny już mają sensowny zakres) i dla `--sf-btn-min-height/
   -padding-block/-padding-inline` (bazowe, nie per-rung).
3. Zamienić `TokenRow`'s substring-guessing na typ z `api-index` (`syntax`/
   `role`/`category`), żeby border-width nie dostawał próbnika koloru.
4. Użyć istniejącego `AspectRatioInput` dla 7 tokenów `--sf-ratio-*` (dziś w
   `RawTokenRow`), i dodać prosty edytor `cubic-bezier` z żywym SVG dla
   `--sf-ease-*` zamiast statycznych podglądów.
5. Ustawić sensowny `step`/`min`/`max` dla `--sf-z-*` (np. dropdown z nazwanymi
   poziomami: below/base/raised/sticky/fixed/dropdown/overlay/modal/toast/
   tooltip, zamiast slidera 1..1100) — i dopiero po naprawieniu punktu
   Framework #2 (klasy `.sf-z-*` odkomentowane), żeby kontrolka miała
   realny efekt w podglądzie.
6. Zastąpić `computeDerivedOverrides`'s ręcznie kopiowane ladders/defaults
   odczytem z `api-index.generated.json`, żeby zmiana w CSS automatycznie
   propagowała się do podglądu bez ręcznej edycji `persistence.ts`.
7. Dodać cross-check `ratioMin ≤ ratioMax` (ostrzeżenie, nie hard block) i
   rozszerzyć `ScaleShadowNotice` na radius/border-width/duration.
8. Ustanowić jedno źródło prawdy token→panel (generator z `domain-patterns.json`
   lub z pola `group`/`area` w `api-index`), zamiast pięciu równoległych list.
9. Dodać CI gate: każdy `--sf-*` literał w `configurator/src` musi istnieć w
   `api-index.generated.json` (łapie literówki i martwe kontrolki od razu).

---

## 6. Co jest już dobre i nie wymaga zmiany (żeby nie "poprawiać" tego, co działa)

- 15 `@layer`ów, zero reguł poza warstwą — rzadkie, dobrze wykonane.
- `sign()`-based branchless auto-contrast text-on-color — elegancka i
  wydajna technika, lepsza niż podejście ACSS (które wymaga ręcznej
  konfiguracji per-relationship w dashboardzie).
- Rejestr tokenów ze stabilnymi ID + tombstone'y usunięć + `migrate-theme.js`
  — porządniejszy system migracji niż cokolwiek w dokumentacji ACSS.
- `SliderRow`'s trójmodowe przełączanie (zmienna ze skali / slider liczbowy /
  surowy CSS) — dobry wzorzec UX, wart rozszerzenia na więcej typów tokenów.
- Kolorowy podgląd przez faktyczny `getComputedStyle` w żywym iframe, nie
  reimplementację w JS — poprawna metoda weryfikacji formuł OKLCH.
- Content grid / breakout (`.sf-content-grid` + `.sf-breakout` + `.sf-full-bleed`)
  — kompletny, dobrze zaprojektowany system, na równi z ACSS Content Grid.
- Fluid engine (`pow()`-based dual-ratio clamp) dla type/space — koncepcyjnie
  mocniejszy niż prosty `clamp(min, calc(...), max)` w wielu innych
  frameworkach, mimo braku strukturalnej gwarancji monotoniczności (patrz 2.8).
