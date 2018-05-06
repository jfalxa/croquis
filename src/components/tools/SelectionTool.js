import { h } from 'hyperapp'
import { Shapes } from 'kld-intersections'
import Tool from './Tool'
import TransformControls from './TransformControls'
import * as Tree from '../../utils/tree'
import { bbox } from '../../utils/elements'
import { getSelectionElements } from '../../utils/helpers'
import { isPointIn, isIntersecting } from '../../utils/geometry'


const SelectionTool = ({ active, elements, selection, area, onDrag, onSelect, onTransform }) => {

  function getShapes() {
    return Tree.flatten(elements)
      .filter(element => Boolean(element.shape))
      .reverse()
  }

  function selectElement({ e, position }) {
    const element = getShapes()
      .find(element => isPointIn(position, element.shape))

    onSelect({
      elements: element ? [element.id] : [],
      toggle: e.shiftKey
    })
  }

  function selectElementsInArea({ area } ) {
    const areaRect = Shapes.rectangle(area.x, area.y, area.width, area.height)

    const found = getShapes()
      .filter(element => isIntersecting(areaRect, element.shape))
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
