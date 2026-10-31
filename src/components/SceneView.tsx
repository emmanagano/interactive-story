import { useEffect, useRef } from 'react'
import type { Block, Scene } from '../engine'
import type { Reveal } from '../hooks'
import ChipLine from './ChipLine'
import { plainText } from './parseEmphasis'
import { revealedCount } from './reveal'
import RichText from './RichText'
import './SceneView.css'

type Props = {
  scene: Scene
  blocks: Block[]
  reveal: Reveal
  sceneKey: string // changes with each new scene, so the entrance plays again
}

const TICKS_PER_SECOND = 25

function SceneView({ scene, blocks, reveal, sceneKey }: Props) {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const shownSceneId = useRef<string | null>(null)

  // Move focus to the new scene's title so screen readers start reading it, but not on first load.
  useEffect(() => {
    if (shownSceneId.current !== null && shownSceneId.current !== scene.id) headingRef.current?.focus()
    shownSceneId.current = scene.id
  }, [scene.id])

  const tick = Math.floor(reveal.elapsed * TICKS_PER_SECOND)

  return (
    // Clicking anywhere on the story shows all of the text at once.
    <article
      className="scene-view"
      onClick={(event) => {
        if (reveal.revealing && !(event.target as HTMLElement).closest('button')) reveal.skip()
      }}
    >
      <div key={sceneKey} className="scene-view__page">
        <h2 className="scene-view__title" ref={headingRef} tabIndex={-1}>
          {scene.title}
        </h2>
        {reveal.revealing && (
          <button type="button" className="scene-view__skip" onClick={reveal.skip}>
            Show all text
          </button>
        )}
        {blocks.map((block, index) => {
          const resolved = revealedCount(reveal.plan.steps[index], reveal.elapsed)
          if (block.type === 'chip') {
            return <ChipLine key={index} text={block.text} resolving={reveal.revealing ? { resolved, tick } : undefined} />
          }
          const className =
            block.type === 'system'
              ? block.text.startsWith('**`')
                ? 'scene-view__system scene-view__system--terminal'
                : 'scene-view__system'
              : 'scene-view__text'
          if (!reveal.revealing) {
            return (
              <p key={index} className={className}>
                <RichText text={block.text} />
              </p>
            )
          }
          // Typing: screen readers get the whole paragraph at once, the typed copy is for the eyes.
          return (
            <p key={index} className={className}>
              <span className="visually-hidden">{plainText(block.text)}</span>
              <span aria-hidden="true">
                <RichText text={block.text} revealed={resolved} />
              </span>
            </p>
          )
        })}
      </div>
    </article>
  )
}

export default SceneView
