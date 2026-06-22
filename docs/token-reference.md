# SLASHED — Kompletna dokumentacja tokenów

> Wersja frameworku: **0.6.9** · Tokeny łącznie: **693** · Klasy: **232**

---

## Konwencje dokumentu

### Tier (poziom stabilności)

| Oznaczenie | Znaczenie |
|---|---|
| `PUBLIC` | Stabilny, gwarantowany przez SemVer — usunięcie lub zmiana nazwy wymaga major bump |
| `PUBLIC-ADVANCED` | Ta sama gwarancja SemVer, ale token jest zaawansowany/niszowy — mniej eksponowany w dokumentacji |
| `INTERNAL` | Szczegół implementacyjny — może zmienić się bez ostrzeżenia; **nie nadpisuj** |

### Rola tokena

| Oznaczenie | Znaczenie |
|---|---|
| `knob` | **Wejście** — prymityw, który ustawiasz (kolor `oklch(…)`, liczba, font-stack, krzywa). To token, który *zmieniasz* |
| `consumption` | **Wyjście** — wartość pochodna od innych tokenów przez `var()`, `light-dark()`, `oklch(from …)`, `color-mix()`. Używasz go w swoim CSS |

### Edytowalność przez użytkownika

| Oznaczenie | Znaczenie |
|---|---|
| **Bezpośrednia** | Token przeznaczony do nadpisania przez użytkownika — to jego jedyny punkt konfiguracji |
| **Pośrednia** | Token automatycznie zmienia się gdy użytkownik zmienia inne tokeny; można też nadpisać bezpośrednio dla pełnej kontroli |
| **Zaawansowana** | Można nadpisać, ale tylko gdy rozumiemy konsekwencje; zwykłe motywy nie wymagają ingerencji |
| **Nie edytuj** | Token wewnętrzny — framework ustawia go sam; ręczna edycja psuje działanie |

### Użycie w CSS

| Oznaczenie | Znaczenie |
|---|---|
| **BEM użytkownika** | Token używany bezpośrednio przez użytkownika w jego własnych regułach CSS (`.card { box-shadow: var(--sf-shadow-m) }`) |
| **Framework** | Token używany wewnętrznie przez framework w `core/` lub `optional/` |
| **Oba** | Używany zarówno przez framework jak i przez użytkownika |
| **Konfiguracja** | Token jest wejściem do obliczeń — sam nie trafia do `var()` w CSS, ale steruje całą skalą |

---

## 1. Kolory źródłowe marki (Brand Source Colors)

> Plik źródłowy: `core/tokens.css` · Layer: `slashed.tokens` · Opcjonalne: nie

Sześć tokenów marki w formacie `oklch()` to jedyny punkt, który musisz nadpisać, żeby całkowicie przemarkować aplikację. Tryb ciemny wyprowadzany jest **automatycznie** za pomocą relative color syntax — nie musisz ustawiać `*-dark` chyba że chcesz pełnej kontroli.

### 1.1 Kolory marki — źródło jasne (knob)

| Token | Wartość domyślna | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|---|
| `--sf-color-primary-light` | `oklch(0.47 0.27 264)` | Główny kolor marki w trybie jasnym. Od niego wyprowadzane są wszystkie odcienie primary, stany hover/active, tło selekcji i gradienty. Zarejestrowany jako `<color>` — można animować | **Bezpośrednia** | Konfiguracja |
| `--sf-color-secondary-light` | `oklch(0.22 0.04 264)` | Drugi kolor marki — domyślnie ciemny granatowy. Używany np. do nagłówków, akcentów tekstowych | **Bezpośrednia** | Konfiguracja |
| `--sf-color-tertiary-light` | `oklch(0.42 0.22 295)` | Trzeci kolor marki — domyślnie fioletowy. Uzupełnia paletę o trzeci hue | **Bezpośrednia** | Konfiguracja |
| `--sf-color-action-light` | `oklch(0.50 0.22 235)` | Kolor akcji (interakcji) — przyciski CTA, linki, focus ring, karet. Oddzielony od primary żeby umożliwić niezależną konfigurację klikania | **Bezpośrednia** | Konfiguracja |
| `--sf-color-neutral-light` | `oklch(0.52 0.025 260)` | Kolor neutralny — szary z lekkim chromą. Wyprowadza tekst, obramowania, cienie, tła hover | **Bezpośrednia** | Konfiguracja |
| `--sf-color-base-light` | `oklch(0.96 0.006 250)` | Kolor bazowy powierzchni — prawie biały. Wyprowadza `--sf-color-bg`, `--sf-color-inset`, `--sf-color-raised`. Domyślna wartość `0.96` (nie `0.99`) daje rozróżnialne poziomy jasności | **Bezpośrednia** | Konfiguracja |

### 1.2 Kolory marki — źródło ciemne (opcjonalne nadpisanie)

Domyślnie framework **automatycznie oblicza** wartości ciemne za pomocą wzoru `oklch(from var(--sf-color-X-light) clamp(0.65, calc(0.95 - l * 0.5), 0.88) calc(c * 0.9) h)`. Ustaw `*-dark` tylko gdy chcesz pełnej kontroli nad ciemnym wariantem.

| Token | Wartość domyślna (auto) | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|---|
| `--sf-color-primary-dark` | `oklch(0.715 0.243 264)` (auto) | Wartość primary w trybie ciemnym. Zarejestrowany jako `<color>` żeby dziedziczenie działało przez zagnieżdżone `[data-theme]` | **Pośrednia** | Konfiguracja |
| `--sf-color-secondary-dark` | `oklch(0.84 0.036 264)` (auto) | Wartość secondary w ciemnym trybie | **Pośrednia** | Konfiguracja |
| `--sf-color-tertiary-dark` | `oklch(0.74 0.198 295)` (auto) | Wartość tertiary w ciemnym trybie | **Pośrednia** | Konfiguracja |
| `--sf-color-action-dark` | `oklch(0.70 0.198 235)` (auto) | Wartość action w ciemnym trybie | **Pośrednia** | Konfiguracja |
| `--sf-color-neutral-dark` | `oklch(0.69 0.0225 260)` (auto) | Wartość neutral w ciemnym trybie | **Pośrednia** | Konfiguracja |
| `--sf-color-base-dark` | `oklch(0.22 0.003 250)` (auto) | Wartość base w ciemnym trybie — prawie czarna. Formuła jest odwrócona: `clamp(0.16, 1.18 - l, 0.24)` | **Pośrednia** | Konfiguracja |

### 1.3 Kolory statusu — źródło jasne (knob)

| Token | Wartość domyślna | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|---|
| `--sf-color-success-light` | `oklch(0.50 0.16 145)` | Kolor sukcesu (zielony). Wyprowadza `--sf-color-success`, tryplety subtle/muted/strong | **Bezpośrednia** | Konfiguracja |
| `--sf-color-warning-light` | `oklch(0.75 0.17 80)` | Kolor ostrzeżenia (żółty). L=0.75 powoduje że tekst na nim jest ciemny | **Bezpośrednia** | Konfiguracja |
| `--sf-color-error-light` | `oklch(0.50 0.20 25)` | Kolor błędu (czerwony) — walidacja formularzy | **Bezpośrednia** | Konfiguracja |
| `--sf-color-info-light` | `oklch(0.48 0.18 235)` | Kolor informacyjny (niebieski) | **Bezpośrednia** | Konfiguracja |
| `--sf-color-danger-light` | `oklch(0.48 0.22 12)` | Kolor niebezpieczny (czerwień) — akcje destrukcyjne (usuń, skasuj). Oddzielony od `error` celowo | **Bezpośrednia** | Konfiguracja |

Analogiczne tokeny `*-dark` (auto-obliczane, opcjonalne nadpisanie): `--sf-color-success-dark`, `--sf-color-warning-dark`, `--sf-color-error-dark`, `--sf-color-info-dark`, `--sf-color-danger-dark`.

---

## 2. Kolory rozwiązane — marki (Resolved Brand Colors)

> Role: `consumption` · Tier: `PUBLIC`

Tokeny auto-przełączają się między trybem jasnym a ciemnym przez `light-dark()`. Używaj ich w komponentach zamiast `*-light`/`*-dark`. Zarejestrowane jako `<color>` — animowalne.

| Token | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|
| `--sf-color-primary` | Aktywna wartość primary (jasna lub ciemna w zależności od trybu). Główny kolor akcji i akcentów | **Pośrednia** | **Oba** |
| `--sf-color-secondary` | Aktywna wartość secondary | **Pośrednia** | **Oba** |
| `--sf-color-tertiary` | Aktywna wartość tertiary | **Pośrednia** | **Oba** |
| `--sf-color-action` | Aktywna wartość action — używana przez focus ring, karet, linki | **Pośrednia** | **Oba** |
| `--sf-color-neutral` | Aktywna wartość neutral — używana do wyprowadzania tekstu, obramowań, cieni | **Pośrednia** | **Oba** |
| `--sf-color-base` | Aktywna wartość base — używana do wyprowadzania powierzchni | **Pośrednia** | **Oba** |
| `--sf-color-success` | Aktywna wartość success | **Pośrednia** | **Oba** |
| `--sf-color-warning` | Aktywna wartość warning | **Pośrednia** | **Oba** |
| `--sf-color-error` | Aktywna wartość error | **Pośrednia** | **Oba** |
| `--sf-color-info` | Aktywna wartość info | **Pośrednia** | **Oba** |
| `--sf-color-danger` | Aktywna wartość danger | **Pośrednia** | **Oba** |

---

## 3. Kolory tekstu (Text Colors)

> Role: `consumption` · Tier: `PUBLIC`

Wyprowadzane z `--sf-color-neutral` za pomocą relative color syntax. Automatycznie adaptują się do trybu ciemnego.

| Token | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|
| `--sf-color-text` | Główny kolor tekstu body. W jasnym trybie ciemny, w ciemnym jasny. Zależy od `--sf-contrast-bias` | **Pośrednia** | **Oba** |
| `--sf-color-text--muted` | Tekst wyciszony — podpisy, metadane, etykiety pomocnicze | **Pośrednia** | **BEM użytkownika** |
| `--sf-color-text--secondary` | Tekst drugorzędny — między muted a głównym | **Pośrednia** | **BEM użytkownika** |
| `--sf-color-text--placeholder` | Kolor placeholdera w polach formularzy | **Pośrednia** | Framework |
| `--sf-color-text--disabled` | Kolor tekstu w stanie disabled | **Pośrednia** | Framework |
| `--sf-color-text--inverse` | Tekst odwrócony — jasny na ciemnym tle i odwrotnie | **Pośrednia** | **BEM użytkownika** |
| `--sf-color-heading` | Kolor nagłówków `h1`–`h6`. Domyślnie identyczny z `text` | **Pośrednia** | Framework |

### 3.1 Tekst na kolorowych tłach (text-on-color)

Auto-kontrast przez `sign(--sf-contrast-threshold - l) * 999` — automatycznie wybiera biały lub czarny tekst.

