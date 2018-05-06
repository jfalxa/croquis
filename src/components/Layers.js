import { h } from 'hyperapp'
import Tree from './Tree'
import styled from '../style'
import { hasChild } from '../utils/tree'


function getRelativePosition(e) {
  const { y, height } = e.target.getBoundingClientRect()
  return (e.y < y + height/2) ? 0 : 1
}

const LayersContainer = styled('div')({
  zIndex: 1,
  flexDirection: 'column',
  border: '1px solid black'
})

const DummyNode = styled('li')({
  background: 'black',
  height: '2px'
})

const LayerNode = styled('span')(props => ({
  fontWeight: props.selected ? 'bold' : 'normal'
}))

const Layer = ({ id, type, selected, onSelect, onDragStart, onDragOver, onDrop }, children) => (
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

const LayerOrDummy = (props, children) => (
  (props.id === 'dummy')
    ? <DummyNode />
    : <Layer {...props}>{children}</Layer>
)

let dragged = null

const Layers = ({ elements, selection, onSelect, onMove, onRemove }) => {

  function handleDragStart(id) {
    return (e) => {
      if (!selection.includes(id)) {
        e.preventDefault()
      }

      dragged = id
    }
  }

  function handleDragOver(id) {
    return (e) => {
      if (dragged === id || hasChild(elements, { id: dragged }, { id })) {
        return
      }

      e.preventDefault()

      const relativePosition = getRelativePosition(e)
      onMove({ elements: ['dummy'], target: id, relativePosition })
    }
  }

  function handleDrop(id) {
    return (e) => {
      dragged = null
      const relativePosition = getRelativePosition(e)

      onRemove({ elements: ['dummy'] })
      onMove({ elements: selection, target: id, relativePosition })
    }
  }

  return (
    <LayersContainer>
      <Tree
        nodes={elements}
        renderNode={(element, children) => (
          <LayerOrDummy
            {...element}
            selected={selection.includes(element.id)}
            onSelect={onSelect}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {children}
          </LayerOrDummy>
        )}
      />
    </LayersContainer>
  )
}


export default Layers
