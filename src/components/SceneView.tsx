import { useCallback, useEffect, useId, useRef, useState } from 'react'
import type { Block, Scene } from '../engine'
import type { Reveal } from '../hooks'
import ChipLine from './ChipLine'
import { plainText } from './parseEmphasis'
import { revealedCount } from './reveal'
import RichText from './RichText'
import { hasMoreBelow, scrollTopToShow } from './scrollFollow'
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
  const panelRef = useRef<HTMLElement>(null)
  const following = useRef(true) // keep the newest typed line in view, until the reader scrolls themselves
  const shownSceneId = useRef<string | null>(null)
  const headingId = useId()
  const [moreBelow, setMoreBelow] = useState(false)

  const updateMoreBelow = useCallback(() => {
    const panel = panelRef.current
    if (panel) setMoreBelow(hasMoreBelow(panel.scrollHeight, panel.scrollTop, panel.clientHeight))
  }, [])

  // The panel can change size (a window resize) as well as scroll, and either changes whether there is more to read.
  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return
    const observer = new ResizeObserver(updateMoreBelow)
    observer.observe(panel)
    return () => observer.disconnect()
  }, [updateMoreBelow])

  // A new scene starts at the top and follows the typing again.
  useEffect(() => {
    following.current = true
    panelRef.current?.scrollTo({ top: 0 })
    updateMoreBelow()
  }, [sceneKey, updateMoreBelow])

  // While text types out, the panel scrolls so the newest line stays in view.
  useEffect(() => {
    const panel = panelRef.current
    if (!panel || !reveal.revealing || !following.current) return
    const newest = reveal.plan.steps.filter((step) => revealedCount(step, reveal.elapsed) > 0).length - 1
    const paragraph = panel.querySelectorAll<HTMLElement>('.scene-view__page > p')[newest]
    if (!paragraph) return
    const bottom = paragraph.getBoundingClientRect().bottom - panel.getBoundingClientRect().top + panel.scrollTop
    const next = scrollTopToShow(bottom, panel.scrollTop, panel.clientHeight, 24)
    if (next !== null) panel.scrollTop = next
  }, [reveal])

  const stopFollowing = () => {
    following.current = false
  }

  // Move focus to the new scene's title so screen readers start reading it, but not on first load.
  useEffect(() => {
    if (shownSceneId.current !== null && shownSceneId.current !== scene.id) headingRef.current?.focus()
    shownSceneId.current = scene.id
  }, [scene.id])

  const tick = Math.floor(reveal.elapsed * TICKS_PER_SECOND)

  return (
    // Clicking anywhere on the story shows all of the text at once. The panel scrolls on its own, so it
    // takes focus too: that is how a keyboard user scrolls it with the arrow keys.
    <article
      className="scene-view notch"
      ref={panelRef}
      tabIndex={0}
      aria-labelledby={headingId}
      onScroll={updateMoreBelow}
      onWheel={stopFollowing}
      onTouchMove={stopFollowing}
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) stopFollowing() // the scrollbar itself
      }}
      onKeyDown={(event) => {
        if (['ArrowUp', 'PageUp', 'Home'].includes(event.key)) stopFollowing()
      }}
      onClick={(event) => {
        if (reveal.revealing && !(event.target as HTMLElement).closest('button')) reveal.skip()
      }}
    >
      <div key={sceneKey} className="scene-view__page">
        <h2 id={headingId} className="scene-view__title" ref={headingRef} tabIndex={-1}>
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
            return <ChipLine key={index} text={block.text} resolving={reveal.revealing ? { resolved, tick, waiting: reveal.elapsed < reveal.plan.steps[index].start } : undefined} />
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
      {/* A quiet fade at the bottom while there is more to read. Screen readers already get all the text, so it is only for the eyes. */}
      <div className={moreBelow ? 'scene-view__more scene-view__more--visible' : 'scene-view__more'} aria-hidden="true" />
    </article>
  )
}

export default SceneView
