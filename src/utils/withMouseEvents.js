import { h } from 'hyperapp'
import { Point2D } from 'kld-affine'
import { bbox } from './geometry'


function getMouseData (e, initialPosition) {
  const position = new Point2D(e.pageX, e.pageY)
  const area = bbox([initialPosition, position])

  return { e, initialPosition, position, area }
}


const withMouseEvents = (Component) => ({ onMouseDown, onMouseDrag, onMouseUp, ...props }, children) => {

  let initialPosition = null

  function handleMouseDown(e) {
    initialPosition = new Point2D(e.pageX, e.pageY)

    document.addEventListener('mousemove', handleMouseDrag)
    document.addEventListener('mouseup', handleMouseUp)

    onMouseDown && onMouseDown(getMouseData(e, initialPosition))
  }

  function handleMouseDrag(e) {
    onMouseDrag && onMouseDrag(getMouseData(e, initialPosition))
  }

  function handleMouseUp(e) {
    document.removeEventListener('mousemove', handleMouseDrag)
    document.removeEventListener('mouseup', handleMouseUp)

    onMouseUp && onMouseUp(getMouseData(e, initialPosition))

    initialPosition = null
  }

  return (
    <Component
      {...props}
      startDragging={handleMouseDown}
      stopDragging={handleMouseUp}
    >
      {children}
    </Component>
  )
}


export default withMouseEvents
