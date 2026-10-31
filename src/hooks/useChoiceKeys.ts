import { useEffect } from 'react'
import { choiceIdForEnter, choiceIdForKey } from '../engine'
import type { ListedChoice } from '../engine'

type Options = {
  choices: ListedChoice[]
  isOver: boolean
  revealing: boolean // the scene's text is still appearing
  onSkip: () => void
  onChoose: (choiceId: string) => void
  onRestart: () => void
}

/** Number keys 1–4 pick a choice. Escape, Enter or Space show all text while it is still appearing. Enter continues a scene that only needs pressing on, or wakes up again after an ending. */
export function useChoiceKeys({ choices, isOver, revealing, onSkip, onChoose, onRestart }: Options): void {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent): void {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      const target = event.target instanceof HTMLElement ? event.target : null
      if (target?.closest('input, textarea, select')) return

      // While text is still appearing, these show it all at once. Number keys still choose straight away.
      if (revealing && (event.key === 'Escape' || ((event.key === 'Enter' || event.key === ' ') && !target?.closest('button, a')))) {
        event.preventDefault()
        onSkip()
        return
      }

      if (event.key === 'Enter') {
        // A focused button already handles Enter itself, so only step in when focus is elsewhere.
        if (target?.closest('button, a')) return
        if (isOver) {
          event.preventDefault()
          onRestart()
          return
        }
        const continueId = choiceIdForEnter(choices)
        if (continueId) {
          event.preventDefault()
          onChoose(continueId)
        }
        return
      }

      const choiceId = choiceIdForKey(event.key, choices)
      if (choiceId) {
        event.preventDefault()
        onChoose(choiceId)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [choices, isOver, revealing, onSkip, onChoose, onRestart])
}
