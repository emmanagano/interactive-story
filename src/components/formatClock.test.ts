import { describe, expect, it } from 'vitest'
import { formatClock } from './formatClock'

describe('formatClock', () => {
  it('writes hours, minutes and seconds with leading zeros', () => {
    expect(formatClock(21600)).toBe('06:00:00')
    expect(formatClock(21598)).toBe('05:59:58')
    expect(formatClock(3661)).toBe('01:01:01')
  })

  it('stops at zero', () => {
    expect(formatClock(0)).toBe('00:00:00')
    expect(formatClock(-5)).toBe('00:00:00')
  })
})
