# Branching & Release Strategy

Trunk-based development. `master` is the single source of truth and must
always pass: `lint` + `typecheck` + `vitest` + `playwright` + `build`.

## Branch types

| Prefix | Purpose | Example |
|--------|---------|---------|
| `feat/*` | New capabilities | `feat/alert-rules` |
| `fix/*` | Bug fixes, one per issue | `fix/issue-002-anomaly-table` |
| `chore/*` | Tooling, deps, docs-only | `chore/bump-deps` |
| `release/*` | Release stabilization (optional, for batched fixes) | `release/0.2.0` |

Rules:

- One branch per issue (`fix/issue-NNN-slug`); never commit directly to `master`.
- Branches are short-lived: open → implement → verify loop → merge `--no-ff` → delete.
- For batched fix trains (like the post-review train), land each issue as a
  separate commit on a `release/x.y.z` branch, then merge `--no-ff` to `master`.
- No `force-push`, no history rewrite on `master`.

## Commits

Conventional Commits, message focuses on *why*:

```
<type>(<scope>): <summary>

fix(chart): drop stale markLine when metric changes
```

Types: `feat` `fix` `perf` `refactor` `test` `docs` `chore` `build` `ci`.
Reference issues in the body: `Closes ISSUE-002` → then flip its status in
`docs/issues/README.md` in the same commit.

## Releases

- SemVer tags on `master`: `v<major>.<minor>.<patch>` (`v0.2.0`).
- Every tag gets a `CHANGELOG.md` entry (Keep a Changelog format) listing
  closed issues under Added / Changed / Fixed / Security.
- Tag only after the full verification loop is green.
