import { describe, expect, it } from 'vitest'
import { listStoryFlags } from '../engine'
import { DEBUG_PRESETS } from './debugPresets'
import { story } from './index'

describe('debug presets', () => {
  const flags = listStoryFlags(story)

  it('only jump to scenes that exist', () => {
    for (const preset of DEBUG_PRESETS) {
      if (preset.patch.sceneId) expect(story[preset.patch.sceneId], preset.label).toBeDefined()
    }
  })

  it('only use flags the story can set', () => {
    for (const preset of DEBUG_PRESETS) {
      for (const flag of preset.patch.runFlags ?? []) expect(flags.runFlags, `${preset.label}: ${flag}`).toContain(flag)
      for (const flag of preset.patch.memoryFlags ?? []) expect(flags.memoryFlags, `${preset.label}: ${flag}`).toContain(flag)
    }
  })
})
