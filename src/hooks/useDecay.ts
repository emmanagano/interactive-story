import { useEffect } from 'react'
import { computeDecay } from '../engine'
import type { RunState } from '../engine'

/** Writes --decay onto the root so decay.css can read it. The CSS decides what decay looks like. */
export function useDecay(run: Pick<RunState, 'time' | 'health'>): void {
  const decay = computeDecay(run)

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--decay', decay.toFixed(3))
    root.toggleAttribute('data-decaying', decay > 0)
  }, [decay])
}
