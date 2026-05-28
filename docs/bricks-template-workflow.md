# Bricks Template Workflow

Powtarzalny, krok po kroku proces tworzenia i przenoszenia szablonów Bricksa,
które zawsze wyglądają identycznie na każdej stronie z zainstalowaną wtyczką SLASHED.

---

## Dlaczego szablony się psują

Bricks przechowuje wartości kolorów w JSON szablonu na jeden z trzech sposobów:

| Sposób | Jak trafia do szablonu | Przenośność |
|--------|------------------------|-------------|
| `var(--sf-color-primary)` | Wybrany z palety SLASHED w pickerze koloru | ✅ Przenośny — działa na każdej stronie z SLASHED |
| `#4a90e2` | Wpisany ręcznie lub wybrany z kółka kolorów | ❌ Hardkodowany — ignoruje tokeny marki |
| `bricks-color-abc123` | Wybrany z "Global Colors" Bricksa | ❌ ID specyficzne dla strony — na innej stronie daje przezroczystość |

Ten sam problem dotyczy:
- **Odstępów** — `padding: 24px` zamiast `var(--sf-space-6)` się nie skaluje
- **Typografii** — `font-family: "Inter"` zamiast `var(--sf-font-body)` nie reaguje na tokeny
- **Tokenów SLASHED** — wartości z panelu admina (`slashed_bricks_tokens`) nie podróżują razem z plikiem JSON Bricksa

---

## Wymagania wstępne

Na **obu** stronach (źródłowej i docelowej):

- Bricks Builder ≥ 1.9.2
- Wtyczka SLASHED Bricks aktywna
- Wybrany bundle CSS (Essential / Optimal / Full) — ten sam lub wyższy na stronie docelowej
- Czcionki załadowane przez WordPressa lub Bricksa (Google Fonts, własne)

---

## Faza 1 — Projektowanie szablonu (strona źródłowa)

### Zasada #1: Kolory wyłącznie z palet SLASHED

W pickerze koloru Bricksa rozwiń grupy palet. Używaj **wyłącznie** grup:
- `SLASHED · Primary`
- `SLASHED · Secondary`
- `SLASHED · Tertiary`
- `SLASHED · Action`
- `SLASHED · Neutral`
- `SLASHED · Base`
- `SLASHED · Status`
- `SLASHED · Semantic`

**Nigdy** nie używaj:
- Kółka kolorów (wpisuje hex `#rrggbb`)
- Sekcji "Global Colors" Bricksa (zapisuje wewnętrzny ID strony)
- Pola tekstowego koloru z ręcznie wpisaną wartością

> **Jak sprawdzić:** W DevTools zainspektuj element. Kolor powinien wyglądać jak
> `color: var(--sf-color-primary)`, nie `color: #4a90e2`.

### Zasada #2: CSS variables w polach "Custom CSS"

W zakładce CSS elementu Bricksa, w każdym niestandardowym CSS używaj tokenów:

```css
/* ✅ Dobrze */
.moj-element {
  background: var(--sf-color-primary);
  padding: var(--sf-space-4) var(--sf-space-6);
  font-size: var(--sf-text-base);
  font-family: var(--sf-font-body);
  border-radius: var(--sf-radius-md);
  box-shadow: var(--sf-shadow-md);
  transition: all var(--sf-duration-normal) var(--sf-ease-out);
}

/* ❌ Źle */
.moj-element {
  background: #4a90e2;
  padding: 16px 24px;
  font-size: 16px;
  font-family: "Inter", sans-serif;
}
```

### Zasada #3: Klasy sf-* do layoutu

Do układu elementów używaj klas SLASHED zamiast ręcznych wartości Flexbox/Grid:

| Zamiast... | Użyj klasy |
|------------|-----------|
| `display: flex; gap: 16px; flex-wrap: wrap` | `sf-cluster` |
| `display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px` | `sf-grid` |
| `max-width: 1200px; margin: 0 auto` | `sf-center` |
| `display: flex; flex-direction: column; gap: 16px` | `sf-stack` |

Klasy są dostępne w managerze klas Bricksa (kategoria "SLASHED Layout").

### Zasada #4: Nie używaj Bricks Global Colors

Bricks ma własne "Global Colors" (kolor z niestandardową nazwą, np. "Accent Blue").
Te kolory mają wewnętrzne ID specyficzne dla instalacji WordPress.
**Po imporcie szablonu na innej stronie te ID nie istnieją → kolor niewidoczny.**

Zamiast Global Colors Bricksa → użyj SLASHED Color Palette.

---

## Faza 2 — Eksport (strona źródłowa)

### Krok 1: Eksport tokenów SLASHED

1. Otwórz **WordPress Admin → SLASHED → Design Tokens**
2. Przejdź do zakładki **Export / Import**
3. Kliknij **Download token file**
4. Zapisz plik `slashed-tokens-YYYY-MM-DD.json`

Ten plik zawiera wszystkie twoje overrides kolorów, typografii, odstępów itp.

### Krok 2: Eksport szablonu Bricksa

1. W Bricksie otwórz stronę/sekcję którą chcesz eksportować
2. **Bricks → Templates → Export** lub zapisz jako szablon
3. Pobierz plik JSON szablonu

### Krok 3: Spakuj oba pliki razem

Konwencja nazewnictwa:
```
moj-szablon/
  ├── bricks-template-hero.json    # szablon Bricksa
  ├── slashed-tokens-2026-05-28.json  # tokeny SLASHED
  └── README.txt                   # opcjonalnie: opis fontu, bundle itp.
```

