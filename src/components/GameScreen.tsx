import { lazy, Suspense } from 'react'
import { listStoryFlags } from '../engine'
import type { Game, Reveal } from '../hooks'
import { DEBUG_PRESETS } from '../story/debugPresets'
import { story } from '../story'
import BlurNotice from './BlurNotice'
import ChoiceList from './ChoiceList'
import EndingCard from './EndingCard'
import EndingTracker from './EndingTracker'
import GameNotices from './GameNotices'
import NewEndingDialog from './NewEndingDialog'
import Hud from './Hud'
import RestartButton from './RestartButton'
import SceneView from './SceneView'
import './GameScreen.css'

// The debug panel shows in development or with ?debug in the address. It is loaded only then,
// so ordinary players never download it.
const DebugPanel = lazy(() => import('./DebugPanel'))
const showDebugPanel = import.meta.env.DEV || new URLSearchParams(window.location.search).has('debug')
const debugScenes = Object.values(story).map((scene) => ({ id: scene.id, title: scene.title }))
const debugFlags = listStoryFlags(story)

type Props = {
  game: Game
  reveal: Reveal
  sceneKey: string
  cleanInterface: boolean
  calm: boolean
}

/** Everything in the game itself: the HUD, the scene, the choices and the endings found so far. */
function GameScreen({ game, reveal, sceneKey, cleanInterface, calm }: Props) {
  return (
    <>
      <Hud
        run={game.state.run}
        endingsFound={game.state.memory.endingsSeen.length}
        changes={game.lastChange.changes}
        changeId={game.lastChange.id}
        announcement={game.lastChange.announcement}
        clean={cleanInterface}
      />
      <GameNotices loadStatus={game.loadStatus} saveFailed={game.saveFailed} />
      {/* The story on the left, what you can do about it on the right, the endings underneath. */}
      <div className="game-screen__frame">
        <div className="game-screen__stage">
          <SceneView scene={game.scene} blocks={game.blocks} reveal={reveal} sceneKey={sceneKey} />
          <div className="game-screen__actions">
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
                <BlurNotice blurred={game.state.run.blurred} calm={calm} />
                <ChoiceList choices={game.choices} blurred={game.state.run.blurred} onChoose={game.choose} />
              </div>
            )}
          </div>
        </div>
      </div>
      <EndingTracker slots={game.endingSlots} />
      {/* Opens only once the ending's text has finished, so it cannot give the ending away early. */}
      <NewEndingDialog
        open={game.isOver && !reveal.revealing}
        ending={game.newEnding}
        slots={game.endingSlots}
        onClose={game.dismissNewEnding}
      />
      {showDebugPanel && (
        <Suspense fallback={null}>
          <DebugPanel
            state={game.state}
            scenes={debugScenes}
            flags={debugFlags}
            presets={DEBUG_PRESETS}
            onApply={game.debugApply}
            onResetMemory={game.resetProgress}
          />
        </Suspense>
      )}
    </>
  )
}

export default GameScreen
