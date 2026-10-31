# Progress

**Current step:** 2.3 · Minimal UI

Claude Code updates this file at the end of every step: mark the step done, set the next current step, and log anything decided along the way.

## Steps

### Phase 0 · Setup
- [x] 0.1 Scaffold the project
- [x] 0.2 Design tokens and base styles
- [x] 0.3 Deploy early

### Phase 1 · The engine
- [x] 1.1 Types
- [x] 1.2 Conditions
- [x] 1.3 Effects and the automatic rules
- [x] 1.4 The run loop
- [x] 1.5 Memory

### Phase 2 · Act 1, playable and plain
- [x] 2.1 Convert Act 1
- [x] 2.2 Story validation
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
| 2026-11-01 | 2.2 | `validateStory` (src/story/validate.ts) returns readable problems. It checks shapes, gotos, dead ends, ending ids and numbers, flags and items used but never set, unreachable scenes, leaked script markup and chip text starting with "> ". It is tested against deliberately broken stories as well as the real one |
| 2026-11-01 | 2.2 | `placeholders.ts` lists Act 2 scenes (08, 10, 12, 13, 16) and later-act flags (tavi_secret, was_removed, saw_company, saw_sold, saw_merged) Act 1 refers to. The validator fails when an entry becomes real, so the lists must shrink in Steps 4.1 and 4.2 |
| 2026-11-01 | 2.2 | `story/index.ts` and the story test load `act*.json` by glob, so a new act is loaded and validated with no code change |
| 2026-11-01 | Process | Emma asked Claude to make all the decisions. CLAUDE.md now says: no plan approval, no stopping between steps, format and save-format changes allowed if tested, logged and documented. Emma still decides pushes, new npm packages and outside-server requests, and Steps 5.3 and 8.2 need her playtests |
| 2026-11-01 | 2.1 | Act 1 is `src/story/act1.json` (8 scenes: 01–07 plus `scene-03-office` for the "Searching the office" screen). Text was copied from the script by a script and checked back against it: 93 player-facing lines, none missing |
| 2026-11-01 | 2.1 | Kept `*` and `**` marks in text exactly as written (Step 2.3 renders them). Chip lines are stored without the `> `; ChipLine adds it. Time costs are H:MM in the script, so −0:40 is −2400 seconds |
| 2026-11-01 | 2.1 | Scene 07's closing paragraph and two chip lines (printed after the choices in the script) sit at the end of the scene's blocks. "END OF ACT 1" and "WAKE UP AGAIN" are left out (the ending card handles the latter). The Scene 02 "FLATLINE · ENDING 01 / 10" line is a system block |
| 2026-11-01 | 2.1 | Ending id `docs-table`. Planned ids for the rest: `caught`, `tavis-trade`, `drowned`, `flatline`, `sold`, `company-man`, `removed`, `partners`, `merged` (saved in `endingsSeen`, so do not rename) |
| 2026-11-01 | 2.1 | Scene 01's opening chip line follows the Act 3 priority list: the broken default shows only when none of saw_merged, deaths ≥ 5, was_removed, saw_company, saw_sold applies, and exactly one of those variants shows |
| 2026-11-01 | 2.1 | Left out as not player text: the purpose paragraph at the top of every scene, writer's notes, `Sets`/`Gains` lines (turned into effects), and notes like "Tavi stays behind" and "then choose a road" |
| 2026-11-01 | 1.5 | Save format v1 is the `Memory` object as JSON under `flatline:v1`. All data from storage or an import goes through one validator, `parseMemory`, which is also where future migrations go |
| 2026-11-01 | 1.5 | `loadMemory` always returns usable memory plus a status (`loaded`, `empty`, `corrupted`, `unavailable`) so the UI can explain. `saveMemory` returns false when a save did not stick |
| 2026-11-01 | 1.5 | Import replaces progress rather than merging (Emma approved); unreadable saves get overwritten by the next save; save codes are plain base64, not secret. Codes over 10,000 characters are refused |
| 2026-11-01 | 1.5 | Phase 1 (the engine) is complete: conditions, effects and the drain, the run loop, and memory |
| 2026-11-01 | 1.4 | Format change (Emma approved): `Effect.blur?: true` sets the painkiller blur. The blur lasts until the player's next choice, because every `choose` sets `blurred` afresh |
| 2026-11-01 | 1.4 | `choose` returns `{ ok, state }` or `{ ok: false, reason }` (`unknown-choice`, `hidden`, `locked`, `run-over`) and never throws for player input. A missing scene id throws, since that is a story-data bug |
| 2026-11-01 | 1.4 | `gotoIf` is checked against the state before the choice's own cost ("at 1 HP" means arriving at 1 HP). Documented in CLAUDE.md |
| 2026-11-01 | 1.4 | Flatline (scene-16) overrides any destination when time or health is 0, except a destination that is already a death ending. Flatline counts as a death and a flatline |
| 2026-11-01 | 1.4 | `runs` goes up in `endRun` (completed runs), not at `startRun`. `startRun` does not apply scene-01's `onEnter`. Start scene is `scene-01`, flatline is `scene-16` (constants.ts), so Step 2.1 must use those ids |
| 2026-11-01 | 1.3 | Chip drain is derived from the clock: health lost = full hours elapsed after the effect minus before. No stored counter, so no double charge and the same result however time is split up |
| 2026-11-01 | 1.3 | Heal or damage is clamped to 0–5 before the drain is taken, so healing at full health cannot absorb a drain. Time floors at 0 |
| 2026-11-01 | 1.3 | `applyEffect` returns a new state and never mutates. `useItem` removes one copy, ignored if missing. Deciding Flatline at time 0 or health 0 is left to Step 1.4 |
| 2026-11-01 | 1.3 | Added `constants.ts` (engine numbers) and `testState.ts` (shared `makeState` for tests, moved out of conditions.test.ts) |
| 2026-11-01 | 1.2 | Emma updated the script: Scene 08 now sets `memory_taken` and `eye_taken`, and every "→ Act 3" / "→ Act 2: ..." became a scene number (Scene 17 for Act 3). Both open issues are closed |
| 2026-11-01 | 1.2 | `isConditionMet(condition, state)`: `undefined` means always met; a flag matches run or memory flags; `gte`/`lte` are inclusive; a stat condition with no bounds is met; `all: []` is true and `any: []` is false |
| 2026-11-01 | 1.1 | Format change (Emma approved): `Scene.onEnter` holds effects that fire on arrival, so endings can leave memory flags without engine special-cases |
| 2026-11-01 | 1.1 | Format change: `Choice.gotoIf` lists conditional destinations (first match wins, else `goto`), for Scene 13's branching exits |
| 2026-11-01 | 1.1 | Format change: `Condition` gained `{ item }` (painkillers check) and `{ blurred: true }` (blur is a RunState field, not a flag) |
| 2026-11-01 | 1.1 | `deaths`, `flatlines`, `runs` are not in `Effect`; the engine counts them so story files cannot set them wrongly. `Memory.version` is 1 |
| 2026-11-01 | 1.1 | CLAUDE.md's Scene data format section updated to match `types.ts` (Emma asked) |
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

- Script mismatch: Scene 01's was_removed chip line (`you let her cut me out last time. i'm asking you not to let him put me to sleep.`) differs from the Act 3 reference's (`you let her kill me last time.`). I used Scene 01's. The Act 3 reference also shortens the deaths ≥ 5 line to `run six. hi, kade. it's me again.`; I used Scene 01's full line.
- Script mismatch: "run six" is meant to count up with each run (Act 3 reference), but story text is fixed. It is stored as written; needs a small template feature if you want the number to change.
- Format question: when the opening chip line is a variant, the default line is hidden, so "The words aren't on the monitor. They're behind your eyes, flickering like a bad sign." follows no chip line. Read Scene 01 on a later run and tell me if it reads wrong.
- Scene 07 and others point at `scene-08`, `scene-10`, `scene-12` and `scene-13`, which do not exist until Step 4.1. `choose` throws on a missing scene, so Step 2.2's validator must allow those four and Step 2.3 must show a gentle placeholder.
- `npm audit` reports a moderate minimatch advisory inside the ESLint toolchain (dev only, not shipped). The only offered fix downgrades typescript-eslint, so I left it.
