import './EyeVeil.css'

/**
 * Ouro took Kade's left eye: the left third of the view goes black for the rest of the run.
 * The story column moves into the remaining two thirds (see App.css), so no word sits under the
 * black and every contrast ratio stays as it was.
 */
function EyeVeil() {
  return <div className="eye-veil" aria-hidden="true" />
}

export default EyeVeil
