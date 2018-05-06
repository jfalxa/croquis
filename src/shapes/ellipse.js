import { h } from 'hyperapp'
import { Shapes } from 'kld-intersections'
import { transformPoints, updateShape } from '../utils/helpers'
import { bbox } from '../utils/geometry'


const Ellipse = ({ shape: { args: [center, rx, ry] }, style }) => {
  return (
    <ellipse
      cx={center.x}
      cy={center.y}
      rx={rx}
      ry={ry}
      stroke="black"
      fill="lightgrey"
      {...style}
    />
  )
}

Ellipse.type = 'Ellipse'

Ellipse.create = ({ x, y, width, height, ...props }) => ({
  ...props,
  type: Ellipse.type,
  shape: Shapes.ellipse(x + width/2, y + height/2, width/2, height/2)
})

Ellipse.transform = (element, transformation) => {
  const [oldCenter, oldRx, oldRy] = element.shape.args
  const radius = { x: oldRx, y: oldRy }

  const [center] = transformPoints([oldCenter], transformation)
  const rx = Math.round(oldRx * Math.abs(transformation.a))
  const ry = Math.round(oldRy * Math.abs(transformation.d))

  return updateShape(element, [center, rx, ry])
}

Ellipse.bbox = (element) => {
  const [center, rx, ry] = element.shape.args

  const radius = { x: rx, y: ry }
  const topLeft = center.subtract(radius)
  const bottomRight = center.add(radius)

  return bbox([topLeft, bottomRight])
}


export default Ellipse
