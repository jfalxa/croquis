import { h } from 'hyperapp'
import Tool from './Tool'
import Rectangle from '../../shapes/rectangle'
import { project } from '../../utils/geometry'


const RectangleTool = ({ active, area, stage: { zoom, pan }, onDrag, onCreate }) => {

  function drawRectangle({ area }) {
    onDrag({ area })
  }

  function addRectangle({ area }) {
    if ( area.width <= 1 && area.height <= 1 ) {
      return
    }

    const rectangle = Rectangle.create(project(area, zoom, pan))

    onCreate(rectangle)
    onDrag({ area: null })
  }


  const rectangle = area && Rectangle.create(area)

  return (
    <Tool
      active={active}
      onMouseDrag={drawRectangle}
      onMouseUp={addRectangle}
    >
      {rectangle && <Rectangle {...rectangle} style={{ fill: 'none', stroke: 'blue' }} />}
    </Tool>
  )
}


export default RectangleTool
