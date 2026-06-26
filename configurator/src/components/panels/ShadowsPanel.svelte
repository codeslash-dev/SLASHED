<script lang="ts">
  import { KNOBS_BY_DOMAIN } from '../../lib/powerKnobs';
  import { SHADOW_PRESETS } from '../../lib/stylePresets';
  import PowerKnobRow from '../inputs/PowerKnobRow.svelte';
  import StylePresetCards from '../inputs/StylePresetCards.svelte';
  import SliderRow from '../inputs/SliderRow.svelte';

  let { overrides, onSet, onReset, onBulkChange }: {
    overrides: Record<string, string>;
    onSet: (name: string, value: string) => void;
    onReset: (name: string) => void;
    onBulkChange: (patch: Record<string, string | null>) => void;
  } = $props();

  const SHADOW_STEPS = ["xs", "s", "m", "l", "xl", "2xl"];

  const knobs = KNOBS_BY_DOMAIN["shadows"] ?? [];

  let lightness = $derived(parseFloat(overrides["--sf-shadow-lightness"] ?? "0.15"));
  let shadowColor = $derived(overrides["--sf-shadow-color"] ?? "");
  let shadowGlowColor = $derived(overrides["--sf-shadow-glow-color"] ?? "");
  let glowDisabled = $derived(overrides["--sf-shadow-glow"] === "none");
</script>

<div class="p-4 space-y-5">

  <!-- Elevation presets -->
  <StylePresetCards
    label="Elevation preset"
    presets={SHADOW_PRESETS}
    {overrides}
    onApply={onBulkChange}
  />

  <div class="h-px bg-white/6"></div>

  <!-- SHADOW APPEARANCE -->
  <section class="space-y-4">
    <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Shadow appearance</div>

    <div class="space-y-4">
      {#each knobs as k (k.name)}
        <PowerKnobRow
          knob={k}
          {overrides}
          onChange={(name, val) => val === null ? onReset(name) : onSet(name, val)}
        />
      {/each}
    </div>

    <SliderRow
      label="Shadow lightness" value={lightness} min={0} max={0.5} step={0.01}
      help="OKLCH lightness of the shadow color. Lower = darker, more visible shadows."
      overridden={"--sf-shadow-lightness" in overrides}
      onChange={(v) => onSet("--sf-shadow-lightness", String(v))}
      onReset={() => onReset("--sf-shadow-lightness")}
    />
  </section>

  <div class="h-px bg-white/6"></div>

  <!-- SHADOW COLOR -->
  <section class="space-y-4">
    <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Shadow color</div>
    <div>
      <div class="text-[10px] font-semibold text-slate-400 mb-1.5">Shadow color</div>
      <div class="flex items-center gap-2">
        <input
          type="color"
          value={shadowColor || "#1a1a2e"}
          oninput={(e) => onSet("--sf-shadow-color", (e.target as HTMLInputElement).value)}
          class="w-8 h-8 rounded border border-white/10 bg-transparent cursor-pointer"
        />
        <span class="text-[9px] font-mono text-slate-400 flex-1">{shadowColor || "auto (neutral hue)"}</span>
        {#if "--sf-shadow-color" in overrides}
          <button onclick={() => onReset("--sf-shadow-color")} class="text-[8px] text-slate-500 hover:text-rose-400 cursor-pointer">reset</button>
        {/if}
      </div>
      <p class="text-[9px] text-slate-600 mt-1">Warm, cool or brand-tinted shadows. Default uses neutral hue.</p>
    </div>
  </section>

  <div class="h-px bg-white/6"></div>

  <!-- GLOW -->
  <section class="space-y-3">
    <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Glow</div>

    <!-- Glow toggle -->
    <div class="flex items-center justify-between p-3 rounded-xl bg-white/4 border border-white/8">
      <div>
        <div class="text-[11px] font-semibold text-slate-200">Shadow glow</div>
        <div class="text-[9px] text-slate-500 mt-0.5">Ambient glow on elevated surfaces</div>
      </div>
      <button
        onclick={() => {
          if (glowDisabled) onReset("--sf-shadow-glow");
          else onSet("--sf-shadow-glow", "none");
        }}
        class={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
          !glowDisabled ? "bg-indigo-600" : "bg-white/10"
        }`}
      >
        <div class={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
          !glowDisabled ? "translate-x-4" : "translate-x-0.5"
        }`}></div>
      </button>
    </div>

    {#if !glowDisabled}
      <div>
        <div class="text-[10px] font-semibold text-slate-400 mb-1.5">Glow color</div>
        <div class="flex items-center gap-2">
          <input
            type="color"
            value={shadowGlowColor || "#6366f1"}
            oninput={(e) => onSet("--sf-shadow-glow-color", (e.target as HTMLInputElement).value)}
            class="w-8 h-8 rounded border border-white/10 bg-transparent cursor-pointer"
          />
          <span class="text-[9px] font-mono text-slate-400 flex-1">{shadowGlowColor || "default (primary color)"}</span>
          {#if "--sf-shadow-glow-color" in overrides}
            <button onclick={() => onReset("--sf-shadow-glow-color")} class="text-[8px] text-slate-500 hover:text-rose-400 cursor-pointer">reset</button>
          {/if}
        </div>
        <p class="text-[9px] text-slate-600 mt-1">Which brand color radiates the glow. Defaults to primary.</p>
      </div>
    {/if}
  </section>

  <div class="h-px bg-white/6"></div>

  <!-- Elevation preview — uses CSS custom properties via the injected style tag -->
  <div>
    <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Elevation preview</div>
    <div class="bg-white/4 rounded-xl border border-white/8 p-4 flex gap-4 flex-wrap items-end justify-center">
      {#each SHADOW_STEPS as step, i (step)}
        <div class="flex flex-col items-center gap-2">
          <div
            class="bg-[#1a1a2e] border border-white/8 rounded-lg"
            style={`width: ${40 + i * 4}px; height: ${40 + i * 4}px; box-shadow: var(--sf-shadow-${step})`}
          ></div>
          <span class="text-[8px] font-mono text-slate-600">{step}</span>
        </div>
      {/each}
    </div>
  </div>
</div>