| Token | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|
| `--sf-color-text--on-primary` | Tekst na tle `--sf-color-primary` | **Pośrednia** | **Oba** |
| `--sf-color-text--on-secondary` | Tekst na tle `--sf-color-secondary` | **Pośrednia** | **Oba** |
| `--sf-color-text--on-tertiary` | Tekst na tle `--sf-color-tertiary` | **Pośrednia** | **Oba** |
| `--sf-color-text--on-action` | Tekst na tle `--sf-color-action` | **Pośrednia** | **Oba** |
| `--sf-color-text--on-neutral` | Tekst na tle `--sf-color-neutral` | **Pośrednia** | **Oba** |
| `--sf-color-text--on-success` | Tekst na tle `--sf-color-success` | **Pośrednia** | **Oba** |
| `--sf-color-text--on-warning` | Tekst na tle `--sf-color-warning` | **Pośrednia** | **Oba** |
| `--sf-color-text--on-error` | Tekst na tle `--sf-color-error` | **Pośrednia** | **Oba** |
| `--sf-color-text--on-info` | Tekst na tle `--sf-color-info` | **Pośrednia** | **Oba** |
| `--sf-color-text--on-danger` | Tekst na tle `--sf-color-danger` | **Pośrednia** | **Oba** |
| `--sf-color-text--on-inverse` | Tekst na tle `--sf-color-inverse` | **Pośrednia** | **BEM użytkownika** |
| `--sf-color-text--on-base` | Tekst na tle `--sf-color-base` — alias do `--sf-color-text` | **Pośrednia** | **BEM użytkownika** |

---

## 4. Kolory powierzchni (Surface Colors)

> Role: `consumption` · Tier: `PUBLIC`

Wyprowadzane z `--sf-color-base` przez przesunięcia lightness w oklch.

| Token | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|
| `--sf-color-surface` | Alias do `--sf-color-base`. Semantyczny token "aktywnej powierzchni" | **Pośrednia** | **Oba** |
| `--sf-color-bg` | Tło strony — `base + 0.02L`. Nieco jaśniejsze od base | **Pośrednia** | Framework |
| `--sf-color-inset` | Tło wklęsłe — `base - 0.02L`. Pola formularzy, pre, code | **Pośrednia** | Framework |
| `--sf-color-raised` | Tło wyniesione — `base + 0.04L`. Karty na tle bg | **Pośrednia** | **BEM użytkownika** |
| `--sf-color-overlay` | Półprzezroczysty overlay — `base / 0.9`. Szklane nawigacje | **Pośrednia** | **BEM użytkownika** |
| `--sf-color-inverse` | Tło odwrócone — `1 - L`. Pełna inwersja bazy | **Pośrednia** | **BEM użytkownika** |
| `--sf-color-dim` | Scrim modalowy — `oklch(0 0 0 / 0.5)`. Stała wartość, nie zmienia się z trybem | **Pośrednia** | **BEM użytkownika** |
| `--sf-color-white` | Czysta biel `oklch(100% 0 0)` — stała | Nie edytuj | **BEM użytkownika** |
| `--sf-color-black` | Czysta czerń `oklch(0% 0 0)` — stała | Nie edytuj | **BEM użytkownika** |

### 4.1 Tła stanów interakcji

| Token | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|
| `--sf-color-bg--hover` | Tło hover — `neutral / 0.08`. Przezroczysty nakładka | **Pośrednia** | **Oba** |
| `--sf-color-bg--active` | Tło active — `neutral / 0.12`. Ciemniejsze niż hover | **Pośrednia** | **Oba** |
| `--sf-color-bg--selected` | Tło wybranego elementu — `action / 0.10` | **Pośrednia** | **Oba** |
| `--sf-color-bg--focus` | Tło focused — `action / 0.06` | **Pośrednia** | **Oba** |
| `--sf-color-bg--disabled` | Tło disabled — alias do `--sf-color-inset` | **Pośrednia** | Framework |

---

## 5. Kolory obramowań (Border Colors)

> Role: `consumption` · Tier: `PUBLIC`

| Token | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|
| `--sf-color-border` | Standardowe obramowanie — neutralne, auto-adaptuje się do trybu | **Pośrednia** | **Oba** |
| `--sf-color-border--subtle` | Subtelne obramowanie — jaśniejsze/bardziej wyciszone | **Pośrednia** | **Oba** |
| `--sf-color-border--strong` | Mocne obramowanie — ciemniejsze/bardziej kontrastowe | **Pośrednia** | **Oba** |
| `--sf-color-border--focus` | Obramowanie focusu — alias do `--sf-color-action` | **Pośrednia** | Framework |
| `--sf-color-border--disabled` | Obramowanie disabled — `border--subtle / 0.5` | **Pośrednia** | Framework |
| `--sf-color-border--translucent` | Przezroczyste obramowanie — `neutral / 0.15`. Skimmer na zdjęciach | **Pośrednia** | **BEM użytkownika** |

---

## 6. Kolory linków (Link Colors)

> Role: `consumption` · Tier: `PUBLIC`

Wyprowadzane z `--sf-color-action` z clampowaniem lightness dla kontrastu WCAG AA.

| Token | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|
| `--sf-color-link` | Kolor linku (`:link`) — action z clampem na lightness dla WCAG AA | **Pośrednia** | Framework |
| `--sf-color-link--hover` | Kolor linku na hover — ciemniejszy w jasnym, jaśniejszy w ciemnym | **Pośrednia** | Framework |
| `--sf-color-link--active` | Kolor linku podczas kliknięcia | **Pośrednia** | Framework |
| `--sf-color-link--visited` | Kolor linku odwiedzonego — action z przesunięciem hue +60° | **Pośrednia** | Framework |
| `--sf-color-link--disabled` | Kolor linku disabled — alias do `text--disabled` | **Pośrednia** | Framework |
| `--sf-color-link--underline` | Kolor podkreślenia linku — `action / 0.3` (pół-przezroczysty) | **Pośrednia** | Framework |
| `--sf-link-underline-offset` | Odległość podkreślenia od linii bazowej (`0.15em`) | **Bezpośrednia** | Framework |
| `--sf-link-underline-thickness` | Grubość podkreślenia (`auto` = metryki fontu) | **Bezpośrednia** | Framework |

---

## 7. Kolory selekcji, kodu i specjalne

| Token | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|
| `--sf-color-selection-bg` | Tło zaznaczonego tekstu (`::selection`) — `action / 0.28` w jasnym | **Pośrednia** | Framework |
| `--sf-color-selection-text` | Kolor tekstu zaznaczenia — `inherit` (dziedziczy) | **Bezpośrednia** | Framework |
| `--sf-color-mark-bg` | Tło `<mark>` — `warning / 0.25` | **Pośrednia** | Framework |
| `--sf-color-mark-text` | Kolor tekstu `<mark>` — `inherit` | **Bezpośrednia** | Framework |
| `--sf-color-code-bg` | Tło inline `<code>` — alias do `--sf-color-inset` | **Pośrednia** | Framework |
| `--sf-color-code-text` | Tekst inline `<code>` — auto-kontrast z `code-bg` | **Pośrednia** | Framework |
| `--sf-color-code-block-bg` | Tło bloku `<pre>` — scoped override na elemencie | **Bezpośrednia** | Framework |
| `--sf-color-code-block-text` | Tekst bloku `<pre>` — scoped override na elemencie | **Bezpośrednia** | Framework |
| `--sf-color-scheme` | Wartość CSS `color-scheme` (`light dark`) — informuje przeglądarkę | **Zaawansowana** | Framework |

---

## 8. Odcienie semantyczne (Shade Aliases)

> Role: `consumption` · Tier: `PUBLIC` · Dostępne dla 6 rodzin marki (primary, secondary, tertiary, action, neutral, base)

Każda rodzina marki ma pełen zestaw aliasów odcieni wyprowadzanych przez `color-mix(in oklab)`. Automatycznie adaptują się do trybu ciemnego.

### Wzorzec (dla każdej z 6 rodzin: `primary`, `secondary`, `tertiary`, `action`, `neutral`, `base`)

| Sufiks | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|
| `-superlight` | Bardzo jasny odcień — 4% koloru w powierzchni. Subtelne tła sekcji | **Pośrednia** | **BEM użytkownika** |
| `-xlight` | Ekstra jasny — 20% koloru w powierzchni. Tła podświetleń | **Pośrednia** | **BEM użytkownika** |
| `-lighter` | Jasny — 65% koloru w powierzchni. Tła ikon, tagów | **Pośrednia** | **BEM użytkownika** |
| `-darker` | Ciemny — 82% koloru w tekście. Hover na przyciskach | **Pośrednia** | **BEM użytkownika** |
| `-xdark` | Ekstra ciemny — 38% koloru w tekście. Active na przyciskach | **Pośrednia** | **BEM użytkownika** |
| `-superdark` | Bardzo ciemny — 8% koloru w tekście. Najciemniejszy wariant | **Pośrednia** | **BEM użytkownika** |
| `--hover` | Stan hover — alias do `-darker` | **Pośrednia** | **BEM użytkownika** |
| `--active` | Stan active — alias do `-xdark` | **Pośrednia** | **BEM użytkownika** |
| `-subtle` | Pół-przezroczysty — `kolor / 0.10`. Tła subtelne | **Pośrednia** | **BEM użytkownika** |
| `-muted` | Pół-przezroczysty — `kolor / 0.30`. Tła mocniejsze | **Pośrednia** | **BEM użytkownika** |
| `-ghost` | Prawie niewidoczny — `kolor / 0.05`. Najsubtelniejsze tła | **Pośrednia** | **BEM użytkownika** |

Przykładowe tokeny: `--sf-color-primary-superlight`, `--sf-color-action-muted`, `--sf-color-neutral--hover`, `--sf-color-base-xdark`.

---

## 9. Tryplety statusów (Status Triplets)

> Role: `consumption` · Tier: `PUBLIC`

Każdy kolor statusu (success, warning, error, info, danger) ma trzy warianty do kompozycji UI alertów/badges.

| Wzorzec | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|
| `--sf-color-{status}-subtle` | Tło alerty — `kolor / 0.12`. Bardzo jasny wash | **Pośrednia** | **BEM użytkownika** |
| `--sf-color-{status}-muted` | Obramowanie/ikona — `kolor / 0.30` | **Pośrednia** | **BEM użytkownika** |
| `--sf-color-{status}-strong` | Tekst statusu — intensywniejszy niż bazowy status. Adaptuje się do trybu | **Pośrednia** | **BEM użytkownika** |

Przykłady: `--sf-color-error-subtle`, `--sf-color-warning-strong`, `--sf-color-success-muted`.

---

## 10. Gradienty (Gradients)

> Role: `consumption` · Tier: `PUBLIC`

| Token | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|
| `--sf-gradient-primary` | Gradient 135° primary → ciemniejszy primary. Przyciski hero, bannery | **Pośrednia** | **BEM użytkownika** |
| `--sf-gradient-secondary` | Gradient 135° secondary → ciemniejszy secondary | **Pośrednia** | **BEM użytkownika** |
| `--sf-gradient-tertiary` | Gradient 135° tertiary → ciemniejszy tertiary | **Pośrednia** | **BEM użytkownika** |
| `--sf-gradient-brand` | Gradient 135° primary → primary z hue +30°. Multicolor brand gradient | **Pośrednia** | **BEM użytkownika** |
| `--sf-gradient-surface` | Gradient 180° surface → bg. Subtelne przejście poziomów | **Pośrednia** | **BEM użytkownika** |
| `--sf-gradient-fade--r` | Fade do prawej — transparent → bg. Mask overflow w poziomie | **Pośrednia** | **BEM użytkownika** |
| `--sf-gradient-fade--l` | Fade do lewej | **Pośrednia** | **BEM użytkownika** |
| `--sf-gradient-fade--t` | Fade do góry | **Pośrednia** | **BEM użytkownika** |
| `--sf-gradient-fade--b` | Fade do dołu | **Pośrednia** | **BEM użytkownika** |

