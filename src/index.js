import { h, app } from 'hyperapp'
import xor from 'lodash/xor'
import Root from './Root'
import Stage from './Stage'
import SelectionTool from './SelectionTool'
import Topbar from './Topbar'
import Toolbar from './Toolbar'
import Layers from './Layers'
import Inspector from './Inspector'


const state = {
  selection: [],

  tools: {},

  elements: [
    { id: 0, type: 'rect', x: 300, y: 200, width: 300, height: 150, fill: 'red' },
    { id: 1, type: 'rect', x: 400, y: 300, width: 300, height: 100, fill: 'green' }
  ]
}

const actions = {
  selectElements: ({ elements, add }) => ({ selection }) => ({
    selection: add ? xor(selection, elements) : elements
  }),

  transformElements: ({ ids, transform }) => (state) => ({
    elements: state.elements.reduce((elements, element) => ([
      ...elements,
      ids.includes(element.id)
        ? transform(element)
        : element
    ]), [])
  }),

  tools: {
    set: prop => prop
  }
}


const view = (state, actions) => (
  <Root>
    <Stage />
    <SelectionTool />

    <Topbar />

    <div style={{ flex: 1 }}>
      <Toolbar />
      <Layers />
      <Inspector />
    </div>
  </Root>
)


app(state, actions, view, document.body)
