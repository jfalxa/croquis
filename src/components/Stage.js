import { h } from 'hyperapp'
import styled from '../style'
import withMouseEvents from '../utils/withMouseEvents'
import * as shapes from '../shapes'
import { bbox } from '../utils/elements'
import { getSelectionElements, updateZoom } from '../utils/helpers'
import { zoomAndPanTransform } from '../utils/svg'
import { point, project } from '../utils/geometry'


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

const StageContainer = withMouseEvents(({ stage, startDragging, onWheel }, children) => (
  <StageSvg
    onmousedown={e => (e.button === 1) && startDragging(e)}
    onwheel={onWheel}
  >
    {children}
  </StageSvg>
))

const Stage = ({ elements, selection, stage, onZoomAndPan }, children) => {

  function handlePan({ delta }) {
    const pan = point(delta.x, delta.y).divide(stage.zoom).add(stage.pan)

    onZoomAndPan({ pan })
  }

  function handleZoomOrPan(e) {
    e.preventDefault()

    if (!e.ctrlKey) {
      return handlePan({ delta: { x: -e.deltaX/2, y: -e.deltaY/2 } })
    }

    const zoom = updateZoom(stage.zoom, -e.deltaY)
    const zoomDelta = point(e.pageX, e.pageY).multiply(1/zoom - 1/stage.zoom)
    const pan = zoomDelta.add(stage.pan)

    onZoomAndPan({ zoom, pan })
  }

  return (
    <StageContainer
      stage={stage}
      onMouseDrag={handlePan}
      onWheel={handleZoomOrPan}
    >
      <text id="text-ruler" opacity={0} />

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
    </StageContainer>
  )
}


export default Stage
