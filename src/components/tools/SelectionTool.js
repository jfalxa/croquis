import { h } from 'hyperapp'
import Tool from './Tool'
import TransformControls from './TransformControls'
import * as Tree from '../../utils/tree'
import Rectangle from '../../shapes/rectangle'
import { getSelectionElements } from '../../utils/helpers'
import { bbox, isPointIn, isInArea } from '../../utils/elements'


const SelectionTool = ({ active, elements, selection, area, onDrag, onSelect, onTransform }) => {

  function getShapes() {
    return Tree.flatten(elements)
      .filter(element => Boolean(element.shape))
      .reverse()
  }

  function selectElement({ e, position }) {
    const found = getShapes()
      .find(element => isPointIn(position, element))

    onSelect({
      elements: found ? [found.id] : [],
      toggle: e.shiftKey
    })
  }

  function selectElementsInArea({ area } ) {
    const rectangle = Rectangle.create(area)

    const found = getShapes()
      .filter(element => isInArea(rectangle, element))
      .map(element => element.id)

    onDrag(area)
    onSelect({ elements: found })
  }

  function endSelection() {
    onDrag(null)
  }


  return (
    <Tool
      active={active}
      onMouseDown={selectElement}
      onMouseDrag={selectElementsInArea}
      onMouseUp={endSelection}
    >
      {area && <rect {...area} fill="none" stroke="blue" />}

      {(selection.length > 0) && (
        <TransformControls
          elements={getSelectionElements({ tree: elements, selection })}
          onTransform={onTransform}
        />
      )}
    </Tool>
  )
}


export default SelectionTool
