import { h } from 'hyperapp'
import styled from './style'
import { hasChild } from './utils/tree'


function getRelativePosition(e) {
  const { y, height } = e.target.getBoundingClientRect()
  return (e.y < y + height/2) ? 0 : 1
}

const LayersContainer = styled('div')({
  zIndex: 1,
  flexDirection: 'column',
  border: '1px solid black'
})

const LayerNode = styled('span')(props => ({
  fontWeight: props.selected ? 'bold' : 'normal'
}))

const Layer = ({ id, type, selected, onSelect, onDragStart, onDragOver, onDrop }, children) => (
  (id === 'dummy') ? <span style={{border: '1px solid black', height: '2px'}} /> : (
    <li>
      <LayerNode
        draggable={true}
        selected={selected}
        onclick={e => onSelect({ elements: [id], subselection: true, toggle: e.shiftKey })}
        ondragstart={onDragStart(id)}
        ondragover={onDragOver(id)}
        ondrop={onDrop(id)}
      >
        {type} {id}
      </LayerNode>

      {children}
    </li>
  )
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

let dragged = null

const Layers = (props) => (state, actions) => {

  function handleDragStart(id) {
    return (e) => {
      if (!state.selection.includes(id)) {
        e.preventDefault()
      }

      dragged = id
    }
  }

  function handleDragOver(id) {
    return (e) => {
      if (dragged === id || hasChild(state.elements, { id: dragged }, { id })) {
        return
      }

      e.preventDefault()

      const relativePosition = getRelativePosition(e)
      actions.moveElements({ elements: ['dummy'], target: id, relativePosition })
    }
  }

  function handleDrop(id) {
    return (e) => {
      dragged = null
      const relativePosition = getRelativePosition(e)

      actions.removeElements({ elements: ['dummy'] })
      actions.moveElements({ elements: state.selection, target: id, relativePosition })
    }
  }

  return (
    <LayersContainer>
      <Tree
        nodes={state.elements}
        renderNode={(element, children) => (
          <Layer
            {...element}
            selected={state.selection.includes(element.id)}
            onSelect={actions.selectElements}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {children}
          </Layer>
        )}
      />
    </LayersContainer>
  )
}


export default Layers
