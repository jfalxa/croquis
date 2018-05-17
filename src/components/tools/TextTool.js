import { h } from 'hyperapp'
import Tool from './Tool'
import Text from '../../shapes/text'
import Rectangle from '../../shapes/rectangle'
import { project } from '../../utils/geometry'


const TextTool = ({ active, area, stage: { zoom, pan }, onDrag, onCreate }) => {

  function drawText({ area }) {
    onDrag({ area })
  }

  function addText({ area }) {
    if ( area.width <= 1 && area.height <= 1 ) {
      return
    }

    const inputText = prompt('Enter text:')

    if (inputText) {
      const rect = project(area, zoom, pan)
      const text = Text.create({ ...rect, text: inputText })

      onCreate(text)
    }

    onDrag({ area: null })
  }


  const text = area && Text.create({ ...area, text: '' })

  return (
    <Tool
      active={active}
      onMouseDrag={drawText}
      onMouseUp={addText}
    >
      {text && <Rectangle {...text} style={{ fill: 'none', stroke: 'blue' }} />}
    </Tool>
  )
}


export default TextTool
