# Changelog

All notable changes to TraceFlow. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
versioning follows SemVer.

## [Unreleased]

### Fixed
- Repo-wide sweep (ISSUE-016): dead ECharts registrations removed;
  `EChartCanvas` no longer forces a 300px min-height inside the 250px
  correlation panel; mock stream seeds per-site (distinct node traces);
  architecture.svg / README / DESIGN.md / BRANCHING.md synced to the
  terminal scheme and actual conventions
- Test coverage backfilled: buffer clear on param change, `from>to` clamp,
  literal URL-param parsers (34 tests) (ISSUE-016)

### Changed
- Element audit pass (ISSUE-015): `colorScheme: dark` on `<html>` so native
  pickers/scrollbars render dark; markLine labels no longer clip at the grid
  edge; anomaly DELTA column colors by row severity; select popovers drop
  `shadow-md`; skeleton uses `bg-accent` for visibility on black; DESIGN.md /
  README font references synced to IBM Plex

### Changed
- Typefaces swapped Inter/JetBrains Mono → **IBM Plex Sans/Mono** (terminal
  heritage digit shapes) (ISSUE-014)
- Chart traces render as flat lines — gradient glow fills removed; live
  indicator uses a hard-step caret blink instead of the SaaS ping halo
  (ISSUE-014)
- KPI values carry their signal color directly (Bloomberg convention);
  left accent borders and raised surfaces dropped; panel titles render in
  brand amber (ISSUE-014)

### Fixed
- **Terminal redesign (ISSUE-013):** palette moved from navy + neon cyan to
  true-black canvas, warm-neutral zinc surface tiers, amber `#FFB000`
  chrome/trace, steel-blue correlation, orange warn, warm ivory text —
  DESIGN.md updated to the v2 Terminal scheme
- Range selector renders as a function-key strip `[1H]…[CUSTOM]` with an
  amber active key; wordmark gains a blinking block cursor (ISSUE-013)
- Anomaly table uses zebra rows and right-aligned numeric columns (ISSUE-013)
- All brand assets regenerated in the new palette (icon, logo, hero, mobile,
  zoom-inspect, OG image, live-demo GIF) (ISSUE-013)

### Added
- Bottom terminal status bar: `TERM·01`, node id, buffered point count,
  connection status, blinking cursor, live UTC clock (ISSUE-013)

### Fixed
- Icon-only ZoomIn button now has `aria-label`; decorative icons marked
  `aria-hidden`; status badge is `aria-live` (ISSUE-012)
- Anomaly empty-state uses `text-muted-foreground` — informative text no
  longer uses the sub-AA `text-dim` tier (ISSUE-012)
- Stale-series flash: buffer is dropped as soon as query params change so
  the previous metric's trace can't linger (ISSUE-012)
- `?metric=` is literal-validated (invalid → default) and a crafted
  `?from>&to=` window clamps to empty instead of an inverted range query
  (ISSUE-012)

### Removed
- `zustand` dependency and unused `tabs.tsx` stub (ISSUE-012)

### Added
- `pnpm test:e2e` script (ISSUE-012)

### Changed
- `--accent` now maps to spec L3 `#1A2438` (hover/active tier) — was L2
  `#121A2A` (ISSUE-011)
- Type scale tokenized: `--text-micro`/`--text-mini`/`--text-value` replace
  all `text-[Npx]` literals; `.font-mono` drops blanket `tracking-tight`
  for per-tier tracking (ISSUE-011)
- `ZoomIn` row action uses a real `<Tooltip>` instead of `title=`
  (ISSUE-011)

## [0.3.0] - 2025-10-22

Polish release — 13-viewport responsive audit, design-token hygiene, and a
visual refinement pass. Closes ISSUE-008, ISSUE-009, ISSUE-010.

### Added
- `--live`/`--warn`/`--crit` signal-color tokens (`#10B981`/`#F59E0B`/`#F43F5E`)
  replacing scattered Tailwind emerald/amber/rose literals (ISSUE-008)
- `--raised` surface tier (`#101B2C`) for KPI cards (ISSUE-009)
- Signal-linked visual devices: KPI left borders per metric, accent ticks on
  panel headers, gradient area fills under both chart traces (ISSUE-009)
- `--edge` border tier (`#334155`) marking interactive controls vs structural
  hairlines (ISSUE-010)
- Brand assets: `src/app/icon.svg` (cyan waveform mark), `opengraph-image.png`,
  `LICENSE` (MIT), README rewrite with live-demo GIF, `.env.example` runtime
  vars docs; `package.json` version/description aligned to 0.3.0

### Changed
- label-caps elements use `tracking-[0.08em]` per spec (was `tracking-wider`)
- `--` KPI placeholders and the anomaly empty state use the `text-dim`
  (`#475569`) tier so the third text token is no longer dead (ISSUE-008)
- Disconnected status badge shows `WifiOff` instead of `Activity` (ISSUE-008)
- KPI icons match metric semantics — `Zap` (live), `Sigma` (mean),
  `TrendingUp` (peak) (ISSUE-010)
- KPI value 24→26px; grid splitLines softened to `rgba(30,41,59,.55)`
  (ISSUE-009)

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
