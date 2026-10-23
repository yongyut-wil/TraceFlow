import {
  parseAsString,
  parseAsStringLiteral,
  parseAsIsoDateTime,
} from 'nuqs';

import { METRIC_DEFS } from '@/lib/data/metrics';

export const TIME_RANGES = ['1h', '6h', '24h', '7d', 'custom'] as const;
export const DATA_MODES = ['hybrid', 'supabase', 'mock'] as const;
export const METRICS = Object.values(METRIC_DEFS);
export const COMPARE_OPTIONS = [...METRICS.map((m) => m.id), 'none'] as const;

export const dashboardSearchParams = {
  siteId: parseAsString.withDefault('node-us-east-01'),
  metric: parseAsStringLiteral(METRICS.map((m) => m.id)).withDefault('latency_ms'),
  compare: parseAsStringLiteral(COMPARE_OPTIONS).withDefault('throughput_rps'),
  range: parseAsStringLiteral(TIME_RANGES).withDefault('24h'),
  from: parseAsIsoDateTime,
  to: parseAsIsoDateTime,
  mode: parseAsStringLiteral(DATA_MODES).withDefault('hybrid'),
};
