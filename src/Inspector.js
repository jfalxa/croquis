import { h } from 'hyperapp'
import styled from './styled'
import { bounds, center, scale, translate } from './utils/geometry'


const InspectorContainer = styled('div')({
  zIndex: 1,
  flexDirection: 'column',
  marginLeft: 'auto',
  border: '1px solid black'
})


const Inspector = (props) => (state, actions) => {
  const { selection, elements } = state

  const selectionElements = selection.map(elementID => elements[elementID])
  const selectionArea = bounds(...selectionElements)


  const handleChange = (e) => {
    const newBounds = {
      ...selectionArea,
      [e.target.name]: parseInt(e.target.value, 10)
    }

    const translation = [newBounds.x - selectionArea.x, newBounds.y - selectionArea.y]
    const scaling = [newBounds.width / selectionArea.width, newBounds.height / selectionArea.height]

    actions.transformElements({
      ids: selection,
      transform: element => scale(translate(element, translation), scaling, selectionArea)
    })
  }


  return (
    <InspectorContainer>
      <form onchange={handleChange} style={{ flexDirection: 'column' }}>
        <input placeholder="x" name="x" value={selectionArea.x} />
        <input placeholder="y" name="y" value={selectionArea.y} />
        <input placeholder="width" name="width" value={selectionArea.width} />
        <input placeholder="height" name="height" value={selectionArea.height} />
      </form>
    </InspectorContainer>
  )
}


export default Inspector
