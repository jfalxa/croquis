import xor from 'lodash/xor'
import uniq from 'lodash/uniq'
import uniqBy from 'lodash/uniqBy'
import * as Tree from './tree'
import { bbox, joinBboxes } from './geometry'
import { transform } from '../shapes'


const getAncestors = (tree, elements) => uniq(elements.map(id => Tree.findAncestor(tree, { id }).id))
const getPaths = (tree, elements) => elements.map(id => Tree.findPath(tree, { id }))


export function selectElements(state, selection) {
  // basic case: user clicks on an element in the layer tree
  if (!selection.toggle && selection.subselection) {
    return selection.elements
  }

  // user clicks on one element on the stage
  else if (!selection.toggle && !selection.subselection) {
    return getAncestors(state.elements, selection.elements)
  }

  // user shift-clicks on layer tree
  else if (selection.toggle && selection.subselection) {
    return xor(state.selection, selection.elements)
  }

  // user shift-clicks on the stage
  else if (selection.toggle && !selection.subselection) {
    const currentPaths = getPaths(state.elements, state.selection)
    const newPaths = getPaths(state.elements, selection.elements)

    // only keep the paths that are exclusive to each selection array in order
    // to allow users to remove elements from selection by shift clicking them
    const remainingCurrentPaths = currentPaths.filter(currentPath => !newPaths.some(newPath => String(newPath).startsWith(currentPath)))
    const remainingNewPaths = newPaths.filter(newPath => !currentPaths.some(currentPath => String(newPath).startsWith(currentPath))).map(path => [path[0]])

    return uniqBy([...remainingCurrentPaths, ...remainingNewPaths], String)
      .map(path => Tree.at(state.elements, path).id)
  }
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

export function groupElements({ selection, elements }, groupID) {
  const removeSelection = tree => Tree.filter(tree, element => !selection.includes(element.id))

  const elementsWithoutGroup = removeSelection(elements)
  const children = selection.map(id => Tree.find(elements, { id }))
    .map(({ ...element, children }) => ({ ...element, children: removeSelection(children) }))

  const parent = Tree.findCommonAncestor(elements, children)

  const group = {
    id: groupID,
    type: 'Group',
    children
  }

  return parent
    ? Tree.update(elementsWithoutGroup, { id: parent.id, children: { $push: [group] } })
    : [...elementsWithoutGroup, group]
}

export function ungroupElements({ selection, elements }) {
  const group = Tree.find(elements, { id: selection[0] })
  const parent = Tree.findParent(elements, group)
  const elementsWithoutGroup = Tree.filter(elements, element => !selection.includes(element.id))

  return parent
    ? Tree.update(elementsWithoutGroup, { id: parent.id, children: { $push: group.children } })
    : [...elementsWithoutGroup, ...group.children]
}

export function getBbox(...elements) {
  const bboxes = Tree.flatten(elements)
    .filter(element => Boolean(element.shape))
    .map(element => bbox(element.shape))

  return joinBboxes(...bboxes)
}
