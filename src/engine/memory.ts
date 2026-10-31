import { SAVE_KEY, SAVE_VERSION } from './constants'
import type { Memory } from './types'

export function createEmptyMemory(): Memory {
  return {
    version: SAVE_VERSION,
    deaths: 0,
    flatlines: 0,
    runs: 0,
    endingsSeen: [],
    memoryFlags: [],
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isCount(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0
}

function toUniqueStrings(value: unknown): string[] | null {
  if (!Array.isArray(value) || !value.every((entry) => typeof entry === 'string')) return null
  return [...new Set(value as string[])]
}

/**
 * The one gate for anything that comes from storage or an import. It rebuilds the
 * memory field by field, so unknown extras are dropped and nothing half-valid
 * gets through. Returns null when the data cannot be trusted.
 *
 * Future save versions would be migrated here: add a case for the old version
 * that upgrades the data, then falls through to the checks below.
 */
export function parseMemory(value: unknown): Memory | null {
  if (!isRecord(value) || value.version !== SAVE_VERSION) return null

  const { deaths, flatlines, runs } = value
  const endingsSeen = toUniqueStrings(value.endingsSeen)
  const memoryFlags = toUniqueStrings(value.memoryFlags)
  if (!isCount(deaths) || !isCount(flatlines) || !isCount(runs)) return null
  if (!endingsSeen || !memoryFlags) return null

  return { version: SAVE_VERSION, deaths, flatlines, runs, endingsSeen, memoryFlags }
}

/** The small part of localStorage the game uses, so tests can pass a fake. */
export type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>

export type LoadStatus =
  | 'loaded' // a valid save was read
  | 'empty' // nothing saved yet
  | 'corrupted' // something was saved but cannot be trusted
  | 'unavailable' // storage cannot be used at all

export type LoadResult = { memory: Memory; status: LoadStatus }

/** Even looking up localStorage can throw (blocked cookies, some private modes). */
export function browserStorage(): StorageLike | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage
  } catch {
    return null
  }
}

/** Always returns usable memory, so the game starts even when the save is bad. */
export function loadMemory(storage: StorageLike | null = browserStorage()): LoadResult {
  const fresh = createEmptyMemory()
  if (!storage) return { memory: fresh, status: 'unavailable' }

  let stored: string | null
  try {
    stored = storage.getItem(SAVE_KEY)
  } catch {
    return { memory: fresh, status: 'unavailable' }
  }
  if (stored === null) return { memory: fresh, status: 'empty' }

  try {
    const memory = parseMemory(JSON.parse(stored))
    return memory ? { memory, status: 'loaded' } : { memory: fresh, status: 'corrupted' }
  } catch {
    return { memory: fresh, status: 'corrupted' }
  }
}

/** Returns false when the save did not stick, so the UI can say progress is not being kept. */
export function saveMemory(memory: Memory, storage: StorageLike | null = browserStorage()): boolean {
  if (!storage) return false
  try {
    storage.setItem(SAVE_KEY, JSON.stringify(memory))
    return true
  } catch {
    return false
  }
}

/** Forgets everything. The "are you sure" step is the UI's job; this is the deed. */
export function resetMemory(storage: StorageLike | null = browserStorage()): Memory {
  try {
    storage?.removeItem(SAVE_KEY)
  } catch {
    // Nothing more to do. The game still carries on with fresh memory.
  }
  return createEmptyMemory()
}
