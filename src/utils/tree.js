import immutableUpdate from 'immutability-helper'
import get from 'lodash/get'
import set from 'lodash/set'
import isMatch from 'lodash/isMatch'
import findIndex from 'lodash/findIndex'
import flatMap from 'lodash/flatMap'


export function flatten(tree) {
  return flatMap(tree, node => [node, ...flatten(node.children)])
}

export function find(tree, node) {
  const path = findPath(node)

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


function buildFullPath(path) {
  return '[' + path.join('].children[') + ']'
}

function buildPatch(path, command) {
  return (path && path.length > 0)
    ? set({}, buildFullPath(path), command)
    : {}
}

export function update(tree, node) {
  const path = findPath(tree, { id: node.id })
  const patch = buildPatch(path, { $merge: node })

  return immutableUpdate(tree, patch)
}

