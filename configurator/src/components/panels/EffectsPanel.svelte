<script lang="ts">
  import SliderRow from '../inputs/SliderRow.svelte';

  let { overrides, onSet, onReset }: {
    overrides: Record<string, string>;
    onSet: (name: string, value: string) => void;
    onReset: (name: string) => void;
  } = $props();

  const SCRIM_DIRECTIONS = [
    { label: "To top",    value: "to top" },
    { label: "To bottom", value: "to bottom" },
    { label: "To left",   value: "to left" },
    { label: "To right",  value: "to right" },
  ];

  function parseNum(val: string | undefined, fallback: number, strip?: string): number {
    if (!val) return fallback;
    const v = parseFloat(strip ? val.replace(strip, "") : val);
    return isNaN(v) ? fallback : v;
  }

  let blur            = $derived(parseNum(overrides["--sf-blur"], 12, "px"));
  let opacityMuted    = $derived(parseNum(overrides["--sf-opacity-muted"], 0.5));
  let opacityDisabled = $derived(parseNum(overrides["--sf-opacity-disabled"], 0.45));
  let scrimDir        = $derived(overrides["--sf-scrim-direction"] ?? "to top");
</script>

<div class="p-4 space-y-6">

  <!-- BLUR -->
  <section class="space-y-3">
    <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Blur</div>
    <SliderRow
      label="Blur radius" value={blur} min={0} max={48} step={1} unit="px"
      help="--sf-blur — used for frosted glass, modals, tooltips"
      overridden={"--sf-blur" in overrides}
      onChange={(v) => onSet("--sf-blur", `${v}px`)}
      onReset={() => onReset("--sf-blur")}
    />
    <!-- Blur preview -->
    <div class="bg-white/4 rounded-xl border border-white/8 p-4 flex gap-3 items-center justify-center overflow-hidden relative">
      <div class="absolute inset-0 grid grid-cols-4 grid-rows-3 gap-px opacity-30">
        {#each Array.from({ length: 12 }) as _, i (i)}
          <div class={i % 3 === 0 ? "bg-indigo-500/50" : i % 3 === 1 ? "bg-purple-500/40" : "bg-blue-500/30"}></div>
        {/each}
      </div>
      <div
        class="relative z-10 w-20 h-12 rounded-lg border border-white/20 bg-white/10 flex items-center justify-center"
        style={`backdrop-filter: blur(${blur}px)`}
      >
        <span class="text-[9px] font-mono text-white/70">{blur}px</span>
      </div>
    </div>
  </section>

  <div class="h-px bg-white/6"></div>

  <!-- OPACITY -->
  <section class="space-y-4">
    <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Opacity</div>
    <SliderRow
      label="Muted opacity" value={opacityMuted} min={0} max={1} step={0.05}
      help="--sf-opacity-muted — secondary text, icons, and placeholder content"
      overridden={"--sf-opacity-muted" in overrides}
      onChange={(v) => onSet("--sf-opacity-muted", String(v))}
      onReset={() => onReset("--sf-opacity-muted")}
    />
    <SliderRow
      label="Disabled opacity" value={opacityDisabled} min={0} max={1} step={0.05}
      help="--sf-opacity-disabled — disabled form controls and interactive elements"
      overridden={"--sf-opacity-disabled" in overrides}
      onChange={(v) => onSet("--sf-opacity-disabled", String(v))}
      onReset={() => onReset("--sf-opacity-disabled")}
    />
    <!-- Opacity preview -->
    <div class="bg-white/4 rounded-xl border border-white/8 p-3 space-y-2">
      <div class="flex items-center gap-3">
        <span class="text-[9px] text-slate-600 w-16">muted</span>
        <div class="flex-1 h-4 bg-indigo-400 rounded" style={`opacity: ${opacityMuted}`}></div>
        <span class="text-[9px] font-mono text-slate-500 w-8">{opacityMuted}</span>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-[9px] text-slate-600 w-16">disabled</span>
        <div class="flex-1 h-4 bg-indigo-400 rounded" style={`opacity: ${opacityDisabled}`}></div>
        <span class="text-[9px] font-mono text-slate-500 w-8">{opacityDisabled}</span>
      </div>
    </div>
  </section>

  <div class="h-px bg-white/6"></div>

  <!-- SCRIM -->
  <section class="space-y-4">
    <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Scrim overlay</div>
    <p class="text-[10px] text-slate-600 leading-relaxed">
      Gradient overlay for hero images and media content. Used by the <code class="text-slate-400">.sf-scrim</code> macro.
    </p>

    <div>
      <div class="text-[10px] font-semibold text-slate-400 mb-2">Direction</div>
      <div class="grid grid-cols-2 gap-1">
        {#each SCRIM_DIRECTIONS as d (d.value)}
          <button
            onclick={() => d.value === "to top" ? onReset("--sf-scrim-direction") : onSet("--sf-scrim-direction", d.value)}
            class={`py-2 px-3 rounded-lg text-[10px] border transition-all cursor-pointer text-left ${
              scrimDir === d.value
                ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-200"
                : "border-white/8 text-slate-400 hover:bg-white/5 hover:text-slate-200"
            }`}
          >
            {d.label}
          </button>
        {/each}
      </div>
    </div>

    <!-- Scrim preview -->
    <div class="rounded-xl overflow-hidden border border-white/8" style="height: 80px">
      <div
        class="w-full h-full relative"
        style="background: linear-gradient(135deg, oklch(0.3 0.15 264), oklch(0.25 0.1 300))"
      >
        <div
          class="absolute inset-0"
          style={`background: linear-gradient(${scrimDir}, oklch(0 0 0 / 0.6), transparent)`}
        ></div>
        <div class="absolute bottom-2 left-3 text-[10px] text-white/80 font-medium">Scrim preview</div>
      </div>
    </div>
  </section>
</div>
