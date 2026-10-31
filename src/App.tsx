import {
  Backdrop,
  CalmToggle,
  ChoiceList,
  DebugPanel,
  EndingCard,
  EndingTracker,
  EyeVeil,
  GameNotices,
  Hud,
  RestartButton,
  SceneView,
} from './components'
import { listStoryFlags } from './engine'
import { DEBUG_PRESETS } from './story/debugPresets'
import { story } from './story'
import { useCalmMode, useChipVoice, useChoiceKeys, useDecay, useGame, useReducedMotion, useReveal } from './hooks'
import './App.css'

// The debug panel shows in development or with ?debug in the address.
const showDebugPanel = import.meta.env.DEV || new URLSearchParams(window.location.search).has('debug')

const debugScenes = Object.values(story).map((scene) => ({ id: scene.id, title: scene.title }))
const debugFlags = listStoryFlags(story)

function App() {
  const game = useGame()
  const { calm, setCalm } = useCalmMode()
  const cleanInterface = game.scene.cleanInterface === true
  const eyeTaken = game.state.run.runFlags.includes('eye_taken')
  useDecay(game.state.run, cleanInterface)
  useChipVoice(game.state.memory.deaths)
  // Text types out and scenes fade in, unless calm mode or the system asks for less motion.
  const reducedMotion = useReducedMotion()
  const sceneKey = `${game.scene.id}:${game.state.memory.runs}`
  const reveal = useReveal(game.blocks, !calm && !reducedMotion, sceneKey)
  useChoiceKeys({
    choices: game.choices,
    isOver: game.isOver,
    revealing: reveal.revealing,
    onSkip: reveal.skip,
    onChoose: game.choose,
    onRestart: game.restart,
  })

  return (
    <>
      <Backdrop />
      {eyeTaken && <EyeVeil />}
      <main className={eyeTaken ? 'app app--eye-taken' : 'app'}>
        <header className="app__header">
          <h1 className="app__title">Flatline</h1>
          <CalmToggle calm={calm} onChange={setCalm} />
        </header>
        <Hud
          run={game.state.run}
          endingsFound={game.state.memory.endingsSeen.length}
          changes={game.lastChange.changes}
          changeId={game.lastChange.id}
          announcement={game.lastChange.announcement}
          clean={cleanInterface}
        />
        <GameNotices
          loadStatus={game.loadStatus}
          saveFailed={game.saveFailed}
          reachedUnwrittenScene={game.reachedUnwrittenScene}
        />
        <SceneView scene={game.scene} blocks={game.blocks} reveal={reveal} sceneKey={sceneKey} />
        {game.isOver ? (
          // The ending card waits for the text, so it cannot give the ending away early.
          !reveal.revealing && (
            <>
              <EndingCard scene={game.scene} finalChip={game.finalChip} />
              <RestartButton onRestart={game.restart} />
            </>
          )
        ) : (
          <div className={reveal.revealing ? 'app__choices app__choices--pending' : 'app__choices'}>
            <ChoiceList choices={game.choices} blurred={game.state.run.blurred} onChoose={game.choose} />
          </div>
        )}
        <EndingTracker slots={game.endingSlots} />
        {showDebugPanel && (
          <DebugPanel
            state={game.state}
            scenes={debugScenes}
            flags={debugFlags}
            presets={DEBUG_PRESETS}
            onApply={game.debugApply}
            onResetMemory={game.debugResetMemory}
          />
        )}
      </main>
    </>
  )
}

export default App
