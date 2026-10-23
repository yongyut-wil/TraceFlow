# ISSUE-011 — Design-system completeness vs DESIGN.md

**Status:** Done
**Severity:** Low (spec fidelity)
**Found in:** Design-system audit vs `.devin/stitch/DESIGN.md`
**Branch:** `fix/issue-011-design-tokens`

## Problem

Five gaps between the spec and the implementation:

1. **`--accent` tier drift** — was `#121A2A` (L2); spec assigns hover/active
   surfaces to L3 `#1A2438`. Range-button active state used the wrong tier.
2. **Type scale not tokenized** — the 11-style spec scale existed only as
   scattered `text-[9px]`/`text-[10px]`/`text-[26px]` literals.
3. **Blanket mono tracking** — `.font-mono { tracking-tight }` applied
   `-0.025em` to every size; spec tiers tracking per size (xl −0.03em →
   sm 0em). Small mono text was over-compressed.
4. **Spacing scale undocumented** — spec `space-xs..xl`/`gutter`/`margin`
   maps 1:1 to Tailwind steps but the mapping wasn't recorded.
5. **Dead primitives** — `TooltipProvider` wrapped the app but no real
   `<Tooltip>` existed; ZoomIn used a native `title` attribute.

## Fix

- `--accent` → `#1A2438` (hover/active tier per spec)
- New size tokens: `--text-micro` (9px label-caps), `--text-mini` (10px
  data-mono-sm), `--text-value` (26px KPI readout) — all `text-[Npx]`
  literals in dashboard components migrated
- `.font-mono` keeps only `tabular-nums`; per-tier tracking stays explicit
  (`tracking-[0.08em]` caps, `tracking-tight` KPI value)
- `globals.css` documents the spec spacing → Tailwind step mapping
- `ZoomIn` row action now uses a real `<Tooltip>` (dark popover, zero
  radius, mono mini) instead of `title=`

## Acceptance

- [x] `bg-accent` renders `#1A2438` (spec L3)
- [x] No `text-[Npx]` literals remain in `src/components/dashboard/`
- [x] Small mono text tracking = spec tier, not blanket tight
- [x] Tooltip visible on ZoomIn hover; dark/zero-radius/mono
- [x] lint / typecheck / 29 tests pass; zero console errors
