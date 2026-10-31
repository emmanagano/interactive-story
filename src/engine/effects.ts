import { MAX_HEALTH, MAX_HEAT } from './constants'
import type { Effect, GameState } from './types'

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function withFlags(existingFlags: string[], newFlags: string[] | undefined): string[] {
  if (!newFlags) return existingFlags
  return [...existingFlags, ...newFlags.filter((flag) => !existingFlags.includes(flag))]
}

function withoutOneCopy(inventory: string[], item: string | undefined): string[] {
  if (item === undefined) return inventory
  const position = inventory.indexOf(item)
  if (position === -1) return inventory
  return [...inventory.slice(0, position), ...inventory.slice(position + 1)]
}

/**
 * Applies a choice's cost and rewards. Returns a new state and never changes
 * the old one, so tests (and React) can compare before and after.
 */
export function applyEffect(state: GameState, effect: Effect): GameState {
  const { run, memory } = state

  const withItemAdded =
    effect.addItem === undefined ? run.inventory : [...run.inventory, effect.addItem]

  return {
    run: {
      ...run,
      time: Math.max(0, run.time + (effect.time ?? 0)),
      health: clamp(run.health + (effect.health ?? 0), 0, MAX_HEALTH),
      heat: clamp(run.heat + (effect.heat ?? 0), 0, MAX_HEAT),
      runFlags: withFlags(run.runFlags, effect.setRunFlags),
      inventory: withoutOneCopy(withItemAdded, effect.useItem),
    },
    memory: {
      ...memory,
      memoryFlags: withFlags(memory.memoryFlags, effect.setMemoryFlags),
    },
  }
}
