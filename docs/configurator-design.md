# SLASHED Configurator — Projekt od zera

> **Punkt wyjścia:** Mamy framework CSS z 686 tokenami (`--sf-*`), dokumentację w `docs/llm-guide.md` oraz dwa wzorce UX:
> - **Automatic.CSS panel** — przejrzysty, wizualny, każda kategoria ma „global controls" na górze + sekcje per-feature
> - **CORE Framework panel** — token-centryczny, grupy wg funkcji, inline preview, eksport jednym kliknięciem
>
> Piszemy projekt UI/UX konfiguratora od zera, nie wiedząc jak wygląda żaden istniejący kod.

---

## 1. Filozofia designu

### 1.1 Główne zasady

**Zasada 1 — Efekt widoczny natychmiast**
Każda zmiana powinna odbić się w podglądzie w < 100 ms. Użytkownik kręci suwakiem i widzi jak cała paleta kolorów, typografia lub odstępy zmieniają się na żywo.

**Zasada 2 — Global first, granular second**
Inspiracja z Automatic.CSS: na górze każdej domeny stoją 2–4 „power knobs" które kontrolują całe podsystemy (skala spacing, mnożnik radiusa, siła cieni). Szczegółowe overrides są schowane poniżej za `<details>`.

**Zasada 3 — Źródło vs. pochodne**
SLASHED rozróżnia tokeny-źródła (`knob`) i tokeny-wyjściowe (`consumption`). Użytkownik edytuje TYLKO źródła — pochodne pokazujemy read-only jako wizualny feedback (ramp kolorów, tabela kroków skali).

**Zasada 4 — Progressywne ujawnianie**
- **Poziom 1 (Basic):** 30 najważniejszych tokenów, widoczne zawsze
- **Poziom 2 (Standard):** Kompletne sekcje per-domena
- **Poziom 3 (Advanced):** Tokeny `PUBLIC-ADVANCED` (fluid engine, palette mix, LumLocker) — za togglem "Pokaż zaawansowane"

**Zasada 5 — Zero straty pracy**
Historia undo/redo (50 kroków), persystencja w localStorage, shareable URL.

---

## 2. Układ interfejsu

### 2.1 Trzy-strefowy desktop (≥ 1100 px)

```
┌──────────────────────────────────────────────────────────────────────┐
│  TOPBAR: Logo · Szukaj (/) · Modyfikowane: N · Undo/Redo · Motyw UI │
├─────────────┬────────────────────────────────────┬───────────────────┤
│             │                                    │                   │
│  NAWIGACJA  │        PANEL EDYCJI               │   PODGLĄD LIVE   │
│  (sidebar)  │        (domenowe studio)           │   (izolowany)    │
│             │                                    │                   │
├─────────────┴────────────────────────────────────┴───────────────────┤
│  SZUFLADA CSS OUTPUT (zwijana, otwiera się klikając "N modyfikowanych")│
└──────────────────────────────────────────────────────────────────────┘
```

**Proporcje:** Nawigacja 220px · Edycja flex · Podgląd 420px (oba resizable).

### 2.2 Responsywność

| Viewport | Zachowanie |
|---|---|
| ≥ 1100 px | Pełny 3-strefowy layout |
| 600–1099 px | Podgląd chowany za przyciskiem (slide-over z prawej); nawigacja → 56px rail z ikonami |
| < 600 px | Rail 44px; szuflada CSS domyślnie zwinięta |

### 2.3 Pięć stref

**Topbar** — Brand + wyszukiwarka globalna (skrót `/`) + licznik modyfikacji (klikalny → otwiera szufladę CSS) + przyciski Undo / Redo + toggle motyw UI (Dark/Light) + Share (URL encoding).

**Nawigacja (sidebar)** — Lista domen z ikonami SVG, labelami i badge'ami (liczba zmodyfikowanych tokenów per domena). Na górze: Home / Overview. Na dole: sekcja Narzędzi (WCAG, Themes, Install, Cheatsheet). Można zwinąć do icon-rail. Skróty `[` / `]` — cyklowanie domen.

**Panel edycji** — Studio per domena (patrz sekcja 3). Zawiera: CategoryHeader z tytułem + licznikiem + przycisk „Reset domeny", Power Knobs, sekcje tematyczne, sekcję Advanced ukrytą za togglem.

**Podgląd live** — Izolowany iframe / scoped div. Selektor viewport: Mobile / Tablet / Desktop / Fluid. Toggle: Light / Dark preview. Toggle: Normal motion / Reduced. Wszystkie overrides aplikowane jako CSS `<style>` w rekordem `<head>`.

**Szuflada CSS output** — Otwiera się od dołu. Widoki: CSS (podświetlony) / Diff (token | default | override). Przyciski: Kopiuj / Pobierz / Import (wklej CSS). Toggle: `@layer slashed.overrides {}` vs. `:root {}`.

---

## 3. Struktura nawigacji

```
● Home (Overview)
─────────────────
  Colors          →  palette icon
  Typography      →  type icon
  Spacing         →  ruler icon
  Layout          →  layout icon
  Borders         →  square icon
  Shadows         →  layers icon
  Motion          →  play icon
  Effects         →  sparkles icon
  Misc            →  puzzle icon
─────────────────
  WCAG            →  contrast icon     [narzędzie]
  Themes          →  swatches icon     [narzędzie]
  Install         →  download icon     [narzędzie]
  Cheatsheet      →  list icon         [narzędzie]
```

