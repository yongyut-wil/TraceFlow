'use client';

import { useMemo, useRef, useState } from 'react';
import { useQueryStates } from 'nuqs';
import { dashboardSearchParams } from '@/lib/search-params';
import { useRealtimeChartBuffer } from '@/hooks/useRealtimeChartBuffer';
import { getResolvedSourceMode } from '@/lib/data';
import { HeaderFilterBar } from './HeaderFilterBar';
import { KpiCards } from './KpiCards';
import { PrimaryTelemetryChart } from './PrimaryTelemetryChart';
import { SyncedCorrelationChart } from './SyncedCorrelationChart';
import { AnomalyStreamTable } from './AnomalyStreamTable';
import type { EChartsCoreInstance } from '@/lib/echarts-setup';

export function DashboardContent() {
  const primaryChartRef = useRef<EChartsCoreInstance | null>(null);
  const correlationChartRef = useRef<EChartsCoreInstance | null>(null);
  const [params] = useQueryStates(dashboardSearchParams);
  const [isPaused, setIsPaused] = useState(false);

  const sourceMode = useMemo(() => getResolvedSourceMode(params.mode), [params.mode]);

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

  const correlation = useRealtimeChartBuffer({
    chartRef: correlationChartRef,
    siteId: params.siteId,
    metric: params.compare,
    range: params.range,
    from: params.from,
    to: params.to,
    seriesId: 'secondary',
    mode: params.mode,
    paused: isPaused,
    maxPoints: 10_000,
    flushIntervalMs: 250,
  });

  return (
    <>
      <HeaderFilterBar
        status={primary.status}
        sourceMode={sourceMode}
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

        <div className="grid shrink-0 grid-cols-2">
          <SyncedCorrelationChart
            chartRef={correlationChartRef}
            metric={params.compare}
            status={correlation.status}
          />
          <AnomalyStreamTable
            anomalies={primary.stats.anomalies}
            siteId={params.siteId}
            unit={primary.historical?.unit ?? ''}
          />
        </div>
      </div>
    </>
  );
}
