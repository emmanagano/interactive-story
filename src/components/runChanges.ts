import type { RunState } from '../engine'
import { formatClock } from './formatClock'

/** What a choice changed: how far each meter moved (after minus before, time in seconds), items, and the blur. */
export type RunChanges = {
  time: number
  health: number
  heat: number
  itemsGained: string[]
  itemsUsed: string[]
  blurStarted: boolean
}

export const NO_CHANGES: RunChanges = { time: 0, health: 0, heat: 0, itemsGained: [], itemsUsed: [], blurStarted: false }

/** Items in `from` that `other` has fewer of, counting copies. */
function missingFrom(from: string[], other: string[]): string[] {
  const remaining = [...other]
  return from.filter((item) => {
    const position = remaining.indexOf(item)
    if (position === -1) return true
    remaining.splice(position, 1)
    return false
  })
}

export function diffRun(before: RunState, after: RunState): RunChanges {
  return {
    time: after.time - before.time,
    health: after.health - before.health,
    heat: after.heat - before.heat,
    itemsGained: missingFrom(after.inventory, before.inventory),
    itemsUsed: missingFrom(before.inventory, after.inventory),
    blurStarted: !before.blurred && after.blurred,
  }
}

function plural(count: number, word: string): string {
  return `${count} ${word}${count === 1 ? '' : 's'}`
}

function describeDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const parts = []
  if (hours > 0) parts.push(plural(hours, 'hour'))
  if (minutes > 0) parts.push(plural(minutes, 'minute'))
  return parts.length > 0 ? parts.join(' ') : plural(seconds, 'second')
}

/** For the aria-live region, e.g. "Time minus 20 minutes. Heat up 1." Empty when nothing moved. */
export function describeChanges(changes: RunChanges): string {
  const sentences: string[] = []
  if (changes.time !== 0) {
    const direction = changes.time < 0 ? 'minus' : 'plus'
    sentences.push(`Time ${direction} ${describeDuration(Math.abs(changes.time))}.`)
  }
  for (const meter of ['health', 'heat'] as const) {
    const change = changes[meter]
    if (change === 0) continue
    const name = meter === 'health' ? 'Health' : 'Heat'
    sentences.push(`${name} ${change > 0 ? 'up' : 'down'} ${Math.abs(change)}.`)
  }
  // Things that have no meter, so without these a painkiller at full health would say nothing at all.
  if (changes.itemsGained.length > 0) sentences.push(`Got ${changes.itemsGained.join(', ')}.`)
  if (changes.itemsUsed.length > 0) sentences.push(`Used ${changes.itemsUsed.join(', ')}.`)
  if (changes.blurStarted) sentences.push('Choice text is doubled until your next choice.')
  return sentences.join(' ')
}

/** What a screen reader hears when the player wakes up again. */
export function describeNewRun(run: RunState): string {
  return `New run. ${formatClock(run.time)} left. Health ${run.health}. Heat ${run.heat}.`
}

/** What a screen reader hears when the Merged ending restores the interface. */
export const INTERFACE_RESTORED = 'Interface restored. Time is no longer limited. Health full. Heat 0.'

export type MeterDelta = { text: string; tone: 'cost' | 'gain' }

/**
 * The little callout shown beside a meter that just moved: "-20:00", "-1 HP", "+1".
 * Spending time, losing health and gaining heat are costs; the opposite is a gain.
 * Null when the meter did not move.
 */
export function describeDelta(meter: 'time' | 'health' | 'heat', changes: RunChanges): MeterDelta | null {
  const change = changes[meter]
  if (change === 0) return null
  const sign = change < 0 ? '−' : '+'
  if (meter === 'time') {
    // Drop the empty hours so twenty minutes reads "20:00", not "00:20:00".
    return { text: `${sign}${formatClock(Math.abs(change)).replace(/^00:/, '')}`, tone: change < 0 ? 'cost' : 'gain' }
  }
  if (meter === 'health') return { text: `${sign}${Math.abs(change)} HP`, tone: change < 0 ? 'cost' : 'gain' }
  return { text: `${sign}${Math.abs(change)}`, tone: change > 0 ? 'cost' : 'gain' }
}
