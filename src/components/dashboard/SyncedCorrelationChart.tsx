'use client';

import { useMemo } from 'react';
import { EChartCanvas } from '@/components/charts/EChartCanvas';
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
      axisPointer: { type: 'cross', label: { backgroundColor: '#1A2438', color: '#F8FAFC', fontFamily: 'JetBrains Mono', fontSize: 10 } },
      backgroundColor: '#121A2A',
      borderColor: '#334155',
      textStyle: { color: '#F8FAFC', fontFamily: 'JetBrains Mono', fontSize: 10 },
    },
    xAxis: {
      type: 'time',
      axisLine: { lineStyle: { color: '#1E293B' } },
      splitLine: { show: false },
      axisLabel: { color: '#94A3B8', fontFamily: 'JetBrains Mono', fontSize: 10, formatter: '{HH}:{mm}' },
    },
    yAxis: {
      type: 'value',
      scale: true,
      axisLine: { show: false },
      splitLine: { show: true, lineStyle: { color: '#1E293B', type: 'dotted' } },
      axisLabel: { color: '#94A3B8', fontFamily: 'JetBrains Mono', fontSize: 10 },
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
        lineStyle: { color: '#818CF8', width: 1.2 },
        itemStyle: { color: '#818CF8' },
        areaStyle: { color: 'rgba(129, 140, 248, 0.08)' },
        data: [],
      },
    ],
  }), []);

  return (
    <div className="flex h-[250px] flex-col border-r border-border bg-card shrink-0">
      <div className="flex h-8 items-center justify-between border-b border-border bg-muted/30 px-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-foreground">Correlation Chart</span>
          <span className="font-mono text-[9px] text-muted-foreground">{metric} · SYNCED CROSSHAIR</span>
        </div>
        <div className="font-mono text-[9px] uppercase text-muted-foreground">{status}</div>
      </div>
      <div className="flex-1 bg-background p-2">
        <EChartCanvas initialOption={option} chartInstanceRef={chartRef} group="traceflow-group" className="h-full" />
      </div>
    </div>
  );
}
