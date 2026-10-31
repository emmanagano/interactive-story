import type { RunState } from '../engine'
import { formatClock } from './formatClock'
import './DecayPreview.css'

type Props = {
  run: Pick<RunState, 'time' | 'health'>
  onChange: (values: Partial<Pick<RunState, 'time' | 'health'>>) => void
}

/** Temporary: drag the sliders to watch the interface decay. The debug panel (Step 5.1) replaces it. */
function DecayPreview({ run, onChange }: Props) {
  return (
    <fieldset className="decay-preview">
      <legend>Decay preview (temporary)</legend>
      <label className="decay-preview__row">
        <span>Time left {formatClock(run.time)}</span>
        <input
          type="range"
          min={0}
          max={21600}
          step={60}
          value={run.time}
          onChange={(event) => onChange({ time: Number(event.target.value) })}
        />
      </label>
      <label className="decay-preview__row">
        <span>Health {run.health}</span>
        <input
          type="range"
          min={0}
          max={5}
          step={1}
          value={run.health}
          onChange={(event) => onChange({ health: Number(event.target.value) })}
        />
      </label>
    </fieldset>
  )
}

export default DecayPreview
