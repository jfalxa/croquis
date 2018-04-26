import { h } from 'hyperapp'
import { IntersectionArgs } from 'kld-intersections'
import * as Rectangle from './rectangle'


export const shapes = { Rectangle }


export function transform(element, transformation) {
  const transformed = element.shape.args.map(point => point.transform(transformation))
  const shape = new IntersectionArgs(element.shape.name, transformed)

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

