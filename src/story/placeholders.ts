// Things Act 1 refers to that later acts will provide. validateStory fails when an
// entry here becomes real, so each list shrinks as Steps 4.1 and 4.2 land.

/** Scenes that are linked to, or used by the engine, before they have been written. */
export const PLACEHOLDER_SCENE_IDS = [
  'scene-08', // Ouro's Price
  'scene-10', // The Lab
  'scene-12', // Following the Chip
  'scene-13', // The Drowned Line
  'scene-16', // Flatline (the engine sends players here at zero time or health)
]

/** Memory flags Act 1 reads that an ending in a later act sets. */
export const FLAGS_SET_BY_LATER_ACTS = [
  'tavi_secret', // Scene 14, Tavi's Trade
  'was_removed', // Scene 21, Removed
  'saw_company', // Scene 20, Company Man
  'saw_sold', // Scene 09, Sold
  'saw_merged', // Scene 23, Merged
]
