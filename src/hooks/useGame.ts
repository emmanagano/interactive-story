import { useCallback, useState } from 'react'
import { applyDebugPatch, choose as takeChoice, createEmptyMemory, listChoices, listEndingSlots, loadMemory, resetMemory, saveMemory, splitEndingBlocks, startRun, visibleBlocks } from '../engine'
import type { Block, DebugPatch, EndingSlot, GameState, ListedChoice, LoadStatus, Memory, Scene } from '../engine'
import { describeChanges, describeNewRun, diffRun, INTERFACE_RESTORED, NO_CHANGES } from '../components/runChanges'
import type { RunChanges } from '../components/runChanges'
import { story } from '../story'

/** What the last choice did to the meters. The id changes every time, so the HUD can replay its animation. */
export type LastChange = {
  id: number
  changes: RunChanges
  announcement: string
}

export type Game = {
  state: GameState
  scene: Scene
  blocks: Block[] // the story text; on an ending, without its closing chip line
  finalChip: Block | null // shown on the ending card
  endingSlots: EndingSlot[]
  choices: ListedChoice[]
  isOver: boolean
  loadStatus: LoadStatus
  saveFailed: boolean
  lastChange: LastChange
  choose: (choiceId: string) => void
  restart: () => void
  debugApply: (patch: DebugPatch) => void
  /** Replaces everything the game remembers (an imported save) and starts a fresh run with it. */
  replaceProgress: (memory: Memory) => void
  /** Forgets everything: clears the save and starts again as a new player. */
  resetProgress: () => void
}

/** Connects the pure engine to React. It holds state and saves progress; it decides nothing about the story. */
export function useGame(): Game {
  const [loaded] = useState(() => loadMemory())
  const [state, setState] = useState<GameState>(() => startRun(loaded.memory))
  const [saveFailed, setSaveFailed] = useState(false)
  const [lastChange, setLastChange] = useState<LastChange>({ id: 0, changes: NO_CHANGES, announcement: '' })

  const choose = useCallback(
    (choiceId: string) => {
      const result = takeChoice(story, state, choiceId)
      if (!result.ok) return
      setState(result.state)
      const changes = diffRun(state.run, result.state.run)
      const restored = story[result.state.run.sceneId]?.cleanInterface === true
      const announcement = [describeChanges(changes), restored ? INTERFACE_RESTORED : ''].filter(Boolean).join(' ')
      setLastChange((previous) => ({ id: previous.id + 1, changes, announcement }))
      // Memory only changes when a run ends, so that is the only time to save.
      if (result.state.memory !== state.memory) setSaveFailed(!saveMemory(result.state.memory))
    },
    [state],
  )

  const restart = useCallback(() => {
    const fresh = startRun(state.memory)
    setState(fresh)
    setLastChange((previous) => ({ id: previous.id + 1, changes: NO_CHANGES, announcement: describeNewRun(fresh.run) }))
  }, [state.memory])

  // Debug panel only. Setting things by hand skips the story's rules on purpose. Progress is
  // saved, so a reload keeps the tracker and the unlocks you set up.
  const debugApply = useCallback(
    (patch: DebugPatch) => {
      const next = applyDebugPatch(state, patch)
      setState(next)
      if (next.memory !== state.memory) setSaveFailed(!saveMemory(next.memory))
    },
    [state],
  )

  const startAgainWith = useCallback((memory: Memory) => {
    const fresh = startRun(memory)
    setState(fresh)
    setLastChange((previous) => ({ id: previous.id + 1, changes: NO_CHANGES, announcement: describeNewRun(fresh.run) }))
  }, [])

  const replaceProgress = useCallback(
    (memory: Memory) => {
      setSaveFailed(!saveMemory(memory))
      startAgainWith(memory)
    },
    [startAgainWith],
  )

  const resetProgress = useCallback(() => {
    resetMemory()
    setSaveFailed(false)
    startAgainWith(createEmptyMemory())
  }, [startAgainWith])

  const scene = story[state.run.sceneId]
  const ending = splitEndingBlocks(scene, visibleBlocks(scene, state))
  return {
    state,
    scene,
    blocks: ending.story,
    finalChip: ending.finalChip,
    endingSlots: listEndingSlots(story, state.memory.endingsSeen),
    choices: listChoices(scene, state),
    isOver: scene.ending !== undefined,
    loadStatus: loaded.status,
    saveFailed,
    lastChange,
    choose,
    restart,
    debugApply,
    replaceProgress,
    resetProgress,
  }
}
