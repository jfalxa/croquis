import { h } from 'hyperapp'
import styled from '../style'
import * as shapes from '../shapes'


const StageSvg = styled('svg')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%'
})

const Shape = ({ type, children, ...props }) => {
  const ShapeComponent = shapes[type]

  return ShapeComponent && (
    <ShapeComponent {...props}>
      {children && children.map(child => (
        <Shape
          key={child.id}
          {...child}
        />
      ))}
    </ShapeComponent>
  )
}

const Stage = (props, children) => (
  <StageSvg>
    <g>
      {props.elements.map(element => (
        <Shape
          key={element.id}
          {...element}
        />
      ))}
    </g>

    {children}
  </StageSvg>
)


export default Stage
