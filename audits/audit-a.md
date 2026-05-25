# Audyt API SLASHED v0.3.0 — pre-freeze

**Data:** 2026-05-25  
**Skala:** 13 plików `core/*.css` + 4 aktywne `optional/*.css` (forms, legacy, theme-example, tokens.palette) + 11 plików `docs/*.md` + `demo.html` (2794 linii) + `bundle.config.json` (10 bundli) + 2 skrypty + `package.json` przeczytane w pełnej treści.  
**Pominięto:** świadomie zakomentowane `optional/components.css`, `optional/tokens.components.css`, `optional/utilities.css` (zaplanowane na 0.7.0).

**Zakres liczbowy:** 610 zadeklarowanych tokenów, 360 używanych wewnętrznie przez framework, 250 to świadome BEM consumer-API. 14 keyframes, 12 animation tokens, 13 motion classes, 199 publicznych selektorów `.sf-*` / `.is-*` / `.sr-*` / `.focus-*` / `.print-*`.

---


## A. Tokeny

### A-1 🔴 `.sf-frame--4-3` renderuje 3:2 — class name kłamie
- **`core/layout.css:323`** `.sf-frame--4-3 { aspect-ratio: var(--sf-ratio-photo); }`
- **`core/tokens.css:534`** `--sf-ratio-photo: 3 / 2;`
- **Skutek:** klasa `--4-3` produkuje 3:2, a `.sf-frame--3-2` w linii 324 hardkoduje `3 / 2` (bypass tokenu, ten sam efekt co `--4-3`).
- Dwie sąsiadujące klasy o sprzecznych nazwach renderują identyczny aspect-ratio. Albo token `--sf-ratio-photo` jest źle nazwany (powinien być 4/3), albo klasa `--4-3` ma złą nazwę. Po zamrożeniu nie da się tego naprawić bez major bumpa.

### A-2 🟠 `--sf-header-height` — fallback default niezgodny z deklaracją
- **`core/tokens.css:755`** deklaruje `--sf-header-height: 8rem;`
- **`core/reset.css:15`** używa `var(--sf-header-height, 3.5rem)`
- **`core/base.css:28`** i **`core/base.css:152`** używają `calc(var(--sf-header-height, 3.5rem) + var(--sf-space-m))`
- **Skutek:** trzy miejsca zakładają `3.5rem` jeśli token zniknie, a faktyczny default to `8rem`. To ~4.5rem różnicy w `scroll-padding-top` / `scroll-margin-top` jeśli tokens.css nie załaduje się lub konsument zresetuje wszystkie tokeny.


### A-3 🟠 Hardkodowane wartości liczbowe — powinny być tokenami
- **`core/accessibility.css:152`** `.skip-link { z-index: 9999; }` — `--sf-z-max: 9999` istnieje w tokens.css:741. Powinno być `var(--sf-z-max)`.
- **`core/accessibility.css:83`** `hr { border-block-start-width: 2px; }` (gating: `prefers-contrast: more`) — `--sf-border-width-2: 2px` istnieje. Powinno być `var(--sf-border-width-2)`.
- **`core/accessibility.css:211, 220, 228`** `z-index: 1` i `z-index: 2` w `.sf-clickable-parent` overlay/dzieci. `1` matches `--sf-z-raised`; `2` nie ma odpowiednika w skali.
- **`core/states.css:90`** `.is-pending { opacity: 0.7; }` — żaden token `--sf-opacity-*` nie ma wartości 0.7 (jest 0/10/25/50/75/100). Albo dodać `--sf-opacity-70`, albo użyć innej wartości ze skali.
- **`core/states.css:268`** `.is-dragging { opacity: 0.5; }` — `--sf-opacity-50: 0.5` istnieje. Powinno być `var(--sf-opacity-50)`.

