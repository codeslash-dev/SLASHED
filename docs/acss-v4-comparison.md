# SLASHED vs Automatic.css v4 — Porównanie techniczne

> Wersje: SLASHED v0.6.9 | Automatic.css v4.x  
> Data: 2026-06-22

---

## 1. Filozofia i środowisko

| Aspekt | SLASHED | Automatic.css v4 |
|---|---|---|
| **Środowisko** | Framework agnostyczny — czyste CSS, działa wszędzie | Wtyczka WordPress (Bricks Builder + Gutenberg) |
| **Instalacja** | `npm install` / CDN / skopiuj plik CSS | Wtyczka WP + GUI dashboard w wp-admin |
| **Konfiguracja** | Edycja CSS / tokenów / zmiennych bezpośrednio w kodzie | Wizualny panel w dashboardzie WordPress |
| **Wersja backward-compat** | Tak (semantyczne aliasy + migracja) | NIE — v4 nie jest kompatybilna z v3 |
| **Podejście do architektura** | Token-first → klasy wtórne do tokenów | Variable-first + BEM-first (klasy i zmienne równorzędne) |
| **Builder support** | Dowolny HTML/CSS | Tylko Bricks + Gutenberg (usunięto Oxygen, Breakdance, etc.) |

---

## 2. Prefiks i konwencja nazewnicza zmiennych

| Aspekt | SLASHED | Automatic.css v4 |
|---|---|---|
| **Prefiks tokenów** | `--sf-` (zawsze) | Brak prefiksu — np. `--primary`, `--space-m`, `--h1` |
| **Ryzyko kolizji** | Minimalne (unikalny namespace `sf`) | Wysokie — `--primary` może kolidować z bibliotekami, komponentami, theme'ami |
| **Warstwy CSS (`@layer`)** | Tak — pełna architektura warstwowa (`slashed.tokens`, `slashed.base`, `slashed.layout`, itd.) | Tak — v4 wprowadza CSS Layers |
| **`@property`** | Tak — typowane, animowalne tokeny dla kolorów, rozmiarów, spacing | Nie dokumentowane / nieużywane |
| **Przykład spacingu** | `--sf-space-m`, `--sf-space-l`, `--sf-gap` | `--space-m`, `--space-l`, `--gutter` |
| **Przykład koloru** | `--sf-color-primary`, `--sf-color-primary-500` | `--primary`, `--primary-dark`, `--primary-ultra-light` |

---

## 3. System kolorów

### SLASHED

- **Przestrzeń kolorów:** OKLCH na wejściu (`@property` + kanały `--sf-color-primary-l/c/h`)
- **Generowanie odcieni:** 11-stopniowa skala numeryczna (`100`–`900` + `950`, `1000`) generowana automatycznie przez `color-mix(in oklab ...)`
- **Aliasy semantyczne:** `--sf-color-primary-light`, `--sf-color-primary-dark`, `--sf-color-primary-subtle` mapują się na konkretne wartości ze skali
- **Dark mode:** `light-dark()` na poziomie tokenów semantycznych — jeden zestaw nazw, dwa konteksty
- **Przezroczystość:** Relative Color Syntax: `oklch(from var(--sf-color-primary) l c h / 0.5)` — bez osobnych tokenów alpha
- **Kolory powierzchni:** Hierarchia `--sf-color-base` → `--sf-color-inset` → `--sf-color-overlay` + `--sf-color-raised`
- **Konfiguracja:** Edytujesz `--sf-color-primary-source` (kanały L, C, H osobno lub przez `@property`)

### Automatic.css v4

