import './TokenPage.css'

// Temporary page for checking the design tokens by eye. Delete it once real screens exist.

const colorNames = [
  'night',
  'panel',
  'line',
  'ink',
  'dim',
  'magenta',
  'cyan',
  'green',
  'amber',
  'red',
] as const

const typeSteps = ['xs', 'sm', 'base', 'md', 'lg', 'xl', '2xl', '3xl'] as const

const spaceSteps = ['1', '2', '3', '4', '5', '6', '7', '8'] as const

function TokenPage() {
  return (
    <div className="token-page">
      <h1>Flatline</h1>

      <section aria-labelledby="token-colors">
        <h2 id="token-colors">Colors</h2>
        <ul className="token-page__swatches">
          {colorNames.map((name) => (
            <li key={name} className="token-page__swatch-item">
              <span
                className={`token-page__swatch token-page__swatch--${name}`}
                aria-hidden="true"
              />
              <code>--color-{name}</code>
            </li>
          ))}
        </ul>
        <p className="token-page__glows">
          <span className="token-page__glow token-page__glow--magenta">magenta glow</span>
          <span className="token-page__glow token-page__glow--cyan">cyan glow</span>
          <span className="token-page__glow token-page__glow--green">green glow</span>
          <span className="token-page__glow token-page__glow--amber">amber glow</span>
          <span className="token-page__glow token-page__glow--red">red glow</span>
        </p>
      </section>

      <section aria-labelledby="token-fonts">
        <h2 id="token-fonts">Fonts</h2>
        <p className="token-page__font-display">Oxanium · display and HUD labels</p>
        <p>IBM Plex Sans · story text. The rain had not stopped since the dock fell.</p>
        <p className="token-page__font-mono">JetBrains Mono · chip lines, choices, 21600</p>
        <p className="token-page__chip-line">&gt; LAZARUS: You are still here. Good.</p>
        <p className="token-page__locked">Locked choice (no hint how to open it)</p>
      </section>

      <section aria-labelledby="token-type">
        <h2 id="token-type">Type scale</h2>
        {typeSteps.map((step) => (
          <p key={step} className={`token-page__type token-page__type--${step}`}>
            --text-{step}
          </p>
        ))}
      </section>

      <section aria-labelledby="token-space">
        <h2 id="token-space">Spacing</h2>
        {spaceSteps.map((step) => (
          <div key={step} className="token-page__space-row">
            <code>--space-{step}</code>
            <span className={`token-page__space-bar token-page__space-bar--${step}`} />
          </div>
        ))}
      </section>
    </div>
  )
}

export default TokenPage
