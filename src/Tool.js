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


const updateMouse = props => (element, oldProps) => {
  oldProps.ondestroy(element)
  props.initMouse(element)
}


const Tool = (props, children) => (
  <SvgContainer
    oncreate={props.initMouse}
    ondestroy={props.destroyMouse}
    onupdate={updateMouse(props)}
  >
    {children}
  </SvgContainer>
)


export default withMouseEvents(Tool)
