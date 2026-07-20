# System kolorów SLASHED — pełna instrukcja użytkownika

Ten przewodnik tłumaczy **kiedy, na jakim elemencie i jakiego narzędzia użyć**,
żeby pokolorować stronę na SLASHED — na konkretnym przykładzie landing page'a
(typu „WordPress sites that load faster, convert better”). Jeśli gubisz się w
tym, czym różni się `surface` od `color-on-*` od `data-theme` — to jest
dokument dla Ciebie.

> Źródło prawdy: `core/tokens.css` i `core/themes.css`. Jeśli cokolwiek tutaj
> kłóci się z kodem — wygrywa kod. Krótszy słownik tokenów: [`colors.md`](colors.md).

---

## 1. Model mentalny — trzy warstwy

Cały system to **trzy warstwy**. Zawsze pracujesz na najwyższej, do której się da
zejść — im wyżej, tym mniej decyzji podejmujesz ręcznie.

```
WARSTWA 3  Powierzchnie          .sf-surface--primary, .sf-btn--action, .sf-card
           (klasy)               → „pomaluj cały blok, tekst dobierz sam”
                ▲
WARSTWA 2  Tokeny semantyczne    --sf-color-text, --sf-color-bg, --sf-color-border,
           (role)                --sf-color-link, --sf-color-heading
                ▲                → „to jest tekst / tło / obramowanie” (nie kolor!)
                ▲
WARSTWA 1  Kolory źródłowe       --sf-color-primary, --sf-color-action, …
           (marka)               → ustawiasz RAZ przy brandingu, potem nie ruszasz
```

Reguła nadrzędna: **im wyżej, tym lepiej.**

1. Da się użyć gotowej **powierzchni/komponentu**? Użyj (`.sf-surface--*`, `.sf-btn`, `.sf-card`).
2. Nie da się? Sięgnij po **token semantyczny** (`--sf-color-text`, `--sf-color-bg`…).
3. Prawie nigdy nie odwołuj się bezpośrednio do **koloru źródłowego** (`--sf-color-primary`)
   w treści strony — to knob do brandingu, nie do malowania akapitów.

Dlaczego to działa: warstwa 2 i 3 **same przełączają się** w tryb ciemny, na hover,
pod `prefers-contrast` itd. Jeśli wpiszesz gdzieś `color: #1a1a1a`, tracisz to
wszystko i musisz pisać własne reguły `[data-theme="dark"]`. Nie rób tego.

---

## 2. Trzy sposoby nakładania koloru — drzewko decyzyjne

To najważniejsza tabela w całym dokumencie. Zanim pomalujesz cokolwiek, zadaj
sobie pytanie: **czym jest ten element?**

| Chcę… | Użyj | Dlaczego |
|---|---|---|
| pojedynczy **kolorowy kafelek/płytę** (jeden brandowy blok, karta CTA), a tekst w środku ma sam się skontrastować | klasa powierzchni `.sf-surface--primary` (`--action`, `--inverse`, `--success`…) | ustawia tło + auto-dobiera kolor tekstu, linków, obramowań, focus-ringu |
| **całą sekcję w innym trybie** (jasna strona, ale ciemny pas z kartami, formularzem, przyciskami) | atrybut `data-theme="dark"` na `<section>` | przełącza *cały* zestaw tokenów trybu — tła, tekst, karty, inputy w środku adaptują się jak w prawdziwym dark mode |
| **treść na neutralnym tle strony** (akapit, nagłówek, obramowanie, link) | token semantyczny `--sf-color-text`, `--sf-color-heading`, `--sf-color-border`, `--sf-color-link` | to są *role*, nie kolory — same śledzą motyw |
| **przycisk / link / akcent interaktywny** | `.sf-btn` (+ wariant) albo `--sf-color-action` | interaktywność ma swój osobny kolor (patrz §3) |
| **tekst leżący wprost na jednolitym kolorze marki** (napis na pomarańczowym) | `--sf-color-text--on-primary` (`--on-action`, `--on-danger`…) | auto-dobiera czerń albo biel pod ten konkretny kolor |
| **delikatny barwny wash** (tło alertu, podświetlony wiersz) | wariant `-subtle` / `-tint` albo rampa numeryczna (`-100`, `-200`) | patrz §6 |

