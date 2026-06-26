<script lang="ts">
  import { KNOBS_BY_DOMAIN } from '../../lib/powerKnobs';
  import PowerKnobRow from '../inputs/PowerKnobRow.svelte';
  import SliderRow from '../inputs/SliderRow.svelte';

  let { overrides, onSet, onReset }: {
    overrides: Record<string, string>;
    onSet: (name: string, value: string) => void;
    onReset: (name: string) => void;
  } = $props();

  const DURATIONS = [
    { label: "Instant", token: "--sf-duration-instant", base: 100, max: 300  },
    { label: "Fast",    token: "--sf-duration-fast",    base: 150, max: 500  },
    { label: "Normal",  token: "--sf-duration-normal",  base: 250, max: 800  },
    { label: "Slow",    token: "--sf-duration-slow",    base: 400, max: 1200 },
    { label: "Slower",  token: "--sf-duration-slower",  base: 600, max: 2000 },
  ];

  const EASINGS = [
    { label: "Linear",     token: "--sf-ease-linear",    value: "linear",                               preview: "M0,40 L40,0" },
    { label: "Ease out",   token: "--sf-ease-out",       value: "cubic-bezier(0.25, 0, 0.15, 1)",      preview: "M0,40 C8,40 28,0 40,0" },
    { label: "Ease in",    token: "--sf-ease-in",        value: "cubic-bezier(0.5, 0, 0.75, 0.25)",    preview: "M0,40 C12,40 32,32 40,0" },
    { label: "Ease in-out",token: "--sf-ease-in-out",    value: "cubic-bezier(0.4, 0, 0.2, 1)",        preview: "M0,40 C8,40 32,0 40,0" },
    { label: "Spring",     token: "--sf-ease-spring",    value: "linear(0, 0.5, 1.1, 0.95, 1.02, 1)", preview: "M0,40 C10,20 20,-4 28,-2 S38,2 40,0" },
    { label: "Bounce",     token: "--sf-ease-bounce",    value: "linear(0, 0.35 18%, 1 32%, 0.86 42%, 1.02 56%, 0.98 72%, 1)", preview: "M0,40 L12,16 L20,0 L26,6 L32,-1 L36,1 L40,0" },
    { label: "Elastic",    token: "--sf-ease-elastic",   value: "linear(0, 0.3, 1.2, 0.9, 1.05, 1)",  preview: "M0,40 C8,40 16,-10 24,-2 S36,2 40,0" },
    { label: "Overshoot",  token: "--sf-ease-overshoot", value: "cubic-bezier(0.34, 1.56, 0.64, 1)",  preview: "M0,40 C8,40 20,-10 40,0" },
  ];

  const knobs = KNOBS_BY_DOMAIN["motion"] ?? [];

  let scale = $derived(parseFloat(overrides["--sf-motion-scale"] ?? "1"));
  let motionDisabled = $derived(overrides["--sf-motion-scale"] === "0");

  // Animation demo state
  let animating = $state(false);
  let animOffsetX = $state(0);

  function getDuration(token: string, base: number): number {
    const raw = overrides[token];
    if (raw) return parseFloat(raw);
    return Math.round(base * scale);
  }

  function playDemo() {
    if (animating) return;
    animating = true;
    animOffsetX = 180;
    const dur = getDuration("--sf-duration-normal", 250);
    setTimeout(() => {
      animOffsetX = 0;
      setTimeout(() => { animating = false; }, dur);
    }, dur);
  }
</script>

