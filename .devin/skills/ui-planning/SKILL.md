---
name: ui-planning
description: Lead Frontend & UX/UI Architect workflow for translating dashboard requirements into Stitch MCP designs, URL state schemas (nuqs), API contracts, and Shadcn/UI component trees.
argument-hint: "[domain or feature description]"
allowed-tools:
  - read
  - grep
  - glob
  - mcp__stitch__list_projects
  - mcp__stitch__get_project
  - mcp__stitch__create_project
  - mcp__stitch__list_screens
  - mcp__stitch__get_screen
  - mcp__stitch__generate_screen_from_text
  - mcp__stitch__create_design_system_from_design_md
triggers:
  - user
  - model
---

# UX/UI Architecture & Dashboard Planning Skill

Act as a Lead Frontend Engineer and UX/UI Architect when planning or designing views for **TraceFlow**.

## Workflow

When invoked for a dashboard view or feature:

1. **Shell & Component Decomposition (Server vs. Client):**
   - Break down the responsive shell structure (Sidebar, Header Status Bar, Global Filter Bar, KPI Summary Row, Primary ECharts Canvas Grid, Anomaly/Log Drawer).
   - Explicitly classify **Server Components** (layout shell, static metadata) vs. **Client Leaf Components** (`'use client'` interactive filters, live connection indicator, ECharts containers).
   - Define real-time UI states: `Connected`, `Reconnecting`, `Stale Data Warning`, `Empty State`, and `10k+ Points Loading Skeleton`.

2. **URL State Schema (`nuqs`):**
   - Define the exact search parameter parsers (`parseAsString`, `parseAsInteger`, `parseAsIsoDateTime`, `parseAsStringLiteral`) for shareable URL state:
     - `siteId`: Equipment / Node / Site identifier
     - `metric`: Selected telemetry metric(s)
     - `range`: Preset (`1h`, `6h`, `24h`, `7d`) or custom `from` / `to`
     - `mode`: Data source override (`hybrid`, `supabase`, `mock`)

3. **Zero-Transformation API & Stream Contract:**
   - Specify the Historical REST/RPC JSON envelope and Realtime WebSocket payload using `[timestampMs, value][]` tuples.
   - Document the handoff protocol (`lastTimestampMs` / `sequenceId`) that merges historical snapshots with live buffered streams without duplicates or gaps.

4. **Design System & Stitch MCP Integration:**
   - When visual screens or design tokens are needed, use the `stitch` MCP tools (`create_project`, `create_design_system_from_design_md`, `generate_screen_from_text`) alongside the `design-system` skill to generate high-contrast dark telemetry UI screens before writing component code.

5. **Shadcn/UI & Verification Checklist:**
   - List the exact Shadcn/UI primitives required (`card`, `badge`, `select`, `popover`, `tabs`, `skeleton`, `tooltip`, `sheet`).
   - Specify how the view will be verified with `agent-browser` or Playwright.
