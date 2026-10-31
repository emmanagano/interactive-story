import './EcgLine.css'

// One heartbeat as x, y points: flat, a small bump, the spike, the dip, flat again.
const BEAT: [number, number][] = [
  [0, 50], [22, 50], [30, 44], [38, 50], [52, 50], [60, 8], [72, 92], [82, 50], [96, 50], [106, 40], [116, 50],
]

/** A flat line across the view with one heartbeat in it, starting `startX` along. */
function trace(startX: number): string {
  const points: [number, number][] = [[0, 50], ...BEAT.map(([x, y]): [number, number] => [x + startX, y]), [600, 50]]
  return points.map(([x, y], index) => `${index === 0 ? 'M' : 'L'}${x} ${y}`).join(' ')
}

/**
 * Two heartbeats, one a little behind the other: Kade's in green and the chip's in amber. They
 * are drawn as a trace that sweeps across; with calm mode or reduced motion they sit still.
 */
function EcgLine() {
  return (
    <svg className="ecg-line" viewBox="0 0 600 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path className="ecg-line__path ecg-line__path--chip" d={trace(250)} pathLength={1} />
      <path className="ecg-line__path ecg-line__path--kade" d={trace(190)} pathLength={1} />
    </svg>
  )
}

export default EcgLine
