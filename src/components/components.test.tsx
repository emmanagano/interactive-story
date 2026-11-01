import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import type { Block, Scene } from '../engine'
import type { Reveal } from '../hooks'
import ChipLine from './ChipLine'
import ChoiceList from './ChoiceList'
import ConfirmDialog from './ConfirmDialog'
import DebugPanel from './DebugPanel'
import EndingCard from './EndingCard'
import EndingTracker from './EndingTracker'
import BlurNotice from './BlurNotice'
import NewEndingDialog from './NewEndingDialog'
import GuideScreen from './GuideScreen'
import Hud from './Hud'
import SettingsScreen from './SettingsScreen'
import TitleScreen from './TitleScreen'
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

  it('has a silent, hidden-from-readers fade at the bottom, which starts out off', () => {
    const blocks: Block[] = [{ type: 'text', text: 'A long scene.' }]
    const html = renderToStaticMarkup(<SceneView scene={scene} blocks={blocks} reveal={shownAtOnce(blocks)} sceneKey="a" />)
    expect(html).toMatch(/<div class="scene-view__more" aria-hidden="true"><\/div>/)
    expect(html).not.toContain('Scroll for more')
    expect(html).not.toContain('scene-view__more--visible')
  })

  it('is a focusable, labelled region, because it scrolls by itself', () => {
    const blocks: Block[] = [{ type: 'text', text: 'A long scene.' }]
    const html = renderToStaticMarkup(<SceneView scene={scene} blocks={blocks} reveal={shownAtOnce(blocks)} sceneKey="a" />)
    expect(html).toMatch(/<article[^>]*tabindex="0"/)
    const labelledBy = html.match(/<article[^>]*aria-labelledby="([^"]+)"/)?.[1]
    expect(labelledBy).toBeTruthy()
    expect(html).toContain(`<h2 id="${labelledBy}"`)
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
      changes={{ ...NO_CHANGES, time: -1200, heat: 1 }}
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

  it('shakes the health bar when health is lost, and not when it is gained or unchanged', () => {
    const render = (health: number) =>
      renderToStaticMarkup(<Hud run={run} endingsFound={0} changes={{ ...NO_CHANGES, health }} changeId={1} announcement="" clean={false} />)
    expect(render(-1)).toContain('hud__bars--hurt')
    expect(render(1)).not.toContain('hud__bars--hurt')
    expect(render(0)).not.toContain('hud__bars--hurt')
  })

  it('marks the health bar critical at 1 health or less, and not above it or on the clean interface', () => {
    const render = (health: number, clean = false) =>
      renderToStaticMarkup(<Hud run={makeState({ health }).run} endingsFound={0} changes={NO_CHANGES} changeId={1} announcement="" clean={clean} />)
    expect(render(1)).toContain('hud__bars--critical')
    expect(render(0)).toContain('hud__bars--critical')
    expect(render(2)).not.toContain('hud__bars--critical')
    expect(render(1, true)).not.toContain('hud__bars--critical')
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

describe('TitleScreen', () => {
  const noop = () => undefined

  it('offers Start to a new player and no progress', () => {
    const html = renderToStaticMarkup(<TitleScreen returning={false} endingsFound={0} onStart={noop} onGuide={noop} onSettings={noop} />)
    expect(html).toContain('>Start<')
    expect(html).not.toContain('Continue')
    expect(html).not.toContain('Endings ')
    expect(html).toContain('Settings')
  })

  it('offers Continue to a returning player, with how many endings they have', () => {
    const html = renderToStaticMarkup(<TitleScreen returning endingsFound={3} onStart={noop} onGuide={noop} onSettings={noop} />)
    expect(html).toContain('>Continue<')
    expect(html).not.toContain('>Start<')
    expect(html).toContain('Endings 3/10')
  })

  it('hides the decorative heartbeat lines from assistive technology', () => {
    const html = renderToStaticMarkup(<TitleScreen returning={false} endingsFound={0} onStart={noop} onGuide={noop} onSettings={noop} />)
    expect(html).toMatch(/<svg[^>]*aria-hidden="true"/)
  })
})

describe('SettingsScreen', () => {
  const html = renderToStaticMarkup(
    <SettingsScreen
      calm={false}
      textSpeed="fast"
      sound={false}
      volume={0.5}
      memory={makeState({}, { runs: 3, deaths: 2, endingsSeen: ['a'] }).memory}
      onCalm={() => undefined}
      onTextSpeed={() => undefined}
      onSound={() => undefined}
      onVolume={() => undefined}
      onImport={() => undefined}
      onReset={() => undefined}
      onBack={() => undefined}
    />,
  )

  it('has one top-level heading, then headings in order', () => {
    const levels = [...html.matchAll(/<h([1-6])/g)].map((match) => Number(match[1]))
    expect(levels[0]).toBe(1)
    expect(levels.filter((level) => level === 1)).toHaveLength(1)
    for (let i = 1; i < levels.length; i += 1) expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1)
  })

  it('offers the four text speeds with the current one chosen', () => {
    for (const label of ['Slow', 'Normal', 'Fast', 'Instant']) expect(html).toContain(label)
    const radios = html.match(/<input[^>]*type="radio"[^>]*>/g) ?? []
    expect(radios).toHaveLength(4)
    const chosen = radios.filter((radio) => radio.includes('checked=""'))
    expect(chosen).toHaveLength(1)
    expect(chosen[0]).toContain('value="fast"')
  })

  it('has a sound switch that starts off, and a volume slider', () => {
    const sound = html.match(/<input[^>]*role="switch"[^>]*>/g)?.find((input) => !input.includes('checked'))
    expect(sound).toBeDefined()
    expect(html).toContain('>Sound<')
    expect(html).toContain('Volume 50%')
    expect(html).toMatch(/<input[^>]*type="range"[^>]*value="50"/)
    expect(html).toContain('Off until you turn it on')
  })

  it('summarises progress and offers backup, restore and reset', () => {
    expect(html).toContain('Now: 1 of 10 endings, 3 runs, 2 deaths.')
    expect(html).toContain('Show save code')
    expect(html).toContain('Paste a save code')
    expect(html).toContain('Reset all progress')
  })
})

describe('ConfirmDialog', () => {
  it('is a native dialog, labelled by its title, with Cancel before the dangerous button', () => {
    const html = renderToStaticMarkup(
      <ConfirmDialog open={false} title="Reset all progress?" confirmLabel="Reset everything" onCancel={() => undefined} onConfirm={() => undefined}>
        <p>Cannot be undone.</p>
      </ConfirmDialog>,
    )
    expect(html).toContain('<dialog')
    const titleId = html.match(/<h2 id="([^"]+)"/)?.[1]
    expect(titleId).toBeTruthy()
    expect(html).toContain(`aria-labelledby="${titleId}"`)
    expect(html.indexOf('Cancel')).toBeLessThan(html.indexOf('Reset everything'))
    expect(html).toContain('Cannot be undone.')
  })

  it('gives each dialog its own title id, so one is never named after another', () => {
    const two = renderToStaticMarkup(
      <>
        <ConfirmDialog open={false} title="First" confirmLabel="Yes" onCancel={() => undefined} onConfirm={() => undefined}>
          <p>a</p>
        </ConfirmDialog>
        <ConfirmDialog open={false} title="Second" confirmLabel="Yes" onCancel={() => undefined} onConfirm={() => undefined}>
          <p>b</p>
        </ConfirmDialog>
      </>,
    )
    const ids = [...two.matchAll(/<h2 id="([^"]+)"/g)].map((match) => match[1])
    expect(ids).toHaveLength(2)
    expect(new Set(ids).size).toBe(2)
    for (const id of ids) expect(two).toContain(`aria-labelledby="${id}"`)
  })
})

describe('showing what a painkiller did (the "nothing happens" bug)', () => {
  it('lists the items Kade is carrying in the HUD, with counts, and nothing when empty', () => {
    const withItems = renderToStaticMarkup(
      <Hud run={makeState({ inventory: ['painkillers', 'painkillers'] }).run} endingsFound={0} changes={NO_CHANGES} changeId={0} announcement="" clean={false} />,
    )
    expect(withItems).toContain('Items')
    expect(withItems).toContain('painkillers')
    expect(withItems).toContain('×2')
    const without = renderToStaticMarkup(<Hud run={makeState().run} endingsFound={0} changes={NO_CHANGES} changeId={0} announcement="" clean={false} />)
    expect(without).not.toContain('Items')
  })

  it('explains the blur on screen while it lasts, and not otherwise', () => {
    expect(renderToStaticMarkup(<BlurNotice blurred calm={false} />)).toContain('doubled until you choose again')
    expect(renderToStaticMarkup(<BlurNotice blurred={false} calm={false} />)).toBe('')
  })

  it('says calm mode keeps the text sharp, since the double vision is off there', () => {
    expect(renderToStaticMarkup(<BlurNotice blurred calm />)).toContain('Calm mode keeps the text sharp')
  })
})

describe('GuideScreen', () => {
  const gated = renderToStaticMarkup(<GuideScreen foundNumbers={[]} onBack={() => undefined} />)
  const open = renderToStaticMarkup(<GuideScreen foundNumbers={[1, 6]} onBack={() => undefined} startShown />)

  it('starts behind a spoiler warning that gives nothing away', () => {
    expect(gated).toContain('spoils the whole story and every ending')
    expect(gated).toContain('Show the summary')
    for (const spoiler of ["Doc&#x27;s Table", 'Sable', 'LAZARUS', 'Merged', 'Halcyon']) expect(gated).not.toContain(spoiler)
  })

  it('shows the recap by act and all ten endings once opened', () => {
    for (const heading of ['The set-up', 'Act 1: the clinic to the Night Market', 'Act 2: the search', 'Act 3: Vale&#x27;s door']) expect(open).toContain(heading)
    expect(open.match(/guide-screen__ending /g)).toHaveLength(10)
    expect(open).toContain('Stay at the clinic')
    expect(open).toContain('Scenes 01 to 07')
  })

  it('marks which endings you have found and which you have not', () => {
    expect(open.match(/>Found</g)).toHaveLength(2)
    expect(open.match(/>Not found yet</g)).toHaveLength(8)
  })

  it('has one top-level heading and headings in order, so a screen reader can move through it', () => {
    for (const html of [gated, open]) {
      const levels = [...html.matchAll(/<h([1-6])/g)].map((match) => Number(match[1]))
      expect(levels[0]).toBe(1)
      expect(levels.filter((level) => level === 1)).toHaveLength(1)
      for (let i = 1; i < levels.length; i += 1) expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1)
    }
  })

  it('always offers a way back', () => {
    expect(gated).toContain('>Back<')
    expect(open).toContain('>Back<')
  })
})

