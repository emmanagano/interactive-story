import { describe, expect, it } from 'vitest'
import { choose, createEmptyMemory, startRun } from '../engine'
import type { GameState, Memory } from '../engine'
import { story } from './index'

/** Plays one run from a start state, taking each choice in order, and returns where it ended. */
function play(start: GameState, choiceIds: string[]): GameState {
  return choiceIds.reduce((state, id) => {
    const result = choose(story, state, id)
    if (!result.ok) throw new Error(`"${id}" was refused in ${state.run.sceneId}: ${result.reason}`)
    return result.state
  }, start)
}

const memoryWith = (changes: Partial<Memory>): Memory => ({ ...createEmptyMemory(), ...changes })

// The first stretch of most routes: Bolt out of the clinic, take the stairs, go alone.
const OUT_ALONE = ['bolt', 'flyover-stairs', 'go-alone']
// A quick, healthy way to the last choice, for a player who already knows the tunnel.
const TO_LAST_CHOICE = [...OUT_ALONE, 'pay-mama-ouro', 'pay-with-a-memory', 'continue', 'center-through-the-water', 'continue', 'continue']

type ScriptedRun = {
  ending: string
  memory?: Partial<Memory>
  choices: string[]
}

const scriptedRuns: ScriptedRun[] = [
  { ending: 'docs-table', choices: ['stay'] },
  { ending: 'caught', choices: [...OUT_ALONE, 'break-into-halcyon', 'continue'] },
  {
    ending: 'tavis-trade',
    choices: ['bolt', 'flyover-stairs', 'stay-with-tavi', 'pay-mama-ouro', 'let-tavi-pay', 'let-tavi-go-ahead', 'forgive-them-anyway'],
  },
  { ending: 'drowned', choices: [...OUT_ALONE, 'pay-mama-ouro', 'pay-with-a-memory', 'continue', 'center-through-the-water'] },
  // The script's slowest route runs health to zero around three hours in (an open balance issue).
  { ending: 'flatline', choices: ['bolt', 'storm-drains', 'go-alone', 'break-into-halcyon', 'read-the-files'] },
  { ending: 'sold', choices: [...OUT_ALONE, 'pay-mama-ouro', 'sell-her-the-chip'] },
  { ending: 'company-man', memory: { memoryFlags: ['knows_route'] }, choices: [...TO_LAST_CHOICE, 'open-the-door-for-sable'] },
  { ending: 'removed', memory: { memoryFlags: ['knows_route'] }, choices: [...TO_LAST_CHOICE, 'let-vale-cut-it-out', 'tell-her'] },
  {
    ending: 'partners',
    memory: { memoryFlags: ['tavi_secret', 'knows_route'] },
    choices: ['bolt', 'flyover-stairs', 'ask-about-lina', 'forgive-tavi', 'pay-mama-ouro', 'let-tavi-pay', 'continue', 'center-through-the-water', 'continue', 'continue', 'make-a-deal-for-lina'],
  },
  {
    ending: 'merged',
    memory: { deaths: 2, memoryFlags: ['knows_lazarus'] },
    choices: [...OUT_ALONE, 'listen-to-the-chip', 'keep-moving', 'continue', 'center-through-the-water', 'type-lazarus', 'continue', 'continue', 'let-it-in'],
  },
]

describe('every ending is reachable by a scripted run through the real story', () => {
  it.each(scriptedRuns)('$ending', ({ ending, memory, choices }) => {
    const finished = play(startRun(memoryWith(memory ?? {})), choices)
    expect(finished.memory.endingsSeen).toContain(ending)
    expect(story[finished.run.sceneId].ending?.id).toBe(ending)
  })

  it('covers all ten endings in the story, each exactly once', () => {
    const inStory = Object.values(story).flatMap((scene) => (scene.ending ? [scene.ending.id] : []))
    expect(inStory).toHaveLength(10)
    expect(scriptedRuns.map((run) => run.ending).sort()).toEqual([...inStory].sort())
  })
})

describe('the fastest path to Merged, from the Act 3 reference', () => {
  it('takes three runs: two deaths (one reading the Lab files), then listen, type LAZARUS, let it in', () => {
    // Run 1: die at Doc's Table. That also unlocks "Ask who he called".
    const run1 = play(startRun(createEmptyMemory()), ['stay'])
    expect(run1.memory).toMatchObject({ deaths: 1, endingsSeen: ['docs-table'] })

    // Run 2: use Reyes's office to stay healthy, read the Lab files to learn the name, then
    // take the centre tunnel without the route and drown, which teaches the route.
    const run2 = play(startRun(run1.memory), [
      'ask-who-he-called', 'make-him-help', 'go', 'flyover-stairs', 'go-alone',
      'break-into-halcyon', 'read-the-files', 'continue', 'continue', 'center-through-the-water',
    ])
    expect(run2.memory.deaths).toBe(2)
    expect(run2.memory.memoryFlags).toEqual(expect.arrayContaining(['knows_lazarus', 'knows_route']))

    // Run 3: the chip's route is open (two deaths), and the door answers to its name.
    const run3 = play(startRun(run2.memory), [
      ...OUT_ALONE, 'listen-to-the-chip', 'keep-moving', 'continue', 'center-through-the-water',
      'type-lazarus', 'continue', 'continue', 'let-it-in',
    ])
    expect(story[run3.run.sceneId].ending?.id).toBe('merged')
    expect(run3.memory.runs).toBe(3)
    expect(run3.memory.deaths).toBe(2) // Merged is a survival, so no third death
  })

  it('is not possible any sooner: with one death the chip route is still locked', () => {
    const afterOneDeath = play(startRun(createEmptyMemory()), ['stay']).memory
    expect(() => play(startRun(afterOneDeath), [...OUT_ALONE, 'listen-to-the-chip'])).toThrow('locked')
  })
})
