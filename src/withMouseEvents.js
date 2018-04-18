import { h } from 'hyperapp'
import styled from './styled'


const getMouseData = (e, initialPosition) => {
  const position = [e.pageX, e.pageY]

  const delta = initialPosition
    ? [ position[0] - initialPosition[0], position[1] - initialPosition[1] ]
    : null

  return { initialPosition, position, delta, e }
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
    initialPosition = [e.pageX, e.pageY]

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
