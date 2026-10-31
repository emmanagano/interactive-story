import { useEffect, useRef } from 'react'
import './ConfirmDialog.css'

type Props = {
  open: boolean
  title: string
  children: React.ReactNode
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
}

/**
 * An in-game "are you sure", built on the native dialog element: the browser traps focus inside
 * it, closes it on Escape and puts focus back where it was, so none of that is rebuilt by hand.
 */
function ConfirmDialog({ open, title, children, confirmLabel, onConfirm, onCancel }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog ref={dialogRef} className="confirm-dialog" aria-labelledby="confirm-dialog-title" onCancel={onCancel}>
      <h2 id="confirm-dialog-title" className="confirm-dialog__title">
        {title}
      </h2>
      <div className="confirm-dialog__body">{children}</div>
      <div className="confirm-dialog__actions">
        {/* Cancel is first, so it is the button focus lands on: the safe choice is the easy one. */}
        <button type="button" className="confirm-dialog__button" onClick={onCancel} autoFocus>
          Cancel
        </button>
        <button type="button" className="confirm-dialog__button confirm-dialog__button--danger" onClick={onConfirm}>
          {confirmLabel}
        </button>
      </div>
    </dialog>
  )
}

export default ConfirmDialog
