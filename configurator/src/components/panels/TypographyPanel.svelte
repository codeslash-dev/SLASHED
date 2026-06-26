<script lang="ts">
  import type { SlashedToken } from '../../types';
  import { KNOBS_BY_DOMAIN } from '../../lib/powerKnobs';
  import PowerKnobRow from '../inputs/PowerKnobRow.svelte';
  import SliderRow from '../inputs/SliderRow.svelte';
  import RangeWithNumber from '../inputs/RangeWithNumber.svelte';

  let { overrides, onSet, onReset, onBulkChange }: {
    tokens: SlashedToken[];
    overrides: Record<string, string>;
    onSet: (name: string, value: string) => void;
    onReset: (name: string) => void;
    onBulkChange: (patch: Record<string, string | null>) => void;
  } = $props();

  const RATIO_PRESETS = [
    { label: "Minor Second — 1.067", value: 1.067 },
    { label: "Major Second — 1.125", value: 1.125 },
    { label: "Minor Third — 1.200", value: 1.2 },
    { label: "Major Third — 1.250", value: 1.25 },
    { label: "Perfect Fourth — 1.333", value: 1.333 },
    { label: "Aug. Fourth — 1.414", value: 1.414 },
    { label: "Golden — 1.618", value: 1.618 },
  ];

  const BODY_STACKS = [
    { label: "System sans-serif", value: "system-ui, -apple-system, sans-serif" },
    { label: "Inter", value: "Inter, system-ui, sans-serif" },
    { label: "Georgia (serif)", value: "Georgia, 'Times New Roman', serif" },
    { label: "Merriweather (serif)", value: "'Merriweather', Georgia, serif" },
    { label: "JetBrains Mono", value: "'JetBrains Mono', 'Fira Code', monospace" },
  ];

  const HEADING_STACKS = [
    { label: "Same as body", value: "" },
    { label: "Inter", value: "Inter, system-ui, sans-serif" },
    { label: "Georgia (serif)", value: "Georgia, 'Times New Roman', serif" },
    { label: "Impact / condensed", value: "Impact, 'Arial Narrow', sans-serif" },
  ];

  const MONO_STACKS = [
    { label: "System mono", value: "ui-monospace, monospace" },
    { label: "JetBrains Mono", value: "'JetBrains Mono', 'Fira Code', monospace" },
    { label: "Source Code Pro", value: "'Source Code Pro', 'Courier New', monospace" },
  ];

  const WRAP_OPTIONS = [
    { label: "balance", value: "balance" },
    { label: "pretty",  value: "pretty" },
    { label: "normal",  value: "normal" },
  ];

  const WEIGHT_OPTIONS = ["300","400","500","600","700","800"];
  const WEIGHT_DEFAULTS: Record<string, string> = {
    "--sf-font-weight-body": "400",
    "--sf-font-weight-heading": "600",
    "--sf-font-weight-display": "700",
    "--sf-font-weight-interactive": "600",
  };

  const TEXT_STEPS = [
    { label: "2xs", factor: 0.64 },
    { label: "xs",  factor: 0.75 },
    { label: "s",   factor: 0.875 },
    { label: "m",   factor: 1 },
    { label: "l",   factor: 1.125 },
    { label: "xl",  factor: 1.25 },
    { label: "2xl", factor: 1.5 },
    { label: "3xl", factor: 1.875 },
    { label: "4xl", factor: 2.25 },
  ];

  const knobs = KNOBS_BY_DOMAIN["typography"] ?? [];

  function num(name: string, fallback: number) {
    const v = parseFloat(overrides[name] ?? "");
    return isNaN(v) ? fallback : v;
  }

  let ratioMin  = $derived(num("--sf-text-ratio-min", 1.25));
  let ratioMax  = $derived(num("--sf-text-ratio-max", 1.333));
  let baseMin   = $derived(num("--sf-text-base-min", 1));
  let baseMax   = $derived(num("--sf-text-base-max", 1.25));
  let dispMin   = $derived(num("--sf-text-display-base-min", 2.4));
  let dispMax   = $derived(num("--sf-text-display-base-max", 3));
  let leading   = $derived(num("--sf-leading-normal", 1.5));
  let taper     = $derived(num("--sf-leading-taper", 0));
  let textScale = $derived(num("--sf-text-scale", 1));
  let trackingHeading = $derived(parseFloat(overrides["--sf-tracking-heading"]?.replace("em","") ?? "0"));

  let activeRatio = $derived(RATIO_PRESETS.find(
    (p) => Math.abs(p.value - ratioMin) < 0.0015 && Math.abs(p.value - ratioMax) < 0.0015
  ));

  let currentBodyFont    = $derived(overrides["--sf-font-body"] ?? "");
  let currentHeadingFont = $derived(overrides["--sf-font-heading"] ?? "");
  let currentMonoFont    = $derived(overrides["--sf-font-mono"] ?? "");

  // Custom font state
  let customBodyFont = $state("");
  let customHeadingFont = $state("");
  let customFontTarget = $state<"body" | "heading">("body");

  function injectGoogleFont(fontName: string) {
    if (!fontName.trim()) return;
    const id = `gf-${fontName.replace(/\s+/g, "-")}`;
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@300;400;500;600;700&display=swap`;
      document.head.appendChild(link);
    }
  }

  function applyCustomFont(fontName: string, target: "body" | "heading") {
    if (!fontName.trim()) return;
    injectGoogleFont(fontName);
    const token = target === "body" ? "--sf-font-body" : "--sf-font-heading";
    onSet(token, `'${fontName}', sans-serif`);
  }
</script>

<div class="p-4 space-y-6">

  <!-- TYPE RAMP -->
  <section class="space-y-4">
    <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Type ramp</div>

    <div>
      <div class="text-[10px] font-semibold text-slate-400 mb-2">Modular scale ratio</div>
      <div class="grid grid-cols-2 gap-1">
        {#each RATIO_PRESETS as p (p.value)}
          <button
            onclick={() => onBulkChange({ "--sf-text-ratio-min": String(p.value), "--sf-text-ratio-max": String(p.value) })}
            class={`px-2 py-1.5 rounded-lg text-[10px] border transition-all cursor-pointer text-left ${
              activeRatio?.value === p.value
                ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-200"
                : "border-white/8 text-slate-400 hover:bg-white/5 hover:text-slate-200"
            }`}
          >
            {p.label}
          </button>
        {/each}
      </div>
      {#if !activeRatio}
        <div class="mt-3 space-y-3 pl-2 border-l border-amber-500/25">
          <SliderRow
            label="Ratio min (mobile)" value={ratioMin} min={1.05} max={1.8} step={0.001}
            overridden={"--sf-text-ratio-min" in overrides}
            onChange={(v) => onSet("--sf-text-ratio-min", String(v))}
            onReset={() => onReset("--sf-text-ratio-min")}
          />
          <SliderRow
            label="Ratio max (desktop)" value={ratioMax} min={1.05} max={1.8} step={0.001}
            overridden={"--sf-text-ratio-max" in overrides}
            onChange={(v) => onSet("--sf-text-ratio-max", String(v))}
            onReset={() => onReset("--sf-text-ratio-max")}
          />
        </div>
      {/if}
    </div>

    <div class="space-y-3">
      <div class="text-[10px] font-semibold text-slate-400">Base size — fluid clamp endpoints</div>
      <SliderRow
        label="Min (mobile)" value={baseMin} min={0.7} max={1.4} step={0.01} unit="rem"
        help="Bottom of the fluid clamp for --sf-text-m"
        overridden={"--sf-text-base-min" in overrides}
        onChange={(v) => onSet("--sf-text-base-min", String(v))}
        onReset={() => onReset("--sf-text-base-min")}
      />
      <SliderRow
        label="Max (desktop)" value={baseMax} min={0.875} max={2} step={0.01} unit="rem"
        help="Top of the fluid clamp for --sf-text-m"
        overridden={"--sf-text-base-max" in overrides}
        onChange={(v) => onSet("--sf-text-base-max", String(v))}
        onReset={() => onReset("--sf-text-base-max")}
      />
    </div>

    <div class="space-y-4">
      {#each knobs as k (k.name)}
        <PowerKnobRow
          knob={k}
          {overrides}
          onChange={(name, val) => val === null ? onReset(name) : onSet(name, val)}
        />
      {/each}
    </div>
  </section>

  <div class="h-px bg-white/6"></div>

  <!-- DISPLAY TYPE -->
  <section class="space-y-4">
    <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Display type</div>
    <SliderRow
      label="Display base min" value={dispMin} min={1.5} max={4} step={0.05} unit="rem"
      help="Smallest display-s size (mobile viewport)"
      overridden={"--sf-text-display-base-min" in overrides}
      onChange={(v) => onSet("--sf-text-display-base-min", String(v))}
      onReset={() => onReset("--sf-text-display-base-min")}
    />
    <SliderRow
      label="Display base max" value={dispMax} min={2} max={6} step={0.05} unit="rem"
      help="Largest display-s size (desktop viewport)"
      overridden={"--sf-text-display-base-max" in overrides}
      onChange={(v) => onSet("--sf-text-display-base-max", String(v))}
      onReset={() => onReset("--sf-text-display-base-max")}
    />
  </section>

  <div class="h-px bg-white/6"></div>

  <!-- FONT FAMILIES -->
  <section class="space-y-4">
    <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Font families</div>

    <div>
      <div class="text-[10px] font-semibold text-slate-400 mb-1.5">Body font</div>
      <div class="flex flex-col gap-1">
        {#each BODY_STACKS as s (s.label)}
          <button
            onclick={() => s.value ? onSet("--sf-font-body", s.value) : onReset("--sf-font-body")}
            class={`flex items-center gap-2 px-3 py-2 rounded-lg border text-left cursor-pointer transition-all ${
              currentBodyFont === s.value
                ? "bg-indigo-500/12 border-indigo-500/30 text-indigo-200"
                : "border-white/8 text-slate-400 hover:bg-white/5 hover:text-slate-200"
            }`}
          >
            <span class="text-[12px]" style={`font-family: ${s.value || "inherit"}`}>{s.label}</span>
            <span class="text-[9px] text-slate-600 ml-auto font-mono truncate max-w-[7rem]">{s.value || "default"}</span>
          </button>
        {/each}
      </div>
    </div>

    <div>
      <div class="text-[10px] font-semibold text-slate-400 mb-1.5">Heading font</div>
      <div class="flex flex-col gap-1">
        {#each HEADING_STACKS as s (s.label)}
          <button
            onclick={() => s.value ? onSet("--sf-font-heading", s.value) : onReset("--sf-font-heading")}
            class={`flex items-center gap-2 px-3 py-2 rounded-lg border text-left cursor-pointer transition-all ${
              currentHeadingFont === s.value
                ? "bg-indigo-500/12 border-indigo-500/30 text-indigo-200"
                : "border-white/8 text-slate-400 hover:bg-white/5 hover:text-slate-200"
            }`}
          >
            <span class="text-[12px]" style={`font-family: ${s.value || "inherit"}`}>{s.label}</span>
            <span class="text-[9px] text-slate-600 ml-auto font-mono truncate max-w-[7rem]">{s.value || "inherits body"}</span>
          </button>
        {/each}
      </div>
    </div>

    <div>
      <div class="text-[10px] font-semibold text-slate-400 mb-1.5">Mono font</div>
      <div class="flex flex-col gap-1">
        {#each MONO_STACKS as s (s.label)}
          <button
            onclick={() => onSet("--sf-font-mono", s.value)}
            class={`flex items-center gap-2 px-3 py-2 rounded-lg border text-left cursor-pointer transition-all ${
              currentMonoFont === s.value || (!currentMonoFont && s.value === "ui-monospace, monospace")
                ? "bg-indigo-500/12 border-indigo-500/30 text-indigo-200"
                : "border-white/8 text-slate-400 hover:bg-white/5 hover:text-slate-200"
            }`}
          >
            <span class="text-[12px] font-mono">{s.label}</span>
            <span class="text-[9px] text-slate-600 ml-auto font-mono truncate max-w-[7rem]">{s.value.split(",")[0]}</span>
          </button>
        {/each}
      </div>
    </div>

    <!-- Custom font loader -->
    <div class="rounded-xl bg-white/4 border border-white/8 p-3 space-y-2">
      <div class="text-[10px] font-semibold text-slate-400">Custom Google Font</div>
      <input
        type="text"
        placeholder="e.g. Roboto, Geist, Outfit…"
        value={customBodyFont}
        oninput={(e) => { customBodyFont = (e.target as HTMLInputElement).value; }}
        class="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-[11px] text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
      />
      <div class="flex gap-1">
        <button
          onclick={() => { customFontTarget = "body"; }}
          class={`flex-1 py-1 rounded text-[10px] border transition-all cursor-pointer ${customFontTarget === "body" ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-200" : "border-white/8 text-slate-400"}`}
        >Apply to body</button>
        <button
          onclick={() => { customFontTarget = "heading"; }}
          class={`flex-1 py-1 rounded text-[10px] border transition-all cursor-pointer ${customFontTarget === "heading" ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-200" : "border-white/8 text-slate-400"}`}
        >Apply to heading</button>
      </div>
      <button
        onclick={() => applyCustomFont(customBodyFont, customFontTarget)}
        class="w-full py-1.5 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-[11px] font-bold cursor-pointer hover:bg-indigo-600/30 transition-all"
      >
        Load & Apply
      </button>
    </div>
  </section>

  <div class="h-px bg-white/6"></div>

  <!-- TEXT WRAP -->
  <section class="space-y-3">
    <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Text wrap</div>
    {#each [
      { label: "Heading wrap", token: "--sf-heading-text-wrap", defaultVal: "balance" },
      { label: "Body wrap",    token: "--sf-body-text-wrap",    defaultVal: "pretty" },
    ] as row (row.token)}
      {@const current = overrides[row.token] ?? row.defaultVal}
      <div>
        <div class="text-[10px] font-semibold text-slate-400 mb-1.5">{row.label}</div>
        <div class="flex gap-1">
          {#each WRAP_OPTIONS as o (o.value)}
            <button
              onclick={() => o.value === row.defaultVal && !(row.token in overrides) ? undefined : (o.value === row.defaultVal ? onReset(row.token) : onSet(row.token, o.value))}
              class={`flex-1 px-2 py-1.5 rounded-lg text-[10px] border transition-all cursor-pointer ${
                current === o.value
                  ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-200"
                  : "border-white/8 text-slate-400 hover:bg-white/5 hover:text-slate-200"
              }`}
            >{o.label}</button>
          {/each}
        </div>
      </div>
    {/each}
  </section>

  <div class="h-px bg-white/6"></div>

  <!-- FONT WEIGHTS -->
  <section class="space-y-4">
    <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Font weights</div>
    {#each [
      { label: "Body",        tokenName: "--sf-font-weight-body" },
      { label: "Heading",     tokenName: "--sf-font-weight-heading" },
      { label: "Display",     tokenName: "--sf-font-weight-display" },
      { label: "Interactive", tokenName: "--sf-font-weight-interactive" },
    ] as row (row.tokenName)}
      {@const defaultVal = WEIGHT_DEFAULTS[row.tokenName] ?? "400"}
      {@const current = overrides[row.tokenName] ?? defaultVal}
      {@const isOverridden = row.tokenName in overrides}
      <div class="group">
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-[11px] font-semibold text-slate-200">{row.label}</span>
          {#if isOverridden}
            <button onclick={() => onReset(row.tokenName)} class="text-[9px] text-slate-500 hover:text-rose-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-colors">reset</button>
          {/if}
        </div>
        <div class="flex gap-1">
          {#each WEIGHT_OPTIONS as w (w)}
            <button
              onclick={() => w === defaultVal && !isOverridden ? undefined : (w === defaultVal ? onReset(row.tokenName) : onSet(row.tokenName, w))}
              style={`font-weight: ${parseInt(w)}`}
              class={`flex-1 py-1.5 rounded-lg text-[10px] border transition-all cursor-pointer font-mono ${
                current === w
                  ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-200"
                  : "border-white/8 text-slate-400 hover:bg-white/5 hover:text-slate-200"
              }`}
            >{w}</button>
          {/each}
        </div>
      </div>
    {/each}
  </section>

  <div class="h-px bg-white/6"></div>

  <!-- RHYTHM -->
  <section class="space-y-4">
    <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Rhythm</div>
    <SliderRow
      label="Line height (normal)" value={leading} min={1.1} max={2.2} step={0.05}
      help="Body text line-height. Display sizes auto-compress via taper."
      overridden={"--sf-leading-normal" in overrides}
      onChange={(v) => onSet("--sf-leading-normal", String(v))}
      onReset={() => onReset("--sf-leading-normal")}
    />
    <SliderRow
      label="Leading taper" value={taper} min={0} max={0.5} step={0.01}
      help="How aggressively large display sizes shrink their line-height."
      overridden={"--sf-leading-taper" in overrides}
      onChange={(v) => onSet("--sf-leading-taper", String(v))}
      onReset={() => onReset("--sf-leading-taper")}
    />
    <div class="group">
      <div class="flex items-center justify-between mb-1.5">
        <span class="text-[11px] font-semibold text-slate-200">Letter spacing (normal)</span>
        {#if "--sf-tracking-normal" in overrides}
          <button onclick={() => onReset("--sf-tracking-normal")} class="text-[9px] text-slate-500 hover:text-rose-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-colors">reset</button>
        {/if}
      </div>
      <RangeWithNumber
        value={parseFloat(overrides["--sf-tracking-normal"]?.replace("em","") ?? "0")}
        min={-0.05} max={0.1} step={0.005} unit="em"
        onChange={(v) => onSet("--sf-tracking-normal", `${v}em`)}
      />
    </div>
    <!-- Heading tracking (new) -->
    <div class="group">
      <div class="flex items-center justify-between mb-1.5">
        <span class="text-[11px] font-semibold text-slate-200">Letter spacing (heading)</span>
        {#if "--sf-tracking-heading" in overrides}
          <button onclick={() => onReset("--sf-tracking-heading")} class="text-[9px] text-slate-500 hover:text-rose-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-colors">reset</button>
        {/if}
      </div>
      <RangeWithNumber
        value={trackingHeading}
        min={-0.05} max={0.1} step={0.005} unit="em"
        onChange={(v) => onSet("--sf-tracking-heading", `${v}em`)}
      />
    </div>
  </section>

  <div class="h-px bg-white/6"></div>

  <!-- SCALE PREVIEW -->
  <section>
    <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Scale preview</div>
    <div class="bg-white/4 rounded-xl border border-white/8 p-3 space-y-1 overflow-hidden">
      {#each [...TEXT_STEPS].reverse() as { label, factor } (label)}
        {@const midBase = (baseMin + baseMax) / 2}
        {@const size = midBase * factor * textScale}
        <div class="flex items-baseline gap-2">
          <span class="text-[9px] font-mono text-slate-600 w-6 shrink-0 text-right">{label}</span>
          <span
            class="text-white/80 font-medium leading-none truncate"
            style={`font-size: ${Math.min(size, 2.5)}rem; font-family: ${currentBodyFont || "inherit"}`}
          >
            Aa
          </span>
          <span class="text-[9px] font-mono text-slate-600 ml-auto shrink-0">{size.toFixed(2)}rem</span>
        </div>
      {/each}
    </div>
  </section>
</div>
