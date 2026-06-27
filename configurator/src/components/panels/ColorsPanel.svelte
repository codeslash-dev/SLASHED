<script lang="ts">
  import type { SlashedToken } from '../../types';
  import { KNOBS_BY_DOMAIN } from '../../lib/powerKnobs';
  import { parseOklch, stringifyOklch, getRelativeLuminance, getContrastRatio } from '../../lib/colorUtils';
  import { resolveColor, resolveRgb, resolveBackground, previewVersion } from '../../lib/previewResolver.svelte';
  import OklchColorDesk from '../inputs/OklchColorDesk.svelte';
  import PowerKnobRow from '../inputs/PowerKnobRow.svelte';
  import SliderRow from '../inputs/SliderRow.svelte';

  let { tokens, overrides, onSet, onReset, onBulkChange, onSelectDomain }: {
    tokens: SlashedToken[];
    overrides: Record<string, string>;
    onSet: (name: string, value: string) => void;
    onReset: (name: string) => void;
    onBulkChange: (patch: Record<string, string | null>) => void;
    onSelectDomain?: (d: string) => void;
  } = $props();

  // Resolve real, browser-computed colors from the live preview iframe.
  // Reading previewVersion.value makes these reactive to override changes.
  function paint(expr: string, fallback: string): string {
    void previewVersion.value;
    const r = resolveColor(expr);
    return r || fallback;
  }
  function paintBg(expr: string, fallback: string): string {
    void previewVersion.value;
    const r = resolveBackground(expr);
    return r && r !== "none" ? r : fallback;
  }

  const GRADIENT_TOKENS = [
    { name: "--sf-gradient-primary",   label: "Primary",   group: "brand" },
    { name: "--sf-gradient-secondary", label: "Secondary", group: "brand" },
    { name: "--sf-gradient-tertiary",  label: "Tertiary",  group: "brand" },
    { name: "--sf-gradient-brand",     label: "Brand",     group: "brand" },
    { name: "--sf-gradient-surface",   label: "Surface",   group: "brand" },
    { name: "--sf-gradient-fade--r",   label: "Fade →",    group: "fade" },
    { name: "--sf-gradient-fade--l",   label: "Fade ←",    group: "fade" },
    { name: "--sf-gradient-fade--t",   label: "Fade ↑",    group: "fade" },
    { name: "--sf-gradient-fade--b",   label: "Fade ↓",    group: "fade" },
  ];

  type ColorSource = {
    name: string; label: string; side: "light" | "dark"; default: string; colorKey: string;
  };

  const BRAND_SOURCES: ColorSource[] = [
    { name: "--sf-color-primary-source-light",   label: "Primary",   side: "light", default: "oklch(0.47 0.27 264)", colorKey: "primary" },
    { name: "--sf-color-primary-source-dark",    label: "Primary",   side: "dark",  default: "oklch(0.715 0.243 264)", colorKey: "primary" },
    { name: "--sf-color-secondary-source-light", label: "Secondary", side: "light", default: "oklch(0.22 0.04 264)", colorKey: "secondary" },
    { name: "--sf-color-secondary-source-dark",  label: "Secondary", side: "dark",  default: "oklch(0.84 0.036 264)", colorKey: "secondary" },
    { name: "--sf-color-tertiary-source-light",  label: "Tertiary",  side: "light", default: "oklch(0.42 0.22 295)", colorKey: "tertiary" },
    { name: "--sf-color-tertiary-source-dark",   label: "Tertiary",  side: "dark",  default: "oklch(0.74 0.198 295)", colorKey: "tertiary" },
    { name: "--sf-color-action-source-light",    label: "Action",    side: "light", default: "oklch(0.50 0.22 235)", colorKey: "action" },
    { name: "--sf-color-action-source-dark",     label: "Action",    side: "dark",  default: "oklch(0.70 0.198 235)", colorKey: "action" },
    { name: "--sf-color-neutral-source-light",   label: "Neutral",   side: "light", default: "oklch(0.52 0.025 260)", colorKey: "neutral" },
    { name: "--sf-color-neutral-source-dark",    label: "Neutral",   side: "dark",  default: "oklch(0.69 0.0225 260)", colorKey: "neutral" },
    { name: "--sf-color-base-source-light",      label: "Base",      side: "light", default: "oklch(0.96 0.006 250)", colorKey: "base" },
    { name: "--sf-color-base-source-dark",       label: "Base",      side: "dark",  default: "oklch(0.22 0.003 250)", colorKey: "base" },
  ];

  const STATUS_SOURCES: ColorSource[] = [
    { name: "--sf-color-success-source-light", label: "Success", side: "light", default: "oklch(0.50 0.16 145)", colorKey: "success" },
    { name: "--sf-color-success-source-dark",  label: "Success", side: "dark",  default: "oklch(0.70 0.144 145)", colorKey: "success" },
    { name: "--sf-color-warning-source-light", label: "Warning", side: "light", default: "oklch(0.75 0.17 80)", colorKey: "warning" },
    { name: "--sf-color-warning-source-dark",  label: "Warning", side: "dark",  default: "oklch(0.65 0.153 80)", colorKey: "warning" },
    { name: "--sf-color-info-source-light",    label: "Info",    side: "light", default: "oklch(0.48 0.18 235)", colorKey: "info" },
    { name: "--sf-color-info-source-dark",     label: "Info",    side: "dark",  default: "oklch(0.71 0.162 235)", colorKey: "info" },
    { name: "--sf-color-danger-source-light",  label: "Danger",  side: "light", default: "oklch(0.48 0.22 12)", colorKey: "danger" },
    { name: "--sf-color-danger-source-dark",   label: "Danger",  side: "dark",  default: "oklch(0.73 0.198 12)", colorKey: "danger" },
  ];

  const MIX_STEPS = [
    { name: "--sf-palette-mix-50",  label: "50",  step: "tint",  default: 4 },
    { name: "--sf-palette-mix-100", label: "100", step: "tint",  default: 8 },
    { name: "--sf-palette-mix-200", label: "200", step: "tint",  default: 20 },
    { name: "--sf-palette-mix-300", label: "300", step: "tint",  default: 40 },
    { name: "--sf-palette-mix-400", label: "400", step: "tint",  default: 65 },
    { name: "--sf-palette-mix-600", label: "600", step: "shade", default: 82 },
    { name: "--sf-palette-mix-700", label: "700", step: "shade", default: 62 },
    { name: "--sf-palette-mix-800", label: "800", step: "shade", default: 38 },
    { name: "--sf-palette-mix-900", label: "900", step: "shade", default: 18 },
    { name: "--sf-palette-mix-950", label: "950", step: "shade", default: 8 },
  ];

  const CURVE_PRESETS = [
    {
      label: "Softer", desc: "Low contrast palette",
      patch: {
        "--sf-palette-mix-50": "3%", "--sf-palette-mix-100": "6%", "--sf-palette-mix-200": "14%",
        "--sf-palette-mix-300": "30%", "--sf-palette-mix-400": "55%",
        "--sf-palette-mix-600": "72%", "--sf-palette-mix-700": "52%",
        "--sf-palette-mix-800": "28%", "--sf-palette-mix-900": "12%", "--sf-palette-mix-950": "5%",
      },
    },
    {
      label: "Default", desc: "Balanced contrast",
      patch: Object.fromEntries(MIX_STEPS.map((s) => [s.name, null])) as Record<string, null>,
    },
    {
      label: "Punchy", desc: "High contrast palette",
      patch: {
        "--sf-palette-mix-50": "6%", "--sf-palette-mix-100": "12%", "--sf-palette-mix-200": "28%",
        "--sf-palette-mix-300": "52%", "--sf-palette-mix-400": "78%",
        "--sf-palette-mix-600": "90%", "--sf-palette-mix-700": "72%",
        "--sf-palette-mix-800": "50%", "--sf-palette-mix-900": "26%", "--sf-palette-mix-950": "12%",
      },
    },
  ];

  const SEMANTIC_OVERRIDES = [
    { name: "--sf-color-link",        label: "Link" },
    { name: "--sf-color-link--visited", label: "Link visited" },
    { name: "--sf-color-mark-bg",     label: "Mark background" },
    { name: "--sf-color-mark-text",   label: "Mark text" },
    { name: "--sf-color-code-bg",     label: "Code background" },
    { name: "--sf-color-code-text",   label: "Code text" },
    { name: "--sf-color-overlay",     label: "Overlay" },
  ];

  const SWATCH_STEPS = ["50","100","200","300","400","500","600","700","800","900","950"];
  const BRAND_COLOR_KEYS = ["primary","secondary","tertiary","action","neutral"];

  // Separate contrast/focus knobs
  const contrastKnobs = (KNOBS_BY_DOMAIN["colors"] ?? []).filter(
    (k) => k.name === "--sf-contrast-bias" || k.name === "--sf-contrast-threshold"
  );
  const focusKnobs = (KNOBS_BY_DOMAIN["colors"] ?? []).filter(
    (k) => k.name === "--sf-focus-ring-width"
  );

  let showStatus = $state(false);
  let showSemanticOverrides = $state(false);
  let showGradients = $state(false);

  // Track which color rows are in Auto dark mode.
  // A key starts in auto only if its dark token is NOT already in overrides — otherwise the user
  // has an existing dark value (loaded from URL/localStorage) that we must not silently overwrite.
  let autoDarkSet = $state<Set<string>>(new Set(
    BRAND_SOURCES.filter(s => s.side === "light" && !(
      (BRAND_SOURCES.find(d => d.colorKey === s.colorKey && d.side === "dark")?.name ?? "") in overrides
    )).map(s => s.colorKey)
  ));

  let sourceTokenMap = $derived(() => {
    const map: Record<string, SlashedToken> = {};
    const ALL_SOURCES = [...BRAND_SOURCES, ...STATUS_SOURCES];
    for (const t of tokens) {
      if (ALL_SOURCES.some((s) => s.name === t.name)) map[t.name] = t;
    }
    return map;
  });

  let activeCurvePreset = $derived(CURVE_PRESETS.find((p) =>
    Object.entries(p.patch).every(([k, v]) =>
      v === null ? !(k in overrides) : overrides[k] === v
    )
  ));

  function getMixValue(s: typeof MIX_STEPS[0]): number {
    const raw = overrides[s.name];
    if (!raw) return s.default;
    return parseFloat(raw);
  }

  // Build brand pairs: group by colorKey then render light/dark
  const BRAND_PAIRS: [ColorSource, ColorSource | undefined][] = [];
  for (let i = 0; i < BRAND_SOURCES.length; i += 2) {
    BRAND_PAIRS.push([BRAND_SOURCES[i], BRAND_SOURCES[i + 1]]);
  }
  const STATUS_PAIRS: [ColorSource, ColorSource | undefined][] = [];
  for (let i = 0; i < STATUS_SOURCES.length; i += 2) {
    STATUS_PAIRS.push([STATUS_SOURCES[i], STATUS_SOURCES[i + 1]]);
  }

  function deriveDarkFromLight(lightVal: string, colorKey: string): string {
    const { l, c, h, valid } = parseOklch(lightVal);
    if (!valid) return lightVal;
    let darkL: number, darkC: number;
    if (colorKey === 'base') {
      darkL = Math.max(0.16, Math.min(1.18 - l, 0.24));
      darkC = c * 0.5;
    } else {
      darkL = Math.max(0.65, Math.min(0.95 - l * 0.5, 0.88));
      darkC = c * 0.9;
    }
    return stringifyOklch(darkL, darkC, h);
  }

  function handleLightChange(light: ColorSource, dark: ColorSource | undefined, newVal: string) {
    onSet(light.name, newVal);
  }

  function toggleDarkMode(colorKey: string, dark: ColorSource | undefined, lightName: string) {
    const darkOverridden = !!(dark && (dark.name in overrides));
    const effectivelyAuto = autoDarkSet.has(colorKey) && !darkOverridden;
    if (effectivelyAuto) {
      // Switch to manual — populate dark with the derived value as a starting point
      const lightVal = overrides[lightName] ?? BRAND_SOURCES.find(s => s.name === lightName)?.default ?? "";
      if (dark) onSet(dark.name, deriveDarkFromLight(lightVal, colorKey));
      autoDarkSet = new Set([...autoDarkSet].filter(k => k !== colorKey));
    } else {
      // Switch to auto — remove dark override so the CSS formula handles it at runtime
      if (dark) onBulkChange({ [dark.name]: null });
      autoDarkSet = new Set([...autoDarkSet, colorKey]);
    }
  }

  // Live contrast summary — resolves real on-screen colors from the preview.
  const KEY_CONTRAST_PAIRS = [
    { label: "Body text on surface",  fg: "var(--sf-color-text)",    bg: "var(--sf-color-surface)" },
    { label: "White on primary",      fg: "#ffffff",                 bg: "var(--sf-color-primary)" },
    { label: "Primary on surface",    fg: "var(--sf-color-primary)", bg: "var(--sf-color-surface)" },
  ];

  function pairRatio(fg: string, bg: string): number | null {
    void previewVersion.value;
    const f = resolveRgb(fg);
    const b = resolveRgb(bg);
    if (!f || !b) return null;
    return getContrastRatio(getRelativeLuminance(...f), getRelativeLuminance(...b));
  }
