---
name: TraceFlow
version: 3.0
direction: ops-terminal
colors:
  # Surface ladder — true-black canvas up to elevated panels.
  surface: '#0b0b0e'
  surface-dim: '#000000'
  surface-bright: '#1c1c22'
  surface-container-lowest: '#000000'
  surface-container-low: '#0b0b0e'
  surface-container: '#111116'
  surface-container-high: '#16161c'
  surface-container-highest: '#1c1c22'
  on-surface: '#f2efe9'
  on-surface-variant: '#9c9ca6'
  inverse-surface: '#f2efe9'
  inverse-on-surface: '#000000'
  outline: '#33333b'
  outline-variant: '#1e1e24'
  surface-tint: '#ffb000'
  primary: '#ffb000'
  on-primary: '#000000'
  primary-container: '#1c1c22'
  on-primary-container: '#ffb000'
  inverse-primary: '#ffb000'
  secondary: '#6fa8dc'
  on-secondary: '#000000'
  secondary-container: '#16161c'
  on-secondary-container: '#6fa8dc'
  tertiary: '#2fbf71'
  on-tertiary: '#000000'
  tertiary-container: '#111116'
  on-tertiary-container: '#2fbf71'
  error: '#e5484d'
  on-error: '#f2efe9'
  error-container: '#1c1c22'
  on-error-container: '#e5484d'
  background: '#000000'
  on-background: '#f2efe9'
  surface-variant: '#121218'
typography:
  headline-xl:
    fontFamily: IBM Plex Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: IBM Plex Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: IBM Plex Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: IBM Plex Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: IBM Plex Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-md:
    fontFamily: IBM Plex Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  body-sm:
    fontFamily: IBM Plex Sans
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 16px
  data-mono-xl:
    fontFamily: IBM Plex Mono
    fontSize: 26px
    fontWeight: '500'
    lineHeight: 32px
    letterSpacing: -0.03em
  data-mono-lg:
    fontFamily: IBM Plex Mono
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: -0.02em
  data-mono-md:
    fontFamily: IBM Plex Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: -0.01em
  data-mono-sm:
    fontFamily: IBM Plex Mono
    fontSize: 10px
    fontWeight: '400'
    lineHeight: 14px
    letterSpacing: 0em
  label-caps:
    fontFamily: IBM Plex Mono
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
motion:
  caret-blink: 1.1s steps(1) infinite
  transition-fast: 120ms linear
  transition-default: 150ms linear
  reduced-motion: all animation removed
---

# TraceFlow Design System v3 — Ops Terminal

## Direction

**"Ops terminal, not SaaS dashboard."** Bloomberg-terminal / operator-console
conventions: a true-black canvas, warm-zinc surface tiers, one amber key color,
tabular numerics, and information density over decoration. Every visual
decision must read as *instrumentation*, not marketing.

Supersedes: v1 navy/cyan mission-control scheme (ISSUE-013), v2 type/glow
patch (ISSUE-014).

## Core rules (non-negotiable)

1. **Zero radius** — every corner is square. `--radius-*: 0`.
2. **No fuzzy light** — no drop shadows, blurs, glows, or gradients. Separation
   comes from hairline borders and discrete surface steps only.
3. **Hairlines only** — 1px borders; structural `#1E1E24`, interactive
   `#33333B`. Never 2px+ chrome.
4. **Signal color carries meaning** — a color on screen always encodes state
   (live/warn/crit/brand/compare). Never decorate with signal hues.
5. **Reduced motion honored** — `caret-blink` and any animation must have a
   `motion-reduce` path.
6. **Tabular numerics** — all data figures use IBM Plex Mono with
   `tabular-nums`; numbers right-align in columns.

## Tokens

### Surfaces (6 tiers)

| Token | Hex | Role |
|---|---|---|
| `background` | `#000000` | True-black terminal void — page canvas, chart plot |
| `card` | `#0B0B0E` | Structural panels, sidebars, mastheads |
| `muted` | `#111116` | Focused modules, table headers, table zebra |
| `raised` | `#121218` | KPI/data cells elevated one step over `card` |
| `popover` | `#16161C` | Floating surfaces — selects, popovers, tooltip |
| `accent` | `#1C1C22` | Hover/active fill — pressed keys, selected rows |

### Borders

| Token | Hex | Role |
|---|---|---|
| `border` / `input` | `#1E1E24` | Structural hairlines — card partitions, grid channels |
| `edge` | `#33333B` | Interactive chrome — control outlines, focused inputs, select triggers |
| `ring` | `#FFB000` | `:focus-visible` keyboard ring only |

### Signals

| Token | Hex | Meaning |
|---|---|---|
| `primary` | `#FFB000` | Brand mark, primary trace, active function-key, caret, selection |
| `secondary` | `#6FA8DC` | Correlation/compare trace, auxiliary channel |
| `live` | `#2FBF71` | Nominal/connected state, live indicator |
| `warn` | `#FB923C` | Threshold breach, WARN severity (orange — distinct from brand amber) |
| `crit` / `destructive` | `#E5484D` | CRIT severity, abort states, destructive actions |

