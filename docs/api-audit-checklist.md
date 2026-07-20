# SLASHED — checklista audytu API (tokeny + klasy)

> Robocza checklista do ręcznego przeglądu powierzchni API frameworka.
> Źródło: `docs/api-index.json` (1070 elementów — 747 tokenów + 323 klasy).
> Podział na 3 grupy: **fundament** / **przydatne-opcjonalne** / **niszowe**.

## Jak odznaczać

Każda pozycja ma checkbox. Proponowana konwencja (dopisz kod po pozycji):

- `- [x]` **bez dopisku** → **ZOSTAJE** (świadomie zatwierdzone)
- `- [x] … — USUŃ` → kandydat do usunięcia
- `- [x] … — OGRANICZ` → zostaje, ale okrojone (mniej wariantów / do `full` / PUBLIC-ADVANCED)
- `- [ ]` → jeszcze nierozpatrzone

Duże jednorodne rodziny (np. 27-stopniowe palety, aliasy typografii) są zgrupowane
w jeden checkbox — nie ma sensu klikać 162 razy. Tam, gdzie decyzja jest per-element
(klasy, komponenty, warianty), pozycje są rozpisane pojedynczo.

Legenda kolumny „bundle": `opt` = jest w `slashed.optimal`, `full` = tylko w `slashed.full` (framework już traktuje jako opt-in).

---

# GRUPA 1 — Fundament (bezdyskusyjny)

Bez tego framework nie istnieje. Domyślnie wszystko `ZOSTAJE`; checkbox = potwierdzenie.

## 1A. Kolory — palety (grupowo)

- [ ] `--sf-primary-*` — rampa primary (27 stopni) `opt`
- [ ] `--sf-secondary-*` — rampa secondary (27) `opt`
- [ ] `--sf-tertiary-*` — rampa tertiary (27) `opt`
- [ ] `--sf-action-*` — rampa action (27) `opt`
- [ ] `--sf-neutral-*` — rampa neutral (27) `opt`
- [ ] `--sf-base-*` — rampa base (27) `opt`

## 1B. Kolory — semantyka źródłowa (grupowo)

- [ ] BRAND COLORS source (`*-source-light`, animatable) — 6 tok. `opt`
- [ ] DARK SOURCE TOKENS (`*-dark`, animatable) — 21 tok. `opt`
- [ ] STATUS COLORS source (`success/warning/danger/info`-source) — 4 tok. `opt`
- [ ] Status triplets (bg/fg/border dla 4 statusów) — 16 tok. `opt`
- [ ] Text-on-color (`--sf-on-*`) — 12 tok. `opt`
- [ ] Resolved color tokens + Color scheme — 2 tok. `opt`

## 1C. Powierzchnie, tekst, obramowania

- [ ] Surfaces (`--sf-color-surface*`) — 5 tok. `opt`
- [ ] Text (`--sf-color-text*`) — 7 tok. `opt`
- [ ] Borders (`--sf-color-border*`) — 4 tok. `opt`
- [ ] Border widths (`--sf-border-width-*`) — 6 tok. `opt`
- [ ] Border shorthands — 3 tok. `opt`
- [ ] Border alpha + Border style — 3 tok. `opt`
- [ ] Divider (`--sf-divider-*`) — 4 tok. `opt`

## 1D. Typografia (grupowo)

- [ ] Font families (`--sf-font-*`) — 10 tok. (3 PUBLIC-ADVANCED) `opt`
- [ ] Font sizes (`--sf-text-2xs … 4xl` skala) — 12 tok. `opt`
- [ ] Font weights (`--sf-font-weight-*`) — 11 tok. `opt`
- [ ] Line heights & letter spacing — 14 tok. `opt`
- [ ] TYPOGRAPHY ALIASES (`--sf-text-*` role) — 36 tok. `opt`
- [ ] Per-size typography sub-properties (`--sf-text-{size}-*`) — 36 tok. `opt`
- [ ] Heading line-length constraints (`--sf-heading-measure-*`) — 6 tok. `opt`

## 1E. Skala / silnik rozmiarów (grupowo)

