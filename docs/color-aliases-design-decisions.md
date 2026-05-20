# Decyzje projektowe: Warstwa aliasów kolorystycznych dla SLASHED

## Kontekst i problem

Framework SLASHED posiada trójwarstwową architekturę kolorów:
1. **Source tokens** (`@property`) - 11 par `-light`/`-dark` do themowania
2. **Resolved tokens** - `--sf-color-primary` via `light-dark()` auto-switch
3. **Palette (optional)** - numeryczne odcienie 100-900 + alpha a10-a75

Brakuje warstwy **semantycznych aliasów**, która:
- Daje czytelne, samodokumentujące nazwy (`--sf-color-primary-xdark` zamiast `--sf-color-primary-900`)
- Pozwala na globalne remapowanie jednym nadpisaniem (zmiana `xdark` z 950 na 800 zmienia całą stronę)
- Oddziela intencję od implementacji

---

## Decyzja 1: Rozszerzenie palety numerycznej

**Obecna skala**: 100, 200, 300, 400, 600, 700, 800, 900 (8 kroków, brak 500/50/950)

**Nowa skala**: 50, 100, 200, 300, 400, **500**, 600, 700, 800, 900, 950 (11 kroków)

- `500` = alias do `var(--sf-color-primary)` (base kolor)
- `50` = najjaśniejszy (prawie biały z nutą koloru)
- `950` = najciemniejszy (prawie czarny z nutą koloru)
- Model zgodny z Tailwind (de facto standard w branży)

**Dotyczy**: 6 brand colors (primary, secondary, tertiary, action, neutral, base)

---

## Decyzja 2: Rozszerzenie skali alfa

**Obecna skala**: a10, a20, a30, a50, a75 (5 kroków, niesymetryczna)

**Nowa skala**: a5, a10, a20, a30, a40, a50, a60, a70, a80, a90, a95 (11 kroków)

- Symetryczna z zagęszczeniem na krańcach (a5 i a95)
- Środek co 10pp
- a5 = subtelne tła, hovers
- a95 = prawie opaque, przydatne dla overlays
- Pełne 100% nie jest potrzebne - to jest sam base kolor

**Dotyczy**: 6 brand colors

---

## Decyzja 3: Aliasy semantyczne odcieniowe (6 per brand color)

```
--sf-color-{color}-superlight  → 50
--sf-color-{color}-xlight      → 200
--sf-color-{color}-lighter     → 400
  [base = 500 = --sf-color-{color}]
--sf-color-{color}-darker      → 600
--sf-color-{color}-xdark       → 800
--sf-color-{color}-superdark   → 950
```

**Logika nazewnicza**:
- 3 stopnie po jasnej stronie: `superlight` > `xlight` > `lighter`
- 3 stopnie po ciemnej stronie: `darker` > `xdark` > `superdark`
- Forma comparative (`-er`) = najbliżej base
- Prefix `x-` = dalej od base
- Prefix `super-` = ekstrema
- Symetria jest natychmiast czytelna

**Dlaczego nie `-light`/`-dark`**: zajęte przez source tokens (`--sf-color-primary-light` = wartość dla light mode). Suffix `-er` eliminuje kolizję i jednocześnie sugeruje bliskość do base.

**Dotyczy**: 6 brand colors (primary, secondary, tertiary, action, neutral, base)

---

## Decyzja 4: Aliasy funkcjonalne (per brand color)

```
--sf-color-{color}-hover    → var(--sf-color-{color}-darker)
--sf-color-{color}-active   → var(--sf-color-{color}-xdark)
--sf-color-{color}-subtle   → var(--sf-color-{color}-a10)
--sf-color-{color}-muted    → var(--sf-color-{color}-a30)
--sf-color-{color}-ghost    → var(--sf-color-{color}-a5)
```

- Opisują intencję, nie wygląd
- Wskazują na inne aliasy (nie bezpośrednio na numerykę) - chain of aliases, jedno nadpisanie propaguje
- `hover`/`active` = interakcje
- `subtle`/`muted`/`ghost` = transparentne warianty od ledwo widocznego do delikatnego

