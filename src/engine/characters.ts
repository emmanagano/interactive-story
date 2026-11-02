import type { Story } from './types'

/** One paragraph of a character's profile. Without unlockFlags it shows as soon as they are met. */
export type CharacterDetail = {
  text: string
  unlockFlags?: string[] // shown only once memory holds one of these, so a profile never spoils a later scene
}

/** A person Kade can meet. Met once any one of `unlockFlags` is in memory (older saves only have the later flags). */
export type Character = {
  id: string
  name: string
  role: string
  unlockFlags: string[]
  firstSceneId: string // the scene whose title tells the player where they first met
  details: CharacterDetail[]
}

export type CharacterSlot = {
  id: string
  found: boolean
  // Only filled in once met, so a locked slot gives nothing away.
  name?: string
  role?: string
  metIn?: string
  details?: string[]
}

function hasAnyFlag(memoryFlags: string[], flags: string[]): boolean {
  return flags.some((flag) => memoryFlags.includes(flag))
}

/** Every character in roster order: met ones with their profile so far, the rest as silhouettes. */
export function listCharacterSlots(roster: Character[], story: Story, memoryFlags: string[]): CharacterSlot[] {
  return roster.map((character) => {
    if (!hasAnyFlag(memoryFlags, character.unlockFlags)) return { id: character.id, found: false }
    return {
      id: character.id,
      found: true,
      name: character.name,
      role: character.role,
      metIn: story[character.firstSceneId]?.title,
      details: character.details
        .filter((detail) => !detail.unlockFlags || hasAnyFlag(memoryFlags, detail.unlockFlags))
        .map((detail) => detail.text),
    }
  })
}
