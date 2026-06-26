<script lang="ts">
  import SliderRow from '../inputs/SliderRow.svelte';

  let { overrides, onSet, onReset }: {
    overrides: Record<string, string>;
    onSet: (name: string, value: string) => void;
    onReset: (name: string) => void;
  } = $props();

  const Z_INDEX_STEPS = [
    { label: "Dropdown",  token: "--sf-z-dropdown",  note: "Dropdowns, popovers" },
    { label: "Sticky",    token: "--sf-z-sticky",    note: "Sticky headers, toolbars" },
    { label: "Fixed",     token: "--sf-z-fixed",     note: "Fixed UI chrome" },
    { label: "Overlay",   token: "--sf-z-overlay",   note: "Modals, drawers backdrop" },
    { label: "Modal",     token: "--sf-z-modal",     note: "Modal dialogs" },
    { label: "Popover",   token: "--sf-z-popover",   note: "Tooltips, menus" },
    { label: "Toast",     token: "--sf-z-toast",     note: "Notifications" },
  ];

  const SCROLL_BEHAVIORS = [
    { label: "Smooth", value: "smooth" },
    { label: "Auto",   value: "auto"   },
  ];

  function parseNum(val: string | undefined, fallback: number, strip?: string): number {
    if (!val) return fallback;
    const v = parseFloat(strip ? val.replace(strip, "") : val);
    return isNaN(v) ? fallback : v;
  }

  let touchTarget = $derived(parseNum(overrides["--sf-touch-target"], 44, "px"));
  let scrollBehavior = $derived(overrides["--sf-scroll-behavior"] ?? "smooth");
  let zBaseOffset = $derived(parseNum(overrides["--sf-z-base"], 0));
</script>

