import { useEffect } from 'react'
import { computeDecay } from '../engine'
import type { RunState } from '../engine'

/** Writes --decay onto the root so decay.css can read it. The CSS decides what decay looks like. */
export function useDecay(run: Pick<RunState, 'time' | 'health'>, cleanInterface: boolean): void {
  // The Merged ending resets the interface to fully clean, whatever the clock and health say.
  const decay = cleanInterface ? 0 : computeDecay(run)

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--decay', decay.toFixed(3))
    root.toggleAttribute('data-decaying', decay > 0)
  }, [decay])
}
