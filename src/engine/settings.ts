import { SETTINGS_KEY } from './constants'
import { browserStorage } from './memory'
import type { StorageLike } from './memory'

export const TEXT_SPEEDS = ['slow', 'normal', 'fast', 'instant'] as const
export type TextSpeed = (typeof TEXT_SPEEDS)[number]
export const DEFAULT_TEXT_SPEED: TextSpeed = 'normal'

/** Preferences, kept apart from progress so changing one never touches the other. */
export type Settings = {
  version: 2
  calmMode: boolean
  textSpeed: TextSpeed
}

export type SettingsResult = {
  settings: Settings | null // null when nothing usable was saved
}

function isTextSpeed(value: unknown): value is TextSpeed {
  return TEXT_SPEEDS.some((speed) => speed === value)
}

/**
 * Version 1 only knew calm mode. It is upgraded here, so a player who saved calm mode before text
 * speed existed keeps it. Anything unreadable falls back to the defaults.
 */
function migrate(parsed: unknown): Settings | null {
  if (typeof parsed !== 'object' || parsed === null || !('version' in parsed) || !('calmMode' in parsed)) return null
  if (typeof parsed.calmMode !== 'boolean') return null
  if (parsed.version === 1) return { version: 2, calmMode: parsed.calmMode, textSpeed: DEFAULT_TEXT_SPEED }
  if (parsed.version === 2) {
    const textSpeed = 'textSpeed' in parsed && isTextSpeed(parsed.textSpeed) ? parsed.textSpeed : DEFAULT_TEXT_SPEED
    return { version: 2, calmMode: parsed.calmMode, textSpeed }
  }
  return null
}

export function loadSettings(storage: StorageLike | null = browserStorage()): SettingsResult {
  if (!storage) return { settings: null }
  try {
    const stored = storage.getItem(SETTINGS_KEY)
    if (stored === null) return { settings: null }
    return { settings: migrate(JSON.parse(stored)) }
  } catch {
    // An unreadable or blocked setting is the same as no setting: use the default.
    return { settings: null }
  }
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
