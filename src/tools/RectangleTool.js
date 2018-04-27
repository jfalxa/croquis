import { h } from 'hyperapp'
import Tool from './Tool'
import { rectangle } from '../utils/geometry'
import * as Rectangle from '../shapes/rectangle'


const RectangleTool = (props) => (state, actions) => {

  function drawRectangle({ area }) {
    actions.tools.set({ area })
  }

  function addRectangle({ area }) {
    const rectangle = Rectangle.create(area)
    actions.createElement(rectangle)
    actions.tools.set({ area: null })
  }


  const { area } = state.tools

  return (
    <Tool
      onMouseDrag={drawRectangle}
      onMouseUp={addRectangle}
    >
      {area && <rect {...area} fill="none" stroke="blue" />}
    </Tool>
  )
}


export default RectangleTool
