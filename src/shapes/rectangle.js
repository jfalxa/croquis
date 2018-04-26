import { h } from 'hyperapp'
import { Shapes } from 'kld-intersections'
import { transformPoints } from './index'
import { bbox } from '../utils/geometry'


export const type = 'Rectangle'


export function create({ x, y, width, height, ...props }) {
  const shape = Shapes.rectangle(x, y, width, height)
  return { type, shape, ...props }
}


export function transform(points, transformation) {
  const [a, b] = transformPoints(points, transformation)

  const min = a.min(b)
  const max = a.max(b)

  return [min, max]
}


export function render({ shape, style }) {
  return (
    <rect
      {...bbox(shape)}
      {...style}
    />
  )
}
