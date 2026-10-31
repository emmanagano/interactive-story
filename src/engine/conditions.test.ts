import { describe, expect, it } from 'vitest'
import { isConditionMet } from './conditions'
import type { Condition, GameState, Memory, RunState } from './types'

function makeState(run: Partial<RunState> = {}, memory: Partial<Memory> = {}): GameState {
  return {
    run: {
      time: 21600,
      health: 5,
      heat: 0,
      sceneId: 'scene-01',
      runFlags: [],
      inventory: [],
      blurred: false,
      ...run,
    },
    memory: {
      version: 1,
      deaths: 0,
      flatlines: 0,
      runs: 0,
      endingsSeen: [],
      memoryFlags: [],
      ...memory,
    },
  }
}

describe('no condition', () => {
  it('is always met', () => {
    expect(isConditionMet(undefined, makeState())).toBe(true)
  })
})

describe('flag', () => {
  it('is met by a run flag', () => {
    expect(isConditionMet({ flag: 'with_tavi' }, makeState({ runFlags: ['with_tavi'] }))).toBe(true)
  })

  it('is met by a memory flag', () => {
    expect(isConditionMet({ flag: 'reyes_lied' }, makeState({}, { memoryFlags: ['reyes_lied'] }))).toBe(true)
  })

  it('is not met when the flag was never set', () => {
    expect(isConditionMet({ flag: 'never_set' }, makeState())).toBe(false)
  })

  it('does not mix up similar flag names', () => {
    expect(isConditionMet({ flag: 'tavi' }, makeState({ runFlags: ['with_tavi'] }))).toBe(false)
  })
})

describe('item and blurred', () => {
  it('checks the inventory', () => {
    expect(isConditionMet({ item: 'painkillers' }, makeState({ inventory: ['painkillers'] }))).toBe(true)
    expect(isConditionMet({ item: 'painkillers' }, makeState())).toBe(false)
  })

  it('reads the painkiller blur', () => {
    expect(isConditionMet({ blurred: true }, makeState({ blurred: true }))).toBe(true)
    expect(isConditionMet({ blurred: true }, makeState())).toBe(false)
  })
})

describe('not, all and any', () => {
  const state = makeState({ runFlags: ['with_tavi'] })

  it('not flips the answer', () => {
    expect(isConditionMet({ not: { flag: 'with_tavi' } }, state)).toBe(false)
    expect(isConditionMet({ not: { flag: 'tavi_forgiven' } }, state)).toBe(true)
  })

  it('all needs every part', () => {
    expect(isConditionMet({ all: [{ flag: 'with_tavi' }, { stat: 'heat', lte: 0 }] }, state)).toBe(true)
    expect(isConditionMet({ all: [{ flag: 'with_tavi' }, { flag: 'tavi_forgiven' }] }, state)).toBe(false)
  })

  it('any needs one part', () => {
    expect(isConditionMet({ any: [{ flag: 'knows_route' }, { flag: 'with_tavi' }] }, state)).toBe(true)
    expect(isConditionMet({ any: [{ flag: 'knows_route' }, { flag: 'listened' }] }, state)).toBe(false)
  })

  it('treats empty lists the standard way', () => {
    expect(isConditionMet({ all: [] }, state)).toBe(true)
    expect(isConditionMet({ any: [] }, state)).toBe(false)
  })

  it('handles conditions nested several levels deep', () => {
    const nested: Condition = {
      all: [
        { not: { any: [{ flag: 'knows_route' }, { flag: 'listened' }] } },
        { any: [{ flag: 'with_tavi' }, { all: [{ flag: 'a' }, { flag: 'b' }] }] },
      ],
    }
    expect(isConditionMet(nested, state)).toBe(true)
    expect(isConditionMet(nested, makeState({ runFlags: ['with_tavi', 'listened'] }))).toBe(false)
  })
})

describe('stat comparisons', () => {
  it('gte is inclusive at the boundary', () => {
    const condition: Condition = { stat: 'heat', gte: 2 }
    expect(isConditionMet(condition, makeState({ heat: 1 }))).toBe(false)
    expect(isConditionMet(condition, makeState({ heat: 2 }))).toBe(true)
    expect(isConditionMet(condition, makeState({ heat: 3 }))).toBe(true)
  })

  it('lte is inclusive at the boundary', () => {
    const condition: Condition = { stat: 'health', lte: 1 }
    expect(isConditionMet(condition, makeState({ health: 2 }))).toBe(false)
    expect(isConditionMet(condition, makeState({ health: 1 }))).toBe(true)
    expect(isConditionMet(condition, makeState({ health: 0 }))).toBe(true)
  })

  it('gte and lte together make a range', () => {
    const condition: Condition = { stat: 'heat', gte: 2, lte: 3 }
    expect(isConditionMet(condition, makeState({ heat: 1 }))).toBe(false)
    expect(isConditionMet(condition, makeState({ heat: 2 }))).toBe(true)
    expect(isConditionMet(condition, makeState({ heat: 3 }))).toBe(true)
    expect(isConditionMet(condition, makeState({ heat: 4 }))).toBe(false)
  })

  it('reads time from the run', () => {
    const underOneHour: Condition = { stat: 'time', lte: 3600 }
    expect(isConditionMet(underOneHour, makeState({ time: 3601 }))).toBe(false)
    expect(isConditionMet(underOneHour, makeState({ time: 3600 }))).toBe(true)
  })

  it('reads deaths and flatlines from memory, not the run', () => {
    expect(isConditionMet({ stat: 'deaths', gte: 2 }, makeState({}, { deaths: 2 }))).toBe(true)
    expect(isConditionMet({ stat: 'deaths', gte: 2 }, makeState({}, { deaths: 1 }))).toBe(false)
    expect(isConditionMet({ stat: 'flatlines', gte: 1 }, makeState({}, { flatlines: 1 }))).toBe(true)
    expect(isConditionMet({ stat: 'flatlines', gte: 1 }, makeState())).toBe(false)
  })

  it('is met when it has no bounds', () => {
    expect(isConditionMet({ stat: 'heat' }, makeState())).toBe(true)
  })
})

describe('conditions from the script', () => {
  it('Scene 07: "Listen to the chip" needs deaths of 2 or more', () => {
    const listen: Condition = { stat: 'deaths', gte: 2 }
    expect(isConditionMet(listen, makeState({}, { deaths: 1 }))).toBe(false)
    expect(isConditionMet(listen, makeState({}, { deaths: 2 }))).toBe(true)
  })

  // The script does not name the flag for "Ouro took the memory", so 'blocked' is a stand-in.
  it('Scene 19: "Make a deal for Lina" needs Tavi, forgiveness and no blocking flag', () => {
    const deal: Condition = {
      all: [{ flag: 'with_tavi' }, { flag: 'tavi_forgiven' }, { not: { flag: 'blocked' } }],
    }
    const together = makeState({ runFlags: ['with_tavi', 'tavi_forgiven'] })
    expect(isConditionMet(deal, together)).toBe(true)
    expect(isConditionMet(deal, makeState({ runFlags: ['with_tavi', 'tavi_forgiven', 'blocked'] }))).toBe(false)
  })
})
