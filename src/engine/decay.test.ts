import { describe, expect, it } from 'vitest'
import { computeDecay } from './decay'

describe('computeDecay', () => {
  it('is clean at the start of a run', () => {
    expect(computeDecay({ time: 21600, health: 5 })).toBe(0)
  })

  it('stays clean until under an hour is left', () => {
    expect(computeDecay({ time: 3601, health: 5 })).toBe(0)
    expect(computeDecay({ time: 3600, health: 5 })).toBe(0)
  })

  it('grows steadily through the last hour and is full at zero', () => {
    expect(computeDecay({ time: 1800, health: 5 })).toBeCloseTo(0.5)
    expect(computeDecay({ time: 900, health: 5 })).toBeCloseTo(0.75)
    expect(computeDecay({ time: 0, health: 5 })).toBe(1)
  })

  it('starts when health falls below 3 and is full at 0 health', () => {
    expect(computeDecay({ time: 21600, health: 3 })).toBe(0)
    expect(computeDecay({ time: 21600, health: 2 })).toBeCloseTo(1 / 3)
    expect(computeDecay({ time: 21600, health: 1 })).toBeCloseTo(2 / 3)
    expect(computeDecay({ time: 21600, health: 0 })).toBe(1)
  })

  it('is worse with both low than with either alone', () => {
    const both = computeDecay({ time: 1800, health: 1 })
    expect(both).toBeGreaterThan(computeDecay({ time: 1800, health: 5 }))
    expect(both).toBeGreaterThan(computeDecay({ time: 21600, health: 1 }))
    expect(both).toBeLessThanOrEqual(1)
  })

  it('never leaves the range 0 to 1', () => {
    expect(computeDecay({ time: -50, health: -2 })).toBe(1)
    expect(computeDecay({ time: 99999, health: 99 })).toBe(0)
  })
})
