import { scrambleFrame } from './reveal'
import './ChipLine.css'

type Props = {
  text: string
  /** While the line is arriving: how many characters have resolved, and the animation tick. */
  resolving?: { resolved: number; tick: number }
}

/** One line of LAZARUS. The data holds the words; the ">" is part of how the chip looks. */
function ChipLine({ text, resolving }: Props) {
  if (!resolving) {
    return (
      <p className="chip-line">
        <span aria-hidden="true">&gt; </span>
        {text}
      </p>
    )
  }

  // Screen readers get the real line at once; the flickering copy is only for the eyes.
  return (
    <p className="chip-line">
      <span className="visually-hidden">{text}</span>
      <span aria-hidden="true">&gt; {scrambleFrame(text, resolving.resolved, resolving.tick)}</span>
    </p>
  )
}

export default ChipLine
