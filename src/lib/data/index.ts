import type { DataMode, ResolvedSourceMode, TimeSeriesDataSource } from './contracts';
import { MockDataSource } from './mock-source';
import { SupabaseDataSource } from './supabase-source';

const cache = new Map<string, TimeSeriesDataSource>();

function envMode(): DataMode {
  const raw = process.env.NEXT_PUBLIC_DATA_MODE;
  return raw === 'supabase' || raw === 'mock' ? raw : 'hybrid';
}

export function getDataSource(requestedMode?: DataMode): TimeSeriesDataSource {
  const mode = requestedMode ?? envMode();

  const cached = cache.get(mode);
  if (cached) return cached;

  let ds: TimeSeriesDataSource;
  if (mode === 'mock') {
    ds = new MockDataSource();
  } else if (mode === 'supabase') {
    // Strict mode: must not silently fall back — throw a descriptive error.
    ds = new SupabaseDataSource();
  } else {
    // Hybrid: prefer Supabase, fall back to Mock when credentials are absent.
    try {
      ds = new SupabaseDataSource();
    } catch {
      ds = new MockDataSource();
    }
  }

  cache.set(mode, ds);
  return ds;
}

export function getResolvedSourceMode(requestedMode?: DataMode): ResolvedSourceMode {
  try {
    return getDataSource(requestedMode).mode;
  } catch {
    return 'error';
  }
}
