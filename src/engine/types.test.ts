import { describe, expect, it } from 'vitest'
import type { Condition, Effect, Scene } from './types'

// Vitest does not type-check, so the real guard here is `npm run typecheck`:
// this file stops compiling if the scene format drifts from the script.
describe('scene format', () => {
  it('can describe every kind of condition, branch and entry effect', () => {
    const conditions: Condition[] = [
      { flag: 'reyes_lied' },
      { item: 'painkillers' },
      { blurred: true },
      { not: { flag: 'tavi_forgiven' } },
      { all: [{ flag: 'with_tavi' }, { stat: 'heat', gte: 2 }] },
      { any: [{ flag: 'knows_route' }, { flag: 'listened' }] },
      { stat: 'time', lte: 3600 },
    ]

    const scene: Scene = {
      id: 'scene-13',
      act: 2,
      title: 'The Drowned Line',
      blocks: [
        { type: 'text', text: 'Water.' },
        { type: 'chip', text: '> left wall.', when: { flag: 'listened' } },
        { type: 'system', text: 'Time left' },
      ],
      choices: [
        {
          id: 'left',
          label: 'LEFT, TO THE GATE',
          requires: conditions[0],
          hiddenUnless: conditions[1],
          effect: { time: -600, health: -1, setRunFlags: ['at_gate'] },
          goto: 'scene-17',
          gotoIf: [{ when: { stat: 'heat', gte: 4 }, goto: 'scene-11' }],
        },
      ],
      onEnter: [
        { effect: { setMemoryFlags: ['knows_route'] } },
        { when: { flag: 'with_tavi' }, effect: { setMemoryFlags: ['tavi_secret'] } },
      ],
      ending: { id: 'drowned', kind: 'death', number: 4 },
    }

    expect(scene.choices[0].gotoIf).toHaveLength(1)
    expect(scene.onEnter).toHaveLength(2)
    expect(conditions).toHaveLength(7)
  })

  it('keeps death counters out of effects so the engine owns them', () => {
    // @ts-expect-error deaths is counted by the engine, never set by a story file
    const sneaky: Effect = { deaths: 1 }
    expect(sneaky).toBeDefined()
  })
})
