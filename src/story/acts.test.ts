import { describe, expect, it } from 'vitest'
import { choose, createEmptyMemory, MissingSceneError, startRun, visibleBlocks } from '../engine'
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
    // Act 3 is not written yet, so the safe centre route ends at a scene the story does not have.
    expect(() => take(atTunnels, 'center-through-the-water')).toThrow(MissingSceneError)
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
    expect(() => take(listened, 'center-through-the-water')).toThrow(MissingSceneError)
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

  it('a flatline on the way to an unwritten scene still reaches Scene 16, showing the first vision', () => {
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
