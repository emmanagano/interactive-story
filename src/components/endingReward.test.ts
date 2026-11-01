import { describe, expect, it } from 'vitest'
import { rewardMessage } from './endingReward'

describe('rewardMessage', () => {
  it('celebrates the first ending and says how many are left', () => {
    expect(rewardMessage(1)).toContain('First one down')
    expect(rewardMessage(1)).toContain('9 still hidden')
  })

  it('marks the halfway point', () => {
    expect(rewardMessage(5)).toBe('Halfway. 5 still hidden.')
  })

  it('says how many are left in between', () => {
    expect(rewardMessage(3)).toContain('7 still hidden')
  })

  it('says one is left, then that all are found', () => {
    expect(rewardMessage(9)).toContain('One left')
    expect(rewardMessage(10)).toContain('Every ending found')
  })
})
