# Progress

**Current step:** 5.3 · Emma's playtest (needs Emma)

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
- [x] 2.3 Minimal UI

### Phase 3 · The HUD and the decay
- [x] 3.1 The HUD
- [x] 3.2 Cyberpunk styling
- [x] 3.3 The decaying interface
- [x] 3.4 Ending cards and the tracker

### Phase 4 · Acts 2 and 3
- [x] 4.1 Convert Act 2
- [x] 4.2 Convert Act 3
- [x] 4.3 Special effects from the script

### Phase 5 · Debug panel and full playtest
- [x] 5.1 Debug panel
- [x] 5.2 Path tests
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
| 2026-11-01 | 5.2 | `story/endings.test.ts` plays one scripted run to each of the ten endings through the real story and checks the ten ids match the story's own ending list. A three-run campaign follows the Act 3 reference's fastest path to Merged: Doc's Table, then Reyes's office, the Lab files and a drowning (two deaths, the name and the route learned), then listen, type LAZARUS, let it in. A second test shows the chip route is still locked after one death |
| 2026-11-01 | 5.2 | Checked the tests can fail: renaming `door_lazarus` in Merged's lock made four tests fail (this one, the Act 3 test, and the story checker). The older route tests in `acts.test.ts` stay; they check details (costs, flags) that this file does not |
| 2026-11-01 | 5.2 | The Flatline path in the table is the script's slowest route, which runs health to zero around three hours in. It is there on purpose and ties to the open balance issue |
| 2026-11-01 | 5.1 | Debug panel (dev or `?debug` only; verified hidden in the production build without it). Logic is pure and tested: `applyDebugPatch` clamps and replaces, `listStoryFlags` reads flags and items from the scenes. Presets live in `story/debugPresets.ts` and a test fails if one names a flag the story cannot set |
| 2026-11-01 | 5.1 | Debug changes to past runs are saved, so a reload keeps the tracker and unlocks. "Reset memory" clears the save. The temporary decay sliders were removed. Verified: preset, then "Let it in", reaches Merged in about a second of browser time |
| 2026-11-01 | 4.3 | Format change (Emma delegated): `Scene.cleanInterface?: true`. Scene 23 sets it. It forces `--decay` to 0 and the HUD to "TIME ∞ / full health / HEAT 0", and announces "Interface restored…". Validated, documented in CLAUDE.md |
| 2026-11-01 | 4.3 | Eye payment: a black veil over the left third (14vw on phones) with the story column moved into the rest, not laid over the words. A true overlay would put dim text under AA contrast. The veil closes over 1.2s (not in calm mode or reduced motion) and disappears with the run |
| 2026-11-01 | 4.3 | Memory payment: the text parser reads `~~struck~~` (struck and dimmed). Scene 23 has a plain and a struck version of the memories paragraph, chosen by `memory_taken`. The script has no other line after Scene 08 that mentions the grid-power night |
| 2026-11-01 | 4.3 | Typed LAZARUS stays a locked choice (a free-typed word would let players guess past the lock), and terminal lines now type out left to right |
| 2026-11-01 | 4.3 | Chip glitch strength follows deaths through `chipVoice` (0: broken and cutting out, 1–2: clear, 3–4: human, 5+: calm, no glitch). It is a style, so no chip text is changed. `data-chip-voice` is set on the root |
| 2026-11-01 | 4.3 | Fix found while testing: `main.tsx` loaded the token stylesheet after the app's, so token overrides in component CSS lost. The shared styles now load first |
| 2026-11-01 | 4.3 | Not done (not in the build plan): Scene 16's "text slides sideways, words lose their letters". Candidate for Phase 6 polish |
| 2026-11-01 | 4.2 | Act 3 is `src/story/act3.json`: scenes 17–23 plus `scene-17-lazarus` (typing LAZARUS), `scene-21-end` (after Tell her / Don't) and the endings `company-man`, `removed`, `partners`, `merged`. 153 player-facing lines were checked against the script word for word, none missing. All ten endings now exist, numbered 1–10 (5 deaths, 4 survivals, 1 secret) |
| 2026-11-01 | 4.2 | Scene 17: the three ways in are an else-if chain (vale_code, else vale_hint, else forced). The forced way is `continue-forced`: −0:20 and the `distrustful` flag. Typing LAZARUS is a locked choice that leads to its own scene and sets `door_lazarus`. Enter takes `continue` or `continue-…` |
| 2026-11-01 | 4.2 | Inline backtick text (`` `> okay,` the screen says. ``) now renders as amber mono, and terminal lines like `**`IDENTIFY YOURSELF.`**` are system blocks. The text keeps its marks exactly as in the script |
| 2026-11-01 | 4.2 | Time-skip captions (SIX WEEKS LATER, MORNING, DAWN, THE PLATFORM) are bold text blocks, like "ONE WEEK LATER". Scene 19's Removed choice needs `time ≥ 3600`, and under that Vale's line shows (the note "This option is shown greyed out." was dropped from it) |
| 2026-11-01 | 4.2 | Company Man sets `saw_company` and Merged sets `saw_merged` even though their scenes have no Sets line, because the Act 3 table says the next run remembers them. LET IT IN keeps its line "Stop fighting it." under the locked choice, since the script gives it |
| 2026-11-01 | 4.2 | `story/index.ts` lists acts by hand instead of using `import.meta.glob` (Vitest cached the glob and missed act3.json). A story test fails if an act file exists that index.ts does not load. Both placeholder lists are now empty |
| 2026-11-01 | 4.2 | A search-and-replace broke the locked-choice guard on number keys for one commit; the existing test caught it and a follow-up commit fixed it |
| 2026-11-01 | 4.1 | Act 2 is `src/story/act2.json`: scenes 08–16 plus sub-scenes `scene-10-files` (The files), `scene-13-tunnels` (Part 2) and `scene-14-end` (the single ending after Tavi's fake choice). 148 player-facing lines were checked against the script word for word, none missing. Ending ids: `sold`, `caught`, `tavis-trade`, `drowned`, `flatline` |
| 2026-11-01 | 4.1 | Travel to Scene 13 is folded into the choices that lead there (−0:45 from Ouro, −1:00 from the Lab). Checked against the script's clock check: fastest route reaches Act 3 at T+2:05 exactly, and the slowest at T+3:55 |
| 2026-11-01 | 4.1 | "→ Scene 11" after the Heat ≥ 3 elevator paragraph is a CONTINUE choice (id `continue`, label "CONTINUE", the only word added to the data and it is UI, not story). The rest of Scene 10 is hidden at Heat ≥ 3. Enter presses a lone `continue`. Same pattern lets Scene 13 move on to the tunnels and the files move on to Scene 13 |
| 2026-11-01 | 4.1 | "Tavi named it a trap" is exactly "with_tavi and tavi_forgiven" (the only branch where Tavi says it), so LEFT, TO THE GATE uses that condition and no new flag. CENTER's "without either, or at 1 HP, or blurred" is a single `not all(...)` branch, checked before the choice's own cost |
| 2026-11-01 | 4.1 | Scene 16's table became five variants keyed on `flatlines` (1st, 2nd, 3rd, 4th, 5+). The count already includes the current flatline when the scene is shown, so the 1st flatline shows "White light…" |
| 2026-11-01 | 4.1 | Engine fix with a test first: a choice that ran out the clock and led to a scene not written yet threw `MissingSceneError`; it now still lands on Scene 16 |
| 2026-11-01 | 4.1 | The story test reads the story folder at run time instead of `import.meta.glob`, because Vitest cached the glob and silently skipped the new act2.json. `tsconfig.app.json` now includes Node types for that one test |
| 2026-11-01 | 4.1 | Left out as notes: the first paragraph of every scene, `Sets`, Writer's notes, the italic "(Either choice leads to the same ending…)", "**What the player sees next…**", the bold ending banners and WAKE UP AGAIN. Bullets (`- **Left:** …`) became three plain paragraphs. The stall-sable subtitle "call him back, keep him talking" is treated as a note, like Scene 03's locked choice |
| 2026-11-01 | 3.4 | The ending banner is generated by `endingHeader(ending, sceneTitle)` in three script patterns (death: "FLATLINE · ENDING 01 / 10 · NAME", survive and secret: "ENDING 06 / 10 · NAME", Flatline: "FLATLINE · ENDING 05 / 10", no name). A test pins all ten to the script's exact lines |
| 2026-11-01 | 3.4 | For Steps 4.1 and 4.2: do NOT convert the bold banner line (`**ENDING 06 / 10 · SOLD**` etc.) or "WAKE UP AGAIN" into the JSON. The card and button write them, and the story checker now fails if a banner line is in the story. This replaces the Step 2.1 decision to keep Scene 02's banner as a system block (it was removed) |
| 2026-11-01 | 3.4 | An ending scene must end its blocks with the closing chip line (the card shows it). The ending name is the scene's `title`, and the tracker reads names, kinds and numbers from the scenes, so endings need no separate list |
| 2026-11-01 | 3.4 | Tracker slots show ten entries; unfound ones are anonymous ("02 ???", with "Ending 2, not found yet" for screen readers) so nothing is spoiled. Found slots are bordered red, green or amber by kind. Verified in headless Chrome: die, reload, tracker still shows the ending |
| 2026-11-01 | 3.4 | Phase 3 is complete: HUD, styling, decay and ending cards |
| 2026-11-01 | 3.3 | `computeDecay` (engine/decay.ts): time adds decay linearly in the last hour (under 1:00:00), health adds it linearly below 3 HP, and the two combine as 1−(1−t)(1−h). Full at 0 time or 0 health. Merged (Step 4.3) must force it to 0 |
| 2026-11-01 | 3.3 | Colour drain is static and stays in calm mode. Trembling, red/cyan ghosting and the painkiller blur are off in calm mode, and trembling and ghosting are also off under prefers-reduced-motion. Calm mode removes the blur (a mechanic, but the `blurred` flag still works) |
| 2026-11-01 | 3.3 | Calm mode is saved under its own key, `flatline:settings:v1`, so the save format did not change. On a first visit it follows prefers-reduced-motion. A plain "Calm mode" switch sits beside the title until Step 6.2 builds the settings screen |
| 2026-11-01 | 3.3 | Contrast at full drain (saturate 0.15) was computed: ink 15.6/14.6, dim 5.8/5.5, cyan 10.4/9.7, green 10.7/10.0, amber 9.5/8.9 on night/panel, all AA. Red fell to 4.2/3.9, so the heat value is large text (24px, 3:1). Magenta (3.3/3.1) is only used at 30px and up |
| 2026-11-01 | 3.3 | The decay preview sliders show only in development or with `?debug` in the address, and write time and health straight into the run (skipping engine rules). Step 5.1's debug panel should replace them |
| 2026-11-01 | 3.3 | Verified in headless Chrome: decay 0 → no animation or filter; 30 min → 0.5, trembling, saturate .575; 5 min and 1 HP → 0.97; calm on → no animation, drain kept and saved; emulated reduced-motion → no animation; first visit with reduced-motion → calm on |
| 2026-11-01 | 3.2 | The city is CSS plus `src/assets/skyline.svg`, used only as a mask (its `#000` fill is never shown, so no real color is hard-coded). Texture lives in one `Backdrop` component: skyline, windows, sign glows, rain, noise, scanlines |
| 2026-11-01 | 3.2 | All motion is inside `@media (prefers-reduced-motion: no-preference)` and `:root:not([data-calm])`, and the texture hides under `:root[data-calm]`. Step 3.3's calm-mode toggle only has to set `data-calm` on the root |
| 2026-11-01 | 3.2 | New tokens: translucent `--glass-*`, `--haze-*`, `--scanline`, `--rain-streak` (all `color-mix` of the existing colors), `--measure` (story column, 40rem), `--hud-clearance`, `--aberration`. The body is transparent so the fixed backdrop shows through |
| 2026-11-01 | 3.2 | The HUD is sticky so time and health stay visible while reading; `scroll-padding-top` keeps focused items from hiding under it. Scene title takes focus without an outline (it is a heading, not a control) |
| 2026-11-01 | 3.2 | Checked in headless Chrome at 1280 and 375 pixels: no horizontal scroll, HUD is a two-by-two grid on phones, choice buttons are at least 2.75rem tall |
| 2026-11-01 | 3.1 | Announcements are pure functions (`runChanges.ts`): "Time minus 20 minutes. Heat up 1." Order is always time, health, heat. A new run announces "New run. 06:00:00 left. Health 5. Heat 0." |
| 2026-11-01 | 3.1 | The live region adds an invisible space on alternate choices so two identical sentences in a row are still announced (a live region only speaks when its text changes) |
| 2026-11-01 | 3.1 | Changed meters pulse for 0.5s only when `prefers-reduced-motion: no-preference`, and keep a static glow either way. Step 3.3's calm mode must also switch the pulse off |
| 2026-11-01 | 3.1 | Hud is a `dl` (time, health, heat, endings) so the labels are read with their values. Health is five bars with an aria-label ("Health 3 of 5"). Endings total is `TOTAL_ENDINGS = 10` in constants.ts |
| 2026-11-01 | 3.1 | Verified in headless Chrome: BOLT announces "Time minus 5 minutes. Health down 1. Heat up 1." and the stairs announce "Time minus 20 minutes. Heat up 1." |
| 2026-11-01 | 2.3 | Logic stays out of components: `view.ts` in the engine decides visible blocks, hidden vs locked choices and which key picks which choice (all tested). `useGame` only holds state and saves when a run ends |
| 2026-11-01 | 2.3 | `MissingSceneError` is thrown for a goto to a scene that does not exist. `useGame` catches it, shows a notice and stays in the scene, so Act 1's exits into unwritten Act 2 do not crash. Remove the notice once Act 2 exists |
| 2026-11-01 | 2.3 | Locked choices use `aria-disabled`, not `disabled`, so keyboard and screen-reader users can still find them. They announce "(locked)" and give no hint how to unlock |
| 2026-11-01 | 2.3 | Number keys 1–4 follow the order of the choices on screen, and a locked or missing one does nothing. Enter wakes up again after an ending (the button takes focus too). Focus moves to the scene title after each choice |
| 2026-11-01 | 2.3 | Bold and italic marks are parsed by a 20-line helper (`parseEmphasis`), no Markdown library. The temporary token page was deleted, replaced by the game. The plain "Time · Health · Heat" line in App is temporary until Step 3.1 |
| 2026-11-01 | 2.3 | Tested by playing in headless Chrome over the DevTools protocol (keys, reload, save): STAY → Doc's Table → Enter → "Ask who he called" unlocked and still unlocked after reload. Components are checked by rendering to a string, so no testing-library package was added |
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
- Act 1's exits into `scene-08`, `scene-10`, `scene-12` and `scene-13` show a "not written yet" notice for now. Remove the notice (`reachedUnwrittenScene` in useGame and GameNotices) and the entries in `placeholders.ts` as Step 4.1 adds those scenes.
- Balance, for Emma: the script's slowest route (Bolt, Storm Drains, Lina, Halcyon files) puts health at 0 around T+3:00, so it flatlines before the tunnels. Start 5, Bolt −1, Storm Drains −1, then the chip drains 1 per hour. The script says players reach the tunnels with "2 HP or less". Not changed: it is your numbers to adjust.
- Script, for Emma: `[if blurred]` in Scene 15 and the "blurred by painkillers" branch of CENTER can never be true. The only painkiller choice is in Scene 04 and the blur lasts one choice. Written as the script has it. Do you want painkillers usable in Scene 13?
- Script, for Emma: Scene 13 says "The timer: **01:58:12**." as fixed text, but the real time varies. Stored as written, like "run six".
- Script, for Emma: "Tavi's jaw tightens · they say nothing for the rest of the act" (KEEP TAVI CLOSE) is stored as nothing. It describes a change to Tavi's later lines that no scene uses. Sold (Scene 09) ends with prose, not a chip line, so its card shows only the banner.
- Script, for Emma: I left out three lines of authoring instruction instead of showing them to players: "The timer in your vision (shown here at a typical value): **01:05:00**." (Scene 19), "*(If the player waits too long, the clock decides for them…)*" (Scene 19) and "*(The interface, which has been decaying all game, resets… The HUD now reads HEALTH ▮▮▮▮▮ · TIME ∞ · HEAT 0.)*" (Scene 23). The last one is for Step 4.3. Say if any of them should be shown after all.
- Script, for Emma: Scene 17 lists "[if vale_code]", "[if vale_hint]" and "[otherwise]". I read them as else-if, so a player with both sees only the code text. The "Nothing you type works… rifle" paragraph shows before the player picks Type LAZARUS, because the script writes it that way.
- Script, for Emma: the memory payment's struck-through lines can never appear in play. The only line after Scene 08 that mentions the grid-power night is in Merged, and Merged needs `listened` (Scene 12) while the memory payment (`memory_taken`) is Scene 08, and Scene 07 only lets a run take one of those roads. The effect is built and tested, but unreachable. Options: write Tavi lines that mention the night in Scenes 13, 14 or 18, or let the memory payment's flag reach Merged another way. I did not write story text.
- `npm audit` reports a moderate minimatch advisory inside the ESLint toolchain (dev only, not shipped). The only offered fix downgrades typescript-eslint, so I left it.
