<script lang="ts">
  import { Check, Copy, Download } from 'lucide-svelte';
  import { fa } from '../../lib/codec';

  let { overrides }: {
    overrides: Record<string, string>;
  } = $props();

  let outputMode = $state<"layer" | "root">("layer");
  let copied = $state(false);

  let css = $derived(fa(overrides, { mode: outputMode, banner: true }));
  let count = $derived(Object.keys(overrides).length);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(css);
      copied = true;
      setTimeout(() => { copied = false; }, 2000);
    } catch {}
  }

  function handleDownload() {
    const blob = new Blob([css], { type: "text/css" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "slashed-overrides.css";
    a.click();
    URL.revokeObjectURL(url);
  }
</script>

<div class="p-4 space-y-4 overflow-y-auto flex-1 h-full">
  <div>
    <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Export CSS</div>
    <p class="text-[11px] text-slate-400 leading-relaxed">
      {count > 0
        ? `${count} override${count !== 1 ? "s" : ""} ready to export.`
        : "No overrides yet. Customise tokens, then export."}
    </p>
  </div>

  <!-- Output mode toggle -->
  <div class="flex bg-white/5 border border-white/8 rounded-lg p-0.5">
    <button
      onclick={() => { outputMode = "layer"; }}
      class={`flex-1 py-1.5 rounded-md text-[11px] font-bold transition-all cursor-pointer ${outputMode === "layer" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
    >
      @layer
    </button>
    <button
      onclick={() => { outputMode = "root"; }}
      class={`flex-1 py-1.5 rounded-md text-[11px] font-bold transition-all cursor-pointer ${outputMode === "root" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
    >
      :root
    </button>
  </div>

  <!-- CSS output -->
  <div class="relative">
    <pre class="bg-[#06060a] border border-white/8 rounded-xl p-4 text-[10px] font-mono text-slate-300 overflow-x-auto max-h-80 whitespace-pre-wrap">{css || "/* No overrides */"}</pre>
    <div class="absolute top-2 right-2 flex gap-1">
      <button
        onclick={handleCopy}
        class="p-1.5 rounded-lg bg-white/5 hover:bg-white/12 text-slate-400 hover:text-white transition-all cursor-pointer border border-white/8"
        title="Copy to clipboard"
      >
        {#if copied}
          <Check class="w-3 h-3 text-emerald-400" />
        {:else}
          <Copy class="w-3 h-3" />
        {/if}
      </button>
      <button
        onclick={handleDownload}
        class="p-1.5 rounded-lg bg-white/5 hover:bg-white/12 text-slate-400 hover:text-white transition-all cursor-pointer border border-white/8"
        title="Download .css"
      >
        <Download class="w-3 h-3" />
      </button>
    </div>
  </div>

  <div class="rounded-lg bg-indigo-500/8 border border-indigo-500/15 p-3 space-y-2">
    <div class="text-[10px] font-bold text-indigo-300">Usage</div>
    <div class="text-[10px] text-slate-400 leading-relaxed">
      Paste this CSS into your project after the SLASHED import.
    </div>
    <pre class="text-[9px] font-mono text-slate-500 bg-black/30 rounded p-2 overflow-x-auto">{`@import 'slashed/slashed.full.css';
@import './slashed-overrides.css';`}</pre>
  </div>
</div>
