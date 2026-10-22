# ISSUE-009 — Aesthetic refinement: depth, signal linkage, trace body

**Status:** Done
**Severity:** Low (aesthetic)
**Found in:** User design feedback — palette/design felt flat
**Branch:** `fix/issue-009-aesthetic-refinement`

## Problem

The palette was spec-correct but visually flat:

1. Surface tiers `#06090F`/`#0D131F`/`#121A2A` differ by ~5% luminance —
   hairline borders carried all structure; panels read as one flat dark wall.
2. The `#00E5FF` trace rendered as a bare neon polyline — no area body,
   unlike real telemetry/terminal UIs (Grafana, SCADA) where traces have
   gradient weight.
3. KPI cards had no visual link to signal semantics — four identical tiles.
4. Panel headers were text-only — no instrument accent device.

## Fix

- KPI cards: `bg-raised` (new `#101B2C` surface tier) + `border-l-2`
  signal color per card (live / secondary / primary / warn)
- Panel headers: 2px-tall accent tick before titles (cyan on primary chart,
  violet on correlation, amber on inspector)
- Primary series: linear gradient area fill `rgba(0,229,255,0.16)→0`
- Correlation series: gradient `rgba(129,140,248,0.18)→0` (was flat 0.08)
- Chart splitLines: `rgba(30,41,59,0.55)` via `CHART_COLORS.gridLine`
- KPI value: 24px → 26px, `tracking-tight`

## Acceptance

- [x] KPI cards carry per-metric signal color on the left edge
- [x] Primary + correlation traces render gradient area body
- [x] Grid lines visibly subtler than before
- [x] lint / typecheck / 29 unit tests pass; zero console errors
- [x] 1600×900 screenshot reviewed — intended look achieved