### Kluczowa różnica: `.sf-surface--*` vs `data-theme` vs `--sf-color-*-on`

To jest dokładnie to, co Cię myli — rozbijmy na czynniki pierwsze:

- **`.sf-surface--primary`** = *„weź kolor marki i zrób z niego jednolitą płytę”.*
  Tło = `--sf-color-primary`, a framework policzy, czy tekst ma być czarny czy
  biały (`--sf-color-text--on-primary`) i przepisze to na WSZYSTKIE tokeny
  potomków (`--sf-color-text`, `--sf-color-heading`, `--sf-color-link`,
  `--sf-color-border`, focus-ring, karetka). Efekt: cokolwiek włożysz do środka,
  będzie czytelne. Używasz do **jednej kolorowej rzeczy**: baner CTA, wyróżniona
  karta cennika, badge.

- **`data-theme="dark"`** (lub `="light"`) = *„ta sekcja żyje w innym trybie”.*
  Nie maluje jednym kolorem marki — przełącza cały motyw: `--sf-color-bg` robi się
  ciemne, `--sf-color-text` jasne, a karty (`.sf-card`), inputy i przyciski w
  środku **adaptują się same**, tak jak zrobiłyby to w dark mode całej strony.
  Używasz do **całego pasa/sekcji** z wieloma elementami (ciemna sekcja z trzema
  kartami cennika i przyciskami).

- **`--sf-color-text--on-*`** = *„sam kolor tekstu na znanym tle marki”.*
  Nie tło, nie płyta — tylko wartość koloru. Sięgasz po nią, gdy malujesz coś
  ręcznie (np. własny badge) i potrzebujesz czcionki, która skontrastuje się z
  konkretnym `--sf-color-primary`.

Zapamiętaj skrótowo:
**jeden kolorowy klocek → `.sf-surface--*`;
cały ciemny pas → `data-theme`;
sam kolor napisu na kolorze → `--sf-color-text--on-*`.**

---

## 3. `primary` vs `action` — rozróżnienie, które psuje najwięcej stron

Framework rozdziela **kolor marki** od **koloru interakcji** na dwa osobne knoby.
Na naszym przykładzie oba są pomarańczowe — ale to nie znaczy, że to jedno i to samo.

| Token | Rola | Na przykładowej stronie |
|---|---|---|
| `--sf-color-primary` | tożsamość marki | akcent w nagłówku hero („**actually** win business”), wyróżniona płyta, znaczniki dekoracyjne |
| `--sf-color-action` | **domyślny kolor interaktywny** | każdy przycisk CTA, link, focus-ring, kontrolka formularza |

**Najczęstszy błąd:** malowanie przycisków przez `--sf-color-primary`. Przyciski
i linki domyślnie biorą `--sf-color-action`. Trzymaj je rozdzielnie — dzięki temu
możesz zmienić kolor wszystkich CTA bez ruszania koloru logo i odwrotnie.

Do stanów interakcji nie kombinuj z wartościami — są gotowe aliasy:

```css
--sf-color-action            /* stan spoczynkowy */
--sf-color-action--hover     /* = -600, hover  */
--sf-color-action--active    /* = -800, wciśnięcie */
```

(ten sam wzorzec dla `primary`, `secondary`, `tertiary`, `neutral`).

---

## 4. Sekcja po sekcji — jak zbudować przykładową stronę

Landing z załącznika to naprzemienne pasy **jasny → ciemny → jasny → ciemny**,
z jednym pomarańczowym akcentem. Poniżej każdy pas rozpisany na właściwe narzędzia.

### 4.1. Hero (jasny pas) — „WordPress sites that load faster…”

Tło strony jest domyślne (nie ustawiasz go — to `--sf-color-bg`). Malujesz tylko treść.

```html
<section class="sf-section">
  <div class="sf-container sf-stack">
    <h1>
      WordPress sites that load faster, convert better, and
      <span class="sf-text-gradient">actually</span> win business
    </h1>
    <p class="sf-text-l">Podtytuł idzie kolorem drugorzędnym.</p>
    <a class="sf-btn sf-btn--action sf-btn--l" href="#kontakt">Book a call</a>
  </div>
</section>
```

