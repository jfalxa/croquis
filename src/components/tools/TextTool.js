import { h } from 'hyperapp'
import Tool from './Tool'
import Text from '../../shapes/text'
import { project } from '../../utils/geometry'


const TextTool = ({ active, area, stage: { zoom, pan }, onDrag, onCreate }) => {

  function drawText({ area }) {
    onDrag({ area })
  }

  function addText({ area }) {
    if ( area.width <= 1 && area.height <= 1 ) {
      return
    }

    const rect = project(area, zoom, pan)
    const text = Text.create({ ...rect, text: 'Text' })

    onCreate(text)
    onDrag({ area: null })
  }


  const text = area && Text.create({ ...area, text: 'Text' })

  return (
    <Tool
      active={active}
      onMouseDrag={drawText}
      onMouseUp={addText}
    >
      {text && (
        <Text
          {...text}
          font={{ fill: 'blue' }}
          style={{ stroke: 'blue' }}
        />
      )}
    </Tool>
  )
}


export default TextTool