---

## 4. Home (Overview)

**Koncepcja:** Strona startowa to check-lista projektanta — krok po kroku przez najważniejsze decyzje designowe. Wzorowane na „Getting Started" flow z CORE framework.

### Zawartość ekranu Home

1. **Nagłówek:** "Customize your design system" + krótki lead
2. **Export banner** (widoczny gdy N > 0): `N tokens modified · Export CSS ↓` — klikalny
3. **Siatka domen 2×4** — każda karta ma: ikonę, nazwę, 1-zdaniowy blurb, status badge
4. **30 Quick-Win Tokens** — check-lista zorganizowana w 6 kroków:

**Krok 1 — Kolory (11 tokenów):**
`--sf-color-primary-source-light`, `--sf-color-secondary-source-light`, `--sf-color-action-source-light`, `--sf-color-base-source-light`, `--sf-color-neutral-source-light`, `--sf-color-tertiary-source-light`, `--sf-color-success-source-light`, `--sf-color-warning-source-light`, `--sf-color-danger-source-light`, `--sf-color-info-source-light`

**Krok 2 — Typografia (5):**
`--sf-font-body`, `--sf-font-heading`, `--sf-font-mono`, `--sf-leading-normal`, `--sf-font-weight-heading`

**Krok 3 — Odstępy (5):**
`--sf-space-scale`, `--sf-section-pad`, `--sf-content-gap`, `--sf-gutter`, `--sf-gap`

**Krok 4 — Layout (3):**
`--sf-container-default`, `--sf-container-prose`, `--sf-header-height-desktop`

**Krok 5 — Kształty (3):**
`--sf-radius-scale`, `--sf-radius-m`, `--sf-border-width-1`

**Krok 6 — Cienie + Ruch (3):**
`--sf-shadow-strength`, `--sf-motion-scale`, `--sf-focus-ring-width`

**Status badge per domena:**
- Narzędziowa: stały label ("presets" / "install")
- Zmodyfikowana: `N modified` (badge accent)
- Pierwsza niezmodyfikowana: `→ start here`
- Pozostałe: `defaults`

---

## 5. COLORS — Studio kolorów

**Układ studia:** W górze „Power Knobs" (2 suwaki globalne), poniżej 8 zakładek poziomych: Brand · Status · Semantic · Gradients · Shade Curve · Contrast · Links · LumLocker.

### Power Knobs (⚡ zawsze widoczne)

| Token | Widget | Zakres | Opis | Drives |
|---|---|---|---|---|
| `--sf-contrast-threshold` | slider | 0–1, krok 0.01 | Próg jasności do doboru tekstu na kolorach | 11 tokenów |
| `--sf-contrast-bias` | slider | −1–1, krok 0.05 | Przesuwa próg w stronę jasnych/ciemnych | 3 tokeny |

### Zakładka: Brand colors

6 wierszy — jeden per kolor: Base / Neutral / Primary / Secondary / Tertiary / Action.

**Każdy wiersz (BrandColorRow):**
```
[Label]  [Swatch ●] [oklch(L C H) input]  →  [Swatch ●] ["auto" badge lub input]
         Light mode value                      Dark mode value (auto-generated lub override)

Shade ramp pod wierszem: ▓▓▓▓▓▓▓ (7 mini-swatchy: superlight → superdark)
```

| Kolor | Token light | Token dark (auto lub override) |
|---|---|---|
| Base | `--sf-color-base-source-light` | `--sf-color-base-source-dark` |
| Neutral | `--sf-color-neutral-source-light` | `--sf-color-neutral-source-dark` |
| Primary | `--sf-color-primary-source-light` | `--sf-color-primary-source-dark` |
| Secondary | `--sf-color-secondary-source-light` | `--sf-color-secondary-source-dark` |
| Tertiary | `--sf-color-tertiary-source-light` | `--sf-color-tertiary-source-dark` |
| Action | `--sf-color-action-source-light` | `--sf-color-action-source-dark` |

**Picker:** Floating OKLCH picker (suwaki L/C/H + canvas + HEX input + EyeDropper API). Auto-dark generowane wg formuły frameworka.

### Zakładka: Status colors

4 wiersze (BrandColorRow): Success · Warning · Info · Danger — identyczna struktura jak Brand.

### Zakładka: Semantic (read-only)

Siatka rozpisanych ról semantycznych z live wartościami i WCAG contrast badge per parę FG/BG. Pokazuje co framework wygenerował z podanych source colors. Nic tu nie jest edytowalne — to feedback.

Tokeny widoczne (consumption): `--sf-color-bg`, `--sf-color-surface`, `--sf-color-raised`, `--sf-color-text`, `--sf-color-text--muted`, `--sf-color-heading`, `--sf-color-border`, `--sf-color-border--subtle`, `--sf-color-bg--hover`, `--sf-color-selection-bg`, `--sf-color-code-bg`, itd.

### Zakładka: Gradients

9 gradientów — każdy z textarea + podgląd prostokąta:

| Token | Opis |
|---|---|
| `--sf-gradient-primary` | Gradient primary |
| `--sf-gradient-secondary` | Gradient secondary |
| `--sf-gradient-tertiary` | Gradient tertiary |
| `--sf-gradient-brand` | Ogólny multi-kolor marki |
| `--sf-gradient-surface` | Subtelny gradient powierzchni |
| `--sf-gradient-fade--t/b/l/r` | Zaniki (4 kierunki) |

