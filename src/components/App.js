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
import TextTool from './tools/TextTool'

import { getSelectionElements } from '../utils/helpers'


const App = ({ elements, tools, stage }, actions) => {

  return (
    <Root>
      <Stage
        stage={stage}
        elements={elements.tree}
        selection={elements.selection}
        onZoomAndPan={actions.stage.zoomAndPan}
      >
        <SelectionTool
          active={tools.selected === 'selection'}
          stage={stage}
          elements={elements.tree}
          selection={elements.selection}
          area={tools.area}
          onDrag={actions.tools.set}
          onSelect={actions.elements.select}
          onTransform={actions.elements.transform}
        />

        <RectangleTool
          active={tools.selected === 'rectangle'}
          stage={stage}
          area={tools.area}
          onDrag={actions.tools.set}
          onCreate={actions.elements.create}
        />

        <EllipseTool
          active={tools.selected === 'ellipse'}
          stage={stage}
          area={tools.area}
          onDrag={actions.tools.set}
          onCreate={actions.elements.create}
        />

        <LineTool
          active={tools.selected === 'line'}
          stage={stage}
          initialPosition={tools.initialPosition}
          position={tools.position}
          onDrag={actions.tools.set}
          onCreate={actions.elements.create}
        />

        <TextTool
          active={tools.selected === 'text'}
          stage={stage}
          area={tools.area}
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
        onStyle={actions.elements.style}
        onText={actions.elements.text}
        onGroup={actions.elements.group}
        onUngroup={actions.elements.ungroup}
      />
    </Root>
  )
}

export default App
