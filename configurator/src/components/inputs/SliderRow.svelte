<script lang="ts">
  import RangeWithNumber from './RangeWithNumber.svelte';

  let {
    label, help, value, min, max, step, unit, overridden, onChange, onReset,
    rawDefault, currentRaw, onRawSet, variableOptions
  }: {
    label?: string;
    help?: string;
    value: number;
    min: number;
    max: number;
    step: number;
    unit?: string;
    overridden: boolean;
    onChange: (v: number) => void;
    onReset: () => void;
    rawDefault?: string;
    currentRaw?: string;
    onRawSet?: (v: string) => void;
    /** Sibling scale steps (e.g. the space or radius scale) offered alongside rawDefault. */
    variableOptions?: { label: string; value: string }[];
  } = $props();

  const CUSTOM = "__sf_custom__";

  function prettyVar(raw: string): string {
    const m = raw.match(/^var\(\s*(--sf-[\w-]+)/);
    return m ? m[1].replace(/^--sf-/, "") : raw;
  }

  // Dropdown options: the token's own default first, then any sibling scale steps.
  let allOptions = $derived.by(() => {
    const opts: { label: string; value: string }[] = [];
    if (rawDefault) opts.push({ label: `${prettyVar(rawDefault)} (default)`, value: rawDefault });
    for (const o of variableOptions ?? []) {
      if (o.value !== rawDefault) opts.push(o);
    }
    return opts;
  });

  let matchedOption = $derived(
    allOptions.find((o) => o.value === (currentRaw ?? rawDefault))
  );

  let hasVarInfo = $derived(!!rawDefault && !!onRawSet);

  // An override that isn't one of the known options but still looks like a
  // CSS expression (var()/calc()/clamp()/…) — surface it as editable text
  // rather than silently falling back to a resolved slider number.
  let isExprShaped = $derived(
    !!currentRaw && /^(var|calc|clamp|min|max|env)\(/.test(currentRaw.trim())
  );

  // User-driven view override, layered on top of the value-derived state above.
  // 'none' = auto-detect from currentRaw; 'slider'/'raw' = user forced a view
  // while outside the picker (via "Custom value…" or the </> toggle).
  let manualView = $state<'none' | 'slider' | 'raw'>('none');

  // The dropdown is shown whenever the current state maps to a known option
  // (the default, or one of the sibling scale steps) and the user hasn't
  // explicitly asked to go custom.
  let showPicker = $derived(
    hasVarInfo && manualView === 'none' && (currentRaw === undefined || !!matchedOption)
  );

  // Outside the picker, decide between the raw-CSS text box and the slider.
  let showRawText = $derived(
    hasVarInfo && !showPicker && (manualView === 'raw' || (manualView === 'none' && isExprShaped))
  );

  let selectValue = $derived(matchedOption?.value ?? rawDefault ?? CUSTOM);

  let rawDraft = $state('');
  let isEditingRaw = $state(false);

  $effect(() => {
    if (!isEditingRaw) rawDraft = currentRaw ?? '';
  });

  function pickOption(v: string) {
    if (v === CUSTOM) {
      manualView = 'slider';
      return;
    }
    manualView = 'none';
    if (v === rawDefault) onReset();
    else onRawSet?.(v);
  }

  function backToVariable() {
    manualView = 'none';
    onReset();
  }
</script>

<div class="group">
  <div class="flex items-center justify-between mb-1.5">
    {#if label}
      <span class="text-[11px] font-semibold text-slate-800 dark:text-slate-200">{label}</span>
    {:else}
      <span></span>
    {/if}
    <div class="flex items-center gap-1.5">
      {#if hasVarInfo && !showPicker}
        <button
          onclick={() => { manualView = showRawText ? 'slider' : 'raw'; }}
          title={showRawText ? "Switch to slider" : "Enter raw CSS value"}
          class={`text-[9px] font-mono cursor-pointer transition-all px-0.5 ${
            showRawText
              ? 'text-indigo-600 dark:text-indigo-400'
              : 'opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 focus:opacity-100 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400'
          }`}
        >&lt;/&gt;</button>
      {/if}
      {#if overridden}
        <button
          onclick={() => { manualView = 'none'; onReset(); }}
          class="text-[9px] text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 focus:opacity-100 transition-colors"
        >reset</button>
      {/if}
    </div>
  </div>

  {#if showPicker}
    <select
      value={selectValue}
      aria-label={label || "Value"}
      onchange={(e) => pickOption((e.target as HTMLSelectElement).value)}
      class="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded px-2 py-1.5 text-[11px] font-mono text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500"
    >
      {#each allOptions as o (o.value)}
        <option value={o.value}>{o.label}</option>
      {/each}
      <option value={CUSTOM}>Custom value…</option>
    </select>
  {:else if showRawText}
    <input
      type="text"
      value={rawDraft}
      placeholder={rawDefault}
      onfocus={() => { isEditingRaw = true; }}
      onblur={() => {
        isEditingRaw = false;
        if (!rawDraft.trim()) backToVariable();
      }}
      oninput={(e) => {
        rawDraft = (e.target as HTMLInputElement).value;
        const v = rawDraft.trim();
        if (v) onRawSet?.(v);
      }}
      class="w-full bg-black/8 dark:bg-white/8 border border-indigo-500/50 rounded px-2 py-1.5 text-[11px] font-mono text-slate-700 dark:text-slate-300 placeholder:text-slate-500 focus:outline-none"
    />
  {:else}
    <RangeWithNumber {value} {min} {max} {step} {unit} {onChange} />
    {#if hasVarInfo}
      <button
        onclick={backToVariable}
        class="text-[9px] font-mono text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer mt-0.5"
      >&larr; back to variable</button>
    {/if}
  {/if}

  {#if help}
    <p class="text-[10px] text-slate-400 dark:text-slate-600 mt-1 leading-relaxed">{help}</p>
  {/if}
</div>
