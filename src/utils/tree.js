import get from 'lodash/get'
import set from 'lodash/set'
import uniq from 'lodash/uniq'
import isMatch from 'lodash/isMatch'
import findIndex from 'lodash/findIndex'
import flatMap from 'lodash/flatMap'
import immutableUpdate from 'immutability-helper'


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

export function filter(tree=[], predicate) {
  return tree.filter(node => predicate(node))
    .map(({ ...node, children }) => ({ ...node, children: filter(children, predicate) }))
}

export function find(tree, node) {
  const path = findPath(tree, node)

  return (path && path.length > 0)
    ? get(tree, buildFullPath(path))
    : undefined
}

export function findPath(tree=[], source) {
  let path

  tree.some((node, index) => {
    if (isMatch(node, source)) {
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

export function findParent(tree, node) {
  const path = findPath(tree, node)
  return (path.length > 1)
    ? at(tree, path.slice(0, -1))
    : null
}

export function findAncestor(tree, node) {
  const path = findPath(tree, node)
  return tree[path[0]]
}

export function findCommonAncestor(tree, nodes) {
  const parentPaths = nodes.map(node => findPath(tree, { id: node.id }))
    .map(path => path.slice(0, -1))

  // find common path chunk
  // => for each level of depth, push if it's the same index
  const commonAncestorPath = parentPaths.reduce((ancestorPath, path) => {
    const newAncestorPath = []

    ancestorPath.some((index, i) => {
      if (path[i] !== index) {
        return true
      }

      newAncestorPath.push(index)
    })

    return newAncestorPath
  })

  return (commonAncestorPath.length > 0)
    ? at(tree, commonAncestorPath)
    : null
}

export function update(tree, { children, ...node}) {
  const command = { $merge: node }

  if (children) {
    command.children = Array.isArray(children)
      ? { $set: children }
      : children
  }

  const path = findPath(tree, { id: node.id })
  const patch = buildPatch(path, command)

  return immutableUpdate(tree, patch)
}

