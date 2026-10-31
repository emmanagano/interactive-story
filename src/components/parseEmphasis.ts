export type TextSegment = {
  text: string
  style: 'plain' | 'bold' | 'italic' | 'code' | 'boldCode' | 'strike'
}

/**
 * The script marks emphasis with **bold**, *italic*, `code` and ~~struck~~ (a memory the player lost) (the chip's or a terminal's
 * words inside a sentence). This reads just those, so there is no Markdown library.
 * Stray asterisks and backticks stay as plain text.
 */
export function parseEmphasis(text: string): TextSegment[] {
  return text
    .split(/(\*\*`[^`]+`\*\*|`[^`]+`|~~[^~]+~~|\*\*[^*]+\*\*|\*[^*]+\*)/)
    .filter((part) => part !== '')
    .map((part): TextSegment => {
      if (part.startsWith('**`') && part.endsWith('`**') && part.length > 6) {
        return { text: part.slice(3, -3), style: 'boldCode' }
      }
      if (part.startsWith('~~') && part.endsWith('~~') && part.length > 4) {
        return { text: part.slice(2, -2), style: 'strike' }
      }
      if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
        return { text: part.slice(1, -1), style: 'code' }
      }
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
        return { text: part.slice(2, -2), style: 'bold' }
      }
      if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
        return { text: part.slice(1, -1), style: 'italic' }
      }
      return { text: part, style: 'plain' }
    })
}

/** The words a player reads, without the marks: what a screen reader should hear. */
export function plainText(text: string): string {
  return parseEmphasis(text)
    .map((segment) => segment.text)
    .join('')
}

/** Splits styled text after the first `count` characters, keeping each piece's style. */
export function splitSegments(segments: TextSegment[], count: number): { shown: TextSegment[]; rest: TextSegment[] } {
  const shown: TextSegment[] = []
  const rest: TextSegment[] = []
  let remaining = Math.max(0, count)
  for (const segment of segments) {
    if (remaining >= segment.text.length) {
      shown.push(segment)
      remaining -= segment.text.length
    } else if (remaining <= 0) {
      rest.push(segment)
    } else {
      shown.push({ ...segment, text: segment.text.slice(0, remaining) })
      rest.push({ ...segment, text: segment.text.slice(remaining) })
      remaining = 0
    }
  }
  return { shown, rest }
}
