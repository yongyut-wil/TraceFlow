'use client';

import { useEffect, useRef, type MutableRefObject } from 'react';
import { echarts, type EChartsCoreInstance } from '@/lib/echarts-setup';
import type { EChartsCoreOption } from 'echarts/core';
import { cn } from '@/lib/utils';

interface EChartCanvasProps {
  initialOption: EChartsCoreOption;
  chartInstanceRef?: MutableRefObject<EChartsCoreInstance | null>;
  group?: string;
  className?: string;
}

export function EChartCanvas({
  initialOption,
  chartInstanceRef,
  group,
  className,
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
    
    if (group) {
      instance.group = group;
      echarts.connect(group);
    }

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    internalChartRef.current?.setOption(initialOption, {
      notMerge: false,
      lazyUpdate: true,
    });
  }, [initialOption]);

  return <div ref={containerRef} className={cn('h-full w-full min-h-[300px]', className)} />;
}