### A-4 🟡 Hardkodowane fallbacki w `var()` które się nie zaadaptują do trybu ciemnego
- **`core/base.css:17`** `background-color: var(--sf-color-bg, #fff);` — `#fff` w fallbacku, w dark mode to byłby błąd.
- **`core/base.css:58`** `background-color: var(--sf-color-mark-bg, yellow);`
- **`core/base.css:59`** `color: var(--sf-color-mark-text, black);`
- W praktyce fallback nie odpalą się — tokeny są zawsze zadeklarowane. Ale przy freeze takie zaszyte literały to dług.


### A-5 🟢 Canonical alias chains — kompletne
Sprawdzone:
- `--sf-gap` (tokens.css:619) → `--sf-space-gap` (tokens.layout.css:32) → `.sf-cluster-gap`, `.sf-sidebar-gap`, `.sf-switcher-gap`, `.sf-grid-gap`, `.sf-bento-gap`, `.sf-reel-gap` ✓
- `--sf-content-gap` (tokens.css:620) → `--sf-space-content` (tokens.layout.css:33) → `.sf-stack-gap`, `--sf-prose-paragraph` (tokens.layout.css → `.sf-prose`), `--sf-flow-space` (tokens.macros.css → `.sf-flow`) ✓
- `--sf-section-pad` (tokens.css:646) → `--sf-section-pad--m` (tokens.css:648) ✓

### A-6 🟢 Tokeny "used but not declared" — wszystkie to consumer hooks
17 tokenów: 10 × `--sf-color-X-dark`, `--sf-bento-cols`, `--sf-bento-row`, `--sf-color-code-block-bg/-text`, `--sf-field-border-color`, `--sf-field-text-color`, `--sf-icon-size`. Wszystkie 17 używane w formie `var(X, fallback)`. Zero prawdziwych dangling tokenów.

