import { h, app } from 'hyperapp'
import xor from 'lodash/xor'
import Root from './Root'
import Stage from './Stage'
import SelectionTool from './SelectionTool'
import Topbar from './Topbar'
import Toolbar from './Toolbar'
import ElementsPanel from './ElementsPanel'
import PropertiesPanel from './PropertiesPanel'


const state = {
  selection: [],

  elements: [
    { id: 0, type: 'rect', x: 300, y: 200, width: 300, height: 150, fill: 'red' },
    { id: 1, type: 'rect', x: 400, y: 300, width: 300, height: 100, fill: 'green' }
  ]
}

const actions = {
  selectElements: ({ elements, add }) => ({ selection }) => ({
    selection: add ? xor(selection, elements) : elements
  })
}


const view = (state, actions) => (
  <Root>
    <Stage />
    <SelectionTool />

    <Topbar />

    <div style={{ flex: 1 }}>
      <Toolbar />
      <ElementsPanel />
      <PropertiesPanel />
    </div>
  </Root>
)


app(state, actions, view, document.body)
