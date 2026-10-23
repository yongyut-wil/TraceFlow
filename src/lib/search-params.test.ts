import { describe, it, expect } from 'vitest';
import { dashboardSearchParams } from './search-params';

describe('dashboardSearchParams parsers', () => {
  it('rejects an unknown metric → falls back to the default', () => {
    expect(dashboardSearchParams.metric.parse('latency_ms')).toBe('latency_ms');
    expect(dashboardSearchParams.metric.parse('bogus')).toBeNull();
    expect(dashboardSearchParams.metric.withDefault).toBeTruthy;
    expect(dashboardSearchParams.metric.defaultValue).toBe('latency_ms');
  });

  it('rejects unknown range/mode/compare literals', () => {
    expect(dashboardSearchParams.range.parse('7d')).toBe('7d');
    expect(dashboardSearchParams.range.parse('999y')).toBeNull();
    expect(dashboardSearchParams.mode.parse('hybrid')).toBe('hybrid');
    expect(dashboardSearchParams.mode.parse('evil')).toBeNull();
    expect(dashboardSearchParams.compare.parse('none')).toBe('none');
    expect(dashboardSearchParams.compare.parse('bogus')).toBeNull();
  });

  it('accepts free-form siteId (nodes are a dynamic set)', () => {
    expect(dashboardSearchParams.siteId.parse('node-anything-99')).toBe('node-anything-99');
  });
});
