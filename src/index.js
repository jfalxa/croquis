import { h, app } from 'hyperapp'
import * as Tree from './utils/tree'
import App from './components/App'
import { shapes } from './shapes'
import { selectElements, transformElements, groupElements, ungroupElements, removeElements, moveElements } from './utils/helpers'


let id = 9

const state = {

  tools: {
    selected: 'selection',
  },

  elements: {
    selection: [],

    tree: [
      { id: 2, type: 'Group', children: [
        { id: 3, type: 'Group', children: [
          shapes.Rectangle.create({ id: 0, x: 200, y: 300, width: 400, height: 100 }),
          shapes.Rectangle.create({ id: 1, x: 300, y: 100, width: 100, height: 150 }),
        ]}
      ]},
      { id: 4, type: 'Group', children: [
        { id: 5, type: 'Group', children: [
          shapes.Rectangle.create({ id: 6, x: 200, y: 300, width: 400, height: 100 }),
          shapes.Rectangle.create({ id: 7, x: 300, y: 100, width: 100, height: 150 }),
          shapes.Rectangle.create({ id: 8, x: 300, y: 100, width: 100, height: 150 }),
        ]}
      ]}
    ]
  }
}


const actions = {
  elements: {
    select: ({ elements, ...options }) => ({ tree, selection }) => ({
      selection: selectElements(tree, selection, elements, options)
    }),

    create: (element) => ({ tree }) => ({
      tree: [...tree, { ...element, id: id++ }],
    }),

    update: ({ elements }) => ({ tree }) => ({
      tree: elements.reduce(Tree.update, tree),
    }),

    group: () => ({ tree, selection }) => ({
      tree:  groupElements(tree, selection, id++),
    }),

    ungroup: () => ({ tree, selection }) => ({
      tree: ungroupElements(tree, selection[0])
    }),

    remove: ({ elements }) => ({ tree }) => ({
      tree: removeElements(tree, elements),
    }),

    move: ({ elements, target, relativePosition }) => ({ tree }) =>  ({
      tree: moveElements(tree, target, elements, relativePosition)
    }),

    transform: ({ elements, transformation }) => (state, actions) => (
      actions.update({
        elements: transformElements(elements, transformation)
      })
    ),
  },

  tools: {
    select: ({ tool }) => ({ selected: tool }),

    set: props => props
  }
}


app(state, actions, App, document.body)
