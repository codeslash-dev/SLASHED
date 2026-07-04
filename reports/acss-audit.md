# Audyt ACSS ↔ SLASHED — analiza parytetu funkcji

> **Cel:** Dla każdego punktu z dokumentacji Automatic.css (ACSS, wersja 4.x —
> `docs.automaticcss.com`) opisujemy: (1) czym jest funkcja, (2) jak działa,
> (3) czy SLASHED (framework) lub plugin ma odpowiednik i czym się różni,
> (4) jeśli nie mamy — czy i jak możemy to dodać.
>
> **Metoda:** każda podstrona dokumentacji ACSS została przeczytana w całości
> (nie zgadywano po nazwie). Odniesienia do SLASHED bazują na `core/`,
> `optional/`, `docs/llm-guide.md`, `token-registry.json` oraz repo pluginu
> `SLASHED-Plugins`.
>
> Legenda oceny parytetu:
> - ✅ **Mamy** — pełny lub bliski odpowiednik.
> - 🟡 **Częściowo** — istnieje mechanizm, ale węższy / inny w działaniu / niekompletny.
> - ❌ **Brak** — nie ma odpowiednika.
> - 🔧 **Luka/niedokończone w SLASHED** — miejsce, gdzie audyt ujawnił dziurę lub niedokończoną funkcję po naszej stronie.

---

## 0. Różnica filozofii (kontekst całego audytu)