- **Przestrzeń kolorów:** OKLCH — nowe w v4 (v3 używało HSL)
- **Generowanie odcieni:** 7-stopniowa skala opisowa: `ultra-light`, `light`, `semi-light`, *(base)*, `semi-dark`, `dark`, `ultra-dark` + `hover`
- **Nazwy zmiennych odcieni:** `--primary-ultra-light`, `--primary-light`, `--primary-dark`, `--primary-ultra-dark`
- **Dark mode:** `light-dark()` — takie same nazwy zmiennych, wartości przełączają się automatycznie (nowe w v4, v3 miało osobny zestaw zmiennych "Alt")
- **Przezroczystość:** v4 usuwa bibliotekę tokenów przezroczystości — zamiast tego `color-mix()` generowana w miejscu użycia. Dostępne też kanały: `--primary-hex`, `--primary-h`, `--primary-s`, `--primary-l`, `--primary-r`, `--primary-g`, `--primary-b`
- **Kolory semantyczne:** Warning, Info, Success, Danger (opcjonalne, włączane per-projekt)
- **Konfiguracja:** GUI dashboard — wybierasz kolor bazowy, ACSS generuje całą paletę

### Porównanie tabelaryczne

| Aspekt | SLASHED | ACSS v4 |
|---|---|---|
| **Przestrzeń kolorów** | OKLCH | OKLCH |
| **Liczba odcieni** | 11 (100–900 + 950, 1000) | 7 opisowych + hover |
| **Nazewnictwo odcieni** | Numeryczne (`-500`) | Opisowe (`-dark`, `-ultra-light`) |
| **Dark mode** | `light-dark()` | `light-dark()` |
| **Przezroczystość** | Relative Color Syntax | `color-mix()` / kanały kolorów |
| **Skąd pochodzi kolor** | Edycja CSS / kanały OKLCH | GUI dashboard |
| **Kolory powierzchni** | Hierarchia 4-poziomowa | Base + Neutral (2 sloty) |
| **Kolory semantyczne** | Warning, Info, Success, Danger (wbudowane) | Warning, Info, Success, Danger (opcjonalne) |
| **Ile slotów kolorów** | Primary, Secondary, Tertiary, Accent + Base | Primary, Secondary, Tertiary, Accent, Base, Neutral (6 slotów) |

---

## 4. System typografii

### SLASHED

- **Fluid scale engine:** `clamp()` + `pow()` w czystym CSS — brak kroku build
- **Tokeny rozmiarów tekstu:** `--sf-text-2xs` → `--sf-text-2xl` (7 kroków)
- **Tokeny nagłówków:** `--sf-text-h1` → `--sf-text-h6` (mapowane na skalę fluid)
- **Font-family:** `--sf-font-body`, `--sf-font-heading`, `--sf-font-mono`, `--sf-font-display`
- **Font-weight:** Numeryczne primitivy (`--sf-font-weight-300..900`) + semantyczne role (`--sf-font-weight-heading`, `--sf-font-weight-body`, `--sf-font-weight-interactive`)
- **Line-height:** `--sf-leading-tight`, `--sf-leading-normal`, `--sf-leading-relaxed`, `--sf-leading-loose`
- **Konfiguracja:** Edycja tokenów CSS; skala fluid konfigurowana przez `--sf-type-min`, `--sf-type-max`, `--sf-type-scale`

### Automatic.css v4

- **Fluid:** Tak — bridge variables dla płynnego skalowania między rozmiarami
- **Tokeny rozmiarów tekstu:** `--text-xs`, `--text-s`, `--text-m`, `--text-l`, `--text-xl`, `--text-xxl` (6 kroków)
- **Tokeny nagłówków:** `--h1` → `--h6` (bezpośrednie wartości rozmiaru)
- **Per-heading overrides:** `--h1-font-family`, `--h1-color`, `--h1-line-height`, `--h1-font-weight`
- **Globalne:** `--heading-font-family`, `--heading-color`, `--heading-line-height`, `--heading-font-weight`
- **Konfiguracja:** GUI dashboard (base font size, heading scale, per-heading customization)

### Porównanie tabelaryczne

| Aspekt | SLASHED | ACSS v4 |
|---|---|---|
| **Fluid bez buildu** | Tak (`clamp()` + `pow()` w CSS) | Tak (bridge variables) |
| **Tokeny rozmiarów** | 7 kroków (`2xs`–`2xl`) | 6 kroków (`xs`–`xxl`) |
| **Nazewnictwo** | `--sf-text-xl` | `--text-xl` |
| **Nagłówki** | `--sf-text-h1`..`h6` | `--h1`..`h6` |
| **Font-weight semantyczny** | Tak (`--sf-font-weight-heading`, etc.) | Tak (`--heading-font-weight`, `--h1-font-weight`) |
| **Konfiguracja** | CSS | GUI |

