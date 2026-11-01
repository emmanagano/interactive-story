import { useEffect, useId, useRef } from 'react'
import type { EndingSlot, Scene } from '../engine'
import { ENDING_GUIDE } from '../story/guide'
import { rewardMessage } from './endingReward'
import './NewEndingDialog.css'

// Hints that this ending changes the next run without saying how, so it does not spoil the Summary.
const CARRIES_OVER = 'Something from this run carries into the next one.'

type Props = {
  open: boolean
  ending: Scene | null // the ending just found for the first time
  slots: EndingSlot[]
  onClose: () => void
}

/**
 * The reward for finding an ending you had not seen. A native modal dialog, like the confirmations:
 * the browser traps focus, closes it on Escape and returns focus to the button underneath.
 */
function NewEndingDialog({ open, ending, slots, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const isOpen = open && ending?.ending !== undefined

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (isOpen && !dialog.open) dialog.showModal()
    if (!isOpen && dialog.open) dialog.close()
  }, [isOpen])

  const found = slots.filter((slot) => slot.found).length
  const number = ending?.ending?.number
  // The same script wording the Summary uses, so the two can never disagree.
  const guideEntry = ENDING_GUIDE.find((entry) => entry.number === number)

  return (
    <dialog ref={dialogRef} className="new-ending notch" aria-labelledby={titleId} onCancel={onClose}>
      <p className="new-ending__label" aria-hidden="true">
        /// ENDING.UNLOCKED
      </p>
      <h2 id={titleId} className="new-ending__heading">
        New ending
      </h2>
      <p className="new-ending__name">
        <span className="new-ending__number">{String(number ?? 0).padStart(2, '0')}</span> {ending?.title}
      </p>
      {guideEntry && (
        <p className="new-ending__how">
          <span className="new-ending__how-label">How you got here</span>
          {guideEntry.howToGet}
        </p>
      )}
      {guideEntry?.opens && <p className="new-ending__carries">{CARRIES_OVER}</p>}
      <ol className="new-ending__pips" aria-label={`${found} of ${slots.length} endings found`}>
        {slots.map((slot) => (
          <li
            key={slot.number}
            className={[
              'new-ending__pip',
              slot.found ? `new-ending__pip--${slot.kind}` : '',
              slot.number === number ? 'new-ending__pip--new' : '',
            ].join(' ')}
          />
        ))}
      </ol>
      <p className="new-ending__count">
        {found} / {slots.length} found
      </p>
      <p className="new-ending__message">{rewardMessage(found)}</p>
      <button type="button" className="new-ending__button notch" onClick={onClose} autoFocus>
        KEEP LOOKING
      </button>
    </dialog>
  )
}

export default NewEndingDialog
