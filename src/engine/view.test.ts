import { describe, expect, it } from 'vitest'
import { choiceIdForKey, listChoices, visibleBlocks } from './view'
import { makeState } from './testState'
import type { Scene } from './types'

const scene: Scene = {
  id: 'scene-01',
  act: 1,
  title: 'TEST',
  blocks: [
    { type: 'text', text: 'always' },
    { type: 'text', text: 'only after a past run', when: { flag: 'reyes_lied' } },
    { type: 'chip', text: 'five deaths in', when: { stat: 'deaths', gte: 5 } },
  ],
  choices: [
    { id: 'plain', label: 'PLAIN', goto: 'a' },
    { id: 'locked', label: 'LOCKED', requires: { flag: 'reyes_lied' }, goto: 'b' },
    { id: 'hidden', label: 'HIDDEN', hiddenUnless: { item: 'painkillers' }, goto: 'c' },
    { id: 'last', label: 'LAST', goto: 'd' },
  ],
}

describe('visibleBlocks', () => {
  it('shows only the blocks whose condition holds', () => {
    expect(visibleBlocks(scene, makeState()).map((block) => block.text)).toEqual(['always'])
    const later = makeState({}, { memoryFlags: ['reyes_lied'], deaths: 5 })
    expect(visibleBlocks(scene, later).map((block) => block.text)).toEqual([
      'always',
      'only after a past run',
      'five deaths in',
    ])
  })
})

describe('listChoices', () => {
  it('drops hidden choices and marks unmet ones as locked, keeping the order', () => {
    const listed = listChoices(scene, makeState())
    expect(listed.map((entry) => [entry.choice.id, entry.locked])).toEqual([
      ['plain', false],
      ['locked', true],
      ['last', false],
    ])
  })

  it('unlocks a choice once its condition is met and reveals hidden ones', () => {
    const state = makeState({ inventory: ['painkillers'] }, { memoryFlags: ['reyes_lied'] })
    const listed = listChoices(scene, state)
    expect(listed.map((entry) => [entry.choice.id, entry.locked])).toEqual([
      ['plain', false],
      ['locked', false],
      ['hidden', false],
      ['last', false],
    ])
  })
})

describe('choiceIdForKey', () => {
  const listed = listChoices(scene, makeState())

  it('picks the choice at that position', () => {
    expect(choiceIdForKey('1', listed)).toBe('plain')
    expect(choiceIdForKey('3', listed)).toBe('last')
  })

  it('does nothing for a locked choice, a missing position or another key', () => {
    expect(choiceIdForKey('2', listed)).toBeNull()
    expect(choiceIdForKey('4', listed)).toBeNull()
    expect(choiceIdForKey('5', listed)).toBeNull()
    expect(choiceIdForKey('a', listed)).toBeNull()
    expect(choiceIdForKey('12', listed)).toBeNull()
  })
})
