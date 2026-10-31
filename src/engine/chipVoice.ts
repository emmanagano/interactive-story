/** How clear LAZARUS sounds, from the script's table of "how the chip's voice changes". */
export type ChipVoice = 'broken' | 'clear' | 'human' | 'calm'

export function chipVoice(deaths: number): ChipVoice {
  if (deaths <= 0) return 'broken' // 0 deaths: broken words, cutting out
  if (deaths <= 2) return 'clear' // 1-2: short, clear, urgent
  if (deaths <= 4) return 'human' // 3-4: starts sounding like a person
  return 'calm' // 5+: calm, knowing, counts the runs
}