### Zakładka: Shade Curve (Advanced)

10 suwaków — procenty mieszania dla kroków palety od superlight do superdark.

| Token | Zakres | Opis |
|---|---|---|
| `--sf-palette-mix-50` | 2–30% | Krok ultra-jasny |
| `--sf-palette-mix-100` | 5–40% | Krok 100 |
| `--sf-palette-mix-200` | 10–55% | Krok 200 |
| `--sf-palette-mix-300` | 20–70% | Krok 300 |
| `--sf-palette-mix-400` | 35–90% | Krok 400 |
| `--sf-palette-mix-600` | 35–90% | Krok 600 |
| `--sf-palette-mix-700` | 20–75% | Krok 700 |
| `--sf-palette-mix-800` | 10–60% | Krok 800 |
| `--sf-palette-mix-900` | 5–45% | Krok 900 |
| `--sf-palette-mix-950` | 2–30% | Krok ultra-ciemny |

Presety nad suwakami: **Default / Softer / Punchy**

### Zakładka: Contrast

| Token | Widget | Zakres | Opis |
|---|---|---|---|
| `--sf-contrast-threshold` | slider | 0–1, 0.01 | Próg L w OKLCH |
| `--sf-contrast-bias` | slider | −1–1, 0.05 | Bias kierunkowy |
| `--sf-focus-ring-width` | length-input | 0–6px | Grubość pierścienia focusa |
| `--sf-focus-ring-offset` | length-input | 0–8px | Offset od elementu |
| `--sf-focus-ring-style` | dropdown | solid/dashed/dotted | Styl |
| `--sf-color-border--focus` | color-picker | — | Kolor pierścienia |

### Zakładka: Links & UI

| Token | Widget | Opis |
|---|---|---|
| `--sf-color-link` | color-picker | Kolor linku |
| `--sf-color-link--hover` | color-picker | Hover |
| `--sf-color-link--visited` | color-picker | Odwiedzony |
| `--sf-link-underline-offset` | length-input (em) | Odstęp podkreślenia |
| `--sf-link-underline-thickness` | length-input | Grubość podkreślenia |
| `--sf-link-external-marker` | text-input | Marker zewnętrzny (domyślnie ↗) |
| `--sf-scrollbar-thumb` | color-picker | Scrollbar thumb |
| `--sf-scrollbar-track` | color-picker | Scrollbar track |
| `--sf-caret-color` | color-picker | Kursor w inputach |
| `--sf-color-selection-bg` | color-picker | Tło zaznaczenia |
| `--sf-color-mark-bg` | color-picker | Tło `<mark>` |
| `--sf-theme-transition-duration` | number-input (ms) | Czas przejścia motywu |

### Zakładka: LumLocker (Advanced)

| Token | Widget | Zakres | Opis |
|---|---|---|---|
| `--sf-lumlocker` | slider | 0–1, 0.01 | Docelowa luminancja wyrównywania |
| `data-lumlocker` | toggle | on/off | Aktywacja mechanizmu |

---

## 6. TYPOGRAPHY — Studio typografii

**Układ studia:** Power Knobs + zakładki: Fonts · Headings · Text (Body) · Scale · Advanced.

### Power Knobs (⚡)

| Token | Widget | Zakres | Opis | Drives |
|---|---|---|---|---|
| `--sf-text-scale` | slider | 0.5–2, 0.05 | Mnożnik całego ramp tekstowego | 9 kroków |
| `--sf-text-display-scale` | slider | 0.5–2, 0.05 | Mnożnik ramp display | 3 kroki |

### Zakładka: Fonts

**Stacks fontów:**

| Token | Widget | Opis |
|---|---|---|
| `--sf-font-body` | font-input | Stack body |
| `--sf-font-heading` | font-input | Stack nagłówków |
| `--sf-font-mono` | font-input | Stack kodu |
| `--sf-font-display` | font-input | Stack display/hero |

**Wagi fontów:**

| Token | Widget | Zakres |
|---|---|---|
| `--sf-font-weight-light` | number-input | 100–900, krok 50 |
| `--sf-font-weight-normal` | number-input | 100–900 |
| `--sf-font-weight-medium` | number-input | 100–900 |
| `--sf-font-weight-semibold` | number-input | 100–900 |
| `--sf-font-weight-bold` | number-input | 100–900 |
| `--sf-font-weight-body` | number-input | 100–900 |
| `--sf-font-weight-heading` | number-input | 100–900 |
| `--sf-font-weight-display` | number-input | 100–900 |
| `--sf-font-weight-strong` | number-input | 100–900 |
| `--sf-font-weight-interactive` | number-input | 100–900 |

**OpenType:**

| Token | Widget | Opis |
|---|---|---|
| `--sf-font-features` | text-input | Cechy OpenType (np. "cv01") |
| `--sf-font-variation` | text-input | Osie variacji (np. "wdth" 85) |
| `--sf-optical-sizing` | toggle | auto / none |
| `--sf-font-numeric` | text-input | Numeryczne ustawienia |

### Zakładka: Headings

**Scope selector:** All · H1 · H2 · H3 · H4 · H5 · H6

Globalne:
| Token | Widget | Opis |
|---|---|---|
| `--sf-heading-text-wrap` | dropdown | balance/pretty/wrap/normal |

