<script lang="ts">
  import type { SlashedToken } from '../../types';
  import { KNOBS_BY_DOMAIN } from '../../lib/powerKnobs';
  import OklchColorDesk from '../inputs/OklchColorDesk.svelte';
  import PowerKnobRow from '../inputs/PowerKnobRow.svelte';
  import SliderRow from '../inputs/SliderRow.svelte';

  let { tokens, overrides, onSet, onReset, onBulkChange }: {
    tokens: SlashedToken[];
    overrides: Record<string, string>;
    onSet: (name: string, value: string) => void;
    onReset: (name: string) => void;
    onBulkChange: (patch: Record<string, string | null>) => void;
  } = $props();

  const BRAND_SOURCES = [
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

  const STATUS_SOURCES = [
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

  const SWATCH_STEPS = ["50","100","200","300","400","500","600","700","800","900","950"];
  const BRAND_COLOR_KEYS = ["primary","secondary","tertiary","action","neutral"];

  const knobs = KNOBS_BY_DOMAIN["colors"] ?? [];
  let showStatus = $state(false);

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

  // Build brand pairs: group sources by colorKey then render light/dark side by side
  const BRAND_PAIRS: [typeof BRAND_SOURCES[0], typeof BRAND_SOURCES[0] | undefined][] = [];
  for (let i = 0; i < BRAND_SOURCES.length; i += 2) {
    BRAND_PAIRS.push([BRAND_SOURCES[i], BRAND_SOURCES[i + 1]]);
  }
  const STATUS_PAIRS: [typeof STATUS_SOURCES[0], typeof STATUS_SOURCES[0] | undefined][] = [];
  for (let i = 0; i < STATUS_SOURCES.length; i += 2) {
    STATUS_PAIRS.push([STATUS_SOURCES[i], STATUS_SOURCES[i + 1]]);
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
          <!-- Palette swatch strip for brand colors -->
          {#if BRAND_COLOR_KEYS.includes(light.colorKey)}
            <div class="flex gap-1 mt-1 pl-1">
              {#each SWATCH_STEPS as step (step)}
                <div
                  class="w-5 h-5 rounded border border-white/10"
                  style={`background: var(--sf-color-${light.colorKey}-${step})`}
                  title={`${light.colorKey}-${step}`}
                ></div>
              {/each}
            </div>
          {/if}
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

  <!-- GLOBAL ADJUSTMENTS -->
  <section class="space-y-4">
    <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Global adjustments</div>
    {#each knobs as k (k.name)}
      <PowerKnobRow
        knob={k}
        {overrides}
        onChange={(name, val) => val === null ? onReset(name) : onSet(name, val)}
      />
    {/each}
  </section>

  <div class="rounded-lg bg-white/3 border border-white/6 p-3">
    <p class="text-[10px] text-slate-500 leading-relaxed">
      <span class="text-slate-400 font-semibold">All tokens tab</span> — override individual color steps (50–950), semantic aliases, or surface tokens directly.
    </p>
  </div>
</div>