<div class="p-4 space-y-6">

  <!-- TOUCH TARGET -->
  <section class="space-y-3">
    <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Touch target</div>
    <SliderRow
      label="Min touch size" value={touchTarget} min={32} max={64} step={1} unit="px"
      help="--sf-touch-target — minimum tappable area for interactive elements (WCAG 2.5.5)"
      overridden={"--sf-touch-target" in overrides}
      onChange={(v) => onSet("--sf-touch-target", `${v}px`)}
      onReset={() => onReset("--sf-touch-target")}
    />
    <!-- Preview -->
    <div class="bg-white/4 rounded-xl border border-white/8 p-3 flex items-center gap-3">
      <div
        class="bg-indigo-500/30 border border-indigo-500/30 rounded flex items-center justify-center text-[9px] font-mono text-indigo-400/70 shrink-0"
        style={`width: ${touchTarget}px; height: ${touchTarget}px`}
      >
        {touchTarget}px
      </div>
      <p class="text-[9px] text-slate-600">Minimum interactive area — ensures accessibility on touch devices.</p>
    </div>
  </section>

  <div class="h-px bg-white/6"></div>

  <!-- SCROLL BEHAVIOR -->
  <section class="space-y-3">
    <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Scroll behavior</div>
    <div class="flex gap-2">
      {#each SCROLL_BEHAVIORS as b (b.value)}
        <button
          onclick={() => b.value === "smooth" ? onReset("--sf-scroll-behavior") : onSet("--sf-scroll-behavior", b.value)}
          class={`flex-1 py-2 rounded-lg text-[10px] border transition-all cursor-pointer ${
            scrollBehavior === b.value
              ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-200"
              : "border-white/8 text-slate-400 hover:bg-white/5 hover:text-slate-200"
          }`}
        >
          {b.label}
        </button>
      {/each}
    </div>
  </section>

  <div class="h-px bg-white/6"></div>

  <!-- Z-INDEX -->
  <section class="space-y-3">
    <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Z-index layers</div>
    <SliderRow
      label="Base offset" value={zBaseOffset} min={0} max={1000} step={10}
      help="--sf-z-base — added to all z-index tokens to avoid conflicts with existing stacking contexts"
      overridden={"--sf-z-base" in overrides}
      onChange={(v) => onSet("--sf-z-base", String(v))}
      onReset={() => onReset("--sf-z-base")}
    />
    <div class="bg-white/4 rounded-xl border border-white/8 p-3 space-y-1.5">
      {#each Z_INDEX_STEPS as z (z.token)}
        {@const isOverridden = z.token in overrides}
        <div class="flex items-center gap-2">
          <div class={`w-1.5 h-1.5 rounded-full shrink-0 ${isOverridden ? "bg-amber-400" : "bg-white/20"}`}></div>
          <span class="text-[9px] font-mono text-slate-400 w-20 shrink-0">{z.label}</span>
          <span class="text-[8px] text-slate-600 flex-1">{z.note}</span>
          <span class="text-[8px] font-mono text-slate-500">{z.token.replace("--sf-z-", "")}</span>
        </div>
      {/each}
    </div>
    <p class="text-[9px] text-slate-600">Override individual z-index tokens in the "All tokens" tab.</p>
  </section>

  <div class="h-px bg-white/6"></div>

  <!-- SELECTION -->
  <section class="space-y-3">
    <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Text selection</div>
    <div class="space-y-2">
      <div>
        <div class="text-[10px] font-semibold text-slate-400 mb-1.5">Selection background</div>
        <div class="flex items-center gap-2">
          <input
            type="color"
            value={overrides["--sf-selection-bg"] ?? "#6366f1"}
            oninput={(e) => onSet("--sf-selection-bg", (e.target as HTMLInputElement).value)}
            class="w-8 h-8 rounded border border-white/10 bg-transparent cursor-pointer"
          />
          <span class="text-[9px] font-mono text-slate-400 flex-1">{overrides["--sf-selection-bg"] ?? "default"}</span>
          {#if "--sf-selection-bg" in overrides}
            <button onclick={() => onReset("--sf-selection-bg")} class="text-[8px] text-slate-500 hover:text-rose-400 cursor-pointer">reset</button>
          {/if}
        </div>
      </div>
      <div>
        <div class="text-[10px] font-semibold text-slate-400 mb-1.5">Selection text color</div>
        <div class="flex items-center gap-2">
          <input
            type="color"
            value={overrides["--sf-selection-color"] ?? "#ffffff"}
            oninput={(e) => onSet("--sf-selection-color", (e.target as HTMLInputElement).value)}
            class="w-8 h-8 rounded border border-white/10 bg-transparent cursor-pointer"
          />
          <span class="text-[9px] font-mono text-slate-400 flex-1">{overrides["--sf-selection-color"] ?? "default"}</span>
          {#if "--sf-selection-color" in overrides}
            <button onclick={() => onReset("--sf-selection-color")} class="text-[8px] text-slate-500 hover:text-rose-400 cursor-pointer">reset</button>
          {/if}
        </div>
      </div>
      <!-- Selection preview -->
      <div class="bg-white/4 rounded-xl border border-white/8 p-3">
        <p
          class="text-[11px] text-slate-200 select-all"
          style={`--sf-selection-bg: ${overrides["--sf-selection-bg"] ?? "#6366f1"}; --sf-selection-color: ${overrides["--sf-selection-color"] ?? "#ffffff"}`}
        >
          Select this text to preview the selection color.
        </p>
      </div>
    </div>
  </section>

  <div class="h-px bg-white/6"></div>

  <!-- FOCUS RING STYLE -->
  <section class="space-y-3">
    <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Focus ring style</div>
    <div class="flex gap-2">
      {#each ["solid", "dashed", "dotted"] as style (style)}
        {@const current = overrides["--sf-focus-ring-style"] ?? "solid"}
        <button
          onclick={() => style === "solid" ? onReset("--sf-focus-ring-style") : onSet("--sf-focus-ring-style", style)}
          class={`flex-1 py-2 rounded-lg text-[10px] border transition-all cursor-pointer capitalize ${
            current === style
              ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-200"
              : "border-white/8 text-slate-400 hover:bg-white/5 hover:text-slate-200"
          }`}
        >
          {style}
        </button>
      {/each}
    </div>
  </section>
</div>
