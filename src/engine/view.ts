import { isConditionMet } from './conditions'
import type { Block, Choice, GameState, Scene } from './types'

/** A scene that only needs the player to press on uses a choice with this id (or "continue-…" when it has more than one way on); Enter takes it. */
export const CONTINUE_CHOICE_ID = 'continue'

function isContinueChoice(id: string): boolean {
  return id === CONTINUE_CHOICE_ID || id.startsWith(`${CONTINUE_CHOICE_ID}-`)
}

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

/**
 * An ending scene shows its closing chip line on the ending card, not in the story text.
 * Anything else is returned unchanged.
 */
export function splitEndingBlocks(scene: Scene, blocks: Block[]): { story: Block[]; finalChip: Block | null } {
  const last = blocks[blocks.length - 1]
  if (!scene.ending || !last || last.type !== 'chip') return { story: blocks, finalChip: null }
  return { story: blocks.slice(0, -1), finalChip: last }
}

/** Enter takes the "continue" choice when the scene has one, and does nothing otherwise. */
export function choiceIdForEnter(listed: ListedChoice[]): string | null {
  const entry = listed.find((candidate) => isContinueChoice(candidate.choice.id) && !candidate.locked)
  return entry ? entry.choice.id : null
}
