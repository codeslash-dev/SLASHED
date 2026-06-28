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

  let showContainerWidths = $state(false);
  let showCenterWrapper = $state(false);
  let showAutoGrid = $state(false);
  let showHeaderHeight = $state(false);
  let showStickyOffset = $state(false);
  let showSidebar = $state(false);
  let showBento = $state(false);
  let showMore = $state(false);

  function getBentoVal(t: typeof BENTO_TOKENS[0]): number {
    const raw = overrides[t.token];
    if (!raw) return t.default;
    return parseFloat(raw);
  }

  // Additional layout primitives (switcher, sidebar, equal, cover, frame, reel,
  // imposter, content-grid, alternate) — tokens exist but had no UI.
  let switcherThreshold = $derived(parseRem(overrides["--sf-switcher-threshold"], 30));
  let sidebarMinWidth   = $derived(parseRem(overrides["--sf-sidebar-min-width"], 50));
  let equalMinCol       = $derived(parseRem(overrides["--sf-equal-min-col"], 16));
  let coverMinHeight    = $derived(parseRem(overrides["--sf-cover-min-height"], 100));
  let imposterMargin    = $derived(parseRem(overrides["--sf-imposter-margin"], 1));
  let breakoutWidth     = $derived(parseRem(overrides["--sf-breakout-width"], 90));
  let contentWidth      = $derived(parseRem(overrides["--sf-content-width"], 75));
  let alternateInnerGap = $derived(parseRem(overrides["--sf-alternate-inner-gap"], 1));
  let frameRatio        = $derived(overrides["--sf-frame-ratio"] ?? "16 / 9");
  let reelItemWidth     = $derived(overrides["--sf-reel-item-width"] ?? "max-content");

  const FRAME_PRESETS = ["16 / 9", "4 / 3", "3 / 2", "1 / 1", "21 / 9"];
  const REEL_PRESETS = [
    { label: "auto",  value: "max-content" },
    { label: "12rem", value: "12rem" },
    { label: "16rem", value: "16rem" },
    { label: "20rem", value: "20rem" },
  ];
</script>

