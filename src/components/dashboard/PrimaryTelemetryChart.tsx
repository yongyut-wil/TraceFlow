'use client';

import { useMemo } from 'react';
import { EChartCanvas } from '@/components/charts/EChartCanvas';
import { CHART_COLORS, CHART_FONT } from '@/lib/chart-theme';
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
        lineStyle: { color: CHART_COLORS.warn },
        label: { show: true, position: 'insideStartTop' as const, formatter: `WARN ${thresholdWarning}ms`, color: CHART_COLORS.warn, fontFamily: CHART_FONT, fontSize: 9 },
      },
      thresholdCritical !== undefined && {
        yAxis: thresholdCritical,
        lineStyle: { color: CHART_COLORS.crit },
        label: { show: true, position: 'insideStartTop' as const, formatter: `CRIT ${thresholdCritical}ms`, color: CHART_COLORS.crit, fontFamily: CHART_FONT, fontSize: 9 },
      },
    ].filter((d): d is NonNullable<typeof d> => Boolean(d));

    return {
      animation: false,
      backgroundColor: 'transparent',
      grid: { top: 40, right: 40, bottom: 60, left: 60, containLabel: false },
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
        splitLine: { show: true, lineStyle: { color: CHART_COLORS.gridLine, type: 'dotted' } },
        axisLabel: { color: CHART_COLORS.textSecondary, fontFamily: CHART_FONT, fontSize: 10, formatter: '{HH}:{mm}:{ss}' },
      },
      yAxis: {
        type: 'value',
        scale: true,
        axisLine: { show: false },
        splitLine: { show: true, lineStyle: { color: CHART_COLORS.gridLine, type: 'dotted' } },
        axisLabel: { color: CHART_COLORS.textSecondary, fontFamily: CHART_FONT, fontSize: 10 },
      },
      dataZoom: [
        { type: 'inside', throttle: 50 },
        { type: 'slider', height: 20, bottom: 10, borderColor: CHART_COLORS.borderAccent, backgroundColor: CHART_COLORS.panel, fillerColor: 'rgba(255, 176, 0, 0.1)', handleStyle: { color: CHART_COLORS.accent }, textStyle: { color: CHART_COLORS.textSecondary, fontFamily: CHART_FONT, fontSize: 9 } }
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
          lineStyle: { color: CHART_COLORS.accent, width: 1.5 },
          itemStyle: { color: CHART_COLORS.accent },
          areaStyle: {
            color: {
              type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(255, 176, 0, 0.14)' },
                { offset: 1, color: 'rgba(255, 176, 0, 0)' },
              ],
            },
          },
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
          <span className="h-2 w-0.5 bg-primary" />
          <span className="font-mono text-mini font-semibold uppercase tracking-[0.08em] text-foreground">Primary Telemetry Signal</span>
          <span className="font-mono text-micro text-muted-foreground">{metric} · HISTORICAL + LIVE STREAM</span>
        </div>
        <div className="font-mono text-micro text-muted-foreground">LTTB · CANVAS · 10K PTS</div>
      </div>
      <div className="flex-1 bg-background p-2">
        <EChartCanvas initialOption={option} chartInstanceRef={chartRef} group="traceflow-group" className="h-full" />
      </div>
    </div>
  );
}
