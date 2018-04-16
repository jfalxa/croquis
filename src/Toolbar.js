import { h } from 'hyperapp'
import styled from './styled'


const ToolbarContainer = styled('div')({
  zIndex: 1,
  flexDirection: 'column',
  border: '1px solid black'
})


const Tool = ({ name }) => (
  <div>
    <input id={`tool-${name}`} name="tool" type="radio" value={name} />
    <label htmlFor={`tool-${name}`}>{name}</label>
  </div>
)


const Toolbar = (props) => (
  <ToolbarContainer>
    <Tool name="move" />
    <Tool name="rect" />
    <Tool name="line" />
  </ToolbarContainer>
)


export default Toolbar