> **WAŻNE (aktualizacja):** ACSS **w 4.0 wykonał pivot na BEM-first** i
> **zredukował klasy narzędziowe** — usunięto m.in. `.link--*`, `.border/.border-light/.border-dark`,
> `.divider*`, część utilities kolorów; ich rolę przejęły **recipes** (składnia
> `?nazwa` — „variable expansion"), **zmienne CSS** i **mixiny SCSS**. Dzięki temu
> ACSS 4.x i SLASHED są **filozoficznie znacznie bliżej** niż w 3.x. Poniższa
> tabela uwzględnia już ten pivot — różnica przesunęła się z „utility vs token" na
> **„build/dashboard/SCSS vs no-build/pure-CSS"**.

| | **ACSS 4.x (Automatic.css)** | **SLASHED** |
|---|---|---|
| Model podstawowy | **BEM-first (po pivocie 4.0)** — mocno **zredukowane** utilities, nacisk na zmienne + recipes + mixiny. Nadal jest zestaw utilities (spacing, display, text itd.), ale sporo klas usunięto. | **Token-first / BEM-first** — tokeny `--sf-*` + prymitywy layoutu + makra. `optional/utilities.css` to pusty stub; **SLASHED nie dostarcza klas narzędziowych w 0.x**. |
| Odbiorca | Buildery stron (Bricks, Oxygen, Breakdance, Gutenberg, GenerateBlocks). Konfiguracja przez dashboard w WP + WP-CLI. | Dowolny stack, „no build, no Node, no runtime deps”. Konfiguracja przez nadpisanie tokenów lub konfigurator (Svelte SPA) + plugin WP. |
| „Silnik” wartości | **SCSS kompilowany** (po stronie pluginu), funkcje SCSS, zmienne CSS na wyjściu; **recipes** = mechanizm rozwijania zmiennych w builderze. | Czyste CSS: `oklch(from …)`, `light-dark()`, `color-mix()`, `clamp()`, `pow()` w `calc()`. **Zero kompilacji.** |
| Dark mode | „Color scheme" (4.x — nowy workflow, konfigurowany). | Automatyczny z 6 tokenów źródłowych + `data-theme`. |
| Mixiny/funkcje | Eksponowane użytkownikowi jako **SCSS mixins/functions** (bo ACSS kompiluje SCSS). | SLASHED nie ma warstwy SCSS dla użytkownika — „mixiny” realizujemy jako klasy-makra/prymitywy lub tokeny. **Cała sekcja „Mixins" ACSS to u nas albo makro/prymityw, albo brak.** |

Po pivocie 4.0 kluczowa różnica to **model dystrybucji wartości**: ACSS kompiluje
SCSS i udostępnia „recipes" oraz mixiny w kontekście buildera WP; SLASHED to
**pure-CSS bez buildu**, gdzie odpowiednikiem „recipe" jest nadpisanie knoba/tokenu
lub gotowe makro. Wiele pozycji z ACSS, które kiedyś były utility-class, dziś są
**recipe/mixin/zmienną** — i tak też je oceniamy poniżej.

---

## 1. Backgrounds (Tła)

### 1.1 Contextual Backgrounds (`.bg--light` / `.bg--dark` / `.bg--ultra-light` / `.bg--ultra-dark`)
- **Czym jest / jak działa:** Cztery abstrakcyjne klasy tła (`--bg-light`, `--bg-dark`, `--bg-ultra-light`, `--bg-ultra-dark`) konfigurowane centralnie w dashboardzie. Gdy element dostaje klasę kontekstową, ACSS **automatycznie dopasowuje foreground** (nagłówki, tekst, linki+hover, przyciski, ikony, focus) do tego, czy tło jest jasne czy ciemne („Light/Dark Relationships”). Zmiana koloru raz w panelu → wszystkie `.bg--dark` się aktualizują.
- **SLASHED:** 🟡 **Częściowo.** Mamy dwa mechanizmy pokrewne: (a) **theming sekcyjny** `data-theme="light|dark"` — na dowolnym elemencie ustawia `--sf-color-bg` i `--sf-color-text` automatycznie (`:where([data-theme]:not(:root,html))`), włącznie z automatycznym dark mode z `light-dark()`; (b) makra `.sf-surface--*` (patrz 1.2). Automatyczny dobór foregroundu realizujemy przez `light-dark()` + tokeny `--sf-color-text--on-*`.
- **Różnica:** ACSS operuje na **nazwanych tłach o 4 poziomach jasności** (ultra-light…ultra-dark) i „relacjach kolorów” konfigurowanych w panelu; SLASHED operuje na **trybie (light/dark) i rodzinach semantycznych**. Nie mamy gotowego zestawu `.bg--ultra-light`/`.bg--ultra-dark` jako klas narzędziowych (bo nie dostarczamy utilities). W pluginie WP dashboard „Color Assignments” jest naturalnym miejscem, by to odwzorować.
- **Czy dodać:** Tak, jako **opcjonalny zestaw klas** (`optional/utilities.css` — dziś stub) lub makro: `.sf-bg--light/-dark` mapowane na `--sf-color-base`/`--sf-color-inverse` + wymuszenie `data-theme`. Niski koszt.

### 1.2 Surfaces (`.surface-{name}` / `.surface-1…`)
- **Czym jest / jak działa:** Wprowadzone w ACSS 4.0 — **wielokrotnego użytku, nazwane presety tła** definiowane w dashboardzie: kolor bazowy (fallback), asset (obraz/gradient/wzór), `background-size/position/attachment/repeat`, animacja (własne `@keyframes`), overlay (kolor+opacity). Mogą mieć przypisaną „relację koloru” (ultra-light…dark), więc wyzwalają autodopasowanie foregroundu jak klasy `.bg--*`. Użycie: `<section class="surface-hero">` lub `var(--surface-1)`.
- **SLASHED:** 🟡 **Częściowo / inne znaczenie.** Mamy makro `.sf-surface--{family}` (primary, secondary, tertiary, action, neutral, inverse + status success/warning/info/danger), które ustawia tło rodziny + **auto-kontrastowy tekst** (`--sf-color-text--on-*`). To jest „surface = kolorowa powierzchnia semantyczna”, a **nie** presety z obrazami/overlay/animacją. Do mediów w tle mamy osobny prymityw `.sf-bg` i `.sf-scrim`.
- **Różnica:** ACSS „Surfaces” = **dashboardowy system presetów tła z obrazem/wzorem/overlay/animacją**; nasze `.sf-surface--*` = tylko kolor rodziny. Nazwanych, użytkownika, presetów z assetem nie mamy.
- **Czy dodać:** 🔧 **Realna luka po stronie konfiguratora/pluginu.** Framework CSS może dostarczyć tokeny (`--sf-surface-1-bg/-image/-overlay…`) i klasę `.sf-surface-1`, a **konfigurator/plugin** UI do definiowania nazwanych powierzchni z assetem i overlay. Warto rozważyć w roadmapie.

### 1.3 „Is Background” (`.is-bg`)
- **Czym jest / jak działa:** Zamienia realny `<img>` (lub dowolny box) w warstwę tła: pozycja absolutna 100%×100%, `z-index: -2` (nieskończone warstwowanie), a **rodzic** dostaje `position: relative` + `isolation`. Tokeny: `--bg-position/-inset/-width/-height/-radius/-z-index/-object-fit/-object-position`. Zaleta vs `background-image`: prawdziwy obraz (lazy-load, srcset, alt, indeksowalność).
- **SLASHED:** ✅ **Mamy — bardzo bliski odpowiednik: `.sf-bg`** (`core/layout.css`). Ustawia `inset: var(--sf-bg-inset)`, `object-fit/position`, `border-radius`, `z-index: var(--sf-bg-z)` (domyślnie `-2`), a rodzic przez `:where(:has(> .sf-bg))` dostaje `position: relative; isolation: isolate`. Obsługuje `img/video/picture`. Tokeny: `--sf-bg-inset/-fit/-position/-radius/-z`.
- **Różnica:** Tylko nazewnictwo (`.sf-bg` vs `.is-bg`) i to, że u nas rodzic konfiguruje się przez `:has()` (wymaga wsparcia `:has()`, które i tak jest w naszym floorze). Brak osobnych `--bg-width/-height` (liczymy z `inset`). Parytet praktycznie pełny.

---

## 2. Borders & Dividers (Obramowania i separatory)

### 2.1 Global Border System (`--radius`, `--border`, `--border-size/style/color`, Auto Radius)
- **Czym jest / jak działa:** Centralne `var(--radius)` (jeden globalny promień), shorthand `var(--border)` (+ `--border-light`/`--border-dark`), tokeny `--border-size/-style/-color-light/-dark`. „Auto Radius” automatycznie nadaje domyślny promień wskazanym elementom (domyślnie `img`, `figure`). Koncentryczny promień przez recipe `?concentric-radius`. W 4.x usunięto klasy `.border/.border-dark/.border-light`; kolory bazują na `color-mix()`.
- **SLASHED:** ✅ **Mamy — bogatszy system.** Skala promieni `--sf-radius-none…-4xl` + `--sf-radius-full/-pill`, mnożnik globalny `--sf-radius-scale` (0 = ostre, 2 = mocno zaokrąglone), helper koncentryczny `--sf-radius-outer` (= `radius-m + component-pad`). Obramowania: `--sf-border`, `--sf-border-subtle/-strong`, `--sf-border-width-hairline/-1/-2/-3/-4`, `--sf-border-scale`, `--sf-border-style`, kolory `--sf-color-border/--subtle/--strong/--focus/--translucent`. Dark mode automatyczny (`light-dark()`/`color-mix`).
- **Różnica:** ACSS ma **jeden** `--radius`; my mamy pełną skalę + mnożnik (bardziej granularnie i „jeden token = globalna zmiana”). ACSS „Auto Radius” automatycznie zaokrągla `img/figure` globalnie — **u nas radius na media jest tylko w `.sf-prose` (`--sf-prose-media-radius`) i w reset dla figure/media, nie ma globalnego przełącznika auto-radius**.
- **Czy dodać:** 🟡 Drobna luka: opcjonalny globalny „auto-radius media” (token + reguła `:where(img,figure)`), łatwy do dodania.

### 2.2 Global Divider System (`--divider`, recipes `?divider-top/-bottom/-all`)
- **Czym jest / jak działa:** `var(--divider)` (do użycia z `border`), tokeny `--divider-size/-style/-inline-size/-gap`, kolory light/dark. Recipes: `?divider-top`, `?divider-bottom` (separator z gapem na górze/dole), `?divider-all` (obramowania+gapy **między wszystkimi dziećmi** rodzica). W 4.x usunięto klasy, zostały recipes; kolory przez `color-mix()`.
- **SLASHED:** ✅ **Mamy — element + warianty.** `.sf-divider` (+ `--dashed/--dotted/--gradient/--soft/--strong/--vertical`), plus stylowane `hr`. Tokeny `--sf-divider-width/-style/-color/-gap`.
- **Różnica:** Nasz model to **dedykowany element separatora** (i warianty, w tym gradientowy i pionowy) — bogatszy wizualnie. **Brakuje nam odpowiednika `?divider-all`** — „linie między wszystkimi dziećmi” jednym haczykiem (dziś trzeba `.sf-stack` + własny border). 
- **Czy dodać:** 🟡 Warto dodać makro `.sf-divide` (`> * + * { border-block-start: var(--sf-border) }`) — tani odpowiednik `?divider-all`.

### 2.3 Inverted Radius Framework
- **Czym jest / jak działa:** Efekt **odwróconych (wklęsłych) narożników** — CSS ich natywnie nie ma, więc ACSS robi to techniką **pseudo-element + box-shadow**. Aktywacja w panelu, wymaga `--bg` na rodzicu (kolor, do którego „doklejają się” krawędzie). Sterowanie przez `data-inverted-radius-{1,2}-position/-slice` (16 pozycji, 4 slice), max 2 narożniki/element. Ograniczenia: brak wsparcia gradientów/wzorów, wymaga dopasowania przy breakpointach, znany artefakt „eyelash” (fix `translate3d`), specyficzne wymogi przy Clickable Parent.
- **SLASHED:** ❌ **Brak.** Nie mamy odwróconego promienia.
- **Czy dodać:** Możliwe, ale niszowe i kosztowne. Nowocześniej dałoby się to zrobić `mask` z `radial-gradient` (bez shadow-hacku), co obeszłoby brak wsparcia gradientów. Rekomendacja: **niski priorytet**, ewentualnie jako opcjonalne makro/utility `.sf-notch-*` w przyszłości.

---

## 3. Buttons (Przyciski)

> **Ustalenie kluczowe (dotyczy całej sekcji):** SLASHED **ma napisany pełny komponent `.sf-btn`** w `optional/components.css` (baza + `--secondary`/`--ghost` + warianty semantyczne primary/neutral/success/warning/info/danger + `--block`/`--block-cq`, stany `:disabled`/`.is-loading`), ale **cały plik jest ZASZTELOWANY — zakomentowany blokiem `/* … */` „STAGED … until v0.8"** i **nie trafia do żadnego zbudowanego bundla** (`grep sf-btn badges/*.css` = pusto). Dziś użytkownik dostaje jedynie **bezklasowe** stylowanie `<button>` z `optional/forms.css`. To jest **główna niedokończona funkcja** względem ACSS. 🔧

### 3.1 Button Styling (domyślne style, dashboard, `.unrelate`)
- **Czym jest / jak działa:** ACSS automatycznie stosuje domyślne style do **każdej klasy zaczynającej się od `.btn--`** (także z narzędzi third-party). Konfiguracja w „Buttons & Links": padding (em), min-width, typografia (line-height, tracking, weight, family — nowe w 4.0, transform, decoration + hover), border (width/style/radius, radius dziedziczy z globalnego), transition. 6 grup kolorów (primary/secondary/tertiary/accent/base/neutral), warianty light/dark i solid/outline. `.unrelate` blokuje automatyczną zmianę koloru na tłach z „color relationships".
- **SLASHED:** 🔧 **Częściowo, zasztelowane.** Komponent `.sf-btn` istnieje, ale wyłączony. Żywe są tylko tokeny `--sf-btn-radius`, `--sf-btn-padding-block`, `--sf-btn-padding-inline` (w `optional/tokens.components.css`) oraz bezklasowe style `<button>` w `forms.css`. Brak automatycznego stylowania dowolnych klas (to celowo sprzeczne z BEM-first), brak `.unrelate` (bo nie mamy „color relationships" auto-przemalowujących przyciski).
- **Różnica / do zrobienia:** Aby osiągnąć parytet trzeba **odblokować i dokończyć `.sf-btn`** (planowane v0.8). Auto-styling `.btn--*` jest sprzeczny z filozofią — zamiast tego mamy jawne klasy BEM.

### 3.2 Button Classes (`.btn--{color}`, `-light/-dark`, `--outline`, rozmiary `--xs…--xxl`)
- **Czym jest / jak działa:** `.btn--primary/-secondary/-tertiary/-accent/-base/-neutral`; warianty `.btn--{color}-light/-dark`; outline przez dołożenie `.btn--outline`; rozmiary T-shirt `.btn--xs/-s/-m/-l/-xl/-xxl` (łączone w dowolnej kolejności). Ładują się tylko aktywne kolory z palety.
- **SLASHED:** 🔧 **Zasztelowane i węższe.** Staged `.sf-btn` ma warianty **stylu** (`--secondary`=transparent+border, `--ghost`) i **semantyczne** (`--primary/-neutral/-success/-warning/-info/-danger`) oraz szerokość (`--block`, `--block-cq` przez query container). **Brakuje: rozmiarów T-shirt (`--xs…--xxl`), wariantów `-light/-dark`, dedykowanego `--outline`.**
- **Czy dodać:** Tak, przy odblokowaniu komponentu warto dołożyć skalę rozmiarów (mamy `--sf-size-*` i `--sf-text-*`, więc tanie) oraz ewentualnie `--outline`.

### 3.3 Button Variables (29 zmiennych)
- **Czym jest / jak działa:** ACSS eksponuje ~29 tokenów `--btn-*` (text-color/-hover, transform, decoration+hover, letter-spacing, line-height, font-size/-weight/-family/-style, background/-hover, border-color/-hover/-style/-width, radius, padding-block/-inline, min-width, align-items, transition-duration, outline-* zestaw, `--focus-color`).
- **SLASHED:** 🟡 **Mniej żywych tokenów.** Żywe: `--sf-btn-radius/-padding-block/-padding-inline`. Staged komponent odwołuje się dodatkowo do `--sf-btn-gap/-min-height/-font-size/-font-weight/-border-width` (z fallbackami). Wiele właściwości (transform, decoration, letter-spacing, family, align-items, outline-*) **nie ma dedykowanych tokenów** — bo komponent zasztelowany.
- **Czy dodać:** Rozszerzyć `tokens.components.css` o brakujące knoby przy finalizacji `.sf-btn`.

### 3.4 Outline Buttons (`.btn--outline`)
- **Czym jest / jak działa:** Modyfikator do klasy koloru+rozmiaru; przezroczyste tło, kolorowy border. W 4.0 grubość bordera outline zrównano z solid (równe wysokości obok siebie). Włączane per-kolor w dashboardzie.
- **SLASHED:** 🟡 **Namiastka.** Staged `.sf-btn--secondary` **jest de facto outline** (transparent bg, border+text w kolorze action). Brak osobnego modyfikatora `--outline`, brak per-kolor outline.
- **Czy dodać:** Przy finalizacji `.sf-btn` dodać `--outline` jako ortogonalny modyfikator (border+text w kolorze rodziny, bg transparent) — spójne z tokenami.

### 3.5 Gradient Outline Buttons
- **Czym jest / jak działa:** Nie natywne w frameworku ACSS — **recipe z custom CSS**: `::before` z gradientem + `mask` (`linear-gradient` z `xor`/`exclude`) „wycina" środek, tworząc gradientowy border. `@property` rejestruje kolory gradientu dla animowanego hoveru (swap primary↔secondary).
- **SLASHED:** ❌ **Brak.** Mamy tokeny gradientów (`--sf-gradient-primary/-brand/…`) i `.sf-text-gradient`, ale **nie ma recepty na gradientowy outline przycisku**.
- **Czy dodać:** Tak, jako recipe/dokumentacja (technika mask + `@property` działa w naszym floorze przeglądarek). Niski koszt, wysoka „wow".

### 3.6 Auto Button Styling & Exclusions
- **Czym jest / jak działa:** ACSS auto-stylizuje każdą klasę `.btn--*` (nawet third-party). Konflikty rozwiązuje pole wykluczeń (lista selektorów po przecinku) → ACSS w ogóle nie stylizuje wskazanych selektorów.
- **SLASHED:** 🟡 **Model odwrócony.** Nie auto-stylizujemy dowolnych `.btn--*`. Za to `forms.css` stylizuje **bezklasowe** `<button>` przez `:not([class*="sf-"])` — czyli automatycznie pomija elementy z klasami `sf-`. To „wykluczenie" działa odwrotnie: własne komponenty (z dowolną klasą inną niż `sf-`) nadal łapią bezklasowy styl.
- **Różnica:** Filozofia BEM-first nie przewiduje globalnego auto-stylingu po prefiksie klasy; wykluczenia w sensie ACSS nie są potrzebne, ale gdyby `.sf-btn` był aktywny, warto rozważyć token/selektor „opt-out".

---

## 4. Links (Linki)

### 4.1 Link Styling
- **Czym jest / jak działa:** Dashboard „Buttons & Links > Links": kolor (zmienna np. `--primary`), weight (`inherit`), decoration, decoration-color, decoration-thickness, underline-offset, „use global transition". Wykluczenia przez selektory (np. `"header a","footer a",".nav a"`). W 4.0 usunięto klasy `.link--primary` itd. (odchudzenie).
- **SLASHED:** ✅ **Mamy — bezklasowo, tokenowo.** `core/base.css` stylizuje `a:link/hover/visited/active` przez `--sf-color-link/--hover/--visited/--active/--underline`, `--sf-link-underline-offset`, `--sf-link-underline-thickness`. Dodatkowo makra `.sf-link--subtle`, `.sf-link--reverse`. Dark mode automatyczny (uwaga na komentarz w kodzie o WebKit `a:link`).
- **Różnica:** Parytet dobry. ACSS ma **panel wykluczeń** (wyłącz style w nav/footer); u nas robi się to nadpisaniem w `@layer slashed.overrides` lub własną klasą. Kolor linku u nas jest **auto-kontrastowany** (lightness clamp), czego ACSS nie robi automatycznie.

### 4.2 External Link Indication
- **Czym jest / jak działa:** Automatyczny wskaźnik linków zewnętrznych: **wizualny** (ikona/encja przez `::after`/`::before`, konfigurowalna pozycja, rozmiar, kolor+hover, weight, translacja X/Y) **oraz słuchowy** (tekst dla czytników, domyślnie „Link to external site", edytowalny, override per-link `aria-label`). Zakres: tylko linki między-domenowe. Automatyczne wykluczenia dla linków z `img/figure/picture/svg`; dodatkowe wykluczenia w `:has()`.
- **SLASHED:** 🟡 **Częściowo — tylko wizualnie i opt-in.** Mamy makro `.sf-link-external` + token `--sf-link-external-marker: " ↗"` (marker przez pseudo-element). **Ale:** (a) to **klasa opt-in**, nie automatyczne wykrywanie po `href`; (b) **brak cue słuchowego** (tekstu dla screen readerów); (c) brak auto-wykluczeń dla linków-obrazów.
- **Czy dodać:** 🔧 Realna luka a11y. Można dodać opcjonalną regułę auto: `a[href^="http"]:not([href*="{host}"]):not(:has(img,svg,picture))::after { content: var(--sf-link-external-marker) }` + wersję z visually-hidden tekstem dla a11y. Host trzeba sparametryzować (token/atrybut) — w pluginie WP trywialne (znamy domenę), w czystym CSS wymaga konfiguracji.

---

## 5. Effects (Efekty) — największy nowy obszar ACSS 4.x

> **Kontekst:** ACSS 4.x wprowadził rozbudowany, komponowalny system efektów
> (klasy `.on-hover--*`, `.on-enter--*`, `.on-exit--*`, `.on-visible--*`),
> z wariantami `-all` (dzieci), `--stagger` (`sibling-index()`), respektujący
> `prefers-reduced-motion`, bramkowany w dashboardzie. SLASHED ma **surowce**
> (keyframes, presety transition/animation/easing, tokeny scroll-timeline), a
> **część efektów już opakowaną** (`.sf-entrance--*`), ale **nie ma pełnego,
> komponowalnego systemu efektów hover/exit/visible**. To najbardziej „turnkey"
> przewaga ACSS.

### 5.1 Effects Overview (system)
- **Czym jest:** Spójny, opcjonalny, komponowalny system 4 kategorii efektów, `-all` na dzieci, `--stagger` przez `sibling-index()`, auto-`prefers-reduced-motion`, generowany tylko dla włączonych efektów.
- **SLASHED:** 🟡 **Częściowo.** Mamy `core/motion.css` (keyframes + presety), tokeny (`--sf-transition-*`, `--sf-animation-*`, `--sf-ease-*`, `--sf-duration-*`, `--sf-motion-scale`), klasy standalone (`.sf-fade-in`, `.sf-slide-in-up/-down/-left/-right`, `.sf-scale-up/-down`, `.sf-spin`, `.sf-ping`, `.sf-blink`, `.sf-float`, `.sf-shimmer`, `.sf-color-pulse`) oraz scroll-driven `.sf-entrance--*`. Brak jednolitej rodziny `.on-*` z `-all`/`--stagger`.
- **Czy dodać:** 🔧 Warto rozważyć opcjonalny moduł efektów (`optional/effects.css`) z rodziną hover/exit i wariantami `-all`/`--stagger` (`sibling-index()` jest w naszym floorze). Duża wartość wizualna, spójne z tokenami.

### 5.2 Hover Effects (`.on-hover--grow/-shrink/-float/-sink/-slide-*/-shadow/-glow/-brighten/-fade/-ripple-*/-outline-*/-underline-*`)
- **Czym jest:** Zestaw klas hover z tokenami (`--hover-duration`=0.3s, `--hover-timing`, `--hover-grow-amount`, `--hover-glow-*`, `--border-ripple-*`/`-outline-*`/`-underline-*`). Komponowalne.
- **SLASHED:** ❌ **Brak opakowanych klas hover-efektów.** Mamy presety transition (`--sf-transition-transform/-shadow/-colors/…`), `--sf-shadow-glow`, `.sf-link--*` (underline reverse). Efekt hover buduje się ręcznie w komponencie.
- **Czy dodać:** 🔧 Tak — to najtańsza i najbardziej „efektowna" luka. Rodzina `.sf-hover--grow/-float/-glow/-underline-*` na naszych tokenach ease/duration/shadow. Rekomendacja: wysoki priorytet w opcjonalnym module.

### 5.3 Entrance Effects (`.on-enter--fade/-float/-sink/-slide-*/-grow/-shrink/-blur/-parallax`)
- **Czym jest:** Scroll-driven (`animation-timeline: view()`), 9 efektów, tokeny `--animate-range-start/-end` (`entry 20%`/`entry 100%`), efekt-specyficzne odległości/skale/blur, `-all` (dzieci), `--stagger`. Fallback: natychmiastowe pokazanie.
- **SLASHED:** 🟡 **Mamy częściowo — `.sf-entrance--*`** (`core/motion.css`): `--fade/-fade-up/-fade-down/-fade-left/-fade-right/-scale-up` (6 wariantów), `animation-timeline: view()` w `@supports`, zakres z `--sf-scroll-timeline-range-start/-end`, `animation-fill-mode: both` jako fallback (natychmiastowe pokazanie bez wsparcia). Respektuje reduced-motion (motion-scale).
- **Różnica / do zrobienia:** Brakuje wariantów **blur** i **parallax**, wariantu **`-all`** (na dzieci) oraz **`--stagger`**. Rekomendacja: dołożyć blur/parallax + stagger (`sibling-index()`), by domknąć parytet.

### 5.4 Exit Effects (`.on-exit--fade/-float/-sink/-slide-*/-grow/-shrink/-blur`)
- **Czym jest:** Symetryczne do entrance, wyzwalane gdy element wyjeżdża (zakres `cover 50%`→`cover 100%`), scroll-driven, `-all`, `--stagger`.
- **SLASHED:** ❌ **Brak `.sf-exit--*`.** Mamy keyframes `sf-fade-out`, `sf-scale-down` i preset `--sf-transition-exit`, ale nie ma scroll-driven klas wyjścia.
- **Czy dodać:** Tak — symetrycznie do `.sf-entrance--*`, ten sam mechanizm `animation-timeline: view()` z zakresem `cover`. Niski koszt (mamy keyframes).

### 5.5 On Visible (`.on-visible--*`, IntersectionObserver, `acss-visible`)
- **Czym jest:** **JS-owy** (IntersectionObserver): dodaje klasę `acss-visible` gdy element wchodzi w viewport, animacja **raz** i zostaje. Tokeny `--visible-duration/-timing/-threshold`, `-all`, `--stagger`, `data-skip-acss-visible`.
- **SLASHED:** 🟡 **Połowicznie i z innej filozofii.** SLASHED to framework **bez runtime JS**, więc nie dostarcza IntersectionObserver. Mamy jednak **stan `.is-visible`** (`core/states.css`) jako hook CSS — konsument dodaje JS. Odpowiednik „raz i zostaje" robi scroll-driven z `fill-mode: forwards`, ale to nie to samo co „raz i nie cofa przy scrollu w górę".
- **Czy dodać:** W frameworku (pure CSS) — nie. W **pluginie WP** — tak, mały skrypt IntersectionObserver dopinający klasę do `.is-visible`/`data-*` byłby naturalny (plugin i tak ładuje JS w adminie).

### 5.6 Easing Presets (`--ease-smooth/-snappy/-gentle/-bouncy/-elastic`)
- **Czym jest:** 5 slotów (konfigurowalnych): smooth `cubic-bezier(.4,0,.2,1)`, snappy `(.16,1,.3,1)`, gentle `(.65,0,.35,1)`, bouncy `(.68,-.55,.265,1.55)`, elastic (`linear()` spring).
- **SLASHED:** ✅ **Mamy — więcej presetów:** `--sf-ease-linear/-out/-in/-in-out/-spring/-elastic/-bounce/-overshoot` (8). Wartości fizycznie zbliżone (spring/bounce/overshoot pokrywają snappy/bouncy).
- **Różnica:** Nasze to **stałe tokeny** (nadpisujesz wartość), ACSS ma **nazwane sloty** edytowalne w UI. Mapowanie 1:1 nazw inne, ale funkcjonalnie parytet (a nawet bogaciej).

### 5.7 Transition (globalny system tranzycji)
- **Czym jest:** `var(--transition)` = duration+timing+delay (`--transition-duration/-timing/-delay`), auto na buttonach/linkach. W 4.0 usunięto klasę `.transition` i ręczny input.
- **SLASHED:** ✅ **Mamy — bogatsze, semantyczne presety:** `--sf-transition-colors/-form-field/-transform/-opacity/-shadow/-fast/-slow/-enter/-exit/-overlay`. Zasada „nigdy `transition: all`". Durations `--sf-duration-*` × `--sf-motion-scale`.
- **Różnica:** ACSS ma **jeden** złożony `--transition`; my mamy **zestaw presetów per-właściwość** (lepsza wydajność/kontrola). Nie mamy jednego catch-all `--sf-transition` — świadomy wybór. Parytet+.

### 5.8 Selection Styling (`::selection`, `.selection--alt`)
- **Czym jest:** Domyślny styl zaznaczenia + **alternatywny** (`.selection--alt`) dla złego kontrastu; 2×(bg+fg). Zalecane tokeny kolorów.
- **SLASHED:** 🟡 **Mamy domyślne, brak „alt".** `core/base.css` stylizuje `::selection` przez `--sf-color-selection-bg/-text` (+ `--sf-color-mark-bg/-text` dla `<mark>`). **Brak kontekstowej klasy `.selection--alt`.**
- **Czy dodać:** Tanio: makro `.sf-selection--alt` nadpisujące tokeny selekcji na dzieciach. Drobna luka.

### 5.9 Sticky (`.sticky`, `.sticky-top--s/-m/-l`, `--sticky-offset`)
- **Czym jest:** `.sticky` → `position: sticky; inset-block-start: var(--sticky-offset,0)`; modyfikatory offsetu s/m/l; konfiguracja globalna i per-breakpoint w dashboardzie. Logiczne właściwości w 4.0.
- **SLASHED:** 🟡 **Mamy stan, nie utility.** `core/states.css` `.is-sticky` → `position: sticky; inset-block-start: var(--sf-sticky-offset,0)`. Token `--sf-sticky-offset` jest **fluid** (powiązany z wysokością headera, `--sf-header-height-*`), plus `--sf-z-sticky`.
- **Różnica:** ACSS ma dedykowaną klasę utility + skalę offsetów (s/m/l). U nas to **klasa stanu** (`.is-sticky`) i jeden fluidny offset. Brak modyfikatorów offsetu s/m/l.
- **Czy dodać:** Ewentualnie aliasy offsetu (np. `.is-sticky` + lokalne `--sf-sticky-offset`), albo makro `.sf-sticky`. Nasze podejście (fluid offset = wysokość headera) jest w praktyce wygodniejsze.

### 5.10 Gradient Fades (Effects) (`.fade--block/-inline/-top/-right/-bottom/-left`, `--fade-amount`)
- **Czym jest:** Wygaszanie treści w tło **maską** (bez dopasowywania kolorów), 6 osi, `--fade-amount` (dom. 25%), dostępne jako utility/mixin/recipe.
- **SLASHED:** ✅ **Mamy — `.sf-overflow-fade`** (`core/macros.css`) + `--block/--inline/--top/--right/--bottom/--left`, implementacja **mask-image (linear-gradient)**, sterowana `--sf-mask-scrim-start/-end`. Dodatkowo tokeny `--sf-gradient-fade--r/-l/-t/-b` i `.sf-scrim`/`.sf-text-protect` (ochrona tekstu na obrazach).
- **Różnica:** Parytet dobry; nasza semantyka to „fade krawędzi przewijanego kontenera", ACSS bardziej ogólnie „fade w tło". Nazewnictwo i pojedynczy `--fade-amount` vs para `start/end`.

> **Uwaga:** „Gradient Fades" pojawia się w ACSS też w sekcjach Mixins i Recipes — traktujemy je łącznie tutaj (patrz też 15.x / 9.x).

---

## 6. Cards (Karty)

> **Ustalenie:** Podobnie jak przy przyciskach, SLASHED **ma zaprojektowany komponent `.sf-card`** w `optional/components.css` (elementy BEM `__header/__body/__footer/__media/__avatar/__title`, koncentryczny radius, pełny zestaw tokenów `--sf-card-*`), ale **zasztelowany do v0.8 (zakomentowany, nieemitowany)**. 🔧

### 6.1 Card Framework Philosophy
- **Czym jest:** Centralny, tokenowy system kart — zamiast duplikować CSS per typ karty, wszystkie karty referują wspólne zmienne (`--card-padding/-radius/-gap` itd.). Zmiana raz w dashboardzie → wszystkie karty. Dziedziczą z globalnych skal (radius, spacing, typografia).
- **SLASHED:** 🟡 **Zgodna filozofia, inny mechanizm.** Nasz cały framework jest tokenowy, więc idea „karty referują wspólne tokeny" jest naturalna. Staged `.sf-card` używa `--sf-card-*` z fallbackami do globalnych (`--sf-space-l`, `--sf-radius-m`, `--sf-shadow-s`, `--sf-color-surface/-border/-heading`). Różnica: ACSS ma **centralny dashboard** i listę selektorów; my mamy **jawne klasy BEM**.

### 6.2 Card Workflow (6 kroków, selektory, BEM `__media`/`__avatar`/`[data-icon]`)
- **Czym jest:** Włącz wcześnie → dodaj selektor karty do listy → ustaw defaulty → używaj BEM (`__media`, `__avatar`, `[data-icon]`, h1–h6) → nadpisuj tokenami → ręczny CSS tylko dla unikatów.
- **SLASHED:** 🔧 **Częściowo (staged).** Nasz `.sf-card` już zakłada workflow BEM (`.sf-card__media`, `.sf-card__avatar`, `.sf-card__title`, `.sf-card__header/-body/-footer`). Nadpisywanie tokenami (`--sf-card-padding` itd.) działa identycznie jak w ACSS „Step 5". **Brak:** listy selektorów z auto-targetowaniem (patrz 6.4) i `[data-icon]` (u nas ikony przez `.sf-icon`).
- **Różnica:** ACSS pozwala „ostylować dowolną klasę-wrapper przez dopisanie do listy"; my wymagamy użycia `.sf-card`/`.sf-card__*`.

### 6.3 Card Styling (`--card-*` tokeny, display flex/grid, concentric radius)
- **Czym jest:** ~25 tokenów `--card-*` (padding/gap/radius/border-*/background/heading/text/link/button/icon/avatar/media/shadow/min-radius), koncentryczny radius (Off/Standard/Reverse), domyślnie `display:flex; column`, opcja grid.
- **SLASHED:** 🔧 **Częściowo (staged).** Staged `.sf-card` ma: `--sf-card-padding/-bg/-border-width/-border-color/-radius-outer/-radius/-shadow/-gap/-media-ratio/-media-radius/-heading-size`, `--sf-avatar-size`, koncentryczny radius (`--sf-radius-outer` = `radius-m + component-pad`, żywy token). **Brak** części knobów (link-color/-hover, button-font-size w pełni, icon-*, min-radius) i przełącznika flex↔grid.
- **Czy dodać:** Przy finalizacji `.sf-card` uzupełnić brakujące knoby; `--sf-radius-outer` już daje koncentryczność (mamy też „reverse" do rozważenia).

### 6.4 Card Targeting (lista selektorów, usunięto auto-detekcję w 4.0, `@include card`)
- **Czym jest:** Style kart tylko do jawnie wskazanych selektorów (pole „Card Selectors", po przecinku). Auto-detekcję usunięto w 4.0. Dzieci stylowane po BEM. Poza listą — mixin `@include card`.
- **SLASHED:** ❌/🟡 **Brak mechanizmu listy selektorów.** To koncept **dashboardowy/builderowy** — w pure-CSS nie mamy „listy selektorów rozszerzającej regułę". U nas kartę „targetuje się" przez nadanie klasy `.sf-card`. Odpowiednik `@include card` to po prostu użycie klasy `.sf-card` (lub w przyszłości `@apply`-podobne makro nie istnieje w czystym CSS).
- **Różnica:** W **pluginie WP** można by odwzorować „Card Selectors" (plugin generuje regułę CSS mapującą dowolny selektor na tokeny karty) — to naturalne miejsce, jeśli chcemy parytet dla builderów.

### 6.5 Card Color Scheme (`color-scheme`, Inherit/Light/Dark, sufiksy `--light`/`--dark`)
- **Czym jest:** Karta używa CSS `color-scheme`; default Inherit/Light/Dark; per-karta przez sufiks klasy `.card--light`/`.card--dark` (auto-detekcja sufiksu). W 4.0 zastąpiono osobne systemy klas właściwością `color-scheme` + opcją Inherit.
- **SLASHED:** ✅ **Mamy — i to niemal 1:1.** Nasz `data-theme="light|dark"` na dowolnym elemencie (w tym karcie) ustawia `color-scheme` i `--sf-is-dark`, a brak atrybutu = **Inherit** (dziedziczenie z rodzica / `prefers-color-scheme`). To dokładnie model „Inherit/Light/Dark". Dodatkowo automatycznie przelicza tło/tekst sekcji.
- **Różnica:** ACSS steruje **sufiksem klasy** (`--dark`), my **atrybutem** (`data-theme="dark"`). Mechanizm (`color-scheme` + zmienne) i efekt praktycznie identyczne; nasze dodatkowo liczy pełną paletę dark automatycznie.
