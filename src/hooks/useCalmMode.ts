import { useCallback, useEffect, useState } from 'react'
import { loadSettings, saveSettings } from '../engine'

function prefersReducedMotion(): boolean {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  } catch {
    return false
  }
}

/**
 * Calm mode removes trembling, glitching, flicker and texture. Until the player chooses,
 * it follows the system's reduced-motion setting. The choice is saved on its own.
 */
export function useCalmMode(): { calm: boolean; setCalm: (calm: boolean) => void } {
  const [calm, setCalmState] = useState<boolean>(() => loadSettings().settings?.calmMode ?? prefersReducedMotion())

  useEffect(() => {
    document.documentElement.toggleAttribute('data-calm', calm)
  }, [calm])

  const setCalm = useCallback((next: boolean) => {
    setCalmState(next)
    saveSettings({ version: 1, calmMode: next })
  }, [])

  return { calm, setCalm }
}
