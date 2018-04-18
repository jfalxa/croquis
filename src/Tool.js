import { h } from 'hyperapp'
import withMouseEvents from './withMouseEvents'


const Tool = (props, children) => (
  <g
    oncreate={element => props.initMouse(element.parentElement)}
    ondestroy={element => props.destroyMouse(element.parentElement)}
  >
    {children}
  </g>
)


export default withMouseEvents(Tool)
