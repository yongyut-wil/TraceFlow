'use client';

import { useMemo } from 'react';
import { EChartCanvas } from '@/components/charts/EChartCanvas';
import { CHART_COLORS, CHART_FONT } from '@/lib/chart-theme';
import type { EChartsCoreInstance } from '@/lib/echarts-setup';
import type { EChartsCoreOption } from 'echarts/core';
import type { ConnectionStatus } from '@/lib/data/contracts';

interface SyncedCorrelationChartProps {
  chartRef: React.MutableRefObject<EChartsCoreInstance | null>;
  metric: string;
  status: ConnectionStatus;
}

export function SyncedCorrelationChart({ chartRef, metric, status }: SyncedCorrelationChartProps) {
  // Memoize: a new option object each render would make EChartCanvas re-setOption
  // and wipe the imperatively-streamed series data.
  const option = useMemo<EChartsCoreOption>(() => ({
    animation: false,
    backgroundColor: 'transparent',
    grid: { top: 30, right: 20, bottom: 40, left: 60, containLabel: false },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross', label: { backgroundColor: CHART_COLORS.panel3, color: CHART_COLORS.textPrimary, fontFamily: CHART_FONT, fontSize: 10 } },
      backgroundColor: CHART_COLORS.panel2,
      borderColor: CHART_COLORS.borderAccent,
      textStyle: { color: CHART_COLORS.textPrimary, fontFamily: CHART_FONT, fontSize: 10 },
    },
    xAxis: {
      type: 'time',
      axisLine: { lineStyle: { color: CHART_COLORS.border } },
      splitLine: { show: false },
      axisLabel: { color: CHART_COLORS.textSecondary, fontFamily: CHART_FONT, fontSize: 10, formatter: '{HH}:{mm}' },
    },
    yAxis: {
      type: 'value',
      scale: true,
      axisLine: { show: false },
      splitLine: { show: true, lineStyle: { color: CHART_COLORS.gridLine, type: 'dotted' } },
      axisLabel: { color: CHART_COLORS.textSecondary, fontFamily: CHART_FONT, fontSize: 10 },
    },
    series: [
      {
        id: 'secondary',
        type: 'line',
        showSymbol: false,
        sampling: 'lttb',
        large: true,
        largeThreshold: 2000,
        progressive: 4000,
        progressiveThreshold: 10000,
        animation: false,
        lineStyle: { color: CHART_COLORS.secondary, width: 1.2 },
        itemStyle: { color: CHART_COLORS.secondary },
        areaStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(129, 140, 248, 0.18)' },
              { offset: 1, color: 'rgba(129, 140, 248, 0)' },
            ],
          },
        },
        data: [],
      },
    ],
  }), []);

  return (
    <div className="flex h-[250px] flex-col border-r border-border bg-card shrink-0">
      <div className="flex h-8 items-center justify-between border-b border-border bg-muted/30 px-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-0.5 bg-secondary" />
          <span className="font-mono text-mini font-semibold uppercase tracking-[0.08em] text-foreground">Correlation Chart</span>
          <span className="font-mono text-micro text-muted-foreground">{metric} · SYNCED CROSSHAIR</span>
        </div>
        <div className="font-mono text-micro uppercase text-muted-foreground">{status}</div>
      </div>
      <div className="flex-1 bg-background p-2">
        <EChartCanvas initialOption={option} chartInstanceRef={chartRef} group="traceflow-group" className="h-full" />
      </div>
    </div>
  );
}
