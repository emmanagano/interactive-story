import { SETTINGS_KEY } from './constants'
import { browserStorage } from './memory'
import type { StorageLike } from './memory'

/** Preferences, kept apart from progress so changing one never touches the other. */
export type Settings = {
  version: 1
  calmMode: boolean
}

export type SettingsResult = {
  settings: Settings | null // null when nothing usable was saved
}

export function loadSettings(storage: StorageLike | null = browserStorage()): SettingsResult {
  if (!storage) return { settings: null }
  try {
    const stored = storage.getItem(SETTINGS_KEY)
    if (stored === null) return { settings: null }
    const parsed: unknown = JSON.parse(stored)
    if (typeof parsed === 'object' && parsed !== null && 'version' in parsed && 'calmMode' in parsed) {
      if (parsed.version === 1 && typeof parsed.calmMode === 'boolean') {
        return { settings: { version: 1, calmMode: parsed.calmMode } }
      }
    }
  } catch {
    // An unreadable or blocked setting is the same as no setting: use the default.
  }
  return { settings: null }
}

export function saveSettings(settings: Settings, storage: StorageLike | null = browserStorage()): boolean {
  if (!storage) return false
  try {
    storage.setItem(SETTINGS_KEY, JSON.stringify(settings))
    return true
  } catch {
    return false
  }
}