<div class="p-4 space-y-6">

  <!-- CONTAINERS -->
  <section class="space-y-4">
    <button
      onclick={() => { showContainerWidths = !showContainerWidths; }}
      aria-expanded={showContainerWidths}
      class="w-full flex items-center justify-between cursor-pointer"
    >
      <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Container widths</div>
      <span class="text-[10px] text-slate-500">{showContainerWidths ? "▲" : "▼"}</span>
    </button>
    {#if showContainerWidths}
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
    {/if}
  </section>

  <div class="h-px bg-white/6"></div>

  <!-- CENTER WRAPPER -->
  <section class="space-y-3">
    <button
      onclick={() => { showCenterWrapper = !showCenterWrapper; }}
      aria-expanded={showCenterWrapper}
      class="w-full flex items-center justify-between cursor-pointer"
    >
      <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Center wrapper</div>
      <span class="text-[10px] text-slate-500">{showCenterWrapper ? "▲" : "▼"}</span>
    </button>
    {#if showCenterWrapper}
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
    {/if}
  </section>

  <div class="h-px bg-white/6"></div>

  <!-- AUTO GRID -->
  <section class="space-y-4">
    <button
      onclick={() => { showAutoGrid = !showAutoGrid; }}
      aria-expanded={showAutoGrid}
      class="w-full flex items-center justify-between cursor-pointer"
    >
      <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Auto grid</div>
      <span class="text-[10px] text-slate-500">{showAutoGrid ? "▲" : "▼"}</span>
    </button>
    {#if showAutoGrid}
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
    {/if}
  </section>

  <div class="h-px bg-white/6"></div>

  <!-- HEADER -->
  <section class="space-y-4">
    <button
      onclick={() => { showHeaderHeight = !showHeaderHeight; }}
      aria-expanded={showHeaderHeight}
      class="w-full flex items-center justify-between cursor-pointer"
    >
      <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Header height</div>
      <span class="text-[10px] text-slate-500">{showHeaderHeight ? "▲" : "▼"}</span>
    </button>
    {#if showHeaderHeight}
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
    {/if}
  </section>

  <div class="h-px bg-white/6"></div>

  <!-- STICKY OFFSETS -->
  <section class="space-y-3">
    <button
      onclick={() => { showStickyOffset = !showStickyOffset; }}
      aria-expanded={showStickyOffset}
      class="w-full flex items-center justify-between cursor-pointer"
    >
      <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sticky offset</div>
      <span class="text-[10px] text-slate-500">{showStickyOffset ? "▲" : "▼"}</span>
    </button>
    {#if showStickyOffset}
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
    {/if}
  </section>

  <div class="h-px bg-white/6"></div>

  <!-- SIDEBAR -->
  <section class="space-y-4">
    <button
      onclick={() => { showSidebar = !showSidebar; }}
      aria-expanded={showSidebar}
      class="w-full flex items-center justify-between cursor-pointer"
    >
      <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sidebar</div>
      <span class="text-[10px] text-slate-500">{showSidebar ? "▲" : "▼"}</span>
    </button>
    {#if showSidebar}
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
    {/if}
  </section>

  <div class="h-px bg-white/6"></div>

  <!-- BENTO GRID -->
  <div>
    <button
      onclick={() => { showBento = !showBento; }}
      aria-expanded={showBento}
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

  <div class="h-px bg-white/6"></div>

  <!-- MORE LAYOUT PRIMITIVES -->
  <div>
    <button
      onclick={() => { showMore = !showMore; }}
      aria-expanded={showMore}
      aria-controls="more-layout-primitives"
      class="w-full flex items-center justify-between text-[10px] font-semibold text-slate-400 hover:text-slate-200 transition-colors cursor-pointer py-1"
    >
      <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">More layout primitives</span>
      <span class="text-[10px] text-slate-500">{showMore ? "▲" : "▼"}</span>
    </button>
    {#if showMore}
      <div id="more-layout-primitives" class="mt-3 space-y-5">

        <!-- Switcher -->
        <section class="space-y-2">
          <div class="text-[9px] font-semibold text-slate-500 uppercase tracking-widest">Switcher</div>
          <SliderRow
            label="Threshold" value={switcherThreshold} min={10} max={60} step={1} unit="rem"
            help="--sf-switcher-threshold — width below which .sf-switcher stacks vertically"
            overridden={"--sf-switcher-threshold" in overrides}
            onChange={(v) => onSet("--sf-switcher-threshold", `${v}rem`)}
            onReset={() => onReset("--sf-switcher-threshold")}
          />
        </section>

        <!-- Sidebar content min -->
        <section class="space-y-2">
          <div class="text-[9px] font-semibold text-slate-500 uppercase tracking-widest">Sidebar content</div>
          <SliderRow
            label="Content min width" value={sidebarMinWidth} min={20} max={80} step={1} unit="%"
            help="--sf-sidebar-min-width — minimum width of the .sf-sidebar content column before it wraps"
            overridden={"--sf-sidebar-min-width" in overrides}
            onChange={(v) => onSet("--sf-sidebar-min-width", `${v}%`)}
            onReset={() => onReset("--sf-sidebar-min-width")}
          />
        </section>

        <!-- Equal grid -->
        <section class="space-y-2">
          <div class="text-[9px] font-semibold text-slate-500 uppercase tracking-widest">Equal grid</div>
          <SliderRow
            label="Min column" value={equalMinCol} min={6} max={36} step={0.5} unit="rem"
            help="--sf-equal-min-col — minimum column width for .sf-equal"
            overridden={"--sf-equal-min-col" in overrides}
            onChange={(v) => onSet("--sf-equal-min-col", `${v}rem`)}
            onReset={() => onReset("--sf-equal-min-col")}
          />
        </section>

        <!-- Cover -->
        <section class="space-y-2">
          <div class="text-[9px] font-semibold text-slate-500 uppercase tracking-widest">Cover</div>
          <SliderRow
            label="Min height" value={coverMinHeight} min={20} max={100} step={1} unit="dvh"
            help="--sf-cover-min-height — minimum height of the .sf-cover layout"
            overridden={"--sf-cover-min-height" in overrides}
            onChange={(v) => onSet("--sf-cover-min-height", `${v}dvh`)}
            onReset={() => onReset("--sf-cover-min-height")}
          />
        </section>

        <!-- Frame ratio -->
        <section class="space-y-2">
          <div class="text-[9px] font-semibold text-slate-500 uppercase tracking-widest">Frame ratio</div>
          <p class="text-[9px] text-slate-600">--sf-frame-ratio — aspect ratio for .sf-frame</p>
          <div class="grid grid-cols-5 gap-1">
            {#each FRAME_PRESETS as r (r)}
              <button
                onclick={() => r === "16 / 9" ? onReset("--sf-frame-ratio") : onSet("--sf-frame-ratio", r)}
                class={`py-1 rounded-lg text-[9px] border transition-all cursor-pointer font-mono ${
                  frameRatio.replace(/\s/g, "") === r.replace(/\s/g, "")
                    ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-200"
                    : "border-white/8 text-slate-400 hover:bg-white/5 hover:text-slate-200"
                }`}
              >{r}</button>
            {/each}
          </div>
        </section>

        <!-- Reel -->
        <section class="space-y-2">
          <div class="text-[9px] font-semibold text-slate-500 uppercase tracking-widest">Reel</div>
          <p class="text-[9px] text-slate-600">--sf-reel-item-width — width of each item in a horizontal .sf-reel</p>
          <div class="grid grid-cols-4 gap-1">
            {#each REEL_PRESETS as p (p.value)}
              <button
                onclick={() => p.value === "max-content" ? onReset("--sf-reel-item-width") : onSet("--sf-reel-item-width", p.value)}
                class={`py-1 rounded-lg text-[9px] border transition-all cursor-pointer ${
                  reelItemWidth === p.value
                    ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-200"
                    : "border-white/8 text-slate-400 hover:bg-white/5 hover:text-slate-200"
                }`}
              >{p.label}</button>
            {/each}
          </div>
        </section>

        <!-- Imposter -->
        <section class="space-y-2">
          <div class="text-[9px] font-semibold text-slate-500 uppercase tracking-widest">Imposter</div>
          <SliderRow
            label="Margin" value={imposterMargin} min={0} max={4} step={0.125} unit="rem"
            help="--sf-imposter-margin — viewport inset for the centered .sf-imposter overlay"
            overridden={"--sf-imposter-margin" in overrides}
            onChange={(v) => onSet("--sf-imposter-margin", `${v}rem`)}
            onReset={() => onReset("--sf-imposter-margin")}
          />
        </section>

        <!-- Content grid (breakout) -->
        <section class="space-y-2">
          <div class="text-[9px] font-semibold text-slate-500 uppercase tracking-widest">Content grid (breakout)</div>
          <SliderRow
            label="Content width" value={contentWidth} min={40} max={120} step={1} unit="rem"
            help="--sf-content-width — default reading column width in .sf-content-grid"
            overridden={"--sf-content-width" in overrides}
            onChange={(v) => onSet("--sf-content-width", `${v}rem`)}
            onReset={() => onReset("--sf-content-width")}
          />
          <SliderRow
            label="Breakout width" value={breakoutWidth} min={50} max={160} step={1} unit="rem"
            help="--sf-breakout-width — wide breakout column width in .sf-content-grid"
            overridden={"--sf-breakout-width" in overrides}
            onChange={(v) => onSet("--sf-breakout-width", `${v}rem`)}
            onReset={() => onReset("--sf-breakout-width")}
          />
        </section>

        <!-- Alternate -->
        <section class="space-y-2">
          <div class="text-[9px] font-semibold text-slate-500 uppercase tracking-widest">Alternate (zigzag)</div>
          <SliderRow
            label="Inner gap" value={alternateInnerGap} min={0} max={4} step={0.125} unit="rem"
            help="--sf-alternate-inner-gap — gap between media and text within an .sf-alternate row"
            overridden={"--sf-alternate-inner-gap" in overrides}
            onChange={(v) => onSet("--sf-alternate-inner-gap", `${v}rem`)}
            onReset={() => onReset("--sf-alternate-inner-gap")}
          />
        </section>
      </div>
    {/if}
  </div>
</div>
