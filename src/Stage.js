import { h } from 'hyperapp'
import styled from './styled'


const StageSvg = styled('svg')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%'
})


const Stage = (props) => (state, actions) => (
  <StageSvg>
    {state.elements.map(({ type:Component, ...props }) => (
      <Component { ...props } />
    ))}
  </StageSvg>
)


export default Stage
