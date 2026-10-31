import { useEffect, useRef } from 'react'
import type { ListedChoice } from '../engine'
import './ChoiceList.css'

type Props = {
  choices: ListedChoice[]
  blurred: boolean // painkillers: the text is hard to read for one choice
  onChoose: (choiceId: string) => void
}

function ChoiceList({ choices, blurred, onChoose }: Props) {
  const listRef = useRef<HTMLUListElement>(null)
  const justChose = useRef(false)

  // Some choices stay in the same scene and take their own button away (a painkiller). The button
  // that had focus is gone, so focus would fall to the top of the page. Put it on the next choice.
  useEffect(() => {
    if (!justChose.current) return
    justChose.current = false
    const focused = document.activeElement
    if (!focused || focused === document.body) listRef.current?.querySelector<HTMLButtonElement>('button:not([aria-disabled])')?.focus()
  })

  return (
    <ul ref={listRef} className={blurred ? 'choice-list choice-list--blurred' : 'choice-list'} aria-label="Choices">
      {choices.map(({ choice, locked }, index) => (
        <li key={choice.id}>
          {/* aria-disabled, not disabled, so keyboard and screen reader users can still find a locked choice. */}
          <button
            type="button"
            className={locked ? 'choice-list__button choice-list__button--locked' : 'choice-list__button'}
            aria-disabled={locked || undefined}
            aria-keyshortcuts={index < 4 ? String(index + 1) : undefined}
            onClick={() => {
              if (locked) return
              justChose.current = true
              onChoose(choice.id)
            }}
          >
            {index < 4 && (
              <span className="choice-list__key" aria-hidden="true">
                {index + 1}
              </span>
            )}
            <span className="choice-list__label">{choice.label}</span>
            {locked && <span className="visually-hidden"> (locked)</span>}
            {choice.text && <span className="choice-list__text">{choice.text}</span>}
          </button>
        </li>
      ))}
    </ul>
  )
}

export default ChoiceList