Per poziom H1–H6 (każdy identyczny zestaw):
| Token pattern | Widget | Zakres |
|---|---|---|
| `--sf-h{N}-size` | length-input | consumption — read-only |
| `--sf-h{N}-line-height` | number-input | 0.5–3, 0.01 |
| `--sf-h{N}-font-weight` | number-input | 100–900, 50 |
| `--sf-h{N}-letter-spacing` | length-input (em) | −0.1–0.2em |
| `--sf-h{N}-max-width` | length-input | ch/rem |

### Zakładka: Text (Body)

| Token | Widget | Opis |
|---|---|---|
| `--sf-body-font-size` | length-input | Rozmiar body |
| `--sf-body-line-height` | number-input | Wysokość linii |
| `--sf-body-text-wrap` | dropdown | pretty/balance/wrap/normal |
| `--sf-leading-tight` | number-input (0.5–3) | Line-height tight |
| `--sf-leading-snug` | number-input | Line-height snug |
| `--sf-leading-normal` | number-input | Line-height normal |
| `--sf-leading-relaxed` | number-input | Line-height relaxed |
| `--sf-tracking-tight` | length-input (em) | Letter spacing tight |
| `--sf-tracking-normal` | length-input (em) | Normal |
| `--sf-tracking-wide` | length-input (em) | Wide |
| `--sf-tracking-wider` | length-input (em) | Wider |
| `--sf-tracking-widest` | length-input (em) | Widest |
| `--sf-code-font-size` | length-input (em) | Rozmiar inline kodu |
| `--sf-text-m-max-width` | length-input (ch) | Czytelna szerokość linii |

Prose spacing:
| Token | Widget |
|---|---|
| `--sf-prose-paragraph` | length-input |
| `--sf-prose-heading-gap` | length-input |
| `--sf-prose-list-gap` | length-input |
| `--sf-prose-block-margin` | length-input |
| `--sf-prose-media-margin` | length-input |
| `--sf-prose-media-radius` | length-input |
| `--sf-prose-marker-color` | color-picker |
| `--sf-prose-figcaption-size` | length-input (em) |

### Zakładka: Scale (ScaleGenerator)

Silnik płynny — pola wejściowe + tabela podglądu kroków per viewport:

| Token | Widget | Domyślnie | Opis |
|---|---|---|---|
| `--sf-text-base-min` | number-input (rem) | 1 | Baza na mobile |
| `--sf-text-base-max` | number-input (rem) | 1.25 | Baza na desktop |
| `--sf-text-ratio-min` | dropdown (RATIOS) | 1.25 Major Third | Ratio mobile |
| `--sf-text-ratio-max` | dropdown (RATIOS) | 1.333 Perfect Fourth | Ratio desktop |
| `--sf-text-display-base-min` | number-input | 2.4 | Baza display mobile |
| `--sf-text-display-base-max` | number-input | 3 | Baza display desktop |
| `--sf-fluid-min-vw` | number-input (rem) | 22.5 | Min viewport (360px) |
| `--sf-fluid-max-vw` | number-input (rem) | 90 | Max viewport (1440px) |

RATIOS dropdown: Minor Second (1.067) · Major Second (1.125) · Minor Third (1.2) · Major Third (1.25) · Perfect Fourth (1.333) · Augmented Fourth (1.414) · Perfect Fifth (1.5) · Golden Ratio (1.618)

Consumption (read-only): `--sf-text-2xs` · `--sf-text-xs` · `--sf-text-s` · `--sf-text-m` · `--sf-text-l` · `--sf-text-xl` · `--sf-text-2xl` · `--sf-text-3xl` · `--sf-text-4xl` + display-s/m/l

### Zakładka: Advanced (PUBLIC-ADVANCED)

| Token | Widget | Zakres | Opis |
|---|---|---|---|
| `--sf-leading-taper` | slider | 0–0.05, 0.001 | Zwężenie line-height dla dużych rozmiarów |
| `--sf-display-s-line-height` | number-input | 0.5–2 | |
| `--sf-display-m-line-height` | number-input | 0.5–2 | |
| `--sf-display-l-line-height` | number-input | 0.5–2 | |
| `--sf-current-font-weight` | number-input | 100–900 | Waga `.is-current` w nawigacji |

Per-size overrides (9 kroków: 2xs→4xl): line-height, font-weight, letter-spacing, max-width

---

## 7. SPACING — Studio odstępów

**Układ:** Power Knobs + zakładki: Scale · Rhythm · Sections · Components · Advanced.

### Power Knobs (⚡)

| Token | Widget | Zakres | Opis | Drives |
|---|---|---|---|---|
| `--sf-space-scale` | slider | 0.5–2, 0.05 | Mnożnik całego ramp spacingu | ~45 tokenów |
| `--sf-section-scale` | slider | 0.5–2, 0.05 | Mnożnik tylko sekcji | 6 tokenów |

Presety gęstości (Style Preset Row): **Default / Compact / Comfortable / Spacious**

### Zakładka: Scale

| Token | Widget | Domyślnie | Opis |
|---|---|---|---|
| `--sf-space-base-min` | number-input (rem) | 1 | Baza na mobile |
| `--sf-space-base-max` | number-input (rem) | 2 | Baza na desktop |
| `--sf-space-ratio-min` | dropdown (RATIOS) | 1.25 | Ratio mobile |
| `--sf-space-ratio-max` | dropdown (RATIOS) | 1.333 | Ratio desktop |

