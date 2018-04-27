import { h } from 'hyperapp'
import styled from './style'


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
      <Layer
        selected={state.selection.includes(element.id)}
        onclick={e => actions.selectElements({ elements: [element.id], add: e.shiftKey })}
      >
        {element.type} {element.id}
      </Layer>
    ))}
  </LayersContainer>
)


export default Layers
