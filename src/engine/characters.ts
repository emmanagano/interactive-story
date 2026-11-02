import type { Story } from './types'

/** A person Kade can meet. Met once any one of `unlockFlags` is in memory (older saves only have the later flags). */
export type Character = {
  id: string
  name: string
  unlockFlags: string[]
  firstSceneId: string // the scene whose title tells the player where they first met
}

export type CharacterSlot = {
  id: string
  found: boolean
  // Only filled in once met, so a locked slot gives nothing away.
  name?: string
  metIn?: string
}

/** Every character in roster order: met ones with their name and where, the rest as silhouettes. */
export function listCharacterSlots(roster: Character[], story: Story, memoryFlags: string[]): CharacterSlot[] {
  return roster.map((character) => {
    const found = character.unlockFlags.some((flag) => memoryFlags.includes(flag))
    if (!found) return { id: character.id, found: false }
    return { id: character.id, found: true, name: character.name, metIn: story[character.firstSceneId]?.title }
  })
}
