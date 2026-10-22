export interface MetricDef {
  id: string;
  label: string;
  unit: string;
  warn?: number;
  crit?: number;
}

export const METRIC_DEFS: Record<string, MetricDef> = {
  latency_ms: { id: 'latency_ms', label: 'P99 Latency (ms)', unit: 'ms', warn: 85, crit: 120 },
  throughput_rps: { id: 'throughput_rps', label: 'Throughput (req/s)', unit: 'req/s' },
};

export function getMetricDef(metric: string): MetricDef {
  const def = METRIC_DEFS[metric];
  if (def) return def;
  // Fallback heuristic for unknown metric ids — no thresholds, generic unit.
  if (metric.includes('latency')) {
    return { id: metric, label: metric, unit: 'ms', warn: 85, crit: 120 };
  }
  return { id: metric, label: metric, unit: 'units' };
}
