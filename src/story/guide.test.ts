import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { ENDING_GUIDE, GOOD_TO_KNOW, SECRET_ENDING_PATH, STORY_SUMMARY } from './guide'
import { story } from './index'

const script = readFileSync(fileURLToPath(new URL('../../blueprint/flatline-script.md', import.meta.url)), 'utf-8')
const unescape = (text: string) => text.replace(/\\([_[\]*`])/g, '$1')

// The script's "All ten endings" table, row by row.
const scriptRows = [...script.matchAll(/^\| (\d\d) \| (.+?) \| (Death|Survive|Secret) \| (\d+) \| (.+?) \| (.+?) \|$/gm)].map((match) => ({
  number: Number(match[1]),
  name: match[2],
  kind: match[3],
  howToGet: unescape(match[5]),
}))

describe('the ending guide', () => {
  it('covers each of the ten endings once, in order', () => {
    expect(ENDING_GUIDE.map((entry) => entry.number)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  })

  it('matches the script table word for word: name, kind and how to get it', () => {
    expect(scriptRows).toHaveLength(10)
    for (const entry of ENDING_GUIDE) {
      const row = scriptRows.find((candidate) => candidate.number === entry.number)
      expect(row, `ending ${entry.number}`).toBeDefined()
      expect({ name: entry.name, kind: entry.kind, howToGet: entry.howToGet }).toEqual({ name: row?.name, kind: row?.kind, howToGet: row?.howToGet })
    }
  })

  it('agrees with the story itself: the scene named the same, the same number and kind', () => {
    for (const entry of ENDING_GUIDE) {
      const scene = Object.values(story).find((candidate) => candidate.ending?.number === entry.number)
      expect(scene?.title.toLowerCase(), `ending ${entry.number}`).toBe(entry.name.toLowerCase())
      expect(scene?.ending?.kind, `ending ${entry.number}`).toBe(entry.kind.toLowerCase())
    }
  })

  it('only claims a next-run gain through flags that the ending really sets', () => {
    for (const entry of ENDING_GUIDE) {
      const scene = Object.values(story).find((candidate) => candidate.ending?.number === entry.number)
      const set = new Set((scene?.onEnter ?? []).flatMap((item) => item.effect.setMemoryFlags ?? []))
      for (const flag of entry.opens?.flags ?? []) expect(set, `${entry.name} sets ${flag}`).toContain(flag)
    }
  })

  it('names locked choices that exist in the story', () => {
    const labels = new Set(Object.values(story).flatMap((scene) => scene.choices.map((choice) => choice.label.toLowerCase())))
    for (const label of ['ask who he called', 'stall sable', 'ask about lina', 'listen to the chip']) expect(labels).toContain(label)
  })
})

describe('the rest of the guide', () => {
  it('quotes the script for the secret ending path', () => {
    expect(unescape(script)).toContain(SECRET_ENDING_PATH)
  })

  it('has a recap for the set-up and each act, with the scenes it covers', () => {
    expect(STORY_SUMMARY.map((section) => section.id)).toEqual(['set-up', 'act-1', 'act-2', 'act-3'])
    for (const section of STORY_SUMMARY) {
      expect(section.scenes).toMatch(/^Scenes? /)
      expect(section.paragraphs.length).toBeGreaterThan(0)
    }
  })

  it('only mentions people and places that are in the script', () => {
    const names = ['Kade', 'Tavi', 'Reyes', 'Ouro', 'Iris Vale', 'Sable', 'Halcyon Tower', 'Sector 9', 'LAZARUS', 'Drowned Line', 'Night Market', 'Line 4']
    const text = STORY_SUMMARY.flatMap((section) => section.paragraphs).join(' ')
    for (const name of names) expect(script, name).toContain(name)
    // And everything capitalised in the recap that looks like a name is one of those.
    const found = new Set([...text.matchAll(/(?<![.!?]\s)(?<!^)\b([A-Z][a-z]+(?:\s[A-Z][a-z0-9]+)*)/g)].map((match) => match[1]))
    for (const word of found) expect(script, word).toContain(word)
  })

  it('has short, plain tips', () => {
    expect(GOOD_TO_KNOW.length).toBeGreaterThanOrEqual(3)
  })
})
