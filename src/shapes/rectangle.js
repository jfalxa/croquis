import { h } from 'hyperapp'
import { Shapes } from 'kld-intersections'
import { transformPoints, updateShape } from '../utils/helpers'
import { bbox } from '../utils/geometry'


const Rectangle = ({ shape, style }) => {
  return (
    <rect
      {...bbox(shape.args)}
      {...style}
    />
  )
}

Rectangle.type = 'Rectangle'

Rectangle.create = ({ x, y, width, height, ...props }) => ({
  ...props,
  type: Rectangle.type,
  shape: Shapes.rectangle(x, y, width, height)
})

Rectangle.transform = (element, transformation) => {
  const [a, b] = transformPoints(element.shape.args, transformation)

  const min = a.min(b)
  const max = a.max(b)

  return updateShape(element, [min, max])
}


export default Rectangle
