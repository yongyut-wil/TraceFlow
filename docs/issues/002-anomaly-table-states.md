# ISSUE-002 — Anomaly table: dead action, misleading states

**Severity:** Medium · **Type:** fix(ux)

## Problem

1. `ZoomIn` button per row has no `onClick` — dead control (verified interactively).
2. When the source is in error/disconnected, the table renders
   "No threshold breaches in buffer window" — misleading; there is no data at all.
3. `deltaPct` renders `+{x}%` unconditionally → `+-5%` on negative deltas.

## Fix

- Wire ZoomIn to a callback that focuses `dataZoom` on the event window
  (e.g., ±2 min around `timestampMs`) on the primary chart via its instance ref.
- Add an explicit `status`-aware empty state ("Source unavailable — check data
  mode") when `count === 0` / `status === 'disconnected'`.
- Render sign correctly: `+x%` / `−x%`.

## Acceptance criteria

- Clicking ZoomIn pans/zooms primary chart to the anomaly.
- Error state text differs from the no-anomalies state.
- Negative deltas render without `+-`.
