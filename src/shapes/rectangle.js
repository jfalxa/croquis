import { h } from 'hyperapp'
import { Shapes } from 'kld-intersections'


export const type = 'Rectangle'


export function create({ x, y, width, height, ...props }) {
  const shape = Shapes.rectangle(x, y, width, height)
  return { type, shape, ...props }
}


export function render({ shape, style }) {
  const { x:x1, y:y1 } = shape.args[0]
  const { x:x2, y:y2 } = shape.args[1]

  return (
    <rect
      x={x1}
      y={y1}
      width={x2 - x1}
      height={y2 - y1}
      {...style}
    />
  )
}
