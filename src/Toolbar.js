import { h } from 'hyperapp'
import styled from './style'


const tools = [
  'selection',
  'rectangle'
]


const ToolbarContainer = styled('div')({
  zIndex: 1,
  flexDirection: 'column',
  border: '1px solid black'
})


const Tool = ({ name, active, onSelect }) => (
  <div>
    <input
      id={`tool-${name}`}
      name="tool"
      type="radio"
      value={name}
      checked={active}
      onchange={onSelect}
    />
    <label htmlFor={`tool-${name}`}>{name}</label>
  </div>
)


const Toolbar = (props) => (state, actions) => (
  <ToolbarContainer>
    {tools.map(tool => (
      <Tool
        name={tool}
        active={state.selectedTool === tool}
        onSelect={() => actions.selectTool({tool})}
      />
    ))}
  </ToolbarContainer>
)


export default Toolbar
