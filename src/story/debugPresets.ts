import type { DebugPatch } from '../engine'

export type DebugPreset = {
  label: string
  patch: DebugPatch
}

// One click to the part of the story being tested. These name real flags, so the story test
// below (debugPresets.test.ts) fails if a flag here is not one the story can set.
export const DEBUG_PRESETS: DebugPreset[] = [
  {
    label: 'Last choice, Merged unlocked',
    patch: { sceneId: 'scene-19', time: 14400, health: 5, heat: 0, deaths: 2, runFlags: ['listened', 'door_lazarus'], memoryFlags: ['knows_lazarus'] },
  },
  {
    label: 'Last choice, everything unlocked',
    patch: {
      sceneId: 'scene-19',
      time: 14400,
      health: 5,
      heat: 0,
      deaths: 2,
      runFlags: ['listened', 'door_lazarus', 'with_tavi', 'tavi_forgiven', 'vale_code'],
      memoryFlags: ['knows_lazarus', 'knows_route', 'tavi_secret', 'reyes_lied', 'met_sable'],
    },
  },
  {
    label: 'Two minutes left, 1 HP (watch it decay)',
    patch: { time: 120, health: 1 },
  },
]
