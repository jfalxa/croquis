import { h, app } from 'hyperapp'
import xor from 'lodash/xor'
import Root from './Root'
import Stage from './Stage'
import Topbar from './Topbar'
import Toolbar from './Toolbar'
import Layers from './Layers'
import Inspector from './Inspector'
import Tools from './tools'

import { shapes, transform } from './shapes'


let id = 2

const state = {
  selection: [],

  selectedTool: 'selection',

  tools: {},

  elements: [
    shapes.Rectangle.create({ id: 0, x: 200, y: 300, width: 400, height: 100 }),
    shapes.Rectangle.create({ id: 1, x: 300, y: 100, width: 100, height: 150 }),
  ]
}


const actions = {
  getState: () => state => state,

  selectTool: ({ tool }) => ({ selectedTool: tool, tools: {}, selection: [] }),

  createElement: (element) => ({ elements }) => ({ elements: [...elements, { ...element, id: id++ }] }),

  selectElements: ({ elements, add }) => ({ selection }) => ({
    selection: add ? xor(selection, elements) : elements
  }),

  updateElements: ({ elements }) => (state) => ({
    elements: state.elements.map(element => {
      const update = elements.find(({ id }) => (id === element.id))

      return update
        ? { ...element, ...update }
        : element
    })
  }),

  transformElements: ({ elements, transformation }) => (state, actions) => (
    actions.updateElements({
      elements: elements.map(element => transform(element, transformation))
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
