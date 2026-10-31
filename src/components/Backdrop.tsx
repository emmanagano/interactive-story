import './Backdrop.css'

/** The city behind the HUD. Purely decorative, so it is hidden from assistive technology. */
function Backdrop() {
  return (
    <div className="backdrop" aria-hidden="true">
      <div className="backdrop__glow" />
      <div className="backdrop__sign backdrop__sign--magenta" />
      <div className="backdrop__sign backdrop__sign--cyan" />
      <div className="backdrop__sign backdrop__sign--pink" />
      <div className="backdrop__skyline" />
      <div className="backdrop__windows" />
      <div className="backdrop__rain" />
      <div className="backdrop__noise" />
      <div className="backdrop__scanlines" />
    </div>
  )
}

export default Backdrop
