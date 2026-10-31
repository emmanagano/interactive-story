import { useSyncExternalStore } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

function subscribe(onChange: () => void): () => void {
  try {
    const media = window.matchMedia(QUERY)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  } catch {
    return () => undefined
  }
}

function getSnapshot(): boolean {
  try {
    return window.matchMedia(QUERY).matches
  } catch {
    return false
  }
}

/** True when the system asks for reduced motion. It updates if the player changes the setting. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}
