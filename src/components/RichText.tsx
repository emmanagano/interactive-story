import { parseEmphasis, splitSegments } from './parseEmphasis'
import type { TextSegment } from './parseEmphasis'
import './RichText.css'

function renderSegments(segments: TextSegment[]) {
  return segments.map((segment, index) => {
    if (segment.style === 'strike') return <s key={index} className="rich-text__struck">{segment.text}</s>
    if (segment.style === 'code') return <code key={index} className="rich-text__code">{segment.text}</code>
    if (segment.style === 'boldCode') {
      return (
        <strong key={index}>
          <code className="rich-text__code">{segment.text}</code>
        </strong>
      )
    }
    if (segment.style === 'bold') return <strong key={index}>{segment.text}</strong>
    if (segment.style === 'italic') return <em key={index}>{segment.text}</em>
    return <span key={index}>{segment.text}</span>
  })
}

type Props = {
  text: string
  /** While text is being revealed: how many characters show. The rest still takes up its space. */
  revealed?: number
}

/** Shows story text, turning the script's marks into bold, italic, chip words and struck-out words. */
function RichText({ text, revealed }: Props) {
  const segments = parseEmphasis(text)
  if (revealed === undefined) return <>{renderSegments(segments)}</>

  const { shown, rest } = splitSegments(segments, revealed)
  return (
    <>
      {renderSegments(shown)}
      <span className="rich-text__pending">{renderSegments(rest)}</span>
    </>
  )
}

export default RichText
