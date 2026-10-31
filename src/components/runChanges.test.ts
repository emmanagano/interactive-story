import { describe, expect, it } from 'vitest'
import { describeChanges, diffRun, NO_CHANGES } from './runChanges'
import { makeState } from '../engine/testState'

describe('diffRun', () => {
  it('measures how far each meter moved', () => {
    const before = makeState({ time: 21600, health: 5, heat: 0 }).run
    const after = makeState({ time: 20400, health: 4, heat: 2 }).run
    expect(diffRun(before, after)).toEqual({ time: -1200, health: -1, heat: 2 })
  })

  it('reports no movement for the same run', () => {
    const run = makeState().run
    expect(diffRun(run, run)).toEqual(NO_CHANGES)
  })
})

describe('describeChanges', () => {
  it('writes the example from the accessibility rules', () => {
    expect(describeChanges({ time: -1200, health: 0, heat: 1 })).toBe('Time minus 20 minutes. Heat up 1.')
  })

  it('says health went up or down', () => {
    expect(describeChanges({ time: 0, health: -1, heat: 0 })).toBe('Health down 1.')
    expect(describeChanges({ time: 0, health: 1, heat: -2 })).toBe('Health up 1. Heat down 2.')
  })

  it('writes hours and minutes, with the right plurals', () => {
    expect(describeChanges({ time: -2400, health: 0, heat: 0 })).toBe('Time minus 40 minutes.')
    expect(describeChanges({ time: -3600, health: 0, heat: 0 })).toBe('Time minus 1 hour.')
    expect(describeChanges({ time: -5400, health: 0, heat: 0 })).toBe('Time minus 1 hour 30 minutes.')
    expect(describeChanges({ time: -300, health: 0, heat: 0 })).toBe('Time minus 5 minutes.')
    expect(describeChanges({ time: -45, health: 0, heat: 0 })).toBe('Time minus 45 seconds.')
  })

  it('reads time gained as plus', () => {
    expect(describeChanges({ time: 600, health: 0, heat: 0 })).toBe('Time plus 10 minutes.')
  })

  it('says nothing when nothing changed', () => {
    expect(describeChanges(NO_CHANGES)).toBe('')
  })

  it('lists everything in the same order every time', () => {
    expect(describeChanges({ time: -600, health: -1, heat: 1 })).toBe('Time minus 10 minutes. Health down 1. Heat up 1.')
  })
})
