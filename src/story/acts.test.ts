import { describe, expect, it } from 'vitest'
import { choose, createEmptyMemory, startRun, visibleBlocks } from '../engine'
import type { GameState, Memory } from '../engine'
import { story } from './index'

// Plays the real story through the engine along the routes Act 2 depends on.
function take(state: GameState, ...choiceIds: string[]): GameState {
  return choiceIds.reduce((current, id) => {
    const result = choose(story, current, id)
    if (!result.ok) throw new Error(`"${id}" was refused in ${current.run.sceneId}: ${result.reason}`)
    return result.state
  }, state)
}

const freshRun = (memory: Memory = createEmptyMemory()) => startRun(memory)

describe('Act 2 routes', () => {
  it('the Lab at Heat 3 drops the player into Caught, after a CONTINUE', () => {
    // Bolt (+1), stairs (+1), Break into Halcyon (+1) arrives at Heat 3.
    const atLab = take(freshRun(), 'bolt', 'flyover-stairs', 'go-alone', 'break-into-halcyon')
    expect(atLab.run).toMatchObject({ sceneId: 'scene-10', heat: 3 })
    const choicesHere = story['scene-10'].choices.filter((choice) => choice.id === 'continue')
    expect(choicesHere).toHaveLength(1)
    const caught = take(atLab, 'continue')
    expect(caught.run.sceneId).toBe('scene-11')
    expect(caught.memory).toMatchObject({ deaths: 1, endingsSeen: ['caught'], memoryFlags: ['met_sable'] })
  })

  it('reading the files teaches LAZARUS and moves on to the tunnels', () => {
    // A second run, so Reyes's office is open and Kade keeps full health: no Bolt, no storm drains.
    const memory: Memory = { ...createEmptyMemory(), memoryFlags: ['reyes_lied'] }
    const atLab = take(freshRun(memory), 'ask-who-he-called', 'leave-now', 'flyover-stairs', 'go-alone', 'break-into-halcyon')
    expect(atLab.run).toMatchObject({ sceneId: 'scene-10', heat: 2 })
    const reading = take(atLab, 'read-the-files')
    expect(reading.run.sceneId).toBe('scene-10-files')
    expect(reading.memory.memoryFlags).toContain('knows_lazarus')
    expect(take(reading, 'continue').run.sceneId).toBe('scene-13')
  })

  it('the script clock check holds: the fastest route reaches Act 3 with 3:55 left', () => {
    // Bolt, stairs, go alone, pay Ouro, pay with a memory, then the centre tunnel with the route known.
    const memory: Memory = { ...createEmptyMemory(), memoryFlags: ['knows_route'] }
    const atTunnels = take(freshRun(memory), 'bolt', 'flyover-stairs', 'go-alone', 'pay-mama-ouro', 'pay-with-a-memory', 'continue')
    const centre = story['scene-13-tunnels'].choices.find((choice) => choice.id === 'center-through-the-water')
    const elapsedBeforeTunnel = 21600 - atTunnels.run.time
    expect(elapsedBeforeTunnel + -(centre?.effect?.time ?? 0)).toBe((2 * 60 + 5) * 60) // T+2:05
    const atAct3 = take(atTunnels, 'center-through-the-water')
    expect(atAct3.run.sceneId).toBe('scene-17')
    expect(atAct3.run.time).toBe((3 * 60 + 55) * 60) // 3:55 left
  })

  it('the centre tunnel without the route drowns the player and teaches the route', () => {
    const atTunnels = take(freshRun(), 'bolt', 'flyover-stairs', 'go-alone', 'pay-mama-ouro', 'pay-with-a-memory', 'continue')
    const drowned = take(atTunnels, 'center-through-the-water')
    expect(drowned.run.sceneId).toBe('scene-15')
    expect(drowned.memory).toMatchObject({ endingsSeen: ['drowned'], memoryFlags: ['knows_route'] })
  })

  it('knowing the route, or having listened, makes the centre tunnel safe', () => {
    const listened = take(freshRun({ ...createEmptyMemory(), deaths: 2 }), 'bolt', 'flyover-stairs', 'go-alone', 'listen-to-the-chip', 'keep-moving', 'continue')
    expect(listened.run.runFlags).toContain('listened')
    expect(take(listened, 'center-through-the-water').run.sceneId).toBe('scene-17')
  })

  it('letting Tavi go ahead leads to Tavi\'s Trade whichever way the fake choice goes', () => {
    const betrayed = take(freshRun(), 'bolt', 'flyover-stairs', 'stay-with-tavi', 'pay-mama-ouro', 'let-tavi-pay', 'let-tavi-go-ahead')
    expect(betrayed.run.sceneId).toBe('scene-14')
    const forgave = take(betrayed, 'forgive-them-anyway')
    const silent = take(betrayed, 'say-nothing')
    for (const end of [forgave, silent]) {
      expect(end.run.sceneId).toBe('scene-14-end')
      expect(end.memory).toMatchObject({ deaths: 1, endingsSeen: ['tavis-trade'], memoryFlags: ['tavi_secret'] })
    }
    expect(forgave.run.runFlags).toContain('forgave')
    expect(silent.run.runFlags).toContain('silent')
  })

  it('Tavi forgiven names the gate as a trap, so the gate leads to Caught', () => {
    const forgiven = take(freshRun({ ...createEmptyMemory(), memoryFlags: ['tavi_secret'] }), 'bolt', 'flyover-stairs', 'ask-about-lina', 'forgive-tavi', 'pay-mama-ouro', 'let-tavi-pay')
    const atTunnels = take(forgiven, 'continue')
    expect(atTunnels.run.sceneId).toBe('scene-13-tunnels')
    expect(take(atTunnels, 'left-to-the-gate').run.sceneId).toBe('scene-11')
  })

  it('Ouro buying the chip is a survival that teaches LAZARUS', () => {
    const sold = take(freshRun(), 'bolt', 'flyover-stairs', 'go-alone', 'pay-mama-ouro', 'sell-her-the-chip')
    expect(sold.run.sceneId).toBe('scene-09')
    expect(sold.memory).toMatchObject({ deaths: 0, endingsSeen: ['sold'], memoryFlags: ['knows_lazarus', 'saw_sold'] })
  })

  it('eye and memory payments set the flags the later acts read', () => {
    const eye = take(freshRun(), 'bolt', 'flyover-stairs', 'go-alone', 'pay-mama-ouro', 'pay-with-your-eye')
    expect(eye.run.runFlags).toEqual(expect.arrayContaining(['eye_taken', 'vale_code']))
    const memory = take(freshRun(), 'bolt', 'flyover-stairs', 'go-alone', 'pay-mama-ouro', 'pay-with-a-memory')
    expect(memory.run.runFlags).toEqual(expect.arrayContaining(['memory_taken', 'vale_code']))
  })

  it('a flatline on the way into Act 3 still reaches Scene 16, showing the first vision', () => {
    // Five minutes left, then the 40-minute crawlway: the clock runs out on the way to Act 3.
    const nearlyOut: GameState = { ...freshRun(), run: { ...freshRun().run, time: 300, sceneId: 'scene-13-tunnels' } }
    const flat = take(nearlyOut, 'right-the-crawlway')
    expect(flat.run.sceneId).toBe('scene-16')
    expect(flat.memory).toMatchObject({ deaths: 1, flatlines: 1, endingsSeen: ['flatline'] })
    const vision = visibleBlocks(story['scene-16'], flat).map((block) => block.text)
    expect(vision).toContain('White light. The smell of coffee. Nothing else.')
    expect(vision.filter((text) => text.startsWith('A long white room'))).toHaveLength(0)
  })
})

