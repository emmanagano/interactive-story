import { describe, expect, it } from 'vitest'
import { applyDebugPatch, listStoryFlags } from './debug'
import { makeState } from './testState'
import type { Story } from './types'

describe('applyDebugPatch', () => {
  it('changes only what it is given', () => {
    const before = makeState({ time: 5000, health: 3, runFlags: ['a'] }, { deaths: 2, memoryFlags: ['b'] })
    const after = applyDebugPatch(before, { sceneId: 'scene-19' })
    expect(after.run).toEqual({ ...before.run, sceneId: 'scene-19' })
    expect(after.memory).toEqual(before.memory)
  })

  it('sets the meters and the past-run counters', () => {
    const after = applyDebugPatch(makeState(), { time: 120, health: 1, heat: 4, deaths: 5, flatlines: 2 })
    expect(after.run).toMatchObject({ time: 120, health: 1, heat: 4 })
    expect(after.memory).toMatchObject({ deaths: 5, flatlines: 2 })
  })

  it('keeps numbers inside the range the game expects', () => {
    const high = applyDebugPatch(makeState(), { time: 999999, health: 9, heat: 9 })
    expect(high.run).toMatchObject({ time: 21600, health: 5, heat: 5 })
    const low = applyDebugPatch(makeState(), { time: -5, health: -1, heat: -3, deaths: -2, flatlines: -1 })
    expect(low.run).toMatchObject({ time: 0, health: 0, heat: 0 })
    expect(low.memory).toMatchObject({ deaths: 0, flatlines: 0 })
  })

  it('rounds to whole numbers', () => {
    expect(applyDebugPatch(makeState(), { health: 2.6 }).run.health).toBe(3)
  })

  it('replaces flag lists and the inventory outright', () => {
    const before = makeState({ runFlags: ['old'], inventory: ['painkillers'] }, { memoryFlags: ['old'] })
    const after = applyDebugPatch(before, { runFlags: ['new'], inventory: [], memoryFlags: ['new', 'newer'] })
    expect(after.run.runFlags).toEqual(['new'])
    expect(after.run.inventory).toEqual([])
    expect(after.memory.memoryFlags).toEqual(['new', 'newer'])
  })

  it('does not change the state it was given', () => {
    const before = makeState()
    applyDebugPatch(before, { time: 1, runFlags: ['x'] })
    expect(before).toEqual(makeState())
  })
})

describe('listStoryFlags', () => {
  const story: Story = {
    a: {
      id: 'a',
      act: 1,
      title: 'A',
      blocks: [],
      choices: [
        { id: 'go', label: 'GO', goto: 'b', effect: { setRunFlags: ['zeta', 'alpha'], addItem: 'painkillers' } },
      ],
    },
    b: {
      id: 'b',
      act: 1,
      title: 'B',
      blocks: [],
      choices: [],
      onEnter: [{ effect: { setMemoryFlags: ['seen_b'] } }, { effect: { setRunFlags: ['alpha'] } }],
      ending: { id: 'b', kind: 'death', number: 1 },
    },
  }

  it('collects run flags, memory flags and items from choices and scene entries, once each and sorted', () => {
    expect(listStoryFlags(story)).toEqual({ runFlags: ['alpha', 'zeta'], memoryFlags: ['seen_b'], items: ['painkillers'] })
  })
})
