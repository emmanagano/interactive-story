import type { Character } from '../engine'

// The people Kade meets, in the order the story introduces them. Names are as the script writes them.
// Each flag is set by a scene's onEnter (met_*) or by an existing story flag, and characters.test.ts
// checks that the story can really set at least one flag per character.
export const CHARACTERS: Character[] = [
  { id: 'reyes', name: 'Doc Reyes', unlockFlags: ['met_reyes', 'reyes_lied'], firstSceneId: 'scene-03' },
  { id: 'tavi', name: 'Tavi', unlockFlags: ['met_tavi', 'tavi_secret'], firstSceneId: 'scene-04' },
  { id: 'ouro', name: 'Mama Ouro', unlockFlags: ['met_ouro'], firstSceneId: 'scene-05' },
  { id: 'lazarus', name: 'LAZARUS', unlockFlags: ['knows_lazarus'], firstSceneId: 'scene-09' },
  { id: 'sable', name: 'Sable', unlockFlags: ['met_sable'], firstSceneId: 'scene-11' },
  { id: 'vale', name: 'Iris Vale', unlockFlags: ['met_vale', 'was_removed'], firstSceneId: 'scene-18' },
]
