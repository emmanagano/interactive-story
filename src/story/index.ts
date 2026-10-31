import type { Scene, Story } from '../engine'

// Every act file is picked up by name, so adding act2.json needs no change here. The
// generic below is a promise, not a check: story.test.ts is what proves the data fits.
const actFiles = import.meta.glob<Scene[]>('./act*.json', { eager: true, import: 'default' })

const allScenes: Scene[] = Object.keys(actFiles)
  .sort()
  .flatMap((path) => actFiles[path])

export const story: Story = Object.fromEntries(allScenes.map((scene) => [scene.id, scene]))
