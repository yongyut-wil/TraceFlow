# TraceFlow — Project Rules & Architecture

You are an expert Frontend Architect building **TraceFlow**, a high-performance, real-time monitoring and time-series visualization dashboard.
The system must render **10,000+ data points** smoothly at **60 FPS** with zero memory leaks or UI blocking.

## 1. Tech Stack (Strictly Locked)

- **Framework:** Next.js (App Router) with React 19
- **Package Manager:** `pnpm` ONLY (never use `npm` or `yarn`)
- **Language:** TypeScript (`strict: true`, no `any`; use `unknown` + `zod` for external boundaries)
- **Styling & UI:** Tailwind CSS + Shadcn/UI
- **Data Visualization:** Apache ECharts via modular `echarts/core` + `CanvasRenderer` ONLY. Never `import * as echarts from 'echarts'` and never use Recharts or Chart.js.
- **State Management:**
  - Server Cache: `@tanstack/react-query`
  - Client UI State: React state/refs in components (zustand was dropped in ISSUE-012 — no cross-component client store exists)
  - URL Search Params: `nuqs` (`NuqsAdapter` for Next.js App Router)
- **Data Layer (Hybrid B+C Architecture):**
  - Primary Backend: Supabase (PostgreSQL REST/RPC + Supabase Realtime)
  - Fallback / Stress-Test Backend: High-frequency Mock Generator (10k+ historical points + simulated WebSocket stream)
  - Controlled via `NEXT_PUBLIC_DATA_MODE=hybrid | supabase | mock`
- **Testing & Verification:** Vitest (unit & custom hooks), Playwright + `agent-browser` (E2E & rendering verification)

## 2. Core Architectural Rules

1. **ECharts Lifecycle & Large Dataset Optimization:**
   - Always mount charts through a base `<EChartCanvas />` client component that manages the instance via `useRef`, resizes via `ResizeObserver`, and calls `chart.dispose()` on unmount.
   - For time-series with >1,000 points, enforce `sampling: 'lttb'`, `large: true`, `largeThreshold: 2000`, `animation: false`, and update via `chart.setOption(option, { notMerge: false, lazyUpdate: true })`.
2. **Real-Time Stream Buffering (Zero React Re-renders):**
   - Never store high-frequency WebSocket/Realtime payloads directly in `useState`.
   - Buffer incoming points in a fixed-capacity ring buffer inside `useRef` (e.g., `MAX_POINTS = 10_000`, evicting oldest entries to prevent memory leaks).
   - Flush buffered points on a throttled interval (250ms–500ms) inside `requestAnimationFrame` by calling `chartInstance.setOption()` imperatively.
3. **Zero-Transformation Data Contract:**
   - Standardize time-series payloads as tuple arrays: `type TimeSeriesPoint = readonly [timestampMs: number, value: number]`.
   - Pass tuple arrays directly to ECharts `dataset` or `series.data` without `.map()` object allocations on the main thread.
4. **Hybrid Data Provider & Stream Deduplication:**
   - All data fetching and streaming must go through the `TimeSeriesDataSource` interface (`SupabaseDataSource` and `MockDataSource`).
   - When merging 24-hour historical REST data with live WebSocket streams, deduplicate by enforcing `point[0] > lastTimestampMs`.
5. **State & Component Boundaries:**
   - Keep TanStack Query server state strictly separate from component-local client state.
   - Persist all shareable global filters (`from`, `to`, `siteId`, `metric`, `interval`) in the URL via `nuqs`.
   - Use React Server Components (RSC) for layout shells and static metadata; isolate `'use client'` strictly to interactive leaf widgets and chart containers.
6. **Testing Requirement:**
   - Write Vitest unit tests for all data hooks (ring buffer capacity/eviction, LTTB/aggregation helpers, stream deduplication, and hybrid provider fallback).

## 3. Required Skills, Rules & Subagents

### Skills (`.devin/skills/`)
Always invoke the matching skill before implementing or reviewing the corresponding layer:
- **Creating or modifying ECharts components or real-time stream hooks:** Invoke `/echarts-performance` (`.devin/skills/echarts-performance/SKILL.md`).
- **Building data fetching, Supabase integration, or mock stream generators:** Invoke `/hybrid-data-layer` (`.devin/skills/hybrid-data-layer/SKILL.md`).
- **Translating requirements into UI layouts, Stitch designs, or API contracts:** Invoke `/ui-planning` (`.devin/skills/ui-planning/SKILL.md`) along with `design-system` and `frontend-design`.
- **Reviewing React/TypeScript performance and state patterns:** Invoke `typescript-react-reviewer`.
- **Writing unit tests or E2E browser checks:** Invoke `vitest-testing`, `webapp-testing`, or `agent-browser`.

### Scoped Rules (`.devin/rules/`)
Glob-activated rules automatically enforce constraints when touching matching files:
- `.devin/rules/echarts-guardrails.md` — Active on `*chart*` / `*echarts*` / `*series*` files.
- `.devin/rules/realtime-state-guardrails.md` — Active on `hooks/`, `stores/`, `providers/`, `services/`, and `lib/` files.
- `.devin/rules/testing-standards.md` — Active on `*.test.*` and `*.spec.*` files.

### Lifecycle Hooks (`.devin/hooks.v1.json`)
Automated hooks guard every turn:
- `PreToolUse` (`write|edit|apply_patch`): Blocks full `from 'echarts'` imports and prohibited libraries (`recharts`, `chart.js`, `echarts-for-react`).
- `PreToolUse` (`exec`): Blocks `npm`/`yarn` install commands (enforcing `pnpm`) and destructive git operations.
- `PostCompaction`: Re-injects core architectural invariants after context compaction.

### Custom Subagent Profiles (`.devin/agents/`)
When delegating focused work to subagents (when requested by the user), select the specialized profile:
- `perf-auditor` (`.devin/agents/perf-auditor.md`) — Read-only React 19 & ECharts performance/memory-leak auditor.
- `data-contract-architect` (`.devin/agents/data-contract-architect.md`) — Specialist for the Hybrid Data Layer (`SupabaseDataSource` + `MockDataSource`) and `[timestampMs, value][]` contracts.
- `qa-verifier` (`.devin/agents/qa-verifier.md`) — Specialist for running Vitest hook tests, typechecks, and Playwright/`agent-browser` verification.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
