import { Intersection, IntersectionQuery } from 'kld-intersections'


export function isPointIn(point, shape) {
  return IntersectionQuery['pointIn' + shape.name](point, ...shape.args)
}

export function isInside(a, b) {
  const container = bbox(a)
  const element = bbox(b)

  return element.x >= container.x && element.width <= container.width
    && element.y >= container.y && element.height <= container.height
}

export function isIntersecting(a, b) {
  return Intersection.intersect(a, b).points.length > 0
    || isInside(a, b)
}

export function bbox(shape) {
  const xs = shape.args.map(({ x }) => x)
  const ys = shape.args.map(({ y }) => y)

  const x = Math.min(...xs)
  const y = Math.min(...ys)
  const width = Math.max(...xs) - x
  const height = Math.max(...ys) - y

  return { x, y, width, height }
}

export function joinBboxes(...bboxes) {
  const x1s = bboxes.map(bounds => bounds.x)
  const y1s = bboxes.map(bounds => bounds.y)
  const x2s = bboxes.map(bounds => bounds.x + bounds.width)
  const y2s = bboxes.map(bounds => bounds.y + bounds.height)

  const x = Math.min(...x1s)
  const y = Math.min(...y1s)
  const width = Math.max(...x2s) - x
  const height = Math.max(...y2s) - y

  return { x, y, width, height }
}

export function center(box) {
  const x = box.x + box.width/2
  const y = box.y + box.height/2

  return { x, y }
}

export function reflection(point, center) {
  const x = 2*center.x - point.x
  const y = 2*center.y - point.y

  return { x, y }
}

