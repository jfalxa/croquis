import { Point2D } from 'kld-affine'
import { IntersectionArgs } from 'kld-intersections'
import * as Tree from './tree'
import * as shapes from '../shapes'


export function splice(arr, index, deleteCount=0, ...items) {
  return [
    ...arr.slice(0, index),
    ...items,
    ...arr.slice(index + deleteCount)
  ]
}

export function getSelectionElements({ tree, selection }) {
  return Tree.flatten(tree)
    .filter(element => selection.includes(element.id))
}

export function transformPoints(points, transformation) {
  return points.map(point => point.transform(transformation))
    .map(({ x, y }) => new Point2D(Math.round(x), Math.round(y)))
}

export function updateShape(element, args) {
  const shape = new IntersectionArgs(element.shape.name, args)
  return { ...element, shape }
}

export function shapeMethod(method) {
 return (element, ...args) => (
    shapes[element.type][method]
      ? shapes[element.type][method](element, ...args)
      : shapes.base[method](element, ...args)
  )
}


