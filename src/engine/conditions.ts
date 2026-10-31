import type { Condition, GameState } from './types'

/**
 * Answers one question: does this condition hold right now?
 * It never decides what to do about the answer. A locked choice is just a
 * `requires` that returned false; the engine and UI handle the rest.
 */
export function isConditionMet(condition: Condition | undefined, state: GameState): boolean {
  // No condition means "always", so blocks and choices without one are shown.
  if (condition === undefined) return true

  if ('flag' in condition) {
    // The script treats run and memory flags the same way in [if ...] lines.
    return (
      state.run.runFlags.includes(condition.flag) ||
      state.memory.memoryFlags.includes(condition.flag)
    )
  }
  if ('item' in condition) return state.run.inventory.includes(condition.item)
  if ('blurred' in condition) return state.run.blurred
  if ('not' in condition) return !isConditionMet(condition.not, state)
  if ('all' in condition) return condition.all.every((part) => isConditionMet(part, state))
  if ('any' in condition) return condition.any.some((part) => isConditionMet(part, state))

  const value = readStat(condition.stat, state)
  // A stat condition with no bounds is an authoring slip. Treating it as met
  // avoids locking a player out of the story because of a typo.
  if (condition.gte !== undefined && value < condition.gte) return false
  if (condition.lte !== undefined && value > condition.lte) return false
  return true
}

function readStat(stat: 'time' | 'health' | 'heat' | 'deaths' | 'flatlines', state: GameState): number {
  switch (stat) {
    case 'time':
    case 'health':
    case 'heat':
      return state.run[stat]
    case 'deaths':
    case 'flatlines':
      // Counted across runs, so these only change when a run ends.
      return state.memory[stat]
  }
}
