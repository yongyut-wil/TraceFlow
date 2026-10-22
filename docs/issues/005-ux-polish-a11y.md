# ISSUE-005 — UX polish: a11y, semantics, tokens, responsive floor

**Severity:** Low · **Type:** fix(ux)

## Problem

Batch of small defects from the UX/design review:

1. `animate-ping` live dot ignores `prefers-reduced-motion`.
2. Range `<button>`s (1h/6h/24h/7d) have no `focus-visible` styling — keyboard
   focus is invisible.
3. KPI "0.50% of buffer" computes `50 retained / 10,000 buffer` — misleading
   denominator (anomalies list is capped at 50).
4. Clicking the `custom` trigger commits `from`/`to` URL params on open —
   opening the popover is a state change.
5. Spec's third text tier `#475569` (Text Muted) is not mapped to any token.
6. `skeleton.tsx` generated but unused; loading shows bare `--`.
7. No responsive floor: fixed `grid-cols-4`/`grid-cols-2`, fixed `w-40`/`w-48`
   selects → horizontal overflow at ~390px width.
8. Chart colors hardcoded as hex in option builders — drift risk vs tokens.

## Fix

- `motion-reduce:animate-none` on the ping span; `focus-visible:` ring on range
  buttons; KPI copy → "events retained (cap 50)"; set `range=custom` only when
  a date input changes; add `--muted-2`/`text-dim` token `#475569`; use
  `Skeleton` in KPI cards while loading; add `md:`/`lg:` breakpoints so grids
  collapse; extract chart colors to `src/lib/chart-theme.ts` constants.

## Acceptance criteria

- No horizontal scrollbar at ≥360px; reduced-motion respected; tokens single-
  sourced; `pnpm run build` unchanged-green.
