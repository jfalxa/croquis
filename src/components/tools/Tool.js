import { h } from 'hyperapp'
import withMouseEvents from '../../utils/withMouseEvents'


const Tool = withMouseEvents(({ active, name, startDragging }, children) => active && (
  <g onmousedown={startDragging}>
    <rect
      fill="transparent"
      style={{ width: '100%', height: '100%' }}
    />

    {children}
  </g>
))


export default Tool