<script lang="ts">
  import SliderRow from '../inputs/SliderRow.svelte';

  let { overrides, onSet, onReset, onBulkChange }: {
    overrides: Record<string, string>;
    onSet: (name: string, value: string) => void;
    onReset: (name: string) => void;
    onBulkChange: (patch: Record<string, string | null>) => void;
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

  const SIZE_TOKENS = [
    { label: "XS", token: "--sf-size-xs", default: 1.5 },
    { label: "S",  token: "--sf-size-s",  default: 2   },
    { label: "M",  token: "--sf-size-m",  default: 2.5 },
    { label: "L",  token: "--sf-size-l",  default: 2.75 },
    { label: "XL", token: "--sf-size-xl", default: 3.5 },
  ];

  function parseNum(val: string | undefined, fallback: number, strip?: string): number {
    if (!val) return fallback;
    const v = parseFloat(strip ? val.replace(strip, "") : val);
    return isNaN(v) ? fallback : v;
  }

  let touchTarget = $derived(parseNum(overrides["--sf-touch-target"], 44, "px"));
  let scrollBehavior = $derived(overrides["--sf-scroll-behavior"] ?? "smooth");
  let zBaseOffset = $derived(parseNum(overrides["--sf-z-base"], 0));
  let caretColor = $derived(overrides["--sf-caret-color"] ?? "");
  let underlineOffset = $derived(parseNum(overrides["--sf-link-underline-offset"]?.replace("em",""), 0.15));
  let underlineThickness = $derived(overrides["--sf-link-underline-thickness"] ?? "auto");

  function getSizeValue(t: typeof SIZE_TOKENS[0]): number {
    return parseNum(overrides[t.token]?.replace("rem",""), t.default);
  }
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
            value={overrides["--sf-color-selection-bg"] ?? "#6366f1"}
            oninput={(e) => onSet("--sf-color-selection-bg", (e.target as HTMLInputElement).value)}
            class="w-8 h-8 rounded border border-white/10 bg-transparent cursor-pointer"
          />
          <span class="text-[9px] font-mono text-slate-400 flex-1">{overrides["--sf-color-selection-bg"] ?? "default"}</span>
          {#if "--sf-color-selection-bg" in overrides}
            <button onclick={() => onReset("--sf-color-selection-bg")} class="text-[8px] text-slate-500 hover:text-rose-400 cursor-pointer">reset</button>
          {/if}
        </div>
      </div>
      <div>
        <div class="text-[10px] font-semibold text-slate-400 mb-1.5">Selection text color</div>
        <div class="flex items-center gap-2">
          <input
            type="color"
            value={overrides["--sf-color-selection-text"] ?? "#ffffff"}
            oninput={(e) => onSet("--sf-color-selection-text", (e.target as HTMLInputElement).value)}
            class="w-8 h-8 rounded border border-white/10 bg-transparent cursor-pointer"
          />
          <span class="text-[9px] font-mono text-slate-400 flex-1">{overrides["--sf-color-selection-text"] ?? "default"}</span>
          {#if "--sf-color-selection-text" in overrides}
            <button onclick={() => onReset("--sf-color-selection-text")} class="text-[8px] text-slate-500 hover:text-rose-400 cursor-pointer">reset</button>
          {/if}
        </div>
      </div>
      <!-- Selection preview -->
      <div class="bg-white/4 rounded-xl border border-white/8 p-3">
        <p
          class="text-[11px] text-slate-200 select-all"
          style={`--sf-color-selection-bg: ${overrides["--sf-color-selection-bg"] ?? "#6366f1"}; --sf-color-selection-text: ${overrides["--sf-color-selection-text"] ?? "#ffffff"}`}
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

  <div class="h-px bg-white/6"></div>

  <!-- COMPONENT SIZES -->
  <section class="space-y-3">
    <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Component size scale</div>
    <p class="text-[10px] text-slate-600 leading-relaxed">
      Controls the height / tap-target of all sized components (buttons, inputs, badges).
    </p>
    <div class="space-y-2">
      {#each SIZE_TOKENS as s (s.token)}
        {@const val = getSizeValue(s)}
        <SliderRow
          label={s.label} value={val} min={1} max={5} step={0.05} unit="rem"
          help={`${s.token} — component size step ${s.label}`}
          overridden={s.token in overrides}
          onChange={(v) => onSet(s.token, `${v}rem`)}
          onReset={() => onReset(s.token)}
        />
      {/each}
    </div>
    <!-- Visual preview -->
    <div class="bg-white/4 rounded-xl border border-white/8 p-3 flex items-end gap-2">
      {#each SIZE_TOKENS as s (s.token)}
        {@const val = getSizeValue(s)}
        <div class="flex flex-col items-center gap-1 flex-1">
          <div
            class="w-full bg-indigo-500/30 border border-indigo-500/30 rounded flex items-center justify-center"
            style={`height: ${Math.min(val * 14, 64)}px`}
          ></div>
          <span class="text-[8px] font-mono text-slate-600">{s.label}</span>
        </div>
      {/each}
    </div>
  </section>

  <div class="h-px bg-white/6"></div>

  <!-- CARET & LINKS -->
  <section class="space-y-3">
    <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Caret & links</div>
    <div>
      <div class="text-[10px] font-semibold text-slate-400 mb-1.5">Caret color</div>
      <div class="flex items-center gap-2">
        <input
          type="color"
          value={caretColor || "#6366f1"}
          oninput={(e) => onSet("--sf-caret-color", (e.target as HTMLInputElement).value)}
          class="w-8 h-8 rounded border border-white/10 bg-transparent cursor-pointer"
        />
        <span class="text-[9px] font-mono text-slate-400 flex-1">{caretColor || "default (action color)"}</span>
        {#if "--sf-caret-color" in overrides}
          <button onclick={() => onReset("--sf-caret-color")} class="text-[8px] text-slate-500 hover:text-rose-400 cursor-pointer">reset</button>
        {/if}
      </div>
    </div>
    <SliderRow
      label="Underline offset" value={underlineOffset} min={0} max={0.5} step={0.01} unit="em"
      help="--sf-link-underline-offset — gap between text baseline and underline"
      overridden={"--sf-link-underline-offset" in overrides}
      onChange={(v) => onSet("--sf-link-underline-offset", `${v}em`)}
      onReset={() => onReset("--sf-link-underline-offset")}
    />
    <div class="group">
      <div class="flex items-center justify-between mb-1.5">
        <span class="text-[11px] font-semibold text-slate-200">Underline thickness</span>
        {#if "--sf-link-underline-thickness" in overrides}
          <button onclick={() => onReset("--sf-link-underline-thickness")} class="text-[9px] text-slate-500 hover:text-rose-400 cursor-pointer opacity-0 group-hover:opacity-100">reset</button>
        {/if}
      </div>
      <div class="flex gap-1">
        {#each [["auto", "auto"], ["1px", "1px"], ["2px", "2px"], ["3px", "3px"]] as [label, val] (val)}
          <button
            onclick={() => val === "auto" ? onReset("--sf-link-underline-thickness") : onSet("--sf-link-underline-thickness", val)}
            class={`flex-1 py-1.5 rounded-lg text-[10px] border transition-all cursor-pointer ${
              underlineThickness === val
                ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-200"
                : "border-white/8 text-slate-400 hover:bg-white/5 hover:text-slate-200"
            }`}
          >{label}</button>
        {/each}
      </div>
    </div>
  </section>
</div>
