// Things the story refers to that a later act will provide. validateStory fails when an
// entry here becomes real. The whole story is written now, so both lists are empty; they stay
// so a future act or a deleted scene is caught the same way.

/** Scenes that are linked to, or used by the engine, before they have been written. */
export const PLACEHOLDER_SCENE_IDS: string[] = []

/** Memory flags earlier acts read that an ending in a later act sets. */
export const FLAGS_SET_BY_LATER_ACTS: string[] = []
