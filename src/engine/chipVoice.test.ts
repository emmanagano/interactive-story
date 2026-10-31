import { describe, expect, it } from 'vitest'
import { chipVoice } from './chipVoice'

describe('chipVoice', () => {
  it('follows the script table: 0, 1-2, 3-4 and 5+ deaths', () => {
    expect([0, 1, 2, 3, 4, 5, 6, 40].map(chipVoice)).toEqual(['broken', 'clear', 'clear', 'human', 'human', 'calm', 'calm', 'calm'])
  })

  it('treats a bad count as a first run', () => {
    expect(chipVoice(-1)).toBe('broken')
  })
})
