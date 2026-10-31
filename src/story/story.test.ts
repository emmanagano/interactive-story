import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { FLAGS_SET_BY_LATER_ACTS, PLACEHOLDER_SCENE_IDS } from './placeholders'
import { validateStory } from './validate'

// The folder is read when the test runs, so a new act file is always checked. (A build-time
// glob would be cached by Vitest and could quietly skip a file added later.)
const storyFolder = fileURLToPath(new URL('.', import.meta.url))
const actFileNames = readdirSync(storyFolder)
  .filter((name) => /^act\d+\.json$/.test(name))
  .sort()
const storyFiles = actFileNames.map((name): unknown => JSON.parse(readFileSync(join(storyFolder, name), 'utf-8')))

describe('the real story', () => {
  it('finds the act files', () => {
    expect(actFileNames).toContain('act1.json')
  })

  it('has no broken links, dead ends, unset flags or leaked script markup', () => {
    const problems = validateStory(storyFiles, {
      placeholderSceneIds: PLACEHOLDER_SCENE_IDS,
      flagsSetByLaterActs: FLAGS_SET_BY_LATER_ACTS,
    })
    expect(problems).toEqual([])
  })
})
