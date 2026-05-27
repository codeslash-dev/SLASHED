/**
 * Structured cheatsheet data for the SLASHED framework.
 *
 * Exports all CSS custom properties (--sf-*) grouped by category
 * and all utility/state classes (.sf-*, .is-*) grouped by type.
 * Used by CheatsheetTab.svelte to render a searchable index.
 */

export const variableGroups = [
  {
    category: "Colors",
    description: "Brand, status, semantic, and derived color tokens. Source colors use oklch(); the framework derives light-dark pairs, palettes, and alpha scales automatically.",
    tokens: [
      { name: "--sf-color-{brand}-light", description: "Source color for the brand (oklch registered value). Set this to rebrand." },
      { name: "--sf-color-{brand}-dark", description: "Optional dark-mode override. If set, replaces the auto-derived dark variant for full per-mode control." },
      { name: "--sf-color-{brand}", description: "Resolved light-dark adaptive color for use in rules." },
      { name: "--sf-color-{brand}-{50-950}", description: "Palette scale: 50 (lightest) to 950 (darkest) mixed with base/text." },
      { name: "--sf-color-{brand}-a{5-95}", description: "Alpha scale: 5% to 95% opacity of the brand color." },
      { name: "--sf-color-{brand}-hover/active/muted/subtle/ghost/lighter/darker/xlight/xdark/superlight/superdark", description: "Semantic aliases for common UI states, mapped to palette steps." },
      { name: "--sf-color-bg", description: "Page background color, derived from base." },
      { name: "--sf-color-text", description: "Main body text color, contrast-aware." },
      { name: "--sf-color-heading", description: "Heading text color, slightly stronger than body text." },
      { name: "--sf-color-link", description: "Link color, derived from action brand." },
      { name: "--sf-color-border", description: "Default border color." },
      { name: "--sf-color-surface", description: "Card/panel surface color (equals base)." },
      { name: "--sf-color-overlay", description: "Semi-transparent overlay for modals." },
      { name: "--sf-color-dim", description: "50% black overlay for dimming backgrounds." },
      { name: "--sf-color-success/warning/error/info/danger", description: "Status feedback colors with -light source, -muted, -strong, -subtle variants." },
    ]
  },
  {
    category: "Typography",
    description: "Font families, sizes (fluid clamp-based scale), weights, line-heights, letter-spacing, and heading configuration.",
    tokens: [
      { name: "--sf-font-body", description: "Body font stack (system-ui default)." },
      { name: "--sf-font-heading", description: "Heading font stack (defaults to body)." },
      { name: "--sf-font-mono", description: "Monospace font stack." },
      { name: "--sf-font-display", description: "Display/hero font (defaults to heading)." },
      { name: "--sf-font-geometric/humanist/slab", description: "Curated fallback stacks for common typographic personalities." },
      { name: "--sf-text-{2xs..4xl}", description: "Fluid type scale using clamp(). Sizes: 2xs, xs, s, m, l, xl, 2xl, 3xl, 4xl." },
      { name: "--sf-text-display-{s,m,l}", description: "Extra-large display/hero sizes." },
      { name: "--sf-text-scale", description: "Global multiplier for the type scale (default 1)." },
      { name: "--sf-font-weight-{thin..black}", description: "Named weight tokens: thin(100), extralight(200), light(300), normal(400), medium(500), semibold(600), bold(700), extrabold(800), black(900)." },
      { name: "--sf-leading-{tight,snug,normal,relaxed}", description: "Line-height presets: 1.1, 1.3, 1.5, 1.625." },
      { name: "--sf-tracking-{tight,normal,wide,wider,widest}", description: "Letter-spacing presets from -0.025em to 0.1em." },
      { name: "--sf-h{1-6}-size/font-weight/line-height/letter-spacing", description: "Per-heading-level configuration tokens." },
      { name: "--sf-body-*", description: "Body text configuration: font-size, font-weight, line-height, color, text-wrap." },
    ]
  },
  {
    category: "Spacing",
    description: "Fluid spacing scale (clamp-based), gutters, section padding, and component padding.",
    tokens: [
      { name: "--sf-space-{2xs..4xl}", description: "Fluid spacing scale. Sizes: none, px, 2xs, xs, s, m, l, xl, 2xl, 3xl, 4xl." },
      { name: "--sf-space-scale", description: "Global multiplier for all space tokens (default 1)." },
      { name: "--sf-space-gutter", description: "Page-edge gutter (defaults to space-l)." },
      { name: "--sf-gap", description: "Default gap for layouts (defaults to space-m)." },
      { name: "--sf-content-gap", description: "Gap between content elements (defaults to space-s)." },
      { name: "--sf-section-pad--{s,m,l,xl}", description: "Vertical padding for page sections." },
      { name: "--sf-component-pad", description: "Internal padding for components (defaults to space-m)." },
      { name: "--sf-header-height", description: "Expected fixed header height for sticky offset calculations." },
      { name: "--sf-safe-{top,right,bottom,left}", description: "Safe area insets for notched devices." },
    ]
  },
  {
    category: "Sizing",
    description: "Component sizes, touch targets, and aspect ratios.",
    tokens: [
      { name: "--sf-size-{xs..xl}", description: "Named size tokens: xs(1.5rem), s(2rem), m(2.5rem), l(2.75rem), xl(3.5rem)." },
      { name: "--sf-touch-target", description: "Minimum interactive element size (defaults to size-l, 2.75rem)." },
      { name: "--sf-ratio-{square,photo,video,cinema,golden,portrait}", description: "Predefined aspect ratios for frames and containers." },
      { name: "--sf-icon-{xs..xl}", description: "Icon sizing in em units (0.875em to 3em)." },
    ]
  },
  {
    category: "Layout",
    description: "Container widths, layout primitive tokens (stack, cluster, grid, sidebar, switcher, bento, cover, frame, reel, imposter).",
    tokens: [
      { name: "--sf-container-{narrow,default,prose,wide,full}", description: "Max-width presets for .sf-container." },
      { name: "--sf-stack-gap", description: "Vertical gap between .sf-stack children." },
      { name: "--sf-cluster-gap/align/justify", description: "Inline cluster layout tokens." },
      { name: "--sf-sidebar-width/gap/min-width", description: "Sidebar layout tokens." },
      { name: "--sf-switcher-threshold/gap", description: "Column-to-stack breakpoint and gap." },
      { name: "--sf-grid-min/gap", description: "Auto-fill grid minimum item width and gap." },
      { name: "--sf-bento-cols/gap/row", description: "Dense bento grid configuration." },
      { name: "--sf-cover-min-height/padding", description: "Full-height cover layout." },
      { name: "--sf-frame-ratio", description: "Aspect ratio for .sf-frame (defaults to 16/9)." },
      { name: "--sf-reel-gap/height/item-width", description: "Horizontal scroll strip configuration." },
      { name: "--sf-imposter-margin", description: "Safety margin for absolute-centered overlays." },
      { name: "--sf-breakout-width/content-width", description: "Breakout grid track widths." },
      { name: "--sf-divider-color/style/width", description: "Divider appearance tokens." },
    ]
  },
  {
    category: "Borders",
    description: "Border widths and styles.",
    tokens: [
      { name: "--sf-border-width-{hairline,1,2,3,4}", description: "Border width scale: 0.5px, 1px, 2px, 3px, 4px." },
      { name: "--sf-border-style/dotted/soft/strong", description: "Border style presets (solid, dotted, dashed, solid)." },
      { name: "--sf-stroke-{thin,regular,bold,heavy}", description: "Stroke widths for SVG/icon use: 1px, 1.5px, 2px, 3px." },
    ]
  },
  {
    category: "Radius",
    description: "Border radius scale and special shapes.",
    tokens: [
      { name: "--sf-radius-{none,xs,s,m,l,xl,2xl,3xl,4xl,full}", description: "Radius scale from 0 to 9999px (pill)." },
      { name: "--sf-radius-scale", description: "Global multiplier for all radius tokens (default 1)." },
      { name: "--sf-radius-pill", description: "Fully rounded (9999px)." },
      { name: "--sf-radius-outer", description: "Outer radius = inner + padding (for nested rounding)." },
    ]
  },
  {
    category: "Shadows",
    description: "Box shadows, drop shadows, text shadows, and shadow configuration.",
    tokens: [
      { name: "--sf-shadow-{xs,s,m,l,xl,2xl}", description: "Elevation shadow scale, progressively more dramatic." },
      { name: "--sf-shadow-inner", description: "Inset shadow for recessed elements." },
      { name: "--sf-shadow-glow", description: "Colored glow effect (uses --sf-shadow-glow-color)." },
      { name: "--sf-shadow-none", description: "Explicit no-shadow value." },
      { name: "--sf-shadow-color", description: "Base shadow color (derived from neutral)." },
      { name: "--sf-shadow-strength", description: "Shadow opacity multiplier (adapts to dark mode)." },
      { name: "--sf-drop-shadow-{s,m,l}", description: "CSS filter drop-shadow equivalents." },
      { name: "--sf-text-shadow-{s,m,l,none}", description: "Text shadow presets." },
    ]
  },
  {
    category: "Effects",
    description: "Blurs, opacities, gradients, masks, and perspective.",
    tokens: [
      { name: "--sf-blur-{xs,s,m,l,xl}", description: "Blur radius scale: 4px to 48px." },
      { name: "--sf-opacity-{0,10,25,50,75,100,disabled}", description: "Named opacity presets." },
      { name: "--sf-gradient-{brand,primary,secondary,tertiary,surface}", description: "Predefined gradients using brand colors." },
      { name: "--sf-gradient-fade--{t,b,l,r}", description: "Directional fade-to-background gradients." },
      { name: "--sf-mask-scrim-start/end", description: "Scroll mask fade depth." },
      { name: "--sf-perspective-{near,normal,far}", description: "3D perspective presets: 500px, 1000px, 2000px." },
      { name: "--sf-contrast-bias/threshold", description: "Color contrast tuning for auto text-on-color logic." },
    ]
  },
  {
    category: "Motion",
    description: "Durations, easing curves, transitions, and animations.",
    tokens: [
      { name: "--sf-duration-{none,instant,fast,normal,slow,slower}", description: "Duration scale: 0ms to 600ms (respects --sf-motion-scale)." },
      { name: "--sf-motion-scale", description: "Global animation speed multiplier (set 0 to disable)." },
      { name: "--sf-ease-{linear,in,out,in-out,bounce,elastic,overshoot,spring}", description: "Easing function presets." },
      { name: "--sf-transition-{all,colors,opacity,shadow,transform,fast,slow,enter,exit}", description: "Pre-composed transition shorthands." },
      { name: "--sf-animation-{fade-in,fade-out,scale-up,scale-down,slide-in-*,float,ping,blink,color-pulse}", description: "Named keyframe animation shorthands." },
      { name: "--sf-animation-delay-{1-5}", description: "Stagger delays for sequential animations." },
    ]
  },
  {
    category: "Z-Index",
    description: "Z-index scale for predictable layering.",
    tokens: [
      { name: "--sf-z-{below,base,raised,low,mid,high,top,max}", description: "Z-index scale: -1, 0, 1, 10, 100, 500, 900, 9999." },
    ]
  },
  {
    category: "Focus",
    description: "Focus ring appearance for keyboard navigation.",
    tokens: [
      { name: "--sf-focus-ring-width/offset/color/style/shadow", description: "Focus indicator configuration." },
      { name: "--sf-caret-color", description: "Text input caret color (defaults to action)." },
    ]
  },
  {
    category: "Scroll",
    description: "Scroll timeline and scrollbar styling.",
    tokens: [
      { name: "--sf-scroll-timeline-range-start/end", description: "Scroll-driven animation range." },
      { name: "--sf-scrollbar-thumb/track", description: "Custom scrollbar colors." },
    ]
  },
  {
    category: "Print",
    description: "Print stylesheet configuration.",
    tokens: [
      { name: "--sf-print-base-size/page-margin/page-size", description: "Print layout tokens: 11pt base, 2cm margins, A4 size." },
    ]
  }
];

