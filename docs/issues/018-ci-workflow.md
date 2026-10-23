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

## Verified

YAML parses; steps mirror the local gate commands 1:1. First run confirms on
GitHub after push.
