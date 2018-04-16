import { h } from 'hyperapp'
import styled from './styled'


const PropertiesPanelContainer = styled('div')({
  zIndex: 1,
  flexDirection: 'column',
  marginLeft: 'auto',
  border: '1px solid black'
})


const PropertiesPanel = (props) => (
  <PropertiesPanelContainer>
    <input placeholder="x" name="x" />
    <input placeholder="y" name="y" />
    <input placeholder="width" name="width" />
    <input placeholder="height" name="height" />
  </PropertiesPanelContainer>
)


export default PropertiesPanel