---

## Faza 3 — Import (strona docelowa)

### Krok 1: Sprawdź wymagania wstępne

- [ ] Wtyczka SLASHED Bricks zainstalowana i aktywna
- [ ] Bundle CSS: taki sam lub wyższy (Essential ≤ Optimal ≤ Full)
- [ ] Bricks ≥ 1.9.2
- [ ] Czcionki skonfigurowane (Google Fonts, Adobe Fonts, self-hosted)

### Krok 2: Importuj tokeny SLASHED

1. **Admin → SLASHED → Design Tokens → Export / Import**
2. Kliknij "Wybierz plik" i wskaż `slashed-tokens-*.json`
3. Kliknij **Import token file**
4. Poczekaj na potwierdzenie "Imported N section(s) successfully"
5. **Odśwież stronę** — tokeny są teraz aktywne

### Krok 3: Importuj szablon Bricksa

1. **Bricks → Templates → Import**
2. Wskaż plik `bricks-template-*.json`
3. Zaimportuj

### Krok 4: Sprawdź w edytorze Bricksa

Otwórz stronę w edytorze Bricksa. Canvas powinien renderować szablon z poprawnymi kolorami.

---

## Faza 4 — Weryfikacja

### Checklist wizualny

- [ ] Kolory odpowiadają tokenom (Primary, Secondary, itp.)
- [ ] Dark mode przełącza się poprawnie (`data-brx-theme="dark"`)
- [ ] Odstępy/gaps wyglądają proporcjonalnie
- [ ] Czcionki ładują się poprawnie (nie fallback serif/sans-serif)
- [ ] Zaokrąglenia, cienie i animacje działają

### Weryfikacja techniczna (DevTools)

Otwórz Inspector i sprawdź:

```js
// W konsoli przeglądarki, na stronie z szablonem:
getComputedStyle(document.documentElement).getPropertyValue('--sf-color-primary')
// Powinno zwrócić kolor OKLCH, nie pusty string
```

Jeśli wartość jest pusta → SLASHED CSS nie jest załadowany (patrz: Debugowanie).

---

## Debugowanie

### Problem: Kolory są złe / nie zmieniają się

**Causa:** Elementy mają hardkodowane wartości hex zamiast `var()`.

**Diagnoza:** W DevTools → Inspector → Computed Styles szukaj wartości które
wyglądają jak `#rrggbb` lub `rgb(...)` zamiast `var(--sf-color-*)`.

**Rozwiązanie:** Przeprojektuj element wybierając kolor z palety SLASHED,
nie z kółka kolorów.

---

### Problem: Wszystko jest bez koloru / szare

**Causa:** SLASHED CSS bundle nie jest załadowany na stronie.

**Diagnoza:**
```js
// W konsoli:
document.querySelector('link[href*="slashed"]')
// Powinno zwrócić element <link>. null = bundle nie załadowany.
```

**Rozwiązanie:**
1. Sprawdź czy wtyczka SLASHED Bricks jest aktywna
2. Admin → SLASHED → Bundle — sprawdź czy bundle jest ustawiony
3. Sprawdź czy nie ma konfliktu z inną wtyczką blokującą CSS

---

### Problem: Tokeny są domyślne, nie twoje

**Causa:** Plik tokenów nie został zaimportowany lub import się nie powiódł.

**Diagnoza:** Admin → SLASHED → Colors — kolory powinny pokazywać twoje overrides.
Jeśli wszystko jest domyślne (fiolet), plik nie trafił do bazy.

**Rozwiązanie:** Powtórz import tokenów (Faza 3, Krok 2).

---

### Problem: Klasy sf-* nie działają (brak stylowania)

**Causa:** Bundle CSS nie zawiera tych klas (np. użyto Essential zamiast Optimal/Full).

**Diagnoza:**
```js
// Sprawdź czy reguła CSS istnieje:
[...document.styleSheets].flatMap(s => [...s.cssRules]).find(r => r.selectorText?.includes('sf-cluster'))
// undefined = reguła nie istnieje w bundle
```

**Rozwiązanie:** Admin → SLASHED → Bundle → zmień na Optimal lub Full.

---

### Problem: Ciemny tryb nie działa

**Causa:** Bricks używa `data-brx-theme` zamiast `data-theme` (SLASHED).
Wtyczka automatycznie bridguje te dwa atrybuty, ale tylko gdy CSS jest załadowany.

**Weryfikacja:** Sprawdź czy w załadowanym CSS jest reguła:
```css
[data-brx-theme="dark"] { color-scheme: dark; --sf-is-dark: 1 }
```

Jeśli nie ma → sprawdź wersję wtyczki (wymaga ≥ bieżącej).

---

## Skrócony cheatsheet

```
Przed projektowaniem:
  ✅ Kolor → z SLASHED palette group
  ✅ Custom CSS → var(--sf-*)
  ✅ Layout → klasa sf-*
  ❌ Kolor → hex z kółka kolorów
  ❌ Custom CSS → px / hex literal
  ❌ Layout → Global Colors Bricksa

Eksport (z tej strony):
  1. Admin → SLASHED → Export/Import → Download token file
  2. Bricks → Export template

Import (na nową stronę):
  1. Admin → SLASHED → Export/Import → Import token file
  2. Bricks → Import template
  3. Odśwież stronę
  4. Zweryfikuj w edytorze
```
