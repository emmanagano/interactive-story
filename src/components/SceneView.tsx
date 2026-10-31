import { useEffect, useRef } from 'react'
import type { Block, Scene } from '../engine'
import ChipLine from './ChipLine'
import RichText from './RichText'
import './SceneView.css'

type Props = {
  scene: Scene
  blocks: Block[]
}

function SceneView({ scene, blocks }: Props) {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const shownSceneId = useRef<string | null>(null)

  // Move focus to the new scene's title so screen readers start reading it, but not on first load.
  useEffect(() => {
    if (shownSceneId.current !== null && shownSceneId.current !== scene.id) headingRef.current?.focus()
    shownSceneId.current = scene.id
  }, [scene.id])

  return (
    <article className="scene-view">
      <h2 className="scene-view__title" ref={headingRef} tabIndex={-1}>
        {scene.title}
      </h2>
      {blocks.map((block, index) => {
        if (block.type === 'chip') return <ChipLine key={index} text={block.text} />
        const className = block.type === 'system' ? 'scene-view__system' : 'scene-view__text'
        return (
          <p key={index} className={className}>
            <RichText text={block.text} />
          </p>
        )
      })}
    </article>
  )
}

export default SceneView
