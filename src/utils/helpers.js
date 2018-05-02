import xorWith from 'lodash/xorWith'
import uniq from 'lodash/uniq'
import startsWith from 'lodash/startsWith'
import * as Tree from './tree'
import { bbox, joinBboxes } from './geometry'
import { transform } from '../shapes'


const comparePaths = (a, b) => (startsWith(a, b) || startsWith(b, a))


// this solution is not great, it behaves weirdly when combining subselection and toggle
export function selectElements(state, selection) {
  const newSelection = !selection.subselection
    ? uniq(selection.elements.map(id => Tree.findAncestor(state.elements, { id }).id))
    : selection.elements

  if (selection.toggle) {
    const selectionPaths = state.selection.map(id => Tree.findPath(state.elements, { id }))
    const newSelectionPaths = newSelection.map(id => Tree.findPath(state.elements, { id }))

    return xorWith(selectionPaths, newSelectionPaths, comparePaths)
      .map(path => Tree.at(state.elements, path))
      .map(element => element.id)
  }

  return newSelection
}

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
