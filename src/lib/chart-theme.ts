// Chart-facing mirror of the CSS design tokens — ECharts renders to canvas
// and cannot read CSS variables, so chart colors are centralized here to keep
// them in sync with `src/app/globals.css` / `.devin/stitch/DESIGN.md`.
export const CHART_COLORS = {
  surface: '#06090F',
  panel: '#0D131F',
  panel2: '#121A2A',
  panel3: '#1A2438',
  border: '#1E293B',
  borderAccent: '#334155',
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  accent: '#00E5FF',
  secondary: '#818CF8',
  warn: '#F59E0B',
  crit: '#F43F5E',
} as const;

export const CHART_FONT = 'JetBrains Mono';
