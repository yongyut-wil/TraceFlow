---
description: "Testing standards for Vitest hook unit tests and Playwright E2E dashboard verification"
trigger: glob
globs: "**/*.{test,spec}.{ts,tsx}"
---

# Testing & Verification Standards

When writing or updating tests:

1. **Vitest Unit & Hook Tests:**
   - Use `vi.useFakeTimers()` and stub `requestAnimationFrame` when testing real-time buffer hooks.
   - Explicitly assert:
     - **Ring buffer cap:** Pushing 12,000 points into a 10,000-cap buffer retains only the newest 10,000 points (no memory leak).
     - **Deduplication:** Out-of-order or duplicate timestamps (`<= lastTimestampMs`) are dropped.
     - **Zero-transformation schema:** Payloads validate against `TimeSeriesPointSchema` (`readonly [number, number]`).
     - **Cleanup:** Unmounting a chart component triggers `ResizeObserver.disconnect()` and `chart.dispose()`.
2. **Playwright E2E Tests:**
   - Run E2E tests against `NEXT_PUBLIC_DATA_MODE=mock` for deterministic 10k+ point rendering.
   - Verify that URL filter changes (`nuqs`) persist across page reloads and update the chart canvas without console errors.
