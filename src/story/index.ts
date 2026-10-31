import type { Scene, Story } from '../engine'
import act1 from './act1.json'
import act2 from './act2.json'
import act3 from './act3.json'

// JSON imports are typed loosely (`act` is a number, not 1 | 2 | 3), so the shape is asserted
// once here. story.test.ts proves the data fits, and that every act file in this folder is listed.
const allScenes = [...act1, ...act2, ...act3] as Scene[]

export const story: Story = Object.fromEntries(allScenes.map((scene) => [scene.id, scene]))
