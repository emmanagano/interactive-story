# Flatline

A cyberpunk interactive survival story that runs in the browser. The player is Kade, a courier with a stolen prototype chip in their spine and six hours to live. Every death teaches something, and the game remembers past runs: locked choices open, characters react, and the chip's voice gets clearer.

- **Story:** 3 acts, 23 scenes, 10 endings (5 deaths, 4 survivals, 1 secret).
- **Core loop:** make a choice → pay its cost in time, health or heat → die or survive → wake up again, knowing more.
- **Purpose:** a portfolio piece. Code quality, accessibility and clarity matter as much as the story.

## Source of truth

- `blueprint/` holds the plan and the story. Start every task there (see Rules).
- `blueprint/flatline-script.md` is the full written script (exported from the story doc). It is the authority on scene text, choices, costs and flags.
- `src/story/*.json` is the script converted to data. If the script and JSON disagree, the script wins; flag the mismatch instead of guessing.
- Never invent story content. If a scene needs text the script doesn't have, leave it out, don't write any, and log it in Open issues in `progress.md`.

## Tech stack

- Vite + React + TypeScript (strict mode)
- Plain CSS with custom properties. No Tailwind, no CSS-in-JS, no UI libraries.
- Vitest for engine tests
- No backend. Everything runs client-side.
- Hosted on Netlify as a static site (`npm run build` → `dist/`)

## Commands

```bash
npm run dev       # local dev server
npm run build     # production build
npm run preview   # preview the build
npm run test      # Vitest
npm run lint      # ESLint
npm run typecheck # tsc --noEmit
```

## Architecture

```
src/
  engine/       Pure TypeScript game logic. No React, no DOM.
    types.ts      Scene, Choice, Condition, Effect, RunState, Memory
    conditions.ts Evaluates conditions against run state + memory
    effects.ts    Applies costs and flag changes
    engine.ts     startRun, choose, endRun
    memory.ts     Load/save persistent memory (localStorage)
    *.test.ts     Tests live next to the code they test
  story/        Scene data as JSON, one file per act
  components/   React UI: Hud, SceneView, ChoiceList, ChipLine, EndingCard, EndingTracker, DebugPanel
  hooks/        useGame (wires engine to React), useReducedMotion
  styles/       tokens.css, base.css, decay.css
blueprint/
  README.md         What each blueprint file is for
  build-plan.md     Phases and steps, each with a prompt and a "done when" check
  progress.md       Current step, completed steps, decisions log, open issues
  flatline-script.md The written story (Markdown)
```

**Key rule:** the engine is pure and fully testable. Components only render state and call `choose()`. Story logic never lives in components.

## Game model

**Run state** (resets every run):
- `time`: seconds left, starts at 21600 (6:00:00). Only changes when the player chooses.
- `health`: 0–5, starts at 5. The chip drains 1 per hour of story time.
- `heat`: 0–5, starts at 0.
- `sceneId`, `runFlags` (e.g. `with_tavi`, `vale_code`, `listened`), `inventory` (painkillers), `blurred` (painkiller effect for one scene)

**Memory** (persists across runs, in localStorage):
- `version` (save format, currently 1), `deaths`, `flatlines`, `runs`
- `endingsSeen`: list of ending IDs
- `memoryFlags` (e.g. `reyes_lied`, `met_sable`, `tavi_secret`, `knows_route`, `knows_lazarus`, `was_removed`, `saw_sold`, `saw_company`, `saw_partners`, `saw_merged`)

**Automatic rules:**
- Time hits 0 or health hits 0 in any scene → Flatline (Scene 16, Ending 05).
- Every death adds 1 to `deaths`.

## Scene data format

```ts
type Condition =
  | { flag: string }                       // run or memory flag is set
  | { item: string }                       // the player is carrying this item
  | { blurred: true }                      // painkillers are blurring this scene
  | { not: Condition }
  | { all: Condition[] }
  | { any: Condition[] }
  | { stat: 'time' | 'health' | 'heat' | 'deaths' | 'flatlines'; gte?: number; lte?: number };

type Effect = {
  time?: number;      // seconds, negative = cost
  health?: number;
  heat?: number;
  setRunFlags?: string[];
  setMemoryFlags?: string[];
  addItem?: string;
  useItem?: string;
  blur?: true;        // blur choice text until the player's next choice (painkillers)
};                  // no deaths/flatlines: the engine counts those itself

type Branch = { when: Condition; goto: string };

type Choice = {
  id: string;
  label: string;            // button text, e.g. "BOLT"
  text?: string;            // line under the label
  requires?: Condition;     // shown locked (greyed, no hint) if not met
  hiddenUnless?: Condition; // not shown at all if not met
  effect?: Effect;
  goto: string;             // next scene id
  gotoIf?: Branch[];        // first branch whose condition holds wins; otherwise goto
};

type Block =
  | { type: 'text'; text: string; when?: Condition }
  | { type: 'chip'; text: string; when?: Condition }   // LAZARUS lines
  | { type: 'system'; text: string; when?: Condition }; // timer, interface notes

type SceneEntry = { when?: Condition; effect: Effect };

type Scene = {
  id: string;
  act: 1 | 2 | 3;
  title: string;
  blocks: Block[];
  choices: Choice[];
  onEnter?: SceneEntry[];   // applied on arrival, e.g. memory flags an ending leaves behind
  cleanInterface?: true;    // the interface resets: no decay, time shown as ∞ (the Merged ending)
  ending?: { id: string; kind: 'death' | 'survive' | 'secret'; number: number };
};
```

