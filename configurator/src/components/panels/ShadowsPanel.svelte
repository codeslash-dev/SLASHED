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

  let strengthVal = $derived(() => {
    const raw = overrides["--sf-shadow-strength"];
    const shadowKnob = knobs[0];
    if (raw !== undefined) {
      return shadowKnob?.decode ? shadowKnob.decode(raw) : parseFloat(raw);
    }
    return (shadowKnob?.default as number) ?? 0.08;
  });
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

  <!-- Elevation preview -->
  <div>
    <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Elevation preview</div>
    <div class="bg-white/4 rounded-xl border border-white/8 p-4 flex gap-4 flex-wrap items-end justify-center">
      {#each SHADOW_STEPS as step, i (step)}
        {@const opacity = strengthVal() * (0.3 + i * 0.14)}
        {@const blur = 4 + i * 6}
        {@const spread = i}
        {@const y = 2 + i * 3}
        <div class="flex flex-col items-center gap-2">
          <div
            class="bg-[#1a1a2e] border border-white/8 rounded-lg"
            style={`width: ${40 + i * 4}px; height: ${40 + i * 4}px; box-shadow: 0 ${y}px ${blur}px ${spread}px oklch(${lightness} 0.02 260 / ${opacity})`}
          ></div>
          <span class="text-[8px] font-mono text-slate-600">{step}</span>
        </div>
      {/each}
    </div>
  </div>
</div>
