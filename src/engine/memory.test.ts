import { afterEach, describe, expect, it } from 'vitest'
import {
  browserStorage,
  createEmptyMemory,
  loadMemory,
  parseMemory,
  resetMemory,
  saveMemory,
  type StorageLike,
} from './memory'
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

function makeStorage(initial: Record<string, string> = {}): StorageLike & { data: Map<string, string> } {
  const data = new Map(Object.entries(initial))
  return {
    data,
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => void data.set(key, value),
    removeItem: (key) => void data.delete(key),
  }
}

function makeBrokenStorage(): StorageLike {
  const fail = () => {
    throw new Error('storage is unavailable')
  }
  return { getItem: fail, setItem: fail, removeItem: fail }
}

describe('loadMemory', () => {
  it('starts empty when nothing has been saved', () => {
    expect(loadMemory(makeStorage())).toEqual({ memory: createEmptyMemory(), status: 'empty' })
  })

  it('gets back what was saved', () => {
    const storage = makeStorage()
    saveMemory(savedMemory, storage)
    expect(loadMemory(storage)).toEqual({ memory: savedMemory, status: 'loaded' })
  })

  it('stores the save under flatline:v1', () => {
    const storage = makeStorage()
    saveMemory(savedMemory, storage)
    expect(JSON.parse(storage.data.get('flatline:v1') ?? '')).toEqual(savedMemory)
  })

  it.each([
    ['text that is not JSON', 'not json {'],
    ['JSON of the wrong shape', JSON.stringify({ deaths: 'three' })],
    ['a save from a newer version', JSON.stringify({ ...savedMemory, version: 2 })],
  ])('treats %s as corrupted and still returns usable memory', (_label, stored) => {
    const result = loadMemory(makeStorage({ 'flatline:v1': stored }))
    expect(result).toEqual({ memory: createEmptyMemory(), status: 'corrupted' })
  })

  it('works without saving when storage throws on read', () => {
    expect(loadMemory(makeBrokenStorage())).toEqual({ memory: createEmptyMemory(), status: 'unavailable' })
  })

  it('works when there is no storage at all', () => {
    expect(loadMemory(null)).toEqual({ memory: createEmptyMemory(), status: 'unavailable' })
  })
})

describe('saveMemory', () => {
  it('reports success', () => {
    expect(saveMemory(savedMemory, makeStorage())).toBe(true)
  })

  it('reports failure instead of crashing when storage throws, such as a full quota', () => {
    expect(saveMemory(savedMemory, makeBrokenStorage())).toBe(false)
  })

  it('reports failure when there is no storage', () => {
    expect(saveMemory(savedMemory, null)).toBe(false)
  })
})

describe('resetMemory', () => {
  it('removes the save and returns empty memory', () => {
    const storage = makeStorage()
    saveMemory(savedMemory, storage)
    expect(resetMemory(storage)).toEqual(createEmptyMemory())
    expect(loadMemory(storage).status).toBe('empty')
  })

  it('still returns empty memory when storage throws or is missing', () => {
    expect(resetMemory(makeBrokenStorage())).toEqual(createEmptyMemory())
    expect(resetMemory(null)).toEqual(createEmptyMemory())
  })
})

describe('browserStorage', () => {
  afterEach(() => {
    Reflect.deleteProperty(globalThis, 'localStorage')
  })

  it('returns null when looking up localStorage throws', () => {
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      get() {
        throw new Error('SecurityError')
      },
    })
    expect(browserStorage()).toBeNull()
  })

  it('returns null when the browser has no localStorage', () => {
    Reflect.deleteProperty(globalThis, 'localStorage')
    expect(browserStorage()).toBeNull()
  })
})
