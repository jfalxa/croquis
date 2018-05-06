import { h } from 'hyperapp'
import { Point2D, Matrix2D } from 'kld-affine'
import styled from '../style'
import * as Tree from '../utils/tree'
import { bbox } from '../utils/elements'


const InspectorContainer = styled('div')({
  zIndex: 1,
  flexDirection: 'column',
  marginLeft: 'auto',
  border: '1px solid black'
})


const Inspector = ({ elements, onTransform, onGroup, onUngroup }) => {

  const selectionBbox = bbox(...elements)


  function updateBbox(e) {
    return { ...selectionBbox, [e.target.name]: parseInt(e.target.value || 0, 10) }
  }

  function handleTranslation(e) {
    const bbox = updateBbox(e)

    const tx = bbox.x - selectionBbox.x
    const ty = bbox.y - selectionBbox.y

    const translation = Matrix2D.translation(tx, ty)

    onTransform({ elements, transformation: translation })
  }

  function handleScaling(e) {
    const bbox = updateBbox(e)
    const anchor = new Point2D(selectionBbox.x, selectionBbox.y)

    const sx = bbox.width / selectionBbox.width
    const sy = bbox.height / selectionBbox.height

    const scaling = Matrix2D.nonUniformScalingAt(sx, sy, anchor)

    onTransform({ elements, transformation: scaling })
  }


  return (
    <InspectorContainer>
      {(elements.length > 1) && (
        <button onclick={onGroup}>Group</button>
      )}

      {(elements.length === 1) && (elements[0].type === 'Group') && (
        <button onclick={onUngroup}>Ungroup</button>
      )}

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