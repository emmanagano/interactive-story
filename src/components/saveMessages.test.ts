import { describe, expect, it } from 'vitest'
import { describeImportFailure, describeProgress } from './saveMessages'

describe('describeImportFailure', () => {
  it('has a plain sentence for every way an import can fail', () => {
    for (const reason of ['not-a-save-code', 'wrong-version', 'invalid'] as const) {
      expect(describeImportFailure(reason).length).toBeGreaterThan(20)
    }
    expect(describeImportFailure('wrong-version')).toContain('different version')
  })
})

describe('describeProgress', () => {
  it('summarises endings, runs and deaths with the right plurals', () => {
    expect(describeProgress({ endingsSeen: ['a', 'b'], runs: 3, deaths: 2 })).toBe('2 of 10 endings, 3 runs, 2 deaths')
    expect(describeProgress({ endingsSeen: [], runs: 1, deaths: 1 })).toBe('0 of 10 endings, 1 run, 1 death')
  })
})
