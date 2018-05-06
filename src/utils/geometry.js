import { Point2D } from 'kld-affine'
import { Intersection, IntersectionQuery } from 'kld-intersections'


// PATCH FOR TYPO IN IMPORTED LIB
IntersectionQuery.pointInRectangle = function(point, topLeft, bottomRight) {
    return (
        topLeft.x <= point.x && point.x < bottomRight.x &&
        topLeft.y <= point.y && point.y < bottomRight.y
    );
}

// EXTRA METHOD FOR IMPORTED LIB
IntersectionQuery.pointInLine = function(point, topLeft, bottomRight) {
  const lineDistance = bottomRight.distanceFrom(topLeft)
  const pointTopLeftDistance = topLeft.distanceFrom(point)
  const pointBottomRightDistance = bottomRight.distanceFrom(point)

  return (pointTopLeftDistance + pointBottomRightDistance) - lineDistance < 3
}


export function bbox(points) {
  const xs = points.map(({ x }) => x)
  const ys = points.map(({ y }) => y)

  const x = Math.min(...xs)
  const y = Math.min(...ys)
  const width = Math.max(...xs) - x
  const height = Math.max(...ys) - y

  return { x, y, width, height }
}

export function joinBboxes(...bboxes) {
  if (bboxes.length === 0) {
    return { x: 0, y: 0, width: 0, height: 0 }
  }

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

export function pointIn(point, shape) {
  return IntersectionQuery['pointIn' + shape.name](point, ...shape.args)
}

export function isInside(container, element) {
  return element.x > container.x
    && element.x + element.width < container.x + container.width
    && element.y > container.y
    && element.y + element.height < container.y + container.height
}

export function isIntersecting(a, b) {
  return Intersection.intersect(a, b).points.length > 0
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

export function project(box, zoom, pan) {
  const x = box.x / zoom + pan.x
  const y = box.y / zoom + pan.y
  const width = box.width / zoom
  const height = box.height / zoom

  return (box instanceof Point2D)
    ? new Point2D(x, y)
    : { x, y, width, height }
}

export function unproject(box, zoom, pan) {
  const x = (box.x - pan.x) * zoom
  const y = (box.y - pan.y) * zoom
  const width = box.width * zoom
  const height = box.height * zoom

  return (box instanceof Point2D)
    ? new Point2D(x, y)
    : { x, y, width, height }
}
