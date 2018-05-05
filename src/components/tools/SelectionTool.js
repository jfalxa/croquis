import { h } from 'hyperapp'
import { Shapes } from 'kld-intersections'
import Tool from './Tool'
import TransformControls from './TransformControls'
import * as Tree from '../../utils/tree'
import { getBbox, getSelectionElements } from '../../utils/helpers'
import { isPointIn, isIntersecting } from '../../utils/geometry'


const SelectionTool = (props) => (state, actions) => {

  function getShapes() {
    return Tree.flatten(state.elements.tree)
      .filter(element => Boolean(element.shape))
      .reverse()
  }

  function selectElement({ e, position }) {
    const element = getShapes()
      .find(element => isPointIn(position, element.shape))

    actions.elements.select({
      elements: element ? [element.id] : [],
      toggle: e.shiftKey
    })
  }

  function selectElementsInArea({ area } ) {
    const areaRect = Shapes.rectangle(area.x, area.y, area.width, area.height)

    const elements = getShapes()
      .filter(element => isIntersecting(areaRect, element.shape))
      .map(element => element.id)

    actions.elements.select({ elements })
    actions.tools.set({ area })
  }

  function endSelection() {
    actions.tools.set({ area: null })
  }


  const { area } = state.tools
  const selectionElements = getSelectionElements(state.elements)
  const selectionBbox = getBbox(...selectionElements)

  const hasArea = Boolean(area)
  const hasSelection = (selectionElements.length > 0)


  return (
    <Tool
      onMouseDown={selectElement}
      onMouseDrag={selectElementsInArea}
      onMouseUp={endSelection}
    >
      {hasArea && <rect {...area} fill="none" stroke="blue" />}

      {hasSelection && <TransformControls box={selectionBbox} />}
    </Tool>
  )
}


export default SelectionTool
