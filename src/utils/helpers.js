import { IntersectionArgs } from 'kld-intersections'
import * as Tree from './tree'
import * as shapes from '../shapes'
import { point } from './geometry'


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
    .map(({ x, y }) => point(Math.round(x), Math.round(y)))
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

export function updateZoom(zoom, modifier) {
  return Math.max(0.1, Math.min(zoom + modifier/300, 10))
}

export function getScaleFactor(anchor, initialPosition, position, axis) {
  return {
    x: (!axis || axis === 'x') ? (position.x - anchor.x) / (initialPosition.x - anchor.x) : 1,
    y: (!axis || axis === 'y') ? (position.y - anchor.y) / (initialPosition.y - anchor.y) : 1
  }
}
