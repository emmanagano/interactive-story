import { useCallback, useEffect, useState } from 'react'
import { DEFAULT_TEXT_SPEED, loadSettings, saveSettings } from '../engine'
import type { TextSpeed } from '../engine'

function prefersReducedMotion(): boolean {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  } catch {
    return false
  }
}

export type SettingsControls = {
  calm: boolean
  textSpeed: TextSpeed
  setCalm: (calm: boolean) => void
  setTextSpeed: (speed: TextSpeed) => void
}

/**
 * The player's preferences. Calm mode removes trembling, glitching, flicker and texture; until
 * the player chooses, it follows the system's reduced-motion setting. Every change is saved.
 */
export function useSettings(): SettingsControls {
  const [settings, setSettings] = useState(() => {
    const saved = loadSettings().settings
    return { calm: saved?.calmMode ?? prefersReducedMotion(), textSpeed: saved?.textSpeed ?? DEFAULT_TEXT_SPEED }
  })

  useEffect(() => {
    document.documentElement.toggleAttribute('data-calm', settings.calm)
  }, [settings.calm])

  const update = useCallback((next: typeof settings) => {
    setSettings(next)
    saveSettings({ version: 2, calmMode: next.calm, textSpeed: next.textSpeed })
  }, [])

  const setCalm = useCallback((calm: boolean) => update({ ...settings, calm }), [settings, update])
  const setTextSpeed = useCallback((textSpeed: TextSpeed) => update({ ...settings, textSpeed }), [settings, update])

  return { calm: settings.calm, textSpeed: settings.textSpeed, setCalm, setTextSpeed }
}