Consumption (read-only): `--sf-space-2xs` · `--sf-space-xs` · `--sf-space-s` · `--sf-space-m` · `--sf-space-l` · `--sf-space-xl` · `--sf-space-2xl` · `--sf-space-3xl` · `--sf-space-4xl`

### Zakładka: Rhythm

| Token | Widget | Opis |
|---|---|---|
| `--sf-gap` | length-input | Ogólny gap między komponentami |
| `--sf-content-gap` | length-input | Gap między blokami treści |
| `--sf-gutter` | length-input | Poziome marginesy viewportu |
| `--sf-component-pad` | length-input | Wewnętrzny padding komponentów |
| `--sf-flow-space` | length-input | Odstęp w flow layout |
| `--sf-field-block` | length-input | Pionowy margines pola formularza |

### Zakładka: Sections

| Token | Widget | Opis |
|---|---|---|
| `--sf-section-pad` | length-input | Domyślny padding sekcji (alias M) |
| `--sf-section-pad--xs` | length-input | XS |
| `--sf-section-pad--s` | length-input | S |
| `--sf-section-pad--m` | length-input | M |
| `--sf-section-pad--l` | length-input | L |
| `--sf-section-pad--xl` | length-input | XL |
| `--sf-section-pad--2xl` | length-input | 2XL |

### Zakładka: Components

Przyciski i formularze:
| Token | Widget | Opis |
|---|---|---|
| `--sf-button-padding-block` | length-input | Pionowy padding przycisku |
| `--sf-button-padding-inline` | length-input | Poziomy padding przycisku |
| `--sf-field-padding-block` | length-input | Pionowy padding pola |
| `--sf-field-padding-inline` | length-input | Poziomy padding pola |

Rozmiary semantyczne (rem):
`--sf-size-xs` (1.5) · `--sf-size-s` (2) · `--sf-size-m` (2.5) · `--sf-size-l` (2.75) · `--sf-size-xl` (3.5)

Ikony (em):
`--sf-icon-xs` (0.875) · `--sf-icon-s` (1) · `--sf-icon-m` (1.5) · `--sf-icon-l` (2) · `--sf-icon-xl` (3) · `--sf-icon-2xl` (4)

### Zakładka: Advanced (layout primitives)

Gap per layout primitive: `--sf-stack-gap`, `--sf-cluster-gap`, `--sf-grid-gap`, `--sf-sidebar-gap`, `--sf-switcher-gap`, `--sf-reel-gap`, `--sf-bento-gap`, `--sf-equal-gap`, `--sf-alternate-gap`, `--sf-box-padding`

---

## 8. LAYOUT — Studio układu

**Zakładki:** Containers · Grid & Composition · Anchors · Z-index · Primitives · Print

### Zakładka: Containers

Wizualizacja: ContainerBars — poziome paski relative per device.

| Token | Widget | Domyślnie | Opis |
|---|---|---|---|
| `--sf-container-narrow` | length-input | 38rem | Wąski (formularze) |
| `--sf-container-prose` | length-input | 65ch | Czytelna (prose) |
| `--sf-container-default` | length-input | 75rem | Główny (1200px) |
| `--sf-container-wide` | length-input | 90rem | Szeroki marketing (1440px) |
| `--sf-content-width` | length-input | alias default | Content grid |
| `--sf-breakout-width` | length-input | alias wide | Wyłamanie content grid |

### Zakładka: Grid & Composition

| Token | Widget | Domyślnie | Opis |
|---|---|---|---|
| `--sf-grid-min` | length-input | 16rem | Min kolumna grid |
| `--sf-grid-min-xs/s/m/l/xl/2xl` | length-input | — | Warianty |
| `--sf-sidebar-width` | length-input | 18rem | Szerokość sidebar layout |
| `--sf-sidebar-min-width` | length-input | 50% | Min treść w sidebar layout |
| `--sf-switcher-threshold` | length-input | 30rem | Punkt przełączenia Switcher |
| `--sf-bento-cols-default` | number-input (2–12) | 4 | Kolumny Bento |
| `--sf-bento-row-default` | length-input | 10rem | Wiersz Bento |
| `--sf-frame-ratio` | text-input | 16/9 | Ratio Frame |
| `--sf-cluster-align` | dropdown | center/flex-start/flex-end/baseline | |
| `--sf-cluster-justify` | dropdown | flex-start/center/space-between/space-around | |

Aspect ratios:
| Token | Widget | Domyślnie |
|---|---|---|
| `--sf-ratio-square` | text-input | 1 |
| `--sf-ratio-video` | text-input | 16/9 |
| `--sf-ratio-cinema` | text-input | 21/9 |
| `--sf-ratio-4-3` | text-input | 4/3 |
| `--sf-ratio-3-2` | text-input | 3/2 |
| `--sf-ratio-portrait` | text-input | 3/4 |
| `--sf-ratio-golden` | text-input | 1.618/1 |

### Zakładka: Anchors

| Token | Widget | Domyślnie | Opis |
|---|---|---|---|
| `--sf-header-height-mobile` | length-input | 3.5rem | |
| `--sf-header-height-desktop` | length-input | 5rem | |
| `--sf-sticky-offset-mobile` | length-input | alias header-mobile | |
| `--sf-sticky-offset-desktop` | length-input | alias header-desktop | |
| `--sf-touch-target` | length-input (px) | var(--sf-size-l) | WCAG 2.5.5 |

### Zakładka: Z-index

