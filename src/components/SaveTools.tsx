import { useState } from 'react'
import { exportSaveCode, importSaveCode } from '../engine'
import type { Memory } from '../engine'
import ConfirmDialog from './ConfirmDialog'
import { describeImportFailure, describeProgress } from './saveMessages'
import './SaveTools.css'

type Props = {
  memory: Memory
  onImport: (memory: Memory) => void
  onReset: () => void
}

/** Back up, restore or wipe progress. Anything that replaces progress asks first, inside the game. */
function SaveTools({ memory, onImport, onReset }: Props) {
  const [showCode, setShowCode] = useState(false)
  const [pasted, setPasted] = useState('')
  const [message, setMessage] = useState('')
  const [pendingImport, setPendingImport] = useState<Memory | null>(null)
  const [resetOpen, setResetOpen] = useState(false)
  const code = exportSaveCode(memory)

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code)
      setMessage('Save code copied.')
    } catch {
      setMessage('Could not copy automatically. Select the code and copy it yourself.')
    }
  }

  function checkPasted() {
    const result = importSaveCode(pasted)
    if (result.ok) {
      setMessage('')
      setPendingImport(result.memory)
    } else {
      setMessage(describeImportFailure(result.reason))
    }
  }

  return (
    <>
      <section className="save-tools" aria-labelledby="save-tools-title">
        <h3 id="save-tools-title">Your progress</h3>
        <p className="save-tools__summary">Now: {describeProgress(memory)}.</p>

        <button type="button" className="save-tools__button" onClick={() => setShowCode((shown) => !shown)} aria-expanded={showCode}>
          {showCode ? 'Hide save code' : 'Show save code'}
        </button>
        {showCode && (
          <div className="save-tools__code">
            <label htmlFor="save-code-out">Your save code</label>
            <textarea id="save-code-out" readOnly value={code} rows={4} onFocus={(event) => event.target.select()} />
            <button type="button" className="save-tools__button" onClick={copyCode}>
              Copy
            </button>
          </div>
        )}

        <div className="save-tools__code">
          <label htmlFor="save-code-in">Paste a save code</label>
          <textarea id="save-code-in" value={pasted} rows={3} onChange={(event) => setPasted(event.target.value)} />
          <button type="button" className="save-tools__button" onClick={checkPasted} disabled={pasted.trim() === ''}>
            Import
          </button>
        </div>

        <button type="button" className="save-tools__button save-tools__button--danger" onClick={() => setResetOpen(true)}>
          Reset all progress
        </button>

        <p className="save-tools__message" role="status">
          {message}
        </p>
      </section>

      <ConfirmDialog
        open={pendingImport !== null}
        title="Replace your progress?"
        confirmLabel="Replace progress"
        onCancel={() => setPendingImport(null)}
        onConfirm={() => {
          if (pendingImport) onImport(pendingImport)
          setPendingImport(null)
          setPasted('')
          setMessage('Progress imported. A new run is ready.')
        }}
      >
        <p>Your current progress will be lost.</p>
        <p>Now: {describeProgress(memory)}.</p>
        {pendingImport && <p>Save code: {describeProgress(pendingImport)}.</p>}
      </ConfirmDialog>

      <ConfirmDialog
        open={resetOpen}
        title="Reset all progress?"
        confirmLabel="Reset everything"
        onCancel={() => setResetOpen(false)}
        onConfirm={() => {
          onReset()
          setResetOpen(false)
          setMessage('Progress reset.')
        }}
      >
        <p>This deletes every ending you have found and everything the chip remembers. It cannot be undone.</p>
        <p>Now: {describeProgress(memory)}. You can copy your save code first to keep a backup.</p>
      </ConfirmDialog>
    </>
  )
}

export default SaveTools
