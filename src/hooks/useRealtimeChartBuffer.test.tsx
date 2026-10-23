import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRealtimeChartBuffer } from './useRealtimeChartBuffer';
import type { TimeSeriesPoint, TimeSeriesDataSource, StreamSubscriptionOptions } from '@/lib/data/contracts';
import { getDataSource } from '@/lib/data';
import type { EChartsCoreInstance } from '@/lib/echarts-setup';

// Mock the data source
vi.mock('@/lib/data', () => ({
  getDataSource: vi.fn(),
}));

describe('useRealtimeChartBuffer', () => {
  let unsubscribeMock: () => void;
  let batchCallback: (points: readonly TimeSeriesPoint[]) => void;
  let queryClient: QueryClient;

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  const makeChartRef = () =>
    ({ current: { setOption: vi.fn() } }) as unknown as React.MutableRefObject<EChartsCoreInstance | null>;

  beforeEach(() => {
    vi.useFakeTimers();
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    unsubscribeMock = vi.fn();
    vi.mocked(getDataSource).mockReturnValue({
      mode: 'mock',
      fetchHistorical: vi.fn().mockResolvedValue({
        siteId: 'test',
        metric: 'latency_ms',
        unit: 'ms',
        thresholdWarning: 85,
        thresholdCritical: 120,
        lastTimestampMs: 1000,
        points: [[1000, 50]],
      }),
      subscribeStream: vi.fn((opts: StreamSubscriptionOptions) => {
        batchCallback = opts.onBatch;
        opts.onStatusChange('connected');
        return unsubscribeMock;
      }),
    } as unknown as TimeSeriesDataSource);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
    queryClient.clear();
  });

  it('should initialize buffer and subscribe to stream', async () => {
    const chartRef = makeChartRef();
    const { result } = renderHook(
      () =>
        useRealtimeChartBuffer({
          chartRef,
          siteId: 'test',
          metric: 'latency_ms',
          range: '24h',
          from: new Date(0),
          to: new Date(1000),
          seriesId: 'primary',
          mode: 'mock',
        }),
      { wrapper }
    );

    await act(async () => {
      await Promise.resolve();
      await vi.advanceTimersByTimeAsync(10);
    });

    expect(result.current.status).toBe('connected');
    expect(result.current.bufferRef.current.length).toBe(1);
  });

  it('should evict oldest points when exceeding maxPoints', async () => {
    const chartRef = makeChartRef();
    const maxPoints = 10;

    const initialPoints: TimeSeriesPoint[] = Array.from({ length: 10 }, (_, i) => [i * 100, i]);
    vi.mocked(getDataSource).mockReturnValue({
      mode: 'mock',
      fetchHistorical: vi.fn().mockResolvedValue({
        siteId: 'test',
        metric: 'latency_ms',
        unit: 'ms',
        lastTimestampMs: 900,
        points: initialPoints,
      }),
      subscribeStream: vi.fn((opts: StreamSubscriptionOptions) => {
        batchCallback = opts.onBatch;
        return unsubscribeMock;
      }),
    } as unknown as TimeSeriesDataSource);

    const { result } = renderHook(
      () =>
        useRealtimeChartBuffer({
          chartRef,
          siteId: 'test',
          metric: 'latency_ms',
          range: '24h',
          from: new Date(0),
          to: new Date(900),
          seriesId: 'primary',
          mode: 'mock',
          maxPoints,
        }),
      { wrapper }
    );

    await act(async () => {
      await Promise.resolve();
      await vi.advanceTimersByTimeAsync(10);
    });

    const newPoints: TimeSeriesPoint[] = Array.from({ length: 5 }, (_, i) => [1000 + i * 100, i * 10]);

    await act(async () => {
      batchCallback(newPoints);
      await vi.advanceTimersByTimeAsync(10);
    });

    const finalBuffer = result.current.bufferRef.current;
    expect(finalBuffer.length).toBe(10);
    expect(finalBuffer[0][0]).toBe(500);
    expect(finalBuffer[9][0]).toBe(1400);
  });

  it('should deduplicate stale timestamps', async () => {
    const chartRef = makeChartRef();
    const { result } = renderHook(
      () =>
        useRealtimeChartBuffer({
          chartRef,
          siteId: 'test',
          metric: 'latency_ms',
          range: '24h',
          from: new Date(0),
          to: new Date(1000),
          seriesId: 'primary',
          mode: 'mock',
        }),
      { wrapper }
    );

    await act(async () => {
      await Promise.resolve();
      await vi.advanceTimersByTimeAsync(10);
    });

    const stalePoints: TimeSeriesPoint[] = [
      [900, 10],
      [1000, 20],
      [999, 30],
    ];

    await act(async () => {
      batchCallback(stalePoints);
      await vi.advanceTimersByTimeAsync(10);
    });

    expect(result.current.bufferRef.current.length).toBe(1);
  });

  it('should not subscribe while paused', async () => {
    const chartRef = makeChartRef();
    const ds = {
      mode: 'mock',
      fetchHistorical: vi.fn().mockResolvedValue({
        siteId: 'test',
        metric: 'latency_ms',
        unit: 'ms',
        lastTimestampMs: 1000,
        points: [[1000, 50]],
      }),
      subscribeStream: vi.fn((opts: StreamSubscriptionOptions) => {
        batchCallback = opts.onBatch;
        return unsubscribeMock;
      }),
    } as unknown as TimeSeriesDataSource;
    vi.mocked(getDataSource).mockReturnValue(ds);

    const { result } = renderHook(
      () =>
        useRealtimeChartBuffer({
          chartRef,
          siteId: 'test',
          metric: 'latency_ms',
          range: '24h',
          from: new Date(0),
          to: new Date(1000),
          seriesId: 'primary',
          mode: 'mock',
          paused: true,
        }),
      { wrapper }
    );

    await act(async () => {
      await Promise.resolve();
      await vi.advanceTimersByTimeAsync(10);
    });

    expect(ds.subscribeStream).not.toHaveBeenCalled();
    expect(result.current.bufferRef.current.length).toBe(1);
  });

  it('should retain only the newest points at the literal 10,000 cap', async () => {
    const chartRef = makeChartRef();
    const { result } = renderHook(
      () =>
        useRealtimeChartBuffer({
          chartRef,
          siteId: 'test',
          metric: 'latency_ms',
          range: '24h',
          from: new Date(0),
          to: new Date(1000),
          seriesId: 'primary',
          mode: 'mock',
        }),
      { wrapper }
    );

    await act(async () => {
      await Promise.resolve();
      await vi.advanceTimersByTimeAsync(10);
    });

    // Push 12,000 points into the 10,000-cap buffer (spec literal).
    const flood: TimeSeriesPoint[] = Array.from({ length: 12_000 }, (_, i) => [2000 + i, i]);
    await act(async () => {
      batchCallback(flood);
      await vi.advanceTimersByTimeAsync(10);
    });

    const buf = result.current.bufferRef.current;
    expect(buf.length).toBe(10_000);
    expect(buf[0][0]).toBe(4000); // oldest = pushed index 2000
    expect(buf[9_999][0]).toBe(13_999);
  });

  it('should flush buffer to the chart via setOption', async () => {
    const chartRef = makeChartRef();
    renderHook(
      () =>
        useRealtimeChartBuffer({
          chartRef,
          siteId: 'test',
          metric: 'latency_ms',
          range: '24h',
          from: new Date(0),
          to: new Date(1000),
          seriesId: 'primary',
          mode: 'mock',
        }),
      { wrapper }
    );

    await act(async () => {
      await Promise.resolve();
      await vi.advanceTimersByTimeAsync(10);
    });

    await act(async () => {
      batchCallback([[1100, 60]]);
      await vi.advanceTimersByTimeAsync(300);
    });

    expect(chartRef.current!.setOption).toHaveBeenCalledWith(
      expect.objectContaining({
        series: [expect.objectContaining({ id: 'primary', data: expect.any(Array) })],
      }),
      { notMerge: false, lazyUpdate: true }
    );
  });

  it('should publish throttled stats (last value + anomalies) on flush', async () => {
    const chartRef = makeChartRef();
    const { result } = renderHook(
      () =>
        useRealtimeChartBuffer({
          chartRef,
          siteId: 'test',
          metric: 'latency_ms',
          range: '24h',
          from: new Date(0),
          to: new Date(1000),
          seriesId: 'primary',
          mode: 'mock',
        }),
      { wrapper }
    );

    await act(async () => {
      await Promise.resolve();
      await vi.advanceTimersByTimeAsync(10);
    });

    await act(async () => {
      batchCallback([
        [1100, 60],
        [1200, 95],   // WARN (>= 85)
        [1300, 150],  // CRIT (>= 120)
      ]);
      // advance past the 250ms flush interval + 16ms mocked rAF
      await vi.advanceTimersByTimeAsync(300);
    });

    const { stats } = result.current;
    expect(stats.count).toBe(4);
    expect(stats.last).toBe(150);
    expect(stats.anomalies.length).toBe(2);
    expect(stats.anomalies[0].severity).toBe('CRIT');
    expect(stats.anomalies[1].severity).toBe('WARN');
  });

  it('should clear the buffer when query params change (no stale-series flash)', async () => {
    const chartRef = makeChartRef();
    let metric = 'latency_ms';
    const { result, rerender } = renderHook(
      () =>
        useRealtimeChartBuffer({
          chartRef,
          siteId: 'test',
          metric,
          range: '24h',
          from: new Date(0),
          to: new Date(1000),
          seriesId: 'primary',
          mode: 'mock',
        }),
      { wrapper }
    );

    await act(async () => {
      await Promise.resolve();
      await vi.advanceTimersByTimeAsync(10);
    });
    expect(result.current.bufferRef.current.length).toBe(1);

    // While the new query is pending, data is undefined → buffer must drop
    // so the old metric's trace can't linger on the chart.
    metric = 'throughput_rps';
    rerender();
    expect(result.current.bufferRef.current.length).toBe(0);
  });

  it('should clamp a crafted from>to window to an empty range', async () => {
    const chartRef = makeChartRef();
    const fetchHistorical = vi.fn().mockResolvedValue({
      siteId: 'test',
      metric: 'latency_ms',
      unit: 'ms',
      lastTimestampMs: 1000,
      points: [],
    });
    vi.mocked(getDataSource).mockReturnValue({
      mode: 'mock',
      fetchHistorical,
      subscribeStream: vi.fn(() => unsubscribeMock),
    } as unknown as TimeSeriesDataSource);

    renderHook(
      () =>
        useRealtimeChartBuffer({
          chartRef,
          siteId: 'test',
          metric: 'latency_ms',
          range: 'custom',
          from: new Date(5000),
          to: new Date(1000), // inverted window
          seriesId: 'primary',
          mode: 'mock',
        }),
      { wrapper }
    );

    await act(async () => {
      await Promise.resolve();
      await vi.advanceTimersByTimeAsync(10);
    });

    expect(fetchHistorical).toHaveBeenCalledWith(
      expect.objectContaining({ fromMs: 1000, toMs: 1000 }),
      expect.anything()
    );
  });
});
