import { describe, expect, it } from 'vitest'
import { choose, startRun } from './engine'
import { makeState } from './testState'
import type { ChooseResult, GameState, Story } from './types'

// A tiny made-up story, not the real one. scene-16 is the flatline ending the
// engine sends players to when time or health hits zero.
const fakeStory: Story = {
  'scene-01': {
    id: 'scene-01',
    act: 1,
    title: 'Start',
    blocks: [],
    choices: [
      { id: 'wait', label: 'WAIT', effect: { time: -600, heat: 1 }, goto: 'scene-01' },
      { id: 'safe', label: 'SAFE', goto: 'scene-02' },
      { id: 'jump', label: 'JUMP', goto: 'scene-03' },
      { id: 'gulp', label: 'GULP', effect: { blur: true }, goto: 'scene-01' },
      { id: 'locked', label: 'LOCKED', requires: { flag: 'key' }, goto: 'scene-02' },
      { id: 'secret', label: 'SECRET', hiddenUnless: { flag: 'key' }, goto: 'scene-02' },
      {
        id: 'fork',
        label: 'FORK',
        goto: 'scene-02',
        gotoIf: [{ when: { stat: 'heat', gte: 2 }, goto: 'scene-03' }],
      },
      { id: 'drain', label: 'DRAIN', effect: { health: -1 }, goto: 'scene-01', gotoIf: [{ when: { stat: 'health', lte: 1 }, goto: 'scene-03' }] },
    ],
  },
  'scene-02': {
    id: 'scene-02',
    act: 1,
    title: 'Safe',
    blocks: [],
    choices: [],
    ending: { id: 'safe', kind: 'survive', number: 6 },
    onEnter: [{ when: { flag: 'with_friend' }, effect: { setMemoryFlags: ['friend_saw'] } }],
  },
  'scene-03': {
    id: 'scene-03',
    act: 1,
    title: 'Fall',
    blocks: [],
    choices: [],
    ending: { id: 'fell', kind: 'death', number: 1 },
    onEnter: [{ effect: { setMemoryFlags: ['learned'] } }],
  },
}

function chosen(result: ChooseResult): GameState {
  if (!result.ok) throw new Error(`Expected the choice to work, got "${result.reason}"`)
  return result.state
}

describe('startRun', () => {
  it('starts with 6:00:00, full health, no heat and the first scene', () => {
    const { run } = startRun(makeState().memory)
    expect(run).toEqual({
      time: 21600,
      health: 5,
      heat: 0,
      sceneId: 'scene-01',
      runFlags: [],
      inventory: [],
      blurred: false,
    })
  })

  it('keeps what the player learned in past runs', () => {
    const memory = makeState({}, { deaths: 3, memoryFlags: ['reyes_lied'] }).memory
    expect(startRun(memory).memory).toEqual(memory)
  })
})

describe('choose', () => {
  it('pays the cost and stays in play for a normal choice', () => {
    const before = startRun(makeState().memory)
    const after = chosen(choose(fakeStory, before, 'wait'))
    expect(after.run.time).toBe(21000)
    expect(after.run.heat).toBe(1)
    expect(after.run.sceneId).toBe('scene-01')
    expect(before.run.time).toBe(21600)
  })

  it('moves to the scene the choice leads to', () => {
    const after = chosen(choose(fakeStory, startRun(makeState().memory), 'safe'))
    expect(after.run.sceneId).toBe('scene-02')
  })

  it('refuses a locked choice and changes nothing', () => {
    const result = choose(fakeStory, startRun(makeState().memory), 'locked')
    expect(result).toEqual({ ok: false, reason: 'locked' })
  })

  it('accepts the locked choice once its condition is met', () => {
    const state = makeState({ runFlags: ['key'] })
    expect(choose(fakeStory, state, 'locked').ok).toBe(true)
  })

  it('refuses a hidden choice and an unknown one', () => {
    const state = startRun(makeState().memory)
    expect(choose(fakeStory, state, 'secret')).toEqual({ ok: false, reason: 'hidden' })
    expect(choose(fakeStory, state, 'nope')).toEqual({ ok: false, reason: 'unknown-choice' })
  })

  it('takes the first branch that matches, otherwise the plain goto', () => {
    const cold = chosen(choose(fakeStory, makeState({ heat: 1 }), 'fork'))
    const hot = chosen(choose(fakeStory, makeState({ heat: 2 }), 'fork'))
    expect(cold.run.sceneId).toBe('scene-02')
    expect(hot.run.sceneId).toBe('scene-03')
  })

  it('checks branches against the state before the choice cost', () => {
    // At 1 HP the choice costs 1 HP, but the branch is about arriving at 1 HP.
    const after = chosen(choose(fakeStory, makeState({ health: 1 }), 'drain'))
    expect(after.run.sceneId).toBe('scene-03')
  })

  it('applies a scene\'s entry effects, only when their condition holds', () => {
    const alone = chosen(choose(fakeStory, makeState(), 'safe'))
    const withFriend = chosen(choose(fakeStory, makeState({ runFlags: ['with_friend'] }), 'safe'))
    expect(alone.memory.memoryFlags).toEqual([])
    expect(withFriend.memory.memoryFlags).toEqual(['friend_saw'])
  })

  it('blurs for one choice only', () => {
    const blurred = chosen(choose(fakeStory, startRun(makeState().memory), 'gulp'))
    expect(blurred.run.blurred).toBe(true)
    expect(chosen(choose(fakeStory, blurred, 'wait')).run.blurred).toBe(false)
  })

  it('throws if a choice points at a scene that does not exist', () => {
    const broken: Story = {
      'scene-01': { ...fakeStory['scene-01'], choices: [{ id: 'oops', label: 'OOPS', goto: 'nowhere' }] },
    }
    expect(() => choose(broken, startRun(makeState().memory), 'oops')).toThrow('nowhere')
  })
})
