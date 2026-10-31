import { describe, expect, it } from 'vitest'
import { createEmptyMemory, parseMemory } from './memory'
import type { Memory } from './types'

const savedMemory: Memory = {
  version: 1,
  deaths: 3,
  flatlines: 1,
  runs: 4,
  endingsSeen: ['doc', 'flatline'],
  memoryFlags: ['reyes_lied', 'knows_route'],
}

describe('createEmptyMemory', () => {
  it('starts a new player with nothing learned', () => {
    expect(createEmptyMemory()).toEqual({
      version: 1,
      deaths: 0,
      flatlines: 0,
      runs: 0,
      endingsSeen: [],
      memoryFlags: [],
    })
  })
})

describe('parseMemory', () => {
  it('accepts a good save', () => {
    expect(parseMemory(savedMemory)).toEqual(savedMemory)
  })

  it('drops fields it does not know about', () => {
    expect(parseMemory({ ...savedMemory, cheat: true })).toEqual(savedMemory)
  })

  it('removes duplicate flags and endings', () => {
    const doubled = { ...savedMemory, memoryFlags: ['a', 'a', 'b'], endingsSeen: ['x', 'x'] }
    const parsed = parseMemory(doubled)
    expect(parsed?.memoryFlags).toEqual(['a', 'b'])
    expect(parsed?.endingsSeen).toEqual(['x'])
  })

  it.each([
    ['null', null],
    ['a string', 'deaths'],
    ['an array', []],
    ['a missing field', { ...savedMemory, runs: undefined }],
    ['a number stored as a string', { ...savedMemory, deaths: '3' }],
    ['a negative count', { ...savedMemory, deaths: -1 }],
    ['a fractional count', { ...savedMemory, deaths: 1.5 }],
    ['flags that are not a list', { ...savedMemory, memoryFlags: 'reyes_lied' }],
    ['flags that are not strings', { ...savedMemory, memoryFlags: [1, 2] }],
    ['endings that are not a list', { ...savedMemory, endingsSeen: {} }],
    ['a future version', { ...savedMemory, version: 2 }],
    ['no version', { ...savedMemory, version: undefined }],
  ])('rejects %s', (_label, bad) => {
    expect(parseMemory(bad)).toBeNull()
  })
})
