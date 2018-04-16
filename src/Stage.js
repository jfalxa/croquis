import { h } from 'hyperapp'
import styled from './styled'


const StageSvg = styled('svg')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%'
})


const Stage = (props) => (
  <StageSvg>
    <rect x="300" y="200" width="300" height="100" fill="red" />
  </StageSvg>
)


export default Stage
