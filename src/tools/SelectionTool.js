import { h } from 'hyperapp'
import last from 'lodash/last'
import { Shapes } from 'kld-intersections'
import styled from '../style'
import Tool from './Tool'
import TransformControls from './TransformControls'
import { rectangle, isPointIn, isIntersecting, bbox, joinBboxes } from '../utils/geometry'


const SelectionTool = (props) => (state, actions) => {

  function getElements() {
    return actions.getState().elements.slice().reverse()
  }

  function selectElement({ e, position }) {
    const found = getElements()
      .find(element => isPointIn(position, element.shape))

    actions.selectElements({
      elements: found ? [found.id] : [],
      add: e.shiftKey
    })
  }

  function selectElementsInArea({ area } ) {
    const areaRect = Shapes.rectangle(area.x, area.y, area.width, area.height)

    const found = getElements()
      .filter(element => isIntersecting(areaRect, element.shape))
      .map(element => element.id)

    actions.selectElements({ elements: found })
    actions.tools.set({ area })
  }

  function endSelection() {
    actions.tools.set({ area: null })
  }


  const { elements, selection, tools: { area } } = state
  const selectionElements = elements.filter(element => selection.includes(element.id))

  const hasArea = Boolean(area)
  const hasSelection = (selectionElements.length > 0)

  const selectionBboxes = selectionElements.map(element => bbox(element.shape))
  const selectionBbox = joinBboxes(...selectionBboxes)

  return (
    <Tool
      onMouseDown={selectElement}
      onMouseDrag={selectElementsInArea}
      onMouseUp={endSelection}
    >
      {hasArea && <rect {...area} fill="none" stroke="blue" />}

      {selectionBboxes.map(bbox => (
        <rect {...bbox} fill="none" stroke="blue" />
      ))}

      {hasSelection && <TransformControls box={selectionBbox} />}
    </Tool>
  )
}


export default SelectionTool
