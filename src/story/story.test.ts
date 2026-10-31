import { describe, expect, it } from 'vitest'
import { FLAGS_SET_BY_LATER_ACTS, PLACEHOLDER_SCENE_IDS } from './placeholders'
import { validateStory } from './validate'

// Picks up every act file automatically, so a new act is checked as soon as it exists.
const storyFiles = import.meta.glob<unknown>('./act*.json', { eager: true, import: 'default' })

describe('the real story', () => {
  it('finds the act files', () => {
    expect(Object.keys(storyFiles).length).toBeGreaterThan(0)
  })

  it('has no broken links, dead ends, unset flags or leaked script markup', () => {
    const problems = validateStory(Object.values(storyFiles), {
      placeholderSceneIds: PLACEHOLDER_SCENE_IDS,
      flagsSetByLaterActs: FLAGS_SET_BY_LATER_ACTS,
    })
    expect(problems).toEqual([])
  })
})
