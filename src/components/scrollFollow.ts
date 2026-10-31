/**
 * Keeps the newest line of a typing scene in view inside a scrolling panel.
 * `bottom` is where the newest paragraph ends, measured from the top of the panel's content.
 * Returns the new scroll position, or null when the paragraph is already in view. It only ever
 * scrolls down, so it never fights a reader who has scrolled back up.
 */
export function scrollTopToShow(bottom: number, scrollTop: number, viewHeight: number, margin: number): number | null {
  const visibleBottom = scrollTop + viewHeight
  if (bottom + margin <= visibleBottom) return null
  return bottom + margin - viewHeight
}

/** True while there is more to read below the visible part of a scrolling panel (a few pixels of slack for rounding). */
export function hasMoreBelow(scrollHeight: number, scrollTop: number, clientHeight: number): boolean {
  return scrollHeight - scrollTop - clientHeight > 4
}
