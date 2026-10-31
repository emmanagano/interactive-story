import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import type { Block, Scene } from '../engine'
import type { Reveal } from '../hooks'
import ChoiceList from './ChoiceList'
import DebugPanel from './DebugPanel'
import EndingCard from './EndingCard'
import EndingTracker from './EndingTracker'
import Hud from './Hud'
import { planReveal } from './reveal'
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

const shownAtOnce = (blocks: Block[]): Reveal => ({ plan: planReveal(blocks), elapsed: 999, revealing: false, skip: () => undefined })
const midReveal = (blocks: Block[], elapsed: number): Reveal => ({ plan: planReveal(blocks), elapsed, revealing: true, skip: () => undefined })

describe('SceneView', () => {
  it('shows the title, bold marks, system notes and chip lines with a ">"', () => {
    const blocks: Block[] = [
      { type: 'text', text: 'The timer: **05:59:58**.' },
      { type: 'system', text: '*(The timer flickers.)*' },
      { type: 'chip', text: 'k…kade.' },
    ]
    const html = renderToStaticMarkup(<SceneView scene={scene} blocks={blocks} reveal={shownAtOnce(blocks)} sceneKey="a" />)
    expect(html).toContain('<h2')
    expect(html).toContain('THE CLINIC')
    expect(html).toContain('<strong>05:59:58</strong>')
    expect(html).toContain('<em>(The timer flickers.)</em>')
    expect(html).toContain('class="chip-line"')
    expect(html).toContain('&gt; ')
    expect(html).not.toContain('*')
    expect(html).not.toContain('Show all text')
  })

  describe('while the text is typing', () => {
    const blocks: Block[] = [
      { type: 'text', text: 'Rain on **the** flyover.' },
      { type: 'chip', text: 'remember this one.' },
    ]
    const html = renderToStaticMarkup(<SceneView scene={scene} blocks={blocks} reveal={midReveal(blocks, 0.03)} sceneKey="a" />)

    it('gives screen readers the whole paragraph and the real chip line, and hides the typed copy from them', () => {
      expect(html).toContain('<span class="visually-hidden">Rain on the flyover.</span>')
      expect(html).toContain('<span class="visually-hidden">remember this one.</span>')
      expect(html).toContain('aria-hidden="true"')
    })

    it('shows only part of the text, keeping the rest in place but hidden', () => {
      expect(html).toContain('rich-text__pending')
    })

    it('offers a way to show all the text', () => {
      expect(html).toContain('Show all text')
    })
  })
})

describe('ChoiceList', () => {
  const html = renderToStaticMarkup(
    <ChoiceList
      blurred={false}
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

  it('adds the blur class only after a painkiller', () => {
    const blurred = renderToStaticMarkup(
      <ChoiceList blurred onChoose={() => undefined} choices={[{ choice: { id: 'a', label: 'A', goto: 'x' }, locked: false }]} />,
    )
    expect(blurred).toContain('choice-list--blurred')
    expect(html).not.toContain('choice-list--blurred')
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
      clean={false}
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

  it('shows the reset interface: unlimited time, full health, heat 0', () => {
    const reset = renderToStaticMarkup(
      <Hud run={makeState({ time: 100, health: 1, heat: 4 }).run} endingsFound={9} changes={NO_CHANGES} changeId={2} announcement="" clean />,
    )
    expect(reset).toContain('∞')
    expect(reset).toContain('aria-label="Health 5 of 5"')
    expect(reset).not.toContain('00:01:40')
    expect(reset).not.toContain('4/5')
  })

  it('marks nothing as changed when nothing moved', () => {
    const calm = renderToStaticMarkup(
      <Hud run={run} endingsFound={0} changes={NO_CHANGES} changeId={0} announcement="" clean={false} />,
    )
    expect(calm).not.toContain('hud__value--changed')
  })
})

describe('EndingCard', () => {
  const ending: Scene = {
    ...scene,
    title: "DOC'S TABLE",
    ending: { id: 'docs-table', kind: 'death', number: 1 },
  }

  it('writes the banner and the final chip line', () => {
    const html = renderToStaticMarkup(
      <EndingCard scene={ending} finalChip={{ type: 'chip', text: 'i told you.' }} />,
    )
    expect(html).toContain('FLATLINE · ENDING 01 / 10 · DOC&#x27;S TABLE')
    expect(html).toContain('ending-card--death')
    expect(html).toContain('i told you.')
  })

  it('shows nothing for a scene that is not an ending', () => {
    expect(renderToStaticMarkup(<EndingCard scene={scene} finalChip={null} />)).toBe('')
  })
})

describe('EndingTracker', () => {
  const slots = Array.from({ length: 10 }, (_, index) => ({ number: index + 1, found: false }))
  const html = renderToStaticMarkup(
    <EndingTracker slots={[{ number: 1, found: true, title: "DOC'S TABLE", kind: 'death' }, ...slots.slice(1)]} />,
  )

  it('counts the endings found out of ten', () => {
    expect(html).toContain('Endings 1/10')
  })

  it('names a found ending and keeps the rest as silhouettes with no name', () => {
    expect(html).toContain('DOC&#x27;S TABLE')
    expect(html.match(/ending-tracker__slot--locked/g)?.length).toBe(9)
    expect(html).toContain('Ending 2, not found yet')
    expect(html).toContain('02 ???')
  })
})

describe('DebugPanel', () => {
  const html = renderToStaticMarkup(
    <DebugPanel
      state={makeState({ runFlags: ['listened'] }, { memoryFlags: ['knows_lazarus'] })}
      scenes={[{ id: 'scene-01', title: 'THE CLINIC' }, { id: 'scene-19', title: 'THE LAST CHOICE' }]}
      flags={{ runFlags: ['listened', 'with_tavi'], memoryFlags: ['knows_lazarus'], items: ['painkillers'] }}
      presets={[{ label: 'Last choice, Merged unlocked', patch: { sceneId: 'scene-19' } }]}
      onApply={() => undefined}
      onResetMemory={() => undefined}
    />,
  )

  it('lists the presets, every scene and the reset button', () => {
    expect(html).toContain('Last choice, Merged unlocked')
    expect(html).toContain('scene-19 · THE LAST CHOICE')
    expect(html).toContain('Reset memory')
  })

  it('shows which flags are set right now', () => {
    expect(html.match(/checked=""/g)?.length).toBe(2) // listened (run) and knows_lazarus (memory)
    expect(html).toContain('item: painkillers')
  })
})
