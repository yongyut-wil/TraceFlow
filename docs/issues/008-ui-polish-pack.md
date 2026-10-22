# ISSUE-008 — UI Polish Pack (responsive nits + design-token hygiene)

**Status:** Done
**Severity:** Low (nit-level, no blockers)
**Found in:** Responsive audit (13 viewports) + design-system token audit
**Branch:** `fix/issue-008-ui-polish`

## Problem

Follow-up nits from the post-release responsive and design-system audits:

### Responsive
- **R1** Compare `SelectTrigger` `w-32` truncates `throughput_rps` → `throughput_ry` at ≤1440px
- **R2** markLine labels (`CRIT 120ms` / `WARN 85ms`) clip at the right canvas edge on ≤390px viewports (`insideEndTop` still overflows)
- **R3** Anomaly table min-width ~417px forces horizontal scroll <417px; cell padding `px-3` too wide for phones
- **R4** `ZoomIn` action buttons `h-5 w-5` (20px) below WCAG 2.5.8 minimum 24px touch target

### Design system
- **D1** `--text-dim`/`--color-dim` (`#475569` Text Muted tier) defined but never used — dead token
- **D2** SEV badge `text-[8px]` below the spec floor (smallest label-caps = 9px)
- **D3** label-caps elements use `tracking-wider` (0.05em); spec is `0.08em`
- **D4** Signal colors (`emerald-500`/`amber-500`/`rose-500`) scattered as Tailwind literals — hexes happen to match spec but will drift; should be `--color-live`/`--color-warn`/`--color-crit` tokens
- **D5** KPI grid `gap-3 p-3` (12px) on mobile; spec mobile gutter = 8px
- **D6** `Activity` icon shown for paused/disconnected status — semantics wrong (icon implies live activity)

## Fix

- R1: widen compare trigger `w-32` → `w-40`
- R2: markLine label `position: 'insideStartTop'` (top-left inside plot, clear of right edge)
- R3: table cells `px-3` → `px-2 sm:px-3`
- R4: ZoomIn button `h-5 w-5` → `h-6 w-6`
- D1: apply `text-dim` to disabled/empty tiers (`--` KPI values, empty-table message)
- D2: SEV badge `text-[8px]` → `text-[9px]`
- D3: `tracking-wider` → `tracking-[0.08em]` on label-caps elements
- D4: add `--live`/`--warn`/`--crit` tokens; replace emerald/amber/rose literals
- D5: KPI grid `gap-2 p-2 md:gap-3 md:p-3`
- D6: disconnected → `WifiOff` icon; paused keeps `Activity`

## Acceptance

- [ ] No `throughput_rps` truncation at ≥1024px
- [ ] markLine labels fully visible at 390px
- [ ] Table fits ~375px without horizontal scroll of ACTION column
- [ ] All touch targets ≥24px
- [ ] `text-dim` used ≥1 place; signal colors via tokens only
- [ ] `pnpm run lint && pnpm run typecheck && pnpm test` pass; e2e 3/3 pass
- [ ] Screenshots at 390px + 1366px unchanged except intended fixes
