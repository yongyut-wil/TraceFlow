# Changelog

All notable changes to TraceFlow. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
versioning follows SemVer.

## [Unreleased]

Post-release polish from the 13-viewport responsive audit + design-system
token audit — closes ISSUE-008 and ISSUE-009.

### Added
- `--live`/`--warn`/`--crit` signal-color tokens (`#10B981`/`#F59E0B`/`#F43F5E`)
  replacing scattered Tailwind emerald/amber/rose literals (ISSUE-008)
- `--raised` surface tier (`#101B2C`) for KPI cards (ISSUE-009)
- Signal-linked visual devices: KPI left borders per metric, accent ticks on
  panel headers, gradient area fills under both chart traces (ISSUE-009)
- `--edge` border tier (`#334155`) marking interactive controls vs structural
  hairlines (ISSUE-010)

### Changed
- label-caps elements use `tracking-[0.08em]` per spec (was `tracking-wider`)
- `--` KPI placeholders and the anomaly empty state use the `text-dim`
  (`#475569`) tier so the third text token is no longer dead (ISSUE-008)
- Disconnected status badge shows `WifiOff` instead of `Activity` (ISSUE-008)

### Fixed
- Compare select `throughput_rps` truncated at ≤1440px — trigger widened
- markLine labels clipped at the right canvas edge on ≤390px — moved to
  `insideStartTop` (ISSUE-008)
- Anomaly table min-width ~417px forced horizontal scroll on phones; cell
  padding now `px-2 sm:px-3` so the table fits 360px+ (ISSUE-008)
- `ZoomIn` row action `h-5 w-5` (20px) → `h-6 w-6` (24px) to meet WCAG 2.5.8
  touch-target minimum (ISSUE-008)
- SEV badge `text-[8px]` was below the spec floor (9px) (ISSUE-008)
- KPI grid gutter 12px → 8px on mobile per spacing spec (ISSUE-008)

## [0.2.0] - 2025-10-22

Post-review fix train — closes ISSUE-001 through ISSUE-007 (see `docs/issues/`).

### Added
- COMPARE metric selector in the header with a `none` option; the correlation
  chart hides instead of duplicating the primary metric (ISSUE-003)
- Anomaly table rows zoom the primary chart to ±2 min around the event via
  `dataZoom` dispatch (ISSUE-002)
- Security headers on all routes (nosniff, DENY framing, Referrer-Policy) and
  a production CSP limiting `connect-src` to self + `*.supabase.co` (ISSUE-006)
- Third text tier token `#475569` (`text-dim`) per design spec (ISSUE-005)
- Centralized `src/lib/chart-theme.ts` for canvas-facing color constants
  (ISSUE-005)
- 24 new tests: zod contract schemas, `getDataSource` factory matrix, mock
  determinism + wall-clock anchoring, `EChartCanvas` dispose/ResizeObserver
  lifecycle, literal 12k→10k ring-buffer cap, flush→`setOption` assertion,
  nuqs reload-persistence E2E — 29 unit + 3 E2E total (ISSUE-001)

### Changed
- Mock live stream anchors timestamps to wall-clock (`Date.now()`) instead of
  an accelerating counter (ISSUE-004)
- Historical query sets `staleTime: 30s` + `refetchOnWindowFocus: false`;
  the live stream is the freshness mechanism (ISSUE-007)
- Metric units/thresholds resolve via `METRIC_DEFS` registry instead of
  `metric.includes('latency')` (ISSUE-007)
- `SupabaseDataSource` uses `@supabase/ssr` `createBrowserClient`; channel
  name segments sanitized (ISSUE-006)
- `shadcn` moved to `devDependencies` (ISSUE-006)
- Custom range commits `range=custom` only when a date is picked (ISSUE-005)
- KPI skeleton loading, reduced-motion live dot, focus rings on range
  buttons, responsive grid breakpoints (ISSUE-005)

### Fixed
- Anomaly table distinguishes "source unavailable" from "no breaches";
  `deltaPct` sign renders correctly (ISSUE-002)
- Dead `ZoomIn` control wired to a real action (ISSUE-002)
- Horizontal overflow on ~390px viewports (ISSUE-005)

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
