import type { ImportFailure } from '../engine'

/** What the settings screen says when a pasted save code cannot be used. */
export function describeImportFailure(reason: ImportFailure): string {
  switch (reason) {
    case 'not-a-save-code':
      return "That doesn't look like a save code. Paste the whole code you copied."
    case 'wrong-version':
      return 'That save comes from a different version of the game, so it cannot be loaded.'
    case 'invalid':
      return 'That save code is damaged and cannot be loaded.'
  }
}

/** A short summary of a save, so a player can see what an import would replace. */
export function describeProgress(memory: { deaths: number; runs: number; endingsSeen: string[] }): string {
  const runs = memory.runs === 1 ? '1 run' : `${memory.runs} runs`
  const deaths = memory.deaths === 1 ? '1 death' : `${memory.deaths} deaths`
  return `${memory.endingsSeen.length} of 10 endings, ${runs}, ${deaths}`
}
