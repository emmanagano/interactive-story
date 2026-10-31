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
