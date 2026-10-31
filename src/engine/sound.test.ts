import { describe, expect, it } from 'vitest'
import { gainFor, heartbeatInterval, soundCueForScene } from './sound'

describe('heartbeatInterval', () => {
  it('starts slow and ends frantic', () => {
    expect(heartbeatInterval({ time: 21600, health: 5 })).toBe(1.5)
    expect(heartbeatInterval({ time: 0, health: 5 })).toBe(0.3)
  })

  it('speeds up steadily as time runs out', () => {
    const times = [21600, 18000, 14400, 7200, 3600, 1800, 600, 0]
    const intervals = times.map((time) => heartbeatInterval({ time, health: 5 }))
    for (let i = 1; i < intervals.length; i += 1) expect(intervals[i]).toBeLessThanOrEqual(intervals[i - 1])
    expect(intervals[0]).toBeGreaterThan(intervals[intervals.length - 1])
  })

  it('also speeds up when health is low, even with plenty of time', () => {
    expect(heartbeatInterval({ time: 21600, health: 1 })).toBeLessThan(heartbeatInterval({ time: 21600, health: 5 }))
    expect(heartbeatInterval({ time: 21600, health: 0 })).toBe(0.3)
  })

  it('stays between the slowest and the fastest beat for any input', () => {
    for (const time of [-100, 0, 5000, 21600, 99999]) {
      for (const health of [-1, 0, 3, 5, 9]) {
        const interval = heartbeatInterval({ time, health })
        expect(interval).toBeGreaterThanOrEqual(0.3)
        expect(interval).toBeLessThanOrEqual(1.5)
      }
    }
  })
})

describe('gainFor', () => {
  it('is silent at 0 and kept below full scale at 1', () => {
    expect(gainFor(0)).toBe(0)
    expect(gainFor(1)).toBeLessThan(1)
  })

  it('rises with the slider, faster at the top than the bottom', () => {
    expect(gainFor(0.5)).toBeLessThan(gainFor(1))
    expect(gainFor(0.5) / gainFor(1)).toBeLessThan(0.5)
  })

  it('keeps a bad volume in range', () => {
    expect(gainFor(-3)).toBe(0)
    expect(gainFor(40)).toBe(gainFor(1))
  })
})

describe('soundCueForScene', () => {
  it('plays the flatline tone on deaths only', () => {
    expect(soundCueForScene({ ending: { id: 'a', kind: 'death', number: 1 } })).toBe('flatline')
    expect(soundCueForScene({ ending: { id: 'b', kind: 'survive', number: 6 } })).toBeNull()
    expect(soundCueForScene({ ending: { id: 'c', kind: 'secret', number: 10 } })).toBeNull()
    expect(soundCueForScene({})).toBeNull()
  })
})