Siatka 10 wartości — każda z number-input i etykietą kontekstu:

`--sf-z-below` (−1) · `--sf-z-base` (0) · `--sf-z-raised` (1) · `--sf-z-sticky` (1000) · `--sf-z-fixed` (1010) · `--sf-z-dropdown` (1020) · `--sf-z-overlay` (1030) · `--sf-z-modal` (1040) · `--sf-z-toast` (1050) · `--sf-z-tooltip` (1060)

### Zakładka: Print

| Token | Widget | Domyślnie |
|---|---|---|
| `--sf-print-page-margin` | length-input | 2cm |
| `--sf-print-page-size` | dropdown | a4 / letter / legal |
| `--sf-print-base-size` | length-input | 11pt |

---

## 9. BORDERS — Studio kształtów

**Układ:** Power Knob (radius-scale z stops) + Style Preset Row + zakładki: Radius · Borders · Dividers · Focus.

### Power Knob (⚡)

| Token | Widget | Zakres | Opis | Drives |
|---|---|---|---|---|
| `--sf-radius-scale` | range-with-stops | 0–2, 0.05 | Mnożnik wszystkich promieni | 8 tokenów |

Stops: 0 (Sharp) · 1 (Default) · 2 (Very Rounded)

Style Preset Row: **Sharp / Subtle / Rounded / Pill**

### Zakładka: Radius

| Token | Widget | Domyślnie |
|---|---|---|
| `--sf-radius-none` | length-input | 0 |
| `--sf-radius-xs` | length-input | 2px |
| `--sf-radius-s` | length-input | 4px |
| `--sf-radius-m` | length-input | 8px |
| `--sf-radius-l` | length-input | 12px |
| `--sf-radius-xl` | length-input | 16px |
| `--sf-radius-2xl` | length-input | 24px |
| `--sf-radius-full` | length-input | 9999px (nieskalowalny) |
| `--sf-field-radius` | length-input | alias m |
| `--sf-button-radius` | length-input | alias m |

### Zakładka: Borders

| Token | Widget | Opis |
|---|---|---|
| `--sf-border-scale` | slider 0–3, 0.05 | Mnożnik szerokości borderów |
| `--sf-border-style` | dropdown | solid/dashed/dotted/double |
| `--sf-border-width-hairline` | length-input | 0.5px |
| `--sf-border-width-1` | length-input | normalny |
| `--sf-border-width-2` | length-input | grubszy |

### Zakładka: Dividers

| Token | Widget |
|---|---|
| `--sf-divider-width` | length-input |
| `--sf-divider-style` | dropdown solid/dashed/dotted |
| `--sf-divider-color` | color-picker |
| `--sf-divider-gap` | length-input |

### Zakładka: Focus ring

| Token | Widget |
|---|---|
| `--sf-focus-ring-width` | length-input (px) |
| `--sf-focus-ring-offset` | length-input (px) |
| `--sf-focus-ring-style` | dropdown |
| `--sf-color-border--focus` | color-picker |

---

## 10. SHADOWS — Studio cieni

**Układ:** Power Knob + Style Preset Row + zakładki: Elevation · Text & Media.

### Power Knob (⚡)

| Token | Widget | Zakres | Opis | Drives |
|---|---|---|---|---|
| `--sf-shadow-strength` | slider | 0–1, 0.01 | Bazowa krycie cieni (encode: `calc(v + var(--sf-is-dark) * 0.17)`) | 14 tokenów |

Style Preset Row: **None / Subtle / Soft / Strong**

### Zakładka: Elevation

| Token | Widget | Opis |
|---|---|---|
| `--sf-shadow-lightness` | slider 0–1, 0.01 | Jasność koloru cienia |
| `--sf-shadow-color` | color-picker | Kolor cienia |
| `--sf-shadow-glow-color` | color-picker | Kolor glow |
| `--sf-shadow-xs` | textarea + mini preview | Cień XS |
| `--sf-shadow-s` | textarea + mini preview | S |
| `--sf-shadow-m` | textarea + mini preview | M |
| `--sf-shadow-l` | textarea + mini preview | L |
| `--sf-shadow-xl` | textarea + mini preview | XL |
| `--sf-shadow-2xl` | textarea + mini preview | 2XL |
| `--sf-shadow-inner` | textarea + mini preview | Wewnętrzny |
| `--sf-shadow-glow` | textarea + mini preview | Glow |

### Zakładka: Text & Media

| Token | Widget |
|---|---|
| `--sf-text-shadow-s` | textarea |
| `--sf-text-shadow-m` | textarea |
| `--sf-text-shadow-l` | textarea |
| `--sf-drop-shadow-s` | textarea |
| `--sf-drop-shadow-m` | textarea |
| `--sf-drop-shadow-l` | textarea |

---

## 11. MOTION — Studio ruchu

**Układ:** Power Knob (motion-scale z stops) + zakładki: Speed · Easing · Transitions · Animations · Scroll.

### Power Knob (⚡)

| Token | Widget | Zakres | Drives |
|---|---|---|---|
| `--sf-motion-scale` | range-with-stops | 0–2, 0.05 | ~13 tokenów |

Stops: 0 (No motion / a11y) · 1 (Default) · 2 (Expressive)

### Zakładka: Speed

