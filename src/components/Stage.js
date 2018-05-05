import { h } from 'hyperapp'
import styled from '../style'
import { svgPath } from '../utils/svg'
import { Shape } from '../shapes'


const StageSvg = styled('svg')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%'
})


const Stage = (props, children) => (
  <StageSvg>
    <g>
      {props.elements.map(element => (
        <Shape {...element} />
      ))}
    </g>

    {children}
  </StageSvg>
)


export default Stage