export const classGroups = [
  {
    category: "Layout Primitives",
    description: "Breakpoint-free, container-query-driven layout components. Each is a single class with per-instance token overrides via inline style.",
    classes: [
      { name: ".sf-section", description: "Vertical page rhythm with size variants (--s/--m/--l/--xl/--collapse)." },
      { name: ".sf-section-group", description: "Collapses gap between adjacent sections." },
      { name: ".sf-container", description: "Centered max-width wrapper with gutters. Variants: --narrow, --wide, --full, --prose." },
      { name: ".sf-box", description: "Isolated unit with padding and optional border." },
      { name: ".sf-center", description: "Intrinsic centering with max-width. Variant: --intrinsic." },
      { name: ".sf-stack", description: "Vertical flow with consistent gap. Size variants: --2xs to --3xl. Alignment: --center, --end, --stretch." },
      { name: ".sf-cluster", description: "Wrapping inline group. Size variants: --2xs to --xl. Alignment: --center, --end, --between. Wrap: --no-wrap." },
      { name: ".sf-sidebar", description: "Content + side panel that wraps. Variants: --right, --narrow, --wide." },
      { name: ".sf-switcher", description: "N columns above threshold, stacked below. Variants: --no-wrap, --vertical." },
      { name: ".sf-grid", description: "Auto-fill responsive grid. Size variants: --xs to --xl. Variants: --fit, --dense." },
      { name: ".sf-grid-{1,2,3,4,6}", description: "Fixed-column grids, container-responsive." },
      { name: ".sf-grid-{1-2,2-1,1-3,3-1}", description: "Ratio two-column grids." },
      { name: ".sf-bento", description: "Dense free-form grid. Variants: --2, --4, --compact, --tall." },
      { name: ".sf-alternate", description: "Zigzag two-column layout, reverses every other row." },
      { name: ".sf-pancake", description: "Sticky-footer grid: header / main(1fr) / footer." },
      { name: ".sf-content-grid", description: "Breakout layout grid. Children use .sf-breakout or .sf-full-bleed." },
      { name: ".sf-cover", description: "Full-height region with centered content. Variants: --min, --max, --padding-s, --padding-l." },
      { name: ".sf-frame", description: "Aspect-ratio media box. Variants: --square, --portrait, --video, --cinema, --3-2, --4-3, --golden." },
      { name: ".sf-reel", description: "Horizontal scroll strip with optional mask fade." },
      { name: ".sf-imposter", description: "Absolutely-centered overlay. Variants: --fixed, --contain." },
      { name: ".sf-subgrid / .sf-subgrid-rows", description: "Inherit parent grid tracks." },
      { name: ".sf-divider", description: "Token-driven separator. Variant: --vertical." },
      { name: ".sf-icon", description: "Em-based inline icon sizing. Sizes: --xs to --xl. Variant: --boxed." },
      { name: ".sf-prose", description: "Readable long-form text with automatic vertical rhythm." },
      { name: ".sf-not-prose", description: "Reset zone inside .sf-prose for embedded components." },
    ]
  },
  {
    category: "Macros",
    description: "Recipe classes that answer 'what does this element do/look like?' - composable with layout primitives.",
    classes: [
      { name: ".sf-flow", description: "Lobotomized owl: consistent gap between consecutive children." },
      { name: ".sf-truncate", description: "Single-line ellipsis overflow." },
      { name: ".sf-line-clamp-{2,3,N}", description: "Multi-line text clamping with ellipsis. -N reads --sf-line-clamp." },
      { name: ".sf-equal-height", description: "Forces flex children to share the tallest child's height." },
      { name: ".sf-aspect", description: "Generic aspect-ratio container (reads --sf-aspect token)." },
      { name: ".sf-scroll-shadow", description: "Top + bottom mask gradient for scrolling containers." },
      { name: ".sf-scroll-snap", description: "Vertical scroll-snap container." },
      { name: ".sf-overflow-fade", description: "End-edge horizontal fade for overflowing inline content." },
      { name: ".sf-no-tap-highlight", description: "Suppresses WebKit/Android tap highlight." },
      { name: ".sf-text-gradient", description: "Gradient text effect using background-clip." },
      { name: ".sf-clickable-parent", description: "Makes an entire card clickable via the first link inside." },
      { name: ".sf-link-external", description: "Adds external link indicator marker." },
    ]
  },
  {
    category: "Surfaces",
    description: "Color surface utility classes that set background and text color for a brand context.",
    classes: [
      { name: ".sf-surface--{primary,secondary,tertiary,action,neutral,inverse}", description: "Brand-colored surface with auto-contrast text." },
      { name: ".sf-surface--{success,warning,error,info,danger}", description: "Status-colored surfaces." },
    ]
  },
  {
    category: "Animations",
    description: "CSS animation utility classes that apply predefined keyframe animations.",
    classes: [
      { name: ".sf-fade-in / .sf-fade-out", description: "Opacity entrance/exit animations." },
      { name: ".sf-scale-up / .sf-scale-down", description: "Scale entrance/exit animations." },
      { name: ".sf-slide-in-{up,down,left,right}", description: "Directional slide-in entrance animations." },
      { name: ".sf-color-pulse", description: "Continuous color pulse animation." },
      { name: ".sf-entrance--fade / --fade-up / --fade-down / --fade-left / --fade-right / --scale-up", description: "Scroll-triggered entrance animations (scroll-timeline driven)." },
    ]
  },
  {
    category: "State Classes (.is-*)",
    description: "Runtime state classes toggled by JS or mirrored from ARIA. They live in the slashed.states layer. Always pair with matching ARIA attributes.",
    classes: [
      { name: ".is-hidden / .is-invisible / .is-visible", description: "Visibility control: removed from layout / hidden but keeps box / visible." },
      { name: ".is-disabled / .is-readonly", description: "Non-interactive states with dimming." },
      { name: ".is-loading / .is-pending / .is-busy", description: "Loading states: spinner replacement / optimistic UI / cursor hint." },
      { name: ".is-skeleton", description: "Placeholder shimmer animation." },
      { name: ".is-active / .is-selected / .is-current / .is-pressed", description: "Selection/activation states." },
      { name: ".is-highlighted", description: "Transient emphasis (e.g. search result highlight)." },
      { name: ".is-open / .is-collapsed / .is-expanded", description: "Disclosure states for modals, drawers, accordions." },
      { name: ".is-valid / .is-invalid", description: "Form field validation results (maps to aria-invalid)." },
      { name: ".is-success / .is-error / .is-warning / .is-info / .is-danger", description: "General feedback states and destructive-action context." },
      { name: ".is-sticky / .is-pinned / .is-fixed / .is-fullscreen", description: "Positioning states." },
      { name: ".is-clipped / .is-scrollable / .is-truncated / .is-resizable", description: "Overflow handling states." },
      { name: ".is-dragging / .is-drop-target / .is-draggable", description: "Drag and drop states." },
      { name: ".is-overlay / .is-focused / .is-clickable / .is-unselectable", description: "Positioning, focus, cursor, and selection states." },
      { name: ".is-empty", description: "Hide element when empty (:empty pseudo-class)." },
    ]
  }
];

export const miscTokens = [
  { name: "--sf-is-dark", description: "Numeric flag (0 or 1) indicating dark mode is active. Registered property." },
  { name: "--sf-lumlocker", description: "Internal luminance lock value for color derivation." },
  { name: "--sf-color-scheme", description: "CSS color-scheme declaration (light dark)." },
  { name: "--sf-current-font-weight", description: "Current context font weight (used by strong elements)." },
  { name: "--sf-link-external-marker", description: "External link arrow character." },
  { name: "--sf-field-block", description: "Vertical spacing between form fields." },
  { name: "--sf-field-required-marker", description: "Required field indicator string." },
];
