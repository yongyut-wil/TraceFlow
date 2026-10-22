---
description: "Enforce Apache ECharts modular imports, CanvasRenderer, LTTB downsampling, and ResizeObserver/dispose lifecycle on chart files"
trigger: glob
globs: "**/*{chart,Chart,echarts,EChart,series,Series}*.{ts,tsx}"
---

# ECharts Component Guardrails

When creating or editing ECharts components or options:

1. **Modular Imports Only:**
   - Import from `echarts/core`, `echarts/charts`, `echarts/components`, `echarts/renderers`, and `echarts/features`.
   - NEVER use `import * as echarts from 'echarts'` or `import echarts from 'echarts'`.
   - NEVER use `echarts-for-react`, `recharts`, or `chart.js`.
2. **Instance & Memory Lifecycle:**
   - Initialize with `echarts.init(container, undefined, { renderer: 'canvas', useDirtyRect: true })`.
   - Attach a `ResizeObserver` to the container and call `observer.disconnect()` + `instance.dispose()` in the `useEffect` cleanup.
3. **10k+ Data Point Settings:**
   - Always configure `sampling: 'lttb'`, `large: true`, `largeThreshold: 2000`, `showSymbol: false`, and `animation: false` on high-density time-series.
   - Always update options with `{ notMerge: false, lazyUpdate: true }`.
