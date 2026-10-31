import { SETTINGS_KEY } from './constants'
import { browserStorage } from './memory'
import type { StorageLike } from './memory'

export const TEXT_SPEEDS = ['slow', 'normal', 'fast', 'instant'] as const
export type TextSpeed = (typeof TEXT_SPEEDS)[number]
export const DEFAULT_TEXT_SPEED: TextSpeed = 'normal'
export const DEFAULT_VOLUME = 0.5

/** Preferences, kept apart from progress so changing one never touches the other. */
export type Settings = {
  version: 3
  calmMode: boolean
  textSpeed: TextSpeed
  sound: boolean // off until the player turns it on
  volume: number // 0 to 1
}

export type SettingsResult = {
  settings: Settings | null // null when nothing usable was saved
}

function isTextSpeed(value: unknown): value is TextSpeed {
  return TEXT_SPEEDS.some((speed) => speed === value)
}

/**
 * Older settings are upgraded here. Version 1 only knew calm mode and version 2 added text speed;
 * a player keeps whatever they had chosen, and the new options start at their defaults (sound off).
 * Anything unreadable falls back to the defaults.
 */
function migrate(parsed: unknown): Settings | null {
  if (typeof parsed !== 'object' || parsed === null || !('version' in parsed) || !('calmMode' in parsed)) return null
  if (typeof parsed.calmMode !== 'boolean') return null
  const calmMode = parsed.calmMode
  if (parsed.version === 1) return { version: 3, calmMode, textSpeed: DEFAULT_TEXT_SPEED, sound: false, volume: DEFAULT_VOLUME }
  if (parsed.version !== 2 && parsed.version !== 3) return null

  const textSpeed = 'textSpeed' in parsed && isTextSpeed(parsed.textSpeed) ? parsed.textSpeed : DEFAULT_TEXT_SPEED
  if (parsed.version === 2) return { version: 3, calmMode, textSpeed, sound: false, volume: DEFAULT_VOLUME }

  const sound = 'sound' in parsed && parsed.sound === true
  const volume =
    'volume' in parsed && typeof parsed.volume === 'number' && parsed.volume >= 0 && parsed.volume <= 1 ? parsed.volume : DEFAULT_VOLUME
  return { version: 3, calmMode, textSpeed, sound, volume }
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