- [ ] FLUID SCALE ENGINE — 13 tok. (12 PUBLIC-ADVANCED) `opt`
- [ ] Output token @property registrations (rejestracje space/radius/font/motion) — 56 tok. `opt`
- [ ] Odstępy `--sf-space-*` (skala 2xs…4xl + none/px/base) — `opt`
- [ ] Promienie `--sf-radius-*` (skala + full/pill/outer) — `opt`
- [ ] Semantic gap tokens (`--sf-content-gap` itp.) — 3 tok. `opt`
- [ ] Section padding — 1 tok. `opt`
- [ ] UI sizes — 5 tok. `opt`
- [ ] Icon sizes (`--sf-icon-size-*`) — 6 tok. `opt`
- [ ] Containers (`--sf-container-*`) — 5 tok. `opt`

## 1F. Stany interaktywne, focus, z-index

- [ ] Interactive states (kolory hover/active) — 6 tok. `opt`
- [ ] Focus / form colors — 3 tok. (1 PUBLIC-ADVANCED) `opt`
- [ ] Links + Link alpha (`--sf-link-*`) — 8 tok. `opt`
- [ ] Selection / Selection & backdrop / mark — 9 tok. `opt`
- [ ] Z-index (`--sf-z-*`) — 10 tok. `opt`
- [ ] Scrollbar — 2 tok. `opt`

## 1G. Klasy fundamentu

- [ ] `.sf-sr-only` `opt`
- [ ] `.sf-sr-only-focusable` `opt`
- [ ] `.skip-link` `opt`
- [ ] `.no-motion` `opt`
- [ ] `.sf-focus-parent` `opt`
- [ ] `.sf-focus-shadow` `opt`
- [ ] `.sf-clickable-parent` `opt`
- [ ] `.sf-clickable-parent__overlay` `opt`
- [ ] `.sf-theme-dark` `opt`
- [ ] `.sf-theme-light` `opt`
- [ ] `.sf-theme-transition` `opt`

---

# GRUPA 2 — Przydatne, ale opcjonalne

Realna wartość; rozważ okrojenie liczby wariantów lub przeniesienie do `full`.

## 2A. Tokeny layoutu i makr (grupowo)

- [ ] Layout tokens (gap/kolumny prymitywów) — 53 tok. `opt`
- [ ] Macro tokens (prose/scrim/surface presets) — 32 tok. `opt`

## 2B. Tokeny ruchu i efektów (grupowo)

- [ ] Motion & easing — 15 tok. `opt`
- [ ] Transition shorthands — 10 tok. `opt`
- [ ] Animation presets — 23 tok. `opt`
- [ ] Gradients — 10 tok. `opt`
- [ ] Shadow ramp / strength / glow — 4 tok. `opt`
- [ ] Blur & opacity + Opacity — 4 tok. `opt`
- [ ] Aspect ratios — 7 tok. `opt`
- [ ] Object fit / position — 2 tok. `opt`

## 2C. Layout primitives — klasy (per rodzina)

- [ ] `.sf-stack` (10) `opt`
- [ ] `.sf-cluster` (11) `opt`
- [ ] `.sf-grid` (9) `opt`
- [ ] `.sf-grid-flex` (8) `opt`
- [ ] `.sf-grid-cols-*` (1,1-2,1-3,2,2-1,3,3-1,4,6 — 9 klas) `opt`
- [ ] `.sf-section` (9) `opt`
- [ ] `.sf-section-group` (1) `opt`
- [ ] `.sf-frame` (8) `opt`
- [ ] `.sf-icon` (8) `opt`
- [ ] `.sf-divider` (7) `opt`
- [ ] `.sf-divide` (2) `opt`
- [ ] `.sf-gap` (7) `opt`
- [ ] `.sf-cover` (6) `opt`
- [ ] `.sf-container` (5) `opt`
- [ ] `.sf-equal` (5) `opt`
- [ ] `.sf-header` (5) `opt`
- [ ] `.sf-sidebar` (4) `opt`
- [ ] `.sf-switcher` (3) `opt`
- [ ] `.sf-center` (2) `opt`
- [ ] `.sf-box` (1) `opt`
- [ ] `.sf-cq` / `.sf-fluid-cq` (container queries — 2) `opt`

## 2D. Macro classes — per element

