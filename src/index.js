import { h, app } from 'hyperapp'
import Root from './Root'
import Stage from './Stage'
import Toolbar from './Toolbar'
import Layers from './Layers'
import Inspector from './Inspector'
import Tools from './tools'

import * as Tree from './utils/tree'
import { shapes } from './shapes'
import { selectElements, transformElements, groupElements, ungroupElements, removeElements, moveElements } from './utils/helpers'


let id = 9

const state = {
  selection: [],

  selectedTool: 'selection',

  tools: {},

  elements: [
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


const actions = {
  getState: () => state => state,

  selectTool: ({ tool }) => ({ selectedTool: tool, tools: {}, selection: [] }),

  createElement: (element) => ({ elements }) => ({ elements: [...elements, { ...element, id: id++ }] }),

  selectElements: (selection) => (state) => ({
    selection: selectElements(state, selection)
  }),

  updateElements: ({ elements }) => (state) => ({
    elements: elements.reduce(Tree.update, state.elements)
  }),

  transformElements: ({ elements, transformation }) => (state, actions) => (
    actions.updateElements({
      elements: transformElements(elements, transformation)
    })
  ),

  groupElements: () => (state) => ({
    elements: groupElements(state, id++)
  }),

  ungroupElements: () => (state) => ({
    elements: ungroupElements(state, id++)
  }),

  removeElements: ({ elements }) => (state) => ({
    elements: removeElements(state.elements, elements)
  }),

  moveElements: ({ elements, target, relativePosition }) => (state) => ({
    elements: moveElements(state.elements, target, elements, relativePosition)
  }),

  tools: {
    set: props => props
  }
}


const view = (state, actions) => (
  <Root>
    <Stage>
      <Tools />
    </Stage>

    <Toolbar />
    <Layers />
    <Inspector />
  </Root>
)


app(state, actions, view, document.body)
