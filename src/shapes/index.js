import { h } from 'hyperapp'
import * as Rectangle from './rectangle'



export const Shape = ({ type, ...props }) => {
  switch (type) {
    case Rectangle.type:
      return <Rectangle.render {...props} />
    default:
      return null
  }
}

