<script lang="ts">
  import { KNOBS_BY_DOMAIN } from '../../lib/powerKnobs';
  import { CORNER_PRESETS } from '../../lib/stylePresets';
  import PowerKnobRow from '../inputs/PowerKnobRow.svelte';
  import StylePresetCards from '../inputs/StylePresetCards.svelte';
  import SliderRow from '../inputs/SliderRow.svelte';

  let { overrides, onSet, onReset, onBulkChange }: {
    overrides: Record<string, string>;
    onSet: (name: string, value: string) => void;
    onReset: (name: string) => void;
    onBulkChange: (patch: Record<string, string | null>) => void;
  } = $props();

  const BORDER_STYLES = ["solid", "dashed", "dotted"];
  const RADIUS_STEPS = ["xs", "s", "m", "l", "xl", "2xl", "full"];
  const BASE_RADII: Record<string, number> = { xs: 2, s: 4, m: 6, l: 10, xl: 14, "2xl": 20, full: 9999 };

  const RADIUS_FINE: Array<{ step: string; name: string; default: number; max: number; step_size: number }> = [
    { step: "xs",  name: "--sf-radius-xs",  default: 2,  max: 16, step_size: 0.5 },
    { step: "s",   name: "--sf-radius-s",   default: 4,  max: 24, step_size: 0.5 },
    { step: "m",   name: "--sf-radius-m",   default: 6,  max: 32, step_size: 1   },
    { step: "l",   name: "--sf-radius-l",   default: 10, max: 48, step_size: 1   },
    { step: "xl",  name: "--sf-radius-xl",  default: 14, max: 64, step_size: 1   },
    { step: "2xl", name: "--sf-radius-2xl", default: 20, max: 80, step_size: 2   },
  ];

  const knobs = KNOBS_BY_DOMAIN["borders"] ?? [];

  let showFineTune = $state(false);

  function parseNum(val: string | undefined, fallback: number, strip?: string): number {
    if (!val) return fallback;
    const v = parseFloat(strip ? val.replace(strip, "") : val);
    return isNaN(v) ? fallback : v;
  }

  let radiusScale  = $derived(parseNum(overrides["--sf-radius-scale"], 1));
  let borderScale  = $derived(parseNum(overrides["--sf-border-scale"], 1));
  let focusWidth   = $derived(parseNum(overrides["--sf-focus-ring-width"], 2, "px"));
  let focusOffset  = $derived(parseNum(overrides["--sf-focus-ring-offset"], 2, "px"));

  function getStyleCurrent(tokenName: string, defaultVal: string): string {
    return overrides[tokenName] ?? defaultVal;
  }

  function getRadiusValue(r: typeof RADIUS_FINE[0]): number {
    const raw = overrides[r.name];
    if (!raw) return r.default;
    return parseFloat(raw);
  }
</script>

