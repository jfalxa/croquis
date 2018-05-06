import { h } from 'hyperapp'
import Tool from './Tool'
import Ellipse from '../../shapes/ellipse'
import { project } from '../../utils/geometry'


const EllipseTool = ({ active, area, stage: { zoom, pan }, onDrag, onCreate }) => {

  function drawEllipse({ area }) {
    onDrag({ area })
  }

  function addEllipse({ area }) {
    if (area.width <= 1 && area.height <= 1) {
      return
    }

    const ellipse = Ellipse.create(project(area, zoom, pan))

    onCreate(ellipse)
    onDrag({ area: null })
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
