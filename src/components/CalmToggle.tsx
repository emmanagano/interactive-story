import './CalmToggle.css'

type Props = {
  calm: boolean
  onChange: (calm: boolean) => void
}

/** A plain switch. The full settings screen arrives in Step 6.2. */
function CalmToggle({ calm, onChange }: Props) {
  return (
    <label className="calm-toggle">
      <input
        type="checkbox"
        role="switch"
        className="calm-toggle__input"
        checked={calm}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className="calm-toggle__track" aria-hidden="true" />
      <span className="calm-toggle__label">Calm mode</span>
    </label>
  )
}

export default CalmToggle
