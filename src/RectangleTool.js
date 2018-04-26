import { h } from 'hyperapp'
import Tool from './Tool'
import { rectangle } from './utils/geometry'
import * as Rectangle from './shapes/rectangle'


const RectangleTool = (props) => (state, actions) => {

  function drawRectangle({ area }) {
    actions.tools.set({ area })
  }

  function addRectangle({ area }) {
    const rectangle = Rectangle.create(area)
    actions.createElement(rectangle)
    actions.tools.set({ area: null })
  }


  return (
    <Tool
      onMouseDrag={drawRectangle}
      onMouseUp={addRectangle}
    >
      <rect {...state.tools.area} fill="none" stroke="blue" />}
    </Tool>
  )
}


export default RectangleTool
