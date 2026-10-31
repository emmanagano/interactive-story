import type { GameState, Memory, RunState } from './types'

/** Builds a state for tests so each one only states what it cares about. */
export function makeState(run: Partial<RunState> = {}, memory: Partial<Memory> = {}): GameState {
  return {
    run: {
      time: 21600,
      health: 5,
      heat: 0,
      sceneId: 'scene-01',
      runFlags: [],
      inventory: [],
      blurred: false,
      ...run,
    },
    memory: {
      version: 1,
      deaths: 0,
      flatlines: 0,
      runs: 0,
      endingsSeen: [],
      memoryFlags: [],
      ...memory,
    },
  }
}
