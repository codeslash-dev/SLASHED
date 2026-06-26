<script lang="ts">
  import type { SlashedToken } from '../../types';
  import SliderRow from '../inputs/SliderRow.svelte';

  let { overrides, onSet, onReset, onBulkChange }: {
    overrides: Record<string, string>;
    onSet: (name: string, value: string) => void;
    onReset: (name: string) => void;
    onBulkChange: (patch: Record<string, string | null>) => void;
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
  let centerMax         = $derived(parseRem(overrides["--sf-center-max"],        75));
  let centerGutter      = $derived(parseRem(overrides["--sf-center-gutter"],     1));
  let gridMin           = $derived(parseRem(overrides["--sf-grid-min"],          16));
  let headerMobile      = $derived(parseRem(overrides["--sf-header-height-mobile"],  3.5));
  let headerDesktop     = $derived(parseRem(overrides["--sf-header-height-desktop"], 5));
  let sidebarWidth      = $derived(parseRem(overrides["--sf-sidebar-width"],     18));
  let stickyMobile      = $derived(parseRem(overrides["--sf-sticky-offset-mobile"],  3.5));
  let stickyDesktop     = $derived(parseRem(overrides["--sf-sticky-offset-desktop"], 5));

  const BENTO_TOKENS = [
    { label: "Columns",    token: "--sf-bento-cols-default", min: 1, max: 12, step: 1, unit: "", default: 4 },
    { label: "Row default",token: "--sf-bento-row-default",  min: 4, max: 24, step: 0.5, unit: "rem", default: 10 },
    { label: "Row compact",token: "--sf-bento-row-compact",  min: 2, max: 16, step: 0.5, unit: "rem", default: 6 },
    { label: "Row tall",   token: "--sf-bento-row-tall",     min: 8, max: 32, step: 0.5, unit: "rem", default: 16 },
  ];

  let showBento = $state(false);

  function getBentoVal(t: typeof BENTO_TOKENS[0]): number {
    const raw = overrides[t.token];
    if (!raw) return t.default;
    return parseFloat(raw);
  }
</script>

<div class="p-4 space-y-6">

  <!-- CONTAINERS -->
  <section class="space-y-4">
    <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Container widths</div>

    <!-- Compact pairs -->
    <div class="grid grid-cols-2 gap-3">
      <div>
        <div class="text-[9px] text-slate-600 mb-1">Narrow</div>
        <SliderRow
          label="" value={containerNarrow} min={20} max={60} step={1} unit="rem"
          overridden={"--sf-container-narrow" in overrides}
          onChange={(v) => onSet("--sf-container-narrow", `${v}rem`)}
          onReset={() => onReset("--sf-container-narrow")}
        />
      </div>
      <div>
        <div class="text-[9px] text-slate-600 mb-1">Prose</div>
        <SliderRow
          label="" value={containerProse} min={40} max={90} step={1} unit="ch"
          overridden={"--sf-container-prose" in overrides}
          onChange={(v) => onSet("--sf-container-prose", `${v}ch`)}
          onReset={() => onReset("--sf-container-prose")}
        />
      </div>
      <div>
        <div class="text-[9px] text-slate-600 mb-1">Default</div>
        <SliderRow
          label="" value={containerDefault} min={50} max={120} step={1} unit="rem"
          overridden={"--sf-container-default" in overrides}
          onChange={(v) => onSet("--sf-container-default", `${v}rem`)}
          onReset={() => onReset("--sf-container-default")}
        />
      </div>
      <div>
        <div class="text-[9px] text-slate-600 mb-1">Wide</div>
        <SliderRow
          label="" value={containerWide} min={60} max={160} step={1} unit="rem"
          overridden={"--sf-container-wide" in overrides}
          onChange={(v) => onSet("--sf-container-wide", `${v}rem`)}
          onReset={() => onReset("--sf-container-wide")}
        />
      </div>
    </div>

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

  <!-- CENTER WRAPPER -->
  <section class="space-y-3">
    <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Center wrapper</div>
    <SliderRow
      label="Max width" value={centerMax} min={30} max={160} step={1} unit="rem"
      help="--sf-center-max — max-width of the .sf-center centering wrapper"
      overridden={"--sf-center-max" in overrides}
      onChange={(v) => onSet("--sf-center-max", `${v}rem`)}
      onReset={() => onReset("--sf-center-max")}
    />
    <SliderRow
      label="Gutter" value={centerGutter} min={0} max={4} step={0.125} unit="rem"
      help="--sf-center-gutter — minimum side padding inside the center wrapper"
      overridden={"--sf-center-gutter" in overrides}
      onChange={(v) => onSet("--sf-center-gutter", `${v}rem`)}
      onReset={() => onReset("--sf-center-gutter")}
    />
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
    <div class="grid grid-cols-2 gap-3">
      <div>
        <div class="text-[9px] text-slate-600 mb-1">Mobile</div>
        <SliderRow
          label="" value={headerMobile} min={2} max={8} step={0.25} unit="rem"
          overridden={"--sf-header-height-mobile" in overrides}
          onChange={(v) => onSet("--sf-header-height-mobile", `${v}rem`)}
          onReset={() => onReset("--sf-header-height-mobile")}
        />
      </div>
      <div>
        <div class="text-[9px] text-slate-600 mb-1">Desktop</div>
        <SliderRow
          label="" value={headerDesktop} min={3} max={10} step={0.25} unit="rem"
          overridden={"--sf-header-height-desktop" in overrides}
          onChange={(v) => onSet("--sf-header-height-desktop", `${v}rem`)}
          onReset={() => onReset("--sf-header-height-desktop")}
        />
      </div>
    </div>
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

  <!-- STICKY OFFSETS -->
  <section class="space-y-3">
    <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sticky offset</div>
    <p class="text-[9px] text-slate-600">Offsets position:sticky elements below a fixed header. Defaults to header heights.</p>
    <div class="grid grid-cols-2 gap-3">
      <div>
        <div class="text-[9px] text-slate-600 mb-1">Mobile</div>
        <SliderRow
          label="" value={stickyMobile} min={0} max={12} step={0.25} unit="rem"
          overridden={"--sf-sticky-offset-mobile" in overrides}
          onChange={(v) => onSet("--sf-sticky-offset-mobile", `${v}rem`)}
          onReset={() => onReset("--sf-sticky-offset-mobile")}
        />
      </div>
      <div>
        <div class="text-[9px] text-slate-600 mb-1">Desktop</div>
        <SliderRow
          label="" value={stickyDesktop} min={0} max={12} step={0.25} unit="rem"
          overridden={"--sf-sticky-offset-desktop" in overrides}
          onChange={(v) => onSet("--sf-sticky-offset-desktop", `${v}rem`)}
          onReset={() => onReset("--sf-sticky-offset-desktop")}
        />
      </div>
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

  <div class="h-px bg-white/6"></div>

  <!-- BENTO GRID -->
  <div>
    <button
      onclick={() => { showBento = !showBento; }}
      class="w-full flex items-center justify-between text-[10px] font-semibold text-slate-400 hover:text-slate-200 transition-colors cursor-pointer py-1"
    >
      <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Bento grid</span>
      <span class="text-[10px] text-slate-500">{showBento ? "▲" : "▼"}</span>
    </button>
    {#if showBento}
      <div class="mt-2 space-y-2">
        {#each BENTO_TOKENS as t (t.token)}
          <SliderRow
            label={t.label} value={getBentoVal(t)} min={t.min} max={t.max} step={t.step} unit={t.unit}
            help={t.token}
            overridden={t.token in overrides}
            onChange={(v) => onSet(t.token, t.unit ? `${v}${t.unit}` : String(v))}
            onReset={() => onReset(t.token)}
          />
        {/each}
      </div>
    {/if}
  </div>
</div>
