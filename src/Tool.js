import { h } from 'hyperapp'
import styled from './styled'
import withMouseEvents from './withMouseEvents'


const SvgContainer = styled('svg')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%'
})


const Tool = (props, children) => (
  <SvgContainer
    oncreate={props.initMouse}
    ondestroy={props.destroyMouse}
  >
    {children}
  </SvgContainer>
)


export default withMouseEvents(Tool)
