import { h } from 'hyperapp'
import last from 'lodash/last'
import { Shapes } from 'kld-intersections'
import styled from './styled'
import Tool from './Tool'
import { rectangle, isPointIn, isIntersecting, bbox, joinBboxes } from './utils/geometry'


const SelectionTool = (props) => (state, actions) => {

  function getElements() {
    return actions.getState().elements.slice().reverse()
  }

  function selectElement({ e, position }) {
    const found = getElements()
      .find(element => isPointIn(position, element.shape))

    // when user clicks, select only the element closer to them
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


  const { selection, elements, tools: { area } } = state

  const hasArea = Boolean(area)
  const hasSelection = (selection.length > 0)

  const selectionBboxes = elements
    .filter(element => selection.includes(element.id))
    .map(element => bbox(element.shape))

  const selectionBbox = joinBboxes(...selectionBboxes)

  return (
    <Tool
      onMouseDown={selectElement}
      onMouseDrag={selectElementsInArea}
      onMouseUp={endSelection}
    >
      {hasArea && <rect {...area} fill="none" stroke="blue" />}

      {hasSelection && <rect {...selectionBbox} fill="none" stroke="blue" />}

      {selectionBboxes.map(bbox => (
        <rect {...bbox} fill="none" stroke="blue" />
      ))}
    </Tool>
  )
}


export default SelectionTool