<div class="p-4 space-y-5">

  <!-- Corner style presets -->
  <StylePresetCards
    label="Corner style"
    presets={CORNER_PRESETS}
    {overrides}
    onApply={onBulkChange}
  />

  <div class="h-px bg-white/6"></div>

  <!-- BORDER SCALE -->
  <section class="space-y-3">
    <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Border widths</div>
    <SliderRow
      label="Border scale" value={borderScale} min={0} max={4} step={0.25}
      help="Multiplier applied to all border widths. 0 hides all borders."
      overridden={"--sf-border-scale" in overrides}
      onChange={(v) => onSet("--sf-border-scale", String(v))}
      onReset={() => onReset("--sf-border-scale")}
    />

    <!-- Width preview -->
    <div class="bg-white/4 rounded-xl border border-white/8 p-3 space-y-2">
      {#each [1, 2, 3, 4] as base (base)}
        <div class="flex items-center gap-3">
          <span class="text-[9px] font-mono text-slate-600 w-10">{base}px →</span>
          <div
            class="flex-1 bg-indigo-400/50 rounded"
            style={`height: ${Math.max(base * borderScale, 0.5)}px`}
          ></div>
          <span class="text-[9px] font-mono text-slate-500 w-10 text-right">
            {(base * borderScale).toFixed(1)}px
          </span>
        </div>
      {/each}
    </div>
  </section>

  <div class="h-px bg-white/6"></div>

  <!-- LINE STYLES -->
  <section class="space-y-4">
    <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Line styles</div>

    {#each [
      { label: "Border style", token: "--sf-border-style", default: "solid" },
      { label: "Divider style", token: "--sf-divider-style", default: "solid" },
    ] as row (row.token)}
      <div>
        <div class="text-[10px] font-semibold text-slate-400 mb-2">{row.label}</div>
        <div class="flex gap-1">
          {#each BORDER_STYLES as s (s)}
            {@const current = getStyleCurrent(row.token, row.default)}
            <button
              onclick={() => s === row.default ? onReset(row.token) : onSet(row.token, s)}
              class={`flex-1 py-2 rounded-lg text-[10px] border transition-all cursor-pointer capitalize ${
                current === s
                  ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-200"
                  : "border-white/8 text-slate-400 hover:bg-white/5 hover:text-slate-200"
              }`}
            >
              <span
                class="block mx-auto mb-1"
                style={`width: 28px; height: 0; border-bottom: 2px ${s} currentColor; opacity: 0.7`}
              ></span>
              {s}
            </button>
          {/each}
        </div>
      </div>
    {/each}
  </section>

  <div class="h-px bg-white/6"></div>

  <!-- FOCUS RING -->
  <section class="space-y-3">
    <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Focus ring</div>
    <SliderRow
      label="Ring width" value={focusWidth} min={0} max={6} step={0.5} unit="px"
      help="Thickness of the keyboard focus indicator"
      overridden={"--sf-focus-ring-width" in overrides}
      onChange={(v) => onSet("--sf-focus-ring-width", `${v}px`)}
      onReset={() => onReset("--sf-focus-ring-width")}
    />
    <SliderRow
      label="Ring offset" value={focusOffset} min={0} max={8} step={0.5} unit="px"
      help="Gap between element edge and focus ring"
      overridden={"--sf-focus-ring-offset" in overrides}
      onChange={(v) => onSet("--sf-focus-ring-offset", `${v}px`)}
      onReset={() => onReset("--sf-focus-ring-offset")}
    />
    <!-- Focus ring preview -->
    <div class="bg-white/4 rounded-xl border border-white/8 p-4 flex items-center justify-center">
      <div
        class="px-4 py-2 bg-indigo-600/30 rounded-lg text-[11px] text-indigo-200"
        style={`outline: ${focusWidth}px solid oklch(0.7 0.2 235); outline-offset: ${focusOffset}px`}
      >
        Focus preview
      </div>
    </div>
  </section>

  <div class="h-px bg-white/6"></div>

  <!-- RADIUS SCALE KNOB -->
  <div>
    <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Radius scale</div>
    <div class="space-y-4">
      {#each knobs as k (k.name)}
        <PowerKnobRow
          knob={k}
          {overrides}
          onChange={(name, val) => val === null ? onReset(name) : onSet(name, val)}
        />
      {/each}
    </div>
  </div>

  <!-- Fine-tune radius steps collapsible -->
  <div>
    <button
      onclick={() => { showFineTune = !showFineTune; }}
      class="w-full flex items-center justify-between text-[10px] font-semibold text-slate-400 hover:text-slate-200 transition-colors cursor-pointer py-1"
    >
      <span>Fine-tune radius steps</span>
      <span class="text-[10px] text-slate-500">{showFineTune ? "▲" : "▼"}</span>
    </button>
    {#if showFineTune}
      <div class="mt-2 space-y-2 pl-2 border-l border-white/10">
        {#each RADIUS_FINE as r (r.name)}
          <SliderRow
            label={r.step}
            value={getRadiusValue(r)}
            min={0}
            max={r.max}
            step={r.step_size}
            unit="px"
            overridden={r.name in overrides}
            onChange={(v) => onSet(r.name, `${v}px`)}
            onReset={() => onReset(r.name)}
          />
        {/each}
      </div>
    {/if}
  </div>

  <!-- Radius preview -->
  <div>
    <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Radius preview</div>
    <div class="bg-white/4 rounded-xl border border-white/8 p-4">
      <div class="flex gap-3 flex-wrap">
        {#each RADIUS_STEPS as step (step)}
          {@const base = BASE_RADII[step] ?? 6}
          {@const computed = step === "full" ? 9999 : base * radiusScale}
          <div class="flex flex-col items-center gap-1">
            <div
              class="w-10 h-10 bg-indigo-500/40 border border-indigo-500/30"
              style={`border-radius: ${Math.min(computed, 9999)}px`}
            ></div>
            <span class="text-[8px] font-mono text-slate-600">{step}</span>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>
