<script lang="ts">
  import {
    Home, Palette, Type, Ruler, Layout, Square, Layers, Zap, Blocks,
    Puzzle, Component, SwatchBook, ShieldCheck, Package, BookOpen, ListChecks,
  } from '@lucide/svelte';

  let { activeId, onSelect, overridesByDomain = {} }: {
    activeId: string;
    onSelect: (id: string) => void;
    overridesByDomain?: Record<string, number>;
  } = $props();

  // Grouped information architecture. Every destination lives under one of four
  // named groups so a user reasons about *areas of the design system* instead
  // of decoding an unlabelled icon rail. `home` sits above the groups; the
  // labels are shown on desktop and collapse to tooltips on mobile.
  type NavItem = { id: string; icon: typeof Home; label: string };
  const HOME: NavItem = { id: "home", icon: Home, label: "Home" };
  const GROUPS: { label: string; items: NavItem[] }[] = [
    {
      label: "Foundations",
      items: [
        { id: "colors",     icon: Palette,   label: "Colors" },
        { id: "typography", icon: Type,      label: "Typography" },
        { id: "spacing",    icon: Ruler,     label: "Spacing" },
        { id: "borders",    icon: Square,    label: "Shape" },
        { id: "motion",     icon: Zap,       label: "Motion" },
      ],
    },
    {
      label: "Composition",
      items: [
        { id: "layout",     icon: Layout,    label: "Layout" },
        { id: "depth",      icon: Layers,    label: "Depth" },
        { id: "macros",     icon: Blocks,    label: "Macros" },
        { id: "components", icon: Component, label: "Components" },
        { id: "misc",       icon: Puzzle,    label: "System" },
      ],
    },
    {
      label: "Quality",
      items: [
        { id: "changes",    icon: ListChecks,  label: "Changes" },
        { id: "wcag",       icon: ShieldCheck, label: "Accessibility" },
      ],
    },
    {
      label: "Project",
      items: [
        { id: "themes",     icon: SwatchBook, label: "Presets" },
        { id: "setup",      icon: Package,    label: "Install & export" },
        { id: "cheatsheet", icon: BookOpen,   label: "Reference" },
      ],
    },
  ];

  // Every override maps to exactly one token domain, so their sum is the total
  // override count — what the Changes overview badge should show.
  let totalOverrides = $derived(Object.values(overridesByDomain).reduce((a, b) => a + b, 0));
  const countFor = (id: string): number =>
    id === "changes" ? totalOverrides : (overridesByDomain[id] || 0);
</script>

<nav
  class="w-14 md:w-52 bg-slate-50 dark:bg-[#0a0a0f] border-r border-black/8 dark:border-white/8 flex flex-col items-center md:items-stretch py-3 gap-1 shrink-0 overflow-y-auto overflow-x-hidden"
  aria-label="Panels"
>
  {#snippet navButton(item: NavItem)}
    {@const isActive = activeId === item.id}
    {@const count = countFor(item.id)}
    {@const Icon = item.icon}
    <button
      onclick={() => onSelect(item.id)}
      title={item.label}
      aria-current={isActive ? "page" : undefined}
      class={`relative flex items-center justify-center md:justify-start gap-2.5 w-10 md:w-full h-10 md:h-8 px-0 md:px-2.5 rounded-xl transition-all cursor-pointer group ${
        isActive
          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
          : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-black/8 dark:hover:bg-white/8"
      }`}
    >
      <Icon class="w-4 h-4 shrink-0" />
      <span class="hidden md:block text-[11px] font-semibold truncate">{item.label}</span>

      {#if count > 0}
        <!-- Mobile: corner dot. Desktop: trailing count pill. -->
        <span
          class={`md:hidden absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full text-[8px] font-black flex items-center justify-center ${
            isActive ? "bg-white text-indigo-700" : "bg-indigo-500 text-white"
          }`}
        >
          {count > 9 ? "+" : count}
        </span>
        <span
          class={`hidden md:flex ml-auto min-w-4 h-4 px-1 rounded-full text-[9px] font-black items-center justify-center ${
            isActive ? "bg-white/25 text-white" : "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400"
          }`}
        >
          {count > 99 ? "99+" : count}
        </span>
      {/if}

      <!-- Tooltip: mobile only (desktop shows the label inline). -->
      <span class="md:hidden absolute left-12 bg-slate-800 text-white text-[10px] font-semibold px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 border border-white/10">
        {item.label}
      </span>
    </button>
  {/snippet}

  <!-- Home -->
  <div class="flex flex-col items-center md:items-stretch gap-1 w-full px-2">
    {@render navButton(HOME)}
  </div>

  {#each GROUPS as group (group.label)}
    <div class="w-8 md:w-auto md:mx-2.5 h-px bg-black/8 dark:bg-white/8 my-2"></div>
    <div class="hidden md:block px-3 pb-1 text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600">
      {group.label}
    </div>
    <div class="flex flex-col items-center md:items-stretch gap-1 w-full px-2">
      {#each group.items as item (item.id)}
        {@render navButton(item)}
      {/each}
    </div>
  {/each}
</nav>