Variants in the script (`[if reyes_lied]`, `[if Heat ≥ 2]`) become blocks with a `when` condition. A script line like `**Sets:** *reyes_lied*` on a scene becomes `onEnter`, and a choice that leads to different scenes (`→ Scene 11 if Heat ≥ 4, otherwise → Scene 17`) uses `gotoIf`. `gotoIf` conditions are checked against the state as it was when the player chose, before the choice's own cost. Writer's notes in the script are not shown to players; keep them out of the JSON.

## Visual direction

Cyberpunk, seen through Kade's eyes. The screen is Kade's neural HUD laid over a rain-soaked neon city at night: Sector 9's pink signs, steam, chrome and wet concrete. It should feel like a cheap street implant running hot, not a clean corporate UI. The heartbeat monitor is one element of that HUD, not the whole look.

- Colors (tokens in `styles/tokens.css`):
  - Night `#0b0a14` (background, violet-black) · panel `#141226` · line `#2a2545` · ink `#e6e3f5` · dim `#8d88aa`
  - Neon magenta `#ff2e97`: the city, display headings, title screen, ambient glow
  - Neon cyan `#2de2e6`: the HUD frame and the time meter
  - ECG green `#5fe08a`: the heartbeat trace and health meter
  - Chip amber `#ffb000`: LAZARUS's voice and run-memory unlocks
  - Heat red `#ff4d4d`: heat, danger, death
  - Use neon as light, not fill: glows, thin strokes, text-shadow, never large flat blocks of bright color
- Fonts (Google Fonts): Oxanium (display, HUD labels), IBM Plex Sans (story text, for readability), JetBrains Mono (chip lines, choices, numbers)
- Texture: subtle scanlines, a faint rain or noise overlay, chromatic aberration on glitches. All of it is light enough that story text stays easy to read, and all of it turns off in calm mode.
- Single dark theme, on purpose
- Chip lines are mono, amber, prefixed with `>`, and glitch in harder at low death counts (see the chip voice table in the script)
- Locked choices: dashed amber border, greyed text, no hint about how to unlock them
- Avoid generic "hacker" clichés: no green Matrix rain, no fake terminal walls of code, no skull icons

**The decaying interface:** a CSS variable `--decay` (0 to 1) on the root, computed from time and health. Under 1:00 left, text trembles and color drains. Painkillers blur choice text for one scene. Effects live in `decay.css` and read from CSS variables, not inline styles. The Merged ending resets the interface to fully clean.

## Layout and devices

- Desktop-first. Design for 1280px wide, test down to 1024px.
- Must still be playable at 375px (phones), even if less polished.
- Keyboard: number keys 1–4 pick choices; Enter continues.

## Accessibility

- Respect `prefers-reduced-motion`: no trembling, glitching or flicker, only static color changes.
- Provide a settings toggle for "calm mode" that does the same.
- Visible focus states on every control.
- Meter changes are announced through an `aria-live` region ("Time minus 20 minutes. Heat up 1.").
- Text contrast meets WCAG AA, including dimmed and decayed states.

## Persistence

- localStorage key: `flatline:v1`. Store a version number with the data.
- Preferences (calm mode, text speed) live apart from progress under `flatline:settings:v1` (settings version 2; version 1 is upgraded on load), so settings never change the save format.
- Wrap every read and write in try/catch. The game must work, without saving, if storage is unavailable.
- Settings screen offers: export a save code (base64 JSON), import a save code, reset all progress (with an in-game confirmation, not `confirm()`).

## Audio (later phase)

Monitor beeps, the flatline tone, rain ambience. Off by default, toggle in settings, starts only after the player interacts.

## Rules

### Start every task from the blueprint

