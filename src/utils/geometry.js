export const rectangle = ([x, y], [width, height]) => ({
  x: Math.min(x, x+width),
  y: Math.min(y, y+height),
  width: Math.abs(width),
  height: Math.abs(height)
})

export const bounds = (...elements) => {
  const bounds = elements.reduce((bounds, element) => ({
    x1: Math.min(bounds.x1, element.x),
    y1: Math.min(bounds.y1, element.y),
    x2: Math.max(bounds.x2, element.x + element.width),
    y2: Math.max(bounds.y2, element.y + element.height)
  }), {
    x1: Infinity,
    y1: Infinity,
    x2: -Infinity,
    y2: -Infinity
  })

  return {
    x: bounds.x1,
    y: bounds.y1,
    width: bounds.x2 - bounds.x1,
    height: bounds.y2 - bounds.y1
  }
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

