import { describe, expect, it } from 'vitest'
import { hasMoreBelow, scrollTopToShow } from './scrollFollow'

describe('scrollTopToShow', () => {
  it('does nothing while the newest line is already in view', () => {
    expect(scrollTopToShow(300, 0, 500, 24)).toBeNull()
    expect(scrollTopToShow(476, 0, 500, 24)).toBeNull() // fits exactly, margin included
  })

  it('scrolls just far enough to bring the newest line into view, with a margin', () => {
    expect(scrollTopToShow(600, 0, 500, 24)).toBe(124)
    expect(scrollTopToShow(1000, 400, 500, 24)).toBe(524)
  })

  it('never scrolls back up, so it does not fight a reader who has scrolled up', () => {
    const newScroll = scrollTopToShow(200, 800, 500, 24)
    expect(newScroll).toBeNull()
  })
})

describe('hasMoreBelow', () => {
  it('is true while text remains below the visible part', () => {
    expect(hasMoreBelow(1200, 0, 450)).toBe(true)
    expect(hasMoreBelow(1200, 700, 450)).toBe(true)
  })

  it('is false once scrolled to the end, allowing a few pixels of rounding', () => {
    expect(hasMoreBelow(1200, 750, 450)).toBe(false)
    expect(hasMoreBelow(1200, 747, 450)).toBe(false)
  })

  it('is false when the text fits and there is nothing to scroll', () => {
    expect(hasMoreBelow(300, 0, 450)).toBe(false)
    expect(hasMoreBelow(450, 0, 450)).toBe(false)
  })
})
