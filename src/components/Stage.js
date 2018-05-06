import { h } from 'hyperapp'
import styled from '../style'
import * as shapes from '../shapes'
import { bbox } from '../utils/elements'
import { getSelectionElements } from '../utils/helpers'


const StageSvg = styled('svg')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%'
})

const selectionStyle = {
  fill: 'none',
  stroke: 'blue',
  strokeWidth: 2
}

const Selection = ({ type, ...props }) => {
  if (type === 'Group') {
    return <rect {...bbox(props)} {...selectionStyle} />
  }

  const ShapeComponent = shapes[type]

  return ShapeComponent && (
    <ShapeComponent
      {...props}
      style={selectionStyle}
    />
  )
}

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

const Stage = ({ elements, selection }, children) => (
  <StageSvg>
    <g>
      {elements.map(element => (
        <Shape
          key={element.id}
          {...element}
        />
      ))}
    </g>

    <g>
      {getSelectionElements({ tree: elements, selection }).map(element => (
        <Selection
          key={element.id}
          {...element}
        />
      ))}
    </g>

    {children}
  </StageSvg>
)


export default Stage
