import { h } from 'hyperapp'
import { point, bbox } from './geometry'


export function getMouseData(e, initialPosition={ x: 0, y: 0 }) {
  const position = point(e.pageX, e.pageY)
  const delta = position.subtract(initialPosition)
  const area = bbox([initialPosition, position])

  return { e, initialPosition, position, area, delta }
}


const withMouseEvents = (Component) => ({ onMouseDown, onMouseDrag, onMouseUp, ...props }, children) => {

  let initialPosition = null

  function handleMouseDown(e) {
    e.preventDefault()

    initialPosition = point(e.pageX, e.pageY)

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
