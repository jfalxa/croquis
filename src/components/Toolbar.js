import { h } from 'hyperapp'
import styled from '../style'


const tools = [
  'selection',
  'rectangle',
  'ellipse'
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
      onchange={() => onSelect({ tool: name })}
    />
    <label htmlFor={`tool-${name}`}>{name}</label>
  </div>
)


const Toolbar = ({ selected, onSelect }) => (
  <ToolbarContainer>
    {tools.map(tool => (
      <Tool
        name={tool}
        active={selected === tool}
        onSelect={onSelect}
      />
    ))}
  </ToolbarContainer>
)


export default Toolbar