Co się dzieje z kolorami:
- Nagłówek `<h1>` **nie dostaje żadnej klasy koloru** — bierze `--sf-color-heading`
  automatycznie z reguł bazowych. Nie pisz `color:` ręcznie.
- Pomarańczowy akcent w nagłówku: `.sf-text-gradient` (gradient marki na tekście)
  albo, jeśli chcesz płaski kolor, `<span style="color: var(--sf-color-primary)">`.
- Podtytuł „ściszony”: klasa rozmiaru + token `--sf-color-text--subtle`
  (np. własna klasa: `.lead { color: var(--sf-color-text--subtle); }`).
- Przycisk CTA: `.sf-btn .sf-btn--action`. Tło, kolor napisu (`--on-action`),
  hover i focus-ring — wszystko gotowe.
- Pływająca karta/widget po prawej: `.sf-card` — dostaje `--sf-color-surface` jako
  tło i `--sf-color-border` jako obramowanie, bez dotykania kolorów.

### 4.2. Ciemny pas — „Three ways to work together” (trzy karty cennika)

To jest **cała ciemna sekcja z wieloma elementami** → `data-theme="dark"`, nie
`.sf-surface`.

```html
<section class="sf-section sf-full-bleed" data-theme="dark">
  <div class="sf-container">
    <h2>Three ways to work together</h2>
    <div class="sf-grid sf-grid-cols-3">
      <article class="sf-card">…</article>
      <article class="sf-card">…</article>       <!-- wyróżniona: patrz niżej -->
      <article class="sf-card">…</article>
    </div>
  </div>
</section>
```

Dlaczego `data-theme="dark"`, a nie `.sf-surface--inverse`:
- `data-theme="dark"` przełącza **cały motyw sekcji** — `--sf-color-bg` robi się
  ciemne, a karty `.sf-card` w środku **same** biorą ciemne `--sf-color-surface`,
  jasny tekst, właściwe obramowania. Dokładnie to widać na makiecie.
- `.sf-surface--inverse` dałoby jedną jednolitą ciemną płytę, ale karty w środku
  nie „wskoczyłyby” w tryb ciemny tak naturalnie — inverse jest do pojedynczego
  klocka, nie do pasa z zagnieżdżonymi komponentami.
- `.sf-full-bleed` rozciąga tło na całą szerokość ekranu, a `.sf-container`
  trzyma treść w kolumnie.

Wyróżniona (środkowa, pomarańczowa) karta — to **jeden kolorowy klocek**, więc tu
już wchodzi powierzchnia:

```html
<article class="sf-card sf-surface--primary">…</article>
```

`.sf-surface--primary` na karcie = pomarańczowe tło + auto-kontrast napisów w środku.

### 4.3. Jasny pas — tabela porównawcza „Agency results. Freelancer access.”

Wracamy na neutralne tło. Wszystko na tokenach semantycznych:

```css
.compare              { border: var(--sf-border-width-1) solid var(--sf-color-border); }
.compare thead        { background: var(--sf-color-inset); }   /* delikatnie wciśnięty nagłówek */
.compare td, .compare th { border-block: var(--sf-border-width-1) solid var(--sf-color-border--subtle); }
.compare .highlight   { color: var(--sf-color-action); }        /* wyróżniona kolumna */
```

- Linie tabeli: `--sf-color-border` (mocniejsze) i `--sf-color-border--subtle` (cieńsze).
- Tło paska nagłówka: `--sf-color-inset` (płyta lekko cofnięta względem `--sf-color-bg`).
- Nigdzie nie podajesz konkretnego szarego — te tokeny same się dostroją w dark mode.

### 4.4. Ciemny pas — opinie „4.9 across 50+ projects”

Znów `data-theme="dark"` na sekcji + `.sf-card` na cytatach. Gwiazdki oceny mogą
użyć `--sf-color-warning` (klasyczny „złoty” akcent ocen), logotypy klientów —
`--sf-color-text--subtle`, żeby były obecne, ale nie krzyczały.

### 4.5. Jasny pas — proces „A 5-phase process” (stepper)