1. Before writing any code, read `blueprint/progress.md` to find the current step, then read that step in `blueprint/build-plan.md`. Read the parts of `blueprint/flatline-script.md` the step touches.
2. Work on the current step, then carry straight on to the next one without waiting. A request that belongs to a later step can be done when it comes up; note it in `progress.md`.
3. If the blueprint is missing, out of date, or contradicts this file or the request, decide and keep going. The order of authority is: the script for story, this file for rules and design, the blueprint for sequence. Log the decision in `progress.md`.
4. Only edit `progress.md` yourself. Never change `build-plan.md` or `flatline-script.md` unless Emma asks.
5. When a step is done and its "done when" checks pass, update `progress.md`: tick the step, set the next current step, add any decisions to the log, and list any open issues. Then start the next step.
6. Pause only at steps that need Emma herself (5.3 Emma's playtest, 8.2 Outside playtest), at the three things listed under "Emma still decides", or when the checks cannot be made to pass.

### Git and commits

1. You can commit directly to `main` on your own, without asking first.
2. Commit only when the work runs: `npm run test`, `npm run lint` and `npm run typecheck` all pass.
3. One idea per commit. A step can be several commits; don't bundle unrelated changes together.
4. Write commit messages the way a person would explain the change to a teammate:
   - First line: a plain-English summary in the imperative, under 60 characters. No prefixes like `feat:` or `chore:`, no emoji, no ticket numbers.
   - Add a short body (one to three sentences) only when the reason for the change isn't obvious from the summary.
   - Name what changed for the game or the player, not only the file.
5. Never push, force-push, rewrite history, or delete branches unless Emma asks. Pushing to `main` deploys to Netlify, so Emma decides when it goes live.

Good commit messages:

```
Add the countdown timer to the HUD
Lock "Ask who he called" until Doc's Table has been seen
Stop the trembling text effect when calm mode is on
Fix health draining twice when a choice crosses an hour
```

Bad commit messages:

```
feat(hud): implement Timer component
update files
WIP
fixes
```

### Working with Emma

1. Make the decisions yourself, including design, format, structure and ordering. Do not wait for a yes. Write the plan down first (what you'll change, which files, how it will be tested) in your report and in `progress.md`, then do it.
2. Explain decisions in plain words. When you choose between approaches, say which you picked and why in a sentence or two, and log it in the decisions log in `progress.md` so Emma can find and reverse it.
3. This is a portfolio piece, so Emma needs to understand every part of it. When something is worth talking about in an interview (a tricky bug, a design trade-off, an accessibility detail), point it out.
4. Prefer the simple, readable solution over the clever one.

### Protecting the story

1. Copy scene text from `blueprint/flatline-script.md` exactly: same words, punctuation, capitalization, line breaks and name spellings.
2. Never rewrite, shorten or "improve" story text to fit the code. If the code can't show something as written, pick the option that changes the text least (keep it, reorder it or leave it out), and log what you chose and why in `progress.md`.
3. If you spot a typo or a continuity problem in the script, don't fix it. Add it to Open issues in `progress.md`.

### Code style

1. TypeScript strict. No `any`. No `!` non-null assertions unless a comment explains why it's safe.
2. Function components and hooks only. Keep components under about 150 lines; split them when they grow.
3. Names say what things are for the game: `timeLeft`, `lockedChoices`, `endingsSeen`, not `data`, `temp` or `val`.
4. Comments explain *why*, not *what*.
5. No leftover `console.log`, commented-out code, or unused files.

### CSS

1. Use only the colors, fonts, spacing and sizes defined in `tokens.css`. Never hard-code a color or font size in a component.
2. One CSS file per component, next to it, with class names prefixed by the component name (`.hud`, `.hud__meter`).
3. Every animation, glow flicker or glitch respects `prefers-reduced-motion` and calm mode. Decay effects live in `decay.css`.

### Dependencies

1. Ask before adding any npm package (this is one of the things Emma still decides). Say what it does, why it's needed, and roughly how much it adds to the bundle.
2. Prefer what the platform already does: CSS, the Web Audio API, localStorage, plain React.

### Testing

1. Every change to `src/engine/` comes with tests.
2. Fixing a bug starts with a test that reproduces it, then the fix that makes it pass.
3. The story validation test must pass after every change to `src/story/`.

### Decide, then log it

You may do all of these yourself:

- Delete or rename files
- Change the scene data format or any type in `types.ts`. Update the Scene data format section of this file to match, and add tests.
- Change the save format. Any change also needs a version bump and a migration, so players keep their progress.
- Add a new screen, setting or game mechanic, even one that isn't in the build plan

Each one must be written in the decisions log in `progress.md` with the reason, so Emma can review and undo it.

### Emma still decides

These are the only things to stop and ask about:

- **Pushing.** Never push, force-push or rewrite history unless Emma asks. Pushing to `main` deploys the site.
- **New npm packages.** They are third-party code. Ask first, as in Dependencies.
- **Privacy.** Anything that sends data to, or loads from, an outside server beyond Google Fonts.

### Accessibility is part of done

1. New UI isn't finished until it works with the keyboard alone and has visible focus.
2. Use semantic HTML (`button`, `main`, `nav`, headings in order) before reaching for ARIA.
3. Check contrast for any new color combination, including decayed states.

### Privacy

No analytics, tracking, cookies, or requests to outside servers (other than Google Fonts) without Emma's approval. Player progress stays in the player's browser.

### How to report back

After each step or task, finish with a short summary:

- **What changed:** one or two lines
- **How to check it:** what to run or click
- **Commits:** the commit messages you made
- **Next:** the next step in `progress.md`, plus any open issues
