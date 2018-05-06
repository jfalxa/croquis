
import { h } from 'hyperapp'
import { Shapes } from 'kld-intersections'
import { bbox } from '../utils/geometry'


const Line = ({ shape: { args: [a, b] }, style }) => {
  return (
    <line
      x1={a.x} y1={a.y}
      x2={b.x} y2={b.y}
      stroke="black"
      {...style}
    />
  )
}

Line.type = 'Line'

Line.create = ({ a, b, ...props }) => ({
  ...props,
  type: Line.type,
  shape: Shapes.line(a.x, a.y, b.x, b.y)
})


export default Line
