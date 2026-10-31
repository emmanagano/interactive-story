import type { Scene, Story } from '../engine'
import act1 from './act1.json'

// JSON imports are typed loosely (`act` is a number, not 1 | 2 | 3), so the shape is
// asserted once here. The story validation test in Step 2.2 proves the data really fits.
const allScenes: Scene[] = [...(act1 as Scene[])]

export const story: Story = Object.fromEntries(allScenes.map((scene) => [scene.id, scene]))
