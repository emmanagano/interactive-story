import { SAVE_VERSION } from './constants'
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
