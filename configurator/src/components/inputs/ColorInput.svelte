<script lang="ts">
  import { resolveColor, previewVersion } from '../../lib/previewResolver.svelte';

  let {
    token,
    value,
    placeholder,
    isOverridden,
    onSet,
    onReset,
  }: {
    token: string;
    value: string;
    placeholder?: string;
    isOverridden: boolean;
    onSet: (v: string) => void;
    onReset: () => void;
  } = $props();

  let editing = $state(false);

  function paint(expr: string): string {
    void previewVersion.value;
    return resolveColor(expr) || expr || "transparent";
  }

  let swatchColor = $derived(paint(value || `var(${token})`));

  // Detect if the current value is a CSS variable reference (can't use native picker)
  let isVar = $derived(value.trim().startsWith("var(") || value.trim().startsWith("--"));

  // Convert rgb(...) string to hex for native picker seed
  function toHex(rgb: string): string {
    const m = rgb.match(/rgb\w*\((\d+)[,\s]+(\d+)[,\s]+(\d+)/);
    if (!m) return "#6366f1";
    return "#" + [m[1], m[2], m[3]].map(n => parseInt(n).toString(16).padStart(2, "0")).join("");
  }
</script>

<div class="flex items-center gap-2">
  <!-- Swatch / native picker trigger -->
  <div class="relative shrink-0 w-7 h-7 rounded border border-white/10 overflow-hidden cursor-pointer">
    <div class="absolute inset-0" style={`background: ${swatchColor}`}></div>
    {#if !isVar}
      <input
        type="color"
        value={toHex(swatchColor)}
        oninput={(e) => onSet((e.target as HTMLInputElement).value)}
        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        tabindex="-1"
      />
    {/if}
  </div>

  <!-- Text display / editable input -->
  {#if editing}
    <input
      value={value}
      autofocus
      onblur={(e) => {
        const v = (e.target as HTMLInputElement).value.trim();
        if (!v) onReset();
        else onSet(v);
        editing = false;
      }}
      onkeydown={(e) => {
        if (e.key === "Enter") (e.currentTarget as HTMLInputElement).blur();
        if (e.key === "Escape") editing = false;
      }}
      placeholder={placeholder ?? "default"}
      class="flex-1 bg-white/8 border border-indigo-500/50 rounded px-1.5 py-0.5 text-[10px] font-mono text-slate-200 focus:outline-none"
    />
  {:else}
    <button
      onclick={() => { editing = true; }}
      class="flex-1 text-left text-[9px] font-mono text-slate-500 hover:text-slate-200 truncate cursor-pointer transition-colors"
    >
      {#if isOverridden}
        <span class="text-indigo-300">{value}</span>
      {:else}
        {placeholder ?? "default"}
      {/if}
    </button>
  {/if}

  {#if isOverridden}
    <button onclick={onReset} class="text-[8px] text-slate-500 hover:text-rose-400 cursor-pointer shrink-0">reset</button>
  {/if}
</div>
