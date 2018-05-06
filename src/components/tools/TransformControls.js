import { h } from 'hyperapp'
import { Matrix2D } from 'kld-affine'
import withMouseEvents from '../../utils/withMouseEvents'
import { bbox } from '../../utils/elements'
import { reflection, center, project, unproject } from '../../utils/geometry'


const Grip = withMouseEvents(({ position, startDragging }) => (
  <circle
    cx={position.x}
    cy={position.y}
    r="5"
    fill="red"
    onmousedown={e => (e.button === 0) && startDragging(e)}
  />
))

const Body = withMouseEvents(({ box, startDragging }) => (
  <rect
    {...box}
    fill="rgba(255, 0, 0, 0.2)"
    stroke="red"
    onmousedown={e => (e.button === 0) && startDragging(e)}
  />
))


const TransformControls = ({ elements, stage: { zoom, pan }, onTransform }) => {

  function startTransformation({ e }) {
    !e.shiftKey && e.stopPropagation()
  }

  function translation({ initialPosition, position }) {
    const vector = position.subtract(initialPosition)
    const { x:tx, y:ty } = project(vector, zoom)

    const translation = Matrix2D.translation(tx, ty)

    onTransform({ elements, transformation: translation })
  }

  function scaling(gripPosition, axis) {
    const anchor = reflection(gripPosition, center(box))

    return ({ initialPosition, position }) => {
      const sx = (!axis || axis === 'x') ? (position.x - anchor.x) / (initialPosition.x - anchor.x) : 1
      const sy = (!axis || axis === 'y') ? (position.y - anchor.y) / (initialPosition.y - anchor.y) : 1

      const stageAnchor = project(anchor, zoom, pan)
      const scaling = Matrix2D.nonUniformScalingAt(sx, sy, stageAnchor)

      onTransform({ elements, transformation: scaling })
    }
  }


  const box = unproject(bbox(...elements), zoom, pan)

  const corners = [
    [box.x, box.y], // top left
    [box.x + box.width, box.y], // top right
    [box.x + box.width, box.y + box.height], // bottom right
    [box.x, box.y + box.height] // bottom left
  ]

  const borders = [
    [box.x + box.width/2, box.y], // top
    [box.x + box.width, box.y + box.height/2], // right
    [box.x + box.width/2, box.y + box.height], // bottom
    [box.x, box.y + box.height/2] // left
  ]


  return (
    <g>
      <Body
        box={box}
        onMouseDown={startTransformation}
        onMouseDrag={translation}
      />

      {corners.map(([x, y]) => ({ x, y })).map((position, i) => (
        <Grip
          key={i}
          position={position}
          onMouseDown={startTransformation}
          onMouseDrag={scaling(position)}
        />
      ))}

      {borders.map(([x, y]) => ({ x, y })).map((position, i) => (
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
