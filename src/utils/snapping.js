import compact from 'lodash/compact'
import flatMap from 'lodash/flatMap'
import { bbox } from './elements'
import { point } from './geometry'


export function edges({ x, y, width, height }, center) {
  const segments = [
    [point(x, y), point(x + width, y)], // top
    [point(x + width, y), point(x + width, y + height)], // right
    [point(x, y + height), point(x + width, y + height)], // bottom
    [point(x, y), point(x, y + height)], // left
  ]

  return center
    ? [
      ...segments,
      [point(x, y + height/2), point(x + width, y + height/2)], // horizontal center
      [point(x + width/2, y), point(x + width/2, y + height)], // vertical center
    ]
    : segments
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

export function findCommon(a, b) {
  const aInB = a.filter(point => isPointInSegment(point, b))
  const bInA = b.filter(point => isPointInSegment(point, a))

  return (aInB.length === 1 && bInA.length === 1)
    ? [aInB[0], bInA[0]]
    : null
}

export function listChunks([a1, a2], [b1, b2]) {
  const segments = [[a1, b1], [a2, b2]]
  const common = findCommon(...segments)

  return common ? [common] : segments
}

export function sortByDistance(edge) {
  return (a, b) => {
    const distanceA = a[0].distanceFrom(edge[0])
    const distanceB = b[0].distanceFrom(edge[0])

    return distanceA - distanceB
  }
}

export function findAligned(siblings, elements, threshold, center) {
  const boxEdges = edges(bbox(...elements), center)
  const siblingEdges = flatMap(siblings, sibling => edges(bbox(sibling), true))

  // for each edge of the box, find all sibling edges that are ~aligned
  return boxEdges.map(boxEdge => ({
    edge: boxEdge,
    aligned: siblingEdges.filter(siblingEdge => isAligned(boxEdge, siblingEdge, threshold))
      .sort(sortByDistance(boxEdge))
  })).filter(found => found.aligned.length > 0)
}

export function getSnapVector(elements, rect, threshold, center) {
  const alignedEdges = findAligned(elements, [rect], threshold, center)

  const vectors = alignedEdges.map(({ edge, aligned }) => aligned[0][0].subtract(edge[0]))
    .map(({ x, y }) => ({
      x: Math.abs(x) <= threshold ? x : 0,
      y: Math.abs(y) <= threshold ? y : 0
    }))

  const snapVector = vectors.reduce((min, vector) => ({
      x: (vector.x !== 0) && Math.abs(vector.x) < Math.abs(min.x) ? vector.x : min.x,
      y: (vector.y !== 0) && Math.abs(vector.y) < Math.abs(min.y) ? vector.y : min.y
    }), { x: Infinity, y: Infinity })

  snapVector.x = snapVector.x === Infinity ? 0 : snapVector.x
  snapVector.y = snapVector.y === Infinity ? 0 : snapVector.y

  return snapVector
}
