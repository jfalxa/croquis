import { h } from 'hyperapp'
import { bbox } from '../utils/geometry'
import { create } from '../utils/elements'
import { transformPoints, updateShape } from '../utils/helpers'


const Base = () => null

Base.type = 'Base'

Base.create = () => create({ type: Base.type })

Base.transform = (element, transformation) => {
  const points = transformPoints(element.shape.args, transformation)
  return updateShape(element, points)
}

Base.bbox = (element) => bbox(element.shape.args)


export default Base
