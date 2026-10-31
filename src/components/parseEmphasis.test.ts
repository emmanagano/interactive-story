import { describe, expect, it } from 'vitest'
import { parseEmphasis, plainText, splitSegments } from './parseEmphasis'

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

  it('reads the chip speaking inside a sentence', () => {
    expect(parseEmphasis('`> okay,` the screen says. `okay, kade.`')).toEqual([
      { text: '> okay,', style: 'code' },
      { text: ' the screen says. ', style: 'plain' },
      { text: 'okay, kade.', style: 'code' },
    ])
  })

  it('reads bold terminal text', () => {
    expect(parseEmphasis('**`WELCOME HOME.`**')).toEqual([{ text: 'WELCOME HOME.', style: 'boldCode' }])
  })

  it('reads struck-through words, the memory Ouro took', () => {
    expect(parseEmphasis('Tavi\'s laugh. ~~The grid-power night.~~ The paper cat.')).toEqual([
      { text: "Tavi's laugh. ", style: 'plain' },
      { text: 'The grid-power night.', style: 'strike' },
      { text: ' The paper cat.', style: 'plain' },
    ])
  })

  it('keeps stray asterisks and backticks as text', () => {
    expect(parseEmphasis('one ` tick')).toEqual([{ text: 'one ` tick', style: 'plain' }])
    expect(parseEmphasis('5 * 3 = 15')).toEqual([{ text: '5 * 3 = 15', style: 'plain' }])
    expect(parseEmphasis('**')).toEqual([{ text: '**', style: 'plain' }])
  })
})

describe('plainText', () => {
  it('drops the marks and keeps the words', () => {
    expect(plainText('The timer: **05:59:58**. *Knock twice.* `> okay,` ~~gone~~')).toBe('The timer: 05:59:58. Knock twice. > okay, gone')
  })
})

describe('splitSegments', () => {
  const segments = parseEmphasis('One **two three** four')

  it('splits inside a styled piece and keeps its style on both halves', () => {
    const { shown, rest } = splitSegments(segments, 7)
    expect(shown).toEqual([
      { text: 'One ', style: 'plain' },
      { text: 'two', style: 'bold' },
    ])
    expect(rest).toEqual([
      { text: ' three', style: 'bold' },
      { text: ' four', style: 'plain' },
    ])
  })

  it('shows nothing at 0 and everything at or past the end', () => {
    expect(splitSegments(segments, 0).shown).toEqual([])
    expect(splitSegments(segments, 999).rest).toEqual([])
    expect(splitSegments(segments, 999).shown).toEqual(segments)
  })

  it('never loses a character', () => {
    for (let count = 0; count <= 22; count += 1) {
      const { shown, rest } = splitSegments(segments, count)
      expect([...shown, ...rest].map((segment) => segment.text).join('')).toBe('One two three four')
    }
  })
})
