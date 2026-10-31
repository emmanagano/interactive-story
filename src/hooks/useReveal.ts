import { useCallback, useEffect, useState } from 'react'
import type { Block } from '../engine'
import { planReveal } from '../components/reveal'
import type { RevealPlan } from '../components/reveal'

export type Reveal = {
  plan: RevealPlan
  elapsed: number // seconds into the reveal
  revealing: boolean
  skip: () => void
}

const FRAME_MS = 40

/**
 * Runs the clock for a scene's text reveal. `resetKey` changes with every new scene, which
 * starts the reveal again; the same scene shown again (a painkiller, a loop) is not retyped.
 * With `enabled` off (calm mode, reduced motion) everything is shown at once.
 */
export function useReveal(blocks: Block[], enabled: boolean, resetKey: string): Reveal {
  const plan = planReveal(blocks)
  const [state, setState] = useState({ resetKey, elapsed: 0, skipped: false })

  // A new scene starts a new reveal. Adjusting state while rendering is React's way to reset on a changed key.
  if (state.resetKey !== resetKey) setState({ resetKey, elapsed: 0, skipped: false })

  const running = enabled && !state.skipped && state.elapsed < plan.total
  const total = plan.total

  useEffect(() => {
    if (!enabled || state.skipped) return
    const startedAt = performance.now()
    const timer = setInterval(() => {
      const seconds = (performance.now() - startedAt) / 1000
      setState((current) => (current.resetKey === resetKey ? { ...current, elapsed: seconds } : current))
      if (seconds >= total) clearInterval(timer)
    }, FRAME_MS)
    return () => clearInterval(timer)
  }, [enabled, resetKey, total, state.skipped])

  const skip = useCallback(() => setState((current) => ({ ...current, skipped: true })), [])

  return { plan, elapsed: running ? state.elapsed : total, revealing: running, skip }
}
