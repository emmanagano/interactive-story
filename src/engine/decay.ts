import type { RunState } from './types'

const DECAY_STARTS_UNDER_SECONDS = 3600 // under 1:00:00 left
const DECAY_STARTS_UNDER_HEALTH = 3

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value))
}

/**
 * How broken the interface looks, from 0 (clean) to 1 (falling apart). Time and
 * health each add decay; the two combine so that being low on both is worse than either.
 */
export function computeDecay(run: Pick<RunState, 'time' | 'health'>): number {
  const fromTime = clamp01(1 - run.time / DECAY_STARTS_UNDER_SECONDS)
  const fromHealth = clamp01((DECAY_STARTS_UNDER_HEALTH - run.health) / DECAY_STARTS_UNDER_HEALTH)
  return 1 - (1 - fromTime) * (1 - fromHealth)
}
