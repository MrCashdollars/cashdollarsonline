import { describe, expect, it } from 'vitest'
import { articlePosition } from './article-gallery'

describe('article gallery motion', () => {
  it('moves from right to left on a horizontal line', () => {
    const first = articlePosition(1, 3, 0, 800)
    const later = articlePosition(1, 3, 0.03, 800)
    expect(later.x).toBeLessThan(first.x)
    expect(first.y).toBe(0)
    expect(later.y).toBe(0)
  })
  it('recedes toward the background at the middle of the strip', () => {
    expect(articlePosition(1, 3, 0, 800).z).toBeLessThan(0)
    expect(articlePosition(1, 3, 0.49, 800).z).toBeGreaterThan(-15)
  })
  it('loops seamlessly and keeps cards evenly distributed', () => {
    expect(articlePosition(1, 3, 1.25, 800)).toEqual(articlePosition(1, 3, 0.25, 800))
    const positions = [0, 1, 2].map(i => articlePosition(i, 3, 0, 800).x)
    expect(positions[1]! - positions[0]!).toBeCloseTo(positions[2]! - positions[1]!)
  })
})
