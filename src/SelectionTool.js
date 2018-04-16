import { h } from 'hyperapp'
import last from 'lodash/last'
import styled from './styled'
import Tool from './Tool'


const rectangle = ([x, y], [width, height]) => ({
  x: Math.min(x, x+width),
  y: Math.min(y, y+height),
  width: Math.abs(width),
  height: Math.abs(height)
})

const contains = ([x, y], r) => (
  (r.x <= x && x <= r.x + r.width)
  && (r.y <= y && y <= r.y + r.height)
)

const overlaps = (a, b) => (
  (a.x < b.x + b.width) && (a.x + a.width > b.x)
  && (a.y < b.y + b.height) && (a.y + a.height > b.y)
)


const SelectionTool = (props) => (state, actions) => {

  const selectElement = ({ e, position }) => {
    const found = state.elements
      .filter(element => contains(position, element))
      .map(element => element.id)

    // when user clicks, select only the element closer to them
    actions.selectElements({
      elements: found.slice(-1),
      add: e.shiftKey
    })
  }

  const selectElementsInArea = ({ e, initialPosition, delta }) => {
    const area = rectangle(initialPosition, delta)
    const found = state.elements
      .filter(element => overlaps(area, element))
      .map(element => element.id)

    actions.selectElements({ elements: found })
  }

  return (
    <Tool
      onMouseDown={selectElement}
      onMouseDrag={selectElementsInArea}
    >
    </Tool>
  )
}


export default SelectionTool
