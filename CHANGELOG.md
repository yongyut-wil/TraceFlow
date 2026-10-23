# Changelog

All notable changes to TraceFlow. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
versioning follows SemVer.

## [0.4.2] - 2026-10-23

CI enforcement and e2e expansion — every push/PR now runs the full local
gate remotely, and browser coverage grew from a 3-test smoke to a 12-test
interaction suite.

### Added
- GitHub Actions CI gate (`.github/workflows/ci.yml`) — lint, typecheck,
  vitest, build, and playwright e2e on every push/PR (ISSUE-018)
- `docs/assets/palette.svg` — terminal token swatch strip embedded in the
  README design-system section
- 9 new Playwright e2e tests (12 total): header selects, compare-chart
  mount/unmount lifecycle, pause/resume stream freeze, unconfigured-supabase
  error state, anomaly zoom action, invalid param fallback, inverted-range
  clamp, KPI/status bar values, and mobile 390px overflow guard

### Changed
- `AGENTS.md` tech stack no longer lists `zustand` (dropped in ISSUE-012)
- Playwright `webServer` serves `pnpm run start` in CI — `next dev`
  intermittently stalled in the Turbopack font replacer on runners

## [0.4.1] - 2026-10-23

Docs/design-system consistency patch — spec files now match the shipped
terminal product. Closes ISSUE-017.

### Changed
- `DESIGN.md` rewritten as design-system v3 — frontmatter colors corrected to
  the terminal palette (was the pre-ISSUE-013 Material scheme), all six
  surface tiers documented, plus states matrix, motion spec, component
  anatomy, data-viz rules, and don'ts (ISSUE-017)
- Font CSS variables renamed `--font-inter`/`--font-jetbrains-mono` →
  `--font-plex-sans`/`--font-plex-mono`; page title/description now
  "Telemetry Terminal" / ops-terminal (ISSUE-017)
- README: emoji dropped repo-wide, terminal token palette SVG added under
  Design system, stale counts/wording synced to v0.4.0 reality

## [0.4.0] - 2026-10-23

Terminal redesign + hardening train — "ops terminal, not SaaS dashboard".
Closes ISSUE-011 through ISSUE-016.

### Added
- Bottom terminal status bar: `TERM·01`, node id, buffered point count,
  connection status, blinking cursor, live UTC clock (ISSUE-013)
- `pnpm test:e2e` script (ISSUE-012)
- Type-scale tokens `--text-micro`/`--text-mini`/`--text-value` replacing all
  `text-[Npx]` literals (ISSUE-011)
- 5 tests backfilled: buffer clear on param change, `from>to` clamp, literal
  URL-param parsers — 34 unit tests total (ISSUE-016)

### Changed
- **Terminal redesign (ISSUE-013):** true-black canvas, warm-zinc surface
  tiers, amber `#FFB000` chrome/trace, steel-blue correlation, orange warn,
  warm ivory text — DESIGN.md updated to the v2 Terminal scheme
- Range selector renders as a function-key strip `[1H]…[CUSTOM]`; wordmark
  gains a blinking block cursor (ISSUE-013)
- Anomaly table uses zebra rows and right-aligned numeric columns (ISSUE-013)
- Typefaces swapped Inter/JetBrains Mono → **IBM Plex Sans/Mono** (ISSUE-014)
- Chart traces render as flat lines — gradient glow fills removed; live
  indicator uses a hard-step caret blink (ISSUE-014)
- KPI values carry their signal color directly; left accent borders and
  raised surfaces dropped; panel titles render in brand amber (ISSUE-014)
- `--accent` maps to the hover/active tier per spec; `.font-mono` drops
  blanket `tracking-tight` for per-tier tracking; `ZoomIn` uses a real
  `<Tooltip>` (ISSUE-011)
- Element audit (ISSUE-015): `colorScheme: dark` on `<html>` for native
  dark pickers/scrollbars; markLine labels no longer clip at the grid edge;
  anomaly DELTA column colors by row severity; select popovers drop
  `shadow-md`; skeleton uses `bg-accent` for visibility
- `EChartCanvas` no longer forces a 300px min-height inside the 250px
  correlation panel; mock stream seeds per-site for distinct node traces
  (ISSUE-016)
- All brand assets regenerated in the terminal palette (icon, logo, hero,
  mobile, zoom-inspect, OG image, live-demo GIF) (ISSUE-013)

### Fixed
- A11y (ISSUE-012): `aria-label` on icon-only ZoomIn, `aria-hidden` on
  decorative icons, `aria-live` status badge, empty-state contrast raised
  from sub-AA `text-dim` to `text-muted-foreground`
- Stale-series flash: buffer is dropped as soon as query params change
  (ISSUE-012)
- `?metric=` literal-validated (invalid → default); crafted `?from>&to=`
  window clamps instead of inverting the query (ISSUE-012)
- architecture.svg / README / DESIGN.md / BRANCHING.md synced to the
  terminal scheme and actual conventions (ISSUE-016)

### Removed
- `zustand` dependency and unused `tabs.tsx` stub (ISSUE-012)
- Unused ECharts registrations (BarChart, Dataset, Legend, MarkPoint,
  UniversalTransition) (ISSUE-016)

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
