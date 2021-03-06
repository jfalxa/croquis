import { h } from 'hyperapp'
import { Point2D, Matrix2D } from 'kld-affine'
import styled from '../style'
import * as Tree from '../utils/tree'
import { bbox } from '../utils/elements'
import { getSelectionElements } from '../utils/helpers'


const InspectorContainer = styled('div')({
  zIndex: 1,
  flexDirection: 'column',
  marginLeft: 'auto',
  border: '1px solid black'
})


const Inspector = ({ elements, selection, onTransform, onText, onStyle, onDuplicate, onGroup, onUngroup }) => {

  const selectionElements = getSelectionElements({ tree: elements, selection })
  const selectionBbox = bbox(...selectionElements)
  const singleSelection = (selection.length === 1) ? selectionElements[0] : null
  const style = (singleSelection && singleSelection.style) || {}


  function updateBbox(e) {
    return { ...selectionBbox, [e.target.name]: parseInt(e.target.value || 0, 10) }
  }

  function handleTranslation(e) {
    const bbox = updateBbox(e)

    const tx = bbox.x - selectionBbox.x
    const ty = bbox.y - selectionBbox.y

    const translation = Matrix2D.translation(tx, ty)

    onTransform({ elements: selectionElements, transformation: translation })
  }

  function handleScaling(e) {
    const bbox = updateBbox(e)
    const anchor = new Point2D(selectionBbox.x, selectionBbox.y)

    const sx = bbox.width / selectionBbox.width
    const sy = bbox.height / selectionBbox.height

    const scaling = Matrix2D.nonUniformScalingAt(sx, sy, anchor)

    onTransform({ elements: selectionElements, transformation: scaling })
  }

  function handleDuplicate() {
    onDuplicate({ elements: selection })
  }

  function handleText(e) {
    onText({ element: selectionElements[0], text: e.target.value })
  }

  function handleStyle(e) {
    const style = { [e.target.name]: e.target.value }
    onStyle({ element: selectionElements[0], style })
  }


  return (
    <InspectorContainer>
      {(selection.length > 1) && (
        <button onclick={onGroup}>Group</button>
      )}

      {singleSelection && (singleSelection.type === 'Group') && (
        <button onclick={onUngroup}>Ungroup</button>
      )}

      {singleSelection && (
        <button onclick={handleDuplicate}>Duplicate</button>
      )}

      <div>
        <b>Layout</b>

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
      </div>

      {singleSelection && (
        <div>
          <b>Appearance</b>

          <input
            placeholder="fill"
            name="fill"
            value={style.fill}
            onchange={handleStyle}
          />

          <input
            placeholder="stroke"
            name="stroke"
            value={style.stroke}
            onchange={handleStyle}
          />

          <input
            placeholder="stroke width"
            name="stroke-width"
            value={style['stroke-width']}
            onchange={handleStyle}
          />
        </div>
      )}

      {singleSelection && (singleSelection.type === 'Text') && (
        <div>
          <b>Text</b>
          <input
            placeholder="text"
            name="text"
            value={selectionElements[0].text}
            onchange={handleText}
          />
        </div>
      )}
    </InspectorContainer>
  )
}


export default Inspector