Aktywny krok = interakcja/stan → `--sf-color-action` i stan `.sf-is-active`:

```css
.step                { color: var(--sf-color-text--subtle); }  /* krok nieaktywny */
.step.sf-is-active   { color: var(--sf-color-action); }           /* krok bieżący    */
.step__dot           { background: var(--sf-color-border); }
.step.sf-is-active .step__dot { background: var(--sf-color-action); }
```

`.sf-is-*` to klasy stanu (patrz [`docs/states.md`](../docs/states.md)) — sygnalizują
stan JS-em, a kolory zostają w tokenach.

### 4.6. Ciemny pas CTA — „Ready to build something that actually performs”

`data-theme="dark"` + przycisk `.sf-btn--action`. Ponieważ to sekcja w trybie
ciemnym, `--sf-color-action` automatycznie użyje swojego wariantu dla ciemnego tła —
nic nie robisz ręcznie.

### 4.7. Jasny pas — cennik „Your site doesn't stop working after launch day”

Trzy karty, środkowa wyróżniona na pomarańczowo (dokładnie wzorzec z §4.2):

```html
<div class="sf-grid sf-grid-cols-3">
  <article class="sf-card sf-card--bordered">Core</article>
  <article class="sf-card sf-surface--primary">Commerce</article>  <!-- wyróżniona -->
  <article class="sf-card sf-card--bordered">Custom</article>
</div>
```

Alternatywa dla wyróżnienia „ramką zamiast wypełnienia” — użyj rampy albo obramowania marki:

```css
.plan--featured {
  border-color: var(--sf-color-primary);
  background:   var(--sf-color-primary-superlight);  /* ledwie widoczny ciepły wash */
}
```

Kiedy `.sf-surface--primary` (pełny pomarańcz), a kiedy `-superlight` (delikatny wash)?
Pełna płyta = maksymalne wyróżnienie; wash = subtelny akcent bez krzyku. Wybór estetyczny.

### 4.8. Ciemny pas — „I don't take on every project” (dwie kolumny z listami)

`data-theme="dark"` + znaczniki list w kolorze marki:

```html
<ul class="sf-marker--action">…</ul>   <!-- pomarańczowe punktory -->
```

Gdybyś chciał listę „robię / nie robię” w barwach statusów: `--sf-color-success`
i `--sf-color-danger` na ikonkach.

### 4.9. Jasny pas — FAQ „Questions I get asked a lot”

Akordeon = wiersze rozdzielone `--sf-color-border`, pytanie w `--sf-color-heading`,
odpowiedź w `--sf-color-text`. Ikona +/- w `--sf-color-action`.

### 4.10. Ciemny pas — formularz kontaktowy „Let's talk about your project”

`data-theme="dark"` na sekcji i… nic więcej przy kolorach inputów. Kontrolki z
`optional/forms.css` **same** wezmą ciemne tło pola, jasny tekst, obramowanie i
focus-ring w kolorze `--sf-color-action`. To jest cała nagroda za trzymanie się
tokenów semantycznych — formularz „po prostu działa” w ciemnym pasie.

> Uwaga na `color-scheme`: `data-theme="dark"` ustawia je za Ciebie, więc natywne
> elementy (scrollbary, autouzupełnianie, kalendarz w `<input type=date>`) też będą
> ciemne. Jeśli kiedyś zrobisz własny tryb bez `data-theme`, pamiętaj ustawić
> `color-scheme` ręcznie.

### 4.11. Stopka (ciemna)

Najciemniejszy pas. Dwie opcje:
- `data-theme="dark"` — jeśli stopka ma linki, inputy newslettera itp. (adaptują się).
- `.sf-surface--inverse` albo `.sf-surface--secondary` — jeśli to zwarta, jednolita
  płyta bez interaktywnych komponentów wymagających pełnego motywu.

---

## 5. Tokeny semantyczne — pełna ściąga „na co którego”

To są role, których używasz na neutralnym tle strony (poza kolorowymi płytami):

