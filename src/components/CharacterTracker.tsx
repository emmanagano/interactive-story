import type { CharacterSlot } from '../engine'
import './CharacterTracker.css'

type Props = {
  slots: CharacterSlot[]
}

/** "CHARACTERS 2/6": met characters show their name and where, the rest stay as silhouettes with no clue. */
function CharacterTracker({ slots }: Props) {
  const met = slots.filter((slot) => slot.found).length

  return (
    <section className="character-tracker" aria-labelledby="character-tracker-title">
      <h2 id="character-tracker-title" className="character-tracker__title">
        Characters {met}/{slots.length}
      </h2>
      <ul className="character-tracker__slots">
        {slots.map((slot, index) =>
          slot.found ? (
            <li key={slot.id} className="character-tracker__slot notch notch--small">
              <details className="character-tracker__profile">
                <summary className="character-tracker__summary">
                  <span className="character-tracker__name">{slot.name}</span>
                  <span className="character-tracker__role">{slot.role}</span>
                  {slot.metIn && <span className="character-tracker__met">Met in {slot.metIn}</span>}
                </summary>
                <div className="character-tracker__details">
                  {slot.details?.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </details>
            </li>
          ) : (
            <li key={slot.id} className="character-tracker__slot character-tracker__slot--locked notch notch--small">
              <span aria-hidden="true">??? </span>
              <span className="visually-hidden">Character {index + 1}, not met yet</span>
            </li>
          ),
        )}
      </ul>
    </section>
  )
}

export default CharacterTracker
