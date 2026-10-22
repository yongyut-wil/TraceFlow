---
name: hybrid-data-layer
description: Hybrid Data Provider pattern supporting both Supabase (PostgreSQL REST/RPC + Realtime) and high-frequency 10k+ point Mock Data Generators with zero-transformation tuple contracts and stream deduplication.
allowed-tools:
  - read
  - edit
  - grep
  - glob
triggers:
  - user
  - model
---

# Hybrid Data Layer Skill (Supabase + Mock Stream Adapter)

Use this skill when building or modifying data fetching, WebSocket/Realtime subscriptions, Zod schemas, or mock stream generators in **TraceFlow**.

## 1. Zero-Transformation Data Contract

To avoid expensive `.map()` object allocations on 10,000+ rows in the browser:

```ts
import { z } from 'zod';

// Tuple: [timestamp_ms, numeric_value]
export const TimeSeriesPointSchema = z.tuple([z.number(), z.number()]).readonly();
export type TimeSeriesPoint = z.infer<typeof TimeSeriesPointSchema>;

export const HistoricalResponseSchema = z.object({
  metric: z.string(),
  siteId: z.string(),
  unit: z.string(),
  lastTimestampMs: z.number(),
  points: z.array(TimeSeriesPointSchema),
});

export type HistoricalResponse = z.infer<typeof HistoricalResponseSchema>;

export const StreamBatchPayloadSchema = z.object({
  metric: z.string(),
  siteId: z.string(),
  sequenceId: z.number(),
  points: z.array(TimeSeriesPointSchema),
});

export type StreamBatchPayload = z.infer<typeof StreamBatchPayloadSchema>;
```

## 2. `TimeSeriesDataSource` Adapter Interface

All components and hooks must consume data exclusively through this contract:

```ts
export type ConnectionStatus = 'connecting' | 'connected' | 'reconnecting' | 'stale' | 'disconnected';

export interface TimeSeriesQueryParams {
  siteId: string;
  metric: string;
  fromMs: number;
  toMs: number;
  limit?: number;
}

export interface StreamSubscriptionOptions {
  siteId: string;
  metric: string;
  afterTimestampMs: number;
  onBatch: (points: readonly TimeSeriesPoint[]) => void;
  onStatusChange: (status: ConnectionStatus) => void;
}

export interface TimeSeriesDataSource {
  readonly mode: 'supabase' | 'mock';
  fetchHistorical(params: TimeSeriesQueryParams, signal?: AbortSignal): Promise<HistoricalResponse>;
  subscribeStream(options: StreamSubscriptionOptions): () => void;
}
```

## 3. Dual Implementation Strategy (`SupabaseDataSource` & `MockDataSource`)

### A. `SupabaseDataSource` (Production / Live DB)
- Uses `@supabase/ssr` client.
- Calls an RPC or queries indexed time-series tables ordered by `timestamp_ms ASC` up to `limit` (e.g., `10_000` points).
- Subscribes to `supabase.channel('telemetry-stream')` on `postgres_changes` or `broadcast`, filtering out any event where `timestamp_ms <= afterTimestampMs`.
- Emits `'stale'` status if no heartbeat or message arrives within the expected staleness window, and `'reconnecting'` on channel errors.

### B. `MockDataSource` (Stress Test / Offline / E2E Testing)
- Deterministically generates `10,000+` historical points across the requested `[fromMs, toMs]` window using realistic sine/trend + Gaussian noise + occasional spike anomalies.
- Simulates a live WebSocket stream (e.g., emitting batches every `50ms–100ms`) so ECharts LTTB downsampling and ring-buffer eviction can be stress-tested at 60 FPS without a live database.
- Exposes controls to simulate network disconnects, data gaps, and burst traffic for Vitest and Playwright tests.

## 4. Factory Resolution (`NEXT_PUBLIC_DATA_MODE`)

Resolve the active adapter based on environment configuration:

- `NEXT_PUBLIC_DATA_MODE=supabase`: Strictly use `SupabaseDataSource` (throw descriptive configuration error if `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` is missing).
- `NEXT_PUBLIC_DATA_MODE=mock`: Strictly use `MockDataSource`.
- `NEXT_PUBLIC_DATA_MODE=hybrid` (Default): Use `SupabaseDataSource` when Supabase credentials are configured and reachable; automatically fall back to `MockDataSource` with a clear UI indicator badge (`Mock Stream Mode`) when credentials are absent.
