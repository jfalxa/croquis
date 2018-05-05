import xor from 'lodash/xor'
import uniq from 'lodash/uniq'
import uniqBy from 'lodash/uniqBy'
import * as Tree from './tree'
import { bbox, joinBboxes } from './geometry'
import { transform } from '../shapes'


const getAncestors = (tree, elements) => uniq(elements.map(id => Tree.findAncestor(tree, { id }).id))
const getPaths = (tree, elements) => elements.map(id => Tree.findPath(tree, { id }))


export function selectElements(elements, oldSelection, selection, options) {
  // basic case: user clicks on an element in the layer tree
  if (!options.toggle && options.subselection) {
    return selection
  }

  // user clicks on one element on the stage
  else if (!options.toggle && !options.subselection) {
    return getAncestors(elements, selection)
  }

  // user shift-clicks on layer tree
  else if (options.toggle && options.subselection) {
    return xor(oldSelection, selection)
  }

  // user shift-clicks on the stage
  else if (options.toggle && !options.subselection) {
    const oldPaths = getPaths(elements, oldSelection)
    const newPaths = getPaths(elements, selection)

    // only keep the paths that are exclusive to each selection array in order
    // to allow users to remove elements from selection by shift clicking them
    const remainingOldPaths = oldPaths.filter(oldPath => !newPaths.some(newPath => String(newPath).startsWith(oldPath)))
    const remainingNewPaths = newPaths.filter(newPath => !oldPaths.some(oldPath => String(newPath).startsWith(oldPath))).map(path => [path[0]])

    return uniqBy([...remainingOldPaths, ...remainingNewPaths], String)
      .map(path => Tree.at(elements, path).id)
  }
}

export function getSelectionElements({ tree, selection }) {
  return Tree.flatten(tree)
    .filter(element => selection.includes(element.id))
}

export function transformElements(elements, transformation) {
  return Tree.flatten(elements)
    .filter(element => element.shape)
    .map(element => transform(element, transformation))
}

export function groupElements( elements, selection, groupID) {
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

export function ungroupElements(elements, selection) {
  const group = Tree.find(elements, { id: selection })
  const parent = Tree.findParent(elements, group)
  const elementsWithoutGroup = Tree.filter(elements, element => (element.id !== selection))

  return parent
    ? Tree.update(elementsWithoutGroup, { id: parent.id, children: { $push: group.children } })
    : [...elementsWithoutGroup, ...group.children]
}

export function removeElements(elements, removed) {
  return Tree.filter(elements, element => !removed.includes(element.id))
}

export function moveElements(elements, targetElement, movedElements, relativePosition) {
  const moved = movedElements.map(id => Tree.find(elements, { id }) || { id })
  const target = Tree.find(elements, { id: targetElement })

  return Tree.insert(elements, target, moved, relativePosition)
}

export function getBbox(...elements) {
  const bboxes = Tree.flatten(elements)
    .filter(element => Boolean(element.shape))
    .map(element => bbox(element.shape))

  return joinBboxes(...bboxes)
}
