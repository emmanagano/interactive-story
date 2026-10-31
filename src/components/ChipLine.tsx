import './ChipLine.css'

/** One line of LAZARUS. The data holds the words; the ">" is part of how the chip looks. */
function ChipLine({ text }: { text: string }) {
  return (
    <p className="chip-line">
      <span aria-hidden="true">&gt; </span>
      {text}
    </p>
  )
}

export default ChipLine
