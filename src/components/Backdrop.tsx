import './Backdrop.css'

/** Behind everything: grain and scanlines. Purely decorative, so hidden from assistive technology. */
function Backdrop() {
  return (
    <div className="backdrop" aria-hidden="true">
      <div className="backdrop__noise" />
      <div className="backdrop__scanlines" />
    </div>
  )
}

export default Backdrop
