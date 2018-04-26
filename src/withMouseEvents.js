import { h } from 'hyperapp'
import { Point2D } from 'kld-affine'
import styled from './styled'
import { bbox } from './utils/geometry'


const getMouseData = (e, initialPosition) => {
  const position = new Point2D(e.pageX, e.pageY)
  const area = bbox({ args: [initialPosition, position] })

  return { e, initialPosition, position, area }
}


const withMouseEvents = (Component) => (props, children) => {

  let initialPosition = null

  const onMouseMove = (e) => {
    props.onMouseMove && props.onMouseMove(getMouseData(e, initialPosition))
  }

  const onMouseDrag = (e) => {
    props.onMouseDrag && props.onMouseDrag(getMouseData(e, initialPosition))
  }

  const onMouseUp = (e) => {
    document.removeEventListener('mousemove', onMouseDrag)
    document.removeEventListener('mouseup', onMouseUp)

    props.onMouseUp && props.onMouseUp(getMouseData(e, initialPosition))
    initialPosition = null
  }

  const onMouseDown = (e) => {
    initialPosition = new Point2D(e.pageX, e.pageY)

    document.addEventListener('mousemove', onMouseDrag)
    document.addEventListener('mouseup', onMouseUp)

    props.onMouseDown && props.onMouseDown(getMouseData(e, initialPosition))
  }

  const initListeners = (target) => {
    target.addEventListener('mousedown', onMouseDown)
    props.onMouseMove && document.addEventListener('mousemove', onMouseMove)
  }

  const stopListening = (target) => {
    target.removeEventListener('mousedown', onMouseDown)
    props.onMouseMove && document.removeEventListener('mousemove', onMouseMove)
  }


  return (
    <Component
      {...props}
      initMouse={initListeners}
      destroyMouse={stopListening}
    >
      {children}
    </Component>
  )
}


export default withMouseEvents
