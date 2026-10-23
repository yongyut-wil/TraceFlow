# ISSUE-014 — terminal typography + de-glow pass

**Status:** 🟢 Done
**Branch:** `fix/issue-014-terminal-type`
**Found by:** user feedback — after ISSUE-013 the palette read terminal, but the *typeface pair, uniform card borders, and glow effects* still read "AI dashboard".

## Findings → fixes

| # | Remaining AI tell | Fix |
|---|---|---|
| 1 | **Inter + JetBrains Mono** — the canonical AI-dashboard font pair | **IBM Plex Sans + IBM Plex Mono** (`next/font`, weights 400–700). Plex carries real terminal heritage (IBM 3270 lineage) — slashed zero, technical digit shapes |
| 2 | **Gradient area fills** under both traces — neon SaaS glow | Removed entirely; traces render as flat lines (the oscilloscope look) |
| 3 | **`animate-ping`** halo on the live badge — SaaS flourish | Hard-step terminal caret: `@keyframes caret-blink` (`steps(1)`, 1.1s, `prefers-reduced-motion` safe) on a `●` char; same caret drives the wordmark `▮` and status-bar cursor |
| 4 | **Identical KPI cards with `border-l-2` accents** — template card grid | Dropped the left accent + raised surface; **signal color now lives on the value itself** (Bloomberg convention: numbers carry the semantics). Cards stay flat hairlines |
| 5 | Panel titles neutral white | Titles render in **brand amber** — terminal section-header convention |

## Follow-on assets

`hero.png`, `mobile.png`, `zoom-inspect.png`, `opengraph-image.png`, `live-demo.gif` regenerated (flat traces + Plex); `e2e` unchanged; `chart-theme.ts` font mirror updated to `IBM Plex Mono`.

## Verification

- lint / typecheck / vitest 29 / playwright 3 / production build — all green
- Screenshot 1600×950 verified: flat amber trace, signal-colored KPI numerals, amber panel titles, caret blinking
