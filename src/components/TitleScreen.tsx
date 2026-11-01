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
      <div className="title-screen__poster">
        <div className="title-screen__inner">
          <p className="title-screen__label" aria-hidden="true">
            /// MAIN.MENU
          </p>
          <h1 className="title-screen__name">Flatline</h1>
          <EcgLine />
        </div>
      </div>
      <div className="title-screen__lower">
        <div className="title-screen__inner">
          <nav className="title-screen__menu" aria-label="Main menu">
            {/* Start is where focus begins, so Enter alone gets a new player going. */}
            <button type="button" className="title-screen__button title-screen__button--primary notch" onClick={onStart} autoFocus>
              {returning ? 'Continue' : 'Start'}
            </button>
            <button type="button" className="title-screen__button notch" onClick={onGuide}>
              Summary
            </button>
            <button type="button" className="title-screen__button notch" onClick={onSettings}>
              Settings
            </button>
          </nav>
          {returning && <p className="title-screen__progress">Endings {endingsFound}/10</p>}
        </div>
      </div>
    </div>
  )
}

export default TitleScreen
