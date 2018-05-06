import { h } from 'hyperapp'
import Tool from './Tool'
import Line from '../../shapes/line'


const LineTool = ({ active, initialPosition, position, onDrag, onCreate }) => {

  function drawLine({ initialPosition, position }) {
    onDrag({ initialPosition, position })
  }

  function addLine({ initialPosition, position, area }) {
    if (area.width <= 1 && area.height <= 1) {
      return
    }

    onDrag({ initialPosition: null, position: null })
    onCreate(Line.create({ a: initialPosition, b: position }))
  }


  const line = position && Line.create({ a: initialPosition, b: position })


  return (
    <Tool
      active={active}
      onMouseDrag={drawLine}
      onMouseUp={addLine}
    >
      {line && <Line {...line} style={{ stroke: 'blue' }} />}
    </Tool>
  )
}


export default LineTool
