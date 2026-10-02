/** A linear horizontal path, with a vanishing point at its middle. */
export function articlePosition(index: number, count: number, progress: number, width: number) {
  const phase = ((index + 0.5) / count - progress % 1 + 1) % 1
  const offset = phase - 0.5
  return {
    x: offset * (width + 300),
    y: 0,
    z: -180 * (1 - Math.abs(offset) * 2),
    rotate: offset * -48,
    opacity: Math.min(1, phase * 14, (1 - phase) * 14),
  }
}
