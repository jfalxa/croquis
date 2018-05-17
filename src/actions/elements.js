import * as Tree from '../utils/tree'
import * as Elements from '../utils/elements'


export function create(element) {
  return ({ tree }) => {
    const newElement = Elements.create(element)

    return ({
      tree: [...tree, newElement],
      selection: [newElement.id]
    })
  }
}

export function select({ elements, ...options }) {
  return ({ tree, selection }) => ({
    selection: Elements.select(tree, selection, elements, options)
  })
}

export function update({ elements }) {
  return ({ tree }) => ({
    tree: elements.reduce(Tree.update, tree)
  })
}

export function group() {
  return ({ tree, selection }) => (
    Elements.group(tree, selection)
  )
}

export function ungroup() {
  return ({ tree, selection }) => (
    Elements.ungroup(tree, selection[0])
  )
}

export function remove({ elements }) {
  return ({ tree }) => ({
    tree: Elements.remove(tree, elements)
  })
}

export function move({ elements, target, relativePosition }) {
  return ({ tree }) =>  ({
    tree: Elements.move(tree, target, elements, relativePosition)
  })
}

export function transform({ elements, transformation }) {
  return (state, actions) => actions.update({
    elements: Elements.transform(elements, transformation)
      .map(({ id, ...element }) => ({ id, $merge: element }))
  })
}

export function duplicate({ elements }) {
  return ({ tree }) => Elements.duplicate(tree, elements)
}

export function text({ element, text }) {
  return (state, actions) => actions.update({
    elements: [{ id: element.id, text: { $set: text }}]
  })
}

export function style({ element, style }) {
  return (state, actions) => actions.update({
    elements: [{ id: element.id, style: { $merge: style } }]
  })
}

