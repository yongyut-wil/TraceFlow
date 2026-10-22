'use client';

import { useMemo } from 'react';
import { EChartCanvas } from '@/components/charts/EChartCanvas';
import type { EChartsCoreInstance } from '@/lib/echarts-setup';
import type { EChartsCoreOption } from 'echarts/core';

interface PrimaryTelemetryChartProps {
  chartRef: React.MutableRefObject<EChartsCoreInstance | null>;
  metric: string;
  thresholdWarning?: number;
  thresholdCritical?: number;
}

export function PrimaryTelemetryChart({ chartRef, metric, thresholdWarning, thresholdCritical }: PrimaryTelemetryChartProps) {
  const option = useMemo<EChartsCoreOption>(() => {
    const markLineData = [
      thresholdWarning !== undefined && {
        yAxis: thresholdWarning,
        lineStyle: { color: '#F59E0B' },
        label: { show: true, position: 'insideEndTop' as const, formatter: `WARN ${thresholdWarning}ms`, color: '#F59E0B', fontFamily: 'JetBrains Mono', fontSize: 9 },
      },
      thresholdCritical !== undefined && {
        yAxis: thresholdCritical,
        lineStyle: { color: '#F43F5E' },
        label: { show: true, position: 'insideEndTop' as const, formatter: `CRIT ${thresholdCritical}ms`, color: '#F43F5E', fontFamily: 'JetBrains Mono', fontSize: 9 },
      },
    ].filter((d): d is NonNullable<typeof d> => Boolean(d));

    return {
      animation: false,
      backgroundColor: 'transparent',
      grid: { top: 40, right: 40, bottom: 60, left: 60, containLabel: false },
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
        splitLine: { show: true, lineStyle: { color: '#1E293B', type: 'dotted' } },
        axisLabel: { color: '#94A3B8', fontFamily: 'JetBrains Mono', fontSize: 10, formatter: '{HH}:{mm}:{ss}' },
      },
      yAxis: {
        type: 'value',
        scale: true,
        axisLine: { show: false },
        splitLine: { show: true, lineStyle: { color: '#1E293B', type: 'dotted' } },
        axisLabel: { color: '#94A3B8', fontFamily: 'JetBrains Mono', fontSize: 10 },
      },
      dataZoom: [
        { type: 'inside', throttle: 50 },
        { type: 'slider', height: 20, bottom: 10, borderColor: '#334155', backgroundColor: '#0D131F', fillerColor: 'rgba(0, 229, 255, 0.1)', handleStyle: { color: '#00E5FF' }, textStyle: { color: '#94A3B8', fontFamily: 'JetBrains Mono', fontSize: 9 } }
      ],
      series: [
        {
          id: 'primary',
          type: 'line',
          showSymbol: false,
          sampling: 'lttb',
          large: true,
          largeThreshold: 2000,
          progressive: 4000,
          progressiveThreshold: 10000,
          animation: false,
          lineStyle: { color: '#00E5FF', width: 1.5 },
          itemStyle: { color: '#00E5FF' },
          ...(markLineData.length > 0 && {
            markLine: {
              silent: true,
              symbol: 'none',
              lineStyle: { type: 'dashed' as const, width: 1 },
              data: markLineData,
            },
          }),
        },
      ],
    };
  }, [thresholdWarning, thresholdCritical]);

  return (
    <div className="flex h-[400px] flex-col border-b border-border bg-card shrink-0">
      <div className="flex h-8 items-center justify-between border-b border-border bg-muted/30 px-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-foreground">Primary Telemetry Signal</span>
          <span className="font-mono text-[9px] text-muted-foreground">{metric} · HISTORICAL + LIVE STREAM</span>
        </div>
        <div className="font-mono text-[9px] text-muted-foreground">LTTB · CANVAS · 10K PTS</div>
      </div>
      <div className="flex-1 bg-background p-2">
        <EChartCanvas initialOption={option} chartInstanceRef={chartRef} group="traceflow-group" className="h-full" />
      </div>
    </div>
  );
}
