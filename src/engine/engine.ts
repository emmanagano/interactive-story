import { isConditionMet } from './conditions'
import { FLATLINE_SCENE_ID, MAX_HEALTH, START_SCENE_ID, STARTING_TIME } from './constants'
import { applyEffect } from './effects'
import type { Choice, ChooseRefusal, ChooseResult, GameState, Memory, Scene, Story } from './types'

/** Thrown when a choice leads to a scene the story does not have (yet). */
export class MissingSceneError extends Error {
  sceneId: string

  constructor(sceneId: string) {
    super(`Scene "${sceneId}" does not exist in the story`)
    this.name = 'MissingSceneError'
    this.sceneId = sceneId
  }
}

function getScene(story: Story, sceneId: string): Scene {
  const scene = story[sceneId]
  // A missing scene is a mistake in the story data, not something a player can
  // cause, so it throws instead of returning a refusal. The story checker makes
  // sure it cannot happen with the real story.
  if (!scene) throw new MissingSceneError(sceneId)
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

// Time or health at zero means Flatline from any scene. The one exception is a
// destination that is already a death: the player dies in the right place either way.
function redirectIfFlatlined(story: Story, state: GameState, destinationId: string): string {
  const flatlined = state.run.time <= 0 || state.run.health <= 0
  if (!flatlined) return destinationId
  // Look the scene up without throwing: a destination that is not written yet is still a Flatline.
  return story[destinationId]?.ending?.kind === 'death' ? destinationId : FLATLINE_SCENE_ID
}

function applySceneEntry(state: GameState, scene: Scene): GameState {
  return (scene.onEnter ?? []).reduce(
    (current, entry) => (isConditionMet(entry.when, current) ? applyEffect(current, entry.effect) : current),
    state,
  )
}

/**
 * Records what a finished run teaches the next one. Does nothing unless the scene
 * is an ending. Entry effects run first, so an ending's memory flags are already set.
 */
export function endRun(state: GameState, scene: Scene): GameState {
  if (!scene.ending) return state
  const { memory } = state
  const endingsSeen = memory.endingsSeen.includes(scene.ending.id)
    ? memory.endingsSeen
    : [...memory.endingsSeen, scene.ending.id]
  const died = scene.ending.kind === 'death'

  return {
    ...state,
    memory: {
      ...memory,
      endingsSeen,
      deaths: memory.deaths + (died ? 1 : 0),
      // A flatline is a death too; the script sets deaths +1 and flatlines +1.
      flatlines: memory.flatlines + (scene.id === FLATLINE_SCENE_ID ? 1 : 0),
      runs: memory.runs + 1,
    },
  }
}

/** Takes one choice. Never throws for player input: it returns why it said no. */
export function choose(story: Story, state: GameState, choiceId: string): ChooseResult {
  const scene = getScene(story, state.run.sceneId)
  if (scene.ending) return refuse('run-over')

  const choice = scene.choices.find((candidate) => candidate.id === choiceId)
  if (!choice) return refuse('unknown-choice')
  if (!isConditionMet(choice.hiddenUnless, state)) return refuse('hidden')
  if (!isConditionMet(choice.requires, state)) return refuse('locked')

  const afterEffect = choice.effect ? applyEffect(state, choice.effect) : state
  const destinationId = redirectIfFlatlined(story, afterEffect, pickDestination(choice, state))
  const arrived: GameState = {
    ...afterEffect,
    // The blur lasts until the next choice, so every choice sets it afresh.
    run: { ...afterEffect.run, sceneId: destinationId, blurred: choice.effect?.blur === true },
  }

  const destination = getScene(story, destinationId)
  return { ok: true, state: endRun(applySceneEntry(arrived, destination), destination) }
}
