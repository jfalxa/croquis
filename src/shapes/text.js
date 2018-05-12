import { h } from 'hyperapp'
import { Shapes } from 'kld-intersections'
import { transformPoints, updateShape } from '../utils/helpers'
import { bbox } from '../utils/geometry'
import { getTextLines } from '../utils/text'


const Text = ({ text, shape, style, font }) => {
  const box = bbox(shape.args)

  return (
    <g>
      <rect
        {...box}
        fill="none"
        stroke="none"
        {...style}
      />

      <text
        x={box.x}
        y={box.y}
        {...font}
      >
        {getTextLines(text, font, box).map((line, i) => (
          <tspan
            key={i}
            x={box.x}
            dy={20}
          >
            {line}
          </tspan>
        ))}
      </text>
    </g>
  )
}

Text.type = 'Text'

Text.create = ({ text, x, y, width, height, ...props }) => ({
  ...props,
  type: Text.type,
  text: text,
  shape: Shapes.rectangle(x, y, width, height)
})

Text.transform = (element, transformation) => {
  const [a, b] = transformPoints(element.shape.args, transformation)

  const min = a.min(b)
  const max = a.max(b)

  return updateShape(element, [min, max])
}


export default Text
