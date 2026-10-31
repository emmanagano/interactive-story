import { STARTING_TIME } from './constants'
import { computeDecay } from './decay'
import type { RunState, Scene } from './types'

/** Seconds between monitor beeps when the run begins, and when the interface is falling apart. */
const CALM_INTERVAL = 1.5
const FRANTIC_INTERVAL = 0.3

/**
 * How long between beeps of the heart monitor. It starts slow and speeds up as the clock runs
 * down, and faster still when health is low (that is what the decay measures).
 */
export function heartbeatInterval(run: Pick<RunState, 'time' | 'health'>): number {
  const clockPressure = 0.6 * (1 - Math.min(1, Math.max(0, run.time / STARTING_TIME)))
  const urgency = Math.max(computeDecay(run), clockPressure)
  const interval = CALM_INTERVAL - (CALM_INTERVAL - FRANTIC_INTERVAL) * urgency
  return Math.round(interval * 1000) / 1000
}

/** The volume slider is 0 to 1. Ears hear loudness on a curve, so the gain follows a square, kept below clipping. */
export function gainFor(volume: number): number {
  const clamped = Math.min(1, Math.max(0, volume))
  return clamped * clamped * 0.8
}

/** A death ends with the flat tone. Survivals and the secret ending do not. */
export function soundCueForScene(scene: Pick<Scene, 'ending'>): 'flatline' | null {
  return scene.ending?.kind === 'death' ? 'flatline' : null
}