### Text

| Token | Hex | Role |
|---|---|---|
| `foreground` | `#F2EFE9` | Warm ivory — values, labels, primary copy |
| `muted-foreground` | `#9C9CA6` | Axis labels, units, column headers, meta |
| `dim` (`--text-dim`) | `#55555E` | Disabled/placeholder/`--` — never informative text (sub-AA) |

## Typography

| Style | Font | Size/Line/Track | Usage |
|---|---|---|---|
| `headline-xl` | Plex Sans 600 | 32/38 −0.02em | Page titles (unused in dashboard — reserved) |
| `headline-lg` | Plex Sans 600 | 22/28 −0.01em | Section titles |
| `headline-md` | Plex Sans 600 | 16/22 −0.005em | Panel lead text |
| `body-md` | Plex Sans 400 | 13/18 | Default UI copy |
| `data-mono-xl` (`--text-value`) | Plex Mono 500 | 26/32 −0.03em | KPI numbers |
| `data-mono-lg` | Plex Mono 500 | 16/20 −0.02em | Select values, node id |
| `data-mono-md` | Plex Mono 400 | 12/16 −0.01em | Table cells, chart ticks, badges |
| `data-mono-sm` (`--text-mini`) | Plex Mono 400 | 10/14 0 | Meta rows, status bar |
| `label-caps` (`--text-micro`) | Plex Mono 600 | 9/12 +0.08em | Panel headers, KPI labels, function keys |

Tracking is per-tier — **never** apply blanket `tracking-tight` to `.font-mono`.

## Spacing

Scale maps 1:1 to Tailwind steps — use the step, not a raw literal:

| Token | rem | px | Tailwind |
|---|---|---|---|
| `space-xs` | 0.125 | 2 | `0.5` |
| `space-sm` | 0.25 | 4 | `1` |
| `space-md` | 0.5 | 8 | `2` |
| `space-lg` | 0.75 | 12 | `3` |
| `space-xl` | 1 | 16 | `4` |
| `gutter` / `gutter-desktop` | 0.5 / 0.75 | 8 / 12 | `gap-2` / `gap-3` |

## States

| State | Treatment |
|---|---|
| Hover | `bg-accent` fill or `edge` border brighten — never scale/shadow |
| Active/selected | `bg-primary text-primary-foreground` (amber key) for toggles |
| Focus (keyboard) | `focus-visible:ring-1 ring-ring` amber outline — always visible |
| Disabled | `dim` text + `border` outline — no opacity fades below AA floor |
| Loading | `Skeleton` on `bg-accent` (visible on black) — never spinners on data |
| Empty | `muted-foreground` mono copy, `--` glyph placeholders in `dim` |
| Error | `crit` text/badge + literal message — panels degrade independently |
| Live pulse | `●` glyph with `caret-blink` (hard `steps(1)` blink, 1.1s) |

## Component anatomy

- **Masthead** — `card` tier, `label-caps` wordmark + blinking `▮` caret,
  right-aligned controls; `edge`-bordered selects.
- **Function-key range strip** — `label-caps` keys `[1H] [6H] [24H] [7D]
  [CUSTOM]`; active = `bg-primary` black text; inactive = `edge` outline.
- **KPI cells** — `raised` tier, `label-caps` name, `data-mono-xl` value in
  its signal color, `data-mono-sm` meta line. No accent border — the value's
  color is the signal.
- **Charts** — canvas `#000`, gridlines `border` at 70% alpha, flat 1.5px
  traces (`primary` main / `secondary` compare), WARN/CRIT `markLine` dashed
  with labels inside the grid. Never area-fill gradients.
- **Anomaly table** — `card` panel, `muted` zebra rows + header, severity
  `Badge` (warn/crit colors), right-aligned numerics, `data-mono-md` cells.
- **Status bar** — bottom strip, `data-mono-sm` muted meta: terminal id, node,
  buffered count, connection glyph, live UTC clock.
- **Tooltip/popover** — `popover` tier, `border` hairline, zero shadow,
  `data-mono-sm` content.
- **Skeleton** — `bg-accent` blocks only; on true black nothing softer reads.

## Data-viz rules

- Colors come from `src/lib/chart-theme.ts` (`CHART_COLORS`) — the canvas
  mirror of these tokens; **keep the two files in sync**.
- LTTB sampling + `large` mode past 2k points; `useDirtyRect` on; animation
  off for streaming series.
- Shared charts join `echarts.connect` group `traceflow-group` (synced
  crosshair + zoom).

## Don'ts

- No rounded corners, shadows, blur, gradient fills, or glow.
- No `Inter`/`JetBrains` fallbacks — IBM Plex only.
- No signal colors as decoration; no `--text-dim` on informative text.
- No opacity-based "dimming" that drops below contrast floor — use tiers.
