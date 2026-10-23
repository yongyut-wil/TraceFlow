# ISSUE-018 — GitHub Actions CI workflow

**Status:** DONE
**Severity:** Low (process gap, not a defect)
**Found in:** Repo sweep follow-up — `master` is required to pass
lint/typecheck/vitest/playwright/build per `docs/BRANCHING.md`, but nothing
enforced it remotely. Contributors could push a broken `master` unnoticed.

## Fix

`.github/workflows/ci.yml` — runs on every push to `master` and every PR:

`pnpm install --frozen-lockfile` → lint → typecheck → vitest → build →
playwright (chromium) e2e via the config's own `webServer`.

Node 22 + pnpm 11.24.0 pinned to match local toolchain.

### Follow-ups after first runs

- **Browser cache** — `actions/cache` on `~/.cache/ms-playwright` keyed by
  the lockfile; `install-deps` (apt, required every run) is split from
  `install` (binaries, skipped on cache hit). Without it the download added
  minutes on cold runners.
- **Production e2e server** — `webServer.command` is `pnpm run start` on CI,
  `pnpm run dev` locally. `next dev` intermittently stalled resolving
  `next/font/google` in the Turbopack font replacer on a runner (stale
  `.next` cache from the preceding build step is the likely trigger);
  serving the verified build output removes that failure mode entirely.

## Verified

Runs green on GitHub: first run 1m27s, cache-enabled runs ~1m22s–1m28s
(12 e2e tests).
