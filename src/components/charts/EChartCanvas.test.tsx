import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import type * as echartsModule from 'echarts/core';

const mocks = vi.hoisted(() => ({
  instance: {
    setOption: vi.fn(),
    resize: vi.fn(),
    dispose: vi.fn(),
    group: '',
  },
  init: vi.fn(),
  connect: vi.fn(),
}));
mocks.init.mockImplementation(() => mocks.instance);

vi.mock('@/lib/echarts-setup', () => ({
  echarts: { init: mocks.init, connect: mocks.connect },
}));

import { EChartCanvas } from './EChartCanvas';

const OPTION: echartsModule.EChartsCoreOption = { xAxis: { type: 'time' }, yAxis: { type: 'value' } };

describe('EChartCanvas lifecycle', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    mocks.init.mockImplementation(() => mocks.instance);
  });

  it('inits with canvas renderer and applies the initial option', () => {
    render(<EChartCanvas initialOption={OPTION} />);
    expect(mocks.init).toHaveBeenCalledWith(
      expect.any(HTMLDivElement),
      undefined,
      expect.objectContaining({ renderer: 'canvas', useDirtyRect: true })
    );
    expect(mocks.instance.setOption).toHaveBeenCalledWith(OPTION, { notMerge: true, lazyUpdate: true });
  });

  it('joins a connect group when provided', () => {
    render(<EChartCanvas initialOption={OPTION} group="traceflow-group" />);
    expect(mocks.connect).toHaveBeenCalledWith('traceflow-group');
  });

  it('disconnects ResizeObserver and disposes the chart on unmount', () => {
    const disconnect = vi.fn();
    class RO {
      observe() {}
      unobserve() {}
      disconnect() {
        disconnect();
      }
    }
    vi.stubGlobal('ResizeObserver', RO);

    const { unmount } = render(<EChartCanvas initialOption={OPTION} />);
    unmount();

    expect(disconnect).toHaveBeenCalledTimes(1);
    expect(mocks.instance.dispose).toHaveBeenCalledTimes(1);
  });

  it('clears the external chartInstanceRef on unmount', () => {
    const ref = { current: null as unknown };
    const { unmount } = render(<EChartCanvas initialOption={OPTION} chartInstanceRef={ref as never} />);
    expect(ref.current).not.toBeNull();
    unmount();
    expect(ref.current).toBeNull();
  });
});
