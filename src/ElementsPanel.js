import { h } from 'hyperapp'
import styled from './styled'


const ElementsPanelContainer = styled('div')({
  zIndex: 1,
  flexDirection: 'column',
  border: '1px solid black'
})


const ElementsPanel = (props) => (state, actions) => (
  <ElementsPanelContainer>
    <span>{state.selection}</span>
    <span>Rectangle 1</span>
  </ElementsPanelContainer>
)


export default ElementsPanel
