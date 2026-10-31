import { isConditionMet } from './conditions'
import { MAX_HEALTH, START_SCENE_ID, STARTING_TIME } from './constants'
import { applyEffect } from './effects'
import type { Choice, ChooseRefusal, ChooseResult, GameState, Memory, Scene, Story } from './types'

function getScene(story: Story, sceneId: string): Scene {
  const scene = story[sceneId]
  // A missing scene is a mistake in the story data, not something a player can
  // cause, so it throws loudly instead of returning a refusal.
  if (!scene) throw new Error(`Scene "${sceneId}" does not exist in the story`)
  return scene
}

function refuse(reason: ChooseRefusal): ChooseResult {
  return { ok: false, reason }
}

/** A fresh run. Memory is carried over untouched, so starting never changes it. */
export function startRun(memory: Memory): GameState {
  return {
    run: {
      time: STARTING_TIME,
      health: MAX_HEALTH,
      heat: 0,
      sceneId: START_SCENE_ID,
      runFlags: [],
      inventory: [],
      blurred: false,
    },
    memory,
  }
}

// Branch conditions are checked against the state the player chose in, before the
// choice's own cost. "At 1 HP" in the script means arriving at 1 HP, not ending there.
function pickDestination(choice: Choice, stateWhenChosen: GameState): string {
  const branch = choice.gotoIf?.find((candidate) => isConditionMet(candidate.when, stateWhenChosen))
  return branch ? branch.goto : choice.goto
}

function applySceneEntry(state: GameState, scene: Scene): GameState {
  return (scene.onEnter ?? []).reduce(
    (current, entry) => (isConditionMet(entry.when, current) ? applyEffect(current, entry.effect) : current),
    state,
  )
}

/** Takes one choice. Never throws for player input: it returns why it said no. */
export function choose(story: Story, state: GameState, choiceId: string): ChooseResult {
  const scene = getScene(story, state.run.sceneId)
  if (scene.ending) return refuse('run-over')

  const choice = scene.choices.find((candidate) => candidate.id === choiceId)
  if (!choice) return refuse('unknown-choice')
  if (!isConditionMet(choice.hiddenUnless, state)) return refuse('hidden')
  if (!isConditionMet(choice.requires, state)) return refuse('locked')

  const destinationId = pickDestination(choice, state)
  const afterEffect = choice.effect ? applyEffect(state, choice.effect) : state
  const arrived: GameState = {
    ...afterEffect,
    // The blur lasts until the next choice, so every choice sets it afresh.
    run: { ...afterEffect.run, sceneId: destinationId, blurred: choice.effect?.blur === true },
  }

  return { ok: true, state: applySceneEntry(arrived, getScene(story, destinationId)) }
}
