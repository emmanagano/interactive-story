import { ChoiceList, GameNotices, RestartButton, SceneView } from './components'
import { formatClock } from './components/formatClock'
import { useChoiceKeys, useGame } from './hooks'
import './App.css'

function App() {
  const game = useGame()
  useChoiceKeys({
    choices: game.choices,
    isOver: game.isOver,
    onChoose: game.choose,
    onRestart: game.restart,
  })

  const { run } = game.state
  return (
    <main className="app">
      <h1>Flatline</h1>
      {/* Temporary plain readout until the HUD arrives in Step 3.1. */}
      <p className="app__status">
        Time {formatClock(run.time)} · Health {run.health}/5 · Heat {run.heat}/5
      </p>
      <GameNotices
        loadStatus={game.loadStatus}
        saveFailed={game.saveFailed}
        reachedUnwrittenScene={game.reachedUnwrittenScene}
      />
      <SceneView scene={game.scene} blocks={game.blocks} />
      {game.isOver ? (
        <RestartButton onRestart={game.restart} />
      ) : (
        <ChoiceList choices={game.choices} onChoose={game.choose} />
      )}
    </main>
  )
}

export default App
