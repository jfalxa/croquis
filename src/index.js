import { h, app } from 'hyperapp'
import xor from 'lodash/xor'
import Root from './Root'
import Stage from './Stage'
import SelectionTool from './SelectionTool'
import PathTool from './PathTool'
import Topbar from './Topbar'
import Toolbar from './Toolbar'
import Layers from './Layers'
import Inspector from './Inspector'


const state = {
  selection: [],

  tools: {},

  elements: [
    { id: 0, type: 'rect', x: 300, y: 200, width: 300, height: 150, fill: 'red' },
    { id: 1, type: 'rect', x: 400, y: 300, width: 300, height: 100, fill: 'green' },
    { id: 2, type: 'path', path: [ [500, 100], [1100, 200], [200, 700] ] },
    { id: 3, type: 'path', path: [ [100, 100], [200, 200] ], closed: true, stroke: 'red' }
  ]
}

const actions = {
  getState: () => state => state,

  createElement: (element) => ({ elements }) => ({ elements: [...elements, element] }),

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
