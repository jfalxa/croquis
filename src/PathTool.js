import { h } from 'hyperapp'
import styled from './styled'
import Tool from './Tool'
import { svgPath } from './utils/svg'


const PathTool = (props) => (state, actions) => {

  const addPoint = ({ position }) => {
    const { path=[] } = actions.getState().tools
    actions.tools.set({ path: [...path, position] })
  }

  const setHoveredPosition = ({ position }) => actions.tools.set({ position })

  const createPath = (e) => {
    e.stopPropagation()
    const { path } = actions.getState().tools
    actions.createElement({ type: 'path', path, closed: true })
    actions.tools.set({ path: [] })
  }


  const { path=[], position:hoveredPosition } = state.tools
  const hasPath = (path.length > 0)

  const [initialPoint] = path

  return (
    <Tool
      onMouseDown={addPoint}
      onMouseMove={setHoveredPosition}
    >
      {hasPath && (
        <path d={svgPath([...path, hoveredPosition])}
          stroke="black"
          fill="none"
          stroke-width="3"
        />
      )}

      {hasPath && (
        <circle
          cx={initialPoint[0]}
          cy={initialPoint[1]}
          r="4"
          fill="red"
          onmousedown={createPath}
        />
      )}
    </Tool>
  )
}


export default PathTool

