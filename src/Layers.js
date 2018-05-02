import { h } from 'hyperapp'
import styled from './style'


const LayersContainer = styled('div')({
  zIndex: 1,
  flexDirection: 'column',
  border: '1px solid black'
})

const LayerNode = styled('span')(props => ({
  fontWeight: props.selected ? 'bold' : 'normal'
}))

const Layer = ({ id, type, selected, onSelect }, children) => (
  <li>
    <LayerNode
      selected={selected}
      onclick={e => onSelect({ elements: [id], subselection: true, toggle: e.shiftKey })}
    >
      {type} {id}
    </LayerNode>

    {children}
  </li>
)

const Tree = ({ nodes, renderNode:Node }) => (
  <ul>
    {nodes.map(({ ...node, children }) => (
      <Node key={node.id} {...node}>
        {(children && children.length > 0) && (
          <Tree nodes={children} renderNode={Node} />
        )}
      </Node>
    ))}
  </ul>
)

const Layers = (props) => (state, actions) => (
  <LayersContainer>
    <Tree
      nodes={state.elements}
      renderNode={(element, children) => (
        <Layer
          {...element}
          selected={state.selection.includes(element.id)}
          onSelect={actions.selectElements}
        >
          {children}
        </Layer>
      )}
    />
  </LayersContainer>
)


export default Layers
