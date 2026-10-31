import { MAX_HEALTH, MAX_HEAT, SECONDS_PER_HOUR, STARTING_TIME } from './constants'
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

function fullHoursElapsed(timeLeft: number): number {
  return Math.max(0, Math.floor((STARTING_TIME - timeLeft) / SECONDS_PER_HOUR))
}

/**
 * The chip drains 1 health for every full hour of story time that passes.
 * This is worked out from the clock itself, not from a stored counter, so it
 * cannot charge the same hour twice and does not care how choices are split up.
 */
function chipDrain(timeBefore: number, timeAfter: number): number {
  return fullHoursElapsed(timeAfter) - fullHoursElapsed(timeBefore)
}

/**
 * Applies a choice's cost and rewards. Returns a new state and never changes
 * the old one, so tests (and React) can compare before and after.
 */
export function applyEffect(state: GameState, effect: Effect): GameState {
  const { run, memory } = state

  const timeAfter = Math.max(0, run.time + (effect.time ?? 0))
  // Heal or hurt first and clamp, so a full-health heal cannot bank extra health
  // that the drain would then quietly absorb.
  const healthAfterEffect = clamp(run.health + (effect.health ?? 0), 0, MAX_HEALTH)

  const withItemAdded =
    effect.addItem === undefined ? run.inventory : [...run.inventory, effect.addItem]

  return {
    run: {
      ...run,
      time: timeAfter,
      health: Math.max(0, healthAfterEffect - chipDrain(run.time, timeAfter)),
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