| Token | Na czym |
|---|---|
| `--sf-color-text` | tekst akapitów, treść |
| `--sf-color-text--subtle` | podtytuły, metadane, „ściszony” tekst |
| `--sf-color-heading` | nagłówki (h1–h6 biorą go automatycznie) |
| `--sf-color-link` | linki (śledzi hue `action`, ale z bezpiecznym kontrastem) |
| `--sf-color-border` | obramowania, dividery |
| `--sf-color-border--subtle` / `--strong` | cieńsze / mocniejsze linie |
| `--sf-color-bg` | tło strony (rzadko ustawiasz — jest domyślne) |
| `--sf-color-surface` | tło kart/kontenerów (`.sf-card` używa go sam) |
| `--sf-color-inset` | płyta cofnięta (nagłówek tabeli, pole kodu) |
| `--sf-color-raised` | płyta wyniesiona (uniesiona karta, popover) |
| `--sf-color-inverse` | odwrócone tło (ciemne w jasnym trybie) |

Wszystkie **same przełączają się** w dark mode i pod `data-theme`. Nigdy nie
podajesz pod nie konkretnego hexa.

---

## 6. Rampy, alfa i statusy — kiedy które

### Rampy numeryczne 50 → 950 (marka)

`primary`, `secondary`, `tertiary`, `action`, `neutral`, `base` mają drabinę
`-50` (ledwie widoczny tint) → `-500` (sam kolor) → `-950` (prawie czarny).
Aliasy do tych, po które naprawdę sięgasz:

```
--sf-color-primary-superlight  (= -50)   subtelne tło / wash
--sf-color-primary-xlight      (= -200)  tło pigułki/badge
--sf-color-primary-lighter     (= -400)  obramowania na kolorowym komponencie
--sf-color-primary-darker      (= -600)  hover, tekst-na-tincie
--sf-color-primary-xdark       (= -800)  stan wciśnięty
```

**Jak liczona jest rampa.** Każdy krok przyciąga jasność OKLCH koloru marki o
ustalony ułamek ku **absolutnej** kotwicy — `--sf-palette-tint-l` (`0.97`) dla
tintów 50–400, `--sf-palette-shade-l` (`0.1`) dla cieni 600–950 — z klamrą, więc
tint nigdy nie jest ciemniejszy od bazy, a cień nigdy jaśniejszy. Dzięki temu
rampa jest **monotoniczna (jasno→ciemno) dla dowolnego koloru źródłowego** i
**nie składa się w „U"** — nawet gdy Twój brand jest bardzo ciemny/jasny albo
przesuniesz kotwice `neutral`/`base`. (`base` to osobna, absolutna drabina
szarości; statusy nie mają rampy numerycznej.)

Kroki dają **jednolite** (nieprzezroczyste) kolory, więc nie wtapiają się w
nieznane tło — do tego służą warianty alfa (niżej).

### Warianty alfa (przezroczyste)

Gdy element leży na **nieznanym** tle (badge, który może trafić na jasną albo
ciemną kartę) — użyj wariantów alfa zamiast rampy numerycznej:

| Token | Krycie | Alias |
|---|---|---|
| `-a5`  | 5%  | `-tint` |
| `-a10` | 10% | `-subtle` |
| `-a30` | 30% | `-muted` |
| `-a50` | 50% | — |

Alfa przepuszcza tło pod spodem (przezroczystość), więc jest poprawna na każdym
tle; rampa numeryczna daje kolory jednolite, które nie reagują na to, co jest
pod nimi.

### Statusy: `success`, `warning`, `info`, `danger`

Nie mają pełnej rampy — mają zestaw celowy:

| Token | Na czym |
|---|---|
| `--sf-color-{status}` | ikony, drobne akcenty, obramowania |
| `--sf-color-{status}-strong` | jednolite tło z większym kontrastem, hover na przycisku statusu |
| `--sf-color-{status}-subtle` | tinted tło kontenera (np. pudełko alertu) |
| `--sf-color-{status}-muted` (~30%) | mocniejszy wash, np. tło badge |
| `--sf-color-{status}-tint` (~5%) | najlżejszy wash |

Przykład — alert błędu:

```css
.alert--danger {
  background:   var(--sf-color-danger-subtle);
  border-color: var(--sf-color-danger);
  color:        var(--sf-color-danger-strong);
}
```

---

