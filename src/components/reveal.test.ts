import { describe, expect, it } from 'vitest'
import { CHARS_PER_SECOND, PAUSE_BETWEEN_BLOCKS, planReveal, revealedCount, scrambleFrame, SCRAMBLE_MAX_SECONDS } from './reveal'

describe('planReveal', () => {
  it('types text at the set speed and starts each block after the last, with a pause', () => {
    const plan = planReveal([
      { type: 'text', text: 'a'.repeat(160) },
      { type: 'text', text: 'b'.repeat(32) },
    ])
    expect(plan.steps[0]).toMatchObject({ start: 0, length: 160 })
    expect(plan.steps[0].duration).toBeCloseTo(160 / CHARS_PER_SECOND)
    expect(plan.steps[1].start).toBeCloseTo(plan.steps[0].duration + PAUSE_BETWEEN_BLOCKS)
    expect(plan.total).toBeCloseTo(plan.steps[1].start + plan.steps[1].duration + PAUSE_BETWEEN_BLOCKS)
  })

  it('counts what the player reads, not the marks', () => {
    expect(planReveal([{ type: 'text', text: '**bold** and *italic*' }]).steps[0].length).toBe('bold and italic'.length)
  })

  it('gives a chip line its own, capped, scramble time', () => {
    const short = planReveal([{ type: 'chip', text: 'k…kade.' }]).steps[0].duration
    const long = planReveal([{ type: 'chip', text: 'x'.repeat(500) }]).steps[0].duration
    expect(short).toBeGreaterThan(0)
    expect(short).toBeLessThan(long)
    expect(long).toBe(SCRAMBLE_MAX_SECONDS)
  })

  it('has no time at all for no blocks', () => {
    expect(planReveal([]).total).toBe(0)
  })
})

describe('revealedCount', () => {
  const step = { start: 1, duration: 2, length: 10 }

  it('shows nothing before the block starts, and everything after it ends', () => {
    expect(revealedCount(step, 0.5)).toBe(0)
    expect(revealedCount(step, 3)).toBe(10)
    expect(revealedCount(step, 100)).toBe(10)
  })

  it('moves steadily through the block', () => {
    expect(revealedCount(step, 2)).toBe(5)
    expect(revealedCount(step, 1.3)).toBe(1)
  })

  it('treats an empty block as already shown once its turn comes', () => {
    expect(revealedCount({ start: 1, duration: 0, length: 0 }, 1.5)).toBe(0)
    expect(revealedCount({ start: 1, duration: 0, length: 4 }, 1.5)).toBe(4)
  })
})

describe('scrambleFrame', () => {
  it('keeps the resolved part and scrambles the rest, keeping the length and the spaces', () => {
    const frame = scrambleFrame('remember this one', 8, 3)
    expect(frame.startsWith('remember')).toBe(true)
    expect(frame).toHaveLength('remember this one'.length)
    expect(frame[8]).toBe(' ')
    expect(frame.slice(9)).not.toBe('this one')
  })

  it('is the real text once everything has resolved', () => {
    expect(scrambleFrame('remember this one', 17, 99)).toBe('remember this one')
  })

  it('is the same for the same tick and changes as the tick moves', () => {
    expect(scrambleFrame('abcdef', 0, 4)).toBe(scrambleFrame('abcdef', 0, 4))
    expect(scrambleFrame('abcdef', 0, 4)).not.toBe(scrambleFrame('abcdef', 0, 5))
  })
})