---

## 11. Cienie (Shadows)

> Role: `consumption` · Tier: `PUBLIC` · Plik: `core/tokens.css`

Wszystkie cienie są tintowane — `--sf-shadow-color` to neutralny o L=0.15. W ciemnym trybie `--sf-shadow-strength` rośnie automatycznie o +0.17.

### 11.1 Box shadow

| Token | Wartość domyślna | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|---|
| `--sf-shadow-none` | `none` | Brak cienia. Reset | **BEM użytkownika** | **BEM użytkownika** |
| `--sf-shadow-xs` | 1 warstwa 1px | Subtelne uniesienie. Chipsów, tagów | **Pośrednia** | **BEM użytkownika** |
| `--sf-shadow-s` | 2 warstwy | Małe karty, dropdowny | **Pośrednia** | **BEM użytkownika** |
| `--sf-shadow-m` | 2 warstwy | Karty, panele. Domyślny do większości komponentów | **Pośrednia** | **BEM użytkownika** |
| `--sf-shadow-l` | 3 warstwy | Duże panele, sidebary | **Pośrednia** | **BEM użytkownika** |
| `--sf-shadow-xl` | 3 warstwy | Modaly, drawer | **Pośrednia** | **BEM użytkownika** |
| `--sf-shadow-2xl` | 3 warstwy | Mega-karty, 3D efekty | **Pośrednia** | **BEM użytkownika** |
| `--sf-shadow-inner` | `inset` | Wklęsłe pola input, tłoczone efekty | **Pośrednia** | **BEM użytkownika** |

### 11.2 Text shadow i drop shadow

| Token | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|
| `--sf-text-shadow-none` | Brak text-shadow | **BEM użytkownika** | **BEM użytkownika** |
| `--sf-text-shadow-s` | Subtelny cień tekstu | **Pośrednia** | **BEM użytkownika** |
| `--sf-text-shadow-m` | Średni cień tekstu | **Pośrednia** | **BEM użytkownika** |
| `--sf-text-shadow-l` | Mocny cień tekstu — tekst na zdjęciach | **Pośrednia** | **BEM użytkownika** |
| `--sf-drop-shadow-s` | `filter: drop-shadow()` S — respektuje alpha kanał (PNG, SVG) | **Pośrednia** | **BEM użytkownika** |
| `--sf-drop-shadow-m` | `filter: drop-shadow()` M | **Pośrednia** | **BEM użytkownika** |
| `--sf-drop-shadow-l` | `filter: drop-shadow()` L | **Pośrednia** | **BEM użytkownika** |
| `--sf-shadow-glow` | Glow — `0 0 15px 2px kolor/opacity`. Świetlisty efekt | **Pośrednia** | **BEM użytkownika** |

### 11.3 Kontrolki cienia (zaawansowane)

| Token | Wartość | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|---|
| `--sf-shadow-strength` | `calc(0.08 + is-dark * 0.17)` | Bazowa nieprzezroczystość cieni. Mnożnik opacity wszystkich cieni. Auto-rośnie w dark mode | **Zaawansowana** | Konfiguracja |
| `--sf-shadow-lightness` | `0.15` | Jasność tinta cienia (`--sf-shadow-color`). 0 = czarny, 1 = biały | **Zaawansowana** | Konfiguracja |
| `--sf-shadow-color` | `oklch(from neutral 0.15 c h)` | Tint cienia — neutralny o L=0.15 | **Zaawansowana** | Konfiguracja |
| `--sf-shadow-glow-color` | `var(--sf-color-primary)` | Kolor glowa — domyślnie primary | **Bezpośrednia** | Konfiguracja |

---

## 12. Typografia — rodziny fontów (Font Families)

> Role: `knob` · Tier: `PUBLIC`

| Token | Wartość domyślna | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|---|
| `--sf-font-body` | `system-ui, -apple-system, sans-serif` | Font body — używany do całego tekstu body | **Bezpośrednia** | **Oba** |
| `--sf-font-heading` | `var(--sf-font-body)` | Font nagłówków. Domyślnie = body | **Bezpośrednia** | Framework |
| `--sf-font-display` | `var(--sf-font-heading)` | Font display/hero — największe nagłówki | **Bezpośrednia** | **BEM użytkownika** |
| `--sf-font-mono` | `ui-monospace, monospace` | Font monospace — kod, terminale | **Bezpośrednia** | Framework |
| `--sf-font-humanist` | Seravek, Gill Sans Nova, Ubuntu… | Gotowy stack humanistyczny (systemowy, zero weight) | **Bezpośrednia** | **BEM użytkownika** |
| `--sf-font-geometric` | Avenir, Montserrat, Corbel… | Gotowy stack geometryczny | **Bezpośrednia** | **BEM użytkownika** |
| `--sf-font-slab` | Rockwell, Rockwell Nova, Roboto Slab… | Gotowy stack slab-serif | **Bezpośrednia** | **BEM użytkownika** |

### 12.1 OpenType / variable font (zaawansowane)

| Token | Wartość | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|---|
| `--sf-font-features` | `normal` | `font-feature-settings` — np. `"cv11", "ss01"`. Nie aplikowane przez framework automatycznie | **Zaawansowana** | **BEM użytkownika** |
| `--sf-font-variation` | `normal` | `font-variation-settings` — np. `"wght" 450`. Nie aplikowane automatycznie | **Zaawansowana** | **BEM użytkownika** |
| `--sf-optical-sizing` | `auto` | `font-optical-sizing`. Lepsza czytelność na małych/dużych rozmiarach | **Zaawansowana** | **BEM użytkownika** |

---

## 13. Typografia — grubości fontów (Font Weights)

> Role: `knob` / `consumption` · Tier: `PUBLIC`

### 13.1 Prymitywne grubości (knob)

| Token | Wartość | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|---|
| `--sf-font-weight-light` | `300` | Lekki — nagłówki display, subtelne etykiety | **Bezpośrednia** | **BEM użytkownika** |
| `--sf-font-weight-normal` | `400` | Normalny — tekst body | **Bezpośrednia** | Konfiguracja |
| `--sf-font-weight-medium` | `500` | Średni — subtelne wyróżnienia | **Bezpośrednia** | Konfiguracja |
| `--sf-font-weight-semibold` | `600` | Półgrubość — nagłówki, etykiety UI | **Bezpośrednia** | Konfiguracja |
| `--sf-font-weight-bold` | `700` | Pogrubiony — strong, ważne elementy | **Bezpośrednia** | Konfiguracja |

### 13.2 Semantyczne role grubości (consumption)

| Token | Wartość domyślna | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|---|
| `--sf-font-weight-body` | `var(--sf-font-weight-normal)` | Grubość tekstu body. Zmień na `300` dla lekkiego body | **Bezpośrednia** | Framework |
| `--sf-font-weight-heading` | `var(--sf-font-weight-semibold)` | Grubość nagłówków h1–h6 | **Bezpośrednia** | Framework |
| `--sf-font-weight-display` | `var(--sf-font-weight-bold)` | Grubość tekstu hero/display | **Bezpośrednia** | **BEM użytkownika** |
| `--sf-font-weight-interactive` | `var(--sf-font-weight-semibold)` | Grubość przycisków, linków nawigacji | **Bezpośrednia** | **BEM użytkownika** |
| `--sf-font-weight-strong` | `var(--sf-font-weight-bold)` | Grubość `<strong>` i elementów wyróżnionych | **Bezpośrednia** | Framework |
| `--sf-current-font-weight` | `var(--sf-font-weight-bold)` | Grubość aktywnego elementu nawigacji (`.is-current`) | **Bezpośrednia** | Framework |

---

## 14. Typografia — rozmiary tekstu (Text Sizes)

> Role: `consumption` · Tier: `PUBLIC`

Rozmiary fluid — generowane z dwustopniowej skali modularnej przez `clamp()`. Automatycznie interpolują między viewport minimalnym a maksymalnym. **Nie edytuj bezpośrednio** — zamiast tego zmień wejście skali.

### 14.1 Skala body

| Token | Zakres domyślny | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|---|
| `--sf-text-2xs` | ~0.51–0.56rem | Najmniejszy tekst — prawne, metadane | **Zaawansowana** | **BEM użytkownika** |
| `--sf-text-xs` | ~0.64–0.70rem | Etykiety pomocnicze, captions | **Zaawansowana** | **BEM użytkownika** |
| `--sf-text-s` | ~0.80–0.94rem | Małe etykiety UI | **Zaawansowana** | **BEM użytkownika** |
| `--sf-text-m` | ~1.00–1.25rem | Bazowy rozmiar body (środek skali) | **Zaawansowana** | **Oba** |
| `--sf-text-l` | ~1.25–1.67rem | Większy tekst — lead paragraphs | **Zaawansowana** | **BEM użytkownika** |
| `--sf-text-xl` | ~1.56–2.22rem | Małe nagłówki sekcji | **Zaawansowana** | **BEM użytkownika** |
| `--sf-text-2xl` | ~1.95–2.96rem | Nagłówki h3 | **Zaawansowana** | **BEM użytkownika** |
| `--sf-text-3xl` | ~2.44–3.95rem | Nagłówki h2 | **Zaawansowana** | **BEM użytkownika** |
| `--sf-text-4xl` | ~3.05–5.27rem | Nagłówki h1 | **Zaawansowana** | **BEM użytkownika** |

### 14.2 Skala display (hero)

| Token | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|
| `--sf-text-display-s` | Najmniejszy display — ~2.4–3rem | **Zaawansowana** | **BEM użytkownika** |
| `--sf-text-display-m` | Średni display | **Zaawansowana** | **BEM użytkownika** |
| `--sf-text-display-l` | Największy display — hero titles | **Zaawansowana** | **BEM użytkownika** |

---

## 15. Typografia — line-height i letter-spacing

> Role: `knob` · Tier: `PUBLIC`

### 15.1 Interlinea (Leading)

| Token | Wartość | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|---|
| `--sf-leading-tight` | `1.1` | Bardzo zwarta — nagłówki display | **Bezpośrednia** | **BEM użytkownika** |
| `--sf-leading-snug` | `1.3` | Zwarta — nagłówki h3–h4 | **Bezpośrednia** | **BEM użytkownika** |
| `--sf-leading-normal` | `1.5` | Normalna — body text | **Bezpośrednia** | **BEM użytkownika** |
| `--sf-leading-relaxed` | `1.625` | Luźna — małe teksty, podpisy | **Bezpośrednia** | **BEM użytkownika** |
| `--sf-leading-taper` | `0` | Stopniowe zwężanie interlinii z rozmiarem tekstu. `0.02` = płynny taper przez skalę | **Zaawansowana** | Konfiguracja |

