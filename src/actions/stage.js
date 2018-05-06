export function zoom(ratio) {
  return { zoom: ratio }
}

export function pan(vector) {
  return { pan: vector }
}

export function zoomAndPan(props) {
  return props
}
