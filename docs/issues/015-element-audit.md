# ISSUE-015 — element-level audit pass

**Status:** 🟢 Done
**Branch:** `fix/issue-015-element-audit`
**Found by:** element-by-element audit of every ui primitive + dashboard component after the terminal redesign (DOM-measured, not just visual).

## Findings → fixes

| # | Element | Problem | Fix |
|---|---|---|---|
| 1 | `input[type=datetime-local]` + native chrome | `color-scheme` never applied — the CSS pipeline drops the declaration; computed value stayed `normal` → light-mode picker chrome on black | `style={{ colorScheme: 'dark' }}` inline on `<html>` (verified: computes `dark`) |
| 2 | markLine labels | `CRIT 120ms`/`WARN 85ms` clipped ~10px at the grid's left edge | `offset: [16, 0]` on both labels — verified fully inside plot |
| 3 | Anomaly DELTA column | Always `text-crit` — a WARN row showed a red delta (wrong severity semantics) | `text-crit`/`text-warn` by `row.severity` |
| 4 | `SelectContent` (×4) | Inherited `shadow-md` from the generated primitive — spec is zero-blur | `shadow-none` on all four usages |
| 5 | KPI `Skeleton` | `bg-muted` (#111116) nearly invisible on `#0B0B0E` card | `bg-accent` (#1C1C22) |
| 6 | DESIGN.md / README | Typography still referenced Inter + JetBrains Mono after ISSUE-014 | All `fontFamily` entries + README type line → IBM Plex Sans/Mono |

## Verified via DOM audit

- `colorScheme` computes `dark`; select popup has `shadow-none`, no `shadow-md`
- `?mode=supabase` without creds → `SOURCE ERROR` badge + `Source unavailable` empty state render
- Tooltip on ZoomIn renders; PAUSE state badge works; select items + check indicator render
- Note: the running dev server (and a stale IDE buffer) served an older transformed module — fixed by restarting `pnpm dev`; the committed source was always correct.

## Gates

lint / typecheck / vitest 29 / playwright 3 — all green.