---

## Decyzja 5: Kolory statusowe - mini-paleta

Kolory statusowe (success, warning, error, info, danger) **nie potrzebują pełnej skali 50-950**. Dostają mini-paletę 3 aliasów:

```
--sf-color-{status}-subtle   → tło (alpha ~10%)
--sf-color-{status}-muted    → border/soft bg (alpha ~30%)
--sf-color-{status}-strong   → emphasis/tekst (shade ~700)
```

**Uzasadnienie**: kolory statusowe mają wąskie zastosowanie (alerty, badge'e, walidacja). Pełna paleta byłaby overengineering. Te 3 aliasy pokrywają 95% use cases: tło alertu, border alertu, tekst/ikona alertu.

**Uwaga**: core/tokens.css już definiuje `--sf-status-{x}-bg/text/border` - nowe aliasy mogą być albo ich uzupełnieniem, albo zastąpieniem. Do decyzji przy implementacji.

---

## Decyzja 6: Lokalizacja w pliku

Wszystko trafia do istniejącego `optional/tokens.palette.css`:
- Rozszerzona paleta numeryczna (50, 500, 950 dodane)
- Rozszerzona alfa (11 kroków)
- Aliasy semantyczne odcieniowe
- Aliasy funkcjonalne
- Mini-paleta statusowa

Jeden plik, jedna warstwa (`slashed.tokens`), opcjonalny import.

---

## Decyzja 7: Mechanizm remapowania

Aliasy odcieniowe wskazują na paletę numeryczną via `var()`:
```css
--sf-color-primary-xdark: var(--sf-color-primary-800);
```

Aliasy funkcjonalne wskazują na aliasy odcieniowe via `var()`:
```css
--sf-color-primary-hover: var(--sf-color-primary-darker);
```

Użytkownik nadpisuje w swoim CSS:
```css
:root {
  --sf-color-primary-xdark: var(--sf-color-primary-700); /* jaśniejszy xdark */
  --sf-color-primary-hover: var(--sf-color-primary-xdark); /* hover = xdark */
}
```

Jedno nadpisanie propaguje do wszystkich miejsc używających aliasu.

---

## Podsumowanie ilościowe

Per brand color (6 kolorów):
- 11 tokenów numerycznych (50-950)
- 11 tokenów alfa (a5-a95)
- 6 aliasów odcieniowych
- 5 aliasów funkcjonalnych

**Łącznie brand**: 6 x 33 = **198 tokenów**

Per status color (5 kolorów):
- 3 aliasy

**Łącznie status**: 5 x 3 = **15 tokenów**

**Razem**: ~213 tokenów w `tokens.palette.css`

---

## Wzorce z branży użyte jako inspiracja

| System | Co wzięliśmy |
|---|---|
| Automatic.CSS | Koncepcja aliasów remapowanych (`ultra-dark` etc.) |
| Radix Colors | Każdy stopień palety ma zdefiniowany cel użytkowy |
| Tailwind | Skala 50-950, de facto standard numeryczny |
| Material Design 3 | Role-based tokens (functional aliases) |
| W3C Design Tokens spec | Alias token = referencja do innego tokena |

---

## Otwarte pytania do weryfikacji

1. **Czy aliasy funkcjonalne (`hover`, `active`) nie duplikują logiki z `core/tokens.css`?** - Tam są `--sf-color-bg--hover` (generyczne), tu byłyby `--sf-color-primary-hover` (per kolor). Inne scope, ale warto potwierdzić brak konfuzji.
2. **Relacja `--sf-color-{status}-subtle/muted/strong` vs istniejące `--sf-status-{x}-bg/text/border`** - zastępujemy, aliasujemy, czy współistnieją?
3. **Czy `500` alias powinien być literalnie `var(--sf-color-primary)` czy `color-mix(in oklch, var(--sf-color-primary) 100%, transparent)`** - dla spójności z resztą palety (wszystko jest color-mix)?

---

## Sign() discontinuity at L=0.6

The on-color formula in `core/tokens.css` (used by every `--sf-color-text--on-*` alias) is:

```css
clamp(
  var(--sf-on-color-dark),
  sign(var(--sf-on-color-threshold) - l) * 999,
  var(--sf-on-color-light)
) 0 0
```

`sign()` returns one of three values: `-1`, `0`, `+1`. Multiplied by `999` and clamped to `[0.13, 0.97]`, the formula collapses into a binary switch: any background with `L > 0.6` gets dark text (0.13), any background with `L <= 0.6` gets light text (0.97). The transition is a **single-step discontinuity**: a brand color at `L = 0.59` reads white-on-color, the same hue at `L = 0.61` reads dark-on-color. Audit verification used Playwright to walk a brand color across the threshold in `0.01` increments and confirmed the flip happens at the documented point with no smoothing.

This is intentional. Smoothing the transition would require a small range where the on-color text is mid-grey, which fails WCAG contrast on both ends. A clean flip preserves contrast at every L value outside the threshold zone.

**Recommendation for theme authors**: keep brand colors outside the `L 0.58 ... 0.62` band. Colors that sit in that zone are visually ambiguous (neither "definitely light" nor "definitely dark") and a small downstream tweak (a hue rotation, a chroma bump) can flip the on-color side, producing a mode-switch that looks like a bug. Override `--sf-on-color-threshold` if you need to bias the flip point for a non-default palette.

---

## Base palette V-shape lightness curve

`optional/tokens.palette.css` builds the numeric base scale (`--sf-color-base-100` through `--sf-color-base-900`) from `color-mix(in oklch, ...)` between `--sf-color-base` and `--sf-color-text`. The two formula branches are:

- **Tints (100..400, "lighter than base")**: mix `--sf-color-text` into `--sf-color-base` at increasing percentages. In light mode, base is near-white and text is near-black, so adding text **darkens** these steps.
- **Shades (600..900, "darker than base")**: mix `--sf-color-base` into `--sf-color-text` at decreasing percentages. Same colors, opposite roles, so adding base **lightens** these steps.

The result is a **V-shaped luminance curve** rather than a monotonic 100 -> 900 darkening:

| Step | L (light mode) | L (dark mode) |
|------|----------------|---------------|
| 100  | 0.91           | 0.27          |
| 200  | 0.78           | 0.40          |
| 300  | 0.65           | 0.53          |
| 400  | 0.44           | 0.66          |
| 500  | base           | base          |
| 600  | 0.83           | 0.32          |
| 700  | 0.65           | 0.50          |
| 800  | 0.47           | 0.68          |
| 900  | 0.30           | 0.86          |

Notice that the apex of the V (the darkest step in light mode, the lightest step in dark mode) sits at `400` on the tint side and at `900` on the shade side. The two arms of the V are **symmetric across modes**: in dark mode, base is near-dark and text is near-light, so the same formulas auto-invert and produce a mirror-image V.

This is intentional. The trade-off is monotonicity (Material/Tailwind keep `100 -> 900` strictly darker in every mode) for symmetry (SLASHED does not need a parallel `dark-100 ... dark-900` palette; the same tokens flip automatically). Authors who reach for `base-300` expecting "slightly darker than base in every mode" will find that it is darker in light mode and **lighter** in dark mode. The numeric step is a "distance from base" indicator, not an absolute luminance ranking.

**Divergence from convention**: Material 3, Tailwind, Radix, and most other systems give you a monotonic `100..900` ladder. SLASHED diverges deliberately: those systems have separate light- and dark-mode palettes (twice the tokens). SLASHED uses one palette that auto-inverts. If you need a strict monotonic ladder, override the per-step tokens in `optional/tokens.palette.css` directly; the V-shape is a property of the mix formula, not of the tokens themselves.
