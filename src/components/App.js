import { h } from 'hyperapp'
import Root from './Root'
import Stage from './Stage'
import Toolbar from './Toolbar'
import Layers from './Layers'
import Inspector from './Inspector'
import SelectionTool from './tools/SelectionTool'
import RectangleTool from './tools/RectangleTool'
import EllipseTool from './tools/EllipseTool'
import LineTool from './tools/LineTool'

import { getSelectionElements } from '../utils/helpers'


const App = ({ elements, tools }, actions) => {

  return (
    <Root>

      <Stage elements={elements.tree}>
        <SelectionTool
          active={tools.selected === 'selection'}
          elements={elements.tree}
          selection={elements.selection}
          area={tools.area}
          onDrag={actions.tools.set}
          onSelect={actions.elements.select}
          onTransform={actions.elements.transform}
        />

        <RectangleTool
          active={tools.selected === 'rectangle'}
          area={tools.area}
          onDrag={actions.tools.set}
          onCreate={actions.elements.create}
        />

        <EllipseTool
          active={tools.selected === 'ellipse'}
          area={tools.area}
          onDrag={actions.tools.set}
          onCreate={actions.elements.create}
        />

        <LineTool
          active={tools.selected === 'line'}
          initialPosition={tools.initialPosition}
          position={tools.position}
          onDrag={actions.tools.set}
          onCreate={actions.elements.create}
        />
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
