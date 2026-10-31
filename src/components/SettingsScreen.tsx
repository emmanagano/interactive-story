import { TEXT_SPEEDS } from '../engine'
import type { Memory, TextSpeed } from '../engine'
import CalmToggle from './CalmToggle'
import SaveTools from './SaveTools'
import './SettingsScreen.css'

type Props = {
  calm: boolean
  textSpeed: TextSpeed
  memory: Memory
  onCalm: (calm: boolean) => void
  onTextSpeed: (speed: TextSpeed) => void
  onImport: (memory: Memory) => void
  onReset: () => void
  onBack: () => void
}

const SPEED_LABELS: Record<TextSpeed, string> = { slow: 'Slow', normal: 'Normal', fast: 'Fast', instant: 'Instant' }

function SettingsScreen({ calm, textSpeed, memory, onCalm, onTextSpeed, onImport, onReset, onBack }: Props) {
  return (
    <section className="settings-screen" aria-labelledby="settings-title">
      <h2 id="settings-title" className="settings-screen__title" data-screen-heading tabIndex={-1}>
        Settings
      </h2>

      <div className="settings-screen__group">
        <CalmToggle calm={calm} onChange={onCalm} />
        <p className="settings-screen__hint">
          Stops trembling, glitching, flicker and the rain. Colours still drain as time runs out.
        </p>
      </div>

      <fieldset className="settings-screen__group">
        <legend>Text speed</legend>
        <div className="settings-screen__options">
          {TEXT_SPEEDS.map((speed) => (
            <label key={speed} className="settings-screen__option">
              <input type="radio" name="text-speed" value={speed} checked={textSpeed === speed} onChange={() => onTextSpeed(speed)} />
              {SPEED_LABELS[speed]}
            </label>
          ))}
        </div>
        <p className="settings-screen__hint">Instant shows each scene's text all at once. Calm mode does the same.</p>
      </fieldset>

      <div className="settings-screen__group">
        <label className="settings-screen__option settings-screen__option--disabled">
          <input type="checkbox" disabled checked={false} readOnly />
          Sound
        </label>
        <p className="settings-screen__hint">Not available yet. It will arrive in a later update, off by default.</p>
      </div>

      <div className="settings-screen__group">
        <SaveTools memory={memory} onImport={onImport} onReset={onReset} />
      </div>

      <button type="button" className="settings-screen__back" onClick={onBack}>
        Back
      </button>
    </section>
  )
}

export default SettingsScreen