<div class="p-4 space-y-5">

  <!-- Quick toggle -->
  <div class="flex items-center justify-between p-3 rounded-xl bg-white/4 border border-white/8">
    <div>
      <div class="text-[11px] font-semibold text-slate-200">Disable motion</div>
      <div class="text-[9px] text-slate-500 mt-0.5">Respects prefers-reduced-motion</div>
    </div>
    <button
      title={motionDisabled ? "Enable motion" : "Disable motion"}
      onclick={() => {
        if (motionDisabled) onReset("--sf-motion-scale");
        else onSet("--sf-motion-scale", "0");
      }}
      class={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
        motionDisabled ? "bg-indigo-600" : "bg-white/10"
      }`}
    >
      <div class={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
        motionDisabled ? "translate-x-4" : "translate-x-0.5"
      }`}></div>
    </button>
  </div>

  <!-- Global scale knob -->
  <div>
    <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Global scale</div>
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

  <div class="h-px bg-white/6"></div>

  <!-- INDIVIDUAL DURATIONS -->
  <section class="space-y-4">
    <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Duration overrides</div>
    <p class="text-[10px] text-slate-600 leading-relaxed">
      Set absolute ms values to override the fluid scale calculation.
    </p>
    {#each DURATIONS as d (d.token)}
      {@const computed = getDuration(d.token, d.base)}
      <SliderRow
        label={d.label}
        value={computed}
        min={0}
        max={d.max}
        step={10}
        unit="ms"
        overridden={d.token in overrides}
        onChange={(v) => onSet(d.token, `${v}ms`)}
        onReset={() => onReset(d.token)}
      />
    {/each}
  </section>

  <div class="h-px bg-white/6"></div>

  <!-- EASING CURVES -->
  <section class="space-y-3">
    <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Easing curves</div>
    <p class="text-[10px] text-slate-600 leading-relaxed">
      Customize the named easing tokens used throughout the design system.
    </p>
    <div class="grid grid-cols-2 gap-1.5">
      {#each EASINGS as e (e.token)}
        {@const isOverridden = e.token in overrides}
        <div class={`p-2.5 rounded-xl border transition-all ${
          isOverridden
            ? "bg-indigo-500/10 border-indigo-500/30"
            : "border-white/8 bg-white/3"
        }`}>
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-[10px] font-semibold text-slate-300">{e.label}</span>
            {#if isOverridden}
              <button
                onclick={() => onReset(e.token)}
                class="text-[8px] text-slate-500 hover:text-rose-400 cursor-pointer"
              >reset</button>
            {/if}
          </div>
          <svg width="40" height="28" viewBox="0 0 40 28" class="overflow-visible">
            <path d={e.preview} stroke="rgb(99 102 241 / 0.6)" stroke-width="1.5" fill="none" stroke-linecap="round" />
          </svg>
          <div class="text-[8px] font-mono text-slate-600 mt-1 truncate">{e.token.replace("--sf-ease-", "")}</div>
        </div>
      {/each}
    </div>
  </section>

  <div class="h-px bg-white/6"></div>

  <!-- ANIMATION DEMO -->
  <section class="space-y-3">
    <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Animation demo</div>
    <div class="bg-white/4 rounded-xl border border-white/8 p-4">
      <div class="relative h-10 overflow-hidden rounded">
        <div
          class="absolute top-1 h-8 w-8 bg-indigo-500 rounded-lg"
          style={`transform: translateX(${animOffsetX}px); transition: transform ${getDuration("--sf-duration-normal", 250)}ms ${overrides["--sf-ease-out"] ?? "cubic-bezier(0.25, 0, 0.15, 1)"}`}
        ></div>
      </div>
      <button
        onclick={playDemo}
        disabled={animating}
        class="mt-3 w-full py-1.5 rounded-lg text-[10px] font-bold border border-indigo-500/40 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 transition-all cursor-pointer disabled:opacity-40"
      >
        {animating ? "Animating…" : "▶ Play"}
      </button>
    </div>
  </section>

  <div class="h-px bg-white/6"></div>

  <!-- Duration preview -->
  <div>
    <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Duration preview</div>
    <div class="bg-white/4 rounded-xl border border-white/8 p-4 space-y-3">
      {#each DURATIONS as d (d.label)}
        {@const actual = getDuration(d.token, d.base)}
        <div class="flex items-center gap-3">
          <span class="text-[10px] text-slate-500 w-14 shrink-0">{d.label}</span>
          <div class="flex-1 h-1 bg-white/8 rounded-full overflow-hidden">
            <div
              class="h-full bg-indigo-500 rounded-full"
              style={`width: ${Math.min((actual / 1200) * 100, 100)}%`}
            ></div>
          </div>
          <span class="text-[9px] font-mono text-slate-500 w-10 text-right">{actual}ms</span>
        </div>
      {/each}
    </div>
  </div>
</div>