### A-7 🟢 BEM consumer surface — 250 zadeklarowanych ale nieużywanych przez framework
Każdy token niewolany przez core/* jest objęty kontraktem "exercised in docs/demo.html and validated by tests/" z header tokens.css. tests/coverage.spec.js + tests/tokens.spec.js to pilnują. ✓

---


## B. Nazewnictwo

### B-1 🟠 Niespójne skale modyfikatorów `--xs/--s/--m/--l/--xl` między primitives
Wszystkie różne, brak komentarza wyjaśniającego intencję:

| Klasa | Skala modyfikatorów | Liczba |
|---|---|---|
| `.sf-stack` | `--2xs/--xs/--s/--m/--l/--xl/--2xl/--3xl` | 8 |
| `.sf-cluster` | `--2xs/--xs/--s/--m/--l/--xl` | 6 (brak --2xl, --3xl) |
| `.sf-grid` | `--xs/--s/--m/--l/--xl` | 5 (brak --2xs, --2xl, --3xl) |
| `.sf-icon` | `--xs/--s/--m/--l/--xl` | 5 |
| `.sf-section` | `--s/--m/--l/--xl` | 4 (brak --2xs, --xs, --2xl, --3xl) |
| `.sf-bento` | `--2/--4/--compact/--tall` | inny schemat |

Albo to świadome (każdy primitive ma sensowne minimum/maksimum) i wymaga komentarza w `layout.css` + sekcji w `docs/layout.md`, albo to dług. Po freeze dodanie `.sf-cluster--2xl` jest możliwe (additive), ale spójność scale-by-design powinna być zadeklarowana teraz.

### B-2 🟢 State naming overlaps udokumentowane w states.md
`.is-error`/`.is-invalid`/`.is-danger`, `.is-success`/`.is-valid`, `.is-open`/`.is-expanded`, `.is-loading`/`.is-pending` — wszystkie z disambiguation w `docs/states.md` ✓

### B-3 🟢 Prefix `--sf-` i konwencja single/double-dash
- 610/610 tokenów ma prefix `--sf-` (stylelint enforce'uje) ✓
- 40 tokenów z formą `--sf-X--Y` (variant/state markers) — prawidłowe, brak triple-dash ✓

### B-4 🟢 Keyframes vs animation tokens
- 14 keyframes: `sf-fade-{in,out}`, `sf-slide-in-{up,down,left,right}`, `sf-scale-{up,down}`, `sf-color-pulse`, `sf-ping`, `sf-blink`, `sf-float`, `sf-spin`, `sf-shimmer`
- 12 `--sf-animation-*` tokens — `sf-spin`/`sf-shimmer` celowo pominięte (używane inline w `.is-loading::after` / `.is-skeleton`)
- 13 klas `.sf-*` motion — `sf-ping`/`sf-blink`/`sf-float` celowo bez klas (stagger/keyframe-only API)
- Wszystko spójne i udokumentowane.

---


## C. Klasy

### C-1 🟠 `.sf-icon--boxed` — NOWE w 0.3.0, EXPLICIT EXCLUDED z `tests/coverage.spec.js`
- **`tests/coverage.spec.js:50-52`** — w `EXCLUDED` set z komentarzem _"Modifier added in v0.3.0; behaviour covered by tests/tokens.spec.js (its 4 tokens) and the box-sizing math is purely declarative"_
- **Skutek:** publicznie udokumentowana klasa (CHANGELOG 0.3.0, `docs/architecture.md`, layout.css:264) NIGDZIE nie pojawia się w `demo.html` ani w żadnym teście wizualnym. Pre-freeze ten ślepy zaułek to ryzyko: użytkownik może liczyć na konkretne wymiary (`--sf-icon-box-pad: 0.5em`, content-box growth), ale nikt tego nie testuje.

### C-2 🟠 3 klasy makro całkowicie nieudokumentowane w `docs/macros.md`
- **`core/macros.css:160-170`** `.sf-surface--{primary,secondary,tertiary,action,neutral,inverse,success,warning,error,info,danger}` (11 wariantów) — udokumentowane w komentarzu CSS jako "ACSS Contextual Backgrounds" ale **brak sekcji** w `docs/macros.md`.
- **`core/macros.css:184-194`** `.sf-text-gradient` — brak sekcji w `docs/macros.md`.
- **`core/macros.css:212-217`** `.sf-link-external::after` — brak sekcji w `docs/macros.md`.

`docs/architecture.md` (sekcja `slashed.macros`) wymienia 11 nazw, też pomija te 3.

### C-3 🟢 `!important` — wszystkie udokumentowane i uzasadnione
Inwentaryzacja 32 wystąpień:
- a11y barriers: `core/accessibility.css` (focus ring, reduced-motion, sr-only/visually-hidden, forced-colors)
- print contract: `core/print.css` (hide-list, color-exact, no-color, summary)
- state visibility: `core/states.css` (.is-hidden, .is-loading color mask, .is-skeleton color mask, .is-clipped overflow)
- reset: `core/reset.css` ([hidden])

Każde z inline komentarzem wyjaśniającym dlaczego.

### C-4 🟢 Klasy animacyjne i ich brak — udokumentowane
`sf-ping`/`sf-blink`/`sf-float` mają keyframes i tokeny ale nie mają klas — kod komentuje "no utility classes ship for these (see audit §D9)". Intencjonalne.

---


## D. Cascade layers

### D-1 🟢 Wszystkie 15 warstw poprawnie wypełnione przez właściwe pliki

| Layer | Wypełniany przez | OK |
|---|---|---|
| slashed.tokens | core/tokens.css, core/tokens.layout.css, core/tokens.macros.css, optional/tokens.palette.css | ✓ |
| slashed.reset | core/reset.css | ✓ |
| slashed.base | core/base.css | ✓ |
| slashed.forms | optional/forms.css (opt-in) | ✓ |
| slashed.layout | core/layout.css | ✓ |
| slashed.components | optional/components.css (commented out) | slot reserved ✓ |
| slashed.macros | core/macros.css | ✓ |
| slashed.utilities | optional/utilities.css (empty) | slot reserved ✓ |
| slashed.states | core/states.css | ✓ |
| slashed.themes | core/themes.css, optional/theme-example.css | ✓ |
| slashed.motion | core/motion.css | ✓ |
| slashed.accessibility | core/accessibility.css | ✓ |
| slashed.print | core/print.css | ✓ |
| slashed.legacy | optional/legacy.css | ✓ |
| slashed.overrides | (empty by design) | ✓ |

Brak cross-layer pollution — każdy plik pisze tylko do swojego slotu.

### D-2 🟢 Order semantyka
- `slashed.themes` powyżej `states/utilities/components` — temat reassign tokenów wygrywa z component rules ✓
- `slashed.accessibility` powyżej `motion` — focus ring przeżywa transition rules ✓
- `slashed.legacy` poniżej `slashed.overrides` — user CSS zawsze wygrywa ✓

### D-3 🟢 Bundle bez wszystkich plików — sloty bez wypełnienia
W bundle `essential` brak forms.css/components.css/utilities.css/legacy.css → warstwy `slashed.{forms,components,utilities,legacy}` są deklarowane (przez layers.css) ale puste. Zerowy emit, zerowy efekt — slot zachowany na przyszłość. Intencjonalne i bezpieczne.

---


## E. Bundle

### E-1 🟢 Wszystkie 10 bundli rozpoczynają się od `core/layers.css`
Sprawdzone w `bundle.config.json`. ✓

### E-2 🟢 `package.json` `exports` — wszystkie ścieżki istnieją w `dist/`
Sprawdzone vs `ls dist/`. 11/11 paths OK.

### E-3 🟡 Flat bundles vs invariants
- `scripts/bundle.js` `stripLayerWrappers` zdejmuje `@layer X { … }` i `@layer X, Y, Z;` z każdego pliku w trybie flat.
- `core/layers.css` w trybie flat staje się pusty (cała zawartość to jedna deklaracja `@layer`).
- W flat trybie cascade zależy WYŁĄCZNIE od porządku plików w `bundle.config.json` + specyficzności selektorów.

Nie znaleziono reguły która **wymaga** obecności `@layer` żeby działać:
- `.sf-prose .sf-not-prose` (0-2-1) zwycięża w obu trybach (specyficzność, nie warstwa).
- Forced-colors `:where(*) { box-shadow: none; ... }` — `:where()` daje 0 specyficzności, działa w flat.
- Reduced-motion `*` — uniwersalny selector.
- `revert` w `.sf-prose .sf-not-prose :is(ul,ol)` — w flat falls back do UA stylesheet (komentarz CSS to potwierdza).

Wszystko OK, ale "flat bundle cascade contract is implicit" — brak explicit testu który symuluje environment z innym layer-stackiem konsumenta.

---


## F. Dokumentacja

### F-1 🟠 `docs/layout.md` listuje `.sf-prose` i `.sf-not-prose` jako layout primitives
- **`docs/layout.md:30,31`** w tabeli "The primitives": `.sf-prose` / `.sf-not-prose` z opisem i tokenem.
- W v0.3.0 te klasy zostały **przeniesione do `slashed.macros`** (CHANGELOG 0.3.0, migration.md sekcja "0.2.x → 0.3.0").
- `docs/layout.md` nie zauważył przeniesienia.

### F-2 🟠 `docs/states.md` listuje `.no-motion`, `.sr-only-focusable`, `.focus-parent` jako state classes
- **`docs/states.md`** tabela "Reference" + sekcja końcowa wymieniają wszystkie 3.
- `.focus-parent` zostało przeniesione do `slashed.accessibility` w v0.3.0 (CHANGELOG, migration.md).
- `.no-motion` i `.sr-only-focusable` od początku są w `core/accessibility.css`, nie w `core/states.css`.
- Doc w states.md aktywnie dezinformuje o lokalizacji klas.

### F-3 🟠 `docs/macros.md` brakuje 3 klas makro
Brak sekcji dla:
- `.sf-surface--*` (11 wariantów; w `core/macros.css:160-170`)
- `.sf-text-gradient` (`core/macros.css:184-194`)
- `.sf-link-external` (`core/macros.css:212-217`)

Wszystkie trzy to **publiczne API** w `slashed.macros`. Docs pomija.

### F-4 🟡 CHANGELOG 0.3.0 i `migration.md` mówią "12 macro recipes"
- **CHANGELOG.md** sekcja "0.3.0 → Added → core/macros.css — 12 recipes / patterns"
- **`docs/migration.md`** sekcja "What's new in essential" → "New file: core/macros.css (12 recipes)"
- Faktyczny inwentarz: 11 base recipes + `.sf-surface--*` (rodzina 11) + `.sf-text-gradient` + `.sf-link-external` = **14 distinct concepts**.
- Liczba "12" pasuje tylko jeśli policzyć `.sf-line-clamp-{2,3,N}` jako jedną i pominąć surface/text-gradient/link-external.

### F-5 🟡 Martwe referencje do usuniętego katalogu `audits/`
CHANGELOG 0.2.12: _"Removed audits/ directory from repository"_. W kodzie pozostały:
- **`core/tokens.css:696`** komentarz: `… SLASHED ships no .sf-stagger utility class (see audit §D9).`
- **`core/motion.css:139`** komentarz: `… No utility classes ship for these (see audit §D9).`
- **`core/print.css:8`** w nagłówku: `Color contract (Phase 3, see audits/comparative-audit-2026.md F-04):`
- **`tests/coverage.spec.js:14`** komentarz: `eliminates future regressions of the F-14 type`

### F-6 🟢 `docs/tokens.md` wygenerowane ze źródła
- 608 tokenów (361 core + 44 layout + 5 macros + 198 palette).
- `gen-token-reference.js` deduplikuje, sortuje, strip'uje komentarze.
- Pliki zaktualizowane 2026-05-25.

---


## G. Specyfika API freeze

### G-1 🔴 Lista PUBLIC/INTERNAL w nagłówku `core/tokens.css` jest NIEKOMPLETNA
**`core/tokens.css:39-58`** — sekcja "PUBLIC API vs INTERNAL (token-API freeze contract)":

```text
PUBLIC:
  · brand/status source tokens (--sf-color-*-light / -dark)
  · resolved semantic tokens (--sf-color-*, --sf-color-text--*, surfaces)
  · scales (--sf-space-*, --sf-text-*, --sf-radius-*, --sf-font-weight-*,
    --sf-leading-*, --sf-tracking-*, --sf-border-width-*, --sf-shadow-*,
    --sf-duration-*, --sf-ease-*, --sf-transition-*, --sf-z-*)
  · BEM consumer aliases (--sf-gap, --sf-content-gap, --sf-component-pad,
    --sf-section-pad*, --sf-divider-*, --sf-field-*, behaviour tokens)
INTERNAL:
  · --sf-is-dark and any token explicitly marked INTERNAL
```

**Brakujące w "scales":** `--sf-text-display-*` (3), `--sf-icon-*` (5), `--sf-size-*` (5), `--sf-container-*` (5), `--sf-ratio-*` (6), `--sf-blur-*` (5), `--sf-opacity-*` (7), `--sf-perspective-*` (3), `--sf-stroke-*` (4), `--sf-border-style-*` (4 — NEW w 0.3.0!), `--sf-text-shadow-*` (4), `--sf-drop-shadow-*` (3), scale multipliers (`--sf-text-display-scale`, `--sf-radius-scale`, `--sf-motion-scale`, `--sf-text-scale`, `--sf-space-scale`), `--sf-radius-{pill,outer,none,2xl,3xl,4xl}`, `--sf-tracking-{wider,widest}`, `--sf-leading-relaxed`, `--sf-font-weight-{thin,extralight,light,medium,extrabold,black}`, `--sf-font-{humanist,geometric,slab}`, `--sf-font-features`, `--sf-font-variation`, `--sf-optical-sizing`.

**Brakujące w "BEM aliases":** `--sf-link-external-marker`, `--sf-current-font-weight`, `--sf-bento-*` (5), `--sf-mask-scrim-*` (2), `--sf-scroll-timeline-range-*` (2), `--sf-h{1..6}-*` (24), `--sf-body-*` (8), `--sf-heading-*` (3), `--sf-code-font-size`, `--sf-flow-space`, `--sf-line-clamp`, `--sf-truncate-suffix`, `--sf-aspect`, `--sf-scroll-shadow-size`, `--sf-prose-paragraph`, `--sf-stack-gap`, `--sf-cluster-{gap,align,justify}`, `--sf-sidebar-*` (3), `--sf-switcher-*` (2), `--sf-grid-min*` (6), `--sf-cover-{min-height,padding}`, `--sf-icon-box-*` (4), `--sf-imposter-margin`, `--sf-reel-*` (3), `--sf-box-*` (3), `--sf-center-{max,gutter}`, `--sf-frame-ratio`, `--sf-breakout-width`, `--sf-content-width`, gradients (9), scrollbar (2), caret-color, focus-ring (5), touch-target, print (3), safe-area (4), header-height, sticky-offset, contrast-bias/threshold, color-scheme, lumlocker.

**Bottom line:** kontrakt PUBLIC vs INTERNAL pokrywa ~30% z 608 tokenów. Bez precyzyjnej granicy SemVer nie ma czego freeze'ować.


### G-2 🟠 Tokeny flagi w `slashed.states` są nieudeklarowane
- **`core/states.css:117`** `.is-active { --sf-is-active: 1; }`
- **`core/states.css:124`** `.is-current { --sf-is-current: 1; ... }`
- **`core/states.css:142`** `.is-pressed { --sf-is-pressed: 1; ... }`
- **`core/states.css:153,156,158`** `.is-open / .is-collapsed / .is-expanded { --sf-is-open: 0|1; }`

Żaden z 4 tokenów (`--sf-is-active`, `--sf-is-current`, `--sf-is-pressed`, `--sf-is-open`) nie jest:
- zadeklarowany w `:root` (tokens.css)
- zarejestrowany przez `@property` (jak `--sf-is-dark`)
- wymieniony w PUBLIC/INTERNAL header

W praktyce są to scoped flags do konsumenta. De facto INTERNAL ale bez kontraktu.

### G-3 🟠 DEPRECATED tokeny istnieją ale brak ich w centralnym kontrakcie
- **`core/tokens.layout.css:65`** `--sf-sidebar-width-default: 18rem;` — komentarz `@deprecated 0.4.0, removed in 0.5.0`
- **`core/tokens.layout.css:90`** `--sf-grid-min-default: 16rem;` — to samo

Kontrakt w nagłówku tokens.css wspomina "DEPRECATED — with a removal timeline noted in the token-file header", ale **nagłówek nie wymienia żadnego deprecated tokena**. Migration.md też nie ma sekcji deprecated. Konsument musi `grep @deprecated` w plikach tokenów żeby znaleźć ścieżkę migracji. Po freeze powinno być centralne.

### G-4 🟢 `optional/tokens.palette.css` używa tylko PUBLIC tokenów
Formuły bazują na `var(--sf-color-primary)`, `var(--sf-color-base)`, `var(--sf-color-text)` — PUBLIC resolved-semantic. Auto-adaptują się do dark mode. Brak referencji do INTERNAL. ✓

### G-5 🟢 `optional/theme-example.css` zgodny z aktualnym API
- Używa `--sf-color-{primary,secondary,tertiary,action,neutral,base}-light` — PUBLIC ✓
- Używa `--sf-color-primary-dark` — PUBLIC ✓
- `[data-theme="dark|light"]`, `[data-brand="X"]` — selektory zgodne z themes.css ✓
- `--sf-duration-normal`, `--sf-ease-out` — PUBLIC scales ✓

### G-6 🟢 `--sf-is-dark` poprawnie zarejestrowane jako INTERNAL
- `@property --sf-is-dark` w tokens.css:90 z `inherits: true; initial-value: 0;`
- Wymieniony w PUBLIC/INTERNAL jako jedyny explicit INTERNAL ✓

---


## Tabela priorytetów (🔴 + 🟠)

| ID | Plik:linia | Problem | Risk |
|---|---|---|---|
| **A-1** | `core/layout.css:323` + `core/tokens.css:534` | `.sf-frame--4-3` renderuje 3:2 (token `--sf-ratio-photo = 3/2`); `.sf-frame--3-2` hardkoduje 3/2. Class name lies. | 🔴 |
| **G-1** | `core/tokens.css:39-58` | Lista PUBLIC/INTERNAL pokrywa ~30% z 608 tokenów. SemVer kontrakt po freeze niejednoznaczny. | 🔴 |
| **A-2** | `core/reset.css:15`, `core/base.css:28,152` | `var(--sf-header-height, 3.5rem)` fallback ≠ deklarowany default `8rem`. | 🟠 |
| **A-3** | `core/accessibility.css:152,83`, `core/states.css:90,268` | Hardkody z-index/border/opacity mające tokeny. Plus `.is-pending` opacity 0.7 bez tokena. | 🟠 |
| **B-1** | `core/layout.css` (różne sekcje) | Skale modyfikatorów rozmiaru asymetryczne: stack 8, cluster 6, grid 5, section 4. Brak komentarza. | 🟠 |
| **C-1** | `core/layout.css:264` + `tests/coverage.spec.js:50` | `.sf-icon--boxed` (0.3.0) excluded z coverage; nigdzie w demo.html. | 🟠 |
| **C-2** | `core/macros.css:160-217` | 3 publiczne klasy makro nieudokumentowane w docs/macros.md. | 🟠 |
| **F-1** | `docs/layout.md:30,31` | `.sf-prose`/`.sf-not-prose` listed jako layout primitives; przeniesione do macros w 0.3.0. | 🟠 |
| **F-2** | `docs/states.md` | `.focus-parent`, `.no-motion`, `.sr-only-focusable` listed jako state classes; żyją w accessibility.css. | 🟠 |
| **F-3** | `docs/macros.md` | Doc pomija 3 makra (`.sf-surface--*`, `.sf-text-gradient`, `.sf-link-external`). | 🟠 |
| **G-2** | `core/states.css:117,124,142,153,156,158` | 4 scoped flag tokens nigdy nie deklarowane/rejestrowane/labelowane. | 🟠 |
| **G-3** | `core/tokens.layout.css:65,90` | DEPRECATED tokeny brak w centralnym kontrakcie. | 🟠 |

---

## Pominięte 🟡 (porządkowe)

- **A-4** Brittle hardcoded fallbacks w `var()` (`#fff`, `yellow`, `black`) w base.css.
- **E-3** Flat bundle cascade contract implicit (nie testowany explicit).
- **F-4** "12 macro recipes" w CHANGELOG/migration.md niezgodne z faktycznym 14.
- **F-5** Martwe referencje do `audits/`: tokens.css:696, motion.css:139, print.css:8, tests/coverage.spec.js:14.

---

## Podsumowanie

**🔴 Breaking pre-freeze: 2** (A-1, G-1).  
**🟠 API hygiene: 9** (A-2, A-3, B-1, C-1, C-2, F-1, F-2, F-3, G-2, G-3).  
**🟢 Solidne:** layers, bundle, canonical aliases, naming, keyframes, `!important`, palette, theme-example, `--sf-is-dark`, tokens.md pipeline.