---

## 5. System spacingu

### SLASHED

- **Skala fluid:** `--sf-space-3xs` → `--sf-space-3xl` (10 kroków) — wszystkie wartości to `clamp()`
- **Semantic gaps:** `--sf-gap` (loose), `--sf-content-gap` (tight), `--sf-gutter` (wide), `--sf-section-pad`
- **Prymitywy layoutu:** Każdy komponent layoutu ma własny token gap (np. `--sf-stack-gap`, `--sf-cluster-gap`, `--sf-grid-gap`)
- **Konfiguracja:** `--sf-space-base`, `--sf-space-scale`, `--sf-space-min-viewport`, `--sf-space-max-viewport`

### Automatic.css v4

- **Skala:** `--space-xs`, `--space-s`, `--space-m`, `--space-l`, `--space-xl`, `--space-2xl` (6 kroków, "xxl" → "2xl" w v4)
- **Section spacing:** `--section-space-xs` → `--section-space-2xl` (osobny zestaw dla paddingu sekcji)
- **Gutter:** `--gutter`
- **Bridge variables:** `--space-xl-to-m` — fluid spacing między dwoma rozmiarami
- **Konfiguracja:** GUI: base spacing value, base scale, desktop ratio, mobile ratio

### Porównanie tabelaryczne

| Aspekt | SLASHED | ACSS v4 |
|---|---|---|
| **Liczba kroków** | 10 (`3xs`–`3xl`) | 6 (`xs`–`2xl`) |
| **Section spacing** | `--sf-section-pad` (jeden token, fluid) | Osobna skala `--section-space-*` |
| **Bridge/between variables** | Nie — skala fluid eliminuje potrzebę | Tak — `--space-xl-to-m` etc. |
| **Semantic gaps** | Tak (gap, content-gap, gutter) | `--gutter` (jeden) |
| **Per-component gap** | Tak (`--sf-stack-gap`, `--sf-grid-gap`, itd.) | Nie (klasy kontrolują spacing) |

---

## 6. Klasy użytkowe i podejście do HTML

### SLASHED

- **Podejście:** Token-first — tokeny są API, klasy są convenience wrappers
- **Naming:** BEM-like prefix: `sf-stack`, `sf-cluster`, `sf-grid`, `sf-box`, itd.
- **Layout:** Dedykowane klasy layoutu (Stack, Cluster, Grid, Sidebar, Switcher, Cover, Frame, Reel, Bento, Content Grid)
- **Macros (przepisy):** `.sf-prose`, `.sf-flow`, `.sf-surface`, `.sf-scrim`, `.sf-line-clamp-N`, `.sf-scroll-shadow`, `.sf-content-auto`
- **States:** `.sf-focus-ring`, `.sf-sr-only`, `.sf-not-sr-only`
- **Brak utility class library** — nie ma `mt-4`, `text-red-500`, etc.
- **Customizacja klas:** Przez override tokenów CSS na elemencie (`style="--sf-stack-gap: var(--sf-space-l)"`)

### Automatic.css v4

- **Podejście:** Variable-first + BEM-first (zrównanie rangi klas i zmiennych)
- **Naming:** Bezpośredni: `.flex-grid`, `.columns`, `.btn`, `.text-xl`, `.bg-primary`
- **Layout:** Klasy grid i flex, columns, flex-grid, stack
- **Recipes (przepisy):** Prefix zmieniono z `@` na `?` w v4: `?btn`, `?flex-grid`, `?columns`
- **Utility classes:** Szerokie utility class modules (w v4 uproszczone — część modułów utility usunięto)
- **Width classes:** Zmienione w v4 z rozmiarów koszulkowych na wartości procentowe (`10`–`90` co 10)
- **Customizacja:** GUI dashboard + override zmiennych CSS

### Porównanie tabelaryczne

