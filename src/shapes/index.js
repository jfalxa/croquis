import { h } from 'hyperapp'
import { Point2D } from 'kld-affine'
import { IntersectionArgs } from 'kld-intersections'
import * as Rectangle from './rectangle'


export const shapes = { Rectangle }


export function baseTransform(points, transformation) {
  return points.map(point => point.transform(transformation))
    .map(({ x, y }) => new Point2D(Math.round(x), Math.round(y)))
}

export function transform(element, transformation) {
  if (element.type === 'Group') {
    return element
  }

  const shapeTransform = shapes[element.type].transform

  const points = shapeTransform
    ? shapeTransform(element.shape.args, transformation)
    : baseTransform(element.shape.args, transformation)

  const shape = new IntersectionArgs(element.shape.name, points)

  return { ...element, shape }
}


export const Shape = ({ type, ...props }) => {
  switch (type) {
    case Rectangle.type:
      return <Rectangle.render {...props} />
    case 'Group':
      return (
        <g>
          {props.children.map(child => <Shape {...child} />)}
        </g>
      )
    default:
      return null
  }
}

