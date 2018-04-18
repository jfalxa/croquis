export const rectangle = ([x, y], [width, height]) => ({
  x: Math.min(x, x+width),
  y: Math.min(y, y+height),
  width: Math.abs(width),
  height: Math.abs(height)
})


export const pathBounds = (points) => {
  const xs = points.map(p => p[0])
  const ys = points.map(p => p[1])

  const x = Math.min(...xs)
  const y = Math.min(...ys)
  const width = Math.max(...xs) - x
  const height = Math.max(...ys) - y

  return { x, y, width, height }
}

export const normalizeBounds = (element) => {
  return (element.path)
    ? pathBounds(element.path)
    : element
}

export const bounds = (...elements) => {
  const elementBounds = elements.map(normalizeBounds)

  const x1s = elementBounds.map(bounds => bounds.x)
  const y1s = elementBounds.map(bounds => bounds.y)
  const x2s = elementBounds.map(bounds => bounds.x + bounds.width)
  const y2s = elementBounds.map(bounds => bounds.y + bounds.height)

  const x = Math.min(...x1s)
  const y = Math.min(...y1s)
  const width = Math.max(...x2s) - x
  const height = Math.max(...y2s) - y

  return { x, y, width, height }
}


export const contains = ([x, y], r) => (
  (r.x <= x && x <= r.x + r.width)
  && (r.y <= y && y <= r.y + r.height)
)

export const overlaps = (a, b) => (
  (a.x < b.x + b.width) && (a.x + a.width > b.x)
  && (a.y < b.y + b.height) && (a.y + a.height > b.y)
)

export const translate = (element, translation) => ({
  ...element,
  x: element.x + translation[0],
  y: element.y + translation[1]
})

export const scale = (element, scaling, center) => ({
  ...element,
  x: scaling[0] * ( element.x - center.x ) + center.x,
  y: scaling[1] * ( element.y - center.y ) + center.y,
  width: element.width * scaling[0],
  height: element.height * scaling[1]
})

export const center = (r) => ({
  x: r.x + r.width/2,
  y: r.y + r.height/2
})

