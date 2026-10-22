console.log(
  JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PostCompaction',
      additionalContext:
        'TraceFlow Architecture Reminder: (1) Use pnpm only. (2) Use modular echarts/core + CanvasRenderer with LTTB sampling and ResizeObserver/dispose. (3) Buffer real-time streams in a useRef fixed-size ring buffer (10k cap) and flush via requestAnimationFrame, never useState. (4) Support Hybrid Data Mode (Supabase + Mock 10k+ generator) using [timestampMs, value][] tuples.',
    },
  })
);