- [ ] `.sf-surface` + warianty (`--action/danger/info/inverse/neutral/primary/secondary/success/tertiary/warning`, `-bg`) — 11 `opt`
- [ ] `.sf-prose` `opt`
- [ ] `.sf-not-prose` `opt`
- [ ] `.sf-flow` `opt`
- [ ] `.sf-truncate` `opt`
- [ ] `.sf-line-clamp-2` `opt`
- [ ] `.sf-line-clamp-3` `opt`
- [ ] `.sf-line-clamp-N` `opt`
- [ ] `.sf-tabular-nums` `opt`
- [ ] `.sf-text-protect` `opt`
- [ ] `.sf-aspect` `opt`
- [ ] `.sf-equal-height` `opt`
- [ ] `.sf-content-auto` `opt`
- [ ] `.sf-link--reverse` `opt`
- [ ] `.sf-link--subtle` `opt`
- [ ] `.sf-link-external` `opt`

## 2E. State classes (`.sf-is-*`) — per element

- [ ] `.sf-is-active` `opt`
- [ ] `.sf-is-selected` `opt`
- [ ] `.sf-is-current` `opt`
- [ ] `.sf-is-disabled` `opt`
- [ ] `.sf-is-loading` `opt`
- [ ] `.sf-is-open` `opt`
- [ ] `.sf-is-collapsed` `opt`
- [ ] `.sf-is-expanded` `opt`
- [ ] `.sf-is-hidden` `opt`
- [ ] `.sf-is-visible` `opt`
- [ ] `.sf-is-invisible` `opt`
- [ ] `.sf-is-invalid` `opt`
- [ ] `.sf-is-valid` `opt`
- [ ] `.sf-is-error` `opt`
- [ ] `.sf-is-success` `opt`
- [ ] `.sf-is-warning` `opt`
- [ ] `.sf-is-info` `opt`
- [ ] `.sf-is-danger` `opt`
- [ ] `.sf-is-pending` `opt`
- [ ] `.sf-is-busy` `opt`
- [ ] `.sf-is-readonly` `opt`
- [ ] `.sf-is-pressed` `opt`
- [ ] `.sf-is-highlighted` `opt`
- [ ] `.sf-is-empty` `opt`
- [ ] `.sf-is-skeleton` `opt`

## 2F. Motion classes — per element

- [ ] `.sf-fade-in` `opt`
- [ ] `.sf-fade-out` `opt`
- [ ] `.sf-scale-up` `opt`
- [ ] `.sf-scale-down` `opt`
- [ ] `.sf-slide-in-up` `opt`
- [ ] `.sf-slide-in-down` `opt`
- [ ] `.sf-slide-in-left` `opt`
- [ ] `.sf-slide-in-right` `opt`
- [ ] `.sf-entrance--*` (fade/fade-up/down/left/right/scale-up — 6) `opt`
- [ ] `.sf-exit--*` (fade/fade-up/down/left/right/scale-down — 6) `opt`

## 2G. Text-size utilities (klasy) — grupowo

- [ ] `.sf-text-2xs … .sf-text-4xl` (9 klas) `full`
- [ ] `.sf-h1 … .sf-h6` (heading helpers — 6) `full`

---

# GRUPA 3 — Niszowe / zbędne w ~90% projektów

Framework już trzyma większość poza bundlem `optimal`.

## 3A. Komponenty — tokeny (grupowo)

- [ ] BUTTON TOKENS — 29 tok. (4 PUBLIC-ADVANCED; dużo per-rung knobów) `full`
- [ ] CARD TOKENS — 14 tok. `full`
- [ ] FIELD TOKENS — 3 tok. `full`

## 3B. Komponenty — klasy `.sf-btn` (per wariant)

- [ ] `.sf-btn` (baza) `full`
- [ ] `.sf-btn--primary` `full`
- [ ] `.sf-btn--secondary` `full`
- [ ] `.sf-btn--tertiary` `full`
- [ ] `.sf-btn--action` `full`
- [ ] `.sf-btn--neutral` `full`
- [ ] `.sf-btn--base` `full`
- [ ] `.sf-btn--success` `full`
- [ ] `.sf-btn--warning` `full`
- [ ] `.sf-btn--danger` `full`
- [ ] `.sf-btn--info` `full`
- [ ] `.sf-btn--outline` `full`
- [ ] `.sf-btn--soft` `full`
- [ ] `.sf-btn--gradient` `full`
- [ ] `.sf-btn--xs` `full`
- [ ] `.sf-btn--s` `full`
- [ ] `.sf-btn--l` `full`
- [ ] `.sf-btn--xl` `full`
- [ ] `.sf-btn--block` `full`
- [ ] `.sf-btn--block-cq` `full`

