# ISSUE-013 — Terminal redesign (de-AI-ify)

**Status:** DONE
**Branch:** `fix/issue-013-terminal-redesign`
**Found by:** user feedback — the navy + neon-cyan + caps-everywhere shell read as generic AI-generated dashboard.

## Concept — "ops terminal, not SaaS dashboard"

Reference points: Bloomberg terminal, Tektronix scopes, real SCADA consoles — authored, functional, zero decoration. Every color keeps a semantic job; the signature elements are the function-key range strip and the bottom status line.

## Changes

| Area | Before | After |
|---|---|---|
| Canvas | `#06090F` navy | `#000000` true black |
| Surfaces | blue-tinted tiers | warm-neutral zinc tiers (`#0B0B0E`/`#111116`/`#1C1C22`/`#121218`) |
| Primary/brand | cyan `#00E5FF` | amber `#FFB000` (logo, primary trace, active keys, ring) |
| Secondary | violet `#818CF8` | steel blue `#6FA8DC` (correlation trace) |
| Warn | gold `#F59E0B` | orange `#FB923C` — distinct from brand amber |
| Live/Crit | `#10B981`/`#F43F5E` | `#2FBF71`/`#E5484D` terminal green/red |
| Text | cool `#F8FAFC`/`#94A3B8`/`#475569` | warm `#F2EFE9`/`#9C9CA6`/`#55555E` |
| Range control | pill buttons | function-key strip `[1H] [6H] [24H] [7D] [CUSTOM]`, active = amber block |
| Shell | header only | + bottom `StatusBar`: TERM·01, node id, pts buffered, status, blinking `▮` cursor, live UTC clock |
| Wordmark | static | + blinking block cursor `▮` (motion-reduce safe) |
| Anomaly table | flat rows | zebra rows (`odd:bg-muted/40`), VALUE/DELTA right-aligned tabular |
| Assets | cyan palette | `icon.svg`, `logo.svg`, `hero.png`, `mobile.png`, `zoom-inspect.png`, `opengraph-image.png`, `live-demo.gif` all regenerated |
| DESIGN.md | navy spec | v2 Terminal palette section (supersedes original scheme) |

## Verification

- lint / typecheck / vitest 29 / playwright 3 — all green (spec fixed: `text=TraceFlow` → `.first()` for new footer wordmark)
- Screenshots verified at 1600×950 and 390×844: amber trace, zebra table, `[24H]` key active, status bar clock ticking
