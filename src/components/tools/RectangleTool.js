import { h } from 'hyperapp'
import Tool from './Tool'
import Rectangle from '../../shapes/rectangle'


const RectangleTool = ({ active, area, onDrag, onCreate }) => {

  function drawRectangle({ area }) {
    onDrag(area)
  }

  function addRectangle({ area }) {
    if ( area.width <= 1 && area.height <= 1 ) {
      return
    }

    onDrag(null)
    onCreate(Rectangle.create(area))
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
