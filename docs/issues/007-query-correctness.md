# ISSUE-007 — Query/render correctness

**Severity:** Medium · **Type:** fix(data)

## Problem

1. React Query defaults `refetchOnWindowFocus: true` → every window focus
   refetches historical with a new `toMs = Date.now()` → whole buffer reset +
   stream resubscribe. Heavy churn for a live dashboard.
2. `getResolvedSourceMode(params.mode)` runs inside render (`useMemo`) —
   constructs a data source during render (impure render work).
3. Thresholds/units derive from `metric.includes('latency')` in 3 places —
   soft heuristic; a new metric silently loses its thresholds.

## Fix

- `useQuery({ staleTime: 30_000, refetchOnWindowFocus: false, ... })` on the
  historical query (live stream is the freshness mechanism anyway).
- Have `useRealtimeChartBuffer` expose `sourceMode` (the resolved
  `ds.mode`) via the query result/state; `DashboardContent` consumes it —
  no render-time source construction.
- Introduce `METRIC_DEFS` (id → unit, warn, crit) in the data layer; both
  sources look up by metric id with the `includes` heuristic only as fallback.

## Acceptance criteria

- Focusing the window does not refetch/reset the buffer (E2E or unit-verifiable).
- `DashboardContent` no longer calls `getResolvedSourceMode` in render.
- Unknown metric id → no thresholds, `unit` falls back to `'units'`.
