# ISSUE-016 — repo-wide sweep (final review)

**Status:** DONE
**Branch:** `fix/issue-016-repo-sweep`
**Found by:** systematic 5-pass audit of every file/layer in the repo after ISSUE-013–015.

## Audit plan executed

1. **Core files** — `EChartCanvas`, `contracts`, `mock-source`, `index` factory, `providers`, `echarts-setup`
2. **Configs** — `next.config` (CSP/headers), tsconfig, eslint, vitest, playwright, package.json, `.env.example`, `.gitignore`
3. **Test coverage** — vs behavior added since ISSUE-001
4. **Docs consistency** — BRANCHING, releases, issues, DESIGN.md, README, assets
5. **Fix + full gate re-verify**

## Findings → fixes

| # | Finding | Fix |
|---|---|---|
| 1 | `echarts-setup` registered 6 unused components (BarChart, Dataset, Legend, MarkPoint, UniversalTransition) — dead bundle weight | Trimmed to the 5 used registrations |
| 2 | `EChartCanvas` `min-h-[300px]` could overflow the 250px correlation panel | Removed — parents own height |
| 3 | `subscribeStream` ignored `siteId` → every node produced the identical live trace (inconsistent with `fetchHistorical`'s per-site hash) | Seeded stream cycle+noise with site hash |
| 4 | New post-audit behaviors untested: buffer clear on param change, `from>to` clamp, literal metric parser | +2 hook tests, new `search-params.test.ts` (34 tests total) |
| 5 | `architecture.svg`, README design-system section, DESIGN.md narrative still referenced the pre-terminal palette (navy/cyan) | All regenerated/synced to terminal tokens |
| 6 | `BRANCHING.md` said "merge (squash)" — actual convention is `--no-ff` | Corrected |

## Clean bill of health

- Contracts, factory cache/env resolution, providers, CSP+headers, playwright/vitest/eslint configs, `.env.example`, `.gitignore` — all verified sound.

## Gates

lint / typecheck / vitest **34** / playwright 3 / production build — all green.
