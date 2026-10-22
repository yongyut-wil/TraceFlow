import { createBrowserClient } from '@supabase/ssr';
import { z } from 'zod';
import { StreamBatchPayloadSchema, TimeSeriesPointSchema, type ConnectionStatus, type HistoricalResponse, type StreamSubscriptionOptions, type TimeSeriesDataSource, type TimeSeriesPoint, type TimeSeriesQueryParams } from './contracts';
import { getMetricDef } from './metrics';

// Channel-name segments come from URL params — strip anything that is not
// a plain identifier character so topic names stay well-formed.
const seg = (s: string) => s.replace(/[^a-zA-Z0-9_-]/g, '_');

const TelemetryRowSchema = z.object({
  timestamp_ms: z.number(),
  value: z.number(),
});

export class SupabaseDataSource implements TimeSeriesDataSource {
  readonly mode = 'supabase' as const;
  private client;

  constructor() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      throw new Error(
        'SupabaseDataSource requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
      );
    }
    this.client = createBrowserClient(url, key);
  }

  async fetchHistorical(params: TimeSeriesQueryParams, signal?: AbortSignal): Promise<HistoricalResponse> {
    const { siteId, metric, fromMs, toMs, limit = 10_000 } = params;
    const def = getMetricDef(metric);

    let query = this.client
      .from('telemetry_points')
      .select('timestamp_ms,value')
      .eq('site_id', siteId)
      .eq('metric', metric)
      .gte('timestamp_ms', fromMs)
      .lte('timestamp_ms', toMs)
      .order('timestamp_ms', { ascending: true })
      .limit(limit);

    if (signal) query = query.abortSignal(signal);

    const { data, error } = await query;
    if (error) throw new Error(`Supabase fetchHistorical failed: ${error.message}`);

    const rows = z.array(TelemetryRowSchema).parse(data ?? []);
    const points: TimeSeriesPoint[] = rows.map((r) =>
      TimeSeriesPointSchema.parse([r.timestamp_ms, r.value])
    );

    return {
      siteId,
      metric,
      unit: def.unit,
      thresholdWarning: def.warn,
      thresholdCritical: def.crit,
      lastTimestampMs: points.length > 0 ? points[points.length - 1][0] : toMs,
      points,
    };
  }

  subscribeStream(options: StreamSubscriptionOptions): () => void {
    const { siteId, metric, afterTimestampMs, onBatch, onStatusChange } = options;

    let currentStatus: ConnectionStatus = 'connecting';
    const setStatus = (s: ConnectionStatus) => {
      currentStatus = s;
      onStatusChange(s);
    };
    setStatus('connecting');

    // Staleness watchdog: flag the stream 'stale' when no broadcast arrives
    // within the heartbeat window, and recover on the next message.
    const STALE_MS = 30_000;
    let lastMsgAt = Date.now();
    const watchdog = setInterval(() => {
      if (currentStatus === 'connected' && Date.now() - lastMsgAt > STALE_MS) {
        setStatus('stale');
      }
    }, 5_000);

    const channel = this.client
      .channel(`telemetry:${seg(siteId)}:${seg(metric)}`)
      .on('broadcast', { event: 'batch' }, (payload) => {
        lastMsgAt = Date.now();
        if (currentStatus === 'stale') setStatus('connected');
        const parsed = StreamBatchPayloadSchema.safeParse(payload?.payload);
        if (!parsed.success) return;
        const filtered = parsed.data.points.filter((p) => p[0] > afterTimestampMs);
        if (filtered.length > 0) onBatch(filtered);
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') setStatus('connected');
        else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') setStatus('reconnecting');
        else if (status === 'CLOSED') setStatus('disconnected');
      });

    return () => {
      clearInterval(watchdog);
      this.client.removeChannel(channel);
    };
  }
}
