<script lang="ts">
  import { Sun, Moon, Smartphone, Tablet, Monitor, RefreshCw, ExternalLink } from 'lucide-svelte';
  import type { PreviewTemplate } from '../../types';
  import { fa } from '../../lib/codec';
  // Import the built framework CSS at Vite compile time — always in sync with dist.
  import frameworkCSSStatic from '../../../../dist/slashed.full.css?raw';

  let { overrides, previewTheme, previewWidth, previewMotion, previewTemplate,
    onThemeChange, onWidthChange, onMotionChange, onTemplateChange }: {
    overrides: Record<string, string>;
    previewTheme: "light" | "dark";
    previewWidth: "fluid" | "mobile" | "tablet" | "desktop";
    previewMotion: "normal" | "slow" | "none";
    previewTemplate: PreviewTemplate;
    onThemeChange: (t: "light" | "dark") => void;
    onWidthChange: (w: "fluid" | "mobile" | "tablet" | "desktop") => void;
    onMotionChange: (m: "normal" | "slow" | "none") => void;
    onTemplateChange: (t: PreviewTemplate) => void;
  } = $props();

  const TEMPLATES: { id: PreviewTemplate; label: string }[] = [
    { id: "marketing", label: "Marketing" },
    { id: "docs", label: "Docs" },
    { id: "dashboard", label: "Dashboard" },
    { id: "components", label: "Components" },
  ];

  const MARKETING_BODY = `
<header class="sf-site-header" style="position:sticky;top:0;z-index:50;background:var(--sf-color-surface-1);border-bottom:var(--sf-border-width-1) solid var(--sf-color-border);padding:var(--sf-space-3) var(--sf-space-6);">
  <div style="max-width:1200px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;">
    <div style="font-weight:700;font-size:var(--sf-text-lg);color:var(--sf-color-primary-600);">SlashedUI</div>
    <nav style="display:flex;gap:var(--sf-space-4);font-size:var(--sf-text-sm);">
      <a href="#" style="color:var(--sf-color-text-2);text-decoration:none;">Docs</a>
      <a href="#" style="color:var(--sf-color-text-2);text-decoration:none;">Components</a>
      <a href="#" style="color:var(--sf-color-text-2);text-decoration:none;">Themes</a>
    </nav>
    <button class="sf-btn sf-btn-primary" style="font-size:var(--sf-text-sm);">Get Started</button>
  </div>
</header>
<main style="max-width:1200px;margin:0 auto;padding:var(--sf-space-12) var(--sf-space-6);">
  <section style="text-align:center;margin-bottom:var(--sf-space-16);">
    <div style="display:inline-flex;align-items:center;gap:var(--sf-space-2);background:var(--sf-color-primary-50);color:var(--sf-color-primary-700);border:var(--sf-border-width-1) solid var(--sf-color-primary-200);border-radius:var(--sf-radius-full);padding:var(--sf-space-1) var(--sf-space-3);font-size:var(--sf-text-xs);font-weight:600;margin-bottom:var(--sf-space-6);">
      ✨ Now in v2 — OKLCH color engine
    </div>
    <h1 style="font-size:var(--sf-text-display-l);font-weight:800;color:var(--sf-color-text-1);margin-bottom:var(--sf-space-5);line-height:1.1;">
      Design systems,<br/><span style="color:var(--sf-color-primary-600);">perfected.</span>
    </h1>
    <p style="font-size:var(--sf-text-lg);color:var(--sf-color-text-2);max-width:540px;margin:0 auto var(--sf-space-8);">
      A CSS framework built on 840 design tokens. One line to install, infinitely customisable.
    </p>
    <div style="display:flex;gap:var(--sf-space-3);justify-content:center;flex-wrap:wrap;">
      <button class="sf-btn sf-btn-primary" style="font-size:var(--sf-text-base);">Start for free</button>
      <button class="sf-btn sf-btn-ghost" style="font-size:var(--sf-text-base);">View docs →</button>
    </div>
  </section>
  <section style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--sf-space-5);margin-bottom:var(--sf-space-16);">
    <div style="background:var(--sf-color-surface-2);border:var(--sf-border-width-1) solid var(--sf-color-border);border-radius:var(--sf-radius-l);padding:var(--sf-space-6);">
      <div style="font-size:2rem;margin-bottom:var(--sf-space-3);">🎨</div>
      <h3 style="font-size:var(--sf-text-lg);font-weight:700;color:var(--sf-color-text-1);margin-bottom:var(--sf-space-2);">OKLCH Colors</h3>
      <p style="font-size:var(--sf-text-sm);color:var(--sf-color-text-2);line-height:1.6;">Perceptually uniform color ramps with auto dark-mode derivation.</p>
    </div>
    <div style="background:var(--sf-color-surface-2);border:var(--sf-border-width-1) solid var(--sf-color-border);border-radius:var(--sf-radius-l);padding:var(--sf-space-6);">
      <div style="font-size:2rem;margin-bottom:var(--sf-space-3);">📐</div>
      <h3 style="font-size:var(--sf-text-lg);font-weight:700;color:var(--sf-color-text-1);margin-bottom:var(--sf-space-2);">Fluid Scales</h3>
      <p style="font-size:var(--sf-text-sm);color:var(--sf-color-text-2);line-height:1.6;">Type and space that scales smoothly from mobile to 4K.</p>
    </div>
    <div style="background:var(--sf-color-surface-2);border:var(--sf-border-width-1) solid var(--sf-color-border);border-radius:var(--sf-radius-l);padding:var(--sf-space-6);">
      <div style="font-size:2rem;margin-bottom:var(--sf-space-3);">⚡</div>
      <h3 style="font-size:var(--sf-text-lg);font-weight:700;color:var(--sf-color-text-1);margin-bottom:var(--sf-space-2);">Zero JS</h3>
      <p style="font-size:var(--sf-text-sm);color:var(--sf-color-text-2);line-height:1.6;">Pure CSS custom properties — works with any framework.</p>
    </div>
  </section>
  <section style="background:linear-gradient(135deg,var(--sf-color-primary-600),var(--sf-color-action-600,var(--sf-color-primary-700)));border-radius:var(--sf-radius-xl);padding:var(--sf-space-10) var(--sf-space-8);text-align:center;color:#fff;">
    <h2 style="font-size:var(--sf-text-display-s);font-weight:800;margin-bottom:var(--sf-space-3);">Ready to ship faster?</h2>
    <p style="font-size:var(--sf-text-base);opacity:0.85;margin-bottom:var(--sf-space-6);">Join 12,000+ developers using SLASHED in production.</p>
    <button style="background:#fff;color:var(--sf-color-primary-700);border:none;border-radius:var(--sf-radius-m);padding:var(--sf-space-3) var(--sf-space-7);font-size:var(--sf-text-base);font-weight:700;cursor:pointer;">Install now — it's free</button>
  </section>
</main>`;

  const DOCS_BODY = `
<div style="display:grid;grid-template-columns:240px 1fr;height:100%;gap:0;">
  <aside style="background:var(--sf-color-surface-1);border-right:var(--sf-border-width-1) solid var(--sf-color-border);padding:var(--sf-space-6);overflow-y:auto;">
    <div style="font-size:var(--sf-text-xs);font-weight:700;color:var(--sf-color-text-3);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:var(--sf-space-3);">Getting started</div>
    <ul style="list-style:none;padding:0;margin:0 0 var(--sf-space-5);">
      <li style="padding:var(--sf-space-1-5) var(--sf-space-2);border-radius:var(--sf-radius-s);background:var(--sf-color-primary-100);color:var(--sf-color-primary-700);font-size:var(--sf-text-sm);font-weight:600;margin-bottom:2px;">Introduction</li>
      <li style="padding:var(--sf-space-1-5) var(--sf-space-2);font-size:var(--sf-text-sm);color:var(--sf-color-text-2);margin-bottom:2px;cursor:pointer;">Installation</li>
      <li style="padding:var(--sf-space-1-5) var(--sf-space-2);font-size:var(--sf-text-sm);color:var(--sf-color-text-2);margin-bottom:2px;cursor:pointer;">Quick start</li>
    </ul>
  </aside>
  <main style="padding:var(--sf-space-8) var(--sf-space-10);overflow-y:auto;max-width:800px;">
    <h1 style="font-size:var(--sf-text-display-s);font-weight:800;color:var(--sf-color-text-1);margin-bottom:var(--sf-space-4);">Introduction</h1>
    <p style="font-size:var(--sf-text-base);color:var(--sf-color-text-2);line-height:1.7;margin-bottom:var(--sf-space-5);">SLASHED is a CSS design-token framework built around ~840 custom properties.</p>
    <div style="background:var(--sf-color-surface-2);border:var(--sf-border-width-1) solid var(--sf-color-border);border-radius:var(--sf-radius-m);padding:var(--sf-space-4) var(--sf-space-5);font-family:var(--sf-font-mono);font-size:var(--sf-text-sm);color:var(--sf-color-text-1);margin-bottom:var(--sf-space-6);">npm install slashed</div>
  </main>
</div>`;

  const DASHBOARD_BODY = `
<div style="display:grid;grid-template-columns:200px 1fr;height:100%;background:var(--sf-color-surface-1);">
  <aside style="background:var(--sf-color-surface-1);border-right:var(--sf-border-width-1) solid var(--sf-color-border);padding:var(--sf-space-4);">
    <div style="font-size:var(--sf-text-sm);font-weight:700;color:var(--sf-color-text-1);margin-bottom:var(--sf-space-5);padding:var(--sf-space-2);">⚡ Dashboard</div>
    <ul style="list-style:none;padding:0;margin:0;">
      <li style="padding:var(--sf-space-2) var(--sf-space-3);border-radius:var(--sf-radius-s);background:var(--sf-color-primary-100);color:var(--sf-color-primary-700);font-size:var(--sf-text-sm);font-weight:600;margin-bottom:2px;">Overview</li>
      <li style="padding:var(--sf-space-2) var(--sf-space-3);font-size:var(--sf-text-sm);color:var(--sf-color-text-2);margin-bottom:2px;cursor:pointer;">Analytics</li>
      <li style="padding:var(--sf-space-2) var(--sf-space-3);font-size:var(--sf-text-sm);color:var(--sf-color-text-2);margin-bottom:2px;cursor:pointer;">Users</li>
    </ul>
  </aside>
  <main style="padding:var(--sf-space-6);overflow-y:auto;">
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:var(--sf-space-4);margin-bottom:var(--sf-space-6);">
      <div style="background:var(--sf-color-surface-2);border:var(--sf-border-width-1) solid var(--sf-color-border);border-radius:var(--sf-radius-l);padding:var(--sf-space-5);">
        <div style="font-size:var(--sf-text-xs);font-weight:600;color:var(--sf-color-text-3);text-transform:uppercase;margin-bottom:var(--sf-space-2);">Revenue</div>
        <div style="font-size:var(--sf-text-2xl);font-weight:800;color:var(--sf-color-text-1);">$48.2k</div>
        <div style="font-size:var(--sf-text-xs);color:var(--sf-color-success-600);">↑ 12% vs last month</div>
      </div>
      <div style="background:var(--sf-color-surface-2);border:var(--sf-border-width-1) solid var(--sf-color-border);border-radius:var(--sf-radius-l);padding:var(--sf-space-5);">
        <div style="font-size:var(--sf-text-xs);font-weight:600;color:var(--sf-color-text-3);text-transform:uppercase;margin-bottom:var(--sf-space-2);">Users</div>
        <div style="font-size:var(--sf-text-2xl);font-weight:800;color:var(--sf-color-text-1);">12,431</div>
        <div style="font-size:var(--sf-text-xs);color:var(--sf-color-success-600);">↑ 8% vs last month</div>
      </div>
      <div style="background:var(--sf-color-surface-2);border:var(--sf-border-width-1) solid var(--sf-color-border);border-radius:var(--sf-radius-l);padding:var(--sf-space-5);">
        <div style="font-size:var(--sf-text-xs);font-weight:600;color:var(--sf-color-text-3);text-transform:uppercase;margin-bottom:var(--sf-space-2);">Conversions</div>
        <div style="font-size:var(--sf-text-2xl);font-weight:800;color:var(--sf-color-text-1);">3.6%</div>
        <div style="font-size:var(--sf-text-xs);color:var(--sf-color-warning-600);">→ Flat</div>
      </div>
      <div style="background:var(--sf-color-surface-2);border:var(--sf-border-width-1) solid var(--sf-color-border);border-radius:var(--sf-radius-l);padding:var(--sf-space-5);">
        <div style="font-size:var(--sf-text-xs);font-weight:600;color:var(--sf-color-text-3);text-transform:uppercase;margin-bottom:var(--sf-space-2);">Tickets open</div>
        <div style="font-size:var(--sf-text-2xl);font-weight:800;color:var(--sf-color-text-1);">24</div>
        <div style="font-size:var(--sf-text-xs);color:var(--sf-color-error-600);">↑ 3 since yesterday</div>
      </div>
    </div>
  </main>
</div>`;

  const COMPONENTS_BODY = `
<div style="padding:var(--sf-space-6);background:var(--sf-color-surface-1);min-height:100%;">
  <h2 style="font-size:var(--sf-text-xl);font-weight:700;color:var(--sf-color-text-1);margin-bottom:var(--sf-space-6);">Component showcase</h2>
  <div style="margin-bottom:var(--sf-space-8);">
    <div style="font-size:var(--sf-text-xs);font-weight:700;color:var(--sf-color-text-3);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:var(--sf-space-3);">Buttons</div>
    <div style="display:flex;gap:var(--sf-space-3);flex-wrap:wrap;align-items:center;">
      <button class="sf-btn sf-btn-primary">Primary</button>
      <button class="sf-btn sf-btn-secondary">Secondary</button>
      <button class="sf-btn sf-btn-ghost">Ghost</button>
      <button class="sf-btn sf-btn-danger">Danger</button>
      <button class="sf-btn sf-btn-primary" disabled>Disabled</button>
    </div>
  </div>
  <div style="margin-bottom:var(--sf-space-8);">
    <div style="font-size:var(--sf-text-xs);font-weight:700;color:var(--sf-color-text-3);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:var(--sf-space-3);">Typography ramp</div>
    <div style="display:flex;flex-direction:column;gap:var(--sf-space-2);">
      <div style="font-size:var(--sf-text-display-m);font-weight:800;color:var(--sf-color-text-1);line-height:1.1;">Display M</div>
      <div style="font-size:var(--sf-text-2xl);font-weight:700;color:var(--sf-color-text-1);">Heading 2XL</div>
      <div style="font-size:var(--sf-text-xl);font-weight:600;color:var(--sf-color-text-1);">Heading XL</div>
      <div style="font-size:var(--sf-text-base);color:var(--sf-color-text-2);line-height:1.6;">Body text. The quick brown fox jumps over the lazy dog.</div>
      <div style="font-size:var(--sf-text-sm);color:var(--sf-color-text-3);line-height:1.5;">Small caption text for metadata and secondary info.</div>
    </div>
  </div>
</div>`;

  const BODIES: Record<PreviewTemplate, string> = {
    marketing: MARKETING_BODY,
    docs: DOCS_BODY,
    dashboard: DASHBOARD_BODY,
    components: COMPONENTS_BODY,
  };

  function buildIframeHTML(
    ov: Record<string, string>,
    theme: "light" | "dark",
    motion: "normal" | "slow" | "none",
    template: PreviewTemplate,
    frameworkCSS: string,
  ): string {
    const css = fa(ov, { mode: "root", banner: false });
    const motionCSS =
      motion === "slow"
        ? "*, *::before, *::after { transition-duration: 200% !important; animation-duration: 200% !important; }"
        : motion === "none"
        ? "*, *::before, *::after { transition: none !important; animation: none !important; }"
        : "";

    return `<!DOCTYPE html>
<html lang="en" ${theme === "dark" ? 'class="sf-dark"' : ""} style="height:100%;margin:0;padding:0;">
<head>
  <meta charset="UTF-8">
  <title>SLASHED Preview</title>
  <style id="slashed-framework">${frameworkCSS}</style>
  <style id="slashed-overrides">
:root {
${css}
}
  </style>
  <style>
    html, body { height: 100%; margin: 0; padding: 0; }
    body {
      font-family: var(--sf-font-body, "Inter", sans-serif);
      background: var(--sf-color-bg, var(--sf-color-surface-1, #fff));
      color: var(--sf-color-text-1, #111);
      box-sizing: border-box;
    }
    .sf-btn {
      display: inline-flex; align-items: center; justify-content: center;
      padding: var(--sf-space-2) var(--sf-space-4);
      border-radius: var(--sf-radius-m);
      font-size: var(--sf-text-sm); font-weight: 600;
      border: var(--sf-border-width-1) solid transparent;
      cursor: pointer; transition: all 0.15s ease;
    }
    .sf-btn-primary { background: var(--sf-color-primary-600); color: #fff; border-color: var(--sf-color-primary-600); }
    .sf-btn-primary:hover { background: var(--sf-color-primary-700); }
    .sf-btn-secondary { background: var(--sf-color-surface-2); color: var(--sf-color-text-1); border-color: var(--sf-color-border); }
    .sf-btn-ghost { background: transparent; color: var(--sf-color-text-2); border-color: transparent; }
    .sf-btn-ghost:hover { background: var(--sf-color-surface-2); }
    .sf-btn-danger { background: var(--sf-color-error-600); color: #fff; }
    .sf-btn:disabled { opacity: 0.4; cursor: not-allowed; }
    ${motionCSS}
  </style>
</head>
<body>
${BODIES[template]}
</body>
</html>`;
  }

  let iframeEl = $state<HTMLIFrameElement | null>(null);
  let loaded = $state(false);
  let refresh = $state(0);

  let html = $derived(buildIframeHTML(overrides, previewTheme, previewMotion, previewTemplate, frameworkCSSStatic));

  $effect(() => {
    // Track reactive deps
    const _ov = overrides;
    const _theme = previewTheme;

    const iframe = iframeEl;
    if (!iframe || !loaded) return;
    const doc = iframe.contentDocument;
    if (!doc) return;

    const styleEl = doc.getElementById("slashed-overrides");
    if (styleEl) {
      const css = fa(_ov, { mode: "root", banner: false });
      styleEl.textContent = `:root {\n${css}\n}`;
    }

    if (_theme === "dark") {
      doc.documentElement.classList.add("sf-dark");
    } else {
      doc.documentElement.classList.remove("sf-dark");
    }
  });

  let isConstrained = $derived(previewWidth !== "fluid");

  function getWidthStyle(): string {
    if (previewWidth === "fluid") return "width:100%;height:100%";
    if (previewWidth === "mobile") return "width:390px;height:750px;border:1px solid rgba(255,255,255,0.12);border-radius:28px;overflow:hidden;background:#fff;box-shadow:0 32px 80px rgba(0,0,0,0.5)";
    if (previewWidth === "tablet") return "width:768px;height:900px;border:1px solid rgba(255,255,255,0.12);border-radius:24px;overflow:hidden;background:#fff;box-shadow:0 32px 80px rgba(0,0,0,0.5)";
    return "width:1024px;height:720px;border:1px solid rgba(255,255,255,0.12);border-radius:16px;overflow:hidden;background:#fff;box-shadow:0 32px 80px rgba(0,0,0,0.5)";
  }
