import { h, app } from 'hyperapp'
import xor from 'lodash/xor'
import Root from './Root'
import Stage from './Stage'
import Topbar from './Topbar'
import Toolbar from './Toolbar'
import Layers from './Layers'
import Inspector from './Inspector'
import Tools from './tools'

import * as Tree from './utils/tree'
import { shapes } from './shapes'
import { transformElements } from './utils/helpers'


let id = 2

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
    ]}
  ]
}


const actions = {
  getState: () => state => state,

  selectTool: ({ tool }) => ({ selectedTool: tool, tools: {}, selection: [] }),

  createElement: (element) => ({ elements }) => ({ elements: [...elements, { ...element, id: id++ }] }),

  selectElements: ({ elements, toggle }) => ({ selection }) => ({
    selection: toggle ? xor(selection, elements) : elements
  }),

  updateElements: ({ elements }) => (state) => ({
    elements: elements.reduce(Tree.update, state.elements)
  }),

  transformElements: ({ elements, transformation }) => (state, actions) => (
    actions.updateElements({
      elements: transformElements(elements, transformation)
    })
  ),


  tools: {
    set: props => props
  }
}


const view = (state, actions) => (
  <Root>
    <Stage>
      <Tools />
    </Stage>

    <Topbar />

    <div style={{ flex: 1 }}>
      <Toolbar />
      <Layers />
      <Inspector />
    </div>
  </Root>
)


app(state, actions, view, document.body)
