import EcgLine from './EcgLine'
import './TitleScreen.css'

type Props = {
  returning: boolean // has played before: offer Continue instead of Start
  endingsFound: number
  onStart: () => void
  onGuide: () => void
  onSettings: () => void
}

function TitleScreen({ returning, endingsFound, onStart, onGuide, onSettings }: Props) {
  return (
    <div className="title-screen">
      <h1 className="title-screen__name">Flatline</h1>
      <EcgLine />
      <nav className="title-screen__menu" aria-label="Main menu">
        {/* Start is where focus begins, so Enter alone gets a new player going. */}
        <button type="button" className="title-screen__button title-screen__button--primary" onClick={onStart} autoFocus>
          {returning ? 'Continue' : 'Start'}
        </button>
        <button type="button" className="title-screen__button" onClick={onGuide}>
          Summary
        </button>
        <button type="button" className="title-screen__button" onClick={onSettings}>
          Settings
        </button>
      </nav>
      {returning && <p className="title-screen__progress">Endings {endingsFound}/10</p>}
    </div>
  )
}

export default TitleScreen
