import compact from 'lodash/compact'
import flatMap from 'lodash/flatMap'
import { bbox } from './elements'
import { point } from './geometry'


export function edges({ x, y, width, height }) {
  return [
    [point(x, y), point(x + width, y)], // top
    [point(x + width, y), point(x + width, y + height)], // right
    [point(x, y + height), point(x + width, y + height)], // bottom
    [point(x, y), point(x, y + height)], // left
    [point(x, y + height/2), point(x + width, y + height/2)], // horizontal center
    [point(x + width/2, y), point(x + width/2, y + height)], // vertical center
  ]
}

export function isAligned(a, b, threshold=0) {
  return (a[0].x === a[1].x && b[0].x === b[1].x && Math.abs(a[0].x - b[0].x) <= threshold)
    || (a[0].y === a[1].y && b[0].y === b[1].y && Math.abs(a[0].y - b[0].y) <= threshold)
}

export function isPointInSegment(point, [p1, p2]) {
  const pointP1 = point.distanceFrom(p1)
  const pointP2 = point.distanceFrom(p2)
  const p1P2 = p1.distanceFrom(p2)

  return Math.abs((pointP1 + pointP2) - p1P2) < 5
}

export function intersection(a, b) {
  const aInB = a.filter(point => isPointInSegment(point, b))
  const bInA = b.filter(point => isPointInSegment(point, a))

  return (aInB.length === 1 && bInA.length === 1)
    ? [aInB[0], bInA[0]]
    : null
}

export function listChunks([a1, a2], [b1, b2]) {
  const segments = [[a1, b1], [a2, b2]]
  const common = intersection(...segments)

  return common ? [common] : segments
}

export function findAligned(siblings, elements) {
  const boxEdges = edges(bbox(...elements))
  const siblingsEdges = siblings.map(sibling => edges(bbox(sibling)))

  return compact(
    flatMap(boxEdges,
      boxEdge => flatMap(siblingsEdges,
        edges => edges.map(
          siblingEdge => (
            isAligned(boxEdge, siblingEdge, 15)
              ? [boxEdge, siblingEdge]
              : null
          )
        )
      )
    )
  )
}
