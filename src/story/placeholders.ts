// Things the story refers to that a later act will provide. validateStory fails when an
// entry here becomes real, so each list shrinks as Step 4.2 lands.

/** Scenes that are linked to, or used by the engine, before they have been written. */
export const PLACEHOLDER_SCENE_IDS = [
  'scene-17', // Vale's Door, the start of Act 3
]

/** Memory flags earlier acts read that an ending in a later act sets. */
export const FLAGS_SET_BY_LATER_ACTS = [
  'was_removed', // Scene 21, Removed
  'saw_company', // Scene 20, Company Man
  'saw_merged', // Scene 23, Merged
]
