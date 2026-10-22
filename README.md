<div align="center">

<img src="docs/assets/logo.svg" alt="TraceFlow logo" width="64">

# TraceFlow

**Mission-control real-time telemetry dashboard**

10,000-point ring buffer · LTTB-sampled canvas traces · Supabase Realtime + deterministic mock · URL-driven filters

![Next.js](https://img.shields.io/badge/Next.js_16-000?logo=next.js&logoColor=fff)
![React](https://img.shields.io/badge/React_19-61DAFB?logo=react&logoColor=000)
![TypeScript](https://img.shields.io/badge/TypeScript_strict-3178C6?logo=typescript&logoColor=fff)
![Tests](https://img.shields.io/badge/tests-29_unit_%2B_3_e2e-10B981)
![License](https://img.shields.io/badge/license-MIT-00E5FF)

</div>

![TraceFlow live stream](docs/assets/live-demo.gif)

---

## Why TraceFlow

Real-time dashboards usually break in one of three ways: React re-render storms
from high-frequency streams, chart libraries that choke past a few thousand
points, or "live" demos that need a running backend. TraceFlow is built around
solving all three:

| Problem | TraceFlow's answer |
|---|---|
| Streaming React state churn | Points land in a `useRef` ring buffer (10k cap) and flush to ECharts on a throttled `requestAnimationFrame` — zero per-point renders |
| Chart perf at 10k+ pts | Tree-shaken `echarts/core` + CanvasRenderer, LTTB downsampling, `large` mode, `useDirtyRect` |
| No backend handy | `MockDataSource` — deterministic 10k-point windows + wall-clock-anchored live batches; swap to Supabase by env var, zero code changes |

## Features

- **Primary telemetry signal** — 24h historical window + live stream on one trace, WARN/CRIT threshold markLines, `inside` + `slider` dataZoom
- **Synced correlation chart** — second metric on a shared `echarts.connect` group (synchronized crosshair + zoom), pickable from the header
- **Anomaly inspector** — severity-badged live feed; click 🔍 to zoom the primary chart ±2 min around any event
- **URL as the single source of truth** — `siteId`, `metric`, `compare`, `range` (`1h/6h/24h/7d/custom`), `mode`, `from`/`to` via nuqs; survives reload and is shareable
- **Pause/resume** — freeze the stream without losing buffered data
- **KPI row** — current value, window mean, peak, retained anomalies with skeleton loading and `text-dim` empty tiers
- **Responsive floor** — measured `overflowX = 0` from 2560px down to 320px; tables and controls wrap instead of clipping
- **Mission-control design system** — zero radius, hairline borders, 3-tier border hierarchy, signal-color tokens, `prefers-reduced-motion` support
- **Security posture** — CSP + nosniff + DENY framing + Referrer-Policy on every route; zod-validated external payloads; no secrets in repo

## Screenshots

<table>
  <tr>
    <td width="65%"><img src="docs/assets/hero.png" alt="TraceFlow desktop dashboard"></td>
    <td><img src="docs/assets/mobile.png" alt="TraceFlow mobile"></td>
  </tr>
  <tr>
    <td colspan="2"><img src="docs/assets/zoom-inspect.png" alt="Anomaly zoom inspection"></td>
  </tr>
</table>

## Architecture

```
 nuqs URL state                getDataSource()
 siteId · metric · compare ──► (env mode) ──┬─ mock/no creds ─► MockDataSource
 range · mode · from · to                   │                 10k deterministic
                                           │                 + wall-clock stream
                                           │
                                           └─ supabase ──────► SupabaseDataSource
                                                              PostgREST + Realtime

                                          zod-validated tuples
                                                     │
                                                     ▼
                                    useRef ring buffer (10k cap · ts dedup)
                                                     │
                                              rAF flush · 250ms
                                                     │
                              ┌──────────────────────┴──────────────────────┐
                              ▼                                             ▼
                    Primary signal                            Correlation chart
                    LTTB · markLines · dataZoom               echarts.connect — synced
```

**Data contract** — zero-transformation tuples, validated at the boundary:

```ts
type TimeSeriesPoint = readonly [timestampMs: number, value: number]
```

## Data modes

| `NEXT_PUBLIC_DATA_MODE` | Behavior |
|---|---|
| `mock` | Always deterministic mock (default for tests/e2e) |
| `supabase` | Strict Supabase — throws a clear config error without credentials |
| `hybrid` *(default)* | Supabase when env vars exist, mock fallback otherwise |

```bash
# .env.local — only needed for supabase/hybrid-with-creds
NEXT_PUBLIC_DATA_MODE=hybrid
NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

The Supabase source queries a `telemetry_points` table
(`site_id, metric, ts_ms, value`) and subscribes to the
`telemetry:<siteId>:<metric>` broadcast channel — payloads are validated with
Zod before touching the buffer.

## Quickstart

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

```bash
pnpm run lint         # eslint
pnpm run typecheck    # tsc --noEmit
pnpm test             # vitest — 29 unit tests
pnpm exec playwright test   # 3 e2e (needs dev server on :3000)
pnpm run build && pnpm start
```

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 App Router · React 19 · TypeScript strict |
| Charts | Apache ECharts — modular `echarts/core`, CanvasRenderer |
| URL state | nuqs (`NuqsAdapter` on the root layout) |
| Data fetching | TanStack Query (`staleTime: 30s`, no refetch-on-focus) |
| Backend | Supabase (`@supabase/ssr` client, PostgREST + Realtime) |
| Validation | Zod contracts at every external boundary |
| Styling | Tailwind 4 + shadcn/ui (base-nova) + Lucide icons |
| Tests | Vitest + jsdom (fake timers, rAF stubs) · Playwright |

## Design system

Derived from `.devin/stitch/DESIGN.md` — avionics/mission-control aesthetics:

- **Surfaces** `#06090F` canvas → `#0D131F` panel → `#101B2C` raised → `#121A2A` focused → `#1A2438` elevated
- **Border tiers** `#1E293B` structural · `#334155` interactive controls · signal-color accents
- **Signals** cyan `#00E5FF` primary · violet `#818CF8` secondary · emerald `#10B981` live · amber `#F59E0B` warn · rose `#F43F5E` crit
- **Type** Inter (UI) + JetBrains Mono tabular-nums (data) — label-caps at 9–10px / `0.08em` tracking
- **Rules** zero radius · no fuzzy shadows · hairlines only · `prefers-reduced-motion` honored

## Project layout

```
src/
├── app/                    # RSC shell, globals.css tokens
├── components/
│   ├── charts/             # EChartCanvas (init/setOption/dispose lifecycle)
│   ├── dashboard/          # HeaderFilterBar, KpiCards, charts, AnomalyStreamTable
│   └── ui/                 # shadcn primitives
├── hooks/                  # useRealtimeChartBuffer (ring buffer + rAF flush)
├── lib/
│   ├── data/               # contracts, metrics registry, mock/supabase sources, factory
│   ├── echarts-setup.ts    # tree-shaken echarts singleton
│   ├── chart-theme.ts      # canvas-facing color constants
│   └── search-params.ts    # nuqs parsers
├── e2e/                    # Playwright specs
└── docs/                   # issues/, BRANCHING.md, assets/
```

## Development docs

- 📋 [`docs/issues/`](docs/issues/README.md) — local issue tracker (10 closed)
- 🌿 [`docs/BRANCHING.md`](docs/BRANCHING.md) — trunk-based, `fix/issue-NNN-*`, `release/x.y.z`
- 📦 [`CHANGELOG.md`](CHANGELOG.md) — Keep-a-Changelog + SemVer, latest **v0.3.0**
- 🎨 [`.devin/stitch/DESIGN.md`](.devin/stitch/DESIGN.md) — design token source of truth