| Aspekt | SLASHED | ACSS v4 |
|---|---|---|
| **Utility classes** | Brak (intencjonalnie) | Tak, szerokie (choć uproszczone w v4) |
| **Prefix klas** | `sf-` | Brak (`.btn`, `.flex-grid`) |
| **Layout classes** | Tak, dedykowane | Tak, dedykowane |
| **Recipes/Macros** | `.sf-*` klasy CSS | `?*` — przepisy z własną składnią |
| **Override mechanism** | `style="--sf-token: value"` | `style="--token: value"` |
| **Klasy nagłówków** | Nie (używasz tokenów) | Tak (`.text-h1`, `.text-xl`) |

---

## 7. Dark mode

| Aspekt | SLASHED | ACSS v4 |
|---|---|---|
| **Mechanizm** | `light-dark()` na tokenach semantycznych | `light-dark()` na zmiennych kolorów (nowe w v4) |
| **Konfiguracja dark** | `color-scheme: dark` na `:root` lub rodzicu | `color-scheme` property + GUI dark mode values |
| **Duplikaty zmiennych** | Nie — jedna nazwa, dwa konteksty | Nie — v4 usunęło "Alt" variables z v3 |
| **Surfaces w dark** | Automatyczne przez `light-dark()` | Automatyczne przez `light-dark()` |

---

## 8. Breakpointy i responsywność

| Aspekt | SLASHED | ACSS v4 |
|---|---|---|
| **Breakpointy** | Brak wbudowanych — `clamp()` fluid eliminuje potrzebę | v4 jest breakpoint-free (nowe!) — eliminuje preset breakpoints |
| **Fluid sizing** | `clamp()` + `pow()` w CSS | `clamp()` via bridge variables |
| **Fluid layout** | `auto-fill` grids, Switcher (threshold-based) | flex-grid, columns |
| **Gdy potrzebny media query** | Piszesz sam w swoim CSS | GUI konfigurator lub ręcznie |

> Uwaga: ACSS v4 przyjęło breakpoint-free podejście — to znacząca zmiana filozoficzna, zbliżając ACSS v4 do podejścia SLASHED.

---

## 9. Motion / animacje

| Aspekt | SLASHED | ACSS v4 |
|---|---|---|
| **Tokeny tranzycji** | `--sf-transition-fast/normal/slow/slower`, `--sf-ease-*` (5 ease presets) | `--transition` (jeden token) |
| **`@property` dla animacji** | Tak — kolory, rozmiary są animowalne przez typowanie | Nie dokumentowane |
| **prefers-reduced-motion** | Wbudowane (`--sf-motion-safe`) | Tak (wbudowane) |
| **Effects section** | Stany (focus, sr-only) | v4 nowa sekcja Effects: transitions, sticky, selection |

---

## 10. Formy i komponenty UI

| Aspekt | SLASHED | ACSS v4 |
|---|---|---|
| **Tokeny formularzy** | Podstawowe tokeny (`--sf-border-*`, `--sf-radius-*`, `--sf-color-*`) | Pełny system formularzy (refactored w v4 dla third-party form builders) |
| **Komponenty UI** | Brak wbudowanych komponentów | Tokeny i klasy dla buttons, forms, badges |
| **Buttons** | Brak (tokeny dają podstawy) | `?btn` recipe, klasy `.btn` |

---

## 11. Publiczne API — co konfiguruje i używa użytkownik

### SLASHED — co konfigurujesz

```css
/* Kolory źródłowe — kanały OKLCH */
--sf-color-primary-l: 0.55;
--sf-color-primary-c: 0.18;
--sf-color-primary-h: 260;

/* Skala typografii */
--sf-type-scale: 1.25;       /* ratio między krokami */
--sf-type-min:   0.875rem;   /* minimum (mobile) */
--sf-type-max:   1rem;       /* maximum (desktop base) */

/* Skala spacingu */
--sf-space-base:  1rem;
--sf-space-scale: 1.5;

/* Viewporty dla fluid */
--sf-min-viewport: 20rem;
--sf-max-viewport: 90rem;
```

### SLASHED — co używasz w CSS

