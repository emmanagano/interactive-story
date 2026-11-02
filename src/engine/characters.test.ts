import { describe, expect, it } from 'vitest'
import { listCharacterSlots } from './characters'
import type { Story } from './types'

const roster = [
  {
    id: 'reyes',
    name: 'Doc Reyes',
    role: 'Back-alley doctor',
    unlockFlags: ['met_reyes', 'reyes_lied'],
    firstSceneId: 'scene-03',
    details: [{ text: 'Runs the clinic.' }, { text: 'He sold Kade out.', unlockFlags: ['reyes_lied'] }],
  },
  { id: 'sable', name: 'Sable', role: 'Works for Halcyon', unlockFlags: ['met_sable'], firstSceneId: 'scene-11', details: [] },
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
      role: 'Back-alley doctor',
      metIn: 'WHO DID YOU CALL?',
      details: ['Runs the clinic.'],
    })
  })

  it('keeps a paragraph hidden until its own flag is set, so a profile never spoils a later scene', () => {
    expect(listCharacterSlots(roster, story, ['met_reyes'])[0].details).toEqual(['Runs the clinic.'])
    expect(listCharacterSlots(roster, story, ['met_reyes', 'reyes_lied'])[0].details).toEqual([
      'Runs the clinic.',
      'He sold Kade out.',
    ])
  })

  it('also unlocks from an older flag, so saves from before the tracker keep their characters', () => {
    expect(listCharacterSlots(roster, story, ['reyes_lied'])[0].found).toBe(true)
  })
})
