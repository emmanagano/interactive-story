import { TOTAL_ENDINGS } from './constants'
import type { Ending, EndingKind, Scene, Story } from './types'

/**
 * The banner line on an ending, written the way the script writes it:
 * "FLATLINE · ENDING 01 / 10 · DOC'S TABLE", "ENDING 06 / 10 · SOLD", "FLATLINE · ENDING 05 / 10".
 * Built from the ending's data so the number and name can never drift apart.
 */
export function endingHeader(ending: Ending, sceneTitle: string): string {
  const number = String(ending.number).padStart(2, '0')
  const prefix = ending.kind === 'death' ? 'FLATLINE · ' : ''
  // The Flatline ending is already named by the prefix, so it has no name of its own.
  const name = sceneTitle.toUpperCase() === 'FLATLINE' ? '' : ` · ${sceneTitle}`
  return `${prefix}ENDING ${number} / ${TOTAL_ENDINGS}${name}`
}

export type EndingSlot = {
  number: number
  found: boolean
  // Only filled in once found, so an unfound ending gives nothing away.
  title?: string
  kind?: EndingKind
}

/** All ten endings in order: found ones with their name, the rest as silhouettes. */
export function listEndingSlots(story: Story, endingsSeen: string[]): EndingSlot[] {
  const scenesByNumber = new Map(
    Object.values(story)
      .filter((scene) => scene.ending !== undefined)
      .map((scene) => [scene.ending?.number, scene]),
  )

  return Array.from({ length: TOTAL_ENDINGS }, (_, index) => {
    const number = index + 1
    const scene = scenesByNumber.get(number)
    if (!scene?.ending || !endingsSeen.includes(scene.ending.id)) return { number, found: false }
    return { number, found: true, title: scene.title, kind: scene.ending.kind }
  })
}

/** The ending a run just added to what the player has seen, or null if it was one they already had. */
export function findNewEndingId(endingsSeenBefore: string[], endingsSeenAfter: string[]): string | null {
  return endingsSeenAfter.find((endingId) => !endingsSeenBefore.includes(endingId)) ?? null
}

export function findEndingScene(story: Story, endingId: string): Scene | undefined {
  return Object.values(story).find((scene) => scene.ending?.id === endingId)
}
