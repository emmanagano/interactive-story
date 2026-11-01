import { describe, expect, it } from 'vitest'
import { endingHeader, findEndingScene, findNewEndingId, listEndingSlots } from './endings'
import type { EndingKind, Scene, Story } from './types'

// The ten banner lines exactly as the script writes them.
const scriptBanners: [number, EndingKind, string, string][] = [
  [1, 'death', "DOC'S TABLE", "FLATLINE · ENDING 01 / 10 · DOC'S TABLE"],
  [2, 'death', 'CAUGHT', 'FLATLINE · ENDING 02 / 10 · CAUGHT'],
  [3, 'death', "TAVI'S TRADE", "FLATLINE · ENDING 03 / 10 · TAVI'S TRADE"],
  [4, 'death', 'DROWNED', 'FLATLINE · ENDING 04 / 10 · DROWNED'],
  [5, 'death', 'FLATLINE', 'FLATLINE · ENDING 05 / 10'],
  [6, 'survive', 'SOLD', 'ENDING 06 / 10 · SOLD'],
  [7, 'survive', 'COMPANY MAN', 'ENDING 07 / 10 · COMPANY MAN'],
  [8, 'survive', 'REMOVED', 'ENDING 08 / 10 · REMOVED'],
  [9, 'survive', 'PARTNERS', 'ENDING 09 / 10 · PARTNERS'],
  [10, 'secret', 'MERGED', 'ENDING 10 / 10 · MERGED'],
]

describe('endingHeader', () => {
  it.each(scriptBanners)('writes ending %i the way the script does', (number, kind, title, expected) => {
    expect(endingHeader({ id: 'x', kind, number }, title)).toBe(expected)
  })
})

function endingScene(id: string, number: number, kind: EndingKind, title: string): Scene {
  return { id, act: 1, title, blocks: [], choices: [], ending: { id: `end-${id}`, kind, number } }
}

describe('listEndingSlots', () => {
  const story: Story = {
    a: endingScene('a', 1, 'death', "DOC'S TABLE"),
    b: endingScene('b', 6, 'survive', 'SOLD'),
    c: { id: 'c', act: 1, title: 'MIDDLE', blocks: [], choices: [] },
  }

  it('always lists ten slots in order', () => {
    expect(listEndingSlots(story, []).map((slot) => slot.number)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  })

  it('shows nothing about an ending that has not been found', () => {
    const slots = listEndingSlots(story, [])
    expect(slots[0]).toEqual({ number: 1, found: false })
    expect(slots[5]).toEqual({ number: 6, found: false })
  })

  it('shows the name and kind of a found ending', () => {
    const slots = listEndingSlots(story, ['end-a'])
    expect(slots[0]).toEqual({ number: 1, found: true, title: "DOC'S TABLE", kind: 'death' })
    expect(slots[5].found).toBe(false)
  })

  it('keeps endings that are not written yet as silhouettes, and ignores unknown ids', () => {
    const slots = listEndingSlots(story, ['end-zzz'])
    expect(slots.every((slot) => !slot.found)).toBe(true)
  })
})

describe('findNewEndingId', () => {
  it('names the ending a run just added', () => {
    expect(findNewEndingId(['end-a'], ['end-a', 'end-b'])).toBe('end-b')
  })

  it('finds nothing when the run ended on an ending already seen', () => {
    expect(findNewEndingId(['end-a'], ['end-a'])).toBeNull()
  })

  it('finds nothing when a run is still going', () => {
    expect(findNewEndingId([], [])).toBeNull()
  })
})

describe('findEndingScene', () => {
  const story: Story = { a: endingScene('a', 1, 'death', "DOC'S TABLE") }

  it('finds the scene that holds an ending id', () => {
    expect(findEndingScene(story, 'end-a')?.title).toBe("DOC'S TABLE")
  })

  it('returns nothing for an id no scene has', () => {
    expect(findEndingScene(story, 'end-zzz')).toBeUndefined()
  })
})
