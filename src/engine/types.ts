export type StatName = 'time' | 'health' | 'heat' | 'deaths' | 'flatlines'

export type Condition =
  | { flag: string } // run or memory flag is set
  | { item: string } // the player is carrying this item
  | { blurred: true } // painkillers are blurring this scene
  | { not: Condition }
  | { all: Condition[] }
  | { any: Condition[] }
  | { stat: StatName; gte?: number; lte?: number }

export type Effect = {
  time?: number // seconds, negative = cost
  health?: number
  heat?: number
  setRunFlags?: string[]
  setMemoryFlags?: string[]
  addItem?: string
  useItem?: string
  blur?: true // blur choice text until the player's next choice (painkillers)
  // deaths, flatlines and runs are deliberately absent: the engine counts them
  // automatically, so a story file cannot get them wrong.
}

export type Branch = {
  when: Condition
  goto: string
}

export type Choice = {
  id: string
  label: string // button text, e.g. "BOLT"
  text?: string // line under the label
  requires?: Condition // shown locked (greyed, no hint) if not met
  hiddenUnless?: Condition // not shown at all if not met
  effect?: Effect
  goto: string // next scene id
  gotoIf?: Branch[] // first branch whose condition holds wins; otherwise goto
}

export type Block =
  | { type: 'text'; text: string; when?: Condition }
  | { type: 'chip'; text: string; when?: Condition } // LAZARUS lines
  | { type: 'system'; text: string; when?: Condition } // timer, interface notes

export type EndingKind = 'death' | 'survive' | 'secret'

export type Ending = {
  id: string
  kind: EndingKind
  number: number
}

export type SceneEntry = {
  when?: Condition
  effect: Effect
}

export type Scene = {
  id: string
  act: 1 | 2 | 3
  title: string
  blocks: Block[]
  choices: Choice[]
  onEnter?: SceneEntry[] // applied on arrival, e.g. memory flags an ending leaves behind
  cleanInterface?: true // the interface resets: no decay, time shown as ∞ (the Merged ending)
  ending?: Ending
}

/** Resets every run. */
export type RunState = {
  time: number // seconds left
  health: number // 0–5
  heat: number // 0–5
  sceneId: string
  runFlags: string[]
  inventory: string[]
  blurred: boolean // painkiller effect, lasts one scene
}

/** Persists across runs in localStorage. */
export type Memory = {
  version: 1 // bump with a migration whenever the saved shape changes
  deaths: number
  flatlines: number
  runs: number
  endingsSeen: string[]
  memoryFlags: string[]
}

export type GameState = {
  run: RunState
  memory: Memory
}

/** Every scene in the game, looked up by id. */
export type Story = Record<string, Scene>

export type ChooseRefusal =
  | 'unknown-choice' // no such choice in the current scene
  | 'hidden' // hiddenUnless is not met
  | 'locked' // requires is not met
  | 'run-over' // the current scene is an ending

export type ChooseResult =
  | { ok: true; state: GameState }
  | { ok: false; reason: ChooseRefusal }
