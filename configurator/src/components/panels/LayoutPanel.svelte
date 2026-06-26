<script lang="ts">
  import type { SlashedToken } from '../../types';
  import SliderRow from '../inputs/SliderRow.svelte';

  let { overrides, onSet, onReset }: {
    overrides: Record<string, string>;
    onSet: (name: string, value: string) => void;
    onReset: (name: string) => void;
  } = $props();

  function parseRem(val: string | undefined, fallback: number): number {
    if (!val) return fallback;
    const v = parseFloat(val);
    return isNaN(v) ? fallback : v;
  }

  let containerNarrow   = $derived(parseRem(overrides["--sf-container-narrow"],  38));
  let containerProse    = $derived(parseRem(overrides["--sf-container-prose"],   65));
  let containerDefault  = $derived(parseRem(overrides["--sf-container-default"], 75));
  let containerWide     = $derived(parseRem(overrides["--sf-container-wide"],    90));
  let gridMin           = $derived(parseRem(overrides["--sf-grid-min"],          16));
  let headerMobile      = $derived(parseRem(overrides["--sf-header-height-mobile"],  3.5));
  let headerDesktop     = $derived(parseRem(overrides["--sf-header-height-desktop"], 5));
  let sidebarWidth      = $derived(parseRem(overrides["--sf-sidebar-width"],     18));
</script>