## 3C. Komponenty — klasy `.sf-card` (per element)

- [ ] `.sf-card` (baza) `full`
- [ ] `.sf-card--bordered` `full`
- [ ] `.sf-card--elevated` `full`
- [ ] `.sf-card--interactive` `full`
- [ ] `.sf-card__header` `full`
- [ ] `.sf-card__body` `full`
- [ ] `.sf-card__footer` `full`
- [ ] `.sf-card__title` `full`
- [ ] `.sf-card__media` `full`
- [ ] `.sf-card__avatar` `full`

## 3D. Formularze

- [ ] `.sf-live-validate` (forms) `opt`

## 3E. Layout — prymitywy egzotyczne

- [ ] `.sf-bento` + `--2/--3/--6/--row-compact` (6) `opt`
- [ ] `.sf-bento-featured` / `-full` / `-tall` / `-wide` (4) `opt`
- [ ] `.sf-alternate` (zigzag) `opt`
- [ ] `.sf-imposter` (3) `opt`
- [ ] `.sf-pancake` `opt`
- [ ] `.sf-reel` `opt`
- [ ] `.sf-breakout` `opt`
- [ ] `.sf-content-grid` `opt`
- [ ] `.sf-full-bleed` `opt`
- [ ] `.sf-subgrid` / `.sf-subgrid-rows` (2) `opt`
- [ ] `.sf-overlay` `opt`
- [ ] `.sf-bg-layer` `opt`

## 3F. Utilities niszowe

- [ ] `.sf-hover-float` `full`
- [ ] `.sf-hover-grow` `full`
- [ ] `.sf-hover-shrink` `full`
- [ ] `.sf-hover-sink` `full`
- [ ] `.sf-hover-slide-start` `full`
- [ ] `.sf-hover-slide-end` `full`
- [ ] `.sf-sticky` + `--s/--m/--l` (4) `full`
- [ ] `.sf-marker--primary/secondary/tertiary/action` (4) `full`
- [ ] `.sf-list-none` `full`
- [ ] `.sf-selection--alt` `full`

## 3G. Makra niszowe

- [ ] `.sf-scrim` + `--top/--bottom/--full/__content` (5) `opt`
- [ ] `.sf-overflow-fade` + `--top/bottom/left/right/block/inline` (7) `opt`
- [ ] `.sf-scroll-shadow` `opt`
- [ ] `.sf-scroll-snap` `opt`
- [ ] `.sf-overlap` / `--down` / `-host` (3) `opt`
- [ ] `.sf-drop-shadow-xs/s/m/l/xl` (5) `opt`
- [ ] `.sf-text-gradient` `opt`
- [ ] `.sf-no-tap-highlight` `opt`

## 3H. Motion niszowe

- [ ] `.sf-color-pulse` `opt`
- [ ] `.sf-stagger` `opt`

## 3I. Tokeny zaawansowane / wewnętrzne (PUBLIC-ADVANCED)

- [ ] LumLocker (`--sf-lumlocker`, `-dark`) — 2 tok. `opt`
- [ ] Mask scrim (`--sf-mask-scrim-start/end`) — 2 tok. `opt`
- [ ] Palette ramp lightness anchors (`--sf-palette-shade-l/tint-l`) — 2 tok. `opt`
- [ ] INTERACTION STATE FLAGS (`--sf-is-active/current/open/pressed`) — 4 tok. `opt`
- [ ] Scale multipliers (`--sf-*-scale`) — 6 tok. `opt`
- [ ] Density (`--sf-density`) — 1 tok. `opt`
- [ ] Shadow glow color — 1 tok. `opt`
- [ ] Scroll-driven animation range — 4 tok. `opt`

## 3J. Druk (print)

- [ ] Print tokens (`--sf-print-base-size/page-margin/page-size`) — 3 tok. `opt`
- [ ] `.no-print` `opt`
- [ ] `.print-only` `opt`
- [ ] `.print-color-exact` `opt`
- [ ] `.print-no-color` `opt`

---

## Podsumowanie liczbowe

| Grupa | Tokeny | Klasy |
|---|---:|---:|
| 1 — Fundament | ~455 | 11 |
| 2 — Przydatne-opcjonalne | ~150 | ~235 |
| 3 — Niszowe | ~140 | ~77 |
| **Razem** | **747** | **323** |
