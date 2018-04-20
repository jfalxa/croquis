import { h } from 'hyperapp'
import styled from './styled'


const LayersContainer = styled('div')({
  zIndex: 1,
  flexDirection: 'column',
  border: '1px solid black'
})

const Layer = styled('span')(props => ({
  fontWeight: props.selected ? 'bold' : 'normal'
}))


const Layers = (props) => (state, actions) => (
  <LayersContainer>
    {state.elements.map(element => (
      <Layer selected={state.selection.includes(element.id)}>
        {element.type} {element.id}
      </Layer>
    ))}
  </LayersContainer>
)


export default Layers
