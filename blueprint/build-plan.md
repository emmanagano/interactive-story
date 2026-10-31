# Flatline build plan

Eight phases over about two weeks. Each step has a prompt to give Claude Code and a check for when it's done. Do the steps in order, and review and commit after each one.

Before you start, put `CLAUDE.md` at the project root, and put this file, the exported script and `progress.md` in the `blueprint/` folder (see `blueprint/README.md`).

**Working rhythm for every step** (Claude Code updates `blueprint/progress.md` at the end of each one):
1. Paste the prompt.
2. Read the plan Claude Code proposes before it writes code.
3. Run it yourself. Check the "Done when" list.
4. Commit with a clear message.

---

## Phase 0 · Setup (day 1)

### Step 0.1 · Scaffold the project
> Read CLAUDE.md. Scaffold a Vite + React + TypeScript project in this folder with strict TypeScript, ESLint, Vitest, and the folder structure from the Architecture section. Add the npm scripts listed under Commands. Leave the folders empty except for placeholder index files. Don't build any game features yet.

**Done when:** `npm run dev`, `npm run build`, `npm run test`, `npm run lint` and `npm run typecheck` all run without errors.

### Step 0.2 · Design tokens and base styles
> Create `src/styles/tokens.css` and `src/styles/base.css` from the Visual direction section of CLAUDE.md: color tokens, the three Google Fonts with fallbacks, a type scale, and spacing tokens. Show a simple test page with each color, font and heading size so I can check them.

**Done when:** the test page shows all tokens, and the fonts load (check the Network tab).

### Step 0.3 · Deploy early
> Add a `netlify.toml` that builds with `npm run build` and publishes `dist`. Tell me the steps to connect this repo to Netlify.

**Done when:** the test page is live on a Netlify URL. Every push to main redeploys.

---

## Phase 1 · The engine (days 1–2)

No UI in this phase. Everything is pure TypeScript with tests.

### Step 1.1 · Types
> Create `src/engine/types.ts` from the Scene data format and Game model sections of CLAUDE.md. Include types for RunState, Memory and a GameState that holds both. Explain any changes you'd suggest to the format before making them.

**Done when:** the types compile, and you understand every field.

### Step 1.2 · Conditions
> Implement `src/engine/conditions.ts` with a function that evaluates a Condition against run state and memory. Write Vitest tests for flag, not, all, any and each stat comparison, including edge cases like missing flags.

**Done when:** all tests pass.

### Step 1.3 · Effects and the automatic rules
> Implement `src/engine/effects.ts`. Applying an effect changes time, health, heat, flags and items, and clamps health and heat to 0–5. Also implement the chip's health drain: 1 health per full hour of story time passed. Write tests, including a test that the drain triggers when a choice crosses an hour boundary.

**Done when:** tests cover costs, clamping, flags, items and the hourly drain.

### Step 1.4 · The run loop
> Implement `src/engine/engine.ts` with `startRun`, `choose` and `endRun`. `choose` checks that the choice is allowed, applies its effect, moves to the next scene, and sends the player to the Flatline scene if time or health hits 0. Reaching an ending scene records the ending and, for deaths, adds 1 to deaths. Use a tiny 3-scene fake story in the tests, not the real one.

**Done when:** tests cover a normal choice, a locked choice being rejected, a death, a survival ending, and a flatline from running out of time.

### Step 1.5 · Memory
> Implement `src/engine/memory.ts`: load, save, reset, export to a save code and import from a save code, using the localStorage rules in CLAUDE.md. Use a versioned format and handle corrupted or missing data safely. Test it with a mocked storage, including storage that throws.

**Done when:** tests pass, including the case where storage is unavailable.

---

## Phase 2 · Act 1, playable and plain (day 3)

### Step 2.1 · Convert Act 1
> Convert Act 1 (Scenes 01–07) from `blueprint/flatline-script.md` into `src/story/act1.json` using the Scene format. Turn every `[if …]` variant into a block with a `when` condition. Leave out writer's notes. Where Act 1 links to Act 2 scenes, point to placeholder scene ids. List anything in the script that didn't fit the format.

**Done when:** the JSON matches the script, and you've read through the list of mismatches.

### Step 2.2 · Story validation
> Write a test that loads every story JSON file and checks: every `goto` points to a real scene, every scene has at least one choice or is an ending, every flag used in a condition is set somewhere, and ending ids are unique. Allow the Act 2 placeholders for now.

**Done when:** the test passes for Act 1. This test will catch broken links in every later phase.

### Step 2.3 · Minimal UI
> Build `useGame`, `SceneView` and `ChoiceList` so Act 1 is playable with no styling beyond the base styles: scene text, chip lines, choices, locked choices shown greyed out, and a restart button after an ending. Add number-key shortcuts for choices.

**Done when:** you can play from the clinic to the Night Market, die at Doc's Table, restart, and see "Ask who he called" unlocked.

---

## Phase 3 · The HUD and the decay (days 4–5)

### Step 3.1 · The HUD
> Build the `Hud` component: time as HH:MM:SS, health as 5 bars, heat as 0/5, and the endings count. When a meter changes, animate the change briefly and announce it in an aria-live region, as described in the Accessibility section.

