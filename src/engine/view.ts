import { isConditionMet } from './conditions'
import type { Block, Choice, GameState, Scene } from './types'

export type ListedChoice = {
  choice: Choice
  locked: boolean // shown greyed out, with no hint how to unlock it
}

/** The blocks the player reads right now: variants whose condition fails are left out. */
export function visibleBlocks(scene: Scene, state: GameState): Block[] {
  return scene.blocks.filter((block) => isConditionMet(block.when, state))
}

/** Hidden choices disappear. Locked ones stay in place, in script order, but cannot be taken. */
export function listChoices(scene: Scene, state: GameState): ListedChoice[] {
  return scene.choices
    .filter((choice) => isConditionMet(choice.hiddenUnless, state))
    .map((choice) => ({ choice, locked: !isConditionMet(choice.requires, state) }))
}

/** Number keys 1–4 pick the choice in that position, if it exists and is not locked. */
export function choiceIdForKey(key: string, listed: ListedChoice[]): string | null {
  if (!/^[1-4]$/.test(key)) return null
  const entry = listed[Number(key) - 1]
  return entry && !entry.locked ? entry.choice.id : null
}