describe('Act 3 and the four survival endings', () => {
  const withMemory = (deaths: number, ...memoryFlags: string[]): GameState =>
    freshRun({ ...createEmptyMemory(), deaths, memoryFlags })

  // A fast, healthy route to the last choice: Ouro's memory, then the centre tunnel with the route known.
  const toLastChoice = (start: GameState) =>
    take(start, 'bolt', 'flyover-stairs', 'go-alone', 'pay-mama-ouro', 'pay-with-a-memory', 'continue', 'center-through-the-water', 'continue', 'continue')

  it('Company Man: opening the door to Sable remembers saw_company', () => {
    const atChoice = toLastChoice(withMemory(1, 'knows_route'))
    expect(atChoice.run.sceneId).toBe('scene-19')
    const done = take(atChoice, 'open-the-door-for-sable')
    expect(done.memory).toMatchObject({ deaths: 1, endingsSeen: ['company-man'] })
    expect(done.memory.memoryFlags).toContain('saw_company')
  })

  it('Removed: with an hour left Vale can cut it out, and the chip leaves was_removed behind', () => {
    const atChoice = toLastChoice(withMemory(1, 'knows_route'))
    const told = take(atChoice, 'let-vale-cut-it-out', 'tell-her')
    const silent = take(atChoice, 'let-vale-cut-it-out', 'dont')
    for (const end of [told, silent]) {
      expect(end.run.sceneId).toBe('scene-21-end')
      expect(end.memory.endingsSeen).toEqual(['removed'])
      expect(end.memory.memoryFlags).toContain('was_removed')
    }
    expect(told.run.runFlags).toContain('told')
    expect(silent.run.runFlags).toContain("didn't")
  })

  it('Removed is locked when less than an hour is left', () => {
    const atChoice = toLastChoice(withMemory(1, 'knows_route'))
    const late: GameState = { ...atChoice, run: { ...atChoice.run, time: 3599 } }
    expect(choose(story, late, 'let-vale-cut-it-out')).toEqual({ ok: false, reason: 'locked' })
    const justEnough: GameState = { ...atChoice, run: { ...atChoice.run, time: 3600 } }
    expect(choose(story, justEnough, 'let-vale-cut-it-out').ok).toBe(true)
  })

  it('Partners: Tavi forgiven, with Ouro not taking the memory', () => {
    const start = withMemory(1, 'tavi_secret', 'knows_route')
    const atChoice = take(start, 'bolt', 'flyover-stairs', 'ask-about-lina', 'forgive-tavi', 'pay-mama-ouro', 'let-tavi-pay', 'continue', 'center-through-the-water', 'continue', 'continue')
    const done = take(atChoice, 'make-a-deal-for-lina')
    expect(done.memory.endingsSeen).toEqual(['partners'])
    expect(done.memory.memoryFlags).toContain('saw_partners')
  })

  it('Partners stays locked if Ouro took the memory', () => {
    const start = withMemory(1, 'tavi_secret', 'knows_route')
    const atChoice = take(start, 'bolt', 'flyover-stairs', 'ask-about-lina', 'forgive-tavi', 'pay-mama-ouro', 'pay-with-a-memory', 'continue', 'center-through-the-water', 'continue', 'continue')
    expect(choose(story, atChoice, 'make-a-deal-for-lina')).toEqual({ ok: false, reason: 'locked' })
  })

  it('Merged: the shortest path is the third run, listening to the chip and typing LAZARUS', () => {
    // Two deaths and the name learned in earlier runs. Then: listen, centre tunnel, type LAZARUS, let it in.
    const atChoice = take(
      withMemory(2, 'knows_lazarus'),
      'bolt', 'flyover-stairs', 'go-alone', 'listen-to-the-chip', 'keep-moving', 'continue',
      'center-through-the-water', 'type-lazarus', 'continue', 'continue',
    )
    expect(atChoice.run.runFlags).toContain('door_lazarus')
    const merged = take(atChoice, 'let-it-in')
    expect(merged.memory.endingsSeen).toEqual(['merged'])
    expect(merged.memory.deaths).toBe(2)
    expect(merged.memory.memoryFlags).toContain('saw_merged')
  })

  it('Merged stays locked without hearing the chip, even with the door open', () => {
    const atChoice = take(
      withMemory(2, 'knows_lazarus'),
      'bolt', 'flyover-stairs', 'go-alone', 'pay-mama-ouro', 'pay-with-a-memory', 'continue',
      'right-the-crawlway', 'type-lazarus', 'continue', 'continue',
    )
    expect(choose(story, atChoice, 'let-it-in')).toEqual({ ok: false, reason: 'locked' })
  })

  it('without the code or the hint, the door opens at gunpoint: 20 minutes lost and Vale distrusts Kade', () => {
    const atDoor = take(
      withMemory(2),
      'bolt', 'flyover-stairs', 'go-alone', 'listen-to-the-chip', 'keep-moving', 'continue', 'center-through-the-water',
    )
    expect(atDoor.run.sceneId).toBe('scene-17')
    const choices = story['scene-17'].choices.map((choice) => choice.id)
    expect(choices).toEqual(['continue', 'continue-forced', 'type-lazarus'])
    const inside = take(atDoor, 'continue-forced')
    expect(inside.run.runFlags).toContain('distrustful')
    expect(atDoor.run.time - inside.run.time).toBe(20 * 60)
    const shown = visibleBlocks(story['scene-18'], inside).map((block) => block.text)
    expect(shown.some((text) => text.startsWith('She keeps the rifle'))).toBe(true)
  })

  it("Merged crosses out the grid-power night when Ouro took it, and only then", () => {
    const merged = story['scene-23']
    const withMemory: GameState = { ...freshRun(), run: { ...freshRun().run, sceneId: 'scene-23', runFlags: ['memory_taken'] } }
    const without: GameState = { ...freshRun(), run: { ...freshRun().run, sceneId: 'scene-23' } }
    const shown = (state: GameState) => visibleBlocks(merged, state).map((block) => block.text).filter((text) => text.includes('grid-power night'))
    expect(shown(withMemory)).toEqual([expect.stringContaining('~~The grid-power night.~~')])
    expect(shown(without)).toEqual([expect.not.stringContaining('~~')])
  })

  it('only Merged resets the interface', () => {
    const resetting = Object.values(story).filter((scene) => scene.cleanInterface).map((scene) => scene.ending?.id)
    expect(resetting).toEqual(['merged'])
  })

  it('every ending in the game can be reached and has its own number', () => {
    const endings = Object.values(story).flatMap((scene) => (scene.ending ? [scene.ending] : []))
    expect(endings.map((ending) => ending.number).sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    expect(endings.filter((ending) => ending.kind === 'death')).toHaveLength(5)
    expect(endings.filter((ending) => ending.kind === 'survive')).toHaveLength(4)
    expect(endings.filter((ending) => ending.kind === 'secret')).toHaveLength(1)
  })
})
