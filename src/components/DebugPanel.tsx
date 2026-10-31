import type { DebugPatch, GameState, StoryFlags } from '../engine'
import { formatClock } from './formatClock'
import './DebugPanel.css'

type Preset = { label: string; patch: DebugPatch }

type Props = {
  state: GameState
  scenes: { id: string; title: string }[]
  flags: StoryFlags
  presets: Preset[]
  onApply: (patch: DebugPatch) => void
  onResetMemory: () => void
}

function toggled(list: string[], item: string, on: boolean): string[] {
  return on ? [...list.filter((entry) => entry !== item), item] : list.filter((entry) => entry !== item)
}

/** For testing only: jump anywhere and set anything. Shown in development or with ?debug. */
function DebugPanel({ state, scenes, flags, presets, onApply, onResetMemory }: Props) {
  const { run, memory } = state
  const number = (value: string) => Number(value)

  return (
    <details className="debug-panel">
      <summary>Debug panel</summary>

      <fieldset className="debug-panel__group">
        <legend>Presets</legend>
        {presets.map((preset) => (
          <button key={preset.label} type="button" className="debug-panel__button" onClick={() => onApply(preset.patch)}>
            {preset.label}
          </button>
        ))}
      </fieldset>

      <fieldset className="debug-panel__group">
        <legend>Jump to a scene</legend>
        <label className="debug-panel__row">
          Scene
          <select value={run.sceneId} onChange={(event) => onApply({ sceneId: event.target.value })}>
            {scenes.map((scene) => (
              <option key={scene.id} value={scene.id}>
                {scene.id} · {scene.title}
              </option>
            ))}
          </select>
        </label>
      </fieldset>

      <fieldset className="debug-panel__group">
        <legend>This run</legend>
        <label className="debug-panel__row">
          Time left {formatClock(run.time)}
          <input type="range" min={0} max={21600} step={60} value={run.time} onChange={(e) => onApply({ time: number(e.target.value) })} />
        </label>
        <label className="debug-panel__row">
          Health {run.health}
          <input type="range" min={0} max={5} value={run.health} onChange={(e) => onApply({ health: number(e.target.value) })} />
        </label>
        <label className="debug-panel__row">
          Heat {run.heat}
          <input type="range" min={0} max={5} value={run.heat} onChange={(e) => onApply({ heat: number(e.target.value) })} />
        </label>
      </fieldset>

      <fieldset className="debug-panel__group">
        <legend>This run: flags and items</legend>
        {flags.runFlags.map((flag) => (
          <label key={flag} className="debug-panel__check">
            <input type="checkbox" checked={run.runFlags.includes(flag)} onChange={(e) => onApply({ runFlags: toggled(run.runFlags, flag, e.target.checked) })} />
            {flag}
          </label>
        ))}
        {flags.items.map((item) => (
          <label key={item} className="debug-panel__check">
            <input type="checkbox" checked={run.inventory.includes(item)} onChange={(e) => onApply({ inventory: toggled(run.inventory, item, e.target.checked) })} />
            item: {item}
          </label>
        ))}
      </fieldset>

      <fieldset className="debug-panel__group">
        <legend>Past runs (saved)</legend>
        <label className="debug-panel__row">
          Deaths
          <input type="number" min={0} value={memory.deaths} onChange={(e) => onApply({ deaths: number(e.target.value) })} />
        </label>
        <label className="debug-panel__row">
          Flatlines
          <input type="number" min={0} value={memory.flatlines} onChange={(e) => onApply({ flatlines: number(e.target.value) })} />
        </label>
        {flags.memoryFlags.map((flag) => (
          <label key={flag} className="debug-panel__check">
            <input type="checkbox" checked={memory.memoryFlags.includes(flag)} onChange={(e) => onApply({ memoryFlags: toggled(memory.memoryFlags, flag, e.target.checked) })} />
            {flag}
          </label>
        ))}
        <button type="button" className="debug-panel__button" onClick={onResetMemory}>
          Reset memory (clears the save)
        </button>
      </fieldset>
    </details>
  )
}

export default DebugPanel
