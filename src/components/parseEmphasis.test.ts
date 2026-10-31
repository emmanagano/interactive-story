import { describe, expect, it } from 'vitest'
import { parseEmphasis } from './parseEmphasis'

describe('parseEmphasis', () => {
  it('leaves plain text alone', () => {
    expect(parseEmphasis('Rain on the flyover.')).toEqual([{ text: 'Rain on the flyover.', style: 'plain' }])
  })

  it('reads bold in the middle of a sentence', () => {
    expect(parseEmphasis('The timer appears: **05:59:58**.')).toEqual([
      { text: 'The timer appears: ', style: 'plain' },
      { text: '05:59:58', style: 'bold' },
      { text: '.', style: 'plain' },
    ])
  })

  it('reads italic, including whole-line notes', () => {
    expect(parseEmphasis('*(The timer flickers.)*')).toEqual([{ text: '(The timer flickers.)', style: 'italic' }])
  })

  it('reads several marks in one line', () => {
    expect(parseEmphasis('*Line 4* and **gate**')).toEqual([
      { text: 'Line 4', style: 'italic' },
      { text: ' and ', style: 'plain' },
      { text: 'gate', style: 'bold' },
    ])
  })

  it('keeps stray asterisks as text', () => {
    expect(parseEmphasis('5 * 3 = 15')).toEqual([{ text: '5 * 3 = 15', style: 'plain' }])
    expect(parseEmphasis('**')).toEqual([{ text: '**', style: 'plain' }])
  })
})
