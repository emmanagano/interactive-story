import './DecisionPrompt.css'

type Props = {
  prompt: string | undefined // none for scenes that only need Continue
}

/** One line above the choices saying what is being decided, so the choices make sense at a glance. */
function DecisionPrompt({ prompt }: Props) {
  if (!prompt) return null
  return (
    <p className="decision-prompt">
      <span className="decision-prompt__label" aria-hidden="true">
        /// DECISION
      </span>
      {prompt}
    </p>
  )
}

export default DecisionPrompt