describe('the Summary buttons', () => {
  it('sit on the title screen next to Settings', () => {
    const html = renderToStaticMarkup(<TitleScreen returning={false} endingsFound={0} onStart={() => undefined} onGuide={() => undefined} onSettings={() => undefined} />)
    expect(html.indexOf('>Summary<')).toBeGreaterThan(html.indexOf('>Start<'))
    expect(html.indexOf('>Summary<')).toBeLessThan(html.indexOf('>Settings<'))
  })
})

describe('a chip line that has not had its turn yet', () => {
  it('keeps its place but stays invisible, instead of flickering as noise below the typing', () => {
    const waiting = renderToStaticMarkup(<ChipLine text="remember this one." resolving={{ resolved: 0, tick: 3, waiting: true }} />)
    expect(waiting).toContain('chip-line--waiting')
    const arriving = renderToStaticMarkup(<ChipLine text="remember this one." resolving={{ resolved: 4, tick: 3, waiting: false }} />)
    expect(arriving).not.toContain('chip-line--waiting')
  })
})

describe('NewEndingDialog', () => {
  const slots = Array.from({ length: 10 }, (_, index) =>
    index === 0 ? { number: 1, found: true, title: "DOC'S TABLE", kind: 'death' as const } : { number: index + 1, found: false },
  )
  const ending = { id: 'scene-x', act: 1 as const, title: "DOC'S TABLE", blocks: [], choices: [], ending: { id: 'docs-table', kind: 'death' as const, number: 1 } }

  it('names the ending, counts progress and says what is left', () => {
    const html = renderToStaticMarkup(<NewEndingDialog open ending={ending} slots={slots} onClose={() => undefined} />)
    expect(html).toContain('New ending')
    expect(html).toContain("DOC&#x27;S TABLE")
    expect(html).toContain('1 of 10 endings found')
    expect(html).toContain('9 still hidden')
    expect(html).toContain('KEEP LOOKING')
  })

  it('says how the ending was reached, in the Summary\'s words, and hints at what carries over without spelling it out', () => {
    const html = renderToStaticMarkup(<NewEndingDialog open ending={ending} slots={slots} onClose={() => undefined} />)
    expect(html).toContain('Stay at the clinic')
    expect(html).toContain('carries into the next one')
    expect(html).not.toContain('Ask who he called')
  })
})
