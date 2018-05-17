import { h } from 'hyperapp'
import { Matrix2D } from 'kld-affine'
import Rectangle from '../../shapes/rectangle'
import Snapping from './Snapping'
import withMouseEvents from '../../utils/withMouseEvents'
import { bbox } from '../../utils/elements'
import { getSelectionElements, getScaleFactor } from '../../utils/helpers'
import { reflection, center, project, unproject } from '../../utils/geometry'
import { findCommonSiblings } from '../../utils/tree'
import { getSnapVector } from '../../utils/snapping'


function getCorners(box) {
  return [
    [box.x, box.y], // top left
    [box.x + box.width, box.y], // top right
    [box.x + box.width, box.y + box.height], // bottom right
    [box.x, box.y + box.height] // bottom left
  ].map(([x, y]) => ({ x, y }))
}

function getBorders(box) {
  return [
    [box.x + box.width/2, box.y], // top
    [box.x + box.width, box.y + box.height/2], // right
    [box.x + box.width/2, box.y + box.height], // bottom
    [box.x, box.y + box.height/2] // left
  ].map(([x, y]) => ({ x, y }))
}


function onDrag(startDragging) {
  return e => {
    if (e.button !== 0) {
      return
    }

    startDragging(e)
  }
}


const Grip = withMouseEvents(({ position, startDragging }) => (
  <circle
    draggable={false}
    cx={position.x}
    cy={position.y}
    r="5"
    fill="red"
    onmousedown={onDrag(startDragging)}
  />
))

const Body = withMouseEvents(({ box, startDragging }) => (
  <rect
    {...box}
    draggable={false}
    fill="rgba(255, 0, 0, 0.2)"
    stroke="red"
    onmousedown={onDrag(startDragging)}
  />
))


const TransformControls = ({ elements, selection, stage, onTransform }) => {

  const { zoom, pan } = stage

  const selectionElements = getSelectionElements({ tree: elements, selection })

  const box = bbox(...selectionElements)
  const screenBox = unproject(box, zoom, pan)
  const rect = Rectangle.create(box)
  const siblings = findCommonSiblings(elements, selectionElements)
    .filter(sibling => !selection.includes(sibling.id))


  function startTransformation({ e }) {
    !e.shiftKey && e.stopPropagation()
  }

  function translation({ initialPosition, position }) {
    const vector = position.subtract(initialPosition)
    const { x:tx, y:ty } = project(vector, zoom)
    const translation = Matrix2D.translation(tx, ty)

    const scaledRect = Rectangle.transform(rect, translation)
    const snapVector = getSnapVector(siblings, scaledRect, 10, true)
    const screenSnapVector = unproject(snapVector, zoom)

    const snappedVector = position.subtract(initialPosition).add(screenSnapVector)
    const { x:stx, y:sty } = project(snappedVector, zoom)
    const snappedTranslation = Matrix2D.translation(stx, sty)

    onTransform({ elements: selectionElements, transformation: snappedTranslation })
  }

  function scaling(gripPosition, axis) {
    const anchor = reflection(gripPosition, center(screenBox))
    const stageAnchor = project(anchor, zoom, pan)

    return ({ initialPosition, position }) => {
      const stageInitialPosition = project(initialPosition, zoom, pan)
      const stagePosition = project(position, zoom, pan)

      const { x:sx, y:sy } = getScaleFactor(stageAnchor, stageInitialPosition, stagePosition, axis)
      const scaling = Matrix2D.nonUniformScalingAt(sx, sy, stageAnchor)

      const scaledRect = Rectangle.transform(rect, scaling)
      const snapVector = getSnapVector(siblings, scaledRect, 10)

      const { x:ssx, y:ssy } = getScaleFactor(stageAnchor, stageInitialPosition, stagePosition.add(snapVector), axis)
      const snappedScaling = Matrix2D.nonUniformScalingAt(ssx, ssy, stageAnchor)

      onTransform({ elements: selectionElements, transformation: snappedScaling })
    }
  }


  return (
    <g>
      <Snapping
        elements={elements}
        selection={selection}
        stage={stage}
      />

      <Body
        box={screenBox}
        onMouseDown={startTransformation}
        onMouseDrag={translation}
      />

      {getCorners(screenBox).map((position, i) => (
        <Grip
          key={i}
          position={position}
          onMouseDown={startTransformation}
          onMouseDrag={scaling(position)}
        />
      ))}

      {getBorders(screenBox).map((position, i) => (
        <Grip
          key={i}
          position={position}
          onMouseDown={startTransformation}
          onMouseDrag={scaling(position, i%2===1 ? 'x' : 'y')}
        />
      ))}

    </g>
  )
}

export default TransformControls
