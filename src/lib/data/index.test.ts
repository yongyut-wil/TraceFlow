import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// getDataSource caches instances module-wide, so each test re-imports fresh.
const importFactory = async () => {
  vi.resetModules();
  return import('./index');
};

describe('getDataSource factory resolution', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("resolves 'mock' to MockDataSource", async () => {
    const { getDataSource } = await importFactory();
    const ds = getDataSource('mock');
    expect(ds.mode).toBe('mock');
  });

  it("resolves 'supabase' strictly and throws without credentials", async () => {
    const { getDataSource, getResolvedSourceMode } = await importFactory();
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    expect(() => getDataSource('supabase')).toThrow(/NEXT_PUBLIC_SUPABASE_URL/);
    expect(getResolvedSourceMode('supabase')).toBe('error');
  });

  it("resolves 'supabase' when credentials are present", async () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'http://localhost:54321');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'test-anon-key');
    const { getDataSource } = await importFactory();
    const ds = getDataSource('supabase');
    expect(ds.mode).toBe('supabase');
  });

  it("resolves 'hybrid' to MockDataSource when credentials are absent", async () => {
    const { getDataSource, getResolvedSourceMode } = await importFactory();
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const ds = getDataSource('hybrid');
    expect(ds.mode).toBe('mock');
    expect(getResolvedSourceMode('hybrid')).toBe('mock');
  });

  it("resolves 'hybrid' to SupabaseDataSource when credentials are present", async () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'http://localhost:54321');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'test-anon-key');
    const { getDataSource } = await importFactory();
    expect(getDataSource('hybrid').mode).toBe('supabase');
  });

  it('falls back to env NEXT_PUBLIC_DATA_MODE when no mode is requested', async () => {
    vi.stubEnv('NEXT_PUBLIC_DATA_MODE', 'mock');
    const { getDataSource } = await importFactory();
    expect(getDataSource().mode).toBe('mock');
  });
});
