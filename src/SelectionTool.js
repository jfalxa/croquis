import { h } from 'hyperapp'
import last from 'lodash/last'
import styled from './styled'
import Tool from './Tool'
import { rectangle, normalizeBounds, bounds, contains, overlaps } from './utils/geometry'


const SelectionTool = (props) => (state, actions) => {

  const { selection, elements, tools: { area } } = state
  const selectionElements = selection.map(elementID => elements[elementID])
  const selectionArea = bounds(...selectionElements)

  const hasArea = Boolean(area)
  const hasSelection = (selection.length > 0)


  const selectElement = ({ e, position }) => {
    const found = actions.getState().elements
      .filter(element => contains(position, normalizeBounds(element)))
      .map(element => element.id)

    // when user clicks, select only the element closer to them
    actions.selectElements({
      elements: found.slice(-1),
      add: e.shiftKey
    })
  }

  const selectElementsInArea = ({ e, initialPosition, delta }) => {
    const area = rectangle(initialPosition, delta)

    const found = actions.getState().elements
      .filter(element => overlaps(area, normalizeBounds(element)))
      .map(element => element.id)

    actions.tools.set({ area })
    actions.selectElements({ elements: found })
  }

  const endSelection = () => {
    actions.tools.set({ area: null })
  }


  return (
    <Tool
      onMouseDown={selectElement}
      onMouseDrag={selectElementsInArea}
      onMouseUp={endSelection}
    >

      {hasArea && <rect {...area} fill="none" stroke="blue" />}

      {hasSelection && <rect {...selectionArea} fill="none" stroke="blue" />}

      {selectionElements.map(element => (
        <rect {...element} fill="none" stroke="blue" />
      ))}
    </Tool>
  )
}


export default SelectionTool