```css
/* Kolory */
color: var(--sf-color-primary);
background: var(--sf-color-primary-100);
border: 1px solid var(--sf-color-border);

/* Spacing */
gap: var(--sf-space-m);
padding: var(--sf-section-pad);
margin-block: var(--sf-content-gap);

/* Typografia */
font-size: var(--sf-text-xl);
font-weight: var(--sf-font-weight-heading);
line-height: var(--sf-leading-relaxed);

/* Klasy layoutu */
/* <div class="sf-stack"> */
/* <div class="sf-cluster"> */
/* <div class="sf-grid"> */

/* Tokeny override per-element */
/* style="--sf-stack-gap: var(--sf-space-l)" */
```

### ACSS v4 — co konfigurujesz (GUI)

- Kolor Primary, Secondary, Tertiary, Accent, Base, Neutral → ACSS generuje całą paletę
- Base font size + heading scale
- Base spacing + scale + desktop/mobile ratio
- Content width, gutter
- Border radius
- Button styles
- Dark mode values (opcjonalne overrides)
- Semantic colors (Warning, Info, Success, Danger — toggle on/off)

### ACSS v4 — co używasz w HTML/CSS

```css
/* Kolory */
color: var(--primary);
background: var(--primary-light);
border-color: var(--neutral-dark);

/* Spacing */
gap: var(--space-m);
padding: var(--section-space-l);
margin: var(--gutter);

/* Typografia */
font-size: var(--text-xl);
font-size: var(--h2);
font-weight: var(--heading-font-weight);

/* Przezroczystość (v4) */
background: color-mix(in oklch, var(--primary), transparent 30%);
```

```html
<!-- Klasy utility -->
<div class="flex-grid">...</div>
<p class="text-xl">...</p>
<a class="btn bg-primary">...</a>
<div class="bg-primary-light">...</div>
```

---

## 12. Podsumowanie różnic kluczowych

| Kryterium | SLASHED | ACSS v4 |
|---|---|---|
| **Dla kogo** | Każdy projekt CSS — agnostyczny | WordPress (Bricks + Gutenberg) |
| **Konfiguracja** | Edycja CSS / tokenów w kodzie | GUI dashboard w WP |
| **Prefiks zmiennych** | `--sf-` (namespace) | Brak prefiksu (ryzyko kolizji) |
| **Skala kolorów** | 11-stopniowa numeryczna | 7-stopniowa opisowa |
| **Przestrzeń kolorów** | OKLCH | OKLCH |
| **Dark mode** | `light-dark()` w tokenach | `light-dark()` w zmiennych |
| **Fluid bez buildu** | Tak (`clamp()` + `pow()` w CSS) | Tak (bridge variables) |
| **Breakpointy** | Brak (fluid by design) | Brak w v4 (nowa filozofia) |
| **Utility classes** | Brak | Tak (uproszczone w v4) |
| **CSS Layers** | Tak (pełna architektura) | Tak (nowe w v4) |
| **@property typowanie** | Tak | Nie |
| **Recipes** | `.sf-*` klasy + tokeny | `?*` składnia |
| **Backward compat** | Tak | Nie (v4 ≠ v3) |
| **Open source** | Tak | Nie (płatna wtyczka) |

---

## 13. Co ACSS v4 i SLASHED mają wspólnego (zbieżność filozoficzna)

Mimo różnych środowisk, v4 przesunęło ACSS w kierunku filozofii zbliżonej do SLASHED:

1. **OKLCH** — obie używają nowoczesnej przestrzeni kolorów
2. **`light-dark()`** — ten sam mechanizm dark mode bez duplikowania zmiennych
3. **Brak predefiniowanych breakpointów** — fluid-first w obu
4. **CSS Layers** — obie używają `@layer` do zarządzania kaskadą
5. **Variable-first** — ACSS v4 formalnie przyjęło "variable-first + BEM-first" jako filozofię
6. **Usunięcie transparentności tokenów** — obie polegają na `color-mix()` / Relative Color Syntax zamiast predefiniowanych tokenów alpha

> Krótko: ACSS v4 adoptowało wiele wzorców, które SLASHED stosuje od początku — nowoczesne CSS, fluid bez buildu, jeden zestaw zmiennych dla light i dark. Największa różnica to środowisko (WordPress vs agnostyczny) i model konfiguracji (GUI vs CSS).
