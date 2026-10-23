# TraceFlow Issue Tracker

Local issue tracker (no remote configured). Issues are numbered `ISSUE-NNN`,
files live in this directory, and status is mirrored here and in `CHANGELOG.md`.

| ID | Title | Severity | Status | Branch |
|----|-------|----------|--------|--------|
| [ISSUE-001](001-test-coverage-gaps.md) | Test coverage gaps vs testing-standards | Medium | 🟢 Done | `release/0.2.0` |
| [ISSUE-002](002-anomaly-table-states.md) | Anomaly table: dead ZoomIn action, misleading empty/error copy | Medium | 🟢 Done | `release/0.2.0` |
| [ISSUE-003](003-correlation-metric-selector.md) | Correlation chart metric locked to `throughput_rps`, duplicates primary | Medium | 🟢 Done | `release/0.2.0` |
| [ISSUE-004](004-mock-stream-time-drift.md) | Mock live-stream timestamps accelerate past wall-clock | Medium | 🟢 Done | `release/0.2.0` |
| [ISSUE-005](005-ux-polish-a11y.md) | UX polish: a11y, semantics, tokens, responsive floor | Low | 🟢 Done | `release/0.2.0` |
| [ISSUE-006](006-security-config-hardening.md) | Security headers, dep hygiene, channel sanitize, ssr client | Low | 🟢 Done | `release/0.2.0` |
| [ISSUE-007](007-query-correctness.md) | Focus refetch resets buffer; source resolved in render; metric heuristic | Medium | 🟢 Done | `release/0.2.0` |
| [ISSUE-008](008-ui-polish-pack.md) | Responsive nits (select truncation, markLine clip, table width, touch targets) + token hygiene | Low | 🟢 Done | `fix/issue-008-ui-polish` |
| [ISSUE-009](009-aesthetic-refinement.md) | Flat surfaces, bare neon trace, no signal linkage in KPI/panels | Low | 🟢 Done | `fix/issue-009-aesthetic-refinement` |
| [ISSUE-010](010-border-icon-semantics.md) | Interactive controls indistinguishable from structural borders; mismatched KPI icons | Low | 🟢 Done | `fix/issue-010-border-icon-semantics` |
| [ISSUE-011](011-design-system-completeness.md) | Spec gaps: accent tier, untokenized type scale, blanket mono tracking, dead tooltip | Low | 🟢 Done | `fix/issue-011-design-tokens` |
| [ISSUE-012](012-a11y-edge-polish.md) | a11y names/hidden icons, dim-contrast misuse, stale-series flash, loose URL params | Low | 🟢 Done | `fix/issue-012-a11y-edge` |
| [ISSUE-013](013-terminal-redesign.md) | Redesign: navy/cyan AI-look → ops-terminal direction (black canvas, amber chrome, status line) | Medium | 🟢 Done | `fix/issue-013-terminal-redesign` |
| [ISSUE-014](014-terminal-typography-glow.md) | De-AI pass 2: Plex type, flat traces, caret blink, signal-colored KPI values | Low | 🟢 Done | `fix/issue-014-terminal-type` |
| [ISSUE-015](015-element-audit.md) | Element audit: color-scheme, markLine clip, delta semantics, select shadow, skeleton, font docs | Low | 🟢 Done | `fix/issue-015-element-audit` |

**Status legend:** 🔵 Open · 🟡 In progress · 🟢 Done (merged) · ⚪ Won't fix

## Conventions

- Severity: `High` (bug/user-facing break) · `Medium` (spec/quality gap) · `Low` (polish)
- Each issue lists: **Problem → Evidence → Fix → Acceptance criteria**
- Issues close only after `pnpm run lint`, `pnpm run typecheck`, `pnpm test`,
  `pnpm exec playwright test`, and a browser screenshot verify the fix.
