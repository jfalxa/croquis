import { h } from 'hyperapp'
import Tree from './Tree'
import styled from '../style'
import { hasChild } from '../utils/tree'


function getRelativePosition(e, type) {
  const { y, height } = e.target.getBoundingClientRect()
  const position = (e.y < y + height/2) ? 'before' : 'after'

  return (type === 'Group' && position === 'after')
    ? 'first-child'
    : position
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

const LayerNode = styled('div')(props => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  padding: '5px',
  paddingLeft: 5 + props.depth * 20 + 'px',
  width: '200px',
  fontWeight: props.selected ? 'bold' : 'normal',
  backgroundColor: props.selected ? 'lightgrey' : 'none'
}))

const Layer = ({ id, depth, type, selected, onSelect, onRemove, onDragStart, onDragOver, onDragEnd }, children) => (
  <li>
    <LayerNode
      depth={depth}
      draggable={true}
      selected={selected}
      onclick={e => onSelect({ elements: [id], subselection: true, toggle: e.shiftKey })}
      ondragstart={onDragStart(id)}
      ondragover={onDragOver(id, type)}
      ondragend={onDragEnd}
      ondrop={e => e.preventDefault()}
    >
      <span>{type} {id}</span>
      <button onclick={onRemove(id)}>X</button>
    </LayerNode>

    {children}
  </li>
)

const LayerOrDummy = (props, children) => (
  (props.id === 'dummy')
    ? <DummyNode />
    : <Layer {...props}>{children}</Layer>
)

const LayerTree = styled(Tree)(props => ({
  margin: 0,
  padding: 0,

  ul: {
    margin: 0,
    padding: 0
  },

  li: {
    margin: 0,
    padding: 0
  }
}))

const Layers = ({ elements, selection, onSelect, onMove, onRemove }) => {

  function handleRemove(id) {
    return (e) => {
      if (confirm(`Remove element ${id}?`)) {
        onRemove({ elements: [id] })
      }
    }
  }

  function handleDragStart(id) {
    return (e) => {
      if (!selection.includes(id)) {
        e.preventDefault()
      }

      e.dataTransfer.setDragImage(new Image(), 0, 0)
    }
  }

  function handleDragOver(id, type) {
    return (e) => {
      const isDragged = selection.includes(id)
      const isDraggedChild = selection.some(dragged => hasChild(elements, { id: dragged }, { id }))

      if (isDragged || isDraggedChild) {
        return
      }

      e.preventDefault()

      const relativePosition = getRelativePosition(e, type)

      onMove({ elements: ['dummy'], target: id, relativePosition })
    }
  }

  function handleDragEnd() {
    onMove({ elements: selection, target: 'dummy' })
    onRemove({ elements: ['dummy'] })
  }


  return (
    <LayersContainer>
      <LayerTree
        nodes={elements}
        renderNode={(element, children) => (
          <LayerOrDummy
            {...element}
            selected={selection.includes(element.id)}
            onSelect={onSelect}
            onRemove={handleRemove}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            {children}
          </LayerOrDummy>
        )}
      />
    </LayersContainer>
  )
}


export default Layers
