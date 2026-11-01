import { TEXT_SPEEDS } from '../engine'
import type { Memory, TextSpeed } from '../engine'
import SaveTools from './SaveTools'
import ToggleSwitch from './ToggleSwitch'
import './SettingsScreen.css'

type Props = {
  calm: boolean
  textSpeed: TextSpeed
  sound: boolean
  volume: number
  memory: Memory
  onCalm: (calm: boolean) => void
  onTextSpeed: (speed: TextSpeed) => void
  onSound: (sound: boolean) => void
  onVolume: (volume: number) => void
  onImport: (memory: Memory) => void
  onReset: () => void
  onBack: () => void
}

const SPEED_LABELS: Record<TextSpeed, string> = { slow: 'Slow', normal: 'Normal', fast: 'Fast', instant: 'Instant' }

function SettingsScreen({ calm, textSpeed, sound, volume, memory, onCalm, onTextSpeed, onSound, onVolume, onImport, onReset, onBack }: Props) {
  return (
    <section className="settings-screen notch" aria-labelledby="settings-title">
      <h1 id="settings-title" className="settings-screen__title" data-screen-heading tabIndex={-1}>
        Settings
      </h1>

      <div className="settings-screen__group">
        <ToggleSwitch label="Calm mode" checked={calm} onChange={onCalm} />
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
        <ToggleSwitch label="Sound" checked={sound} onChange={onSound} />
        <label className="settings-screen__slider">
          Volume {Math.round(volume * 100)}%
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={Math.round(volume * 100)}
            onChange={(event) => onVolume(Number(event.target.value) / 100)}
          />
        </label>
        <p className="settings-screen__hint">
          Rain, a heart monitor that speeds up as time runs out, and a flat tone when you die. Off until you turn it on.
        </p>
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
