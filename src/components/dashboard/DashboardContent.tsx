'use client';

import { useCallback, useRef, useState } from 'react';
import { useQueryStates } from 'nuqs';
import { dashboardSearchParams } from '@/lib/search-params';
import { useRealtimeChartBuffer } from '@/hooks/useRealtimeChartBuffer';
import { HeaderFilterBar } from './HeaderFilterBar';
import { KpiCards } from './KpiCards';
import { PrimaryTelemetryChart } from './PrimaryTelemetryChart';
import { SyncedCorrelationChart } from './SyncedCorrelationChart';
import { AnomalyStreamTable } from './AnomalyStreamTable';
import { StatusBar } from './StatusBar';
import type { EChartsCoreInstance } from '@/lib/echarts-setup';

const INSPECT_WINDOW_MS = 120_000;

export function DashboardContent() {
  const primaryChartRef = useRef<EChartsCoreInstance | null>(null);
  const correlationChartRef = useRef<EChartsCoreInstance | null>(null);
  const [params] = useQueryStates(dashboardSearchParams);
  const [isPaused, setIsPaused] = useState(false);

  const primary = useRealtimeChartBuffer({
    chartRef: primaryChartRef,
    siteId: params.siteId,
    metric: params.metric,
    range: params.range,
    from: params.from,
    to: params.to,
    seriesId: 'primary',
    mode: params.mode,
    paused: isPaused,
    maxPoints: 10_000,
    flushIntervalMs: 250,
  });

  // A compare metric equal to the primary (or 'none') disables the
  // correlation chart instead of rendering a duplicate.
  const compareMetric =
    params.compare !== 'none' && params.compare !== params.metric ? params.compare : null;

  const correlation = useRealtimeChartBuffer({
    chartRef: correlationChartRef,
    siteId: params.siteId,
    metric: compareMetric ?? 'throughput_rps',
    range: params.range,
    from: params.from,
    to: params.to,
    seriesId: 'secondary',
    mode: params.mode,
    paused: isPaused,
    enabled: compareMetric !== null,
    maxPoints: 10_000,
    flushIntervalMs: 250,
  });

  const inspectAnomaly = useCallback((timestampMs: number) => {
    primaryChartRef.current?.dispatchAction({
      type: 'dataZoom',
      startValue: timestampMs - INSPECT_WINDOW_MS,
      endValue: timestampMs + INSPECT_WINDOW_MS,
    });
  }, []);

  return (
    <>
      <HeaderFilterBar
        status={primary.status}
        sourceMode={primary.sourceMode}
        isPaused={isPaused}
        onTogglePause={() => setIsPaused((p) => !p)}
        bufferInfo={`${primary.stats.count.toLocaleString()} / 10,000 pts`}
      />

      <div className="flex flex-1 flex-col overflow-y-auto">
        <KpiCards
          stats={primary.stats}
          unit={primary.historical?.unit ?? ''}
          isLoading={primary.isLoading}
        />

        <PrimaryTelemetryChart
          chartRef={primaryChartRef}
          metric={params.metric}
          thresholdWarning={primary.historical?.thresholdWarning}
          thresholdCritical={primary.historical?.thresholdCritical}
        />

        <div className={`grid shrink-0 ${compareMetric ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
          {compareMetric && (
            <SyncedCorrelationChart
              chartRef={correlationChartRef}
              metric={compareMetric}
              status={correlation.status}
            />
          )}
          <AnomalyStreamTable
            anomalies={primary.stats.anomalies}
            siteId={params.siteId}
            unit={primary.historical?.unit ?? ''}
            status={primary.status}
            onInspect={inspectAnomaly}
          />
        </div>
      </div>

      <StatusBar siteId={params.siteId} status={primary.status} points={primary.stats.count} />
    </>
  );
}
