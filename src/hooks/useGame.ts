import { useCallback, useState } from 'react'
import { choose as takeChoice, listChoices, loadMemory, MissingSceneError, saveMemory, startRun, visibleBlocks } from '../engine'
import type { Block, GameState, ListedChoice, LoadStatus, Scene } from '../engine'
import { story } from '../story'

export type Game = {
  state: GameState
  scene: Scene
  blocks: Block[]
  choices: ListedChoice[]
  isOver: boolean
  loadStatus: LoadStatus
  saveFailed: boolean
  reachedUnwrittenScene: boolean
  choose: (choiceId: string) => void
  restart: () => void
}

/** Connects the pure engine to React. It holds state and saves progress; it decides nothing about the story. */
export function useGame(): Game {
  const [loaded] = useState(() => loadMemory())
  const [state, setState] = useState<GameState>(() => startRun(loaded.memory))
  const [saveFailed, setSaveFailed] = useState(false)
  const [reachedUnwrittenScene, setReachedUnwrittenScene] = useState(false)

  const choose = useCallback(
    (choiceId: string) => {
      try {
        const result = takeChoice(story, state, choiceId)
        if (!result.ok) return
        setReachedUnwrittenScene(false)
        setState(result.state)
        // Memory only changes when a run ends, so that is the only time to save.
        if (result.state.memory !== state.memory) setSaveFailed(!saveMemory(result.state.memory))
      } catch (error) {
        // Act 2 is not written yet, so some choices lead nowhere. Stay in the scene.
        if (error instanceof MissingSceneError) setReachedUnwrittenScene(true)
        else throw error
      }
    },
    [state],
  )

  const restart = useCallback(() => {
    setReachedUnwrittenScene(false)
    setState((current) => startRun(current.memory))
  }, [])

  const scene = story[state.run.sceneId]
  return {
    state,
    scene,
    blocks: visibleBlocks(scene, state),
    choices: listChoices(scene, state),
    isOver: scene.ending !== undefined,
    loadStatus: loaded.status,
    saveFailed,
    reachedUnwrittenScene,
    choose,
    restart,
  }
}
