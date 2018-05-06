import { h } from 'hyperapp'
import Tool from './Tool'
import Ellipse from '../../shapes/ellipse'


const EllipseTool = ({ active, area, onDrag, onCreate }) => {

  function drawEllipse({ area }) {
    onDrag({ area })
  }

  function addEllipse({ area }) {
    if (area.width <= 1 && area.height <= 1) {
      return
    }

    onDrag({ area: null })
    onCreate(Ellipse.create(area))
  }


  const ellipse = area && Ellipse.create(area)


  return (
    <Tool
      active={active}
      onMouseDrag={drawEllipse}
      onMouseUp={addEllipse}
    >
      {ellipse && <Ellipse {...ellipse} style={{ fill: 'none', stroke: 'blue' }} />}
    </Tool>
  )
}


export default EllipseTool
