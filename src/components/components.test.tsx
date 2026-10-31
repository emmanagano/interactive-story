import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import type { Scene } from '../engine'
import ChoiceList from './ChoiceList'
import Hud from './Hud'
import { NO_CHANGES } from './runChanges'
import { makeState } from '../engine/testState'
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

describe('Hud', () => {
  const run = makeState({ time: 20400, health: 3, heat: 2 }).run
  const html = renderToStaticMarkup(
    <Hud
      run={run}
      endingsFound={2}
      changes={{ time: -1200, health: 0, heat: 1 }}
      changeId={1}
      announcement="Time minus 20 minutes. Heat up 1."
    />,
  )

  it('shows time as HH:MM:SS, heat out of 5 and endings found out of 10', () => {
    expect(html).toContain('05:40:00')
    expect(html).toContain('2/5')
    expect(html).toContain('2/10')
  })

  it('draws five health bars with the right number filled, and labels them for screen readers', () => {
    expect(html.match(/class="hud__bar"/g)?.length).toBe(2) // empty bars
    expect(html.match(/hud__bar--full/g)?.length).toBe(3) // filled bars
    expect(html).toContain('aria-label="Health 3 of 5"')
  })

  it('announces the change politely and marks only the meters that moved', () => {
    expect(html).toContain('aria-live="polite"')
    expect(html).toContain('Time minus 20 minutes. Heat up 1.')
    expect(html.match(/hud__value--changed/g)?.length).toBe(2)
  })

  it('marks nothing as changed when nothing moved', () => {
    const calm = renderToStaticMarkup(
      <Hud run={run} endingsFound={0} changes={NO_CHANGES} changeId={0} announcement="" />,
    )
    expect(calm).not.toContain('hud__value--changed')
  })
})
