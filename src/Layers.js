import { h } from 'hyperapp'
import styled from './styled'


const LayersContainer = styled('div')({
  zIndex: 1,
  flexDirection: 'column',
  border: '1px solid black'
})


const Layers = (props) => (
  <LayersContainer>
    <span>Rectangle 1</span>
  </LayersContainer>
)


export default Layers