### 15.2 Interlinea dla rozmiarów display

| Token | Wartość | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|---|
| `--sf-display-s-line-height` | `var(--sf-leading-tight)` | Interlinea display-s | **Bezpośrednia** | **BEM użytkownika** |
| `--sf-display-m-line-height` | `1.05` | Interlinea display-m | **Bezpośrednia** | **BEM użytkownika** |
| `--sf-display-l-line-height` | `1` | Interlinea display-l — prawie `1` dla masywnych nagłówków | **Bezpośrednia** | **BEM użytkownika** |

### 15.3 Tracking (letter-spacing)

| Token | Wartość | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|---|
| `--sf-tracking-tight` | `-0.025em` | Ciasny — duże nagłówki | **Bezpośrednia** | **BEM użytkownika** |
| `--sf-tracking-normal` | `0` | Normalny — body | **Bezpośrednia** | **BEM użytkownika** |
| `--sf-tracking-wide` | `0.025em` | Szeroki — przyciski, etykiety caps | **Bezpośrednia** | **BEM użytkownika** |
| `--sf-tracking-wider` | `0.05em` | Szerszy | **Bezpośrednia** | **BEM użytkownika** |
| `--sf-tracking-widest` | `0.1em` | Najszerszy — capslock etykiety, legal | **Bezpośrednia** | **BEM użytkownika** |
| `--sf-font-numeric` | `tabular-nums` | `font-variant-numeric` — cyfryzacja tabelaryczna. Liczby w kolumnach, ceny, daty | **Bezpośrednia** | **BEM użytkownika** |

---

## 16. Typografia — właściwości per-rozmiar

Każdy rozmiar tekstu (`2xs`–`4xl`) ma 4 sub-tokeny. Są wstępnie skalibrowane, ale można je nadpisać per element.

Wzorzec: `--sf-text-{rozmiar}-{właściwość}` np. `--sf-text-xl-line-height`

| Sufiks | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|
| `-line-height` | Interlinea dopasowana do rozmiaru (mniejsze = relaxed, większe = tight) | **Zaawansowana** | **BEM użytkownika** |
| `-font-weight` | Grubość — małe = body weight, duże = heading weight | **Zaawansowana** | **BEM użytkownika** |
| `-letter-spacing` | Tracking — większe = tight, mniejsze = normal | **Zaawansowana** | **BEM użytkownika** |
| `-max-width` | Maksymalna szerokość linii tekstu w `ch` | **Bezpośrednia** | **BEM użytkownika** |

---

## 17. Typografia — aliasy body, nagłówki, h1–h6

### 17.1 Aliasy body

| Token | Wartość | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|---|
| `--sf-body-font-family` | `var(--sf-font-body)` | Font body — bramka do zmiany przez jeden token | **Bezpośrednia** | Framework |
| `--sf-body-font-size` | `var(--sf-text-m)` | Rozmiar body | **Bezpośrednia** | Framework |
| `--sf-body-font-weight` | `var(--sf-font-weight-body)` | Grubość body | **Bezpośrednia** | Framework |
| `--sf-body-line-height` | `var(--sf-leading-normal)` | Interlinea body | **Bezpośrednia** | Framework |
| `--sf-body-color` | `var(--sf-color-text)` | Kolor tekstu body | **Bezpośrednia** | Framework |
| `--sf-body-text-wrap` | `pretty` | `text-wrap` — lepsza łamliwość ostatniej linii | **Bezpośrednia** | Framework |
| `--sf-body-strong-weight` | `var(--sf-font-weight-strong)` | Grubość `<strong>` | **Bezpośrednia** | Framework |
| `--sf-body-em-style` | `italic` | Styl `<em>` | **Bezpośrednia** | Framework |
| `--sf-code-font-size` | `0.875em` | Rozmiar inline `<code>` — 87.5% kontekstu | **Bezpośrednia** | Framework |

### 17.2 Aliasy heading (globalne)

| Token | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|
| `--sf-heading-font-family` | Font wszystkich nagłówków h1–h6 | **Bezpośrednia** | Framework |
| `--sf-heading-color` | Kolor nagłówków | **Bezpośrednia** | Framework |
| `--sf-heading-text-wrap` | `balance` — wyrównanie nagłówków wieloliniowych | **Bezpośrednia** | Framework |

### 17.3 Tokeny h1–h6

Każde z h1–h6 ma: `-size`, `-line-height`, `-font-weight`, `-letter-spacing`, `-max-width`. Wzorzec: `--sf-h1-size`, `--sf-h2-font-weight`, itd.

| Nagłówek | Domyślny rozmiar | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|---|
| `--sf-h1-*` | `--sf-text-4xl` | Tokeny h1 — największy nagłówek | **Bezpośrednia** | Framework |
| `--sf-h2-*` | `--sf-text-3xl` | Tokeny h2 | **Bezpośrednia** | Framework |
| `--sf-h3-*` | `--sf-text-2xl` | Tokeny h3 | **Bezpośrednia** | Framework |
| `--sf-h4-*` | `--sf-text-xl` | Tokeny h4 | **Bezpośrednia** | Framework |
| `--sf-h5-*` | `--sf-text-l` | Tokeny h5 | **Bezpośrednia** | Framework |
| `--sf-h6-*` | `--sf-text-m` | Tokeny h6 — rozmiar body ale z wide tracking | **Bezpośrednia** | Framework |

---

## 18. Odstępy (Spacing)

> Role: `knob` / `consumption` · Tier: `PUBLIC`

### 18.1 Statyczne

| Token | Wartość | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|---|
| `--sf-space-none` | `0` | Zero — reset paddingów/marginów | Nie edytuj | **BEM użytkownika** |
| `--sf-space-px` | `1px` | Jeden piksel — hairline spacer | Nie edytuj | **BEM użytkownika** |

### 18.2 Fluid (skala generatywna)

Obliczane jak tekst — `clamp()` między vp min a max. `space-m` interpoluje między 1rem a 2rem.

| Token | Zakres przybliżony | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|---|
| `--sf-space-2xs` | ~0.32–0.56rem | Minimalny odstęp — ikony, gaps inline | **Zaawansowana** | **BEM użytkownika** |
| `--sf-space-xs` | ~0.40–0.75rem | Bardzo mały | **Zaawansowana** | **BEM użytkownika** |
| `--sf-space-s` | ~0.50–1.00rem | Mały — tighty gaps, etykiety | **Zaawansowana** | **BEM użytkownika** |
| `--sf-space-m` | ~1.00–2.00rem | Bazowy odstęp — padding komponentów, gap siatek | **Zaawansowana** | **Oba** |
| `--sf-space-l` | ~1.25–2.67rem | Większy — guttery, między sekcjami | **Zaawansowana** | **Oba** |
| `--sf-space-xl` | ~1.56–3.56rem | Duży — padding sekcji, między blokami | **Zaawansowana** | **BEM użytkownika** |
| `--sf-space-2xl` | ~1.95–4.74rem | Większy — sekcje LP | **Zaawansowana** | **BEM użytkownika** |
| `--sf-space-3xl` | ~2.44–6.32rem | Bardzo duży — sekcje hero | **Zaawansowana** | **BEM użytkownika** |
| `--sf-space-4xl` | ~3.05–8.42rem | Maksymalny — strony ekranowe | **Zaawansowana** | **BEM użytkownika** |

### 18.3 Semantyczne hierarchie gaps

| Token | Wartość domyślna | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|---|
| `--sf-gap` | `var(--sf-space-m)` | Luźny gap — między komponentami (cluster, grid, sidebar…). Nadpisanie zmienia wszystkie prymitywy layoutu naraz | **Bezpośrednia** | **Oba** |
| `--sf-content-gap` | `var(--sf-space-s)` | Ciasny gap — wewnątrz treści (stack, flow, prose) | **Bezpośrednia** | **Oba** |
| `--sf-gutter` | `var(--sf-space-l)` | Szeroki gutter — krawędzie strony, kontenery center | **Bezpośrednia** | **Oba** |
| `--sf-component-pad` | `var(--sf-space-m)` | Standardowy padding komponentu — przyciski, karty | **Bezpośrednia** | **Oba** |
| `--sf-field-block` | `var(--sf-space-l)` | Odstęp między polami formularza | **Bezpośrednia** | Framework |
| `--sf-field-required-marker` | `" *"` | Marker wymaganego pola (CSS `content`) | **Bezpośrednia** | Framework |
| `--sf-link-external-marker` | `" ↗"` | Marker linku zewnętrznego w `.sf-link-external` | **Bezpośrednia** | Framework |

### 18.4 Padding sekcji

| Token | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|
| `--sf-section-pad` | Aktywny padding sekcji — alias do `--sf-section-pad--m` | **Bezpośrednia** | **BEM użytkownika** |
| `--sf-section-pad--xs` | `space-xl * section-scale` — najmniejszy padding sekcji | **Zaawansowana** | **BEM użytkownika** |
| `--sf-section-pad--s` | `space-2xl * section-scale` | **Zaawansowana** | **BEM użytkownika** |
| `--sf-section-pad--m` | `space-3xl * section-scale` — domyślny | **Zaawansowana** | **BEM użytkownika** |
| `--sf-section-pad--l` | `space-4xl * section-scale` | **Zaawansowana** | **BEM użytkownika** |
| `--sf-section-pad--xl` | `space-4xl * 1.5 * section-scale` | **Zaawansowana** | **BEM użytkownika** |
| `--sf-section-pad--2xl` | `space-4xl * 2 * section-scale` | **Zaawansowana** | **BEM użytkownika** |

---

## 19. Ikony i rozmiary UI

### 19.1 Ikony (em-based)

> Role: `knob` · Tier: `PUBLIC`

Bazują na `em` — ikona w przycisku automatycznie skaluje się z fontem przycisku.

| Token | Wartość | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|---|
| `--sf-icon-xs` | `0.875em` | Bardzo małe ikony — inline akcesoria | **Bezpośrednia** | **BEM użytkownika** |
| `--sf-icon-s` | `1em` | Małe — w tekście | **Bezpośrednia** | **BEM użytkownika** |
| `--sf-icon-m` | `1.5em` | Standardowe — przyciski, etykiety | **Bezpośrednia** | **BEM użytkownika** |
| `--sf-icon-l` | `2em` | Duże — standalone ikony | **Bezpośrednia** | **BEM użytkownika** |
| `--sf-icon-xl` | `3em` | Bardzo duże — feature icons | **Bezpośrednia** | **BEM użytkownika** |
| `--sf-icon-2xl` | `4em` | Ilustracyjne — dekoracyjne ikony | **Bezpośrednia** | **BEM użytkownika** |

### 19.2 Rozmiary UI (rem-based)

> Role: `knob` · Tier: `PUBLIC`

Stałe rozmiary dla elementów klikanych (przyciski, inputy, awatary).

