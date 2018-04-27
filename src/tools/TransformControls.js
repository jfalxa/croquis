import { h } from 'hyperapp'
import { Matrix2D } from 'kld-affine'
import withMouseEvents from '../utils/withMouseEvents'
import { reflection, center } from '../utils/geometry'


const Grip = withMouseEvents(({ position, startDragging }) => (
  <circle
    cx={position.x}
    cy={position.y}
    r="5"
    fill="red"
    onmousedown={startDragging}
  />
))

const Body = withMouseEvents(({ box, startDragging }) => (
  <rect
    {...box}
    fill="rgba(255, 0, 0, 0.2)"
    stroke="red"
    onmousedown={startDragging}
  />
))


const TransformControls = ({ box }) => (state, actions) => {
  let elements = null


  function startTransformation({ e }) {
    e.stopPropagation()
    elements = state.elements.filter(element => state.selection.includes(element.id))
  }

  function translation({ initialPosition, position }) {
    const { x:tx, y:ty } = position.subtract(initialPosition)

    const translation = Matrix2D.translation(tx, ty)

    actions.transformElements({ elements, transformation: translation })
  }

  function scaling(gripPosition, axis) {
    const anchor = reflection(gripPosition, center(box))

    return ({ initialPosition, position }) => {
      const sx = (!axis || axis === 'x') ? (position.x - anchor.x) / (initialPosition.x - anchor.x) : 1
      const sy = (!axis || axis === 'y') ? (position.y - anchor.y) / (initialPosition.y - anchor.y) : 1

      const scaling = Matrix2D.nonUniformScalingAt(sx, sy, anchor)

      actions.transformElements({ elements, transformation: scaling })
    }
  }


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
