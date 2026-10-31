import { parseEmphasis } from './parseEmphasis'
import './RichText.css'

/** Shows story text, turning the script's ** and * marks into bold and italic. */
function RichText({ text }: { text: string }) {
  return (
    <>
      {parseEmphasis(text).map((segment, index) => {
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
      })}
    </>
  )
}

export default RichText
