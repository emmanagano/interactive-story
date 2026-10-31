import { describe, expect, it } from 'vitest'
import { validateStory } from './validate'

const options = { placeholderSceneIds: ['scene-16'], flagsSetByLaterActs: [] as string[] }

// Loosely typed on purpose: these tests build data that is broken in ways TypeScript would refuse.
type TestScene = {
  id: string
  act: number
  title: string
  blocks: Record<string, unknown>[]
  choices: Record<string, unknown>[]
  ending?: unknown
}

// Smallest sound story: a start scene leading to an ending.
function goodStory(): TestScene[] {
  return [
    {
      id: 'scene-01',
      act: 1,
      title: 'START',
      blocks: [{ type: 'text', text: 'Rain.' }],
      choices: [{ id: 'go', label: 'GO', goto: 'scene-02' }],
    },
    {
      id: 'scene-02',
      act: 1,
      title: 'END',
      blocks: [],
      choices: [],
      ending: { id: 'the-end', kind: 'survive', number: 6 },
    },
  ]
}

function problemsFor(change: (scenes: TestScene[]) => void, custom = options): string[] {
  const scenes = goodStory()
  change(scenes)
  return validateStory([scenes], custom)
}

describe('validateStory', () => {
  it('accepts a sound story', () => {
    expect(validateStory([goodStory()], options)).toEqual([])
  })

  it('catches a goto that points nowhere', () => {
    const problems = problemsFor((s) => { s[0].choices[0].goto = 'scene-99' })
    expect(problems).toContainEqual(expect.stringContaining('goto "scene-99" does not exist'))
  })

  it('catches a broken gotoIf branch', () => {
    const problems = problemsFor((s) => {
      Object.assign(s[0].choices[0], { gotoIf: [{ when: { flag: 'x' }, goto: 'scene-99' }], effect: { setRunFlags: ['x'] } })
    })
    expect(problems).toContainEqual(expect.stringContaining('gotoIf: goto "scene-99" does not exist'))
  })

  it('allows a goto to a listed placeholder, but not once that scene exists', () => {
    const toPlaceholder = problemsFor((s) => { s[0].choices[0].goto = 'scene-16' })
    expect(toPlaceholder).not.toContainEqual(expect.stringContaining('does not exist'))
    const nowReal = problemsFor((s) => s.push({ id: 'scene-16', act: 1, title: 'F', blocks: [], choices: [], ending: { id: 'f', kind: 'death', number: 5 } }))
    expect(nowReal).toContainEqual(expect.stringContaining('now exists, so remove it'))
  })

  it('catches a scene with no choices that is not an ending', () => {
    const problems = problemsFor((s) => { delete s[1].ending })
    expect(problems).toContainEqual(expect.stringContaining('scene-02: has no choices and is not an ending'))
  })

  it('catches an ending that still has choices', () => {
    const problems = problemsFor((s) => { Object.assign(s[1], { choices: [{ id: 'x', label: 'X', goto: 'scene-01' }] }) })
    expect(problems).toContainEqual(expect.stringContaining('an ending scene must not have choices'))
  })

  it('catches repeated ending ids and numbers', () => {
    const problems = problemsFor((s) => {
      s[0].choices.push({ id: 'again', label: 'AGAIN', goto: 'scene-03' })
      s.push({ id: 'scene-03', act: 1, title: 'END', blocks: [], choices: [], ending: { id: 'the-end', kind: 'survive', number: 6 } })
    })
    expect(problems).toContainEqual(expect.stringContaining('ending id "the-end" is already used'))
    expect(problems).toContainEqual(expect.stringContaining('ending number 6 is already used'))
  })

  it('catches a repeated scene id and a repeated choice id', () => {
    const problems = problemsFor((s) => {
      s[0].choices.push({ id: 'go', label: 'GO AGAIN', goto: 'scene-02' })
      s.push({ ...s[1] })
    })
    expect(problems).toContainEqual(expect.stringContaining('scene id is used twice'))
    expect(problems).toContainEqual(expect.stringContaining('choice id is used twice'))
  })

  it('catches a flag that is used but never set, and honours the later-acts list', () => {
    const change = (s: TestScene[]) => {
      Object.assign(s[0].choices[0], { requires: { flag: 'ghost' } })
    }
    expect(problemsFor(change)).toContainEqual(expect.stringContaining('flag "ghost" is used but never set'))
    expect(problemsFor(change, { ...options, flagsSetByLaterActs: ['ghost'] })).toEqual([])
  })

  it('catches a later-acts flag that has since been set', () => {
    const problems = problemsFor(
      (s) => { Object.assign(s[0].choices[0], { effect: { setMemoryFlags: ['ghost'] } }) },
      { ...options, flagsSetByLaterActs: ['ghost'] },
    )
    expect(problems).toContainEqual(expect.stringContaining('now set in the story'))
  })

  it('accepts a flag that is set by an effect, and by a scene entry', () => {
    const problems = problemsFor((s) => {
      Object.assign(s[0].choices[0], { requires: { all: [{ flag: 'a' }, { not: { flag: 'b' } }] } })
      Object.assign(s[1], { onEnter: [{ effect: { setRunFlags: ['a'], setMemoryFlags: ['b'] } }] })
    })
    expect(problems).toEqual([])
  })

  it('catches an item that is used but never added', () => {
    const problems = problemsFor((s) => { Object.assign(s[0].choices[0], { hiddenUnless: { item: 'keycard' } }) })
    expect(problems).toContainEqual(expect.stringContaining('item "keycard" is used but never added'))
  })

  it('catches a scene nobody can reach', () => {
    const problems = problemsFor((s) => s.push({ id: 'scene-07', act: 1, title: 'LOST', blocks: [], choices: [], ending: { id: 'lost', kind: 'death', number: 1 } }))
    expect(problems).toContainEqual(expect.stringContaining('scene-07: no choice leads here'))
  })

  it('catches script markup that leaked into the text', () => {
    const problems = problemsFor((s) => {
      s[0].blocks.push({ type: 'text', text: 'Hello *\\[if reyes\\_lied\\]*' })
      s[0].blocks.push({ type: 'chip', text: '> k…kade' })
    })
    expect(problems).toContainEqual(expect.stringContaining('script markup'))
    expect(problems).toContainEqual(expect.stringContaining('chip text must not start with "> "'))
  })

  it('catches an ending banner line written into the story', () => {
    const problems = problemsFor((s) => {
      s[1].blocks.push({ type: 'system', text: "**FLATLINE · ENDING 01 / 10 · DOC'S TABLE**" })
    })
    expect(problems).toContainEqual(expect.stringContaining('the ending card writes this banner line itself'))
  })

  it('catches malformed conditions, effects and blocks', () => {
    const problems = problemsFor((s) => {
      Object.assign(s[0].choices[0], {
        requires: { stat: 'luck', gte: 'high' },
        effect: { time: -1.5, cheat: true, blur: false },
      })
      s[0].blocks.push({ type: 'shout', text: 'x' })
    })
    expect(problems).toContainEqual(expect.stringContaining('unknown stat "luck"'))
    expect(problems).toContainEqual(expect.stringContaining('gte must be a number'))
    expect(problems).toContainEqual(expect.stringContaining('time must be a whole number'))
    expect(problems).toContainEqual(expect.stringContaining('unknown effect field "cheat"'))
    expect(problems).toContainEqual(expect.stringContaining('blur can only be true'))
    expect(problems).toContainEqual(expect.stringContaining('needs a type'))
  })

  it('catches a cleanInterface that is not true', () => {
    const problems = problemsFor((s) => { Object.assign(s[1], { cleanInterface: false }) })
    expect(problems).toContainEqual(expect.stringContaining('cleanInterface can only be true'))
  })

  it('catches a bad act number and a missing title', () => {
    const problems = problemsFor((s) => { Object.assign(s[0], { act: 4, title: '' }) })
    expect(problems).toContainEqual(expect.stringContaining('act must be 1, 2 or 3'))
    expect(problems).toContainEqual(expect.stringContaining('needs a title'))
  })

  it('catches a file that is not a list of scenes', () => {
    expect(validateStory([{ not: 'a list' }], options)).toContainEqual(expect.stringContaining('must be a list of scenes'))
  })

  it('catches a missing start scene', () => {
    const problems = problemsFor((s) => { s[0].id = 'intro' })
    expect(problems).toContainEqual(expect.stringContaining('the engine needs a scene "scene-01"'))
  })
})