| Token | Wartość | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|---|
| `--sf-size-xs` | `1.5rem` | 24px — mini przyciski | **Bezpośrednia** | **BEM użytkownika** |
| `--sf-size-s` | `2rem` | 32px — małe przyciski | **Bezpośrednia** | **BEM użytkownika** |
| `--sf-size-m` | `2.5rem` | 40px — standardowe przyciski | **Bezpośrednia** | **BEM użytkownika** |
| `--sf-size-l` | `2.75rem` | 44px — duże przyciski, touch target | **Bezpośrednia** | **BEM użytkownika** |
| `--sf-size-xl` | `3.5rem` | 56px — jumbo przyciski | **Bezpośrednia** | **BEM użytkownika** |

---

## 20. Kontenery i proporcje

### 20.1 Kontenery

> Role: `knob` · Tier: `PUBLIC`

| Token | Wartość | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|---|
| `--sf-container-narrow` | `38rem` | Wąski — formularze, dialogi | **Bezpośrednia** | **BEM użytkownika** |
| `--sf-container-prose` | `65ch` | Prose — optymalna szerokość do czytania (65 znaków) | **Bezpośrednia** | **Oba** |
| `--sf-container-default` | `75rem` | Standardowy — 1200px | **Bezpośrednia** | **Oba** |
| `--sf-container-wide` | `90rem` | Szeroki — 1440px | **Bezpośrednia** | **BEM użytkownika** |
| `--sf-container-full` | `100%` | Pełna szerokość | Nie edytuj | **BEM użytkownika** |

### 20.2 Proporcje (aspect-ratio)

> Role: `knob` · Tier: `PUBLIC`

| Token | Wartość | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|---|
| `--sf-ratio-square` | `1` | Kwadrat | **Bezpośrednia** | **BEM użytkownika** |
| `--sf-ratio-video` | `16 / 9` | Wideo HD | **Bezpośrednia** | **Oba** |
| `--sf-ratio-cinema` | `21 / 9` | Cinemascope | **Bezpośrednia** | **BEM użytkownika** |
| `--sf-ratio-4-3` | `4 / 3` | Klasyczny TV/foto | **Bezpośrednia** | **BEM użytkownika** |
| `--sf-ratio-3-2` | `3 / 2` | Klasyczne zdjęcie | **Bezpośrednia** | **BEM użytkownika** |
| `--sf-ratio-portrait` | `3 / 4` | Portret | **Bezpośrednia** | **BEM użytkownika** |
| `--sf-ratio-golden` | `1.618 / 1` | Złoty podział | **Bezpośrednia** | **BEM użytkownika** |

---

## 21. Obramowania (Borders)

### 21.1 Szerokości

> Role: `knob` · Tier: `PUBLIC`

| Token | Wartość | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|---|
| `--sf-border-width-hairline` | `0.5px` | Hairline — widoczny tylko na Retina (2x DPR+). Na 1x DPR zaokrąglany do 1px | **Bezpośrednia** | **BEM użytkownika** |
| `--sf-border-width-1` | `calc(1px * border-scale)` | Standardowe 1px | **Pośrednia** | **Oba** |
| `--sf-border-width-2` | `calc(2px * border-scale)` | Grubsze 2px | **Pośrednia** | **BEM użytkownika** |
| `--sf-border-width-3` | `calc(3px * border-scale)` | Mocne 3px | **Pośrednia** | **BEM użytkownika** |
| `--sf-border-width-4` | `calc(4px * border-scale)` | Bardzo mocne 4px | **Pośrednia** | **BEM użytkownika** |
| `--sf-border-scale` | `1` | Globalny mnożnik wszystkich szerokości (poza hairline). `0` = borderless design, `2` = heavy borders | **Bezpośrednia** | Konfiguracja |

### 21.2 Styl i skróty

| Token | Wartość | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|---|
| `--sf-border-style` | `solid` | Globalny styl obramowania. Zmień na `dashed` żeby zmienić wszystkie bordery | **Bezpośrednia** | Konfiguracja |
| `--sf-border` | `1px solid --sf-color-border` | Gotowy skrót standardowego obramowania. `border: var(--sf-border)` | **Pośrednia** | **BEM użytkownika** |
| `--sf-border-subtle` | `1px solid --sf-color-border--subtle` | Gotowy skrót subtelnego obramowania | **Pośrednia** | **BEM użytkownika** |
| `--sf-border-strong` | `1px solid --sf-color-border--strong` | Gotowy skrót mocnego obramowania | **Pośrednia** | **BEM użytkownika** |

### 21.3 Separator (Divider)

| Token | Wartość | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|---|
| `--sf-divider-width` | `var(--sf-border-width-1)` | Grubość separatora hr / `.sf-divider` | **Bezpośrednia** | Framework |
| `--sf-divider-style` | `solid` | Styl separatora | **Bezpośrednia** | Framework |
| `--sf-divider-color` | `var(--sf-color-border)` | Kolor separatora | **Bezpośrednia** | Framework |
| `--sf-divider-gap` | `var(--sf-space-m)` | Odstęp wokół separatora | **Bezpośrednia** | Framework |

---

## 22. Promień zaokrąglenia (Border Radius)

> Role: `knob` / `consumption` · Tier: `PUBLIC`

Wszystkie kroki (poza `full`/`pill`) mnożone przez `--sf-radius-scale`.

| Token | Wartość | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|---|
| `--sf-radius-none` | `0` | Zero — ostre rogi | **BEM użytkownika** | **BEM użytkownika** |
| `--sf-radius-2xs` | `calc(1px * scale)` | 1px — prawie ostre | **Zaawansowana** | **BEM użytkownika** |
| `--sf-radius-xs` | `calc(2px * scale)` | 2px — subtelne | **Zaawansowana** | **BEM użytkownika** |
| `--sf-radius-s` | `calc(4px * scale)` | 4px — standardowe UI | **Zaawansowana** | **BEM użytkownika** |
| `--sf-radius-m` | `calc(8px * scale)` | 8px — karty, przyciski | **Zaawansowana** | **BEM użytkownika** |
| `--sf-radius-l` | `calc(12px * scale)` | 12px | **Zaawansowana** | **BEM użytkownika** |
| `--sf-radius-xl` | `calc(16px * scale)` | 16px — panele | **Zaawansowana** | **BEM użytkownika** |
| `--sf-radius-2xl` | `calc(24px * scale)` | 24px | **Zaawansowana** | **BEM użytkownika** |
| `--sf-radius-3xl` | `calc(32px * scale)` | 32px — large cards | **Zaawansowana** | **BEM użytkownika** |
| `--sf-radius-4xl` | `calc(48px * scale)` | 48px | **Zaawansowana** | **BEM użytkownika** |
| `--sf-radius-full` | `9999px` | Okrąg/kapsułka — nie skalowany przez `radius-scale` | Nie edytuj | **BEM użytkownika** |
| `--sf-radius-pill` | `var(--sf-radius-full)` | Semantyczny alias full — używaj do kapsułkowych badge/chipów | **Pośrednia** | **BEM użytkownika** |
| `--sf-radius-outer` | `radius-m + component-pad` | Koncentryczny helper — outer radius kontenera z wewnętrznym elementem padded | **Zaawansowana** | **BEM użytkownika** |
| `--sf-radius-scale` | `1` | Globalny mnożnik skali promieni. `0` = ostre rogi wszędzie, `2` = bardzo zaokrąglone | **Bezpośrednia** | Konfiguracja |

---

## 23. Ruch — czas trwania (Duration)

> Role: `knob` · Tier: `PUBLIC`

Wszystkie multiplied by `--sf-motion-scale` (domyślnie `1`). Zmiana `motion-scale` do `0` wyłącza wszystkie animacje.

| Token | Wartość domyślna | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|---|
| `--sf-duration-none` | `0ms` | Instant — brak czasu | Nie edytuj | **BEM użytkownika** |
| `--sf-duration-instant` | `100ms` | Bardzo szybki — micro-interakcje | **Zaawansowana** | **BEM użytkownika** |
| `--sf-duration-fast` | `150ms` | Szybki — hover states, tooltips | **Zaawansowana** | **BEM użytkownika** |
| `--sf-duration-normal` | `250ms` | Normalny — przyciski, karty | **Zaawansowana** | **BEM użytkownika** |
| `--sf-duration-slow` | `400ms` | Wolny — modal enter, accordion | **Zaawansowana** | **BEM użytkownika** |
| `--sf-duration-slower` | `600ms` | Bardzo wolny — page transitions | **Zaawansowana** | **BEM użytkownika** |
| `--sf-theme-transition-duration` | `300ms` | Czas cross-fade przełączania motywu (`.sf-theme-transition`) | **Bezpośrednia** | Framework |

---

## 24. Ruch — easing

> Role: `knob` · Tier: `PUBLIC`

