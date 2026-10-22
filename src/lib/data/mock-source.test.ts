import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MockDataSource } from './mock-source';

const PARAMS = {
  siteId: 'node-us-east-01',
  metric: 'latency_ms',
  fromMs: 1_700_000_000_000,
  toMs: 1_700_086_400_000, // +24h
};

describe('MockDataSource.fetchHistorical', () => {
  it('generates a deterministic 10k-point window', async () => {
    const ds = new MockDataSource();
    const [a, b] = await Promise.all([ds.fetchHistorical(PARAMS), ds.fetchHistorical(PARAMS)]);

    expect(a.points).toHaveLength(10_000);
    expect(a.points).toEqual(b.points); // deterministic for identical params
    expect(a.unit).toBe('ms');
    expect(a.thresholdWarning).toBe(85);
    expect(a.thresholdCritical).toBe(120);
  });

  it('is deterministic per siteId and varies by site', async () => {
    const ds = new MockDataSource();
    const a = await ds.fetchHistorical(PARAMS);
    const c = await ds.fetchHistorical({ ...PARAMS, siteId: 'node-eu-west-02' });
    expect(a.points).not.toEqual(c.points);
  });

  it('honors AbortSignal', async () => {
    const ds = new MockDataSource();
    const ctrl = new AbortController();
    const p = ds.fetchHistorical(PARAMS, ctrl.signal);
    ctrl.abort();
    await expect(p).rejects.toThrow();
  });
});

describe('MockDataSource.subscribeStream', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('emits batches anchored to wall-clock time', () => {
    const ds = new MockDataSource();
    const batches: number[][] = [];
    vi.setSystemTime(1_800_000_000_000);

    ds.subscribeStream({
      siteId: 's', metric: 'latency_ms',
      afterTimestampMs: 1_800_000_000_000,
      onBatch: (pts) => batches.push(pts.map((p) => p[0])),
      onStatusChange: () => {},
    });

    vi.advanceTimersByTime(500);
    const all = batches.flat();
    expect(all.length).toBeGreaterThan(0);
    // Newest point tracks Date.now(), not an accelerated counter.
    expect(Math.abs(all[all.length - 1] - Date.now())).toBeLessThan(200);
    // Monotonically increasing.
    for (let i = 1; i < all.length; i++) expect(all[i]).toBeGreaterThan(all[i - 1]);
  });

  it('reports status transitions and cleans up on unsubscribe', () => {
    const ds = new MockDataSource();
    const statuses: string[] = [];
    const unsub = ds.subscribeStream({
      siteId: 's', metric: 'latency_ms', afterTimestampMs: 0,
      onBatch: () => {},
      onStatusChange: (s) => statuses.push(s),
    });
    expect(statuses).toContain('connecting');
    vi.advanceTimersByTime(500);
    expect(statuses).toContain('connected');
    unsub();
    expect(statuses).toContain('disconnected');
  });
});
