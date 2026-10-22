import {
  parseAsString,
  parseAsStringLiteral,
  parseAsIsoDateTime,
} from 'nuqs';

export const TIME_RANGES = ['1h', '6h', '24h', '7d', 'custom'] as const;
export const DATA_MODES = ['hybrid', 'supabase', 'mock'] as const;
export const METRICS = [
  { id: 'latency_ms', label: 'P99 Latency (ms)' },
  { id: 'throughput_rps', label: 'Throughput (req/s)' },
] as const;

export const dashboardSearchParams = {
  siteId: parseAsString.withDefault('node-us-east-01'),
  metric: parseAsString.withDefault('latency_ms'),
  compare: parseAsString.withDefault('throughput_rps'),
  range: parseAsStringLiteral(TIME_RANGES).withDefault('24h'),
  from: parseAsIsoDateTime,
  to: parseAsIsoDateTime,
  mode: parseAsStringLiteral(DATA_MODES).withDefault('hybrid'),
};
