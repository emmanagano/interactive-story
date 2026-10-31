import { MAX_HEALTH, MAX_HEAT, STARTING_TIME } from './constants'
import type { GameState, Story } from './types'

/** What the debug panel can change. Anything left out stays as it was. */
export type DebugPatch = Partial<{
  sceneId: string
  time: number
  health: number
  heat: number
  runFlags: string[]
  inventory: string[]
  deaths: number
  flatlines: number
  memoryFlags: string[]
}>

function clampWhole(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Math.round(value)))
}

/**
 * Sets things by hand for testing. It skips the story's rules on purpose (no costs, no
 * entry effects, no ending records), but keeps every number inside the range the game expects.
 */
export function applyDebugPatch(state: GameState, patch: DebugPatch): GameState {
  const { run, memory } = state
  return {
    run: {
      ...run,
      sceneId: patch.sceneId ?? run.sceneId,
      time: patch.time === undefined ? run.time : clampWhole(patch.time, 0, STARTING_TIME),
      health: patch.health === undefined ? run.health : clampWhole(patch.health, 0, MAX_HEALTH),
      heat: patch.heat === undefined ? run.heat : clampWhole(patch.heat, 0, MAX_HEAT),
      runFlags: patch.runFlags ?? run.runFlags,
      inventory: patch.inventory ?? run.inventory,
    },
    memory: {
      ...memory,
      deaths: patch.deaths === undefined ? memory.deaths : clampWhole(patch.deaths, 0, Number.MAX_SAFE_INTEGER),
      flatlines: patch.flatlines === undefined ? memory.flatlines : clampWhole(patch.flatlines, 0, Number.MAX_SAFE_INTEGER),
      memoryFlags: patch.memoryFlags ?? memory.memoryFlags,
    },
  }
}

export type StoryFlags = {
  runFlags: string[]
  memoryFlags: string[]
  items: string[]
}

/** Every flag and item the story can set, found by reading the scenes, so no list is kept by hand. */
export function listStoryFlags(story: Story): StoryFlags {
  const found = { runFlags: new Set<string>(), memoryFlags: new Set<string>(), items: new Set<string>() }
  const collect = (effect: { setRunFlags?: string[]; setMemoryFlags?: string[]; addItem?: string } | undefined) => {
    effect?.setRunFlags?.forEach((flag) => found.runFlags.add(flag))
    effect?.setMemoryFlags?.forEach((flag) => found.memoryFlags.add(flag))
    if (effect?.addItem) found.items.add(effect.addItem)
  }
  for (const scene of Object.values(story)) {
    scene.onEnter?.forEach((entry) => collect(entry.effect))
    scene.choices.forEach((choice) => collect(choice.effect))
  }
  return {
    runFlags: [...found.runFlags].sort(),
    memoryFlags: [...found.memoryFlags].sort(),
    items: [...found.items].sort(),
  }
}
