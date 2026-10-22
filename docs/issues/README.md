# TraceFlow Issue Tracker

Local issue tracker (no remote configured). Issues are numbered `ISSUE-NNN`,
files live in this directory, and status is mirrored here and in `CHANGELOG.md`.

| ID | Title | Severity | Status | Branch |
|----|-------|----------|--------|--------|
| [ISSUE-001](001-test-coverage-gaps.md) | Test coverage gaps vs testing-standards | Medium | 🔵 Open | `fix/issue-001-test-coverage` |
| [ISSUE-002](002-anomaly-table-states.md) | Anomaly table: dead ZoomIn action, misleading empty/error copy | Medium | 🔵 Open | `fix/issue-002-anomaly-table` |
| [ISSUE-003](003-correlation-metric-selector.md) | Correlation chart metric locked to `throughput_rps`, duplicates primary | Medium | 🔵 Open | `fix/issue-003-compare-selector` |
| [ISSUE-004](004-mock-stream-time-drift.md) | Mock live-stream timestamps accelerate past wall-clock | Medium | 🔵 Open | `fix/issue-004-mock-time` |
| [ISSUE-005](005-ux-polish-a11y.md) | UX polish: a11y, semantics, tokens, responsive floor | Low | 🔵 Open | `fix/issue-005-ux-polish` |
| [ISSUE-006](006-security-config-hardening.md) | Security headers, dep hygiene, channel sanitize, ssr client | Low | 🔵 Open | `fix/issue-006-security` |
| [ISSUE-007](007-query-correctness.md) | Focus refetch resets buffer; source resolved in render; metric heuristic | Medium | 🔵 Open | `fix/issue-007-query-correctness` |

**Status legend:** 🔵 Open · 🟡 In progress · 🟢 Done (merged) · ⚪ Won't fix

## Conventions

- Severity: `High` (bug/user-facing break) · `Medium` (spec/quality gap) · `Low` (polish)
- Each issue lists: **Problem → Evidence → Fix → Acceptance criteria**
- Issues close only after `pnpm run lint`, `pnpm run typecheck`, `pnpm test`,
  `pnpm exec playwright test`, and a browser screenshot verify the fix.