</script>

<div class="p-4 space-y-6">

  <!-- BRAND SOURCES -->
  <section class="space-y-3">
    <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Brand color sources</div>
    <p class="text-[10px] text-slate-600 leading-relaxed">
      OKLCH source values — all 200+ derived color steps are computed automatically.
    </p>
    <div class="space-y-3">
      {#each BRAND_PAIRS as [light, dark] (light.name)}
        {@const darkOverridden = !!(dark && (dark.name in overrides))}
        {@const isAutoMode = autoDarkSet.has(light.colorKey) && !darkOverridden}
        <div class="space-y-1">
          <div class="flex items-center justify-between">
            <div class="text-[9px] font-semibold text-slate-500 uppercase tracking-widest">{light.label}</div>
            {#if dark}
              <button
                onclick={() => toggleDarkMode(light.colorKey, dark, light.name)}
                class={`text-[8px] px-1.5 py-0.5 rounded border transition-all cursor-pointer ${
                  isAutoMode
                    ? "border-indigo-500/40 bg-indigo-500/15 text-indigo-300"
                    : "border-white/10 text-slate-500 hover:text-slate-300"
                }`}
              >{isAutoMode ? "Auto dark" : "Manual dark"}</button>
            {/if}
          </div>
          <OklchColorDesk
            label={`${light.label} (light)`}
            tokenName={light.name}
            value={overrides[light.name] ?? sourceTokenMap()[light.name]?.value ?? light.default}
            overridden={light.name in overrides}
            onChange={(v) => handleLightChange(light, dark, v)}
            onReset={() => onReset(light.name)}
          />
          <!-- Palette swatch strip for brand colors -->
          {#if BRAND_COLOR_KEYS.includes(light.colorKey)}
            <div class="flex gap-1 mt-1 pl-1">
              {#each SWATCH_STEPS as step (step)}
                {@const expr = `var(--sf-color-${light.colorKey}-${step})`}
                {@const resolved = paint(expr, expr)}
                <div
                  class="w-5 h-5 rounded border border-white/10"
                  style={`background: ${resolved}`}
                  title={`${light.colorKey}-${step} — ${resolved}`}
                ></div>
              {/each}
            </div>
          {/if}
          {#if dark && !isAutoMode}
            <OklchColorDesk
              label={`${dark.label} (dark mode)`}
              tokenName={dark.name}
              value={overrides[dark.name] ?? sourceTokenMap()[dark.name]?.value ?? dark.default}
              overridden={dark.name in overrides}
              onChange={(v) => onSet(dark.name, v)}
              onReset={() => onReset(dark.name)}
            />
          {:else if dark && isAutoMode}
            {@const derivedDark = deriveDarkFromLight(overrides[light.name] ?? light.default, light.colorKey)}
            <div class="flex items-center gap-1.5 text-[9px] text-slate-600 pl-1">
              <span
                class="w-3.5 h-3.5 rounded border border-white/10 shrink-0"
                style={`background: ${paint(derivedDark, derivedDark)}`}
                title={derivedDark}
              ></span>
              Dark: auto-derived ({derivedDark})
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </section>

  <div class="h-px bg-white/6"></div>

  <!-- STATUS SOURCES -->
  <section class="space-y-3">
    <button
      onclick={() => { showStatus = !showStatus; }}
      class="w-full flex items-center justify-between cursor-pointer"
    >
      <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status colors</div>
      <span class="text-[10px] text-slate-500">{showStatus ? "▲" : "▼"}</span>
    </button>
    {#if showStatus}
      <div class="space-y-3">
        {#each STATUS_PAIRS as [light, dark] (light.name)}
          <div class="space-y-1">
            <div class="text-[9px] font-semibold text-slate-500 uppercase tracking-widest">{light.label}</div>
            <OklchColorDesk
              label={`${light.label} light`}
              tokenName={light.name}
              value={overrides[light.name] ?? sourceTokenMap()[light.name]?.value ?? light.default}
              overridden={light.name in overrides}
              onChange={(v) => onSet(light.name, v)}
              onReset={() => onReset(light.name)}
            />
            {#if dark}
              <OklchColorDesk
                label={`${dark.label} dark`}
                tokenName={dark.name}
                value={overrides[dark.name] ?? sourceTokenMap()[dark.name]?.value ?? dark.default}
                overridden={dark.name in overrides}
                onChange={(v) => onSet(dark.name, v)}
                onReset={() => onReset(dark.name)}
              />
            {/if}
          </div>
        {/each}
      </div>
    {/if}
  </section>

  <div class="h-px bg-white/6"></div>

  <!-- TEXT CONTRAST -->
  <section class="space-y-4">
    <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Text contrast</div>
    <p class="text-[10px] text-slate-600 leading-relaxed">
      Controls whether text on brand-coloured surfaces is light or dark.
    </p>
    {#each contrastKnobs as k (k.name)}
      <PowerKnobRow
        knob={k}
        {overrides}
        onChange={(name, val) => val === null ? onReset(name) : onSet(name, val)}
      />
    {/each}

    <!-- Live contrast summary (links to the full WCAG tool) -->
    <div class="rounded-lg bg-white/4 border border-white/8 p-2.5 space-y-2">
      {#each KEY_CONTRAST_PAIRS as pair (pair.label)}
        {@const ratio = pairRatio(pair.fg, pair.bg)}
        {#if ratio !== null}
          <div class="flex items-center gap-2">
            <span
              class="w-6 h-6 rounded border border-white/10 shrink-0 flex items-center justify-center text-[10px] font-bold"
              style={`background:${paint(pair.bg, pair.bg)}; color:${paint(pair.fg, pair.fg)}`}
            >Aa</span>
            <span class="text-[9px] text-slate-500 flex-1 truncate">{pair.label}</span>
            <span class="text-[10px] font-mono font-bold text-slate-200">{ratio.toFixed(2)}:1</span>
            <span class={`text-[9px] font-bold px-1.5 py-0.5 rounded ${ratio >= 4.5 ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"}`}>
              {ratio >= 4.5 ? "AA" : ratio >= 3 ? "AA-L" : "✗"}
            </span>
          </div>
        {/if}
      {/each}
      {#if onSelectDomain}
        <button
          onclick={() => onSelectDomain?.("wcag")}
          class="w-full mt-1 py-1.5 rounded-lg bg-indigo-600/15 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold cursor-pointer hover:bg-indigo-600/25 transition-all"
        >Open contrast tool →</button>
      {/if}
    </div>

    <!-- Focus ring width — logically belongs with contrast/accessibility -->
    {#each focusKnobs as k (k.name)}
      <PowerKnobRow
        knob={k}
        {overrides}
        onChange={(name, val) => val === null ? onReset(name) : onSet(name, val)}
      />
    {/each}
  </section>

  <div class="h-px bg-white/6"></div>

  <!-- SHADE CURVE -->
  <section class="space-y-4">
    <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Shade / tint curve</div>
    <p class="text-[10px] text-slate-600 leading-relaxed">
      Controls how much color is mixed into each palette step. Step 500 is always the source color.
    </p>

    <div class="grid grid-cols-3 gap-1.5">
      {#each CURVE_PRESETS as p (p.label)}
        <button
          onclick={() => onBulkChange(p.patch as Record<string, string | null>)}
          class={`flex flex-col items-center gap-0.5 p-2.5 rounded-xl border transition-all cursor-pointer ${
            activeCurvePreset?.label === p.label
              ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-200"
              : "border-white/8 text-slate-400 hover:bg-white/5 hover:text-slate-200"
          }`}
        >
          <span class="text-[11px] font-bold">{p.label}</span>
          <span class="text-[9px] text-slate-500 text-center">{p.desc}</span>
        </button>
      {/each}
    </div>

    <!-- Tints -->
    <div>
      <div class="text-[10px] font-semibold text-slate-400 mb-2">Tints (50–400) — mixed toward surface</div>
      <div class="space-y-2">
        {#each MIX_STEPS.filter((s) => s.step === "tint") as s (s.name)}
          <SliderRow
            label={s.label}
            value={getMixValue(s)}
            min={0} max={100} step={1} unit="%"
            overridden={s.name in overrides}
            onChange={(v) => onSet(s.name, `${v}%`)}
            onReset={() => onReset(s.name)}
          />
        {/each}
      </div>
    </div>

    <!-- Shades -->
    <div>
      <div class="text-[10px] font-semibold text-slate-400 mb-2">Shades (600–950) — mixed toward text</div>
      <div class="space-y-2">
        {#each MIX_STEPS.filter((s) => s.step === "shade") as s (s.name)}
          <SliderRow
            label={s.label}
            value={getMixValue(s)}
            min={0} max={100} step={1} unit="%"
            overridden={s.name in overrides}
            onChange={(v) => onSet(s.name, `${v}%`)}
            onReset={() => onReset(s.name)}
          />
        {/each}
      </div>
    </div>

    <!-- Curve preview -->
    <div class="bg-white/4 rounded-xl border border-white/8 p-3">
      <div class="text-[9px] text-slate-600 mb-2">Curve shape preview</div>
      <div class="flex items-end gap-0.5 h-12">
        {#each MIX_STEPS as s (s.name)}
          {@const val = getMixValue(s)}
          <div class="flex-1 flex flex-col items-center gap-0.5">
            <div
              class={`w-full rounded-sm ${s.step === "tint" ? "bg-indigo-400/60" : "bg-indigo-700/70"}`}
              style={`height: ${(val / 100) * 44}px; min-height: 2px`}
            ></div>
            <span class="text-[7px] font-mono text-slate-600">{s.label}</span>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <div class="h-px bg-white/6"></div>

  <!-- GRADIENTS -->
  <section class="space-y-3">
    <button
      onclick={() => { showGradients = !showGradients; }}
      class="w-full flex items-center justify-between cursor-pointer"
    >
      <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Gradients</div>
      <span class="text-[10px] text-slate-500">{showGradients ? "▲" : "▼"}</span>
    </button>
    {#if showGradients}
      <p class="text-[10px] text-slate-600 leading-relaxed">
        Auto-derived from your brand colors. Edit the raw value to fully customise.
      </p>
      {#each ["brand", "fade"] as grp (grp)}
        <div class="text-[9px] font-semibold text-slate-500 uppercase tracking-widest pt-1">{grp === "brand" ? "Brand & surface" : "Edge fades"}</div>
        <div class="space-y-2">
          {#each GRADIENT_TOKENS.filter((g) => g.group === grp) as g (g.name)}
            {@const expr = `var(${g.name})`}
            <div class="rounded-lg border border-white/8 bg-white/3 overflow-hidden">
              <div class="h-9 w-full" style={`background:${paintBg(expr, expr)}`}></div>
              <div class="flex items-center gap-2 px-2 py-1.5">
                <span class="text-[10px] font-semibold text-slate-300 w-16 shrink-0">{g.label}</span>
                <input
                  type="text"
                  value={overrides[g.name] ?? ""}
                  placeholder="auto-derived"
                  onchange={(e) => {
                    const v = (e.target as HTMLInputElement).value.trim();
                    v ? onSet(g.name, v) : onReset(g.name);
                  }}
                  class="flex-1 min-w-0 bg-white/5 border border-white/10 rounded px-1.5 py-0.5 text-[9px] font-mono text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
                />
                {#if g.name in overrides}
                  <button onclick={() => onReset(g.name)} class="text-[8px] text-slate-500 hover:text-rose-400 cursor-pointer shrink-0">reset</button>
                {/if}
              </div>
            </div>
          {/each}
        </div>
      {/each}
    {/if}
  </section>

  <div class="h-px bg-white/6"></div>

  <!-- SEMANTIC OVERRIDES -->
  <section class="space-y-3">
    <button
      onclick={() => { showSemanticOverrides = !showSemanticOverrides; }}
      class="w-full flex items-center justify-between cursor-pointer"
    >
      <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Semantic overrides</div>
      <span class="text-[10px] text-slate-500">{showSemanticOverrides ? "▲" : "▼"}</span>
    </button>
    {#if showSemanticOverrides}
      <p class="text-[10px] text-slate-600 leading-relaxed">
        Direct color overrides for tokens the framework auto-derives. Use for edge cases.
      </p>
      <div class="space-y-2">
        {#each SEMANTIC_OVERRIDES as s (s.name)}
          {@const resolved = paint(`var(${s.name})`, "")}
          <div>
            <div class="text-[10px] font-semibold text-slate-400 mb-1">{s.label}</div>
            <div class="flex items-center gap-2">
              <span class="relative w-7 h-7 rounded border border-white/10 shrink-0 overflow-hidden" style={`background:${(s.name in overrides ? "" : resolved) || "transparent"}`}>
                <input
                  type="color"
                  value={overrides[s.name] ?? "#6366f1"}
                  oninput={(e) => onSet(s.name, (e.target as HTMLInputElement).value)}
                  class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {#if s.name in overrides}
                  <span class="absolute inset-0" style={`background:${overrides[s.name]}`}></span>
                {/if}
              </span>
              <span class="text-[9px] font-mono text-slate-500 flex-1 truncate">{overrides[s.name] ?? (resolved ? `auto-derived · ${resolved}` : "auto-derived")}</span>
              {#if s.name in overrides}
                <button onclick={() => onReset(s.name)} class="text-[8px] text-slate-500 hover:text-rose-400 cursor-pointer shrink-0">reset</button>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </section>

  <div class="rounded-lg bg-white/3 border border-white/6 p-3">
    <p class="text-[10px] text-slate-500 leading-relaxed">
      <span class="text-slate-400 font-semibold">All tokens tab</span> — override individual color steps (50–950), semantic aliases, or surface tokens directly.
    </p>
  </div>
</div>
