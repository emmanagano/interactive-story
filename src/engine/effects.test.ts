import { describe, expect, it } from 'vitest'
import { applyEffect } from './effects'
import { makeState } from './testState'

describe('costs', () => {
  it('subtracts time spent', () => {
    const after = applyEffect(makeState({ time: 20000 }), { time: -300 })
    expect(after.run.time).toBe(19700)
  })

  it('never lets time go below zero', () => {
    const after = applyEffect(makeState({ time: 100 }), { time: -2400 })
    expect(after.run.time).toBe(0)
  })

  it('changes health and heat', () => {
    const after = applyEffect(makeState({ health: 4, heat: 1 }), { health: -1, heat: 2 })
    expect(after.run.health).toBe(3)
    expect(after.run.heat).toBe(3)
  })

  it('leaves everything alone for an empty effect', () => {
    const before = makeState({ health: 3, heat: 2, time: 9000 })
    expect(applyEffect(before, {})).toEqual(before)
  })
})

describe('clamping', () => {
  it('keeps health between 0 and 5', () => {
    expect(applyEffect(makeState({ health: 5 }), { health: 1 }).run.health).toBe(5)
    expect(applyEffect(makeState({ health: 1 }), { health: -3 }).run.health).toBe(0)
  })

  it('keeps heat between 0 and 5', () => {
    expect(applyEffect(makeState({ heat: 5 }), { heat: 2 }).run.heat).toBe(5)
    expect(applyEffect(makeState({ heat: 1 }), { heat: -2 }).run.heat).toBe(0)
  })
})

describe('flags', () => {
  it('sets run flags', () => {
    const after = applyEffect(makeState(), { setRunFlags: ['with_tavi', 'vale_hint'] })
    expect(after.run.runFlags).toEqual(['with_tavi', 'vale_hint'])
  })

  it('sets memory flags', () => {
    const after = applyEffect(makeState(), { setMemoryFlags: ['reyes_lied'] })
    expect(after.memory.memoryFlags).toEqual(['reyes_lied'])
  })

  it('does not duplicate a flag that is already set', () => {
    const before = makeState({ runFlags: ['with_tavi'] }, { memoryFlags: ['reyes_lied'] })
    const after = applyEffect(before, { setRunFlags: ['with_tavi'], setMemoryFlags: ['reyes_lied'] })
    expect(after.run.runFlags).toEqual(['with_tavi'])
    expect(after.memory.memoryFlags).toEqual(['reyes_lied'])
  })

  it('does not change the state it was given', () => {
    const before = makeState({ time: 20000, inventory: ['painkillers'] })
    applyEffect(before, { time: -600, setRunFlags: ['x'], useItem: 'painkillers' })
    expect(before).toEqual(makeState({ time: 20000, inventory: ['painkillers'] }))
  })
})

describe('items', () => {
  it('adds an item', () => {
    const after = applyEffect(makeState(), { addItem: 'painkillers' })
    expect(after.run.inventory).toEqual(['painkillers'])
  })

  it('uses up one copy of an item', () => {
    const before = makeState({ inventory: ['painkillers', 'painkillers'] })
    expect(applyEffect(before, { useItem: 'painkillers' }).run.inventory).toEqual(['painkillers'])
  })

  it('ignores using an item the player does not have', () => {
    const after = applyEffect(makeState({ inventory: ['painkillers'] }), { useItem: 'keycard' })
    expect(after.run.inventory).toEqual(['painkillers'])
  })

  it('handles the painkiller choice: use one, gain a point of health', () => {
    const before = makeState({ health: 3, inventory: ['painkillers'] })
    const after = applyEffect(before, { useItem: 'painkillers', health: 1 })
    expect(after.run.health).toBe(4)
    expect(after.run.inventory).toEqual([])
  })
})

describe('the chip draining health every hour', () => {
  const hour = 3600

  it('does not drain while the clock stays inside an hour', () => {
    const after = applyEffect(makeState({ time: 21600 }), { time: -(hour - 1) })
    expect(after.run.health).toBe(5)
  })

  it('drains exactly when an hour boundary is reached', () => {
    const after = applyEffect(makeState({ time: 21600 - (hour - 600) }), { time: -600 })
    expect(after.run.health).toBe(4)
  })

  it('drains when a choice crosses an hour boundary', () => {
    // 5:10:00 left means 50 minutes in. A 20-minute choice lands at 70 minutes.
    const after = applyEffect(makeState({ time: 21600 - 50 * 60 }), { time: -20 * 60 })
    expect(after.run.health).toBe(4)
  })

  it('drains once per hour crossed in a single long choice', () => {
    const after = applyEffect(makeState({ time: 21600 }), { time: -(2 * hour + 60) })
    expect(after.run.health).toBe(3)
  })

  it('does not charge the same hour twice across several choices', () => {
    let state = makeState({ time: 21600 - (hour - 600) })
    state = applyEffect(state, { time: -900 }) // crosses 1:00
    state = applyEffect(state, { time: -900 }) // still inside the second hour
    state = applyEffect(state, { time: -900 })
    expect(state.run.health).toBe(4)
  })

  it('drains the same however a stretch of time is split up', () => {
    let small = makeState()
    for (let step = 0; step < 18; step += 1) {
      small = applyEffect(small, { time: -600 }) // 18 x 10 minutes = 3 hours
    }
    const big = applyEffect(makeState(), { time: -3 * hour })
    expect(small.run.health).toBe(2)
    expect(big.run.health).toBe(2)
  })

  it('stacks with the health cost of the choice itself', () => {
    const before = makeState({ time: 21600 - (hour - 60), health: 4 })
    const after = applyEffect(before, { time: -600, health: -1 })
    expect(after.run.health).toBe(2)
  })

  it('does not let a heal at full health pay for the drain', () => {
    const before = makeState({ time: 21600 - (hour - 60), health: 5 })
    const after = applyEffect(before, { time: -600, health: 1 })
    expect(after.run.health).toBe(4)
  })

  it('never drops health below zero', () => {
    const after = applyEffect(makeState({ time: 21600, health: 1 }), { time: -(3 * hour) })
    expect(after.run.health).toBe(0)
  })

  it('does not drain when no time passes', () => {
    const after = applyEffect(makeState({ time: 21600 - hour }), { heat: 1 })
    expect(after.run.health).toBe(5)
  })
})
