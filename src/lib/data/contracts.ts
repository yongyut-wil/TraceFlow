import { z } from 'zod';

export const TimeSeriesPointSchema = z.tuple([z.number(), z.number()]).readonly();
export type TimeSeriesPoint = z.infer<typeof TimeSeriesPointSchema>;

export const HistoricalResponseSchema = z.object({
  siteId: z.string(),
  metric: z.string(),
  unit: z.string(),
  thresholdWarning: z.number().optional(),
  thresholdCritical: z.number().optional(),
  lastTimestampMs: z.number(),
  points: z.array(TimeSeriesPointSchema),
});
export type HistoricalResponse = z.infer<typeof HistoricalResponseSchema>;

export const StreamBatchPayloadSchema = z.object({
  siteId: z.string(),
  metric: z.string(),
  sequenceId: z.number(),
  points: z.array(TimeSeriesPointSchema),
});
export type StreamBatchPayload = z.infer<typeof StreamBatchPayloadSchema>;

export type ConnectionStatus = 'connecting' | 'connected' | 'reconnecting' | 'stale' | 'disconnected';

export type DataMode = 'hybrid' | 'supabase' | 'mock';
export type ResolvedSourceMode = 'supabase' | 'mock' | 'error';

export interface AnomalyEvent {
  timestampMs: number;
  severity: 'WARN' | 'CRIT';
  value: number;
  deltaPct: number;
}

export interface BufferStats {
  last: number | null;
  avg: number;
  max: number;
  count: number;
  anomalies: AnomalyEvent[];
}

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
