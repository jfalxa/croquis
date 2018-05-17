import xor from 'lodash/xor'
import uniq from 'lodash/uniq'
import uniqBy from 'lodash/uniqBy'
import * as Tree from './tree'
import { pointIn, isInside, isIntersecting, joinBboxes } from './geometry'
import { shapeMethod } from '../utils/helpers'


let id = 10

const getAncestors = (tree, elements) => uniq(elements.map(id => Tree.findAncestor(tree, { id }).id))
const getPaths = (tree, elements) => elements.map(id => Tree.findPath(tree, { id }))

const shapeBbox = shapeMethod('bbox')
const shapeTransform = shapeMethod('transform')


export function create(element) {
  return { style: {}, ...element, id: id++ }
}

export function select(elements, oldSelection, selection, options) {

  const newSelection = !options.subselection
    ? getAncestors(elements, selection)
    : selection

  if (options.toggle) {
    const selectionParent = Tree.findParent(elements, { id: newSelection[0] })
    const selectedSiblings = oldSelection.filter(id => Tree.findParent(elements, { id }) === selectionParent)

    return xor(selectedSiblings, newSelection)
  }
  else {
    return newSelection
  }
}

export function group(elements, selectionGroup) {
  const removeSelection = tree => Tree.filter(tree, element => !selectionGroup.includes(element.id))

  const elementsWithoutGroup = removeSelection(elements)

  const children = Tree.flatten(elements)
    .filter(element => selectionGroup.includes(element.id))
    .map(({ ...element, children }) => ({ ...element, children: removeSelection(children) }))

  const group = create({ type: 'Group', children })
  const parent = Tree.findParent(elements, children[0])

  const tree = parent
    ? Tree.update(elementsWithoutGroup, { id: parent.id, children: { $push: [group] } })
    : [...elementsWithoutGroup, group]

  const selection = [group.id]

  return { tree, selection }
}

export function ungroup(elements, groupID) {
  const group = Tree.find(elements, { id: groupID })
  const parent = Tree.findParent(elements, group)
  const elementsWithoutGroup = Tree.filter(elements, element => (element.id !== groupID))

  const tree = parent
    ? Tree.update(elementsWithoutGroup, { id: parent.id, children: { $push: group.children } })
    : [...elementsWithoutGroup, ...group.children]

  const selection = Tree.find(elements, { id: groupID }).children.map(({ id }) => id)

  return { tree, selection }
}

export function remove(elements, removed) {
  return Tree.filter(elements, element => !removed.includes(element.id))
}

export function move(elements, targetID, movedIDs, relativePosition) {
  const moved = movedIDs.map(id => Tree.find(elements, { id }) || { id })
  const target = Tree.find(elements, { id: targetID })

  return Tree.insert(elements, target, moved, relativePosition)
}

export function transform(elements, transformation) {
  return Tree.flatten(elements)
    .filter(element => Boolean(element.shape))
    .map(element => shapeTransform(element, transformation))
}

export function duplicate(elements) {
  return Tree.map(elements, element => create(element))
}

export function bbox(...elements) {
  const bboxes = Tree.flatten(elements)
    .filter(element => Boolean(element.shape))
    .map(element => shapeBbox(element))

  return joinBboxes(...bboxes)
}

export function isPointIn(point, element) {
  return pointIn(point, element.shape)
}

export function isInArea(area, element) {
  const areaBbox = bbox(area)
  const elementBbox = bbox(element)

  return isInside(areaBbox, elementBbox) || isIntersecting(area.shape, element.shape)
}
