<!-- OWNERSHIP / STATUS
     This directory is a MANUALLY-RUN source-CSS audit, not part of `npm run
     build`/`docs` or any CI job. The *.cjs scripts are re-runnable from the
     repo root (they read core/ + optional/ + docs/ + token-registry.json and
     write snapshots into results/). Refresh by hand:
       node reports/css-source-audit/extract.cjs
       node reports/css-source-audit/analyzeA.cjs
       node reports/css-source-audit/classify.cjs
       node reports/css-source-audit/analyzeB.cjs
       node reports/css-source-audit/analyzeC.cjs
       node reports/css-source-audit/hardcoded.cjs -->

# SLASHED — audyt źródłowego CSS (kod ↔ tokeny ↔ dokumentacja)

**Wersja frameworka:** v0.7.8 · **Data:** 2026-07-09
**Zakres:** wyłącznie pliki źródłowe: `core/*.css` (13) + `optional/*.css` (8) = 21 plików, 5 559 linii.
`dist/` i pliki generowane wykluczone. Pliki przykładowe (`config-example`, `theme-example`,
`overrides-example`) wyłączone z analizy konsumpcji (to dokumentacja w formie CSS, nie framework).
**Metoda:** ekstrakcja mechaniczna (skrypty w tym katalogu; komentarze blokowe i literały
stringów wygaszane PRZED ekstrakcją), potem weryfikacja intencji w kontekście źródła (±20 linii).
Wszystkie liczby w tym raporcie pochodzą ze skryptów (`results/*.txt`, `results/*.json`).

## 0. Punkt odniesienia — istniejące bramki

Wszystkie bramki repo przechodzą na czysto na tym commicie:
`lint:css` ✅ · `check:version` ✅ · `check:llm-guide` ✅ · `check:macros` ✅ ·
`check:registry` ✅ · `audit:check` ✅ · `test:unit` ✅ (0 fail).

Liczby bazowe z ekstrakcji: **2 587 deklaracji**, **1 121 definicji tokenów (752 unikalne
nazwy)**, **2 506 użyć `var()` (565 unikalnych tokenów)**, **104 rejestracje `@property`**,
**18 `@keyframes`**, **633 selektory**.

---

## 1. Tabela znalezisk

Waga: **W** = wysoka (użytkownik robi to, co mówi dokumentacja, i nic się nie dzieje),
**Ś** = średnia, **N** = niska.

