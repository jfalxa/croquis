import { h } from 'hyperapp'
import withMouseEvents, { getMouseData } from '../../utils/withMouseEvents'


const Tool = withMouseEvents(({ active, name, onDoubleClick, startDragging }, children) => active && (
  <g
    onmousedown={e => (e.button === 0) && startDragging(e)}
    ondblclick={e => onDoubleClick(getMouseData(e))}
  >
    <rect
      fill="transparent"
      width="100%"
      height="100%"
    />

    {children}
  </g>
))


export default Tool
