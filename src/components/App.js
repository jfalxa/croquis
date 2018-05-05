import { h } from 'hyperapp'
import Root from './Root'
import Stage from './Stage'
import Toolbar from './Toolbar'
import Layers from './Layers'
import Inspector from './Inspector'
import Tools from './tools'

import { getSelectionElements } from '../utils/helpers'


const App = ({ elements, tools }, actions) => {

  return (
    <Root>

      <Stage elements={elements.tree}>
        <Tools selected={tools.selected} />
      </Stage>

      <Toolbar
        selected={tools.selected}
        onSelect={actions.tools.select}
      />

      <Layers
        elements={elements.tree}
        selection={elements.selection}
        onSelect={actions.elements.select}
        onMove={actions.elements.move}
        onRemove={actions.elements.remove}
      />

      <Inspector
        elements={getSelectionElements(elements)}
        onTransform={actions.elements.transform}
        onGroup={actions.elements.group}
        onUngroup={actions.elements.ungroup}
      />
    </Root>
  )
}


export default App