<div class="p-4 space-y-6">

  <!-- CONTAINERS -->
  <section class="space-y-4">
    <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Container widths</div>

    <SliderRow
      label="Narrow" value={containerNarrow} min={20} max={60} step={1} unit="rem"
      help="sf-container-narrow — tight single-column content"
      overridden={"--sf-container-narrow" in overrides}
      onChange={(v) => onSet("--sf-container-narrow", `${v}rem`)}
      onReset={() => onReset("--sf-container-narrow")}
    />
    <SliderRow
      label="Prose" value={containerProse} min={40} max={90} step={1} unit="ch"
      help="sf-container-prose — optimal reading line length"
      overridden={"--sf-container-prose" in overrides}
      onChange={(v) => onSet("--sf-container-prose", `${v}ch`)}
      onReset={() => onReset("--sf-container-prose")}
    />
    <SliderRow
      label="Default" value={containerDefault} min={50} max={120} step={1} unit="rem"
      help="sf-container (no modifier) — main page content"
      overridden={"--sf-container-default" in overrides}
      onChange={(v) => onSet("--sf-container-default", `${v}rem`)}
      onReset={() => onReset("--sf-container-default")}
    />
    <SliderRow
      label="Wide" value={containerWide} min={60} max={160} step={1} unit="rem"
      help="sf-container-wide — dashboard / full-bleed layouts"
      overridden={"--sf-container-wide" in overrides}
      onChange={(v) => onSet("--sf-container-wide", `${v}rem`)}
      onReset={() => onReset("--sf-container-wide")}
    />

    <!-- Visual width preview -->
    <div class="bg-white/4 rounded-xl border border-white/8 p-3 space-y-2">
      {#each [
        { label: "narrow",  value: containerNarrow,  max: containerWide, unit: "rem" },
        { label: "prose",   value: containerProse,   max: containerWide * 1.5, unit: "ch" },
        { label: "default", value: containerDefault, max: containerWide, unit: "rem" },
        { label: "wide",    value: containerWide,    max: containerWide, unit: "rem" },
      ] as row (row.label)}
        <div class="flex items-center gap-2">
          <span class="text-[9px] font-mono text-slate-600 w-12 text-right shrink-0">{row.label}</span>
          <div class="flex-1 h-4 bg-white/5 rounded overflow-hidden">
            <div
              class="h-full bg-indigo-500/30 border-r border-indigo-400/40 rounded"
              style={`width: ${Math.min((row.value / row.max) * 100, 100)}%`}
            ></div>
          </div>
          <span class="text-[9px] font-mono text-slate-500 w-14 shrink-0">{row.value}{row.unit}</span>
        </div>
      {/each}
    </div>
  </section>

  <div class="h-px bg-white/6"></div>

  <!-- AUTO GRID -->
  <section class="space-y-4">
    <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Auto grid</div>
    <SliderRow
      label="Grid min cell width" value={gridMin} min={8} max={40} step={0.5} unit="rem"
      help="sf-grid minimum column width — browser auto-fills columns"
      overridden={"--sf-grid-min" in overrides}
      onChange={(v) => onSet("--sf-grid-min", `${v}rem`)}
      onReset={() => onReset("--sf-grid-min")}
    />
    <div class="bg-white/4 rounded-xl border border-white/8 p-3">
      <div class="text-[9px] text-slate-600 mb-2 font-mono">Preview at 360px panel width</div>
      <div
        class="grid gap-1"
        style={`grid-template-columns: repeat(auto-fill, minmax(${Math.min(gridMin * 16 * (360 / 1200), 120)}px, 1fr))`}
      >
        {#each Array.from({ length: 8 }) as _, i (i)}
          <div class="h-8 bg-indigo-500/20 border border-indigo-500/20 rounded text-[8px] font-mono text-indigo-400/60 flex items-center justify-center">col</div>
        {/each}
      </div>
    </div>
  </section>

  <div class="h-px bg-white/6"></div>

  <!-- HEADER -->
  <section class="space-y-4">
    <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Header height</div>
    <SliderRow
      label="Mobile" value={headerMobile} min={2} max={8} step={0.25} unit="rem"
      help="--sf-header-height-mobile — sticky header height on small screens"
      overridden={"--sf-header-height-mobile" in overrides}
      onChange={(v) => onSet("--sf-header-height-mobile", `${v}rem`)}
      onReset={() => onReset("--sf-header-height-mobile")}
    />
    <SliderRow
      label="Desktop" value={headerDesktop} min={3} max={10} step={0.25} unit="rem"
      help="--sf-header-height-desktop — sticky header height on large screens"
      overridden={"--sf-header-height-desktop" in overrides}
      onChange={(v) => onSet("--sf-header-height-desktop", `${v}rem`)}
      onReset={() => onReset("--sf-header-height-desktop")}
    />
    <div class="bg-white/4 rounded-xl border border-white/8 overflow-hidden">
      <div
        class="flex items-center px-3 bg-indigo-500/10 border-b border-white/8"
        style={`height: ${Math.min(headerMobile * 12, 64)}px`}
      >
        <div class="w-16 h-2 bg-indigo-400/40 rounded"></div>
        <div class="ml-auto flex gap-2">
          {#each [1, 2, 3] as i (i)}
            <div class="w-8 h-1.5 bg-slate-600/60 rounded"></div>
          {/each}
        </div>
      </div>
      <div class="p-2 text-[9px] text-slate-600 font-mono">{headerMobile}rem mobile · {headerDesktop}rem desktop</div>
    </div>
  </section>

  <div class="h-px bg-white/6"></div>

  <!-- SIDEBAR -->
  <section class="space-y-4">
    <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sidebar</div>
    <SliderRow
      label="Sidebar width" value={sidebarWidth} min={10} max={32} step={0.5} unit="rem"
      help="--sf-sidebar-width — default sidebar / drawer width"
      overridden={"--sf-sidebar-width" in overrides}
      onChange={(v) => onSet("--sf-sidebar-width", `${v}rem`)}
      onReset={() => onReset("--sf-sidebar-width")}
    />
    <div class="bg-white/4 rounded-xl border border-white/8 p-3 flex gap-2 items-stretch" style="height: 60px">
      <div
        class="bg-indigo-500/15 border border-indigo-500/20 rounded flex-shrink-0 flex items-center justify-center"
        style={`width: ${Math.min(sidebarWidth * 3.5, 100)}px`}
      >
        <span class="text-[8px] font-mono text-indigo-400/60 rotate-90 whitespace-nowrap">{sidebarWidth}rem</span>
      </div>
      <div class="flex-1 bg-white/4 rounded"></div>
    </div>
  </section>
</div>
