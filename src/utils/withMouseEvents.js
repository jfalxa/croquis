import { h } from 'hyperapp'
import { Point2D } from 'kld-affine'
import { bbox } from './geometry'


function getMouseData (e, initialPosition) {
  const position = new Point2D(e.pageX, e.pageY)
  const area = bbox({ args: [initialPosition, position] })

  return { e, initialPosition, position, area }
}


const withMouseEvents = (Component) => (props, children) => {

  let initialPosition = null

  function onMouseDown(e) {
    initialPosition = new Point2D(e.pageX, e.pageY)

    document.addEventListener('mousemove', onMouseDrag)
    document.addEventListener('mouseup', onMouseUp)

    props.onMouseDown && props.onMouseDown(getMouseData(e, initialPosition))
  }

  function onMouseDrag(e) {
    props.onMouseDrag && props.onMouseDrag(getMouseData(e, initialPosition))
  }

  function onMouseUp(e) {
    document.removeEventListener('mousemove', onMouseDrag)
    document.removeEventListener('mouseup', onMouseUp)

    props.onMouseUp && props.onMouseUp(getMouseData(e, initialPosition))

    initialPosition = null
  }

  return (
    <Component
      {...props}
      startDragging={onMouseDown}
      stopDragging={onMouseUp}
    >
      {children}
    </Component>
  )
}


export default withMouseEvents
