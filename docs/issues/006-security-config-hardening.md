# ISSUE-006 — Security/config hardening

**Severity:** Low · **Type:** chore(security)

## Problem

1. `next.config.ts` sets no security headers (CSP, frame-ancestors,
   Referrer-Policy, nosniff).
2. `shadcn` is a runtime dependency — only needed at build time for the
   `shadcn/tailwind.css` import → belongs in `devDependencies`.
3. `siteId`/`metric` (free URL strings) interpolate into the Supabase channel
   name unsanitized.
4. Skill spec says `SupabaseDataSource` uses the `@supabase/ssr` client;
   implementation uses `createClient` from `supabase-js` directly
   (works without auth, but deviates from spec).

## Fix

- `headers()` in `next.config.ts`: `X-Content-Type-Options: nosniff`,
  `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`,
  and a CSP allowing `self` + Supabase endpoints (`connect-src` includes
  `*.supabase.co`, `wss://*.supabase.co`).
- `pnpm remove shadcn` + `pnpm add -D shadcn` (keep version pinned).
- Sanitize channel-name segments: `[^a-zA-Z0-9_-]` → `_`.
- `createBrowserClient` from `@supabase/ssr`.

## Acceptance criteria

- `curl -I localhost:3000` shows the headers; app still runs; deps move to
  devDependencies without breaking the CSS import.
