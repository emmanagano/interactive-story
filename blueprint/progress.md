# Progress

**Current step:** 1.1 · Types

Claude Code updates this file at the end of every step: mark the step done, set the next current step, and log anything decided along the way.

## Steps

### Phase 0 · Setup
- [x] 0.1 Scaffold the project
- [x] 0.2 Design tokens and base styles
- [x] 0.3 Deploy early

### Phase 1 · The engine
- [ ] 1.1 Types
- [ ] 1.2 Conditions
- [ ] 1.3 Effects and the automatic rules
- [ ] 1.4 The run loop
- [ ] 1.5 Memory

### Phase 2 · Act 1, playable and plain
- [ ] 2.1 Convert Act 1
- [ ] 2.2 Story validation
- [ ] 2.3 Minimal UI

### Phase 3 · The HUD and the decay
- [ ] 3.1 The HUD
- [ ] 3.2 Cyberpunk styling
- [ ] 3.3 The decaying interface
- [ ] 3.4 Ending cards and the tracker

### Phase 4 · Acts 2 and 3
- [ ] 4.1 Convert Act 2
- [ ] 4.2 Convert Act 3
- [ ] 4.3 Special effects from the script

### Phase 5 · Debug panel and full playtest
- [ ] 5.1 Debug panel
- [ ] 5.2 Path tests
- [ ] 5.3 Emma's playtest

### Phase 6 · Polish and accessibility
- [ ] 6.1 Text reveal and transitions
- [ ] 6.2 Title and settings screens
- [ ] 6.3 Accessibility audit

### Phase 7 · Audio
- [ ] 7.1 Sound

### Phase 8 · Ship it
- [ ] 8.1 Performance and meta tags
- [ ] 8.2 Outside playtest
- [ ] 8.3 README for the portfolio

## Decisions log

Newest first. One line each: date, step, what was decided and why.

| Date | Step | Decision |
| --- | --- | --- |
| 2026-11-01 | 0.3 | Site is live on Netlify. The deployed token page shows all three fonts, glows, chip line and locked-choice sample correctly, which closes the Step 0.2 visual check too |
| 2026-11-01 | 0.3 | `netlify.toml` pins `NODE_VERSION = "22"` because Vite 8 needs a recent Node. No redirect rules, since the game has no router |
| 2026-11-01 | 0.2 | Text contrast on night/panel: ink 15.6/14.6, dim 5.8/5.5, magenta 5.7/5.3, cyan 12.3/11.5, green 11.7/10.9, amber 10.7/10.0, red 6.0/5.6. All pass AA (4.5:1) |
| 2026-11-01 | 0.2 | `--color-line` is only 1.36:1 on night, so it is for decoration only. Controls need a cyan or amber border to meet the 3:1 non-text rule |
| 2026-11-01 | 0.2 | Type scale (about 1.25 steps, 0.8–3rem), 4px-based spacing and radii are my picks, since CLAUDE.md gives no values. Emma approved |
| 2026-11-01 | 0.2 | Added glow tokens (hue at low alpha) so neon is used as light, not fill |
| 2026-11-01 | 0.2 | Fonts load only the weights in use: Plex Sans 400/600, JetBrains Mono 400/700, Oxanium 500/700, with `display=swap` |
| 2026-11-01 | 0.2 | `TokenPage` is a temporary test page rendered by `App`; delete it when real screens arrive (Step 2.3) |
| 2026-11-01 | 0.1 | Stripped the Vite demo favicon (a Vite logo) and left no favicon until Step 8.1 |
| 2026-11-01 | 0.1 | Added `.DS_Store` to `.gitignore` beyond the requested node_modules, dist and .env |
| 2026-11-01 | 0.1 | Used `tsc -b --noEmit` for `typecheck` so it checks the same project references as `build` |
| 2026-11-01 | 0.1 | Template shipped oxlint; replaced with ESLint (typescript-eslint, react-hooks, react-refresh) as the plan asks |
| 2026-11-01 | 0.1 | Pinned TypeScript to ~6.0 (template had 7.0): typescript-eslint supports only <6.1. Revisit when it supports 7 |
| 2026-11-01 | Planning | Stack: Vite + React + TypeScript, plain CSS, Vitest, Netlify, no backend |

## Open issues

Things found during a step that need Emma's input. Remove them once they're answered.

- `npm audit` reports a moderate minimatch advisory inside the ESLint toolchain (dev only, not shipped). The only offered fix downgrades typescript-eslint, so I left it.
