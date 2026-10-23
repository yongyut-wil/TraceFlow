# ISSUE-012 — a11y + edge-case polish

**Status:** DONE
**Branch:** `fix/issue-012-a11y-edge`
**Found by:** final comprehensive audit (a11y deep-check, URL robustness, error paths, dependency hygiene)

## Findings → fixes

| # | Finding | Fix |
|---|---|---|
| 1 | ZoomIn is an icon-only button with no accessible name — Tooltip supplies a *description*, not a *name* (WCAG 4.1.2) | `aria-label="Zoom primary chart to this event"` on the Button inside `TooltipTrigger` |
| 2 | Decorative lucide icons not `aria-hidden` → screen readers announce stray "image" | `aria-hidden` on KPI card icons (4), header `Database`/`WifiOff`/`Activity`/`Play`/`Pause` |
| 3 | Informative empty-state message used `text-dim` (#475569 ≈ 2.4:1 — fails AA); dim tier is for *disabled* content only | `text-muted-foreground` on the empty-state cell; `--` KPI placeholders keep `text-dim` (non-informative placeholder) |
| 4 | Status badge announced nothing to SRs | `aria-live="polite"` on the connection-status badge |
| 5 | Stale-series flash — switching metric/site kept the old trace on the chart until the new fetch resolved | Clear `bufferRef`/`lastTimestampRef` + mark dirty when `historicalData` is undefined (param change → new query key); rAF flush repaints the empty series and recomputes stats |
| 6 | `metric` accepted any string → `?metric=foo` silently rendered a "units" chart; crafted `?from>&to=` produced an inverted range query | `metric` → `parseAsStringLiteral` (falls back to `latency_ms`); `fromMs` clamped to `toMs` in `queryFn` |
| 7 | Dead weight | Removed `zustand` dep (zero usages) and unused `tabs.tsx` shadcn stub; added `test:e2e` script |

## Documented (not fixed)

- `siteId` stays free-form — nodes are dynamic, not a closed registry.
- `stale` connection status is emitted only by the Supabase watchdog; the mock never emits it (renders correctly as an amber badge, untested visually by design).

## Verification

- `pnpm run lint` / `typecheck` / `test` (29) / `test:e2e` (3) / `build` — all green
- ESLint rejected `setStats` inside the param-change effect → solved by clearing refs in the existing `historicalData` effect and letting the rAF flush recompute stats.
