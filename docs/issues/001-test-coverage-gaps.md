# ISSUE-001 — Test coverage gaps vs testing-standards

**Severity:** Medium · **Type:** test · **Found by:** code review

## Problem

`.devin/rules/testing-standards.md` and `AGENTS.md` §2.6 mandate tests that are
not implemented. Current suite (5 tests) covers eviction, dedup, pause, stats.

## Missing coverage

1. Literal spec test: push 12,000 points into a 10,000-cap buffer → newest 10,000
   retained (current test uses `maxPoints=10` — mechanism equivalent, spec unmet)
2. `TimeSeriesPointSchema` / payload validation tests (zero-transformation contract)
3. `EChartCanvas` unmount → `ResizeObserver.disconnect()` + `chart.dispose()`
4. Hybrid provider fallback: `getDataSource('hybrid')` → Mock when creds absent;
   `getDataSource('supabase')` throws descriptive error; `'mock'` → MockDataSource
5. rAF flush asserts `chartRef.current.setOption` called with `{ series: [{ id, data }] }`
6. `MockDataSource` determinism: same params → identical points
7. E2E: nuqs filter persistence across **page reload**

## Acceptance criteria

- All of the above covered; `pnpm test` and `pnpm exec playwright test` green.
