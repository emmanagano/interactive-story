import { describe, expect, it } from 'vitest'
import { listStoryFlags } from '../engine'
import { CHARACTERS } from './characters'
import { DECISION_PROMPTS } from './decisionPrompts'
import { story } from './index'

describe('characters', () => {
  const { memoryFlags } = listStoryFlags(story)

  it('can each be met: the story sets at least one of their flags', () => {
    for (const character of CHARACTERS) {
      expect(character.unlockFlags.some((flag) => memoryFlags.includes(flag)), character.name).toBe(true)
    }
  })

  it('name a first scene that exists, and the character is named in it', () => {
    for (const character of CHARACTERS) {
      const scene = story[character.firstSceneId]
      expect(scene, character.name).toBeDefined()
    }
  })
})

describe('decision prompts', () => {
  it('belong to scenes that exist, have choices and are not endings', () => {
    for (const sceneId of Object.keys(DECISION_PROMPTS)) {
      const scene = story[sceneId]
      expect(scene, sceneId).toBeDefined()
      expect(scene.ending, sceneId).toBeUndefined()
      expect(scene.choices.length, sceneId).toBeGreaterThan(0)
    }
  })
})
