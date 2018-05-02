import * as Tree from './tree'
import { bbox, joinBboxes } from './geometry'
import { transform } from '../shapes'


export function getSelectionElements({ selection, elements }) {
  return Tree.flatten(elements)
    .filter(element => selection.includes(element.id))
}

export function transformElements(elements, transformation) {
  return Tree.flatten(elements)
    .filter(element => element.shape)
    .map(element => transform(element, transformation))
}

export function getBbox(...elements) {
  const bboxes = Tree.flatten(elements)
    .filter(element => Boolean(element.shape))
    .map(element => bbox(element.shape))

  return joinBboxes(...bboxes)
}
