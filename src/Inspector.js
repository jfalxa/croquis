import { h } from 'hyperapp'
import styled from './styled'
import { Point2D, Matrix2D } from 'kld-affine'
import { bbox, joinBboxes } from './utils/geometry'


const InspectorContainer = styled('div')({
  zIndex: 1,
  flexDirection: 'column',
  marginLeft: 'auto',
  border: '1px solid black'
})


const Inspector = (props) => (state, actions) => {

  function getBbox(e) {
    const bound = e.target.name
    const value = parseInt(e.target.value || 0, 10)

    return { ...selectionBbox, [bound]: value }
  }

  function handleTranslation(e) {
    const bbox = getBbox(e)

    const tx = bbox.x - selectionBbox.x
    const ty = bbox.y - selectionBbox.y

    const translation = Matrix2D.translation(tx, ty)

    actions.transformElements({ transformation: translation })
  }

  function handleScaling(e) {
    const bbox = getBbox(e)
    const anchor = new Point2D(selectionBbox.x, selectionBbox.y)

    const sx = bbox.width / selectionBbox.width
    const sy = bbox.height / selectionBbox.height

    const scaling = Matrix2D.nonUniformScalingAt(sx, sy, anchor)

    actions.transformElements({ transformation: scaling })
  }


  const { selection, elements } = state

  const selectionBboxes = elements
    .filter(element => selection.includes(element.id))
    .map(element => bbox(element.shape))

  const selectionBbox = joinBboxes(...selectionBboxes)


  return (
    <InspectorContainer>
      <input
        placeholder="x"
        name="x"
        value={selectionBbox.x}
        onchange={handleTranslation}
      />

      <input
        placeholder="y"
        name="y"
        value={selectionBbox.y}
        onchange={handleTranslation}
      />

      <input
        placeholder="width"
        name="width"
        value={selectionBbox.width}
        onchange={handleScaling}
      />

      <input
        placeholder="height"
        name="height"
        value={selectionBbox.height}
        onchange={handleScaling}
      />
    </InspectorContainer>
  )
}


export default Inspector
