import { describe, expect, it } from 'vitest'
import { listCharacterSlots } from './characters'
import type { Story } from './types'

const roster = [
  { id: 'reyes', name: 'Doc Reyes', unlockFlags: ['met_reyes', 'reyes_lied'], firstSceneId: 'scene-03' },
  { id: 'sable', name: 'Sable', unlockFlags: ['met_sable'], firstSceneId: 'scene-11' },
]
const story = { 'scene-03': { title: 'WHO DID YOU CALL?' } } as unknown as Story

describe('listCharacterSlots', () => {
  it('keeps everyone locked, with no name, before anyone is met', () => {
    expect(listCharacterSlots(roster, story, [])).toEqual([
      { id: 'reyes', found: false },
      { id: 'sable', found: false },
    ])
  })

  it('shows the name and where they were met once a flag is set', () => {
    expect(listCharacterSlots(roster, story, ['met_reyes'])[0]).toEqual({
      id: 'reyes',
      found: true,
      name: 'Doc Reyes',
      metIn: 'WHO DID YOU CALL?',
    })
  })

  it('also unlocks from an older flag, so saves from before the tracker keep their characters', () => {
    expect(listCharacterSlots(roster, story, ['reyes_lied'])[0].found).toBe(true)
  })
})