| Token | Widget | Domyślnie |
|---|---|---|
| `--sf-duration-instant` | number-input (ms) | 100ms |
| `--sf-duration-fast` | number-input | 150ms |
| `--sf-duration-normal` | number-input | 250ms |
| `--sf-duration-slow` | number-input | 400ms |
| `--sf-duration-slower` | number-input | 600ms |
| `--sf-theme-transition-duration` | number-input | 300ms |

### Zakładka: Easing

8 krzywych — każda z: textarea + cubic-bezier canvas 80×80px + animowana kulka preview.

`--sf-ease-linear` · `--sf-ease-out` · `--sf-ease-in` · `--sf-ease-in-out` · `--sf-ease-spring` · `--sf-ease-elastic` · `--sf-ease-bounce` · `--sf-ease-overshoot`

### Zakładka: Transitions

10 shorthand transitions — textarea per każda:
`--sf-transition-colors`, `--sf-transition-form-field`, `--sf-transition-transform`, `--sf-transition-opacity`, `--sf-transition-shadow`, `--sf-transition-fast`, `--sf-transition-slow`, `--sf-transition-enter`, `--sf-transition-exit`, `--sf-transition-overlay`

### Zakładka: Animations

15 animacji — każda z textarea + live preview (animowana przykładowa karta):
`--sf-animation-fade-in/out`, `--sf-animation-slide-in-up/down/left/right`, `--sf-animation-scale-up/down`, `--sf-animation-ping`, `--sf-animation-blink`, `--sf-animation-float`, `--sf-animation-spin`, `--sf-animation-shimmer`, `--sf-animation-color-pulse`

Delay presets (number-input, ms × scale): `--sf-animation-delay-1` … `--sf-animation-delay-5`

### Zakładka: Scroll

| Token | Widget |
|---|---|
| `--sf-scroll-timeline-range-start` | text-input |
| `--sf-scroll-timeline-range-end` | text-input |
| `--sf-mask-scrim-start` | length-input |
| `--sf-mask-scrim-end` | length-input |

---

## 12. EFFECTS — Studio efektów

**Zakładki:** Glass · Opacity · Scrims · Masks.

### Zakładka: Glass & Blur

| Token | Widget | Zakres |
|---|---|---|
| `--sf-blur` | slider | 0–32px, 0.5 |

### Zakładka: Opacity States

| Token | Widget | Zakres |
|---|---|---|
| `--sf-opacity-disabled` | slider | 0–1, 0.01 |
| `--sf-state-pending-opacity` | slider | 0–1, 0.01 |
| `--sf-opacity-muted` | slider | 0–1, 0.01 |
| `--sf-color-dim` | color-picker | Kolor scrima modala |

### Zakładka: Scrims

| Token | Widget |
|---|---|
| `--sf-scrim-color` | color-picker |
| `--sf-scrim-direction` | dropdown (to top/bottom/left/right/135deg) |
| `--sf-scrim-gradient` | textarea |
| `--sf-scrim-text-shadow` | text-input |

---

## 13. MISC

Tokeny bez domeny — inline lista z filtrami (All / Modified). Brak studia.

| Namespace | Tokeny |
|---|---|
| print | `--sf-print-page-margin`, `--sf-print-page-size`, `--sf-print-base-size` |
| state flags | `--sf-is-dark`, `--sf-current-font-weight` |

---

## 14. Narzędzia (Tools)

### WCAG
- Free pair checker: dropdown FG + dropdown BG → ratio + badge AA/AAA/fail
- Text-on-background matrix: siatka FG × BG z curated tokenami
- Accessible palette generator z lock icons per kolor

### Themes (Galeria presetów)

6 wbudowanych motywów:
| ID | Nazwa | Charakter |
|---|---|---|
| `default` | Framework default | Reset wszystkich overrides |
| `bold` | Bold | Nasycone kolory, większy tekst, mocna elevacja |
| `editorial` | Editorial | Szeroki spacing, serif, wąska prose |
| `soft` | Soft | Niska chroma, duży radius |
| `high-contrast` | High-contrast | Maksymalny kontrast, brak ruchu |
| `brutalist` | Brutalist | Ostre rogi, grube bordery, zera cieni |

Każda karta: emoji + nazwa + blurb + liczba tokenów + Apply.
Apply = atomowy krok historii (Ctrl+Z cofa cały preset).

Saved themes: input "Save current" + karty z Apply/Delete + Import/Export JSON.

### Install (Bundle Picker)

Karty bundli: `core` · `optimal ← Recommended` · `optimal-components` · `full`
Output: HTML `<link>` lub CSS `@import` + override blok CSS.

### Cheatsheet

Przeszukiwalna tabela 686 tokenów — filtr: kategoria, tier, rola (knob/consumption). Każdy wiersz: nazwa + wartość + opis + klik-kopiuj.

---

## 15. Biblioteka widgetów (kontrolek)

### oklch-picker
Floating popup. Suwaki L (0–1) / C (0–0.4) / H (0–360) z gradientem. HEX input round-trip. EyeDropper API. Przechwycenie focusa.

### color-picker
Uproszczony: swatch + text input. Obsługuje HEX / oklch() / rgb() / hsl() / named / var().

### slider
`<input type="range">` + live value label. Wariant encode/decode (shadow-strength).

### range-with-stops
Slider z markerami presetowymi pod nim (radius-scale: 0/1/2; motion-scale: 0/1/2).

### number-input
`<input type="number">` min/max/step. Enter/Tab zatwierdza. Wpisanie spoza zakresu → clamp.

