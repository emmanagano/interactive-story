import './ToggleSwitch.css'

type Props = {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

/** A labelled on/off switch. The real checkbox stays underneath, so it works with a keyboard and a screen reader. */
function ToggleSwitch({ label, checked, onChange }: Props) {
  return (
    <label className="toggle-switch">
      <input
        type="checkbox"
        role="switch"
        className="toggle-switch__input"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className="toggle-switch__track" aria-hidden="true" />
      <span className="toggle-switch__label">{label}</span>
    </label>
  )
}

export default ToggleSwitch
