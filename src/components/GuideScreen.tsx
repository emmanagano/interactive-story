import { useEffect, useRef, useState } from 'react'
import { ENDING_GUIDE, GOOD_TO_KNOW, SECRET_ENDING_PATH, STORY_SUMMARY } from '../story/guide'
import './GuideScreen.css'

type Props = {
  foundNumbers: number[] // endings the player has already seen
  onBack: () => void
  startShown?: boolean // for tests; players always start behind the spoiler gate
}

/** A recap and a guide to all ten endings, kept behind a spoiler gate so nobody reads it by accident. */
function GuideScreen({ foundNumbers, onBack, startShown = false }: Props) {
  const [shown, setShown] = useState(startShown)
  const contentHeading = useRef<HTMLHeadingElement>(null)
  const justOpened = useRef(false)

  // The button that was pressed is replaced by the guide, so focus moves to the guide's first heading.
  useEffect(() => {
    if (shown && justOpened.current) contentHeading.current?.focus()
  }, [shown])

  return (
    <section className="guide-screen notch" aria-labelledby="guide-title">
      <h1 id="guide-title" className="guide-screen__title" data-screen-heading tabIndex={-1}>
        Summary and ending guide
      </h1>

      {!shown ? (
        <div className="guide-screen__gate">
          <p>
            <strong>This page spoils the whole story and every ending.</strong> It is here for when you are stuck, or want to
            find them all.
          </p>
          <button
            type="button"
            className="guide-screen__button"
            onClick={() => {
              justOpened.current = true
              setShown(true)
            }}
          >
            Show the summary
          </button>
        </div>
      ) : (
        <>
          <h2 className="guide-screen__heading" ref={contentHeading} tabIndex={-1}>
            The story in short
          </h2>
          {STORY_SUMMARY.map((section) => (
            <section key={section.id} className="guide-screen__section" aria-labelledby={`guide-${section.id}`}>
              <h3 id={`guide-${section.id}`}>{section.title}</h3>
              <p className="guide-screen__scenes">{section.scenes}</p>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}

          <h2 className="guide-screen__heading">All ten endings</h2>
          <ol className="guide-screen__endings">
            {ENDING_GUIDE.map((entry) => {
              const found = foundNumbers.includes(entry.number)
              return (
                <li key={entry.number} className={`guide-screen__ending guide-screen__ending--${entry.kind.toLowerCase()}`}>
                  <h3>
                    <span className="guide-screen__number">{String(entry.number).padStart(2, '0')}</span> {entry.name}
                    <span className="guide-screen__kind"> · {entry.kind}</span>
                    <span className={found ? 'guide-screen__status guide-screen__status--found' : 'guide-screen__status'}>
                      {found ? 'Found' : 'Not found yet'}
                    </span>
                  </h3>
                  <p>
                    <strong>How to get it:</strong> {entry.howToGet}
                  </p>
                  {entry.opens && <p className="guide-screen__opens">{entry.opens.text}</p>}
                </li>
              )
            })}
          </ol>

          <h2 className="guide-screen__heading">The secret ending</h2>
          <p>{SECRET_ENDING_PATH}</p>

          <h2 className="guide-screen__heading">Good to know</h2>
          <ul className="guide-screen__tips">
            {GOOD_TO_KNOW.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </>
      )}

      <button type="button" className="guide-screen__button guide-screen__back" onClick={onBack}>
        Back
      </button>
    </section>
  )
}

export default GuideScreen
