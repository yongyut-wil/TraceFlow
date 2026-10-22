---
name: echarts-performance
description: High-performance Apache ECharts (echarts/core + CanvasRenderer) patterns, LTTB downsampling for 10k+ points, ResizeObserver lifecycle, and useRef ring-buffer with requestAnimationFrame flushing.
allowed-tools:
  - read
  - edit
  - grep
  - glob
triggers:
  - user
  - model
---

# Apache ECharts High-Performance & Real-Time Streaming Skill

Use this skill whenever creating, updating, or reviewing chart components, time-series visualizations, or real-time streaming hooks in **TraceFlow**.

## 1. Modular Tree-Shakable ECharts Registration

Never import the entire `echarts` bundle. Always register only the required modules and force `CanvasRenderer`:

```ts
// src/lib/echarts-setup.ts
import * as echarts from 'echarts/core';
import { LineChart, BarChart, CustomChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  DataZoomComponent,
  DatasetComponent,
  LegendComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { UniversalTransition } from 'echarts/features';

echarts.use([
  LineChart,
  BarChart,
  CustomChart,
  GridComponent,
  TooltipComponent,
  DataZoomComponent,
  DatasetComponent,
  LegendComponent,
  UniversalTransition,
  CanvasRenderer,
]);

export { echarts };
export type EChartsCoreInstance = echarts.ECharts;
```

## 2. Base `<EChartCanvas />` Component Pattern

Every chart must manage its lifecycle (`ResizeObserver` + `chart.dispose()`) and expose an imperative `chartRef` so streaming hooks can push data without triggering React re-renders:

```tsx
'use client';

import { useEffect, useRef, type MutableRefObject } from 'react';
import { echarts, type EChartsCoreInstance } from '@/lib/echarts-setup';
import type { EChartsCoreOption } from 'echarts/core';

interface EChartCanvasProps {
  initialOption: EChartsCoreOption;
  chartInstanceRef?: MutableRefObject<EChartsCoreInstance | null>;
  className?: string;
}

export function EChartCanvas({
  initialOption,
  chartInstanceRef,
  className = 'h-80 w-full',
}: EChartCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const internalChartRef = useRef<EChartsCoreInstance | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const instance = echarts.init(el, undefined, {
      renderer: 'canvas',
      useDirtyRect: true,
    });
    internalChartRef.current = instance;
    if (chartInstanceRef) chartInstanceRef.current = instance;

    instance.setOption(initialOption, { notMerge: true, lazyUpdate: true });

    const observer = new ResizeObserver(() => {
      instance.resize({ animation: { duration: 0 } });
    });
    observer.observe(el);

    return () => {
      observer.disconnect();
      if (chartInstanceRef) chartInstanceRef.current = null;
      internalChartRef.current = null;
      instance.dispose();
    };
  }, []);

  useEffect(() => {
    internalChartRef.current?.setOption(initialOption, {
      notMerge: false,
      lazyUpdate: true,
    });
  }, [initialOption]);

  return <div ref={containerRef} className={className} />;
}
```

## 3. Fixed-Capacity Ring Buffer + `requestAnimationFrame` Flush Hook

To prevent memory leaks and React re-render thrashing on high-frequency streams:

1. Keep the sliding window in a `useRef<TimeSeriesPoint[]>` capped at `maxPoints` (default `10_000`).
2. Deduplicate incoming points using `lastTimestampRef` (`point[0] > lastTimestampRef.current`).
3. Mark a dirty flag (`isDirtyRef.current = true`) on message arrival.
4. On a fixed throttle interval (`flushIntervalMs = 250`), schedule a `requestAnimationFrame` that calls `chartInstance.setOption({ series: [{ id: seriesId, data: bufferRef.current }] }, { notMerge: false, lazyUpdate: true })`.

```ts
// src/hooks/useRealtimeChartBuffer.ts
import { useCallback, useEffect, useRef, type MutableRefObject } from 'react';
import type { EChartsCoreInstance } from '@/lib/echarts-setup';

export type TimeSeriesPoint = readonly [timestampMs: number, value: number];

interface UseRealtimeChartBufferOptions {
  chartRef: MutableRefObject<EChartsCoreInstance | null>;
  seriesId: string;
  initialData: readonly TimeSeriesPoint[];
  maxPoints?: number;
  flushIntervalMs?: number;
}

export function useRealtimeChartBuffer({
  chartRef,
  seriesId,
  initialData,
  maxPoints = 10_000,
  flushIntervalMs = 250,
}: UseRealtimeChartBufferOptions) {
  const bufferRef = useRef<TimeSeriesPoint[]>([]);
  const lastTimestampRef = useRef<number>(0);
  const isDirtyRef = useRef<boolean>(false);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    const trimmed =
      initialData.length > maxPoints
        ? initialData.slice(initialData.length - maxPoints)
        : [...initialData];
    bufferRef.current = trimmed;
    lastTimestampRef.current =
      trimmed.length > 0 ? trimmed[trimmed.length - 1][0] : 0;
    isDirtyRef.current = true;
  }, [initialData, maxPoints]);

  const pushPoints = useCallback(
    (incoming: readonly TimeSeriesPoint[]) => {
      let added = false;
      const buf = bufferRef.current;
      for (let i = 0; i < incoming.length; i++) {
        const pt = incoming[i];
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
    [maxPoints]
  );

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isDirtyRef.current || !chartRef.current) return;
      isDirtyRef.current = false;

      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = requestAnimationFrame(() => {
        chartRef.current?.setOption(
          {
            series: [
              {
                id: seriesId,
                data: bufferRef.current,
              },
            ],
          },
          { notMerge: false, lazyUpdate: true }
        );
      });
    }, flushIntervalMs);

    return () => {
      clearInterval(timer);
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
    };
  }, [chartRef, seriesId, flushIntervalMs]);

  return { pushPoints, bufferRef };
}
```

## 4. Mandatory Series Options for 10k+ Points

Always include these properties on high-density line series:

```ts
{
  id: 'telemetry-series',
  type: 'line',
  showSymbol: false,
  sampling: 'lttb',
  large: true,
  largeThreshold: 2000,
  progressive: 4000,
  progressiveThreshold: 10000,
  animation: false,
  encode: { x: 0, y: 1 },
}
```
