import { TOTAL_ENDINGS } from '../engine/constants'
import type { EndingSlot } from '../engine'
import './EndingTracker.css'

type Props = {
  slots: EndingSlot[]
}

/** "ENDINGS 2/10": found endings show their name, the rest stay as silhouettes with no clue. */
function EndingTracker({ slots }: Props) {
  const found = slots.filter((slot) => slot.found).length

  return (
    <section className="ending-tracker" aria-labelledby="ending-tracker-title">
      <h2 id="ending-tracker-title" className="ending-tracker__title">
        Endings {found}/{TOTAL_ENDINGS}
      </h2>
      <ol className="ending-tracker__slots">
        {slots.map((slot) => {
          const number = String(slot.number).padStart(2, '0')
          if (!slot.found) {
            return (
              <li key={slot.number} className="ending-tracker__slot ending-tracker__slot--locked notch notch--small">
                <span aria-hidden="true">{number} ???</span>
                <span className="visually-hidden">Ending {slot.number}, not found yet</span>
              </li>
            )
          }
          return (
            <li key={slot.number} className={`ending-tracker__slot ending-tracker__slot--${slot.kind} notch notch--small`}>
              <span className="ending-tracker__number">{number}</span> {slot.title}
            </li>
          )
        })}
      </ol>
    </section>
  )
}

export default EndingTracker
