import { describe, expect, it } from 'vitest'
import { scrollTopToShow } from './scrollFollow'

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
