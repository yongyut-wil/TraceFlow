# Changelog

All notable changes to TraceFlow. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
versioning follows SemVer.

## [Unreleased] — 0.2.0 (post-review fix train)

Tracked in `docs/issues/`. Closes ISSUE-001 through ISSUE-007.

### Fixed
- (pending)

## [0.1.0] - 2025-10-22

Initial release — real-time telemetry dashboard baseline.

### Added
- Next.js 16 (App Router) + React 19 + TypeScript strict, pnpm-managed
- Hybrid data layer: `SupabaseDataSource` + `MockDataSource` behind
  `TimeSeriesDataSource` contract, resolved by `NEXT_PUBLIC_DATA_MODE`
  (`hybrid` | `supabase` | `mock`) with zod-validated tuple contracts
  (`readonly [timestampMs, value]`)
- `MockDataSource`: deterministic 10,000-point historical windows over 24h
  + high-frequency simulated batches
- `EChartCanvas` base component (echarts/core + CanvasRenderer,
  `useDirtyRect`, ResizeObserver + dispose lifecycle, `echarts.connect` groups)
- `useRealtimeChartBuffer`: 10k-cap ring buffer in `useRef`, timestamp
  deduplication, 250ms `requestAnimationFrame` flush, throttled stats snapshot
- Dashboard: `HeaderFilterBar` (nuqs `siteId`/`metric`/`range`/`mode`/`from`/`to`,
  source badge, pause, live indicator), `KpiCards`, `PrimaryTelemetryChart`
  (LTTB, WARN 85ms / CRIT 120ms markLines, dataZoom), `SyncedCorrelationChart`
  (`traceflow-group`), `AnomalyStreamTable`
- Mission Control design system: zero-radius, hairline `#1E293B` borders,
  Inter + JetBrains Mono (`tabular-nums`), dark-only tokens from
  `.devin/stitch/DESIGN.md`
- shadcn/ui (base-nova) components: card, badge, select, tabs, popover,
  skeleton, tooltip, scroll-area, button
- Vitest hook tests (5) + Playwright E2E (2), `pnpm test` / `lint` /
  `typecheck` / `build` all green