**Done when:** every choice visibly and audibly (with a screen reader) updates the meters.

### Step 3.2 · Cyberpunk styling
> Style the game to match the Visual direction section: the neon city backdrop, the HUD frame, scanlines and texture, chip lines, choice buttons, locked choices and the scene header. Keep story text easy to read. Desktop-first at 1280px, still usable at 375px. Show me screenshots at both widths.

**Done when:** it feels like looking through Kade's implant at Sector 9, and a full scene is still comfortable to read, at both widths.

### Step 3.3 · The decaying interface
> Implement `--decay` from time and health, and the effects in `decay.css`: trembling text and draining color under 1:00, and the painkiller blur on choice text for one scene. Honor prefers-reduced-motion and add a calm mode toggle. Add a temporary control that lets me set time and health by hand to preview the decay.

**Done when:** decay gets visibly worse as time runs out, and it turns into static color changes only in calm mode.

### Step 3.4 · Ending cards and the tracker
> Build `EndingCard` (the FLATLINE / ENDING screen with its final chip line) and `EndingTracker` showing found endings and locked silhouettes, like "ENDINGS 2/10".

**Done when:** the tracker survives a page reload.

---

## Phase 4 · Acts 2 and 3 (days 6–7)

### Step 4.1 · Convert Act 2
> Convert Act 2 (Scenes 08–16) into `src/story/act2.json`. Replace the Act 1 placeholders with real links. Implement the travel costs into Scene 13 and the Flatline vision table in Scene 16 (the vision depends on the flatlines count). List any mismatches.

**Done when:** the validation test passes for Acts 1 and 2.

### Step 4.2 · Convert Act 3
> Convert Act 3 (Scenes 17–23) into `src/story/act3.json`. Implement the Scene 19 rule that Removed is locked under 1:00 left, and the Scene 01 chip-line priority list from the Act 3 reference.

**Done when:** the validation test passes for all three acts, with no placeholders left.

### Step 4.3 · Special effects from the script
> Implement the story's one-off effects: Ouro's eye payment darkening the left third of the screen for the rest of the run, struck-through Tavi lines after the memory payment, the typed LAZARUS input at Vale's door in Scene 17, and the interface reset in the Merged ending. Tell me if any of them need a change to the Scene format.

**Done when:** each effect works in play.

---

## Phase 5 · Debug panel and full playtest (day 8)

### Step 5.1 · Debug panel
> Build a `DebugPanel`, available only in development or with `?debug` in the URL. It lets me jump to any scene, set any flag, set deaths and flatlines, set time, health and heat, and reset memory.

**Done when:** you can jump to Scene 19 with Merged unlocked in under 10 seconds.

### Step 5.2 · Path tests
> Write engine tests that play scripted runs through the real story and check each of the 10 endings is reachable. Include the fastest path to Merged from the Act 3 reference.

**Done when:** all 10 endings are covered by tests.

### Step 5.3 · Your playtest
No prompt. Play at least five full runs yourself. Note anything that feels slow, confusing or unfair, and bring the list back for changes.

---

## Phase 6 · Polish and accessibility (days 9–10)

### Step 6.1 · Text reveal and transitions
> Add a typewriter-style reveal for scene text and a scramble-to-resolve effect for chip lines, with a "show all text" option on click or keypress. Add a short transition between scenes. All of it must turn off with reduced motion or calm mode.

**Done when:** it feels alive, and it can be skipped instantly.

### Step 6.2 · Title and settings screens
> Build a title screen (FLATLINE in neon over the rainy city, the ECG line, Start or Continue) and a settings screen with calm mode, text speed, sound (disabled until Phase 7), export and import save code, and reset progress with an in-game confirmation.

**Done when:** a new player can start without instructions, and a returning player sees Continue.

### Step 6.3 · Accessibility audit
> Audit the game for accessibility: keyboard-only play from title to an ending, focus order and visibility, screen reader output for scenes, chip lines and meter changes, color contrast in normal and decayed states, and reduced motion. Fix what you find and list what you changed.

**Done when:** you can finish a run with only the keyboard and a screen reader.

---

## Phase 7 · Audio (day 11)

### Step 7.1 · Sound
> Add audio as described in the Audio section of CLAUDE.md: a monitor beep that speeds up as time runs out, the flatline tone on death, and rain ambience. Off by default, with a toggle in settings and a volume control. Use small, freely licensed files or generate the tones with the Web Audio API, and tell me the license for any file you add.

**Done when:** sound adds tension and never plays before you turn it on.

---

## Phase 8 · Ship it (days 12–14)

### Step 8.1 · Performance and meta tags
> Check the production build: bundle size, font loading, Lighthouse scores. Add a page title, description, favicon and social preview tags so the link looks good when shared.

**Done when:** Lighthouse is 90+ for performance and accessibility, and a shared link shows a preview.

### Step 8.2 · Outside playtest
No prompt. Send the Netlify link to two or three people. Watch at least one of them play if you can. Bring the notes back for one round of changes.

### Step 8.3 · README for your portfolio
> Write a README covering what Flatline is, the stack, how the engine and run memory work, the accessibility features, and how to run it locally. Include a short section on interesting technical decisions I could talk about in an interview.

**Done when:** you could explain every section of it in an interview.
