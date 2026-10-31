import { describe, expect, it } from 'vitest'
import { loadSettings, saveSettings } from './settings'
import type { StorageLike } from './memory'

function makeStorage(initial: Record<string, string> = {}): StorageLike {
  const data = new Map(Object.entries(initial))
  return {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => void data.set(key, value),
    removeItem: (key) => void data.delete(key),
  }
}

const brokenStorage: StorageLike = {
  getItem: () => {
    throw new Error('blocked')
  },
  setItem: () => {
    throw new Error('blocked')
  },
  removeItem: () => {
    throw new Error('blocked')
  },
}

describe('settings', () => {
  it('has nothing saved at first', () => {
    expect(loadSettings(makeStorage()).settings).toBeNull()
  })

  it('remembers calm mode', () => {
    const storage = makeStorage()
    expect(saveSettings({ version: 1, calmMode: true }, storage)).toBe(true)
    expect(loadSettings(storage).settings).toEqual({ version: 1, calmMode: true })
  })

  it('is stored under its own key, not the save', () => {
    const storage = makeStorage({ 'flatline:v1': '{"version":1}' })
    saveSettings({ version: 1, calmMode: false }, storage)
    expect(storage.getItem('flatline:v1')).toBe('{"version":1}')
    expect(storage.getItem('flatline:settings:v1')).not.toBeNull()
  })

  it.each([
    ['not JSON', 'oops'],
    ['the wrong type', '{"version":1,"calmMode":"yes"}'],
    ['another version', '{"version":2,"calmMode":true}'],
    ['a missing field', '{"version":1}'],
  ])('ignores %s and falls back to the default', (_label, stored) => {
    expect(loadSettings(makeStorage({ 'flatline:settings:v1': stored })).settings).toBeNull()
  })

  it('works without saving when storage is blocked or missing', () => {
    expect(loadSettings(brokenStorage).settings).toBeNull()
    expect(loadSettings(null).settings).toBeNull()
    expect(saveSettings({ version: 1, calmMode: true }, brokenStorage)).toBe(false)
    expect(saveSettings({ version: 1, calmMode: true }, null)).toBe(false)
  })
})
