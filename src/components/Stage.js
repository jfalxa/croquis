import { h } from 'hyperapp'
import styled from '../style'
import * as shapes from '../shapes'
import { bbox } from '../utils/elements'
import { getSelectionElements } from '../utils/helpers'
import { zoomAndPanTransform } from '../utils/svg'


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

const ZoomAndPan = ({ zoom, pan }, children) => (
  <g transform={zoomAndPanTransform(zoom, pan)}>
    {children}
  </g>
)

const Stage = ({ elements, selection, stage }, children) => (
  <StageSvg>
    <ZoomAndPan {...stage}>
      {elements.map(element => (
        <Shape
          key={element.id}
          {...element}
        />
      ))}
    </ZoomAndPan>

    <ZoomAndPan {...stage}>
      {getSelectionElements({ tree: elements, selection }).map(element => (
        <Selection
          key={element.id}
          {...element}
        />
      ))}
    </ZoomAndPan>

    {children}
  </StageSvg>
)


export default Stage
