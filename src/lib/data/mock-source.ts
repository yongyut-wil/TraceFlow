import type { HistoricalResponse, StreamSubscriptionOptions, TimeSeriesDataSource, TimeSeriesPoint, TimeSeriesQueryParams } from './contracts';

// Deterministic pseudo-random in [0, 1) seeded by timestamp + site hash.
function seededNoise(t: number, seed: number): number {
  const x = Math.sin(t * 0.000173 + seed * 0.7919) * 43758.5453;
  return x - Math.floor(x);
}

export class MockDataSource implements TimeSeriesDataSource {
  readonly mode = 'mock' as const;

  async fetchHistorical(params: TimeSeriesQueryParams, signal?: AbortSignal): Promise<HistoricalResponse> {
    const { siteId, metric, fromMs, toMs, limit = 10_000 } = params;

    return new Promise((resolve, reject) => {
      if (signal?.aborted) {
        reject(new DOMException('Aborted', 'AbortError'));
        return;
      }
      const abort = () => {
        clearTimeout(timer);
        reject(new DOMException('Aborted', 'AbortError'));
      };
      signal?.addEventListener('abort', abort, { once: true });

      const timer = setTimeout(() => {
        signal?.removeEventListener('abort', abort);
        const points: TimeSeriesPoint[] = [];
        const step = Math.max(1000, Math.floor((toMs - fromMs) / limit));

        const hash = siteId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
        const isLatency = metric.includes('latency');

        for (let t = fromMs; t < toMs; t += step) {
          const timeRatio = (t - fromMs) / (toMs - fromMs);
          const cycle = Math.sin((timeRatio * Math.PI * 20) + hash);
          const noise = Math.sin(t / 12345 + hash) * 10;

          let val = isLatency
            ? 45 + cycle * 20 + noise + (Math.sin(t / 99999) > 0.95 ? 50 : 0)
            : 12000 + cycle * 3000 + noise * 500;

          if (isLatency && seededNoise(t, hash) > 0.995) val += 80;

          points.push([t, Math.max(0.1, Number(val.toFixed(2)))]);
        }

        resolve({
          siteId,
          metric,
          unit: isLatency ? 'ms' : 'req/s',
          thresholdWarning: isLatency ? 85 : undefined,
          thresholdCritical: isLatency ? 120 : undefined,
          lastTimestampMs: toMs,
          points,
        });
      }, 400);
    });
  }

  subscribeStream(options: StreamSubscriptionOptions): () => void {
    const { metric, afterTimestampMs, onBatch, onStatusChange } = options;
    const isLatency = metric.includes('latency');

    onStatusChange('connecting');
    const connectTimer = setTimeout(() => onStatusChange('connected'), 400);

    let lastTs = afterTimestampMs;

    const interval = setInterval(() => {
      const batchSize = Math.floor(Math.random() * 4) + 1;
      const points: TimeSeriesPoint[] = [];

      for (let i = 0; i < batchSize; i++) {
        lastTs += 50 + Math.floor(Math.random() * 100);

        const timeRatio = lastTs / 10000;
        const cycle = Math.sin(timeRatio);
        const noise = Math.sin(lastTs / 7890) * 5;

        let val = isLatency
          ? 45 + cycle * 15 + noise
          : 12000 + cycle * 2000 + noise * 200;

        if (isLatency && Math.random() > 0.98) val += 60 + Math.random() * 50;

        points.push([lastTs, Math.max(0.1, Number(val.toFixed(2)))]);
      }

      onBatch(points);
    }, 80); // high-frequency batches to stress LTTB + ring buffer

    return () => {
      clearTimeout(connectTimer);
      clearInterval(interval);
      onStatusChange('disconnected');
    };
  }
}
