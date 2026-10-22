---
name: TraceFlow
colors:
  surface: '#10131a'
  surface-dim: '#10131a'
  surface-bright: '#363940'
  surface-container-lowest: '#0b0e14'
  surface-container-low: '#181c22'
  surface-container: '#1c2026'
  surface-container-high: '#272a31'
  surface-container-highest: '#31353c'
  on-surface: '#e0e2eb'
  on-surface-variant: '#bac9cc'
  inverse-surface: '#e0e2eb'
  inverse-on-surface: '#2d3037'
  outline: '#849396'
  outline-variant: '#3b494c'
  surface-tint: '#00daf3'
  primary: '#c3f5ff'
  on-primary: '#00363d'
  primary-container: '#00e5ff'
  on-primary-container: '#00626e'
  inverse-primary: '#006875'
  secondary: '#bdc2ff'
  on-secondary: '#131e8c'
  secondary-container: '#2f3aa3'
  on-secondary-container: '#a8afff'
  tertiary: '#a8ffd2'
  on-tertiary: '#003824'
  tertiary-container: '#5be9ad'
  on-tertiary-container: '#006645'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#9cf0ff'
  primary-fixed-dim: '#00daf3'
  on-primary-fixed: '#001f24'
  on-primary-fixed-variant: '#004f58'
  secondary-fixed: '#e0e0ff'
  secondary-fixed-dim: '#bdc2ff'
  on-secondary-fixed: '#000767'
  on-secondary-fixed-variant: '#2f3aa3'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#10131a'
  on-background: '#e0e2eb'
  surface-variant: '#31353c'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  body-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 16px
  data-mono-xl:
    fontFamily: JetBrains Mono
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 28px
    letterSpacing: -0.03em
  data-mono-lg:
    fontFamily: JetBrains Mono
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: -0.02em
  data-mono-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: -0.01em
  data-mono-sm:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '400'
    lineHeight: 14px
    letterSpacing: 0em
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 9px
    fontWeight: '600'
    lineHeight: 12px
    letterSpacing: 0.08em
spacing:
  gutter: 0.5rem
  gutter-desktop: 0.75rem
  margin: 0.75rem
  margin-desktop: 1rem
  space-xs: 0.125rem
  space-sm: 0.25rem
  space-md: 0.5rem
  space-lg: 0.75rem
  space-xl: 1rem
---

## Brand & Style

This design system delivers the ergonomic rigor, spatial efficiency, and optical clarity required for high-frequency telemetry, avionics, aerospace operations, and mission-critical systems engineering. It transforms dense data streams into rapid situational awareness through high-contrast graphic delineation, zero ornamental distortion, and instrument-grade chromatic signalling.

The visual style combines technical minimalism with high-precision instrumentation aesthetics:
- **Zero-Blur Precision:** Avoid ambient blur, drop shadows, or fuzzy skeuomorphic lighting. Spatial relationships rely exclusively on hairline structural lines, discrete surface luminance shifts, and disciplined tabular packing.
- **Instrument Signal Architecture:** Deep, light-absorbent base backgrounds anchor vibrant oscilloscope traces. High-energy spectral accents (cyan, pulse violet, live emerald, alert amber, critical crimson) serve functional data visualization purposes, immediately denoting sensor states, delta variations, and critical threshold breaches.
- **Operator Ergonomics:** Tailored for multi-monitor setups, dark environment operations centers, and extended tactical focus sessions. Contrast ratios exceed WCAG AAA standards for critical telemetry, eliminating visual fatigue while preserving instant peripheral recognition of state shifts.

## Colors

### Surface Tiers
- **Canvas Base (`#06090F`):** Deep space pitch; foundational void for all monitors, viewports, and background grids.
- **Surface Level 1 (`#0D131F`):** Structural panels, telemetry dock sidebars, persistent mastheads, and dock matrices.
- **Surface Level 2 (`#121A2A`):** Focused modules, interactive instrument cells, nested metric cards, and table headers.
- **Surface Level 3 (`#1A2438`):** Hover states, active segmented switches, popovers, and elevated modal panels.

### Structural Borders
- **Border Default (`#1E293B`):** 1px hairline division for non-critical card partitions, grid channels, and frame lines.
- **Border Accent / Active (`#334155`):** 1px hairline for focused panel boundaries, active inputs, and divider lines across high-density layouts.

### Telemetry Signal Accents
- **Signal Wave Cyan (`#00E5FF`):** Primary telemetry trace, active scrubber cursors, targeted crosshairs, selection highlights.
- **Signal Trace Violet (`#818CF8`):** Secondary delta streams, reference wave overlays, auxiliary sensor channels.
- **Live Pulse Emerald (`#10B981`):** Nominal telemetry states, live 60FPS stream heartbeats, steady-state telemetry feeds.
- **Warning Gold (`#F59E0B`):** Threshold ceiling breaches, margin warnings, non-fatal anomalies.
- **Anomaly Crimson (`#F43F5E`):** Critical aborts, terminal deviations, critical sensor alerts, instantaneous dropouts.

### Typography & Foreground
- **Text Primary (`#F8FAFC`):** Direct numeric readouts, tactical state indicators, primary labels.
- **Text Secondary (`#94A3B8`):** Axis labels, sub-metrics, stationary units, column definitions.
- **Text Muted (`#475569`):** Disabled parameters, secondary grid markings, baseline ticks.
