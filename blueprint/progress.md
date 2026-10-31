# Progress

**Current step:** 0.2 · Design tokens and base styles

Claude Code updates this file at the end of every step: mark the step done, set the next current step, and log anything decided along the way.

## Steps

### Phase 0 · Setup
- [x] 0.1 Scaffold the project
- [ ] 0.2 Design tokens and base styles
- [ ] 0.3 Deploy early

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
| 2026-11-01 | 0.1 | Stripped the Vite demo favicon (a Vite logo) and left no favicon until Step 8.1 |
| 2026-11-01 | 0.1 | Added `.DS_Store` to `.gitignore` beyond the requested node_modules, dist and .env |
| 2026-11-01 | 0.1 | Used `tsc -b --noEmit` for `typecheck` so it checks the same project references as `build` |
| 2026-11-01 | 0.1 | Template shipped oxlint; replaced with ESLint (typescript-eslint, react-hooks, react-refresh) as the plan asks |
| 2026-11-01 | 0.1 | Pinned TypeScript to ~6.0 (template had 7.0): typescript-eslint supports only <6.1. Revisit when it supports 7 |
| 2026-11-01 | Planning | Stack: Vite + React + TypeScript, plain CSS, Vitest, Netlify, no backend |

## Open issues

Things found during a step that need Emma's input. Remove them once they're answered.

- `npm audit` reports a moderate minimatch advisory inside the ESLint toolchain (dev only, not shipped). The only offered fix downgrades typescript-eslint, so I left it.
- `CLAUDE.md` and `blueprint/` are still untracked in git. Do you want them committed?