## 7. Tekst wprost na kolorze — `--sf-color-text--on-*`

Ilekroć napis leży bezpośrednio na jednolitym kolorze marki/statusu, użyj
pasującego `--sf-color-text--on-*` zamiast wpisywać czerń/biel. Framework
sam wybierze wariant dający lepszy kontrast pod ten konkretny kolor:

```css
.badge--primary {
  background: var(--sf-color-primary);
  color:      var(--sf-color-text--on-primary);
}
```

Dostępne: `--on-primary`, `--on-secondary`, `--on-tertiary`, `--on-action`,
`--on-neutral`, `--on-success`, `--on-warning`, `--on-info`, `--on-danger`,
`--on-inverse`.

**Uwaga na „pas niejednoznaczny” (L ≈ 0.52–0.67).** Jeśli Twój kolor marki
wpada w środek jasności, binarny wybór czerń/biel może nie wyrobić 4.5:1.
Wtedy albo przesuń próg dla tej powierzchni:

```css
.sf-surface--primary { --sf-contrast-threshold: 0.55; }
```

…albo przypnij kolor tekstu ręcznie:

```css
.sf-surface--primary { --sf-color-text--on-primary: oklch(0.15 0 0); }
```

Te nadpisania trzymaj w warstwie `slashed.overrides`, żeby przetrwały aktualizacje.

---

## 8. Najczęstsze błędy (i jak je naprawić)

1. **Malowanie przycisku przez `--sf-color-primary`.** → Przyciski to `--sf-color-action`
   (albo `.sf-btn--action`). `primary` to marka, nie interakcja (§3).
2. **Wpisywanie `#hex` / `rgb()` w treści strony.** → Tracisz dark mode i hover.
   Zejdź na tokeny semantyczne (§5).
3. **Pisanie własnych reguł `[data-theme="dark"] { color: … }`.** → Niepotrzebne.
   Tokeny semantyczne robią to za Ciebie.
4. **Użycie `.sf-surface--inverse` na całym ciemnym pasie z kartami i formularzem.**
   → To zadanie dla `data-theme="dark"`; `.sf-surface--*` jest do pojedynczego klocka (§2).
5. **Rampa numeryczna (`-200`) na elemencie pływającym nad nieznanym tłem.**
   → Użyj wariantu alfa (`-subtle` / `-tint`), bo krok rampy to kolor jednolity i nie wtapia się w nieznane tło (§6).
6. **Ręczne dobieranie czerni/bieli na kolorowym tle.** → `--sf-color-text--on-*` (§7).

---

## 9. Ściąga „potrzebuję…”

| Potrzebuję… | Sięgam po |
|---|---|
| przycisk / link / focus-ring | `.sf-btn--action` lub `--sf-color-action` (+ `--hover`) |
| kolorowy hero/marketingowy blok | `--sf-color-primary` / `.sf-text-gradient` |
| cały ciemny pas z kartami i formularzem | `data-theme="dark"` na `<section>` |
| pojedynczy kolorowy klocek (wyróżniona karta, baner) | `.sf-surface--primary` (`--action`, `--inverse`…) |
| tekst, nagłówki, obramowania na tle strony | `--sf-color-text`, `--sf-color-heading`, `--sf-color-border` |
| tła kart/paneli | `--sf-color-surface`, `--sf-color-inset`, `--sf-color-raised` |
| feedback sukces/ostrzeżenie/info/błąd | token statusu (`-subtle` tło, `-strong` hover) |
| tekst wprost na jednolitym kolorze | `--sf-color-text--on-*` |
| tint marki nad ZNANYM tłem | rampa numeryczna (`-100`…`-400` / `-superlight`…) |
| tint marki nad NIEZNANYM tłem | wariant alfa (`-tint` / `-subtle` / `-muted`) |

---

## Zobacz też

- [`colors.md`](colors.md) — zwięzły słownik 10 kolorów źródłowych i tokenów
- [`../docs/theming.md`](../docs/theming.md) — rebranding w 6 tokenach + silnik fluid
- [`../docs/tokens.md`](../docs/tokens.md) — pełny wykaz tokenów
- [`../docs/states.md`](../docs/states.md) — klasy stanu `.sf-is-*`
