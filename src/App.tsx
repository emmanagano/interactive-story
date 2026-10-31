import { Backdrop, ChoiceList, GameNotices, Hud, RestartButton, SceneView } from './components'
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

  return (
    <>
      <Backdrop />
      <main className="app">
        <h1 className="app__title">Flatline</h1>
        <Hud
          run={game.state.run}
          endingsFound={game.state.memory.endingsSeen.length}
          changes={game.lastChange.changes}
          changeId={game.lastChange.id}
          announcement={game.lastChange.announcement}
        />
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
    </>
  )
}

export default App
