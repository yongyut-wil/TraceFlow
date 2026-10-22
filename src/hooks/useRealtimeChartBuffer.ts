'use client';

import { useEffect, useRef, useState, type MutableRefObject } from 'react';
import type { EChartsCoreInstance } from '@/lib/echarts-setup';
import type { AnomalyEvent, BufferStats, ConnectionStatus, DataMode, TimeSeriesPoint } from '@/lib/data/contracts';
import { getDataSource } from '@/lib/data';
import { useQuery } from '@tanstack/react-query';

const MAX_ANOMALIES = 50;
const EMPTY_STATS: BufferStats = { last: null, avg: 0, max: 0, count: 0, anomalies: [] };

function computeStats(
  buf: readonly TimeSeriesPoint[],
  warn: number | undefined,
  crit: number | undefined
): BufferStats {
  const count = buf.length;
  if (count === 0) return EMPTY_STATS;

  let sum = 0;
  let max = -Infinity;
  for (let i = 0; i < count; i++) {
    const v = buf[i][1];
    sum += v;
    if (v > max) max = v;
  }
  const avg = sum / count;

  const anomalies: AnomalyEvent[] = [];
  if (warn !== undefined || crit !== undefined) {
    for (let i = count - 1; i >= 0 && anomalies.length < MAX_ANOMALIES; i--) {
      const v = buf[i][1];
      const severity =
        crit !== undefined && v >= crit ? 'CRIT' : warn !== undefined && v >= warn ? 'WARN' : null;
      if (severity) {
        anomalies.push({
          timestampMs: buf[i][0],
          severity,
          value: v,
          deltaPct: avg !== 0 ? ((v - avg) / avg) * 100 : 0,
        });
      }
    }
  }

  return { last: buf[count - 1][1], avg, max, count, anomalies };
}

const RANGE_MS: Record<string, number> = {
  '1h': 3_600_000,
  '6h': 21_600_000,
  '24h': 86_400_000,
  '7d': 604_800_000,
};

interface UseRealtimeChartBufferOptions {
  chartRef: MutableRefObject<EChartsCoreInstance | null>;
  siteId: string;
  metric: string;
  range: string;
  from?: Date | null;
  to?: Date | null;
  seriesId: string;
  mode?: DataMode;
  paused?: boolean;
  maxPoints?: number;
  flushIntervalMs?: number;
}

export function useRealtimeChartBuffer({
  chartRef,
  siteId,
  metric,
  range,
  from,
  to,
  seriesId,
  mode,
  paused = false,
  maxPoints = 10_000,
  flushIntervalMs = 250,
}: UseRealtimeChartBufferOptions) {
  const bufferRef = useRef<TimeSeriesPoint[]>([]);
  const lastTimestampRef = useRef<number>(0);
  const warnRef = useRef<number | undefined>(undefined);
  const critRef = useRef<number | undefined>(undefined);
  const isDirtyRef = useRef<boolean>(false);
  const rafIdRef = useRef<number | null>(null);

  const [status, setStatus] = useState<ConnectionStatus>('connecting');
  const [stats, setStats] = useState<BufferStats>(EMPTY_STATS);

  // The window is resolved inside queryFn (impure calls are legal in callbacks)
  // so each queryKey change fetches a fresh window anchored at "now".
  const { data: historicalData, isLoading, isError } = useQuery({
    queryKey: ['historical', mode, siteId, metric, range, from?.getTime(), to?.getTime()],
    queryFn: ({ signal }) => {
      const toMs = to?.getTime() ?? Date.now();
      const fromMs = from?.getTime() ?? toMs - (RANGE_MS[range] ?? RANGE_MS['24h']);
      const ds = getDataSource(mode);
      return ds.fetchHistorical({ siteId, metric, fromMs, toMs, limit: maxPoints }, signal);
    },
    retry: 1,
  });

  // Initialize the ring buffer from the historical window.
  useEffect(() => {
    if (!historicalData) return;
    const trimmed =
      historicalData.points.length > maxPoints
        ? historicalData.points.slice(historicalData.points.length - maxPoints)
        : [...historicalData.points];

    bufferRef.current = trimmed;
    lastTimestampRef.current =
      trimmed.length > 0 ? trimmed[trimmed.length - 1][0] : historicalData.lastTimestampMs;
    warnRef.current = historicalData.thresholdWarning;
    critRef.current = historicalData.thresholdCritical;
    isDirtyRef.current = true;
  }, [historicalData, maxPoints]);

  // Live stream subscription — batches only mutate refs, never React state.
  useEffect(() => {
    if (!historicalData || paused) return;

    const ds = getDataSource(mode);
    const unsubscribe = ds.subscribeStream({
      siteId,
      metric,
      afterTimestampMs: lastTimestampRef.current,
      onBatch: (points) => {
        let added = false;
        const buf = bufferRef.current;
        for (let i = 0; i < points.length; i++) {
          const pt = points[i];
          if (pt[0] > lastTimestampRef.current) {
            buf.push(pt);
            lastTimestampRef.current = pt[0];
            added = true;
          }
        }
        if (!added) return;
        if (buf.length > maxPoints) {
          buf.splice(0, buf.length - maxPoints);
        }
        isDirtyRef.current = true;
      },
      onStatusChange: setStatus,
    });

    return () => unsubscribe();
  }, [historicalData, siteId, metric, mode, paused, maxPoints]);

  // Single throttled rAF flush: chart setOption + one batched stats snapshot.
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isDirtyRef.current) return;
      isDirtyRef.current = false;

      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = requestAnimationFrame(() => {
        chartRef.current?.setOption(
          { series: [{ id: seriesId, data: bufferRef.current }] },
          { notMerge: false, lazyUpdate: true }
        );
        setStats(computeStats(bufferRef.current, warnRef.current, critRef.current));
      });
    }, flushIntervalMs);

    return () => {
      clearInterval(timer);
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
    };
  }, [chartRef, seriesId, flushIntervalMs]);

  return {
    isLoading,
    status: isError ? 'disconnected' : status,
    stats,
    historical: historicalData,
    bufferRef,
  };
}