</script>

<div class="flex flex-col flex-1 min-h-0 bg-[#09090e]">
  <!-- Preview toolbar -->
  <div class="h-10 bg-[#0d0d14] border-b border-white/8 flex items-center px-3 gap-2 shrink-0">
    <!-- Template tabs -->
    <div class="flex bg-white/5 border border-white/8 rounded-lg p-0.5 gap-0.5">
      {#each TEMPLATES as t (t.id)}
        <button
          onclick={() => onTemplateChange(t.id)}
          class={`px-2.5 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
            previewTemplate === t.id ? "bg-white/12 text-white" : "text-slate-500 hover:text-slate-300"
          }`}
        >
          {t.label}
        </button>
      {/each}
    </div>

    <div class="w-px h-4 bg-white/10 mx-1"></div>

    <!-- Width controls -->
    <div class="flex bg-white/5 border border-white/8 rounded-lg p-0.5 gap-0.5">
      {#each (["fluid", "desktop", "tablet", "mobile"] as const) as w (w)}
        <button
          onclick={() => onWidthChange(w)}
          title={w === "fluid" ? "Full width" : w === "desktop" ? "Desktop (1024px)" : w === "tablet" ? "Tablet (768px)" : "Mobile (390px)"}
          class={`p-1 rounded-md transition-all cursor-pointer ${previewWidth === w ? "bg-white/12 text-white" : "text-slate-500 hover:text-slate-300"}`}
        >
          {#if w === "mobile"}
            <Smartphone class="w-3 h-3" />
          {:else if w === "tablet"}
            <Tablet class="w-3 h-3" />
          {:else}
            <Monitor class="w-3 h-3" />
          {/if}
        </button>
      {/each}
    </div>

    <!-- Light/dark -->
    <div class="flex bg-white/5 border border-white/8 rounded-lg p-0.5 gap-0.5">
      <button
        onclick={() => onThemeChange("light")}
        class={`p-1 rounded-md transition-all cursor-pointer ${previewTheme === "light" ? "bg-white/12 text-white" : "text-slate-500 hover:text-slate-300"}`}
      >
        <Sun class="w-3 h-3" />
      </button>
      <button
        onclick={() => onThemeChange("dark")}
        class={`p-1 rounded-md transition-all cursor-pointer ${previewTheme === "dark" ? "bg-white/12 text-white" : "text-slate-500 hover:text-slate-300"}`}
      >
        <Moon class="w-3 h-3" />
      </button>
    </div>

    <div class="flex-1"></div>

    <!-- Motion -->
    <select
      value={previewMotion}
      onchange={(e) => onMotionChange((e.target as HTMLSelectElement).value as "normal" | "slow" | "none")}
      class="bg-white/5 border border-white/8 text-slate-400 rounded-lg px-2 py-0.5 text-[10px] font-bold focus:outline-none cursor-pointer"
    >
      <option value="normal">Normal motion</option>
      <option value="slow">Slow motion</option>
      <option value="none">No motion</option>
    </select>

    <!-- Refresh -->
    <button
      onclick={() => { loaded = false; refresh += 1; }}
      title="Reload preview"
      class="p-1 rounded-md text-slate-500 hover:text-slate-300 hover:bg-white/8 transition-all cursor-pointer"
    >
      <RefreshCw class="w-3 h-3" />
    </button>

    <!-- Open in new tab -->
    <button
      onclick={() => {
        const blob = new Blob([html], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
      }}
      title="Open in new tab"
      class="p-1 rounded-md text-slate-500 hover:text-slate-300 hover:bg-white/8 transition-all cursor-pointer"
    >
      <ExternalLink class="w-3 h-3" />
    </button>
  </div>

  <!-- Preview area -->
  <div class={`flex-1 min-h-0 flex items-center justify-center overflow-auto ${isConstrained ? "bg-[#06060a]" : ""}`}>
    <div style={getWidthStyle()} class={isConstrained ? "" : "w-full h-full"}>
      {#key refresh}
        <iframe
          bind:this={iframeEl}
          srcdoc={html}
          sandbox="allow-scripts allow-same-origin allow-forms"
          onload={() => { loaded = true; }}
          class="w-full h-full border-0"
          title="SLASHED live preview"
        ></iframe>
      {/key}
    </div>
  </div>
</div>
