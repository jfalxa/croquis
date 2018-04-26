import { h, app } from 'hyperapp'
import xor from 'lodash/xor'
import Root from './Root'
import Stage from './Stage'
import SelectionTool from './SelectionTool'
import RectangleTool from './RectangleTool'
import Topbar from './Topbar'
import Toolbar from './Toolbar'
import Layers from './Layers'
import Inspector from './Inspector'

import * as Rectangle from './shapes/rectangle'

let id = 2

const state = {
  selection: [],

  tools: {},

  elements: [
    Rectangle.create({ id: 0, x: 200, y: 300, width: 400, height: 100 }),
    Rectangle.create({ id: 1, x: 300, y: 100, width: 100, height: 150 }),
  ]
}

const actions = {
  getState: () => state => state,

  createElement: (element) => ({ elements }) => ({ elements: [...elements, { ...element, id: id++ }] }),

  selectElements: ({ elements, add }) => ({ selection }) => ({
    selection: add ? xor(selection, elements) : elements
  }),

  transformElements: ({ ids, transform }) => (state) => (state),

  tools: {
    set: props => props
  }
}


const view = (state, actions) => (
  <Root>
    <Stage>
      <SelectionTool />
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
