import { h, app } from 'hyperapp'
import Root from './Root'
import Stage from './Stage'
import Topbar from './Topbar'
import Toolbar from './Toolbar'
import ElementsPanel from './ElementsPanel'
import PropertiesPanel from './PropertiesPanel'


const state = {}

const actions = {}

const view = (state, actions) => (
  <Root>
    <Stage />

    <Topbar />

    <div style={{ flex: 1 }}>
      <Toolbar />
      <ElementsPanel />
      <PropertiesPanel />
    </div>
  </Root>
)


app(state, actions, view, document.body)