| # | Waga | Typ | Znalezisko | Dowód |
|---|------|-----|-----------|-------|
| 1 | **W** | martwy knob + rozjazd kod↔dok | `--sf-print-page-margin` i `--sf-print-page-size` są udokumentowane jako knoby PUBLIC-ADVANCED z opisem „Maps to @page margin/size" (`docs/api-index.md:512-513`, `docs/llm-guide.md:944-945` i `:1282-1283`), ale `core/print.css:15-18` hardcoduje `@page { size: a4 portrait; margin: 2cm; }` i **nie czyta żadnego z tych tokenów**. Identyczna wartość surowa (2cm↔2cm, a4↔a4) to dokładnie sygnatura martwego knoba. Nadpisanie tokenu przez użytkownika nie robi nic. Kontrast: `--sf-print-base-size` z tej samej rodziny JEST konsumowany (`core/print.css:21` — `var(--sf-print-base-size, 11pt)`). Uwaga techniczna: `var()` wewnątrz `@page` ma historycznie słabe wsparcie — jeśli to powód hardcodu, jest nieudokumentowany, a opisy „Maps to @page" pozostają fałszywe. | `core/print.css:15-18` vs `core/tokens.css:1471-1472` |
| 2 | **W** | martwy knob + fałszywa adnotacja | `--sf-field-block` — zarejestrowany `@property` (`core/tokens.css:211`), zdefiniowany na `:root` = `var(--sf-space-l)` z komentarzem „form-field block spacing" (`core/tokens.css:1612`), opisany w `docs/token-annotations.json` jako „Vertical (block) padding inside form fields" — **zero konsumentów w całym źródle**. Faktyczny padding pól to `var(--sf-space-xs)` wpisany wprost (`optional/forms.css:23`); wartości się nawet nie zgadzają (`space-l` vs `space-xs`). | `core/tokens.css:211,1612`; `optional/forms.css:23` |
| 3 | **W** | martwy szczebel skali + fałszywa adnotacja | `--sf-size-m` (2.5rem, `core/tokens.css:1174`) — jedyny szczebel rodziny `--sf-size-{xs,s,m,l,xl}` bez żadnego konsumenta. Adnotacja twierdzi: „Medium UI component height (**~36px**). **Default size for buttons and inputs**" — podwójnie fałszywa: 2.5rem = 40px, a faktyczny default przycisku to `--sf-touch-target` = `--sf-size-l` (2.75rem; `optional/components.css:68`, `core/tokens.css:1435`); inputy nie używają rodziny `--sf-size-*` wcale. | `core/tokens.css:1174,1435`; `optional/components.css:68` |
| 4 | **Ś** | rozjazd kod↔dok (nagłówek pliku) | Nagłówek `optional/forms.css:4`: „Values resolve through **core and optional component tokens**" — mechanicznie: forms.css konsumuje 33 unikalne tokeny, z czego **0** pochodzi z `optional/tokens.components.css`. Twierdzenie jest stęchłe (prawdopodobnie z czasów planowania tokenów `--sf-field-*`). | `optional/forms.css:4`; `results/classify.txt` |
| 5 | **Ś** | udokumentowana rezerwacja, ale pułapka publicznego API | `--sf-field-radius` / `--sf-field-padding-block` / `--sf-field-padding-inline` (`optional/tokens.components.css:46-48`) — komentarz i adnotacje uczciwie mówią „Reserved for a future .sf-field class — no consumer ships in this layer yet", ale tokeny są w tierze PUBLIC, trafiają do bundli `*-components`/`full` i do rejestru/indeksu jak każdy działający knob, a `optional/forms.css:23-30` styluje pola **identycznymi wartościami surowymi** (`--sf-space-xs`/`--sf-space-s`/`--sf-radius-m`) z pominięciem tych tokenów. Użytkownik, który je ustawi, nie dostaje nic. To 3 z 26 tokenów pliku kompanionowego bez konsumenta (pozostałe pary tokens.X→X mają 100% pokrycia — patrz §3.E). | `optional/tokens.components.css:40-48`; `optional/forms.css:23,24,30` |
| 6 | **Ś** | przeskok skali w wariantach klasy, bez komentarza | Drabinka rozmiarów `.sf-btn`: default(m) → `--sf-touch-target`(=`size-l`), `--l` → **`--sf-size-xl`** (przeskakuje `size-l`), `--xl` → `calc(var(--sf-size-xl) + var(--sf-space-s))` (improwizacja ponad skalą), `--xs` → `padding-block: 0.125rem` (literał — skala space nie ma szczebla 3xs). Efekt: mapowanie wariantów jest przesunięte o 1 względem nazw skali i osieroca `--sf-size-m` (znal. #3). Komentarz w pliku (`components.css:60-64`) tłumaczy dwupoziomowe knoby, ale nie tłumaczy przeskoku. | `optional/components.css:302-325` |
| 7 | **Ś** | niewidoczność hook‑tokenów w inwentarzach | 3 tokeny konsumowane wyłącznie przez fallback (`var(--x, …)`), nigdzie nie definiowane — celowe „hooki" udokumentowane w llm-guide, ale **nieobecne w `docs/token-index.json`, `docs/api-index.json` i `token-registry.json`** (brak id, tier, opisu; konfigurator ich nie widzi): `--sf-color-code-block-bg`, `--sf-color-code-block-text` (`core/base.css:118-119`), `--sf-overlap-host-pad` (`core/macros.css:437`, z komentarzem #496). Szerzej: **17 tokenów definiowanych poza 4 plikami tokenów** jest poza indeksem (celowy zakres `token_sources`), w tym 4 udokumentowane w llm-guide: `--sf-bento-cols`, `--sf-bento-row`, `--sf-field-border-color`, `--sf-field-text-color`. | `results/classify.txt` |
| 8 | **Ś** | luka w bramce CI | `scripts/check-llm-guide.js:66` — regex „żywych" tokenów `--sf-[a-z0-9_-]+(?=\s*[:,)])` zalicza także nazwy, które są tylko **konsumowane** (`var(--x)`) albo tylko **wymienione w komentarzu** źródła. Guide może więc bez alarmu odwoływać się do tokenu, którego nie da się ustawić (nie istnieje żadna definicja) — dokładnie ten mechanizm sprawia, że hooki z #7 przechodzą (tu akurat słusznie), ale też literówka pokrywająca się z komentarzem przejdzie. | `scripts/check-llm-guide.js:66-74` |
| 9 | **Ś** | rozjazd wartości w adnotacji | `--sf-duration-instant`: adnotacja „Near-instant duration (**~50ms**)" (`docs/api-index.md:380`), faktyczny default `calc(100ms * var(--sf-motion-scale))` (`core/tokens.css:1311`); llm-guide i motion.md mówią poprawnie 100ms. Nazwa „instant" dla 100 ms jest też myląca sama w sobie (skala: instant 100 < fast 150). | `core/tokens.css:1311`; `docs/api-index.md:380` |
| 10 | **N** | dryf lustrzanej kopii (komentarz „Mirrors") | `optional/utilities.css:31` deklaruje: `.sf-h1–.sf-h6` „Mirrors the h1–h6 rules in core/base.css" — mechaniczny diff: mirror nie odtwarza `overflow-wrap: break-word` (`core/base.css:28`) ani `margin: 0` (`:23`); grupowy `line-height: var(--sf-leading-tight)` (`:25`) jest pokryty przez per-nagłówkowe `--sf-hN-line-height`, więc bez skutku. Pominięcie `margin:0` jest zapewne celowe (klasa wizualna nie powinna kasować marginesów), ale wtedy słowo „mirrors" obiecuje za dużo. | `optional/utilities.css:31-50`; `core/base.css:23-37` |
| 11 | **N** | rozjazd dok (nieistniejąca rodzina) | `docs/architecture.md:252` wymienia „`--sf-blur-*`" jako rodzinę — istnieje tylko pojedynczy `--sf-blur` (`core/tokens.css:1304`). | `docs/architecture.md:252` |
| 12 | **N** | celowa architektura bez komentarza | 33 rejestracje `@property` typu `<length>` dla tokenów radius/space/gap mają `initial-value: 0`, podczas gdy realny default na `:root` to `calc(...)` — to ograniczenie spec (initial-value musi być obliczeniowo niezależne; autorzy znają je, bo przy `--sf-fluid-width` (`core/tokens.css:166-172`) jest pełny komentarz), ale przy bloku „Output token @property registrations" (`core/tokens.css:175-179`) rozjazd `initial ≠ default` nie jest odnotowany. Skutek uboczny wart 1 zdania komentarza: po rejestracji fallback w `var(--sf-radius-m, 12px)` nigdy nie zadziała — niewidoczna wartość to `0`, nie brak wartości. | `core/tokens.css:175-217` |
| 13 | **N** | wariant poza tokenem, bez komentarza | `.sf-cover--min { min-height: 50dvh }` (`core/layout.css:359`) — bazowy `.sf-cover` czyta `--sf-cover-min-height` (`:351`), wariant `--min` hardcoduje 50dvh (nie skaluje się z knobem). Prawdopodobnie celowe („połowa ekranu"), nieskomentowane. Analogicznie `textarea { min-block-size: 6rem }` (`optional/forms.css:102`). | `core/layout.css:351,359` |

**Twarde błędy, których NIE znaleziono (wynik = 0 ze skryptów):** użycia `var()` bez definicji
i bez fallbacku — **0**; `@property` zarejestrowane bez żadnej deklaracji wartości — **0**;
konflikty „dwa defaulty w tym samym zasięgu" — **0**; konflikty między plikami na `:root` — **0**;
`@keyframes` bez konsumenta — **0/18**; referencje animacji bez `@keyframes` — **0**;
nierozwiązywalne tokeny w którymkolwiek z 8 bundli — **0** (jedyne nierozwiązane to 3 hooki
z fallbackami, we wszystkich bundlach identycznie).

---

## 2. Fałszywe alarmy — zweryfikowane jako celowe (z dowodem)

1. **190 tokenów zdefiniowanych bez konsumenta w frameworku** — po klasyfikacji to w
   przeważającej mierze celowe „offer tokens" (publiczne API do konsumpcji przez użytkownika):
   wszystkie 190 figurują w `docs/token-index.json` z tierem (0 sierot poza indeksem),
   a `check:llm-guide` potwierdza 0 nieudokumentowanych knobów PUBLIC. Przykłady z dowodem
   celowości: `--sf-text-display-s/m/l` — komentarz z przykładem użycia w
   `core/tokens.css:1054-1055` („h1.hero { font-size: var(--sf-text-display-l) … }");
   `--sf-blur` — llm-guide:1551 podaje receptę `backdrop-filter: blur(var(--sf-blur))`
   (framework celowo nie ma szklanych powierzchni; nadpisanie `--sf-blur: 0` w
   `prefers-reduced-data` (`core/accessibility.css:89`) działa dla konsumentów użytkownika);
   palety `-100/-300/-500/-700/-900` — szczeble parzyste konsumują aliasy
   (`superlight`=50, `xlight`=200, `lighter`=400…), nieparzyste są ofertą; tokeny
   `--sf-animation-slide-out-*/ping/blink/float`, `--sf-shadow-*`, `--sf-transition-*`,
   `--sf-z-*`, `--sf-safe-*` — sekcje llm-guide. Wyjątki, które NIE są ofertą, wylądowały
   w tabeli znalezisk (#1, #2, #3, #5).
2. **Flagi `--sf-is-active/current/pressed/open` ustawiane, nigdy czytane przez framework** —
   celowe hooki pod CSS Style Queries, udokumentowane w `docs/llm-guide.md:1076-1079`
   i `docs/states.md:28-33` („sets `--sf-is-active`").
3. **41 rozjazdów `@property initial-value` vs default na `:root`** — wszystkie celowe,
   w trzech klasach: (a) tokeny computed-color: initial = wartość light, komentarz wprost
   („initial-value = light-mode value (safe fallback…)", `core/tokens.css:102-108`);
   (b) radius/space z initial 0 — ograniczenie spec (znal. #12, tylko brak komentarza);
   (c) `--sf-radius-pill` initial `9999px` vs `:root` `var(--sf-radius-full)` — równoważne
   po rozwiązaniu. Dodatkowo zweryfikowano znak-w-znak: 10 luster `-source-light`
   (`core/tokens.css:36-48`) — **0 rozjazdów**; 12 luster liczb fluid — **0 rozjazdów**;
   10 literałów initial-value `-source-dark` (`core/tokens.css:59-68`) — **przeliczone
   ręcznie formułą SL-001** (`clamp(0.65, 0.95−l·0.5, 0.88)`, `c·0.9`; base:
   `clamp(0.16, 1.18−l, 0.24)`, `c·0.5`) z defaultów light: 10/10 zgodne co do cyfry.
4. **Kontrakty „keep in sync"** — wszystkie mechanicznie potwierdzone: 21/21 formuł
   re-derywacji w `.sf-fluid-cq > *` (`core/layout.css:131-152`) identycznych po normalizacji
   whitespace z bliźniakami `:root` w tokens.css (`--sf-fluid-width` celowo inny — 100cqi,
   to sens tego bloku); SL-001 w `core/themes.css:82-92` — 10/10 zgodnych z fallbackami
   `light-dark()` w `core/tokens.css:402-413`; formuła auto-kontrastu `--sf-color-code-text`
   — 3 kopie (themes.css:224,238; tokens.css:653), 1 wariant, 0 rozjazdów.
5. **`token-registry.json` zawiera 36 tokenów nieistniejących w źródle** — celowe: rejestr
   jest append-only (stabilne id), wpisy mają `removed: true` i nigdy nie są kasowane
   (`scripts/gen-token-registry.js:8-19`); `check-token-registry.js` pilnuje, by żadne id
   nie zniknęło.
6. **Wielokrotne definicje tego samego tokenu między plikami** (np. `--sf-color-code-bg`
   w tokens.css:336 i themes.css:143,199) — re-deklaracje per-scope wymuszone semantyką
   `var()` (rozwiązanie na elemencie deklarującym), opisane komentarzem „#496" w
   `core/themes.css:141-144`. Analogicznie duplikaty durations `0.01ms` w
   `core/accessibility.css:36-50` — pas-i-szelki: token override + twarde `!important`
   dla animacji nieczytających tokenów.
7. **Klasy w wielu plikach (5 przypadków)** — wszystkie zasadne: `.sf-is-loading`
   (definicja w states, animacja w accessibility dla reduced-motion, warianty przycisku
   w components), `.sf-text-gradient` (forced-colors fix w accessibility),
   `.sf-link-external` (wyjątek w print), `.sf-prose`/`.sf-is-disabled` (guard/konsument).
   **0** konkurencyjnych podwójnych definicji.
8. **`optional/legacy.css` w żadnym bundlu** — celowe i udokumentowane
   (`README.md:115`: „not bundled by default — add it explicitly… load it last");
   warstwy `slashed.legacy`/`slashed.overrides` w layers.css to zarezerwowane sloty.
9. **Klasy „udokumentowane, nieistniejące"** — po weryfikacji wszystkie to notacja
   prefiksowa/wildcard (`.sf-marker--{family}`, `.sf-grid-cols-*`, `.sf-entrance/--exit`)
   albo jawnie oznaczone wzmianki historyczne/plany (`.sf-btn--ghost` „was removed",
   `.sf-tabs` „need JS" w components.md, którego nagłówek deklaruje: shipowane są
   dokładnie 2 komponenty). Odwrotny kierunek: **0** klas źródła nieobecnych w docs/*.md.
10. **SL-005** („każdy @container hardcoduje breakpoint, bo var() niedozwolony w warunku")
    — zweryfikowane: 10/10 warunków `@container` to literały (30em/48em z ogrodzeniem .99),
    jedyny „var(" przy @container to komentarz w tokens.components.css:88.

---

## 3. Wyniki analiz krzyżowych (liczby ze skryptów)

- **A. Tokeny:** 752 zdefiniowane / 565 konsumowane / 190 bez konsumenta (klasyfikacja: §2.1
  + znaleziska #1-#3, #5); użyte-niezdefiniowane bez fallbacku: **0**; z fallbackiem: **3**
  (hooki, #7); `@property` bez definicji: **0**; konflikty same-scope/cross-file: **0**.
- **B. Kopie synchronizowane:** 6 kontraktów w źródle, **wszystkie zgodne** (§2.3-4);
  1 dryf miękki (#10).
- **C. Klasy:** 633 selektory; 5 klas multi-file (wszystkie zasadne); mapowania wariantów
  `--xs…--2xl` → szczeble skal spójne w layout/utilities (gap/cluster/stack/header/section/
  icon/grid 1:1); jedyna anomalia: drabinka `.sf-btn` (#6).
- **D. Animacje:** 18 `@keyframes` ↔ referencje: domknięte w obu kierunkach; 23 tokeny
  `--sf-animation-*`, 11 konsumowanych przez framework, 12 = oferta (llm-guide).
- **E. Pliki kompanionowe:** `tokens.layout.css` 53/53 skonsumowane, `tokens.macros.css`
  34/34, `tokens.components.css` 23/26 (3 = #5), `tokens.css` 424/607 (183 = oferta + #1-#3).
- **F. Warstwy/bundle:** 15 warstw w layers.css; każdy plik mapuje się 1:1 na zadeklarowaną
  warstwę; kolejność plików w bundle'ach flat odpowiada kolejności warstw; wszystkie 8 bundli
  rozwiązuje 100% konsumowanych tokenów (poza 3 hookami z fallbackiem — identycznie wszędzie,
  więc to nie problem kompozycji bundli).
- **G. Dokumentacja:** llm-guide 503 referencje tokenów zwalidowane bramką; 0 nieudokumentowanych
  knobów PUBLIC; rozjazdy — patrz #1, #4, #9, #11; twierdzenia nagłówków plików zweryfikowane
  (SL-005 ✅, macros „values resolve through macro tokens" ✅ w przybliżeniu — 33/72 tokenów
  z pliku kompanionowego, reszta z core, co jest zgodne z intencją; forms ✗ = #4).

---

## 4. Luki w istniejących bramkach CI (czego ten audyt dowiódł)

1. **Martwe knoby są niewykrywalne.** `audit.js --unused` istnieje (162 pozycje,
   warning-only), ale **nie jest uruchamiany w CI** (ci.yml woła tylko `audit:check`)
   i nie odróżnia oferty od martwego knoba. Znaleziska #1-#3 przeszłyby (i przeszły)
   każdą bramkę. Minimalny mechaniczny detektor: token-knob z adnotacją zawierającą
   „Maps to…"/nazwę właściwości + 0 konsumentów + identyczna wartość surowa w pliku
   docelowym = fail.
2. **Prozа adnotacji nie jest walidowana.** `token-annotations.json` może twierdzić
   cokolwiek („Maps to @page", „~50ms", „Default size for buttons") — żadna bramka nie
   porównuje opisu z wartością defaultu ani z faktem konsumpcji (#1, #3, #9).
3. **`check-llm-guide` ma za szeroką definicję „żywego" tokenu** (#8): konsumpcja
   i komentarze liczą się jak definicje.
4. **Ręczne dokumenty poza macros.md nie mają bramek klasowych/tokenowych:**
   states.md, layout.md, motion.md, theming.md, components.md, architecture.md —
   stąd przetrwał `--sf-blur-*` (#11). `check-macro-catalog` pokrywa tylko macros.md.
5. **Kontrakty lustrzane utrzymywane ręcznie bez weryfikacji:** lustra
   `@property initial-value ↔ :root` (w tym literały `-source-dark` wyliczane ręcznie
   z formuły SL-001!), kopie formuł SL-001 i bloku `.sf-fluid-cq`. Dziś wszystkie są
   zgodne (0 rozjazdów), ale jedyną ochroną jest komentarz „do NOT edit independently".
   Skrypt `analyzeB.cjs` z tego katalogu robi tę weryfikację i mógłby zostać bramką.
6. **Inwentarze tokenów mają twardy zakres 4 plików** — tokeny definiowane w plikach
   klas (17 szt.) oraz hook‑tokeny konsumowane fallbackiem (3 szt.) nie dostają id,
   tieru ani wpisu w api-index, nawet gdy llm-guide je dokumentuje (#7). Konfigurator
   i narzędzia downstream ich nie widzą.

---

## 5. Rekomendacje wg priorytetu

**P1 — naprawy bezpieczne (nie łamią SemVer; zachowują domyślny render):**
1. Podłączyć knoby print: `@page { size: var(--sf-print-page-size, a4) portrait; margin: var(--sf-print-page-margin, 2cm) }` **albo** — jeśli hardcode jest świadomą decyzją
   przez wsparcie `var()` w `@page` — poprawić opisy w token-annotations/llm-guide
   („informational default; @page nie czyta tokenu") i rozważyć degradację tieru. (#1)
2. Podłączyć `--sf-field-*`: w `optional/forms.css` czytać
   `var(--sf-field-padding-block, var(--sf-space-xs))` itd. — fallback zachowuje
   dzisiejszy wygląd, a PUBLIC knoby zaczynają działać. Dla `--sf-field-block` — podłączyć
   albo usunąć adnotację i dodać „reserved" jak przy pozostałych. (#2, #5, przy okazji
   naprawia nagłówek forms.css #4)
3. Poprawić adnotacje: `--sf-size-m` (40px, bez „default for buttons and inputs"),
   `--sf-duration-instant` (100ms), `architecture.md` `--sf-blur-*`→`--sf-blur`. (#3, #9, #11)
4. Dodać komentarz przy bloku rejestracji radius/space o `initial-value: 0` ≠ default
   i skutku dla fallbacków `var()`; komentarz przy drabince `.sf-btn` wyjaśniający
   przeskok `--l`→`size-xl` (albo — patrz P3). (#12, #6)
5. Uzupełnić `overflow-wrap: break-word` w `.sf-h1–.sf-h6` lub osłabić słowo „mirrors"
   w komentarzu. (#10)

**P2 — wzmocnienie CI (czysto addytywne):**
6. Włączyć do ci.yml wariant `audit.js --unused` z listą dozwoloną (oferta) — nowy token
   bez konsumenta i bez wpisu na liście = fail; plus prosty detektor „adnotacja mówi
   Maps to X / Default for Y, a konsumentów 0".
7. Zawęzić regex `check-llm-guide` do faktycznych **deklaracji** (po zdjęciu komentarzy,
   `--sf-x` przed `:`), z jawną listą hook‑tokenów (fallback-konsumowane) jako drugim
   źródłem prawdy — i przy okazji dodać te hooki do api-index/token-index (nowa kategoria
   `hook`), żeby konfigurator je widział. (#7, #8)
8. Zmaterializować `analyzeB.cjs` (lustra @property↔:root, SL-001, blok CQ) jako
   `check:mirrors` w CI. (luka 5)

**P3 — zmiany dotykające publicznego API (wymagają decyzji/SemVer):**
9. Drabinka `.sf-btn`: przełączenie `--l` na `--sf-size-l` i `--xl` na `--sf-size-xl`
   **zmienia wymiary istniejących przycisków** (regresja wizualna — minor/major wg polityki);
   alternatywa zerokosztowa: komentarz + dokumentacja mapowania (P1.4). (#6)
10. Usunięcie realnych sierot (gdyby zdecydowano, że #2/#5 nie będą podłączane):
    kasowanie PUBLIC tokenów = **breaking change** (major) — rejestr id to przeżyje
    (`removed: true`), ale konsumenci nie; preferowana ścieżka to podłączenie (P1.2).

---

*Skrypty i surowe wyniki: `extract.cjs` (parser/ekstraktor), `analyzeA.cjs` (tokeny),
`analyzeB.cjs` (kontrakty sync), `analyzeC.cjs` (klasy/warianty), `classify.cjs`
(klasyfikacja vs inwentarze), `hardcoded.cjs` (literały w konsumentach) → `results/`.*
