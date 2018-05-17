import get from 'lodash/get'
import set from 'lodash/set'
import uniq from 'lodash/uniq'
import last from 'lodash/last'
import findIndex from 'lodash/findIndex'
import flatMap from 'lodash/flatMap'
import immutableUpdate from 'immutability-helper'
import { splice } from './helpers'


function buildFullPath(path) {
  return '[' + path.join('].children[') + ']'
}

function buildPatch(path, command) {
  return (path && path.length > 0)
    ? set({}, buildFullPath(path), command)
    : {}
}

export function at(tree, path) {
  return get(tree, buildFullPath(path))
}

export function flatten(tree) {
  return uniq(flatMap(tree, node => [node, ...flatten(node.children)]))
}

export function map(tree=[], iteratee) {
  return tree.map(node => iteratee(node))
    .map(({ ...node, children }) => ({ ...node, children: map(children, iteratee) }))
}

export function filter(tree=[], predicate) {
  return tree.filter(node => predicate(node))
    .map(({ ...node, children }) => ({ ...node, children: filter(children, predicate) }))
}

export function findPath(tree=[], source) {
  let path

  tree.some((node, index) => {
    if (node.id === source.id) {
      path = [index]
      return true
    }

    const childPath = findPath(node.children, source)

    if (childPath) {
      path = [index, ...childPath]
      return true
    }
  })

  return path
}

export function find(tree, node) {
  const path = findPath(tree, node)

  return (path && path.length > 0)
    ? get(tree, buildFullPath(path))
    : undefined
}

export function findParent(tree, node) {
  const path = findPath(tree, node)
  return (path && path.length > 1)
    ? at(tree, path.slice(0, -1))
    : null
}

export function findSiblings(tree, node) {
  const parent = findParent(tree, node)
  return parent ? parent.children : tree
}

export function findAncestor(tree, node) {
  const path = findPath(tree, node)
  return tree[path[0]]
}

export function hasChild(tree, parent, child) {
  const childPath = findPath(tree, child)
  const parentPath = findPath(tree, parent)

  return String(childPath).startsWith(parentPath)
}

export function update(tree, { id, children, ...node }) {
  const command = node

  if (children) {
    command.children = Array.isArray(children)
      ? { $set: children }
      : children
  }

  const path = findPath(tree, { id })
  const patch = buildPatch(path, command)

  return immutableUpdate(tree, patch)
}

export function prependChild(tree, target, nodes) {
  return update(tree, { id: target.id, children: { $splice: [[0, 0, ...nodes]] } })
}

export function insert(tree, target, nodes, relativePosition='after') {
  const targetIndex = last(findPath(tree, target))
  const targetParent = findParent(tree, target)
  const indexDelta = (relativePosition === 'after') ? 1 : 0

  const spliceArgs = [targetIndex + indexDelta, 0, ...nodes]

  return targetParent
    ? update(tree, { id: targetParent.id, children: { $splice: [spliceArgs] } })
    : splice(tree, ...spliceArgs)
}
