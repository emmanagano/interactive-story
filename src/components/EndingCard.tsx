import type { Block, Scene } from '../engine'
import { endingHeader } from '../engine'
import ChipLine from './ChipLine'
import './EndingCard.css'

type Props = {
  scene: Scene
  finalChip: Block | null
}

/** The banner and last word of a run: "FLATLINE · ENDING 01 / 10 · DOC'S TABLE", then the chip's final line. */
function EndingCard({ scene, finalChip }: Props) {
  if (!scene.ending) return null
  const kind = scene.ending.kind

  return (
    <section className={`ending-card ending-card--${kind} notch`} aria-labelledby="ending-card-title">
      <h3 id="ending-card-title" className="ending-card__title">
        {endingHeader(scene.ending, scene.title)}
      </h3>
      {finalChip && <ChipLine text={finalChip.text} />}
    </section>
  )
}

export default EndingCard
