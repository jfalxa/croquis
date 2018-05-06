import { h } from 'hyperapp'
import Tool from './Tool'
import Line from '../../shapes/line'
import { project } from '../../utils/geometry'


const LineTool = ({ active, initialPosition, position, stage: { zoom, pan }, onDrag, onCreate }) => {

  function drawLine({ initialPosition, position }) {
    onDrag({ initialPosition, position })
  }

  function addLine({ initialPosition, position, area }) {
    if (area.width <= 1 && area.height <= 1) {
      return
    }

    const line = Line.create({
      a: project(initialPosition, zoom, pan),
      b: project(position, zoom, pan)
    })

    onCreate(line)
    onDrag({ initialPosition: null, position: null })
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
