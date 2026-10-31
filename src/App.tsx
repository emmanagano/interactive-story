import {
  Backdrop,
  CalmToggle,
  ChoiceList,
  DecayPreview,
  EndingCard,
  EndingTracker,
  EyeVeil,
  GameNotices,
  Hud,
  RestartButton,
  SceneView,
} from './components'
import { useCalmMode, useChipVoice, useChoiceKeys, useDecay, useGame } from './hooks'
import './App.css'

// Temporary: the preview sliders show in development or with ?debug in the address.
const showDecayPreview = import.meta.env.DEV || new URLSearchParams(window.location.search).has('debug')

function App() {
  const game = useGame()
  const { calm, setCalm } = useCalmMode()
  const cleanInterface = game.scene.cleanInterface === true
  const eyeTaken = game.state.run.runFlags.includes('eye_taken')
  useDecay(game.state.run, cleanInterface)
  useChipVoice(game.state.memory.deaths)
  useChoiceKeys({
    choices: game.choices,
    isOver: game.isOver,
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
        <SceneView scene={game.scene} blocks={game.blocks} />
        {game.isOver ? (
          <>
            <EndingCard scene={game.scene} finalChip={game.finalChip} />
            <RestartButton onRestart={game.restart} />
          </>
        ) : (
          <ChoiceList choices={game.choices} blurred={game.state.run.blurred} onChoose={game.choose} />
        )}
        <EndingTracker slots={game.endingSlots} />
        {showDecayPreview && <DecayPreview run={game.state.run} onChange={game.previewRun} />}
      </main>
    </>
  )
}

export default App
