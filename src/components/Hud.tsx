import { TOTAL_ENDINGS } from '../engine/constants'
import type { RunState } from '../engine'
import { formatClock } from './formatClock'
import { describeDelta } from './runChanges'
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

/** "painkillers ×2": each kind of item once, with how many Kade has. */
function itemCounts(inventory: string[]): string {
  return [...new Set(inventory)].map((item) => `${item} ×${inventory.filter((other) => other === item).length}`).join(', ')
}

/** What the last choice did to one meter, floating beside it. Decorative: screen readers get the live region. */
function DeltaCallout({ meter, changes, changeId }: { meter: 'time' | 'health' | 'heat'; changes: RunChanges; changeId: number }) {
  const delta = describeDelta(meter, changes)
  if (!delta) return null
  return (
    <span key={changeId} className={`hud__delta hud__delta--${delta.tone}`} aria-hidden="true">
      {delta.text}
    </span>
  )
}

function Hud({ run, endingsFound, changes, changeId, announcement, clean }: Props) {
  const health = clean ? HEALTH_SEGMENTS : run.health
  const changed = (meter: 'time' | 'health' | 'heat') => (changes[meter] !== 0 ? ' hud__value--changed' : '')

  return (
    <section className="hud notch" aria-label="Kade's status">
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
            <DeltaCallout meter="time" changes={changes} changeId={changeId} />
          </dd>
        </div>

        <div className="hud__meter hud__meter--health">
          <dt className="hud__label">Health</dt>
          <dd className="hud__value-row">
            <span
              key={changeId}
              className={`hud__bars${changed('health')}${changes.health < 0 ? ' hud__bars--hurt' : ''}`}
              role="img"
              aria-label={`Health ${health} of ${HEALTH_SEGMENTS}`}
            >
              {Array.from({ length: HEALTH_SEGMENTS }, (_, index) => (
                <span key={index} className={index < health ? 'hud__bar hud__bar--full' : 'hud__bar'} />
              ))}
            </span>
            <DeltaCallout meter="health" changes={changes} changeId={changeId} />
          </dd>
        </div>

        <div className="hud__meter hud__meter--heat">
          <dt className="hud__label">Heat</dt>
          <dd className="hud__value-row">
            <span key={changeId} className={`hud__value${changed('heat')}`}>
              {clean ? '0' : `${run.heat}/5`}
            </span>
            <DeltaCallout meter="heat" changes={changes} changeId={changeId} />
          </dd>
        </div>

        {run.inventory.length > 0 && (
          <div className="hud__meter hud__meter--items">
            <dt className="hud__label">Items</dt>
            <dd className="hud__value-row">
              <span className={`hud__value hud__value--small${changes.itemsGained.length + changes.itemsUsed.length > 0 ? ' hud__value--changed' : ''}`} key={changeId}>
                {itemCounts(run.inventory)}
              </span>
            </dd>
          </div>
        )}

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
