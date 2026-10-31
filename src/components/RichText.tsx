import { parseEmphasis } from './parseEmphasis'

/** Shows story text, turning the script's ** and * marks into bold and italic. */
function RichText({ text }: { text: string }) {
  return (
    <>
      {parseEmphasis(text).map((segment, index) => {
        if (segment.style === 'bold') return <strong key={index}>{segment.text}</strong>
        if (segment.style === 'italic') return <em key={index}>{segment.text}</em>
        return <span key={index}>{segment.text}</span>
      })}
    </>
  )
}

export default RichText
