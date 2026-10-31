import { useEffect } from 'react'
import { chipVoice } from '../engine'

/** Writes how clear the chip sounds onto the root, for chip-line.css to read. */
export function useChipVoice(deaths: number): void {
  const voice = chipVoice(deaths)

  useEffect(() => {
    document.documentElement.setAttribute('data-chip-voice', voice)
  }, [voice])
}
