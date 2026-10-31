import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import type { Scene } from '../engine'
import ChoiceList from './ChoiceList'
import SceneView from './SceneView'

// Rendered to a string, so no DOM or extra test library is needed. Clicking and keys are
// covered by the engine tests (choose, choiceIdForKey) and by playing the game in a browser.
const scene: Scene = {
  id: 'scene-01',
  act: 1,
  title: 'THE CLINIC',
  blocks: [],
  choices: [],
}

describe('SceneView', () => {
  it('shows the title, bold marks, system notes and chip lines with a ">"', () => {
    const html = renderToStaticMarkup(
      <SceneView
        scene={scene}
        blocks={[
          { type: 'text', text: 'The timer: **05:59:58**.' },
          { type: 'system', text: '*(The timer flickers.)*' },
          { type: 'chip', text: 'k…kade.' },
        ]}
      />,
    )
    expect(html).toContain('<h2')
    expect(html).toContain('THE CLINIC')
    expect(html).toContain('<strong>05:59:58</strong>')
    expect(html).toContain('<em>(The timer flickers.)</em>')
    expect(html).toContain('class="chip-line"')
    expect(html).toContain('&gt; ')
    expect(html).not.toContain('*')
  })
})

describe('ChoiceList', () => {
  const html = renderToStaticMarkup(
    <ChoiceList
      onChoose={() => undefined}
      choices={[
        { choice: { id: 'stay', label: 'STAY', text: '"Okay."', goto: 'a' }, locked: false },
        { choice: { id: 'ask', label: 'ASK WHO HE CALLED', requires: { flag: 'x' }, goto: 'b' }, locked: true },
      ]}
    />,
  )

  it('numbers the choices for the number keys', () => {
    expect(html).toContain('aria-keyshortcuts="1"')
    expect(html).toContain('aria-keyshortcuts="2"')
  })

  it('marks a locked choice without disabling it and without a hint', () => {
    expect(html).toContain('choice-list__button--locked')
    expect(html).toContain('aria-disabled="true"')
    expect(html).toContain('(locked)')
    expect(html).not.toContain('disabled=""')
  })

  it('shows the line under a choice label', () => {
    expect(html).toContain('&quot;Okay.&quot;')
  })
})
