import { useCallback, useEffect, useRef, useState } from 'react'
import { SoundEngine } from '../audio/SoundEngine'

type Options = {
  enabled: boolean // the player turned sound on (it is off until they do)
  volume: number
  heartbeat: number | null // seconds between monitor beeps, or null for none
  flatlineKey: string | null // changes each time a death ending arrives, so the tone plays once per death
}

function makeContext(): AudioContext | null {
  try {
    return typeof AudioContext === 'undefined' ? null : new AudioContext()
  } catch {
    return null
  }
}

/**
 * Connects the sound engine to the game. Nothing plays until sound is on AND the player has
 * interacted with the page (a click or a key), which is also what browsers require.
 */
export function useSound({ enabled, volume, heartbeat, flatlineKey }: Options): { preview: () => void } {
  const [engine] = useState(() => new SoundEngine(makeContext))
  const [interacted, setInteracted] = useState(false)
  const lastFlatline = useRef<string | null>(null)
  const on = enabled && interacted

  useEffect(() => {
    if (interacted) return
    const markInteracted = () => setInteracted(true)
    window.addEventListener('pointerdown', markInteracted, { once: true })
    window.addEventListener('keydown', markInteracted, { once: true })
    return () => {
      window.removeEventListener('pointerdown', markInteracted)
      window.removeEventListener('keydown', markInteracted)
    }
  }, [interacted])

  useEffect(() => {
    if (on) engine.start()
    else engine.stop()
    return () => engine.stop()
  }, [on, engine])

  useEffect(() => engine.setVolume(volume), [volume, engine])
  useEffect(() => engine.setHeartbeat(heartbeat), [heartbeat, engine])

  useEffect(() => {
    // Only a death that arrives while sound is on plays the tone, never one that was already on screen.
    const isNewDeath = flatlineKey !== null && flatlineKey !== lastFlatline.current
    lastFlatline.current = flatlineKey
    if (isNewDeath && on) engine.playFlatline()
  }, [flatlineKey, on, engine])

  const preview = useCallback(() => engine.beep(), [engine])
  return { preview }
}
