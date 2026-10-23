// Chart-facing mirror of the CSS design tokens — ECharts renders to canvas
// and cannot read CSS variables, so chart colors are centralized here to keep
// them in sync with `src/app/globals.css` / `.devin/stitch/DESIGN.md`.
export const CHART_COLORS = {
  surface: '#000000',
  panel: '#0B0B0E',
  panel2: '#111116',
  panel3: '#1C1C22',
  border: '#1E1E24',
  borderAccent: '#33333B',
  gridLine: 'rgba(38, 38, 44, 0.7)',
  textPrimary: '#F2EFE9',
  textSecondary: '#9C9CA6',
  accent: '#FFB000',
  secondary: '#6FA8DC',
  warn: '#FB923C',
  crit: '#E5484D',
} as const;

export const CHART_FONT = 'IBM Plex Mono';