### length-input
Slider + numeric input + dropdown jednostki (px / rem / em / % / ch / vw / vh). Escape-hatch: toggle "raw" dla dowolnej wartości CSS (clamp, min, var).

### font-input
Text input z dropdown podpowiedziami: system stacks + SLASHED built-ins + custom. Live preview typograficzny.

### dropdown / select
Opcja odpowiadająca default oznaczona gwiazdką.

### toggle
Binary switch. Jedno naciśnięcie = jeden krok historii.

### textarea
Multi-line. Przy każdej animacji/przejściu: live preview.

### segmented-control
Radio group. Użycie: filtry (All/Configure/Consume), Heading scope, Output mode.

### cubic-bezier-preview
Canvas 80×80px + animowana kulka. Parse `cubic-bezier(p1x, p1y, p2x, p2y)`.

### style-preset-row
Rząd przycisków (Sharp/Rounded/Pill lub None/Subtle/Soft/Strong). Klik = patchOverrides + krok historii.

### shade-ramp
Rząd 7 swatchy live (superlight → superdark). Wartości mierzone przez probeHost.

### scale-generator
Tabela knobów + podgląd kroków per viewport. Apply zapisuje tylko engine scalars (nie per-step clamp).

### container-bars
Paski wizualne względem siebie per breakpoint.

### contrast-badge
Pill: ratio + AA/AAA/fail. Live via probeHost.

---

## 16. System stanu i danych

### Historia undo/redo
- 50 kroków
- Każda mutacja = 1 krok: setOverride, clearOverride, patchOverrides, applyTheme
- Skróty: Ctrl+Z / Ctrl+Shift+Z (globalne, działają w inputach)

### Persystencja (localStorage)

| Dane | Co trzymamy |
|---|---|
| Overrides | `Record<tokenName, value>` |
| UI state | Aktywna domena, motyw UI, tryb output, bundle |
| Pane widths | Szerokość sidebar + preview |
| Saved themes | Lista `{id, name, overrides}` |
| Fold states | Które sekcje są otwarte |

### Shareable URL
Fragment `#c=<lz-string>` — debounce 400ms, replaceState.

### Izolacja podglądu vs. chrome
- Overrides idą TYLKO do podglądu
- Chrome konfiguratora używa odrębnych aliasów
- `ui.previewTheme` ≠ `ui.uiTheme` — niezależne

---

## 17. Format eksportu CSS

### Tryb Layer (zalecany)
```css
/* SLASHED override tokens — generated by SLASHED Configurator.
   N tokens customised. Load this AFTER the SLASHED stylesheet. */
@layer slashed.overrides {
  :root {
    --sf-color-primary-source-light: oklch(0.55 0.28 264);
    --sf-font-body: "Inter", sans-serif;
    --sf-radius-scale: 1.2;
  }
}
```

### Tryb Root (bez @layer)
```css
:root { /* te same tokeny bez wrappera */ }
```

**Reguły:** Tokeny sortowane alfabetycznie · Wartości przez sanitizeValue() · Tylko aktywne overrides · Engine scalars zamiast per-step clamp.

**Import:** Parser tolerancyjny — rozpoznaje `@layer`, `:root`, komentarze CSS, `calc()`, `oklch(from ...)`, `light-dark()`.

---

## 18. Kluczowe zależności kaskadowe

```
Fluid viewport (--sf-fluid-min-vw, --sf-fluid-max-vw)
  → wszystkie ramp: text-*, space-*, header-height, sticky-offset

Type ramp:
  text-base-min/max + text-ratio-min/max × text-scale
  → --sf-text-2xs … --sf-text-4xl

Space ramp:
  space-base-min/max + space-ratio-min/max × space-scale × section-scale
  → --sf-space-2xs … --sf-space-4xl + section-pad--xs … 2xl

Color cascade (per kolor):
  source-light + source-dark (auto lub override)
  + palette-mix-50 … palette-mix-950 (kształt rampy)
  → superlight … superdark + subtle/muted/ghost (alpha)

Contrast:
  contrast-threshold + contrast-bias
  → text--on-{color} × 10 ról

Shadow:
  shadow-strength (encode) + shadow-lightness + shadow-color
  → shadow-xs … shadow-2xl (14 tokenów)

Radius:
  radius-scale × base-px
  → radius-xs … radius-4xl (8 tokenów, full/pill nieskalowalny)

Motion:
  motion-scale × base-ms
  → duration-instant … duration-slower + animation-delay-1…5
```

---

## 19. Weryfikacja po implementacji

1. **Zmień `--sf-color-primary-source-light`** → shade ramp aktualizuje się natychmiast, semantic role panel pokazuje nowe kolory
2. **Przestaw `--sf-radius-scale` na 0** → cały podgląd przechodzi na ostre kąty; Style Preset Row zaznacza "Sharp"
3. **Przesuń `--sf-motion-scale` na 0** → czas trwania animacji = 0ms w podglądzie
4. **Eksport CSS** → plik zawiera tylko zmodyfikowane tokeny, wartości zaczynają się od `--sf-`
5. **Import CSS** → wklejenie wygenerowanego pliku przywraca stan
6. **Share URL** → skopiuj URL, otwórz w nowej karcie → ta sama konfiguracja
7. **Ctrl+Z × 10** → kolejne kroki historii odwracane; licznik w topbarze spada
8. **Undo preset motywu** → jeden Ctrl+Z cofa cały preset (nie token po tokenie)
