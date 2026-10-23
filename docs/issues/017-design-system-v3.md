# ISSUE-017 — Design system v3: full spec rewrite

**Status:** DONE
**Severity:** Medium (spec drift = wrong source of truth)
**Found in:** Repo-wide doc audit — `.devin/stitch/DESIGN.md` frontmatter was
still the pre-terminal Material scheme; two implemented token layers
(`raised`, `popover`) were missing from the spec; font CSS variable names
still referenced the old typefaces.

## Problems

1. **Stale frontmatter palette** — the machine-consumable `colors:` YAML block
   still shipped navy/cyan values (`#10131a`, `#00e5ff`, `#bdc2ff`…) while the
   product has run the terminal scheme since ISSUE-013.
2. **Missing tiers in spec** — `--raised: #121218` and `--popover: #16161C`
   exist in `globals.css` but were never documented; the spec listed only 4
   surface levels.
3. **Stale font variable names** — `layout.tsx` declares Plex under
   `--font-inter` / `--font-jetbrains-mono` and `@theme` maps those names;
   misleading for anyone reading tokens.
4. **No states/motion/component anatomy** — hover/active/focus/disabled/
   loading/empty/error conventions, caret-blink motion spec, chart rules, and
   iconography were tribal knowledge scattered across components.

## Fix

- Rewrote `DESIGN.md` as a coherent v3 spec: corrected frontmatter (terminal
  palette + type + spacing), complete token tables (all 6 surface tiers,
  borders, signals, text), states matrix, motion spec, component anatomy for
  every shipped component, data-viz rules, do/don't list.
- Renamed font variables to `--font-plex-sans` / `--font-plex-mono` in
  `layout.tsx` + `@theme` mapping — zero visual change, honest token names.
- Regenerated `docs/assets/palette.svg` ordering to match spec tiers.

## Verified

lint / typecheck / 34 unit / 3 e2e / build green; dev-server DOM check
confirms `font-family` resolves to IBM Plex under the new variable names.
