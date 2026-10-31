import { plainText } from './parseEmphasis'

// How the text of a scene appears. Everything is in seconds. Step 6.2 makes the speed a setting.
export const CHARS_PER_SECOND = 320
export const PAUSE_BETWEEN_BLOCKS = 0.12
export const SCRAMBLE_SECONDS_PER_CHAR = 0.03
export const SCRAMBLE_MAX_SECONDS = 1.2

export type RevealStep = {
  start: number
  duration: number
  length: number // characters the player reads
}

export type RevealPlan = {
  steps: RevealStep[]
  total: number
}

type PlannedBlock = { type: 'text' | 'chip' | 'system'; text: string }

/** When each block starts and how long it takes. Text types out; a chip line scrambles, then resolves. */
export function planReveal(blocks: PlannedBlock[]): RevealPlan {
  let cursor = 0
  const steps = blocks.map((block): RevealStep => {
    const length = plainText(block.text).length
    const duration =
      block.type === 'chip'
        ? Math.min(SCRAMBLE_MAX_SECONDS, length * SCRAMBLE_SECONDS_PER_CHAR)
        : length / CHARS_PER_SECOND
    const step = { start: cursor, duration, length }
    cursor += duration + PAUSE_BETWEEN_BLOCKS
    return step
  })
  return { steps, total: cursor }
}

/** How many characters of a block are showing (or resolved) after `elapsed` seconds. */
export function revealedCount(step: RevealStep, elapsed: number): number {
  if (elapsed <= step.start) return 0
  if (step.duration <= 0 || elapsed >= step.start + step.duration) return step.length
  return Math.floor(((elapsed - step.start) / step.duration) * step.length)
}

const SCRAMBLE_GLYPHS = '#%&*+=?/<>01|'

/**
 * A chip line mid-resolve: the first `resolved` characters are real, the rest flicker through
 * glyphs. The glyph for each position depends only on the position and the tick, so a frame
 * can be tested. Spaces stay spaces so the line keeps its shape.
 */
export function scrambleFrame(text: string, resolved: number, tick: number): string {
  return [...text]
    .map((character, index) => {
      if (index < resolved || character === ' ') return character
      const pick = (index * 7 + tick * 13 + (index % 3) * tick) % SCRAMBLE_GLYPHS.length
      return SCRAMBLE_GLYPHS[pick]
    })
    .join('')
}
