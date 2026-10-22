# ISSUE-003 — Correlation chart metric locked, duplicates primary

**Severity:** Medium · **Type:** fix(ux)

## Problem

`params.compare` is a hidden URL param with no UI. When the user selects
`metric=throughput_rps`, the correlation chart shows the same metric — two
identical charts (verified via screenshot after switching).

## Fix

- Add a "COMPARE" select to `HeaderFilterBar` bound to `params.compare`.
- When `compare === metric`, auto-swap `compare` to the other metric
  (or offer a `none` option that hides the correlation chart).

## Acceptance criteria

- Correlation metric selectable from the header; persists in URL.
- Selecting primary `throughput_rps` never renders a duplicate pair.
