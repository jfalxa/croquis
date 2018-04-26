import { h } from 'hyperapp'
import styled from './styled'
import { bbox, joinBboxes } from './utils/geometry'


const InspectorContainer = styled('div')({
  zIndex: 1,
  flexDirection: 'column',
  marginLeft: 'auto',
  border: '1px solid black'
})


const Inspector = (props) => (state, actions) => {

  function handleChange(e) {
    const change = { [e.target.name]: parseInt(e.target.value, 10) }
  }


  const { selection, elements } = state

  const selectionBboxes = elements
    .filter(element => selection.includes(element.id))
    .map(element => bbox(element.shape))

  const selectionBbox = joinBboxes(...selectionBboxes)


  return (
    <InspectorContainer>
      <form onchange={handleChange} style={{ flexDirection: 'column' }}>
        <input placeholder="x" name="x" value={selectionBbox.x} />
        <input placeholder="y" name="y" value={selectionBbox.y} />
        <input placeholder="width" name="width" value={selectionBbox.width} />
        <input placeholder="height" name="height" value={selectionBbox.height} />
      </form>
    </InspectorContainer>
  )
}


export default Inspector
