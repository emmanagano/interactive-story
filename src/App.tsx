import { useEffect, useState } from 'react'
import { Backdrop, EyeVeil, GameScreen, SettingsScreen, TitleScreen } from './components'
import { SPEED_MULTIPLIER } from './components/reveal'
import { heartbeatInterval, soundCueForScene } from './engine'
import { useChipVoice, useChoiceKeys, useDecay, useGame, useReducedMotion, useReveal, useSettings, useSound } from './hooks'
import './App.css'

type Screen = 'title' | 'game' | 'settings'

function App() {
  const game = useGame()
  const settings = useSettings()
  const [screen, setScreen] = useState<Screen>('title')
  const [leaveSettingsTo, setLeaveSettingsTo] = useState<'title' | 'game'>('title')
  const [started, setStarted] = useState(false)

  const cleanInterface = game.scene.cleanInterface === true
  const eyeTaken = game.state.run.runFlags.includes('eye_taken')
  useDecay(game.state.run, cleanInterface)
  useChipVoice(game.state.memory.deaths)

  // Text types out and scenes fade in, unless calm mode, the system or the text speed says otherwise.
  // It starts when the player presses Start, so the first scene is not already typed by then.
  const reducedMotion = useReducedMotion()
  const animateText = started && !settings.calm && !reducedMotion && settings.textSpeed !== 'instant'
  const speed = settings.textSpeed === 'instant' ? 1 : SPEED_MULTIPLIER[settings.textSpeed]
  const sceneKey = `${game.scene.id}:${game.state.memory.runs}`
  const reveal = useReveal(game.blocks, animateText, sceneKey, speed)

  // Sound is off until the player turns it on. The heart monitor only beats while a run is going.
  const playing = screen === 'game' && !game.isOver
  const sound = useSound({
    enabled: settings.sound,
    volume: settings.volume,
    heartbeat: playing ? heartbeatInterval(game.state.run) : null,
    flatlineKey: screen === 'game' && soundCueForScene(game.scene) === 'flatline' ? sceneKey : null,
  })

  useChoiceKeys({
    active: screen === 'game',
    choices: game.choices,
    isOver: game.isOver,
    revealing: reveal.revealing,
    onSkip: reveal.skip,
    onChoose: game.choose,
    onRestart: game.restart,
  })

  // When the screen changes, focus lands on that screen's heading, so a screen reader starts reading
  // at the top instead of being left on a button that no longer exists. The title focuses Start itself.
  useEffect(() => {
    if (screen !== 'title') document.querySelector<HTMLElement>('[data-screen-heading]')?.focus()
  }, [screen])

  const openSettings = () => {
    setLeaveSettingsTo(screen === 'game' ? 'game' : 'title')
    setScreen('settings')
  }
  const memory = game.state.memory
  const returning = memory.runs > 0 || memory.deaths > 0 || memory.endingsSeen.length > 0

  return (
    <>
      <Backdrop />
      {eyeTaken && screen !== 'title' && <EyeVeil />}
      <main className={eyeTaken && screen !== 'title' ? 'app app--eye-taken' : 'app'}>
        {screen === 'title' && (
          <TitleScreen
            returning={returning}
            endingsFound={memory.endingsSeen.length}
            onStart={() => {
              setStarted(true)
              setScreen('game')
            }}
            onSettings={openSettings}
          />
        )}
        {screen === 'settings' && (
          <SettingsScreen
            calm={settings.calm}
            textSpeed={settings.textSpeed}
            sound={settings.sound}
            volume={settings.volume}
            memory={memory}
            onCalm={settings.setCalm}
            onTextSpeed={settings.setTextSpeed}
            onSound={settings.setSound}
            onVolume={(volume) => {
              settings.setVolume(volume)
              sound.preview()
            }}
            onImport={game.replaceProgress}
            onReset={game.resetProgress}
            onBack={() => setScreen(leaveSettingsTo)}
          />
        )}
        {screen === 'game' && (
          <>
            <header className="app__header">
              <h1 className="app__title" data-screen-heading tabIndex={-1}>
                Flatline
              </h1>
              <div className="app__buttons">
                {/* Always in reach, so ambient sound can be stopped without opening Settings. */}
                <button type="button" className="app__settings" onClick={() => settings.setSound(!settings.sound)}>
                  Sound: {settings.sound ? 'on' : 'off'}
                </button>
                <button type="button" className="app__settings" onClick={openSettings}>
                  Settings
                </button>
              </div>
            </header>
            <GameScreen game={game} reveal={reveal} sceneKey={sceneKey} cleanInterface={cleanInterface} calm={settings.calm} />
          </>
        )}
      </main>
    </>
  )
}

export default App