| Token | Wartość | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|---|
| `--sf-ease-linear` | `linear` | Liniowy — loading bary | **Zaawansowana** | **BEM użytkownika** |
| `--sf-ease-out` | `cubic-bezier(0.25, 0, 0.15, 1)` | Ease-out — elementy wchodzące (natural deceleration) | **Zaawansowana** | **BEM użytkownika** |
| `--sf-ease-in` | `cubic-bezier(0.5, 0, 0.75, 0.25)` | Ease-in — elementy wychodzące | **Zaawansowana** | **BEM użytkownika** |
| `--sf-ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Ease-in-out — przemieszczenia, slidery | **Zaawansowana** | **BEM użytkownika** |
| `--sf-ease-spring` | `linear(0, 0.5, 1.1, 0.95, 1.02, 1)` | Sprężysty — karty, przyciski | **Zaawansowana** | **BEM użytkownika** |
| `--sf-ease-elastic` | `linear(0, 0.3, 1.2, 0.9, 1.05, 1)` | Elastyczny — mocniejszy overshoot | **Zaawansowana** | **BEM użytkownika** |
| `--sf-ease-bounce` | `linear(0, 0.35 18%, 1 32%, 0.86 42%…)` | Odbijający — playful UI | **Zaawansowana** | **BEM użytkownika** |
| `--sf-ease-overshoot` | `linear(0, 0.6 30%, 1.08 55%, 0.98 75%, 1)` | Lekki overshoot — modaly, scale-up | **Zaawansowana** | **BEM użytkownika** |

---

## 25. Ruch — presety tranzycji (Transitions)

> Role: `consumption` · Tier: `PUBLIC`

Gotowe wartości `transition` do użycia bezpośrednio.

| Token | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|
| `--sf-transition-colors` | Tranzycja kolorów — `color, background-color, border-color, fill, stroke` | **Pośrednia** | **BEM użytkownika** |
| `--sf-transition-form-field` | Tranzycja pola formularza — kolory + box-shadow | **Pośrednia** | Framework |
| `--sf-transition-transform` | Tranzycja transformacji | **Pośrednia** | **BEM użytkownika** |
| `--sf-transition-opacity` | Tranzycja opacity | **Pośrednia** | **BEM użytkownika** |
| `--sf-transition-shadow` | Tranzycja cienia | **Pośrednia** | **BEM użytkownika** |
| `--sf-transition-fast` | Szybka multi-property tranzycja | **Pośrednia** | **BEM użytkownika** |
| `--sf-transition-slow` | Wolna multi-property tranzycja | **Pośrednia** | **BEM użytkownika** |
| `--sf-transition-enter` | Tranzycja wejścia — opacity + transform | **Pośrednia** | **BEM użytkownika** |
| `--sf-transition-exit` | Tranzycja wyjścia | **Pośrednia** | **BEM użytkownika** |
| `--sf-transition-overlay` | Tranzycja overlay/scrim | **Pośrednia** | **BEM użytkownika** |

---

## 26. Ruch — presety animacji

> Role: `consumption` · Tier: `PUBLIC`

Gotowe wartości `animation` — skrót keyframe + duration + easing + fill-mode. Użyj bezpośrednio: `animation: var(--sf-animation-fade-in)`.

| Token | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|
| `--sf-animation-fade-in` | Fade-in wejścia — opacity 0→1. Modaly, toasty | **Pośrednia** | **BEM użytkownika** |
| `--sf-animation-fade-out` | Fade-out wyjścia | **Pośrednia** | **BEM użytkownika** |
| `--sf-animation-slide-in-up` | Slide z dołu — bottom sheets, toasty, FAB | **Pośrednia** | **BEM użytkownika** |
| `--sf-animation-slide-in-down` | Slide z góry — dropdowny, top sheets | **Pośrednia** | **BEM użytkownika** |
| `--sf-animation-slide-in-left` | Slide z lewej — lewe drawery | **Pośrednia** | **BEM użytkownika** |
| `--sf-animation-slide-in-right` | Slide z prawej — prawe drawery | **Pośrednia** | **BEM użytkownika** |
| `--sf-animation-scale-up` | Scale-up z małego — modaly, popovery | **Pośrednia** | **BEM użytkownika** |
| `--sf-animation-scale-down` | Scale-down exit | **Pośrednia** | **BEM użytkownika** |
| `--sf-animation-ping` | Ping/ripple loop — notification dots, live indicators | **Pośrednia** | **BEM użytkownika** |
| `--sf-animation-blink` | Blink loop (steps) — kursor tekstowy, critical alerts | **Pośrednia** | **BEM użytkownika** |
| `--sf-animation-float` | Float loop — ilustracje, dekoracyjne elementy hero | **Pośrednia** | **BEM użytkownika** |
| `--sf-animation-spin` | Spin loop — loading spinners | **Pośrednia** | **BEM użytkownika** |
| `--sf-animation-shimmer` | Shimmer sweep — skeleton loaders | **Pośrednia** | **BEM użytkownika** |
| `--sf-animation-color-pulse` | Color pulse loop — live status badges, "recording" | **Pośrednia** | **BEM użytkownika** |

### 26.1 Opóźnienia stagowania (stagger delays)

| Token | Wartość | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|---|
| `--sf-animation-delay-1` | `75ms * motion-scale` | Najkrótszy delay — pierwszy element sekwencji | **Pośrednia** | **BEM użytkownika** |
| `--sf-animation-delay-2` | `150ms * motion-scale` | Drugi step stagowania | **Pośrednia** | **BEM użytkownika** |
| `--sf-animation-delay-3` | `225ms * motion-scale` | Trzeci step | **Pośrednia** | **BEM użytkownika** |
| `--sf-animation-delay-4` | `300ms * motion-scale` | Czwarty step | **Pośrednia** | **BEM użytkownika** |
| `--sf-animation-delay-5` | `375ms * motion-scale` | Najdłuższy — ostatni element sekwencji | **Pośrednia** | **BEM użytkownika** |

---

## 27. Z-index

> Role: `knob` · Tier: `PUBLIC`

Semantyczna drabina — nie magiczne liczby. Zgodna z konwencją Bootstrap/Chakra.

| Token | Wartość | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|---|
| `--sf-z-below` | `-1` | Poniżej — pseudo-elementy tła | **Bezpośrednia** | **BEM użytkownika** |
| `--sf-z-base` | `0` | Bazowy poziom | **Bezpośrednia** | **BEM użytkownika** |
| `--sf-z-raised` | `1` | Lokalnie wyniesiony | **Bezpośrednia** | **BEM użytkownika** |
| `--sf-z-sticky` | `1000` | Sticky headers, sidebary | **Bezpośrednia** | **BEM użytkownika** |
| `--sf-z-fixed` | `1010` | Fixed chrome (navbar, FAB) | **Bezpośrednia** | **BEM użytkownika** |
| `--sf-z-dropdown` | `1020` | Menu rozwijane — ponad sticky+fixed | **Bezpośrednia** | **BEM użytkownika** |
| `--sf-z-overlay` | `1030` | Scrim, non-top-layer backdrops | **Bezpośrednia** | **BEM użytkownika** |
| `--sf-z-modal` | `1040` | Dialogi (fallback dla non-top-layer) | **Bezpośrednia** | **BEM użytkownika** |
| `--sf-z-toast` | `1050` | Toasty — przejściowe powiadomienia | **Bezpośrednia** | **BEM użytkownika** |
| `--sf-z-tooltip` | `1060` | Tooltips — najwyżej | **Bezpośrednia** | **BEM użytkownika** |

> **Uwaga:** Natywne `<dialog>` i `[popover]` renderują się w browser top layer niezależnie od z-index. Tokeny `modal`/`tooltip` są fallbackiem dla własnych implementacji non-top-layer.

---

## 28. Interaktywność

### 28.1 Focus ring

> Role: `knob` / `consumption` · Tier: `PUBLIC`

| Token | Wartość | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|---|
| `--sf-focus-ring-width` | `2px` | Grubość obramowania focusu | **Bezpośrednia** | Framework |
| `--sf-focus-ring-offset` | `2px` | Offset od elementu | **Bezpośrednia** | Framework |
| `--sf-focus-ring-style` | `solid` | Styl linii focusu | **Bezpośrednia** | Framework |
| `--sf-focus-ring-color` | `var(--sf-color-action)` | Kolor focus ring | **Bezpośrednia** | Framework |
| `--sf-focus-ring-shadow` | Złożony box-shadow | Gotowy `box-shadow` do wklejenia — implementuje focus ring przez shadow (nie outline) | **Pośrednia** | **BEM użytkownika** |

### 28.2 Pozostałe stany interakcji

| Token | Wartość | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|---|
| `--sf-caret-color` | `var(--sf-color-action)` | Kolor kareta w polach tekstowych | **Bezpośrednia** | Framework |
| `--sf-touch-target` | `var(--sf-size-l)` | Minimalny rozmiar elementu klikanego (44px = WCAG 2.5.5) | **Bezpośrednia** | Framework |
| `--sf-opacity-disabled` | `0.45` | Opacity elementu disabled | **Bezpośrednia** | Framework |
| `--sf-opacity-muted` | `0.5` | Opacity elementu wyciszonego | **Bezpośrednia** | **BEM użytkownika** |
| `--sf-state-pending-opacity` | `0.7` | Opacity elementu w stanie oczekiwania | **Bezpośrednia** | **BEM użytkownika** |
| `--sf-blur` | `12px` | Domyślny blur dla frosted glass (backdrop-filter) | **Bezpośrednia** | **BEM użytkownika** |
| `--sf-scrollbar-thumb` | `var(--sf-color-neutral)` | Kolor kciuka scrollbara | **Bezpośrednia** | Framework |
| `--sf-scrollbar-track` | `transparent` | Kolor toru scrollbara | **Bezpośrednia** | Framework |
| `--sf-object-fit` | `cover` | Domyślny `object-fit` dla `img` i `video` | **Bezpośrednia** | Framework |
| `--sf-object-position` | `50% 50%` | Domyślna pozycja dla replaced elements | **Bezpośrednia** | **BEM użytkownika** |

---

## 29. Header, sticky, safe area

### 29.1 Header height (fluid)

| Token | Wartość | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|---|
| `--sf-header-height-mobile` | `3.5rem` | Wysokość header na mobile | **Bezpośrednia** | Konfiguracja |
| `--sf-header-height-desktop` | `5rem` | Wysokość header na desktop | **Bezpośrednia** | Konfiguracja |
| `--sf-header-height` | `clamp(mobile, fluid, desktop)` | Płynna wysokość headera — interpoluje między mobile a desktop | **Pośrednia** | **BEM użytkownika** |
| `--sf-sticky-offset-mobile` | `var(--sf-header-height-mobile)` | Offset sticky elementów na mobile | **Pośrednia** | **BEM użytkownika** |
| `--sf-sticky-offset-desktop` | `var(--sf-header-height-desktop)` | Offset sticky elementów na desktop | **Pośrednia** | **BEM użytkownika** |
| `--sf-sticky-offset` | `clamp(...)` | Fluid offset dla `top: var(--sf-sticky-offset)` | **Pośrednia** | **BEM użytkownika** |

### 29.2 Safe area (notch/home indicator)

> Tier: `PUBLIC-ADVANCED`

| Token | Wartość | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|---|
| `--sf-safe-top` | `env(safe-area-inset-top, 0px)` | Wcięcie od góry — notch | Nie edytuj | **BEM użytkownika** |
| `--sf-safe-bottom` | `env(safe-area-inset-bottom, 0px)` | Wcięcie od dołu — home indicator | Nie edytuj | **BEM użytkownika** |
| `--sf-safe-left` | `env(safe-area-inset-left, 0px)` | Wcięcie z lewej | Nie edytuj | **BEM użytkownika** |
| `--sf-safe-right` | `env(safe-area-inset-right, 0px)` | Wcięcie z prawej | Nie edytuj | **BEM użytkownika** |

---

## 30. Druk (Print)

> Tier: `PUBLIC-ADVANCED`

| Token | Wartość | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|---|
| `--sf-print-page-margin` | `2cm` | Marginesy strony drukowanej | **Bezpośrednia** | Framework |
| `--sf-print-page-size` | `a4` | Format papieru (`@page { size }`) | **Bezpośrednia** | Framework |
| `--sf-print-base-size` | `11pt` | Rozmiar bazowy tekstu do druku | **Bezpośrednia** | Framework |

---

## 31. Scroll-driven i maski

> Tier: `PUBLIC-ADVANCED`

| Token | Wartość | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|---|
| `--sf-scroll-timeline-range-start` | `entry 0%` | Start zakresu animacji scroll-driven | **Bezpośrednia** | **BEM użytkownika** |
| `--sf-scroll-timeline-range-end` | `cover 30%` | Koniec zakresu | **Bezpośrednia** | **BEM użytkownika** |
| `--sf-mask-scrim-start` | `var(--sf-space-l)` | Rozmiar maski fade na początku overflow (reel) | **Bezpośrednia** | **BEM użytkownika** |
| `--sf-mask-scrim-end` | `var(--sf-space-l)` | Rozmiar maski fade na końcu | **Bezpośrednia** | **BEM użytkownika** |

---

## 32. Zaawansowane — silnik skali (Fluid Scale Engine)

> Tier: `PUBLIC-ADVANCED` · Zarejestrowane jako `<number>` przez `@property`

Nadpisanie tych tokenów na `:root` przelicza **całą skalę typografii i odstępów** bez budowania — zero buildstep.

| Token | Wartość | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|---|
| `--sf-fluid-min-vw` | `22.5` | Dolna granica viewport (rem) — poniżej tej szerokości skala jest zablokowana na minimum | **Zaawansowana** | Konfiguracja |
| `--sf-fluid-max-vw` | `90` | Górna granica viewport (rem) — powyżej skala jest zablokowana na maximum | **Zaawansowana** | Konfiguracja |
| `--sf-text-ratio-min` | `1.25` | Ratio skali typografii na mobile (minor third) | **Zaawansowana** | Konfiguracja |
| `--sf-text-ratio-max` | `1.333` | Ratio skali typografii na desktop (perfect fourth) | **Zaawansowana** | Konfiguracja |
| `--sf-text-base-min` | `1` | Rozmiar `--sf-text-m` na mobile (rem) | **Zaawansowana** | Konfiguracja |
| `--sf-text-base-max` | `1.25` | Rozmiar `--sf-text-m` na desktop (rem) | **Zaawansowana** | Konfiguracja |
| `--sf-text-display-base-min` | `2.4` | Rozmiar `--sf-text-display-s` na mobile | **Zaawansowana** | Konfiguracja |
| `--sf-text-display-base-max` | `3` | Rozmiar `--sf-text-display-s` na desktop | **Zaawansowana** | Konfiguracja |
| `--sf-space-ratio-min` | `1.25` | Ratio skali odstępów na mobile | **Zaawansowana** | Konfiguracja |
| `--sf-space-ratio-max` | `1.333` | Ratio skali odstępów na desktop | **Zaawansowana** | Konfiguracja |
| `--sf-space-base-min` | `1` | Rozmiar `--sf-space-m` na mobile (rem) | **Zaawansowana** | Konfiguracja |
| `--sf-space-base-max` | `2` | Rozmiar `--sf-space-m` na desktop (rem) — bardziej dramatyczny wzrost niż typografia | **Zaawansowana** | Konfiguracja |

---

## 33. Zaawansowane — globalne mnożniki (Scale Multipliers)

> Tier: `PUBLIC-ADVANCED`

| Token | Wartość | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|---|
| `--sf-space-scale` | `1` | Globalny mnożnik wszystkich fluid odstępów. `0.8` = gęstszy layout | **Zaawansowana** | Konfiguracja |
| `--sf-text-scale` | `1` | Globalny mnożnik skali typografii body | **Zaawansowana** | Konfiguracja |
| `--sf-text-display-scale` | `1` | Globalny mnożnik skali display | **Zaawansowana** | Konfiguracja |
| `--sf-radius-scale` | `1` | Globalny mnożnik promieni. `0` = sharp UI | **Bezpośrednia** | Konfiguracja |
| `--sf-motion-scale` | `1` | Globalny mnożnik czasu animacji. `0` = wyłącz wszystkie animacje | **Bezpośrednia** | Konfiguracja |
| `--sf-section-scale` | `1` | Globalny mnożnik section padding | **Bezpośrednia** | Konfiguracja |
| `--sf-border-scale` | `1` | Globalny mnożnik szerokości obramowań | **Bezpośrednia** | Konfiguracja |

---

## 34. Zaawansowane — kontrast i LumLocker

> Tier: `PUBLIC-ADVANCED`

| Token | Wartość | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|---|
| `--sf-lumlocker` | `0.65` | Współdzielona wartość L (lightness) dla 4 kolorów marki (primary, secondary, tertiary, action) gdy używasz `[data-lumlocker]`. Zapewnia wizualne "równoważenie" kolorów marki | **Zaawansowana** | Framework |
| `--sf-contrast-bias` | `0` | Przesunięcie kontrastu tekstu. Wartości dodatnie = ciemniejszy tekst w jasnym / jaśniejszy w ciemnym. Wpływa na `--sf-color-text`, `--sf-color-text--secondary`, `--sf-color-heading` | **Zaawansowana** | Konfiguracja |
| `--sf-contrast-threshold` | `0.6` | Próg luminancji dla auto-kontrastu `text-on-color`. Kolory L > próg → ciemny tekst; L < próg → jasny tekst | **Zaawansowana** | Konfiguracja |

---

## 35. Flagi stanów (State Flags)

> Tier: `PUBLIC-ADVANCED` · Zarejestrowane jako `<integer>` przez `@property`

Wejścia dla CSS Style Queries. Framework ustawia je przez klasy `.is-*` — ty możesz je czytać w `@container style()`.

| Token | Wartość | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|---|
| `--sf-is-active` | `0` | Flaga stanu aktywnego (np. aktywna zakładka) | **Zaawansowana** | Framework |
| `--sf-is-current` | `0` | Flaga bieżącej strony/elementu nawigacji | **Zaawansowana** | Framework |
| `--sf-is-pressed` | `0` | Flaga stanu wciśniętego (przycisk aria-pressed) | **Zaawansowana** | Framework |
| `--sf-is-open` | `0` | Flaga otwartego elementu (menu, accordion) | **Zaawansowana** | Framework |

---

## 36. Wewnętrzne (Internal)

> Tier: `INTERNAL` — **nie nadpisuj**

| Token | Co robi |
|---|---|
| `--sf-is-dark` | Flaga trybu ciemnego (0 = jasny, 1 = ciemny). Ustawiana wyłącznie przez `core/themes.css` na podstawie `[data-theme]` i `prefers-color-scheme`. Używana w `calc()` do auto-boostu cieni w dark mode |

---

## 37. Tokeny układu (Layout Tokens)

> Plik: `core/tokens.layout.css` · Tier: `PUBLIC` · Kategoria: Layout tokens

Override knobs dla każdego prymitywu layoutu. Zmień lokalnie na elemencie (`style="--sf-cluster-gap: 2rem"`) lub globalnie na `:root`. Każdy domyślnie wskazuje na semantyczny gap token.

### 37.1 Stack

| Token | Wartość domyślna | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|---|
| `--sf-stack-gap` | `var(--sf-content-gap)` | Gap między elementami stacku pionowego | **Bezpośrednia** | Framework |

### 37.2 Box

| Token | Wartość domyślna | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|---|
| `--sf-box-padding` | `var(--sf-space-m)` | Padding kontenera box | **Bezpośrednia** | Framework |
| `--sf-box-border-width` | `0` | Szerokość obramowania box (domyślnie brak) | **Bezpośrednia** | Framework |
| `--sf-box-border-color` | `var(--sf-color-border)` | Kolor obramowania box | **Bezpośrednia** | Framework |

### 37.3 Center

| Token | Wartość domyślna | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|---|
| `--sf-center-max` | `var(--sf-container-default)` | Maksymalna szerokość kontenera center | **Bezpośrednia** | Framework |
| `--sf-center-gutter` | `var(--sf-gutter)` | Minimalne marginesy boczne | **Bezpośrednia** | Framework |

### 37.4 Cluster

| Token | Wartość domyślna | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|---|
| `--sf-cluster-gap` | `var(--sf-gap)` | Gap między elementami klastra | **Bezpośrednia** | Framework |
| `--sf-cluster-align` | `center` | `align-items` klastra | **Bezpośrednia** | Framework |
| `--sf-cluster-justify` | `flex-start` | `justify-content` klastra | **Bezpośrednia** | Framework |

### 37.5 Sidebar

| Token | Wartość domyślna | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|---|
| `--sf-sidebar-gap` | `var(--sf-gap)` | Gap między sidebarem a treścią | **Bezpośrednia** | Framework |
| `--sf-sidebar-width` | `18rem` | Szerokość panelu sidebar | **Bezpośrednia** | Framework |
| `--sf-sidebar-min-width` | `50%` | Minimalna szerokość kolumny treści | **Bezpośrednia** | Framework |

### 37.6 Switcher

| Token | Wartość domyślna | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|---|
| `--sf-switcher-gap` | `var(--sf-gap)` | Gap w switcherze | **Bezpośrednia** | Framework |
| `--sf-switcher-threshold` | `30rem` | Szerokość przy której switcher zmienia z row na column | **Bezpośrednia** | Framework |

### 37.7 Grid (auto-fill)

| Token | Wartość domyślna | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|---|
| `--sf-grid-gap` | `var(--sf-gap)` | Gap siatki | **Bezpośrednia** | Framework |
| `--sf-grid-min` | `16rem` | Minimalna szerokość kolumny domyślna | **Bezpośrednia** | Framework |
| `--sf-grid-min-xs` | `10rem` | Minimalna szerokość kolumny XS preset | **Bezpośrednia** | Framework |
| `--sf-grid-min-s` | `13rem` | Min S preset | **Bezpośrednia** | Framework |
| `--sf-grid-min-m` | `16rem` | Min M preset | **Bezpośrednia** | Framework |
| `--sf-grid-min-l` | `20rem` | Min L preset | **Bezpośrednia** | Framework |
| `--sf-grid-min-xl` | `24rem` | Min XL preset | **Bezpośrednia** | Framework |
| `--sf-grid-min-2xl` | `28rem` | Min 2XL preset | **Bezpośrednia** | Framework |

### 37.8 Equal columns

| Token | Wartość domyślna | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|---|
| `--sf-equal-gap` | `var(--sf-gap)` | Gap równych kolumn | **Bezpośrednia** | Framework |
| `--sf-equal-min-col` | `16rem` | Min szerokość kolumny — dowolna liczba kolumn | **Bezpośrednia** | Framework |
| `--sf-equal-min-col-2` | `28rem` | Min dla 2 kolumn | **Bezpośrednia** | Framework |
| `--sf-equal-min-col-3` | `15rem` | Min dla 3 kolumn | **Bezpośrednia** | Framework |
| `--sf-equal-min-col-4` | `16rem` | Min dla 4 kolumn | **Bezpośrednia** | Framework |
| `--sf-equal-min-col-6` | `10rem` | Min dla 6 kolumn | **Bezpośrednia** | Framework |

### 37.9 Cover

| Token | Wartość domyślna | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|---|
| `--sf-cover-min-height` | `100dvh` | Minimalna wysokość cover (full screen) | **Bezpośrednia** | Framework |
| `--sf-cover-padding` | `var(--sf-section-pad)` | Padding wewnętrzny | **Bezpośrednia** | Framework |

### 37.10 Frame

| Token | Wartość domyślna | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|---|
| `--sf-frame-ratio` | `16 / 9` | Proporcja ramy (aspect-ratio) | **Bezpośrednia** | Framework |

### 37.11 Icon box

| Token | Wartość domyślna | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|---|
| `--sf-icon-box-pad` | `0.5em` | Padding boxed ikony | **Bezpośrednia** | Framework |
| `--sf-icon-box-radius` | `var(--sf-radius-s)` | Radius boxed ikony | **Bezpośrednia** | Framework |
| `--sf-icon-box-bg` | `var(--sf-color-inset)` | Tło boxed ikony | **Bezpośrednia** | Framework |
| `--sf-icon-box-border` | `1px solid --sf-color-border` | Obramowanie boxed ikony | **Bezpośrednia** | Framework |

### 37.12 Reel

| Token | Wartość domyślna | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|---|
| `--sf-reel-item-width` | `max-content` | Szerokość elementu reel | **Bezpośrednia** | Framework |
| `--sf-reel-gap` | `var(--sf-gap)` | Gap między elementami | **Bezpośrednia** | Framework |
| `--sf-reel-height` | `auto` | Wysokość reel | **Bezpośrednia** | Framework |

### 37.13 Imposter

| Token | Wartość domyślna | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|---|
| `--sf-imposter-margin` | `var(--sf-space-m)` | Minimalny margines od krawędzi viewportu dla pozycjonowanego overlay | **Bezpośrednia** | Framework |

### 37.14 Bento grid

| Token | Wartość domyślna | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|---|
| `--sf-bento-cols-default` | `4` | Domyślna liczba kolumn bento | **Bezpośrednia** | Framework |
| `--sf-bento-gap` | `var(--sf-gap)` | Gap siatki bento | **Bezpośrednia** | Framework |
| `--sf-bento-row-default` | `10rem` | Domyślna wysokość rzędu | **Bezpośrednia** | Framework |
| `--sf-bento-row-compact` | `6rem` | Kompaktowa wysokość rzędu | **Bezpośrednia** | Framework |
| `--sf-bento-row-tall` | `16rem` | Wysoka wysokość rzędu | **Bezpośrednia** | Framework |

### 37.15 Content grid (breakout)

| Token | Wartość domyślna | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|---|
| `--sf-content-width` | `var(--sf-container-default)` | Szerokość głównej kolumny treści | **Bezpośrednia** | Framework |
| `--sf-breakout-width` | `var(--sf-container-wide)` | Szerokość elementów breakout | **Bezpośrednia** | Framework |

### 37.16 Prose i Alternate

| Token | Wartość domyślna | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|---|
| `--sf-prose-paragraph` | `var(--sf-content-gap)` | Odstęp między paragrafami prose | **Bezpośrednia** | Framework |
| `--sf-alternate-gap` | `var(--sf-content-gap)` | Gap między elementami zigzag alternate | **Bezpośrednia** | Framework |
| `--sf-alternate-inner-gap` | `var(--sf-gap)` | Gap między treścią a media w każdym elemencie zigzag | **Bezpośrednia** | Framework |

---

## 38. Tokeny makr (Macro Tokens)

> Plik: `core/tokens.macros.css` · Tier: `PUBLIC`

Override knobs dla klas-recept (macros). Zmień per-element przez inline style.

| Token | Wartość domyślna | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|---|
| `--sf-flow-space` | `var(--sf-content-gap)` | Odstęp w `.sf-flow` (lobotomized owl `* + *`) | **Bezpośrednia** | Framework |
| `--sf-line-clamp` | `3` | Liczba linii w `.sf-line-clamp-N` (dynamic variant) | **Bezpośrednia** | **BEM użytkownika** |
| `--sf-aspect` | `16 / 9` | Proporcja `.sf-aspect` (generyczny kontener ratio) | **Bezpośrednia** | Framework |
| `--sf-surface-color` | `var(--sf-color-base)` | Kolor wejściowy dla `.sf-surface` — framework wyprowadza z niego bg + auto-kontrast | **Bezpośrednia** | Framework |
| `--sf-scroll-shadow-size` | `2rem` | Rozmiar fade maski `.sf-scroll-shadow` i `.sf-overflow-fade` | **Bezpośrednia** | Framework |
| `--sf-content-intrinsic-size` | `500px` | `contain-intrinsic-size` dla `.sf-content-auto` — placeholder wysokości przed renderem | **Bezpośrednia** | Framework |

### 38.1 Prose

| Token | Wartość domyślna | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|---|
| `--sf-prose-heading-gap` | `var(--sf-space-s)` | Odstęp przed nagłówkiem w prose | **Bezpośrednia** | Framework |
| `--sf-prose-list-gap` | `var(--sf-space-xs)` | Odstęp między elementami listy | **Bezpośrednia** | Framework |
| `--sf-prose-block-margin` | `var(--sf-space-m)` | Margines bloków (p, ul, ol) | **Bezpośrednia** | Framework |
| `--sf-prose-media-margin` | `var(--sf-space-m)` | Margines mediów (img, video) | **Bezpośrednia** | Framework |
| `--sf-prose-media-radius` | `var(--sf-radius-m)` | Radius mediów w prose | **Bezpośrednia** | Framework |
| `--sf-prose-figure-margin` | `var(--sf-space-l)` | Margines elementu figure | **Bezpośrednia** | Framework |
| `--sf-prose-marker-color` | `var(--sf-color-primary)` | Kolor bulletów i liczb list | **Bezpośrednia** | Framework |
| `--sf-prose-figcaption-size` | `var(--sf-text-s)` | Rozmiar podpisu pod zdjęciem | **Bezpośrednia** | Framework |
| `--sf-prose-blockquote-padding` | `var(--sf-space-m)` | Padding blockquote | **Bezpośrednia** | Framework |
| `--sf-prose-blockquote-border` | `2px solid border--subtle` | Obramowanie blockquote (lewa kreska) | **Bezpośrednia** | Framework |
| `--sf-prose-hr-margin` | `var(--sf-space-l)` | Margines hr w prose | **Bezpośrednia** | Framework |
| `--sf-prose-nested-list-gap` | `var(--sf-space-2xs)` | Gap zagnieżdżonych list | **Bezpośrednia** | Framework |
| `--sf-prose-table-pad` | `var(--sf-space-xs)` | Padding komórek tabeli | **Bezpośrednia** | Framework |

### 38.2 Scrim

| Token | Wartość domyślna | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|---|
| `--sf-scrim-color` | `oklch(0 0 0 / 0.55)` | Kolor ściemnienia scrim (tekst na zdjęciu) | **Bezpośrednia** | Framework |
| `--sf-scrim-direction` | `to top` | Kierunek gradienta scrim | **Bezpośrednia** | Framework |
| `--sf-scrim-gradient` | `linear-gradient(direction, color, transparent)` | Gotowy gradient scrim (złożony z direction + color) | **Pośrednia** | Framework |
| `--sf-scrim-text-shadow` | `0 1px 3px oklch(0 0 0 / 0.6)` | Text-shadow dla czytelności tekstu na zdjęciu bez ściemnienia | **Bezpośrednia** | Framework |

---

## 39. Tokeny palety (Palette Tokens)

> Plik: `optional/tokens.palette.css` · Tier: `PUBLIC` · Opcjonalne: **tak**

106 tokenów rozbudowanej palety dla 6 rodzin marki (primary, secondary, tertiary, action, neutral, base). Generowane przez `color-mix(in oklab)`. Dostępne tylko gdy `tokens.palette.css` jest załadowany.

### 39.1 Skala numeryczna (50–950)

Każda rodzina ma 11 kroków. Wzorzec: `--sf-color-{rodzina}-{krok}`

| Krok | Co robi | Edytowalność |
|---|---|---|
| `-50` | Najjaśniejszy odcień (4% koloru w bieli) | **Pośrednia** |
| `-100` | Bardzo jasny | **Pośrednia** |
| `-200` | Jasny | **Pośrednia** |
| `-300` | Jasno-średni | **Pośrednia** |
| `-400` | Poniżej podstawy | **Pośrednia** |
| `-500` | Bazowy kolor (≈ kolor źródłowy) | **Pośrednia** |
| `-600` | Powyżej podstawy | **Pośrednia** |
| `-700` | Ciemny | **Pośrednia** |
| `-800` | Bardzo ciemny | **Pośrednia** |
| `-900` | Prawie czarny odcień | **Pośrednia** |
| `-950` | Najciemniejszy | **Pośrednia** |

Tokeny te są przez `optional/tokens.palette.css` **przypisane jako wartości** aliasów semantycznych (`-superlight` → `-50`, `-xlight` → `-100` itd.), dzięki czemu przesłonięcie np. `--sf-color-primary-100` automatycznie propaguje się do `--sf-color-primary-xlight`.

### 39.2 Warianty alfa

Wzorzec: `--sf-color-{rodzina}-{a5|a10|a30|a50|a80}`

| Token | Alfa | Co robi |
|---|---|---|
| `-a5` | 5% | Prawie niewidoczny — najsubtelniejsze tła |
| `-a10` | 10% | Ghost tło |
| `-a30` | 30% | Wyciszony — muted badge bg |
| `-a50` | 50% | Pół-przezroczysty |
| `-a80` | 80% | Prawie pełny |

### 39.3 Kontrolki kształtu rampy (zaawansowane)

> Tier: `PUBLIC-ADVANCED`

`--sf-palette-mix-{krok}` — współczynnik `color-mix()` dla każdego kroku skali. Zmiana tych tokenów pozwala zakrzywić dystrybucję odcieni (np. więcej kroków jasnych lub ciemnych).

Wzorzec: `--sf-palette-mix-50`, `--sf-palette-mix-100`, …, `--sf-palette-mix-950`

| Token | Co robi | Edytowalność |
|---|---|---|
| `--sf-palette-mix-50` | Procent koloru w `color-mix` dla kroku -50 | **Zaawansowana** |
| `--sf-palette-mix-100` … `--sf-palette-mix-950` | j.w. dla kolejnych kroków | **Zaawansowana** |

---

## 40. Tokeny komponentów (Component Tokens)

> Plik: `optional/tokens.components.css` · Tier: `PUBLIC` · Opcjonalne: **tak**

Aktualnie 6 aktywnych stub-tokenów. Reszta zakomentowana jako planowane API.

| Token | Co robi | Edytowalność | Użycie w CSS |
|---|---|---|---|
| `--sf-card-radius` | Radius karty | **Bezpośrednia** | Framework |
| `--sf-card-padding` | Padding karty | **Bezpośrednia** | Framework |
| `--sf-card-gap` | Gap między elementami karty | **Bezpośrednia** | Framework |
| `--sf-card-bg` | Tło karty | **Bezpośrednia** | Framework |
| `--sf-card-border` | Obramowanie karty | **Bezpośrednia** | Framework |
| `--sf-card-shadow` | Cień karty | **Bezpośrednia** | Framework |

> Pozostałe tokeny (`--sf-field-*`, `--sf-button-*`, `--sf-badge-*`, itd.) są zaplanowane i pojawią się w przyszłych wersjach frameworku.

---

## Podsumowanie — kiedy edytować co

### Minimum do rebrandingu (6 tokenów)

```css
:root {
  --sf-color-primary-light:   oklch(0.50 0.25 30);  /* Twój główny kolor */
  --sf-color-secondary-light: oklch(0.25 0.05 30);  /* Drugi kolor */
  --sf-color-tertiary-light:  oklch(0.45 0.20 60);  /* Trzeci kolor */
  --sf-color-action-light:    oklch(0.52 0.22 220);  /* CTA, linki, focus */
  --sf-color-neutral-light:   oklch(0.50 0.02 30);   /* Szary (lekko tintowany) */
  --sf-color-base-light:      oklch(0.97 0.003 30);  /* Prawie biały tła */
}
```

### Typowe dostosowania

```css
:root {
  --sf-font-body:    "Inter", system-ui, sans-serif;   /* Font */
  --sf-font-heading: "Cal Sans", var(--sf-font-body);  /* Font nagłówków */
  --sf-radius-scale: 0;                                /* Ostre rogi */
  --sf-motion-scale: 0;                                /* Bez animacji */
  --sf-border-scale: 0;                                /* Bez obramowań */
  --sf-section-scale: 0.8;                             /* Gęstszy layout */
}
```

### Lokalne nadpisanie (per-element)

```css
.hero {
  --sf-section-pad: var(--sf-section-pad--xl);
  --sf-grid-min: 20rem;
  --sf-cluster-gap: var(--sf-space-s);
}
```
