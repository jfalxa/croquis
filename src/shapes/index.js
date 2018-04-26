import { h } from 'hyperapp'
import { IntersectionArgs } from 'kld-intersections'
import * as Rectangle from './rectangle'


export const shapes = { Rectangle }


export function transformPoints(points, transformation) {
  return points.map(point => point.transform(transformation))
}

export function transform(element, transformation) {
  const shapeTransform = shapes[element.type].transform

  const points = shapeTransform
    ? shapeTransform(element.shape.args, transformation)
    : transformPoints(element.shape.args, transformation)

  const shape = new IntersectionArgs(element.shape.name, points)

  return { ...element, shape }
}


export const Shape = ({ type, ...props }) => {
  switch (type) {
    case Rectangle.type:
      return <Rectangle.render {...props} />
    default:
      return null
  }
}

