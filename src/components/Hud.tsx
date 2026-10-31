import { TOTAL_ENDINGS } from '../engine/constants'
import type { RunState } from '../engine'
import { formatClock } from './formatClock'
import type { RunChanges } from './runChanges'
import './Hud.css'

type Props = {
  run: RunState
  endingsFound: number
  changes: RunChanges
  changeId: number // new on every choice, so a meter that changes twice in a row pulses twice
  announcement: string
  clean: boolean // the Merged ending: nothing is running out, so time is shown as ∞
}

const HEALTH_SEGMENTS = 5

function Hud({ run, endingsFound, changes, changeId, announcement, clean }: Props) {
  const health = clean ? HEALTH_SEGMENTS : run.health
  const changed = (meter: keyof RunChanges) => (changes[meter] !== 0 ? ' hud__value--changed' : '')

  return (
    <section className="hud" aria-label="Kade's status">
      <dl className="hud__meters">
        <div className="hud__meter hud__meter--time">
          <dt className="hud__label">Time</dt>
          <dd className="hud__value-row">
            <span key={changeId} className={`hud__value${changed('time')}`}>
              {clean ? (
                <>
                  <span aria-hidden="true">∞</span>
                  <span className="visually-hidden">unlimited</span>
                </>
              ) : (
                formatClock(run.time)
              )}
            </span>
          </dd>
        </div>

        <div className="hud__meter hud__meter--health">
          <dt className="hud__label">Health</dt>
          <dd className="hud__value-row">
            <span
              key={changeId}
              className={`hud__bars${changed('health')}`}
              role="img"
              aria-label={`Health ${health} of ${HEALTH_SEGMENTS}`}
            >
              {Array.from({ length: HEALTH_SEGMENTS }, (_, index) => (
                <span key={index} className={index < health ? 'hud__bar hud__bar--full' : 'hud__bar'} />
              ))}
            </span>
          </dd>
        </div>

        <div className="hud__meter hud__meter--heat">
          <dt className="hud__label">Heat</dt>
          <dd className="hud__value-row">
            <span key={changeId} className={`hud__value${changed('heat')}`}>
              {clean ? '0' : `${run.heat}/5`}
            </span>
          </dd>
        </div>

        <div className="hud__meter hud__meter--endings">
          <dt className="hud__label">Endings</dt>
          <dd className="hud__value-row">
            <span className="hud__value">
              {endingsFound}/{TOTAL_ENDINGS}
            </span>
          </dd>
        </div>
      </dl>

      {/* Screen readers hear what a choice cost. The invisible space on alternate choices makes
          the text differ, so an identical sentence in a row is still announced. */}
      <div className="visually-hidden" role="status" aria-live="polite" aria-atomic="true">
        {announcement}
        {changeId % 2 === 1 ? ' ' : ''}
      </div>
    </section>
  )
}

export default Hud
