import './BlurNotice.css'

type Props = {
  blurred: boolean // painkillers are in effect
  calm: boolean // calm mode keeps the text sharp
}

/**
 * Sits right above the choices, where the player is looking, because that is where the blur shows.
 * (The live region already announces it to screen readers, so this one is not announced twice.)
 */
function BlurNotice({ blurred, calm }: Props) {
  if (!blurred) return null
  return (
    <p className="blur-notice">
      Painkillers are in your system: choice text is blurred until you choose again.
      {calm && ' Calm mode keeps the text sharp.'}
    </p>
  )
}

export default BlurNotice
