---
description: "Enforce strict state separation (TanStack Query, Zustand, nuqs) and useRef ring-buffer + requestAnimationFrame rules for hooks and stores"
trigger: glob
globs: "**/{hooks,stores,providers,services,lib}/**/*.{ts,tsx}"
---

# Real-Time Streaming & State Separation Guardrails

When working in hooks, stores, providers, or data services:

1. **No High-Frequency State in React:**
   - Never call `setState` or Zustand `set` inside a high-frequency WebSocket/Realtime message handler.
   - Push incoming `[timestampMs, value]` tuples into a fixed-capacity `useRef` ring buffer (`MAX_POINTS = 10_000`) and evict oldest entries when full.
   - Flush updates to the ECharts instance on a throttled timer (250ms–500ms) wrapped in `requestAnimationFrame`.
2. **Stream Deduplication:**
   - Track `lastTimestampRef.current` initialized from the last point of the historical snapshot.
   - Ignore any incoming stream point where `point[0] <= lastTimestampRef.current`.
3. **Three-Way State Separation:**
   - **Server Cache (`@tanstack/react-query`):** Initial historical REST/RPC snapshots and metadata.
   - **URL State (`nuqs`):** Shareable filter parameters (`siteId`, `metric`, `range`, `from`, `to`, `mode`).
   - **Client UI State (`zustand`):** Ephemeral UI state only (sidebar collapsed, active inspector tab, stream pause/resume toggle, connection status badge).
