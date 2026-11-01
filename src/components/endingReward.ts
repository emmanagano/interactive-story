import { TOTAL_ENDINGS } from '../engine/constants'

/**
 * What the unlock screen says under the ending's name. It speaks to progress only, never about
 * what the missing endings are, so it encourages without spoiling anything.
 */
export function rewardMessage(endingsFound: number): string {
  const left = TOTAL_ENDINGS - endingsFound
  if (left <= 0) return 'Every ending found. Kade is out of rooms to wake up in.'
  if (left === 1) return 'One left. You are close.'
  if (endingsFound === 1) return `First one down. ${left} still hidden. Every death teaches you something.`
  if (endingsFound === TOTAL_ENDINGS / 2) return `Halfway. ${left} still hidden.`
  return `${left} still hidden. What you learned this run will open doors on the next.`
}
