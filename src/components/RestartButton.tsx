import { useEffect, useRef } from 'react'
import './RestartButton.css'

/** Shown once a run has ended. Takes focus so Enter or Space wakes Kade up again. */
function RestartButton({ onRestart }: { onRestart: () => void }) {
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    buttonRef.current?.focus()
  }, [])

  return (
    <button type="button" className="restart-button notch" ref={buttonRef} onClick={onRestart}>
      WAKE UP AGAIN
    </button>
  )
}

export default RestartButton
