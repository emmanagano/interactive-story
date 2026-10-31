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
