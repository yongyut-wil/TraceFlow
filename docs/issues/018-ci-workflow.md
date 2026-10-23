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

- **Production e2e server** — `webServer.command` is `pnpm run start` on CI,
  `pnpm run dev` locally. `next dev` intermittently stalled resolving
  `next/font/google` in the Turbopack font replacer on a runner (stale
  `.next` cache from the preceding build step is the likely trigger);
  serving the verified build output removes that failure mode entirely.
- **Playwright container** — the job runs inside
  `mcr.microsoft.com/playwright:v<pw-version>-noble`, which ships matching
  chromium binaries and all OS deps. It replaced an earlier
  `actions/cache` + `install-deps` setup after apt took 11m47s on one run
  (runner mirror flake). The image tag must track `@playwright/test` in
  package.json; `playwright install chromium` stays as a self-healing
  no-op on version drift.

## Verified

Runs green on GitHub: first run 1m27s; container runs ~1m39s including
image pull (12 e2e tests).
