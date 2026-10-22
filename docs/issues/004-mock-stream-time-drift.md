# ISSUE-004 — Mock live-stream timestamps accelerate past wall-clock

**Severity:** Medium · **Type:** fix(data)

## Problem

`MockDataSource.subscribeStream` advances `lastTs` by 50–150ms per point and
emits 1–4 points per 80ms tick → stream time runs ~2.5–5× faster than
wall-clock. The x-axis drifts into the future; "live" data is fictional.

## Fix

Anchor emitted timestamps to `Date.now()` (jittered), so stream points track
real time while still arriving in high-frequency batches. Keep `lastTs >
afterTimestampMs` ordering and dedup semantics intact.

## Acceptance criteria

- After N seconds of streaming, newest point timestamp ≈ `Date.now()` (±1s).
- Existing buffer/dedup tests still pass.
