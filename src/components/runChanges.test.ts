import { describe, expect, it } from 'vitest'
import { describeChanges, describeNewRun, diffRun, NO_CHANGES } from './runChanges'
import { makeState } from '../engine/testState'

describe('diffRun', () => {
  it('measures how far each meter moved', () => {
    const before = makeState({ time: 21600, health: 5, heat: 0 }).run
    const after = makeState({ time: 20400, health: 4, heat: 2 }).run
    expect(diffRun(before, after)).toMatchObject({ time: -1200, health: -1, heat: 2 })
  })

  it('reports no movement for the same run', () => {
    const run = makeState().run
    expect(diffRun(run, run)).toEqual(NO_CHANGES)
  })
})

describe('items and the painkiller blur (the "nothing happens" bug)', () => {
  it('notices an item used up, even when health was already full', () => {
    const before = makeState({ health: 5, inventory: ['painkillers'] }).run
    const after = makeState({ health: 5, inventory: [] }, {}).run
    const changes = diffRun(before, { ...after, blurred: true })
    expect(changes.itemsUsed).toEqual(['painkillers'])
    expect(changes.blurStarted).toBe(true)
    expect(describeChanges(changes)).toBe('Used painkillers. Choice text is blurred until your next choice.')
  })

  it('notices an item picked up', () => {
    const changes = diffRun(makeState().run, makeState({ inventory: ['painkillers'] }).run)
    expect(changes.itemsGained).toEqual(['painkillers'])
    expect(describeChanges(changes)).toBe('Got painkillers.')
  })

  it('counts copies, so using one of two is still noticed', () => {
    const changes = diffRun(makeState({ inventory: ['painkillers', 'painkillers'] }).run, makeState({ inventory: ['painkillers'] }).run)
    expect(changes.itemsUsed).toEqual(['painkillers'])
  })

  it('says it in order: meters first, then items, then the blur', () => {
    const before = makeState({ health: 3, inventory: ['painkillers'] }).run
    const after = { ...makeState({ health: 4, inventory: [] }).run, blurred: true }
    expect(describeChanges(diffRun(before, after))).toBe('Health up 1. Used painkillers. Choice text is blurred until your next choice.')
  })

  it('does not say the blur began again when it simply carries on', () => {
    const blurred = { ...makeState().run, blurred: true }
    expect(diffRun(blurred, blurred).blurStarted).toBe(false)
  })
})

describe('describeChanges', () => {
  it('writes the example from the accessibility rules', () => {
    expect(describeChanges({ ...NO_CHANGES, time: -1200, health: 0, heat: 1 })).toBe('Time minus 20 minutes. Heat up 1.')
  })

  it('says health went up or down', () => {
    expect(describeChanges({ ...NO_CHANGES, time: 0, health: -1, heat: 0 })).toBe('Health down 1.')
    expect(describeChanges({ ...NO_CHANGES, time: 0, health: 1, heat: -2 })).toBe('Health up 1. Heat down 2.')
  })

  it('writes hours and minutes, with the right plurals', () => {
    expect(describeChanges({ ...NO_CHANGES, time: -2400, health: 0, heat: 0 })).toBe('Time minus 40 minutes.')
    expect(describeChanges({ ...NO_CHANGES, time: -3600, health: 0, heat: 0 })).toBe('Time minus 1 hour.')
    expect(describeChanges({ ...NO_CHANGES, time: -5400, health: 0, heat: 0 })).toBe('Time minus 1 hour 30 minutes.')
    expect(describeChanges({ ...NO_CHANGES, time: -300, health: 0, heat: 0 })).toBe('Time minus 5 minutes.')
    expect(describeChanges({ ...NO_CHANGES, time: -45, health: 0, heat: 0 })).toBe('Time minus 45 seconds.')
  })

  it('reads time gained as plus', () => {
    expect(describeChanges({ ...NO_CHANGES, time: 600, health: 0, heat: 0 })).toBe('Time plus 10 minutes.')
  })

  it('says nothing when nothing changed', () => {
    expect(describeChanges(NO_CHANGES)).toBe('')
  })

  it('lists everything in the same order every time', () => {
    expect(describeChanges({ ...NO_CHANGES, time: -600, health: -1, heat: 1 })).toBe('Time minus 10 minutes. Health down 1. Heat up 1.')
  })
})

describe('describeNewRun', () => {
  it('reads out the fresh meters', () => {
    expect(describeNewRun(makeState().run)).toBe('New run. 06:00:00 left. Health 5. Heat 0.')
  })
})
