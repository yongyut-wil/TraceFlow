# ISSUE-010 — Border hierarchy + icon semantics

**Status:** Done
**Severity:** Low (aesthetic/usability)
**Found in:** Border/icon audit after ISSUE-009
**Branch:** `fix/issue-010-border-icon-semantics`

## Problem

1. **No border hierarchy** — spec defines `#334155` (Border Accent) for
   "active inputs, focused panel boundaries", but every interactive control
   (selects, inputs, range rail, pause button) used the same `#1E293B`
   structural hairline as passive dividers. Interactive surfaces didn't read
   as interactive.
2. **Icon semantics mismatched** —
   - `ArrowDownRight` on "Current Value" implies a decreasing trend
   - `Activity` on "Window Mean" is generic (and duplicated the status badge)
   - `ArrowUpRight` on "Peak" weaker than a trend glyph

## Fix

- New `--edge` token (`#334155`) → `border-edge` utility
- `border-edge` applied to all interactive controls: 4 `SelectTrigger`s,
  range-rail container, datetime inputs, pause `Button`
- Structural hairlines (header, panel dividers, table, popovers) keep
  `border-border` — interactive vs structural now visually distinct
- KPI icons: `ArrowDownRight`→`Zap` (live reading), `Activity`→`Sigma`
  (Σ = mean), `ArrowUpRight`→`TrendingUp` (peak)

## Acceptance

- [x] Interactive controls visibly lighter than structural borders
- [x] KPI icons map to their metric semantics
- [x] lint / typecheck / 29 tests pass; zero console errors
