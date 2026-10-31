export type TextSegment = {
  text: string
  style: 'plain' | 'bold' | 'italic'
}

/**
 * The script marks emphasis with **bold** and *italic*. This reads just those two,
 * so there is no Markdown library. Stray asterisks stay as plain text.
 */
export function parseEmphasis(text: string): TextSegment[] {
  return text
    .split(/(\*\*[^*]+\*\*|\*[^*]+\*)/)
    .filter((part) => part !== '')
    .map((part): TextSegment => {
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
        return { text: part.slice(2, -2), style: 'bold' }
      }
      if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
        return { text: part.slice(1, -1), style: 'italic' }
      }
      return { text: part, style: 'plain' }
    })
}
