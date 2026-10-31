/** 21600 seconds becomes "06:00:00", the way the script writes the timer. */
export function formatClock(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds))
  const parts = [Math.floor(seconds / 3600), Math.floor((seconds % 3600) / 60), seconds % 60]
  return parts.map((part) => String(part).padStart(2, '0')).join(':')
}
