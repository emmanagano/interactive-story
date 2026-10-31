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

  const defaults = { sound: false, volume: 0.5 }

  it('remembers calm mode, text speed, sound and volume', () => {
    const storage = makeStorage()
    const settings = { version: 3, calmMode: true, textSpeed: 'fast', sound: true, volume: 0.25 } as const
    expect(saveSettings(settings, storage)).toBe(true)
    expect(loadSettings(storage).settings).toEqual(settings)
  })

  it('upgrades a version 1 setting, keeping calm mode and starting with sound off', () => {
    const storage = makeStorage({ 'flatline:settings:v1': '{"version":1,"calmMode":true}' })
    expect(loadSettings(storage).settings).toEqual({ version: 3, calmMode: true, textSpeed: 'normal', ...defaults })
  })

  it('upgrades a version 2 setting, keeping calm mode and text speed, with sound off', () => {
    const storage = makeStorage({ 'flatline:settings:v1': '{"version":2,"calmMode":false,"textSpeed":"slow"}' })
    expect(loadSettings(storage).settings).toEqual({ version: 3, calmMode: false, textSpeed: 'slow', ...defaults })
  })

  it('falls back to the normal speed when the saved one is not a real speed', () => {
    const storage = makeStorage({ 'flatline:settings:v1': '{"version":3,"calmMode":false,"textSpeed":"warp","sound":false,"volume":0.5}' })
    expect(loadSettings(storage).settings).toEqual({ version: 3, calmMode: false, textSpeed: 'normal', ...defaults })
  })

  it('never turns sound on from something that is not exactly true, and keeps volume in range', () => {
    const storage = makeStorage({ 'flatline:settings:v1': '{"version":3,"calmMode":false,"textSpeed":"normal","sound":"yes","volume":7}' })
    expect(loadSettings(storage).settings).toEqual({ version: 3, calmMode: false, textSpeed: 'normal', ...defaults })
  })

  it('is stored under its own key, not the save', () => {
    const storage = makeStorage({ 'flatline:v1': '{"version":1}' })
    saveSettings({ version: 3, calmMode: false, textSpeed: 'normal', sound: false, volume: 0.5 }, storage)
    expect(storage.getItem('flatline:v1')).toBe('{"version":1}')
    expect(storage.getItem('flatline:settings:v1')).not.toBeNull()
  })

  it.each([
    ['not JSON', 'oops'],
    ['the wrong type', '{"version":1,"calmMode":"yes"}'],
    ['another version', '{"version":4,"calmMode":true}'],
    ['a missing field', '{"version":1}'],
  ])('ignores %s and falls back to the default', (_label, stored) => {
    expect(loadSettings(makeStorage({ 'flatline:settings:v1': stored })).settings).toBeNull()
  })

  it('works without saving when storage is blocked or missing', () => {
    expect(loadSettings(brokenStorage).settings).toBeNull()
    expect(loadSettings(null).settings).toBeNull()
    expect(saveSettings({ version: 3, calmMode: true, textSpeed: 'normal', sound: false, volume: 0.5 }, brokenStorage)).toBe(false)
    expect(saveSettings({ version: 3, calmMode: true, textSpeed: 'normal', sound: false, volume: 0.5 }, null)).toBe(false)
  })
})
