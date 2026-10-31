import { useCallback, useEffect, useState } from 'react'
import { DEFAULT_TEXT_SPEED, DEFAULT_VOLUME, loadSettings, saveSettings } from '../engine'
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
  sound: boolean
  volume: number
  setCalm: (calm: boolean) => void
  setTextSpeed: (speed: TextSpeed) => void
  setSound: (sound: boolean) => void
  setVolume: (volume: number) => void
}

/**
 * The player's preferences. Calm mode removes trembling, glitching, flicker and texture; until
 * the player chooses, it follows the system's reduced-motion setting. Every change is saved.
 */
export function useSettings(): SettingsControls {
  const [settings, setSettings] = useState(() => {
    const saved = loadSettings().settings
    return {
      calm: saved?.calmMode ?? prefersReducedMotion(),
      textSpeed: saved?.textSpeed ?? DEFAULT_TEXT_SPEED,
      sound: saved?.sound ?? false, // sound is off until the player turns it on
      volume: saved?.volume ?? DEFAULT_VOLUME,
    }
  })

  useEffect(() => {
    document.documentElement.toggleAttribute('data-calm', settings.calm)
  }, [settings.calm])

  const update = useCallback((next: typeof settings) => {
    setSettings(next)
    saveSettings({ version: 3, calmMode: next.calm, textSpeed: next.textSpeed, sound: next.sound, volume: next.volume })
  }, [])

  const setCalm = useCallback((calm: boolean) => update({ ...settings, calm }), [settings, update])
  const setTextSpeed = useCallback((textSpeed: TextSpeed) => update({ ...settings, textSpeed }), [settings, update])

  const setSound = useCallback((sound: boolean) => update({ ...settings, sound }), [settings, update])
  const setVolume = useCallback((volume: number) => update({ ...settings, volume }), [settings, update])

  return { ...settings, setCalm, setTextSpeed, setSound, setVolume }
}
