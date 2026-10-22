import { describe, it, expect } from 'vitest';
import {
  TimeSeriesPointSchema,
  HistoricalResponseSchema,
  StreamBatchPayloadSchema,
} from './contracts';

describe('TimeSeriesPointSchema', () => {
  it('accepts a [timestampMs, value] tuple', () => {
    const parsed = TimeSeriesPointSchema.parse([1700000000000, 42.5]);
    expect(parsed[0]).toBe(1700000000000);
    expect(parsed[1]).toBe(42.5);
  });

  it('rejects malformed points', () => {
    expect(TimeSeriesPointSchema.safeParse([1700000000000]).success).toBe(false);
    expect(TimeSeriesPointSchema.safeParse([1700000000000, 'x']).success).toBe(false);
    expect(TimeSeriesPointSchema.safeParse('not-a-tuple').success).toBe(false);
    expect(TimeSeriesPointSchema.safeParse([1, 2, 3]).success).toBe(false);
  });
});

describe('HistoricalResponseSchema', () => {
  it('accepts a valid snapshot', () => {
    const parsed = HistoricalResponseSchema.parse({
      siteId: 'node-us-east-01',
      metric: 'latency_ms',
      unit: 'ms',
      thresholdWarning: 85,
      thresholdCritical: 120,
      lastTimestampMs: 1700000000000,
      points: [[1, 2], [3, 4]],
    });
    expect(parsed.points).toHaveLength(2);
  });

  it('accepts missing optional thresholds', () => {
    const parsed = HistoricalResponseSchema.parse({
      siteId: 's', metric: 'm', unit: 'u', lastTimestampMs: 0, points: [],
    });
    expect(parsed.thresholdWarning).toBeUndefined();
  });

  it('rejects payloads without points', () => {
    expect(
      HistoricalResponseSchema.safeParse({ siteId: 's', metric: 'm', unit: 'u', lastTimestampMs: 0 }).success
    ).toBe(false);
  });
});

describe('StreamBatchPayloadSchema', () => {
  it('accepts a valid batch', () => {
    expect(
      StreamBatchPayloadSchema.safeParse({
        siteId: 's', metric: 'm', sequenceId: 7, points: [[1, 2]],
      }).success
    ).toBe(true);
  });

  it('rejects malformed broadcast payloads', () => {
    expect(StreamBatchPayloadSchema.safeParse(null).success).toBe(false);
    expect(StreamBatchPayloadSchema.safeParse({ points: 'x' }).success).toBe(false);
    expect(
      StreamBatchPayloadSchema.safeParse({ siteId: 's', metric: 'm', points: [['a', 'b']] }).success
    ).toBe(false);
  });
});
